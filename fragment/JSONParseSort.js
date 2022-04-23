const currentParse = (str) => {
    return JSON.parse(str, (key, value) => { 
        if(key === '') return value
        if( typeof value === 'object'){
            return Object.keys(value).sort().reduce((result, key) =>{
                result[key] = value[key]
                return result
            }, {})
        }
        return value
    })
}

let strJson1='[{"stime":"12:00","endtime":"18:00","afee":18.0000},{"endtime":"12:00","stime":"00:00","afee":12.0000}]'
let strJson2='[{"endtime":"18:00","stime":"12:00","afee":18.0000},{"endtime":"12:00","stime":"00:00","afee":12.0000}]'

strJson1 = JSON.stringify(currentParse(strJson1))
strJson2 = JSON.stringify(currentParse(strJson2))
console.log(strJson1 === strJson2)



//对 JSON.stringify() 输出结果按照 4 个空格为规范进行格式缩进
const jsonStr = JSON.stringify({a:0}, null, 4)
console.log(jsonStr) //'{\n    "a": 4\n}'
