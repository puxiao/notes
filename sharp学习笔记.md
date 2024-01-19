# sharp学习笔记

### sharp简介

sharp 是基于 libvips 在 node.js 中使用的一个 NPM 包，用来做各种格式(.jpg、.png...)图片 改尺寸、压缩图片质量、翻转、合并等相关操作。



<br>

"sharp" 单词本意是：尖锐的、锋利的、急剧的，骤然的(变化)

名字想表达的是 **sharp 图片处理速度特别快！！！**



<br>

### 安装sharp

以下是基于 windows10 64位 操作系统而言的安装说明。



<br>

**正常的安装：**

```
yarn add sharp
```



<br>

**你可能会安装失败：**

```
Exit code: 1
Command: (node install/libvips && node install/dll-copy && prebuild-install) || (node install/can-compile && node-gyp rebuild && node install/dll-copy)
Arguments: 
Directory: E:\workspace\mask-maker\node_modules\sharp
Output:
sharp: Downloading https://github.com/lovell/sharp-libvips/releases/download/v8.14.4/libvips-8.14.4-win32-x64.tar.br
sharp: Installation error: Request timed out
sharp: Please see https://sharp.pixelplumbing.com/install for required dependencies
```



<br>

sharp 需要 libvips 这个 c++ 二进制运行程序，安装 sharp 会默认根据你当前操作系统自动选择适合的 libvips 版本文件。

而上面安装失败错误信息，表达的意思是：

* 尝试下载 https://github.com/lovell/sharp-libvips/releases/download/v8.14.4/libvips-8.14.4-win32-x64.tar.br 但下载失败
* 请查阅 https://sharp.pixelplumbing.com/install 去看安装问题



<br>

在我这边，无论使用 npm 默认官方下载源，还是国内淘宝源，哪怕开着翻墙软件，都没法正常下载那个文件，导致安装失败。



<br>

**解决方式：手工下载 libvips 并放到本机 npm-cache 缓存目录中**

第1步：手工打开网页去下载 https://github.com/lovell/sharp-libvips/releases/download/v8.14.4/libvips-8.14.4-win32-x64.tar.br

第2步：把刚下载的文件放到 npm-cache/_libvips 这个目录中

* 本机 npm-cache 目录位于：`C:\Users\your-user-name\AppData\Roaming\npm-cache\_libvips`
* 如果你的 npm-cache 目录下没有 _libvips 目录，手工创建它

这样，我们再使用 `yarn add sharp` 安装时，会检测刚才我们手工添加的 npm 缓存文件，不需要再联网下载 libvips，这次就可以正常安装 sharp 了。



<br>

### 另外一种报错情况：

或许你遇到的是另外一种情况。

**安装 sharp 成功，可是引入使用 sharp 时却报错：Could not load the "sharp" module using the win32-x64 runtime**

```
Error: Could not load the "sharp" module using the win32-x64 runtime
Possible solutions:
- Ensure optional dependencies can be installed:
    npm install --include=optional sharp
    yarn add sharp --ignore-engines
- Ensure your package manager supports multi-platform installation:
    See https://sharp.pixelplumbing.com/install#cross-platform
- Add platform-specific dependencies:
    npm install --os=win32 --cpu=x64 sharp
- Consult the installation documentation:
    See https://sharp.pixelplumbing.com/install
```



<br>

**目前的解决方案是：**

除了安装 sharp 之外，再安装下面这个包

```
npm install --force @img/sharp-win32-x64
```

> 这个 `@img/sharp-win32-x64` NPM 包也是由 sharp 官方提供的。

安装成功之后，引入使用 sharp 时就不会再报上面错误了。

<br>

当然我说的是 windows 系统，如果你是其他系统，则去找对应的包，例如：`@img/sharp-linux-x64`

https://www.npmjs.com/search?q=%40img&page=0&perPage=20



<br>

### 使用sharp

<br>

**引入：**

```
const sharp = require('sharp')

//或

import sharp from 'sharp'
```

> 由于我 package.json 中设置的 "type": "module"，所以我可以在 node.js 中使用 import 方式



<br>

**基础用法：**

我们刚才引入的 sharp 实际是一个创建 Shape 实例的函数，那么当需要操作图片，即创建 Shape实例时，sharp() 函数套路如下：

* sharp([input], [options]) 函数接受 以下 2 种参数中的其中一种
  * input 为要操作的图片Buffer数据 或者是 图片路径
  * options 一些初始化图片的配置项
* 由于 sharp() 创建的 Sharp 实例后续的各种操作异步函数，那么接下来你需要做什么操作就往下累加



<br>

```
sharp(xxx).xx()

//或 
const mySharp = sharp(xx)
mySharp.xx()
```



<br>

