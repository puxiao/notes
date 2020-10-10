# Docker-Compose安装与使用

## 为何要使用Docker-Compose？

默认情况下，docker 每次执行命令，只能负责单个镜像文件的构建、单个容器的管理，但一个实际应用程序中，可能需要同时运行多个容器一起工作，例如 Web后端项目通常需要：Koa + MongoDB，并且两个容器之间进行通信，此时若继续使用 docker 来运行管理则相对显得复杂繁琐一些。

Docker-Compose 就是专门用来管理多个 docker 容器的工具，它弥补了 docker 不易管理多容器的缺陷，提高协助 docker 做好运维工作。

事实上，比 Docker-Compose 更加灵活，功能更强大、对集群、负载平衡更好的程序是 k8s (Kubernetes)。相信日后一定会学习 k8s 的，但是暂时先学习使用 Docker-Compose。



## 安装与卸载

Docker Compose 是在 Docker 基础上运行的，因此在安装 Docker Compose 之前请确保已安装了 docker 。

### 安装 Docker-Compose

Windows系统：Docker-Compose 已默认集成在 Docker Desktop 版本中，因此无需额外安装。

Linux系统：本质上 Docker-Compose 是一个独立的可运行文件，因此只需要下载，并赋予可执行权限即可。

**第1步：下载**

下载地址：https://github.com/docker/compose/releases

下载方式1：直接通过浏览器访问，找到合适自己的的版本文件，下载，然后通过 xftp 上传到服务器中。

下载方式2：使用 curl 命令请求并保存文件

```
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

> 上述 curl  命令解释：
>
> 1. -L 表明若目标网址发生重定向，则返回重定向后的 URL 内容
> 2. 请求网址中，使用了 Linux 中的 uname 命令，`uname -s` 得到操作系统名称(例如：Linux)，`uname -m` 得到电脑硬件类型(例如：x86_64)，本人的服务器为腾讯云服务器，所以上述 URL 最终得到的值是`https://github.com/docker/compose/releases/download/1.27.4/docker-compose-Linux-x86_64`
> 3. -o /usr/local/bin/docker-compose 表明将目标内容保存为指定的本地目标文件。`/usr/local/bin/docker-compose` 意味着将请求返回的内容保存到`/usr/local/bin/`目录中 ，并且文件名命名为`docker-compose`

**第2步：赋予可执行权限**

```
chmod +x /usr/local/bin/docker-compose
```

**第3步：创建软连接**

```
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

**第4步：检查是否可执行**

```
docker-compose --version
```

> 若正确输出 docker-compose 版本号即表示可以正常执行。

**强调说明：**

在上面安装示例代码中，都是默认将 docker-compose 安装到 `/usr/local/bin/` 中，但事实是可以修改为其他任意目录中的。



### 卸载 Docker-Compose

直接删除 docker-compose 文件即可：

```
rm /usr/local/bin/docker-compose
```

若之前创建有软连接，记得也要删除：

```
rm -rf /usr/local/bin/docker-compose
```



## Docker-Compose配置文件

### 配置文件简介

dockerfile 是负责构建某一个镜像文件的配置文件，而 docker-compose.yml 则是用来配置 Docker-Compose 启动运行配置的。

> 也可以将配置文件名更改为：docker-compose.yaml，文件后缀名 .yml 或 .yaml 都可以。

> .yml 是 YAML 格式文件后缀，与XML形式不同，YAML 主要遵循以下几个书写原则：
>
> 1. YAML文件内容以空格来进行缩进，以表达层级关系
> 2. 值键对使用 参数名+冒号+1个空格+参数值 的形式。
> 3. 在 YAML 中字母是区分大小写的
> 4. 关于 YAML 相关使用规则，请参阅 [YAML学习笔记](https://github.com/puxiao/notes/blob/master/YAML%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)

### 文件内容格式

docker-compose.yml 文件内容结构，大致为 3 个部分：版本声明、启动服务(容器列表)、创建网络列表

```
version: '3'

services:
  xxx01:
    xx: xxx
    xx: xxx
  xxx02:
    xx: xxx
    xx: xxx
    
networks:
  default:
    driver:xxx
  frontend:
    name:xxx
    driver:xxx
  backend:
    name:xxx
    driver:xxx
