# CanvasKit学习笔记



<br>

## CanvasKit简介

<br>

**先介绍一下 Skia：**

Skia 是谷歌推出的一个用 c++ 开发的开源2D渲染引擎，谷歌浏览器、安卓、Flutter 中就使用了该引擎。

> 总之 Skia 是一个非常偏底层的 2D图形引擎



<br>

**再介绍一下 wasm：**

wasm 是 WebAssembly 的简称，可以将高级语言 例如 C/C++/Rust... 编译成 wasm中间字节码(二进制格式和指令集)，再由浏览器中的 wasm 虚拟机直接加载运行。

> 总之 wasm 相对于浏览器中的 js 更加偏底层，性能更高



<br>

**当 Skia 与 wasm 结合，就产生了 CanvasKit。**



<br>

**关于 Canvaskit：**

CanvasKit 是在谷歌浏览器中调用执行 Skia 进行 2D 图形绘制的一个 wasm 模块。

你可以理解为 CanvasKit 是 Skia 众多模块中的一个针对浏览器的一个小模块。

Skia 官方文档：https://skia.org/docs/

CanvasKit 介绍页：https://skia.org/docs/user/modules/quickstart/



<br>

**关于 canvaskit.wasm 和 canvaskit.js：**

CanvasKit 是由以下 2 个文件构成的：

1. wasm 文件：canvaskit.wasm
2. JS 文件：canvaskit.js

上面 2 个文件的共同作用下才构成了在浏览器中运行 CanvasKit 进行绘制 2D 的基础。



<br>

**关于 canvaskit.wasm 的特别说明：**

通常情况下我们都会使用官方提供的 .wasm，如果你真的有特殊需求，可以拉取源码，修改并自己编译 .wasm 文件。

代码仓库：https://github.com/google/skia/tree/main/modules/canvaskit



<br>

> 你需要：懂 c++ 程序、会编译导出 .wasm
>
> 这些都不是我们普通前端开发人员掌握的技术，所以就是用官方编译好的 canvaskit.wasm 就好了。



<br>

**CanvasKit 与 Canvas/WebGL：**

正常情况下网页 2D 绘制我们使用的是 Canvas / WebGL，或者是某些封装好的类库，例如 Konva.js 等。

那选择什么方案呢？

简单来说：

* 假定你的 2D 渲染项目并不复杂或者不是极端复杂，那么依然推荐使用 Canvas / WebGL
* 只有当你的项目极其复杂，且你特别爱追求性能，那么这个时候才可以考虑尝试一下 CanvasKit

因为：

* Canvas / WebGL / 第三方引擎库 例如 Konva.js 等很多东西都被封装好了，使用起来比较简单，且本身也能满足日常要求

* CanvasKit 虽然性能好，但偏原生，同样的效果可能需要编写更多代码才能实现

* 并且所谓 "使用 Skia 性能会更好" 仅仅是理论上的(或者是你想象中的)，实际项目中未必真的就一定比传统的 Canvas/WebGL 要好

  > 尤其是当你需要大量 JS 与 wasm 交互，有可能性能、开发体验反而更差



<br>

**总之，学习 CanvasKit 仅仅作为一种尝鲜，与实际投入到项目中还是有一些距离。** 



<br>

## 安装和引入CanvasKit



<br>

本文中所说的 "安装和引入CanvasKit" 暗指：canvaskit.wasm 和 canvaskit.js  这 2 个文件



<br>

### 浏览器端：

**引入方式1：直接原生网页引入并初始化**

```
<script src="https://unpkg.com/canvaskit-wasm@latest/bin/canvaskit.js"></script>
```

```
CanvasKitInit({
    locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@latest/bin/'+file,
}).then((CanvasKit) => {
    //此处可以开始编写你的代码
});
```



<br>

**关于上述流程的说明：**

通过 `<script>` 标签引入 canvaskit.js，此后就可以在 JS 中直接使用 `CanvasKitInit()` 函数。

