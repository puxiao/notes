# MongoDB安全机制
## 启动mongod

推荐使用 配置文件(mongod.conf) 的方式启动 mongod。

Linux系统下启动：

````
mongod -f mongod.conf
````

Windows系统下启动 (cmd命令窗口，右键，以管理员身份运行)：

````
mongod.exe -f mongod.conf
````


> 若不使用配置文件启动 mongod，采用直接 mongod + 参数 的形式，则需要输入多项对应的参数，略显麻烦。

mongod.conf 配置参考：

````
#数据库目录设置
storage:
  dbPath: ../data
  journal:
    enabled: true
    
#日志相关设置
systemLog:
  destination: file
  logAppend: true
  path:  ../log/mongod.log

#网络端口设置
#注意：
#1、建议一定要将默认的端口号 27017 修改为其他端口，防止被一些 mongodb 端口黑客扫描工具
#2、如果 bindIp 值为 0.0.0.0，则表示可以通过外网IP进行访问
#3、如果 bindIp 值为 127.0.0.1，则表示仅本机内部可访问
net:
  port: 27027
  bindIp: 127.0.0.1

#是否后台运行设置。 特别说明：windows系统不支持该项，不可以有此项设置
processManagement:
  fork: true

#用户认证设置
security:
  authorization: enabled
````

#### 常见的启动失败解决办法

当执行启动 mongod 命令后，如果顺利启动，则会收到类似以下信息：

```
about to fork child process, waiting until server is ready for connections.
forked process: 30172
child process started successfully, parent exiting
```

如果没有看到 successfully 则可能是启动失败，以下为常见的2种启动失败原因和解决办法。



**第1种：第一次启动 mongod，启动前并未创建数据库和日志的目录**

一定要提前创建好存放数据和日志的目录，并确保目录有读写的权限，例如上面配置示例中的 ../data 和 ../log，若启动之前并未创建对应目录，则会启动失败，收到以下类似的错误提示：

```
about to fork child process, waiting until server is ready for connections.
forked process: 26716(这个数字每次是会变化的)
ERROR: child process failed, exited with 1
To see additional information in this output, start without the "--fork" option.
```

**第2种：之前的 mongod 异常关闭**

还有另外一种情况，就是之前启动了 mongod 却未正常关闭，导致 mongod 处于一种 “异常关闭保护性被锁” 的状态，目的是为了保持在非正常关闭那一刻记录还未保持的数据(本人目前暂时的理解)，也会出现启动失败，这时解决方法是 找到 data 目录，删除里面的 mongod.lock 文件，再次执行启动命令即可。


#### Windows系统启动 mongod 的注意事项

1. 可以使用 mongo.exe 直接连接 mongod所创建的数据库，但是直接运行 mongo.exe 连接时无法设置连接参数，例如端口为27017，无法设置账户密码等。如果 mongod 创建的数据库端口不是 27017，则 mongo.exe 连接失败，窗口会自动关闭，此时只能通过 cmd 命令窗口来连接。

   ```
   ./mongo.exe 127.0.0.1:27017 -u namexxx -p pwdxxx
   ```

   或者直接连接到某数据库，例如数据库名为dbnamexxx，代码如下：

   ```
   ./mongo.exe 127.0.0.1:27017/dbnamexxx -u namexxx -p pwdxxx
   ```

   > 如果是希望连接远程服务器数据库，则把上述代码中的 IP 地址更换为服务器 IP

2. windows系统命令窗口下执行 mongod -f mongod.conf 之后，即使成功启动，也不会有任何文字提示。

3. windows系统命令窗口不支持后台运行(fork:true)，因此 启动 mongod 之后，千万不要关闭当前 cmd 命令窗口，因为一旦关闭就相当于把 mongod 也关闭了。 想进行 mongo 命令连接 mongod，只能再新建一个 cmd 命令窗口进行操作。

> 特别注意：
> 1. 需要用 管理员账户 运行 cmd命令窗口
> 2. 启动时，执行的代码是 `mongod.exe -f mongod.conf`  ，一定要注意是 `mongod.exe`


#### 结束mongod进程

执行以下代码：

````
killall -9 nginx
````


## 安全架构

MongoDB安全架构共有4大种类：

1. 认证
2. 鉴权
3. 审计
4. 加密


## 认证

#### 用户认证

