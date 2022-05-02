//这里使用到的是 TypeScript 类型守卫中的：自定义类型保护的类型谓词（type predicate）
export const isNullOrUndefined = <T>(value: T | null | undefined): value is null | undefined => {
    return value === undefined || value === null;
};
