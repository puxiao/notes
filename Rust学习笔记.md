# Rust学习笔记



<br>

### 前言

作为一名前端开发者，我学习 Rust 主要是为了将来可以学习、编写 WASM。

本笔记是自己在学习 Rust 时为了加深记忆所写的碎片化知识点。



<br>

### 教程：

**官方教程：https://www.rust-lang.org/zh-CN/learn**

官方提供了 2 个学习 Rust 的教程：

* 循序渐进方式学习 Rust ：https://doc.rust-lang.org/book/
* 跳跃式，单独针对某个知识点，以示例方式学习 Rust：https://doc.rust-lang.org/rust-by-example/



<br>

**Rust中文社区：** https://rustwiki.org/

为爱发电的一群人，翻译更新维护大量 Rust 官方文档和书籍。



<br>

**国内中文教程：** https://course.rs/

一个不怎么再更新维护的中文 Rust 教程，虽然在当时写的很好，可毕竟有点年头了，一些地方讲述的有点过时，但是你可以先看看每一篇下面的评论，因为过时或者补充的内容都在评论里。



<br>

我将结合上面的教程，来记录学习 Rust 过程。



<br>

### 安装Rust

**Rust 安装下载地址：** https://www.rust-lang.org/tools/install 

> 目前最新版本为 1.72.0

我的电脑是 Windows10 x64 ，所以下面的安装步骤仅适用于我的电脑。



<br>

**第1步：下载安装 Microsoft C++ 生成工具**

下载地址：https://visualstudio.microsoft.com/zh-hans/visual-cpp-build-tools/

安装注意事项：

* 安装位置：修改安装位置，由默认 C 盘改到 D 盘

  > 如果你不担心 C 盘空间，那你可以不修改安装位置

* 工作负荷：仅勾选 `使用 c++ 的桌面开发` 即可

  > 联网需下载 1.7G 安装包( Visual Studio 生成工具 2022)

* 安装完成后，重启电脑

**添加系统环境变量：将 msvc 路径添加到系统环境变量的 PATH 中**

由于我的 Visual Studio 安装在 D 盘，所以我需要将以下路径添加到 系统环境变量 path 中：

D:\program files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\14.37.32822\bin\Hostx64\x64



<br>

> msvc 实际就是 Microsoft Visual C++ 的简写



<br>

**特别强调：在 rust 1.25.0 之前确实需要上面的第 1 步，用户先自己安装 C++ 环境，但是当 rust 1.25.0 版本以后如果你电脑上没有安装 C++ 环境，那么你可以选择忽略跳过上面的第1步，在 rust 安装过程中程序会自动下载安装 Visual Studio 2022。**

**但我个人建议还是我们自己手工安装比较好。**



<br>

**第2步：下载  rustup-init.exe**

下载地址：在 https://www.rust-lang.org/tools/install  中点击 `Download rustup-init.exe(64-bit)` 按钮

如果上面第1步 Visual Studio ( C++ 环境) 安装顺利，那么你运行 rustup-init.exe 会看到下面的命令结果：

```
The Cargo home directory is located at:

  C:\Users\xxx-your-name\.cargo

This can be modified with the CARGO_HOME environment variable.

The cargo, rustc, rustup and other commands will be added to
Cargo's bin directory, located at:

  C:\Users\xxx-your-name\.cargo\bin

This path will then be added to your PATH environment variable by
modifying the HKEY_CURRENT_USER/Environment/PATH registry key.

You can uninstall at any time with rustup self uninstall and
these changes will be reverted.

Current installation options:


   default host triple: x86_64-pc-windows-msvc
     default toolchain: stable (default)
               profile: default
  modify PATH variable: yes

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
>
```

> 看到这个界面后先不要着急安装



<br>

**第3步：修改 rust、cargo 默认安装目录**

在上面的命令信息中我们可以看到

```
Rustup metadata and toolchains will be installed into the Rustup
home directory, located at:

  C:\Users\xxx-your-name\.rustup

This can be modified with the RUSTUP_HOME environment variable.

The Cargo home directory is located at:

  C:\Users\xxx-your-name\.cargo
  
This can be modified with the CARGO_HOME environment variable.
```

<br>

从上面可以看到 2 条信息：

