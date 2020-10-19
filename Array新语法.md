# 重学数组

### 数组遍历方式

**ES5**

| 函数      | 功能作用                                                   |
| --------- | ---------------------------------------------------------- |
| for循环   | for(let i =0; i<arr.length; i++) {...}最基础的循环遍历方式 |
| for in    | for(let index in arr) { ...} ，不建议使用                  |
| forEach() | 没有返回值，只是针对每个元素调用指定函数                   |
| map()     | 返回一个新的数组，数组每个元素为调用指定函数的结果         |
| filter()  | 返回一个数组，数组每个元素为符合指定函数运算条件的数组元素 |
| some()    | 返回一个布尔值，判断是否有元素符合指定函数条件             |
| every()   | 返回一个布尔值，判断每个元素是否符合指定函数条件           |
| reduce()  | 返回一个值，接收一个函数作为累加器，并返回最终累加结果     |

> 数组本身的循环函数中，不会像 for 循环中那样，不支持 break(终止循环) / continue(终止本次循环)

**ES6**

| 函数        | 功能作用                                                     |
| ----------- | ------------------------------------------------------------ |
| for of      | for(let item of arr) { ... }，与 for in 有2处不同：<br />1、for of 不会遍历出数组自定义属性 2、循环出来的是元素的值而非元素索引 |
| find()      | 返回第一个通过指定条件测试(指定函数返回值为true)的元素<br />若元素全部都不通过测试则返回 undefined |
| findIndex() | 返回第一个通过指定条件测试(指定函数返回值为true)的元素的索引<br />若 元素全部都不通过测试则返回 -1 |
| values()    | 返回一个可迭代对象，迭代器 value 属性值为 数组元素的值       |
| keys()      | 返回一个可迭代对象，迭代器 value 属性值为 数组元素的索引     |
| entries()   | 返回一个可迭代对象，迭代器 value 属性值为 一个数组，该数组为：[元素的索引 , 元素的值] |



### 关于 for 循环的额外补充

**不建议使用 for in 循环数组**

因为 for in 除了会循环数组元素之外，还会循环遍历出 Array 中额外自定义的属性。

```
const arr = [4, 5, 6]
Array.prototype.someFun = {}
arr.someFun2 = {}
for (let key in arr) {
    console.log(key)
}

// 0
// 1
// 2
// someFun2
// someFun
```

**使用 for of 循环数组元素的值**

```
const arr = [4, 5, 6]
Array.prototype.someFun = {}
arr.someFun2 = {}
for (let item of arr) {
    console.log(item)
}

//注意，循环出来的是 数组元素的值，而非元素索引
// 4
// 5
// 6
```

**使用 for of 循环出元素的索引**

```
const arr = [4, 5, 6]
Array.prototype.someFun = {}
arr.someFun2 = {}
//注意，此处用到了 arr.keys()函数，该函数返回一个数组，元素为所有数组元素的索引
for (let index of arr.keys()) {
    console.log(index, arr[index])
}

// 0 4
// 1 5
// 2 6
```

输出数组元素的索引，同时又输出元素的值，还有另外一种写法：

```
const arr = [4, 5, 6]
Array.prototype.someFun = {}
arr.someFun2 = {}
//注意，此处用到了 arr.entries()函数，该函数返回一个数组，数组第一个元素为索引，第二个元素为值
for (let [index, item] of arr.entries()) {
    console.log(index, item)
}

// 0 4
// 1 5
// 2 6
```

结论：循环对象使用 for in，循环数组使用 for of



### 关于迭代器的补充

#### 一些名词解释

**集合数据类型：**例如数组，字符串等

**切片：**只取**集合数据类型或列表中的一部分片段，例如取 第N个索引 到 第(M-1)个索引 之间的元素，这个过程就叫 切片。

> 在 JS 中，数组通常使用 Array.slice() 函数完成。

**迭代：**通过 for 循环可以遍历的集合数据类型或列表，这种遍历行为被称之为迭代

**可迭代对象：**可以被 for 循环遍历的集合数据类型或列表，被称为 可迭代对象，英文单词 Iterable

> MDN上定义可迭代对象有：Array，Map，Set，String，TypedArray，arguments 对象等等

**列表？:**事实上 JS 数据类型中只有数组，并没有 列表，那么列表又是指什么呢？
答：具有可以被 for 循环遍历的，类似 数组 但又不是真数组 的对象，我们姑且称之为 列表

> 事实上他们有更加精准的定义：包括生成器和带 yield 的生成器函数

**生成器：**

假设我们需要一个数组，该数组内容为[1,2,3,...1000000]，也就是说这个数组元素有100万个。

那么在实际 JS 运行中，真的就应该去创建一个数组，有 100万个元素吗？这样做肯定会占据大量的内存。

通过观察可以发现，这个数组元素是有规律的：后面元素的值 = 前一个元素+1，也就是说可以根据这个规则推算出第N个元素的值。

数组 [1,2,3,...1000000] 真正关键的点，其实只有以下3点：

1. 第0个索引对应的值 (1)
2. 数组一共的长度 (100万个)
3. 相邻元素之间的计算规则 (后面元素的值 = 前一个元素+1)

我们可以针对规则，编写一段代码，用来计算第N个索引元素的值，并且对外提供可以访问这个元素的方法，当然还对外提供修改某索引对应的值，等等，最终我们将这些方法都封装成一个对象。

**这个对象我们就可以称之为：生成器，对应英文单词 generator**

外部可以调用 这个生成器提供的各种属性和方法，“就像操作真实的数组一样”，但外部对生成器内部是如何生成第N个索引的过程不知道，也无需关心。

