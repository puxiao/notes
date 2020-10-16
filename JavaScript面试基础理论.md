# JavaScript面试基础理论



## 变量类型和计算

### 变量类型：值类型 + 引用类型

引用类型中变量只是对真实对象的一个指针

引用类型可以无限制扩展属性



### 存储方式

**值类型：** 存储在 栈(stack) 中，占据空间小，大小固定。

**引用类型：** 同时存储在 栈 和 堆(heap) 中，占据空间大，大小不固定。引用类型在栈中存储了指针，该指针指向堆中该实体的起始地址，当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获取实体。



### typeof：有 8 种类型

typeof可以精准识别出值类型，但是无法精准识别出 引用类型。

对于引用类型，typeof 只能识别出是 object 或 function。

> array、null、object 都会被 typeof 识别为 object 类型

1. undefined
2. string
3. number
4. boolean
5. object
6. function
7. symbol(ES6新增)
8. BigInt(ES10新增)



### 变量计算

以下只针对 值类型 变量计算。

**加号 + ：**

1. number + number   —>   number + number
2. number + string   —>   String(number) + string



**双等号 == ：**

1. number == string  —>  string(number) == string
2. number == ''   —>  boolean(number) == boolean('')
3. null == undefined   —>  boolean(null) == boolean(undefined)

> 使用双等 == ，JS 会先尝试将两侧对比转换成 string 类型，看是否相等，若不相等再尝试转换成 boolean 类型，如果依然还不相等 才会返回计算结果 false

> 三等 === 不会出现以上情况。



除了 if(obj.a == null){...} 之外，其他地方都推荐使用 三等。

obj.a == null 相当于：if(obj.a === null || obj.a === undefined){...}



**条件判断 if 语句：**

会尝试将 参数 转化为 boolean 类型。



**逻辑运算：**

&&：对比对象均会尝试转化为 boolean 类型

|| ：先将对比的前者转化为 boolean 类型，若为 true 则返回前者本身的值，若为 false 则返回 后者本身的值

! ：将对比对象转化为 boolean 类型，并返回该结果的相反结果

!! ：会将对比对象转化为 boolean 类型，并返回该结果



### JS内置构造函数类型：一共 10 种

1. String
2. Number
3. Boolean
4. Array
5. Object
6. Function
7. Date
8. RegExp (regular expression)
9. Error
10. Symbol

> Math、JSON 等等都是 JS 中是内置对象，而不是内置构造函数类型，他们的构造函数类型都是：Object
>
> eval()、encodeURL()、isNaN() 等等都是  JS 中的内置函数，而不是内置构造函数类型，他们的构造函数类型都是：Function
>
> NaN、Infinity、undefined、globalThis 这些都是 JS 中的内置属性值，他们是具体的值，不是函数，若使用 typeof xxx，得到的是他们值的类型(注意不是构造函数类型)



### undefined与undeclared、null的区别

undefined：在作用域中已声明，但未赋值的变量

undeclared：还没有在作用域中声明的变量

> 引用 undeclared 变量会报错：ReferenceError: xx is not defined.

null：代表空对象(事实上并不是真正的对象)

> 在最初的 32 为系统中，为了性能考虑使用低位存储变量的类型信息，000 开头代表对象，然而 null 表示为全 0，所以错误得判断 null 也为 object，虽然目前 JS 内部已经做了修正，但这个 bug 一直沿用至今。



### {}和[]的valueOf和toString的结果是什么

| 运行       | {}   | []                |
| ---------- | ---- | ----------------- |
| valueOf()  | {}   | "[object Object]" |
| toString() | []   | ""                |



### 赋值运算

赋值运算是从右往左进行计算执行的。

JS 在非严格模式下，若一个变量没有使用 var/let 声明，则 JS 默认会自动帮你声明。

两种情况叠加，于是，会出现下面的情况：

1. let a = b = 3 其实相当于：b = 3;  let a = b;
2. b 会被 JS 自动定义，且为全局变量

```
function myFun() {
    let a = b = 3
}
myFun()
console.log(b) // 3
```

> 上述代码仅在 JS 非严格模式下 可以正常运行



## 原型和原型链

**一道经典面试题**

如何判断一个对象是数组类型？

首先 typeof xxx 是不可以的，因为 typeof 返回的是该对象的 内置类型，typeof array 得到的是 Object。

所谓 “数组类型” 是指 构造函数为 Array，一个对象是数组类型真正想表达的是：一个对象的构造函数是Array。

因此需要判断和获取 对象的构造函数 是什么。

**第1种方式：**

使用 instanceof 来判断 对象的原型链是否为 JS 内置构造函数 Array

```
const arr = []
console.log(arr instanceof Array) //true
```

