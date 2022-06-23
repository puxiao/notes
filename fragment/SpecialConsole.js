//注意此输出样式仅在浏览器调试中有效，在 node.js 的调试窗口中不会生效(也不报错)

const SpecialConsole = {
    defaultStyle: 'color: green; font-size: 20px;',
    log: (value, style = SpecialConsole.defaultStyle) => {
        console.log(`%c${value}`, style);
    }
}

//SpecialConsole.log('hello')

export default SpecialConsole
