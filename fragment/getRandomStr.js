const letters = '0123456789abcdefghijklmnopqrstuvwxyz'.split('')
const maxIndex = letters.length - 1

const getRandomStr = (strLength = 5) => {
    let res = ''
    for (let i = 0; i < strLength; i++) {
        res += letters[Math.round((Math.random() * 100 * maxIndex) / 100)]
    }
    return res
}

export default getRandomStr
