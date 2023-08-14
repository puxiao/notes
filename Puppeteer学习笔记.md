# Puppeteer学习笔记

Puppeteer 可以做的事情非常多。



<br>

#### Puppeteer简介

Puppeteer 是一个 NPM 包，可运行在 nodejs 环境中，可以让我们通过 JS 代码去控制、调试、操作无可视化窗口的谷歌浏览器。

> 这里的谷歌浏览器包含 2 个版本：正式版(chrome) 和 开发版(chromium)
>
> 注意 puppeteer 仅可运行在 nodejs 环境，无法运行在前端 JS 环境中。



<br>

对于 Puppeteer 而言，它可以设定你要模拟的浏览器外观，例如 视窗的高宽，当然也包含 手机模式、IPad 模式等。



默认浏览器视窗并不显示，也就是说所谓的浏览器只是默默的运行在系统服务中。

> 把这种没有视窗的浏览器模型，称呼为 “无头浏览器”。



<br>

> 当然对于其他浏览器，例如 火狐浏览器，它们也分别有他们对应的 类似 Puppeteer 的 NPM 包。不过本文只讲针对谷歌浏览器的 Puppeteer。



<br>

**使用Puppeteer可以做什么？**

可以这么说：浏览器的任何人为(用户)操作，都可以通过 Puppeteer “模拟” 实现。

1. 将网页另存为 图片 或 pdf 文件
2. 抓取网页内容，并进行数据清洗
3. 模拟网页中的各种用户操作，例如 点击、输入等
4. 创建自动化测试模块
5. 捕获网页的性能对应的时间线
6. 测试浏览器的一些 扩展 功能



<br>

#### 安装并使用Puppeteer

Puppeteer 官网：https://www.npmjs.com/package/puppeteer

简体中文文档：https://zhaoqize.github.io/puppeteer-api-zh_CN/

> 特别强调：该文档已经有 3 年未再更新，但是对于 puppeteer 很多基础的方法并未有过大的改动，所以也是可以适当阅读使用的。



<br>

对于我们而言，官方文档中最需要、最有用的是 Page 相关的用法。

https://pptr.dev/#?product=Puppeteer&version=v13.5.1&show=api-class-page



<br>

**Puppeteer的2个版本：**

1. puppeteer：该版本默认自身一个最新的谷歌浏览器

   > 所以当你安装它时，它会自动下载一份最新的谷歌浏览器到 node_modules 中

2. puppetter-core：仅包含 puppeteer 核心代码 但不包含谷歌浏览器的 NPM 包

   > 它会默认使用你当前系统中已安装的 谷歌浏览器

他们两个的区别仅仅提现在引入 puppeteer 的方式不同，其他代码都相同：

```
const puppeteer = require('puppeteer-core')
或
const puppeteer = require('puppeteer')
```

> 使用 puppeteer-core 还需要额外配置本机谷歌浏览器的文件路径



<br>

**安装：**

```
yarn add puppeteer
```

```
yarn add puppeteer-core
```

> 它们默认自带有 index.d.ts，方便我们在 TypeScript 中使用。



<br>

**特别强调：puppeteer 中的各种方法几乎都是异步的。**



<br>

**使用：**

这是官方的一个示例：引入 puppeteer，以无视窗模型 打开某个网页，并进行网页截图与保存

```
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.puxiao.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
})();
```



<br>

**截图函数 screenshot() 的补充：**

关于 page.screenshot() 的更多配置项可查阅：https://pptr.dev/api/puppeteer.page.screenshot

其中比较常用的是：

* path：若存在则会自动将截图保存到该路径上，注意这里说的路径包含最终截图文件名称

  > 这里说的保存是指 直接自动保存，无需手工点击确定保存

* type：截图图片文件格式，.jpeg、.png、.webp，默认为 .png

* quality：若为 .jpeg 或 .webp 那么截图压缩质量为多少，取值范围 0 ~100

* clip：用来设定截图的具体位置，这个文昌重要，假定你只想截取某个元素而不是整个网页，那么你可以设置 clip 的值

  ```
  await page.screenshot({ 
      path: 'example.png',
      clip:{ x: 100, y:200, width: 600, height: 700}
  })
  ```

  > 将从页面 (x:100, y:200) 的位置截图一个尺寸为 600x700 的图片



<br>

