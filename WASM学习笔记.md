# WASM学习笔记



<br>

以下相关知识大部分来源于：

* https://developer.mozilla.org/zh-CN/docs/WebAssembly/
* https://rustwasm.github.io/docs/book/
* https://rustwasm.github.io/wasm-pack/book/
* https://rustwasm.github.io/docs/wasm-bindgen/



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

## 在 JS 中加载、编译、实例化 wasm 模块



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

* --target 编译目标：一共有 5 个目标

  * bundler 未指定：--target 的默认值，用于编译到适用于像 webpack 的打包工具
  * nodejs：适用于 node.js
  * web：适用于浏览器
  * no--modules：同样也适用于浏览器，只不过与 "web" 的区别是不支持某些打包特性
  * deno：适用于 deno

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

只此一些前置开发环境和知识点我们已经知道了，接下来看一看 wasm-pack 创建的默认 wasm 项目，重点是要学习了解一下 wasm-bindgen。



<br>

## 初探 Rust wasm 项目



<br>

本小节中，我们先通过 wasm-pack 创建一个 hello-wasm 的项目，然后再通过分析默认这个项目的一些代码和配置来了解一些新东西，并引申出一些需要学习的关键知识点。



<br>

### 创建一个项目

**新建项目命令：**

```
wasm-pack new hello-wasm
```

> 如果你是第一次执行该命令，那么等待时间需要稍微久一些，因为需要下载安装 cargo-generate

<br>

如果执行顺利，我们会看到下面的输出信息：

```
[INFO]: Installing cargo-generate...
 Generating a new rustwasm project with name 'hello-wasm'...
 Destination: E:\rust\hello-wasm ...
 project-name: hello-wasm ...
 Generating template ...
 Moving generated files into: `E:\rust\hello-wasm`...
Initializing a fresh Git repository
 Done! New project created E:\rust\hello-wasm
[INFO]: 🐑 Generated new project at /hello-wasm
```

在上面的信息中，我们可以解读出这几个关键点：

* wasm-pack 创建 wasm 项目时需要下载安装 cargo-generate
* 然后实际是由 cargo-generate 来创建的项目模板

因此，结论是：

* wasm-pack 是 "一站式" 创建、开发、调试、构建 Rust wasm 的一个程序

* 单纯就模板而言 wasm-pack 内部使用的是 cargo-generate

  > 而 cargo-generate 创建的模板中又依赖 wasm-bindgen，这个我们会稍后讲解



<br>

**项目文件分析：**

使用 VSCode 开发刚刚创建好的 hello-wasm 项目，我们先大体看看都有哪些目录和文件。

目录：

* .github：里面包含一个 dependabot.yml 文件，这个和我们的项目关联不大，这个 github 的一个工具配置文件，用来自动更新项目依赖、依赖包高危漏洞警告的，我们可以无需过多关注该文件。
* src：项目源码目录，里面有 2 个文件 lib.rs、utils.rs
* target：测试编译目标目录，这个对我们来说是暂时无用的，不用去分析
* tests：测试文件目录

文件：

* .appveyor.yml：这是 github 的持续集成平台 AppVeyor 的配置文件，和我们关系研究的 wasm 关系不大，无需过多关注该文件
* .gitignore：git 忽略文件，这个文件里，把可能用于存放构建文件的 3 个目录 /target、bin/、pkg/ 都进行忽略的
* .travis.yml：这个也是 github 持续集成的步骤配置文件，也无需关注
* Cargo.lock：依赖版本锁定文件，相当于前端项目中的 yarn.lock
* Cargo.toml：项目依赖文件，相当于前端项目中的 package.json
* LICENSE_APACHE、LICENSE_MIT：版权相关
* README.md：说明文档，对于普通项目而言意义不大，但是如果是针对要发布成 NPM 包的项目，那么需要好好写一下该说明文档



<br>

除去 github、git、版权、说明文档 和其它不重要的目录(target/、tests/)，那么对我们而言真正核心有用的就是这 3 个文件：

* src/lib.rs
* src/utils.rs
* Cargo.toml

<br>

那么我们依次对这 3 个文件详细解读一下。



<br>

### 解读 Cargo.toml

**Cargo.toml：**

```
[package]
name = "hello-wasm"
version = "0.1.0"
authors = ["puxiao <yangpuxiao@gmail.com>"]
edition = "2018"

[lib]
crate-type = ["cdylib", "rlib"]

[features]
default = ["console_error_panic_hook"]

[dependencies]
wasm-bindgen = "0.2.84"

# The `console_error_panic_hook` crate provides better debugging of panics by
# logging them with `console.error`. This is great for development, but requires
# all the `std::fmt` and `std::panicking` infrastructure, so isn't great for
# code size when deploying.
console_error_panic_hook = { version = "0.1.7", optional = true }

[dev-dependencies]
wasm-bindgen-test = "0.3.34"

[profile.release]
# Tell `rustc` to optimize for small code size.
opt-level = "s"
```

我们可以看到该文件一共分为 6 部分：

```
[package]
name = "hello-wasm"
version = "0.1.0"
authors = ["puxiao <yangpuxiao@gmail.com>"]
edition = "2018"
```

* package：项目打包描述信息

* 其中 `edition = "2018"` 这是指 Rust 编译包版本为 2018

  我们是可以将 "2018" 修改成 "2021" 的

  > Rust 每 3 年发布一个编译包版本，目前 rust 编译包版本为 2015、2018、2021
  >
  > 作为前端开发者，你可以简单理解为这相当于 JS  的 ES5、ES6....



<br>

```
[lib]
crate-type = ["cdylib", "rlib"]
```

* lib：是指 libaray 的简写，表明是和 库 相关的配置
* crate-type：创建的类型
* ["cdylib", "rlib"]：cdylib 是指动态链接库、rlib 是指静态链接库

简单来说就是告知编译器将当前项目编译成 动态链接库 + 静态链接库。

> 一般来说 rust 项目都会采用这样的配置。



<br>

> 以下关于 静态链接 与 动态链接 的解释不够准确，但是可以比较容易帮你去理解它们的大概含义。

对于编程语言来说，假定有 A、B、C 3个模块，其中 A、B 模块都需要用到 C 模块，那么：

1、静态链接：相当于在 A、B 这 两个模块中采用 "**嵌入(include)**" 的方式，嵌入一份 C 模块的代码，这意味着：

* 对于将来编译的结果，相当于存在 2 份 C 模块的代码(A、B 各一份)
* 并且由于是 "嵌入"，所以每当 C 模块代码发生变动时，A、B 两个模块也需要重新编译(重新嵌入一份变更过后的 C 模块代码)

2、动态链接：相当于在 A、B 这 两个模块中采用 "**引入(import)**" 的方式，引入一份 C 模块的代码，这意味着：

* 对于将来编译的结果，仅存在 1 份 C 模块的代码
* 由于是 "引入"，所以当 C 模块代码发生变动时，A、B 两个模块中的代码无需重新编译(因为 C 代码本身并不存在 A、B 两个模块中)

<br>

由于 JS 属于解释性语言，代码不存在编译，是在运行时由  JS 解释引擎执行的，因为 JS 可以看作是 "天生支持动态链接"。但是对于很多需要编译性的语言，例如 C/C++、Rust 等，动态链接对他们来说就比较重要，可以减轻最终代码的体积，只不过需要消耗一定的编译时间。



