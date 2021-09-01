# JSDoc的安装与使用

JSDoc 是一个  NPM 包，主要帮我们做 2 件事情：

1. 根据符合 JSDoc 规则的注释内容，自动将我们的代码生成对应的 API 文档

   > JSDoc 注释规则，我们会在本文后面讲解

2. TypeScript 可以识别出符合 JSDoc 规范的注释内容，并将该注释内容自动推断出对应的类型。

   > 意味着我们可以在不添加 .d.ts 文件的前提下，让 TS 知道 .js 的类型结构



<br>

**补充：.js 文件对应的是 JSDoc，对于 .ts 文件来说，可以通过 `typedoc` 自动生成对应的 jsdoc 风格的代码注释。**

**但是：目前最新版的 typedoc 0.20.30 并不支持 React 17.0.0 以上版本。**

<br>



## 安装JSDoc

**全局安装(推荐)**

```
yarn global add jsdoc
或
npm i -g jsdoc
```



**当前项目安装(不推荐)**

```
yarn add jsdoc --dev
或
npm i --save-dev jsdoc
```



注意：当我们安装好 jsdoc 之后，会在项目的 package.json 中显示出 jsdoc 的安装版本要求，例如：

```
"jsdoc": "^3.6.6"
```

我们可以将 `^` 修改为 `~` ，也就是：

```
"jsdoc": "~3.6.6"
```

这样便锁定 jsdoc 版本一直为 3.6.6，而不是用更高的版本。



<br>



**为什么推荐全局安装 jsdoc，而不推荐仅当前项目安装？**

答：因为全局安装会让我们使用 jsdoc 命令更加方便。

假设我们要编译 xxx.js，如果我们使用的是仅当前项目安装，那么执行的命令为：

```
./node_modules/.bin/jsdoc xxx.js
```

而如果是全局安装，那么执行命令为：

```
jsdoc xxx.js
```



**真的是这样？**

假设只有我们自己管理着项目，那么全局安装没有任何问题。

但是如果某个项目可能由多个人共同维护，那么此时这些人本地安装的 jsdoc 可能存在版本不一致的情况，这个时候就应该采用 “仅当前项目安装” 的形式，这样任何人都可以在 package.json 中看到 jsdoc 对应的版本号。

<br>



## JSDoc的常用命令

以下的命令是基于 全局安装 jsdoc 而言的。



**编译某 xx.js 文件**

```
jsdoc xxx.js
```



**指定JSDoc配置文件的路径**

```
jsdoc -c xxx
```

> 默认配置文件的路径为 JSDoc 安装目录下的 conf.json 或 conf.json.EXAMPLE
>
> 补充：查看全局安装目录的命令为
>
> ```
> yarn global dir
> 或
> npm root -g
> ```



**指定输出生成文档的目录路径**

```
jsdoc -d xxx
```

> JSDoc 默认使用 Haruki 模板，会使用 console.log 将数据打印在命令面板中，以 ./out 开头。



**打印日志信息，可帮助调试 JSDoc 本身的问题**

```
jsdoc --debug
```



**当运行测试时，打印出的信息不要使用颜色**

```
jsdoc --nocolor
```

> 在 windows 平台中该选择默认就是启用的



**扫描源文件和导览时递归到子目录**

```
jsdoc -r
```



**包含项目 package.json 文件**

```
jsdoc -P
```

> 请注意是大写的 P



**将错误视为致命错误、将警告视为错误**

```
jsdoc --pedantic
```

> 默认为 false



**一个查询字符串用来解析和存储到全局变量 env.opts.query 中**

```
jsdoc -q xx=aa&yy=bb
```



**包含文档 README.md 文件**

```
jsdoc -R
```

> 请注意是 包含 而不是 生成，也就是说 README.md 文件是需要你自己提前编写好的



**指定用于生成输出文档的模板的路径**

```
jsdoc -t xxx
```