**设置是否打开浏览器(是否是无头浏览器)，以及限定浏览器的展示内容区域尺寸：**

```
browser = await puppeteer.launch({
        headless: false, //false:会打开浏览器(本机打开测试版谷歌浏览器)、true:不会打开浏览器(无头浏览器)
        defaultViewport: {
            width: imgWidth,
            height: imgHeight
        }
    })
```

> 特别说明：
>
> * 假设没有设置 defaultViewport 尺寸，那么打开浏览器默认为 800x600
> * 嘉定设置了 defaultViewport 尺寸，那么该浏览器可用内容区域一定是你设置的那个尺寸，假定你修改调试对应的谷歌浏览器窗口大小也不会影响它的区域。



<br>

**node.js 中使用 puppeteer：**

* 首先建议你修改 node.js 项目中的 package.json，将 type 修改为 module 这样就可以使用 import 方式引入任何 NPM 包，而不再使用 require 了

* 如果你真这样做了，记得要在顶部添加下面代码：

  ```diff
  - const path = require("path")
  + import path from 'path'
  
  + import { fileURLToPath } from 'url'
  + const __filename = fileURLToPath(import.meta.url)
  + const __dirname = path.dirname(__filename)
  ```

  > 你需要自己定义 `__dirname` 和 `__filename`

* 然后剩下的代码该怎么写就怎么写，可以自由使用 puppeteer 了



<br>

#### node.js 中如何与pupeteer打开的网页 数据交互

**第1种：最原始简单的方式——通过地址栏 url 来传递**

```
await page.goto(`http://localhost:8899?width=${imgWidth}&height=${imgHeight}`)
```

**第2种：通过 page.evaluate() 函数**

> 该函数具体用法可查看文档：https://pptr.dev/api/puppeteer.page.evaluate

假定打开的网页中，我们定义一个 frameInit( list ) 的函数，为了省事我们可以直接将其挂在到 window 下，即：window.frameInit()，其中参数为 list。

那么我们在 node.js 中可以通过 page.evaluate() 来调用它，并传递我们的参数给该函数。

```
await page.evaluate((list) => {
    window.frameInit(list)
}, markList)
```

* page.evaluate() 本身为异步函数
* 第1个参数为一个箭头函数，第2个参数为第1个箭头函数所需的参数
* 在这个箭头函数的内部，是我们假定要在该页面中执行的代码，其中包含我们要调用的 window.frameInit(list)
* 再强调一下：你把箭头函数内部的代码执行上下文 想象成 就好像在该页面内部执行的一样，而不是 node.js 中的上下文



<br>

**页面 frameInit() 如果有返回值该，node.js 该如何获取？**

这个时候可以将页面中的 frameInit() 修改成异步函数，将 frameInit 中的执行结果让异步中的 resove() 传递返回出来。

> xxx.html 中的 js

```
const frameInit = async (list) => {
  return new Promies((resove,reject)=>{
      try{
          //...
          console.log(list)
          ...
          resove( xx )
      }catch(err){
          reject(err)
      }
  })
}
window.frameInit = frameInit
```



<br>

> node.js

```
const res = await page.evaluate(async (list) => {
    const xx = await window.frameInit(list)
    return xx
}, myList)
console.log(res)
```

* 上述代码中 evaluate() 第 2 个参数 myList 就是 frameInit() 接受到的参数  list
* 而此时 node.js 中的 res 就是 page.evaluate() 执行返回的 xx



<br>

**如果使用 puppeteer-core，还需指明本机chrome.exe的路径。**

> 由于 puppeteer-core 本身不包含谷歌浏览器，需做如下配置

```diff
- const puppeteer = require('puppeteer');
+ const puppeteer = require('puppeteer-core')


const path = require('path')

const chromePath = path.join('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe')

