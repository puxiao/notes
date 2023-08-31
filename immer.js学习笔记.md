# immer.js学习笔记

**目录：**

* immer.js 简介
* immer 核心思想与背景知识
  * JSON指针、JSON补丁
  * immer.js 在 JS 中具体靠什么实现的
* immer.js 的基本用法
  * 安装、启用
  * produce 函数
  * 柯里化
  * 在 react hooks 中使用 immer
* immer.js 其他 API 用法
* zustand 中使用 immer
  * 使用原生的 immer.js
  * 使用中间件 immer



<br>

## immer.js简介



### 简介

<br>

官方教程与文档：https://immerjs.github.io/immer/zh-CN/

源码仓库：https://github.com/immerjs/immer



<br>

**名字含义：**

immer 这个单词源于德语，相当于英语单词 always (总是)，谷歌翻译为 "沉浸" 略有偏差，总之你记住它含义是 "总是" 即可。



**"总是"？**

immer 用于编写可持久化和不可变数据结构。



<br>

**可持久化：**

实际上内涵的是将数据状态以 json 化的形式保存起来



可持久化并不是 immer 的核心点，不可变数据结构 才是 immer 的核心点。

<br>

**啥叫 "不可变数据结构" ？**

简单来说 "不可变" 是指每次修改数据状态时都不直接修改原始的数据状态，而是通过记录本次修改的内容，相当于创建了一个 "数据补丁" 的方式创建了一个新的 数据状态副本。

用更加直白的话语来描述就是：每次都创建一个数据状态副本，只记录本次都修改哪些内容了，对于之前数据状态中那些没有变化的状态不做任何新的 “新建、备份或克隆”。



<br>

**再再再更加简单点的解释就是：就像 git 那样**

* 每一次 git 提交都只记录当前修改哪些内容了
* 但每一次拉取都可以获取完整的、最新的内容
* 也可以回溯到之前任意一次提交状态中



<br>

拿 git 来举例，是不是一下就理解 immer 中 "不可变数据结构" 的含义了。

> 不是不可以改变数据状态，而是每次改变只都记录改变的，不改变之前的。



<br>

### 对于 JS 编程而言 不可变数据结构 思想有什么好处？或者说它用于解决哪些困境？

假定我有一个 待做事项(toduList) 的数据状态：

```
interface TodoItem {
    id: number
    title: string
    done: boolean
}

const todoList: TodoItem[] = [
    { id:1, title: '学习 typescript', done: true},
    { id:2, title: '学习 immer.js', done: false}
]
```



<br>

那么以后我对于 todoList 这个对象一定存在以下几种操作：

* 增：增加新的待做事项
* 删：删除某些待做事项
* 改：修改某些待做事项
* 查：按照某些条件查询待做事项

也有可能是多个组合操作：

* 删除或修改某个待做事项，并新加入一条待做事项
* ...



<br>

没错，上述就好像一个小型数据库操作一样。



<br>

**假定我需要记录每一次对 todoList 的操作，并且实现撤销、重做功能。**

首先你肯定想到的使用 命令模式 来实现。

命令模式肯定可以，但命令模式并不是没有缺点：

* 缺点1：需要针对每一种操作都创建一个命令，略显臃肿复杂
* 缺点2：无法做到 N 次组合操作合并成一个命令，或者说想实现起来比较复杂

除了命令模式的一些 "缺点"，我们还需要面临 JS 的另外一个特性：它不是面对对象编程语言

* 你无法精准控制某些数据状态的属性为只读

* 你也无法精准控制 别人或者自己在某些不起眼的地方直接操作修改 数据状态

  > 例如绕开了 命令，直接对 todoList 进行修改
  >
  > todoList[2].done = true



<br>

上面那些面临的困境，则可以通过 immer "不可变数据结构" 思想来解决。

特别说明：immer 也仅仅适用于一些简单的数据场景上的 撤销/重做，对于复杂的还依然需要靠 命令模式。



<br>

**在本文中，我们需要学习：**

