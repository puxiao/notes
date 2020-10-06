# Docker-Compose安装与使用

## 为何要使用Docker-Compose？

默认情况下，docker 每次执行命令，只能负责单个镜像文件的构建、单个容器的管理，但一个实际应用程序中，可能需要同时运行多个容器一起工作，例如 Web后端项目通常需要：Koa + MongoDB，并且两个容器之间进行通信，此时若继续使用 docker 来运行管理则相对显得复杂繁琐一些。

Docker-Compose 就是专门用来管理多个 docker 容器的工具，它弥补了 docker 不易管理多容器的缺陷，提高协助 docker 做好运维工作。

事实上，比 Docker-Compose 更加灵活，功能更强大的程序是 k8s (Kubernetes)。相信日后一定会学习 k8s 的，但是暂时先学习使用 Docker-Compose。



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

在上面安装示例代码中，都是默认将 docker-compose 安装到 ``/usr/local/bin/` 中，但事实是可以修改为其他任意目录中的。