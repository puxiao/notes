 //遍历出 目标长度为N，特殊值为 [xx, xx, ...] 的 多维数组

const numArr = [-2, 2] //定义特殊位置上出现的数字
const arrLength = 3 //定义目标数组长度
const total = arrLength * numArr.length //根据目标数组长度以及特殊数字的个数，计算得出目标数组的总个数
for (let i = 0; i < total; i++) {
    const col = Math.floor(i / numArr.length) //计算出特殊位置的索引
    const row = i % numArr.length //计算出特殊位置上数字值对应的索引
    let result = new Array(arrLength) //得到一个 长度为 arrLenght 的数组
    result.fill(0) //将数组每一项填充为 0
    result[col] = numArr[row] //修改特殊位置上的值
    console.log(result)
}
