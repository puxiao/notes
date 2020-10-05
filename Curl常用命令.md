# curl常用命令

## curl简介

curl 即 client URL 的简写，使用 shell 命令来发送URL请求。



## curl默认请求命令

**最基础的 curl 默认请求命令：**

```
curl www.puxiao.com
```

**默认请求注意事项：**

1. 默认以 GET 方式请求 目标网址(URL)
2. 若目标网址(URL)存在跳转，默认并不会返回跳转后的网址内容

例如 上面代码中 `curl www.puxiao.com` 中 `www.puxiao.com`，事实上会返回304状态，默认跳转到 `https://www.puxiao.com`。但是默认 curl 并不会请求跳转后的网址，而仅仅返回 `www.puxiao.com` 本身的内容。



## curl设置Headers(请求标头)

-H 参数用来直接设置 Request Headers 中的字段。

**添加Content-Type字段：**

```
curl -H 'Content-Type: application/json' https://puxiao.com
```

**同时添加多个字段：**

```
culr -H 'Content-Type: application/json' -H 'Accept-Language: zh-CN' https://puxiao.com
```



## curl设置Headers中的User-Agent(用户代理标头)

-A 参数指定客户端的用户代理标头，即 Request Headers 中的 User-Agent，默认 curl 请求用户代理标头值为 curl/[version] 。

**将 User-Agent 设置成 Chrome 浏览器：**

```
curl -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36' https://puxiao.com
```

**移除 User-Agent ：**

```
curl -A '' https://puxiao.com
```

-A为设置 User-Agent 标头，也可以通过 -H 直接设置 Request Headers：

**直接使用 -H 来添加，达到同样效果：**

```
curl -H 'User-Agent: xxxx' https://puxiao.com
```



## curl设置headers中的Referer(来源)

-e 设置 headers 中的 Referer(请求的来源)。

**设置 Referer：**

```
curl -e 'https://www.baidu.com/' https://puxiao.com
```

**直接使用 -H 来添加，达到同样效果：**

```
curl -H 'Referer:https://www.baidu.com' https://puxiao.com
```



## curl设置请求随服务器重定向

-L 参数会让请求跟随服务器的重定向。例如之前举得例子：`curl www.puxiao.com`，由于服务器上会进行 http跳转至 https，首先返回 304，然后将网址跳转至 `https://www.puxiao.com`，若添加 -L 参数则可让请求返回重定向后的网页内容。

**设置请求跟随重定向：**

```
curl -L www.puxiao.com
```

> 此时会返回重新定向后的 `https://www.puxiao.com` 的内容



## curl发送和保存cookie

-b 参数用来向请求中携带 cookie。

**携带1个cookie参数：**

```
curl -b 'uname=puxiao' https://puxiao.com
```

**携带多个cookie参数：**

```
curl -b 'uname=puxiao;id=px1986' https://puxiao.com
```

> 2个参数之间使用 分号(;) 连接

**读取并携带本地 cookie.txt 文件内容：**

```
curl -b cookie.txt https://puxiao.com
```

**接收并写入本地 cookie.txt 文件内容：**

```
curl -c cookie.txt https://puxiao.com
```



## curl设置请求方式

-X 参数用来设置请求方式。默认不设置，请求方式为 GET 。

**设置为POST请求方式：**

```
curl -X POST https://puxiao.com
```



## curl使用POST请求

-d 参数用来设置发送 POST 请求的数据体。注意：若使用了 -d 参数，则自动会在请求 headers 中添加：Content-Type: application/x-www-form-urlencoded，并且自动将请求方式转为 POST，因此无需额外设置 -X POST 。

> 注意：-d 参数默认是不会对数据体进行 URL 编码的
> 例如：`curl -d 'msg=hello world' https://puxiao.com` 中 `hello world`中的空格可能会造成数据错误。

**设置请求数据体：**

```
curl -d 'uid=puxiao&pwd=123456' https://puxiao.com/login
```

或者将多个数据体中的字段单独定义

```
curl -d 'uid=puxiao' -d 'pwd=123456' https://puxiao.com/login
```

**读取本地文件内容作为数据体：**

```
curl -d '@data.txt' https://puxiao.com/login
```

> 注意要在 data.txt 文件前面加上 @ 符号以表示这个为文件路径

**设置数据体并自动URL转码：**

--data-urlencode 参数等同于 -d，并且会自动将数据进行 URL 转码。

```
curl --data-urlencode 'msg=hello world' https://puxiao.com/write
```

**POST发送JSON数据：**

除了设置数据体，重点还要设置 headers 中 Content-Type 的值。

```
curl -d '{"uid":"puxiao","pwd":"123456"}' -H 'Content-Type : application/json' https://puxiao.com/login
```



## curl构造GET请求参数

curl 默认即 GET 请求方式，例如：`curl https://puxiao.com/search?a=2&b=3` ，但是也可以通过 -G -d 结合形式来构造 GET 请求参数。

**构造GET请求参数：**

```
curl -G -d 'a=2;b=3' https://puxiao.com/search
```

或

```
curl -G -d 'a=2' -d 'b=3' https://puxiao.com/search
```

> 上述代码最终执行效果，等同于：`curl https://puxiao.com/search?a=2&b=3`

