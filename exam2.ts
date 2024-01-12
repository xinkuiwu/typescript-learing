// 函数重载
declare function func(name: string): string;
declare function func(name: number): number;

func('a');
func(1);


interface Func {
  (name: string): string;
  (name: number): number;
}

declare const func2: Func;

func2('a');
func2(1);


type Func2 =((name: string) => string) & ((name: number) => number);

declare const func3: Func2;

func3('a');
func3(1);

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any) {
  return a + b;
}

const res1 = add(1, 2);

const res2 = add('a', 'b');

// UnionToTuple

type UnionToIntersection<U> =
  (U extends U ? (x: U) => unknown : never) extends (x: infer R) => unknown
    ? R
    : never

type UnionToTuple<T> =
  UnionToIntersection<
    T extends any ? () => T : never
  > extends () => infer ReturnType
    ? [...UnionToTuple<Exclude<T, ReturnType>>, ReturnType]
    : [];


type UnionToTupleRes = UnionToTuple<'a' | 'b' | 'c'>;

// join

declare function join<
  Delimiter extends string
>(delimiter: Delimiter):
  <Items extends string[]>
  (...parts: Items) => JoinType<Items, Delimiter>;

type RemoveFirstDelimiter<Str extends string> = Str extends `${infer _}${infer Rest}` ? Rest: Str;

type JoinType<
  Items extends any[],
  Delimiter extends string,
  Result extends string = ''
> = Items extends [infer Cur, ...infer Rest]
  ? JoinType<Rest, Delimiter, `${Result}${Delimiter}${Cur & string}`>
  : RemoveFirstDelimiter<Result>;


let res = join('-')('guang', 'and', 'dong');

// DeepCamelcase

type CamelizeArr<Arr> = Arr extends [infer First, ...infer Rest]
  ? [DeepCamelize<First>, ...CamelizeArr<Rest>]
  : []

type DeepCamelize<Obj extends Record<string, any>> =
  Obj extends unknown[]
    ? CamelizeArr<Obj>
    : {
      [Key in keyof Obj
        as Key extends `${infer First}_${infer Rest}`
        ? `${First}${Capitalize<Rest>}`
        : Key
      ] : DeepCamelize<Obj[Key]>
    };

// AllKeyPath
type obj = {
  aaa_bbb: string;
  bbb_ccc: [
    {
      ccc_ddd: string;
    },
    {
      ddd_eee: string;
      eee_fff: {
        fff_ggg: string;
      }
    }
  ]
}

type DeepCamelizeRes = DeepCamelize<obj>;

type Obj = {
  a: {
    b: {
      b1: string
      b2: string
    }
    c: {
      c1: string;
      c2: string;
    }
  },
}

type AllKeyPath<Obj extends Record<string, any>> = {
  [Key in keyof Obj]:
  Key extends string
    ? Obj[Key] extends Record<string, any>
      ? Key | `${Key}.${AllKeyPath<Obj[Key]>}`
      : Key
    : never
}[keyof Obj];


type AllKeyPathRes = AllKeyPath<obj>;


// Defaultize

type Defaultize<A, B> =
  & Pick<A, Exclude<keyof A, keyof B>>
  & Partial<Pick<A, Extract<keyof A, keyof B>>>
  & Partial<Pick<B, Exclude<keyof B, keyof A>>>

type Copy<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key]
}

type A = {
  aaa: 111,
  bbb: 222
};

type B = {
  bbb: 222,
  ccc: 333
}

type DefaultizeRes = Copy<Defaultize<A, B>>;