* 默认 rust、cargo 安装位置 C:\Users\xxx-your-name\xxx

* 你可以修改 环境变量 "RUSTUP_HOME、CARGO_HOME" 来修改默认的安装位置

  > This can be modified with the RUSTUP_HOME environment variable.
  >
  > This can be modified with the CARGO_HOME environment variable.

  

<br>

cargo 是用来存放 rust 中各个安装包的，相当于前端中的 npm 本机存放目录。

我们不希望 C 盘越来越大，所以需要先修改默认的安装目录。

> 当然，还是那句话，如果你不担心 C 盘空间，那你可以跳过本步骤，直接进行第 4 步。



<br>

那么我们就修改默认安装目录吧。

**首先在 D 盘创建 2 个目录：**

* D:\rust\cargo
* D:\rust\rustup

**然后添加环境变量：电脑 > 属性 > 高级系统设置 > 环境变量 > 系统变量 > 新建**

依次添加下面 2 个系统变量：

* CARGO_HOME，目录指向 D:\rust\cargo
* RUSTUP_HOME，目录指向 D:\rust\rustup



<br>

**第4步：安装 rust、cargo**

先关闭之前已打开的 `rustup-init.exe` 命令窗口，然后重新打开它。

这次运行命令窗口中的内容就变成了：

```
Rustup metadata and toolchains will be installed into the Rustup
home directory, located at:

  D:\rust\rustup

This can be modified with the RUSTUP_HOME environment variable.

The Cargo home directory is located at:

  D:\rust\cargo

This can be modified with the CARGO_HOME environment variable.

....

1) Proceed with installation (default)
2) Customize installation
3) Cancel installation
>
```

此时，我们只需输入 `1` 一路按回车键安装即可。

安装过程完成后，你会看到下面信息即表示安装成功：

```
info: default toolchain set to 'stable-x86_64-pc-windows-msvc'

  stable-x86_64-pc-windows-msvc installed - rustc 1.72.0 (5680fa18f 2023-08-23)

Rust is installed now. Great!

To get started you may need to restart your current shell.
This would reload its PATH environment variable to include
Cargo's bin directory (D:\rust\cargo\bin).

Press the Enter key to continue.
```

* 我们安装的 rust 版本为 1.72.0
* Rust、Cargo 被安装到了 D:\rust\cargo\bin



<br>

**第5步：验证 rust、cargo 是否安装成功**

随便找个目录，打开命令窗口，依次执行下面命令：

```
rustc -V
cargo -V
```

> 注意是大写字母 -V，小写字母 -v 不行

能够正确输出 rustc、cargo 版本号即证明我们已经安装成功了。



<br>

**以后可能需要的命令：**

更新当前 rust 版本：

```
rustup update
```



<br>

卸载 rust：

```
rustup self uninstall
```



<br>

如果你不使用 `rustup-init.exe` 安装 Rust，那可以从上面第 2 步开始可以直接改为下面方式安装。

**修改安装请求下载地址并使用命令方式安装 Rust：**

具体直接查看：https://rsproxy.cn/#getStarted 即可

> rsproxy.cn 是字节跳动创建的 Rust 国内镜像安装源，提供 Rust 和 Cargo 依赖包 镜像下载服务。



<br>

至此，无论你采用 `rustup-init.exe` 还是 rsproxy.cn 上推荐的命令安装，Rust 开发环境安装完成。



<br>

### 配置 VSCode

**在 VSCode 中安装插件：rust-analyzer**

> 这个插件是必须安装的，因为太有用了



<br>

**其他插件：**

下面这几个插件并不是必须的，也不是 rust 专属的，而是日常我们开发中(包括前端项目)都非常有用的。

* Error Lens：错图信息提示相关

* One Dark Pro：主题相关

* CodeLLDB：调试相关

* Even Better TOML：Cargo.toml 文件相关

  > Rust 项目中的 Cargo.toml 文件相当前端项目中的 package.json 文件



<br>

至此，本机的 Rust 开发环境已经配置好了。



<br>

### Rust项目常用命令：新建(new)、运行(run)、构建(build)、检查(check)

**Cargo：Rust 包管理工具，相当于前端项目中的 Yarn**



