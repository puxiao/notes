# Svg.js学习笔记



<br>

## Svg.js简介

svg.js 是一个轻量级 SVG 库，在 JS 中可创建控制 SVG、添加 SVG 动画等相关操作。

官网地址：https://svgjs.dev/

代码仓库：https://github.com/svgdotjs/svg.js



<br>

svg.js 没有任何依赖，并且绘制 svg 速度快。

在其官网上做了一些测试：

| 测试对象   | 1万个矩形框 | 1万个纯色填充的矩形框 | 1万个渐变填充的矩形框 |
| ---------- | ----------- | --------------------- | --------------------- |
| Vanilla.js | 22ms        | 26ms                  | 101ms                 |
| Svg.js     | 138ms       | 194ms                 | 868ms                 |
| Snap.svg   | 692ms       | 848ms                 | 3446ms                |



<br>

**Snap.svg：**

Snap.svg 也是一个 SVG 库，算是 svg.js 的竞品。

官网地址：http://snapsvg.io/

代码仓库：https://github.com/adobe-webplatform/Snap.svg

> 暂时不打算学习 snap.svg，所以本文对 snap.svg 不做过多介绍，也不跟 svg.js 做对比。



<br>

**Vanilla.js ？**

Vanilla.js 是互联网上一个著名的恶搞玩笑。

因为曾经有一个前端开发者，在被别人追问使用哪个前端框架时，信口胡说(装B)： "我是用的前端框架是Vanilla.js，它是最轻量级的前端框架！"

为什么呢？因为 Vanilla.js 框架实际上并不存在，它是一个虚构的前端框架，实际上就是指 "原生网页"。



<br>

也就是说，在上面渲染速度测试中，Svg.js 比原生网页渲染 svg 要慢那么一丢丢，但比 Snap.svg 这个框架要快很多。



<br>

## Svg.js基础用法



<br>

**安装：**

```
yarn add @svgdotjs/svg.js
```



<br>

**引入：**

```
import { SVG } from '@svgdotjs/svg.js'
```



<br>

**基础示例：**

```
const svg = SVG().addTo('#mysvg').size(300,300)
svg.rect(100,100).fill('red')
```

上面代码中：

* 创建一个 `<svg>` 元素，并添加到 id 为 'mysvg' 的容器中，同时设置该 svg 尺寸为 300x300
* 调用 rect() 函数向 svg 添加一个 `<rect>` 元素，该元素尺寸为 100x100，填充色为 红色

上述代码生成的结果为：

```
<div id="mysvg">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="300" height="300">
        <rect width="100" height="100" fill="red"></rect>
    </svg>
</div>
```



<br>

**另外一种添加矩形框的方式：**

```
import { Rect, SVG } from '@svgdotjs/svg.js'

const svg = SVG().addTo('#mysvg').size(300, 300)
const rect = new Rect().size(100, 100).fill('red')
svg.add(rect)
```



<br>

**添加多个矩形框：**

```diff
const svg = SVG().addTo('#mysvg').size(300, 300)
svg.rect(100, 100).fill('red')
+ svg.rect(100, 100).fill('green').move(100, 0)
```

上述代码生成的结果为：

```
<div id="mysvg">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.dev/svgjs" width="300" height="300">
        <rect width="100" height="100" fill="red"></rect>
        <rect width="100" height="100" fill="green" x="100" y="0"></rect>
    </svg>
</div>
```

> 添加的第2个矩形框比第1个矩形框多了 `x="100" y="0"` 属性



<br>

**添加一个 a 链接：**

注意这里的 a 链接原始实际相当于 svg 内容的容器

```
svg.link('https://puxiao.com').target('_blank').text('点击跳转').move(0, 10)
```



<br>

**a链接中内容不为文字，而是一个矩形框：**

```
svg.link('https://puxiao.com').target('_blank').rect(100, 100).fill('green')
```



<br>

> 另外一种写法，我个人暂时并不推荐，因为下面这种方式无法设置 打开方式，只能是默认的 "_self"
>
> ```
> svg.rect(100, 100).fill('green').linkTo('https://puxiao.com')
> ```

