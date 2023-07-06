# Vite学习笔记

<br>

本文实在 vite 官方文档教程：https://cn.vitejs.dev/ 基础上，学习整理而来。



接下来我将通过对比 create-react-app 或 webpack 的形式来学习 vite。



<br>

## vite与webpack 的目标不同之处

vite 的目标就是构建适用于现代浏览器，根本不考虑旧版浏览器，例如 IE 11 等。

并且 vite 支持编译目标 JS 的版本最低为 ES2015。

所以如果你的项目需要适配旧的浏览器，那么建议你别使用 vite，还继续使用 webpack 吧。

当然你也可以选择安装使用 `@vitejs/plugin-legacy` 这个插件，用来适配到旧版浏览器。



<br>

## 创建初始化项目



<br>

**创建一个 React 项目：**

```diff
//创建 React 项目
- yarn create react-app xxx
+ yarn create vite xxx --template react

//创建 React + TypeScript 项目
- yarn create react-app xxx --template typescript
+ yarn create vite xxx --template react-ts
```



<br>

**补充说明：**

对于 create-react-app 来说，当创建项目时会自动创建安装 node_modules 包。

对于 vite 来说，默认是不会创建安装 node_modules 包的，需要你自己手工安装。

```
yarn
```



<br>

**初始化项目的文件区别：**

对于 create-react-app 来说，其网页模板位于 /public/index.html。

对于 vite 来说，其网页模板位于 /index.html

> vite 把当前项目目录作为 "静态文件服务根目录"，甚至可以配置多个不同的目录作为默认页



<br>

## 使用TypeScript



<br>

**使用 TS 的一些注意事项：**

* vite 天然支持 .ts 文件

* vite 只负责编译 .ts 文件，但不负责校验 TS 类型，TS 校验还是有 编辑器(VSCode) 和 eslint 完成

* 若只引入类型，推荐添加 `type` 字段，以明确仅引入类型

  ```diff 
  - import xx from 'xx'
  + import type xx from 'xx'
  ```



<br>

**TS 配置选项：**

和 TS 相关的一共有 4 个配置文件：

* tsconfig.json
* tsconfig.node.json
* vite.config.ts
* src/vite-env.ts



<br>

他们的关系是：

* tsconfig.json 中引入了 tsconfig.node.json

* tsconfig.node.json 中引入了 vite.config.ts

  > vite.config.ts 相当于 webpack 中的 webpack.config.js 配置项

* 而 src/vite-env.ts 为独立文件，用于定义某些 "客户端文件类型"，其内容默认值为：`/// <reference types="vite/client" />`



<br>

tsconfig.json 中 几个非常重要的配置项：

* isolatedModules：默认值为 true

  > isolated 单词翻译为 "隔离、孤立"

* skipLibCheck：默认值为 true

* useDefineForClassFields：默认值为 true



<br>

**特殊的三斜杠：**

src/vite-env.ts 中的 `/// <reference types="vite/client" />` 等同于 在 tsconfig.json 中：

```
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

> "vite/client"、"客户端类型" 可以暂时理解为 "通用的静态资源文件"，例如 .jpg、.svg 格式的文件

> reference 单词意思为：参考



<br>

**单独定义某种文件类型：**

假设想单独针对 .svg 文件进行某种类型定义，则：

> 创建 src/vite-env-override.d.ts 文件

```
declare module '*.svg' {
   const content: React.FC<React.SVGProps<SVGElement>>
   export default content
}
```

会把 .svg 文件视作是 React 的某种类型，然后再向 src/vite-env.ts 中添加刚才定义的：

```diff
+ /// <reference types="./vite-env-override.d.ts">
/// <reference types="vite/client">
```

> 注意要把自定义的 vite-env-override.d.ts 写在 "vite/client" 前面



<br>

## 关于CSS、sass样式

组建中引入某样式文件的方式和 create-react-app 是相同的。

```
import './xx.css'
```



<br>

**Vite内置支持sass：**

无需像 webgpack 那样需要安装 sass-loader，可以直接在 vite  项目中使用 sass。

唯一需要做的就是需要安装 sass：

```
yarn add sass --dev
```

除 sass 外还内置支持 less、stylus。

```
yarn add less --dev
yarn add stylus --dev
```

也就是说 vite 天然支持 .sass、.scss、.less、.styl、.stylus 样式文件。



<br>

**以包的形式引入样式：**

```diff
- import './xx.css'
+ import xx from './xx.css'

