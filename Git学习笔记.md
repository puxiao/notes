# Git学习笔记

## 安装 Git

### Windows 下安装 Git

访问 Git Windows安装程序下载页：https://git-scm.com/download/win，网页根据当前系统默认自动下载合适的安装程序。

### CentOS 下安装 Git

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



#### 安装 git 方式1：使用 yum 安装

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



#### 安装 git 方式2：使用源代码包安装

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



## 概念解释

#### 项目文件的2种跟踪状态

1. 已跟踪(tracked)：已被纳入版本控制的文件，在上一个文件快照中有他们的记录，目前该文件状态可能为：未修改(即已提交状态)、已修改、已放入暂存。
2. 未跟踪(untracked)：未被纳入版本控制的文件，项目目录中除了 已跟踪的文件之外，其他文件都是 未跟踪。

> 项目初次 git 化后，默认目录下所有文件都是 已跟踪状态，并处于未修改状态中。



#### 已跟踪文件的3种文件状态

已修改(modified)：文件已修改，但还未存入本地数据库中

已暂存(staged)：对一个已修改的文件做了标记，使之包含在下次提交的快照中

已提交(committed)：文件已保存至本地数据库中



## Git配置

### Git 配置文件级别

Git 通常有3个级别的配置：

1. 当前项目中的 config 配置：.git/config，优先级别最高
2. 当前用户中的 config 配置：~/.config/git/config，优先级次之
3. 系统中 git 的全局配置：../etc/gitconfig，优先级较低

Git 会依次读取 3 个级别中的相关配置，并最终选用级别高的配置值。

> 无论哪个级别的配置文件，如果设置参数时 添加 --global 参数，都会将该配置提升至`全局配置`中。
> 事实上 --global 主要使用在 当前用户中的 config 配置，因为对于 全局配置来说本身就是全局配置无需再次设定、对于当前项目中的 git 配置，即使不设置 --global 也是优先级别最高的。

查看所有会影响 Git 配置的文件路径：

```
git config --list --show-origin
```

查看 Git 全局配置信息：

```
git config --global --list
```

> 仅显示具有 --global 参数属性的配置信息，不包含 项目配置信息 和 当前用户配置信息



### 设置全局用户信息

每次 Git 提交都需要提交者的信息，可以通过以下命令设置全局用户信息。

```
git config --global user.name "xxx"
git config --global user.email xxxx@xxx.com
```

> user.name 后的值加 双引号的目的是为了让你可以在用户名中使用 空格或其他特殊字符。

查看全局配置中，用户信息：

```
git config --global user.name
git config --global user.email
```

若要修改 user.name 的值，重新执行一遍 设置 user.name 的命令即可

> 全局用户信息配置一次即可永久生效，若在某些项目中不希望使用全局用户信息，则可以在该项目的配置文件中，设置自己的用户信息，当然切记设置时不要添加 --global 参数。



### 设置默认的 Git 文本编辑器

**为什么要设置 Git 文本编辑器？**

答：因为每次提交代码时，都需要输入本次提交的文字说明，那么就需要告诉 git 使用什么文本编辑器打开并录入描述信息。

**如何设置 Git 默认文本编辑器？**

首先需要获取 文本编辑器可执行程序 的绝对路径，例如 Windows 中如果安装 VSCode，那么对应配置命令为：

```
git config --global core.editor "D:\program files (x86)\Microsoft VS Code\Microsoft VS Code\Code.exe" --wait
```

> 当执行提交代码时，会打开默认文本编辑器，并处于录入状态，可以输入本次提交描述信息
> 当保存后，会正式提交
> 若中间关闭默认文本编辑器，则会取消本次提交

查看默认 Git 文本编辑器：

```
git config --global core.editor
```



### 删除全局某配置

使用 --unset 参数可删除某配置，例如要删除全局配置中的 user.name，则执行：

```
git config --global --unset user.name
```



### 查看最终生效的全部配置

```
git config --list
```



## 获取Git帮助

### 获取详细的帮助信息

一共有3种方式可以获取 Git 帮助：

