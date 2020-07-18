# Docker常用命令

## 基础命令

查看 docker 支持的命令：docker

查看 docker 信息：docker info

查看 docker 当前版本：docker version

启动 docker ：systemctl start docker

docker 启动项目：docker run xxx



## 安装镜像相关

搜索镜像：docker search xxx

> 一定要从返回列表中，认真看清楚镜像的描述信息，最终选定安装哪个镜像文件

下载镜像：docker pull xxx ，其中 xxx 为 docker search xxx 中选定的结果名称

查看已安装的镜像：docker images

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

发布镜像：docker push xxx



## 容器相关

查看容器：docker ps -x

上述命令中 -x 为参数：

| -x的值       | 对应含义                             |
| ------------ | ------------------------------------ |
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

删除容器：docker rm xxx

创建容器：docker run imagexxx  

> 注意这里的 imagexxx 为镜像，启动镜像会创建一个运行状态的容器
> 其他的 xxx 为容器

启动镜像时，可添加的参数：

| 参数          | 对应含义                                                     |
| ------------- | ------------------------------------------------------------ |
| -it           | 启动成功后，显示容器命令界面<br />若不添加该参数，容器启动成功后则停留在主机操作界面、若添加则进入容器命令界面 |
| --name  xxx   | 给该容器起一个名字(ID)，若不添加该参数，则 docker 会随机产生一个字符串作为该容器名字(ID) |
| -p 9000:8080  | 映射端口，9000为宿主机端口，8080为容器内部端口<br />可以有多组 -p xxxx:xxxx，设置多组端口映射关系 |
| -v /aa/bb:/cc | 映射目录，/aa/bb为宿主机目录，/cc为容器内部目录<br />通常情况下数据库文件一定是存放在宿主机目录里的，同 -p 一样，也可以设置多组目录映射关系 |
| --privileged  | 允许容器拥有操作宿主机中映射的目录最高权限(读/写执行)        |
| --net=xxx     | 其中 xxx 为网络模式<br />1、none：无网络<br />2、host：直接使用宿主机的网络配置<br />3、bridge：默认设置，会为每一个容器分配IP，通过虚拟网桥与宿主机通信<br />4、container:Name_or_ID，容器自己不配置网络，而是和指定容器共享同一个网络配置 |

退出容器命令界面：exit 仅退出容器命令界面，还会停止容器(stop)

> 注意：
>
> 1. exit 会停止容器(docker stop xxx)，并不是暂停容器(docker pauser xxx)，
> 2. 因此若想重启容器，恢复容器(docker unpauser xxx)是不行的，只能执行重新开启容器(docker start -i xxx)

