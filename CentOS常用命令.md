# CentOS常见命令


## 系统相关

升级系统：yum update -y  
查看当前系统版本：uname -r  


## 开关机相关

普通重启：reboot  
root用户操作重启：shutdown -r [time]  [time]如果为now立即重启、10表示10分钟后重启、20:35表示20:35重启  
取消重启：shutdown -c  

立即关机(停止CPU，但仍然通电，系统处于低层维护状态)：halt  
立即关机：poweroff  
root用户操作关机：shutdown -h [time]  [time]如果为now立即关机、10表示10分钟后关机、20:35表示20:35关机  

## 权限设置

常见的 Nginx 网站目录需要 755 权限，目录下的文件需要 644 权限，设置方式如下。
通过命令 cd 到该目录下，然后执行：

````
chmod 644 -R ./
find ./ -type d -print|xargs chmod 755;
````


## 网络相关

列出网络配置：netstat  
列出简要的网络配置：netstat -netlp  

## 进程相关

查看当前系统全部进程：ps -ef  
查看某xxxx进程：ps -ef|grep xxxx  
终止某进程：kill -9 pid  pid为该进程在 ps -ef中对应的pid  
终止某xxxx相关全部进程：killall -9 xxxx    


## 文件夹相关

查看文件夹下内容：ls 或 ll  
创建文件夹：mkdir xxx  
查看当前所在目录的绝对路径：pwd  


## 解压文件

解压文件：tar xvf xxx

## yum安装软件

安装本地 .rpm 文件包：yum install /xxx/xxx.rpm  
安装网络 .rpm 文件包：yum install https://xxx.com/xxx.rpm  
将程序安装到指定目录中：yum install xxx --installroot=/xx/xx  
卸载 xxx 程序：yum remove xxx


## 软连接

创建软连接：ln -s /xxx/xxx/xx /usr/local/bin/xx  
删除软连接：rm -rf /usr/local/bin/xx，如果进入到了bin目录，则为：rm -rf ./xx （仅删除软连接不删除目标文件）


## 编辑文本

编辑文件(类似windows记事本)  
查看文件：vim xxx  
切换到输入编辑文件模式：i  
保存：w  
退出：Exc 或 q 或 ctrl+z(不会保存)  


## 下载文件

安装wget下载程序：yum install wget  
使用wget下载某文件：wget http://xxx.xxxx.xxx/xxx.xx  
使用curl下载某文件：curl http://xxx.xxxx.xxx/xxx.xx  


## 查看/编辑某文档

查看：vim xxxx  
编辑：摁i进入编辑模式，上下箭头可以移动光标，或者使用键盘上HJKL4个键操作  
保存：摁w  
退出：Esc 或 q 或 ctr + z  


## 命令执行与切换

临时放入后台运行：xxxxx &  如果当前连接关闭，则该命令就会终断结束  
永久放入后台运行：nohup xxxxx &  即使关闭当前连接，该命令依然运行（一定要用exit退出，如果直接关闭xshell此命令不执行）   
暂时放入后台暂停：ctr + z 当前命令会处于暂停状态  

查看当前后台运行的命令：jobs  注意看每一行最前面的数字，表示该命令的序号  
将后台某个命令调回前台：fb num  num是该命令的序号  
将后台某个处于暂停的命令变为后台执行：bg num  num是该命令的序号  

终止当前命令：ctr + c  
终止后台某个命令：kill num  num是该命令的序号  
终止某个(无论是不是在后台)命令：kill -9 pid  pid是通过ps -ef 命令查找到的该命令对应的pid数字  
终止某个服务所有相关的进行：killall -9 name  name是通过ps -ef 命令查找到的该命令名称  