1. git help <verb\>：打开本地 git 帮助网页
2. git <verb\> --help：打开本地 git 帮助网页
3. man git-<verb\>：在终端窗口 简要显示帮助信息，摁 q键 退出、摁 h 键 进一步查看，在进一步显示帮助信息界面中，摁回车键查看更多、摁 q键退出

> 注意：第3种 man git-<verb\> 命令只有在 Linux 系统上才可以执行，在 Windows 系统上则无法执行。

例如想查看 config 的相关帮助，对应的命令分别是：

```
git help config
git config --help
man git-config
```



### 获取简要的帮助信息

不使用 help，而是使用 -h，即可在终端简要显示对应帮助信息。

命令格式为：git <verb\> --help，例如获取 config  的简要帮助信息：

```
git config -h
```



## 创建/克隆Git仓库

### 创建 Git 仓库

将某个目录创建成 Git 仓库，首先在终端 cd 进入到该目录，然后执行：

```
git init
```

该命令会在当前目录下创建一个 .git 目录，用来储存 git 文件信息。



### 克隆Git仓库

将网络(主要是 Github )中某个Git 仓库，克隆到本地，假设 git 项目地址为：https://github.com/puxiao/koa-mongodb-react.git

```
git clone https://github.com/puxiao/koa-mongodb-react.git
```

该命令会在当前目录下，创建一个 koa-mongodb-react 的目录，同时目录中存在 .git 目录，用来储存 git 文件信息。

若不希望使用 默认的 koa-mongodb-react 作为目录名字，可以在上述命令结尾处添加一个目录名，本地仓库将使用该目录名。例如：

```
git clone https://github.com/puxiao/koa-mongodb-react.git mynode
```

该命令执行后，会在当前目录下创建 mynode 的目录，并将远程仓库里的内容 下载至此目录中。

**特别提醒：**

使用 clone 的远程仓库，默认 git 会将远程仓库名命名为 origin、将分支命名为 master。



### 查看项目文件 git 跟踪状态

```
git status
```

在打印的信息中：

1. Untracked files 下面对应的文件或目录，都是未被跟踪的状态。

2. Changes to be committed 下面对应的文件或目录，都已保存到暂存区。

3. Changes not staged for commit 下面对应的文件或目录，都是已修改，但尚未保存到暂存区。


**注意：**

我们执行 `git status` 时打印的信息特别详尽，如果想查看简洁版的状态结果，可以通过添加参数 -s 或  --short 来实现：

```
git status -s  或  git status --short
```

在打印的信息中，文件或目录前面 会有2个字符位置(请注意可能存在使用 空格 代替一个字符占位)，左侧对应在 暂存区 的状态，右侧对应在工作区的状态。具体含义参见以下表格：

> **为了更方便观察，我们使用 下划线( _ ) 来代替空格**

| 第1个字符 | 第2个字符 | 组合结果 | 对应 文件或目录 当前的状态                     |
| --------- | --------- | -------- | ---------------------------------------------- |
| ?         | ?         | ??       | 表明文件或目录，都是未被跟踪的状态。           |
| A         | 空格(_)   | A_       | 表明文件或目录，刚刚被添加(保存)在暂存区       |
| M         | 空格(_)   | M_       | 表明文件或目录，已修改，并且已保存到暂存区     |
| 空格(_)   | M         | _M       | 表明文件或目录，已修改，但尚未保存到暂存区     |
| M         | M         | MM       | 表明文件或目录，在保存到暂存区后又进行了修改。 |




### 将文件或目录添加到跟踪状态

```
git add /file-path/filename
```

> 如果添加的是目录 ，则会将该目录下所有内容 一并都设置为跟踪状态。
> 事实上将文件或目录添加到跟踪状态的同时，也会把他们设置为暂存状态。



### 将文件或目录保存到暂存区

```
git add /file-path/filename
```



### 修改已保存到暂存区的文件

假设 某文件已经保存到 暂存区中，此时又重新修改了该文件，那么应该重新执行一次保存：