```

##### 第1部分：配置文件版本声明

文档最开始声明的 `version: '3'` 是用来告诉 docker-compose 应该以哪种版本来解析运行此配置文件的。

docker-compose.yml 版本对应 的 docker 版本号

| version: 'xxx' | 对应 docker engine 版本号 |
| -------------- | ------------------------- |
| 3.8            | 19.03.0+                  |
| 3.7            | 18.06.0+                  |
| 3.6            | 18.02.0+                  |
| 3.5            | 17.12.0+                  |
| 3.4            | 17.09.0+                  |
| 3.3            | 17.06.0+                  |
| 3.2            | 17.04.0+                  |
| 3.1            | 1.13.1+                   |
| 3.0            | 1.13.0+                   |

根据 docker engine 的不同版本，更加精准的是应该填写 3.6、3.7、3.8 等值，但是通常不需要精准到小数点后一位，简单写成 '3' 即可。



##### 第2部分：启动服务(容器列表)

文档中 `services` 即 docker-compose 要运行的多个服务内容(多个容器)，每个服务(容器)依次对应自定义的容器名字和该容器具体配置项。

> 在上面的示例中，容器名字定义为 xxx01、xxx02，在实际中应该定义成更加容易理解的字面意思，例如 web、db、cache 等。



##### 第3部分：创建网络列表

文档中 `networks` 即 docker-compose 要创建的网络列表。若没有该项，则默认启动 1个 网络，默认名字为 default 。

若 docker-compose 需要运行多个网络，则可以多次定义 networks 中的值。

若 要修改默认网络相关配置，则在 networks 中添加 default 的相关配置。



> 以下补充内容未经实际测试，所以不保证一定正确

**关于 docker-compose 创建的网络补充说明：**

docker-compose 默认的网络模式为 bridge，在这个模式下 创建一个 docker 网卡，宿主机分配到的 IP 为：172.17.0.1，然后 docker-compose 中运行的服务(容器)，依次对应的IP为：172.17.0.2、172.17.0.3...

然后 服务(容器) 之间就靠着 同一网段 不同 IP 来进行通信，docker-compose 与宿主机通过创建的 docker 网卡 转发(不同端口之间的转发)进行通信。

> 如果添加 docker-compose 网络配置，不使用 bridge 模式，而是使用 host (宿主机网络) 模式，则不会有上面的内容。



**如何查看容器内部运行的网卡和IP**

1. 进入容器中：docker exec -it xxx bash
2. 容器中不能使用 netstat 或 ipconfig 命令，只能通过查看 host 配置文件来查看



### 服务(容器)配置参数

在配置文件中，services 下面每一个服务(容器)都需要根据需求添加对应的设置，docker-compose 中每一个服务(容器)的参数和 dockerfile 相似，但又有不同。

> 为了更加容易理解，下面内容中将 `服务` 都以 `容器` 这个词来替代。

每一个服务，即每一个容器，具体设置参数如下：

| 参数名         | 值类型 | 对应含义                                                     |
| -------------- | ------ | ------------------------------------------------------------ |
| build          | 字符串 | 构建镜像的 dockerfile 文件路径<br />(通常情况下不要这样操作，而是通过 image 参数指定镜像名) |
| image          | 字符串 | 镜像文件名<br />(通常情况下直接使用镜像名，而不使用 build 参数构建镜像) |
| container_name | 字符串 | 创建容器的名字                                               |
| working_dir    | 字符串 | 容器中的工作根目录                                           |
| volumes        | 数组   | 服务器实际目录与容器目录映射关系，可以设置多条映射关系<br />(服务器实际目录:容器虚拟目录) |
| ports          | 数组   | 服务器端口与容器内部端口映射关系，可设置多条映射关系<br />(服务器实际端口:容器虚拟端口) |
| depends_on     | 数组   | 本容器运行依赖的其他容器<br />docker-compose 会优先启动运行依赖的容器，之后再启动本容器<br />例如 web 容器依赖于数据库(db)容器，因此先启动 db 容器，再启动 web 容器 |
| tty            | 布尔值 | 表明是否以后台运行                                           |
| command        | 字符串 | 执行的命令                                                   |
| restart        | 字符串 | docker-compose 重启时，容器是否也跟着重启，通常会设置值为：always<br />(注意是 docker-compose restart，而不是 docker-compose up) |
| environment    | 数组   | 环境变量(数组中每个元素都为 key=value，这些变量是给容器使用的，并且优先级高于在 dockerfile 中定义的变量) |
| env_file       | 数组   | 配置变量的文件列表(env文件中定义的变量是给 docker-compose.yml 使用的) |



### 多个配置文件

就好像 webpack 这样的配置设置一样，docker-compose  也支持定义多个配置文件，通常可以定义：基础环境、调试环境、生产环境，然后可以根据当前的实际需求，进行：基础环境 + 调试环境、基础环境 + 生产环境

无论调用 配置文件的哪种形式，都支持添加多个 配置文件。例如：

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml -up -d
```



