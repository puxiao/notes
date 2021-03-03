//若时间格式为 “00:10”，求该时间处于当天的哪个时辰

const arr = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const getTimeName = (str: string) => {
    let [h, m] = str.split(':').map(n => Number(n))
    let index = 0
    if (h != 23) {
        index = Math.floor(h / 2)
        if (h % 2 === 1 && m > 0) {
            index++
        }
    }
    return arr[index]
}

console.log(TimeName('00:10')) //子


//补充说明：上面代码中 xxx.map(n => Number(n)) 可以简写为 xxx.map(Number)