//然后可以有针对性的使用 xx 中的某些样式名称 xx.aa
mydiv.className = xx.aa
```



<br>

**仅引入包名称，但不引入样式实质内容：**

我们上面说的 "引入样式" 准确里说是 "注入样式"，vite 支持在样式文件后面增加 `?inline` 来表明仅引入包名称，不实质引入(注入)样式内容：

```
import xx from './xx.css?inline'
```



<br>

## 引入静态文件资源



<br>

**公共静态资源目录：**

默认为项目根目录中的 public 目录。

* 对于 public 目录中的资源引用时应使用 绝对根目录 '/'
* 你可以在 css 中使用 public 目录中的某些资源文件
* 但请不要在 js 中引入 public 中的资源



<br>

**引入某个静态资源：**

若为图片，可获得该图片被编译后的路径地址：

```
import imgUrl from './img.png'

myImage.src = imgUrl
```



<br>

若为 .json 可自动解析转换成对象

```
import json from './xx.json'

//或直接使用该 json 某根节点
import { field } from './xx.json'
```



<br>

**动态获取引入的资源路径：**

可以通过 new URL() + import.meta.url 形式获取：

```
const filePath = './xx/aa.jpg'

const fileUrl = new URL(filePath, import.meta.url).href
```



<br>

**动态导入：**

```
const module = await import(`./dir/${file}.js`)
```



<br>

**文件后缀可增加的参数：**

像上面提到的可以在 .css 文件后面增加 `?inline` 参数来表明 "引入css文件" 的某些特殊处理。

vite 还支持其他几种后缀参数，用于表明引入不同静态文件资源的特殊处理含义。



<br>

**?inline：针对 css 文件**

表明仅引入样式名称模块，并不会真正引入(注入)样式内容



<br>

**?url：用于显式获取文件边以后地址**

对于一般的静态资源文件，引入后本身就可以获取其被编译后的路径地址，但是对于一些未被包含在内部列表中的文件资源，可以通过增加 `?url` 显式明确获取编译后的路径地址。

```
import xxUrl from 'xxx/xx.js?url'
```



<br>

**?raw：以原始纯文本(字符串) 形式引入**

例如引入 WebGPU 着色器代码(纯文本)

```
import xx from ./xx.wgsl?raw
```

引入 WebGL 着色器代码

```
import xx from './xx.glsl?raw'
```



<br>

**?worker：以 web worker 形式引入**

我们知道 web worker 文件需要是独立的文件，如果在 webpack 中需要使用 worker-loader 加载器才能正确编译并找到编译后的 .js 文件。

vite 天然支持，无需 worker-loader。

```
import MyWorker from './xx.js?worker'

const myWorker = new MyWorker()
```



<br>

**?sharedworker：同源共享类型的 web worker**

sharedWorker 是一种特殊的 web worker，使用 `?sharedworker` 可以引入

```
import MySharedWorker from './xx.js?sharedworker'
```



<br>

**参数组合：?worker&inline**

以内联为 base64 字符串形式引入 web worker

```
import InlineWorker from './xx.js?worker&inline'
```

> 目前我还没用过这种方式，具体应用场景暂时不清楚



<br>

**?init：针对 .wasm 文件的导入和初始化**

```
import init from './xx.wasm?init'

init().then((instance) =>{ instance.exports.test() })
```



<br>

**特别说明：web worker 的另外一种推荐导入方式**

除了 `?worker` 和 `?sharedworker` 这种形式导入 worker 外，更加推荐使用 new Worker() 和 new SharedWorker() 方式来导入。

这种方式和原生的创建 web worker 方式极为相似，只不过是用 new URL() + import.meta.url 形式。

```
//在JS原生中的写法
const myWorker = new Worker('./xx.js')

//在vite中之前的写法
import MyWorker from './xx.js?worker'
const myWorker = new MyWorker()

