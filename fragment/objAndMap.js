const objToMap = (obj) => {
    let map = new Map();
    for (const [key, value] of Object.entries(obj)) {
        map.set(key, value);
    }
    return map
}

const mapToObj = (map) => {
    let obj = {}
    //注意：这里只是假定 key 一定为简单对象(数字或字符串)，假设 key 为复杂类型(例如是对象或函数) 则下面的代码会有问题
    map.forEach((key, value) => {
        obj[key] = value
    })
    return obj
}

export default {
    objToMap,
    mapToObj
}