> 默认使用 templates/default



**运行 JSDoc 的测试套件，并把结果打印到控制台**

```
jsdoc -T
```



**导览路径、JSDoc 要搜索的目录**

```
jsdoc -u xxx
```

> 若省略，则不生成导览页



**查看帮助**

```
jsdoc -h
```



**查看当前版本**号

```
jsdoc -v
```



**打印出详细的日志信息**

```
jsdoc --verbose
```

> 默认为 false



**以 JSON 格式转储所有的 doclet 到控制台，然后退出**

```
jsdoc -X
```



<br>



## JSDoc配置文件

JSDoc 的配置文件为 JSON 类型。

1. 默认的配置文件位于 jsdoc 安装目录下的 conf.json 或 conf.json.EXAMPLE

2. 若想指定配置文件，则执行 jsdoc -c  /path/to/conf.json

   > 通常情况下自定义配置文件会命名为 conf.json



默认的配置文件内容如下：

```
{
    "tags": {
        "allowUnknownTags": true
    },
    "source": {
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "plugins": [],
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
        "default": {
            "outputSourceFiles": true
        }
    }
}
```

以上配置中的解释：

`tags.allowUnknowTags:true`：允许使用无法识别的标签

`source.includePattern: ".+\\.js(doc|x)?$"`：使用增则表达式，只有以 .js 或 .jsdoc 的文件将会被处理

`source.excludePattern: "(^|\\/|\\\\)_"`：使用增则表达式，只要是以 _ 开头的目录都将被忽略

`plugins:[]`： 暂时未启用任何插件

`templates.cleverLinks: false`： 不清除 @link 标签

`templates.monospaceLinks: false`：将 @link 的值视为 链接 而不是 文字



具体更多的标签用法，请查阅官方文档：

https://jsdoc.app/about-configuring-jsdoc.html



<br>



## JSDoc中的类型

#### JSDoc类型与TS的区别

JSDoc 中类型的表达与 TypeScript 相似却又不同，主要体现在类型首字母是否大写上。

1. 对于一些简单类型 2 者使用相同，例如字符串，string 或 String 都可以
2. 对于一些复杂类型，TS 往往采用值的字面来表达，例如 对象 {}、数组 []，但是对于 jsdoc 来说，对象必须使用 Object、数组必须使用 Array、函数必须使用 Function
3. 在 jsdoc 中类型都需要使用 大括号 包裹

<br>

#### 一些特殊标记

1. 在 jsdoc 中大括号 { } 表示 `一定或必填`，而 中括号 [] 表示为 `可选`

   > 在表达某属性为可选属性时，都需要用到 []
   >
   > jsdoc 中也可以使用 ?: 来表示属性为可选
   >
   > 但是 jsdoc 有一种特殊的用法 {xxx=}，具体如何使用请参考下文中关于 @property 讲解

2. 使用星号 * 来表示任意类型，相当于 TS 中的 any

   > 在实际使用中，我们更多会选择使用 * 来表示 any



<br>



#### JSDoc的几种类型

**第1类：名称标记型**

就是最为常见的内置类型，例如：{Boolean}、{Number}、{Object}、{Array}

> 再次提醒：对于简单类型来说首字母是可以小写的，例如 boolean、number，究竟使用大写还是小写取决于个人习惯

此外，还可以直接使用已经定义好的某类型，例如：{myNamespace.MyClass}



**第2类：联合类型**

这个和 TS 中的联合类型是相同的，例如：{Number | Boolean}



**第3类：元数组或元对象**

这一点的用法基本上和 TS 也是相同的。

```
{Array.<MyClss\>} 或者 {MyClass[]}
```

> 一个数组，该数组元素为 MyClass 实例



<br>

```
{Object.<String, Number>}
```

> 一个对象，该对象属性名均为字符串，属性值均为数字

**注意：上面这种形式 `{Object.<String, Number>}` 是我在学习 jsdoc 某些教程上看到的，但是我实际测试并不可行。**