* immer 核心思想与背景知识
* 针对原生 JS 的 immer.js：`yarn add immer`
* 针对 React hooks 的 user-immer：`yarn add use-immer`
* 针对 zustand 的中间件 immer：`import { immer } from 'zustand/middleware/immer'`



<br>

> 实际上前 2 项：immer 核心思想与背景知识、immer.js 才是我们真正要学习的
>
> 后 2 项：use-immer 与 zustand 中间件 immer 只不过是实际应用而已



<br>

不同语言的编程思想都是相互借鉴抄袭的，immer 也有 c++ 版，immer.js 某种程度上也是借鉴。

> immer c++ 版：https://github.com/arximboldi/immer



<br>

## immer 核心思想与背景知识



<br>

关于 immer 最核心的思想 "不可变数据结构" 在上一节已经讲解过了，本小节重点讲一下：

* immer.js 背后知识点涉及的 2 个 JSON 规范：JSON指针、JSON 补丁
* immer.js 在 JS 中具体是靠什么实现的



<br>

### 名词解释：JSON指针、JSON补丁



<br>

**JSON指针 英文为 JSON Pointer，它遵循 RFC6901 标准，使用字符串形式去查找定位 JSON 中某个节点属性值。**

FRC6901标准详细规范：https://datatracker.ietf.org/doc/html/rfc6901



<br>

**简单示例：**

假定我们有一个 JSON：

```
{
    "me": [ "yang", "info":{ "age": 37, "name":"puxiao"} ]
}
```

那么按照 JSON 指针 规范，我们可以使用下面的 字符串 来定位到某个具体节点的值：

```
"/me" -> 属性名为 me 的值 [ "yang", "info":{ "age": 37, "name":"puxiao"} ]
"/me/0" -> me 的第0个元素(假定我们知道 me 为数组)，即 "yang"
"/me/1/age" -> me 的第1个元素的 age 属性值，即 37
```



**特别补充：`/`不是指整个 JSON 内容**

从上面示例 `/me`、`/me/0` 你可能以为 `/` 是不是值整个 JSON 的内容 `me:[...]`，答案是否。

`/`并不指整个 JSON 根目录，`/`是指 "空字符串"：

```
{
    "me": [ "yang", "info":{ "age": 37, "name":"puxiao"} ],
    "": "hello",
    " ": "immer"
}
```

```
"/" -> 会得到 "" 对应的值，即 "hello"
"/ " -> 会得到 " "对应的值，即 "immer"
```

**而真正指 JSON 整个根属性值的字符是 `""`**

```
"" -> 空格字符可以定位整个 JSON 值，即 { "me": [ ...], "": "hello" }
```



<br>

**另外由于 `~` 和 `/` 本身在 JSON 中有特殊含义，所以它们可以由以下字符代替：**

* ~  由 "~0" 代替
* / 由 "~1" 代替



<br>

关于 JSON 指针更加详细的规范用法，暂时也用不到，也无需学习，只需知道上面最简单的基础概念用法即可。



<br>

**JSON补丁 英文为 JSON Patch，它遵循 RFC6902 标准，通过一个 JSON 文档来记录另外一个 JSON 文档中的数据修改描述。**

FRC6902标准详细规范：https://datatracker.ietf.org/doc/html/rfc6902



<br>

**你需要知道的是：**

* JSON 补丁中通过 JSON 指针 来对修改内容进行定位，即它内部也使用到了 RFC9601 标准。

* JSON 补丁在网络传输时有特定的内容类型(Content-Type)：`application/json-patch+json`

  > 你没看错是 `json-patch+json` 不是 `json-patch-json`



<br>

**JSON补丁中的操作关键词：**

* "test"：测试某个值是否符合预期
* "add"：增加
* "remove"：删除
* "replace"：替换，即修改
* "move"：移动，实际上相当于 属性重命名
* "copy"：复制



<br>

**JSON补丁的文档结构：**

* JSON 补丁的内容为一个数组，数据包含若干条操作描述

* 每一个操作描述的格式都是固定的，都由 `op、path、value、from` 属性组合而成

  > 无论什么操作 "op"、"path" 这 2 个属性一定是存在的



