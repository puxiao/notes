# MongoDB学习笔记

## 安装MongoDB

#### 软件下载地址

官网提供的软件下载地址：https://www.mongodb.com/try/download/community  

在网页 “On-premises” 中，分别提供企业版和社区版。

- MongoDB-Enterprise-Server：收费的企业版
- MongoDB-Community-Server：免费的社区版

> MongoDB 近期强行修改了免费开源政策(主要针对云厂商)，企业版目前为收费版(所有云服务商提供的MongoDB产品都需要给他们交钱)，社区版为免费版。MongoDB企业版收费之后，会对MongoDB流行度会有一定的影响。

根据操作系统，选择适合的版本和文件格式，并开始下载。

> 点击下载之后网页会跳转到输入个人信息的页面，无需理会。  
> 大约3秒后，会自动开始下载刚才选择的软件安装包。  
> 目前最新稳定版本为 MongoDB 4.2.7  


#### Linux下安装MongoDB

本人的服务器为腾讯云 CentOS 7.6，所以下载时，Platform 这一项选择：RedHat/CentOS 7.0  


#### 第一种安装方式：yum 安装

咨询过腾讯技术人员，腾讯云 yum 默认安装的 MongDB 版本为2.6.12，由于版本过低，所以需要我们手工创建 yum源文件，以便自定义安装MongoDB的版本。

**第1步：使用 vim 命令创建 yum源文件**

文件保存路径为 /etc/yum.repos.d/mongodb-org-4.2.repo，文件内容为：  
 
    [mongodb-org-4.2]
    name=MongoDB Repository
    baseurl=https://repo.mongodb.org/yum/redhat/7Server/mongodb-org/4.2/x86_64/
    gpgcheck=1
    enabled=1
    gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc

> 注意：  
> 上面代码baseurl中 “redhat/7Server/”，“7Server”对应本人的系统版本，你需要根据你的系统版本来修该值。  

> 建议：  
> 1. 不建议将 mongodb-org-4.2.repo 放到别的目录中，虽然没问题但也没什么意义。  
> 2. 本人根本不建议使用 yum安装，因为 yum 安装虽然简单，但也伴随着其他一些问题，例如我不希望yum自动升级该软件，或者我希望自定义 MongoDB 的安装目录等。


**第2步：执行安装命令**

    yum install -y mongodb-org

耐心等待，执行完成后即安装成功。


#### 第二种安装方式：.tgz 安装

**第1步：在指定的目录中，下载 MongoDB对应的 .tgz 安装包**  

目前最新版本文件安装包地址：https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.2.7.tgz  

假设我希望将来 MongoDB 安装目录为系统根目录下的 /software/mongodb/，那么我可以先将 .tgz 文件下载到 software目录中。  

- 下载方法1：先下载该文件，然后通过 xftp 软件上传到服务器指定的目录中(例如根目录下的 software)
- 下载方法2：直接在服务器中，执行下面命令：  

````
wget -P /software/ https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.2.7.tgz
````


> 注意：  
> 如果你不确定服务器上是否安装 wget，可执行 rpm -qa|grep wget，若已安装会显示wget版本号。若未安装则执行 yum install -y wget 即可安装。  


**第2步：解压 .tgz 安装包**  

cd 到 .tgz 下载目录(例如 /software/)，然后执行：  

    tar -zxvf mongodb-linux-x86_64-rhel70-4.2.7.tgz  

解压即安装成功，MongoDB主程序就在 /software/mongodb-linux-x86_64-rhel70-4.2.7/bin/ 中。


**第3步：重命名**

默认MongoDB目录名字有点长，我们可以将其重命名，改为"mongodb"，进入 software 目录中，执行：  

    mv mongodb-linux-x86_64-rhel70-4.2.7 mongodb

这样修改以后，目录名看着清爽简洁多了。  

> 当然你也可以完全忽略这一步，不进行重命名，这样目录名虽然有点长，但是版本标注的很清晰。  


**第4步：创建软连接**