<br>

```
{{a:Number, b:String, c:*, d?:string}} myObj
```

> 一个对象类型为 myObj，属性 a 类型为数字，属性 b 类型为字符串，属性 c 类型为 any，属性 d 为可选属性，属性 d 的值类型为 string | undefined

上面这段对象结构类型定义的另外一种表达形式为：

```
{Object} myObj
{Number} myObj.a
{String} myObj.b
{*} myObj.c
{string} [myObj.d]

//最后一行 {string} [myObj.d] 也可以修改为 {string=} myObj.d，不过感觉这种可读性比较差，不推荐这样使用
```

> 究竟使用哪种形式可根据个人喜好来选择。

<br>



**第3类：可空或非可空类型**

所谓“可空”的意思是：可能为空(null)

> 注意：是可空(null)，而不是未定义(undefined)

```
{?Number}
```

> 相当于 Number | Null

<br>



所谓 “非可空” 的意思是： 一定为该类型

```
{!Number}
```

> 对于目前较新版本的 jsdoc 来说，{!Number} 和 {Number} 是没有区别的，因此可以忽略这个知识点。

<br>



**第4类：参数数量类型**

```
@param {...Number} num
```

> 具体如何使用我也不清楚，暂时不讲解

<br>



**第5类：可选参数和参数默认值**

```
@param {Number} [foo=1]
```

<br>



## JSDoc注释规则

**提前说明：**

下面解释中出现的 “此成员” 是指本注释对应的对象，包括：接口、类、属性、方法、参数等等。

如果是明确针对特定对象的，则会直接使用该对象的具体类型名称，例如只针对函数，那么就直接写明 “此函数”，而不再使用 “此成员”。

<br>



JSDoc 的标签分为 2 种：

1. 块级标签
2. 内联标签

<br>



### 块级标签

所有的块级标签，必须独立占一行。



**@abstract 或 @virtual**

'abstract' 是抽象的意思，本标签意思是：此成员必须由继承者实现或重写



**@access**

指定此成员的访问级别，也就是此成员对应的修饰符(private、protected、public、package-private)



**@alias**

定义此成员的别名



**@async**

表明此函数是一个异步函数



**@augments 或 @extends**

表示继承



**@author**

明确项目作者



**@borrows**

此对象使用另外一个对象中的某个对象



**@callback**

表明这是一个回调函数

> 这个标签非常有用



**@class 或 @constructor**

表明这是一个类



**@classdesc**

类的描述文字信息

> 通常情况下 @classdesc  要与 @class 结合使用



**@const 或 @constant**

表明对象为常量



**@constructs**

此函数是某个类的构造函数的实例(实体)

> 当使用对象字面量形式来定义类时，可以用到该标签。
>
> 我个人的理解是，假设你使用 MyClass.prototype.constructor = someFun 时，那么就可以使用 @constructs 来给 someFun 添加标记，以此来对外表明 someFun 是某个类的构造函数。



**@copyright**

版权文字信息



**@default 或 @defaultvalue**

默认值



**@deprecated**

表明已弃用，不推荐继续使用



**@description 或 @desc**

完整的描述文字信息

> 与之对应的是简短的摘要信息 @summary



**@enum**

可枚举对象



**@event**

某个事件



**@example**

表明下面内容将是一个使用示例代码



**@export**

导出模块



**@external 或 @host**

表明这是一个外部类 或 命名空间 或 模块



**@file 或 @fileoverview 或 @overview**

描述一个文件



**@fires 或 @emits**

表明当前方法被调用时，将会触发一个指定类型的事件

> 使用 @event 来描述该事件的具体内容



**@function 或 @func 或 @method**

表明这是一个方法(函数)



**@generator**

表明该函数是高阶函数，也就是说函数内部返回另外一个函数

> generator 是 生成器 的意思



**@global**

