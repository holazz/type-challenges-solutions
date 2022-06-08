// type WhiteSpace = ' ' | '\n' | '\t'

type Trim<S extends string> = S extends `${WhiteSpace}${infer R}` | `${infer R}${WhiteSpace}`
  ? Trim<R>
  : S
