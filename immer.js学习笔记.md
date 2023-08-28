# immer.js学习笔记



<br>

## immer.js简介



<br>

官方教程与文档：https://immerjs.github.io/immer/zh-CN/

源码仓库：https://github.com/immerjs/immer



<br>

**名字含义：**

immer 这个单词源于德语，相当于英语单词 always (总是)，谷歌翻译为 "沉浸"略有偏差，总之你记住它含义是 "总是"即可。



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

不是不可以改变数据状态，而是每次改变只都记录改变的，不改变之前的。



<br>

**对于 JS 编程而言 不可变数据结构 思想有什么好处？或者说它用于解决哪些困境？**

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

命令模式肯定可以，但命令默认并不是没有缺点：

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

* immer.js 在 JS 中具体是靠什么实现的
* immer.js 背后知识点涉及的 2 个 JSON 规范：JSON指针、JSON 补丁



<br>

**immer.js 具体是靠什么实现的？**

未完待续

