# code-server安装与使用

通过浏览器可以在任意电脑上使用 VSCode 了。



## code-server简介

code-server 是安装在服务器端，高仿 VSCode 的一款应用程序。

服务器端安装成功后，可以使用浏览器访问线上地址，获得与本地 VSCode 相似的开发界面。

> 说直白一点就是浏览器版的 VScode，让你何时何地都可以写、调试代码



code-server 官网：https://coder.com/

code-server 项目地址：https://github.com/cdr/code-server



## code-server安装

> code-server 目前最新版本为 3.9.0

有非常多种 安装运行 code-server 的方式，可以查阅官方提供的安装指南：

https://github.com/cdr/code-server/blob/v3.8.1/docs/install.md

安装的方式有：yarn、npm、docker、install.sh 脚本安装等。

由于服务器端多数都是 Linux 系统，所以本文只讲解在 CentOS7 上如何安装。

> 若服务端是 Windows，那么我推荐你使用 yarn、npm、docker



**我的服务器是腾讯云 CentOS7。**



**最开始我尝试使用官方提供的 Docker 安装方式，但是 docker 容器一启动就关闭。**

```
mkdir -p ~/.config
docker run -it --name code-server -p 127.0.0.1:8080:8080 \
  -v "$HOME/.config:/home/coder/.config" \
  -v "$PWD:/home/coder/project" \
  -u "$(id -u):$(id -g)" \
  -e "DOCKER_USER=$USER" \
  codercom/code-server:latest
```

> 我也不清楚哪里出问题， 最终我选择放弃 Docker 这种方式。



我也尝试使用 Docker-Compose 启动，也是失败。

```
# code-server 配置
version: '3.8'
services:
    code-server:
        image: codercom/code-server:3.9.0
        container_name: code-server
        command: mkdir -p ~/.config
        environment: 
            - DOCKER_USER=root
            - PASSWORD=xxxxxx
            - auth=password
        volumes: 
            - /root/coder/.config:/root/coder/.config
            - /root/coder/project:/root/coder/project
        ports: 
            - 8120:8080
        restart: always
```

> 如果你知道我错在哪里了，请告诉我。

<br/>



#### 最后，我选择使用 rpm 方式安装，并且安装成功。

接下来我将详细讲解安装步骤。

#### 第1步：下载获取 rpm 程序包

打开 code-server 最新版本介绍页，当前最新版本为 3.9.0：

https://github.com/cdr/code-server/releases/tag/v3.9.0

找到最新 rpm 包下载地址：

https://github.com/cdr/code-server/releases/download/v3.9.0/code-server-3.9.0-amd64.rpm



下载该 rpm 文件到服务器某程序目录。

> 我本人习惯是将安装程序放到 /software 中

下载方式有 2 种：

1. 使用 curl 命令方式下载

   ```
   curl -fOL https://github.com/cdr/code-server/releases/download/v3.9.0/code-server-3.9.0-amd64.rpm
   ```

2. 在客户端下载 rpm 文件，然后通过 xftp 工具上传到服务器中



#### 第2步：执行安装

```
dpkg -i code-server_3.9.0_amd64.deb
systemctl enable --now code-server@$USER
```

执行完成后，你可能会看到以下输出信息：

```
[rootxxxxxxxxxxx]# systemctl enable --now code-server@$USER
Created symlink from /etc/systemd/system/default.target.wants/code-server@root.service to /usr/lib/systemd/system/code-server@.service.
```

这表明已安装成功，但是此时 code-server 还并未真正可以使用，我们还需修改配置文件。



#### 第3步：修改配置文件

默认 code-server 的配置文件位于：

```
~/.config/code-server/config.yaml
```

> 特别提醒：
>
> 1. 假设目录名以 . 开头，在 xftp 中是无法直接查看该目录的
> 2. 但是是可以通过 shell 命令查看到
> 3. 若想在 xftp 中访问该目录，则需要在 xftp 目录路径中手工输入该地址，即可查看到该目录下的文件内容

> 我实在不习惯使用 vim 在线编辑文档，所以我采用的是将 config.yaml 文件下载到本机，修改内容后再上传替换。

我们可以看到 config.yaml 默认的内容为：

```
bind-addr: 127.0.0.1:8080
auth: password
password: b0sdfsfasdfasdf34242
cert: false
```

1. bind-addr: 127.0.0.1:8080：由于服务器端 8080 端口通常会被占用，所以我们需要修改成特定的端口，例如 8120
2. password: b0sdfsas....：这一行是 code-server 默认帮我们设定的密码，我们可以修改成自己的密码，例如 myxxxxx

最终我们可以将内容修改为：

```
bind-addr: 127.0.0.1:8120
auth: password
password: myxxxxx
cert: false
```

然后将 config.yaml 上传替换 之前的文件。



#### 第4步：重启 code-server

```
systemctl restart code-server@$USER
```

重启之后，我们刚才修改的端口和密码就可以生效了。

