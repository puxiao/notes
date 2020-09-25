# Koa中使用JWT(Token)

## Cookie、Session、Token对比

| 类型    | 原理                                                         |
| ------- | ------------------------------------------------------------ |
| Cookie  | 把 `用户标识` 以字符串形式存储到用户浏览器Cookie中，当客户端向服务器请求数据时携带上Cookie，服务端程序根据Cookie判断是哪个用户，并进行后续操作 |
| Session | 把 `用户标识` 在客户端和服务器都保存一份，对于客户端来说依然采用 Cookie 形式储存，当客户端向服务器请求数据时携带上 Cookie，服务端程序对比服务器端的 Session 和 客户端的 Cookie，进行二次确认(验证)，当验证通过后才进行后续操作 |
| Token   | 把 `用户标识` 转化并加密(添加签名)成另外一种形式：Token(令牌、通行证)，然后把 Token 返回给客户端，当客户端向服务器请求数据时携带上 Token，服务端程序对 Token 按照既有的解密规则进行解密，如果能够顺利解密即判定 Token 有效，可以进行后续操作 |

| 类型    | 客户端是否保存 | 服务端是否保存 |
| ------- | -------------- | -------------- |
| Cookie  | 保存           | 不保存         |
| Session | 保存           | 保存           |
| Token   | 保存           | 不保存         |

| 类型    | 特点                                                         | 缺点                                                         |
| ------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Cookie  | 原始、操作简单                                               | 1、安全性差：Cookie容易被盗用、服务端没有二次验证<br />2、跨域问题：不同域名下的Cookie会产生跨域问题 |
| Session | 在Cookie基础上进行了服务端二次验证<br />安全性得到提高       | 1、分布式差：服务端储存Session的方式决定了无法同步到多台服务器上 |
| Token   | 服务端可以进行二次验证(根据解密规则进行验证)，<br />却不用存储客户令牌 | 1、在令牌有效期内，服务端中途无法撤回已发送给客户端的令牌，除非服务端做有特殊处理。 |

> 为了防止 token 被泄漏，建议使用 https 传输



## JWT简介

JWT是单词 JSON Web Token 的简写，即 通过 JSON 进行 Web Token 的一种实现形式。



##### JWT运行的原理和流程

1. 客户端(用户浏览器) 发起网络请求，携带(使用POST形式)用户名和密码
2. 服务端接收用户名和密码，并向数据库中进行验证，若验证匹配成功，根据 用户标识 生成 JWT(Token)
3. 服务端将 JWT(Token) 返回给客户端，客户端将 Token 存储到本地

4. 当客户端需要发送请求时，将 JWT(Token) 内容填充到请求的 Head 头部信息中的 authorization 标签内、或者放在 POST 请求的消息体里。
5. 服务端解析收到的 JWT(Token)，查看令牌有效期，并根据既有的解密规则进行解密，若顺利解密则视为用户登录验证成功
6. 服务端执行客户的请求操作，并返回结果

补充说明：
个别时候需要将 Token 通过 URL 形式进行传递，Token 为 Base64 编码，而 URL 是 Base64URL 编码，因此 JWT(Token) 中的 3 个特殊字符会被替换掉，等号( = ) 会被省略、加号( + ) 会被替换为中划线( - ) 、斜杠( / ) 会被替换为下划线( _ )

> 不推荐使用 URL 传递 Token。



##### JWT的形态和构成

令牌初始形态为 JSON，经过签名加密后变化为一个字符串，并通过 . 进行分割，最终 JWT 形态为：header.payload.signature

| 组成部分            | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| Header(头部)        | 声明 令牌 的类型和加密方式、内容默认固定为：{"alg": "HS256","typ": "JWT"} |
| Payload(荷载、负载) | 令牌包含的有效信息，官方定义了7个字段，也可以添加自定义字段<br />(此处仅为个人理解：所谓载荷，即承载数据的主体。类似的一个场景是：当我们使用 http POST 请求时，Request Rayload 就对应携带着数据的 body ) |
| Signature(签名)     | 针对 Payload 进行加密所需要用到的签名，即加密和解密时用到的 key |

> 注意事项：
>
> 1. 不要将敏感数据 通过自定义字段 添加到 Payload 中，因为 JWT 默认不加密，即使其他人不知道签名，也可以读取出来。



##### 附：HS256 与 RS256 的差别