<br>

```
[features]
default = ["console_error_panic_hook"]
```

* features：特性，用来定义构建项目时才用哪些特性策略
* default：特性的默认字段
* ["console_error_panic_hook"]：你可能会留意到在 Cargo.toml 的依赖项中也有一个相同名字的 console_error_panic_hook，但是此处的 "console_error_panic_hook" 实际对应的是 src/utils.rs 中定义的 console_error_panic_hook。



<br>

```
[dependencies]
wasm-bindgen = "0.2.84"

# The `console_error_panic_hook` crate provides better debugging of panics by
# logging them with `console.error`. This is great for development, but requires
# all the `std::fmt` and `std::panicking` infrastructure, so isn't great for
# code size when deploying.
console_error_panic_hook = { version = "0.1.7", optional = true }
```

* dependencies：依赖，相当于前端项目 package.json 中的 "dependencies"

* wasm-bindgen：当前项目依赖的包名，后面是该包的版本号

  > 关于 wasm-bindgen 我们后面会单独详细讲解

* console_error_panic_hook：用于网页输出错误 wasm 错误信息的包，后面的值中 `optional = true` 表明它是可选的，非必须项

  > 这个和前面 `[features] default = ["console_error_panic_hook"]` 呼应上了



<br>

```
[dev-dependencies]
wasm-bindgen-test = "0.3.34"
```

* dev-dependencies：开发阶段需要的依赖包，相当于前端项目 package.json 中的 "devDependencies"
* wasm-bindgen-test：wasm-bindgen 对应的调试包



<br>

```
[profile.release]
# Tell `rustc` to optimize for small code size.
opt-level = "s"
```

* profile：轮廓(概述)，其含义是 构建项目时的一些概述配置项

* profile.release：构建 release(正式发布) 版本时的配置项

* opt-level：优化设置级别，这里它的值设置为 "s" 对应的是 size，即表明优化构建结果的二进制文件大小。

  > 对应上面那行注释 "Tell `rustc` to optimize for small code size. (告诉 rsutc 优化代码大小)"
  >
  > 由于我们使用的 .wasm 文件最终是需要网络请求，所以编译时优化压缩代码大小对我们而言是比较重要的，但压缩代码大小有可能会降低 .wasm 执行性能，不过这个我们暂时无需过度担忧。

  > 不过这样设置会导致构建所需时间久一些。



<br>

以上就是 Cargo.toml 内容解读，对我们而言最重要的是 3 个依赖包：

* wasm-bindgen
* console_error_panic_hook
* wasm-bindgen-test



<br>

**wasm-bindgen：**

wasm-bindgen 是促进 JS 与 WASM 交互的一个库和 CLI 工具。

官方文档：https://rustwasm.github.io/docs/wasm-bindgen/introduction.html

这里强调一下：wasm-bindgen 本身就完全可以作为一个独立的偏文章来学习，因为它足够复杂、强大、且你使用 Rust 开发 wasm 根本离不开它。



<br>

为什么离不开它？

**因为 .wasm 是二进制文件，所以使用原生 JS 与 WASM 交互时，例如函数调用，参数只能是 整数或浮点数！**

也就是说你无法像 JS 函数那样，函数的参数可以是 字符串、对象、数组 等等。

如果使用原生 JS，你都需要提前把 字符串、对象、数组 等转化为 整数或浮点数。

可以想象那 JS 与 WASM 互相调用时该有多艰难。

**但是当你使用 wasm-bindgen 后，它会自动帮你承担很多工作，简化函数调用。**



<br>

> 除了 函数 调用，实际上更多的操作是在 wasm 内部去操作网页 DOM、监听网页事件等，这类交互太频繁了，所以真的离不开 wasm-bindgen。



<br>

对于 wasm-bindgen 我们先不去深入学习理解，只是先有个初步概念即可。



<br>

对于刚刚新建的项目我们已经分析完了，那么接下来我们构建一下项目，并分析构建结果。



<br>

### 构建项目

**构建命令：**

```
wasm-pack build . --target web
```

> `.` 表示构建当前目录，该值是可以省略的，因为 build 默认值就是当前所在目录
>
> `--target web` 表示构建的目标平台是浏览器



<br>

**编译过程：**

在构建过程中，在我本机看到下面的信息：

> 下面的这些信息可能在你电脑上会出现



<br>

```
[INFO]: Checking for the Wasm target...
[INFO]: Compiling to Wasm...
warning: function `set_panic_hook` is never used   
 --> src\utils.rs:1:8
  |
1 | pub fn set_panic_hook() {
  |        ^^^^^^^^^^^^^^
  |
  = note: `#[warn(dead_code)]` on by default       

warning: `hello-wasm` (lib) generated 1 warning    
    Finished release [optimized] target(s) in 0.07s
```

构建项目之前进行代码检查，然后给出了一个警告信息：

* 警告：发现 函数 `set_panic_hook` 未使用

  > 这个和 TS 项目中配置 存在未使用变量 发出警告作用相似，我们可以忽略这个问题。



<br>

```
[INFO]: Installing wasm-bindgen...
Error: failed to download from https://github.com/WebAssembly/binaryen/releases/download/version_111/binaryen-version_111-x86_64-windows.tar.gz
To disable `wasm-opt`, add `wasm-opt = false` to your package metadata in your `Cargo.toml`.
Caused by: failed to download from https://github.com/WebAssembly/binaryen/releases/download/version_111/binaryen-version_111-x86_64-windows.tar.gz
To disable `wasm-opt`, add `wasm-opt = false` to your package metadata in your `Cargo.toml`.
```

这个问题是我电脑上遇到的：无法正常下载 `https://github.com/WebAssembly/binaryen/releases/download/version_111/binaryen-version_111-x86_64-windows.tar.gz`

并且提到了 `wasm-opt = false`：



<br>

**wasm-opt：**

wasm-opt 是一个 Rust 包，是 Binaryen 中的一个工具，用于加载 wasm 并运行 Binaryen IR 传递。

代码仓库：https://github.com/brson/wasm-opt-rs

如果单独安装的话，命令为：

```
cargo install wasm-opt
```



<br>

那这个 Binaryen、Binaryen IR 又是啥？



<br>

**Binaryen：**

binaryen 是 WebAssembly 的优化器、编译器，以及包含一些工具链。



<br>

> binaryen 实际上是由  binary(二进制) + en 组成
>
> "en" 这个后缀在英语里通常表示 "一个特定的地方、场景、状态"
>
> 所以 `binaryen` 所表达的含义是 "针对二进制的一些特定操作"



<br>

代码仓库：https://github.com/WebAssembly/binaryen

> 从仓库地址就可以看出 binaryen 归属与 Github 上的 WebAssembly 组织。
>
> 一同属于该组织的还有：
>
> * WASI：WebAssembly 系统接口
> * wabt：WebAssembly 二进制工具库，该工具库中还包括 wat2wasm、wasm2wat、wast2json...
> * wasm-shell：加载和解析 WebAssembly 代码的相关命令
> * ...



<br>

**Binaryen IR：**

名字中的 IR 是 Intermediate Representation (中间表示形式) 的缩写。

> 这两个单词也太长了吧，难怪要用 IR 缩写

WebAssembly 是一种开放标准，而 Binaryen 是对 WebAssembly 标准的 "一种分支"。