<br>

**JSON补丁示例：**

假定我们目前的 JSON 内容为：

```
{
    "skill": [ "js","ts"],
    "info":{ "age": 37, "name":"puxiao" }
}
```

增加某个属性值：

```
[
  { "op": "add", "path":"/me/info/gender", "value": "male"}
]
```



<br>

**代码释义：**

* "op"：本次要进行的操作类型为 "add"(添加) ，除此该值还可是："test"、"remove"、"replace"、"move"、"copy"

  > op 是单词 operation 的简写，operation 单词意思为 "操作、活动、运算"

* "path"：定位，即本次要操作的属性节点

  > `/me/info/gender` 向 "/me/info" 增加 "gender" 属性名

* "value"：对应的值



<br>

**以此类推，大概也能看懂下面的操作含义了：**

```
[
  { "op": "test", "path": "/me/skill/0", "value": "js" },
  { "op": "remove", "path": "/me/skill/1" },
  { "op": "add", "path":"/me/info/gender", "value": "male"}
  { "op": "replace", "path": "/me/info/age", "value": 18 },
  { "op": "move", "from": "/me/info", "path":"/me/about"},
  { "op": "copy", "from": "/me/about", "path": "/me/aboutme"}
]
```

上面操作命令依次为：

1. 验证 "/me/skill" 第 0 项的值是否为 "js"，如果不是则直接抛出错误，并终止后续操作，并将本次补丁视为整体操作失败。
2. 删除 "/me/skill" 第 1 项的值
3. 向 "/me/info" 增加属性 "gender"，值为 "male"
4. 将 "/me/info/age" 的值修改为 18
5. 将之前的 "/me/info" 属性名 "info" 修改为 "about"，即 "/me/about"
6. 将 "/me/about" 拷贝一份并命名为 "/me/aboutme"

最终得到的 json 内容为：

```
{
    "skill": [ "js" ],
    "about": { "age": 18, "name":"puxiao", "gender":"male" },
    "aboutme": { "age": 18, "name":"puxiao", "gender":"male" }
}
```



<br>

**补充说明：**

"test" 通常用来验证 JSON 补丁是否符合预期规范。

举个例子，假定 JSON 中存在一个属性：version(版本号) ，那么就可以通过 test 来判断版本号是否符合预期，不符合则不执行后续的补丁操作。



<br>

关于 JSON 指针 (JSON Pointer)、JSON 补丁(JSON Patch) 我们有一个基础了解就行。

它俩仅仅是 immer 的一个背景知识，在 immer 内部已经帮我们做了相应处理，我们在实际使用 immer.js 时是无需过多关心它们的。



<br>

关于它俩的学习到此为止。

**强调一点：JSON 补丁 仅仅是 immer.js 的一个背景知识，immer.js 所产生的补丁与 JSON 补丁还是有差异的！**

主要体现在 path 值的具体形上，具体差异我们会在后面讲解 applyPatches 函数时提及。



<br>

### immer.js 具体是靠什么实现的？



<br>

**先学习几个相关单词：**

immer：总是

**draft**：草稿

**mutations**：突变、变动

**produce**：生产

producer：生产者

**patch**：补丁

patches：补丁的复数

oriiginal：原始的、原来的

cast：投掷、投射、转换

**immutable**：不可变的

**freeze**：冻结

freezing：冷冻中

recipe：配方，在 immer 语境中是指 "具体的修改操作"

strict：严格的

**inverse**：相反的

Map：在 JS 中 Map 应该翻译为 图

Set：在 JS 中 Set 应该翻译为 集



<br>

**immer 运行基本流程：**

* 先知道当前状态 currentState
* 创建一份当前状态的代理者，准备充当草稿(draft)
* 将所有的变更(mutations)应用在这份草稿(draft)中，得到 nextState
* 至此，在保留之前状态 currentState 的前提下还得到了修改后的状态 nextState
* 另外那个代理还有另外一个功能：禁止绕过 immer 直接修改状态属性，对数据状态进行一些保护