| 加密方式                                    | 是否对称算法                      |
| ------------------------------------------- | --------------------------------- |
| HS256(HMAC-SHA256)：带有 SHA-256 的 HMAC    | 对称算法，只有1个秘钥             |
| RS256(RSA-SHA256)：采用 SHA-256 的 RSA 签名 | 非对称算法，有2个秘钥(公钥和私钥) |

> HMAC是英文 Hash-based Message Authentication Code（哈希运算消息认证码）的简写



##### 附：JWT官方定义Payload中的7个字段

| 字段名                | 含义     |
| --------------------- | -------- |
| iss (issuer)          | 签发人   |
| exp (expiration time) | 过期时间 |
| sub (subject)         | 主题     |
| aud (audience)        | 受众     |
| nbf (Not Before)      | 生效时间 |
| iat (Issued At)       | 签发时间 |
| jti (JWT ID)          | 编号     |



## 关于加密中的秘钥(key)

在正式学习使用 JWT 之前，需要先了解一些关于加密中 `秘钥(key)` 的知识

jsonwebtoken 在生成令牌时，可以使用 2 种秘钥方式进行加密：

1. 最简单的：通过使用 普通字符串 来加密
2. 较复杂的：通过使用 RSA 非对称加密(共钥和私钥)



如果计划使用最简单的，通过字符串 来混淆加密，那么可以跳过剩下部分，直接进入 jsonwebtoken 安装使用章节。

如果计划使用 RSA 非对称加密，则需要认真阅读以下知识点。

> 事实上对于普通 单站点 来说，以上两种加密方式安全性基本没有什么差异，选哪一种都可以。
> RSA 更加适用于 多站点 的应用场景。



### 生成公钥和私钥文件

假设我们使用 RSA 加密，首选需要获得(生成)自己的 公钥和私钥 文件。

#### 生成方式一：通过安装使用 openssl 软件来创建

第1步：下载并安装 openssl ：http://slproweb.com/products/Win32OpenSSL.html，根据自己当先系统，选择安装对应的 Light 版本即可。 

第2步：以管理员身份，运行 xxxx\OpenSSL-Win64\bin\openssl.exe

第3步：依次执行下面 2 行命令

```
openssl genrsa -out rsa_private_key.pem 1024
openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
```

> 注意：上述命令开头的 openssl 并不需要输入

如果顺利，执行结果如下，即表示生成 公钥 和 私钥 完成

```
OpenSSL> genrsa -out rsa_private_key.pem 1024
Generating RSA private key, 1024 bit long modulus (2 primes)
......................................+++++
...................+++++
e is 65537 (0x010001)
OpenSSL> rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
writing RSA key
OpenSSL> 
```

第4步：在 xxxx\OpenSSL-Win64\bin\ 目录下，找到刚才生成的两个文件 rsa_private_key.pem、rsa_public_key.pem 这两个文件分别对应 私钥和公钥。并把这2个文件 拷贝到 Koa 项目中。

> 你可以重命名这两个文件，甚至还可以将文件后缀修改为 .key，对 Koa 来说，文件后缀是什么并不重要。



#### 生成方式二：通过在线网站来创建

第1步：通过搜索 “RSA在线生成”，可以找到一些工具类网页，例如：http://web.chacuo.net/netrsakeypair/

第2步：根据网页提示，在线生成得到 公钥 和 私钥（特别强调：不要添加 **证书密码**），然后复制对应的公钥和私钥文本内容，在本机创建记事本，粘贴并修改文件后缀格式，得到 private.key 和 public.key 文件

第3步：将 private.key 和 public.key 拷贝到 Koa 项目中。



> 无论哪种生成 RSA 秘钥方式，现在已经得到了 公钥和私钥 文件，接下来就可以进入 jsonwebtoken 具体实践当中。



## token 运行流程

复习回顾一下 JWT运行的流程，便于理解后面的代码逻辑。

#### 运行流程 2 个大的环节

1. 首次登陆时，服务端生成 token 并返回给客户端
2. 客户端提交各数据种操作请求时(通过前后端约定好的API)，携带 token 发送给服务端，服务端验证 token 合法性后，再进行后续其他操作



#### 发送或携带 token 的 3 种实现方式

| 实现方式                                                     | 使用建议                                           |
| ------------------------------------------------------------ | -------------------------------------------------- |
| 方式1：通过给 request 或 response 的 header 添加 authorization 标签 | 强烈推荐                                           |
| 方式2：将 token 内容添加 POST 请求的 body 中                 | 被限定只能是 POST 请求，GET 请求则使用不了这种方式 |
| 方式3：将 token 内容添加到 URL 中                            | 不推荐                                             |



## JWT实现