<br>

**cargo 与 rustc 的关系**

rustc 即 rustc.exe，它是 rust 原始方式编译 .rs 文件为可执行的二进制文件。

但实际中我们一个 Rust 项目会包含多个我们自己编写的 .rs 文件，并且还有安装别人写好的依赖包，那么如果开发者直接使用 rustc 进行逐个编译会非常复杂。

而 cargo，即 cargo.exe 则可以承担 Rust 项目整体代码 (自己写的 .rs 代码 + 第三方依赖包 rust 代码) 的编译。

cargo 内部会调用 rustc 来编译各个 .rs 文件，对于我们开发者而言省事省心。



<br>

所以，我们接下来的所有命令都是基于 cargo 开头的。



<br>

**新建Rust项目：**

假设我们要创建一个 hello_world 的项目，则命令如下：

```
cargo new hello_world
```

项目创建完成，我们得到下面的目录结构：

```
src/
  main.rs
target
  debug/
  .rustc_inof.json
  CACHEDIR.TAG
.gitignore
Cargo.lock
Cargo.toml
```



<br>

**Rust目录结构**：

* 默认源码存放在 src 目录下，当前仅默认入口文件 main.rs

  > main.rs 中默认存在一个 main 的入口函数

  ```
  fn main() {
      println!("Hello, world!");
  }
  ```

* target 目录相当于前端项目中的 build 或 dist 目录

* 自动会创建 git，并且 .gitignore 文件中会忽略 target 目录

* 项目根目录下的 Cargo.toml 相当于前端项目中的 package.json，用来描述项目信息，以及将来可能需要的依赖包

  * [package]：项目描述信息，项目名、默认版本号、编译包版本号(edition)
  * [dependencies]：项目依赖信息

* Cargo.lock 自然相当于 yarn.lock 这样的文件，相当于锁定依赖包版本



<br>

**编译包版本号(edition)的说明：**

首先说明一下 Rust 版本大约每 6 周发布一次，但是 Rust 编译包是 2 - 3 年发布一次。

目前 Rust 编译包版本号分别是：2015、2018、2021

所以在 Cargo.toml 中目前默认使用的 edition 值为最新的 2021。



<br>

> 最近开始看 极客时间 上 张卫东 老师 2021年时候录的 Rust 课程，在他的视频中将 "编译包保本号" 称之为 "版次"。
>
> "版次" 是书籍印刷上的一个词语，用于表示 "第几次印刷该书籍"。



<br>

**关于 不同编译包版本 的兼容说明：**

* 过早的 2015 我们就不说了，说一下 2018 与 2021

* 首先你在编写 Rust 代码时都可以使用最新的语法，也就是说开发过程中你无需关心编译包版本号

* 当你决定编译时，假设你选择编译包为 2018，你所写的最新 Rust 语法会被编译为 2018 所能执行、理解 的对应代码

* 简单来说：**你无需担心由于选择了 2018 而不敢使用新的 Rust 语法**

* 当然这里面有一个最大的前提：那就是 **该年号版次 依然处于未冻结状态**，也就是说 依然处于维护阶段

  > 当前最新的编译包版本为 2021，但 2018  依然处于未冻结、维护状态中



<br>

**运行Rust项目：**

由于我们默认创建的项目入口代码 main.rs 中的入口函数 main() 已经自动被创建好，所以我们可以直接在命令中输入：

```
cargo run
```

运行结果：

```
   Compiling hello_world v0.1.0 (F:\rust\hello_world)
    Finished dev [unoptimized + debuginfo] target(s) in 0.98s
     Running `target\debug\hello_world.exe`
Hello, world!
```

上面 4 行输入结果信息依次表达的信息是：

* 开始编译(compiling) hello_world
* 完成 dev [unoptimized + debuginfo] 目标编译，用时 0.98s
* 运行 `target\debug\hello_world.exe`
* 输出执行结果：Hello, world!



<br>

**关于 dev [unoptimized + debuginfo] 的说明：**

在我们通过 `cargo run` 运行 rust 项目时，输出信息中包含 `dev [unoptimized + debuginfo]` 信息。

它的意思是说：当前编译运行的是 dev 开发调试版本：

