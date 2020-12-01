//防抖：若干时间内只触发一次回调函数，若在等待过程中再次执行则重新计时
//防抖的重点在于清零

function debounce(fun,wait){
  let timer 
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fun(...args)
    }, wait)
  }
}


//以下为 TypeScript 中的写法
export type Fun = (...args: any) => any
const debounce = (fun: Fun, wait: number) => {
    let timer: number
    return (...args: any[]) => {
        clearTimeout(timer)
        timer = window.setTimeout(() => {
            fun(...args)
        }, wait)
    }
}
export default debounce
