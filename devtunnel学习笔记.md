# devtunnel学习笔记

<br>

**内网穿透：**

假设我们在开发调试本地前端项目时，想让非局域网其他用户也可以访问，那么就可以利用内网穿透来实现。

<br>

**我们把 "将自己本机某个端口设置成局域网外可以访问的地址" 这个行为简称为 "创建隧道"。**



<br>

**内网穿透工具：**

* ngrok：这个之前学习过，可查阅 [sharp学习笔记](https://github.com/puxiao/notes/blob/master/sharp学习笔记.md)
* devtunnel：对应的是 devtunnel.exe，是微软提供的内网穿透工具 
* ...

本文要学习的就是 devtunnel.exe

由于 VSCode最新版1.82已经默认内嵌了 devtunnel，所以本文分为 2 部分：

* 在 VSCode 中如何使用 devtunnel
* 抛开 VSCode，在系统中如何直接使用 devtunnel.exe



<br>

### 在 VSCode 中如何使用 devtunnel

**使用步骤：**

* 安装 VSCode 1.82+ 以上版本
* 打开调试窗口栏，会看到新增的一个 "PORTS" 窗口，默认现需要我们是用 github 账户登录
* 假定此刻我启动了一个前端项目，使用本地端口为 9006
* 在 "PORTS" 窗口，点击默认看到的 "Forward a Port" 按钮，在端口号 Port 中输入本次要内网穿透对外的端口 9006，并按回车
* 等待 1~2 秒，若创建成功，就会在 "PORTS" 中显示一条记录：
  * Port：9006
  * Forwarded Address：https://xxxxxx-9006.usw3.devtunnels.ms/
  * Running Process：
  * Visibility：Private
  * Origin：User Forwarded



<br>

我们对上面那条记录解读一下：

| 项目              | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| Port              | 内网穿透对外的端口                                           |
| Forwarded Address | 对外可访问的链接地址                                         |
| Running Process   |                                                              |
| Visibility        | 对外可见性，默认 Private 表示私有，即只有同一个账户才可以看到 |
| Origin            | 所属组织，默认的 "User Forwared" 表示用户自建，不属于任何组织 |

换句话说：虽然已经创建启用了内网穿透，但是在其他地址只有同一个 github 账户(也就是自己)才能访问



<br>

**更多修改配置项：**

在 PORTS 窗口中，鼠标放到刚才创建的那条记录上，点击右键会出现更多设置菜单。

对我们比较有用的是修改访问可见性。



<br>

**修改对外访问可见性：**

* 让任何人都可以访问：鼠标停留在 PORTS 窗口那条记录上面，点击右键，弹出菜单中将 Port Visibility 选项由 Private 改为 Public 即可

* 仅让自己 github 账户所关联的某个组织内的成员可以访问：...

  > 由于我的 github 账户目前并未加入任何组织，所以这一步我没法测试



<br>

**关闭当前内网穿透端口：**

* 在 PORTS 窗口中，鼠标悬停在那条记录上面，点击右键，菜单中点击 Stop Forwarding Port
* 或者，鼠标悬停在那条记录上面，直接按键盘上的 Del 键



<br>

### 在系统中使用 devtunnel：

具体用法可查看微软官方的教程：https://learn.microsoft.com/zh-cn/azure/developer/dev-tunnels/get-started



<br>

**安装方式1：使用命令安装**

在 PowerShell 中执行安装命令：

```
winget install Microsoft.devtunnel
```

执行升级命令：

```
winget upgrade Microsoft.devtunnel
```



<br>

**安装方式2：直接下载 devtunnel.exe**

下载地址：https://aka.ms/TunnelsCliDownload/win-x64

得到 devtunnel.exe 后，我们给它添加系统环境变量。

* 假定 devtunnel.exe 存放路径为 `D:\Program Files\devtunnel\devtunnel.exe`
* 打开系统环境变量，向 Path 中新增一条记录：`D:\Program Files\devtunnel`

这样，以后在任何目录下的 powershell 中都可以通过 devtunnel 来运行 devtunnel.exe 了。



<br>

**第1步：登录自己的账户**

```
devtunnel user login
```

执行完上面命令后，默认登录使用的是微软账户。

<br>

对于我们来说更倾向于使用 github 账户，所以上述登录命令应该增加参数 -g 用来明确使用的是 github 账户。

```
devtunnel user login -g
```

> 这里有个前提是你本机可以访问到 github.com



<br>

**第2步：创建启用隧道**

假定需要将本机的 9006 端口做为对外穿透的端口，则命令为：

```
devtunnel host -p 9006
```

如果你需要创建多个端口，则可以改为：

```
devtunnel host -p 9006 9007 9008
```

> 由于一个 powershell 窗口同一时间默认只能运行一个 devtunnel 进程，所以如果你需要创建并监听多个内网映射端口，则需要像上面那样同时填写多个 端口



<br>

**增加启用配置项：**

* 允许任何人都可以访问：

  ```
  devtunnel host -p 9006 --allow-anonymous
  ```

* 设置有效时间，过期自动删除：

  ```
  devtunnel host -p 9006 --expiration 2d
  ```

  > 上面参数中的 2d 是指 "2天"，如果你想设置有效时间为 2 小时，则参数值为 "2h"
  >
  > --expiration 允许最短设置 1小时，最大 30天
  >
  > 如果缺省 --expiration 则默认有效期为 30天



<br>

**外部的访问地址：**

在执行 devtunnel post 命令后，若创建成功则会在命令面板看到下面的信息：

```
Hosting port: 9006
Connect via browser: https://nj0q00v1-9006.usw3.devtunnels.ms
Inspect network activity: https://nj0q00v1-9006-inspect.usw3.devtunnels.ms

Ready to accept connections for tunnel: nj0q00v1
```

其中的 "Connect via browser" 对应的值 "https://nj0q00v1-9006.usw3.devtunnels.ms" 就是外部可访问的链接地址。

而 "nj0q00v1" 就是我们本次创建的隧道的 id



<br>

**关闭隧道：**

* 在命令窗口中按 `Ctrl + C` 即可关闭

* 或者通过直接关闭 powershell 命令窗口的方式关闭

  > 会先尝试关闭 devtunnel 端口，关闭后才会自动关闭 powershell 窗口



<br>

**查看当前系统中隧道端口列表：**

```
devtunnel list
```

* 如果你本机存在有隧道，则会列出来它们
* 如果你本机不存在任何隧道
  * 第1次执行 devtunnel list 命令会显示 "Welcome to dev tunnels! ..."
  * 以后执行 devtunnel list 命令会显示 "No tunnels found."



<br>

**查看某个隧道详细信息：**

假定隧道 id 为  "nj0q00v1"，那么执行：

```
devtunnel show nj0q00v1
```

> 会列出 nj0q00v1 当前的一些配置或状态信息



<br>

**托管某个隧道：**

假定我们在其他 powershell 窗口里创建了一个隧道 "nj0q00v1"，我们现在当前 powershell 中托管监控它，对应命令为：

```
devtunnel host nj0q00v1
```



<br>

**删除某个隧道：**

假定要删除的某个 隧道 id 为  "nj0q00v1"，那么执行：

```
devtunnel delete nj0q00v1
```



<br>

**删除全部的隧道：**

```
devtunnel delete-all
```



<br>

**更多命令参数请查阅：** https://learn.microsoft.com/zh-cn/azure/developer/dev-tunnels/cli-commands
