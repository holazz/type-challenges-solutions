// type First<T extends unknown[]> = T[number] extends never ? never: T[0]

type First<T extends unknown[]> = T extends [] ? never: T[0]