> “就像操作真实的数组一样” 这里之所以添加引号，是因为在 JS 中，数组底层的本质就是通过生成器实现的。

再次重复：这种利用一定的规则，通过内部推算或记录第N个索引对应值，对外提供可访问元素的对象，就被称之为 生成器。

> 生成器中的 `生成`，本身就是指 去推算或记录出第N个索引对应值的过程。

**迭代器：**可以通过 for 循环遍历所有元素的对象，有 集合数据类型和列表，这些对象被称为 可迭代对象(Iterable)。若可迭代对象具有 next() 函数，通过 next() 函数可以不断调用并返回下一个元素值，直到最终再无下一个元素，那么这个可迭代对象就被称为迭代器，对应英文单词 Iterator。

> 因此，生成器 都是 需要继承于  迭代器，获得拥有 next() 函数的。
> Koa 中间件思想就是基于 迭代器 理论上的应用



**如何判断一个对象是否是 可迭代对象 ？**

```
const str = 'abc'
const arr = [0, 1, 2]
const values = arr.values()

const num = 2
const obj = {}

const isIterable = (target) => {
    return target != null && typeof target[Symbol.iterator] === 'function'
}
//请注意上面代码中使用了 target !=null 而不是 target !== null
// target != null 实际上相当于：target != null && target != undefined

console.log(isIterable(str)) //true
console.log(isIterable(arr)) //true
console.log(isIterable(values)) //true

console.log(isIterable(num)) //false
console.log(isIterable(obj)) //false
```



### 类数组/伪数组

**类数组/伪数组**

和数组有些功能相似(可以循环遍历，有 length 属性)，但又不是真的数组(不具备数组一些方法例如 push())，那么这些 “数组” 可以成为：类数组或伪数组。

**伪数组需要满足的2个条件是：**

1. 从 0 索引开始，有正确的值
2. 有 length 属性，且该属性为正确的长度数字

**常见伪数组有：**

1. 一个函数的参数集合 arguments 就是伪数组。

2. DOM 操作中，document.querySelectorAll(xxx)，查找到的结果就是一个 nodeList(HTMLCollection) 节点集合，而这个集合就类数组/伪数组。
3. 自定义一个对象，该对象满足 伪数组需要满足的2个对象，例如：const arrObj = { 0:'a', 1:'b', 2:'c', length:3 }

**如何把一个 类数组/伪数组 转化成一个真数组？**

```
let list = document.querySelectorAll(xxx)
const arr = Array.prototype.slice.call(list)
```

以上是  ES5 的写法，在 ES6 中，有更加便利的转化方式。

```
let list = document.querySelectorAll(xxx)
const arr = Array.from(list)
```



### 初始化数组的值

使用构造函数初始化一个数组，用法为：new Array(xxxxx)，假设 xxxxx 为数字，那么就会出现以下 2 种情况。

```
const arr1 = new Array(2,3)
console.log(arr1) // [2,3]

const arr2 = new Array(2)
console.log(arr2) // [<2 empty items>]
```

通过行代码，我们可以知道，new Array() 中，如果参数为 1 个数字，代表这是数组的长度，元素为空(undefined)，若参数超过 2 个，则表示 参数就是数组的元素。

若我们希望参数只有 1 个，但是这个参数表示 第 0 索引的值，而不是表明数组的长度，在 ES6 中可以使用：

```
const arr = Array.of(2)
console.log(arr) //[2]
```

> 请注意：上述代码中使用的是 Array.of(2)，而不是 new Array.of(2)

> 若 Array.of() 传入参数量 1 个，那么 Array.of(xx, xx) 和 new Array(xx, xx) 没有区别，参数均表示为数组的元素。



**fill()方法**

```
const arr = new Array(3)
arr.fill(1)
console.log(arr) //[ 1, 1, 1 ]
```

> 上述代码为：
>
> 1. 创建一个数组，且设置长度为 3
> 2. 使用 fill() 函数，将数组每个元素值都填充为 1

以上代码 还可以简写成：

```
const arr = new Array(3).fill(1)
```



**includes()**

检查数组中是否包含 某元素。

之前检查数组中是否包含某元素，通常可以使用 indexOf ，若不存在则返回值为 -1 ：

```
const arr = [0, 1, 2]
arr.indexOf(2)
```

但是，这种写法对于一个特殊值 NaN 来说是无效的，因为：

```
console.log(NaN == NaN) //false
console.log(NaN === NaN) //false
```

而这时使用 includes() 可以很容易解决。

```
const arr = [NaN,4,5,6,7]
console.log(arr.includes(NaN)) //true
```



### 数组使用 copyWithin() 浅拷贝

copyWithin() 替换并复制数组中的片段，原数组会跟着被修改，但是数组长度不变。 一共3个参数：

1. 第1个参数：要替换的目标起始索引
2. 第2个参数：要开始复制的索引(包含该索引值)
3. 第3个参数：复制结束的索引(不包含该索引值)，若为空则视为一直到数组结尾

请注意：第2 和 第3 个参数决定了拷贝的范围，同时也决定了拷贝的数量长度，要替换的长度。

```
const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
console.log(arr.copyWithin(1, 3, 4)); //[ 'a', 'd', 'c', 'd', 'e', 'f' ]
```

> 上面代码中，相当于 把索引3(包含)到索引4(不包含)的值，替换到索引1的位置



```
const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
console.log(arr.copyWithin(2, 3)); //[ 'a', 'b', 'd', 'e', 'f', 'f' ]
```

> 上面代码中，拷贝的内容是从第3个索引开始(包含)，一直到数据结尾，即 'd', 'e', 'f' ，长度为 3
>
> 要替换的内容索引时2(包含)，要被替换的长度就是拷贝的长度 3