但是此时 code-server 仅仅可以在服务端 127.0.0.1:8120 访问，我们需要通过添加 Nginx 配置，设置反向代理，让客户端(外网)也可以访问。



#### 补充：管理 code-server

关闭，停止 code-server：

```
systemctl stop code-server@$USER
```

启动 code-server：

```
systemctl start code-server@USER
```



## 添加Nginx配置

#### 我们需要做的事情：

1. 添加域名解析到服务器，例如 xxx.xxxxx.com
2. 申请免费的 https 证书，实现 https
3. 添加对应的 配置文件，反向代理本地 127.0.0.1:8120 端口
4. 执行 nginx -s reload，让新添加的配置生效。

上述具体的 Nginx 相关操作，可参考我的另外一篇文章 [Nginx学习笔记.md](https://github.com/puxiao/notes/blob/master/Nginx%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)

这里重点讲解一下配置文件中的一点注意事项。



#### 配置文件示例：

```
#------xxx.xxxxx.com------

#HTTP server
server {
    listen 80;
    server_name xxx.xxxxx.com;
    return 301 https://$host$request_uri;
}

#HTTPS server
server {
    listen       443 ssl;
    server_name  xxx.xxxxx.com;

    ssl_certificate      ./ssl/1_code.puxiao.com_bundle.crt;
    ssl_certificate_key  ./ssl/2_code.puxiao.com.key;

    ssl_session_cache    shared:SSL:1m;
    ssl_session_timeout  5m;

    ssl_ciphers  ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers  on;

    location / {
        proxy_pass http://127.0.0.1:8120;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
    }
}
```

请注意上面配置中，关于反向代理的特殊设置。

```
location / {
        proxy_pass http://127.0.0.1:8120;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection upgrade;
    }
```

每一项都要添加，这样才可以保证浏览器访问时，页面可以显示正常。

> 由于 code-server 使用到了 websocket，所以必须添加 proxy_set_header、proxy_set_header、proxy_set_header



当该配置文件生效后，前端浏览器访问 xxx.xxxxx.com 即可看到。

> 第一次打开该页面，需要你输入 config.yaml 当时配置的密码



## 其他安装

对于前端开发者来说，为了顺利正确使用 code-server，还需要提前在服务端安装好相关的其他软件：

1. nodejs
2. npm
3. yarn

如何安装上述程序，请参考我的另外文章：

[CentOS安装Nodejs.md](https://github.com/puxiao/notes/blob/master/CentOS%E5%AE%89%E8%A3%85Nodejs.md)、[NPM常用命令.md](https://github.com/puxiao/notes/blob/master/NPM%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4.md)、[Yarn安装与使用.md](https://github.com/puxiao/notes/blob/master/Yarn%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md)



## 注意事项

#### 调试脚本

默认 code-server 使用的是 sh，即 /bin/sh，这个命令工具可能无法调用某些程序。

例如我在服务端已经安装好了 yarn，但是在浏览器端一直提示找不到 yarn 程序。

> 我甚至在服务端尝试重启 code-server，重启之后依然不管用

所以我建议修改 code-server 的脚本工具，将 sh 修改为 bash，即 /bin/bash。

**修改方式：**

1. 第1步：打开命令工具，快键键和本机 VSCode 一模一样：ctrl + `

2. 第2步：点击命令工具选择框，点击 “Select Default Shell”

3. 第3步：在弹出的选择框中，点击 “bash  /bin/bash”

4. 第4步：刷新当前浏览器

   > 经过测试，只有刷新浏览器后，刚才的设置才会真正生效。

修改之后，使用 bash 命令工具就可以找到 yarn 了。



#### 关于调试

在本机 VSCode 执行 `yarn start` 或 `npm run start` 时，默认会创建并弹出调试地址：

http://localhost:3000/

在 code-server 执行调试后测试地址依然是 http://localhost:3000/ ，而我们在客户端是没法访问服务器的 http://localhost:3000/

因此为了解决这个问题，还需要额外通过 Nginx 配置一个 3000 端口供外网访问。

或者为了省事，直接通过服务器 IP 来访问调试地址。

例如服务器 IP 为：106.54.232.192，那么对应调试地址：http://106.54.232.192:3000/



**注意记得关闭调试**

假设你在浏览器中执行了调试，服务器已经创建了 http://localhost:3000/，而此后你并没有主动执行关闭调试，即使你关闭了浏览器，服务器中会依然一直运行着 http://localhost:3000/。

因此切记一定要主动关闭调试。

如果你真的忘记关闭调试，那么当你再次执行调试 yarn start 时就会提示 3000 端口已经被占用，是否启用新的端口。

若真的发生这样的事情，可以通过以下方式关闭之前遗留的调试：

1. 查看服务器网络简要信息：

   ```
   netstat -netlp
   ```

2. 找到 3000 端口对应的 PID 数字，假设为 7397，然后关闭这个进程

   ```
   kill -9 7393
   ```

   > 注意：是 kill 而不是 killall