表明这是一个全局对象



**@hideconstructor**

表明此构造函数不应该对外暴露出来，也就是说 “隐藏此构造函数”

> 具体使用场景，暂时还不清楚



**@ignore**

忽略此内容



**@implements**

实现某个接口



**@inheritdoc**

表明继承使用父类中的文档

> 如果子类中使用 @inheritdoc，那么子类的文档(包含描述、接口、类型、示例等信息)将直接使用父类的文档内容



**@inner**

表明这是一个内部的对象



**@instance**

表明这是某个类的实例



**@interface**

表明这是一个接口



**@kind**

用来表明什么样的标识符被描述

> 例如 "@kind class" 表明这将是一个 class 标识符，但实际中我们并不会这样定义，而是会直接使用 @class。类似的还有 "@kind module" ，我们直接使用 @module 即可。

> kind 这个单词的意思是：友善的、善良的



**@lends**

将一个字面量对象的所有属性标记为某个识别符



**@license**

此代码的许可证信息



**@listens**

监听某事件



**@member 或 @var**

声明变量(属性)



**@memberof**

表明此标识属于哪个父级标识



**@mixes**

此对象混合了(拥有)另外一个对象的所有成员



**@mixin**

表明会被混合(@mixes)的对象



**@module**

表明这是一个模块



**@name**

对象的名称



**@namespace**

命名空间



**@override**

表明此函数为覆盖(重写)父级函数



**@package**

包



**@param 或 @arg 或 @arguments**

表明这是函数的参数

> 通常情况下，我们会使用以下格式：
>
> @param {number} x - The x value xxxx.
>
> 也就是说格式为：@param + {参数类型} + 参数名字 + 参数描述文字



**@private**

修饰符 private



**@property 或 @prop**

表明这是对象的属性，@property 通常是和 @typedef 配合使用的。

> 请看示例 1：
>
> ```
> /**
>  * @typedef {Object} Event
>  * @property {string} type
>  * @property {string} [id] 
>  */
> ```
>
> 由于我们把属性 id 的属性名使用中括号 [] 包括，那么就表示 id 有可能不存在，因此上面代码表达的意思如下：
>
> ```
> type MEvent = {
>     type: string;
>     id?: string | undefined;
> }
> ```
>
> 注意：`@property {string} [id] ` 还有另外一种写法 —— 将属性名 id 不使用中括号，而是在类型中添加一个 等于号，即 `@property {string=} id `

>请看示例 2：
>
>```
>/**
>* @typedef {Object} MEvent
>* @property {string} type
>* @property {*} id 
>*/
>```
>
>上面代码中，我们将 id 类型设置为 *，代表这任意类型，也就是 TS 中的 any，因此上面代码表达的意思如下：
>
>```
>type MEvent = {
>   type: string;
>   id: any;
>}
>```
>
>当然你可以选择另外一种简写形式 `@property id`，由于并未定义类型是什么，那么 jsdoc 也认为 id 为 any 类型。 
>
>不过个人并不建议这样使用，因为不够直观，想表达 any 还是继续添加上 {*} 吧。

> 请看示例 3：
>
> ```
> /**
>  * @typedef {Object} MEvent
>  * @property {string} type
>  * @property {*} [id] 
>  */
> ```
>
> 在上面代码中，属性名 [id] 是可选的，属性值的类型 {*} 是 任意的，因此上面代码表达的意思如下：
>
> ```
> type MEvent = {
>     type: string;
>     id?: any;
> }
> ```

> 在上面示例中继承的对象是 Object，而在 JS 中默认对象都是 Object 因此第 2 项 {Object} 是可以省略掉的，即 `@typedef MEvent`

> `@typedef {Object} MEvent` 事实上相当于以下 2 行代码
>
> ```
> @typedef MEvent
> @type {Object}
> ```



<br>

**@protected**

修饰符 protected



**@public**

修饰符 public



**@readonly**