* unoptimized：未做编译优化
* debuginfo：包含 debug 信息

并且最终编译产物存放位置：target\debug\hello_world.exe



<br>

**参数 --release：**

如果我们把运行命令中添加 `--release` 参数：

```
cargo run --release
```

那么这次运行得到的信息与之前不同之处：

```diff
   Compiling hello_world v0.1.0 (F:\rust\hello_world)
-    Finished dev [unoptimized + debuginfo] target(s) in 0.98s
+    Finished release [optimized] target(s) in 1.31s

-    Running `target\debug\hello_world.exe`
+    Running `target\release\hello_world.exe` 

Hello, world!
```



<br>

**区别之处：**

```diff
-    Finished dev [unoptimized + debuginfo] target(s) in 0.98s
+    Finished release [optimized] target(s) in 1.31s
```

* 完成的结果不同，之前是 dev，而这次是 release
* 之前 dev 时是 [unoptimized + debuginfo]，即 `未做编译优化 + debug调试信息`，而现在的是 [optimized] 即 `已做编译优化`
* 之前 dev 编译所需时间 0.98s，而现在 release 编译所需时间 1.31s



<br>

```diff
-    Running `target\debug\hello_world.exe`
+    Running `target\release\hello_world.exe` 
```

* 之前 dev 时产物保存在 target\debug\ 目录，而现在 release 时产物保存在 target\release\ 目录中



<br>

简单来说：

* dev 未做编译优化，且包含 debug 调试信息，编译所需时间较短
* release 做了编译优化，但不再包含 debug 调试信息，编译所需时间较长

所以对于日常调试来说，不需要添加 --release 参数，直接 cargo run 是最合适的。



<br>

**构建Rust项目：**

开发 Rust 项目过程中我们不断使用 cargo run 来做调试，当项目开发完成后，则需要构建项目。

```
cargo build
```

执行上述命令后，会看到输出信息：

```
Finished dev [unoptimized + debuginfo] target(s) in 0.06s
```



<br>

也可以加入 --release 参数：

```
cargo build --release
```

得到执行输出信息：

```
Finished release [optimized] target(s) in 0.04s
```



<br>

**运行与构建命令的区别：**

简单来说 运行(cargo run) 相当于：

* 先执行构建
* 再直接运行构建产物

而 构建(cargo build) 仅执行构建，构建完成后并不会运行构建产物。



<br>

**运行与构建命令的相同之处：**

这两个命令都可以添加 --release 参数。

但是他们在 dev 和 release 所需时间却不相同：

* `cargo run --release` 中 dev 要比 release 所需时间更快
* `cargo build --release` 中 dev 要比 release 所需时间更久



<br>

简而言之：

* 在运行模式下 dev 要比 release 更快
* 在构建模式下 dev 要比 release 更慢



<br>

**特别补充：**

**由于我们目前的 Rust 项目并没有安装任何依赖包，所以运行和构面时都没有对于依赖包的安装和检查。**

> 当前项目中 Cargo.toml 中的 [dependencies] 下面没有任何内容

如果后面我们安装了某个依赖包，那么运行和构建时还会针对依赖包进行检查和下载。



<br>

**检查项目是否可以通过编译：**

无论在运行模式 还是 构建模式下，都需要先打包(构建)一遍项目。

但是随着项目越来越复杂，每一次运行或构建都需要比较久的时间，如果我并不需要运行或构建，我只是想知道当前代码是否正确，即是否可以通过编译，那么可以使用下面命令：

```
cargo check
```

同样也支持添加 --release 参数

```
cargo check --release
```

 

<br>

`cargo check` 仅仅检查当前项目代码是否可以通过编译，而并不会真正去执行编译，所以所需时间相对比较短。

对于复杂项目而言，这个在编写代码过程中也非常有用。



<br>

好了，关于 Rust 项目 Cargo 一些基础命令讲解完毕。



<br>

### rustc 编译 .rs 文件

<br>

**使用 rustc 构建 .rs 文件：**

对于我们当前的项目，由于过于简单，我们也可以直接使用 rustc 来构建 src/main.rs 文件。

```
rustc src/main.rs
```

执行完成后，会在项目根目录生成 2 个文件：