简单来说就是：当前状态 -> 代理 + 草稿 -> 新状态

你可以把 immer 想象成一个助理，他来帮你完成上述过程中的 记录当前状态、记录所有修改、草稿修订、重新誊抄 等实际细节工作。并且该助理还有文件保护意思，只听你的话，禁止其他人不通过你来偷偷修改手中的文件。



<br>

**immer.js 核心点就是：Object 的 freeze() 方法**

因为上面的讲述中，保证 immer 可以按照预期工作的一个核心点是充当一个代理：

* 保证数据状态不能被其他人私自修改，必须通过 immer 修改才可以
* 将每一次修改(一次修改实际包含多条修改命令)通过代理应用到草稿之上

而代理的核心 JS 实现方式就是 Object 的 freeze() 方法。

freeze() 用法细节：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze



<br>

我们也无需阅读 immer.js 源码，反正你只需知道大体实现技术点即可：补丁 + Object.freeze

接下来开始学习 immer.js 的具体使用。



<br>

## immer.js 的基础用法



<br>

前面提过 immer.js 实际分为：

* 针对原生 JS 的 immer.js
* 针对 React hooks 的 use-immer
* 针对 zustand 的中间件 immer

我们先从 immer.js 开始讲起。



### 安装immer.js

<br>

**NPM包安装：**

```
yarn add immer
```

> 当前 immer 最新版本为 10.0.2



<br>

或 CDN 引入方式：

```
<script src="https://unpkg.com/immer"></script>
```



<br>

**有选择性得引入启用某些功能：**

由于 immer.js 希望本身足够小，所以一些功能需要我们自己根据情况来决定是否引入并启用，这些功能分为：

* 是否引入对 ES5 支持

  > 这一项可以忽略，毕竟现在开发都只考虑现代浏览器，不需要考虑老旧版浏览器

* 是否引入支持 Map 和 Set

  > 如果你确定你的数据状态中使用了 Map 或 Set，那你就需要引入该项

* 是否引入对 补丁的支持

  > 如果你的数据状态可能需要做 历史记录/撤销/还原，那么你需要引入该项

  > 注意：这里说的 补丁 是指 immer.js 的数据补丁，其思想和 JSON 补丁相同，但又略微有一点差异。



<br>

**引入启用代码：**

首先我们需要知道：

* 启用 ES5 对应的是：enableES5
* 启用 Map 和 Set 对应的是：enableMapSet
* 启用 补丁对应的是：enablePatches

想要启用哪一项，就在 **整个项目的入口程序 js** 中 引入并执行相应函数。

例如启用 Map 和 Set：

```
import { enableMapSet } from "immer"
enableMapSet()
```

然后就可以在具体的 **子模块 js** 中的 immer 使用 Map 或 Set 了。

在 immer.js 中操作的 Map 和 Set 会被天然视为外部不可操作、变更。

假定不通过 immer 来去尝试 set()、clear() 等改变方法时会报错，抛出异常。 



<br>

**补充说明：**

按照官方文档的说法，immer.js 本身才 3K，每启用一项体积增加 1K。

换句话说就算把上述 3 项都启用也无非 5K 而已，作为前端项目几乎可以忽略的。



<br>

安装 immer.js 和启用某些功能模块已经知道了，那么接下来就开始真正学习用法。



<br>

### 最基础关键的函数：produce



<br>

**引入produce函数：**

由于 immer 内部引入了 produce 函数，同时也将其作为 default 导出，所以下面 2 种引入方式都是可以的。

```
import produce from 'immer'
```

或者：

```
import { produce } from 'immer'
```

> 我个人更偏向使用这种形式



<br>

**使用produce函数：**

```
produce(
    currentState, 
    recipe: (draftState) => void, 
    callback?: (patches, inversePatches)=> void
): nextState
```

> 回顾一下之前学习的单词：
>
> produce(生产)、recipe(配方)、draft(草稿)



<br>

**produce函数释义：**

* 第1个参数为 当前数据状态

* 第2个参数为 recipe，直译是 配方，即本次 "修改的操作细节"，是一个箭头函数

