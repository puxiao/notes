//匹配不被括号(英文或中文)包裹的汉字

let str1 = 'ast哈哈哈dfasd高质量前端群faas'
let str2 = 'dfsd（哈哈哈)fasdf'

const findStr = (str) => {
    let reg = new RegExp(/[(（][\u4e00-\u9fa5]+[)）]/, 'g') //匹配前后包含括号字符
    let reg2 = new RegExp(/[\u4e00-\u9fa5]+/, 'g') //匹配汉字

    if (reg.test(str) === false) {
        return str.matchAll(reg2)
    } else {
        return null
    }
}

console.log([...findStr(str1)])
console.log([...findStr(str1)].map(item => item[0]))
console.log(findStr(str2))
