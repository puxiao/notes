
```
const deepClone = (target) => {
    let result = undefined

    if (target === null || !(typeof target === 'object')) {
        result = target
    } else {
        result = Array.isArray(target) ? [] : {}
        for (let key in target) {
            result[key] = deepClone(target[key])
        }
    }

    return result
}
```