* mian.exe：main.rs 编译后可执行的二进制程序
* main.pdb：在编译 main.rs 时生成的调试信息文件



<br>

**请注意：上面所说的前提语境是指——在 windows 系统上编译，也就是执行文件为 main.exe，而如果是 Linux/MacOS 系统则编译执行结果文件仅为 main，不会有后缀 .exe**



<br>

**为什么要用 cargo 编译而不是 rustc ？**

从上面 `rustc src/main.rs` 可以看出，rustc 每次只能编译一个 xxx.rs 文件，当项目复杂后我们无法手工使用 rustc 对那么多 .rs 文件逐一编译，而只能靠 cargo 来整体编译。



<br>

**Rust中有没有热更新？**

就像前端项目那样，当我修改项目代码，浏览器调试页面中会自动根据代码变动更新页面。

就目前而言是没有 官方出的 Rust 热更新框架的。

只有一些个人通过某些 奇淫技巧 实现的热更新，例如：https://github.com/rksm/hot-lib-reloader-rs



<br>

**特别重要的一个思考：Rust 项目与前端项目在编译方面有什么不同之处？**

我们知道对于前端项目中用到的脚本 .js，实际上我们只是在编辑器中不断修改它的内容代码，并不会直接编译，而真正解析执行该 .js 实际上是靠 JS 执行环境，例如 node.js 或 浏览器。

说直白点就是：**前端项目中我们只管编写 .js 代码而不负责编译 .js 代码，若代码有错误也是依靠 JS 运行环境中发现的，然后在运行环境中报错，输出错误信息。**

上面这句话还暗含了另外一层含义：若想运行我们编写的 .js 文件，需要客户端上有可以运行 JS 的环境。

说直白点就是：**假设我们编写好 .js 文件了，若发给一个没有运行 JS 环境的电脑上，这些 .js 文件是无法运行的。**



<br>

**而 Rust 不是这样的，我们编写的 .rs 文件需要先经过本机 rustc/cargo 编译之后，得到可执行二进制文件 (例如 main.exe)，然后才可以运行的。而我们把这个可执行二进制文件 (例如 main.exe) 发给一个没有安装 Rust 环境的电脑上，依然是可以执行的。**



<br>

### cargo的全部命令

如果你想了解 cargo 的全部命令，可访问官方文档：https://doc.rust-lang.org/cargo/commands/index.html

大体上可以分为：

* 常规相关命令，例如
  * cargo：查看 cargo 帮助信息，等同于 cargo help
  * cargo help：查看 cargo 帮助信息
  * cargo version：查看 cargo 版本

* 生成相关命令，例如
  * cargo run：构建并运行
  * cargo build：构建
  * cargo check：检查是否可通过编译
  * cargo test：运行单元测试
  * cargo doc：自动生成文档
  * ....
* 声明相关命令，例如我们接下来就要学习的安装依赖包
  * cargo add：安装依赖包
  * cargo remove：删除依赖包
  * cargo tree：输出树状结构
  * cargo update：更新
  * ...
* 项目相关命令，例如
  * cargo new：新建项目
  * cargo install：构建并安装一个 Rust 二进制文件
  * cargo uninstall：删除一个 Rust 二进制文件
  * cargo search：在 crates.io 上搜索某个依赖包
  * ...
* 发布相关命令，即发布自己的依赖包到 crates.io 上
  * cargo login：登录
  * cargo logout：登出
  * cargo owner：当前登录者信息
  * cargo publish：发布
  * ...



<br>

至此，我们对学习 Rust 已经有一个较为清晰的方向：

* 第1阶段：先学习 cargo 相关命令，让我们可以了解如何创建、运行、构建 Rust 项目
* 第2阶段：才真正进入 Rust 语法学习



<br>

接下来，我们学习一下 cargo 安装和删除依赖包。



<br>

### Rust依赖包：安装(add)与删除(remove)



<br>

**依赖包官方网址：https://crates.io/**

这个就像前端 NPM 依赖包官网：https://www.npmjs.com/ 一样，是官方默认的依赖包平台。

我们可以 查找发布依赖包、注册会员、发布自己的依赖包。



<br>

> 单词 crate 意思是 "大木箱"，crates 是它的复数形式。
>
> 而我们刚才运行项目使用的 cargo 单词本意为 "货物"。