> instanceof 的本质就是不断查找(一层一层查找) 变量的 `__proto__.constructor`值，直到最深处为 null 为止，若中间发现有和 要比较的类型函数相同，则返回 true



**第2种方式**：

使用 `__proto__` 来判断对象的隐式原型构造函数是否为 Aarray的构造函数

```
const arr = []
console.log(arr.__proto__  === Array.prototype)
```

或者这样写：

```
const arr = []
console.log(arr.__proto__.constructor === Array)
```



**第3种方式：**

```
const arr = []
console.log(arr.constructor === Array)
```

或者是：

```
console.log(arr.constructor.name === 'Array')
```



**第4种方式：**

```
const arr = []
console.log(Object.getPrototypeOf(arr) === Array.prototype)
```



**第5种方式：**

```
const arr = []
console.log(Array.isArray(arr))
```





**函数 VS 构造函数**

所谓函数，就是可以重复执行的代码块，只定义一次但是可以被执行或调用任意次。

从功能上来划分，函数分为：普通函数和构造函数

普通函数就是使用 function 定义并且有明确返回值且返回值的函数，主要作用是用来执行或计算。

构造函数就是使用 function 定义并且没有明确返回值的函数，JS 会给他们自动隐形添加 return this，主要作用是用来初始化一个对象。构造函数需要通过 new 来配合使用。

```
function myFun(){
  this.xx = xx
  // return this 默认普通函数会自动添加这一句
}
```

> 函数名一般采用驼峰命名法，通常约定，如果是普通函数则首字母小写，如果是构造函数则首字母大写

普通函数也可以作为构造函数存在。

箭头函数是没有构造函数的，也就是说箭头函数本身并不会默认自动添加上 return this 这行隐形的代码。

自己手工添加的 return xxx 本质上是返回函数运行结果。



**函数参数**

普通函数和构造函数都有 arguments 对象，该属性为一个类似数组的对象，数组元素为所有参数。

箭头函数没有 arguments 对象。



### 何为原型

在 JS 中使用构造函数来创建新的对象，每个构造函数内部都有一个 prototype 属性，该属性是一个对象，这个对象包含了可以由该构造函数的所有实例共享的属性和方法，而这个对象被称为这个实例的原型。



### 原型规则

所有的引用类型(数字、对象、函数)都遵循以下 4 个原则：

1. 都具有对象特性，都可以自由无限扩展属性，除了 null 以外。

2. 都有一个 `__proto__` 属性，属性值为对象的隐式构造函数的原型

3. 当试图得到一个对象的某属性时，如果对象本身(显示原型)没有这个属性，则会去他的 `__proto__` (隐式原型) 中寻找

   > 有一种特殊情况，就是在 for(item in xxx){ ... } 中，只会调用该对象本身的属性，不会去尝试调用 对象隐式原型上的属性

   > 判断一个对象属性是否为显示原型上，还是隐式原型上，使用 xxx.hasOwnProperty(xxx) 来判断

所有的函数(箭头函数除外)都有一个 prototype 属性(显式原型)，属性值为该对象的显示构造函数的原型

----

忽略上面一段文字，重新用另外一段文字来描述原型规则：

1. 所有通过 function 创建的对象，都叫函数对象

2. 所有函数对象都有一个原型对象 prototype

3. 所有对象上都有一个隐式原型对象 `__proto__` ，指向创建该对象的构造函数的原型对象

4. 所有的原型对象上都有一个 constructor 对象，指向该原型对象所在的构造函数本身

   > JS 为了避免死循环，因此 Object.prototype 的值为 null



### 写一个原型链继承的例子

对象显示原型对象是可以更改的！所谓继承就是 动态 更改指定构造函数的显式原型。

```
function Animal(){
    this.eat = function (){
        console.log('eat...')
    }
}

function Dog(){
    this.run = function () {
        console.log('run...')
    }
}

//将 Dog 的显性原型更改为一个 Animal 对象实例，从而让 Dog 也具有 Animal 的属性
Dog.prototype = new Animal()
const mydog = new Dog()

mydog.eat()
mydog.run()
```

还有另外一种继承方式，即直接给 函数的 prototype 属性值添加新的属性：

```
function Dog(){
    this.run = function () {
        console.log('run...')
    }
}

Dog.prototype.eat = function (){
    console.log('eat...')
}

const mydog = new Dog()

console.log(Dog.prototype)
console.log(mydog.__proto__)

mydog.eat()
mydog.run()
```



## new 操作的实现过程

new 运算符创建一个用户定义的对象类型的实例，或具有构造函数的内置对象的实例。new 关键词会进行以下操作：

1. 创建一个空的简单对象(即 {})
2. 链接该对象(即设置该对象的构造函数) 到另一个对象
3. 将步骤1新创建的对象作为 this 的上下文
4. 如果该函数没有返回对象，则返回 this