### 配置文件使用继承

假设之前定义过一个配置文件 common-services.yml，其中该配置文件代码片段为：

```
services:
  webapp:
    image: 'puxiao'
    ports:
      - '8000:8000'
    volumes:
      - '/data'
```

此时再新建另外一个配置文件 docker-compose.yml，在该文件中，可以通过 extends 关键词来实现对 docker-services.yml 中 webapp 的继承(相当于复制并粘贴进来)，示例代码：

```
web:
  extends:
    file: common-services.yml
    service:webapp
```

使用 extends 关键词，继承自 common-services.yml 文件中的 service 中的 webapp，那么最终 docker-compose.yml 中 web 实际上的值等同于 common-services.yml 中的 webapp。



## 环境变量声明

在编写 docker-compose.yml 文件内容时，若某些值将来可能出现频繁修改，或 该值被多次使用，那么都可以将该值不写死在 docker-compose.yml 中，而是将该值作为引用变量的形式来使用，env-file 就是用来定义和存放 这些变量的文件。

#### 调用 env 文件的3种方式

**第1种：使用 --env-file 参数**

可以自己定义 env-file 文件名，然后在 docker-compose 执行命令配置选项中，--env-file PATH 配置 env-file 路径。

**第2种：使用 env_file 配置项**

在 docker-compose.yml  services 中的某个容器中，设置 env_file 属性，并设置正确的值。

```
web:
  env_file:
    - web-variables.env
```

**第3种：使用 .env 文件**

最简单直接的办法，就是在 docker-compose.yml 同级目录中创建 .env 的文件，docker-compose 会自动找到并使用该文件。

> 对于同一个变量名，以上方式的优先级是：--env-file > env_file > .env



#### .env变量格式

环境变量 .env 文件中，对于定义变量的格式，遵循以下几个原则：

1. 每一个变量占一行，形式为：key=value
2. #开头即表示该行为注释
3. 空行会被忽略
4. 引号并不会被处理，因此若 key 或 value 中有引号，则意味着该引号其实是 key 或 value 本身的内容
5. 为了明确区分出引用变量，通常会在定义变量的时候，采用全大写字母的形式

以下为 .env 一个简单示例：

```
#环境变量配置，推荐将变量名使用全大写字母形式
NAME=puxiao
AGE=34
```

> 在 docker-compose.yml 中引用 NAME 的形式和 JavaScript 中字符串模板的用法一样，采用 ${NAME} 的形式



## Docker-Compose命令

#### 命令格式

docker-compose 命令格式为：docker-compose  [-f <arg\>]  [options] [COMMAND] [ARGS]

>[-f <arg\>]：配置文件(docker-compose.yml)路径，也可以在 [options] 中设置，若都不设置则默认为当前目录下的 docker-compose.yml
>
>[options]：其他配置选项
>
>[COMMAND]：命令
>
>[ARGS]：命令的参数



#### 配置项

