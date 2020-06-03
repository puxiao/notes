# MongoDB事务开发

## 写事务

#### 什么是 writeConcern ？

writeConcern 决定一个写操作落到多少个节点上才算成功。writeConcern 的取值包括：  

- 0：发起写操作，不关心是否成功
- 1~集群最大数据节点：写操作需要被复制到指定节点数才算成功
- majority：写操作需要被复制到大多数(超过半数)节点上才算成功
- all：全部节点都写入才返回成功，弊端是若某个节点出现问题会导致一直处于全部阻塞中。

发起写操作的程序将阻塞到写操作到达指定的节点数为止。  

> 注意：  
> 默认MongoDB所谓的“写入成功”指写入到节点内存即算成功，无需等待数据真实写入硬盘(落盘)。


> journal则定义如何才算成功：  
> - true：写操作落到 journal 文件中才算成功  
> - false：写操作到达内存即算成功  

writeConcern 设置代码格式如下：

````
{
  writeConcern:{w:"majority",j:true,wtimeout:3000}
}
````

#### 注意事项

1. 虽然多于半数的 writeConcern 都是安全的，但通常只会设置 majority，因为这是等待写入延迟时间最短的选择。
2. 不要设置 writeConcern 等于总节点数，因为一旦有一个节点故障，所有写操作都将失败。
3. writeConcern 虽然会增加些操作的延迟时间，但并不会显著增加集群压力，因此无论是否等待，写操作最终都会复制到所有节点上。设置 writeConcern 只是让写操作等待复制后再返回而已。
4. 应对重要数据，应使用 {w:"majority"}，普通数据可以应用{w:1} 以确保最佳性能。


## 读数据

在读取数据的过程中，我们需要关注以下两个问题：  

1. 从哪里读？ 关注数据节点位置
2. 什么样的数据可以读？关注数据的隔离性

第一个问题是由 readPreference 来解决。  
第二个问题是由 readConcern 来解决。  

#### readPreference

readPreference 决定使用哪个节点来满足正在发起的请求。  
可选值包括：  

1. primary：只选择主节点
2. primaryPreferred：优先选择主节点，如果不可用则选择从节点
3. secondary：值选择从节点
4. secondaryPreferred：优先选择从节点，如果从节点不可用则选择主节点
5. nearest：选择最近的节点


#### readPreference 场景举例

1. 用户下订单后马上将用户转到订单详情页——primary/primaryPreferred。 因为此时从节点可能还没复制到新订单。

2. 用户查询自己下过的订单——secondary/secondaryPreferred。查询历史订单时效性通常没有太高要求。

3. 生成报表——secondary。报表对时效性要求不高，但资源需求大，可以在从节点上单独处理，避免对线上用户造成影响。

4. 将用户上传的图片分发到全世界，让各地用户能够就近读取——nearest。 每个地区的应用选择最近的节点读取数据。


#### readPerference 与 Tag

readPerference 只能控制使用一类节点，Tag 则可以将节点选择控制到一个或几个节点。  

考虑以下场景：  

- 一个5个节点的复制集
- 3个节点硬件较好，专用于服务线上客户
- 2个节点硬件较差，转用于生成报表

可以使用 Tag 来达到这样的控制目的：  

1. 为3个较好的节点打上{purpose:"online"}
2. 为2个较差的节点打上{purpose:"analyse"}
3. 在线应用读取时指定 online，报表读取时指定 reporting。


#### 如何配置 readPreference ？

有3种配置方式：  

第1种：通过 MongoDB 的连接串参数  
mongodb://host1:27107,host2:27107,host3:27107/?replicaSet=rs&readPreference=secondary  

第2种：通过 MongoDB 的驱动程序 API  
MongoCollection.withReadPreference(ReadPreference readPref)  

第3种：Mongo Shell  
db.collection.find({}).readPref("secondary")  


#### 注意事项

1. 指定 readPreference 时也应注意高可用问题。例如将 readPreference 指定 primary，则发生故障转移不存在 primary 期间将没有节点可读。 如果业务允许，则应选择 primaryPerferred。  

2. 使用 Tag 时也会遇到同样的问题，如果只有一个节点拥有一个特定 Tag，则在这个节点失效时将无节点可读。 这在偶时候是期望的结果，有时候不是。 例如：  

- 如果报表使用的节点失效，即使不生成报表，通常也不希望将报表负载转移到其他节点上，因此只有一个节点报表 Tag 是合理的选择。  
- 如果线上节点失效，通常希望有替代节点，所以应该保持多个节点有同样的 Tag。

3. Tag 有时需要与优先级、选举权综合考虑。例如做报表的节点通常不会希望它称为主节点，则优先级应为 0 。


#### 什么是 readConcern ？

在 readPreference 选择了指定的节点后，readConcern 决定这个节点上的数据哪些是可读的，类似于关系数据库的隔离级别。  

可选值包括：  

- available：读取所有可用的数据
- local：读取所有可用且属于当前分片的数据
- majority：读取在大多数节点上提交完成的数据
- linearizable：可线性化读取文档
- snapshot：读取最近快照中的数据


