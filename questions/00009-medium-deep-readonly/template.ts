// Record<string, unknown> 和 Record<string, any> 区别
// type DeepReadonly<T> = {
//   readonly [K in keyof T]: T[K] extends Record<string, unknown> | Array<unknown> ? DeepReadonly<T[K]> : T[K]
// }

// type DeepReadonly<T> = T extends Function ? T : {
//   readonly [K in keyof T]: DeepReadonly<T[K]>
// }

// type DeepReadonly<T> = {
//   readonly [k in keyof T]: T[k] extends Function ? T[k] : DeepReadonly<T[k]>
// }

type DeepReadonly<T> = {
  readonly [k in keyof T]: keyof T[k] extends never ? T[k] : DeepReadonly<T[k]>
}
