# Docker常用命令

## 基础命令

查看 docker 支持的命令：docker

查看 docker 信息：docker info

查看 docker 当前版本：docker version

启动 docker ：systemctl start docker

docker 启动项目：docker run xxx



## 帮助相关

查看帮助：docker --help

查看 某操作 的帮助：docker xxx -help  例如查看 run 相关帮助 docker run --help、docker logs --help、docker ps --help



## 输出logs相关

查看 logs 帮助：docker logs --help

格式化输出：docker logs -f



## Docker配置文件(daemon.json)

Linux系统，docker 配置文件路径为：/etc/docker/daemon.json

Windows10，docker 桌面版配置文件路径为：c:\users\your-username\\.docker\daemon.json

也可以通过点击系统右下角 docker 图标，右键 > settings > docker engine > 右侧内容里修改

> 每次修改配置文件，一定要重启 docker 才会生效



## 使用DockerHub加速器

使用腾讯云或阿里云的 DockerHub 加速器，可以快速拉取 DockerHub 平台上的容器镜像。

Linux系统内，配置步骤如下：

第1步：创建或修改 /etc/docker/daemon.json 文件，并写入以下内容：

```
# 腾讯云的 DockerHub加速 只针对在腾讯云服务器上使用，外网无法使用
{
   "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}

# 阿里云的 DockerHub加速 可以针对外网使用
{
  "registry-mirrors": ["https://e3je0x5v.mirror.aliyuncs.com"]
}
```

> 默认安装 docker 之后，/etc/docker/daemon.json 文件并不存在，需要自己创建

第2步：重新加载 守护进程 配置文件

```
systemctl daemon-reload
```

第3步：重启 docker 服务

```
systemctl restart docker
```

第4步：验证是否配置生效

```
docker info
```

若在打印输出的信息中，找到以下信息即表明配置已生效。

```
Registry Mirrors:
 https://mirror.ccs.tencentyun.com
```



Windows10 Docker 桌面版配置方式：

第1步：windows 系统右下角 docker 图标，点击右键，在出现的菜单中点击 Settings。

第2步：在设置面板左侧中，点击 Docker Engine，在右侧文本内容中，将加速地址 "https://e3je0x5v.mirror.aliyuncs.com" 填入到 registry-mirrors 中。

> 由于腾讯云 DockerHub 不支持外网，所以只能使用 阿里云 DockerHub 加速器

第3步：点击 Apply & Restart，应用并重启 Docker 服务。

第4步：验证是否配置生效

```
docker info
```

若在打印输出的信息中，找到以下信息即表明配置已生效。

```
Registry Mirrors:
 https://mirror.ccs.tencentyun.com
```



## 全局DNS配置

创建或修改 /etc/docker/daemon.json 文件，并写入以下内容：

```
{
  "dns" : ["118.118.118.118","8.8.8.8"]
}
```

> dns 的值为一个数组，可以设置多条 IP地址
> 修改 daemon.json 文件后，需要重启 dokcer 才可生效。

> 某个容器若想不使用全局DNS，而是指定DNS，可在启动容器时，增加 --dns=118.118.118.118 来实现。



## 修改镜像文件存放位置

#### Linux系统内，配置方法

创建或修改 /etc/docker/daemon.json 文件，并写入以下内容：

```
{
  "data-root": "/docker"
}
```

> 修改 daemon.json 文件后，需要重启 dokcer 才可生效。



#### Windows10 Docker 桌面版配置方式

**特别提醒：以下操作仅仅是修改了 Window10 Docker 虚拟机(WSL 2 ) 里静态文件的存放位置，并不是真正 Win10 本地文件系统中的位置。**

第1步：windows 系统右下角 docker 图标，点击右键，在出现的菜单中点击 Settings。

第2步：在设置面板左侧中，点击 Docker Engine，在右侧文本内容中，添加参数：

```
{
  "data-root": "/docker"
}
```

第3步：点击 Apply & Restart，应用并重启 Docker 服务。

