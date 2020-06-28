# Koa中间件之Mongodb

## 安装

#### 安装

```
npm i --save mongodb
```

#### 若使用TypeScript，还需安装

```
npm i --save-dev @types/mongodb
```



## 连接数据库

> 特别说明：由于本人在Koa项目中使用TypeScript，所以引入或导出模块的方式和默认Koa的方式不同。

连接的简单示例：

```
import Mongodb from 'mongodb'
const  MongoClient = Mongodb.MongoClient;

const config = {
    url:'mongodb://username:password@host/dbname',
    option:{
        useUnifiedTopology: true,
    },
    dbName:'dbname',
    collectionName:'collectionname'
}

//上面的代码中，将认证信息(用户名、密码、用户认证数据库)直接写在了 url 中，还可以写在 option 中，例如下面代码
const config2 = {
    url:'mongodb://host',
    option:{
        useUnifiedTopology: true,
        auth: {
            user:'username',
            password:'passwor'
        },
        authSource:'dbname'
    },
    dbName:'dbname',
    collectionName:'collectionname'
}

const client = new MongoClient(config.url,config.option)

client.connect((err,client) => {
    if(err !== null){
        //连接失败
        console.log(err)
    }else{
        //连接成功
        console.log('connected successfully...')
        
        //连接到某集合
        // const collection = client.db(config.daName).collection(config.collectionName);
        const db =  client.db(config.daName);
        const collection = db.collection(config.collectionName);
        
        //向该集合写入一条数据
        conllection.insertOne({name:'puxiao'},(err) => {
            if(err){
                console.log(err)
            }else{
                console.log('inserOne succefully...')
            }
        })
    }
    //关闭连接
    client.close()
});
```

#### 补充说明

1. 若无用户认证，则url为：mongodb://host
2. 若有用户认证，则url为：mongodb://username:password@host/dbname
3. 若密码中包含 '%'，则url中要将 '%' 改为 '%25'，否则会报错误：MongoParseError: URI malformed, cannot be parsed
4. 若密码中包含 '%'，但是密码写在了 option 中，则不需要将  '%' 改为 '%25







