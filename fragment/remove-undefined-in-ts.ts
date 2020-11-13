/* 在 TS 中清除 object 属性值为 undefined 的属性。

在 JS 中 可以直接使用 obj[key]，但是在 TS 中直接使用 obj[key] 会报错：

元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{}"。
在类型 "{}" 上找不到具有类型为 "string" 的参数的索引签名。ts(7053)


只能使用 obj[key as keyof typeof obj] */

const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key as keyof typeof obj] === undefined) {
            delete obj[key as keyof typeof obj]
        }
    }
    return obj
}