* 该箭头函数参数为 draftState(还未修改前的草稿)

* 在该箭头函数内部可以将各种修改操作应用在 draftState 之上

* 第3个参数为一个可选的回调参数，该回调参数中有 2 个回调参数

  * patches：本次操作所对应的 补丁
  * inversePatches：本次操作的恢复补丁，本次操作的相反操作

  > 使用第 3 个参数的前提是你需要先启用 补丁
  >
  > 如果有需要，你可以在外部定义 2 个数组，用来存放每一次操作产生的补丁(patches)和恢复补丁(inversePatches)，以备将来 撤销/重做 使用。

  > 关于第 3 个参数的详细用法，我们会在后面讲解 applyPatches 函数时演示，我们暂时先忽略第 3 个参数。

* 最终 produce 函数最终返回一个修改过后的，新的 数据状态 nextState

<br>



<br>

**关于draftState命名说明：**

在上面的 produce 使用套路中我们将 recipe 的箭头函数参数名定义为 draftState，它只是一个参数名而已，你可以使用任何自己喜欢的变量名，例如直接写成 draft。

但！我个人强烈不建议你使用 oldValue  或 oldState 这类词语作为变量名。

因为该参数在箭头函数体内部，不仅仅表达 "之前的数据状态中已存在的属性操作"，它还可以表示 "那些原本不存在的属性"，所以如果使用 oldValue 或 oldState 会容易产生歧义。

draft 所对应的 "草稿、草案" 含义更加贴切。

> 在本文后面的代码中将继续使用 draft 或 draftState 来作为参数名



<br>

**但是在与 React 的 useState 结合使用时，draft 又与 oldState 确实含义很像。**



<br>

**produce基础示例：**

```
import { produce } from 'immer'

const baseState = [
    { id:1, title: 'learn js', done: true},
    { id:2, title: 'learn immer', done: false }
]

const nextState = produce(baseState, draft => {
    draft[1].done = true
    draft.push( { id:3, title:'learn ts', done: false } )
})
```



<br>

### 使用柯里化来简化代码



<br>

**柯里化简介：**

柯里化(currying) 是一种函数式编程技术，将一个带有多个参数的函数转化成一系列接受单一参数的函数。

简单来说就是函数内部返回另外一个函数，作为下一次要执行的函数，去结合下一个参数，依次执行。

这算是 JS 的一个基础知识，不做过多讲解。



<br>

**produce 柯里化示例：**

还是之前的示例代码，假定我们定义一个专门用来将某个 id 的 done 设置相反的开关函数 toggleDone。

```
import { produce } from 'immer'

const baseState = [
    { id:1, title: 'learn js', done: true},
    { id:2, title: 'learn immer', done: false }
]

const toggleDone = (state, id) => {
    return produce(state, draft => {
        const item = draft.find(item => item.id === id)
        if(item){
            item.done = !item.done
        }
    })
}

const nextState = toggleDone(baseState, 2)
```

> * toggleDone 接收 2 个参数：baseState 和 要修改的 id
> * 在 toggleDone 内部会将这 2 个参数传递给 produce()
> * 并将 produce() 的返回值作为作为自己的返回值返回出去
> * 对外界而言，只需调用 toggleDone() 即可，简化了一些代码



<br>

上面中柯里化简化代码的形式，特别适用于仅执行某些特定(固定)操作。

相当于是对 produce() 的一些封装。



<br>

### 在React hooks中使用 immer

假定我们在 React  hooks 中使用 useState 来定义数据状态，结合 immer 的 produce 可以简化一些复杂对象的深度更新。

举一个简单例子：

```
import { useState } from 'react'
import { produce } from 'immer'

const [todos, setTodos] = useState([
    { id:1, title: 'learn js', done: true},
    { id:2, title: 'learn immer', done: false }
])

...

const handleXxx = () => {
    setTodos( produce( draft => {
        ...
    }))
}
```



<br>

上面这样写没有一点问题，但是 immer 官方为我们提供了更加简化的写法：useImmer



<br>

**安装针对 react hooks 的 use-immer 包：**

