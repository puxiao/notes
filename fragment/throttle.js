//节流：若干时间内，无论函数被触发多少次，仅仅执行一次。
//节流重点在加锁

function throttle(fun,wait){
  let timer
  return (...args) => {
    if(timer){
      return
    }
    timer = setTimerout(() => {
      fun(...args)
      timer = null
    }, wait)
  }
}
