# wasm-bindgen学习笔记

本文是基于独立使用 [wasm-bindgen](https://github.com/wasm-bindgen/wasm-bindgen) 开发，而非 [wasm-pack](https://github.com/drager/wasm-pack) 、[trunk](https://github.com/trunk-rs/trunk)、[yew](https://github.com/yewstack/yew)。

<br>

我也是刚开始学习中，本文可能有讲错的地方，还请指正。

<br>

### 安装

**使用 cargo 安装到全局：**

```
cargo install wasm-bindgen-cli
```

> 这种方式是推荐的做法，即拉取最新代码、安装相关依赖、本地编译。
> 
> 优点是代码和依赖都是最新的，缺点是下载文件比较多，安装过程时间略久。

<br>

**另外一种安装方式：**

```
cargo binstall wasm-bindgen-cli
```

> 这种方式是直接使用代码仓库中已经编译好的版本文件。前提是你本机已安装有 `cargo-binstall`。
> 
> 优点是安装速度快，缺点是代码和依赖或许不是最新的。

<br>

**未来升级版本：**

```
# 安装升级工具
cargo install cargo-update

# 升级所有已安装的工具包
cargo install-update -a
```

<br>

### 新建

```
cargo new --lib my-wasm-lib
```

> 我们是为了 web 创建可调用的 wasm，所以在创建 rust 项目时我们使用 --lib 参数。

> cargo 项目目录名允许使用 中划线或下划线，但是按照一般习惯在开发 lib 包时项目目录名推荐使用中划线。

> 虽然你项目名称是用 xx-xx 中划线，包括 Cargo.toml 中 name 也是 xx-xx 中划线，但是当你最终构建生成得到的文件却是 xx_xx.wasm，这是 rust 构建产物的一种命名约定。

<br>

### 配置

**安装依赖：**

```
cd my-wasm-lib
cargo add wasm-bindgen
```

<br>

当前仅仅是一个简单的函数，并未涉及 DOM 元素交互，因此我们暂时可以先不安装和配置 [web-sys](https://github.com/wasm-bindgen/wasm-bindgen/tree/main/crates/web-sys) 。

<br>

**当前的 Cargo.toml**

```
[package]
name = "my-wasm-lib"
version = "0.1.0"
edition = "2024"

[dependencies]
wasm-bindgen = "0.2.100"
```

虽然前面创建项目命令 `cargo new --lib my-wasm-lib` 中有 `--lib`，但这默认使用的是 `rlib` (Rust Library)，也就是针对同样是 rust 项目使用的库。

而我们本项目实际上是要给非 Rust 语言(C,C++,Python,Node.js/WebAssembly) 提供的库，所以需要声明配置 **`cdylib`** (C-compatible Dynamic Library)

> cdylib 针对不同平台最终构建产物：
> 
> - Linux/macOS：会生成 .so 或 .dylib 文件
>   
> - Windows：会生成 .dll 文件
>   
> - WebAssembly：会生成 .wasm 文件
>   

> 如果要编译成静态库给 C 使用，则对应 `staticlib` 类型。

<br>

**修改后的Cargo.toml**

```
[package]
name = "my-wasm-lib"
version = "0.1.0"
edition = "2024"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2.100"
```

<br>

### 示例代码：

**rust 示例代码：**

> src/lib.rs

```
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

> 在 rust 函数中代码结尾处不加 分号(;) 即表示 return 该计算结果。

<br>

### 构建

<br>

**添加构建目标(仅第一次运行)：**

```
rustup target add wasm32-unknown-unknown
```

> 查询当前系统支持的目标列表命令为 `rustup target list`

<br>

**生成wasm文件：**

```
# 生成未优化的 wasm
cargo build --target wasm32-unknown-unknown

# 生产环境构建(优化版)
cargo build --release --target wasm32-unknow-unknow
```

> 最终生成的 .wasm 文件位于：
> 
> ./target/wasm32-unknow-unknow/release/my_wasm_lib.wasm

> 再次提醒：虽然 Cargo.toml 中配置名 my-was-lib 连接符为中划线，但是 rust 构建产物文件名自动转为下划线。

<br>

**生成 JS 胶水代码：**

```
wasm-bindgen --out-dir ./out --target web \
  target/wasm32-unknown-unknown/release/my_wasm_lib.wasm
```

> `--out-dir ./out` ：指定产物存放目录 `./out` 是指在项目根目录下的 ./out 目录，若该目录不存在则会自动创建。
> 
> `--target web` 指定构建目标为 `web`

> 构建目标(--target) 可选的值：
> 
> - web：浏览器
>   
> - nodejs：Node.js
>   
> - bundler：webpack/rollup 等打包器
>   

> 上述命令中最后的 "target/wasm32-unknown-unknown/release/my_wasm_lib.wasm" 就是告诉 wasm-opt 我们要优化的 .wasm 文件路径

<br>

**其他可选参数：**

- --typescript：生成 .d.ts 文件
  
- --out-name custom_name：替换输出文件名(.js/.wasm/.d.ts) 的前缀
  
  > 比如我们原始的 .wasm 文件名为 "my_wasm_lib.wasm"，那么默认经过 wasm-bindgen 优化后输出的文件名为 my_wasm_lib_bg.wasm。
  > 
  > 如果我们增加参数 `--out-name v20250820`，那么最终输出文件为：v20250820_bg.wasm
  > 
  > 也可以使用 "dev" 或 "prod" 作为前缀来区分 开发版和正式版。
  
- --debug --keep-debug：保留调试信息(禁用优化)
  
- `--omit-default-module-path` ：省略(omit) 生成的 .js 中 input 函数中加载 .wasm 文件资源的默认地址。
  
  input 函数默认加载的 .wasm 文件是和 .js 同目录的 "./my_wasm_lib.wasm"。
  
  通常来说 .wasm 和生成胶水代码 .js 文件就应该位于同一目录，所以一般并不建议增加 `--omit-default-module-path` 参数。
  
  除非你对 胶水代码.js 想进行某些打包优化，那么这种情况下你才应该是用该参数。
  

<br>

### 优化压缩(可选)

优化压缩 .wasm 文件需要用到 binaryen 提供的 wasm-opt 工具。

<br>

**binaryen** 代码仓库是：https://github.com/WebAssembly/binaryen/

> binaryen 是单词 binary(二进制) + en(encode) 组合而来，因此你可以把 binaryen 读成 /baɪnəri-en/

<br>

**binaryen** 提供了非常多和 wasm 相关的工具：

- wasm-opt：.wasm 优化(optimize) 工具
  
- wasm2js：.wasm 转 js 工具
  
- wasm-merge：.wasm 文件合并工具
  
- ...
  

<br>

目前我们使用到的仅仅是 **wasm-opt**：

> 前面一直把 wasm-opt 说成是 ".wasm 优化工具"，但是 binaryen 给 wasm-opt 的介绍文字是：Loads WebAssembly and runs Binaryen IR passes on it.
> 
> 直译过来就是：加载 WebAssembly 并在其上运行 Binaryen IR 传递。

<br>

**Binaryen IR** 名词解释：

- IR 是单词 Intermediate Representation (中间表示形式) 的缩写
  
- 也可以把 IR 翻译成 "中间语言"
  

binaryen IR 的工作流程是：

1. 先读取 堆栈形式的二进制数据结构 .wasm 文件
  
2. 将通过 IR 其转换成 AST 抽象语法树形式的数据结构
  
3. 然后进行代码分析、优化 (SSA形式，如常量传播、删除死代码等)
  
4. 最后再将优化后的内容再编译回标准的 .wasm 文件
  

<br>

也就是说整个过程为：.wasm -> IR -> SSA -> .wasm

> wasm-opt 是通过对 .wasm 代码分析优化从而提高代码效率、降低 .wasm 文件大小的。

<br>

**安装 wasm-opt：**

**安装方式1：安装 binaryen**

```
scoop install binaryen
```

> 上述是我在 windows10 PowerShell 中执行的安装命令，如果是其他系统：
> 
> - macOS：`brew install binaryen`
>   
> - Ubuntu：`sudo apt-get install binaryen`
>   
> - ...
>   

<br>

**安装方式2：直接下载编译好的 binaryen 工具包**

- 访问：https://github.com/WebAssembly/binaryen/releases
  
- 找到适合自己系统的已编译好的工具包
  
  > 例如适用于 windows 系统的：https://github.com/WebAssembly/binaryen/releases/download/version_123/binaryen-version_123-x86_64-windows.tar.gz
  
- 下载解压，将解压得到的 binaryen-version_xx/bin/ 添加到系统的环境环境 PATH 中
  
  > bin 目录可以看到 binaryen 的各种工具 .exe 文件
  

<br>

检查 wasm-opt 是否安装成功：

```
# 任意目录下执行下面命令，若能输出版本号即表明 wasm-opt 已可用
wasm-opt --version
```

<br>

**特别说明：crates.io 中的 wasm-opt 包**

在 https://crates.io/ 上面有一个同样名字为 `wasm-opt` 的包，这个包的简介是：wasm-opt is a component of the Binaryen toolkit that optimizes WebAssembly modules. It is written in C++.

也就是说这个 crates.io 上同名为 wasm-opt 的包是为了让 rust 中方便调用 binaryen wasm-opt 工具而开发的一个"套壳的包"。

如果你想安装这个包 `cargo install wasm-opt` 的前提是你系统中先得安装好 binary wasm-opt。

<br>

**wasm-opt 常用命令：**

```
# 执行优化命令
wasm-opt -Oz -o xx/optimized.wasm xx/original.wasm
```

> 第1个参数说明：
> 
> - 这里的 O 是 optimize(优化) 的缩写
>   
> - -O：-Os 的简写，快速优化，体积减少 10%，适用于快速开发测试
>   
> - -Oz：最强优化，体积减少 30~50%，适用于生产环境
>   
> - -O3：平衡优化，体积减少 20~30%，适用于生产或开发环境
>   
> - 与 -O3 对应的还有其他压缩级别 -O0、-O1、-O2、-O4
>   

> 第2个参数说明：
> 
> - 这里的 o 是 out(输出) 的缩写
>   
> - -o 前面表示为 输入 原始 wasm 文件路径
>   
> - -o 后面表示为 输出 优化后 wasm 文件路径
>   
> - 输入和输出是 2 个路径，只要确定其中1个，另外1个自然也就确定了，因此 `-o xx/optimized.wasm xx/original.wasm` 等效于 `xx/original.wasm -o xx/optimized.wasm `
>   

<br>

上述命令参数目前对我们来说已经足够了。

更多命令参数可通过 `wasm-opt --help` 来查看。

<br>

**优化并覆盖：**

如果我们想将优化后的 wasm 文件直接覆盖原始的 wasm 文件，可是使用下面方式：

```
wasm-opt -Oz -o xx/optimized.wasm xx/original.wasm
mv xx/optimized.wasm xx/original.wasm
```

> 也就是说先得到优化后的 optimized.wasm 文件，再通过 mv 命令替换之前的 original.wasm 文件，实现覆盖目的。

<br>

**构建脚本：**

为了方便生成 wasm 和 JS 胶水代码，以及使用 wasm-opt，我们可以创建一个名为 `build.sh` 的 bash 脚本文件。

```bash
#!/bin/bash
set -e

# 1. 生产构建 wasm
cargo build --release --target wasm32-unknown-unknown

# 2. 生成 JS 胶水代码
wasm-bindgen \
  --out-dir out \
  --target web \
  --typescript \
  target/wasm32-unknown-unknown/release/my_wasm_lib.wasm

# 3. 安全优化（输出到临时文件）
wasm-opt -Oz out/my_wasm_lib_bg.wasm -o out/my_wasm_lib_bg_opt.wasm
mv out/my_wasm_lib_bg_opt.wasm out/my_wasm_lib_bg.wasm

echo "优化完成！最终文件：out/my_wasm_lib_bg.wasm"
```

特别提醒：我是 windows 10 系统，上述命令中的 `mv` 在 cmd 窗口中并不支持，我推荐使用 `Git Base` 命令窗口去执行。

- 方式1：文件夹鼠标右键，选择 "Open Git Bash here"，然后输入"./build.sh"
  
- 方式2：VSCode 命令窗口中新打开 Git Bash 命令窗口，然后输入 "./build.sh"
  

<br>

**最终产物：**

最终 ./out/ 目录下会有以下 4 个文件：

- my_wasm_lib_bg.wasm
  
- my_wasm_lib_bg.wasm.d.ts
  
- my_wasm_lib.js
  
- my_wasm_lib.d.ts
  

> 记得把 out 目录添加到 .gitignore 文件中

<br>

### 实际运行

**先分析一下my_wasm_lib.js**

尽管代码挺多，稍微整理一下即可看到最终对外导出的情况：

```
export function add(a, b) { ... }
export { initSync };
export default __wbg_init;
```

- `add`：即我们在 src/lib.rs 中对应的 add 函数对应的 "胶水函数"
  
- `initSync`：同步初始化函数
  
- `__wbg_init`：默认导出对象
  

<br>

**实际使用示例1：**

```
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>my-wasm-lib-demo</title>
</head>

<body>
    <script type="module">
        import init, { add } from './out/my_wasm_lib.js';

        async function run () {
            await init();
            console.log(add(2, 3));
        }
        run();
    </script>
</body>

</html>
```

> 我们定义 `init` 来对应 my_wasm_lib.js 对应默认导出的 `__wbg_init` 。
> 
> 在 my_wasm_lib.js 内部会自动加载同目录下的 my_wasm_lib_bg.wasm。

<br>

**实际使用示例2：**

```
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>my-wasm-lib-demo</title>
</head>

<body>
    <script type="module">
        import { add, initSync } from './out/my_wasm_lib.js';

        async function run () {
            const wasmData = await fetch('./out/my_wasm_lib_bg.wasm').then(r => r.arrayBuffer());
            initSync({ module: wasmData });
            console.log(add(2, 3));
        }
        run();
    </script>
</body>

</html>
```

我们这次是用 `initSync` 函数来初始化 wasm，这样的好处是我们可以精确控制加载 .wasm 的过程。

<br>

好了，我们第一个 wasm-bindgen 项目至此完成。

<br>

### Rust中操控网页：web-sys

上面示例中 rust 代码提供一个 add() 方法供网页 JS 调用。如果 rust 代码中想操控网页，那么就需要使用到 web-sys 这个包。

<br>

**安装web-sys：**

首先我们肯定想到安装 web-sys 依赖的命令代码为 `cargo add web-sys` 。

对应的 Cargo.toml 为：

```
[dependencies]
wasm-bindgen = "0.2.100"
web-sys = "0.3.77"
```

上面这样定义仅仅表明依赖和打包 wb-sys 默认的 `std` 特征(feature)。

相当于下面的写法：

```
[dependencies]
wasm-bindgen = "0.2.100"
web-sys = { version = "0.3.77", features = ["std"] }
```

**web-sys 的 std 特征仅仅包含与 js-sys、wasm-bindgen 依赖关联，如果直接使用几乎做不了什么事情，哪怕 console.log() 都无法使用。**

<br>

**对于 web-sys 来说，当你在 rust 使用绝大多数 DOM操作、浏览器API 和 Web API，都需要在依赖的 features 中加入该特征名。并且目前来说这个事情只能是手工添加完成，无法自动化。**

<br>

**特征名查询：**

web-sys 都支持哪些特征名，可以去官方文档查询：

https://wasm-bindgen.github.io/wasm-bindgen/api/web_sys/index.html

> 目前最新版 0.3.77 中已经有 1656 个特征名。

<br>

如果有些 JS 常用的你没有找到，例如 Math、JSON、Array 等，这些是由 js-sys 提供的。

https://wasm-bindgen.github.io/wasm-bindgen/api/js_sys/index.html

> - 模块：Atomics、JSON、Math、WebAssembly 等
>   
> - 数据类型：Array、ArrayBuffer、Boolean、Date、Error、Map、Set、Symbol、Object 等
>   
> - 函数：decode_uri_component、encode_uri_component、parse_float、parse_int、escape、eval 等
>   

<br>

如果我们一开始就知道自己会是用哪些特征名，例如 console，那么对应安装命令：

```
cargo add web-sys --features console
```

> 如果有多个特征名则命令为：
> 
> `cargo add web-sys --features console,Window,Document`

<br>

Cargo.toml 依赖内容为：

```
[dependencies]
wasm-bindgen = "0.2.100"
web-sys = { version = "0.3.77", features = ["console"] }
```

<br>

还有另外一种写法：

```
[dependencies]
wasm-bindgen = "0.2.100"

[dependencies.web-sys]
version = "0.3.77"
features = ["console"]
```

> 上面 2 种写法完全一致，但我个人偏向于使用第 1 种写法。

<br>

**web-sys特征名这么多，有些还是 js-sys 提供的，我怎么记得住？**

首先 web-sys 特征名和我们日常编写 JS 中的名称类似。

正常的做法是：你在 rust 代码中该怎么写就先怎么写，当你运行 rust 代码时他会自动检查并且把 Cargo.toml 依赖遗漏的特征名 作为错误信息给你提示，你根据提示自己加上就好。

<br>

**特别提醒：web-sys 的特征名首字母都是大写的，但唯独 console 是个例外。**

<br>

**关于 web-sys 的内部依赖补充说明：**

尽管 web-sys 内部明确依赖 js-sys 和 wasm-bindgen，但是实际中 Cargo.toml 依赖可以不写 js-sys，但一定要写 wasm-bindgen 。

因为我们本身就需要用到 wasm-bindgen 提供的一些宏和类型。

<br>

对于 web-sys 讲了这么多，那么回到我们的 rust 代码中。

<br>

**修改lib.rs代码：**

我们在 add 函数中使用 web-sys 的 console 模块，先输出一些信息，然后才返回计算值和。

```
use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    let num = a + b;
    console::log_1(&format!("{a} + {b} = {num}").into());
    num
}
```

> 本文并不会讲解 rust 语法，所以前端开发人员第一次看 rust 代码会觉得非常别扭。

<br>

上面代码也可以修改为：

```
use wasm_bindgen::prelude::*;
use web_sys::console::log_1;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    let num = a + b;
    log_1(&format!("{a} + {b} = {num}").into());
    num
}
```

<br>

**log_1是？**

由于 rust 是一门类型定义极其严格的语言，`log_1` 就表示 "参数数量为 1 的 log 函数"。

如果查看 web-sys 中关于 console 的文档，你会发现和 log 相关的有：

- log：参数为一个数组
  
- log_0：没有参数
  
- log_1：参数数量为 1
  
- ...
  
- log_7：参数数量为 7
  

与 log 对应的还有：clear、debug、dir、error、info、warn 等。

<br>

**web-sys示例：写入DOM元素**

我们再通过一个简单示例来学习 web-sys 如何写入 DOM 元素：当 wasm 初始化完成后向网页插入一个 h3 元素，内容为 "Hello, wasm!"

<br>

和本次 DOM 操作相关的特征名有：Window、Document、Element、HtmlElement

```
[dependencies]
wasm-bindgen = "0.2.100"
web-sys = { version = "0.3.77", features = [
    "console",
    "Window",
    "Document",
    "Element",
    "HtmlElement",
] }
```

> 你可能疑惑为什么我知道本示例相关的几个特征名？因为当你写多了自然就知道哪些操作对应哪些特征名了。

> 再次提醒：web-sys 特征名首字母都是大写的，唯独 console 是个特例。

<br>

**lib.rs代码更新：**

```
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::*;
use web_sys::{console, window};