**以下才是真正 配置迁移虚拟目录的方法**

**补充说明：Win10 中虚拟机采用 WSL 2版本，虚拟机文件系统由 WSL 2 管理，因此想更换 docker 的默认镜像文件存放目录，应该通过 WSL 命令来操作。**

> 默认 docker 虚拟机文件存放位置为：C:\Users\your-user-name\AppData\Local\Docker\wsl\data\ext4.vhdx

假设现在我们希望将 docker 默认在 c盘 的虚拟文件存放目录修改到 `d:\docker-data\`，操作步骤如下：

第1步：在终端执行以下命令，查看并确认 本机 docker 使用的是 WSL 2

```
wsl -l -v
```

在终端会打印出：

```
C:\WINDOWS\system32>wsl -l -v
  NAME                   STATE           VERSION
* docker-desktop         Running         2
  docker-desktop-data    Running         2
```

> 在输出信息中，STATE显示 docker 当前运行状态、LVERSION 为 2 (即 WSL 2)。

> docker-desktop 为我们安装的 docker 桌面版软件，由于软件文件体积并不大，因此无需移动 docker-desktop。
> 我们此次重点，只需要移动 docker-desktop-data，这个才是 win10 下 docker 的虚拟文件目录，docker pull 下载的镜像文件都存放在这个虚拟目录里，为了避免以后 C盘空间被占满，所以才需要将该虚拟目录移动到其他盘。

第2步：关闭 docker 桌面版，或者通过 wsl 关闭

```
wsl --shutdown
```

第3步：通过 wsl --export 将原有虚拟目录中的数据，压缩并导出到目标目录中

```
wsl --export docker-desktop-data d:\docker-data\docker-data.tar
```

> d:\docker-data：本次迁移到的目录，实际操作中，你可以将该目录命名成你喜欢的名字，但是切记目录名不要出现中文
> docker-data.tar：该压缩文件名字你也可以使用其他名字，该文件在后面导入过程中会使用到

第4步：注销原有虚拟文件目录

```
wsl --unregister docker-desktop-data
```

> 终端会打印出：正在注销...，并执行完成

第5步：创建新的虚拟文件目录，并导入原有虚拟目录中的数据(第3步中创建的那个压缩文件)，并设定 WSL 的版本

```
wsl --import docker-desktop-data d:\docker-data d:\docker-data\docker-data.tar ---version 2
```

> docker-desktop-data：虚拟目录名字
> d:\docker-data：虚拟目录在 Windows 文件中真实路径
> d:\docker-data\docker-data.tar：原有虚拟目录中的数据
> --version 2：使用 WSL 2版本

> 上述命令执行完毕后，本机打开 d:\doker-data，查看是否存在 ext4.vhdx，若存在即证明迁移成功 。

至此，虚拟目录迁移完成，以后 docker 下载的镜像文件都将存放在这个目录中的 ext4.vhdx 中。
默认的虚拟目录对应的文件  `C:\Users\your-user-name\AppData\Local\Docker\wsl\data\ext4.vhdx` 将不存在。

第6步：将之前创建的 d:\docker-data\docker-data.tar 文件删除 (直接用文件夹形式打开目录，找到 .tar 删除即可)

> 事实上，如果觉得有必要，以后也可以通过 wsl --export docker-desktop-data 来导出并备份 docker 虚拟文件系统

第7步：重启 docker 



## Dockerfile文件相关

Dockerfile 是一个文本文档，用来存放构建镜像文件过程的全部指令。

Dockerfile 中定义的 “上下文” 指：本地文件路径(file path) 或 Git仓库路径(git url)

#### 基础知识和规范

dockerfile 是用来描述如何去构建镜像文件。

dockerfile 文件遵循以下原则：

1. dockerfile 通常存放在项目输出根目录下
2. dockerfile 不需要文件后缀名，内容遵循 yml 格式
3. dockerfile 虽然内容格式不区分大小写，但是通常建议将 命令 使用全大写，以方便和参数进行区分
4. dockerfile 每一行开头无论有多少个空格都会被忽略，都不影响该行的命令效果
5. dockerfile 结尾处可以换行，但不会忽略换行前面的空格
6. dockerfile 必须以 FROM 参数为开端，FROM 参数之前只允许出现 注释 或者 ARG(声明给 FROM 使用的变量)

#### #(注释)设置

通过 # 来定义注释。dockerfile 内容中，使用 # 开头表示该行为注释，注释不允许换行，注释里的内容不会出现在构建过程中

#### 解析器指令

通过 特殊注释形式，即 使用 # 来定义解析器指令。

解析器指令(可选项)，用来告知 Docker 在使用(解析) dockerfile 文件时 一些解析规则。

以特殊注释形式出现，遵循以下原则：

1. 格式为 # keywordxxx=valuexxx ，Docker 会尝试解析 # 开头的注释，看是否符合 解析器格式，如果符合则把该行 注释内容当做解析器来执行
2. 分析器指令只能出现在 dockerfile 的第1行中
3. 只能出现1次(遵循 dockerfile 中 # 注释原则)
4. 如果把注释写在 FROM 之后，则会忽略该分析器指令
5. 一旦一个注释、空行、构建指令已开始执行，解析器指令就会失效，仅当做普通注释
6. 不允许换行，允许开头、中间、结尾出现空格，这些空格都会被忽略掉

#### 解析器之转义符

在 dockerfile 中默认转义符为反斜杠 \，若想修改转义符为反引号 ` ，可通过解析器指令修改：