- const browser = await puppeteer.launch();
+ const browser = await puppeteer.launch({ executablePath: chromePath })
```



<br>

另外一个示例：将某网页保存为 pdf 文件

```
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://news.ycombinator.com', {
    waitUntil: 'networkidle2',
  });
  await page.pdf({ path: 'hn.pdf', format: 'a4' });

  await browser.close();
})();
```



<br>

#### 特别说明：

在官方文档中提到：

`.$('xxx')` 相当于 querySelector

`.$$('xxxx')` 相当于 querySelectorAll

但是：他们实际返回的并不是我们预期的某个 HTML 元素，这两个方法异步返回的结果是 ElementHandle。



<br>

> 你要时刻明白：你操作的是 puppeteer，而不是 浏览器本身。



<br>

如果你希望得到并处理某个页面中的 HTML 元素，真正的方法是 `.$eval('xxx', (ele)=> {... return ele})`

> .$eval() 一共需要 2 个参数：
>
> 1. 第1个参数：选择器(classname、id、html元素类型)
> 2. 第2个参数：当获取该元素后需要执行的函数，你可以在 `.$eval()` 的第 2 个参数中 处理 该元素。

> 当然如果想获取全部的某个元素，则使用 `.$$eval()`



<br>

#### Electron项目打包成asar文件后无法找到并启动浏览器的解决方式

当我们开发好 Electron 并打包成 asar 文件后，由于默认 asar 采用了加密方式，导致实际运行时 puppeteer 无法找到谷歌浏览器，自然也无法启动。

> 尽管此时在开发环境中是可以正常运行的



<br>

**最初的解决方案：**

puppeteer 官方仓库上针对这个问题有对应的解释，按照官方的说法这是 node 版本的问题，需要 node v14 以上就可以解决。

这就需要你使用最新的 Electron 版本，才可能内置 node v14 版本。

不过经过我实际的测试，发现并不能解决这个问题，所以暂时可以忽略这种解决方案。



<br>

**第1种解决方案：将 electron 配置成 asar 不加密**

> 具体如何配置自行百度



<br>

**第2种解决方案：人工定位谷歌浏览器位置**

> 我非常不建议将自己电脑上安装的谷歌浏览器文件直接拷贝到 electron 项目中
>
> 推荐以下方式，尽管这个方式看上去似乎有点绕

1. 通过 `yarn add puppeteer` 安装 puppeteer

2. 在 node_modules 中找到 puppeteer 目录，拷贝其中的 `.local-chromium` 目录(该目录里就是谷歌浏览器)，拷贝到和 resources 评级的目录中

3. 通过第 2 步 我们已经拿到了 谷歌浏览器，此时可以移除  puppeteer 包，改为安装 puppeteer-core，因为我们已经不再需要 puppeteer 了

   ```diff
   yarn remove puppeteer
   yarn add puppeteer-core
   
   //修改引入方式
   - const puppeteer = require('puppeteer')
   + const puppeteer = require('puppeteer-core')
   ```

4. 在创建浏览器的代码中，通过添加 `executablePath` 配置项，明确指定浏览器 exe 的文件位置

   ```
   const browser = await puppeteer.launch({executablePath: path.join(__dirname, '../xx/xx/.local-chromium/win64-970485/chrome-win/chrome.exe')})
   ```

5. 至此，完成





<br>

#### 附一个示例：

说明：我使用的是 Koa + TypeScript，所以我引入的方式是 import 而不是 require。



<br>

整个过程：

1. 使用 puppeteer 创建浏览器，访问 `https://xx.xx.xx/xx` ，并拿到网页中的表格元素

   > 为了避免不必要的纠纷，我隐去了实际的抓取网页地址

2. 通过 page.$$eval() 获取、分析、转化 表格中的数据内容

3. 将最终得到的数据通过 fs 写入到本地的 xx.json 文件中



<br>

```
import puppeteer from 'puppeteer'

export const getPage = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://xx.xx.xx/xx')
    //await page.waitForTimeout(3000) //注意：waitForTimeout() 函数已被废弃
    await new Promise(r => setTimeout(r, 3000)) //可使用这种方式代替之前的 waitForTimeout()
    const resArr = await page.$$eval(
        '#cib_fund_setionlist > table > tbody > tr', 
        list => list.slice(2).map(item => {
            const tds = item.querySelectorAll('td')
            return {
                id : tds[0].innerText,
                name : tds[1].innerText,
                unitNet : tds[2].innerText,
                accumulatedNet : tds[3].innerText,
                day : tds[4].innerText,
                month : tds[5].innerText,
                halfYear : tds[6].innerText,
                year : tds[7].innerText,
                twoYear : tds[8].innerText,
                threeYear : tds[9].innerText,
                sinceCreation : tds[10].innerText
            }
        })
    )
    await fs.writeFileSync('../xxx/xx.json', JSON.stringify(resArr))
    await browser.close()
}
```
