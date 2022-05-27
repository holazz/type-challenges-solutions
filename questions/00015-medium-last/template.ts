type Last<T extends any[]> = T extends [...infer P, infer R] ? R : never