```
# escape=`
```

由于默认的 \ 表示可以转义，如果用在命令行尾部，表示 换行连接符，实际构建过程中，会将下一行内容合并到本行。

什么情况下需要将 默认的 转义符 \ 修改为 ` ？

由于 \ 会转义，那么如果在 windows 系统上写路径时需要格外小心，因为路径中的 \ 很可能与预期执行的不一致。如果把 转义符修改为 `，那么此时 \ 就被解释为普通的字符，\ 不在具有转义功能，更加利于 windows 系统路径上的使用。

#### ENV(环境变量)设置

通过 ENV 来设置环境变量，内容采用 键值对 形式，其他命令行中可以使用 $xxx 或 ${xxx}来使用该变量。不仅构建过程中其他命令行可以使用，在容器中变量也有效可用。

定义形式有2种：

| 形式                    | 示例                          | 说明                                                         |
| ----------------------- | ----------------------------- | ------------------------------------------------------------ |
| ENV <key\> <value\>     | ENV  key value1 value2        | key为变量名，key 空格之后 所有的其他值都将成为 key 的值，<br />因此后面的值可以有空格、反斜杠等其他字符 |
| ENV <key\>=<value\> ... | ENV key1=“value1” key2=value2 | 允许设置多个变量，采用值键对形式(有2种形式 加引号或不加引号)，以空格进行间隔。<br />value1采用了双引号包裹字符串，value2没有使用双引号，<br />value2中可以使用 反斜杠来进行字符串转义 |

在 ${xxx} 形式中，还可以通过 :- 和 :+  修改返回(使用)值，遵循以下方式：

1. ${xxx:-newxxx} 对应的含义为：如果 xxx 有值，则使用 xxx，如果没有值则使用 newxxx
2. ${xxx:+newxxx} 对应的含义为：如果 xxx 有值，则使用 空字符串，如果没有值则使用 newxxx
3. 上面示例中的 newxxx 不仅可以是字符串，还可以是其他环境变量，例如：${xxx:+${newxxx}}

ENV 定义环境变量遵循以下原则：

1. 一行 ENV 可以定义多个环境变量
2. 可以有多行 ENV
3. 当前行内修改环境变量的值，本行内不会生效，只有到下一行后才会生效
4. 由于 \ 具有转义作用(默认转义符是 \，也可以修改为 ` )，因此 \\$xxx  将会被解释为 字符串 $xxx，而不是变量值