```
yarn add use-immer
```

我们可以使用 useImmer 来替代 useState 以简化上述代码：

```diff
import { useState } from 'react'
- import { produce } from 'immer'
+ import { useImmer } from 'use-immer'

- const [todos, setTodos] = useState([
+ const [todos, setTodos] = useImmer([
    { id:1, title: 'learn js', done: true},
    { id:2, title: 'learn immer', done: false }
])

...

const handleXxx = () => {
-    setTodos( produce( draft => {
+    setTodos( draft => {
        ...
    }))
}
```



<br>

**我们可以看到：**

* 直接使用 useImmer 代替 useState

* 简化后的代码 setTodos 用法和之前使用 useState 回调函数那种更新方式颇有几分相似，只不过不需要在函数内部 return newState

  > useState 回调函数方式更新的用法套路：setTodos( (oldValue) => { return newState } )



<br>

**另外一个平替函数：useImmerReducer**

上面示例我们使用了 useImmer 去代替  useState，在 react hooks 中还有另外一个钩子函数 useReducer，它对应的 immer 代替函数是 useImmerReducer。

useImmerReducer 实际上也只不过是 useReducer + produce 的一种简化函数。

由于我个人实际项目中 useReducer 本身用的就不多，所以这里也不举例了。



<br>

好了，至此，我们已经对 immer.js 和 use-immer 已经有了最基础用法的学习。



<br>

## immer.js 其他API用法



<br>

前面虽然讲了很多，但实际就是一个简单的 produce()  函数用法。

接下来开始学习 immer.js 中其他一些 API 的用法。



<br>

**immerable：用在自定义类(Class)中，用于标记该类的属性仅 immer 可操作变更**

对于普通 Object对象、数组、Map 和 Set 天然就会被 immer 标记(视作) "杜绝外部直接修改，仅自己可操作"。

> 提醒：对于 Map 和 Set 需要先在入口文件中引入并启用 enableMapSet

<br>

而对于自定义类(Class) 则需要我们手工去添加 immerable 属性作为标记。

```
import { immerable } from "immer"

class Foo {
    [immerable] = true //方式 1
    
    constructor(){
        this[immerable] = true //方式 2
    }
}

Foo[immerable] = true //方式 3
```

> 以上 3 种方式任选其一即可



<br>

**isDarft 与 isDraftable：**

* isDarft：用于判断给定对象是否是 draft 对象
* isDarftable：用于判断 immer.js 是否能将该对象变成 draft



<br>

**freeze(obj,deep?)：**

immer.js 提供的冻结函数，用于冻结 darft 对象。

默认情况下为浅冻结，即只冻结最外层属性，若第 2 个参数 为 true 则执行深层冻结。



<br>

**setAutoFreeze( boo:boolean )**

上面我们说了 immer 会自动冻结一些对象，让外部不可以修改其属性值。

但是假定你不想自动冻结，那么你可以通过 setAutoFreeze() 函数来显示控制是否可以自动冻结。

```
import { setAutoFreeze } frome 'immer'

setAutoFreeze(false) //显示控制以后不再自动冻结了
```



<br>

**nothing：一个特殊 undefine 的标记**

我们先看下面的代码：

```
let state = { ... }
prodcue(state, draft => { })
```

* 我们声明了一个变量 state，并且给他设置一些属性值
* 正常情况下我们都使用 draft => {} 来对其进行一些修改操作

我们知道在 draft => { } 函数中是不需要写返回值的，同时我们也知道 JS 中一个函数没有明确写返回值意味着默认会自动返回 undefine。

上述本身是没有任何问题的，但是假定有一个特殊情况：我希望将 state 设置为 undefind 又该怎么实现呢？

你当然不可以直接去设置 state = undefind，因为 state 已经被 immer 保护起来了，外部直接修改会报错误。

在面对这种情况时，就用到了 nothing 了。

```
import { produce, nothing } from 'immer'

let state = { ... }
prodcue(state, draft => { return nothing })
```

