# Nginx学习笔记

## 安装

#### 安装方式 一：通过yum安装

CentOS安装Nginx：yum install nginx -y



<br>

#### 请注意：  

Nginx默认配置文件位置：/etc/nginx/nginx.conf  
配置文件中，默认网站文件目录：/usr/share/nginx/html



<br>

#### 安装方式 二：手工下载，编译，配置，安装

访问Nginx官网：http://nginx.org/en/download.html ，在 “Stable version” 中找到最新稳定版下载地址。

以下操作，均通过shell命令进行。

    下载：wget https://nginx.org/download/nginx-1.18.0.tar.gz  
    解压：tar -zxvf nginx-1.18.0.tar.gz  
    进入：cd nginx-1.18.0  


以下可选或忽略：  

    此时可以查看一些配置文件，或跳过这一步  
    查看目录(可选)：ll  
    查看默认安装配置文件(可选)：vim configure  
    若无修改可忽略，回到nginx-1.18.0目录  

继续下面操作：  

    生成中间文件：./configure --prefix=/software/nginx --with-http_ssl_module  
    参数说明：
    1、--prefix为你要设定的安装目录，我这里将安装目录设定为/software/nginx  
    2、--with-http_ssl_module 表明安装 http_ssl_module 模块，只有安装这个模块将来 Nginx 才可以开启 https 服务
    
    若生成失败，可能是没有编译工具，则需要你先安装 pcre-devel 和 openssl-devel，
    安装代码为：yum -y install pcre-devel openssl openssl-devel  
    安装成功后，再执行一遍刚才生成中间文件代码：./configure --prefix=/software/nginx  
    
    执行make编译：make  
    
    如果不报错，执行结束，会把编译成功的文件存放在 /nginx-1.18.0/objs  
    
    执行安装：make install  


如果不报错，执行结束，至此安装成功。  

查看是否已成功安装：  

    可以在任何目录内运行：/software/nginx/sbin/nginx -v  
    或者在/software/nginx/sbin/目录下，执行：./nginx -v  
    
    每次的都要输入那么长的目录不方便，我们可以创建软连接，让在任何目录里都可以直接使用nginx。  
    创建nginx软连接：ln -s /software/nginx/sbin/nginx /usr/local/bin/nginx  
    假设某天想删除这个软连接：rm -rf /usr/local/bin/nginx  


关于安装目录下的4个文件夹说明：

    Nginx被安装到我们之前指定的目录/software/nginx中，目录下只有4个文件夹：conf  html  logs sbin。  
    conf 存放配置文件  
    html 存放默认index和40x错误页  
    logs 存放日志  
    sbin Nginx核心运行代码  


以下是未填的坑：  

    由于自己编译安装的程序默认是不会自动生成xxx.server服务，所以需要我们手工配置。  
    1、无法开机自动启动 Nginx 服务  
    2、无法使用systemctl xxx nginx 命令来操作  



<br>

## 卸载

卸载默认yum安装的Nginx：

    service nginx stop
    chkconfig nginx off
    rm -rf /usr/sbin/nginx
    rm -rf /etc/nginx
    rm -rf /etc/init.d/nginx
    yum remove nginx

如果是自己手工编译安装的，需要找到对应的目录进行删除。



<br>

## 系统控制

使用系统命令控制nginx：  

开启nginx：systemctl start nginx  
关闭nginx：systemctl stop nginx  
重启nginx：systemctl restart nginx  
查看状态：systemctl status nginx  

查看系统当前各软件占用端口情况：netstat -ntlp  
查看当前系统中Nginx的进程信息：ps -ef|grep nginx  
终止nginx某个进程：kill -9 pid   pid为该进程在运行ps -ef 中对应的pid  
终止nginx全部进程：killall -9 nginx  



<br>

## Nginx命令

开启nginx：nginx -c /software/nginx/conf/nginx.conf

发出信号：-s  
停止服务：nginx -s stop  
优雅的停止服务：nginx -s quit  
重载配置文件：nginx -s reload  
重新开始记录日志文件：nginx -s reopen  