环境变量可以用于以下指令中：

| 环境变量            | 定义的变量可用于下列指令中                                   |
| ------------------- | ------------------------------------------------------------ |
| EVN keyxxx valuexxx | ADD、COPY、ENV、EXPOSE、FROM、LABEL、<br />STOPSIGNAL、USER、VOLUME、WORKDIR、ONBUILD |

#### ARG(指令变量)设置

通过 ARG 来定义指令变量，内容采用 键值对 形式，仅在构建过程的 FROM 中可以调用。

与环境变量的区别在于：

1. 指令变量必须出现在 FROM 指令之前
2. 指令变量只能用于 FROM 指令中、而环境变量则可以用在绝大多数指令和容器中

#### FROM(镜像文件引用)设置

通过 FROM 来定义镜像文件源，有以下几种形式：

| 形式                                   | 示例                         |
| -------------------------------------- | ---------------------------- |
| FROM <image\>                          | FROM nodejs                  |
| FROM <image\> [AS <name\>]             | FROM nodejs as mynode        |
| FROM <image\>[:<tag\>] [AS <name\>]    | FROM nodejs:latest as mynode |
| FROM <image\>[@<digest\>] [AS <name\>] | FROM nodejs@xxx as mynode    |

####  RUN(执行命令)设置

通过 RUN 在构建过程中执行 shell 语句。形式有以下2种：

| 形式                                   | 示例               |
| -------------------------------------- | ------------------ |
| RUN <command\>                         | RUN npm init       |
| RUN ["executable", "param1", "param2"] | RUN ["npm","init"] |

RUN 使用过过程中遵循以下原则：

1. 可以在 RUN 指令结尾处添加 \ ，相当于换行延续符，将下一行代码 合并到本行中
2. RUN 指令中若使用引号，必须是双引号，不能是单引号

#### CMD(容器启动执行命令)设置

通过 CMD 提供运行容器的默认方法。可以是执行脚本，或者是 指令参数，若不设置 CMD，则必须指定一个 ENTRYPOINT 指令。

CMD 形式有以下3种：

| 形式                                                      | 示例                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| CMD ["executable","param1","param2"]，推荐形式            | CMD ["node","app.js"]                                        |
| CMD ["param1","param2"]，作为ENTRYPOINT的默认参数         |                                                              |
| CMD command param1 param2，会以 /bin/sh -c 来执行该条命令 | CMD echo "hello world"，最终执行<br />/bin/sh -c "echo "hello world"" |

> CMD 中执行的 shell 命令是针对 容器，而不是针对 docker。
> 如果设置了多条 CMD，那么只有最后一条才会起作用。
> 示例中 -c 的含义是：读取该字符串(而非文件)，并作为命令执行

#### ENTRYPOINT(容器启动执行命令)设置

通过 ENTRYPOINT 设置容器运行启动时执行的命令，类似 CMD，CMD 还可以为 ENTRYPOINT 定义变量作为参数。

> 若 docker run 创建容器时，添加有参数 --entrypoint，则 ENTRYPOINT 的设置将会被覆盖

> 设置多条 ENTRYPOINT，仅仅只有最后一条会生效

ENTRYPOINT 形式为：

| 形式                                                      | 示例                      |
| --------------------------------------------------------- | ------------------------- |
| ENTRYPOINT ["<executeable\>","<param1\>","<param2\>",...] | ENTRYPOINT ["nginx","-c"] |

> "<executeable\>"为可执行命令或函数，"<param1\>" 为参数

#### LABEL(标签)设置

通过 LABEL 设置镜像文件的 label 标签。遵循以下原则：

1. 以键值对形式来设置
2. 为了可以出现空格，允许使用引号或反斜杠来进行转义
3. 允许有多条 LABEL 设置
4. 若一条 LBEL 结尾处 出现 \ ，则会将下一行代码 合并到本行中，相当于 跨行符

> 若要查看镜像文件的 label 标签(同时也是容器的 label 标签)，使用命令：docker inspect imagenamexxx

