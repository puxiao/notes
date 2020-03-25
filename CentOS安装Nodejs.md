# 小白教小白Nodejs入门——CentOS(Linux)系统下安装Nodejs

## 前言
安装Nodejs应该是学习的第一步，这么基础的事情还需要再写一篇文章？

**理由一 太多坑**：  

Nodejs更新太快，以至于网上大量的安装教程都有各种坑(已经不适用于最新版本、教程本身就有坑、高手写的不适合小白)。

**理由二 必须项**：  

本地开发肯定用Windows或Mac，但是绝大多数服务器都是Linux系统(非可视化)。所以必须掌握在Linux系统下安装配置Nodejs，当然还有后续需要安装的Nginx/MySQL/Redis等。

**理由三 啥叫小白**：  

很简单的事情整半天也整不明白的叫小白。我是新手小白，我花了1天时间才搞明白怎么安装，所以我相信我这篇文章会帮到别的小白，少走点弯路。

说明：
1、我下面文章是基于腾讯云服务器(CVM) CentOS7.6(64位)下进行的。  
2、腾讯云服务器目前有一个活动[“1核/4GB/2M带宽/50G硬盘”2年376元”](http://cloud.tencent.com/act/developer?sk=341cc9fd73855dcae84439ccfd7fad45)，值得入手，开发调试Nodejs必备。


我讲正确的步骤同时，顺带讲一下每个环节网上一些教程中的“坑”。


## 第一步：安装编译工具

第一个大坑来了~ 网上一些教程第一步是下面一些操作：

1. 更新系统：yum -y update
2. 安装gcc g++编译器：yum install gcc-c++
3. 安装编译工具：yum -y groupinstall "Development Tools"

**注意，以上这些操作，统统不需要！**

~~当然更新系统你想做也不反对，但是没啥意义。~~

目前官方提供的Nodejs安装包不需要你自己编译，所以上面那些编译工具根本不需要安装。
(至少我使用的腾讯云CentOS7.6上不需要上面那些操作，别的Linux系统我还真不敢把话说那么绝对)

**上述结论是：根本就没这一步，你什么也不做就好。**


## 第二步：先决定安装目录

通常我们在Windows下通常会把软件安装到Program Files文件夹，那么Linux系统下你打算把Nodejs安装到哪个目录里呢？
一般来说小白看到Linux下的各种目录名字都有点懵，不知道每个文件夹都有什么含义。

理论上你把Nodejs安装到任何目录里都可以(先不考虑文件夹权限问题)。

**网上有些教程中的坑：**  

1、有的教程开头没写目录在哪，就直接开始下载  
2、有的教程是先讲下载到 /usr/local/src/中，然后解压，然后再将文件转移到其他目录，干嘛那么绕？直接定位到目标目录多好。  

无论你决定你要安装在哪个文件夹里，自己确定好即可。  
我的计划是在根目录新建一个software的文件夹，专门用来存放我安装的程序。

**执行以下命令：**  

    cd /    //回到根目录
    mkdir software    //创建software的文件夹
    cd software    //进入software的文件夹

总体来说：决定你的安装目录，然后cd进入该目录


## 第三步：安装包获取

获取安装包地址，先查看服务器系统的位数：  
    uname -r    //x86_64表示64位系统，i686 i386表示32位系统
根据系统位数在http://nodejs.cn/download/ 上找到对应安装包地址。  

**获取方式一：通过wget下载**  

执行以下命令  

    //在线下载Nodejs安装包  
    wget https://npm.taobao.org/mirrors/node/v12.14.1/node-v12.14.1-linux-x64.tar.xz

等待几秒后下载完成 (我用的腾讯云下载速度是24M/s，不到2秒下载完成)

**获取方式二：通过xftp上传**  

先把安装压缩包下载到本机，然后通过Xftp软件上传到要服务器Nodejs安装目录中。

**注意事项：**  

一定确保上述操作是在你的安装Nodejs目录里。


## 第四步：解压安装包

**执行以下命令：**  

    tar -xvf node-v12.14.1-linux-x64.tar.xz    //解压安装包，注意参数是-xvf，不是-xzvf  
    mv node-v12.14.1-linux-x64 nodejs    //将解压得到的文件夹重命名为 nodejs  
    cd nodejs/bin     //进入nodejs的bin目录  
    node -v     //查看node -v版本，能够正常输出版本即表示安装成功(目前仅可在安装目录执行，还需后续创建全局软连接)  
    rm -rf node-v12.14.1-linux-x64.tar.xz    //删除安装包  

**网上有些教程中的坑：**

1、一些老的教程里下载的文件是 .tar.gz，目前最新版本官方安装文件压缩包后缀为.tar.xz，后缀不同解压方式也不同。  
2、有些教程说需要先安装gzip或者说gzip版本不高可能解压文件出错，这一步根本不需要安装，.tar.xz后缀文件根本用不到gzip。  
3、“./configure 执行配置脚本来进行预编译处理”，上文讲过，根本不需要编译这一步，此乃大坑！  
*(Nodejs较新的版本是：解压好即代表安装好，我是这样理解的，欢迎指正)。*  


## 第五步：创建软连接

我们肯定希望无论在哪个文件夹，都可运行Nodejs，所以**需要创建全局软连接(相当于Windows里的path全局环境变量**)。

**执行以下命令：**  

    //创建node软连接，以后在任何文件里都可使用 node命令  
    ln -s /software/nodejs/bin/node /usr/local/bin/node    

    //创建npm软连接，以后在任何文件夹里都可使用 npm命令 
    ln -s /software/nodejs/bin/npm /usr/local/bin/npm     

**如果报错，比如提示****：ln: failed to access ‘/usr/local/bin/node’: Too many levels of symbolic links**  

**检查下面2个原因，看你符合哪一条。**  

1、没有使用绝对路径(创建软连接必须使用绝对路径，不能使用相对路径)  
2、软连接本身已存在(如果已存在，则本次创建软连接会失败)  
无论上述那种情况，报错的代码是一模一样的。  

查看全局软连接的代码：  
    cd /usr/local/bin && ls    //进入目录并执行ls，列出目录内容

删除全局软连接的代码：  
    cd /usr/local/bin    //进入目录  
    rm -rf /usr/local/bin/node    //这里仅仅是删除了软连接，并不是真的删除nodejs文件  

**我在试验的过程中，自己给自己挖了2个坑：**  

1、重复尝试安装过程中，创建过软连接但是我给忘了，后续重新创建时就一直提示创建失败。  
2、**软连接并不是“快捷键图标”**，如果用Xftp访问/usr/local/bin，是看不到该文件夹下有快捷键图标的，只有在shell下使用ls命令才会输出。  


## 第六步：测试是否安装成功

随便切换到某个目录，比如根目录  
    cd /  
    node -v  
能够正常输出Nodejs版本即代表安装并创建软连接成功了。  

## 补充说明：  

回过头看本文讲的安装过程，并没有多少行命令。   

**全部操作为：**

    cd /    //回到根目录  
    mkdir software    //创建software的文件夹  
    cd software    //进入software的文件夹  
    wget https://npm.taobao.org/mirrors/node/v12.14.1/node-v12.14.1-linux-x64.tar.xz    //在线下载Nodejs安装包  
    tar -xvf node-v12.14.1-linux-x64.tar.xz    //解压安装包，注意参数是-xvf，不是-xzvf  
    mv node-v12.14.1-linux-x64 nodejs    //将解压得到的文件夹重命名为 nodejs  
    cd nodejs/bin     //进入nodejs的bin目录  
    node -v     //查看node -v版本，能够正常输出版本即表示安装成功(目前仅可在安装目录执行，还需后续创建全局软连接)  
    rm -rf node-v12.14.1-linux-x64.tar.xz    //删除安装包  
    ln -s /software/nodejs/bin/node /usr/local/bin/node    //创建node软连接，以后在任何文件里都可使用node命令  
    ln -s /software/nodejs/bin/npm /usr/local/bin/npm    //创建npm软连接，以后在任何文件夹里都可使用npm命令  

至此，基于CentOS(Linux)系统下安装Nodejs完成。


**其他安装方式**  

并不是所有软件都按照上述方式安装，比如安装 Nginx(和nodejs配合的服务器应用)，它的安装方式极其简单：  
    yum install nginx -y    //就一句话，多简单  
Nodejs也可以这样安装，但是问题在于你无法选择nodejs版本，只能看yum给你装的什么版本就是什么版本。


## 后语
一入Nodejs深似海，2020年，全栈之路继续加油。

我在思否写的第一篇文章，2020年终终结，获得了思否的“人间有真爱奖”(不是因为写得好，而是因为发的早)，感谢思否。
