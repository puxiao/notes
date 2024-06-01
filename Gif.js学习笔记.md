# Gif.js学习笔记



<br>

### Gif.js简介

`gif.js` 顾名思义是用来在网页中通过 JS 生成 gif 图片的。

Npm：https://www.npmjs.com/package/gif.js

代码仓库： https://github.com/jnordberg/gif.js



<br>

**特别说明：**

gif.js 这个 npm 包更新于 7 年前，听上去似乎比较老，没有人维护，但实际情况是 GIF 这种文件格式标准这些年是没有变化的，所以尽管这个包有些年头了 ，但是足够当前使用。



<br>

### 安装

安装 gif.js：

```
yarn add gif.js
#或
pnpm add gif.js
```



<br>

安装类型文件：

```
yarn add --dev @types/gif.js
#或
pnpm add -D @types/gif.js
```



<br>

### 引入

下面是基于 vite 项目：

```
import GIF from 'gif.js';
import gifWorkerURL from 'gif.js/dist/gif.worker.js?url';
```



<br>

**特别说明：**

* 在使用 `gif.js` 时有 2 个需要引入
  * GIF 这个类
  * 以 Web Worker 方式运行生成 GIF 的 worker 对应的 .js 文件地址
* 由于是 web worker 对应的 .js 文件地址，所以在上面引入的时候我们使用了 vite 的特殊标记 `?url`



<br>

> 如果你使用 webpack，那么你需要使用 webpack 所支持的方式获取 gif.worker.js 编译后的文件地址。



<br>

### 使用

`gif.js` 使用方式很简单，看一下官方文档说明就可以了。

下面只是针对官方使用文档的整理。



<br>

#### 第1歩：创建配置 GIF 实例

```
const gif = new Gif( { workerScript: gifWorkerURL } )
```

我们需要将获取到编译后的 gif worker 文件地址 `gifWorkerURL` 作为配置 GIF 实例化的配置参数。

> 回顾一下我们获取引入 gif worker 的代码：
>
> `import gifWorkerURL from 'gif.js/dist/gif.worker.js?url';`



<br>

**完整的配置项：**

| 配置项       | 默认值          | 描述                                                         |
| ------------ | --------------- | ------------------------------------------------------------ |
| repeat       | 0               | -1(GIF只播放一遍)、0(GIF循环播放)                            |
| quality      | 10              | 像素采样间隔，该值越低最终图像越清晰                         |
| workers      | 2               | 启用workers数量                                              |
| workerScript | "gif.worker.js" | worker 脚本文件地址                                          |
| background   | \#fff           | 背景色                                                       |
| width        | null            | 宽度                                                         |
| height       | null            | 高度                                                         |
| transparent  | null            | 剔除(挖空)的透明颜色                                         |
| dither       | false           | 是否开启抖动 或 配置抖动方式<br />(默认抖动方式为 FloydSteinberg-serpentine) |
| debug        | false           | 是否将调试信息打印到控制台                                   |



<br>

**除了通过实例化构造函数 `new Gif( { ... } )`进行配置外，还可以在实例化后通过下面 2 个方法进行设置：**

* setOption

  ```
  gif.setOption('width',200)
  ```

* setOptions

  ```
  git.setOptions({width:200, height:200})
  ```



<br>

**关于配置项 dither 的补充说明：**

```
type DitherMethod =
        | "FloydSteinberg"
        | "FloydSteinberg-serpentine"
        | "FalseFloydSteinberg"
        | "FalseFloydSteinberg-serpentine"
        | "Stucki"
        | "Stucki-serpentine"
        | "Atkinson"
        | "Atkinson-serpentine";

dither?: DitherMethod | boolean | undefined;
```

从 `gif.js` 的类型定义中看到 dither 的类型定义，我们就知道：

* dither 可以设置为 boolean 值
  * 默认为 false，即关闭抖动
  * 若设置为 true 则使用 FloydSteinberg-serpentine 方式
* 也可以直接将 dither 设置为其他抖动方式
  * "FloydSteinberg"
  * "FloydSteinberg-serpentine" (默认)
  * ...
  * "Atkinson-serpentine"



<br>

#### 第2歩：通过 .on() / .once() 配置一些事件回调函数

配置事件回调的方法有 2 个：

* on()：每次都会触发
* once()：仅触发一次

具体事件回调看一下 类型定义就知道了：

```
on(event: "abort" | "start", listener: () => void): this;
on(event: "finished", listener: (blob: Blob, data: Uint8Array) => void): this;
on(event: "progress", listener: (percent: number) => void): this;

once(event: "abort" | "start", listener: () => void): this;
once(event: "finished", listener: (blob: Blob, data: Uint8Array) => void): this;
once(event: "progress", listener: (percent: number) => void): this;
```



