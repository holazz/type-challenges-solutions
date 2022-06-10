type Flatten<T extends unknown[]> = T extends [infer P, ...infer R]
  ? P extends unknown[] ? Flatten<[...P, ...R]> : [P, ...Flatten<R>]
  : []