#### EXPOSE(端口和协议)设置

通过 EXPOSE 对外通知容器监听的网络端口和使用协议(TCP或UDP)，默认使用TCP协议 。

> 特别强调：对于端口而言 EXPOSE 仅仅是告知，并不是真正设置端口，真正容器所使用的端口是在 docker run 中 -p 参数来设置端口的。

> 可以同时添加多条 EXPOSE 设置。

#### ADD(添加文件)设置

通过 ADD 添加(复制)文件到镜像文件中，被添加(复制)的文件来源是本机资源或远程文件文件或目录，被接收的远程文件拥有600权限(rw-，可读、可写、不可执行)。

ADD 形式有以下2种：

| 形式                                                    | 示例                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------ |
| ADD [--chown=<user\>:<group\>] <src\>... <dest\>        | 添加单个文件到镜像文件中<br />src为文件源URL、dest为镜像文件中的路径 |
| ADD [--chown=<user\>:<group\>] ["<src\>",... "<dest\>"] | 通过数组，可以添加多个文件到镜像文件中，数组每一项均为一组src和dest |

补充说明：

1. src 的路径可以包含通配符  * ？！
2. [--chown=<user\>:<group\>] 为可选参数，且只在 Linux 系统下起作用，目的是改变文件属主(拥有者)
3. 如果远程文件有身份验证保护，那么 ADD 将无法顺序执行，只能使用 RUN wget 或 RUN curl

ADD 添加文件遵循以下原则：

| src路径类型                                         | 对应含义                                                     |
| --------------------------------------------------- | ------------------------------------------------------------ |
| 本地文件路径                                        | 复制该文件到镜像文件中                                       |
| 本地压缩文件路径(文件格式identidy、gzip、bzip2、xz) | 解压成一个目录，并将该目录复制到镜像文件中                   |
| 本地目录路径                                        |                                                              |
| URL文件地址(非 / 结尾)                              | 下载和复制该文件到镜像文件中                                 |
| URL压缩文件地址                                     | 下载，但不会被解压，效果与其他URL文件相同                    |
| URL目录地址(以 / 结尾)                              | 在镜像文件中创建URL中最后的目录，并将URL目录中的文件下载和赋值到镜像文件中<br />URL目录地址必须包含一个目录，例如http://example.com 并没有包含目录，这是无效的URL路径 |

| dest路径要求                                     | 补充                                        |
| ------------------------------------------------ | ------------------------------------------- |
| dest 是文件路径还是目录，必须和 src 执行结果对应 | src 为本地压缩文件时，dest 对应解压后的目录 |
| 如果 src 为多个资源，则 dest 必须为目录          |                                             |
| 若 dest 本身不存在，则会自动被创建               |                                             |

#### COPY(复制文件)设置

通过 COPY 从上下文目录(本地文件资源或远程URL)中复制文件或目录到容器指定路径里。

COPY 形式为：

| 形式                                                     | 示例 |
| -------------------------------------------------------- | ---- |
| COPY [--chown=<user\>:<group\>] <src\>... <dest\>        |      |
| COPY [--chown=<user\>:<group\>] ["<src\>",... "<dest\>"] |      |

> 形式和 ADD 一样，但是 COPY 仅执行文件复制

#### VOLUME(匿名数据卷)设置

通过 VOLUME 设置匿名数据卷，若启动容器时忘记挂载数据卷，则会自动挂载到匿名数据卷中。这样做的目的有：

1. 避免重要数据因为容器重启而丢失
2. 避免容器不断变大

VOLUME 形式为：

| 形式                               | 示例 |
| ---------------------------------- | ---- |
| VOLUME <path\>                     |      |
| VOLUME ["<path1\>", "<path2\>"...] |      |

> 容器启动时，可通过 -v 参数来修改挂载数据点

#### WORKDIR(工作目录)设置

通过 WORKDIR 来指定工作目录。

WORKDIR 形式：

