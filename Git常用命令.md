# Git常用命令

## 安装Git

### Windows下安装 Git

访问 Git Windows安装程序下载页：https://git-scm.com/download/win，网页根据当前系统默认自动下载合适的安装程序。

### CentOS下安装 Git

#### 安装 git 之前的检查

首先检查系统是否已安装 git ，默认腾讯云服务器就安装有 git，只不过版本比较旧。

```
git --version
```

> 如果系统没有安装 git 则会提示`找不到 git 命令`、如果系统已安装有 git，则会输出 git 版本号。
> 本人购买的腾讯云服务器，默认安装有 1.18.x 版本的 git



#### 卸载前的 git 旧版本

如果系统内已安装有 git，我们先执行卸载。

第1步：先找到 git 文件目录

```
which -a git
```

> 通常情况下，默认 git 安装目录为：/usr/bin/git

第2步：删除 git 目录，若打印的 git 目录路径确实是 /usr/bin/git，那么执行：

```
rm -rf /usr/bin/git
```

第3步：验证是否已删除 git

```
git --version
```

如果打印出下面信息，即证明已删除(卸载)：

```
-bash: cd: /usr/bin/git: No such file or directory
```

第4步：断开当前服务器连接，并再次连接上服务器

这一步的目的是为了确保清空当前客户端sesscion中对 git 命令路径的保存。

> 由于客户端sesscion可能会保存 git 命令原本的路径，可能会造成后面即使新版本 git 安装好之后，系统依然去调用旧git版本路径。
> 为了避免出现这种情况，所以断开当前服务器连接，并重新连接以便我们进行新版本的 git 安装。



#### 安装方式1：使用 yum 安装

使用 yum 安装 git 非常简单，只需执行：

```
yum install -y git
```

但是由于默认 yum 仓库中 git 版本可能不是最新的，所我们可以更换成 Endopoint 仓库。

**第1步：安装 Endopoint仓库**

访问 https://packages.endpoint.com/rhel/7/os/x86_64/，在页面中找到 `endpoint-repo`最新的版本。

目前新版本为：https://packages.endpoint.com/rhel/7/os/x86_64/endpoint-repo-1.8-1.x86_64.rpm

在终端，执行：

```
yum -y install https://packages.endpoint.com/rhel/7/os/x86_64/endpoint-repo-1.8-1.x86_64.rpm
```

**第2步：执行 yum 安装 git**

```
yum install -y git
```

**第3步：验证 git 是否安装成功**

```
git --version
```

> 若输出最新 git 版本号(目前最新的是 2.27.0)，即证明安装成功

> 若有一天想要卸载 git，则执行：yum remove git



#### 安装方式2：使用源代码包安装

**第1步：使用 yum 安装 git 一些依赖程序**

```
yum -y install epel-release
yum -y groupinstall "Development Tools"
yum -y install wget perl-CPAN gettext-devel perl-devel  openssl-devel  zlib-devel curl-devel expat-devel  getopt asciidoc xmlto docbook2X
ln -s /usr/bin/db2x_docbook2texi /usr/bin/docbook2x-texi
yum -y install wget
```

**第2步：获取最新 git 源代码安装包**

访问：https://git-scm.com/download/linux 在此页面找到最新稳定版的 .tar.gz 文件，不建议安装 RC 版本。

> 目前最新稳定版文件下载地址是：https://www.kernel.org/pub/software/scm/git/git-2.27.0.tar.gz

假设我们希望将 git 安装到 /software/git/ 中(当然也可以是其他目录)，那么可以通过 xftp工具将 源代码安装包文件上传至服务器 /software/ 中，或者通过 wget 直接在 /software/ 中下载该文件，代码如下：

```
wget https://www.kernel.org/pub/software/scm/git/git-2.27.0.tar.gz
```

**第3步：编译并安装 git**

进入存放 git 安装包 .tar.gz 的目录，依次执行以下命令：

```
cd /software  # 进入存放安装包的目录
tar -xvf git-2.27.0.tar.gz  # 解压安装包
rm -f git-2.27.0.tar.gz  # 删除安装包
cd git-2.27.0  # 进入解压得到的 git-2.27.0 目录
make configure  # 运行 configure 脚本
./configure --prefix=/software/git  # 添加编译参数，--prefix 的值是 git 的目标安装目录
make  # 编译，生成 Makefile 文件
make install  # 开始安装
rm -rf git-2.27.0  # 删除源码目录
```

**第4步：**验证是否安装成功

由于我们并没有采用 yum 安装 git，此时系统全局环境中并未配置 git，因此我们验证 git 需要使用 git 的完整路径：

```
/software/git/bin/git --version
```

若输出以下内容，即安装成功：

```
git version 2.27.0
```

**第5步：创建软连接**

```
ln -s /software/git/bin/git /usr/local/bin/git
```

至此，可以在任意目录下，都可以使用 git 命令了。

> 若有一天想卸载 git，则先删除软连接：rm -rf /usr/local/bin/git，再删除 git 所在目录：rm -rf /software/git

