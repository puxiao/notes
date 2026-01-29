const setVH = () =>{
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export default setVH


// vue3中使用示例
// const resizeObserverRef = ref<ResizeObserver | null>(null)
// const handleResize = () => {
//     setVH()
// }
// onMounted(() => {
//     resizeObserverRef.value = new ResizeObserver(handleResize)
//     resizeObserverRef.value.observe(document.body)
//     handleResize()
// })
// onUnmounted(() => {
//     if (resizeObserverRef.value) {
//         resizeObserverRef.value.disconnect()
//     }
// })


// CSS 中对应修改
// {
//     - height: 100vh;
//     + height: calc(var(--vh, 1vh) * 100);
// }