由于 nothing 可以看做是 immer 一个 undefind 的特殊平替，那么 state 就被设置为 undefind 了。

> 不过说实话暂时想不出什么场景需要这样搞。



<br>

**original 与 current**

```
import { current, original, produce } from 'immer'
```

正常情况下，我们的代码可能是这样的：

```
const newState = produce(draft => {
    //各种针对 draft 的操作
    ...
})
```

假定上面代码中会对 draft 有 10 个操作，那么在某些场景，例如调试场景，我希望在执行完第 5 个操作后：

* 我想得到在未做任何修改前的数据状态
* 我想针对当前已修改 5 条操作后的数据状态做一个快照(备份)

那么上面 2 个需求刚好对应 original 和 current 这 2 个函数：

```
const newState = produce(draft => {
    //针对 draft 的前 5 个操作
    ...
    
    const orig = original(draft) //未修改前的数据状态
    const copy = current(draft) //当前已修改的数据状态的快照(备份)
    
    //继续后面针对 draft 的剩下 5 个操作
    ...
})
```

> 注意：上面定义的变量 orig 和 copy 都仅存在于箭头函数内部，他会随着垃圾回收而消亡。



<br>

**applyPatches：应用补丁**

在之前讲解 produce() 函数时只是简单提了一下它的第 3 个参数。

那么我们现在编写一个简单示例：

```
//首先需要在入口文件中启用 补丁
import { enablePatches } from 'immer'
enablePatches()


//具体模块
import { produce } from 'immer'

...

const changes = [] //定义一个数组，用来记录修改记录
const inverseChanges = [] //定义一个数组，用来记录逆向的修改记录

...

let nowState = produce(
    currentState, 
    draft => { ... },
    (patches, inversePatches) => {
        changes.push(...patches)
        inverseChanges.push(...inversePatches)
    }
)
```

> 注意我们在上面代码中使用的是 let，并且将新状态命名为 nowState，为什么这样做后面会看明白用意的。



<br>

**特别补充：**

* patches 和 inversePatches 都是一个数组，每个元素都是一条修改描述
* 上面的代码实际相当于把每一次修改涉及的 N 条修改描述展开后存放到对应数组里
* 如果你强调 "每一次修改" 而不是 "每一条修改描述" ，那么你也可以不使用 ... 将其展开，而是直接将 patches 和 inversePatches存放起来，只不过你将来使用 applyPatches 时需要将其数组展开。



<br>

假定经过若干次数据状态修改，我们已经得到了 changes 和 inverseChanges 记录，那如何使用这些记录呢？

答：就需要用到我们要学习的 applyPatches 函数了。



<br>

**applyPatches 函数的用法：**

> 撤销：将之前记录的 inverseChanges 作为参数，以便恢复数据状态

```
nowState = applyPatches(nowState, inverseChanges)
```



<br>

> 重做：根据之前记录的 changes 将数据状态重新执行一遍修改

```
nowState = applyPatches(nowState, changes)
```



<br>

applyPatches() 执行完后会返回 撤销或重做 后的数据状态结果。

这就是 applyPatches() 函数的用法。



<br>

**immer.js 在 produce 函数中第 3 个参数所返回的 补丁 不保证是最优的(最精简优化后的)。**



<br>

**关于 immer.js 所产生的 数据补丁 与 JSON 补丁的差异说明：**

* immer.js 每一条补丁的 path 值并不像  JSON 补丁那样是字符串，而是一个数组，数组每一个元素对应一个关键节点名

* 如果你想将 immer.js 中补丁的 path 转化成 JSON 补丁中的 path，直接用 "/" 符号拼接数组即可

  ```
  patch.path = patch.path.join("/")
  ```

差异仅此而已。



<br>

**produceWithPatches：针对 produce 和 获取补丁的简化函数**

在上面讲解中，我们从 produce 函数的第 3 个参数中获取本次操作的补丁，immer.js 为我们提供了简化版。

* 使用 produceWithPatches 函数来替代 produce 函数
* produceWithPatches  函数的返回值为一个数组：[ nextState, patches, inversePatches ]