> 如果你真的想设置，可以改成：传递给 linkTo 的不再是连接，而是一个回调函数
>
> ```
> svg.rect(100, 100).fill('green').linkTo((link) => {
>     link.to('https://puxiao.com').target('_blank')
> })
> ```



<br>

**添加 组：**

```
const group = svg.group()
const rect = new Rect().size(100, 100).fill('red')
group.add(rect)

const group2 = svg.group()
const rect2 = new Rect().size(100, 100).fill('green').move(100, 0)
group2.add(rect2)
```



<br>

**其他容器：**

除了 组(group)、a链接 之外，还支持有 symbol()、defs() ，这 2 个后续用到了再讲。



<br>

通过上面的代码，应该对 svg.js 用法有了最基础的了解。

至少我们已经知道了 3 种 svg 容器：svg、a链接、组(group)

上面内容元素只是使用了 矩形框(rect)，那么接下来过一遍其他内容元素。



<br>

## SVG内容元素



<br>

### 内容元素通用创建和配置属性：

我们还以矩形框(rect)为例，回顾一下如何创建和配置属性。



<br>

**创建方式1：在容器下通过对应元素函数来添加**

```
import { Rect, SVG } from '@svgdotjs/svg.js'

const svg = SVG().addTo('#mysvg').size(300, 300)
const rect = draw.rect()
```



<br>

**创建方式2(个人推荐)：使用 new 方式创建**

```
const rect = new Rect()
svg.add(rect)
```



<br>

**配置属性方式1：通过调用对应方法**

```
const new Rect().size(100,100)
```



<br>

**配置属性方式2(个人推荐)：构造函数配置项**

```
const rect = new Rect({width:100, height:100})
```

```
const rect = svg.rect({width:100, height:100})
```



<br>

### 元素列表及重要方法：

下面表格只是简单罗列，具体用法可查阅官方文档：https://svgjs.dev/docs/3.0/shape-elements/

> 特别提醒：下面方法中的 svg 是指 `const svg = SVG().addTo('#mysvg')` 这样创建的父级元素。

