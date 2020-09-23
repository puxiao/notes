# Taro调试H5网络POST请求注意事项

### 第1：检查是https还是http

Taro.request 只可以用来请求 https，不可以请求 http，如果是请求 http，要改用 axios。

```
npm i --save axios
```

> 如果使用 Taro.request 去请求 http，服务端是获取不到 body 内容的。



### 第2：检查是否存在跨域

如果本机项目(本地测试)请求后端API，一定存在跨域。
如果仅仅是为了内部测试，最简单的解决跨域方法为：在 服务端 的 ctx.response 中添加 允许跨域请求 的配置。

```
ctx.response.set('Access-Control-Allow-Origin', '*')
```



### 第3：安装 qs 并对 axios 进行配置

如果使用 axios 进行网络请求，由于不是所有浏览器都支持 URLSearchParams，所以为了兼容性，建议使用 qs 进行 数据封装。

#### 安装 qs

```
npm i --save qs
```

#### 配置 axios

一共 2 处配置：

1. 给 headers 添加 'Content-Type': 'application/x-www-form-urlencoded'，如果不修改则依然会提示 跨域问题。
2. 使用 qs 封装需要发送的数据

示例代码如下：

```
import axios from 'axios'
import qs from 'qs'

axios.post( 
        'http://xxxx/login',
        qs.stringify( { uid: 'puxiao', pwd: '123456' } ),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
    )
    .then((res) => {
        if (res.status === 200) {
            console.log(res.data)
        } else {
            console.log('服务器返回状态码有问题')
        }
    })
    .catch((err) => {
        console.log(err)
    }
)
```

对于 服务端来说，例如 koa，可是使用 koa-bodyparser 正常来解析得到 ctx.request.body.xx
