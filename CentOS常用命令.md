# CentOS常见命令


## 系统相关

升级系统：yum update -y

查看当前系统版本：uname -r  

## 服务相关

管理服务使用：systemctl (推荐) 或 service

> systemctl 更加利于提高启动速度，且 systemctl 兼容 service，因此推荐使用 systemctl 命令

查看 systemctl 版本：systemctl --version

管理服务命令格式为：systemctl + 执行命令(command) + 服务名(unit)

执行命令(command)分别为：

| 命令      | 对应含义                         |
| --------- | -------------------------------- |
| start     | 立即启动                         |
| stop      | 立即关闭                         |
| restart   | 立即重启                         |
| reload    | 不关闭情况下 ，重新载入配置文件  |
| enable    | 设置下次开机时，自动启动         |
| disable   | 设置下次开机时，不自动启动       |
| status    | 打印当前状态                     |
| is-active | 目前是否正在运行中               |
| is-enable | 打印开机时是否默认启动           |
| kill      | 向服务进程发送信号(并非关闭服务) |
| show      | 打印出服务配置                   |
| mask      | 注销服务，且无法再启动           |
| unmask    | 取消注销服务                     |


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

## 查看文件或目录信息

查看当前目录内容：ls

查看当前目录内容和信息：ll 或  ls -i

查看某目录内容：ls xxx

参看某目录内容和信息：ll xxx

例如某一条信息为：drwxr-xr-x   7 root root  4096 Jun 28 18:16 mykoa

该条信息构成为：

| 构成项 | 代表含义                                                     |
| ------ | ------------------------------------------------------------ |
| 第1项  | 开头字母(文件类型) + 后9个字母(文件权限)                     |
| 第2项  | 文件数量(文件显示为1、目录显示为目录里第1级子目录和文件个数总和) |
| 第3项  | 创建该文件的用户名                                           |
| 第4项  | 创建文件用户所在的用户组                                     |
| 第5项  | 文件体积(单位是kb)                                           |
| 第6项  | 创建文件的日期                                               |
| 第7项  | 文件名                                                       |

| 开头字母      | 代表含义     |
| ------------- | ------------ |
| -             | 文件         |
| d             | 目录         |
| l (小写字母L) | 链接         |
| b             | 链接存储设备 |
| c             | 串行设备     |

| 字母 | 数字代表 | 代表含义                                                     |
| ---- | -------- | ------------------------------------------------------------ |
| r    | 4        | 可读                                                         |
| w    | 2        | 可写                                                         |
| x    | 1        | 可执行 <br />(文本文件 不具备可执行，即使root用户也显示为 - ) |
| -    | 0        | 无权限                                                       |

| 字母组合(3个字母为一组) | 代表含义     |
| ----------------------- | ------------ |
| 第1组字母               | 属主权限     |
| 第2组字母               | 属组权限     |
| 第3组字母               | 其他用户权限 |

## 常见权限

修改权限命令构成：chmod + 数字 + 文件或目录路径

权限数字含义：3位数字构成，每一个数字是由 r(4) + w(2) + x(1) | -(0) 累加计算的结果

| 数字计算结果 | 对应权限 |
| ------------ | -------- |
| 4            | r--      |
| 5            | r-x      |
| 6            | rw-      |
| 7            | rwx      |

常用权限数字：

| 数字 | 对应权限  |
| ---- | --------- |
| 444  | r--r--r-- |
| 600  | rw------- |
| 644  | rw-r--r-- |
| 666  | rw-rw-rw- |
| 700  | rwx------ |
| 744  | rwxr--r-- |
| 755  | rwxr-xr-x |
| 777  | rwxrwxrwx |

## 文件夹相关

创建文件夹：mkdir xxx

查看当前所在目录的绝对路径：pwd

查看某程序 xxx 所在安装目录：which xxx  

## 文件相关

创建文件：touch xxx.xx

向文件写入数据：echo you-str-xxx > xxx.xx  会直接替换覆盖原有内容

输出文件内容：cat xxx.xx

## 管理文件或目录

复制文件：cp xxx.xx  newxx.xx

复制目录：cp -r xxx newxxx 参数 -r 表示递归，即包含该目录下的子目录

删除文件(需要确认)：rm xxx.xx  会收到一个询问：是否确认删除 xxx.xx，需要回复：y，才可删除

删除文件(不需要确认)：rm -f xxx.xx 参数 -f 表示不需要询问，强制删除