> 最初 WebAssembly 也是被设计成 AST 形式，后来才改成了堆栈式数据结构，至此和 Binaryen 有 "矛盾" 的同时又相互纠缠。



<br>

2 者的过往历史我们不深究，只说当下它们的区别：

* WebAssembly：堆栈形式的二进制数据结构

* Binaryen：抽象语法树(AST) 形式的数据结构

  由于 Binaryen 采用抽象语法树的数据结构，这就导致它具有更加灵活、可优化 等方面的优势。



<br>

目前我们大概知道了：

* Binaryen：针对 WebAssembly 编译、优化，并提供一系列工具链的库
* Binaryen IR：Binaryen 的中间表示形式
* wasm-opt：归属于 Binaryen 工具链中的一个工具



<br>

好了，再回到我们构建项目时遇到的问题。



<br>

再看一下我们之前遇到的报错信息：

```
[INFO]: Installing wasm-bindgen...
Error: failed to download from https://github.com/WebAssembly/binaryen/releases/download/version_111/binaryen-version_111-x86_64-windows.tar.gz
To disable `wasm-opt`, add `wasm-opt = false` to your package metadata in your `Cargo.toml`.
Caused by: failed to download from https://github.com/WebAssembly/binaryen/releases/download/version_111/binaryen-version_111-x86_64-windows.tar.gz
To disable `wasm-opt`, add `wasm-opt = false` to your package metadata in your `Cargo.toml`.
```

这次我们就能够看到这些报错信息了：

* 由于下载安装 binaryen 失败

* 导致无法使用 wasm-opt

  > wasm-opt 是 binaryen 中的一个工具

* 可以尝试禁用 wasm-opt，禁用方式为在 Cargo.toml 中添加 `wasm-opt = false`



<br>

**解决办法：上梯子，并且尝试更换不同的节点**

即使你直接使用浏览器可以畅通访问 github.com，但是在 VSCode 中也会存在一直不能顺利下载安装 binaryen，那么你只能多换几个节点去尝试。



<br>

如果没有梯子，或者试了很多节点都依然不管用怎么办？

**一个变通、待验证的办法：**

> 以 windows 系统为例

* 手工下载 https://github.com/WebAssembly/binaryen/releases/download/version_111/binaryen-version_111-x86_64-windows.tar.gz
* 解压文件，解压之后你打开里面的 bin 目录，就会看到很多很多 binaryen 包含的工具程序，其中就有我们需要的 wasm-opt.exe
* 将解压后的文件放到一个合适目录，例如 `D:\rust\binaryen\bin`，然后在 系统环境变量中，将这个 bin 目录添加到系统环境变量的 Path 之中
* 将解压后的 lib/binaryen.lib 文件添加到本机 cargo 目录中，也就是系统环境变量 `CARGO_HOME` 对应的那个目录。

经过上面的操作，相当于手工安装了 binaryen，但是这个办法也仅仅是在网上看到的，具体行不行不一定。



<br>

**注意：** 这个方式是我从网上看到的，否真的管用未知

> 由于我更换梯子节点后已成功安装，所以没有再实际实验这个办法。



<br>

假定我们成功安装了 binaryen，那么再次执行构建命令，我们这次看到的信息可能如下：

```
[INFO]: Checking for the Wasm target...
[INFO]: Compiling to Wasm...
warning: function `set_panic_hook` is never used
 --> src\utils.rs:1:8
  |
1 | pub fn set_panic_hook() {
  |        ^^^^^^^^^^^^^^
  |
  = note: `#[warn(dead_code)]` on by default

warning: `hello-wasm` (lib) generated 1 warning
    Finished release [optimized] target(s) in 0.04s
[INFO]: Installing wasm-bindgen...
[INFO]: Optimizing wasm binaries with `wasm-opt`...
[INFO]: Optional fields missing from Cargo.toml: 'description', 'repository', and 'license'. These are not necessary, but recommended
[INFO]: :-) Done in 0.53s
[INFO]: :-) Your wasm pkg is ready to publish at E:\rust\hello-wasm\pkg.
```



<br>

**消除未使用函数的警告：**

首先未使用函数发出警告这并不是什么坏事，这是 Rust 编译时本身就会做、且应该做的事情。

这个 "未使用函数 set_panic_hook" 并不是在 rust 代码中使用的，而是打算给后面交互使用的。

<br>

只是对于我个人而言可能想消除这个警告，简单做法就是给报警告的函数上面增加 允许未使用 的属性标记。

```diff
+ #[allow(dead_code)]
  pub fn set_panic_hook() { ... }
```

增加 `#[allow(dead_code)]` 后再次构建，就不再报那个警告了。

```
[INFO]: Checking for the Wasm target...
[INFO]: Compiling to Wasm...
   Compiling hello-wasm v0.1.0 (E:\rust\hello-wasm)
    Finished release [optimized] target(s) in 0.22s
[INFO]: Installing wasm-bindgen...
[INFO]: Optimizing wasm binaries with `wasm-opt`...
[INFO]: Optional fields missing from Cargo.toml: 'description', 'repository', and 'license'. These are not necessary, but recommended
[INFO]: :-) Done in 0.70s
[INFO]: :-) Your wasm pkg is ready to publish at E:\rust\hello-wasm\pkg.
```

此刻输出的信息中仅包含 2 条有用的：

* Cargo.toml 中缺少 description(描述)、repository(仓库)、license(版权) 配置，虽然这些是可以缺省的，但是建议加上

  > 这个信息不重要，我们可以忽略

* 已成功构建项目，生成文件存放在 pkg/ 目录中



<br>

那么接下来我们就重点看看 pkg/ 目录中生成的文件都是什么。



<br>

## 初探 pkg 目录下的文件



<br>

在查看 pkg 目录下生成的文件之前，我们先看看 rust 写的源码都是什么。

### src源码解读

src 目录下一共只有 2 个文件：

* lib.rs
* utils.rs



<br>

**utils.rs**

从名字上我们就能知道这个大概和工具有关。

```
#[allow(dead_code)]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}
```

> "panic" 这个单词的意思是 "恐慌"，panic 是 wasm 环境中的 "报错行为"

* `#[allow(dead_code)]`：明确下面的函数 "已定义但未使用"，构建时无需报警告信息

* `pub fn set_panic_hook() { }`：对外公开定义一个 set_panic_hook() 函数

* `#[cfg(feature = "console_error_panic_hook")]`：属性条件配置，只有当启用的特性中包含 "console_error_panic_hook" 值时才会执行下面一行(打包到程序中)

* `console_error_panic_hook::set_once();`：引入并执行 console_error_panic_hook 下的 set_once 函数

  > 当 wasm 环境中发生了 panic (错误) 后将错误信息输出在浏览器的控制面板中



<br>

**lib.rs**

这个是项目真正编写代码的文件。

```
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, hello-wasm!");
}
```

* `mod utils;`：查找并引入同级目录中 "utils.rs" 模块

* `use wasm_bindgen::prelude::*;`：引入 "wasm_bindgen 下的 prelude 模块"

  > 这个 prelude 模块究竟是做什么的，有什么用，我们后面再讲解