```
git add /file-path/filename
```

> 没错，无论是将文件或目录 添加到跟踪状态、还是保存到暂存区、还是重新修改暂存区中的文件或目录，他们都使用相同的代码。



## 忽略保存某些文件或目录

通过在项目根目录创建 .gitignore 文件，来声明 git 可以忽略监控的文件或目录。

>  .gitignore 文件和 docker 的 .dockerignore 文件非常像

### .gitignore 文件遵循原则

1. 若使用 # 开头，表示这一行为注释

2. 每一行为一个文件或目录，且文件或目录路径只能是 当前项目中的，不允许跳出本项目根目录。

3. 文件或目录路径都支持 glob 正则匹配模式。

   > 所谓 glob 正则匹配模式，就是在 shell 命令中支持的简化版正则表达式

4. 若使用 ! 开头，且路径中使用了 glob 正则匹配，则最终结果为该正则表达式结果取反。

5. 越靠后的匹配规则，优先级越高

   > 举例：假设第1行中 正则匹配命中，忽略 xx.xx文件，但是第5行中又有正则命中 xx.xx，且结果取反，那么最终结果是不会忽略 xx.xx 文件的。

**特别提醒：**

尽管项目的任何子目录中都可以创建 .gitignore 文件，但是不建议在不同目录中创建多个 .gitignore 文件。
只建议在项目根目录中创建 .gitignore 文件。

### glob 正则匹配遵循原则

1. 星号(*) ：可以匹配 0个 或任意个字符
2. 两个星号(**) ：可以匹配 任意中间目录 (注意是中间任意目录，不是任意目录)
3. 问号(?) ：可以匹配 任意 1个字符
4. [abc] ：可以匹配 该 a b c 中任意一个字符
5. [0-9] ：可以匹配 0 - 9 中任意一个数字
6. [a-z] ：可以匹配 a-z 中任意一个字母



## 查看已暂存或未暂存文件的修改

我们可以使用 git status 或 git status -s 来查看文件当前的状态(是否已暂存、是否已修改、是否已暂存后又修改)，打印信息中只是列出了文件的状态但是并未列出文件具体修改的地方。

如果想查看具体文件修改的地方，可以使用 git diff 命令来查看文件具体修改的地方，会打印出新旧文件不同的地方。

### 工作区与暂存区的修改对比

```
git diff
```

> 这条命令对比的对象，分别是：工作区的文件、暂存区的文件，也就是指：工作区文件修改后还未暂存的地方

### 暂存区与上次提交的修改对比

```
git diff --staged  或  git diff --cached
```

> 这条命令对比的对象，分别是：暂存区的文件、上一次提交后的文件，也就是指：即将要提交的修改与上次提交版本中的差别

**特别提醒：**

当执行 git diff --staged 后终端界面可能会显示 “:” 或“END” 交互界面，若要退出此界面 摁 q键 即可。

> 无论你摁 ctrl + c 或 Enter 或 Esc 都无法退出，只有摁 q键 才可以退出

**再次强调：**

执行 git diff 仅仅打印出 工作区文件修改却未保存到暂存区的修改，并不是暂存区文件与上次提交版本中的差别。

> 当将所有修改都已保存到暂存区，那么此时执行 git diff 将不会打印出任何内容。



## 将暂存区内容正式提交

### 提交前的检查

在正式提交之前，建议先执行 git status ，检查一下当前工作区，暂存区的文件状态，确保正确无误，没有遗漏。

> 那些工作区中修改，但未保存到暂存区的改动，不会被提交到版本库中，仅仅保存在本机中。

### 将暂存区内容正式提交

```
git commit
```

执行该条命令后，并不会马上进行真正提交，而是会打开 Git 默认文本编辑器，编辑一个名为 COMMIT_EDITMSG 的文件，需要你录入本次提交的文字描述信息。

COMMIT_EDITMSG 文件由 2部分 组成：

1. 最上面，光标录入状态的地方，是你录入本次提交描述文字

