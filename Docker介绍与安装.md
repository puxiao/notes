# Docker介绍与安装

## 容器演变过程

### 最早程序发布过程

发布程序：

1. 购买物理服务器
2. 将程序文件拷贝到物理服务器中

存在的缺点：

1. 部署非常慢
2. 成本高
3. 资源浪费
4. 难于迁移和扩展
5. 受硬件限制

### 虚拟化技术出现以后

实施方式：

1. 一个物理机可以划分多个虚拟机(Virtual Machines，简称VM)
2. 每个程序独立运行在各自的虚拟机里

虚拟化的有点：

1. 资源池：一个物理机的资源可以分配到不同的虚拟机里
2. 容易扩展：加物理机器或加虚拟机
3. 容易云化：例如 阿里云 腾讯云

### 虚拟化的局限性

1. 每个虚拟机都是一个完整的操作系统，要给其分配资源，操作系统本身消耗资源

### 开发和运维面临的问题

1. 开发人员有一套开发流程和所需环境：开发语言、数据库、数据监控等
2. 运维人员有一套运维流程和服务器环境：程序部署、服务监控等

以上情况造成开发人员和运维人员没有统一有效的沟通方式(中介)、一个标准、一个模式，这就造成开发人员部署软件时与服务器环境不一致。

### 容器解决了什么问题

容器是一个中间容器，相当于一个桥梁，解决了开发环境和运维环境之间的差异矛盾。

Docker 图标为一个集装箱，含义是：开发和运维环境都以“集装箱”为单位进行文件数据传递，至于集装箱中放的是什么内容，运维人员不用关心。

> Docker进行了拟物化，用集装箱来表示容器。

### 什么容器？

1. 对软件和其依赖的标注打包
2. 应用之间相互隔离(当然肯定没有虚拟机隔离程度好)
3. 共享一个OS Kernel
4. 可以运行在很多主流操作系统中

### 容器和虚拟机的区别

1. 容器是APP程序层面的隔离
2. 虚拟化是物理资源层面的隔离
3. 在腾讯云服务器上使用容器(Docker)，相当于 虚拟化+容器

### 容器技术的实现

1. Docker 仅仅是容器技术的一种实现
2. 还有其他容器技术
3. 只不过目前Docker最流行
4. Docker也分为免费社区版和收费企业版

# Docker安装

## Win10安装Docker桌面版

**首先强调一下，Docker Desktop (桌面版) 只支持 win10 系统。**

> 因为 Docker 本质上是一个 Linux 程序，所谓 Docker桌面版 其实是一个 Docker 官方制作的具有虚拟机性质的外壳。
> 而只有 win10 系统才开始支持 WSL 2 Linux 内核模块。

### 第1步：下载安装包

下载地址：https://www.docker.com/get-started  点击 Download for Windows

目前最新版本为：2.3.0.3

### 第2步：解决Windows系统低版本无法安装的问题

当准备安装 Docker Desktop Installer.exe 时，默认会安装程序会先检测当前 windows 系统版本，我这里收到的提示为：

```
Docker Desktop requires Windows 10 Pro/Enterprise (15063+) or Windows 10 Home (19018+).
```

无法安装，默认要求 win10 专业版(15063+) 或 win10 家庭版(19018+)

> 总不至于为了安装 docker 要更换操作系统吧，别急，有以下几种解决方案。

### 解决方式1：升级系统

如果你电脑是 win10 以下的系统，那么除非更换操作系统，否则不能靠简单的系统更新来完成大的版本号升级。

我的电脑当前是 windows 10 家庭版 1903，所以在不更换操作系统情况下，是可以通过升级来达到 Docker  要求的。

#### 不可用的升级方式

```
设置 > 更新与安全 > windows 更新
```

这种更新只会做小版本的升级变动，我的电脑检测最多可以升级到 1909，依然达不到 Docker 家庭版最低 19018 的要求。

#### 正确的升级方式