<br>

**安装依赖包：**

假定我们现在要安装一个和时间有关的依赖包，包名叫：time

那么安装该依赖包的命令为：

```
cargo add time
```

执行完成后，我们再去看 Cargo.toml 文件，就会发现：

```diff
  [dependencies]
+ time = "0.3.28"
```

> 依赖包中就新增加了一条依赖包记录：`time = "0.3.28"`
>
> 即安装了 time 这个包最新版本 0.3.28



<br>

**但是请注意，cargo add 命令仅仅是将我们需要安装的依赖包信息添加到 Cargo.toml 中，此时并不会自动取下载该依赖包文件。**



<br>

**只有当我们去执行 cargo run 或 cargo build 时才会真正去下载刚才安装的依赖包。**

例如我们刚才添加了 time 依赖包，那么此时去执行 `cargo run`，会得到下面输出信息：

```
...
Downloaded time v0.3.28
...
```

> 下载 time 依赖包，以及 time 所依赖的其他依赖包



<br>

**已下载的依赖包文件会被存放到  registry/ 中**。

> 我之前安装 rust 时已配置 "CARGO_HOME" 环境变量，指向 "D:\rust\cargo"，那么 registry 目录实际位于 "D:\rust\cargo\registry"

在 registry 目录下存在 3 个目录：

* cache：依赖包编译后的缓存

  > 这些缓存文件利于我们反复使用依赖包，不需要每一次都去编译一遍依赖包源码

* index：依赖包索引

* src：依赖包源码



<br>

这 3 个目录中都存在一个名为  "index.crates.io-xxxxxx" 的目录，目录名中的 `index.crates.io` 表示我们这些依赖是从 crates.io 上下载的。

若将来修改其他 cargo 的安装镜像源，则会新创建对应的目录名。

> 如何修改安装依赖镜像源，我们会在稍后讲解。



<br>

**当我们后面再次执行 cargo run 时，由于之前已经下载过 time 这个依赖包文件，所以就不需要再下载一次 time 依赖包了。**

假设别的项目以后也用到了 time 这个依赖包，并且 time 版本号还相同，则也不需要重新下载了。



<br>

**卸载依赖包：**

例如卸载 time 这个依赖包，对应命令为：

```
cargo remove time
```

执行完成后 Cargo.toml 的依赖中就没有 time 这条记录了。



<br>

假设执行 cargo remove 后发现当前项目没有任何依赖包，那么 Cargo.toml 中甚至连 `[dependencies]` 这条属性名都会被删除。

不过不用担心，当你下次安装某个依赖包时，`[dependencies]` 如果不存在则会自动添加上的。



<br>

**修改依赖包安装源：**

作为前端开发我们都知道如果直接从 NPM 官方下载依赖包会比较慢，通常我们会修改成 淘宝镜像源。

```
//查看当前 npm 安装源
yarn config get registry

//修改 npm 安装源
yarn config set registry https://registry.npm.taobao.org

//切换回 默认的 官方安装源
yarn config set registry https://registry.yarnpkg.com
```



<br>

同理，Rust 项目如果从官方默认的 crates.io 上下载依赖包 也会比较慢，我们也需要切换成国内的安装源。

这就需要我们修改 config.toml 文件。



<br>

**关于config.toml文件的说明：**

* config.toml 是 Rust 配置项文件
* config.toml 中有众多配置项，例如 环境变量、依赖安装源 等等
* 关于 config.toml 的全部配置项，可查阅官方文档：https://doc.rust-lang.org/cargo/reference/config.html
* 对于我们本小节而言，我们先只学习 如何修改 依赖安装源



<br>

**config.toml文件存放位置：**

* 如果只针对当前项目，在项目根目录创建 config.toml 即可

  > 如果没有该文件则手工创建

* 如果针对全局，则存放位置为 `$CARGO_HOME/config.toml`

  > 如果没有该文件则手工创建



<br>

实际上配置文件可以省去文件后缀 .toml，即 `config`，里面的配置项内容和格式不变，也是可以被 cargo 识别的。

> 个人推荐增加文件后缀名



<br>

**配置项的合并与优先级：**

