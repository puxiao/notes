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

**对应的 html 测试页面：**

```
<!DOCTYPE html>
<script type="module">
  import init, { add } from './out/your_crate.js';

  async function run() {
    await init(); // 必须初始化 WASM 内存
    console.log(add(2, 3)); // 输出 5
  }

  run();
</script>
```

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

<br>

**生成 JS 胶水代码：**

```
wasm-bindgen --out-dir ./out --target web --omit-default-module-path \
  target/wasm32-unknown-unknown/release/your_crate.wasm
```

> 构建目标(--target)：
> 
> - web：浏览器
>   
> - nodejs：Node.js
>   
> - bundler：webpack/rollup 等打包器
>   

<br>

**其他可选参数：**

- --typescript：生成 .d.ts 文件
  
- --out-name index：输出文件名改为 index.js
  
- --debug --keep-debug：保留调试信息(禁用优化)
  

<br>

**手工wasm优化(可选)：**

```
# 安装 wasm-opt
cargo install wasm-opt

# 执行优化
wasm-opt -Oz -o xx/optimized.wasm xx/original.wasm
```

> 第1个参数说明：
> 
> - -Oz：最强优化，体积减少 30~50%，适用于生产环境
>   
> - -O3：平衡优化，体积减少 20~30%，适用于生产或开发环境
>   
> - -O：快速优化，体积减少 10%，适用于快速开发测试
>   

> 第2个参数说明：
> 
> - -o 前面表示为 输入 原始 wasm 文件路径
>   
> - -o 后面表示为 输出 优化后 wasm 文件路径
>   
> - 输入和输出是 2 个路径，只要确定其中1个，另外1个自然也就确定了，因此 `-o xx/optimized.wasm xx/original.wasm` 等效于 `xx/original.wasm -o xx/optimized.wasm `
>   

<br>

优化后的 wasm 文件直接覆盖原始的 wasm 文件，可是使用下面方式：

```
wasm-opt -Oz -o xx/optimized.wasm xx/original.wasm && mv xx/optimized.wasm xx/original.wasm
```

> 也就是说先得到优化后的 optimized.wasm 文件，再通过 mv 命令替换之前的 original.wasm 文件，实现覆盖目的。

<br>

**构建脚本：**

为了方便生成 wasm 和 JS 胶水代码，以及使用 wasm-opt，我们可以创建一个 bash 脚本。

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
wasm-opt -Oz out/my_wasm_lib_bg.wasm -o out/my_wasm_lib_bg.opt.wasm
mv out/my_wasm_lib_bg.opt.wasm out/my_wasm_lib_bg.wasm

echo "优化完成！最终文件：out/my_wasm_lib_bg.wasm"
```
