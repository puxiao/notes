//防抖：若干时间内只触发一次回调函数，若在等待过程中再次执行则重新计时
//防抖的重点在于清零

function debounce(fun,wait){
  let timer 
  return (...args) => {
    clearTimeout(time)
    timer = setTimeout(() => {
      fun(...args)
    }, wait)
  }
}