| 配置项                | 对应值     | 对应含义                                                     |
| --------------------- | ---------- | ------------------------------------------------------------ |
| -f \| --file          | 路径       | 配置文件路径，默认为当前目录下的 docker-compose.yml          |
| -p \| --project-name  | 名称       | 配置项目别名，默认为当前目录名                               |
| -c \| --context       | 名称       | 配置内容名称                                                 |
| --verbose             | 不需要设置 | 显示更多输出内容(详细细节)                                   |
| --log-level           | 5选1       | 配置日志的级别，值为：<br />DEBUG(调试)、INFO(信息)、WARNING(警告)、ERROR(错误)、CRITICAL(严重) |
| --no-ansi             | 不需要设置 | 不打印显示 ANSI 字符                                         |
| -v \| --version       | 不需要设置 | 打印当前 docker-compose 版本并退出                           |
| -H \| --host          | host值     | 守护进程 docket 连接的 host                                  |
| --tls                 | 不需要设置 | 使用 TLS 协议 (安全传输层协议)，参数 --tlsverify 默认会设置该值 |
| --tlscacert           | 路径       | 仅相信由此 CA 签署的证书                                     |
| --tlscert             | 路径       | TLS 证书路径                                                 |
| --tlskey              | 路径       | TLS 证书key 路径                                             |
| --tlsverify           | 不需要设置 | 使用 TLS 并验证远程                                          |
| --skip-hostname-check | 不需要设置 | 跳过证书检查                                                 |
| --project-directory   | 路径       | 配置目录的别名，默认使用 docker-compose.yml 所在的目录名     |
| --compatibility       | 不需要设置 | 如果设置该项，则将尝试将 配置文件中的 deploy 秘钥转化为他们的非swarm 等价项 |
| --env-file            | 路径       | 配置环境参数(定义的环境变量)文件路径                         |



#### 全部命令

| 命令    | 对应含义                                                     |
| ------- | ------------------------------------------------------------ |
| build   | 构建或重建服务                                               |
| bundle  | 从 配置文件(docker-compose.yml) 生成多个容器(容器束)         |
| config  | 验证和查看配置文档                                           |
| create  | 创建服务                                                     |
| down    | 停止并删除容器、网络、镜像、映射关系                         |
| events  | 从容器接收实时事件                                           |
| exec    | 在正在运行的容器中执行命令                                   |
| help    | 获得命令帮助                                                 |
| images  | 查看镜像列表                                                 |
| kill    | 杀死容器                                                     |
| logs    | 查看容器的输出内容                                           |
| pause   | 暂停服务                                                     |
| port    | 查看内部端口映射的本机端口                                   |
| ps      | 查看容器列表                                                 |
| pull    | 拉取镜像                                                     |
| push    | 推送镜像                                                     |
| restart | 重启服务                                                     |
| rm      | 移除已停止的容器                                             |
| run     | 执行一次性命令                                               |
| scale   | 设置容器数量                                                 |
| start   | 启动服务                                                     |
| stop    | 停止服务                                                     |
| unpause | 显示正在运行的容器(非暂停容器)                               |
| up      | 创建并启动容器                                               |
| version | 显示 docker-compose 版本号，以及 docker-compose 依赖其他模块的版本号<br />(docker-compose -v 仅打印 docker-compose 的版本号) |

> 可以通过 https://docs.docker.com/compose/reference/overview/ 查看每一个命令对应的不同参数

为了运行方便，通常情况下都不会每次手工书写这么多参数，而是会选择把需要的各个参数都写入到 docker-compose.yml 中，然后仅执行：docker-compose -f xxx up

> 就好像我们启动 mongodb 服务时，通常会将配置参数写入到 mongod.conf 文件中，然后以该文件为启动配置项：mongod -f mongod.conf



## 常用命令示例

#### 创建并启动容器：up

通过 -f 来指定 docker-compose.yml 文件路径，通过 -d 来设置以后台模式运行

```
docker-compose -f xxxx.yml up -d
```

若当前已经进入保存 docker-compose.yml 文件的目录，则上述命令还可以简化为：

```
docker-compose up -d
```



#### 进入某容器：exec

当执行完创建并启动容器后，可以通过 `docker-compose ps` 或 `docker ps`来查看正在运行的容器列表。

假设某容器的名字为 mymongo，那么如果想进入该容器，则执行：

```
docker exec -it mymongo bash
```

> 1. 请注意上面代码中是 docker 而不是 docker-compose
> 2. `-it` 的意思是：显示命令交互界面
> 3. `bash` 的意思是：以 bash(shell 命令) 方式进行交互
> 4. 退出该容器，执行：exit