| 认证方式 | 描述 | 备注 |  
| ---- | ---- | ---- |  
| 用户名+密码 | - MongoDB默认认证方式 <br/> - SCRAM-SHA-1 哈希算法 <br/> - 用户信息存于MongoDB本地数据库 |  |  
| 证书方式 | - X.509标注 <br/> -  服务端需要提供证书文件启动 <br/> - 客户端需要证书文件连接服务端 <br/> - 证书有外部或内部CA颁发 |  |  
| LDAP外部认证 | 连接到外部LDAP服务器 | 企业版功能 |  
| Kerberos外部认证 | 连接到外部Kerberos服务器 | 企业版功能 |  


#### 集群认证

| 方式 | 说明 |  
| ---- | ---- |  
| Keyfile | 将统一Keyfile文件拷贝到不同的节点，Keyfile就是一个字符串 |  
| X.509(更安全) | 基于证书的认证模式，推荐不同的节点使用不同的证书 |  


## 鉴权

#### 基于角色的权限机制

MongoDB授权基于角色的权限机制，不同的权限的用户对数据库的操作不同。
例如 DBA 可以创建用户、应用开发者可以插入数据、报表开发者可以读取数据。  

#### 角色的组成

角色分为2部分：  
1. 可以执行的权限(Actions)，例如 插入，更新，创建等  
2. 可操作对象(Resources)，例如 某集合，数据库，分片等  

#### 内置角色及权限继承关系

超级用户角色：root 、备份恢复相关、集群管理相关、全局管理相关、数据库管理相关、应用程序用户相关  