//在vite中新的推荐写法
const myWorker = new Worker(new URL('./xx.js', import.meta.url))
```



<br>

还可以增加第2个配置参数：

```
const myWorker = new Worker(new URL('./xx.js', import.meta.url), { type:'module' })
```



<br>

## 命令参数



<br>

**Vite 命令参数划分：**

我们使用 vite 大体上可以划分为 3 种目的方向：

* 开发过程
* 构建
* 其他(预构建依赖、本地预览构建产物)



<br>

为了更加方便理解，我们现明确一下命令参数含义：

* --xxx：命令参数名
* -x：命令参数的简写形式
* [xx]：可选值，若不填则使用默认值
* `<xx>`：必填值



<br>

**参数名与参数值采用 --xxx=xx 这种形式。**



<br>

**开发过程中的配置参数：**

```
vite [参数]
```

* --host [host]：指定主机名称
* --port <port>：指点启用端口
* --strictPort：明确若端口已被占用则直接退出，并不会尝试下一个可用端口
* --open [path]：启动时自动打开浏览器，[path] 为指定打开的路径
* --base <path>：公共基础路径，默认值为 '/'

* --https：启用 TLS + HTTP/2
* --cors：启用 CORS
* --force：忽略缓存，强制重新构建
* -c、--config <file>：使用指定的配置文件
* -m、--mode <mode>：设置环境模式
* -v、--version：显式版本号
* -h、--help：显式可用的 CLI 选项
* -d、--debug [feat]：现实调试日志
* -f、--filter <filter>：过滤某些调试日志
* -l、--logLevel <level>：显示哪种日志级别，info/warn/error/silent，默认值为 'info'
* --clearScreen：允许或禁止清除日志屏幕



<br>

**构建相关参数命令：**

```
vite build [参数]
```

* --target <target>：编译目标，默认值为 "modules"

* --outDir <dir>：输出目录，默认值为 "dist"

* --base <path>：公共基础路径，默认值为 '/'

* --emptyOutDir：若输出目录在根目录外，则强行清空输出目录

  > 对于根目录内的输出目录，即使不设置该参数，也会每一次强行清空该目录

* --assetsDir <dir>：输出目录中的资源目录，默认值为 "assets"

* --sourcemap [output]：是否构建输出 source map 文件，默认值为 false

* --minify [minifier]：允许或金庸最小化混淆，或指定使用哪种混淆器，默认为 "esbuild"

  > 可修改混淆器为 "terser"，若设置为 false 则表示不使用混淆

* --manifest [name]：是否构建后生成 manifest.json 文件

  > [name] 可设置为 true 或 false，若想自定文件名则直接设定 name 的值

* --ssrMainfest [name]：是否构后生成 SSR manifest.json 文件

  > 配置方式同 --manifest

* --ssr [entry]：为服务端渲染配置指定入口文件

* --assetsInlineLimit <number>：静态资源内联为 base64 编码的阈值，以字节为单位，默认值 4096

* -w、--watch：监控磁盘是否发生变更，若发生变更则重新(重头)构建

* 其他参数(-c、--base、--clearScreen、-d、-f、-m、-h)和 开发过程中的相同



<br>

**特别说明：** 

因为对于构建好的网页项目，若其将来并不在域名根目录下，那么就使用 --base 这个命令参数。

但是，更推荐另外一种做法：

去修改 vite.config.ts 的 `base` 字段，将其修改成其他值，例如相对路径 '.' 或 具体路径 '/xx/'

```
import { defineConfig } from 'vite'