如果当前项目和全局都存在 config.toml，那么会对 `当前项目配置文件与全局配置文件` 进行合并。

若存在相同的配置项，则当前项目的配置优先级高。



<br>

**好了，回到我们修改修改安装源这个话题上。**



<br>

官方的安装源为：https://github.com/rust-lang/crates.io-index

<br>

**国内镜像源一览：**

* 中国科技大学镜像源：git://mirrors.ustc.edu.cn/crates.io-index
* 清华大学镜像源：https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git
* 字节跳动镜像源：https://rsproxy.cn/crates.io-index (强烈推荐)



我们选择直接在 全局配置文件中 修改安装源。

* 第1步：打开全局配置文件 config.toml

  > 若不存在自己创建
  >
  > 对于我电脑而言 文件位于：D:\rust\cargo\config.toml

* 第2步：添加下面的内容

  ```
  [source.crates-io]
  replace-with = 'rsproxy-sparse'
  [source.rsproxy]
  registry = "https://rsproxy.cn/crates.io-index"
  [source.rsproxy-sparse]
  registry = "sparse+https://rsproxy.cn/index/"
  [registries.rsproxy]
  index = "https://rsproxy.cn/crates.io-index"
  [net]
  git-fetch-with-cli = true
  ```

> 修改配置后，为了确保生效，记得关闭并重新打开一次命令窗口。



<br>

**如何检查是不是镜像源生效了？**

安装新依赖包时下载速度肯定特别快，那就证明我们启用国内镜像源成功了。

也可以去 `$HOME\registry\index` 目录中查看，如果新安装过依赖包，那么会发现新增一个名为 `rsproxy.cn-xxxxxx` 的目录，已经证明我们新安装的依赖来源于 rsproxy.cn。



<br>

**恢复官方默认的镜像源：**

当你不想使用国内镜像源了，那直接删除上面配置即可。



<br>

至此 Rust 开发环境、cargo 常用命令、修改成国内镜像源 都已经学习完成，可以开始真正 Rust 语法学习和实际代码编写了。



<br>

### Rust基础语法和概念

在开始学习 Rust 语法之前，我先说一下我本身会的编程语言：

* Flash AS3
* JS/TS
* Node.js
* WGSL(WebGPU着色器语言，一种类似 Rust 的语言)

因此在学习 Rust 过程中一些常见编程语法就简单一提而过。



<br>

**Rust语法与前端JS/TS语法 特别之处：**

* Rust 代码中使用变量对象分为：引用 或 使用该值，而 JS 最对象全部为引用




<br>

**代码结尾需加 `;`**

Rust 代码中代码结尾处都需要分号 `;`



<br>

**关于双引号与单引号："" 与 ''**

Rust 代码中对于字符串必须使用双引号 `""`，单引号 `''`在 Rust 中有特殊含义



<br>

**使用引用值与值：`&`**

Rust 代码中使用变量对象分为：引用 或 使用该值，而 JS 最对象全部为引用。

* 使用该值：直接使用变量则表示为 使用该变量此刻的值，以后变量值变了也不会受影响，继续使用当初那个值

* 引用值：在变量前增加 `&` 表示使用 引用，以后变量值变了就也会跟着变



<br>

**打印：println!()**

Rust 中打印输出使用的是 `println!()` 函数，切记 println 后面要加一个 感叹号 `!`

加感叹号的含义是："将以宏形式运行"，具体含义等以后慢慢学习再深入理解吧



<br>

**引入：使用 use + ::**

假设在前端项目中从某个包中引入某个函数，则代码：

```
import xx from 'xx'
import { xxx } from 'xxx'

xxx()
```

> 这里的 xx 有可能是 rust 自带的模块，也有可能是通过 `cargo add xx` 安装的第三方模块

<br>

而在 Rust 中：

* 不使用 import 而是使用 `use`
* 不使用 `{} + from` 而是使用双冒号 `::`

上面代码在 Rust 中对应的是：

```
use xx
use xx::xxx

xxx()
```

还可以多层级引入：

```
use xx::xxx::yyy

yyy()
```



<br>

**变量名、函数名、参数名：**

* 和绝大多数编程语言一样，Rust 禁止用户使用一些关键词来作为 变量名、函数名、参数名
* 不允许数字作为开头，但是允许以 下划线 _ 开头



