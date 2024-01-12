// 联合分散可简化
// 联合类型中的每个类型都是相互独立的，TypeScript 对它做了特殊处理，也就是遇到字符串类型、条件类型的时候会把每个类型单独传入做计算，最后把每个类型的计算结果合并成联合类型。

// Camelcase
type Camelcase<Str extends string> =
  Str extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
    : Str;

type CamelcaseResult = Camelcase<'aa_aa_aa'>;

type CamelcaseArr<
  Arr extends unknown[]
> = Arr extends [infer Item, ...infer RestArr]
  ? [Camelcase<Item & string>, ...CamelcaseArr<RestArr>]
  : [];

type CamelcaseArrResult = CamelcaseArr<['aa_aa_aa', 'bb_bb_bb', 'cc_cc_cc']>;

type CamelcaseUnion<Item extends string> =
  Item extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${CamelcaseUnion<Rest>}`
    : Item;

type CamelcaseUnionResult = CamelcaseUnion<'aa_aa_aa' | 'bb_bb_bb' | 'cc_cc_cc'>;

// IsUnion

type IsUnion<A, B = A> =
  A extends A
    ? [B] extends [A]
      ? false
      : true
    : never

type IsUnionResult = IsUnion<'a'|'b'|'c'|'d'>;

type IsUnionResult2 = IsUnion<[ 'a' | 'b' | 'c']>;

// TestUnion
type TestUnion<A, B = A> = A  extends A ? { a: A, b: B} : never;

type TestUnionResult = TestUnion<'a' | 'b' | 'c'>;

// BEM
type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`;


type bemResult = BEM<'guang', ['aaa', 'bbb'], ['warning', 'success']>;

// AllCombinations
type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`;

type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never;

type AllCombinationsResult = AllCombinations<'A' | 'B' | 'C'>;