| 形式           | 示例 |
| -------------- | ---- |
| WORKDIR <path> |      |

> 1. 指定的工作目录必须存在，若不存在并不会自动创建该目录
> 2. 每一个 RUN 命令都新建一层，只有 WORKDIR 创建的目录会一直存在

#### USER(用户)设置

通过 USER 指定执行后续命令的用户和用户组。

USER 形式为：

| 形式                       | 示例 |
| -------------------------- | ---- |
| USER <user>[:<user-group>] |      |

> 确保用户和用户组本身已存在
>
> 如果不指定，则默认使用 root 用户

#### HEALTHCHECK(监控运行状态)设置

通过 HEALTHCHECK 指定某个程序或命令来监控 docker 容器服务的运行状态。

HEALTHCHECK 形式为：

| 形式                          | 说明                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| HEALTHCHECK [选项] CMD <命令> | 设置检查容器健康状况的命令                                   |
| HEALTHCHECK NONE              | 如果基础镜像有健康检查指令，使用这行可以屏蔽掉其健康检查指令 |
| HEALTHCHECK [选项] CMD <命令> |                                                              |

#### ONBUILD(延迟构建命令的执行)设置

通过 ONBUILD 延迟构建命令的执行。简单来说就是本次构建时不会执行，但是当其他构建若使用到了本次镜像文件(其他 dockerfile 中 FROM 本镜像) ，则会执行。

ONBUILD 形式为：

| 形式               | 示例 |
| ------------------ | ---- |
| ONBUILD <其它指令> |      |

#### STOPSIGNAL(关闭信号)设置

通过 STOPSIGNAL 来指定当 Docker 要关闭容器前，发送的关闭信号。

默认关闭信号为 “SIGTERM”，通过 STOPSIGNAL 可以修改该值。

STOPSIGNAL 形式为：

| 形式              | 示例 |
| ----------------- | ---- |
| STOPSIGNAL signal |      |

> 当 Docker 要关闭容器前 发送关闭信号给 容器，目的是让容器可以先做一些处理，平滑退出。如果容器不做任何处理，则容器将在 10秒 后强制关闭退出。

#### SHELL(SHELL命令)设置

通过 SHELL 来执行 指定的 shell 命令。

SHELL 形式为：

| 形式                                              | 示例 |
| ------------------------------------------------- | ---- |
| SHELL ["executable", "parameters", "parameters2"] |      |



## .dockerignore文件相关

.dockerignore 用来配置不构建到镜像文件中的内容，遵循以下原则：

1. 可以使用 # 开头来作为注释，但必须处于 第1行
2. 可以使用 *、？、！ 来作为 正则表达式修饰作用，匹配相关路径
3. .dockerignore 文件必须和 dockerfile 文件在同一目录中



## 构建镜像文件相关

Docker build .  构建镜像文件是通过 Docker daemon (守护进程) 运行的，而不是 Docker 客户端。

默认 应该把 dockerfile 存放在要构建的项目根目录，如果不在要构建的项目根目录，则需要在构建时，通过添加 -f  /xx/xxx/dockerfile 参数，来指定 dockerfile 文件位置。

创建、构建镜像文件：docker build xxxxpath   这里的 xxxxpath 为项目根目录

> dockerfile 文件通常都保存在 项目根目录
> 若是当前目录，则可以使用 . 代替，即：docker build .

可以添加的参数有：

| 参数                          | 对应含义                                                     |
| ----------------------------- | ------------------------------------------------------------ |
| -t  xxx/xx  或  --tag  xxx/xx | 设置镜像文件保存到哪个镜像仓库和标签<br />可以同时设置多条 -t xxx/xx，即同时发布到多个镜像仓库中 |
| -f  xxx 或 --file  xxx        | 声明 dockerfile 所在的路径<br />如果不加该参数则从当前目录中查找 dockerfile |
| --catch-from                  | 允许使用非父链上的构建缓存，以加快构建过程<br />默认只能使用父链上的构建缓存 |