执行：  

    ln -s /software/mongodb/bin/* /usr/local/bin/

软连接创建好后，这样以后在任意目录，都可以执行 mongo 命令。  

> 注意：  
> 若你没有修改默认的 .tgz 解压后的目录名，则执行：  

    ln -s /software/mongodb-linux-x86_64-rhel70-4.2.7/bin/* /usr/local/bin/


**第5步：检测并连接 MongoDB**

任意目录执行：  

    mongo

当看到：  

    MongoDB shell version v4.2.7
    connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
    ...

即表示 MongoDB 安装成功。  


#### Windows下安装(仅限64位系统)
下载软件：https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.6-signed.msi  
安装软件：下一步 下一步，在倒数第2步界面左下角有一个选项“Install MongoDB Compass”，可以取消勾选，稍后单独安装 MongoDB Compass  
运行软件：安装完成后，找到 安装目录\MongoDB\Server\4.2\bin\mongo.exe，运行mongo.exe  
编写测试：  
````
var message = 'hello mongodb'
pritejson(message)
````

注意：当MongoDB安装成功后，会默认自动创建3个数据库 admin、config、local 无需删除这3个，自己可以再新建别的数据库使用。  

#### 安装MongoDB Compass：  
MongoDB Compass 是图形可视化管理MongoDB数据库的工具。若服务器系统为 CentOS 肯定就不用考虑安装这个了，因为服务器根本就没有图形化窗口，但是在 Windows 系统下，非常有必要安装这个软件。  
若在安装 MongoDB 过程中，没有同步安装 MongoDB Compass，需要手工下载并安装。  
下载软件：https://downloads.mongodb.com/compass/mongodb-compass-1.21.2-win32-x64.msi  
安装软件：下一步 下一步  
运行软件：运行MongoDBCompass.exe，进入软件后，先看完软件介绍后，点击继续按钮，即可看到当前本机MongoDB数据状态。  

#### mongod和mongo概念解释

mongod 是 MongoDB 的服务程序，用来创建启动数据库；  
mongo 是连接和操作 mongod 创建的数据库的工具；


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


#### Windows系统启动 mongod 的注意事项

1. 可以使用 mongo.exe 直接连接 mongod所创建的数据库，但是直接运行 mongo.exe 连接时无法设置连接参数，例如端口为27017，无法设置账户密码等。如果 mongod 创建的数据库端口不是 27017，则 mongo.exe 连接失败，窗口会自动关闭，此时只能通过 cmd 命令窗口来连接。
2. windows系统命令窗口下执行 mongod -f mongod.conf 之后，即使成功启动，也不会有任何文字提示。
3. windows系统命令窗口不支持后台运行(fork:true)，因此 启动 mongod 之后，千万不要关闭当前 cmd 命令窗口，因为一旦关闭就相当于把 mongod 也关闭了。 想进行 mongo 命令连接 mongod，只能再新建一个 cmd 命令窗口进行操作。

> 特别注意：
> 1. 需要用 管理员账户 运行 cmd命令窗口
> 2. 启动时，执行的代码是 `mongod.exe -f mongod.conf`  ，一定要注意是 `mongod.exe`

#### 结束mongod进程

执行以下代码：

````
killall -9 mongod
````


## MongoDB优势
MongoDB以JSON文档形式储存数据。  

以下笔记来源于：唐建法的《MongoDB高手课》视频教程  

对于JSON而言：  
1、简单直观：以自然的方式来建模(自由定义数据模型)，以直观的方式与数据库交互(JSON与Object可直接相互转换)。  
2、结构灵活：弹性模式从容相应需求的频繁变化(不要求某集合中所有元素属性都必须一致)。  
3、快速开发：做更少的事，写更少的代码(可直接把数据以Object形式传递给数据库，而不像Mysql那样需要把一条数据中的各个属性拆分出来)。  

不需要考虑错综复杂的关系模型、一目了然的对象模型。  

对于开发人员而言：  
1、灵活：快速响应业务变化，具体表现为：  

- 多形性：同一个集合中可以包含不同字段(类型)的文档对象。即JSON的特性，例如允许某集合中前100名用户有一个属性，而100名以后的用户没有该属性。
- 动态性：线上修改数据模式，修改时应用和数据库均无需下线。 例如某集合所有数据由原来的每条10个属性增加到12个属性，这个操作可以直接在线上操作，无需让数据库先关停修改好后再上线。
- 数据治理：支持使用JSON Schema 来规范数据模式。在保证模式灵活动态的前提下，提供数据治理能力。  简单来说就是MongoDB也可以像Mysql那样对每个表(在MongoDB中叫集合)进行数据格式规范。 

2、快速：JSON模型的快速特性(数据库运行效率、程序员开发效率)
  
- 数据库引擎只需要在一个存储区读写：相对Mysql需要建立多个关联表而言，MongoDB某一集合所有数据均在同一个存储区里。  
- 反范式、无关联的组织极大优化查询速度：对于计算机而言，修改一条数据需要“定位和读写”，而“定位”和“读写”所需要消耗的性能占比，分别为95%和5%。 也就是说对于修改某条数据而言“定位”是最花费时间的。而Mysql通常为多表，不同表之间相互切换定位所花费时间会更多。最为关键的是开发者编写的代码，如果是Mysql需要编写多个表的操作代码，如果是MongoDB则直接操作一个集合即可。  
- 程序API自然，开发快速：JSON非常接近程序员原本的对象操作方式，所以开发效率高。

对于运维人员而言：  
1、原生的高可用和横向扩展能力：  

- 节点 复制集(Replica Set)数量可以是2-50个，默认安装为3个(1个Primary和2个Secondary)
- 自动恢复，若主节点发生故障，从节点可自动恢复替换主节点。
- 支持多中心部署，多中心容灾，数据同步。
- 滚动服务。 例如先只修改其中一个副节点，然后通过 MongoDB复制集 的方式将其他节点都进行修改，从而实现数据库不下线的情况下进行数据库改造升级。  

2、横向扩展能力：  

- 通过分片集群，可以无缝扩展
- 应用全透明
- 多种数据分布策略
- 轻松支持TB-PB数量级

MongoDB技术优势总结：  
1、JSON结构和对象模型接近、开发代码量低  
2、JSON的动态模型意味着更容易响应新的业务变化需求  
3、复制集提供高可用  
4、分片架构支持海量数据和无缝扩容  

## MongoDB 数据库和集合 相关知识

#### 数据结构
MongoDB数据结构为：  
1、MongoDB下面有若干个数据库(db)  
2、每个数据库下有若干个集合(collection)  
3、每个集合里储存若干个文档(JSON格式的数据)  
即：dbs -> db -> collection -> JSON document  

因此，如果想操作某条数据(增删改查)，正确的流程是：  
1、先使用 use xxx 切换到该数据库  
2、明确要修改的集合名字 db.xx  
3、再使用具体的增删改查函数进行操作  

举例：假设moodmap数据库中的user集合要新增一条数据，对应的执行命令为：  
1、use moodmap 切换到moodmap数据库  
2、db.user.insert({'name':'puxiao'})  db.user表示要修改的集合名字为user，insert()为添加数据的函数  

请注意：不可以直接给某数据库添加数据，只能给该数据库下某集合添加数据。  


#### 基础知识
1、当MongoDB安装成功后，会自动创建3个数据库 admin、config、local  
2、与此同时MongoDB还会隐形存在一个数据库 test。若未切换到某具体的数据库，此时若执行向某集合中添加数据命令，那么MongoDB会启用一个名为 test 的数据库，并把数据添加到 test 中。基于这个原因，你自己创建数据库时切忌不要使用 test 来当数据库名字。  
3、如果只创建但是从未添加过数据，则该数据库不会在 MongoDB Compass中出现，使用 use dbs 查看全部数据库也看不到。就好像默认的 test数据库最开始是不显示的，只有在未指定数据库前提下进行某集合数据添加后，MongoDB把这条添加的数据归类到test中，此时 test 数据库才可以被查看到。  
4、在MongoDB的shell命令中，属性名是可以不加引号的，属性值需要加引号，既可以是单引号也可以是双引号。如果属性值是数字，则可不加引号。  


#### 开启、查看、关闭数据库
开启某数据库：use xxx  
查看当前所在数据库：db  
查看全部数据库：show dbs  
关闭当前数据库：db.shutdownServer() 此为优雅关闭数据库的方式，即数据库先把当前全部认为执行完毕后才真正关闭数据库  


#### 查看集合
查看当前所在数据库中的所有集合：show collections  打印出所有集合名字  
返回当前所有数据库中集合名字：db.getCollectionNames()  将所有集合名字以数组形式返回  


#### 配置数据库
配置端口：--port xxxx  
以进程守护方式启动：--fork  
日志输出路径：--loppath xxxx  
数据库路径：--dbpath xxxx  
启动代码示例：mongodb --port 27017 --fork --logpath data/log/mongodb.log --dbpath data/db


#### 创建或切换数据库
命令代码：use xxx  
详细说明：  
1、创建或切换数据库语法关键词：use  
2、xxx 即要创建或切换的数据库名字  
3、若数据库不存在，MongoDB则会创建名为xxx的数据库并切换到该数据库  
4、若数据库已存在，则切换到该数据库  
5、也就是说：无论新创建或是本身已存在，执行use xxx 后都会自动切换到该数据库  

例如，创建数据库moodmap：use moodmap  
若没有moodmap数据库则会创建，若moodmap已存在则切换到该数据库，命令面板会提示：switched to db moodmap  

再次提醒：若数据库没有任何内容，则使用 use dbs 是不会出现的。 就好像上面代码中 执行 use moodmap 创建新的数据库，此时执行 use dbs，moodmap是不会出现在结果列表中的。  


#### 删除数据库或集合
删除数据库  
命令代码：db.dropDatabase()  
详细说明：
1、删除数据库是危险操作，需要谨慎  
2、首先需要确认删除哪个数据库，可以切换到该数据库，例如 use moodmap 或者 查看当前所在数据库 db  
3、执行db.dropDatabase()  即可删除该数据库

删除集合  
命令代码：db.collection.drop() 


#### 重命名 数据库或集合
MongoDB并未提供直接函数可以重命名数据库，但是有针对集合的重命名函数renameCollection()  

针对集合的重命名  
命令代码：db.adminCommand({renameCollection:"dbname.oldname",to:"dbname.newname"})  
详细说明：  
1、"dbname"为当前数据库的名字  
2、"dbname.oldname"为某集合的当前名字，"dbname.newname"为某集合新的名字  
例如 db.adminCommand({renameCollection:"moodmap.user",to:"moodmap.users"})，将数据库moodmap中集合user名字改为users  

2、不光可以修改集合名，还可以修改集合对应的数据库名 dbname   
例如 db.adminCommand({renameCollection:"moodmap.user",to:"mymap.user"})，将数据库moodmap中的集合user 转移到 数据库mymap中的集合user。  

注意：这种“转移”属于“修改元数据”，是对索引的修改，并不会真正重新复制出一份，因此这种修改消耗很小。  

修改集合对应的数据库，存在以下几种结果：  
1、若mymap.user本身就存在，则会转移失败，反之则会成功。  
2、若mymap本身不存在，则会自动创建mymap。  
3、若moodmap里面只有user 一个集合，那么转移成功后 moodmap 即为空数据库，那么此时 show dbs 或在 MongoDB Compass中将无法再看到 moodmap。  

基于上面对于某数据库中的集合重命名操作，我们可以变相实现对数据库的重命名。  
假设当前数据库为moodmap，我们希望将数据库重命名为mymap。  
实施思路：将moodmap中所有的集合都通过重命名形式，转移到mymap中，这样moodmap为空数据库则会消失(use dbs 或在 MongoDB Compass中消失)，而新的数据库mymap总拥有原moodmap所有集合，变相实现将moodmap重命名为mymap。  

示例代码：

    let source = "source";
    let dest = "dest";
    let colls = db.getSiblingDB(source).getCollectionNames();
    for (let i = 0; i<colls.length; i++) {
      let from = `${source}.${colls[i]}`;
      let to = `${dest}.${colls[i]}`;
      db.adminCommand({renameCollection: from, to: to});
    }

备注：MongoDB 4.2 支持ES6中的新语法，例如 let 和 模板字符串  


## 增删改查 相关知识
对数据库进行 增删改查，例如“添加数据”准确含义为“向某数据库中的某个集合中添加JSON文档类型的数据”。  

#### 添加数据
命令代码：db.xxx.insert(json)  
详细说明：  
1、添加数据语法关键词：insert  
2、json即要添加的数据，格式为JSON  
3、若要添加多条数据，则可使用数据，例如：[json1,json2]  
4、添加时MongoDB会自动为该条数据添加 _id 的属性值。  
5、若不想使用MongoDB默认的_id值，需要提前在json数据中心设定 _id属性。  

特别强调：  
1、若我们向db.xxx添加数据时，db.xxx根本不存在，MongoDB会自动为我们创建 xxx 这个集合。  
2、对于比较新的MongoDB版本，可以使用insertOne(json)和insertMany([json1,json2,...])来分别添加1条或多条数据。  


#### 查找数据
命令代码：db.xxx.find({})  
详细说明：  
1、查找数据语法关键词：find  
2、{}为查找条件  

- db.xxx.find() 参数为空，则表示条件不限，查找全部  
- {} 空对象，则表示条件不限，查找全部
- {name:'puxiao'} 包含某属性值得JSON对象，则表示查找name为‘puxiao’的数据


#### 条件比较查询
命令代码：db.xxx.find({age:{$xx:value}})
详细说明：  
1、满足对比条件才可以被查询到  
2、$xx:value中 $xx为比较计算的类型，value为比较的对象值  

$xx 对应含义：  

- $gt 存在并大于
- $gte 存在并大于等于
- $lt 存在并小于
- $lte 存在并小于等于
- $eq 存在并等于
- $ne 不存在 或 存在并不等于
- $in 存在并在指定数组中
- $nin 不存在 或 存在但不在指定数组中
- $exists:false 不存在(未定义)
- $exists:true 存在(有定义)


#### 多条件查询
and条件查询  
命令代码：db.xxx.find({name:'puxiao',age:18}) 或 db.xxx.find($and:[{name:'puxiao'},{age:18}])  
详细说明：  
1、多个条件(属性值)必须同时满足才可以被查询到  

or条件查询  
命令代码：db.xxx.find($or:[{name:'puxiao'},{age:{$lt:30}}])
详细说明：  
1、只要有1个条件(属性值)满足要求即可被查询到  


#### 使用正则表达式查询
命令代码：db.xxx.find({name:/xxxxx/})  
详细说明：  
1、/xxxxx/ 为一个正则表达式，只要满足该表达式的值都可以被查询到。  
举例：db.xxx.find({name:/^p/})  查找属性name值是以p为开头的数据  

#### 针对子文档进行查询
所谓子文档值：JSON文档数据中某属性值依然为一个JSON对象。  

例如使用下面命令插入一条数据：
db.mood.insert({type:'happy',why:{wealth:'500w',wife:'beautiful'}})  
其中属性why的值也是一个JSON文档，那么why就是这条数据的子文档。  

针对子文档里的数据查询，使用命令代码：  
db.mood.find({'why.wealth':'500w'})  

请注意：上述代码中属性名为 'why.wealth'，即表示 mood集合下属性why下的子文档属性wealth  


#### 针对子文档 多条件多字段查询 
命令代码：db.xxx.find({'why.wealth':'500w','why.wife':'beautiful'})  
可写成另外一种形式：  
db.xxx.find({'why':{$elemMatch:{wealth:'500w',wife:'beautiful'}}})  
详细说明：  
1、$elemMatch 为关键词，表示必须全部满足  


#### 获取属性值
命令代码：'$xxx"  
详细说明：  
1、假设有一条数据为 {"name":"puxiao","age":34}，那么 'age' 表示属性名，属性名前面加上 $ 即表示属性值，例如 '$age' 表示age的属性值。  



#### 遍历游标
命令代码：xxx.hasNext()、xxx.next()  
详细说明：  
1、声明 xxx 为某个查询结果  
2、可通过 while(xxx.hasNext()){xxx.next()} 来循环遍历查询结果
3、hasNext()即表示‘是否还有下一个’  
4、next()即表示‘将游标切换到下一个’


#### 查询修饰符
命令代码：limit(num)、sort({name:-1|1})  
详细说明：
limit(num) 用来限定返回结果数量，例如limit(10)表示最多返回10条结果即可。  
举例：db.xx.find({}).limit(10)  

sort({xxx:-1}) 用来设定按降序排序，如果是sort({xxx:1})则表示按升序排序。  
举例：db.xx.find({}).sort({age:-1}) 按属性age的降序排序  


#### 查询结果统计
命令代码：db.xxx.find({}).count()  
详细说明：使用count()函数可对结果数量进行统计  


#### 控制查询返回结果
命令代码：db.xxx.find({},{_id:0,name:1})  
详细说明：  
1、在find()函数中添加第2个参数，该参数为一个JSON对象  
2、若属性值为1，表示可以返回该属性名和属性值  
3、若属性值为0，表示不返回该属性名和属性值  
4、由于默认一定会返回_id，所以若不需要返回_id则需要显式声明 _id:0  
5、没有提及的属性名，均不会返回  

限定返回字段这个在MongoDB里被称为 投影(projection)。

#### 格式化输出打印结果
命令代码：pretty()  
详细说明：  
1、在查找命令结尾处，添加.pretty()即可格式化输出打印结果  

例如：db.xxx.find().pretty()    


#### 删除数据
命令代码：db.xxx.remove(json)  
详细说明：  
1、删除数据语法关键词：remove  
2、json为我们要删除对象的条件
3、删除对象的条件和查找数据的条件，语法一模一样  

- db.xxx.remove() 参数为空，运行则会报错
- {} 删除所有数据  
- {age:28} 删除所有属性age值为28的数据  
- {age:{$lt:18}) 删除所有属性age值小于18的数据  

注意：删除默认是‘批量多条’的操作行为。  


#### 更新数据
命令代码：db.xxx.update(json,{$set:json2},{xx})  
详细说明：  
1、update()函数有2个必填参数和1个可选参数  
2、第1、第2个参数为必填，第3个参数为可选参数  
3、第1个参数为查询条件  
4、第2个参数为需要修改的属性与值，格式需要遵循 {$set:{'xx':value}} 的格式。若不使用$set:而是第2个参数直接为{'xx':value}，那么意味着直接整体覆盖。  
5、第3个参数为可选参数，为更新选项设置  

举例：db.xxx.update({age:18},{$set:{'age':34}}) 将属性age值为18的数据修改为age值为34  

第3个更新选项配置，一共有3个属性，分别是：

- upsert 当原本不存在要修改对象时是否添加该对象，默认为false，即不添加。请注意这里说的是 对象不存在，而不是对象属性不存在  
- multi 是否为更新多条数据，默认为false，即只更新1条

举例：db.xxx.update({age:18},{$set:{'age':34}},{multi:true}) 查找属性age值为18的数据，并将他们的属性age值全部修改为34  

如果要同时修改多条数据，除了设置第3个参数multi为true之外，还可通过使用db.xxx.updateMany()。

对于insertOne()和insertMany()来说，函数中必须使用到以下关键词之一，若不使用则会报错：  
$set 如果匹配到，则 设置该值  
$unset 如果匹配到，则删除该属性  
$push 如果匹配到，则 添加一个值到数组结尾  
$pushall 如果匹配到，则 添加多个值到数组结尾  
$pop 如果匹配到，则 从数组结尾处剔除一个值  
$pull 如果匹配到，则 从数组中删除一个值  
$pullall 如果匹配到，则 从数组中删除全部对应的值  
$addToSet 如果不存在则增加一个值到数组    


#### 添加或更新数据
命令代码：db.xxx.save(json)  
详细说明：  
1、json表示一个JSON格式的文档数据  
2、若json中没有_id属性，则插入该条数据  
3、若json中有_id属性，则会通过_id查找是否存在该_id的数据  
4、若_id对应的数据原本存在，则将json完全替换原来数据  
5、若_id对应的数据原本不存在，则插入该条数据，但是该数据的_id不再使用MongoDB默认的，而是使用json本身中的_id属性值

以上为MongoDB基础用法，接下来才会真正触及MongodDB真正核心，高级用法：聚合查询  


## 聚合查询

#### 什么是MongoDB聚合查询？  
MongoDB聚合框架(Aggregation Framework)是一个计算框架，可以作用在一个或几个集合中，对集合中的数据进行一系列运算，并将运算结果转化为期望的形式。这种多集合、多维度、多条件、多形式、多组合的查询方式就称为聚合查询。  

注意：聚合查询也称为聚合运算，名字不同但是表示的是同一个意思。  

补充说明：  
1、像db.xxx.find(query) 这种只是针对单一集合进行一些条件查询，并返回原始数据的，可以称之为“最简单基础的查询”  
2、像db.xxx.find(query).sort(xxx) 或 db.xxx.find(query).limit(10) 针对查询结果又进行了处理，例如排序或只获取限定数量的查询，姑且称之为“稍微复杂点的查询”  
3、而聚合查询则是设定多项查询条件、逐层筛检、累计运算、设定返回结果格式的，就可以称之为“比较复杂的查询”。现实中项目开发肯定使用最多的还是聚合查询。  

举例：假设有一个数据库存放全班学生的数学考试成绩  
1、使用db.xxx.find()可以查找出所有人的数学成绩  
2、使用db.xxx.find().sort()可以列出所有人的数学成绩排名  
3、若此时想查询所有学生的数学平均成绩，平均成绩这个字段原本是不存在的，此时就需要通过聚合查询，计算并返回出平均成绩。  

#### 管道(pipeline)和步骤(stage)
聚合查询(聚合运算)的整个查询(运算)过程称为管道，查询(运算)过程由多个步骤组成。  

聚合查询整个过程是：
1、从第一个步骤开始，计算得到结果  
2、从第一个结果开始，进行第二个步骤，并得到第二步骤的结果  
3、依次类推，直到最后一个步骤计算完成  
4、将最终的计算结果返回给查询主体  

原始数据 -> 步骤1 -> 结果1 -> 步骤2 -> 结果2 -> ... -> 最终结果  

数据结果就好像是水，流经一个又一个管道，经过每个管道的过滤，最终剩下的水到达目标出口。  

#### 聚合查询基础格式
命令代码：db.xxx.aggregate([stage1,stage2,...],{options})  
详细说明：
1、聚合查询使用关键词 aggregate  
2、aggregate函数共2个参数  
3、第1个参数为一个数组，数组中每一项均代表一个查询运算步骤  
4、第2个参数为一个对象，是查询运算的配置选项  

#### 常见查询运算步骤

- $sort 排序
- $limit 限定返回结果数量
- $unwind 将某个数组拆分成独立的元素(类似JS中的...array)
- $match 过滤数据，必须全部满足条件
- $skip 跳过指定数量，返回剩余的结果
- $group 将集合中的文档分组，可用于统计结果
- $project 修改输出的文档解构，可以重命名、增加、删除域，也可以创建计算结果
- $geoNear 输出接近某一地理位置的有序文档  
- $lookup 多表关联操作

$match、$project、$group 这3个是常见的、核心的、包裹其他查询的运算符。  

#### 特有步骤 $bucket和$facet
$bucket这个步骤可用于将数据按照某一种维度自动分组查询。常见的应用场景是搜索商品时，按不同价格区间进行查询。  

$facet这个步骤是将多组$bucket进行查询，从而实现多维度查询。例如搜索商品时，按不同价格区间、不同品牌、不同类型等多维度分组查询。  


## 更多API详情
MongoDB全部API请访问：https://docs.mongodb.com/manual/reference/  

补充：无论是MongoDB中文网(https://www.mongodb.org.cn/) 还是 MongoDB中文社区(https://mongoing.com/) ，他们上面关于MongoDB的中文API文档都存在版本比较滞后、不是最新、不够全面的问题。  
因此学习时，还是以英文官方API文档为好。  
