//节流：若干时间内，无论函数被触发多少次，仅仅执行一次。
//节流重点在加锁

function throttle(fun,wait){
  let timer
  return (...args) => {
    if(timer){
      return
    }
    timer = setTimeout(() => {
      fun(...args)
      timer = null
    }, wait)
  }
}



//用法示例
```
function myFun(str) {
    console.log(str + 123)
}

const youFun = throttle(myFun)

youFun('aa') // aa123
youFun('bb') // ---

```



//以下为 TypeScript 中的写法
export type Fun = (...args: any) => any
const throttle = (fun: Fun, wait: number) => {
  let timer: number | null
  return (...args: any[]) => {
    if (timer) {
      return
    }
    timer = window.setTimeout(() => {
      fun(...args)
      timer = null
    }, wait)
  }
}
export default throttle
