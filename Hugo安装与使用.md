# Hugo安装与使用



<br>

**Hugo简介：**

Hugo 是一个基于 go 语言的开源项目，可以快速将 Markdown 文档生成静态网站的一个框架。

官方网站：https://gohugo.io/

代码仓库：https://github.com/gohugoio/hugo



<br>

**Hugo的两个版本：**

Hugo 分为 2 个版本：标准版(standard)、扩展版(extended)

扩展板相对标准版，具有以下额外的功能：

* 支持 WebP 图片编码
* 内置 LibSass 转发器，可以将 Sass 转换为 CSS



<br>

**实际情况：**

Hugo 并不是单纯把 Markdown 文件生成静态网站，还支持增加很多页面交互效果。

而网页交互效果离不开 JS/TS，所以 Hugo 的项目还会搭配使用 NPM 包，又回到了前端开发人员最擅长的领域。

所以你会在 Hugo 项目中看到下面这些文件：

* package.json
* tsconfig.json
* node_modules
* ...

甚至是启动 Hugo 程序的命令都是：

```
yarn serve
```

> 本文只是简单讲解一下 Hugo 安装，具体 Hugo 项目如何搭建，如何配置 可以参考其官方文档。



-----



<br>

**安装Hugo：**

Hugo 支持 macOS、Linux、Windows 系统。

下面以 Windows 系统安装为例。



<br>

**第1步：安装 go**

> Hugo 是基于 go 语言的，所以第一步肯定是安装 go

从 go 官网下载安装程序：https://go.dev/dl/

目前 go 的 Windows 版安装程序为：https://go.dev/dl/go1.20.3.windows-amd64.msi



<br>

**第2步：选择哪个包管理工具来准备安装 hugo**

目前支持的包安装工具有：

* Chocolatey：https://chocolatey.org/

* Scoop：https://scoop.sh/

* Winget：https://learn.microsoft.com/en-us/windows/package-manager/

  > Winget 是 Windows 自带的包管理工具，无需额外按装 Winget，直接打开 PowerShell 即可使用。
  >
  > 但是我自己本机使用 Winget 安装 Hugo 时一直失败：
  >
  > ```
  > winget install Hugo.Hugo.Extended
  > 已找到 Hugo(扩展版) [Hugo.Hugo.Extended] 版本 0.111.3
  > 此应用程序由其所有者授权给你。
  > Microsoft 对第三方程序包概不负责，也不向第三方程序包授予任何许可证。
  > 执行此命令时发生意外错误：
  > 0x80070032 : ...
  > ```



<br>

由于我个人电脑使用 Winget 一直安装 Hugo 失败，所以下面讲解如何使用 Scoop 来安装。



<br>

**第3步：安装 Scoop**

打开 PowerShell 命令窗口：

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

> 在询问是否要更改执行策略，选择 A

```
irm get.scoop.sh | iex
```



<br>

**第4步：使用 Scoop 安装 hugo 扩展版**

```
scoop install hugo-extended
```

> 当前 hugo 最新版本为 0.111.3
>
> Scoop 安装过的包都在其 apps 目录中



<br>

**第5步：添加 hugo 到系统环境变量中**

如果你不知道 hugo 安装到哪里了，可以电脑中文件搜素：hugo-extended

我安装的目录是 `C:\Users\xxx\scoop\apps\hugo-extended\0.111.3`

将上面目录添加到系统环境变量中。



<br>

至此 Hugo 安装配置成功。



<br>

**Hugo 创建简单站点的基础示例：**

https://gohugo.io/getting-started/quick-start/