```
function Person (str){
    this.name = str
}

const me = new Person('puxiao')
```

以上面代码中 new 为例，分别对应上面 4 个环节：

```
let obj = {}
obj.__proto__ = Person.prototype
Person.apply(obj,'puxiao')
return this

let me = obj
```







## 闭包和作用域

JS 不是 静态编译型 语言，而是 动态解释型 语言。



### 闭包

闭包是指有权访问另外一个函数作用域内变量的函数。

创建闭包的最常见方式就是在一个函数内创建另外一个函数。



### 闭包的用途

1. 使我们可以在函数外部访问到函数内部的变量。具体做法是 通过调用闭包函数，从而在外部访问到函数内部的变量，可以使用这种方法来创建私有变量。

2. 使已经运行结束的函数上下文中的变量对象继续保留在内存中，因为闭包函数保留了这个变量对象的引用，所以这个变量才不会被回收。

   ```
   function myFun(){
       let n = 0
       function add(){
           n ++
           console.log(n)
       }
       return add
   }
   
   const add = myFun()
   
   console.log(add()) // 1
   console.log(add()) // 2
   ```

   



### 声明提升

使用 var、let、const 定义变量 或 function 定义函数，默认都会进行变量提升。



### 执行上下文

JS 中执行上下文是可以改变的，存在以下 2 种情况：

1. 定义时的上下文
2. 运行时的上下文



### 作用域

作用域：作用域是定义变量的区域，有一套访问变量的规则。分为全局作用域、函数作用域、ES6以后出现的块级作用域

在 ES6之前，JS 不存在块级作用域，在 ES6以后，可以使用 let 来定义块级作用域中的变量。



### 作用域链

当代码需要调用某个变量时，若当前作用域中不存在该变量，则会一级一级向外层作用域查找。

这种一级一级查找变量也就形成了一种 “链式结构”，这就是作用域链。



### 函数的调用

JS 中函数调用有 4 种模式：

1. 方法调用
2. 正常函数调用
3. 构造函数调用
4. apply/call调用

无论哪种函数调用，除了声明时定义的形参外，还会自动添加2个形参：this 和 arguments



### This

this 指向谁？

1. 在浏览器中，this 指向 windows 对象
2. 在函数中，this 指向最后调用它的那个对象
3. 在构造函数中，this 指向 new 出来的那个新对象
4. call/apply/bind 中的 this 指向被强行绑定的那个对象
5. 箭头函数中的 this，指向父作用域中的 this

上面前 4 种情况，this 只有在执行时才能确认值，定义时无法确认。唯独第 5 种情况，this 在定义时就已经被明确下来。

myFun.xx.call(xxx) 中，call(xxx) 可以将 myFun.xx 中的 this 对象修改为 xxx

apply/call 主要区别仅在 传递函数形参时的形式，apply 是用数组，而 call 使用 逗号分隔。

bind 则表示将作用域固定为某对象，但并不会让函数立即执行。



### 闭包

闭包的应用场景：函数返回值依然是函数



## 异步和单线程

所谓同步，就是会阻塞进程，当前不执行完毕不会执行后面代码。

所谓异步，就是不会阻塞进程。

通常情况下，需要 “等待” 的操作需求，都最好使用异步。

> 例如 加载资源、请求数据、计时器等

> alert() 是同步，会阻塞进程



## 跨域

### 允许跨域的标签

在网页中，有3个标签是可以允许跨域加载资源：

1. `<img\>`
2. `<link\>`
3. `<script>`



### JSONP

所谓通过 JSONP 解决跨域，本质上就是利用了 `<script>` 标签允许跨域加载资源的特性 来实现跨域数据请求：

1. 客户端通过 `<script src='xxxxx'>` 来请求 某网络 JS 文件地址
2. 服务器 动态生成 对应的 JS 文件内容(包含客户端需要的数据)返回给客户端



### 服务器端设置允许跨域

服务端返回数据时，添加 允许跨域的 header 标签：

```
respose.setHeader('Access-Control-Allow-Origin','xxxxx')
```



## 安全性

### XSS 跨站请求攻击

提交数据内容中包含 <script\> 代码，若对方并没有处理，则对方代码中就会包含攻击方的 JS 脚本。

通常 JS 脚本可以获取 cookie 并发送到自己服务器中。

后端解决方案：将 < 替换为 `&lt;` 、> 替换为 `&gt;` 这样就不是 JS 代码可执行的片段代码了。



### XSRF 伪装请求

假设某网站支付的接口中，并没有进行用户验证。那么攻击者可以将该请求地址 伪装 隐藏到 给你的特定邮件或网页中，当你点击请求包含该 请求连接接口地址时，则进行自动支付(假设支付接口并不进行二次验证)。

后端解决方案：增加验证流程即可



## http相关

### GET 与 POST 的区别