指定配置文件：-c  
指定配置命令：-g  
指定运行目录：-p  
获取帮助:-h 或 -?  
测试配置文件：-t
测试并展开配置文件详情：-T  
查看版本号：-v  
查看编译信息(配置)：-V  



<br>

## 配置

特别提醒：在设置属性值时，结尾处一定要添加英文分号 “;”。 如果某处结尾没有添加 ; 在 nginx -t 时会报错误：nginx: [emerg] unexpected "}" in /software/nginx/conf/nginx.conf  

<br>

### 全局配置

打开配置文件(nginx/conf/nginx.conf)，使用默认或者修改以下属性值：

````
user nginx;
#服务器是几核处理器，就将worker_processes设置为几
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

pid  logs/nginx.pid;

#include /usr/share/nginx/modules/*.conf;

#根据服务器性能，设置并发数
events {
    worker_connections  1024;
}
````



<br>

### http配置

打开配置文件(nginx/conf/nginx.conf)，使用默认或者修改 http{} 中的属性值：

````
http {
    #引入不同格式文件对应的Content-Type配置
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;
    types_hash_max_size 2048;

    #开启gzip压缩，并且配置压缩级别，以及都哪些格式的文件才会被压缩
    #由于jpg图片已经是压缩图片，所以没有必要再进行gzip压缩，因此gzip_types中没有包含jpg文件类型
    gzip  on;
    gzip_min_length 1;
    gzip_comp_level 2;
    gzip_types text/plain test/html test/css application/x-javascript application/xml test/javascript image/gif image/png;
    
    server{
    
    }
}
````



<br>

### server配置

打开配置文件(nginx/conf/nginx.conf)，在http {} 中添加多份server来创建多个站点服务，每一个server配置对应一个站点服务。  



<br>

#### 添加server的2种方式

1. 第1种方式：直接在 nginx.conf 中的 http{} 创建一份 server (可通过 复制/粘贴/修改 默认自带的server示例代码)

   ````
   http{
       ...
       server{
       ...
       }
   }
   ````

2. 第2种方式：先外部编写好 xxx.conf 配置文件，在 nginx.conf 的 http{} 中代码引入该配置文件：

   ````
   include xxx.conf;
   ````



“一个站点”即一个完整域名(二级域名+主域名)，例如 `www.xxx.com` 和 `api.xxx.com` 相当于2个站点。  
由于服务器上可能存在多个站点，为了避免配置文件存放混乱，给以下几条建议：  

1. 每一个站点对应一个自定义配置文件，建议将配置文件命名为：“二级域名 + 主域名 + nginx.conf”，例如`www.xxx.com.nginx.conf` ，方便直观区分。

>    补充：如果某主域名下对应的二级域名不多，也可以把该主域名下所有需要解析的二级域名都放在同一个配置文件中，nginx并没有要求限定一个配置文件中server的数量，具体如何创建全看个人习惯。

2. 在 nginx/conf/ 中创建一个目录，专门用来存放所有自定义配置文件，例如 `nginx/conf/myconf/`，那么此时 nginx.conf 中导入该配置文件的代码对应为 `include ./myconf/www.xxx.com.nginx.conf;`



<br>

#### 通过listen来配置监听端口和服务

1. 若配置http服务，默认端口 80，对应配置代码：

   ````
   listen 80;
   ````

2. 若配置https服务，默认端口443，对应配置代码：

   ````
   listen 443 ssl;
   ````

> 注意：并不是把 listen 配置成 `443 ssl` 就可以开启 https 服务的，还需要做其他配置，具体如何配置会在本文后面章节中讲述。



<br>

#### 通过server_name来配置域名

1. 若只有一个域名，对应代码：

   ````
   server_name api.xxx.com;
   ````

2. 若同时添加多个域名，每个域名中间用空格间隔，对应代码：

   ````
   server_name www.xxx.com xxx.com;
   ````



<br>

#### 通过charset设置字符编码

Nginx默认字符编码为 utf-8，如果不需要更改字符编码，则无需添加此项。若想更改，对应代码：

