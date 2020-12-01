import { useEffect } from 'react'

// 防抖 相关
type Fun = (...args: any) => any

const debounce = (fun: Fun, wait: number) => {
    let timer: number
    return (...args: any[]) => {
        clearTimeout(timer)
        timer = window.setTimeout(() => {
            fun(...args)
        }, wait)
    }
}

// 自定义 hook ：useWindowResizeHandle  窗口 resize 事件处理函数
const useWindowResizeHandle = (callback: Fun, wait: number = 250) => {

    callback = wait !== 0 ? debounce(callback, wait) : callback

    useEffect(() => {
        window.addEventListener('resize', callback)
        return () => {
            window.removeEventListener('resize', callback)
        }
    }, [callback])
}

export default useWindowResizeHandle