## 安装镜像相关

搜索镜像：docker search xxx

> 一定要从返回列表中，认真看清楚镜像的描述信息，最终选定安装哪个镜像文件

下载镜像：docker pull xxx ，其中 xxx 为 docker search xxx 中选定的结果名称

查看已安装的镜像：docker images  或  docker image ls

标记本地镜像，将其归入某一仓库：docker tat xxx xxx

导出镜像文件：docker save xxx > /xx/xxx.tar.gz

> 将镜像导出成压缩文件(相当于本地备份镜像)，`/xx/xxx.tar.gz` 为导出镜像文件的保存位置和文件名。
> 注意：导出命令执行完毕后并不会打印任何信息

导入镜像文件：docker load < /xx/xxx.tar.gz

> 注意：导出镜像文件使用 > ，导入镜像文件使用 <

删除镜像：docker rmi xxx

> 这里是指从 docker 已安装的镜像列表中删除 xxx 镜像，并不是从本机删出该镜像对应的导出 .tar.gz 文件

删除镜像时若报错误：unable to remove repository reference... container xxxxxxx is using its referenced image xxxx，这表示该镜像正在被 某容器 占用，即使该容器已经停止。

解决办法：若容器正在运行，则先停止该容器(docker stop containerxxxxxx)，然后删除该容器(docker rm containerxxxxxx)，再进行删除镜像(docker rmi imagexxxxxx)



## 发布镜像相关

登录镜像仓库：docker login

登出镜像仓库：docker logout

发布镜像：docker push username/xxx:xx.x

更新镜像：docker commit xxx-id  xxx-name:vx.x

> 上述更新镜像中代码中，xxx-id 为镜像ID，xxx-name 为镜像名，vx.x 为镜像版本(TAG)，若不填写vx.x则默认值为 latest

更新镜像中可以添加的参数：

| 参数 | 对应含义     |
| ---- | ------------ |
| -m   | 更新描述信息 |
| -a   | 更新作者     |



## 容器相关

查看容器：docker ps -x  “-x” 仅仅是示意，具体对应的参数请参加下表

上述命令中 -x 为参数：

| -x的值       | 对应含义                             |
| ------------ | ------------------------------------ |
| 不使用参数   | docker ps 显示当前活动中的容器       |
| -a           | 显示所有容器，包括未运行的(已停止的) |
| -f           | 根据条件过滤显示的内容               |
| --format     | 指定返回值的模板文件                 |
| -l (小写的L) | 显示最近创建的容器                   |
| -n           | 列出最近创建出的 n 个容器            |
| --no-trunc   | 不截断输出                           |
| -q           | 静默模式，只显示容器编号             |
| -s           | 显示总的文件大小                     |

暂停容器：docker pauser xxx

恢复容器：docker unpauser xxx

停止容器：docker stop xxx

重新开启容器：docker start -i xxx

删除容器：docker rm xxx  需要先 stop 容器，否则会删除失败

强制删除容器：docker rm  -f  xxx 即使容器正在运行，也会先 stop 然后再删除掉

查看容器底层信息(配置和运行状态)：docker inspect  xxx

进入某容器：docker exec xxx

导出容器快照：docker export xxx >  /xx/xxx.tar.gz

导入容器快照：docker import /xx/xxx.tar.gz (本地文件资源)  或  docker import https://xxx.com/xxx (网络资源)

查看容器端口：docker port xxx

查看容器内部运行程序：docker top xxx

查看镜像的创建历史信息：docker history xxx

查看容器内部文件结构更改：docker diff xxx

容器与宿主机之间拷贝文件：docker cp from-path-xxx  to-path-xxx

> from-path-xxx 是需要拷贝的文件或目录路径、to-path-xxx 是复制到的路径
> 宿主机文件系统直接使用常规路径，但是容器路径需要添加容器ID，
> 举例：docker cp /root/xxx  containidxxx:/root/xxx，将 宿主机中的 /root/xxx 拷贝到 容器ID 为 containidxxx 的/root/xxx中。

