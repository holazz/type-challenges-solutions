type Pop<T extends any[]> = T extends [...infer P, infer R] ? P : never