表明此对象为只读类型



**@requires**

表明此处需要 requrie 其他模块



**@return**

表明函数的返回值

> 具体用法为 `@return {xxx} yyy` 其中 xxx 即返回对象的类型，yyy 为该返回值的说明文字。
>
> > xxx 为必填、yyy 为选填
> >
> > xxx 既可以是 JS 内置的类型，也可以是我们自定义的对象类型
> >
> > 在实际使用中，我们可以把 xxx yyy 写成一模一样的，即 `@return {xxx} xxx`，例如：
> >
> > ```
> > class Element { ... }
> > 
> > this.items = { }
> > 
> > /**
> >  * @description: add item by id
> >  * @param {string} id
> >  * @return {Element} Element
> >  */
> > function addItem(id){
> >     items[id] = new Element()
> >     return items[id]
> > }
> > ```
> >
> > 在上面示例中，假设我们没有给 addItem() 添加 jsdoc 注释，那么默认会认为 addItem() 返回值为 any。
> >
> > 但是由于我们在 jsdoc 中明确指出 `@return {Element} Element`，那么当其他地方在调用这个函数时，VSCode 或 TS 便会自动推导出该返回值的类型为 Element，而不是 any。



**@see**

有关更多信息，请查阅其他文档

> @see 后面会跟着其他文档的链接地址或描述文字



**@since**

表明这个对象是在什么时候，或者什么版本时添加进来的



**@static**

表明此为类的静态成员(属性或方法)



**@summary**

简短的摘要文字信息

> 与之对应的是完整的描述信息 @description 或 @desc



**@template**

泛型

> 和 TS 中的泛型相同

示例：

```
* @template T
* @param {T} param
* @return {T}
```



**@this**

表明此处的 this 是指谁



**@throws 或 @exception**

抛出事件或错误



**@todu**

计划要完成的功能 或 任务

> 只是表明工作计划，但此时此刻并未完成



**@type**

对象的类型

> 注意，这些类型必须是 JS 内置的类型，例如字符串、数组等



**@typedef**

对象的自定义类型

> 这个对于习惯使用 TypeScript 的人来说，非常有用。具体用法参见 @property 中的示例



**@variation**

区分具有相同名称的不同对象

> 格式为 @variation + number，例如 “@variation 2” 表明该名称对象的第 2 中结构类型

> 通常情况下 @variatiion 不会单独出现，@variation 后面一定跟着新的一组语义标签



**@version**

记录项目的版本号



**@yields 或 @yield**

生成器函数生成的值

> JS 中 yield 对应的标签



### 内联标签

**{@link} 或 {@linkcode} 或 {@linkplain}**

链接到文档中的另外一项，也就是链接到文档的其他地方



**{@tutorial}**

插入教程文件的链接



**内联标签与块级标签的差别之处：**

1. 内联标签的值必须使用 `{ }` 包裹

   > 如果内联标签值中也包含 括号符号，则必须使用 反斜杠 \ 进行转义

2. 内联标签后面可以没有换行符，但块级标签后面必须有换行符

   > 换句话说，内联标签可以与块级标签位于同一行内，但块级标签必须单独占一行。



<br>



**如果每次都靠我们手工输入各种标签会很麻烦，推荐 VSCode 安装插件：koroFileHeader**

当我们写完 js 类、属性、函数 后，只需要将鼠标光标位于要添加 jsdoc 的代码行中，使用快捷键即可自动生成对应的各种标签，我们需要做的就是将各种标签信息进行完善。

**给 ‘此成员’ 添加 jsdoc 标签的快捷键为：**

1. window：ctrl+alt+t
2. mac：ctrl+cmd+t
3. linux: ctrl+meta+t

**给整个文档添加 jsdoc 标签的快捷键为：**

1. window：ctrl+alt+i
2. mac：ctrl+cmd+i
3. linux: ctrl+meta+i