* `#[wasm_bindgen] extern "C" { fn alert(s: &str); }`：

  * extern：对内引入外部 C/C++ 定义的某些函数签名(引用)

    这里的 内 是指 Rust 内部，外 是指 web_sys 中帮我们定义好的一些 JS 等价的函数，

    **而 "函数签名" 是指用来描述该函数的一些信息**，例如 名称空间、函数名、参数、返回值等信息

  * "C"：表明与编程语言 C 进行交互，注意这里的 "C/C++" 可以理解为泛指外部可以交互的汇编语言

  * fn alert(s: &str)：引入 alert 函数签名

    请注意由于在 JS 中 alert 函数属于全局函数，因此这里我们可以简单直接引入定义函数签名，若是其他非全局函数，则还需要通过定义属性(#[wasm_bindgen(...)])来明确究竟该如何 引入并绑定

* `#[wasm_bindgen] pub fn greet() { alert("Hello, hello-wasm!"); }`：对外定义一个 greet 的函数，在该函数内部会调用在 extern 中引入定义的 alert 函数， `alert("Hello, hello-wasm!")`



<br>

**关于alert：**

请注意，代码阅读至此，我们应该意识到，alert 出现了 3 次：

* 原生网页中的 alert：尽管没出现，但是我们知道网页 JS 中是存在 alert 函数的
* extern "C" 中定义的 alert ：从外部(web_sys)引入并定义 alert 函数签名 (可在 rust 内部调用该函数)
* pub fn greet(){ ... } 中调用 extern "C" 中定义的 alert

是不是感觉多少有点懵，别担心，我们先忽略具体到底 alert 谁在定义，如何调用，后面在网页中实际运行代码时我们会详细讲解这个 alert 调用流程。



<br>

好了，终于该看 pkg/ 目录下生成的文件了。



<br>

### pkg目录生成文件

**目录下的文件：**

* .gitignore
* hello_wasm_bg.wasm
* hello_wasm_bg.wasm.d.ts
* hello_wasm.d.ts
* hello_wasm.js
* package.json
* README.md



<br>

**先说简单容易理解的：**

* .gitignore：给 pkg/ 目录下自动添加的 git 忽略文件
* package.json：对于生成物的描述文件
* README.md：说明文档



<br>

**核心产物：**

我们先抛开 wasm-bindgen ，试想一下：

1、假设我们使用某个语言编写开发了一个 wasm 项目，那么最终我们肯定希望得到的是 .wasm 文件

2、得到 .wasm 文件之后接下来要去编写 JS 去加载调用 .wasm

如果我们是用原生 JS 去加载调用 .wasm，这个时候我们就会面临 3 个需要棘手问题：

**棘手问题1**：我们需要充分了解这个 .wasm 文件内部对外暴露的可访问名称，例如 函数名

* 有可能我们会在 JS 中出现手误，把函数名拼写错误而不自知
* 也有可能这个 .wasm 并不是我们自己编写的，而是别人编写的，我们需要去看对方提供的 " 文档" 才能知道里面有哪些可调用函数名，以及参数

**棘手问题2**：原生 JS 加载 .wasm 时需要提前在 JS 中先按照 .wasm 的内部结构定义一个 "类型结构体式的对象"，这个工作实际上是有点麻烦的

**棘手问题3**：原生的 js 与 wasm 之间传递函数参数只能是 整数和浮点数，参数真正交互起来特别麻烦



<br>

无论如何棘手，总之此时此刻我们整个过程大约牵扯到 2 个文件：

* .wasm：我们生成得到的 wasm 文件

  > 程序生成的

* .js：定义了 wasm "类型结构体式的对象" 和 方便与 wasm 交流沟通的相关封装

  > 我们手工编写而成的



<br>

那我们再回头来看看项目通过 wasm-bindgen 生成的 pkg/ 目录下的 4 个相关文件。

> 我们创建的项目名为 hello-wasm，而构建后的文件名是以 hello_wasm 为开头的

* hello_wasm_bg.wasm
* hello_wasm_bg.wasm.d.ts
* hello_wasm.d.ts
* hello_wasm.js



<br>

**hello_wasm_bg.wasm**

这是我们项目生成得到的 .wasm 文件。

你可能有个疑问：为什么文件名中增加了一个 "_bg" ？

**"_bg" 是单词 "bindings(绑定)" 的简写，用来表明：这个 .wasm 不是普通原始的 wasm 文件，而是经过 wasm-bindgen 编译后将 wasm 与 JS 进行了绑定关系的 wasm 文件。 **

换句话说，当我们看到一个 xxx_bg.wasm 文件时，我们就意识到 这可能是一个经过 wasm-bindgen 编译过后的 wasm 文件。

> 文件名中出现 "_bg" 相当于一个命名约定。



<br>

**hello_wasm_bg.wasm.d.ts**

```
/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function greet(): void;
```

通过查看 hello_wasm_bg.wasm.d.ts 的内容，很容易理解这个是针对导出的 .wasm 文件对应的 JS 调用的类型声明。

我们可以看到目前 wasm 一共有 2 个可访问的对象：

* 一个变量 memory
* 一个不带参数的函数 greet

这样我们在调用 wasm 中的方法时就可以获得对应的 TS 类型支持和代码提示，避免手误打错函数名称。

> 帮我们解决 棘手问题 1



<br>

**特别补充：**

随着以后功能复杂，我们会定义更多函数，但是请记住一条：无论你定义函数究竟参数是那种类型，在 xx.wasm.d.ts 中该函数参数的类型都会是 number。

这是因为对于原生 wasm 来说传递参数只能是数字，你要是想传递字符串也必须先将字符串转换为数字后才能传递进来。

但是无需担心，因为我们日常开发中并不会直接使用 xx.wasm.d.ts 中定义的函数，而是会使用产物中 xx.d.ts 中定义的类型。



<br>

**hello_wasm.js**

这个是 wasm-bindgen 为我们自动封装得到的一个方便加载、解析、调用 wasm 的 JS 代码。

> 帮我们解决 棘手问题2、棘手问题3

请注意在这个 JS 中有一个函数 `__wbg_int`，它内部直接会加载 "hello_wasm_bg.wasm" 文件。



<br>

**hello_wasm.d.ts**

这个是针对 hello_wasm.js 的类型定义文件。

在该文件中 export 导出的函数和函数类型，才是我们实际中用到的函数类型。



<br>

再次总结一下这 4 个文件：

* hello_wasm_bg.wasm：当前项目编译的 .wasm 结果，名称中的 "_bg" 用于表明这是经过 wasm-bindgen 编译过的 wasm
* hello_wasm_bg.d.ts：明确 .wasm 文件对外可调用对象或函数，但是函数参数永远都是 number
* hello_wasm.js：经过 wasm-bindgen 封装后用于 加载、调用 .wasm 的 JS 文件
* hello_wasm.d.ts：针对 hello_wasm.js 的类型定义文件，这里面 export 导出的函数类型才是我们最终使用到的类型



<br>

讲了这么多，终于该去网页里运行一下了。



<br>

### 在网页中实际运行一下

**创建一个 http 服务：**

> 本机创建 http 服务的方式有非常多 ，这里我选择最简单的，全局安装 http-server 的方式来将某个目录启动成 http 服务



<br>

**创建步骤：**

* 第1步：全局安装 http-server：`yarn global add http-server`

* 第2步：新建一个名为 demo 的目录

* 第3步：初始化当前目录的 package.json：`npm init` ，然后一路按回车

* 第4步：修改 package.json，添加一条启动服务的命令：

  ```
  {
    "name": "demo",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "dev": "http-server ."
    },
    "author": "",
    "license": "ISC"
  }
  ```

  > 由于我们已经全局安装 http-server，所以我们的入口文件 index.js 是无需创建的

* 第5步：在 demo 目录下新建一个 wasm 的目录，并将之前构建好的 pkg/ 目录下的 4 个文件 "hello_wasm_bg.wasm、hello_wasm_bg.wasm.d.ts、hello_wasm.d.ts、hello_wasm.js" 拷贝到 demo/wasm 目录中

* 第6步：在 demo 目录下新建一个 index.html 网页，内容如下：

  ```
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>hello wasm</title>
  </head>
  
  <body>
      <script type="module">
          import helloWasm from './wasm/hello_wasm.js';
  
          helloWasm()
              .then((wasm) => {
                  wasm.greet()
              })
              .catch(console.error)
  
      </script>
  </body>
  
  </html>
  ```

* 第7步：启动项目，访问网页：`yarn dev`



<br>

一起顺利，我们就可以访问：http://127.0.0.1:8080 ，然后在打开的网页中看到 alert 弹窗："Hello, hello-wasm!"

也就是说，我们这个项目成功运行起来了。



<br>

接下来，我们梳理一下运行起来的整个过程。



<br>

### 梳理运行过程

**第1步：以 module 形式引入 hello_wasm.js**

```
import helloWasm from './wasm/hello_wasm.js';
```

由于 hello_wasm.js 中的代码是：

```
async function __wbg_init(input) { ... }
export default __wbg_init;
```

对外默认导出的是 __wbg_int 函数，所以我们引入的代码中 helloWasm 即对应的是 `__wbg_init` 函数。



<br>

**第2步：执行 helloWasm 函数**

```
helloWasm()
```

相当于执行 __wbg_init()。

而 __wbg_init 函数是这样定义的：

```
async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('hello_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }
    ...
}
```

结合 hello_wasm.d.ts 中的定义：

```
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
```

也就是说：

* __wbg_init 函数的可选参数 input 如果不传，则默认去加载 'hello_wasm_bg.wasm'
* __wbg_init 会返回一个 Promise



<br>

**第3步：针对返回的 Promise 进行处理**

```
helloWasm()
    .then((wasm) => {
        wasm.greet()
    })
    .catch(console.error)
```

如果 __wbg_init 返回加载顺利完成，则返回 wasm 模块实例。



<br>

**第4步：拿到 wasm 实例后调用它对外暴露的 .greet 函数**

```
wasm.greet()
```

也就是说我们在 JS 中调用 wasm 模块实例的 .greet 函数，也就是 src/lib.rs 中定义的那个 .greet 函数。



<br>

我们再来看一遍 lib.rs 的代码：

```
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, hello-wasm!");
}
```



<br>

我们从下往上看：

```
#[wasm_bindgen]
pub fn greet() {
    alert("Hello, hello-wasm!");
}
```

这个很明显：

* 对外向 JS 暴露一个名为 greet 的函数
* 在 greet 函数内部调用执行 extern "C" 中从 web_sys 引入定义的 alert 函数



<br>

那么现在问题来了：

```
#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}
```

上面代码中，对内引入一个函数签名： `fn alert(s: &str);`



<br>

我们再往上看这行代码：

```
use wasm_bindgen::prelude::*;
```

> 这需要你懂一些 Rust 最基础的语法

这行代码作用是引入 wasm_bindgen 包下的 prelude 模块下的 全部(*) 内容。

我们看一下 prelude 的官方文档：

https://rustwasm.github.io/wasm-bindgen/api/wasm_bindgen/prelude/index.html



<br>

> **Re-exports**
>
> ----
>
> pub use crate::JsCast;
> pub use crate::JsValue;
> pub use crate::UnwrapThrowExt;
> pub use crate::closure::Closure;
> pub use crate::JsError;

我们可以看到 prelude 实际上相当于一个汇总导出了很多 rust wasm 中需要用到 与 JS 沟通交互的常见模块。

> 尽管我们目前还不太知道这些模块都具体作用是什么，后面会慢慢学习。



<br>

这里我们要提到 2 个 wasm_bindgen 关联依赖的包：js_sys、web_sys

> 对于前端而言我们会说 NPM 包，对于 Rust 而言则是 crate 包 (板条箱)，
>
> 对应的包管理平台为：https://crates.io/

我们此刻只是先简单了解一下这 2 个包：

* js_sys：让 Rust 可以访问、调用 JS 标准内置对象(含属性和方法) 的包

  > 例如 Array、Object、RegExp、Map、decodeURI()、encodeURI()、eval() 等

* web_sys：让 Rust 可以访问、调用 浏览器(DOM元素和事件) 的包

  > 例如 DOM元素、Window、localStorage、scroll、onblur、onclick 等

有了 js_sys 和 web_sys 后 Rust 中就比较容易调用 网页和 JS 的各种对象和属性方法了。



<br>

我们知道网页 JS 中的 alert 函数实际上是 Window.alert。

而 web_sys 中就定义 Window

```
Struct web_sys::Window
```



<br>

到此，我们终于大致摸清楚了整个执行流程：

* 网页 JS 加载 .wasm 完成后调用 wasm.greet()
* 找到 Rust 内部定义的 greet 函数
* 找到由  `extern "C" { ... }` 中引入的 alert 函数
* 而该函数实际调用 wasm_bindgen::prelude::* 内部使用的 web_sys::Window 中的 alert 函数
* 最终执行该函数，相当于调用网页 JS 中的 alert 函数



<br>

**特别说明一下**：

wasm 是一套公开的标准，开发 wasm 有非常多种语言，而我这里选择的是 Rust，使用的是 wasm-pack。

尽管我们花了大量时间来初步学习 wasm_bindgen，但是时刻牢记：wasm_bindgen 是比较主流的开发 web wasm 的方式之一。



<br>

还记得前面提到过的 binaryen 吗？

他是由 C++ 开发的一系列针对 wasm 的工具，其中包括：

* wasm2wat：把 .wasm 文件转成(反编译) .wat
* wat2wasm：把 .wat 文件转成(编译) .wasm

这两个工具也需要我们掌握，只不过我们现在先不去学这块。



<br>

**网页加载调用 greet 函数的另外一种写法套路：**

我们之前的写法套路是：

```
<script type="module">
    import helloWasm from './wasm/hello_wasm.js';
    helloWasm()
        .then((wasm) => {
            wasm.greet()
        })
        .catch(console.error)
</script>
```



<br>

这是另外一种写法套路：

```
<script type="module">
    import helloWasm, { greet } from './wasm/hello_wasm.js'
    const init = async () => {
        await helloWasm()
        greet()
    }
    init()
</script>
```



<br>

实际工作中，可以根据个人喜好来决定使用哪种方式。



<br>

### 新建一个函数 sum：计算两数之和



<br>

**在 src/lib.rs 中新增加一个 sum 函数，用于计算两数之和：**

```
#[wasm_bindgen]
pub fn sum(a: i32, b: i32) -> i32 {
    a + b
}
```

* `#[wasm_bindgen]`：定义 sum 的属性，表明它是给 JS 使用的

* `pub fn sum(a: i32, b: i32) -> i32`：这是 rust 中定义函数参数以及返回值的写法

* `a + b`：注意在 Rust 函数语法中，如果该行命令没有以  分号 ";" 结束，那么就意味着这行代码的执行结果为该函数的返回值

  > 这点和 前端  JS 函数是不一样的



<br>

**接下来执行构建：**

```
wasm-pack build . --target web
```



<br>

> 构建时默认我们用的是项目名 hello_wasm 作为前缀，如果想自定义这个前缀，例如改为 xxx 则命令如下：
>
> ```
> wasm-pack build . --target web --out-name xxx
> ```



<br>

> 构建时默认为 --dev 我们假定最终要发布则添加参数 --release 这样的构建产物文件大小会比较小



<br>

**替换新的构建产物：**

构建好后，从 pkg/ 将得到的 4 个文件覆盖 demo/wasm/ 中。

如果你查看 hello_wasm_bg.wasm.d.ta，你会发现：

```diff
  export const memory: WebAssembly.Memory;
  export function greet(): void;
+ export function sum(a: number, b: number): number;
```

> 我们新增的 sum 函数类型定义



<br>

**修改网页JS代码：**

```
<script type="module">
    import helloWasm, { greet, sum } from './wasm/hello_wasm.js'
    const init = async () => {
        await helloWasm()
        //greet()
        console.log(sum(3, 6))
    }
    init()
</script>
```

或者将上面代码改成一个立即执行的剪头函数：

```
<script type="module">
    import helloWasm, { greet, sum } from './wasm/hello_wasm.js'
    (async () => {
        await helloWasm()
        //greet()
        console.log(sum(3, 6))
    })()
</script>
```

无论哪种，重新刷新网页，就可以在输出面板中看到 sum 计算结果 9 了。

> 由于目前构建产物和之前的名字完全相同，不像 webpack/vite 那样每次都会给文件名添加随机字符确保两次文件名不相同，所以为了避免看到的是缓存，所以记得在浏览器网络面板中，禁用缓存。



<br>

至此，我们已经从 0 开始，对 wasm 开发有了最基础入门。

接下来就开始逐渐尝试编写复杂功能了。

我们一点一点来。



<br>

### 思考一下：我们现在开发面临的调试困境

**开发调试困境：**

对于前端项目开发调试，我们都使用的是 Webpack/Vite，那么我们会享受到下面 3 个便利：

* 热更新：只要修改代码，网页立马自动热更新，可以看到修改后的效果
* 文件名：每次编译后文件名中都会增加随机字符，两次生成的文件名字不会相同，避免缓存问题
* 短命令：例如构建命令是 yarn build，比较简短，至于这条命令背后实际执行的命令比较长也无所谓



<br>

可是，目前我们开发 Rust wasm 项目，无法享受到上述 3 个便利，我们的遭遇是：

* 我们修改代码保存后，不会自动构建
* 构建时又需要敲一遍 完整的 构建命令，无法做到像前端那样简短
* 构建好的文件我们需要手工替换到前端项目中
* 由于每次构建得到的文件名字相同，在浏览器中还容易产生缓存



<br>

那该怎么办，可以解决开发过程中的这个问题呢？



<br>

**目前有效的解决办法就是：**

* 将 wasm-pack 项目放在 前端项目(例如 react 项目)的根目录，即与前端的 src/ 目录同级
* 然后在前端项目 package.json 的 "scripts" 中增加 wasm-pack 构建命令
* 由于前端项目框架本身都带有热更新，检测到 wasm-pack 产物发生变化后会重新更新前端网页



<br>

**Vite + React + TypeScript + WasmPack 示例：**

* 我们先创建 前端项目：

  ```
  yarn create vite hello_react_wasm --template react-ts
  
  cd hello_react_wasm
  yarn
  ```

* 我们再创建 wasmpack 项目：

  ```
  wasm-pack new wasm_src
  ```

* 修改前端项目 package.json ，增加构建 wasm 的命令：

  ```diff
    "scripts": {
  +    "build:wasm": "wasm-pack build ./wasm_src --target web --out-dir ../public/wasm --out-name main_wasm"
    }
  ```

  > build ./wasm_src：构建前端项目下 wasm_src/ 目录
  >
  > --target web：编译目标为 web
  >
  > --out-dir ../public/wasm：输出目录为 ../public/wasm (编译命令此时处在 wasm_src/ 目录内部)
  >
  > --out-name main_wasm：输出产物文件名前缀为 main_wasm

  > 由于目前我们仅仅刚开始开发 wasm，根本不复杂，没必要压缩产物，所以我们先不加 --release 这个参数



<br>当我们想编译 wasm 时只需执行：`yarn build:wasm`



<br>

**实际测试一下：**

> src/App.tsx

```
import './App.css'
import { useEffect } from 'react'
import initWasm, { sum } from '../public/wasm/main_wasm.js'

let ignore = false

function App() {

    useEffect(() => {
    
        if (ignore) return //这行代码是为了避免 react18 严格模式下默认会初始化 2 次这个问题
        ignore = true

        const init = async () => {
            const wasm = await initWasm()
            wasm.greet()
            console.log(sum(1, 2))
        }

        init()

    }, [])

    return (
        <>
            'hello react wasm'
        </>
    )
}

export default App
```



<br>

**清除构建时自动产生的 .gitignore 文件：**

wasm-pack 构建的目录中会自动添加 .gitignore 文件。

这个文件对于 wasm-pack 源码项目而言是有用的，但是在我们的场景中，我们不需要它，因为对于我们的 public/wasm/ 目录，我们是希望能够添加到前端项目 git 文件监控当中的。

所以，我们需要再写一个 node.js 文件用来清理我们认为不需要的构建产物。



<br>

前端项目根目录 创建一个名为 clearWasmOtherFiles.js 文件

```
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const basePath = path.resolve(__dirname, 'public/wasm/')

//如果不想要构建产物中的 package.json、README.md 也可以添加到该数组中
const delList = ['.gitignore'] 

delList.forEach(item => {
    fs.unlinkSync(path.resolve(basePath, item))
})
```

> 特别说明：由于我们这个文件是运行在前端项目，而前端项目 package.json 中 `"type": "module"`，所以即使编写的是 node.js 代码，我们只能使用 import 引入模块，而不是 require 方式。
>
> 同时 import 这种方式下不存在 __dirname，所以上面代码中我们还需要自己来实现这个变量。



<br>

最终，我们再次修改 package.json 中构建 wasm 的命令：

我们构建 wasm 完成后再执行 clearWasmOtherFiles.js

```
"scripts": "wasm-pack build ./wasm_src --target web --out-dir ../public/wasm --out-name main_wasm && node ./clearWasmOtherFiles.js",
```



<br>

至此，一个 vite + react + typescript + wasm-pack 开发环境配置完成。



<br>

## wasm_bindgen详细用法



<br>

接下来，我们将按照 https://rustwasm.github.io/docs/wasm-bindgen/examples/index.html 上的例子，过一遍。

**特别说明：**

* wasm-bindgen 示例文档中的一些 rust 语法比较老，我们将采用较新的 rust  语法
* 为了可以使用较新的 rust 语法，记得配置 Cargo.toml 中的 `edition = "2021"` 
* 侧重点在 Rust，对于 JS 中调用，若无特别之处就不演示 JS 代码了



<br>

### 示例1：alert

```
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello,{name}!"));
}
```

代码说明：

* rust 函数中是不存在 "可选参数" 这个概念的

* &str：这种强调的是 "使用值"，而非引用(指针)

* &format!("Hello,{name}!")：这是较新的写法，旧的写法是

  ```
  alert(&format!("Hello, {}!", name))
  ```

  > 变量 name 会替换 "Hello, {}!" 中的 `{}`

* 请注意在 rust 语法中字符串要用 双引号，不能使用单引号 或 反引号

  > 单引号有自己特殊的含义用途



<br>

### 示例2：console.log

再次强调一下：extern "C" { .. } 中定义的函数是指 引入外部的定义好的函数，并对其进行定义函数签名

> **"引入并定义函数签名"** 这个解释完全是我个人当下的理解，不一定严格正确。



<br>

**先讲一下 Rust 函数的一个知识点：Rust 中的函数不支持重载**

还记得 示例 1 中我们提到的一句话：**rust 函数中是不存在 "可选参数" 这个概念的**

实际上 函数参数是可选的 这个本身就是 函数重载 的一种形式，即：

* 这个函数有一种没有参数，即有  0 个参数
* 这个函数有一种情况有 1 个参数
* ...
* 这个函数有一种情况有 n 个参数

> 我们这里仅仅说了参数数量，实际就算参数数量相同，但是参数值类型不同，也视作 重载



<br>

而 函数重载 这个问题在 JS 中是不存在的，JS 的函数天生支持重载！

所以这就造成一个问题：**在 JS 中的函数是无法直接、完全和 Rust 中的函数重叠一模一样的**。

> 注：这里的 Rust 是指 wasm_bindgen、web_sys、js_sys



<br>

我们再看一下 JS 中 console.log 函数：

* 参数数量不限
* 参数类型不限

因此 JS 中的 console.log 妥妥的符合 函数重载 的一个函数。



<br>

我们看一下 web_sys 中关于 console.log  的实现：

https://rustwasm.github.io/wasm-bindgen/api/web_sys/console/index.html

> 我们只看 console.log，不看 console.info、console.warn、console.error 这些



<br>

**和 log 有关的：**

在该文档中可以看到和 log 有关的有：log、log_0、log_1、log_2、log_3、...、log_7

他们分别表示的含义：

* log：对应有 1 个参数，且参数类型为数组的 JS 中的 console.log()
* log_0：对应有 0 个参数的 JS 中的 console.log()
* log_1：对应有 1 个参数的 JS 中的 console.log()
* log_2：对应有 2 个参数的 JS 中的 console.log()
* ...
* log_7：对应有 7 个参数的 JS 中的 console.log()

> console.info、console.warn、console.error 也都是这样的

<br>

也就是说在 web_sys 中通过这种字面形式，定义多个函数来尽量模拟 "函数重载"、向 JS 中的 console.log 函数靠近。



**JsValue：**

特别说明：上面提到的 "参数" 值类型对应 wasm_pack 中定义的 JsValue

https://rustwasm.github.io/wasm-bindgen/api/wasm_bindgen/struct.JsValue.html

简单来说 JsValue 是指 JS 中简单类型的值，例如：undefined、null、string、boolean、数字(f32、f64、i32、i64)



<br>

在我们了解了 Rust 中 `extern "C"` 和 web_sys 中众多字面形式的 log 后，我们来写我们的示例吧。



<br>

**示例代码：**

```
mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(start)]
fn main() {
    log("Hello, this is main()")
}

#[wasm_bindgen]
pub fn console_log(message: &str) {
    log(&format!("Hello, {message}"));
}

```



<br>

**代码说明：**

```
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
```

在 extern 对内通过 `#[wasm_bindgen(js_namespace = console)]` 引入 web_sys 中 console 模块下的 log 函数



<br>

```
#[wasm_bindgen]
pub fn console_log(message: &str) {
    log(&format!("Hello, {message}"));
}
```

通过 pub fn 对外定义导出一个名为 console_log 的函数，在该函数内部执行 `extern "C"` 中引入的 web_sys 中的 log 函数。



<br>

```
#[wasm_bindgen(start)]
fn main() {
    log("Hello, this is main()")
}
```

在代码中我们还通过 `#[wasm_bindgen(start)]` 定义了一个内部默认执行的函数 main



<br>

也就是说，上面代码中我们实现了：

* 在 rust (wasm) 内部我们可以通过 log 函数在浏览器中输出信息

* 在外部网页 JS 我们可以通过调用 wasm 中的 console_log 函数，引发浏览器执行 log 函数

  > 注：这个 console_log 函数纯粹是我们为了练习而加上的，实际上外部网页 JS 中没有必要绕这个弯，直接执行 console.log() 就好了



<br>

**为什么之前示例中 alert 不需要 #[wasm_bindgen] ？**

这是因为 alert 是 window 下的，也就是 全局函数，即在 JS 中可以直接调用的函数。

而 log 实际是 console 下的，它是 console 名下的一个函数，在 JS 中必须通过 console.log 才能使用

**对于 JS 中的全局函数在进行 wasm 和 JS 绑定关联时是不需要使用 #[wasm_bindgen] 的，只有非全局函数菜需要。 **

这就是为什么 alert 不需要，而 log 需要 #[wasm_bindgen]。



<br>

**延展知识点：不从 web_sys 引入，而是从自定义的 .js 中引入**

我们从 web_sys、js_sys 中引入定义的函数签名，实际上都是 浏览器本身就有的各种模块、属性或方法，那有没有可能引入我们自定义的 .js 函数？

答案是：可以的



<br>

假定我们有一个 .js 文件：

> my.js

```
export function name() {
  return 'puxiao';
}
```

那么就可以在 Rust 中引入它：

```
#[wasm_bindgen(module ="/my.js")]
extern "C" {
  fn name() -> String
}
```

> 在 lib.rs 其他函数中就可以通过 name() 调用并得到该函数返回值



<br>

上面使用一个非常简单的  name() 函数来举例，实际中还有可能我们在 js 中定义一个类，例如 MyClass，那也对应有引入该类的方式，只不过过程稍微复杂一些(需要在 rust 中定义好 MyClass 的各个属性和方法 的 "结构体")，目前我们先不深究这一块，继续后面 web_sys 的学习。

可以查看官方示例：https://rustwasm.github.io/wasm-bindgen/examples/import-js.html



<br>

**请注意：我们这个示例 2 代码是正常顺利运行了，可是真的该这样做吗？**

明明是一个很简单的 console.log，结果还需要编写 `extern "C"`，以后用网页 web_sys 多个函数 都需要在 extern 中也定义一遍，多麻烦啊！

**当然有更简单的写法，稍安勿躁，等我们看完下面的 示例 3 后，会重新用新的方式写一遍示例 2，代码极其简单。**



<br>

### 示例3：创建、添加 Dom 元素

本示例将演示在 rust (wasm) 中创建一个 DOM 元素，并将该元素添加到网页中。

经过前两个示例，我们已经大概了解了这种 wasm 与 前端网页 JS 交互的套路流程：

* 在 .rs 中引入 web_sys/js_sys 中的某些函数
* 然后在 .rs 中就可以调用该函数



<br>

同样，本示例中也采用这种 相似的套路流程，只不过前两个示例都是获取 某个 函数，而本示例中 "创建、添加 DOM 元素" 需要涉及到获取 winow、document、body 这些对象，所以还是有些不同的。



<br>

**第1步：在 Cargo.toml 中明确依赖 web-sys 的哪些特征选项**

前两个示例中，我们仅仅需要引入 2 个函数，最终构建的 .wasm 文件也特别小，不到 1K。

而本示例中，我们需要操作 DOM 元素，这里面涉及的对象方法太多，所以我们需要明确定义一下依赖 web-sys 中和 DOM 元素有关的特征选项。

> 提前预告一下：本示例完成之后，最终构建的 .wasm 文件有 10K 左右



在 Cargo.toml 中新增相关依赖特征：

```diff
[dependencies]
wasm-bindgen = "0.2.84"

# The `console_error_panic_hook` crate provides better debugging of panics by
# logging them with `console.error`. This is great for development, but requires
# all the `std::fmt` and `std::panicking` infrastructure, so isn't great for
# code size when deploying.
console_error_panic_hook = { version = "0.1.7", optional = true }

+ [dependencies.web-sys]
+ version = "0.3.61"
+ features = ['Document', 'Element', 'HtmlElement', 'Node', 'Window']
```

版本说明：

* 我们明确依赖 wasm-bindgen 这个 crate 包
* 而 wasm-bindgen 这个包里又依赖 web_sys、js_sys
* wasm-bindgen 0.2.84 版本中依赖的 web_sys 包的版本就是 0.3.61

**当我们这样配置过 Cargo.toml 后，再在 VScode 中的 .rs 文件里输入 web_sys 就能获得对应的语法提示了。**

<br>

**src/lib.rs 代码：**

```
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
fn main() -> Result<(), JsValue> {

    let window = web_sys::window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let body = document.body().expect("document should have a body");

    let val = document.create_element("p")?;
    val.set_text_content(Some("Hello from Rust!"));

    body.append_child(&val)?;

    Ok(())
}
```



<br>

我们对上面代码进行解释说明。



<br>

**属于 Rust 的知识点：函数返回成功或失败的结果**

```
fn main() -> Result<(), JsValue> {

  xxx.xx().expect("xxxxx")

  let xx = xxx?;
  
  Ok(())

}
```

第1：为什么要给 main 增加 执行返回结果？

在我们示例 2 中，由于 main 中仅仅需要执行一行输出，并且网页 JS 的 console.log() 函数本身就一定会正确执行，所以示例 2 中 main 是没必要添加 是否已正确执行的返回结果的。

但本示例是创建、添加 DOM元素，这些创建和添加的过程是有可能发生报错的。

为了在网页中更好的显示出报错信息，所以给 main 增加了一个返回结果 `Result<(), JsValue>`



<br>

**在 Rust 中处理结果 Result 几个方式：**

* `Ok(())`：传递出去(返回)一个无任何有效信息的结果，用于表明执行成功

  > () 在 Rust 中表示一个不包含任何信息的单一值，因此 Ok(()) 表示 "已成功，但无需所任何事(不包含任何信息) 的一个返回值"

* `Err()`：表明出错，有报错信息的返回结果，但是本示例中并未使用 Err()

* `xx().expect("xxxxx")`：若 `.expect("xxxxx")` 前面的函数 xx() 能够有有效的返回值则忽略并继续后面代码，若 xx() 包含错误信息则中断进程，并将错误信息传递给 Result 作为返回结果

* `let xx = xxx?;`：若 ?; 前面的代码 xxx 能够成功执行则将执行结果赋值给变量 xx，若前面的代码 xxx 发生错误则中断进程，并将错误信息传递给 Result 作为返回结果



<br>

**Some("Hello from Rust!")**

Some() 是 Rust 中一个 "some值"，它用来强调表示 "这一定是一个有效、非空" 的值。

而 `Some("Hello from Rust!")` 则表达的含义是：

* 这是一个 "some值"
* 该值包含一个字符串 "Hello from Rust!"

在 Rust 中 Some 通常用于明确某个 "Option" 类型，而在 web_sys 中 Element.set_text_content() 的定义是：

```
pub fn set_text_content(&self, value: Option<&str>)
```

> 与 Some 对立的，用于表示这一定是一个空值 的是 None



<br>

**创建 DOM 元素的相关代码：**

```
let window = web_sys::window().expect("no global `window` exists");
let document = window.document().expect("should have a document on window");
let body = document.body().expect("document should have a body");

let val = document.create_element("p")?;
val.set_text_content(Some("Hello from Rust!"));
```

> window()、document()、body() 这 3 个函数分别用于尝试获取 window、document、body

当我们知道 Rust 中 .expect、Some 的语法含义后，上面的创建过程就比较容易看懂了。



<br>

再补充一个知识点：**在 rust 中声明变量与 JS 中不同的用法、作用**

* 如果使用 `let xx = ...` 就表示声明一个 固定值不变 的变量

  > 你甚至都可以理解成 "仅在当前代码作用域内的 const"

* 如果想声明可以改变值的变量，则需要使用 `let mut xx = ...`

  > 没错，就是 let 后面增加关键词 mut

* 如果想声明 常量，则使用 `const xx = ...`，使用 const 关键词声明的常量会突破作用域，任何地方都可使用

  > 你可以理解为 const 声明的是全局常量



<br>

### 重写示例1、示例2：

根据示例 3 中 的方式，我们重写一下 示例 1 的效果：

**重写示例1：**

> Cargo.toml

```
[dependencies.web-sys]
version = "0.3.61"
features = ['window']
```

> lib.rs

```
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet(name: &str) -> Result<(), JsValue> {
    let window = web_sys::window().expect("no global `window` exists");
    window.alert_with_message(&format!("Hello,{name}!"))?;
    Ok(())
}
```

> 就这么简单... 无需再编写 `extern "C" { ... }` 了



<br>

**补充说明：**

* 由于 web_sys::window() 不一定能够正确返回 winows，所以下面那行 window.alert_with_message() 不一定能够正确执行。

  > 为啥不能保证 web_sys::window() 一定能够获取到 window ？因为假定 .wasm 并不是在浏览器中运行，而是在 node.js 中执行，那本身确实获取不到 window

* 但是为了避免这个问题，我们需要将 greet 函数修改成有返回结果 Realse 的形式，然后在有可能出现问题的 语句结尾出增加 `?;` 这种形式来告知如果发生错误该怎么处理。

* 如果一切执行顺利则通过 `Ok(());` 来传递出一个无任何信息的结果



<br>

**重写示例2：**

> Cargo.toml

```
[dependencies.web-sys]
version = "0.3.61"
features = ['console']
```



<br>

> lib.rs

```
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn console_log(message: &str) {
    let log_1 = web_sys::console::log_1;
    log_1(&format!("Hello2, {message}").into());
}
```

> 就这么简单... 无需再编写 `extern "C" { ... }` 了



<br>

**补充说明：**

为什么 console_log() 并不需要像 greet() 那样定义有返回结果 Result ?

因为在 console_log() 中的代码是一定会执行的，所以无需使用 `?;`，自然也不需要将函数定义有 返回结果 Result 了。



<br>

重写后的代码比较简单，相对于最早时候还需要编写 `extern "C"`，两者的区别是：

* 前者无需配置 Cargo.toml，构建结果文件比较小

* 后者需要配置 Cargo.toml，构建结果文件稍微大一点

  > 文件大小增加几 K 是完全可以忽略的

以后类似交互，我们都使用后面这种写法。



<br>

未完待续...









