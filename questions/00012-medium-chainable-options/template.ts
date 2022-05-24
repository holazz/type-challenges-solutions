type Chainable<T = {}> = {
  option<K extends PropertyKey, V>(key: K extends keyof T ? never : K, value: V): Chainable<T & Record<K, V>>
  get(): T
}