原本 -d 参数会让请求自动变为 POST，但是加上 -G 之后会让请求方式变为 GET，并且 数据体 自动构建成 GET 请求的参数。

**再次提醒：**-d 并不会进行参数 URL 转码，因此如果使用 -G ，更多时候应该使用 --data-urlencode 。



## curl上传文件

-F 参数用来设置向服务器上传二进制文件。

**上传二进制文件：**

```
curl -F 'file=@aa.jpg' https://puxiao.com/upload
```

> 默认会自动给 headers 中添加：Content-Type: multipart/form-data，然后将文件 aa.jpg 作为 file 字段上传。

**指定 MIME 类型：**

```
curl -F 'file=@aa.jpg;type=image/jpg' https://puxiao.com/upload
```

**指定文件名：**

```
curl -F 'file=@aa.jpg;filename=bb.jpg' https://puxiao.com/upload
```

> 上述命令中，原始文件名为 aa.jpg，但是服务器接收到的文件名为 bb.jpg



## curl打印返回信息头(Respone Headers)

-i 参数打印出服务器返回信息头(respone headers)。

**先打印出返回信息头，再打印出网页内容：**

```
curl -i https://puxiao.com
```

> 会先打印出返回信息头，然后空一行，再打印出网页内容

**仅引出返回信息头，不打印网页内容：**

```
curl -I https://puxiao.com
```

--head 等同于 -I，因此上述命令也可以写成：

```
curl --head https://puxiao.com
```



## curl跳过SSL检测

-k 参数可以指定跳过 SSL 检测，不会去检查服务器 SSL 证书是否正确。

**跳过SSL检测：**

```
curl -k https://puxiao.com
```



## curl模拟网速带宽

--limit-rate 用来限制 请求和回应 的网速(网络带宽)，可以模拟出网速不好的情况。

**模拟限制网速带宽：**

```
curl --limit-rate 200k https://puxiao.com
```

> 模拟每秒 200k 的带宽情况下的请求和回应



## curl保存文件

-o 参数将服务器回应的内容保存成文件，等同于 wget 命令。

**以xxx.xx名字保存文件：**

```
curl -o index.html https://puxiao.com
```

> 上述命令会将网页返回内容保存为 index.html 文件。



**直接保存文件：**

-O 参数将服务器回应的内容保存成文件，并且将 URL 的后面部分直接当做文件名。

```
curl -O https://puxiao.com/me.jpg
```

> 会直接将文件以 me.jpg 的名字保存到本地

**文件保存位置：**论使用哪种保存参数，文件保存目录均为 终端 shell 命令中 当前所在的目录。



## curl控制输出信息

默认情况下，curl 若不发生错误 则输出返回的网页内容，若发生错误，则输出错误信息。

**仅输出正确的返回信息，不输出错误和进度信息：**

-s 参数将设置不输出错误和进度信息。

```
curl -s https://puxiao.com
```

> 因为添加有 -s ，即使请求发生错误也不输出任何错误信息。

**仅输出错误信息，不输出正确的返回信息：**

-S 参数将设置仅输出错误信息

```
curl -S https://puxiao.com
```

**设置不输出任何信息(错误信息和正常的返回信息)：**

-o /dev/null 参数将设置不输出任何信息

```
curl -s -o /dev/null https://puxiao.com
```

> 上述命令，无论 curl 是否遇到错误，均不输出任何信息



## curl设置服务器认证信息(用户名和密码)

-u 参数用来设置服务器认证的用户名和密码

**设置服务器认证信息：**

```
curl -u 'puxiao:123456' https://puxiao.com/login
```

补充说明：

1. 用户名和密码之间，使用冒号(:)分割连接。
2. 自动会在请求 headers 中添加：Authorization: Basic Ym9iOjEyMzQ1

**识别URL中的用户名和密码：**

curl会自动识别 URL 中的用户名和密码，格式为：用户名:密码@URL，例如：

```
curl https://puxiao:123456@puxiao.com/login
```

**后期补齐密码：**

```
curl -u 'puxiao' https://puxiao.com/login
```

> 上述命令只设置了用户名，执行后，curl 会提示需要输入密码，注意此时输入密码时，为了密码安全，是不会有任何输入光标变动提示的(无法看到已输入密码长度)。



## curl通信过程中的调试

-v 参数输出通信的整个过程，用于调试。

**调试更新整个过程：**

```
curl -v https://puxiao.com
```

> 会打印出请求过程中的一些细节，例如 请求对应的IP地址、request headers、respone headers等

**显示接收到的二进制数据：**

--trace - 参数可以打印出接收数据过程中的原始二进制数据

```
curl --trace - https://puxiao.com
```



## curl设置请求代理

-x 参数用来指定请求的代理。

**设置请求代理：**

```
curl -x socks5://puxiao:123456@xxxx.com:8080 https://puxiao.com
```

通过请求 xxxx.com:8080的 socks5 代理发出请求。

如果没有指定代理协议，默认为 http 协议，例如：

```
curl -x puxiao:123456@xxxx.com:8080 https://puxiao.com
```

> 上面的请求中，会使用默认的 http 协议作为代理协议，等同于：`curl -x http://puxiao:123456@xxxx.com:8080 https://puxiao.com`