Koa 中常见可用的 JWT 第 3 方模块有：jwt-simple 或 jsonwebtoken，根据 NPM 平台对两者周使用频率，相对来说 jsonwebtoekn 更高一些，所以以下采用 jsonwebtoken 为例来演示如何使用。



### 安装 jsonwebtoken

```
npm i --save jsonwebtoken
npm i --save-dev @types/jsonwebtoken
```



#### jsonwebtoken最核心的3个函数

| jsonwebtoken核心函数 | 作用                                                         |
| -------------------- | ------------------------------------------------------------ |
| sign()               | 生成(加密) token 的负载(payload)                             |
| verify()             | 异步方式 验证签名并解析 token 的负载(payload)                |
| decode()             | 同步方式 解析 token 的负载(payload)，<br />注意：decode() 并不会去验证 token 签名是否正确，因此实际代码中我们用到的是 verify() |

> 从 jsonwebtoken 官方介绍上来看，verify() 和 decode() 差一点并不是简单的 同步或异步，官方的原文是：
>
> Returns the decoded payload without verifying if the signature is valid.
> 返回解码后的有效负载，而不验证签名是否有效。
>
> 总之，我们需要使用 verify() ，不使用 decode()



#### 补充说明

使用 jsonwebtoken 的 sign() 函数时，如果你没有 给负荷(Payload) 添加上 iat 签发时间，jsonwebtoken 会自动 添加。

注意：无论是 iat(签发时间) 还是 exp(过期时间)，时间戳以秒为单位，而不是毫秒 。

> 正因为会自动添加 iat(签发时间戳) 字段，这就造成 我们生成的 每一个 token 中的 payload 都会不一样。



除 token 约定的 7 个字段外，还可以添加其他自定义字段。

当然 负荷(Payload) 中你也可以什么都不添加。

将来 验证(解密) token 时就以是否可以成功 解密 视为 token 验证是否成功评判规则。

> 从我个人目前理解的角度来讲，我会在负荷(Payload) 中添加 用户ID ，验证(解密) 时可以进一步通过 token 负荷(Payload) 中的 用户ID 和 网络请求中携带的用户ID来进行比对，从而再进一步验证用户合法性。
> 但是 payload 默认又不加密，具体我这样的做法到底是否真的会提高安全性，我是存疑的。



#### 函数示例代码

下面的示例代码中，会在 负荷(Payload) 中添加 uid:"puxiao" 这个自定义字段。

##### 示例代码1：使用简单的字符串来作为加密key

```
import jwt from 'jsonwebtoken'

//生成 token
const token = jwt.sign({ uid: 'puxiao' }, 'woshikey')
console.log(token)
//得到的 token 为字符串，格式为 xxxx.xxxx.xxxx ：
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJwdXhpYW8iLCJpYXQiOjE2MDEwMTIyNDR9.rQ9hPuMUot_OUvvzafrikZ3rn2Dshb-sMsjcXqaUpZk


//解密 token
const decoded = jwt.verify(token,'woshikey')
console.log(decoded)
//得到解密后的 负载 对象：{ uid: 'puxiao', iat: 1601012244 }
//其中 iat: 1601012244 是 jwt 自动添加的 签发日期时间戳

```



##### 示例代码2：使用 RAS 公钥和私钥进行加密解密

```
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

//生成 token
const privateKey = fs.readFileSync(path.resolve(__dirname, 'key/private.key'))
const token = jwt.sign({ uid: 'puxiao' }, privateKey, { algorithm: 'RS256' })
console.log(token)
//eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJwdXhpYW8iLCJpYXQiOjE2MDEwMTMwMzh9.pHLgf2eLa92dxXEukiY3VViW3n5seozO5GoHfWJ5uiEk6omqD_fYWcyA6gG4-zSese_7eajo2nAS0pmykG03FkfMoZ4WTfjIAHWgXVCPgj9sdHslQYiCwxP5PlWvkK2RQNrcEOvdIPpsyc5d6wclNMnmHmcyIY7fv8zJ2Kn-Ack

//解密 token
const publicKey = fs.readFileSync(path.resolve(__dirname, 'key/public.key'))
const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
console.log(decoded)
//{ uid: 'puxiao', iat: 1601013038 }
```



#### 分析token字符串

我们知道 token 字符串形式为 xxxx.xxxx.xxxx ，分析上面 2 种加密 token 的结果：