到微软官网，下载 windows10 专属升级工具 “易升”，下载地址：https://www.microsoft.com/en-gb/software-download/windows10 ，点击下载网页中按钮 “Update now”，下载完成后，安装该程序，并根据提示升级操作系统。

> 我的电脑系统升级之后为版本号为 2004，已可以正常安装 Docker Desktop 版本

#### 更新 WSL 2 Linux 内核

首次运行 Docker 桌面版，提示需要更新 系统 WSL 2 Linux内核，更新下载地址：https://docs.microsoft.com/zh-cn/windows/wsl/wsl2-kernel ，安装更新并重启电脑，即可开始正常使用 Docker 桌面版。



### 解决方式2：修改系统文件，欺骗 Docker 检测工具

具体方法，请参阅：https://itnext.io/install-docker-on-windows-10-home-d8e621997c1d

> 个人不推荐如此操作，不确定会有什么隐患。



## Win10以下版本安装Docker

### 第1种方式：安装 DockerToolbox

放弃安装 Docker for Windows，该用安装 Docker Toolbox。
下载地址：https://github.com/docker/toolbox/releases  在页面 Assets 中找到 DockerToolbox-xx.xx.x.exe
目前最新版本为：19.03.1

尽管 DockerToolbox 依然由 Docker 官方维护，但已被官方“遗弃”，官方不推荐继续使用 DockerToolbox。

### 第2种方式：安装Linux虚拟机

安装 Linux 虚拟机，然后在虚拟机中安装 Docker。



## CentOS安装Docker

### Docker 对 CentOS 系统要求

1. 服务器必须64位，且最低版本为 CentOS 7
2. Linux内核最低版本 3.10，可通过执行 `uname -r` 来查看
3. 处理器支持 x86_64/amd64 或 ARM64/aarch64、不支持 ARM 处理器

### 若之前安装有Docker，则先卸载旧版本

卸载旧版本代码：

```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

### 安装方式1：下载脚本安装

> curl 是 Linux 的一个命令，用来下载文件
> .sh 是一种编写好的脚本文件

下载脚本文件(get-docker.sh)，并执行该文件：

```
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

上述代码还可以合并成一行：

```
curl -fsSL https://get.docker.com -o get-docker.sh | sh
```

> `https://get.docker.com` 会安装最新版，若要安装测试版，则将域名更换为 `https://test.docker.com`

#### 注意事项

虽然这种方式最为简便，但是需要注意以下几点：

1. 需要 root 用户 或 sudo 权限
2. 安装过程中各种配置参数均无法自定义，只能按照脚本中的来进行安装。
3. 会自动安装软件管理器所有依赖或建议项，因此可能会安装大量软件包。
4. Docker官方不建议使用此方法用于生产环境中。



### 安装方式2：使用存储库安装

#### 第1步：设置存储库

安装 yum-utils 软件包，使用 yum-utils 提供的 yum-config-manager 工具，设置固定的 Docker 存储库，方便此时安装或以后更新。

```
yum install -y yum-utils
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

也可以选择国内的一些镜像地址：

```
yum-config-manager \
    --add-repo \
    https://mirrors.tencent.com/docker-ce/linux/centos/docker-ce.repo
```

```
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

#### 第2步：安装 Docker Engine 社区版

默认安装最新版本的 Docker Engine 社区版：

```
yum install docker-ce docker-ce-cli containerd.io
```

> 如果提示是否接受 GPG 秘钥，选择：是

#### 第3步：启动 Docker

```
systemctl start docker
```

#### 第4步：验证是否启动成功

```
docker run hello-world
```

> hello-world 是一个自带的小测试项目，会打印 “Hello from Docker!” 并自动退出



### 第3中方式：使用安装包安装

#### 第1步：找到对应的安装包 .rpm 文件

访问网址：https://download.docker.com/linux/centos/ ，找到对应的 CentOS 版本并点击进入，进入 `x86_64/stable/Packages/` 目录，找到需要安装的版本文件