额~ 实际上 produceWithPatches 函数只不过将原本 prodcue 的第 3 个参数中的值作为 返回值直接返回了。



<br>

**setUseStrictShallowCopy：**

可用于启用严格的浅拷贝。 如果启用，immer 会尽可能多地拷贝不可枚举属性。

具体这个函数也没使用过，所以暂时先忽略掉它。



<br>

**createDraft、finishDraft：**

这是 2 个底层函数，它俩是给那些基于 immer.js 的第三方类库使用的。

日常中我们使用不到，也不学习了。



<br>

至此，关于 immer.js 绝大多数 API 我们都学习了解了。

就目前而言，对我们真正可能频繁使用到的无非以下几个：

* 启用相关：enableES5、enableMapSet、enablePatches
* 核心：produce、produceWithPatches、applyPatches
* React hooks 相关的：useImmer、useImmerReduex



<br>

## zustand 中使用 immer



<br>

终于来到了最终的环节，在 zustand 中使用 immer 了。

关于 zustand 可查阅我写的：[zustand学习笔记.md](https://github.com/puxiao/notes/blob/master/zustand%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)



<br>

在 zustand 中一共有 2 种使用 immer 的方法：

1. 使用原生的 immer.js
2. 使用 zustand 中间件 immer



<br>

### 使用原生的 immer.js

<br>

**我们利用原生 immer.js 中的 produce 来帮我们减少对象深层操作。**

假设我们有这样一个数据状态：

* 管理一个多层级数据状态：lush.forest.contains.a = 'bear'
* 包含有一个 clearForest() 函数用于将 lush.forest.contains 设置为 null

我们的代码可能如下：

```
const useLushStore = create((set,get)=>({
    lush: { forest: { contains: { a: 'bear' } } },
    clearForest: () => {
        const lush = get().lush
        lush.forest.contains = null
        set(lush)
    }
}))
```



<br>

如果使用 immer.js 则代码可以改成：

```
yarn add immer
```

```
import { create } from 'zustand'
import { produce } from 'immer'

const useLushStore = create((set,get)=> ({
    lush: { forest: { contains: { a: 'bear' } } },
    clearForest: () => set( produce((state) => {
        state.lush.forest.contains = null
    }))
}))
```



<br>

可能这个例子似乎也没有特别体现出 immer.js 的好处。



<br>

### 使用中间件 immer

上面讲了 zustand 使用原生 immer.js ，需要安装 immer.js、需要引入 produce、需要使用 set + produce 函数 来修改数据状态。

为了精简上述代码，于是有了 zustand 中间件 immer。

**没错 zustand 的中间件 immer 就是为了简化 zustand 使用原生 immer.js。**



<br>

**具体如何精简？**

和 zustand 其他中间件一样，只需让中间件 immer 包裹住原本要定义的 (set)=>({ ... }) 即可。

举个例子：

```
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useLushStore = create(immer((set,get)=> ({
    lush: { forest: { contains: { a: 'bear' } } },
    clearForest: () => set( (state) => {
        state.lush.forest.contains = null
    })
})))
```



<br>

**使用原生 immer.js  与 中间件 immer 的代码比较：**

* 使用原生 immer.js 我们需要对每一次 set() 的内容使用 produce 进行包裹

  > 上面示例中我们只有一个函数 clearForest()，实际中会有很多个修改函数，每一个修改函数我们都需要用到 set，都需要用到 produce 进行包裹

* 而使用中间件 immer 只需在最外层对 (set) => ({ ... }) 进行包裹，至于内部每一次使用 set() 就和平常普通的没有任何区别

  > 原理是中间件 immer 会对每一次使用 set() 进行劫持并使用 produce 函数



<br>

以上就是在 zustand 使用 immer 的用法。



<br>

**使用 immer.js 可能遭遇的陷阱：**

实际中我们可能会遇到一些奇怪的问题，一些不符合你预期的事情，那么你就需要去看一下这篇文章。

使用 immer 需要注意的陷阱问题：https://immerjs.github.io/immer/zh-CN/pitfalls/



<br>

本文到此结束。
