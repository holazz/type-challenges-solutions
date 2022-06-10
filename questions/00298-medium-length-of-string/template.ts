type LengthOfString<S extends string, U extends string[] = []> = S extends `${infer P}${infer R}`
  ? LengthOfString<R, [...U, P]>
  : U['length']