| 元素                | 重要方法示例                                                 |
| ------------------- | ------------------------------------------------------------ |
| 网页元素(Dom)       | const element = svg.element('title')<br />element.words('hello') |
| 矩形框(rect)        | rect.radius(10) //设置圆角矩形<br />rect.radius(4,10) //x轴圆角距离、y轴圆角距离 |
| 圆(circle)          | const circle = new Circle().radius(50)<br />circle.move(0, 0) //这里的 move 是指将圆的左上角(并非圆心)移动到 0,0 |
| 椭圆(ellipse)       | const ellipse = new Ellipse.radius(50,80) //水平长度和垂直长度 |
| 线条(line)          | const line = new Line().stroke({ width: 2, color: 'red' })<br /> line.plot(50, 30, 100, 150)<br />线段中点的另外 3 中设置方式：<br />1、line.plot("50,30 100,150") //点与点之间使用空格分割<br />2、line.plot([ [50,30], [100,150] ])<br />3、const pointArr = new PointArray([ [50,30], [100,150] ]); line.plot(pointArr) |
| 折线(polyline)      | 和 line 的用法几乎相同，也是通过 .plot() 来设置折线的点，<br />折线可以设置填充颜色 polyline.fill('none')，<br />线条(line)有且仅有 2 个点、而 折线(polyline) 则可以由多个点组成 |
| 多边形(polygon)     | 和折线(polyline)用法相同，首尾关键点无需设置相同             |
| 路径(path)          | const path = new Path().stroke({ width: 2, color: 'red' })<br />path.plot('M 50 30 L 100 150')<br />关于路径中字母缩写的含义：<br />M：moveto、Z：closePath、L：lineto、H：horizontal lineto (水平连接到)、V：vertical lineto (垂直连接到)、C：curveto(三次贝塞尔曲线，2个控制点+1个目标点)、S：shorthand/smooth curveto (平滑曲线，即借用前一个贝塞尔曲线的第2个关键点的对称点作为自己的第1个控制点)、Q：quadratic bezier cureto (二次贝塞尔曲线)、T：shorthand/smooth quadratic bezier curveto (平滑二次贝塞尔曲线，借用前一个二次贝塞尔曲线控制点的对称点作为控制点)、A：绘制椭圆弧 (例如扇形)，更加详细用法请查阅：https://www.w3.org/TR/SVG/paths.html#PathData<br />路径(path) 还有用于设置路径文本的方法：path.text('xxxxxx') |
| 文本(text)          | const text = new Text().text('hello').font({ family: 'sans-serif', size: 40 }).move(0, 0) |
| 路径文本(textPath)  | const textPath = new TextPath().text('hello').plot('M 50 30 L 100 150') |
| 行内文本(tspan)     | text.tspan('xxxxxx')                                         |
| 图片(image)         | const img = new Image()<br />img.load('/path/to/img.jpg', () => { console.log('loaded') }) |
| 渐变(gradient)      | 用法和 Canvas 中创建渐变的用法几乎相同                       |
| 渐变关键点(stop)    | 是针对渐变(gradient)中的颜色关键节点，<br />const stop = gradient.stop(0.5, '#f03') |
| 图案花样(pattern)   | 相当于 PS 软件中的画笔或填充的 画笔/填充图案                 |
| 遮罩(mask)          | 遮罩对象                                                     |
| 裁剪(clipPath)      | 遮罩与裁剪类似，只不过遮罩支持透明度，而裁剪不支持           |
| 使用映射(use)       | 你可以简单理解成 将某个元素应用(映射) 到另外一个元素<br />const rect = new Rect({width:100,height:100});<br />const use = swg.use(rect)<br />当某个 svg 需要使用另外一个 svg 内容时这个函数会比较方便，<br />复杂场景中比较适用于 当前 svg 内部加载使用另外一个 .svg 文件 |
| 标记(marker)        | 对于路径(path)来说有 3 个标记点："start"/"mid"/"end"，<br />可以通过 marker() 向该标记点添加别的图形元素。<br />例如：path.marker('start', 10, 10, function(add) {  add.circle(10).fill('#f06') }) |
| 样式(style)         | const sveEle = new SVGElement()<br />const style = new Style(sveEle)<br />style.stroke({ width: 2, color: 'red' })<br />style.font({ family: 'sans-serif', size: 40 }) |
| 异物(foreignObject) | 这里的 "异物" 实际上是指 "非SVG正常包含的元素，但又属于原生网页中的元素"，例如向 svg 中添加一个 input 标签 |



<br>

## SVG高级用法



<br>

在上面我们仅仅是讲了 创建 svg 元素，当创建 svg  元素后还有剩下一些操作：

* 通过 .attr() 修改元素
* 通过 .transform() 对元素进行变形(旋转、斜切...)
* 通过 .addClass()、.css() 修改元素样式
* 通过 .animate() 向元素添加动画
* 通过 .click()、.on('click',()=>{ ... }) 向元素添加一些交互事件
* 通过 .off() 向元素关闭/取消一些交互事件
* 通过 .find()、.findOne()、each()、first()、has()、has()、last() 等查找或遍历元素的子元素



<br>

以上这些方法就不再详细举例，自己查看官方文档即可。

官方文档：https://svgjs.dev/docs/3.0/



<br>

## SVG插件



<br>

Svg.js 已经满足了日常绝大多数情况下对 svg 的需求，但是，针对某些特性的强化又开发了一些相对应的插件。

例如：

* 针对动画速率的 svg.easing.js
* 针对元素拖动效果的 svg.draggable.js
* 针对路径相关的 svg.path.js
* ...

具体都有哪些插件，以及插件用法，请查阅：https://svgjs.dev/docs/3.0/plugins/



<br>

本文只是极其简单的过了一遍 svg.js 的用法，在实际项目使用时，遇到什么问题多查一下官方文档即可。
