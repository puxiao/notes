/** 
 * Dom元素快捷键管理
 * 功能：给Dom元素添加键盘事件，管理相应快捷键
 * 代码修改自：https://gist.github.com/abuduba/c41d40a1b45990c086de6d3b24bdd85a#file-hotkeys-js
 * 备注：该代码无任何第三方依赖
 * 
 * 使用示例：
 * const shortcut = createShortcut()
 * shortcut.register( 'atl+t', ()=>{ console.log('alt+t') } )
 * 
 * 特别说明：
 * 当前代码中并没有添加键盘适配(Windows键盘或Mac键盘)
 * (未将 ctrl键 自动转换成 meta键)
 * 
*/

//深度克隆
const deepClone = (target) => {
    let result = undefined
    if (target === null || !(typeof target === 'object')) {
        result = target
    } else {
        result = Array.isArray(target) ? [] : {}
        for (let key in target) {
            result[key] = deepClone(target[key])
        }
    }
    return result
}

//防抖函数
const debounce = (fn, time) => {
    let timeoutId = null
    return () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(fn, time)
    }
}

//对比两个对象的值是否相同
const isEqual = (a, b) => {
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false

    //此处没有使用 b.hasOwnProperty(key) 是因为担心万一 b 本身修改(覆盖)了自己身的 hasOwnProperty() 方法
    return aKeys.every((key) => Object.prototype.hasOwnProperty.call(b, key) && a[key] === b[key])
}

//对比两个数组的值是否相同
const isArrayEqual = (a, b) => {
    return a.length === b.length && a.every((v, i) => isEqual(v, b[i]))
}

//查找并匹配快捷键
const matchHotkey = (buffer, hotkey) => {
    if (buffer.length < hotkey.length) {
        return false;
    }

    const indexDiff = buffer.length - hotkey.length;
    for (let i = hotkey.length - 1; i >= 0; i--) {
        if (!isEqual(buffer[indexDiff + i], hotkey[i])) {
            return false
        }
    }

    return true
}

//将元素为字符串的数组转化为对象，数组中字符串为对象的key,其值为true
const arrayToObject = (arr) => arr.reduce(
    (obj, key) => ({ ...obj, [key]: true }),
    {},
);

//辅助按键名
const allModifiers = ['ctrl', 'shift', 'alt', 'meta']

//对象形式的辅助按键名集合
const indexedModifiers = arrayToObject(allModifiers)

//是否能够匹配到热键组合中的某一个键
const isHotkeyValid = (hotkey) => Object.keys(hotkey).filter((key) => !indexedModifiers[key]).length === 1

//校验对象是否为真
const validate = (value, message) => {
    if (!value) {
        throw new Error(message)
    }
}

//校验对象的类型是否为指定类型，若不是则抛出错误信息
const validateType = (value, name, type) => {
    validate(typeof value === type, `The ${name} must be a ${type}; given ${typeof value}`)
}

//标准化快键键
const normalizeHotkey = (hotkey) => {
    let resArr = hotkey.split(/ +/g)
    resArr = Array.from(new Set(resArr)) //去重
    return resArr.map(
        (part) => {

            let arr = []
            let result = null

            if (part === '') {
                //针对空格键的特殊处理
                arr = ['space']
                result = { space: true }
            } else {
                arr = part.split('+').filter(Boolean)
                result = arrayToObject(arr)
            }

            validate(Object.keys(result).length >= arr.length, `Hotkey combination has duplicates "${hotkey}"`)
            validate(isHotkeyValid(result), `Invalid hotkey combination: "${hotkey}"`)

            return result
        }
    )
}

//校验参数正确性
const validateListenerArgs = (hotkey, callback) => {
    validateType(hotkey, 'hotkey', 'string')
    validateType(callback, 'callback', 'function')
}

//创建一个参数会被校验过的侦听函数
const createListenersFn = (listeners, fn) => (hotkey, callback) => {
    validateListenerArgs(hotkey, callback)
    fn(listeners, hotkey, callback)
}

//添加一个键盘快捷键组合以及对应的回调函数
const registerListener = (listeners, hotkey, callback) => {
    listeners.push({ hotkey: normalizeHotkey(hotkey), callback })
}

//取消一个键盘快捷键组合以及对应的回调函数
const unregisterListener = (listeners, hotkey, callback) => {
    const normalized = normalizeHotkey(hotkey)
    const index = listeners.findIndex((item) => item.callback === callback && isArrayEqual(normalized, item.hotkey))
    if (index !== -1) {
        listeners.splice(index, 1)
    }
}

//转化并返回key
const getKey = (key) => {
    switch (key) {
        case '+':
            return 'plus'
        case ' ':
            return 'space'
        default:
            return key.toLowerCase()
    }
}

//创建并返回一个键盘摁下后的处理函数
const createKeydownListener = (listeners, debounceTime) => {
    let buffer = []
    const clearBufferDebounced = debounce(() => {
        buffer = []
    }, debounceTime)
    return (eve) => {
        if (eve.repeat) return
        if (eve.getModifierState(eve.key)) return
        clearBufferDebounced()
        const description = {
            [getKey(eve.key)]: true
        }
        allModifiers.forEach((m) => {
            if (eve[`${m}Key`]) {
                description[m] = true;
            }
        })

        buffer.push(description)

        listeners.forEach((listener) => {
            if (matchHotkey(buffer, listener.hotkey)) {
                listener.callback(eve)
            }
        })
    }
}

//校验函数的各项参数是否符合规范
const validateContext = (options) => {
    const { dom = document, debounceTime = 500, autoEnable = true } = options || {}

    if (dom instanceof Node === false) {
        throw new Error(`The dom must be a Node; given ${typeof dom}`)
    }

    validateType(debounceTime, 'debounceTime', 'number')
    validate(debounceTime > 0, 'debounceTime must be > 0')
    validateType(autoEnable, 'autoEnable', 'boolean')

    return { dom, debounceTime, autoEnable }
}

//以函数形式给一个DOM元素添加管理键盘事件、处理函数，最终将这些方法打包返回出去
const createShortcut = (options) => {

    const { dom, debounceTime, autoEnable } = validateContext(options)

    const listeners = []

    const keydownListener = createKeydownListener(listeners, debounceTime)

    const enable = () => dom.addEventListener('keydown', keydownListener)

    const disable = () => dom.removeEventListener('keydown', keydownListener)

    const register = createListenersFn(listeners, registerListener)

    const unregister = createListenersFn(listeners, unregisterListener)

    const getListeners = () => {
        return deepClone(listeners)
    }

    if (autoEnable) {
        enable()
    }

    return {
        register,
        unregister,
        enable,
        disable,
        getListeners
    }
}

export default createShortcut