> 注意：源文件(或目录)路径 和 目标文件(或目录)路径 结尾处，是否包含 / 会直接影响拷贝结果
> 如果双方结尾处 都不包含 / ，则对应的含义是：直接对等拷贝
> 如果 一方结尾处有 /，而另外一方结尾处没有 /，则对应的含义是：拷贝到 xx/目录下面

阻塞运行直到容器停止：docker wait xxx

创建容器但不启动它：docker create imagexxx

> 语法同 docker run 相同，区别就在于只创建不启动

创建容器：docker run imagexxx  

> 注意这里的 imagexxx 为镜像，启动镜像会创建一个运行状态的容器
> 其他的 xxx 为容器

启动镜像时，可添加的参数：

| 参数             | 对应含义                                                     |
| ---------------- | ------------------------------------------------------------ |
| -it              | 启动成功后，显示容器命令操作界面<br />若不添加该参数，容器启动成功后则停留在主机操作界面、若添加则进入容器命令界面<br />退出容器命令操作界面，执行：exit ，由于未使用参数 -d，因此退出命令操作界面会让容器停止 |
| -itd             | 启动成功后，不显示容器命令操作界面，以后台形式运行<br />若想进入容器操作界面，执行：docker exec -itd xxx(容器名)<br />退出容器命令操作界面，执行：exit ，由于使用参数 -d，因此退出命令操作界面并不会让容器停止 |
| --name  xxx      | 给该容器起一个名字(ID)，若不添加该参数，则 docker 会随机产生一个字符串作为该容器名字(ID) |
| -p 9000:8080/tcp | 指定映射端口，9000为宿主机端口，8080为容器内部端口，<br />默认(不填时)使用协议为tcp，可修改为udp<br />可以有多组 -p xxxx:xxxx，设置多组端口映射关系<br />也可以添加上宿主机IP，-p 127.0.0.1:9000:8080 |
| -P               | 随机映射到宿主机某个端口(不推荐)                             |
| -v /aa/bb:/cc    | 映射目录，/aa/bb为宿主机目录，/cc为容器内部目录<br />通常情况下数据库文件一定是存放在宿主机目录里的，同 -p 一样，也可以设置多组目录映射关系 |
| --privileged     | 允许容器拥有操作宿主机中映射的目录最高权限(读/写执行)        |
| --net=xxx        | 其中 xxx 为网络模式<br />1、none：无网络<br />2、host：直接使用宿主机的网络配置<br />3、bridge：默认设置，会为每一个容器分配IP，通过虚拟网桥与宿主机通信<br />4、container:Name_or_ID，容器自己不配置网络，而是和指定容器共享同一个网络配置 |
| -d 或 --detach   | 在容器中，以后台模式运行                                     |

> 默认会先查找并启动本地资源中的镜像文件，如果本地找不到，则会尝试 从 DockerHub 下载该名称的镜像
> 若想直接从 仓库中下载，则使用 docker pull xxx:xx



## 容器互连

docker 有一个连接系统，可以将多个容器进项相互连接。

具体操作步骤如下：

第1步：新建一个 docker 网络

```
docker network create -d bridge test-net
```

> 上面代码中将新建的网络命名为 test-net

> 网络类型 -d 参数，可以设置值有：bridge、overlay

第2步：新建一个容器，并连接到 创建的网络中

```
docker run -itd --name test1 --network test-net image-name-xxx1
```

> 上面代码中，将容器名字命名为 test1，连接到 test-net 网络中，image-name-xxx1 为镜像文件名

> 第一个连接到该网络的容器，称为 父容器

第3步：再新建其他容器，并连接到 创建的网络中

```
docker run -itd --name test2 --network test-net image-name-xxx2
```

容器之间测试连接：可以在容器中使用 ping 命令 去连接另外一个容器，例如在 test1 中执行 ping test2。

> 如果容器过多，还是推荐使用 Docker Compose 来管理这些容器。

