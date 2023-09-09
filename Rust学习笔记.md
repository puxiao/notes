# Rust学习笔记



<br>

### 前言

作为一名前端开发者，我学习 Rust 主要是为了将来可以学习、编写 WASM。

**本学习笔记将不于以往的某某学习笔记，不会讲得连贯细致**，因为本笔记纯粹是自己在学习 Rust 时为了加深记忆所额外写的碎片化知识点。



<br>

想学 Rust 个人推荐去看：https://course.rs/ (目前我认为最好的中文 Rust 教程)

当然这个教程毕竟有点年头了，所有一些地方讲述的有点过时，但是你可以先看看每一篇下面的评论，因为过时或者补充的内容都在评论里。



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

### 配置 VSCode

**在 VSCode 中安装插件：rust-analyzer**

> 这个插件是必须安装的，因为太有用了



<br>

**其他插件：**

下面这几个插件并不是必须的，也不是 rust 专属的，而是日常我们开发中(包括前端项目)都非常有用的。

* Error Lens：错图信息提示相关
* One Dark Pro：主题相关
* CodeLLDB：调试相关
* Even Better TOML：Rust .toml 文件相关



<br>

至此，本机的 Rust 开发环境已经配置好了。



<br>

### 编写第一个 rust 程序：hello world

未完待续...