````
charset utf-8;
````

将上述代码中 utf-8 修改为你需要的其他编码。



<br>

#### 通过root来配置网站root目录

对于客户端来说，一个站点目录事实上是由：server.root + server.location 中的 root(真实目录) 或 alias(虚拟目录) 共同组合而成的。

server.root 是服务器上真实存在的网站文件主目录，对应代码：

````
root /xxx/xxx;
````

> 再次提醒：
>
> 1. 要保证nginx有访问该网站目录的权限。
> 2. server.root 仅仅指向真实的服务器网站主目录，最终客户端访问的网址路径还要看 server.location 中怎么设置，server.root + server.location 组合后的结果，才是客户端访问的网址路径。
> 3. 由于 server.loaction 是必须设置的，如果 server.location 中使用 root ，并且直接把 server.locatin.root 设置为完整的服务器网站主目录，那么 server.root 是可以忽略不添加。但是如果 server.location 中使用 alias ，那么 server.root 必须添加并设置相应的值。



<br>

#### 通过location来匹配客户端请求的路径

location相当于Nginx的路由，常见的 "路由命中" 有以下语法规则：

| 参数                    | 匹配类型 | 命中规则                                                     | 命中示例                                           |
| ----------------------- | -------- | ------------------------------------------------------------ | -------------------------------------------------- |
| location /              | 普通匹配 | / 代表任意请求路径，即命中任意请求                           |                                                    |
| location /xxx/          | 普通匹配 | /xxx/ 为某具体请求路径，<br>只要包含该目录前缀即可命中       | www.xxx.com/admin/ ✔<br/>www.xxx.com/admin/user/ ✔ |
| location = /xxx/        | 精准匹配 | 严格精准命中该请求路径                                       | www.xxx.com/admin/ ✔<br/>www.xxx.com/admin/user/ ❌ |
| location ~ 正则表达式   | 正则匹配 | 区分大小写的方式进行正则匹配<br>注意：正则表达式开头和结尾处不需要写 / |                                                    |
| location ~* 正则表达式/ | 正则匹配 | 不区分大小写的方式进行正则匹配                               |                                                    |
| location ^~             | 普通匹配 | 不要继续匹配正则 (只进行精准匹配或普通匹配)                  |                                                    |
| location @              | 普通匹配 | 内部重新定向                                                 |                                                    |



<br>
location 路由命中 规则，遵循以下选择原则：

| 匹配阶段 | 匹配类型 | 命中过程及结果                                               |
| -------- | -------- | ------------------------------------------------------------ |
| 第1阶段  | 精准匹配 | 若命中即可返回结果，并取消后续其他阶段匹配                   |
| 第2阶段  | 普通匹配 | 不分先后顺序得进行普通匹配，若多条命中，记录下相对最精准的那条结果，<br>并开始进行第3阶段匹配 |
| 第3阶段  | 正则匹配 | 按照正则匹配定义的先后顺序进行匹配，若命中一条，则立即返回结果，停止后面的正则匹配<br>若没有命中任何正则，则返回第2阶段中相对精准的那条结果 |



<br>
location xx {} 中的属性值，具体设置说明：

| 属性名                 | 值的类型  | 代表含义                                                     | 补充说明                                                     |
| ---------------------- | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| proxy_pass             | string    | 反向代理，将请求转发给本地其他服务                           | 可转发给Nodejs创建的本地http服务，例如：<br>127.0.0.1:8090   |
| root                   | string    | 相对主目录(server.root)的真实目录路径                        | server.root + server.location.root 才是最终实际读取文件的目录路径 |
| alias                  | string    | 在主目录(server.root)后增加的虚拟目录路径                    | alias配置的目录路径仅仅是给客户端看的，实际上读取文件的真实路径为 server.root 中设定的 |
| index                  | string    | 目录下的默认首页文件                                         | 例如：index.html index.htm                                   |
| autoindex              | off or on | 是否打开目录浏览功能<br>默认值为 off，不打开目录浏览功能<br> | 不建议添加开启该项                                           |
| autoindex\_exact\_size | on or off | 若打开目录浏览功能，显示文件的大小<br>默认值为on，以字节为单位，精准显示出文件大小<br>若值为off，以KB、MB、GB为单位，粗略显示出文件大小 | 若开启，建议设置为off                                        |
| autoindex\_localtime   | off or on | 若打开目录浏览功能，显示文件的时间<br>默认值为off，显示文件时间为本地GMT时间<br>若值为on，显示文件时间为服务器上的时间 | 不建议添加开启该项                                           |