同时MongoDB可以通过db.createRole()自定义角色，然后再通过 db.createUser(）添加角色实例账户。  


## 审计

- 数据库记录型系统通常使用审计监控数据库相关的活动，以及对一些可以的操作进行调查。  
- 记录格式：JSON
- 记录方式：本地文件或syslog
- 记录内容：Schema change(DDL)、CRUD操作(DML)、用户认证

> 注意：  
> 审计功能需要收费的MongoDB企业版  


## 加密

#### 传输加密

MongoDB 支持 TLS/SSL 来加密 MongoDB 的所有网络传输(客户端应用和服务端之间、内部复制集之间)。确保 MongoDB 网络传输仅由允许的客户端读取。  


#### 落盘加密

落盘加密流程：  

1. 生成 master key，用来加密每一个数据库的 key。  
2. 生成每一个数据库的 key，用来加密各自的数据库。
3. 基于生成的数据库 key 加密各个数据库中的数据。
4. Key 管理(只针对 master key，数据库 key 保存在数据库内部)。


#### 字段级加密

- 单独文档字段通过自身秘钥加密  
- 数据库只看见密文  
- 优势：  
    - 便捷：自动及透明
    - 任务公开：简化基于服务的系统步骤，因为没有服务工程师能看到纯文本
    - 合规：监管“被遗忘权”
    - 快速：最小性能代偿

> 注意：  
> 字段及加密需要运行在 MongoDB 4.2+ 版本  


#### 字段级加密查询流程

1. 查询及响应验证通过的客户
2. MongoDB驱动程序
3. 秘钥管理 拿到秘钥
4. MongoDB数据库 加密字段始终按密文储存、传输和检索
6. 把结果返回给MongoDB驱动程序
7. MongoDB驱动程序通过秘钥管理器解密
8. 把解密后的数据发送给客户端

整个加密解密过程都在MongoDB客户端驱动程序进行。  


## MongoDB安全最佳实践

1. 启用身份认证：启用访问控制并强制执行身份认证，建议使用强密码。  
2. 权限控制：基于 Deny All 原则不多给多余权限。
3. 加密和审计：启用传输加密、数据保护和活动审计。
4. 网络加固：内网部署服务器，设置防火墙，操作系统设置。
5. 遵循安全准则：遵循不同行业或地区安全标准合规性要求。

#### 合理配置权限

- 创建管理员
- 使用复杂密码
- 不同用户不同账户
- 应用隔离
- 最小权限原则


#### 启用加密

- 使用TLS或SSL作为传输协议
- 使用4.2版本的字段级加密对敏感字段加密
- 如有需要，使用企业版进行落盘加密
- 如有需要，使用企业版并启用审计日志


#### 网络和操作系统加固

- 使用专用用户运行 MongoDB
    - 不建议在操作系统层使用 root 用户运行 MongoDB

- 限制网络开放度
    - 通过防火墙，iptables 规则控制对 MongoDB的访问
    - 使用VPN/VPCs 可以创建一个安全通道，MongoDB服务不应该直接暴露在互联网上
    - 使用白名单列表限制允许访问的网段
    - 使用bind_ip绑定一个具体地址
    - 修改默认监听端口：27017
- 使用安全配置选项运行 MongoDB
    - 如果不需要执行 JavaScript 脚本，使用 --noscripting 禁止脚本执行
    - 如果使用老版本MongoDB，关闭 http 接口：net.http.enabled=False net.http.JSONPEnabled=False
    - 如果使用老版本MongoDB，关闭 Rest API 接口：net.http.RESTInterfaceEnabled=False

## MongoDB 启用认证

#### 第1种启用方式:命令方式，通过 --auth 参数

#### 第2种启用方式：配置文件中，在 security 下添加 authorization:enabled

重启 mongod ，并添加配置文件的参数

````
mongod -f mongod.conf
````

> 再次强调：
>
> 1. 若是第1次启动 mongod，一定要提前创建好储存数据和日志的目录，否则会启动失败。
> 2. 若是后续启动过程中遇到错误，可以尝试删除数据库目录中的 mongod.lock 文件后，再次执行启动。

重新通过 mongo 连接数据库。启用鉴权后，无密码可以登录，但是只能执行创建用户操作。

    mongo --host 127.0.0.1:27017
    use admin
    db.createUser({
      user:"superuser",pwd:"password",roles:[{role:"root",db:"admin"}]
    })

安全登录，执行如下命令查看认证机制

    mongo -u superuser -p password --authenticationDatabase admin
    db.runCommand({getParameter：1，authenticationMechanisms:1})

从数据库中查看用户

    db.system.users.find()

> 注意：  
> 结束mongod的进程代码为：pkill mongod


#### 创建总管理员

MongoDB默认没有总管理员账户，需要手工创建。

大致步骤为：  

1. mongod启动时 添加 --auth 参数 或在配置文件中 security 添加 authorization: enabled，确保mongod启动的数据库必须通过登录认证才可以连接。
2. 使用 mongo 去连接 mongod数据库，注意：此时还未有任何一个管理账户，所以第一次连接时是不需要用户名和密码的。
3. 进入 admin 集合中
4. 使用 db.createUser() 来创建超级管理员账户名和密码，超级管理员角色对应的是 root。
5. 若此时选择退出连接，那么下次再使用 mongo 连接数据库时，则必须使用超级管理员的用户名和密码，否则连接进去之后，也不会有任何权限，做任何操作都会提示操作失败，因为无权限。
6. 有2种方式可以使用账户密码登录，第一种就是在 mongo 连接时添加参数 --username xxx --pwd xxx，第二种就 mongo 连接时先不添加用户名和密码参数，而是选择连接后，执行 db.auth("usenamexxxx","passwordxxxx)进行登录。
7. 超级管理员账户创建或登录以后，先切换到一个新的项目集合中，再在该集合下创建其他不同权限的用户。  

创建超级管理员账户代码：  

    use admin
    db.createUser(
      {
        user:"superuser",
        pwd:"Xxxxxx",
        roles:[
          {
            role:"root",
            db:"admin"
          }
        ]
      }
    )

请注意一定要认真核对 上述命令中的 字段、括号、号码，确保都是正确匹配的，若不小心某些地方拼写错误，则会创建管理员失败，收到以下信息：

```
uncaught exception: SyntaxError: missing ) after argument list :
@(shell):1:36
```

若是创建成功，则收到以下信息：

```
Successfully added user: {
	"user" : "superuser",
	"roles" : [
		{
			"role" : "root",
			"db" : "admin"
		}
	]
}
```



#### 创建项目管理员账户

首先以超级管理员账户连接并登录 mongod 数据库中。

    mongo --username superuser --password Xxxxxx --authenticationDatabase admin --host 127.0.0.1:xxxx

连接成功之后，可以开始创建项目管理员账户。

假设项目对应的数据库名为 students、集合(collection)名为 mycollection，给该集合的管理员分配的角色身份为 dbOwner，用户名 admin。

> 事实上集合名 mycollection 并不是必须现在就要创建的，重点是先创建数据库 students，至于集合名等到需要添加数据时再自动创建也可以。

对应创建项目管理员代码如下：

    use mycollection
    db.createUser(
      {
        user:"admin",
        pwd:"Xxxx",
        roles:[
          {
            role:"dbOwner",
            db:"students"
          }
        ]
      }
    )

此时若退出超级用户，使用新创建的 admin 登录连接数据库。

    mongo --username admin --password Xxxx --authenticationDatabase students --host 127.0.0.1:xxxx

进去之后，执行 show dbs，只会列出 students 这个集合，也就意味着该用户只能操作 students 这个集合，整个 MongoDB 的其他集合该用户都不可见。


#### MongoDB内置的不同权限级别的角色身份

1.数据库用户角色：read、readWrite  
2.数据库管理角色：dbAdmin、dbOwner、userAdmin  
3.集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
4.备份恢复角色：backup、restore  
5.所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase  
6.超级用户角色：root  
7.内部角色：__system(该角色是供内部不同复制集使用的，不要将该角色赋予人工管理账户)

> 注意：再给用户设定角色时，尽可能只给最小权限的角色。  



## 忘记密码

#### 忘记普通管理账户密码

可以通过最高权限管理账户，删除原有普通管理账户，重新添加。



#### 忘记最高管理者账户密码

没有办法找回密码，只能重置账户和密码。

第1步：停止 mongod 服务：killall -9 mongod

第2步：取消密码登录 (删除或注释 mongod.conf 中的 security:authorization: enabled)

第3步：启动 mongod 服务：mongod -f mongod.conf

第4步：进入 admin 文档中，查看、删除 root 权限的账户

````
use admin
db.system.users.find()
db.system.users.remove({})
````

> 上面代码中 remove({}) 并没有设定查询条件，导致会将所有用户都删除。
>
> 正确的做法应该是 db.system.users.find() 查看所有账户信息，找到确认要删除的root权限账户的 "user":"xxxx"，然后再执行精准删除：db.system.users.remove({"user":"xxxx"})

第5步：重新添加总管理员账户，db.createUser(...)

第6步：重新启用 mongod 账户认证 (添加或取消注释 mongod.conf 中的 security:authorization: enabled)

第7步：停止 mongod 服务：killall -9 mongod

第8步：启动 mongod 服务：mongod -f mongod.conf

> 第7、8步骤 和 第1、3步骤是相同的。



## 在CentOS系统中，登录后提示的错误警告

使用 mongo root 角色账户登录连接到 mongod 之后，默认会收到一些自动检测警告。

在本人的腾讯云 CentOS 7.6 中，收到的警告有：

1. WARNING: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine

2. WARNING: You are running this process as the root user, which is not recommended.

3. WARNING: /sys/kernel/mm/transparent_hugepage/enabled is 'always'.
We suggest setting it to 'never'

4. WARNING: /sys/kernel/mm/transparent_hugepage/defrag is 'always'.
We suggest setting it to 'never'

5. WARNING: soft rlimits too low. rlimits set to 15072 processes, 100001 files. Number of processes should be at least 


第1条警告：建议系统文件使用 XFS 储存。  
第2条警告：不建议使用CentOS的root用户来启动MongoDB。因为root的权限太大，不安全。  
第3条和第4条警告：当前Transparent Huge Pages(THP)为开启状态，建议关闭Transparent Huge Pages(THP)。  
第5条警告：系统设定软件最大连接数太低，建议调高一些。  


#### 修复这些问题

##### 第1条和第2条
很明确，暂时不作修改。


##### 第3条和第4条，修复方式：  

1. 找到 /etc/rc.d/rc.local 文件
2. 编辑该文件，新增以下内容：

````
 if test -f /sys/kernel/mm/transparent_hugepage/enabled; then
 echo never > /sys/kernel/mm/transparent_hugepage/enabled
 fi
 if test -f /sys/kernel/mm/transparent_hugepage/defrag; then
 echo never > /sys/kernel/mm/transparent_hugepage/defrag
 fi
````

3. 保存 rc.local
4. 给该文件赋予可执行权力，执行代码：chmod +x /etc/rc.d/rc.local
5. 立即重启系统：shutdown -r now

系统重启之后，再次启动 mongod，再次使用 mongo 登录连接，第3和第4条警告就会消失。  


##### 第5条，修复方式：

1. 找到 /etc/security/limits.conf 文件
2. 编辑改文件，新增以下内容：

````
mongod soft nofile 64000
mongod hard nofile 64000
mongod soft nproc 32000
mongod hard nproc 32000
````

3. 保存 limits.conf
4. 重启 mongod (不需要重启操作系统)

> 理论上还要看自身服务器的配置，如果配置并不高，那么即使把可用数量调得很高实际意义也不大。

