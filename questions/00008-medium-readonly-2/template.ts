// type MyReadonly2<T, K extends keyof T> = Readonly<Pick<T, K>> & Omit<T, K>

// 泛型参数默认值
type MyReadonly2<T, K extends keyof T = keyof T> = Readonly<Pick<T, K>> & Omit<T, K>