<br>

#### 通过error_page来配置错误展示页

配置 404 错误页，对应代码：

````
error_page 404 /404.html;
location = /40x.html {
}
````

> 上述配置中，设定 404页面的路径 为 "/404.html"，即相对站点的根目录下的 /404.html。
>
> 默认Nginx会先去当前站点的根目录 (server.root中设置的站点主目录) 下查找，如果存在 404.html 即返回该页面。
>
> 若 站点根目录中 找不到 404.html 页面，则 Nginx 自动帮我们生成一份 404 页面。
>
> 注意：这里的 “自动帮我们生成一份 404页面” 是 Nginx源码中用 C语言生成的。



<br>

配置 服务端 错误页，对应代码：

````
error_page   500 502 503 504  /50x.html;
location = /50x.html {
}
````

> 上述配置中，设定 服务端错误页面 的路径为 "/50x.html"，和 404.html 相同，该路径也是指相对站点根目录的。
>
> 默认Nginx也会先去当前站点的根目录下查找，如果存在则返回该页面。
>
> 若站点根目录中找不到 50x.html，Nginx 则会去 /nginx/html/ 中，使用自带的 50x.html。



<br>

补充说明：

error_page 中分别配置了 `location = /40x.html {}` 和 `location = /50x.html {}`，根据本文之前关于 location 中的讲解，使用了 ”=“ 来做精准路由匹配，防止 “错误页面” 混入到 “正常的站点处理程序中”。



<br>

#### 一个完整的server示例

将上面所讲的各项整合在一起，展示一个常见的 server 示例代码：

````
server {
    listen 80;
    server_name  www.xxxx.com xxxx.com;
    root /root/xxxx/

    location / {
        index  index.html;
    }

    error_page 404 /404.html;
    location = /40x.html {
    }

    error_page 500 502 503 504  /50x.html;
    location = /50x.html {
    }
}
````

> 上述配置中 location / 可以匹配到了任意的请求路径，若客户端此时请求的文件存在，则会将文件返回给客户端，至此一个静态资源服务器创建成功。



<br>

PHP是世上最伟大的语言！

对于php程序来说，需要添加 命中 .php 文件的路由请求，因此他们需要再在上述配置文件中，增加：

````
location ~ \.php$ {
    ...
}
````



<br>

#### 创建https服务

首先需要有 SSL 证书，可以去阿里云或腾讯云上申请免费的SSL证书。

以腾讯云为例，申请证书成功后，下载证书，并解压，在解压得到的各种文件中，找到 "Nginx" 文件夹，这里面有2个证书文件

1. 公钥：`1_www.xxx.com_bundle.crt` 
2. 私钥：`2_www.xxx.com.key`

通过 xftp 或其他工具，将这2个文件上传到服务器中。例如可以在 nginx/conf/ 中新建 ssl 目录，将文件上传至此。

> 下面的nginx server配置中，假设2个文件已上传至 nginx/conf/ssl/ 中

关于如何添加 server，请回顾本文上面的文章。



<br>

在 server 中添加 若干属性，具体代码如下：

````
#HTTPS server
server {
    listen 443 ssl;
    server_name  www.xxx.com;
    root /root/xxxx/;

    #此处为 SSL 2个证书文件的文件路径
    ssl_certificate ./ssl/1_www.react-hook.com_bundle.crt;
    ssl_certificate_key ./ssl/2_www.react-hook.com.key;

    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout  5m;

    #不同机构申请的SSL证书，对应的 ssl_ciphers 值可能不一样
    #这里是以腾讯云申请免费的SSL证书为例
    ssl_ciphers  ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers  on;

    location / {
        index  index.html;
    }

    error_page 404 /404.html;
    location = /40x.html {
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
    }
}
````

