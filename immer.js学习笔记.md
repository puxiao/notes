# immer.js学习笔记



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



<br>

### immer.js 具体是靠什么实现的？



<br>

**先学习几个相关单词：**

immer：总是

draft：草稿

mutations：突变、变动

produce：生产

producer：生产者

patch：补丁

patches：补丁的复数

oriiginal：原始的、原来的

cast：投掷、投射、转换

immutable：不可变的

freeze：冻结

freezing：冷冻中

strict：严格的

Map：在 JS 中 Map 应该翻译为 图

Set：在 JS 中 Set 应该翻译为 集



<br>

**immer 运行基本流程：**

