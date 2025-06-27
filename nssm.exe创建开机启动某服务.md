# nssm.exe创建开机启动某服务


#### 1、安装 nssm.exe

**下载：**

nssm官网下载：[NSSM - the Non-Sucking Service Manager](https://nssm.cc/download)

> 目前最新版 2.24-101 下载地址：[https://nssm.cc/ci/nssm-2.24-101-g897c7ad.zip](https://nssm.cc/ci/nssm-2.24-101-g897c7ad.zip)

<br>

**添加到Path：**

将构建包解压，得到 win64 版本的 nssm.exe。

- 在 `D:\Program Files` 新建 `nssm` 目录，并将 nssm.exe 拷贝进去
  
- 在系统环境 Path 中新增 `D:\Program Files\nssm`
  

<br>

#### 2、创建 windows 服务

我们以运行 verdaccio 服务为例。

> 之前运行 verdaccio 都是通过打开一个 PowerShell 窗口，输入 verdaccio 来启动的。缺点是一旦该 PowerShell 窗口关闭则服务也会关闭。

<br>

**创建 verdaccio 服务：**

在 Powershell 窗口中执行：`nssm install verdaccio`，此后会弹出 nssm 的配置弹窗。

> 上面脚本含义是：创建一个名为 verdaccio 服务，这个 `verdaccio` 仅仅是我们定义的服务名称。
> 
> 服务名称可以是任意与其他服务不重名的字符，此刻我们选择了和要启动的运行程序相同的名字。

<br>

**弹窗配置：**

在应用程序(Application)面板下，有 3 个填写项。

- Path(必填项)：要运行主程序所在路径文件路径
  
  方案A：设置成某个具体的 .cmd 脚本作为主程序
  
  方案B：使用 node.exe 作为主程序
  
- Startup directory (选填项)：设置服务启动时的工作目录
  
  说直白点就是——相当于在哪个目录下执行命令。默认值为 system32。
  
  > 这个值可能会影响一些程序存放日志的位置。
  > 
  > 对于 verdaccio 来说要确保可以找到其 config.yaml 文件。
  
- Arguments(可选项)：传递给主程序的命令参数的字符串
  
  - 假设我们 Path 中选择主程序是 node.exe，那么 arguments 填写的内容 "xxx" 后相当于最终执行的是 `node xxx`
    
    > 特别强调一遍：你填写的应该是带英文双引号的字符，或者你填写成 -r xxx，那么此时 xxx 可以不加双引号。
    
  - 如果上面 Path 中已经选择主程序是某个具体的 xxx.cmd，不需要任何的参数，那么 Arguments 可以不填写。
    

<br>

**最终配置：**

我选择了使用 node.exe 来启动运行 verdaccio。

- Path：D:\Program Files\nodejs\node.exe
  
- Startup directory：C:\Users\xiao\AppData\Roaming\verdaccio
  
  > 或者是：%APPDATA%\verdaccio
  
- Arguments："C:\Users\用户名\AppData\Roaming\npm\node_modules\verdaccio\bin\verdaccio"
  

<br>

上面是填写完整的路径，如果你本身已经把 node.exe 和 verdaccio 都添加到系统的 Path 中，那么上面的都可以简化。

- path：node
  
- Startup directory：%APPDATA%\verdaccio
  
- Arguments："verdaccio"
  

<br>

**nssm.exe 默认使用的是 LocalSystem 账户，如果你把 node.exe 和 verdaccio 加入到了某个用户下的 Path，或许会存在找不到的情况。**

最好都是加到系统的 Path 下，或者干脆都使用完整的路径。

<br>

**Details面板：配置启动方式**

Startup type：启动方式

- Automatic：开机立即启动，默认值。
  
- Automatic(Delayed Start)：开机延迟1-2分钟后启动
  
  > 避免开机就与其他服务竞争资源，我个人推荐这种方式。
  
  > 当刚开机就打开 任务管理 > 服务，找到 verdaccio 会看到状态为 "已停止"，等待 1-2 分钟后会变成 "尝试启动"，然后启动成功后变为 "正在运行"。
  
- Manual：手动启动
  
- Disabled：禁用
  

<br>

至于其他面板，暂时都用不到，使用默认值就行。

**最终确认无误后，我们点击 `Install service` 按钮。**

<br>

#### 3、后续维护命令

**查看 verdaccio 服务运行状态：** `nssm status verdaccio`

> 也可以通过 任务管理器 > 服务 查看 verdaccio 的状态。

**停止 verdaccio 服务：** `nssm stop verdaccio` 或 `sc delete verdaccio`

**重启 verdaccio 服务：** `nssm restart verdaccio`

**删除 verdaccio 服务：** `nssm remove verdaccio`