* `CanvasKitInit()`的参数配置项中需要设置加载 .wasm 的地址
* `locateFile(file)` 中的 file 的值就是 "canvaskit.wasm"，所以我们在后续箭头函数返回值中可以直接使用 `file` 变量 来暗指 "canvaskit.wasm"
* `CanvasKitInit()`为异步函数，当加载 canvaskit.wasm 并初始化完成后，可以在该异步函数的 `then()` 中得到 CanvasKit
* 得到 CanvasKit 之后就可以开始后续编写绘制代码了



<br>

**引入方式2：通过安装 canvaskit-wasm (NPM包) 方式引入并初始化**

canvaskit 对应的 NPM 包名叫：canvaskit-wasm，并自带 TypeScript 类型文件

```
yarn add canvaskit-wasm
```

> 目前最新版为 0.38.2



<br>

> 下面是基于 React + Vite 来 演示的

```
import { useEffect } from 'react'
import CanvasKitInit from 'canvaskit-wasm'
import './App.css'

function App() {

    useEffect(() => {
        CanvasKitInit({
            locateFile: (file) => 'node_modules/canvaskit-wasm/bin/' + file,
        }).then((CanvasKit) => {
            console.log(CanvasKit)
            //此处可以开始编写你的代码
        })
    }, [])

    return (
        <div>hello</div>
    )
}

export default App
```



<br>

**特别提醒：.wasm 必须运行在 https 中**

由于 .wasm 必须运行在 https 中，所以我们直接在 react + vite 本地调试时，一定启用要 https 才可以。

以下仅适用开发阶段的本地调试：

* 安装 `@vitejs/plugin-basic-ssl`，它会自动为我们生成调试阶段的 https 证书

* 修改 vite.config.ts

  ```diff
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  + import basicSsl from '@vitejs/plugin-basic-ssl'
  
  // https://vitejs.dev/config/
  export default defineConfig({
  -  plugins: [react()],
  +  plugins: [react(), basicSsl()],
  })
  ```

* 修改 package.json 中 "scripts"

  ```diff
  - "dev": "vite",
  + "dev": "vite --https --host",
  ```

这样就可以在 react + vite 项目调试中启用 https，运行 CanvasKit 了。

若等到正式发布，再配置正规的 https 证书。



<br>

以上是以  React + Vite 来说如何启用 https 的，若是其他框架则自行查找启动 https 调试方式。

> 当你用过 Vite 后就再也不想用 Webpack 了。



<br>

### Node.js端

```
yarn add canvaskit-wasm
```

```
const CanvasKitInit = require('canvaskit-wasm/bin/canvaskit.js');
CanvasKitInit({
    locateFile: (file) => __dirname + '/bin/'+file,
}).then((CanvasKit) => {
    //此处可以开始编写你的代码
});
```



<br>

**特别补充：**

如果你修改你的 node.js 项目 package.json 中 "type" 字段值：

```
"type": "module"
```

那么你就可以使用 import 方式来引入，上面代码需要改成：

```
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import CanvasKitInit from 'canvaskit-wasm'

CanvasKitInit({
    locateFile: (file) => path.join(__dirname, 'node_modules/canvaskit-wasm/bin', file)
}).then((CanvasKit) => {
    //此处可以开始编写你的代码
})
```



<br>

**代码差异之处：**

* 差异1：由于 import 方式中不包含 `__dirname`，所以需要我们自己定义实现 `__dirname`

* 差异2：

  ```diff
  - const CanvasKitInit = require('canvaskit-wasm/bin/canvaskit.js');
  + import CanvasKitInit from 'canvaskit-wasm'
  ```

* 差异3：

  ```diff
  - locateFile: (file) => __dirname + '/bin/'+file,
  + locateFile: (file) => path.join(__dirname, 'node_modules/canvaskit-wasm/bin', file)
  ```

> 由于为了保持和 react 中引入方式相同，所以造成了我们需要后 2 个差异之处的改动



<br>

好了，关于安装引入初始化 CanvasKit 就到此结束，接下来开始学习它的基础用法。



<br>

## CanvasKit基础用法

未完待续...
