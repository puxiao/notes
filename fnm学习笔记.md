# fnm学习笔记

**fnm 是一个 Node.js 版本管理软件，它同时支持 Windows/Linux/macOS。**



<br>

**fnm VS nvm：**

在 fnm 出现之前，node.js 版本管理软件通常使用 nvm，相对而言 fnm 属于后起之秀，用法简单且功能强大。

nvm 仓库地址：https://github.com/nvm-sh/nvm

> nvm 是基于 shell 开发的

fnm 仓库地址：https://github.com/Schniz/fnm

> fnm 是基于 Rust 开发语言的



<br>

> 我没有使用过 nvm，所以这里不做过多对比讨论。



<br>

**为什么需要 node.js 版本管理软件？**

无论是 node.js 后端项目，还是前端框架项目 react、vue 等，它们都需要用到 node.js。

这些不同项目由于开发时间不同，它们所依赖的某些 npm 包可能只在某些特定的 node.js 版本上才能运行。

为了可以在同一台电脑上运行不同的项目，那就需要安装多个不同的 node.js 版本，且可以自由切换版本。

于是，node.js 版本管理软件就诞生了。



<br>

好了，进入本文正题。

本文是在 fnm 官方文档的基础上，加上了自己实际安装过程中遇到的一些问题总结。



<br>

**第1种安装 fnm 方式：curl**

请注意：该方式仅适用于 macOS、Linux

安装代码：

```
curl -fsSL https://fnm.vercel.app/install | bash
```

如果想指定安装目录，可添加相应参数：

```
curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "./.fnm" --skip-shell
```



<br>

**第2种安装 fnm 方式：cargo**

请注意：该方式同时适用于 Windows、macOS、Linux

> 由于本人的电脑是 windows 10 64 位操作系统，所以下面的安装都是基于 win10 而言的。



<br>

> cargo 是 Rust 的包管理工具，默认会随着安装 Rust 而顺带安装上 cargo。
>
> 假设你电脑上根本没有安装 Rust 和 cargo，那么你可以去 Rust 官方下载安装程序：https://www.rust-lang.org/zh-CN/tools/install



<br>

> 特别强调：Rust 编译需要 C++ 桌面开发环境(安装大约需要2.4G)，通常需要下载安装 [Visual Studio 2022](https://visualstudio.microsoft.com/zh-hans/vs)



<br>

> 查看自己本机是否安装 cargo 成功，很简单，只需执行 `cargo -V`，看是否有版本输出



<br>

假定你本机已经安装好了 cargo，那么安装 fnm 很简单，只需在命令窗口中执行：

> 如果你是 windows 系统，建议使用 PowerShell

```
cargo install fnm
```

然后就是静静等待自动下载和安装。



<br>

**安装过程中可能遇到的问题：**

由于编译 Rust 需要电脑安装有 c++ 桌面开发环境 (安装大约需要2.4G)，假设你没有安装，那么在上面的安装 fnm 命令过程中，你可能会收到这样的报错信息：

```
error: linker `link.exe` not found
|= note: program not found
```

解决办法就是：

* 要么安装 C++ 桌面开发环境
* 要么改用 gnu 方式编译 Rusnt，具体方式可自己百度



<br>

> 实际上我个人并没有按照网上说的 改用 gnu 的方式编译成功，最终还是老老实实安装了 Visual Studio。
>
> 在安装选项中，仅勾选 C++ 桌面开发环境即可，同时注意记得修改默认的安装目录，毕竟文件占用 2.4 G，默认安装到 C 盘不是很合适。



<br>

Rust 和 Cargo 的安装方式和遇到的问题不在本文讨论中。

我们假定你已经通过 `cargo install fnm` 成功安装上了 fnm，那么接下来我们学习一下 fnm 的使用命令吧。



<br>

**修改 powershell 执行策略(必须执行这一步)：**

> 这一步是针对 windows 系统的 powershell 命令工具的。
>
> 其他操作系统的修改执行策略的方式，请参考 fnm 官方文档中 `Shell Setup` 这一部分

1. 在 powershell 命令窗口中输入 $PROFILE 查看自己 PowerShell 配置文件路径

2. 如果 Microsoft.PowerShell_profile.ps1 文件本身不存在，则手工创建

3. 在该文件里面加上一行 fnm env --use-on-cd | Out-String | Invoke-Expression

4. 单独打开 powershell 命令窗口 (非vscode)，执行：

   ```
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

5. 在询问结果中，输入：A 并摁回车确认，这样我们就更改了 powershell 的执行策略



<br>

如果不执行修改 powershell 执行策略这一步，那么我们后面所进行的 fnm 切换命令将不会生效。



<br>

> 上述操作中，如果不执行第 4、第 5 步，那么当我们打开 VSCode 后会收到这样的错误信息：
>
> ```
> 无法加载文件 D:\Backup\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1，因为在此系统上禁止运行脚本。
> ```



<br>

至此，一且配置都算弄好了，接下来就是简单学习一些 fnm 的一些命令即可。



<br>

**查看当前 fnm 版本：**

```
fnm --version
```



<br>

**安装不同的 node.js 版本：**

假设我们需要安装 node.js 16.18.1 和 18.12.1，那么我们只需在命令窗口中执行：

```
fnm install 16.18.1
fnm install 18.12.1
```



<br>

假设你输入的 node.js 版本号为整数，例如：

```
fnm install 16
```

那么会默认自动安装 16 开头的最新版本



<br>

**查看已安装的 node.js 版本列表：**

```
fnm list
或
fnm ls
```

会输出我们已经安装过的 node.js 版本列表，例如：

```
v16.18.1 default
v18.12.1
```

> 请注意 哪个版本后面有 default 字样，即表明此时正在将哪个版本作为全局默认版本



<br>

**卸载已安装的 node.js 版本：**

例如卸载 18.12.1，对应代码：

```
fnm uninstall 18.12.1
```



<br>

**查看当前的默认版本：**

```
fnm current
```

即会输出当前默认(default)版本



<br>

**全局切换默认版本：**

例如我们希望全局默认版本切换至 18.12.1，对应命令为

```
fnm default 18.12.1
```



<br>

**仅当前目录切换到某个版本：**

例如我们只是希望将当前 cd 到的目录切换至 18.12.1，对应命令为：

```
fnm use 18.12.1
```



<br>

**为当前目录创建生成 .node-version 文件：**

```
node --version > .node-version
```

该命令执行后，会在当前目录下自动生成一个名为 `.node-version` 的文件。

该文件内容为当前目录所设定的 node.js 版本号，例如：

```
v16.18.1
```

你可以修改为其他版本号，当然前提条件是你已经通过 `fnm install x.x.x` 安装过的版本，那么以后该目录就会默认使用这个 node.js 版本。

> 这也是我们使用 fnm 最常用的命令。



<br>

**查看帮助：**

```
fnm --help
```



<br>

好了，至此，我们需要用到的 fnm 命令都讲解完毕了。

