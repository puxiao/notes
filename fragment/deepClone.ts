//注意：deepClone 并不能完全正确克隆各种类型，下面代码只是增加了对 Map 类型的处理(且仅为一层拷贝)
export const deepClone = (obj: any) => {
    if (obj === null) return null;
    if (obj instanceof Map) {
        return new Map(obj)
    } else {
        let clone = { ...obj };
        Object.keys(clone).forEach(
            (key) =>
            (clone[key] =
                typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key])
        );
        return Array.isArray(obj) && obj.length
            ? (clone.length = obj.length) && Array.from(clone)
            : Array.isArray(obj)
                ? Array.from(obj)
                : clone;
    }
}

export default deepClone