GET 数据位于 消息头中，而 POST 数据位于 消息体 中。

另外，POST 请求不可以做以下事情：

1. POST 请求不会被缓存
2. POST 请求不会保留在浏览器历史记录中
3. POST 请求不能收藏为书签
4. POST 请求对数据长度没有要求限制



# 模块化开发

### 模块化的理解

一个模块是实现一个特定功能的一组方法，最常用的是立即执行函数的写法，通过利用闭包来实现变量的私有化，不会对全局造成污染。



### 函数式编程

通过编写纯函数，避免共享状态、可变数据、副作用 来构建软件的过程。

面向对象中应用程序的状态通常和方法共享和共处，但函数式编程不是这样，因此函数式编程代码更简洁，更可预测，更容易测试。



### 纯函数

给固定的参数，返回结果也一定是固定值。



### 高阶函数

将函数作为参数或者返回值的函数，称为高阶函数。



## 手工实现系列

### 手工实现Array.prototype.map

**分析：**

map() 函数本身作用是将数组中每一个元素都执行一遍某个函数，并将所有的执行结果汇总成一个新的数组。

**实现：**

```
function map(arr, callback) {
    if (!Array.isArray(arr) || !arr.length || typeof callback !== 'function') {
        return []
    }
    const result = []

    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i], i, arr))
    }

    return result
}

const arr = [0, 1, 2]
function add(n, i, arr) {
    return n + 1
}
let new_arr = map(arr, add)
console.log(new_arr) //[1,2,3]
```



### 手工实现Array.prototype.filter

**分析：**

filter() 函数的作用是将数组中的所有元素都进行一次 某个函数 计算是否匹配，并将所有匹配的元素汇总成一个新数组并返回。

**实现：**

和上面 map() 的方法类似，唯一区别就在于 map 是 result.push(callback(arr[i],i,arr))，而 filter 应该是：

```
if(callback(arr[i],i,arr)){
  result.push(arr[i])
}
```



### 手工实现Array.prototype.reduce

**分析：**

reduce() 函数的作用是将数组中所有元素都执行一次 某个函数，并依次累加这些计算结果，将最终结果汇总为单个返回值。

**实现：**

和前面两个略有不同的地方在于 reduce() 函数有一个 初始值 的参数(不传该值则默认为空，不会加入到汇总的起始中)

```
function reduce(arr, callback, initial) {
    if (!Array.isArray(arr) || !arr.length || typeof callback !== 'function') {
        return []
    }

    let boo = initial !== undefined
    let result = boo ? initial : arr[0]

    for (let i = boo ? 1 : 0; i < arr.length; i++) {
        result = callback(result, arr[i], i, arr)
    }

    return result
}

const arr = [0, 1, 2]
function callbackFun(value, item, i, arr) {
    return value += item
}

let value = reduce(arr, callbackFun)
let value2 = reduce(arr, callbackFun, 2)
console.log(value, value2) // 3,5
```



### 手写一个深度拷贝

先说一下浅拷贝：浅拷贝的原则是：

1. 若属性为值类型，则直接赋值
2. 若属性为引用类型，则添加引用(仅仅是添加指针，内存中并未增加新的存储实体)



**第1种浅拷贝：**

对于对象来说，比较简单的浅拷贝方式就是：

```
let b = {...a}
```

对于组来说，：

```
let b = [...a]
```



**第2种浅拷贝：**

```
let b = Object.assign({},a)
```

注意：Object.assign() 仅仅可以实现第一层的拷贝，如果嵌套多层则还是引用而非深度拷贝。



**深拷贝**

深拷贝就是在内存中，完全新建一份存储实体对象。

深拷贝实现思路为：

1. 判断拷贝对象的类型，若为值类型，则直接赋值
2. 若为引用类型，则通过递归，深层次对属性进行查询，直到属性的值为值类型后，赋值，逐层赋值。



**简单的实现代码：**

```
function deepClone(target) {
    let result = undefined

    if (target === null || !(typeof target === 'object')) {
        result = target
    } else {
        result = target.constructor.name === 'Array' ? [] : {}
        for (let key in target) {
            result[key] = deepClone(target[key])
        }
    }

    return result
}
```

> 在最新的 JS for in 中，本身就只会循环 对象自身特有的属性，因此是不需要添加 target.hasOwnProperty(key) 判断该属性是自身属性还是原型对象的属性。



## 防抖与节流

### 防抖：

防抖 指 在 事件被触发 N 秒后再执行回调函数，如果在这 N 秒内又被触发，则重新计时。

> 例如在用户信息提交时，可以避免用户多次点击向后台多次提交



### 节流：

节流 指 在 N 秒之内，无论调用多少次，函数都只执行1次。

> 例如在滚动浏览器时，scroll 函数的事件监听上，通过节流降低事件调用的频率