**示例1：缩小图片并保存**

> 读取当前目录下的 aa.jpg，修改尺寸为 400x300，并另存为 bb.jpg

```
sharp(path.join(__dirname, 'aa.jpg'))
  .resize(400, 300).
  toFile(path.join(__dirname, 'bb.jpg'))
```



<br>

**示例2：旋转图片并另存为其他格式**

> 读取当前目录下的 aa.jpg，旋转90度，并另存为 bb.png

```
sharp(path.join(__dirname, 'aa.jpg'))
  .rotate(90)
  .toFile(path.join(__dirname, 'bb.png'))
```



<br>

上面 2 个示例中 sharp() 函数传入的是一张已存在的图片路径。

接下来，我们不是用传入图片，而是自己生成一张图片。



<br>

**示例3：通过配置项的 create 属性来初始化生成一张图片数据**

> 配置项 create 中配置图片尺寸、通道数量(channels:4 即表示 rgba)、默认背景色，并最终保存为 cc.png 文件

```
sharp({
    create: {
        width: 400,
        height: 300,
        channels: 4,
        background: {
            r: 255,
            g: 0,
            b: 0,
            alpha: 0.5
        }
    }
}).png().toFile(path.join(__dirname, 'cc.png'))
```



<br>

**示例4：给图片添加水印：**

假设图片为 input.jgp，水印图片为 over.png，如果只是简单的覆盖添加，那么代码：

```
const inputPath = path.join(__dirname, 'inut.jpg')
const overlayPath = path.join(__dirname, 'over.png')

sharp(inputPath)
  .composite([
      {
          input: overlayPath,
          tile: false, //是否重复，默认值即 false
          top: 0, //覆盖位置，若不填则默认垂直居中
          left: 0, //覆盖位置，若不填则默认水平居中
          blend: 'over' //混合方式，默认即 "over"
      }
  ])
```

> 由于 composite() 参数是一个数组，那么意味着你可以同时添加多张水印图片



<br>

**toBuffer()：**

如果不想保存成文件，也可以使用 .toBuffer() 将数据保存成 Buffer 数据，有了 Buffer 数据则可以：

* 读取 Buffer 数据，可以操作修改任意像素的各个通道值
* 将 Buffer 转化为临时网址，作为 html 图片标签 `<img>` 的 src 内容源



<br>

**示例5：将 PNG 中纯黑色像素改为透明，而非纯黑色像素则透明度改为 0.8**

```
const overlayPath = path.join(__dirname, 'over.png')
const otherAlpha = 0.8

const { data, info } = await sharp(overlayPath)
        .raw()
        .toBuffer({ resolveWithObject: true })

if (data && info) {
    for (let j = 0; j < data.length; j += 4) {
        const r = data[j]
        const g = data[j + 1]
        const b = data[j + 2]

        data[j + 3] = (r === 0 && g === 0 && b === 0) ? 0 : otherAlpha
    }

} else {
    console.log('执行 toBuffer() 过程中发生错误')
}
```

代码说明：

* 首先我们从 .raw()、toBuffer() 的结果中解构得到 data 和 info 
  * data：图片每个像素各个通道的值，值的取值范围 0 ~ 255
  * info：图片的一些信息，例如 宽、高、通道数量 等
* 然后我们通过对 data 的遍历，每隔 4 个为一个像素的 rgba 值，并进行修改
* 最终得到的 data 就是符合我们要求的图片数据



<br>

接下来，我们需要再重新将 data、info 拼装成一个 PNG 图片并保存：

```
const savePath = path.join(__dirname, 'out.png')
await sharp(new Uint8ClampedArray(data.buffer), { raw: info }).png().toFile(savePath)
```



<br>

**示例6：添加比较复杂的水印：**

假定我们希望添加的水印要求如下：

* 水印上面的纯黑色地方变为完全透明
* 水印整体透明度为 0.8

> 没错，就是刚才我们 示例5 中的需求



<br>

那么我们只需将 示例4 与 示例5 结合即可。

只不过我们这次直接使用处理后的水印的图片数据(不是图片路径) 作为 composite 的 input 值。

```
const inputPath = path.join(__dirname, 'inut.jpg')
const overlayPath = path.join(__dirname, 'over.png')
const savePath = path.join(__dirname, 'out.png')

...


const tempBuffer = await sharp(new Uint8ClampedArray(data.buffer), { raw: info }).png().toBuffer()

await sharp(inputPath)
    .composite([
        {
            input: tempBuffer
        }
    ])
    .toFile(savePath)
```



<br>

### sharp更多用法

以上仅仅是演示了 sharp 最最基础的一些用法，还有其他很多复杂的图片操作，可查阅 sharp 官方文档：https://sharp.pixelplumbing.com/
