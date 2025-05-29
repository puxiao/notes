# PowerShell 中配置使用网络代理

即使电脑上运行了像 Clash 这类梯子软件，但是在 PowerShell 命令窗口中进行的网络下载默认是不会使用代理的。

例如我想升级 rust 的命令：rustup update 运行后就特别慢。

<br>

**临时配置使用代理：**

在打开的 PowerShell 窗口中输入：

```
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

> "http://127.0.0.1:7890" 是 Clash 默认启用的代理地址

这样临时配置就完成了，当关闭当前命令窗口上述配置就消失了。

<br>

**永久配置 方式1：**

此电脑 > 属性 > 高级系统设置 > 环境变量

在 用户变量 或 系统变量中新建：

1. 变量名 HTTP_PROXY，变量值：http://127.0.0.1:7890
  
2. 变量名 HTTPS_PROXY，变量值：http://127.0.0.1:7890
  

<br>

**永久配置 方式2：**

在 PowerShell 中查看当前配置文件路径：

```
$PROFILE
```

编辑文件(若不存在则会创建)：

```
notepad $PROFILE
```

在配置文件中添加：

```
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

<br>

**查看代理配置**

```
$env:HTTP_PROXY
$env:HTTPS_PROXY
```
