//特别说明：Number 默认的 toFixed() 函数在某些情况下存在四舍五入的情况
//例如：22.123456789.toFixed(8)，其结果为 '22.1234579' 而不是预期中的 '22.12345678'
//所以谨慎使用默认的 toFixed()，而是采用下面这种方式

const toFixed = (num: number, precision = 8) => {
    return Math.trunc(num * Math.pow(10, precision)) / Math.pow(10, precision);
}

export default toFixed
