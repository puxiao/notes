# WASM学习笔记



<br>

以下相关知识大部分来源于：

* MDN：https://developer.mozilla.org/zh-CN/docs/WebAssembly/
* https://rustwasm.github.io/docs/book/



<br>

## WASM的简介

**名称由来：**

WASM 是 WebAssembly 的简写。

assembly 单词本意为：装配、会议、议会、集会，而 assembly language 则被翻译为 "汇编语言"，所以 WebAssembly 可以翻译理解为 "Web汇编语言"。

> 请注意这里的 web 并非专指浏览器，而是指 "网络平台"，因为除了浏览器 wasm 还可以在其他环境中运行。



<br>

**汇编语言？**

汇编语言(assembly language)是一种低级语言。

汇编语言对应着不同的机器语言指令集，因此可用于(运行在)不同设备、不同操作系统中。

使用汇编语言编写的源代码，通过相应的汇编程序将这些源代码转换成可执行的机器代码，这个过程被称为 汇编过程。

由于汇编更接近机器语言，能够直接对硬件进行操作，因此与其他语言相比具有更高的运行速度，占用更小的内存。

常见的汇编语言有 C、C++、Pascal、... 以及我个人推崇准备要学习的 Rust 等等。



<br>

> 在本文中，我将以 Rust 为核心来学习 WASM。



<br>

**WASM的特性：**

* WebAssembly 被 W3C 确认为浏览器第 4 种支持的编程语言

  > 前三种分别是：html、css、js

* WebAssembly 最新标准 1.0  已正式发布，且当前主流浏览器均已支持

  > 主流浏览器是指：谷歌浏览器、火狐浏览器、苹果浏览器、微软Edge浏览器

* WebAssembly 可以作为汇编语言 例如 C++、Rust 这些语言的编译目标，因此 WebAssembly 具有汇编语言的相关特性，例如：紧凑的二进制格式、接近原生的运行性能等

* WebAssembly 被设计成可以与 JS 共存且协同工作



<br>

## 在 JS 中加载、编译、实例化 wasm



<br>

注意我们这里说的 JS 是指运行在浏览器中的 JS，并不是指 Node.js。



<br>

**WASM开发使用流程概述：**

* 使用汇编语言，例如 C++、Rust 等编写开发某个功能
* 通过对应的编译工具将 C++、Rust 的源码编译成 .wasm 文件
* 浏览器加载 .wasm 文件，然后将其转化(编译、实例化) 为一个 "模块"
* 被转化后的 wasm 模块可以运行在 window 或 worker 中，且进行共享
* 也可以像 二进制文件(Blob) 被缓存到 IndexedDB 中
* 在未来 wasm 模块将会被设计成像使用 JS ES6 模块(`<script type="module"></script>`)的这种形式来加载不同的 wasm 模块



<br>

**上面发生在 JS 中的事情可以简单归纳为 4 个阶段：加载、编译、实例化、使用**



<br>

**wasm文件实际上有 2 种格式：**

* .wat：文本格式 (人类可阅读)
* .wasm：二进制格式 (人类无法直接阅读)

.wat 文件格式是可以转换成 .wasm 格式的，不过我们目前先不考虑 .wat 这种格式，以及如何转换。

接下来我们都先以 .wasm 文件讲解内容。



<br>

**具体的 .wasm 加载编译实例化过程：**

目前一共有 2 个函数用来加载编译实例化 .wasm，他们分别是：

* WebAssembly.instantiate()

* WebAssembly.instantiateStreaming()

  > streaming 这个单词本意是：数据流、流媒体

通过函数名称我们已经大概猜出它们的不同之处：

* instantiate() 需要将 .wasm 文件全部加载完成后才能去执行编译实例化
* instantiateStreaming() 流式加载编译实例化

在 MDN 官方文档中，推荐使用 instantiateStreaming() 来加载解析 .wasm 文件。

> 官方原文是：这是加载 .wasm 代码最有效、最优化的方式



<br>

**加载编译实例化方式1：.instantiate()**

* 当通过 fetch 请求得到完成得到网络请求的返回结果 response

* 通过 response 的 .arrayBuffer() 把加载 .wasm 的内容转化(编译)为 原始二进制数据缓冲区(ArrayBuffer)

  > "原始二进制数据缓冲区" 说起来比较绕口，你可以用另外一个词来代替它：内存