| token结构           | 原始的值                      | 加密后值                             | 是否相同                                                     |
| ------------------- | ----------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| Header(头部)        | {"alg": "HS256","typ": "JWT"} | eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9 | 完全相同                                                     |
| Payload(荷载、负载) | { uid: 'puxiao' }             | eyJ1aWQiOiJwdXhpYW8iLCJpYXQ...       | 大体上相同：前半部分完全相同，结尾处稍有不同是因为自动添加的时间戳不同 |
| Signature(签名)     |                               |                                      | 完全不同                                                     |

以上分析再次印证以下几个知识点：

1. 使用普通字符串作为加密 key 或使用 RS256 加密，只是提高了签名的复杂程度，他们都不针对 payload 进行加密。
2. 不要将敏感重要信息添加到 Payload(荷载、负载) 中，因为其他人即使没有正确的签名，也可以通过反向解析得到 payload 中的内容，例如 jsonwebtoken 中的 decode() 函数。



#### 处理 token 未通过验证

上面代码中，解密 token 时都直接使用了  const decode = jwt.verify()，但实际中，我们还要考虑未通过验证的情况，因此实际代码中，更多采用的是 try..catch 、或者 向 verify() 添加回调函数 callback，以此来添加未通过验证的处理代码。

实际项目中，关于解密 token 的代码，应该是这样的：

```
//通过 try...catch 来处理
try {
    const decoded = jwt.verify(token, 'woshikey')
    console.log(decoded) //{ uid: 'puxiao', iat: 1601013038 }
} catch (error) {
    //此处添加 token 未通过验证时的处理代码
}


//通过添加 回调函数 来处理

jwt.verify(token, 'woshikey', (err, decoded) => {
    if (err === null) {
        //token验证通过
        console.log(decoded)
    } else {
        //token验证未通过
        //此处添加相应的未通过处理代码
    }
})

//或者

const publicKey = fs.readFileSync(path.resolve(__dirname, 'key/public.key'))
jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err === null) {
        //token验证通过
        console.log(decoded) //{ uid: 'puxiao', iat: 1601013038 }
    } else {
        //token验证未通过
        //此处添加相应的未通过处理代码
    }
})
```

同理，生成 token 对应的 sign() 函数，也会存在 生成 token 失败的情况，因此也推荐使用  try..catch 或 添加回调函数。



#### 在Koa中使用回调函数特别注意事项

##### 回调函数的陷阱：回调函数不会阻塞进程

无论是 sing() 还是 verify()，如果你使用 回调函数，在 koa 项目中一定要注意，这里有一个不太明显的陷阱——回调函数并不会阻塞进程，因此你在回调函数中关于 ctx.body 或 ctx.response.set() 任何操作，虽然看上去他们确实执行了，但都不会真正反馈给前端页面，前端页面收到的反而是 404 错误。



造成这个现象的原因，是因为你直接在回调函数中对 ctx  的操作，时机并不对，koa 其实先执行了 await next()，然后才执行了回调函数。

> 对于 koa 来说，如果 ctx.body(ctx.response.body) 为空，那么 koa 就直接返回给前端页面 404



例如，你不小心把代码写成以下形式，那么你就会落入这个陷阱中

```
const loginRouter = async (ctx,next) => {

    const uid = ctx.request.body.uid
    const pwd = ctx.request.body.pwd
    
    if(uid === 'xxx' && pwd === 'xxx'){
        jwt.sign(
            { uid },
            key, 
            (err, token) => {
                if (err === null) {
                    ctx.response.set('authorization', token)
                    ctx.body = { res: 1 }
                } else {
                    ctx.body = { res: 0 }
                }
            }
        )
    }

    await next()
}
```

> 以上代码如果不实际运行，真的不太能够想到会产生bug



##### 解决方式：使用 promise 来包装 callback

通过使用 promise 来让回调函数变成可以阻塞进程，进而避免上面提到的陷阱。



### 用户登录 示例

用户发起登录请求，POST 方式，携带用户名和密码，koa 验证用户身份后(得到用户ID)，将生成 token 和 用户id，以及其他客户端需要用到的信息，例如 昵称 等，一并返回给客户端。

客户端在接收到 token 和 用户ID 后，需要将 它们 保存到 cookie(网页) 或者 storage(微信小程序) 中，这里就不再展示 客户端保存的代码了。

```
const key = 'woshikey'

const loginRouter = async (ctx,next) => {
    
    const uid = ctx.request.body.uid
    const pwd = ctx.request.body.pwd
    
    if(uid === 'xxx' && pwd === 'xxx'){
       await new Promise((resolve, reject) => {
            jwt.sign(
                { uid },
                key, 
                (err, token) => {
                    if (err === null) {
                        ctx.response.set('authorization', token)
                        ctx.body = { res: 1 }
                        resolve(true)
                    } else {
                        ctx.body = { res: 0 }
                        reject(false)
                    }
                }
            )
        }).catch(() => {})
    } else {
        ctx.body = {
            res: 0
        }
    }
    
    await next()
}
```



