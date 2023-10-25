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

这个设置在 Rust 项目中很场景，无需过多关注。



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

* `#[wasm_bindgen] extern "C" { fn alert(s: &str); }`：

  * extern：声明一个外部函数
  * "C"：表明与编程语言 C/C++ 进行交互
  * fn alert(s: &str)：定义一个提供给 C/C++ 调用的一个 alert 函数

* `#[wasm_bindgen] pub fn greet() { alert("Hello, hello-wasm!"); }`：对外定义一个 greet 的函数，在该函数内部会调用 `alert("Hello, hello-wasm!")`

  > 注意，这里定义的 greet() 并没有使用任何 `extern` 来约束交互编程语言，那么就意味着该函数适用于 rust 默认的交互范围，那在此项目中就可以理解为与 wasm 交互。



<br>

好了，终于该看 pkg/ 目录下生成的文件了。



<br>

### pkg目录生成文件

未完待续...