* 然后通过 webAssembly.instantiate() 编译和实例化该 arrayBuffer，得到 wasm 模块实例

对应的示意代码：

```
let importObject = {
  imports: {
    imported_fun: function (arg) {
      console.log(arg)
    }
  },
  env: {
    abort: () => {},
  }
}

fetch("./simple.wasm")
  .then((response) => response.arrayBuffer())
  .then((bytes) => WebAssembly.instantiate(bytes, importObject))
  .the((result) => result.instance.exports)
```

> 在上面示意代码中，你可以先不用管为什么要那样定义 importObject



<br>

**加载编译实例化方式1：.compile() + .instantiate()**

上面方法中还存在另外一种变化，即先使用 WebAssembly.compile() 将加载内容编译为 wasm 模块，但不实例化，当需要时再通过 .instantiate() 实例化。

```
fetch("./simple.wasm")
 .then((response) => response.arrayBuffer())
 .then((bytes) => WebAssembly.compile(bytes))
 .then((mod) => WebAssembly.instantiate(mod, importObject))
 .then((instance) => instance.exports.exported_func())
```

这种方式的应用场景是  JS 主进程 与 webworker 共享 .wasm 代码内容：

* JS 主进程通过 fetch 加载 .wasm 文件，通过 .compile() 得到模块实例代码(此时并没有实例化该模块)
* 然后 JS 主进程可以通过 webworker 的 .poseMessage 把 编译好后的模块 发送到 webworker 中
* webworker 拿到编译好的 .wasm 模块后再在内部通过 WebAssembley.instantiate() 将其实例化



<br>

**加载编译实例化方式2：.instantiateStreaming()**

WebAssembly.instantiateStreaming() 可以直接将数据流编译实例化 .wasm。

直接看示例代码：

```
const importObject = { imports: { imported_func: (arg) => console.log(arg) } }

WebAssembly.instantiateStreaming(fetch("./simple.wasm"), importObject).then((obj) => {
  obj.instance.exports.exported_fun()
})
```

> 你现在依然先不用关心为什么要那样定义 importObject 对象，后面我们会学习讲解。

从你上面代码可以看出 .instantiateStreaming() 要比 .instantiate() 简单好用。



<br>

**.instantiate() 对应的有 .compile()，而 .instantiateStreaming() 对应的则是 .compileStreaming()。**



<br>

**加载编译实例化 .wasm 小总结：**

* 可以使用 fetch 加载 .wasm 文件

* 编译实例化方式1：

  * 使用 WebAssembly.instantiate() 编译并实例化 wasm 模块
  * 或 使用 WebAssembly.compile() 仅编译 wasm 模块，等需要时再用 .instantiate() 实例化 wasm 模块 

* 编译实例化方式2：

  * 使用 WebAssembly.instantiateStreaming() 流式编译实例化 wasm 模块
  * 或 使用 WebAssembly.compileStreaming() 流式编译 wasm 模块，等需要时再用 .instantiateStreaming() 实例化 wasm 模块

* 当我们得到 wasm 模块实例化后的对象，就可以像调用 JS 对象一样去调用 wasm 模块实例中的 函数、内存、表格，值等。

  > 你可以把 "wasm 模块实例对象" 想象成是 JS 中的一个对象( { ... } )，所谓 "使用 wasm 模块实例中的 导出函数、内存、表格、值等" 理解为 "访问某个 JS 对象的自定义属性和方法"。



<br>

**再说一遍：**

以上是当下 加载使用 .wasm 的流程，但是在未来，或许就可以像 `<script type="module"></script>` 这种方式加载使用 .wasm。



<br>

只此，我们已经大体了解了 WASM，以及加载编译实例化 .wasm。

我们目前缺的是下面 2 块内容：

* 加载编译实例化 之前的事情：如何使用 C++ 或 Rust 编写并编译出一个 .wasm 文件
* 加载编译实例化 之后的事情：如何在 JS 中使用 wasm 模块实例



<br>

接下来我们计划用 Rust 来开发 wasm。

首先，我们需要先配置好本机的 Rust 开发环境。



<br>

## Rust开发环境：rust、wasm-pack、cargo-generate