#### available 和 local

在复制集中 local 和 available 是没有区别的。两者的区别主要体现在分片集上。  

考虑以下场景：  

- 一个 chunk x 正在从 shard1 向 shard2迁移
- 整个迁移过程中 chunk x 中的部分数据会在 shard1 和 shard2中同时存在，但源分片 shard1 仍然是 chunk x 的负责方
    - 所有对chunk1的读写操作仍然进入 shard1
    - config 中记录的信息 chunk x 仍然属于 shard1
- 如果此时读 shard2，则会体现出 local 和 available 的区别：
    - available：shard2 上有什么就读什么(包括 x)
    - local：只取应该由 shard2 负责的数据(不包括 x)

**注意事项：**

1. 虽然看上去总是应该选择 local，但毕竟对结果集进行过滤会造成额外消耗。 在一些无关紧要的场景(例如统计)下，也可以看考虑 available。

2. MongoDB <= 3.6版本，不支持对从节点使用 {readComcern:"local"}

3. 从主节点读取数据时默认 readConcern 是 local，从从节点读取数据时默认 readConcern 是 available(向前兼容原因)。


#### majority 的实现方式

节点上维护多个 x 版本，MVCC机制：  
MongoDB通过维护多个快照来链接不同的版本，每个被大多数节点确认过的版本都将是一个快照，快照持续到没有人使用为止才被删除。

#### majority 与 脏读(读到的数据是不干净的)

MongoDB 中的回滚：  

- 写操作到达大多数节点之前都是不安全的，一旦主节点崩溃，而从节点还没复制到该次操作，刚才的写操作就丢失了。
- 把一次写操作视为一个事务，从事务的角度，可以认为事务被回滚了。

所以从分布式系统的角度来看，事务的提交被提升到了分布式集群的多个节点级别的“提交”，而不再是单个节点上的“提交”。

在可能发生回滚的前提下考虑脏读问题：  

- 如果在一次写操作到达大多数节点前读取了这个写操作，然后因为系统故障该操作回滚了，则发生了脏读问题。

使用{readConcern:"majority"} 可以有效避免脏读。


#### 如何实现安全的读写分离

场景举例：向主节点写入一条数据，立即从从节点读取这条数据。

如何保证自己能读到刚刚写入的那条数据？

答：使用 writeConcern + readConcern majority来解决。  

````
db.orders.insert({oid:34},{writeConcern:{w:"majority")});

db.orders.find({oid:34}).readPref("secondary").readConnern("majority");
````

#### linearizable

只读取大多数节点确认过的数据。和 majority 最大差别是保证绝对的操作现行顺序。

> 注意：  
> 1. 只对读取单个文档时有效
> 2. 可能导致非常慢的时候，因此总是建议配合使用 maxTimeMS。


#### snapshot

{readConcern:"snapshot"} 只在多文档事务中生效。将一个事务的 readConcern 设置为 snapshot，将保证在事务中的读：  

- 不出现脏读
- 不出现不可重复读
- 不出现幻读

因为所有的读都将使用同一个快照，直到事务提交为止该快照才被释放。  


## 多文档事务

MongoDB 4.2 开始全面支持了多文档事务，但并不代表大家应该毫无节制地使用它。相反，对事务的使用原则应该是：能不用尽量不用。  

通过合理地设计文档模型，可以规避绝大部分使用事务的必要性。

为什么？  
事务=锁、节点协调，额外开销，性能影响。


#### MongoDB ACID 多文档事务支持

多行，多表，多文档 一次性完成或都一个也不完成(数据回滚)，这就叫 多文档事务。


| 事务属性 | 支持程度 |  
| ---- | ---- |  
| Atomocity 原子性 | 单表单文档、复制集多表多行、分片集群多表多航 |  
| Consistency 一致性 | writeConcern，readConcern |  
| Isolation 隔离性 | readConcern |  
| Durability 持久性 | Journal and Replication |  


#### 事务的隔离级别

- 事务完成前，事务外的操作对该事务所做的修改不可访问。

- 如果事务内使用 {readConcern:"snapshot"}，则可以达到可重复读 Repeatable Read。


#### 事务写机制

MongoDB 的事务错误处理机制不同于关系数据库：  

- 当一个事务开始后，如果事务要修改的文档在事务外部被修改过，则事务修改这个文档时会触发 Abort 错误，因为此时的修改冲突了。

- 这种情况下，只需要简单地重做事务就可以了。

- 如果一个事务已经开始修改一个文档，在事务以外尝试修改同一个文档，则事务外的修改会等待事务完成后才能继续进行。  


**注意事项：**  
     
- 可以实现和关系型数据库类似的事务场景
- 必须使用与MongoDB 4.2兼容的驱动
- 事务默认必须在60秒(可修改调整)内完成，否则将被取消
- 涉及事务的分片不能使用仲裁节点
- 事务会影响 chunk 迁移效率。正在迁移的 chunk 也可能造成事务提交失败(重试即可)
- 多文档事务中的读操作必须使用主节点读
- readConcern 只应该在事务级别设置，不能设置在每次读写操作上。  