> 当我们新建一个代码文件时，默认会自动添加头部信息



<br>



## JSDoc的使用方式

JSDoc 采用代码注释的形式，遵循 `/** xxx */` 格式。

**最简单的注释为：**

```
/** xxxxx */
```

其中文字 xxxxx 即我们要对该对象的描述信息。



**标准的注释形式：**

```
/**
 * xxxx
 * @xxx xxx
 * @xxx {@yyy yyy}
 */
```

> 上述代码中的
>
> 1. @xxx xxx 即对应的是块级标签
> 2. {@yyy yyy} 对应的是内联标签



通常情况下，我们并不需要完完整整的编写所有的 块级标签，例如你定义了一个 类，那么 JSDoc 会自动推断出对应的 @class 或 @constructor 等标签。



**一个简单类的 JSDoc 注释示例**

```
/** Class representing a point. */
class Point {
    /**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x, y) {
        // ...
    }

    /**
     * Get the x value.
     * @return {number} The x value.
     */
    getX() {
        // ...
    }

    /**
     * Get the y value.
     * @return {number} The y value.
     */
    getY() {
        // ...
    }

    /**
     * Convert a string containing two comma-separated numbers into a point.
     * @param {string} str - The string containing two comma-separated numbers.
     * @return {Point} A Point object.
     */
    static fromString(str) {
        // ...
    }
}
```



定义 Dot 继承于 Point：

```
/**
 * Class representing a dot.
 * @extends Point
 */class Dot extends Point {    /**
     * Create a dot.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     * @param {number} width - The width of the dot, in pixels.
     */
    constructor(x, y, width) {        // ...
    }    /**
     * Get the dot's width.
     * @return {number} The dot's width, in pixels.
     */
    getWidth() {        // ...
    }
}
```



如果不是类，而是模块，那么示例如下：

```
/** @module color/mixer */

/** The name of the module. */
export const name = 'mixer';

/** The most recent blended color. */
export var lastColor = null;

/**
 * Blend two colors together.
 * @param {string} color1 - The first color, in hexidecimal format.
 * @param {string} color2 - The second color, in hexidecimal format.
 * @return {string} The blended color.
 */
export function blend(color1, color2) {}

// convert color to array of RGB VALUES (NULL, green, and blue values of a color.
     * @function
     * @param {string} color - A color, in hexidecimal format.
     * @returns {Array.<number>} An array of the red, green, and blue values,
     * each ranging from 0 to 255.
     */
    rgbify as toRgb
}
```



<br>



## JSDoc的第三方模板或工具

**第1类：API 文档模板**

如果你不想使用 JSDoc 提供的默认 API 文档模板，那么也可以使用第三方提供的模板。

1. jaguarjs-jsdoc
2. DocStrap
3. jsdoc3Template
4. minami
5. docdash
6. tui-jsdoc-template
7. better-docs

具体使用哪个模板，以及如何使用，可直接在 NPM 上查找对应的包介绍文档。



**第2类：构建时的工具**

就是在执行 build 过程中，第三方提供的工具。

1. JSDoc Grunt plugin
2. JSDoc Gulp plugin



**第3类：导出 API 文档的文件类型**

默认 API 文档为 html，而通过以下工具，可以将 API 文档格式改为对应的文件格式。

1. jsdoc-to-markdown
2. Integrating GitBook with JSDoc



<br>

## JSDoc解决函数名与命名空间冲突的技巧

假设我们有这样一段代码：

```
function myFun(str){
  console.log('myFun: ' + str)
}

myFun.innerFun = function(str){
  console.log('myFun.innerFun: ' + str)
}

export default myFun
```

> 你不要怀疑为什么要这样写，因为很多知名 JS 类库源码中，就会有这种写法。



<br>

**你会怎么写 JSDoc？**

你可能会想应该这样写：

