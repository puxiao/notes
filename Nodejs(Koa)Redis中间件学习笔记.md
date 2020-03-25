# Nodejs(Koa)Redis中间件学习笔记


## Nodejs(Koa)中安装redis中间件
官方给出的安装代码为：`npm install redis --save`

实际安装中会报错，安装失败，需要改为cnpm安装。 安装代码为：  
`cnpm install --save redis`  或者  `npm install --save redis --registry=https://registry.npm.taobao.org`

## 名词说明
redis server：服务器(或调试本机)上的真正的redis服务，下文简称redis server或redis服务。  
nodejs redis middleware：Nodejs Redis中间件，下文简称redis。

## 创建client实例，并且连接redis server
连接redis服务通常需要3个必要配置元素：ip、port(端口)、password(redis server密码)

nodejs里代码如下：  
    const redis = require('redis');  
    const client = redis.createClient(6379,'127.0.0.1',{password:'xxxx'});


一般redis服务和Nodejs(Koa)在同一台主机，因此ip可以是127.0.0.1，redis服务默认端口6379，如果未曾改过端口，且redis没有密码，那么代码可以简化为  
    const client = redis.createClient();

如果使用腾讯云服务器，在购买服务器和云Redis数据库时，必须2者在同一区域内才可以。  
比如部署nodejs的云服务器内网IP：172.17.0.16、云Redis数据库内网IP：172.17.0.12，则连接代码为：  
    const client = redis.createClient(6379,'172.17.0.12',{password:'xxxx'});


## 监听redis各种事件

client.on('connect',() => {
    console.log('redis connect...')
});

client.on('ready',() => {
    console.log(`redis is readied, redis_version is ${client.server_info.redis_version}`);
});

client.on('reconnecting',() => {
    console.log('redis reconnecting...')
});

client.on('error',err => {
    console.log(err)
});

client.on('warning',err => {
    console.log('warning',err)
});


## 设置(添加)、获取redis的值

redis数据类型有：string (字符串)、hash (哈希表)、list (列表)、set (集合)、zset (有序集)

对各种数据类型的设置或获取，在nodejs redis中间件中的各种设置或获取的语法和redis服务语法一致。

比如在服务端使用redis-cli的方式来执行命令： set koa good 

对应在nodejs redis里的语法是：

    client.set('mynode','koa',(err,reply) =>{
       if(err){
          //添加获取失败处理代码
          return;
       }
       console.log(reply);//输出执行返回值
    });

若针对key同时设置多条field的value，例如mset示例代码：

    client.mset('mynode','nodejs','koa',(err,reply) =>{ });
    //或
    client.mset('mynode',['nodejs','koa'],(err,reply) =>{ });
    //或
    client.mset(['mynode','nodejs','koa'],(err,reply) =>{ });

无论那种数据类型对应的操作语法都以此类推，不再过多叙述。  

如果你刚接触redis，还没有掌握redis服务的操作语法，你可以先去学习redis服务语法。  
掌握了redis服务语法后能够很轻松对应到nodejs redis语法函数。

欢迎去查看我的“[Redis学习笔记.md](https://github.com/puxiao/notes/blob/master/Redis%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)”，里面有我记录的常见Redis服务语法。


## Nodejs Redis 其他函数

获取redis版本号：  
client.server_info.redis_version

复制出另外一份同样配置的客户端实例  
let client2 = client.duplicate();

客户端断开redis连接(无论当前是否还有其他正在执行的命令)  
client.end();

客户端断开redis连接(如果当前有正在执行的命令，则等待这些命令都执行完成后才会真正断开)  
client.quit();

批量执行命令 但不关心执行结果：  
client.batch([['set','mynode','nodejs'],['set','mynode','express'],['set','mynode','koa']]);

批量执行命令 并关心执行结果：  
client.multi([['set','mynode','nodejs'],['set','mynode','express'],['set','mynode','koa']]).exec((err,reply) => { });


## 特别说明：

有2个函数，目前我个人并不是很理解，也不清楚具体应用场景。

1、信道 on/publish  
具体代码实例和解释，请自己百度或参考npm redis官网文档。

2、watch()  
在批量操作某个key过程中，如果有其他人也操作这个key，会使原本正常的命令变得异常。
为了解决这个问题，可以使用watch函数，把批量操作命令包裹到watch函数中。
例如：
client.watch("mynode",watchErr => {
   if(watchErr) throw watchErr;
   client.multi(.......
});

如果想针对某个哈希类型的某个field，可以使用  
client.watch('key','field',watchErr => {...});

上述学习笔记，若有不正确的地方，欢迎指正。
