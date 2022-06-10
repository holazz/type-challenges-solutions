type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer P}` ? P : `${T}`
