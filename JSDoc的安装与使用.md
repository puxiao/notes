# JSDoc的安装与使用

JSDoc 是一个  NPM 包，主要帮我们做 2 件事情：

1. 根据符合 JSDoc 规则的注释内容，自动将我们的代码生成对应的 API 文档

   > JSDoc 注释规则，我们会在本文后面讲解

2. TypeScript 可以识别出符合 JSDoc 规范的注释内容，并将该注释内容自动推断出对应的类型。

   > 意味着我们可以在不添加 .d.ts 文件的前提下，让 TS 知道 .js 的类型结构



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



## JSDoc注释规则

**提前说明：**

下面解释中出现的 “此成员” 是指本注释对应的对象，包括：接口、类、属性、方法、参数等等。

如果是明确针对特定对象的，则会直接使用该对象的具体类型名称，例如只针对函数，那么就直接写明 “此函数”，而不再使用 “此成员”。



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

表明这是对象的属性



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



