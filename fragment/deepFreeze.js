//'use strict'

//默认 Object.freeze() 只能冻结第1层属性
//通过以下递归函数，可实现深层冻结

function deepFreeze(obj){

    for( let key in obj){
        if(obj[key] !==null && typeof obj[key] === 'object'){
            deepFreeze(obj[key])
        }
    }

    return Object.freeze(obj)
}

const me = deepFreeze({age:18,do:{react:'React'}})
me.do.react = 'Taro' //在严格模式下，会报 TypeError 错误
console.log(me) //React
