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
| $type | 属性值类型，如果属性值是数组则判断数组每一项是否是该类型 |  

> 注意  
> $exists 只存在2个值，$exists:true 或 $exists:false  
> $type 对应的值可以有2种表现形式：类型对应的字符串 或 类型对应的数字编号  
> 
> 如果有一条数据为 {'_id':1,'zipcode':['450000','450022']} 那么  
> db.address.find({zipcode:{$type:'string'}})  由于zipcode属性值为array，则会对数组每一项进行类型匹配，因此是可以命中该条数据的。  


| 类型 | 含义 | 数字编号 | 别名(字符串) | 备注 |  
| ---- | ---- | ---- | ---- | ---- |  
| Double | 双精度浮点数(整数或小数) | 1 | 'double' |  |  
| String | 字符串 | 2 | 'string' |  |  
| Object | 对象 | 3 | 'object' |  |  
| Array | 数组 | 4 | 'array' |  |  
| Binary data | 二进制数据 | 5 | binData |  |  
| Undefined | 未定义 | 6 | 'undefined' | 已废弃 |  
| ObjectId | MongoDB自动生成的_id | 7 | 'objectId' |  |  
| Boolean | 布尔值 | 8 | 'bool' |  |  
| Date | 日期(unix格式) | 9 | 'date' |  |  
| Null | 非任何有效值 | 10 | 'null' |  |  
| Regullar Expression | 正则表达式 | 11 | 'regex' |  |  
| DBPointer | / | 12 | 'dbPointer' | 已废弃 |  
| JavaScript | JS代码 | 13 | 'javascript' |  |  
| Symbol | 符号 | 14 | 'symbol' | 已废弃 |  
| JavaScript(with scope) | 带作用域的JS代码 | 15 | 'javascriptWithScope' |  |  
| 32-bit integer | 32为整数 | 16 | 'int' |  |  
| Timestamp | 时间戳(数字) | 17 | 'timestamp' |  |  
| 64-bit integer | 64位整数 | 18 | 'long' |  |  
| Decimal128 | 高精度小数 | 19 | 'decimal' |  |  
| Min key | 最小键 | -1 | 'minKey' |  |  
| Max key | 最大键 | 127 | 'maxKey' |  |  

> 例如 String 对应的编号数字为2，别名为'string' 因此：  
> db.address.find({zipcode:{$type:2}})  
> 等同于  
> db.address.find({zipcode:{$type:'string'}})  
  

关于数字精度的知识补充：  

| 类型 | 含义 | 补充 |  
| ---- | ---- | ---- |  
| float | 单精度浮点数 32位二进制储存 | MongoDB中不存在此类型 |  
| double | 双精度浮点数 64位二进制储存 | MongoDB中对应类型为Double |  
| decimal | 高精度浮点数 128位二进制储存 | MongoDB中对应类型为Decimal128 |  

> 注意：  
> 浮点数计算结果并不精确，例如 0.3 - 0.2 = 0.0999999999  
> 对于计算机来说，数字类型精度越高 运算速度越慢。  
  

关于ObjectID的知识补充：  
MongoDB默认自动生成的_id格式遵循以下规则：  

- 前 4 个字节为时间戳中的秒  
- 中间 5 个字节为一个随机数(事实上并不真的是随机数，前3个字节为机器标识码，后2个字节为进程pid)  
- 后 3 个字节为 一个累加的计数器数字，起始值并不是 0 而是一个随机数  

假设某_id值为 '5ecdf8e67c9b393daa572f6e'  
该字符串长度24，是 24位16进制数，实际占用12个字节储存空间。  

> 注意，批量写入数据时：  
> - 前4个字节对应 时间戳中的秒 可能相同  
> - 中间5个字节(3个字节机器标识码和2个字节进程pid) 也可能相同  
> - 后3个字节对应的 累加计数 肯定不同。 由于累加计数器初始值并不一定是从0开始，所以理论上无法通过后3个字节对应的数字大小来判断写入数据库的先后顺序  