2. 中间会以注释的形式，简要列出本次提交修改的地方，和 直接运行 git diff --staged 是相同的内容。

   > 中间这些注释信息，仅仅是为了让你再次确认本次提交的修改，这些注释信息不会被作为描述信息提交到版本库中。

若想在 COMMIT_EDITMSG 中显示详细的修改信息，则可在执行提交命令时，添加 -v 参数：

```
git commit -v
```

### 编辑描述信息

若直接关闭  COMMIT_EDITMSG 文件，那么会取消本次提交。

> Git 提交时不允许没有描述文字信息，若描述文字信息为空，则不会继续执行提交

若录入描述文字并保存 COMMIT_EDITMSG 文件，此时关闭 COMMIT_EDITMSG 文件后，会正式提交代码，提交完成后会打印出本次提交的一些相关信息，例如提交到了哪个分支、提交了哪些修改等等。

### 快速录入描述信息

若不想打开 Git 默认文本编辑器，则可以通过添加 -m 参数来直接输入描述信息，执行代码：

```
git commit -m "this is commit change message"
```

> 请注意：因为描述信息为一句话，中间会有空格或其他字符，所以需要用 双引号包裹



## 跳过暂存区，直接提交

通常情况下，从工作区修改到提交，需要经历一下几个步骤：

1. 在工作区修改文件
2. 使用 git add 将文件保存到暂存区
3. 使用 git commit 将暂存区文件提交

假设工作区修改文件比较多，每一个文件都需要执行一次 git add，过程略显繁琐。
为了简化提交过程，可以在 提交命令中添加参数 -a 来实现。

```
git commit -a
```

该命令会将所有跟踪的文件的修改，保存到暂存区并提交。

> 注意：未被添加到 Git 跟踪的文件 是不会被提交的。



## 修改上一次的提交

若提交成功后，发现有遗漏文件、提交描述文字有问题等，此时若为了修正这些错误而重新提交，那么就会产生一次新的提交记录。

为了避免因为一些小的错误修改而“浪费、占用”一次提交记录，可以通过添加 --amend 参数，来对上一次提交进行修改。

```
git commit --amend
```

当添加过 --amend 参数后，提交过程(包括修改描述文字)和普通提交类似，只是这次提交之后的结果，会与上次一提交进行合并，最终两次提交只会留下一条提交记录。

**特别提醒：**

这里提到的 “提交”，指将工作区修改后的文件提交到本地 Git 仓库中，并不是提交到远程仓库中。
若想将本地 Git 仓库文件提交到远程服务 Git 仓库中，会在 `远程仓库相关命令` 那一章节中讲述。



## 撤销(取消)暂存区中的文件

假设某文件或目录已保存到暂存区，此时想将该文件或目录从暂存区移除，即撤销暂存，可以执行：

```
git reset HEAD /path/filename
```

执行过后，文件将从暂存区移除，文件状态为：已跟踪、已修改但尚未暂存。



## 删除暂存区或工作区中的文件

将文件从工作区删除，然后从暂存区删除

```
rm /path/filename
git rm /path/filename
```

将文件从暂存区删除，工作区中该文件依然保留，从已跟踪状态变为未跟踪状态。

```
git rm --cached /path/filename
```

将文件从暂存区和工作区同时删除

```
git rm -f /path/filename
```



## 撤销(重新恢复)文件

撤销对某文件或目录的修改，让文件或目录恢复成当前 Git 版本库中的样子。执行：

```
git checkout -- /path/filename
```

> 特别注意：这样恢复文件的操作，会让你丢失该文件在工作区中已作出的修改

> 文件只要曾经提交到 Git 库中，那么就会有机会找回或恢复，但是对于工作区(或暂存区)中从未曾提交到 Git 库 的文件，无法通过 Git 命令进行恢复



## 文件重命名

在 Linux 中，mv 表示文件或目录 移动或重命名，但是在 Git 命令中，rm 仅仅只可以用来重命名。

```
git mv nowfilename newfilename
```

这句话相当于执行了以下3条命令：

```
mv nowfilename newfilename
git rm nowfilename
git add newfilename
```



