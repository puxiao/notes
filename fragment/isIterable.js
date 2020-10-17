//检查对象是否是可迭代对象

const str = 'abc'
const arr = [0, 1, 2]
const values = arr.values()

const num = 2
const obj = {}

const isIterable = (target) => {
    return target != null && typeof target[Symbol.iterator] === 'function'
}
//请注意上面代码中使用了 target !=null 而不是 target !== null
// target != null 实际上相当于：target != null && target != undefined

console.log(isIterable(str)) //true
console.log(isIterable(arr)) //true
console.log(isIterable(values)) //true

console.log(isIterable(num)) //false
console.log(isIterable(obj)) //false