删除目录(需要确认)：rm -r xxx  每删除目录中一个文件或子目录，都会询问，并回复 y，才可删除

删除目录(不需要确认)：rm -rf xxx 参数 -rf 表示强制删除所有文件及子目录

移动目录：mv  xxx  /xx 将目录 xxx 移动到 /xx目录内，最终新路径为 /xx/xxx，注意：如果 /xx 目录下本身就存在 名为 xxx 的目录 ，则移动失败

移动目录：mv -f xxx /xx 参数 -f 表示强制将 xxx 移动到 /xx 目录下，如果 /xx 目录中原本存在名为 xxx 的目录，则会被强制覆盖

## 输出显示

输出 xxxx 字符：echo xxxx

输出 xxx 文件内容：echo xxx.xx

## yum安装软件

安装本地 .rpm 文件包：yum install /xxx/xxx.rpm

安装网络 .rpm 文件包：yum install https://xxx.com/xxx.rpm

将程序安装到指定目录中：yum install xxx --installroot=/xx/xx

卸载 xxx 程序：yum remove xxx  

## 下载文件

安装wget下载程序：yum install wget

使用wget下载某文件：wget http://xxx.xxxx.xxx/xxx.xx

使用curl下载某文件：curl http://xxx.xxxx.xxx/xxx.xx  

## 解压文件

解压文件：tar xvf xxx


## 软连接

创建软连接：ln -s /xxx/xxx/xx /usr/local/bin/xx

删除软连接：rm -rf /usr/local/bin/xx，如果进入到了bin目录，则为：rm -rf ./xx （仅删除软连接不删除目标文件）


## 编辑文本

编辑文件(类似windows记事本)

查看文件：vim xxx

切换到输入编辑文件模式：i 或 摁键盘 Ins(Insert) 键

退出编辑模式：摁 exc

保存：摁 w

退出编辑器：摁 exc 或 :q 或 ctrl+z(不会保存)  


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
## 防火墙相关

查看防火墙：firewall-cmd --state  若输出 running 即表示已启动

启动防火墙：service firewall start

关闭防火墙：service firewall stop

重启防火墙：service firewall restart
## 其他命令

调出之前的命令：摁上下键

快速补全单词：输入若干字母后，摁 Tab 键，会智能补全你有可能要输入的单词

## 目录结构

| 目录               | 含义                                                         |
| ------------------ | ------------------------------------------------------------ |
|                    | 当前用户目录(root用户对应 /root、普通用户对应 /home/xx)      |
| /                  | 根目录                                                       |
| bin (/usr/bin)     | 存放二进制文件(可执行命令)                                   |
| boot               | 存放内核与启动文件(开机引导目录)                             |
| data               |                                                              |
| dev                | 存放与设备、驱动器有关的目录                                 |
| etc                | 存放配置文件目录、rpm安装默认配置文件目录                    |
| home               | 普通用户目录                                                 |
| lib (/usr/lib)     | 系统使用的函数库目录                                         |
| lib64 (/usr/lib64) |                                                              |
| lost+found         | 系统以外崩溃或关机，产生的一些文件碎片存放目录               |
| media              | 挂载目录，建议挂载媒体设备、CD/DVD目录                       |
| mnt                | 挂载目录，建议挂载U盘、移动硬盘                              |
| opt                | 存放可选、测试中的程序目录(非强制)                           |
| proc               | 虚拟文件系统(保存系统的内核、进程)，该目录中的数据并不保存到硬盘中，而是保存在内存中 |
| root               | 系统管理员(root user)的目录                                  |
| run                | 系统运行所需文件目录                                         |
| sbin (/usr/sbin)   | 系统管理员(root user)使用的命令目录                          |
| srv                | 服务启动后需要访问的数据目录，例如www服务需要访问的网页数据可以存放在 srv/www内 |
| sys                | 虚拟文件系统(保存系统内核相关信息)，和 proc 目录相似         |
| tmp                | 存放临时文件目录                                             |
| usr                | 存放安装程序(软件默认目录)，不是user的缩写，而是“Unix Software Resource”的缩写 |
| usr/etc            | 存放配置文件目录                                             |
| usr/local          | 手动安装的程序目录                                           |
| usr/src            | 程序源码的目录                                               |
| var                | 动态数据保存目录(缓存、日志、软件产生的文件)                 |
| var/log            | 系统日志目录                                                 |

