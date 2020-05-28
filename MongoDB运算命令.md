# MongoDB运算命令

## 查询和映射

#### 比较查询  

| 语法 | 解释 |  
| ---- | ----|  
| $eq | 等于 |  
| $ne | 不等于 |  
| $gt | 大于 |  
| $gte | 大于等于 |  
| $lt | 小于 |  
| $lte | 小于等于 |  
| $in | 等于数组中某个值 |  
| $nin | 不等于数组中任意值 |  

> 注意：  
> 对于$in和$nin来说，数组里匹配的值还可以是正则表达式，例如：db.users.find({name:{$in:[/x/,/^p/]}}） 找出名字中有字母x或以字母p为开头的数据  
> 
> 对于$nin来说，如果检测的属性本身不存在，则会返回该条数据。例如：db.users.find({age:{$nin:[18]}}) 如果age属性根本就不存在，也就意味着age的值不会为18，因此会返回所有数据  

#### 逻辑查询

| 语法 | 解释 |  
| ---- | ---- |  
| $and | 逻辑与，数组中所有表达式必须都成立 |  
| $not | 逻辑非，数组中表达式都不成立或要对比的属性本身不存在  
| $nor | 逻辑或的取反，数组中表达式中任何一个都不成立 |  
| $or | 逻辑或，数组中表达式任何一个成立即可 |  
 

> 注意：  
> $and 执行短路查询，即若数组中前面表达式不成立，则不会继续剩余表达式的运算  
> $not 若对比属性本身不存在，运行结果也视为成立  
> $nor 不可以单独使用$nor，$nor必须配合[]，[]包含其他查询才可以使用。  


#### 元素查询

| 语法 | 解释 |  
| ---- | ---- |  
| $exists | 属性是否存在，哪怕该属性值为null或undefined(事实上undefined类型值已经被废弃) |  
| $type | 属性值类型 |  

> 注意  
> $exists 只存在2个值，$exists:true 或 $exists:false  
> $type 对应的值可以有2种表现形式：类型对应的字符串 或 类型对应的数字编号  


| 类型 | 数字编号 | 别名(字符串) | 备注 |  
| ---- | ---- | ---- | ---- |  
| Double | 1 | 'double' |  |  
| String | 2 | 'string' |  |  
| Object | 3 | 'object' |  |  
| Array | 4 | 'array' |  |  
| Binary data | 5 | binData |  |  
| Undefined | 6 | 'undefined' | 已废弃 |  
| Objectid | 7 | 'objectid' |  |  
| Boolean | 8 | 'bool' |  |  
| Date | 9 | 'date' |  |  
| Null | 10 | 'null' |  |  
| Regullar Expression | 11 | 'regex' |  |  
| DBPointer | 12 | 'dbPointer' | 已废弃 |  
| JavaScript | 13 | 'javascript' |  |  
| Symbol | 14 | 'symbol' | 已废弃 |  
| JavaScript(with scope) | 15 | 'javascriptWithScope' |  |  
| 32-bit integer | 16 | 'int' |  |  
| Timestamp | 17 | 'timestamp' |  |  
| 64-bit integer | 18 | 'long' |  |  
| Decimal128 | 19 | 'decimal' |  |  
| Min key | -1 | 'minKey' |  |  
| Max key | 127 | 'maxKey' |  |  

> 例如 String 对应的编号数字为2，别名为'string' 因此：  
> db.address.find({zipcode:{$type:2}})  
> 等同于  
> db.address.find({zipcode:{$type:'string'}})  
