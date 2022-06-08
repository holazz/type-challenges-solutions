type MyCapitalize<S extends string> = S extends `${infer P}${infer R}` ? Capitalize<`${P}${R}`> : S