```
/**
 * @param {String} str
 * @returns {Void} void
 */
function myFun(str){
  console.log('myFun: ' + str)
}

/**
 * @param {String} str
 * @returns {Void} void
 */
myFun.innerFun = function(str){
  console.log('myFun.innerFun: ' + str)
}
```

> 这种写法转换为 .d.ts 后会是以下内容：
>
> ```
> /**
>  * @param {String} str
>  * @returns {Void} void
>  */
> export function myFun(str: string): void;
> ```
>
> 可以看到 myFun 作为函数来说已经正确导出来了，但是 myFun.innerFun 却没有正确导出。
>
> 因为 JSDoc 认为 myFun 是一个函数，所以忽略了它作为命名空间的相关代码。



<br>

更换思路，改成这样：

```
/** @namespace myFun */

/**
 * @function
 * @param {String} str
 * @returns {Void} void
 */
function myFun(str){
  console.log('myFun: ' + str)
}

/**
 * @memberof myFun
 * @param {String} str
 * @returns {Void} void
 */
myFun.innerFun = function(str){
  console.log('myFun.innerFun: ' + str)
}
```

> 这种写法转换为 .d.ts 后会是以下内容：
>
> ```
> export namespace myFun {
>     /**
>      * @param str
>      * @returns void
>      */
>     function innerFun(str: string): void;
> }
> ```
>
> 可以看到 myFun 作为命名空间已经正确导出来了，myFun.innerFun 可以被正确访问使用，但是 myFun 作为函数来说却没有正确导出。
>
> 因为当 JSDoc 认为 myFun 是一个命名空间，所以忽略了它作为函数的相关代码。



<br>

鱼与熊掌不可兼得？！



<br>

**分析一下我们遇到的问题：**

在上面代码中，我们可以看到：

1. `myFun` 是一个函数名

2. `myFun` 也是一个命名空间

   > myFun.innerFun 隐含的意思就是：
   >
   > 1. 有一个命名空间 myFun
   > 2. 在该命名空间中，有一个函数 innerFun

由于 myFun 既是函数名，同时也是命名空间，2 者冲突了。

如果我们去构建 .d.ts 文档，那么 JSDoc 无法理解 2 者究竟怎么一回事。

准确来说就是 JSDoc 无法理解 myFun 什么时候该是函数名，什么时候该是命名空间。



<br>

**正确的解决方案：**

通过不懈努力，终于找到了解决方案：

https://groups.google.com/g/jsdoc-users/c/1Md5S8j2ZI4

> 这是 2011 年时候的一个帖子

<br>

JSDoc 竟然有一个如此让人惊掉下巴的操作方式：通过添加 `(1)` 的方式告知 JSDoc 函数名和命名空间的区别。

> 如果你愿意，还可以使用 (2)、(3)...



<br>

同时配合 @function、@memberof 标签，最终正确的 JSDoc 注释代码为：

```
/**
 * @function myFun
 * @param {String} str
 * @returns {Void} void
 */
function myFun(str){
  console.log('myFun: ' + str)
}

/** @namespace myFun(1) */

/**
 * @function innerFun
 * @memberof myFun(1)
 * @param {String} str
 * @returns {Void} void
 */
myFun.innerFun = function(str){
  console.log('myFun.innerFun: ' + str)
}
```

> 在编译过程中，我们通过 myFun 和 myFun(1) 来告知 JSDoc 他们谁是函数，谁是命名空间。
>
> 但是编译结束后，JSDoc 会把 myFun(1) 中的 (1) 自动删除掉，最终实现了函数和命名空间共存。

<br>

当执行编译，得到 .d.ts 内容为：

```
/**
 * @param {String} str
 * @returns {Void} void
 */
export function myFun(str: string): void;

export namespace myFun {
    /**
     * @param str
     * @returns void
     */
    function innerFun(str: string): void;
}
```

既有 myFun 这个函数，同时也有 myFun 这个命名空间，myFun.innerFun() 也可以正常使用了。

完美解决！
