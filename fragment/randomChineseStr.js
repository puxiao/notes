function toChineseStr(unicodeStr) {
    if (unicodeStr == '') {
        return 'Please input hexadecimal Unicode';
    }
    unicodeStr = unicodeStr.split('\\u');
    let chineseStr = '';
    for (let i = 0, iLength = unicodeStr.length; i < iLength; i++) {
        chineseStr += String.fromCharCode(parseInt(unicodeStr[i], 16));
    }
    return chineseStr;
}

const unicodeStr = Math.round((Math.random() * 20901) + 19968).toString(16) //随机产生一个汉字范围内对应的 unicode 字符串
const chineseStr = toChineseStr(unicodeStr) // 将 unicode 转化为 汉字

console.log(chineseStr) 