## 文件位置移动

由于 Git 的 mv 只支持文件重命名，并不支持文件移动。那么想移动文件到别的目录，只能通过以下步骤：

1. 先将文件仅从暂存区删除：git  rm  --cached  /path/filename
2. 再通过工作区将文件移动到目标目录中，或通过 Shell 命令执行移动：mv  /path/filename   /newpath/newfilename
3. 最后再将新的文件路径添加到暂存区：git  add  /newpath/newfilename



## 查看Git项目提交历史记录

### 查看全部提交历史记录

查看当前 Git 项目提交历史，默认会显示全部提交历史，顺序从上到下，时间越来越久远：

```
git log
```

> 在打印的结果列表中，最上面第1条信息即最近一次提交历史信息。

> 摁 q键 退出查看提交历史记录详情



### 限制返回提交历史记录数量

通过添加参数 -<n\> 的形式来限制最多返回提交历史信息的数量，例如 -1 则表示只返回1条(最近提交的那一条)、-2 则表示最多可返回2条。

```
git log -2
```



### 显示每次提交历史记录中的差异

通过添加参数 -p 或 --patch，可在每一条提交历史记录中显示与上一次提交中的差异。

```
git log -p
```



### git log 支持的全部参数

| 参数                | 对应含义                                                     |
| ------------------- | ------------------------------------------------------------ |
| -p 或 --patch       | 按补丁格式显示每个提交引入的差异                             |
| --stat              | 显示每次提交的文件修改统计信息                               |
| --shortstat         | 只显示 --stat 中最后的行数修改添加移除统计                   |
| --name-only         | 仅在提交信息后显示已修改的文件清单                           |
| --name-status       | 显示新增、修改、删除的文件清单                               |
| --abbrev-commit     | 仅显示 SHA-1 校验和所有 40 个字符中的前几个字符              |
| --relative-date     | 使用较短的相对时间而不是完整格式显示日期<br />例如原本应该显示日期为 Sun Jul 26 15:37:37 2020 +0800，使用该参数后则显示为：23 hours ago |
| --graph             | 在日志旁以 ASCII 图形显示分支与合并历史                      |
| --pretty            | 使用其他格式显示历史提交信息。可用的选项值包括：oneline、short、full、fuller 和 format(自定义格式) |
| --oneline           | --pretty=oneline   --abbrev-commit 合用的简写                |
| --since 或 --after  | 仅显示截至日期以后的历史信息记录，例如设置：--since=2.weeks 只显示最近2周、--since=202-01-15 |
| --utill 后 --before | 仅显示截至日期以前的历史信息记录                             |
| --author            | 在作者名称中，检索返回包含 --author 关键词的提交历史信息记录，例如：--author=xiao<br />注意：凡是作者名称中包含 xiao 的，都可以匹配到，例如可以匹配到 puxiao、yangpuxiao |
| --committer         | 在提交者名称中，检索返回包含 --committer 关键词的提交历史信息记录<br />注意：author是作者(提交到分支的人)、committer是提交者(将分支合并到主仓库中的人) |
| --grep              | 在提交描述文字中，检索返回包含 --grep 关键词的提交历史信息记录，例如：--grep=“删除” |
| --all-match         | 返回只有同时满足 --author 和 --grep 条件的提交历史信息       |
| -S                  | -S 后面需要跟一个字符串，只会返回增加或删除跟这个 字符串有关的提交历史。<br />例如：git log -S function-name，则只返回增加或删除 function-name 有关的提交历史 |
| -- path/filename    | 在 git log 语句的最后一项，添加 -- path/filename，只返回跟这个路径有关的提交历史 |
| --no-merges         | 不显示合并提交历史记录                                       |



## 远程仓库相关命令

### 克隆远程仓库

关于如何通过克隆方式创建本地 Git 仓库，已在上面章节中提到过，这里重新复习一遍。

```
git clone https://xxxx.com/xx/xxx
```

会在当前目录下 创建一个名为 xxx 的目录，该目录里是对远程仓库的内容克隆。



