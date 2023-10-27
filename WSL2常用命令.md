# WSL2基础知识

### WSL2简介：

SWL2 是 Winodws 10 下用来创建 Linux 虚拟系统的管理模块。之前 Windows 系统上若想运行 Linux，都是通过安装 虚拟机 VM 来实现的，而 SWL2 由 微软官方 推出的，简单易用，且执行效率快。



<br>

### 安装或更新 WSL2 ：

下载地址：https://docs.microsoft.com/zh-cn/windows/wsl/wsl2-kernel 



<br>

### 打开 WSL2 命令界面：

通过 WSL2 命令可以操作管理本机 Linux 虚拟系统， 打开方式为：

方法1：使用 CMD 命令窗口

方法2：摁着 Shift 键同时，在 win10 桌面 (或者你所在的文件夹) 点击右键，点击  “在此处打开 Powershell窗口“



<br>

### 进入 Linux 虚拟系统 命令界面：

方法1：在 CMD 或 Powershell 命令窗口内，执行 `wsl`，即可进入 Linux 虚拟系统命令界面

方法2：摁着 Shift 键同时，在 win10 桌面 (或者你所在的文件夹) 点击右键，点击 “在此处打开 Linux Shell”

> 进入 Linux 虚拟系统命令界面后，执行的命令操作和 Linux 是一模一样的
>
> 退出 Linux 命令界面，执行：exit



<br>

### 打开 wsl 失败说明：

假定你的 wsl 面板打开即关闭，或者你能在 PowerShell 中看到报错信息：

```
Processing fstab with mount -a failed.

<3>WSL (8) ERROR: CreateProcessEntryCommon:370: getpwuid(0) failed 2
<3>WSL (8) ERROR: CreateProcessEntryCommon:374: getpwuid(0) failed 2
<3>WSL (8) ERROR: CreateProcessEntryCommon:577: execvpe /bin/sh failed 2
<3>WSL (8) ERROR: CreateProcessEntryCommon:586: Create process not expected to return
```

这个原因是因为你电脑上 WSL 默认进入的系统不正确。

为了确定是不是这样，我们可以执行：

```
wsl -l
```

如果输出的信息为：

```
适用于 Linux 的 Windows 子系统分发:
docker-desktop-data (默认)
docker-desktop
```

我们希望进入的是 docker-desktop 而不是 docker-desktop-data。

我们只需执行：

```
wsl -d docker-desktop
```

就可以进入到 wsl 系统命令窗口了。



<br>

# WSL2 常用命令

### 基础命令

| 命令                   | 含义                                                         |
| ---------------------- | ------------------------------------------------------------ |
| wsl                    | 进入 Linux 虚拟系统 Shell 命令界面                           |
| wsl -h  或  wsl --help | 显示 wsl 帮助<br />(事实上只要执行错误的 wsl 命令，就会自动显示 wsl 帮助信息) |



<br>

### 查看分发

> 所谓 分发，可以理解成已安装的 Linux 子系统

| 命令                            | 含义                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| wsl -l  或  wsl  --list         | 列出所有分发                                                 |
| wsl -l -v  或  wsl -l --verbose | 列出分发，以及分发详细信息 (分发名、当前运行状态、使用WSL版本)<br />(这可能是查看分发，使用频率最高的一条命令) |
| wsl -l --running                | 列出正在运行的分发，已停止的分发则不显示                     |
| wsl -l --all                    | 列出所有的分发，包括正在安装或卸载的分发<br />备注：win10 wsl2 执行效率非常快，卸载或安装分发非常快，<br />我个人认为基本平时没有机会能够让你使用到这条命令 |
| wsl -l -q 或 wsl -l --quiet     | 只显示分发名字<br />(与 wsl -l 唯一的差别就是在于 wsl -l 还会指出 默认分发是哪一个) |



<br>

### 管理控制分发

| 命令                                                   | 含义                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| wsl --shutdown                                         | 立即终止(停止)所有正在运行的分发 或 WSL2 虚拟机              |
| wsl -t <分发版>                                        | 立即终止(停止)指定的分发，<br />例如：wsl  -t  docker-desktop，立即停止 docker-desktop<br />若此时执行：wsl -l -v，即可看到 docker-desktop 的状态为 Stopped |
| wsl --unregister  <分发版>                             | 注销某分发<br />例如：wsl --unreginster  docker-desktop-data，表示注销 docker-desktop-data 这个分发 |
| wsl -d <分发版>  或 <br />wsl --distribution  <分发版> | 指定运行某分发                                               |

> 特别强调：实际操作中发现，假设有A、B两个分发，使用 wsl -d A 后会自动关闭 B<br />同样 wsl -d B 后会自动关闭 A，所以不能靠这个命令来启动 docker，因为 docker 需要同时启动运行 docker-desktop 和 docker-desktop-data 两个分发



<br>

### 导出或导入分发

> 对于 docker 来说，事实上可通过导出或导入分发，来修改 默认虚拟文件目录位置
> 当然不要忘了，导出分发后，还应该执行 注销分发 (docker --unregister docker-desktop-data)，然后才是导入

| 命令                                                | 示例                                                         |
| --------------------------------------------------- | ------------------------------------------------------------ |
| wsl --export <分发版>  < .tar 文件保存路径>         | 将分发导出为 .tar文件<br />例如：wsl --export  docker-desktop-data  d:\docker-data\filename.tar<br /> |
| --import <分发版> <安装位置> <.tar 文件路径> [选项] | 将 .tar文件作为新分发，导入进来<br />例如：wsl --import  docker-desktop-data  d:\docker-data  d:\docker-data\filename.tar  --version 2 |

>docker-desktop-data：分发名
>d:\docker-data\filename.tar：将分发导出为 .tar文件，路径 + 文件名 + 文件后缀

>d:\docker-data：准备将分发安装的位置(windows路径)
>--version 2：设置新导入分发的 WSL 版本

**再次强调**：如果要迁移 docker 默认虚拟文件目录位置，先导出原有分发，然后注销该分发，最后再导入 .tar文件并设置新的虚拟文件目录位置。



<br>

### 控制分发使用 WSL 版本

> WSL 存在2个版本，WSL1 和 WSL2

| 命令                                            | 含义                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| wsl --set-default-version <版本>                | 设置默认分发的 WSL 版本<br />例如 wsl --set-default-version 2 |
| wsl -s <分发版>  或  wsl --set-default <分发版> | 设置某分发的 WSL 版本 改为默认值<br />即由 wsl --set-default-version 设置的默认值 |
| wsl --set-version <分发版> <版本>               | 设定某分发的 WSL 版本                                        |

> 事实上都使用 WSL2 版本，不需要 “故意” 去修改或设置



<br>

### 其他命令

| 命令                                      | 含义                                                         |
| ----------------------------------------- | ------------------------------------------------------------ |
| wsl -e <命令行>  或  wsl --exec  <命令行> | 不使用 Linux shell 的前提下，直接执行 某些命令<br />备注：个人暂时不能理解该条命令存在的意义，例如 wsl -e echo "hello"<br />为什么不直接执行：echo "hello" ？ |