### 用户其他数据操作 示例

客户端发动其他网络请求时，携带 用户ID、token 和其他信息，koa 验证 token 后才允许执行后续其他操作。

```
const key = 'woshikey'

const addRouter = async (ctx,next) => {
    
    const uid = ctx.request.body.uid
    
    //使用 promsie 先阻塞进程，待回调函数执行完成后，再进行后面的操作
    const boo = await new Promise((resolve, reject) => {
        const token = ctx.headers.authorization
        const uid = ctx.request.body.uid
        if (token && uid) {
            jwt.verify(
                token,
                key,
                (err, decoded) => {
                    if (err === null) {
                        resolve(true)
                    } else {
                        reject(false)
                    }
                })
        } else {
            reject(false)
        }
    })
    
    if(boo === false){
        //说明 token 未通过验证，此处添加对应的处理代码
        //可以和客户端约定返回特殊的错误编号，告知客户端 token 有问题，重新登录吧
    }
    
    //上面 boo 为 true，表明通过了验证，那接下来可以进行其他后续操作
    ...
    
    await next()
}
```



### 将 token 抽离出来

因为有非常多的路由都需要做 token 验证，所以，我在实际项目中会将 token 的生成和验证单独提取出来，做成一个模块供 路由处理函数 调用。

下面这段代码有以下几点说明

1. 采用了 TypeScript 编写
2. 把 uid 放入到 负载中(payload)
3. 采用 RS256 作为签名
4. 无论是否真的能够提高安全性，我还是在 验证时进行了 payload 中的 uid 和 body 中的 uid 进行了对比。

此处代码仅供参考：

```
import fs from 'fs'
import path from 'path'
import { Context } from 'koa'
import jwt from 'jsonwebtoken'

interface Decoded {
    uid: string,
    [key: string]: any
}

const privateKey = fs.readFileSync(path.resolve(__dirname, '../', 'xxx/private.key'))
const publicKey = fs.readFileSync(path.resolve(__dirname, '../', 'xxx/public.key'))

export const jwtSign: (uid: string) => Promise<string> = (uid) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                uid
            },
            privateKey,
            {
                algorithm: 'RS256'
            },
            (err, token) => {
                if (err === null) {
                    resolve(token as string)
                } else {
                    reject(false)
                }
            })
    })
}

export const jwtVerify: (ctx: Context) => Promise<boolean> = async (ctx) => {
    return new Promise((resolve, reject) => {
        const token = ctx.headers.authorization as string
        const uid = ctx.request.body.uid as string
        if (token && uid) {
            jwt.verify(
                token,
                publicKey,
                {
                    algorithms: ['RS256']
                },
                (err, decoded) => {
                    if (err === null) {
                        if ((decoded as Decoded).uid === uid) {
                            resolve(true)
                        } else {
                            reject(false)
                        }
                    } else {
                        reject(false)
                    }
                })
        } else {
            reject(false)
        }
    })
}

export const checkToken = async (ctx: Context) => {
    const boo = await jwtVerify(ctx)
    if (boo === false) {
        return
    }
}
```



### token 过期时间

#### token过期时间与安全性

上面所有的示例代码中，payload 中 并未设置 过期时间(exp)，如果不设置，那么相当于 token  永不过期，实际这样做是非常不安全的。

比如我们希望给 token 设置 1天后过期，对应代码：

```
//过期时间单位不是毫秒，而是秒
jwt.sign( { Math.floor(exp:Date.now() / 1000) + 24 * 60 * 60 }, key, (err,token) =>{} )
```

当 jwt.verify() 验证解析 token 后，可以通过读取 exp 值 结合服务器的时间，来判断 token 是否过期，并作出相应处理。

通常情况下的做法是 告知客户端 token 过期，请再次发送登录，以获得新的 token，并再次发起刚才的网络数据请求，这样一波操作可以让用户并没有感受到 中间发生了什么。



#### 附：过期时间值的其他设置形式

exp 除了设置数字(时间单位为秒)外，还支持设置为字符串，不同字符串格式表示不同时间跨度，例如：

"10h"：10小时

"1day"：1天

更多设置，参见官网：https://www.npmjs.com/package/jsonwebtoken