<br>

### Rust：

首先需要你对 Rust 具备最基础的了解，包括本机安装 Rust 环境。

如果你对 Rust 一无所知，那么你可以先去看看之前我写的这篇文章：[Rust学习笔记.md](https://github.com/puxiao/notes/blob/master/Rust学习笔记.md)



**对 Rust 版本的要求：**

要求 rustc 版本在 1.30.0 以上，查看自己 rustc 版本命令为：`rustc -V`

> 当前最新的 rustc 版本为 1.73.0



<br>

假定电脑上已经安装了 Rust 环境，那么想要开发 wasm 还需要：wasm-pack、cargo-generate



<br>

### wasm-pack：

**wasm-pack简介：**

我们知道 Rust 本身可以应用在非常多领域程序开发，而 wasm 仅仅是其中一个方向。

而 wasm-pack 是专门针对构建、测试、发布 WebAssembly 一站式的一个 "应用商店"。

wasm-pack 官方手册：https://rustwasm.github.io/wasm-pack/book/



<br>
**安装wasm-pack：**

官方安装教程：https://rustwasm.github.io/wasm-pack/installer/

* 安装方式1：下载安装程序.exe https://github.com/rustwasm/wasm-pack/releases/download/v0.12.1/wasm-pack-init.exe

* 安装方式2：才用脚本安装

  ```
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
  ```

* 安装方式3：cargo 安装

  ```
  cargo install wasm-pack
  ```

* 安装方式4：npm 安装

  ```
  yarn global add wasm-pack
  ```



<br>

我个人采用了第 1 种安装方式，下载 .exe 双击运行，然后就在打开的命令窗口中看到：

```
info: successfully installed wasm-pack to `D:\rust\cargo\bin\wasm-pack.exe`
Press enter to close this window...
```



<br>

**检验是否安装成功：**

命令面板中输入：

```
wasm-pack -V
```

> 当下我这里使用输出的版本是 0.12.1

若能正常输出当前已安装 wasm-pack 版本号，即表示安装成功。



<br>

**wasm-pack用法：**

完整详细的用法可查阅其官方文档：https://rustwasm.github.io/wasm-pack/book/

简单来说，在开发针对 wasm 的 rust 项目时，将命令中的 "cargo" 替换为 "wasm-pack" 。

```diff
# 新建
- cargo new hello-wasm
+ wasm-pack new hello-wasm

# 构建
- cargo build
+ wasm-pack build

# 针对 node.js 平台的构建
+ wasm-pack build --target nodejs

# ...

# 针对发布到 npm 平台
- cargo publish
+ wasm-pack publish

# 针对登录到 npm 平台
- cargo login
+ wasm-pack login
```



<br>

**输入信息设置：**

假定在使用 wasm-pack 进行构建时会收到一些相关日志，例如 普通信息、警告、错误。

你可以在命令中增加参数来修改信息显示设置。

```
# 输出完整(冗长)的信息
wasm-pack --verbose build

# 简化(屏蔽)输出信息
wasm-pack --quiet build
```



<br>

也可以设置输出信息的级别：

```
# 仅输出错误信息
wasm-pack --log-level error build

# 输出警告和错误信息
wasm-pack --log-level warn build

# 输出完整详细的信息
wasm-pack --log-level info build
```

> 默认才用的是 --log-level info



<br>

**新建项目：**

新建 Rust 的 Wasm 项目命令格式为：

```
wasm-pack new <name> --template <template> --mode <normal|noinstall|force>
```

* --template：明确项目模板来源，例如：

  ```
  wasm-pack new myproject --template https://github.com/rustwasm/wasm-pack-template
  ```

  如果缺省 --template 参数，则默认使用的模板就是 "https://github.com/rustwasm/wasm-pack-template"

* --mode：模式类型，有 3 个可选值：

  * normal：正常，默认值
  * noinstall：不安装任何底层工具
  * force：强制安装且无需检查本机 Rust 版本环境



<br>

对于我们一般的项目而言，直接使用 `wasm-pack new xxx` 就可以了。



<br>

**提示：第一次创建项目时需要拉取模板，所以第一次安装所需时间会比较久一些。**



<br>

**构建命令：**

最简单的构建命令：`wasm-pack build`

这里实际上相当于：`wasm-pack build .` 即默认构建当前目录下的内容，也可以根据实际情况选择构建目录，例如：`wasm-pack build ./xx/xxx`

出此之外，还支持以下参数：

* --out-dir 指定输出目录：默认输出目录为 pkg，若想指定则：

  ```
  wasm-pack build --out-dir xxx
  ```

* --out-name 生成文件名前缀：默认会使用当前包的名称，若想指定则：

  ```
  wasm-pack build --out-name xxx
  ```

* 构建模式：一共有 3 个模式

  * --dev 调试模式：适用于开发和调试
  * --profiling 性能调试模式：适用于分析和调查性能问题
  * --release：正式发布模式：适用于正式发布

  以上模式并不是必须 三选一，也可以组合使用，例如 `--profiling --release`

* --target 编译目标：一共有 4 个目标

  * bundler 未指定：--target 的默认值，用于编译到适用于像 webpack 的打包工具
  * nodejs：适用于 node.js
  * web：适用于浏览器
  * no--modules：同样也适用于浏览器，只不过与 "web" 的区别是不支持某些打包特性

* --scope 打包的前缀：例如 `--scope test` 那么意味着打包到 `@test/xxx`

* --mode 模式：一共有 2 个可选值

  * normal：默认值

  * no-install：隐式创建 wasm 绑定而无需安装 `wasm-bindgen`

    > `wasm-bindgen` 是一个用于改进 wasm 模块和 JS 之间交互的 cargo 包
    >
    > 与 `wasm-bindgen` 对应的还有一个叫  `wasm-bindgen-test` 的包，它是用于改进调试的。



<br>

**测试项目：**

测试对于开发 wasm 项目来说至关重要。

想要查看和 测试 有关的帮助命令为：

```
wasm-pack test --help
```

> 会输出一些测试相关命令的帮助信息



<br>

**对于测试命令而言，最核心的是要明确测试目标平台：**

* --node：node平台
* --firefox：火狐浏览器
* --chrome：谷歌浏览器、微软Edge浏览器
* --safari：苹果浏览器
* --headless：无头浏览器

假定我们针对谷歌浏览器进行测试，则命令为：

```
wasm-pack test --chrome
```

> 当然你可以多写几个目标平台，例如把常见的浏览器都写上：
>
> ```
> wasm-pack test --firefox --chrome --safari
> ```



<br>

**打包并发布：**

将构建好的内容打包发布到 NPM 上，对应的是 `wasm-pack pack` 和 `wasm-pack publish` 命令。

这两个对现在的我们来说没啥意义，先不用学习。



<br>

### cargo-generate

在上面讲述 wasm-pack 的用法时，似乎我们已经可以完整独立创建发布构建 wasm 项目了，那 cargo-generate 又是做什么的？



<br>

**cargo-generate简介：**

cargo-generate 是专门用来创建、自定义、生成 wasm 项目模板的。

cargo-generate 官方手册：https://cargo-generate.github.io/cargo-generate/

在讲解 wasm-pack 创建项目时，提到了一个命令参数 "--template" ，即假定想使用 某个模板作为 wasm-pack 创建项目的模板，那么：

```
wasm-pack new xxx --template https://github.com/rustwasm/wasm-pack-template
```

如果你想自定义一个 wasm 模板且被 wasm-pack 支持，那么你就需要通过安装使用 cargo-generate 来实现。



<br>

**实际开发中，通常可能是 wasm-pack 与 cargo-generate 相结合，提高开发效率。**



<br>

**安装cargo-generate：**

```
cargo install cargo-generate
```



<br>

**具体用法：**

我们目前才刚刚接触 wasm，谈不上就要去创建自定义项目模板，所以这里就先不学习 cargo-generate 了。



<br>

**Rust wasm 开发环境小总结：**

* 需要本机安装 Rust 开发环境，且版本要高于 1.30.0
* 安装 wasm-pack，并且掌握基础的 创建、测试、构建命令
* 了解自定义 wasm 项目模板工具 cargo-generate，但无需真的掌握用法



<br>

只此，我们终于可以开始实际编写第一个 Rust wasm 项目了。



<br>

## 初探 Rust wasm：hello-wasm

未完待续...