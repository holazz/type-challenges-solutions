type TupleToObject<T extends readonly PropertyKey[]> = {
  [K in T[number]]: K
}
