type AppendArgument<Fn, A> = Fn extends (...args: infer P) => infer R ? (...args: [...P, A]) => R : never

// type AppendArgument<Fn extends (...args: any[]) => unknown, A> = (...args: [...Parameters<Fn>, A]) => ReturnType<Fn>