> 修改配置文件后，可执行 测试配置文件：nginx -t
>
> 若报错误：nginx: [emerg] the "ssl" parameter requires ngx_http_ssl_module in ...  这表示服务器上的 Nginx 安装时没有安装 http_ssl_module 模块，因此无法启用 https 服务。
>
> 解决办法：重装 Nginx，生成中间文件时，切记加上参数 --with-http_ssl_module



<br>

#### 局域网内创建https证书的工具：mkcert

上面讲的是针对公网域名，向腾讯云或阿里云申请 https 证书，但是实际开发过程中，有可能我们需要在局域网内创建 https 服务。

例如我们希望将 localhost 也使用 https，或者将局域网 IP 127.0.0.1、::1 等 设置为 https。

那这种情况下我们可以通过 `mkcert` 这个工具来生成局域网内生效的 https 证书。

**mkcert 官网：https://github.com/FiloSottile/mkcert**



<br>

**Windows系统：**

mkcert 安装和使用非常简单，2 步即可完成，我们在 Powershell 中通过 choco 来安装。

> choco 是 windows 上的包管理工具，如果你系统上没有 choco 网上搜一下安装教程

```
# 安装 mkcert
choco install mkcert

# 生成 https证书 的命令格式为 mkcert + IP 或 域名
mkcert 127.0.0.1
# 或者
mkcert localhost
```

> mkcert xxxx 命令执行过后，会自动生成 2 个文件：xxxx.pem(公钥)、xxxx-key.pem(私钥)，这两个文件就是我们需要的证书。



<br>

**Linux 或 macOS 系统安装 mkcert 安装命令可参考其官方文档。**



<br>

#### http强制跳转至https

http 和 https 分别对应2个 server，如果想让 http 强制跳转至 https，则做如下配置：

````
#HTTP server
server {
    listen 80;
    server_name www.xxx.com;
    return 301 https://$host$request_uri;
}
````

> 也就意味着同时运行着 http 和 https 服务，而 http 请求都会通过 301 跳转至 https 服务中。



<br>

#### Nodejs与Nginx的搭配使用

理论上 Nodejs 可以独立创建 http 或 https 服务，但是从性能角度来讲，还是把一部分工作交给 Nginx 比较合适。

| 分配对象            | 承担功能                                                     |
| ------------------- | ------------------------------------------------------------ |
| Nginx               | 1. 负载均衡<br>2. 所有静态资源的请求处理<br>3. 创建 Https 服务 |
| Nodejs(Express/Koa) | 1. 核心动态业务处理                                          |

关于创建 Https 服务，本文已经讲解过了，下面重点讲一下：如何配置可以让 Nginx负责处理静态资源，Nodejs负责动态业务处理。

1. 让Nginx负责静态资源的处理请求：所谓静态资源主要指图片、css、js 等，通过设定 正则表达式，来命中这些静态资源请求。

   ````
   location ~ .*\.(gif|jpg|jpeg|png|css|js)$ {
   
   }
   ````

   > 若 server.root 已经配置好了站点文件根目录，那么 location ~ .*\.(gif|jpg|jpeg|png|css|js)$ {} 中可以什么都不写。
   >
   > 若 .html 文件并不是由 Nodejs动态生成的，那么还可以把  html文件 也当成静态资源，添加到上述的正则表达式中。

2. Nodejs负责动态业务处理：通过 location / 命中所有请求，将请求反向代理给本机Nodejs服务。

   ````
   location / {
       proxy_pass http://127.0.0.1:8090;
   }
   ````

   > 虽然 location / 也能命中静态资源请求，但是由于 Nginx 的规则是 正则匹配 优先于 普通匹配，所以最终静态资源依然归属 Nginx 响应处理。
   >
   > 
   >
   > 由于已将除静态资源以外的请求都反向代理给了 Nodejs，因此可以把 404错误 也交给Nodejs处理，Nginx只保留对 50x 的错误处理。