<br>

对应日常使用而言，我们最需要配置的是 "finished" 事件。

```
gif.on('finished', (blob) => {
    window.open(URL.createObjectURL(blob))
})
```

> 当 GIF 文件生成完成后会触发 `finished` 事件，在回调参数中可以通过 blob 得到 GIF 文件的二进制内容。



<br>

#### 第3歩：通过 .addFrame() 添加 GIF 的某一帧画面

我们看一下 **addFrame()** 的类型定义：

```
type CanvasImageSource = HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas | VideoFrame;

interface AddFrameOptions {
    delay?: number | undefined;
    copy?: boolean | undefined;
    dispose?: number | undefined;
}

addFrame( image: CanvasImageSource | CanvasRenderingContext2D | WebGLRenderingContext | ImageData,options?: GIF.AddFrameOptions): void;
```



<br>

**第1个参数： GIF 新帧的图像来源**

主要分为 2 类

* CanvasImageSource：SVG、Video、Canvas、OffscreenCanvas、Image 这些 DOM 元素
* canvas 内容上下文：CanvasRenderingContext2D、WebGLRenderingContext

<br>

**第2个参数：该帧的配置项**

| 配置项  | 默认值 | 描述                                                |
| ------- | ------ | --------------------------------------------------- |
| delay   | 500    | 该帧的停留显示毫秒数                                |
| copy    | false  | 是否立即拷贝图像内容<br />(强烈建议配置该值为 true) |
| dispose | --     | ps: 该值文档上没有提，平时也用不到                  |



<br>

**关于 copy 的特别补充：**

假设不设置 `{ copy: true }`，即  `{ copy: false }`，那么在下面场景中生成的 GIF 就会有问题：

* 假定有一个画布元素 canvasEle
* 第一次执行 gif.addFrame(canvasEle)
* 修改 canvasEle 的内容
* 再次执行 gif.addFrame(canvasEle)
* ...
* 最终执行生成 GIF

**在上面举例场景中，由于每次添加的 GIF 内容都是  canvasEle 元素并且没有配置 copy: true (立即拷贝图像内容)，所以无论添加多少次，最终生成的 GIF 每一帧都是 canvasEle 最后一次的画面内容。**



<br>

**所以再次提醒：为了避免上述情况，记得将 copy 配置为 true。**



<br>

### 第4歩：通过 .render() 函数开始生成GIF

当我们已经执行添加多个 addFrame() 后，最终要生成该 GIF 内容结果：

```
gif.render()
```

> 当生成结束后会触发 'finished' 事件，执行我们前面添加的回调函数
>
> ```
> gif.on('finished', (blob) => {
>     window.open(URL.createObjectURL(blob))
> })
> ```



<br>

### 示例代码：

**下面是使用 threejs 生成某个模型水平旋转一周的 GIF 代码片段：**

```
import GIF from 'gif.js';
import gifWorkerURL from 'gif.js/dist/gif.worker.js?url';

const gifWidth = 200
const gifHeight = 200

const canvasEle = document.createElement('canvas')
canvasEle.width = gifWidth
canvasEle.height = gifHeight

const shareRender = new WebGLRenderer({ canvas: canvasEle, antialias: true })
const camera = new PerspectiveCamera(75, gifWidth / gifHeight, 0.04, 100)

//注意此处仅为 threejs 的代码片段
//假定 this._model 是我们添加场景中的一个 3D 模型(Mesh)
const box3 = new Box3().setFromObject(this._model)

const center = box3.getCenter(new Vector3())
const size = box3.getSize(new Vector3())

//为了确保一定能够看到完整的模型，所以此处我们定义了一个较大的尺寸
const maxSize = Math.max(size.x, size.y, size.z) 

const totalFrames = 12 //假定旋转一周需要 12 歩
let curFrame = 0

const gif = new GIF({
    width: gifWidth,
    height: gifHeight,
    quality: 4,
    workers: 2,
    workerScript: gifWorkerURL
})

gif.on('finished', (blob) => {

    //可以销毁一些对象
    shareRender.dispose()
    
    //查看生成的 GIF 图像
    window.open(URL.createObjectURL(blob))
    
})

const updateCameraPosition = () => {
    if (curFrame < totalFrames - 1) {
        curFrame++
        const angle = Math.PI * 2 / totalFrames * curFrame
        camera.position.set(center.x + maxSize * Math.cos(angle), center.y, center.z + maxSize * Math.sin(angle))
        camera.lookAt(center)
        shareRender.render(this._scene, camera)

        setTimeout(() => {
            gif.addFrame(canvasEle, { delay: 200, copy: true })
            updateCameraPosition()
        }, 100)

    } else {
        gif.render()
    }

}
updateCameraPosition()
```

