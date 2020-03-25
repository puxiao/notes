## Nginx学习笔记

## 安装

#### 安装方式 一：通过yum安装
CentOS安装Nginx：yum install nginx -y

#### 安装方式 二：手工下载，编译，配置，安装

以下操作，均通过shell命令进行。

    下载：wget https://nginx.org/download/nginx-1.16.1.tar.gz  
    解压：tar -xzf nginx-1.16.1  
    进入：cd nginx-1.16.1  


以下可选或忽略：  

    此时可以查看一些配置文件，或跳过这一步  
    查看目录(可选)：ll  
    查看默认安装配置文件(可选)：vim configure  
    若无修改可忽略，回到nginx-1.16.1目录  

继续下面操作：  

    生成中间文件：./configure --prefix=/software/nginx   --prefix为你要设定的安装目录  
    
    若生成失败，则需要你先安装 pcre-devel 和 openssl-devel，再执行一遍生成中间文件。  
    安装必要文件：yum -y install pcre-devel openssl openssl-devel  
    
    执行make编译：make  
    
    如果不报错，执行结束，会把编译成功的文件存放在 /nginx-1.16.1/objs  
    
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
    1、无法开启启动  
    2、无法使用systemctl xxx nginx 命令来操作  


## 卸载

卸载默认yum安装的Nginx：

    service nginx stop
    chkconfig nginx off
    rm -rf /usr/sbin/nginx
    rm -rf /etc/nginx
    rm -rf /etc/init.d/nginx
    yum remove nginx

如果是自己手工编译安装的，需要找到对应的目录进行删除。


## 控制

使用系统命令控制nginx：  

开启nginx：systemctl start nginx
关闭nginx：systemctl stop nginx
重启nginx：sysemctl restart nginx
查看状态：systemtcl status nginx

查看系统当前各软件占用端口情况：netstat -ntlp
查看当前系统中Nginx的进程信息：ps -ef|grep nginx
终止nginx某个进程：kill -9 pid   pid为该进程在运行ps -ef 中对应的pid
终止nginx全部进程：killall -9 nginx


## 命令

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


## 配置

通过创建多份server来创建多个站点  

通过server_name来绑定域名(端口80)  
通过location / 中的proxy_pass来把请求转给 nodejs创建的本地服务上  

通过location ~ .*\.(gif|jpg|jpeg|png.....)$来配置静态资源  
通过gzip on来压缩文件  


## 感谢

极客时间：Nginx核心知识100讲：[https://time.geekbang.org/course/intro/138](https://time.geekbang.org/course/intro/138)  
动力节点：2020最新Nginx详细教程(nginx快速上手)：[https://www.bilibili.com/video/BV1zE411N7m9](https://www.bilibili.com/video/BV1zE411N7m9)

