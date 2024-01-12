// 需要对已有类型做修改，需要动态生成类型的场景，必然会用到类型编程
// ParseQueryString

type ParseParam<Param extends string> =
  Param extends `${infer Key}=${infer Value}`
    ? {
      [K in Key]: Value
    } : Record<string, any>;

type MergeValues<One, Other> =
  One extends Other
    ? One
    : Other extends unknown[]
      ? [One, ...Other]
      : [One, Other];

type MergeParams<
  OneParam extends Record<string, any>,
  OtherParam extends Record<string, any>
> = {
  readonly [Key in keyof OneParam | keyof OtherParam]:
  Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? MergeValues<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
      ? OtherParam[Key]
      : never
}

type ParseQueryString<Str extends string> =
  Str extends `${infer Param}&${infer Rest}`
    ? MergeParams<ParseParam<Param>, ParseQueryString<Rest>>
    : ParseParam<Str>;

function parseQueryString<Str extends string>(queryStr: Str): ParseQueryString<Str> ;
function parseQueryString(queryStr: string) {
  if (!queryStr || !queryStr.length) {
    return {};
  }
  const queryObj:Record<string, any> = {};
  const items = queryStr.split('&');
  items.forEach(item => {
    const [key, value] = item.split('=');
    if (queryObj[key]) {
      if(Array.isArray(queryObj[key])) {
        queryObj[key].push(value);
      } else {
        queryObj[key] = [queryObj[key], value]
      }
    } else {
      queryObj[key] = value;
    }
  });
  return queryObj;
}


const test2 = parseQueryString('a=1&b=2&c=3');




// PromiseConstructor

interface PromiseConstructor {
  all<T extends readonly unknown[] | []>
  (values: T): Promise<{
    -readonly [P in keyof T]: Awaited<T[P]>
  }>;

  race<T extends readonly unknown[] | []>
  (values: T): Promise<Awaited<T[number]>>;
}

declare const promise: PromiseConstructor;

const allRes = promise.all([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);

const raceRes = promise.race([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]);

type test = [Promise<1>,Promise<2>,Promise<3>][number];


declare function ttt<T extends readonly unknown[]>(values: T): T;

const res = ttt([1, 2, 3]);

declare function ttt2<T extends readonly unknown[] | []>(values: T): T;

const res2 = ttt2([1, 2, 3]);

const obj = {
  a: 1
}

type objType = typeof obj;

const obj2 = {
  a: 1
} as const


type objType2 = typeof obj2;

const arr = [1,2,3]

type arrType = typeof arr;

const arr2 = [1,2,3] as const;

type arrType2 = typeof arr2;

// Currying

type CurriedFunc<Params, Return> =
  Params extends [infer Arg, ...infer Rest]
    ? (arg: Arg) => CurriedFunc<Rest, Return>
    : never;

declare function currying<Func>(fn: Func):
  Func extends (...args: infer Params) => infer Result ? CurriedFunc<Params, Result> : never;

const func = (a: string, b: number, c: boolean) => {};

const curriedFunc = currying(func);