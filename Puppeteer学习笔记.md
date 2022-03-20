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



<br>

下面，本文以安装 puppeteer 为例。



<br>



**安装：**

```
yarn add puppeteer
```

> 默认自带有 index.d.ts，方便我们在 TypeScript 中使用。
>
> 当前最新版本为 13.5.1。



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