<br>

一个常见的Nodejs对应的 nginx server 代码：

````
server {
    listen 80;
    server_name  www.xxxx.com;
    root /root/xxxx/

    #将除了静态资源请求以外的其他请求，反向代理给本机Nodejs服务
    location / {
        proxy_pass http://127.0.0.1:8090;
    }
    
    #通过正则匹配到静态资源请求，并处理这些请求
    location ~ .*\.(gif|jpg|jpeg|png|css|js)$ {
    }

    error_page 500 502 503 504  /50x.html;
    location = /50x.html {
    }
}
````



<br>

### 一个完整的配置文件示例

将本文所有讲述的知识点进行整合，给出一个完整的配置文件示例：

````
user nginx;
worker_processes  1;

pid logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;

    keepalive_timeout  65;
    types_hash_max_size 2048;

    gzip  on;
    gzip_min_length 1;
    gzip_comp_level 2;
    gzip_types text/plain test/html test/css application/x-javascript application/xml test/javascript image/gif image/png;
    
    #配置一个http服务：纯静态资源站
    server {
        listen       80;
        server_name  www.xxxx.com xxxx.com;
        root   /root/xxxx/;

        location / {
            index  index.html;
            autoindex on;
        }

        error_page 404 /404.html;
        location = /40x.html {
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
        }
    }
    
    #配置一个http服务：纯Nodejs站
    server {
        listen       80;
        server_name  api.xxxx.com;

        location / {
            proxy_pass http://127.0.0.1:8100;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
        }
    }
    
    #配置一个http服务：Nginx负责静态资源处理，Nodejs负责动态业务处理
    server {
        listen       80;
        server_name  www.xxxx.com;
        root   /root/xxxx/;

        location / {
            proxy_pass http://127.0.0.1:8100;
        }
        
        location ~ .*\.(gif|jpg|jpeg|png|css|js)$ {
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
        }
    }
    
    #配置一个http服务：通过 301 将 http 跳转至 https
    server {
        listen 80;
        server_name www.xxx.com;
        return 301 https://$host$request_uri;
    }
    
    #配置一个https服务：Nginx负责静态资源处理，Nodejs负责动态业务处理
    server {
        listen       443 ssl;
        server_name  www.xxx.com;

        ssl_certificate      ./ssl/1_www.xxx.com_bundle.crt;
        ssl_certificate_key  ./ssl/2_www.xxx.com.key;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        #ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_ciphers  ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers  on;

        location / {
            proxy_pass http://127.0.0.1:8090;
        }

        location ~ .*\.(gif|jpg|jpeg|png|css|js)$ {
        }

        error_page 500 502 503 504  /50x.html;
        location = /50x.html {
        }
    }
    
}
````



<br>

> 每次修改配置文件后，记得一定要执行：测试配置文件：nginx -t
>
> 配置文件测试没有问题后，再执行 重载配置文件：nginx -s reload

> 如果重启时，报错误：nginx: [error] open() "/software/nginx/logs/nginx.pid" failed ... 这应该是 Nginx 服务已经停止，无法执行 nginx -s reload，此时应该 执行：nginx -c /software/nginx/conf/nginx.conf



<br>


## 权限设置

如果 nginx正常启动，配置文件也没问题 ，但是访问网站出现 403 错误，那就是 服务器上网站目录的权限有问题。

网站目录需要 755 权限，目录下的文件需要 644 权限，设置方式如下。

通过命令 cd 到该目录下，然后执行：

````
chmod 644 -R ./
find ./ -type d -print|xargs chmod 755;
````



<br>

## 感谢

极客时间：Nginx核心知识100讲：[https://time.geekbang.org/course/intro/138](https://time.geekbang.org/course/intro/138)  
动力节点：2020最新Nginx详细教程(nginx快速上手)：[https://www.bilibili.com/video/BV1zE411N7m9](https://www.bilibili.com/video/BV1zE411N7m9)  
腾讯云：Nginx 服务器证书安装：https://cloud.tencent.com/document/product/400/35244
