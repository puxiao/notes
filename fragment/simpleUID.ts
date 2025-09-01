const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const pureNumberRegex = /^\d+$/

const simpleUID = (length: number = 12) => {
    let uid = ""
    for (let i = 0; i < length; i++) {
        uid += keyStr.charAt(Math.floor(Math.random() * keyStr.length))
    }

    if (pureNumberRegex.test(uid)) {
        return simpleUID(length)
    }

    return uid
}

export default simpleUID