export default defineConfig({
  base:'.', //注意此处
  ...
})
```



<br>

**其他(预构建依赖、本地预览构建产物)**

```
vite preview [参数]
```

所谓 "预览构建产物" 你可以简单理解为 "实际构建中间的预览版"。

**永远不要把 本地预览构建产物 当做构建产物来用！**

可用适用的参数几乎和上面的差不多，具体可参考：https://cn.vitejs.dev/guide/cli.html



<br>

**上面所有的命令参数实际上都可以通过修改配置 vite.config.ts 文件来实现。**

他们大致划分为：

* 共享选项(开发过程、构建、其他 都可以使用到的)：https://cn.vitejs.dev/config/shared-options.html
* 服务器选项(开发过程)：https://cn.vitejs.dev/config/server-options.html
* 构建选项(构建)：https://cn.vitejs.dev/config/build-options.html
* 预览选项：https://cn.vitejs.dev/config/preview-options.html
* 依赖优化选项：https://cn.vitejs.dev/config/dep-optimization-options.html

此外还有上述命令参数中不存在的配置项：

* SSR选项：https://cn.vitejs.dev/config/ssr-options.html
* Worker选项：https://cn.vitejs.dev/config/worker-options.html



<br>

具体用到哪些时直接看官方文档即可。



<br>

## 使用插件



<br>

**vite插件与rollup插件的关系：**

* vite 最初是以 rollup 为基础(参考) 而来的，所以 rollup 的一些插件都可以直接应用在 vite 之上
* vite 本身已经内置了很多 和 rollup 类似的插件
* 但有些 rollup 插件会与 vite 内置插件冲突



<br>

所以，当我们说 "vite插件" 时实际上内含 2 种插件：

1. 专门针对 vite 的插件
2. 同样适用于 vite 的 rollup 的插件



<br>

从另外一个角度，以插件开发者身份的角度来看一共有 4 类：

* vite 官方维护插件

  > 官方只维护针对不同框架的插件，例如 vue、react 等

* vite 社区维护的插件

  > 涵盖了绝大多数日常项目开发所需的插件

* 第三方个人开发的 vite 插件

  > 无法保证质量，慎用

* rollup 插件

  > 要考虑有可能会与 vite 官方插件、社区插件有冲突风险



<br>

**寻找插件：**

1. 首先：强烈推荐使用 vite 官方社区维护的插件：https://github.com/vitejs/awesome-vite#plugins
2. 其次：NPM 平台 https://www.npmjs.com/ 中，搜索：vite-plugin 来搜索相关插件
3. 备选：https://vite-rollup-plugins.patak.dev/



<br>

vite 官方社区维护的插件已经几乎涵盖日常开发中各个方面了，品质和兼容性有保障。



<br>

**添加一个插件：**

第1步：安装某插件

```
yarn add @vitejs/plugin-xx --dev
```

第2步：在 vite.config.ts 配置文件中的 plugins 数组中添加 xx 和 它的配置项



<br>

像我们前面创建的 react 项目，默认就是用的是 `@vitejs/plugin-react` 这个插件。

```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], //若安装新插件，需要追加到此数组中
})
```

> vite 内置的插件并未暴露在 plugins 数组中。



<br>

**插件执行顺序：**

默认情况下我们安装的插件都会在 vite 核心插件执行之后才调用。

若想修改我们安装的插件与 vite 核心插件 或 构建插件 的执行顺序，可通过给插件添加 `enforce` 字段来明确执行契机。

* 默认值(不配置)：在 vite 核心插件之后调用该插件

* enforce: 'pre'：在 vite 核心插件之前调用该插件

  > 注意此处说的是：vite  核心插件

* enforce: 'post'：在 vite 构建插件之后调用该插件

  > 注意此处说的是：vite 构建插件



<br>

**按需使用插件：**

除了上面提到的修改 插件 执行先后顺序外，我们还可以配置某插件仅在某模式下使用。

这里说的 某模式 是指：开发模式 和 生产模式

默认情况下插件会在上面 2 个模式中都调用，我们可通过 `apply` 字段来控制仅在某固定模式下才被调用。

* apply: 'build'：仅在构建模式下调用
* apply: 'serve'：仅在开发模式下调用



<br>

**开发自己的插件：**

首先需要阅读 rollup 插件文档：https://rollupjs.org/plugin-development/

然后再熟悉 vite 插件 API 和 约定：https://cn.vitejs.dev/guide/api-plugin.html



<br>

## 构建生产版本



<br>

**修改公共目录：**

默认使用的是 '/' 作为根目录，如何修改在前面讲 --base 命令参数时已经说过了，此处再复习一遍。

一共有 2 中修改方式：

* 第1种：添加构建命令参数：

  ```
  vite build --base=./
  ```

* 第2种：修改 vite.config.ts 配置项

  ```
  import { defineConfig } from 'vite'
  
  export default defineConfig({
    base:'.', //注意此处
    ...
  })
  ```



<br>

**特别说明：base 与 root 的区别**

* base 是指编译后的文件的资源公共目录
* root 是指我们存放的项目源码的基础公共目录



<br>

**多页面模式：**

vite 支持多页面应用模式，也就是说不再是单页面，可以是多目录、多页面。

那么意味着：

1. 你需要指定 N 个页面目录路径
2. 指定每个目录页面的入口文件

例如 vite 官方给出的一个示例：

```
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
})
```

上面配置项中，分别定义了 2 个页面应用目录：

* main(主目录)：入口文件 'index.html'

  > 对应访问地址 '/'

* nested(自定义的目录)：入口文件 'nested/index.html'

  > 对应访问地址 '/nested/'



<br>

**更为复杂的基础路径配置：**

vite 还支持将不同文件存放在不同的路径中，这样做的目的是为了在部署时可以有更大的自由度，例如有些目录需要启用 CDN 加速，而有些不需要。

具体配置方式：https://cn.vitejs.dev/guide/build.html#advanced-base-options