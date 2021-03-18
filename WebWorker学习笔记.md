# WebWorker学习笔记

## 目录

* [**WebWorker简介**](#WebWorker简介)
* [**WebWorker基本用法**](#WebWorker基本用法)
  * [主线程对应的操作](#主线程对应的操作)
  * [WebWorker线程对应的操作](#WebWorker线程对应的操作)
  * [基本用法总结](#基本用法总结)
* [**数据通信**](#数据通信)
* [**Worker新建Worker**](#Worker新建Worker)
* [**Worker的作用域**](#Worker的作用域)
* [**Worker的importScript()用法**](#Worker的importScript()用法)
* [**页面内嵌WebWorker代码**](#页面内嵌WebWorker代码)
* [**React内嵌WebWorker代码**](#React内嵌WebWorker代码)
* [**修改tsconfig.json相关配置**](#修改tsconfig.json相关配置)
* [**使用TS特有注释，忽略TS语法检查，解决报错问题**](#使用TS特有注释，忽略TS语法检查，解决报错问题)



<br>

## WebWorker简介

**Web Worker的由来：**

默认浏览器中运行的 JavaScript 是单线程，Web Worker 的作用就是为 JS 创建多线程环境，允许主线程创建 Web Worker 线程，并负责计算密集型或高延迟的任务。

1. Web Wokrer 线程负责计算密集型或高延迟的任务
2. 主线程只需要负责 UI 交互，这样页面更加流畅



**Web Worker 注意事项：**

1. 同源限制：Web Worker 只能接受同源下的 JS 分配的任务。

2. DOM限制：Web Worker 无法读取和操作 DOM 对象，无法使用 document、window、parent 这些对象，但可以使用 navigator 和 location。

   > 无法使用 window对象也意味着无法使用 window.setInterval()、无法操作 CSS、SVG、Canvas 等

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



**与之对应的ServiceWorker：**

Service worker 是一个注册在指定源和路径下的时间驱动 worker。

> Service worker 是 Web Worker 的一种形态

关于 Service Worker 更多知识，请访问：https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API



<br>

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
worker.postMessage('hello','*')
worker.postMessage({name:'puxiao',age:18},'http://localhost:3000/')
```

解释说明：

1. 主线程向 Web Worker 实例发送消息 通过 postMessage() 方法

2. postMessage()的参数可以是 JS 支持的各种数据类型：字符串、对象、数组、二进制数据等。

3. postMessage()的第2个参数是用来设定主 JS 线程所在的窗口地址或标签

   > 若为 * 则表示不限制，建议将该值设置为具体的网址。
   >
   > 在 JS 中第二个参数不填写也不报错，但是在 TS 中则第二个参数为必填项。
   >
   > 在 React + TypeScript 中，Worker 的第 2 个参数类型和 JS 中不一样
   >
   > ```
   > type Transferable = ArrayBuffer | MessagePort | ImageBitmap | OffscreenCanvas;
   > 
   > postMessage(message: any, transfer: Transferable[]): void;
   > ```



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



<br>

### WebWorker线程对应的操作

**监听主线程发送的消息**

```
self.addEventListener('message',function(eve){
  console.log(eve.data)
},false)
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

3. 在 TS 环境中可能会报错：self 未定义，解决办法是在 worker.ts 顶部添加一条注释语句，让 ESLint 忽略这个错误：

   ```
   /* eslint-disable-next-line no-restricted-globals */
   self.addEventListener...
   ```

   或者在项目根目录(并非src目录)新建 .eslintrc 文件，内容为：

   ```
   {
       "rules": {
           "no-restricted-globals": ["error", "event", "fdescribe"]
       }
   }
   ```

   

**向主线程发送消息**

```
self.postMessage(xxx, 'xxx')
```

解释说明：

1. Web Worker 与主线程都通过 poseMessage() 来向对方发送消息。
2. 参数用法同 主 JS 线程相同。



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



<br>

### 基本用法总结

**主线程：**

| 操作内容            | 对应代码                                     |
| ------------------- | -------------------------------------------- |
| 创建 we worker 实例 | let worker = new Worker('xxx.js')            |
| 发送消息            | worker.postMessage(xxx, 'xxx')               |
| 接收消息            | worker.onmessage = function(eve){ eve.data } |
| 监听错误            | worker.onerror(function(eve){ ... })         |
| 监听发送消息错误    | worker.onmessageerror(function(eve){ ... })  |
| 关闭 web worker     | worker.terminate()                           |

**WebWorker线程：**

| 操作内容         | 对应代码                                   |
| ---------------- | ------------------------------------------ |
| 发送消息         | self.postMessage(xxx, 'xxx')               |
| 接收消息         | self.onmessage = function(eve){ eve.data } |
| 加载脚本         | importScripts('xxx.js')                    |
| 监听错误         | self.onerror(function(eve){ ... })         |
| 监听发送消息错误 | self.onmessageerror(function(eve){ ... })  |
| 关闭自身         | self.close()                               |



<br>

### 实用技巧：index.js 调用 worker.js 中某个函数

假设 worker.js 中需要定义有 3 个不同用途的函数，且函数参数也不同，通常我们使用以下方式。

```
/* eslint-disable-next-line no-restricted-globals */

const funA = (str) =>{
    ...
}

const funB = (num) => {
    ...
}

const funC = (arr) => {
    ...
}

const handles = {
    funA,
    funB,
    funC
}

const handleMessage = (eve) =>{
    const fun = handles[eve.data.type] //通过区分 type 来知道需要调用哪个函数
    if(fun === undefined){
        throw new Error(`no handle for type:${eve.data.type}`)
    }
    fun(eve.data.params) //获取参数，并调用该函数
}

self.addEventListener('message',handleMessage)
```

这样 index.js 就可以在发送数据时，通过添加 type 和 params 属性值来告知 worker.js 来执行哪个函数以及该函数的参数：

```
worker.poseMessage({type:'funA',params:'hello worker'})
```



**使用条件判断来决定执行哪个函数**

可以不选择使用 const handles = { ... } 这种方式，而是通过 switch(eve.data.type) 来判断该执行哪个函数，尤其是在 TS 环境中，这种方式更加合适。



<br>

## 数据通信

在前文已经讲过，主线程与Web Worker之间通过 postMessage(xxx, 'xxx') 方式进行互发消息(数据)。

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



或者是 canvas：

```
const canvas = document.querySelector('#canvas')
const offscreen = canvas.transferControlToOffscreen
const worker = new Worker('xxx.js',[offscreen])
```



<br>

## Worker新建Worker

顾名思义，就是 worker 内部再创建 worker。

> 目前有极少数浏览器支持该功能。

在 worker 中新建 worker 的方式和主线程新建 worker 的方式完全相同。也是通过 new Worker(‘xxx.js’) 方式实例化的。

**使用场景：**

假设有一个非常大量的计算任务，那么可以将该任务拆分成 N 个小任务，同时创建 N 个worker，向每一个 worker 通过 postMessage(xxx) 发送执行各自任务的消息。最终再将所有 worker 的计算结果汇总在一起。 



<br>

## Worker的作用域

本文最开始讲过，实际上 “worker” 目前分为 3 类：

1. Worker
2. SharedWorker
3. ServiceWorker

> 本文主要讲解的是第 1 种 Worker 的用法。



以上 3 种 worker 他们共同的作用域对象为：WorkerGlobalScope

具体请查阅：https://developer.mozilla.org/zh-CN/docs/Web/API/WorkerGlobalScope



**这 3 种 worker 对应的作用域：**

1. DedicatedWorkerGlobalScope( Worker 实例的作用域)

   >https://developer.mozilla.org/zh-CN/docs/Web/API/DedicatedWorkerGlobalScope

2. SharedWorkerGlobalScope( SharedWorker 实例的作用域)

   > https://developer.mozilla.org/en-US/docs/Web/API/SharedWorkerGlobalScope

3. ServiceWorkerGlobalScope( ServiceWorker 实例的作用域)

   > https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorkerGlobalScope

他们都继承于 WorkerGlobalScope，并且实现了一些特有的属性和接口。



<br>

## Worker的importScript()用法

试想一下以下场景：

假设你需要编写几个不同的 worker 代码文件，而这些文件中有 60% 的代码片段是完全一模一样的，那么我们可不可以将这 60% 的代码抽离出来，供其他几个 worker 共同引入使用？

> 请注意：
>
> 1. 这里说的 60% 代码 指是 代码片段，而不是指某些共用的方法
> 2. 这里说的 引入 是指 “include”(复制一份)，而不是 “import”(从模块中导入)。



答案是可以实现。

**使用到 WorkerGlobalScope.importScripts() 这个函数**。

> 更加详细的用法，请查阅：https://developer.mozilla.org/zh-CN/docs/Web/API/WorkerGlobalScope/importScripts

> 上一小节提到 目前 3 种 worker 的作用域都继承 WorkerGlobalScope，所以 3 种 worker 中都可以使用 importScripts() 这个方法。



具体做法很简单，我们将那 60% 的代码片段单独写在 xxx.js 文件中，然后在具体的 worker 代码中导入进来这些代码片段。

```
self.importScripts('xxx.js')
```

> self 也可以省略不写，直接写 `importScripts('xxx.js')`



**请注意：importScript() 使用 同步方式导入，而不是异步方式。**

> 同步导入的方式保证了我们编写的 worker 中一定会等 xxx.js 代码全部加载进来后再执行后面的代码。



**补充说明：**

假设你项目使用 TypeScript，那么默认直接使用 importScripts() 可能会提示找不到该函数。

具体原因和解决办法，请查看本文后面关于“修改tsconfig.json相关配置”的内容。



<br>

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



<br>

## React内嵌WebWorker代码

### React使用WebWorker的困境

根据本文前面叙述，你应该了解：

1. 创建 Web Worker 时，需要传入包含任务的 JS 代码路径
2. 也可以将 任务 JS 代码内嵌到网页 HTML 中，通过 createObjectURL() 来模拟加载 任务 JS

但是以上 2 种方式在 React 项目中都不可以。

因为 React 最终会将 所有的 JS 打包为一个 JS 文件，所以直接传入 任务 JS 文件路径的方式是不行的。如果你使用的是 React + TypeScript，那么这种方案更加不合理，总不能任务代码不采用 TS 语法来写吧。

> 除非你把写好的任务 JS 文件放入 public 目录中，这样避免被 react 打包，不过这种变相解决的方式也不够好。



### 终极方案：使用worker-loader

为了解决以上问题，最佳的解决方案就是使用 webpack 的插件 worker-loader。

下面我们讲解在 React + TypeScript 环境下配置 worker-loader 的步骤。

#### 安装并配置 worker-loader

**第1步：安装**

```
yarn add worker-loader --dev
//npm i worker-loader --save-dev
```



> 假设你的 React 中并未使用 TypeScript，那么请忽略第 2 步
>
> 并且将后面步骤中 worker.ts(包括 worker 中的代码) 都修改成对应的 worker.js 版本

**第2步：添加 worker-loader 对应的 TypeScript 声明文件**

在 src 目录下，创建 typing/worker-loader.d.ts，内容如下：

```
declare module "worker-loader!*" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export = WebpackWorker;
}
```



**第3步：添加 ESLint 声明**

默认 create-react-app 已经包含有默认的 ESLint 规则，我们需要通过添加 .eslintrc 文件来做一些规则修改。

在 项目根目录，也就是和 src 平级的目录下新建 .eslintrc 文件，内容如下：

```
{
    "rules": {
        "no-restricted-globals": ["error", "event", "fdescribe"],
        "import/no-webpack-loader-syntax": "off"
    }
}
```

解释说明：

1. "no-restricted-globals": ["error", "event", "fdescribe"] 这条规则的意思是，可以让我们在 worker.ts 中使用 `self` 而不报错
2. "import/no-webpack-loader-syntax": "off" 这条规则的意思是，可以让我们在通过 import 导入 worker.ts 的路径中，使用 “!” 这个特殊符号而不报错。



**第4步：重启 VScode**

之所以强调重启 VSCode 就是为了确保刚才所作的  .eslintrc 配置一定生效



**第5步：编写 worker.ts 文件 **

先编写一个比较简单的 worker 逻辑代码：

```
const handleMessage = (eve: MessageEvent<any>) => {
    console.log(eve.data)
}
self.addEventListener('message', handleMessage)

//导出 {} 是因为 .ts 类型的文件必须有导出对象才可以被 TS 编译成模块，而不是全局对象
export {}
```

> 额外强调一点：通常我们约定将 worker 相关的文件命名为 worker.ts 或者 xxx.worker.ts



**第6步：引入 worker.ts 文件**

index.tsx 引入 worker.ts 的代码为：

> 我们假设 index.tsx 和 worker.ts 位于同一目录中

```
import Worker from 'worker-loader!./worker'
```

> 切记，引入 worker.ts 的路径，一定要以 `worker-loader!`为开头。



创建 Worker 的代码如下：

```
import Worker from 'worker-loader!./worker'
const HomePage = () => {
    const worker = new Worker()
    const handleClick = () => {
        worker.postMessage({ data: 'hello worker' })
    }
    return (
        <div onClick={handleClick} style={{ width: '300px', height: '300px',backgroundColor:'green' }} ></div>
    )
}
export default HomePage
```

至此，关于 worker-loader 是配置和演示完成，可以愉快得使用 ts 语法来编写 worker 内容了。



**补充说明：第三方库会被打包 2 次，会增大最终包的文件体积**

假设 index.tsx 和 worker.ts 都使用了同一个第三方库，那么这个库的代码会被分别打包进去 2 次，会造成最终打包成包的文件体积比较大。

请一定记得这个隐患，暂时还未找到解决方案。

不过最简单的办法就是避免 index.tsx 和 worker.ts 都使用第三方库。

本人建议：如果使用 worker，那么就将运算转转移得彻底一些，只让 worker.ts 引用某个第三方库，index.tsx 不再引用这个第三方库。



<br>

## 修改tsconfig.json相关配置

假设我们项目中使用 TypeScript，默认的 tsconfig.json 文件中  lib 配置如下：

```
"compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ]
}
```

 **在 tsconfig.json 中 lib 的含义为：编译过程中需要引入的库文件的列表**

因此默认的 lib 配置中，只引入了 dom(主线程) 相关的，而没有引入 web worker 相关的。

换句话说，TypeScript 默认判定项目中编写的 .ts 或 .js 文件是给 DOM 主线程使用的，而不是给 web worker 线程使用的。

> 此时代码中的语法提示都是针对 DOM 主线程中使用到的，而 web worker 的一些方法则不会有代码提示，且报错显示找不到该方法。
>
> 例如 webworker 中特有的 importScripts() 方法



**因此，我们 “可能” 需要修改 tsconfig.json 文件，将 lib 项中添加上 web worker 相关的内容。**

```
"compilerOptions": {
    "lib": [
      "dom",
      "dom.iterable",
      "WebWorker",
      "WebWorker.ImportScripts",
      "esnext"
    ]
}
```

这样，当我们再在 worker 中使用 self.xxx 的时候，就能可以使用 webworker 相关的特有函数，例如 self.importScripts()。



<br>

**补充说明：为什么是“可能”需要修改，而不是必须修改？**

假设你的 worker 代码中并未使用到 WorkerGlobalScope、DedicatedWorkerGlobalScope 特有的属性或方法，而仅仅使用了：

1. postMessage()
2. 监听 “message”、"messageerror" 事件

那么这些方法和事件的用法本身和 DOM 主线程中的用法完全相同，所以此时即使你不修改 tsconfig.json 中 lib 的配置，那么 TS 依然会给你正确的语法提示。

只有当你需要使用 WorkerGlobalScope 或 DedicatedWorkerGlobalScope 特有的属性或方法，例如 importScript() ，此时就必须去修改 lib 的配置了。



<br>

## 使用TS特有注释，忽略TS语法检查，解决报错问题

首先我们要明白：

1. JS 在运行环境中 是弱引用类型的语言
2. TS 在开发阶段中 是强引用类型语言

换句话说：

1. 在 JS 的实际执行过程中，任何对象的任何属性或方法都是可以动态修改变更的
2. 在 TS 的开发阶段中，TS 规定了很多属性或方法的可用性、只读性等规范和约定



那么假如你明确知道某行代码在 JS 中是可以这样编写的，但是在 TS 中默认报错误，此时我们可以使用最简单、省事的办法，那就是直接添加特殊的注释，让 TS 忽略对该行代码的检查。

例如：在 TS 中默认认为 self.document 为只读属性，不可以修改。

假设出于某种原因就是要修改，那么我们可以添加 `//@ts-ignore` 让 TS 忽略这一行代码的检查，解决 TS 报错。

```
//@ts-ignore
self.document = {} 
```

> 一般情况下，最好还是不要这样做，除了某些特殊场景下。

<br>
