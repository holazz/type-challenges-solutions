// type MyPick<T, K> = [K] extends [keyof T] ? {
//   [P in K]: T[P]
// } : never

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