### 查看所有远程仓库信息

若本地 Git 仓库中，所有远程仓库的名称(简称)：

```
git remote
```

> 1. 执行后会打印出远程仓库名称
> 2. 若无任何打印信息，则表明本地仓库并非克隆某远程仓库。
> 3. 若有打印出远程仓库信息，也不能证明本项目一定是克隆远程仓库的，因为打印出的仓库信息有可能是通过 git add 添加而来的，并非是通过 克隆 默认自动创建的
> 4. 使用 clone 的远程仓库，默认 git 会将远程仓库名命名为 origin、将分支命名为 master

通过添加参数 -v，还可以打印出远程仓库的具体URL地址和可用状态(fetch和push)。

```
git remote -v
```



### 查看某远程仓库详细信息

使用 git remote 会列出本地 Git 仓库中所有远程仓库的名称，若想查看某具体远程仓库的详细信息，则执行：

```
git remote show <remote>
```

执行后，会打印出该远程仓库目前详细的信息，例如各个分支状态，其中 HEAD branch 的值是你本地 Git 所对应的分支。



### 添加远程仓库

除了通过 克隆 远程仓库可以有远程仓库信息之外，还可以通过 git add 来添加远程仓库，该命令允许我们创建一个对该远程仓库的一个简称，以后调用该简称即代表该远程仓库。

向本地 Git 中添加远程仓库

```
git add <shortname> <prpository-url>
```



### 重命名远程仓库

```
git remote rename <remote> <newshortname>
```

请注意：当仓库名修改之后，对应分支的引用也会修改，例如将远程仓库 origin 修改为 myorigin，那么分支也会由 origin/master 修改为 myorigin/master



### 删除(移除)远程仓库

```
git remote rm <remote>  或  git remote remove <remote>
```

删除(移除)远程仓库后，同时也会删除该远程仓库所有分支的跟踪和信息。



**特别提醒：**

上面章节中，无论是“添加远程仓库”、“重命名远程仓库”、“删除远程仓库”，这些操作并不是真正操作远程服务器上的仓库，而仅仅是操作本地 Git 仓库中对远程仓库的引用。

例如“添加远程仓库”更为精准的描述应该是：在本地 Git 仓库中添加 某远程 Git 仓库的引用



### 抓取与拉取远程仓库中的更新

抓取更新，执行代码：

```
git fetch <remote>
```

拉取更新，执行代码：

```
git pull <remote>
```

**抓取与拉取的区别是什么？**

答：抓取与拉取 字面意思本身非常接近，Git 官网文档中是这样定义2者区别的：

1. 抓取——抓取更新：将远程仓库中的更新下载到本地，但并不会马上与本地项目中的文件进行合并，而是交由项目管理者查看更新内容，并确定是否合并到本地项目中。
2. 拉取——拉取更新：将远程仓库中的更新下载到本地，并尝试与本地项目中的文件进行合并。

简单来说，抓取是下载更新但不马上合并、拉取是下载更新并尝试合并。



### 将本地Git仓库推送到远程仓库

通过 git commit 可以将工作区中的文件修改 提交到本地 Git 仓库中。而将本地仓库文件推送到远程 Git 仓库，执行：

```
git push <remote> <branch>
```

> 如果本地项目是克隆某远程仓库，Git 默认将远程仓库命名为 origin、将分支命名为 master
> 如果项目并非克隆，或者说想添加其他远程仓库，则通过执行 git add <shortname\> <prpository-url\> 命令添加远程仓库

例如将本地 Git 仓库中的文件，推送到默认的远程仓库中，执行：

```
git push origin master
```

上述代码中，由于推送到默认分支 master 中，而不是自己创建的分子，所以需要满足以下几个条件才可以推送成功：

1. 拥有对远程 Git 仓库的写入权限
2. 目前自己本地的 master 分支是最新的 ，若在你克隆该分支之后，有其他人推送过新的文件到该分支，那么你的这次推送将会被拒绝。你只有抓取新的 master 分支内容，并合并到本地项目中之后，才可以推送。