<br>

**Rust中的：严格关键词、保留关键词、弱保留关键词**

Rust 中的关键词就分为上述 3 中：

* 严格(strick)：严格明确为 Rust 已经使用的关键词，禁止用户声明变量时使用
* 保留(reserved)：保留关键词，虽然当前还未使用，但是也不允许声明变量时使用
* 弱保留(weak)：虽然当下并不是保留关键词，但是官方认为有可能将来提升为保留关键词，所以也尽量不用这类关键词

以上 3 种关键词都不可用于 变量名、函数名、函数的参数名。

具体都有哪些，可查阅：https://doc.rust-lang.org/beta/reference/keywords.html



<br>
简单来说就先讲这些了，接下来我们需要从最基础的 Rust 标准库(std)来学起。



<br>

## Rust标准库(std)



<br>

**Rust标准库：std**

英文官方文档：https://doc.rust-lang.org/std/index.html

中文翻译文档：https://rustwiki.org/zh-CN/std/

> 中文翻译文档由 Rust中文社区 翻译，几乎和英文官方文档同步更新，就算没有同步也相差不大，可以放心阅读。

> 当然这里提到的 "Rust中文社区" 是自封的，并不是官方认证的。



<br>

**什么是 Rust 标准库(std) ？**

简单来说就是 Rust 最基础的、最核心的模块。

"std" 实际上是英文单词 "标准" standard 的简写 (前2个字母 + 最后1个字母)



<br>

**使用标准库：**

请注意：并不因为是 标准库而就不需要使用是引入。

当我们需要使用标准库中年的某一个模块时，可以通过下面方式引入：

```
use std::xxx
```



<br>

**标准库都包含哪些模块？**

标准库包含了很多 Rust 编程所需的基础操作模块，例如：

* alloc：内存分配相关
* env：进程环境相关
* error：处理错误相关
* fs：文件操作相关
* net：网络通信相关
* os：当前操作系统相关
* path：路径相关
* str：字符串操作相关
* ....



<br>

也包括一些基础数据类型，例如：

* bool(布尔)、array(数组)、char(字符)、nerver
* f32、i32、f64、i64、u8、u16、u32、u64 ...



<br>

**宏(macros) ？**

这是和 进程 相关的一个名词，目前我也不是很掌握理解，但是你知道这是一个非常重要的概念即可。

如果你不理解 宏 (宏指令) 可能就学不会 Rust。

> 在 JS 中是不存在 宏 这个概念的



<br>

> 以下解释来自 chatgpt：
>
> 在计算机编程中 宏(macros) 是一种用来简化和重复执行的工具。宏是一组预定义的指令或代码片段，它们可以在你的程序中被多次使用，而不必每次都手动编写相同的代码。
>
> 举个例子：假设你需要在多处打印 "hello" 这个任务，你可以定义一个名为 "HELLO" 的 宏，然后每当你需要打印这句话时只需要使用这个宏，而不必反复编写打印的代码。
>
> 类似于你创建了一个代码模板，让你可以反复使用。



<br>

标准库中也包含了一些 Rust 流程控制的关键词，例如：

* async、await
* if、for、while、try/catch、loop、match 等
* 还有一些和指针相关的
* ...
* 甚至负责引入模块的 use  也都属于标准库

> 像上面这些这些关键词，都可以直接只用，无需引入



<br>

关于标准款就先笼统讲到这里。



<br>

## 关于Rust中的一些术语



<br>

由于 Rust 庞大而复杂，里面包含了特别多的术语。

幸好，我们可以查看这些 术语 的中英对照翻译：

https://rustwiki.org/wiki/translate/english-chinese-glossary-of-rust/



<br>

## 通过例子学习 Rust



<br>

假定我们现在已经对 Rust  有了最初的认知，那么接下来就是需要开始通过大量示例来学习。

可以查看这个示例教程：

https://rustwiki.org/zh-CN/rust-by-example/



<br>

对于我个人而言，我学习 Rust 的初衷是为了想去编写 wasm 。

对应的教程是：

https://rustwasm.github.io/docs/book/



<br>

路漫漫其修远，吾将上下而求索。