> 例如我选择的 完整文件路径为：`https://download.docker.com/linux/centos/7/x86_64/stable/Packages/` 中 docker-ce (社区版)的某个版本

#### 第2步：下载该文件(可选)

需要安装下载的3个文件，依次是：containerd.io、docker-ce-cli、docker-ce

> package中的docker-ce-selinux 这个文件不需要下载安装，已经被废弃。

> 如果服务器不能联网，则可通过离线拷贝形式将文件存放到服务器中。
> 如果服务器可以联网，也可以忽略第2步。

我选择的版本文件是：

```
https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm
https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-cli-19.03.8-3.el7.x86_64.rpm
https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-19.03.8-3.el7.x86_64.rpm
```

下载文件时我选择使用 wget 而不是 curl 命令，对应的下载命令：

```
wget https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm
wget https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-cli-19.03.8-3.el7.x86_64.rpm
wget https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-19.03.8-3.el7.x86_64.rpm
```

> 如果在云服务器上下载很慢，可以通过本机网页下载这些文件，然后通过 xftp 工具将文件上传到服务器对应目录中。

#### 第3步：使用 yum 安装该文件

需要依次安装：containerd.io、docker-ce-cli、docker-ce
安装代码构成为：yum + install + 本地绝对路径或网上对应的文件地址

特别强调：如果是本地rpm文件，**一定要写绝对路径**，不要写相对路径。例如：

```
一定要写绝对路径
yum install /software/docker/containerd.io-1.2.6-3.3.el7.x86_64.rpm

即使 cd 到 /software/docker/，也不能写相对路径
yum install containerd.io-1.2.6-3.3.el7.x86_64.rpm
```

若 安装包文件 已经下载到某目录中，依次按照顺序，执行安装命令：

```
yum install /path/to/containerd.io-1.2.6-3.3.el7.x86_64.rpm
yum install /path/to/docker-ce-cli-19.03.8-3.el7.x86_64.rpm
yum install /path/to/docker-ce-19.03.8-3.el7.x86_64.rpm
```

若没有下载 rpm文件，也可直接使用网上文件地址：

```
yum install https://download.docker.com/linux/centos/7/x86_64/stable/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm
yum install https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-cli-19.03.8-3.el7.x86_64.rpm
yum install https://download.docker.com/linux/centos/7/x86_64/stable/Packages/docker-ce-19.03.8-3.el7.x86_64.rpm
```

> 安装过程中会有几步需要确认，都输入 y 表示同意即可。
> 若嫌麻烦，可在 yum 安装命令中，增加 -y 的参数(即告诉 yum 所有询问都执行 y)

#### 第4步：启动 Docker

```
systemctl start docker
```

#### 第5步：验证是否启动成功

```
docker run hello-world
```

> hello-world 是一个自带的小测试项目，会打印 “Hello from Docker!” 并自动退出

### 更新 Docker Engine 版本

卸载旧版本，按照上述中的安装方式，重新安装一遍新版本。

### 卸载 Docker Engine

```
yum remove docker-ce docker-ce-cli containerd.io
```



## 补充说明

#### 查看 Docker安装目录

```
which docker

会显示默认安装位置
/usr/bin/docker
```

#### 关于腾讯云镜像存储库说明

1. https://mirrors.cloud.tencent.com/ 是对外，可通过公网访问，若云服务器访问则会产生流量
2. https://mirrors.tencent.com/ 是对内，仅腾讯云服务器内网可访问，不产生任何流量
3. 默认腾讯云服务器 CentOS /etc/yum.repos.d/CentOS-Epel.repo 中，镜像存储库都使用的是 `https://mirrors.tencent.com/ `

#### Docker Engine 更新版本库的说明

通常有4个共存的版本目录，对应更新频率分别是：

1. /edge 或 /test：每月发布一次
2. /nightly：每天夜里更新一次
3. /stable：每3个月更新一次

相对而言 stable 版本更加稳定，这也是为什么 安装方法3中，文件网址路径中，会出现 `/stable/`。
