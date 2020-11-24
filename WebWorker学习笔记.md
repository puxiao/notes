# WebWorker学习笔记

## WebWorker简介

**Web Worker的由来：**

默认浏览器中运行的 JavaScript 是单线程，Web Worker 的作用就是为 JS 创建多线程环境，允许主线程创建 Web Worker 线程，并负责计算密集型或高延迟的任务。

1. Web Wokrer 线程负责计算密集型或高延迟的任务
2. 主线程只需要负责 UI 交互，这样页面更加流畅



**Web Worker 注意事项：**

1. 同源限制：Web Worker 只能接受同源下的 JS 分配的任务。
2. DOM限制：Web Worker 无法读取和操作 DOM 对象，无法使用 document、window、parent 这些对象，但可以使用 navigator 和 location。
3. 通信限制：Web Worker 只能通过消息与主线程 JS 通信。
4. 脚本限制：Web Worker 不能执行 alert()、confirm()，但可以使用 XMLHttpRequest对象发出 AJAX 请求。
5. 文件限制：Web Worker 不能读取本地文件，即不能打开本地文件系统(file://)，所加载的脚本必须来自网络。



**浏览器支持情况：**

目前主流的现代浏览器都支持 Web Worker。

> IE9 之前的浏览器不支持。

如何判断当前浏览器是否支持 Web Worker ？  
答：通过 typeof 查看是否存在 Worker 构造函数

```
if(typeof Worker !== 'undefined'){
    //支持 Web Worker
}
```

或者

```
if(typeof Worker === 'function'){
    //支持 Web Worker
}
```



**与之对应的SharedWorker：**

Web Worker 是用来创建一个 JS 线程，主线程与Worker线程相互独立。

与之对应的还有另外一个函数 SharedWorker，这个函数目前浏览器支持度没有 Web Worker 高，他的作用是 将多个 JS 线程共享一个线程，包括共享该线程上的数据。 SharedWorker 不再本文讨论范文内。

> 所谓多个 JS 线程，例如主窗口中的 JS 线程与该窗口中内嵌 IFrame 中的 JS 线程。

关于 SharedWorker 更多知识，请访问：https://developer.mozilla.org/zh-CN/docs/Web/API/SharedWorker



## WebWorker基本用法

### 主线程对应的操作

**创建Web Worker**

```
let worker = new Worker('work.js')
```

解释说明：

1. 通过 new Worker() 的方式来实例化一个 Web Worker

2. 构造函数中的参数 `work.js` 就是 Web Worker 线程所需要执行的任务。

3. work.js 必须位于网络上，不可以是本地的 JS 文件。

   > 也就是说 Web Worker 必须运行服务器环境中，不可以在本地直接使用。

4. 如果加载 work.js 出错，例如 404，那么 Web Work就会创建失败



**主线程向Web Worker发送消息**

```
worker.postMessage('hello')
worker.postMessage({name:'puxiao',age:18})
```

解释说明：

1. 主线程向 Web Worker 实例发送消息 通过 postMessage() 方法
2. postMessage()的参数可以是 JS 支持的各种数据类型：字符串、对象、数组、二进制数据等。



**主线程接收Web Worker发回的消息**

```
worker.onmessage = function (event) {
    console.log(event.data)
}
```

解释说明：

1. 主线程通过添加 onmessage 事件处理函数，来接收 web worker 发回的消息。
2. event.data 为发回的消息的具体内容



**主线程监听Web Worker错误**

```
worker.onerror(function(eve){
    console.log(eve.lineno) //错误代码行号
    console.log(eve.filename) //错误代码文件名
    console.log(eve.message) //错误代码文字内容
})
```

或者

```
worker.addEventListener('error',function(eve){
    ...
})
```

解释说明：

1. web worker 也是通过这样方式监听错误的



**主线程监听 onmessageerror 错误**

```
worker.onmessageerror(function(eve){ ... })
```

或者

```
worker.addEventListener('onmessageerror',function(eve){ ... })
```

解释说明：

1. 当发送数据无法序列化成字符串时，会触发这个错误。



**主线程关掉Web Worker**

```
worker.terminate()
```

解释说明：

1. 当 web worker 不再需要工作时，主线程可以通过 terminate() 将其终止。



### WebWorker线程对应的操作

**监听主线程发送的消息**

```
addEventListener('message',function(eve){
  console.log(eve.data)
},false)
//上述代码中其实隐含的是 this.addEventListener(...)，但是在 TS 语法下 this 会被报有可能未定义，因此还是不写 this 为好。
```

或者

```
self.onmessage=function(eve){
  console.log(eve.data)
}
//请注意，这里是 self 而不是 this
```

解释说明：

1. Web Worker 内部，可以使用 addEventListener() 或 self.onmessage 来监听主线程发送的消息。
2. event.data 为消息内容。



**向主线程发送消息**

```
self.postMessage(xxx)
```

解释说明：

1. Web Worker 与主线程都通过 poseMessage() 来向对方发送消息。



**加载其他脚本文件**

```
importScripts('xxxx.js')
```

若要同时加载多个 JS：

```
importScripts('aaa.js','bbb.js')
```

解释说明：

1. 再次重申：加载的 JS 文件必须位于网络，不可以是本地文件



**Web Worker监听错误**

```
self.onerror(function(eve){
    console.log(eve.lineno) //错误代码行号
    console.log(eve.filename) //错误代码文件名
    console.log(eve.message) //错误代码文字内容
})
```

或者

```
addEventListener('error',function(eve){
    ...
})
```

解释说明：

1. 主线程也是用这种方法监听错误的



**WebWorker监听 onmessageerror 错误**

```
self.onmessageerror(function(eve){ ... })
```

或者

```
addEventListener('onmessageerror',function(eve){ ... })
```

解释说明：

1. 当发送数据无法序列化成字符串时，会触发这个错误。



**WebWorker主动关掉自己**

```
self.close()
```

解释说明：

1. Web Worker 可以通过 close() 主动关掉(终止)自己。



### 基本用法总结

**主线程：**

| 操作内容            | 对应代码                                     |
| ------------------- | -------------------------------------------- |
| 创建 we worker 实例 | let worker = new Worker('xxx.js')            |
| 发送消息            | worker.postMessage(xxx)                      |
| 接收消息            | worker.onmessage = function(eve){ eve.data } |
| 监听错误            | worker.onerror(function(eve){ ... })         |
| 监听发送消息错误    | worker.onmessageerror(function(eve){ ... })  |
| 关闭 web worker     | worker.terminate()                           |

**WebWorker线程：**

| 操作内容         | 对应代码                                   |
| ---------------- | ------------------------------------------ |
| 发送消息         | self.postMessage(xxx)                      |
| 接收消息         | self.onmessage = function(eve){ eve.data } |
| 加载脚本         | importScripts('xxx.js')                    |
| 监听错误         | self.onerror(function(eve){ ... })         |
| 监听发送消息错误 | self.onmessageerror(function(eve){ ... })  |
| 关闭自身         | self.close()                               |



## 数据通信

在前文已经讲过，主线程与Web Worker之间通过 postMessage(xxx) 方式进行互发消息(数据)。

默认情况下，这种消息数据是直接深度拷贝一份，是传值而不是引用。worker 对通信数据所作的修改并不会影响主线程中该数据。



**直接拷贝数据的弊端**

这样每次都是直接将数据拷贝一份也存在弊端，假设传输的数据是二进制数据(File、Blob、ArrayBuffer)，且数据非常大，几十兆以上，那么直接拷贝反而会影响性能。

为了解决大文件二进制数据的传递问题，JS 允许直接把二进制数据转移给Web Worker线程。转移之后主进程不再拥有对二进制数据的控制权。

这种 二进制数据控制权转义的方法，叫 Transferable Objects。

> 其实和 Nodejs 中 pige 非常相似

通常在影像处理、声音处理、3D 运算场景下，都会采用这种方式。



**具体实现的代码：**

```
let arrBuffer = new ArrayBuffer(1)
worker.postMessage(arrBuffer,[arrBuffer])
```

> 这样操作后，相当于搭建好了 pige 数据管道，以后主线程中再对 arrBuffer 中的任何数据写入都会直接让  web worker 获取到。



## Worker新建Worker

顾名思义，就是 worker 内部再创建 worker。

> 目前有极少数浏览器支持该功能。

在 worker 中新建 worker 的方式和主线程新建 worker 的方式完全相同。也是通过 new Worker(‘xxx.js’) 方式实例化的。

**使用场景：**

假设有一个非常大量的计算任务，那么可以将该任务拆分成 N 个小任务，同时创建 N 个worker，向每一个 worker 通过 postMessage(xxx) 发送执行各自任务的消息。最终再将所有 worker 的计算结果汇总在一起。 



## 页面内嵌WebWorker代码

前文中讲到，主线程通过 let worker = new Worker('work.js') 的方式，加载远程 work.js 文件，其中 work.js 文件即 WebWorker 要执行的处理任务内容。

假设我们不希望通过 加载 的方式，而是将 work.js 内容内嵌到网页中，该如何实现呢？

**第1步：将 work.js 内容嵌入到 <body\> 之中**

```
<html>
    <title>worker<title>
    <body>
        <script id='worker' type='app/worker'>
        //work.js 内容
        ...
        </script>
    </body>
</html>
```

特别提醒：上述代码中 <script\> 标签中的 type 值不能写成 text/javascript，目前写成 app/worker 目的是为了让浏览器不认识这个值，因此浏览器也不会当成普通 JS去 执行。

> 使用 <script\> 标签的目的是为了让我们在编写时有 JS 语法提示。

**第2步：使用 createObjectURL() 来模拟加载 work.js**

```
//先模拟要加载 work.js 文件，事实上文件内容是从 DOM 中获取到的
let blob = new Blob([document.querySelector('#worker').textContent])
let url = window.URL.createObjectURL(blob)

//将模拟记载的地址作为参数来实例化 web worker
let worker = new Worker(url)

//实例化好后，可以进行其他任意操作
worker.postMessage = function (eve){
    ...
}
```

特别提醒：上述代码中 Blob 属于 ES 草案新增内置构造函数，不是所有浏览器都会支持的。



## React内嵌WebWorker代码

**React使用WebWorker的困境：**

根据本文前面叙述，你应该了解：

1. 创建 Web Worker 时，需要传入包含任务的 JS 代码路径
2. 也可以将 任务 JS 代码内嵌到网页 HTML 中，通过 createObjectURL() 来模拟加载 任务 JS

但是以上 2 种方式在 React 项目中都不可以。

因为 React 最终会将 所有的 JS 打包为一个 JS 文件，所以直接传入 任务 JS 文件路径的方式是不行的。如果你使用的是 React + TypeScript，那么这种方案更加不合理，总不能任务代码不采用 TS 语法来写吧。

> 除非你把写好的任务 JS 文件放入 public 目录中，这样避免被 react 打包，不过这种变相解决的方式也不够好。



**React使用WebWorker的解决方案：**

正确的使用方式，其实和内嵌网页的方式原理相同。

```
//workcode 中是用来编写和存放 work 任务 JS 的
const workcode = () => {
    setInterval(() => {
        postMessage({
            action: 'updateTime',
            time: 'aaaa'
        }, 'timer')
    }, 1000)

    onmessage = (eve: MessageEvent) => {
        console.log(eve)
    }
}

let code = workcode.toString()
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'))

const blob = new Blob([code], { type: 'application/javascript' })
const workscript = URL.createObjectURL(blob)

export default workscript
```

```
import workscript from './work'
...

let worker = new Worker(workscript)
```

