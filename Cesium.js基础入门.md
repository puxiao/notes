# Cesium.js基础入门

从今天 2021.08.16 开始学习 Cesium.js。

我建议你在学习 Cesium.js 之前，先学习了解一下 GIS 相关概念。

可以查看我写的这篇学习笔记：[GIS基础概念.md](https://github.com/puxiao/notes/blob/master/GIS基础概念.md)



<br>

## Cesium简介

2011 年，当时美国航空航天软件公司开发了一套用于创建应用空间可视化的软件平台。

通过该软件平台，制作出了一个非常精细、准确的 虚拟3D地球。

为了凸显这个软件平台的 `精细、准确` 这个理念，所以使用 原子钟 核心元素 “**铯(cesium)**” 这个英文单词来作为该平台的名字。

该软件平台(cesium)于 2012 年开源。

**Cesium** 就是本文我们要学习的内容。

<br>

**Cesium 软件平台提供一套完整的工具，可用于构建任何类型的 3D 地理空间应用程序。**

**Cesium 软件平台分为 开源免费 和 商业收费 2 种模式。**

> 实际上绝大多数开源项目都有 免费和商业 2 种模式，例如 红旗Linux系统、MongoDB 等等。



<br>

**Cesium 和 Cesium.js 的关系：**

Cesium 是一个平台，提供多种基于 3D 地理空间应用的工具。

Cesim.js 是该平台提供的客户端(浏览器) 对应的 JS 文件。

> 在本文很多时候为了方便，会把 cesium.js 写成 cesium，你明白 cesium 所指即可。



<br>

**Cesium与其他类库的关系：**

1. Three.js：Cesium 支持加入 WebGL 交互，当然也意味着支持 Three.js。
2. Openlayers：这个库是用于开发 2D 地图的，而 Cesium 用于开发 3D 地图。
3. OpenMap：这个库也是用于开发 2D 地图的，侧重于自定义地图、给地图添加各种数据标记等。
4. openstreetmap.org 开放街道地图：这是一个提供免费地图数据的网站



<br>

本文，我们将尝试通过构建一个简单的示例来逐步学习 Cesium 。



<br>

## 初始化项目

本文将基于 React + TypeScript + Scss + alias 来编写代码。

> Scss、alias 这都是我个人的习惯，实际上在本项目中用处并不是那么大，你不想使用可以跳过相应的步骤。
>
> 我非常建议你使用 React + TypeScript，如果你使用的是 Vue，那么也应该可以看懂本文的代码内容。



<br>

**第1步：创建并初始化项目**

```
//初始化本项目，本项目使用 react 版本为 17.0.2
yarn create react-app test-cesium --template typescript
```

```
//更新 typescript 至最新版本，本项目使用版本为 4.3.5
yarn add typescript
```

```
//安装 node-sass 5.0.0，因为目前 create-react-app 还不支持最新版的 6.0.0
yarn add node-sass@5.0.0
```

```
//安装 craco，可以方便我们后期添加各种配置
yarn add @craco/craco
```

```
//安装 cesium，本项目使用版本为 1.84.0
yarn add cesium
```

```
//安装 cesium 对应的 TypeScript 声明库，本项目使用版本为 1.67.14
yarn add @types/cesium
```



<br>

以上代码可以合并为 2 行：

```
yarn create react-app test-cesium --template typescript

yarn add typescript node-sass@5.0.0 @craco/craco cesium add @types/cesium
```



<br>

**第2步：清除一些无用文件或代码**

1. 删除 src 目录下除 App.css、App.tsx、index.css、index.tsx 以外的其他文件
2. 删除 public/index.html 中的所有注释，顺便将 `<title>` 内容修改为 “Hello Cesium”
3. 删除 src/index.tsx 中的注释 和 reportWebVitals 相关的代码
4. 删除 src/App.tsx 中 `<div>` 内的代码、删除 `import React from 'react'`
5. 删除 src/App.css 中全部的样式代码



<br>

**第3步：修改或添加一些项目配置**

1. 修改 src 目下的 App.css 和 index.css 的文件后缀，改为 .scss，同时修改 App.tsx 和 index.tsx 中引用这两个样式文件路径中的后缀

2. 项目根目录添加 `.eslintrc` 文件内容为：

   > 这是为了让我们使用 TypeScript 的 as 符号时不报错。

   ```
   {
       "extends": ["react-app", "react-app/jest"],
       "rules": {
       
       }
   }
   ```

3. 项目根目录添加 `tsconfig.paths.json` 文件内容为：

   ```
   {
       "compilerOptions": {
           "baseUrl": ".",
           "paths": {
               "@/src/*": ["./src/*"],
               "@/components/*": ["./src/components/*"]
           }
       }
   }
   ```

4. 项目根目录添加  `craco.config.js` 文件内容为：

   ```
   const path = require('path');
   
   module.exports = {
       webpack: {
           alias: {
               "@/src": path.resolve(__dirname, "src/"),
               "@/src/components": path.resolve(__dirname, "src/components/")
           }
       }
   };
   ```

5. 修改项目根目录的 `package.json`，将调试命令修改为：

   ```
   "scripts": {
       "start": "craco start",
       "build": "craco build",
       "test": "craco test",
       "eject": "react-scripts eject"
   },
   ```

   同时在顶部，添加 `homepage` 的配置：

   ```diff
   {
       "name": "test-cesium",
       "version": "0.1.0",
       "private": true,
   +    "homepage": ".",
       "dependencies": {
           ...
       }
   }
   ```

6. 修改项目根目录的 `tsconfig.json` 文件内容改为：

   ```
   {
     "extends": "./tsconfig.paths.json",
     "compilerOptions": {
       "target": "es2017",
       "lib": [
         "dom",
         "dom.iterable",
         "WebWorker",
         "WebWorker.ImportScripts",
         "esnext"
       ],
       "allowJs": true,
       "skipLibCheck": true,
       "esModuleInterop": true,
       "allowSyntheticDefaultImports": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noFallthroughCasesInSwitch": true,
       "module": "esnext",
       "moduleResolution": "node",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "sourceMap": true,
       "removeComments": false,
       "noImplicitOverride": false
     },
     "include": [
       "src"
     ]
   }
   ```

7. 项目根目录添加 `global.d.ts` 文件内容为：

   ```
   declare module '*.png';
   declare module '*.gif';
   declare module '*.jpg';
   declare module '*.jpeg';
   declare module '*.svg';
   declare module '*.css';
   declare module '*.less';
   declare module '*.scss';
   declare module '*.sass';
   declare module '*.styl';
   declare module '*.asc';
   declare module 'react-app-rewire-alias';
   ```

至此，一个空白的项目创建完成。



<br>

**补充说明：**

对应一个规范严格的项目而言，目前我们缺失的配置有：

1. 项目的 VSCode 配置 `.vscode`
2. 项目的说明 `README.md`
3. 项目的版权 `LICENSE`
4. 项目的演变 `CHANGELOG.md`
5. 项目的测试用例 `test/`

上面提到的这些和我们要学习的 Cesium.js 关系不大，所以就不做相关配置了。



<br>

## 注册一个Cesium ion 账号

我们首先需要搞明白一个事情：

1. Cesium ion 是一个 3D GIS 的平台，可以提供一些 3D 地理空间数据
2. Cesium.js 是 Cesium ion 平台提供的一个客户端 js 文件
3. 因此当我们使用 cesium.js 想从 Cesium ion 平台上获取一些数据时，就需要有一个 Cesium ion 的账户
4. 因为我们需要使用 Cesium ion 账户下的令牌(token)，以判定我们获取 Cesium 上某项目的读写和执行权限



<br>

注意：如果你的项目数据根本使用不到 Cesium ion 上的数据，那么是可以跳过本小节的。

> 不使用 Cesium ion 是指我们的项目使用自有的 3D 数据源
>
> 涉及到机密的地理信息数据，一定注意安全防范意识。随意将国家地理数据上传到国外是犯法的！！！

但是我们是刚接触 cesium.js，在编写 hello world 时是需要使用 Cesium ion 提供的数据的，所以还是要注册账号的。



<br>

**注册账户**

https://cesium.com/ion/signup/



<br>

**获取令牌(token)**

> token 可以被翻译为：令牌、秘钥

https://cesium.com/ion/tokens

默认注册账户成功后，就会有一个默认的令牌 `Default Token`。

<br>

你可以选择 `Create token` 自己创建一个令牌，并根据提示设置该令牌的相关权限：

| 令牌范围(权限) | 默认是否开启 | 对应含义      |
| -------------- | ------------ | ------------- |
| assets:list    | 关闭         | 列出 ion 数据 |
| assets:write   | 关闭         | 写入权限      |
| assets:read    | 开启         | 读取权限      |
| geocode        | 开启         | 地理编码服务  |
| profile:read   | 关闭         | 读取 ion 配置 |

> 请注意 assets:list、assets:write、profile:read 配置权限可能是需要 Cesium ion 商业服务才用到的



<br>

免费的账户，默认的令牌只开启了：assets:read、geocode

> 你也不要奢望自己对别人的项目拥有很多权限



<br>

**配置当前项目的令牌：**

默认  https://cesium.com/ion/tokens 左侧令牌列表中 选中的是 默认令牌，此时网页右侧就会显示该令牌的秘钥 和 令牌的权限。

复制右侧 `Token` 的内容。



<br>

在我们后续的示例项目中，会有以下代码片段：

```
import * as Cesium from 'cesium';

Cesium.Ion.defaultAccessToken = 'your_access_token';

...
```

我们需要做的就是将复制得到的 `Token` 秘钥替换上述代码中的 `your_access_token`



<br>

## 编写HelloWorld

根据 Cesium.js 官方文档提供的示例代码，我们将 src/App.tsx 内容更改为：

```
import { useEffect } from 'react';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

function App() {

    useEffect(() => {

        //@ts-ignore
        window.CESIUM_BASE_URL = '/';

        //下面的秘钥是我随意编写的字符，你一定要更换成你自己账户对应的 token 秘钥。
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiyXVCJ9.eyJqdGkiOiJiZTgxMTM3OS02MC03MzQ1NDFhOTBiNWIiLCJpZCI6NIsInR5cCI6IkpLdCiEYCdmYjg5LTRkNzYtODU4QTAmnketCiZIQsdR4jQyMzIsImlhdCI6MTYyODk5NTQ0OH0.FCf9_DL02Gr7730c';

        const viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain()
        });

        const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
            orientation: {
                heading: Cesium.Math.toRadians(0.0),
                pitch: Cesium.Math.toRadians(-15.0),
            }
        });

        return () => {
            buildingTileset.destroy();
        }

    }, [])

    return (
        <div id='cesiumContainer'>
        </div>
    );
}

export default App;
```

> 再次提醒：上述代码中，一定要将 token 替换成你自己真实的秘钥，否则网页是无法正常运行的。
>
> 我们暂时先不去理解其他的代码



<br>

**补充说明：**

1. 对于 Three.js 的项目，我们需要的是一个 画布标签  `<canvas>` ，而对于 Cesium.js 来说我们需要的是一个 `<div>` 标签。

   并且给该 div 添加一个名为 `cesiumContainer` 的 id。

2. 请留意上面代码中的这一行：

   ```
   //@ts-ignore
   window.CESIUM_BASE_URL = '/';
   ```

   可以看出来 cesium.js 需要向 window 添加一个全局变量 CESIUM_BASE_URL 。

   由于我们使用的是 TypeScript，检查到 window 默认并不包含该属性，所以会报错，我们这里暂时通过注释选择忽略这个问题。



<br>

**调试运行：**

```
yarn start
```

<br>

假设一切顺利，那么你可能会看到这样的网页内容。

![hello-cesium](https://puxiao.com/temp/hello-cesium2.jpg)



<br>

**真的一切顺利？**

第一次运行当然不可能就这么简单顺利，这里我说一下我遇到的问题。



<br>

**遇到的第 1 个问题：Browserslist**

下面是我的控制台打印的信息

```
> yarn start
yarn run v1.22.5
$ react-app-rewired start
The following changes are being made to your tsconfig.json file:
Starting the development server...

Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db

Why you should do it regularly:
https://github.com/browserslist/browserslist#browsers-data-updating
=============

WARNING: You are currently running a version of TypeScript which is not officially supported by @typescript-eslint/typescript-estree.

You may find that it works just fine, or you may not.

SUPPORTED TYPESCRIPT VERSIONS: >=3.3.1 <4.2.0
```

根据提示，我对 Browserslist 进行了升级：

```
npx browserslist@latest --update-db
```

<br>

当我升级完 browserslist 之后，再次执行 `yarn start` 上述错误就没有了。

包括上面提到的 TypeScript 相关的警告。

如果你执行时没有遇到我这个错误，那可以忽略这一部分。



<br>

**遇到的第 2 个问题：**

页面虽然渲染出来了，但是 VSCode 控制台报了 3 个相同的错误警告：

```
./node_modules/cesium/Source/Core/buildModuleUrl.js
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
```



<br>

经过一番网上搜索，最终知道这是因为 buildModuleUrl.js 这个文件中，计算 require 声明的 AMD 模块里的 toUrl 函数和标准的不兼容。

需要 2 步来解决这个问题。

1. 添加 webpack 配置，添加对应的规则，忽略该错误警告

2. 添加 webpack 配置，明确告知存在标准不兼容

   > 这一步是可选的



<br>

**第 1 步：忽略错误**

修改项目根目录下的 `craco.config.js` 文件，添加上关于忽略 unknownContextCritical 的警告配置：

```
module.exports = {
    webpack: {
        configure: (config) => {
            //移除cesium警告
            config.module.unknownContextCritical = false
            config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
            return config
        }
    }
};
```



<br>

**第 2 步：明确不兼容**

> 尽管这一步是可选的，但是依然建议添加上

修改项目根目录下的 `craco.config.js` 文件，添加上 output.amd.toUrlUndefined 配置：

```
module.exports = {
    webpack: {
        output: {
            amd: {
                // Enable webpack-friendly use of require in Cesium
                toUrlUndefined: true
            }
        }
    }
};
```

> 允许 Cesium 兼容 webpack的 require 方式



<br>

自此，我们的 craco.config.js 内容如下：

```
const path = require('path');
module.exports = {
    webpack: {
        alias: {
            "@/src": path.resolve(__dirname, "src/"),
            "@/src/components": path.resolve(__dirname, "src/components/")
        },
        configure: (config) => {
            //移除cesium警告
            config.module.unknownContextCritical = false
            config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
            return config
        },
        output: {
            amd: {
                // Enable webpack-friendly use of require in Cesium
                toUrlUndefined: true
            }
        }
    }
};
```



<br>

以上两个问题我们暂时都解决了，接着是第 3 个问题。



<br>

**遇到的第 3 个问题：**

页面虽然渲染出来了，但是浏览器控制台报了 4 个错误信息：

```
http://localhost:3000/Assets/approximateTerrainHeights.json 404 (Not Found) - Resource.js:2193
http://localhost:3000/Assets/IAU2006_XYS/IAU2006_XYS_17.json 404 (Not Found) - Resource.js:2193
Uncaught SyntaxError: Unexpected token '<' - cesiumWorkerBootstrapper.js:1
Uncaught SyntaxError: Unexpected token '<' - transferTypedArrayTest.js:1
```

<br>

同时，通过观察渲染出来的网页，我们可以明显看出有以下几个问题：

1. 网页右上角倒数第 2 个图标图片没有显示，我们暂时也不清楚该按钮的意义。通过网页源码查看该图片地址为：

   ```
   http://localhost:3000/Widgets/Images/ImageryProviders/bingAerial.png
   ```

   可以看出这个图片地址是本项目本地的一个图片，我们暂且不去深究这个图片对应的含义和如何设置该图片。

2. 网页底部左侧，也同样有一个图片缺失：

   ```
   http://localhost:3000/Assets/Images/ion-credit.png
   ```




<br>

通过查询 cesium.js 官方文档，https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/ ，我们知道原来缺失的文件在 npm 的 cesium 包中。

我们需要做的，就是将这些文件拷贝到项目中。

有 2 种拷贝方式：

1. 手工拷贝文件
2. 通过添加 webpack 配置，向 plugins 中添加 CopyWebpackPlugin 插件，以实现每次编译时自动拷贝。



<br>

**拷贝方式 1 ：手工拷贝**

1. 在我们项目根目录的 public 中，创建一个名为 static 的目录

2. 将 node_modules/cesium/Build/Cesium/ 这个目录下的 Assets、ThirdParty、Widgets、Workers 拷贝到 /public/static 中

   > 特别说明：Cesium.js 官方文档中有 2 处讲解此内容时，略有不一致。
   >
   > 区别在于是否拷贝 ThridParty 目录。从目前来说，即使不拷贝 ThirdParty 目录是可以的。

3. 修改 App.tsx，配置 CESIUM_BASE_URL

   ```
   window.CESIUM_BASE_URL = './static/Cesium/';
   ```

   > 无需在乎路径中的大小写



<br>

**拷贝方式 2 ：webpack 插件拷贝**

1. 安装拷贝插件

   ```
   yarn add copy-webpack-plugin --dev
   //或
   npm install --save-dev copy-webpack-plugin
   ```

2. 添加插件 webpack 配置项，这样 craco.config.js 内容为：

   ```
   const path = require('path');
   const CopywebpackPlugin = require('copy-webpack-plugin');
   
   module.exports = {
       webpack: {
           alias: {
               "@/src": path.resolve(__dirname, "src/"),
               "@/src/components": path.resolve(__dirname, "src/components/")
           },
           configure: (config) => {
               //移除cesium警告
               config.module.unknownContextCritical = false
               config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
               return config
           },
           output: {
               amd: {
                   // Enable webpack-friendly use of require in Cesium
                   toUrlUndefined: true
               }
           }
           plugins: [
               // Copy Cesium Assets, Widgets, and Workers to a static directory
               new CopywebpackPlugin({
                   patterns: [
                       { from: 'node_modules/cesium/Build/Cesium/Workers', to: '/static/Cesium/Workers' },
                       { from: 'node_modules/cesium/Build/Cesium/ThirdParty', to: '/static/Cesium/ThirdParty' },
                       { from: 'node_modules/cesium/Build/Cesium/Assets', to: '/static/Cesium/Assets' },
                       { from: 'node_modules/cesium/Build/Cesium/Widgets', to: '/static/Cesium/Widgets' }
                ]
               })
           ],
       }
   };
   ```

   

<br>

无论使用哪种拷贝方式均可。

> 这里我先选择手工拷贝，毕竟拷贝一次即可，而第 2 种拷贝每一次运行都需要执行一遍。
>
> 但如果选择手工拷贝也就意味着一个潜在的风险问题：
>
> 1. 如果项目要发布到生产环境，那么依然需要你手工拷贝，不像第 2 种方式可以实现自动化。
> 2. 同时你还要面临将 public/static/Cesium 所有的文件都会自动提交到 Git 中的问题，当然你可以选择在 .gitignore 中添加上这个目录，以便 git 忽略这个目录的文件变动检查。
>
> 因此我建议在开发环境中，可以选择手工拷贝，但是如果作为正式项目要发布到生产环境，则应该选择第 2 种方式。



<br>

**等一下，有个问题：**

我们实际上只需要 Assets、Widgets、Workers 目录中相关的资源文件，例如 图片 或 JSON 文件。

而上面这种直接整体拷贝文件夹的形式，岂不是把里面的 .js 文件也拷贝进去了？

额 ~ ，从目前来看确实存在这个问题，但是我们即使拷贝这些文件，似乎也占用不了多少文件空间，并且我们不用它们就行了。

所以就不要执着这个细节了。



<br>

**关于 Cesium 的 Webpack 其他配置项：**

更多 webpack 相关配置项，可查阅：

https://cesium.com/learn/cesiumjs-learn/cesiumjs-webpack/

https://github.com/CesiumGS/cesium-webpack-example/blob/main/webpack.config.js



<br>

**再次运行我们的 hello cesium 程序。**

执行 yarn start，此时就不会再有资源加载不到，或者其他报错信息了。

一切顺利，我们会看到的网页如下：

![hello-cesium](https://puxiao.com/temp/hello-cesium3.jpg)



<br>

**网页布局功能分析：**

从上面截图可以看到，除中间地图主体外，其他地方可以划分为几个功能区域：

1. 右上角 5 个图标按钮
2. 左下角 1 个轮盘
3. 底部中间 1 个时间轴
4. 右下角 1 个全屏按钮



<br>

接下来，我们依次讲解上述 5 个区域的功能。



<br>

**右上角从左往右依次 5 个图标按钮对应的功能：**

1. 搜索框：点击之后，出现输入框，可以通过位置关键词，定位到该地方
2. 回首页：点击之后，相当于回首页，当前地图就会缩小，将视觉由当前区域改为全球区域( 一个 3D 地球 )
3. 3D视图切换：点击之后，会出现下来菜单，共 3 个切换选项 3D、2D、Columbus View(哥伦布模式)
4. 当前地区：点击之后，出现地图列表，可以切换到其他地区
5. 帮助：点击之后，弹出交互提示文字
   1. 平移地图：摁下鼠标左键并拖动
   2. 放大地图：鼠标滚轴滚动 或 摁下鼠标右键并拖动
   3. 旋转地图：摁下鼠标中键并拖动 或 摁下 Ctrl 键的同时 摁下鼠标左键并拖动



<br>

**网页下面 3 个区域功能：**

1. 左下角 轮盘：用于控制切换进度的速度，通过鼠标可以修改仪表看上的指针来，依次来调整变换的速度。同时可以点击轮盘上的 播放键，进行自动播放。
2. 底部中间 时间轴：鼠标点击时间轴上某个位置，可以将当前区域切换成对应时间节点的光照亮度效果。
3. 右下角 全屏按钮：点击之后网页全屏



<br>

**小总结：**

自此，我们的 React + TypeScript + Cesium 简单示例已经完成。

接下来，我们将逐步深入学习 Cesium.js。



<br>

## 一切的开始：Viewer

从上一节的 App.tsx 中，我们可以看到：

```
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});
```

Cesium.Viewer 这个类是 3D 地图 一切的开始，那么我们本小节就开始学习 Viewer。



<br>

**关于 Cesium.js Viewer 的 API 文档：**

1. 最新 1.84 版的英文文档：https://cesium.com/learn/cesiumjs/ref-doc/Viewer.html
2. 较旧 1.72 版的中文文档：http://cesium.xin/cesium/cn/Documentation1.72/Viewer.html



<br>

**关于 widget 单词的解释：**

在 cesium.js 官方文档中，大量使用了 widget 这个单词。

widget 对应中文翻译为：小装置、小器物、小部件

在 cesium.js 中，我们统一将 widget 翻译为 小部件。

> 你可以把整个 cesium 应用程序想象成是一个运转的机器，而每一个 软件模块 对应这个机器上的一个 小部件，所有的小部件共同组成了整个机器。

个别时候可能为了书写省事，会把 “小” 字去掉，直接使用 “部件”。

> 例如当我们文字中出现 “动画小部件” 或 “动画部件” 时，你应该明白它俩是同一个意思。



<br>

### Viewer的简介

**Viewer** 用于构建应用程序的基本小部件。它将所有标准 Cesium 小部件组合在一个可重用的程序包中。

始终可以通过 mixins 扩展窗口小部件，添加对各种应用程序有用的功能。

简而言之，Viewer 是 Cesium 应用程序的基石，所有功能都是添加到 Viewer 中的。



<br>

**Viewer 的构造参数：**

| 构造参数  | 值类型             | 是否为必填 | 对应含义                               |
| --------- | ------------------ | ---------- | -------------------------------------- |
| container | Element \| String  | 是         | 用于包含 Viewer 的 DOM(div) 元素 或 ID |
| options   | ConstructorOptions | 否         | 描述初始化选项的对象                   |



<br>

**构造函数可能引发的错误：**

1. DeveloperError : Element with id "container" does not exist in the document.

   > 在 DOM 中找不到 ID 对应的元素

2. DeveloperError : options.selectedImageryProviderViewModel is not available when not using the BaseLayerPicker widget, specify options.imageryProvider instead.

   > options.selectedImageryProviderViewModel 在不使用 BaseLayerPicker 小部件时不可用，请改为指定 options.imageryProvider。

3. DeveloperError : options.selectedTerrainProviderViewModel is not available when not using the BaseLayerPicker widget, specify options.terrainProvider instead.

   > options.selectedTerrainProviderViewModel 在不使用 BaseLayerPicker 小部件时不可用，请改为指定 options.terrainProvider。



<br>

**初始化 Viewer 示例：**

```
const viewer = new Cesium.Viewer('cesiumContainer')

//

const viewer = new Cesium.Viewer('cesiumContainer',{
    sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
    terrainProvider: Cesium.createWorldTerrain(),
    baseLayerPicker: false
})

viewer.extend(Cesium.viewerDragDropMixin)
viewer.dropError.addEventListener(function(dropHandler,name,error){
    console.log(error)
    window.alert(error)
})
```



<br>

**一个最简单的 Cesium 示例：**

> 比我们上一节写的还要更加简单的示例

```
import { useEffect } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

function App() {

    useEffect(() => {

        //@ts-ignore
        window.CESIUM_BASE_URL = './static/Cesium/';

        const viewer = new Cesium.Viewer('cesiumContainer');

        return () => {
            viewer.destroy();
        }

    }, [])

    return (
        <div id='cesiumContainer'>
        </div>
    );
}

export default App;
```

> 该示例运行后，会看到一个 3D 地球



<br>

### Viewer的属性

| 属性名                                          | 是否为只读属性 | 对应含义                                                     |
| ----------------------------------------------- | -------------- | ------------------------------------------------------------ |
| allowDataSourcesToSuspendAnimation : Boolean    | 否             | 获取或设置数据源是否可以临时暂停动画，以避免向用户显示不完整的图片。 |
| animation: Animation                            | 是             | 获取动画部件                                                 |
| baseLayerPicker:BaseLayerPicker                 | 是             | 获取BaseLayerPicker<br />，实际上就是获取地图右上角第 4 个按钮(“当前地区选择器”)下拉内容 |
| bottomContainer: Element                        | 是             | 获取底部内容区域元素                                         |
| camera:Camera                                   | 是             | 获取相机                                                     |
| canvas:HTMLCanvasElement                        | 是             | 获取画布                                                     |
| cesiumWidget:CesiumWidget                       | 是             | 获取CesiumWidget<br />，即获取包含 Cesium 场景的小部件       |
| clock:Clock                                     | 是             | 获取时钟                                                     |
| clockTrackedDataSource:DataSource               | 否             | 获取或设置要与查看着的时钟一起跟踪的数据源                   |
| clockViewModel:ClockViewModel                   | 是             | 获取时钟视图模型                                             |
| container:Element                               | 是             | 获取父容器，即 Viewer 构造函数第1个参数对应的DOM元素         |
| dataSourceDisplay:DataSourceDisplay             | 是             | 获取用于 DataSource 可视化的显示                             |
| dataSources:DataSourceColliection               | 是             | 获取要可视化的 DataSource 实例集合                           |
| entities:EntityCollection                       | 是             | 获取未绑定到特定数据源的实体的集合。<br />实际上是 dataSourceDisplay.defaultDataSource.entities 的快捷方式 |
| fullscreenButton:FullscreenButton               | 是             | 获取全屏按钮                                                 |
| geocoder:Geocoder                               | 是             | 获取地理编码器，就是右上角那个搜索框，默认为 Bing 引擎       |
| homeButton:HomeButton                           | 是             | 获取“主页”按钮                                               |
| imageryLayers:ImageryLayerCollection            | 是             | 获取将在地球上渲染的图像图层的集合                           |
| infoBox:InfoBox                                 | 是             | 获取信息框                                                   |
| navigationHelpButton:NavigationHelpButton       | 是             | 获取“帮助”按钮                                               |
| postProcessStages:PostProcessStageCollection    | 是             | 获取后期处理阶段                                             |
| projectionPicker:ProjectionPicker               | 是             | 获取切换“透视或正交”的选择器                                 |
| resolutionScale:number                          | 否             | 获取或设置渲染分辨率的缩放比。<br />若值小于 1，可用于改善性能不佳的设备上。<br />而值大于 1，可用以更高的速度呈现分辨率，然后缩小比例，从而提高视觉保真度。 |
| scene:Scene                                     | 是             | 获取场景                                                     |
| sceneModePicker                                 | 是             | 获取“场景模式”按钮下拉对应的选择器。<br />对应的是右上角第 3 个按钮图标。 |
| screenSpaceEventHandler:ScreenSpaceEventHandler | 是             | 获取屏幕空间事件处理程序                                     |
| selectedEntity:Entity\|undefined                | 否             | 获取或设置要为其显示选项指示符的对象实例                     |
| selectedEntityChanged:Event                     | 是             | 获取所选实体更改时引发的事件                                 |
| selectionIndicator:SelectionIndicator           | 是             | 获取选择指示器                                               |
| shadowMap:ShadowMap                             | 是             | 获取场景的阴影贴图                                           |
| shadows:Boolean                                 | 否             | 确定阴影是否由光源投射                                       |
| targetFrameRate:Number                          | 否             | 在 useDefaultRenderLoop 时获取或设置小部件的目标帧速率。<br />如果未定义则使用浏览器的 requestAnimatioFrame 实现确定帧频。<br />注意：如果定义该值则数值一定要大于 0，但不要过于高，因为高于requestAnimationFrame 的值也无法实现。 |
| terrainProvider:TerrainProvider                 | 否             | 为地球提供表面地形或几何形状的提供者                         |
| terrainShadows:ShadowMode                       | 否             | 确定地形是投射光源还是投射阴影                               |
| timeline:TimeLine                               | 是             | 获取时间轴小部件                                             |
| trackedEntity:Entity\|undefined                 | 否             | 获取或设置相机当前正在跟踪的实体实例                         |
| trackedEntityChanged:Event                      | 是             | 获取当前被跟踪实体更改时引发的事件                           |
| useBrowserRecommendedResolution:Boolean         | 否             | 获取或设置是否使用浏览器推荐的分辨率。默认为 true。<br />如果为 true 则会忽略浏览器的设备像素比率 改用 1，根据CSS像素而不是设备像素进行渲染。<br />这样可以改善在像素密度较高、功能较弱的设备上的性能。<br />如果为 false，则渲染将以设备像素为单位。<br />注意：无论该值为什么，并不会影响 .resolutionScale 的值。 |
| useDefaultRenderLoop:Boolean                    | 否             | 获取或设置此小部件是否控制渲染循环。<br />如果为 true 则小部件将使用 requestAnimationFrame 执行小部件的渲染和调整大小，以及驱动模拟时钟。<br />如果为 false 则必须手动调用 resize、render 方法作为自定义渲染循环的一部分。<br />注意：如果在渲染过程中发生错误，比如发生 Scene 渲染错误事件，则会将该值设置为 false。<br />必须将其设置回 true 后才可以继续渲染。 |
| vrButton                                        | 是             | 获取 VRButton                                                |



<br>

**属性小总结：**

通过上面 Viewer 的 40 个属性介绍，我们可以大致讲他们分为：

1. 获取按钮或容器元素相关的
2. 获取数据、地形、实体、相机相关的
3. 获取或设置光源、投影相关的
4. 获取或设置渲染帧频、像素比率相关的额



<br>

### Viewer的方法

**destroy()**

销毁小部件。

请注意只是销毁，但并不会删除对应的 DOM 元素。如果要永久删除，还用应该从 DOM 上删除。



<br>

**extend(mixin,options)**

1. mixin:Viewer.ViewerMixin
2. options:Object

使用提供的 mixin 扩展基本查看器功能。混合可能会添加其他属性，功能或其他行为到提供的查看器实例。

> mixin 单词英文翻译为 ：混合



<br>

**flyTo(target,options): `Promise.<Boolean>`**

1. target:Entity | Array.<Entity> | ...
2. options:Object

将相机移动至提供的 一个或多个实体或数据源。

如果执行成功则异步返回 true，如果 target 并不会真实存在或取消飞行跳转则异步返回 false。

请注意这是一个异步操作，如果数据源仍在加载过程中，或者可视化仍在加载中，此方法在执行 镜头移动 之前会等待数据准备就绪。

偏移量是在以边界球中心为中心的局部 东北向上参考框的 航向/俯仰 范围。

在 2D 模式下，必须有一个俯仰图，摄像机将被放置在目标上方并向下看。上方的高度其目标将是范围。



<br>

**forceResize()**

强制窗口小部件重新考虑其布局，包括窗口小部件尺寸和版权声明。

> 在英文文档中使用的是 credit placement，直译过来就是：信用放置，大白话就是 “放版权声明的地方”



<br>

**isDestroyed():Boolean**

检查是否已被销毁。



<br>

**render()**

渲染场景。

该方法会自动调用，除非 viewer 的 .useDefaultRenderLoop 被设置为 false。



<br>

**resize()**

调整窗口小部件的大小以匹配容器的大小。

该方法会自动调用，除非 viewer 的 .useDefaultRenderLoop 被设置为 false。



<br>

**zoomTo(target,offset)**

异步设置相机以查看提供的一个或多个实体或数据。

如果数据源扔在加载中 或 可视化仍在加载中，此方法会在执行缩放前等待数据准备就绪。

> 该方法和 flyTo() 非常相似，只不过 flyTo() 用于针对目标进行视图跳转，而 zoomTo() 用于针对目标进行视图缩放。



<br>

可以看出，Viewer 的方法比较简单，几乎都是指针对当前 Viewer 进行一些视觉上的操作。



<br>

### View初始化选项

| 属性名                                                | 默认值                                   | 对应配置                                                     |
| ----------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------ |
| animation:Boolean                                     | true                                     | 是否创建 “动画” 小部件                                       |
| baseLayerPicker:Boolean                               | true                                     | 是否创建 BaseLayerPicker 小部件                              |
| fullscreenButton:Boolean                              | true                                     | 是否创建 FullscreenButton 小部件                             |
| vrButton:Boolean                                      | false                                    | 是否创建 VRButton 小部件                                     |
| geocoder:Boolean \|`Array.<GeocoderService>`          | true                                     | 是否创建 Geocoder 小部件<br />，就是右上角那个“搜索框”       |
| homeButton:Boolean                                    | true                                     | 是否创建 “主页” 小部件                                       |
| infoBox:Boolean                                       | true                                     | 是否创建 InfoBox 小部件                                      |
| sceneModePicker:Boolean                               | true                                     | 是否创建 SceneModePicker 小部件                              |
| selectionIndiacator:Boolean                           | true                                     | 是否创建 SelectionIndicator 小部件                           |
| timeline:Boolean                                      | true                                     | 是否创建 时间轴 小部件                                       |
| navigationHelpButton:Boolean                          | true                                     | 是否创建 导航帮助 按钮                                       |
| navigationInstructionsInitiallyVisible:Boolean        | true                                     | 是否最初就应该看到导航说明                                   |
| scene3DOnly:Booean                                    | false                                    | 是否每个几何实例仅以 3D渲染，以节省 GPU 内存                 |
| shouldAnimate:Boolean                                 | false                                    | 默认情况下时钟是否应该尝试提前模拟时间。<br />此选项优先于 clockViewModel |
| clockViewModel:ClockViewModel                         | new ClockViewModel(clock)                | 用于控制当前时间的时钟视图模型                               |
| selectedImageryProviderViewModel:ProviderViewModel    |                                          | 当前基础影像图层的视图模型。<br />如果未提供则使用第一个可用的基础图层。<br />仅当 baseLayderPicker 设置为 true 是此值才有效。 |
| imageryProviderViewModels:`Array.<ProviderViewModel>` | createDefaultImageryProviderViewModels() | 可以从BaseLayerPicker中选择的ProviderViewModels数组。<br />仅当 baseLayerPicker 设置为 true 时该值才有效。 |
| selectedTerrainProviderViewModel:ProviderViewModel    |                                          | 当前基础地形图层的视图模式。<br />如未提供则使用第一个可用的基础图层。<br />仅当 baseLayerPicker 设置为 true 时该值才有效。 |
| terrainProviderViewModels:`Array.<ProviderViewModel>` | createDefaultTerrainProviderViewModels() | 可以从BaseLayerPicker中选择的ProviderViewModels数组。<br />仅当 baseLayerPicker 为 ture 时该值才有效。 |
| imageryProvider:ImageryProvider                       | createWorldImagery()                     | 要使用的图像提供程序。此值仅当 baseLayerPicker 设置为 false 时才有效。 |
| terrainProvider:TerrainProvider                       | new EllipsoidTerrainProvider()           | 要使用的地形提供商                                           |
| skyBox:SkyBox\|false                                  |                                          | 用于渲染星星的天空盒。<br />如果未定义则使用默认星河。<br />如果设置为 false 则不会添加 skyBox、sun 或 moon。 |
| skyAtmosphere:SkyAtmosphere \| false                  |                                          | 用于如何渲染蓝天以及地球四周的光芒。<br />若为 false 则关闭这些 |
| fullscreenElement:Element \| String                   | document.body                            | 摁下全屏按钮后要至于全屏模式的 元素或ID                      |
| useDefaultRenderLoop:Boolean                          | true                                     | 此小部件是否应控制渲染循环                                   |
| targetFrameRate:Number                                |                                          | 使用默认渲染循环时的目标帧速率                               |
| showRenderLoopErrors:Boolean                          | true                                     | 当发生渲染循环错误时，是否自动向包含错误的用户显示 HTML 面板。 |
| useBrowserRecommendedResolution:Boolean               | true                                     | 是否使用浏览器建议的分辨率渲染。<br />如果为 true 还会忽略 window.devicePixelRation |
| automaticallyTrackDataSourceClocks:Boolean            | true                                     | 小部件是否自动跟踪新添加的数据源的始终设置，并在数据源的始终发生更改时进行更新。<br />如果要独立配置时钟，则需要将其设置为 false。 |
| contextOptions:Object                                 |                                          | 传递给 Scene 的与 options 相对应的上下文 和 WebGL 创建属性。 |
| sceneMode:SceneMode                                   | SceneMode.SCENE3D                        | 初始场景模式                                                 |
| mapProjection:MapProjection                           | new GeographicProjection()               | 在 2D 和 Columbus(哥伦布) 视图模式下使用的地图投影           |
| globe:Globe \| false                                  | new Globe(mapProjection.ellipsoid)       | 要在场景中使用的地球仪。如果设置为 false 这不会添加任何地球仪 |
| orderIndependentTranslucency:Boolean                  | true                                     | 是否使用顺序无关的半透明性                                   |
| creditContainer:Element \| String                     |                                          | 包含 CreditDIsplay 的DOM元素或 ID。<br />如果未指定则将 credits 添加到小部件本身的底部。 |
| creditViewport:Element \| String                      |                                          | 将包含 CreditDisplay 创建的弹出窗口的 DOM 元素或 ID。<br />如果未指定，它将显示在小部件本身上。 |
| dataSource:DataSourceCollection                       | new DataSourceCollection()               | 小部件可视化的数据源集合。<br />如果提供此参数，该实例假定为调用者所有，并在销毁查看器时也不会销毁。 |
| terrainExaggeration:Number                            | 1                                        | 用于放大地形的标量。请注意：地形夸张并不会修改他相对于椭球的图元。 |
| shadows:Boolean                                       | false                                    | 确定阴影是否由光源投射                                       |
| terrainShadows:ShadowMode                             | ShadowMode.RECEIVE_ONLY                  | 确定地形是否投射或接收来自光源的阴影                         |
| mapMode2D:MapMode2D                                   | MapMode2D.INFINITE_SCROLL                | 确定2D地图是可旋转的还是可以在水平方向无限滚动的。           |
| projectionPicker:Boolean                              | false                                    | 是否创建 ProjectinPicker 小部件                              |
| requestRenderMode:Boolean                             | false                                    | 仅根据场景中的更改确定是否需要渲染帧。<br />启用可减少应用程序的 CPU/GPU 使用率，并减少移动设备上的电池消耗。<br />但需要使用 `Scene.requestRender` 来呈现新的在此模式下先市镇。 |
| maximumRenderTimeChange:Number                        | 0                                        | 如果 requestRenderMode 为 true，则此值定义在请求渲染之前允许的最大方阵时间更改。 |

> 关于 requestRenderMode、maximumRenderTimeChange 属性配置，通用显示渲染提高性能：
>
> https://cesium.com/blog/2018/01/24/cesium-scene-rendering-performance/



<br>

**静态方法：Cesium.Viewer.ViewerMixin(viewer, options)**

通过附加功能扩展 Viewer 实例的功能。

该静态方法等同于 Viewer.extend()。



<br>

### 让我们尝试一下

**代码目标：隐藏除中间内容外的其他所有部件。**

```
const viewer = new Cesium.Viewer('cesiumContainer', {
    geocoder: false,
    homeButton: false,
    baseLayerPicker: false,
    sceneModePicker: false,
    navigationHelpButton: false,

    animation: false,
    timeline: false,
    fullscreenButton: false,

    skyBox: false,
    skyAtmosphere: false,
});
```



<br>

**隐藏版权：**

请注意，上面的代码中我们隐藏了绝大多数的部件，但在 Viewer.ConstructorOptions 配置项中，并没有隐藏 版权 的设置。

我们可以通过获取该元素，然后通过样式将其隐藏。

```
 (viewer.cesiumWidget.creditContainer as HTMLElement).style.display = 'none';
```