#[wasm_bindgen(start)]
fn start() -> Result<(), JsValue> {
    let window = window().expect("no global `window` exists");
    let document = window.document().expect("should have a document on window");
    let body = document.body().expect("document should have a body");
    let h1 = document.create_element("h1")?;
    h1.set_inner_html("Hello, wasm!");
    body.append_child(&h1)?;
    Ok(())
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    let num = a + b;
    console::log_1(&format!("{a} + {b} = {num}").into());
    num
}
```

> 通过 `#[wasm_bindgen(start)]` 语义注释来表明下面的 start 为 wasm 初始化后就自动执行的函数。

<br>

抛开 rust 本身的语法，这里有一个让人很容易难以理解的点：

- Cargo.toml 中依赖的特征名是 Window
  
- 而 lib.rs 代码中引入的是 window，使用时又是 window()
  
- 而 window() 函数又返回一个 Window
  

<br>

**Window、window与Window：**

在 web-sys 官方文档中，通过 Ctrl + F 可以找到：

- 在结构体(structs) 中有 Window
  
- 在函数(functions) 中有 window
  

<br>

也就是说目前一共有 3 处：

- A：Cargo.toml 中的 Window
  
- B：使用 use 引入的 window 函数
  
- C：window() 返回的 Window
  

它们的区别是什么，以及为什么 web-sys 要这样设计？

<br>

**它们三个是完全不同的概念，只是恰好名字相似。**

<br>

**A：Window**

Cargo.toml 中的 Window 是编译特性，它告诉 rust/web-sys "请为浏览器中的 Window 对象生成 Rust 绑定代码"。

- 作用阶段：编译时
  
- 目的：控制哪些 web api 代码会被编译到最终的二进制文件中
  
- 本质：一个条件编译开关
  
- 命名约定：首字母大写的驼峰命名
  

<br>

**B：window：**

`use web_sys::window` 引入 web-sys 提供的 window 函数。

- 作用阶段：代码组织与编写时
  
- 目的：将 web-sys 模块根部的 window 函数引入到当前作用域
  
- 本质：调用该函数返回一个 web_sys::Window 结构实例，也就是 **`C：Window`**
  
  > 前面提到过 web-sys 文档中结构体包含 Window
  
- 命名约定：首字母小写的驼峰命名
  

<br>

多写代码，多练习！
