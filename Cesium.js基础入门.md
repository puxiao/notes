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
//安装 cesium，本项目使用版本为 1.84.0，Cesium 自带有 .d.ts TS 声明文件
yarn add cesium
```



<br>

以上代码可以合并为 2 行：

```
yarn create react-app test-cesium --template typescript

yarn add typescript node-sass@5.0.0 @craco/craco cesium
```



<br>

**关于Cesium.js的TypeScript类型声明的补充说明：**

Cesium.js 的源码内部使用 JSDoc 方式对所有的类、属性、方法进行了类型定义。

通过构建命令 `yarn run build-ts` 在 Source 根目录生成一个 Cesium.d.ts 的文件，用来存放所有的类型声明。

也就是说默认情况下 NPM 包中自带有 类型声明 文件，但是会存在以下情况：

1. 每一位代码贡献者对于 JSDoc 的书写严谨程度不同
2. 一些历史原因，为了兼容比较旧的浏览器，没有使用比较新的 ES6 语法
3. 由 gulp 自动生成，且内部使用较低版本的 TypeScript 编译

以上情况造成了默认 Cesium.d.ts 文件并不是完美的，存在一些错误或缺失的类型定义。

> 个人感觉大约有 8% 的类型定义有误或缺失。



<br>

Cesium.js 还有第三方维护的 类型文件包：@types/cesium

这个包是由一些开发人员自行维护，人工编写 Cesium 声明类型，相对于默认的 Cesium.d.js，它更加精准。

你可以选择手工删除默认的 Cesium.d.ts 文件，安装并使用 @types/cesium。

不过正因为是人工编写的，所以存在时效性，无法做到与官方 Cesium.js 同步更新，有一定的滞后性。

> 个人感觉大约会滞后最新版本 1-2 个月时间



<br>

> 此时此刻：
>
> 1. cesium.js 最新版本为 1.84.0(更新于 1 个月前)
> 2. @types/cesium 最新版本为 1.67.14(更新于 2 个月前)



<br>

**Cesium.d.ts与@types/cesium的对比总结：**

1. 类型精准度：@types/cesium 优于 Cesium.d.ts
2. 更新时效性：Cesium.d.ts 优于 @types/cesium



> 对于 Three.js 而言，则将源码 .js 和 类型定义进行了单独分开，我觉得这种做法更加灵活、合理。
>
> @types/three 的核心维护者 也是 Three.js 开发人员，同时他也是 pixi.js 的作者。



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
       "src", "global.d.ts"
     ]
   }
   ```

   > 特别注意：我们在 "include" 字段中添加了 "global.d.ts"

7. 项目根目录添加 `global.d.ts` 文件内容暂时为空，方便后期我们添加一些内容：

   ```
   //
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

首先，我们先编写全屏样式，我们将 src/App.scss 内容更改为：

```
#cesiumContainer {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    border: none;
}
```

> 请注意一定要设置 position、left、top，否则最终网页画布高度会比 body 低 4 个像素，造成底部有空白缝隙。



<br>

然后，根据 Cesium.js 官方文档提供的示例代码，我们将 src/App.tsx 内容更改为：

```
import { useEffect } from 'react';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import './App.scss';

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

> 实际如果只是为了普通演示，上述 token 相关代码我们不添加也可以运行。
>
> 至于其他代码，暂时先不用去理解都是什么含义。



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

**关于 window.CESIUM_BASE_URL 的再次补充说明：**

为了避免日后每次都要添加 `//@ts-ignore`，所以我们采用这样一劳永逸的解决方式：

编辑项目根目录的 global.d.ts 文件，添加以下内容：

```
interface Window {
    CESIUM_BASE_URL: string;
}
```

> 请注意，之前我们已经在 tesconfig.json 中有如下配置：
>
> ```
> "include": [
>  "src", "global.d.ts"
> ]
> ```

为了确保一切生效，最好重启一下 VSCoder。

这样，当我们下次再去添加 `window.CESIUM_BASE_URL` 时，就会有正确的提示，也不会再报错了。



<br>

**关于 window.CESIUM_BASE_URL 的第 3 次补充：**

Cesium.js 还提供了另外一种设置 base url 的方式：

```
import buildModuleUrl from 'cesium/Source/Core/buildModuleUrl'

buildModuleUrl.setBaseUrl('./static/cesium/') //这样我们就不再用设置 window.CESIUM_BASE_URL 了
```

他的效果和直接设置 window.CESIUM_BASE_URL 是一模一样的。

不过，由于官方 JSDoc 文档的不严谨，导致 setBaseUrl() 这个函数实际上并未被真正导出到 cesium.d.ts 中。

> 这是因为 buildModuleUrl 本身就是一个函数，在这个函数身上再次添加一个 setBaseUrl() 函数，此时 buildModuleUrl 又被认为是一个命名空间
>
> buildModuleUrl 即是一个函数，又是一个命名空间，这导致 JSDoc 理解错乱，所以才没有正确导出 setBaseUrl() 这个函数。

所以，还需要这样使用 TS 注释忽略才可以：

```
//@ts-ignore
buildModuleUrl.setBaseUrl('./static/cesium/')
```



<br>

buildModuleUrl 还提供了一个名为 getCesiumBaseUrl() 的函数，可以获取已设置的 base url。

```
buildModuleUrl.getCesiumBaseUrl()
```



<br>

**提交 PR，解决这个问题：**

上面已经讲述过了为什么 JSDoc 没有正确导出 setBaseUrl()，经过一番查找，终于让我找到了解决办法。

我已经向 Cesium.js 提交了新的 PR，用于解决 setBaseUrl() 没有正确包导出的问题。

https://github.com/CesiumGS/cesium/pull/9783

> 目前这个 PR 还是 Open 状态，不清楚为什么我提交快 2 周了，官方始终没有任何回复。



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

<br>

> 以下更新于 2021.09.21

**关于 Cesium.js 1.85 版本编译报错的补充说明：**

在我写本教程时，当时最新版本为 1.84，到了 2021年 9 月初发布的 1.85 版本中，对于第三方类库 zip.js 引入时做了变动。

```diff
- import * as zip from "@zip.js/zip.js/lib/zip.js";
+ import * as zip from "@zip.js/zip.js/lib/zip-no-worker.js";
+ zip.configure({
+  useWebWorkers: false
+ });
```

而这个修改导致 react 在编译时会报错：

```
node_modules/cesium/Source/ThirdParty/zip.js 3559:74 ...
Module parse failed: Unexpected toke (3559:74)
File was processed with thes loaders:
...
```

原因是目前 creact-react-app 所创建的 react 项目使用的是 webpack4，不支持上面 zip.js 中的配置。

> 希望 creat-react-app 早日更新成基于 webpack5 的编译。

解决方式为：

1. 安装 `@open-wc/webpack-import-meta-loader`

   ```
   yarn add @open-wc/webpack-import-meta-loader --dev
   ```

2. 修改 `craco.config.js` 文件内容，增加 rules 配置：

   ```
   module.exports = {
       webpack: {
           configure: (config) => {
               // remove cesium warning
               config.module.unknownContextCritical = false
               config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
   
               // remove zip.js error in webpack4
               config.module.rules.push({
                   test: /\.js$/,
                   use: { loader: require.resolve('@open-wc/webpack-import-meta-loader') }
               });
               return config
           }
   };
   ```

   这样，就可以正常编译了

> 以上更新于 2021.09.21



<br>

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

**Viewer 源码：**

https://github.com/CesiumGS/cesium/blob/main/Source/Widgets/Viewer/Viewer.js



<br>

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
import './App.scss';

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
| (在1.83版本中已被废弃) terrainExaggeration:Number     | 1                                        | 用于放大地形的标量。请注意：地形夸张并不会修改他相对于椭球的图元。 |
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



<br>

**补充说明：第一次向 Cesium.js 提交 PR**

在我学习到此处的时候，我在想为什么不能直接在配置项中添加一个隐藏版权的选项？

于是，我查看 Viewer.js 源码，并添加隐藏 bottomContainer 的配置项。

> 由于版权(creditContainer)默认就在 bottomContainer 中，隐藏 bottomContainer 也就意味着隐藏 版权。

以下是我修改的内容：

source/Widgets/Viewer/Viewer.js

```diff
第1处：按照 JSDoc 代码规范，添加 `bottomContainer` 配置项的类型和注释
+  * @property {Boolean} [bottomContainer] If set to false, the {@link Viewer#bottomContainer} will not be created.


第2处：增加判断逻辑，只有当 `bottomContainer` 被定义且值不为 false 时才创建该 DOM 元素
-  var bottomContainer = document.createElement("div");
-  bottomContainer.className = "cesium-viewer-bottom";
-  viewerContainer.appendChild(bottomContainer);
+  var bottomContainer;
+  if (!defined(options.bottomContainer) || options.bottomContainer !== false) {
+    bottomContainer = document.createElement("div");
+    bottomContainer.className = "cesium-viewer-bottom";
+    viewerContainer.appendChild(bottomContainer);
+  }


第3处：修改获取 .bottomContainer 对应的类型。由于 .bottomContainer 有可能不会被创建，所以其类型中添加 undefined
-  * @type {Element}
+  * @type {Element | undefined}


第4处：判断只有当 .bottomContainer 存在时才会对其添加样式
-  this._bottomContainer.style.left = creditLeft + "px";
-  this._bottomContainer.style.bottom = creditBottom + "px";
+  if (this._bottomContainer !== undefined) {
+    this._bottomContainer.style.left = creditLeft + "px";
+    this._bottomContainer.style.bottom = creditBottom + "px";
+  }
```

 以上代码经过本地测试无误，可以在配置项中轻松添加隐藏版权，用法为：

```
const viewer = new Cesium.Viewer('cesiumContainer', {
    bottomContainer: false
})
```



<br>

于是信心满满向 Cesium 提交了 PR 。

https://github.com/CesiumGS/cesium/pull/9742

在当天就收到了仓库管理员 hpinkos 的回复：

```
Thanks for the pull request @puxiao. However, you should not be removing the CreditDisplay from the viewer. Many data providers, including Cesium ion, have attribution requirements for using their data in applications, so hiding this would be a violation of their terms of service.
```

回复内容意思就是：我们非常注重版权，如果隐藏版权会不符合我们的服务条款。



<br>

**大写的尴尬！**

或许我们习惯在使用开源软件时，倾向于隐藏开源软件版权的习惯。

但是国外的人可能比较重视保留版权。



<br>

**第一次向 Cesium 提交 PR 得到的经验：**

1. 假设你是个人，且第一次向 Cesium 提交 PR，那么你首选需要访问

   https://docs.google.com/forms/d/e/1FAIpQLScU-yvQdcdjCFHkNXwdNeEXx5Qhu45QXuWX_uF5qiLGFSEwlA/viewform

   在该页面需要填写你的姓名、与github账号相同的邮箱、国家，然后确认 “同意” 将自己贡献的代码版权捐献给 Cesium。

2. 假设你是第一次提交 PR，那么除代码修改外，你还需要向 CONTRIBUTORS.md 文档中，按照格式添加上自己的大名。

   > 如果你的 PR 被接受并入，那么你的名字就会出现在 贡献者名单中。

3. 当你修改某个 .js 代码内容时，需要遵循 JSDoc 规范。如果你不熟悉 JSDoc 可查阅我写的这篇：[JSDoc的安装与使用](https://github.com/puxiao/notes/blob/master/JSDoc%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md)

   > 实际上 Cesium 的 API 文档就是由 JSDoc 注释自动生成的。

4. 你还需要修改 CHANGES.md，在顶部当前的时间段内 添加上你此次修改的内容。

5. 如需必要，你还需要添加对应的 测试用例、使用示例。

   <br>

   请注意，无论是 JSDoc 还是 CHANGES.md，或者 PR 标题表述，你都需要使用英文。

   如果英文不好，那你需要借助谷歌或百度翻译，同时英语的表达应尽量符合该仓库的风格。

   > 你可以从该仓库过往的 PR 历史中，查看 PR 标题风格。



<br>

## 所有小部件的创建者：CesiumWidget

**CesiumWidget 源码：**

https://github.com/CesiumGS/cesium/blob/main/Source/Widgets/CesiumWidget/CesiumWidget.js



<br>

**CesiumWidget：**

负责创建和管理 Cesium 场景中所有的小部件。



### CesiumWidget的初始化

**CesiumWidget的构造参数：**

| 构造参数                     | 对应含义                         |
| ---------------------------- | -------------------------------- |
| container: Element \| String | 将包含窗口小部件的 DOM 元素或 ID |
| options: Object              | 可选配置项                       |



<br>

### CesiumWidget的配置项

| 配置项                                         | 默认值                             | 配置内容                                                     |
| ---------------------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| clock: Clock                                   | new Color()                        | 用于控制当前时间的时钟                                       |
| imageryProvider: ImageryProvider \| false      | createWorldImagery()               | 用于基础层的图像提供者。<br />若配置值为 false 则不添加任何图像提供程序。 |
| terrainProvider: TerrainProvider               | new EllipsoidTerrainProvider       | 地形提供者                                                   |
| skyBox: SkyBox \| false                        |                                    | 用于渲染星星的天空盒。<br />如果未定义则使用默认天空盒，<br />如果设置为 false 则不添加天空盒、太阳和月亮 |
| skyAtmosphere: SkyAtomsphere \| false          |                                    | 蓝天和地球周围的光芒。<br />设置为 false 则不显示光芒        |
| sceneMode: SceneMode                           | SceneMode.SCENE3D                  | 初始场景模式                                                 |
| scene3DOnly: Boolean                           | false                              | 如果为 true，则每个几何体实例将仅 3D 渲染，以节省 GPU 内存。 |
| orderIndependentTranslucency:  Boolean         | true                               | 如果为 true 并配置支持它，则使用顺序无关的透明性。           |
| mapProjection: MapProjection                   | new GeographicProjection()         | 在 2D 和 Columbus(哥伦布) View 模式下使用的地图投影          |
| globe: Globe \| false                          | new Globe(mapProjection.ellipsoid) | 场景中使用的地球仪。如果设置为 false 则不添加地球仪          |
| useDefaultRendererLoop: Boolean                | true                               | 如果此小部件应控制渲染循环，则为 true，否则为 false          |
| useBrowserRecommendedResolution: Boolean       | true                               | 如果为 true，则以浏览器建议的分辨率进行渲染，并忽略 window.devicePixelRatio。 |
| targetFrameRate: Number                        |                                    | 使用默认渲染循环的目标帧速率。<br />该值需要大于 0，且小于设备能够达到的极限。<br />该值设置过大实际上也不会生效。 |
| showRenderLoopErrors: Boolean                  | true                               | 如果为 true，则在发生渲染循环错误时，此小部件将自动向包含错误的用户显示 HTML 面板。 |
| contextOptions: Object                         |                                    | 与 options 相对应的上下文和 WebGL 创建属性传递给 Scene       |
| creditContainer: Element \| String             |                                    | 包含 CreditDisplay 的DOM 元素或 ID。如果为指定，则添加到 bottomContainer 中 |
| creditViewport: Element \| String              |                                    | 包含由 CreditDisplay 创建的弹出窗口的 DOM 元素或 ID。<br />如果未指定，则将显示在 小部件本身上面。 |
| (1.83版本已被废弃) terrainExaggeration: Number | 1                                  | 用于放大地形的标量。请注意，地形放大并不会修改其他相对于椭球的图元。 |
| shadows: Boolean                               | false                              | 确定阴影是否由光源投射                                       |
| terrainShadow: ShadowMode                      | ShadowMode.RECEIVE_ONLY            | 确定地形是投射还是接收来自光源的阴影                         |
| mapMode2D: MapMode2D                           | MapMode2D.INFINITE_SCROLL          | 确定 2D 地图是可旋转还是可在水平方向无限滚动                 |
| requestRenderMode: Boolean                     | false                              | 如果为 true 则仅根据场景中的更改确定是否需要渲染帧。<br />启用可以提高应用程序的性能，但需要使用 Scene.requestRender，在此模式下显式渲染新框架。<br />在 API 的其他部分对场景进行更改后，在许多情况下这是必要的。 |
| maximumRenderTimeChange: Number                | 0                                  | 如果 requestRenderMode 为 true，则此值定义在请求渲染之前允许的最大仿真时间更改。 |



<br>

**补充说明：被移除的选项 terrainExaggeration**

在 Cesium.js 1.83 版本中，移除了 Scene.terrainExaggeration，因此 CesiumWidget、Viewer、Scene 的配置项中也不再有 terrainExaggeration 这一项。

作为替代方案，在 1.85 版本中可以通过 Globe.terrainExaggeration 来设置。



<br>

你可能会疑惑，为什么 CesiumWidget 的配置项和 Viewer 的配置项那么相似？

**实际上 Viewer 就是 CesiumWidget 更高一层的管理者，Viewer 的很多配置项在内部本身就是供 CesiumWidget 使用。**

> 这就是 2 者配置项为什么那么相似。实际不是相似，而是相同。



<br>

**简单示例：**

```
//最简单的初始化
const widget = new Cesium.CesiumWidget('cesiumContainer');

//添加一些配置项的初始化
const widget = new Cesium.CesiumWidget('cesiumContainer',{
    imageryProvider: Cesium.createWorldImagery(),
    terrainProvider: Cesium.createWorldTerrain(),
    skyBox: new Cesium.SkyBox({
        sources:{
            positiveX: './static/Assets/Textures/SkyBox/px.jpg',
            negativeX: './static/Assets/Textures/SkyBox/nx.jpg',
            positiveY: './static/Assets/Textures/SkyBox/py.jpg',
            negativeY: './static/Assets/Textures/SkyBox/ny.jpg',
            positiveZ: './static/Assets/Textures/SkyBox/pz.jpg',
            negativeZ: './static/Assets/Textures/SkyBox/nz.jpg',
        }
    }),
    sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
    mapProjection: new Cesium.WebMercatorProjection()
})
```



<br>

### CesiumWidget的属性

| 属性名                                           | 是否为只读属性 | 对应含义                                                     |
| ------------------------------------------------ | -------------- | ------------------------------------------------------------ |
| camera: Camera                                   | 是             | 获取相机                                                     |
| canvas: THMLCanvasElement                        | 是             | 获取画布                                                     |
| clock: Clock                                     | 是             | 获取时钟                                                     |
| container: Element                               | 是             | 获取父容器                                                   |
| creditContainer: Element                         | 是             | 获取版权容器                                                 |
| creditViewport: Element                          | 是             | 获取版权详情弹层容器                                         |
| imageryLayers: ImageryLayerCollection            | 是             | 获取将在地球上渲染的图像图层的集合                           |
| resolutionScale: Number                          | 否             | 获取或设置渲染分辨率的缩放比，默认值为 1。<br />小于 1 的值适用于性能不佳的设备上。<br />大于 1 的值适用于高清、高保真的设备上。 |
| scene: Scene                                     | 是             | 获取场景                                                     |
| screenSpaceEventHandler: ScreenSpaceEventHandler | 是             | 获取屏幕空间事件的处理函数                                   |
| targetFrameRate: Number                          | 否             | 在 useDefaultRenderLoop 为 true 时获取或设置小部件的目标帧速率。如果未定义则使用浏览器的 requestAnimationFrame 默认帧频。 |
| terrainProvider: TerrainProvider                 | 否             | 地球表面几何形状的提供者                                     |
| useBrowserRecommendedResolution: Boolean         | 否             | 是否使用浏览器推荐的分辨率，默认值为 true。<br />如果为 true 则会忽略浏览器的设备像素比率 而改用 1。 |
| useDefaultRenderLoop: Boolean                    | 否             | 获取或设置此小部件是否硬控制循环渲染，默认为 true。<br />如果设置为 false 则必须手动调用 resize、render 方法去自定义渲染。<br />如果在渲染过程中发生错误则会引发 Scene renderError 事件，并且此属性将被设置为 false。<br />必须将其设置为 true 后才能继续隐式自动渲染。 |



<br>

### CesiumWidget的方法

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| destroy()                                                    | 销毁小部件。如果希望永久销毁则应该从 DOM 节点中删除相应元素。 |
| isDestroyed(): Boolean                                       | 返回对象是否已销毁                                           |
| render()                                                     | 渲染场景。在 useDefaultRenderLoop 为 false 时需要手工调用以渲染场景。 |
| resize()                                                     | 更新画布大小、相机纵横比 和 饰扣大小。在 useDefaultRenderLoop 为 false 时需要手工调用此方法。 |
| showErrorPanel(title: String, message: String, error: String) | 想用户显示错误面板，其中标题、错误描述、被格式化的错误代码文本，可以使用 “确定” 按钮将其关闭。 |





<br>

## 所有3D图形的容器：Scene

**Scene 源码：**

https://github.com/CesiumGS/cesium/blob/main/Source/Scene/Scene.js



<br>

**Scene** 负责管理 Cesium 中所有的 3D 图形对象。实际中并不需要手工创建 Scene，它由 CesiumWidget 隐式创建的。

> 包括一些不可见的 3D 对象，例如 相机。
>
> 和 Three.js 中的 Scene 作用相似。



<br>

### Scene的构造参数

```
const scene = new Cesium.Scene(options)
```

<br>

| 配置项                                         | 默认值                     | 配置内容                                                     |
| ---------------------------------------------- | -------------------------- | ------------------------------------------------------------ |
| canvas: HTMLCanvasElement                      |                            | 用于为其创建场景的 HTML canvas 元素                          |
| contextOptions: Object                         |                            | 上下文和 WebGL 创建属性。                                    |
| creditContainer: Element                       |                            | 将在其中显示版权的HTML元素                                   |
| creditViewport: Element                        |                            | 版权详细信息弹层对应的 HTML 元素                             |
| mapProjection: MapRrojection                   | new GeographicProjection() | 在 2D 和 Columbus(哥伦布) View 模式下使用的地图投影          |
| orderIndependentTranslucency: Boolean          | true                       | 如果为 true 并且配置支持它，则使用顺序无关的半透明性         |
| scene3DOnly: Boolean                           | fasle                      | 如果为true，则可以优化 3D 模式的内存使用和性能，但会禁止使用 2D 或 哥伦布模式 |
| (在1.83版中已废弃) terrainExaggeration: Number | 1                          | 用法放大地图的标量。                                         |
| shadows: Boolean                               | false                      | 确定阴影是否由光源投射                                       |
| mapMode2D: MapMode2D                           | MapMode2D.INFINITE_SCROLL  | 确定2D地图是可旋转的还是可以在水平方向无限滚动的。           |
| requestRenderMode: Boolean                     | false                      | 如果为 true 则仅根据场景中的更改确定是否需要渲染帧。<br />启用可以提高应用程序的性能，但需要使用 Scene 在此模式下显示渲染新框架。 |
| maximumRenderTimeChange: Number                | 0                          | 如果 requestRenderMode 为 true，则此值定义在请求渲染之前允许的最大仿真时间更改。 |



<br>

**关于 canvas 配置项的特别说明：**

尽管官方文档中提到 Scene 的配置项是可选的，但实际上并不是这样的。

Scene 的配置项是必填的，并且配置项中 canvas 这一项也是必填的。

例如下面的示例代码：

```
const scene = new Cesium.Scene()

或

const scene = new Cesium.Scene({
    shadows: true
})
```

由于没有配置项，或者配置项中没有 canvas 这一项，都会收到报错信息：

```
DeveloperError: options and options.canvas are required.
```

> 配置项 options 和 options.canvas 都是必须的



<br>

**觉得不对就去修改它！**

我查看了源码，发现关于 Scene 的 JSDoc 描述中，官方错误得将 options 写成了 可选项。

于是我向 Cesium 官方提交了 PR ，修改这个问题：

https://github.com/CesiumGS/cesium/pull/9745

```diff
- * @param {Object} [options] Object with the following properties:
+ * @param {Object} options Object with the following properties:
```

> 对于 JSDoc 规范来说，参数如果加中括号表示这是可选参数，如果不加则表示这是必填参数。

我这个 PR 已经得到了 2 位管理员的回复，他们认为确实应该进行修改。

最终 2021.08.25 我的这个 PR 被并入，我也顺利称为了第 238 位 Cesium.js 贡献者。

<img src="https://puxiao.com/temp/9745.jpg" alt="pr-9745" style="zoom:38%;" />

按照惯例，每月底发布一版，2021.08 月底应该发布 Cesium.js 1.85 版，到时候在贡献者名单文件 CONTRIBUTORS.md 中，就能出现我的大名了。

小激动！



<br>

**关于 contextOptions 配置项的特别说明：**

Scene 的初始化配置项 contextOptions 是用于配置给定 canvs、webgl 上下文 WebGLContextAttributes 的。

contextOptions 默认值为：

```
{
    webgl:{
        alpha:false,
        depth:true,
        stencil:false,
        antialias:true,
        powerPreference:'high-preformance',
        premultipliedAlpha:true,
        preserveDrawingBuffer:false,
        failIfMajorPerformanceCaveat:false
    },
    allowTextureFilterAnisotropic:true
}
```

> 1. 如果需要使用 alpha 与其他 HTML元素混合，则需要将 wegl.alpha 设置为 true。
> 2. 如果将 allowTextureFilterAnisotropic 设置为 false，会提高整体渲染性能，但损害视觉画面质量。



<br>

**获取 WebGL 上下文：**

想获取 canvas 对应的 webgl 的上下文配置项，可通过 JS 原生的函数获取：

WebGLRenderingContext.getContextAttributes()

https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/getContextAttributes

```
const canvas = document.getElementById('canvas')
const gl = canvas.getContext('webgl')
gl.getContextAttributes()
```



<br>

### Scene的属性

| 属性名                                                   | 是否为只读属性 | 属性含义                                                     |
| -------------------------------------------------------- | -------------- | ------------------------------------------------------------ |
| backgroundColor: Color                                   | 否             | 在未使用 skyBox 的情况下，显示的背景色                       |
| camera: Camera                                           | 是             | 获取相机，可以设置相机属性                                   |
| cameraUnderground: Boolean                               | 是             | 相机是否在地球下方。默认为 false                             |
| canvas: HTMLCanvasElement                                | 是             | 获取此场景绑定到的 canvas 元素                               |
| clampToHeightSupported: Boolean                          | 是             | 是否支持 .clampToHeight 和 .clampToHeightMosetDetailed       |
| completeMorphOnUserInput: Boolean                        | 否             | 确定是否立即完成用户输入时的场景过渡动画，默认为 true        |
| debugCommandFilter: function                             | 否             | 此属性仅用于调试，不要用于生成环境。<br />设置执行的调试函数，默认为 undefined |
| debugFrustumStatistics: Object                           | 是             | 此属性仅用于调试，不要用于生产环境。<br />当 .debugShowFrustums 为 true 时，包含每个视锥执行的命令数量的统计信息。<br />默认值为 undefined |
| debugShowCommands: Boolean                               | 否             | 此属性仅用于调试，不要用于生产环境。<br />当设置为 true 时，会随机加阴影，用于性能分析。<br />默认值为 false |
| debugShowDepthFrustum: Number                            | 否             | 此属性仅用于调试，不要用于生产环境。<br />指示哪个视锥体将显示深度信息。<br />默认值为 1 |
| debugShowFramesPerSecond: Boolean                        | 否             | 此属性仅用于调试，不要用于生产环境。<br />显示每秒的帧数、帧之间的时间。<br />默认为 false |
| debugShowFrustumPlanes: Boolean                          | 否             | 此属性仅用于调试，不要用于生产环境。<br />当设置为 true 时，绘制轮廓以显示摄像机的视锥边界。<br />默认值为 false |
| debugShowFrustums: Boolean                               | 否             | 此属性仅用于调试，不要用于生产环境。<br />当设置为 true 时，则将基于重叠的视锥体(平截头体)进行着色。<br />其中第一个平截头体 近截面为红色，远截面为蓝色。<br />下一个平截头体 近截面为 绿色，远截面依然为蓝色。<br />这样或许会出现不同的平截头体的 近截面 或 远截面 颜色重叠。<br />例如两个平截头体近截面 一个为红、一个为绿，叠加区域颜色则变成 黄色。<br />默认值为 false |
| debugShowGlobeDepth: Boolean                             | 否             | 此属性仅用于调试，不要用于生产环境。<br />显示视锥的深度信息。<br />默认为 false |
| drawingBufferHeight: Number                              | 是             | 基础 GL 上下文的 drawingBufferHeight，也就是当前绘图缓冲区的实际高度 |
| drawingBufferWidth: Number                               | 是             | 基础 GL 上下文的 drawingBufferWidth，也就是当前绘图缓冲区的实际宽度 |
| eyeSeparation: Number                                    | 否             | 当使用虚拟 WebVR 时，眼睛间距，以米为单位                    |
| farToNearRatio: Number                                   | 否             | 使用常规深度缓冲区时，多截头锥体的远近比率。<br />该值用于为创建的多个视锥设置 近 和 远值。<br />仅当 .logarithmicDepthBuffer 为 false 时才生效。<br />若 .logarithmicDepthBuffer 为 true 时请使用 .logarithmicDepthFarToNearRatio<br /<br />.farToNearRatio 默认值为 1000 |
| focalLength: Number                                      | 否             | 使用 虚拟 WebVR 时的焦距                                     |
| fog: Fog                                                 | 否             | 获取或设置 雾。<br />完全处于雾中的物体将不会被渲染，依此提高渲染性能。 |
| gamma: Number                                            | 否             | 用于 伽马校正的值。仅在具有高动态范围的渲染时使用。<br />默认值为 2.2 |
| globe: Globe                                             | 否             | 获取或设置深度测试椭球(地球仪)                               |
| groundPrimitives: PrimitiveCollection                    | 是             | 获取地面图元的集合                                           |
| highDynamicRange: Boolean                                | 否             | 是否使用高动态范围渲染。<br />默认为 true                    |
| highDynamicRangeSupported: Boolean                       | 是             | 是否支持高动态范围渲染<br />默认为 true                      |
| id: String                                               | 是             | 获取此场景的位移标识符                                       |
| imageryLayers: ImageryLayerCollection                    | 是             | 获取将在地球上渲染的图像图层的集合                           |
| imagerySplitPosition: Number                             | 否             | 获取或设置图像拆分器在视口中的位置。<br />有效值在 0 到 1 之间 |
| invertClassification: Boolean                            | 否             | 如果为 false 则 3D Tiles 将正常渲染。<br />如果为 true 则已分类的 3D Tiles 将正常渲染，为分类的这使用颜色乘以 .invertClassificationColor 进行渲染。 <br />默认值为 false |
| invertClassificationColor: Color                         | 否             | 当 .invertClassification 为 true 时，未分类的 3D Tile 几何图形的突出显示颜色。<br />当颜色的 Alpha 值小于 1 时，未分类的 3D Tile 将无法与 已分类的 3D Tile 位置正确融合。<br />此外当颜色的 Alpha 值小于 1 时，必须支持 WEBGL_depth_texture 和 EXT_frag_depth WebGL扩展。<br />默认值为 Color.WHITE，即白色 |
| invertClassificationSupported: Boolean                   | 是             | 如果支持 .invertClassifcation 则返回 true                    |
| lastRenderTime: JulianDate                               | 是             | 获取场景最后一次渲染的仿真时间。<br />如果场景从未被渲染过则返回 undefined。 |
| light: Light                                             | 否             | 光源。默认为来自太阳的定向光。                               |
| logarithmicDepthBuffer: Boolean                          | 否             | 是否使用对数深度缓冲区。<br />启用此选项将减少多视锥中的视椎，提高性能。<br />此属性取决于是否支持 fragmentDepth。 |
| logarithmicDepthFarToNearRatio: Number                   | 否             | 使用对数深度缓冲区时，多截头圆锥体的远近比率。<br />仅当 .logarithmicDepthBuffer 为 ture 是生效。<br />当 .logarithmicDepthBuffer 为 false 时请使用 .farToNearRatio。<br />默认值为 1e9 (10的9次方，即1000000000) |
| mapMode2d: MapMode2D                                     | 是             | 确定 2D 地图是可以旋转还是可以在水平方向无限滚动             |
| mapProjection: MapProjection                             | 是             | 获取要在 2D 和 哥伦布模式下使用的地图投影。<br />默认值为 new GeographicProjection() |
| maximumAliasedLineWidth: Number                          | 是             | 此 WebGL 实现支持的最大别名行宽度(以像素为单位)。最少为 1。  |
| maximumCubeMapSize: Number                               | 是             | 此 WebGL 实现支持的多维数据集映射的一个边缘的最大长度(以像素为单位)。最少为 16。 |
| maximumRenderTimeChange: Number                          | 否             | 如果 .requestRenderMode 为 true，则此值定义请求渲染之前允许的模拟时间。<br />较低的值会增加渲染的帧数、较高的值会减少渲染的帧数。<br />如果为 undefined 则更改为模拟时间永远不会要求渲染。<br />这个值会影响场景变化的渲染速率，例如照明、实体属性更新 和动画。<br />默认值为 0。 |
| minimumDisableDepthTestDistance: Number                  | 否             | 距离相机禁用广告牌、标签 和 点的 深度测试的距离，以防止剪切地形。<br />设置为 0 时，深度测试应始终被应用。<br />如果小于 0 则永远不要应用深度测试。<br />设置 .disableDepthTestDistance 将覆盖此值。<br />默认值为 0。 |
| mode: SceneMode                                          | 否             | 获取或设置场景的当前模式。<br />默认为 SceneMode.SCENE3D     |
| moon: Moon                                               | 否             | 获取或设置 月亮<br />默认值为 undefined                      |
| morphComplete: Event                                     | 否             | 在场景转换完成时触发的事件<br />默认为 Event()               |
| morphStart: Event                                        | 否             | 在场景开始转换时触发的事件<br />默认为 Event()               |
| morphTime: Number                                        | 否             | 当前的 2D、哥伦布模式 和 3D 之间的转换过渡时间。<br />其中 2D、哥伦布模式是 0，而与 3D 转换为 1。 |
| nearToFarDistance2D: Number                              | 否             | 确定二维中的多个视锥的每个视椎的统一深度大小(以米为单位)。<br />如果原始或模型显示 z-fighting，则减小该值将消除伪影，但会降低性能。<br />另外一方面增加它会提高性能，但可能会导致靠近表面的图元中间的 z-fighting。<br />注：z-fighting 是指交会边缘像素深度错乱。<br />默认值为 1.75e6 (1750000) |
| orderIndependentTranslucency: Boolean                    | 是             | 获取场景是否启用了顺序无关的半透明性。                       |
| pickPositionSupported: Boolean                           | 是             | 是否支持 .pickPosition。                                     |
| pickTranslucentDepth: Boolean                            | 否             | 如果为 true 则启用使用深度缓冲区拾取半透明几何体的功能。<br />请注意 .useDepthPicking 也必须为 true 才能使其正常工作。<br />必须在两次选择之间调用渲染。启用后性能会下降。<br />还会有额外的绘制调用以写入深度半透明的几何体。<br />默认值为 false |
| postProcessStages: PostProcessStageCollection            | 否             | 后处理效果应用于最终渲染                                     |
| postRender: Event                                        | 是             | 获取将在渲染场景后立即引发的事件。<br />活动订阅者将 Scene 实例作为第一个参数，将当前时间作为第二个参数。 |
| postUpdate: Event                                        | 是             | 获取在场景更新之后和场景渲染之前立即引发的事件。<br />事件订阅者将 Scene 实例作为第一个参数，将当前时间作为第二个参数。 |
| preRender: Event                                         | 是             | 获取场景更新之后以及场景渲染之前立即引发的事件。<br />事件的订阅者将 Scene 实例作为第一个参数，将当前时间作为第二个参数。 |
| preUpdate: Event                                         | 是             | 获取在更新或渲染场景之前将引发的事件。<br />活动订阅者将 Scene实例作为第一个参数，将当前时间作为第二个参数。 |
| primitives: PrimitiveCollection                          | 是             | 获取图元的集合                                               |
| renderError: Event                                       | 是             | 在获取 render 函数引发错误时将引发的事件。<br />Scene 实例和引发错的错误是传递给事件处理程序的两个参数。<br />默认情况下此事件发生后不会重新引发错误，但可以通过设置 rethrowRenderErrors 属性来更改。 |
| requestRenderMode: Boolean                               | 否             | 如果为 true 则仅根据场景中的更改确定是否需要渲染帧。<br />启用可以提高应用程序的性能，但需要使用 .requestRender 在此模式下显式渲染新框架。<br />默认值为 false |
| rethrowRenderErros: Boolean                              | 否             | 总是捕获 render 中发生的异常，以提高 renderError 事件。<br />如果设置为 true 则在引发事件后重新抛出错误，如果设置为 false 则在函数引发事件后正常返回。<br />默认值为 false |
| sampleHeightSupported: Boolean                           | 是             | 如果支持 .sampleHeight 和 .sampleHeightMostDetailed 这返回 true |
| scene3DOnly: Boolean                                     | 是             | 获取是否 仅 3D 模式。                                        |
| screenSpaceCameraController: ScreenSpaceCameraController | 是             | 获取用于摄像机输入处理的控制器                               |
| shadowMap: ShadowMap                                     | 否             | 场景光源的阴影贴图。<br />启用后模型、图元和地球都可能会投射并接收阴影。 |
| skyAtmosphere: SkyAtmosphere                             | 否             | 遍布全球的大气层。默认值为 undefined                         |
| skyBox: SkyBox                                           | 否             | 获取或设置 星星，默认值为 undefined，则使用默认的 星空。     |
| specularEnvironmentMaps: String                          | 否             | KTX2 文件的 url。KTX2 文件包含镜面反射环境贴图和用于 PBR 模型的  mipmap。 |
| specularEnvironmentMapsSupported: Boolean                | 是             | 是否支持镜面环境贴图                                         |
| sphericalHarmonicCoefficients: `Array.<Cartesian3>`      | 否             | PBR 模型基于图像的照明的球谐系数                             |
| sun: Sun                                                 | 否             | 获取或设置太阳。默认值为 undefined                           |
| sunBloom: Boolean                                        | 否             | 当太阳为可用时，是否使用布隆过滤器。<br />默认值为 true      |
| terrainExaggeration: Number                              | 是             | 获取用于放大地形的标量                                       |
| terrainProvider: TerrainProvider                         | 否             | 为地球表面提供几何形状的地形提供者                           |
| terrainProviderChanged: Event                            | 是             | 更改地形提供者时引发的事件                                   |
| useDepthPicking: Boolean                                 | 否             | 是否使用深度缓冲区拾取。默认为 true                          |
| useWebVR: Boolean                                        | 否             | 是否启用 WebVR，若为 true 则将场景分为两个视口，左右眼具有立体视图。<br />默认值为 false |



<br>

### Scene的方法

**cartesianToCanvasCoordinates(position, result): Cartesian2**

1. position: Cartesian3 笛卡尔坐标中的位置

2. result: Cartesian2，可选参数，一个可选对象，用于返回转换为画布坐标的输入位置

3. 返回值：修改后的结果参数 或者新的 Cartesian2  实例(如果为提供第 2 个参数)。

   如果输入位置靠近椭圆体的中心，则可能返回 undefined。

将笛卡尔 3D 直角坐标中的位置转换为 2D 画布坐标。这通常用于放置和场景中的对象相同位置的 HTML 元素。

示例：

```
const scene = widget.scene
const ellipsoid = scene.globe.ellipsoid
const position = new Cesium.ScreenSpaceEventHandler(scene.canvas)
handler.setInputAction(function(movement){
    console.log(scene.cartesianToCanvasCoordinates(position))
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
```



<br>

**clampToHeight(cartesian, objectsToExclude, width,result): Cartesian3**

1. cartesian: Cartesian3 笛卡尔位置坐标

2. objectsToExclude: `Array.<Object>` ，可选参数，不需要(排除)钳制(clamp)的图元、实体或 3D Tiles 列表。

3. width: Number，可选参数，默认值为 0.1，交叉口的宽度(以米为单位)

4. result: Cartesian3，可选参数，返回收窄(clamped)位置的可选对象

5. 返回值：修改后的结果参数，如果为提供则返回一个新的 Cartesian3 实例。

   如果没有场景几何体需要收窄(clamp)，结果可能是 undefined。

沿大地表面法线将给定的笛卡尔位置固定到场景的几何体中。返回收窄位置或 undefined。

可用于收窄(clamp)场景中的地球物体、3D瓷砖或图元。

示例：

```
const position = entity.position.getValue(Cesium.JulianDate.now())
entity.position = viewer.scene.clampToHeight(position)
```



<br>

**clampToHeightMostDetailed(cartesians, objectsToExclude, width): `Promise.<Array.<Cartesian3>>`**

1. cartesians: `Array.<Cartesian3>`，笛卡尔位置更新为收窄位置。
2. objectsToExclude: `Array.<Object>` ，可选参数，不需要(排除)收窄的图元、实体 或 3D Tiles 列表
3. width: Number，可选参数，默认值 0.1，交叉口的宽度(以米为单位)
4. 返回值：异步返回 查询完成后解析为提供的清单

异步启动 .clampToHeight 查询 cartesians 在场景中使用 3D Tiles 最大细节级别。

> 此处我也暂时不太理解具体所表达的含义

代码示例：

```
const cartesians = [
    entities[0].position.getValue(Cesium.JulianDate.now()),
    entities[1].position.getValue(Cesium.JulianDate.now())
]
const promise = viewer.scene.clampToHeightMostDetailed(cartesians)
promise.then(function(updatedCartesians){
    entities[0].position = updatedCartesians[0]
    entities[1].position = updatedCartesians[1]
})
```



<br>

**completeMorph()**

立即完成过渡。



<br>

**destroy()**

销毁此对象拥有的 WebGL 资源。

这个操作是不依赖于垃圾回收器，而是主动明确释放 WebGL 资源。

请注意，一旦执行过该操作，除了 isDestroyed()，就不应该再使用该对象的其他任何属性或方法。



<br>

**drillPick(windowPosition,limit,width,height): `Array.<*>`**

1. windowPosition: Cartesian2，窗口坐标以执行拾取

2. limit: Number，可选参数，如果提供的话，将在收集到这么多的 镐 后停止钻孔。

   > 暂时理解不了这句话的含义

3. width: Number，可选参数，默认值为 3，拾取矩形的宽度

4. height: Number，可选参数，默认值为 3，拾取矩形的高度

5. 返回值： 对象数组，每个对象包含 1 个选取的 图元。

返回所有对象的对象列表，每个对象包含一个 .primitive 属性。

特定的窗口坐标位置也可以设置其他属性，具体取决于类型的图元，并可用于进一步表示拾取的对象。

在原始列表中按照其在场景中的视觉顺序(从前到后)排序。

示例代码：

```
const pickedObjects = scene.drillPick(new Cesium.Cartesian2(100,200))
```



<br>

**getCompressedTextureFormatSupported(format): Boolean**

1. format: String，纹理格式。可以是格式名称或者 WebGL 扩展名称，例如 s3tc 或 WEBGL_compressed_texture_s3tc。
2. 返回值：是否支持该格式

确定是否支持压缩纹理格式。



<br>

**isDestroyed(): Boolean**

如果此对象已销毁，则返回 true。

如果该对象已被销毁，此时调用除 isDestroyed() 以外的其他属性或方法，将收到 DeveloperError 错误。



<br>

**morphTo2D(duration)**

1. duration: Number，可选参数，默认值为 2，完成过渡动画的时间(以秒为单位)

异步将场景转换为 2D 模式。



<br>

**morphTo3D(duration)**

1. duration: Number，可选参数，默认值为 2，完成过渡动画的时间(以秒为单位)

异步将场景转换为 3D 模式。



<br>

**morphToColumbusView(duration)**

1. duration: Number，可选参数，默认值为 2，完成过渡动画的时间(以秒为单位)

异步将场景切换到 哥伦布模式。



<br>

**pick(windowPosition, width, height): Object**

1. windowPosition: Cartesian2，窗口视图中的位置坐标，用于执行拾取。
2. width: Number，可选参数，默认值为 3，拾取矩形的宽度
3. height: Number，可选参数，默认值为 3，拾取矩形的高度
4. 返回值：包含拾取选取的图元的对象

返回在 windowPosition 位置拾取到的图元对象。如果不存在拾取对象则返回 undefined。

拾取具有 3D Tiles 贴图集的特征后，将返回 Cesium3DTileFeature 对象。

示例代码：

```
handle.setInputAction(function(movement){
    const feature = scene.pick(movement.endPosition)
    if(feature instanceof Cesium.Cesium3DTileFeature){
        feature.color = Cesium.Color.YELLOW
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
```



<br>

**pickPosition(windowPosition,result): Cartesian3**

1. windowPosition： Cartesian2，执行拾取的窗口坐标
2. result: Cartesian2，可选参数，设置为结果的对象
3. 返回值：笛卡尔位置

返回从深度缓冲区和窗口位置重构的笛卡尔位置坐标。

从 2D 深度缓冲区重建的位置可能与那些位置略有不同在 3D 和 哥伦布视图中重建。这是因为分布差异造成的透视图和正投影的深度值。

将 .pickTranslucentDepth 设置为 true，可以拾取包括 半透明图元。



<br>

**render(time)**

1. time： JulianDate，可选参数，渲染的模拟时间

更新并渲染场景。

通常情况下是不需要我们显示调用该函数的，因为默认会自动进行渲染。



<br>

**requestRender()**

当 .requestRenderMode 设置为 true ，请求新的渲染帧。

呈现速率不会超过 .targetFrameRate。



<br>

**sampleHeight(position,objectsToExclude,width): Number**

1. position: Cartographic，制图位置到样品高度的起点
2. objectsToExclude: `Array.<Object>`，可选参数，不需要(排除)采样高度的基本体、实体、3D Tiles 列表
3. width: Number，可选参数，默认值 0.1，交叉口的宽度(以米为单位)
4. 返回值：高度数值，如果场景中没有需要采样的几何体，则返回 undefined

返回给指定位置处 场景中几何体的高度，如果没有几何体则返回 undefined。

样品高度不受可见性影响。

示例代码：

```
const position = new Cesium.Cartographic(-1.31968, 0.698874)
const height = viewer.scene.sampleHeight(position)
console.log(height)
```



<br>

**sampleHeightMostDetailed(positions, objectsToExclude,width): `Promise.<Array.<Cartographic>>`**

1. positions: `Array.<Cartographic>`，指定位置将根据采样高度进行更新
2. objectsToExclude: `Array.<Object>`，可选参数，不需要(排除)采样高度的基本体、实体或 3D Tiles 列表
3. width: Number，可选参数，默认值 0.1，交叉口的宽度(以米为单位)
4. 返回值：异步查询完成后，返回的查询结果

以 .sampleHeight 为高度，异步查询指定的 Cartographic 在场景中 3D Tiles 最大细节级别。

如果在指定位置不存在或无法采样几何体，对应的高度将设置为 undefined。

示例代码：

```
const positions = [
    new Cesium.Cartographic(-1.13968, 0.69887),
    new Cesium.Cartographic(-1.10489, 0.83923)
]
const promise = viewer.scene.sampleHeightMostDetailed(positions)
promise.then(function(updatedPosition){
    console.log('positions[0].height and positions[1].height have been updated.')
})
```



<br>

## 我们的眼睛：Camera

**Camera 相机的 3 个组成因素：**

1. 位置( position)
2. 方向(up + direction)
3. 视椎(fov + near + far)

在 Cesium 中的相机和 Three.js 中的相机概念几乎相同。

只不过在 Cesium 中不同种类的相机并不是依靠不同 相机类 创建的，而是通过设置相机视椎来决定的。

```
camera.frustum : PerspectiveFrustum | PerspectiveOffCenterFrustum | OrthographicFrustum
```



<br>

**视锥：**

相机的视锥是由 6 个面构成，每个平面都是由 Cartesian4 对象表示。

> cartesian：笛卡尔。 Cartesian4 表示笛卡尔 4 维空间坐标



<br>

**创建一个相机示例：**

```
const camera = new Cesium.Camera(scene)
camera.position = new Cesium.Cartesian3()
camera.direction = Cesium.Cartesian3.negate(Cesium.Cartesian3.UNIT_Z,new Cesium.Cartesian3())
camera.up = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Y)
camera.frustum.fov = Cesium.Math.PI_OVER_THREE
camera.frustum.near = 1
camera.frustum.far = 2
```



<br>

### Camera的属性

| 静态属性                          | 属性含义                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| DEFAULT_OFFSET: HeadingPitchRange | 相机飞行岛包含边界球体的位置时使用的默认航向/俯仰/范围       |
| DEFAULT_VIEW_FACTOR: Number       | 设置为查看矩形的标量(焦距)，可乘以摄像机位置，然后将其重新添加。<br />如果该值为 0 表示相机将查看整个默认视图矩形。<br />如果该值大于 0 则会使它远离默认视图矩阵。<br />如果该值小于 0 则使它接近默认视图矩阵。<br />实际上就相当于 拉远 或 推进 镜头。 |
| DEFAULT_VIEW_RECTANGLE: Rectangle | 相机在创建时将查看的默认视图矩形。                           |



<br>

| 属性名                                                       | 是否为只读 | 属性含义                                                     |
| ------------------------------------------------------------ | ---------- | ------------------------------------------------------------ |
| changed: Event                                               | 是         | 获取相机改变时引发的事件                                     |
| constrainedAxis: Cartesian3                                  | 否         | 如果设置这相机将无法沿任一方向旋转超过该轴。<br />默认值为 undefined<br />注：constrained 单词意思为 “受约束的” |
| defaultLookAmout: Number                                     | 否         | 默认旋转相机的幅度给 look 方法。<br />默认值为 Math.PI / 60  |
| defaultMoveAmout: Number                                     | 否         | 默认移动相机的幅度给 move 方法。<br />默认值为 100000        |
| defaultRotateAmount: Number                                  | 否         | 默认旋转相机的幅度给 rotate 方法。<br />默认值为 Math.PI/3600 |
| defaultZoomAmout: Number                                     | 否         | 默认移动相机时的幅度给 zoom 方法。<br />默认值为 100000      |
| direction: Cartesian3                                        | 否         | 相机的观看方向                                               |
| directionWC: Cartesian3                                      | 是         | 获取相机在世界坐标中的观看方向                               |
| frustum: PerspectiveFrustum \| PerspectiveOffCenterFrustum \| OrthographicFrustum | 否         | 相机的视椎。<br />默认值为 new PerspectiveFrustum()          |
| heading: Number                                              | 是         | 获取相机的航向(以弧度为单位)                                 |
| inverseTransform: Matrix4                                    | 是         | 获取相机的 逆变换。<br />默认值为 Matri4.IDENTITY            |
| inverseViewMatrix: Matrix4                                   | 是         | 获取相机视图的 逆矩阵                                        |
| maximumZoomFactor: Number                                    | 否         | 乘以地图大小的系数，用于确定从表面缩小时将相机位置限制在何处。<br /><br />仅在 2D 地图模式下的旋转有效。<br />默认值为 1.5。 |
| moveEnd: Event                                               | 是         | 获取相机停止移动时将引发的事件                               |
| moveStart: Event                                             | 是         | 获取相机开始移动时引发的事件                                 |
| percentageChanged: Number                                    | 否         | 引发 changed 事件之前，相机必须更改的数量。<br />该值是 0 - 1 范围内的百分比。<br />默认值为 0.5 |
| pitch: Number                                                | 是         | 获取相机的倾斜(以弧度为单位)                                 |
| position: Cartesian3                                         | 否         | 获取相机的位置                                               |
| positinCartographic: Cartographic                            | 是         | 获取相机的 Cartographic 位置。<br />Cartographic 由 经纬度(弧度) 和 高度(米) 确定的位置。<br />在 2D 或 哥伦布模式下如果相机位于地图之外，那么返回的经纬度也可能不在有效范围之内。 |
| positionWC: Cartesian3                                       | 是         | 获取相机在世界坐标中的位置                                   |
| right: Cartesian3                                            | 否         | 获取相机的正确方向                                           |
| rightWC: Cartesian3                                          | 是         | 获取相机在世界坐标中正确的方向                               |
| roll: Number                                                 | 是         | 获取相机的滚转(以弧度为单位)                                 |
| transform: Matrix4                                           | 是         | 获取相机的参考系。这个变换的 逆 被附加到视图矩阵。<br />默认值为 Matrix4.IDENTITY |
| up: Cartesian3                                               | 否         | 获取或设置相机的向上方向                                     |
| upWC: Cartesian3                                             | 是         | 获取相机在世界坐标系中的向上方向                             |
| viewMatrix: Matrix4                                          | 是         | 获取视图矩阵                                                 |



<br>

### Camera的方法

**cameraToWorldCoordinates(cartesian,result): Cartesian4**

1. cartesian：Cartesian4，要转换的向量或点
2. result：Cartesian4，可选参数，保存计算结果
3. 返回值：转换后的向量或点 对应的 Cartesian4 坐标

将矢量或点的坐标 从参考系转换为世界坐标。



<br>

**cameraToWorldCoordinatesPoint(cartesian,result): Cartesian3**

1. cartesian：Cartesian3，要转换的点
2. result：Cartesian3，可选参数，保存计算结果
3. 返回值：转换后的点坐标

将一个点从相机的参考系转换为世界坐标。



<br>

**cameraToWorldCoordiantesVector(cartesian,result): Cartesian3**

1. cartesian：Cartesian3，要转化的向量
2. result：Cartesian3，可选参数，保存计算结果
3. 返回值：转换后的向量

将一个矢量从相机的参考系转换为世界坐标。



<br>

**cancelFlight()**

取消当前的相机飞行，并将相机留在当前位置。

如果没有进行任何飞行，则此方法不执行任何操作。



<br>

**completeFlight()**

立即完成当前的相机飞行，直接到底目标地。

如果没有进行任何飞行，则此方法不执行任何操作。



<br>

**computeViewRectangle(ellipsoid, result): Rectangle | undefined**

1. ellipsoid: Ellipsoid，默认值 Ellipsoid.WGS84，可选参数，表示地球的椭球标准
2. result: Rectangle，可选参数，保存计算结果
3. 返回值：可见的矩形，如果椭球根本不可见则返回 undefined

计算椭球体上的近似可见矩形。



<br>

**distanceToBoundingSphere(boundingSphere): Number**

1. boundingSphere: BoundingSphere，世界坐标系中的边界球(包围球)
2. 返回值：到边界球的距离

返回从相机到边界球(包围球)的距离。



<br>

**flyHome(duration)**

1. duration: Number，可选参数，飞行持续时间(以秒为单位)。如果省略该参数则 Cesium 会尝试根据要飞行的距离来自行计算理想(合理)的时间。

将相机飞行到 主页 视图。



<br>

**flyTo(options)**

1. options：Object，本次飞行配置相

将相机从当前位置飞行到新位置。

参数 options 为：

| 配置性                                  | 是否为必填项 | 对应含义                                                     |
| --------------------------------------- | ------------ | ------------------------------------------------------------ |
| destination: Cartesian3 \| Rectangle    | 是           | 相机在 WGS84(世界) 坐标中的最终目标位置，<br />或者从上向下视图中可见的矩形。 |
| orientation: Object                     | 否           | 包含方向和向上属性或航向、仰俯、滚转属性的对象。<br />默认情况下方向将指向在 3D 模式中朝向中心，在哥伦布模式中沿负 Z 方向。<br />向上方向在 3D 模式中指向正北，在哥伦布模式中指向 Y 方向。<br />在 2D 模式的无限滚动模式下 不使用方向。 |
| duration: Number                        | 否           | 飞行持续时间(以秒为单位)。<br />如果省略则 Cesium 会自己根据距离计算出理想时长。 |
| complete: Camera.FlightCompleteCallback | 否           | 飞行结束后执行的函数                                         |
| cancel： Camera.FlightCancelledCallback | 否           | 取消飞行后执行的函数                                         |
| endTransform: Matrix4                   | 否           | 表示飞行完成后相机将位于参考帧的变换矩阵                     |
| maximumHeight: Number                   | 否           | 飞行高峰时的最大高度                                         |
| pitchAdjustHeight: Number               | 否           | 如果相机的飞行角度高于该值，请在飞行过程中调整俯仰角以向下看，并将地球保持在视口内。 |
| flyOverLongitude: Number                | 否           | 地球上 2 点之间(飞行)重视有两种方式。<br />此选项会强制让相机以 战斗方向 在该经度上飞行。 |
| flyOverLongitudeWeight: Number          | 否           | 当该方式的时间不长于 flyOverLongitudeWeight 的短途时间时，才通过 flyOverLongitude 飞越指定 Ion。 |
| convert: Boolean                        | 否           | 是否将目的地从世界坐标转换为场景坐标(仅在不使用 3D 模式时)。<br />默认为 true |
| easingFunction: EasingFunction.Callback | 否           | 控制相机飞行过程中的插值时间(运动速率变换)。                 |

**orientation 的补充说明：**

配置项 orientation 实际上就是设置相机以什么姿态(角度)进行飞行。

一共有 2 种配置方式：

1. 方向 + 向上轴，即 direction + up
2. 航向 + 仰俯 + 滚转：即 heading + pitch + roll

请注意你只应该采用其中一种方式来设置飞行姿态，不应该 2 种同时使用。

并且假设你选择的是第 1 种，那么 direction 和 up 的值你必须同时都设置，否则可能引发的错误：

```
DeveloperError: If either direction or up is given, then both are required.
```

> 如果 配置项 orientation 中 direction 或 up 被设置了，那么两者都需要设置。



<br>

使用示例：

```
//1、相机飞行到某个指定位置
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegress(-117.16, 32.71, 15000)
})

//2、相机飞行到某个区域(矩形)
viewer.camera.flyTo({
    destination: Cesium.Rectangle.fromDegress(west,south,east,north)
})

//3、相机飞行按照某种 方向配置 飞行到某个位置。方向配置中使用的是归一化后的方向。
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegress(-122.19, 46.25, 5000),
    orientation:{
        direction: new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
        up: new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
    }
})

//4、相机根据 航向、仰俯、滚转 配置飞行到指定位置
viewer.camer.flyTo({
    destination: Cesium.Cartesian3.fromDegress(-122.19, 46.25, 5000)
    orientation: {
        heading: Cesium.Math.toRadians(175),
        pitch: Cesium.Math.toRadians(-35),
        roll: 0
    }
})
```



<br>

**flyToBoundingSphere(boundingSphere, options)**

将相机移动到所提供的的包围球的位置。

1. boundingSphere：BoundingSphere，要飞行到的目标包围球。
2. options: Object，配置项

> 请注意，此方法的配置项 options 与 flyTo() 的配置项有相同的地方，也有不相同的地方。

参数 options 的配置为：

| 配置项                                  | 对应含义                                                     |
| --------------------------------------- | ------------------------------------------------------------ |
| duration: Number                        | 飞行持续的时间(以秒为单位)。<br />如果省略则 Cesium 会自己根据距离来计算出一个理想的时长。 |
| offset: HeadingPitchRange               | 以头部仰俯(局部东北朝上)的偏移量                             |
| complete: Camera.FlightCompleteCallback | 飞行结束后执行的函数                                         |
| cancel: Camera.FlightCancelledCallback  | 取消飞行后执行的函数                                         |
| endTransform: Matrix4                   | 飞行完成后摄像机的变换矩阵                                   |
| maximumHeight: Number                   | 飞行高峰时的最大高度                                         |
| pitchAdjustHeight: Number               | 如果相机的飞行角度高于该值，则在飞行过程中调整俯仰角度以向下看，并将地球保持在视口中。 |
| flyOverLongitude: Number                | 地球上 2 点之间(飞行)总是有两种方式。<br />此选项会强制相机选择 战斗方向 在该经度上飞行。 |
| flyOverLongitudeWeight: Number          | 只要该方式的时间不超过 flyOverLongitude 的短途时间，那么仅在通过 flyOverLongitude 指定的 Ion 上空飞行。 |
| easingFunction: EasingFunction.Callback | 控制在飞行过程中如何插值时间(飞行速率变化方式)               |



<br>

**getMagnitude(): Number**

1. 返回值：位置的大小

获取相机位置的大小。 在 3D 模式中这是矢量幅度，在 2D 和哥伦布模式中这是地图的距离。



<br>

**getPickRay(windowPosition,result): Ray**

1. windowPosition: Cartesian2，像素的 x 和 y 坐标
2. result: Ray，可选参数，保存计算结果

返回在世界坐标系中，从相机位置到 windowPosition 处像素所对应的 射线(ray)。



<br>

**getPixelSize(boundingSphere, drawingBufferWidth, drawingBufferHeight): Number**

1. boundingSphere: BoundingSphere，世界坐标系中的包围球
2. drawingBufferWidth: Number，绘图缓冲区的宽度
3. drawingBufferHeight: Number，绘图缓冲区的高度
4. 返回值：像素大小(以米为单位)

返回以米为单位的像素大小。



<br>

**getRectangleCameraCoordinates(rectangle,result): Cartesian3**

1. rectangle: Rectangle，要查看的矩形
2. result: Cartesian3，可选参数，保存计算结果
3. 返回值：查看矩形所需要的相机位置

获取在椭球或地图上查看矩形所需要的相机位置。



<br>

**look(axis,angle)**

1. axis: Cartesian3，旋转轴
2. angle: Number，可选参数，旋转角度(以弧度为单位)，默认值为 defaultLookAmount。

以 angle 角度沿 axis 轴旋转相机。



<br>

**lookAt(target, offset)**

1. target: Cartesian3，世界坐标中的目标位置
2. offset: Cartesian3 | HeadingPitchRange，偏移量。

使用目标和偏移量设置相机的位置和方向。

可能引发的错误：

```
DeveloperError: lookAt is not supported while morphing.
```

> 在变形的过程中不可以执行 lookAt()

<br>

使用示例：

```
//1、使用笛卡尔偏移
const center = Cesium.Cartesian3.fromDegress(-98, 40)
viewer.camera.lookAt(center, new Cesium.Cartesian3(0, -4790000, 3930000))

//2、使用头部姿态偏移
const center = Cesium.Cartesian3.fromDegress(-72, 40)
const heading = Cesium.Math.toRadians(50)
const pitch = Cesium.Math.toRadians(-20)
const range = 5000
viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading,pitch,range))
```



<br>

**lookAtTransform(transform,offset)**

1. transform: Matrix4，定义参考框架的变换矩阵
2. offset: Cartesian3 | HeadingPitchRange，可选参数，在意目标为中心的参考帧中，与目标的偏移。

使用目标和变换矩阵设置相机的位置和方向。

可能引发的错误：

```
DeveloperError: lookAtTransform is not supported while morphing.
```

> 不可以在变形过程中使用 lookAtTransform()

<br>

使用示例：

```
//1、使用笛卡尔
const transform = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegress(-98,40))
viewer.camera.lookAtTransform(transform,new Cesium.Cartesian3(0,-4790000,3930000))

//2、使用头部姿态
const transform = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegress(-72,40))
const heading = Cesium.Math.toRadians(50)
const pitch = Cesium.Math.toRadians(-20)
const range = 5000
viewer.camera.lookAtTransform(transform, new Cesium.HeadingPitchRange(heading,pitch,range))
```



<br>

**lookDown(amount)**

1. amount: Number，可选参数，旋转的量(以弧度为单位)。默认为 defaultLookAmout。

在 3D 模式下，沿相机向上矢量的反方向，按照 amout 量旋转相机。



<br>

**lookLeft(amount)、lookRight(amount)、lookUp(amount)**

用法和 lookDown() 相同，只是旋转的方向不同。



<br>

**move(direction, amount)**

1. direction: Cartesian3，移动的方向
2. amount: Number，可选参数，移动的量(以米为单位)。默认为 defaultMoveAmount。

沿 direction 方向，按照 amout 量移动相机的位置。



<br>

**moveBackward(amount)**

1. amount: Number，可选参数，移动的量(以米为单位)。默认为 defaultMoveAmount。

沿相反方向，按照 amount 量移动相机的位置。

注意，在 2D 模式下，这将缩小相机而不是平移相机的位置。



<br>

**moveForward(amount)**

1. amoutn: Number，可选参数，移动的量(以米为单位)。默认为 defaultMoveAmount。

沿向前方向，按照 amount 量移动相机的位置。

注意，在 2D 模式下，这将放大相机而不是平移相机的位置。



<br>

**moveDown(amount)**

1. amount: Number，可选参数，移动的量(以米为单位)。默认为 defaultMoveAmount。

沿相机上矢量的相反方向，按照 amout 量平移相机的位置。



<br>

**moveLeft(amount)、moveRight(amount)、moveUp(amount)**

用法和 moveDown() 类似，只是移动的方向不同。



<br>

**pickEllipsoid(windowPosition,ellipsoid,result): Cartesian3 | undefined**

1. windowPosition: Cartesian2，像素的 x 和 y 坐标
2. ellipsoid: Ellipsiod，可选参数，默认值为 Ellipsoid.WGS84，要拾取的椭球(的标注)
3. result: Cartesian3，可选参数，保存计算结果
4. 返回值：椭球或地球表面上点的坐标

拾取一个 椭球 或 地图，返回椭球或地球表面上点的坐标。

如果没有拾取到椭球或地球，则返回 undefined。

示例代码：

```
const canvas viewer.scene.canvas
const center = new Cesium.Cartesian2(canvas.clientWidth/2,canvas.clientHeight/2)
const ellipsoid = viewer.scene.globel.ellipsoid
const result = viewer.camera.pickEllipsoid(center,ellipsoid)
```



<br>

**rotate(axis,angle)**

1. axis: Cartesian3，在直接坐标系中给定的旋转轴
2. angle: Number，可选参数，旋转角度(以弧度为单位)。默认为 defaultRotateAmount。

将相机绕 axis 旋转 angle。

注意：相机到参考框中心的距离保持不变。



<br>

**rotateDown(angle)**

1. angle: Number，可选参数，旋转角度(以弧度为单位)。默认为 defaultRotateAmount。

沿相机参考框的中心向下旋转 angle 。



<br>

**rotateLeft(angle)、rotateRight(angle)、rotateUp(angle)**

他们的用法和 rotateDown(angle) 相同，只是旋转的方向不同。



<br>

**look、move、rotate 3 者之间的不同差异：**

1. move：移动，仅改变位置
2. rotate：旋转，仅改变角度
3. look：朝向，仅改变朝向
4. lookAt：即改变朝向，又改变位置



<br>

**setView(options)**

设置相机的位置、方向和变换。

参数 options 的配置项为：

| 配置项                              | 是否可选 | 对应含义                                                     |
| ----------------------------------- | -------- | ------------------------------------------------------------ |
| destination:Cartesian3 \| Rectangle | 可选     | 相机在 WGS84 坐标中最终位置 或 从上向下视图中可见的矩形。    |
| orientation: Object                 | 可选     | 相机的姿态，分为2种配置方式：<br />1、方向(direction) + 向上(up)<br />2、航向(heading) + 仰俯(pitch) + 滚转(roll) |
| endTransform: Matrix4               | 可选     | 变换当前相机的矩阵                                           |
| convert: Boolean                    | 可选     | 是否将目的地从世界坐标转换为场景坐标(仅在不使用 3D 模式时)。默认为 true |



<br>

示例代码：

```
// 1、设置目的地位置
viewer.camera.setView({
    destination : Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0)
});

// 2、设置目的地、姿态
viewer.camera.setView({
    destination : cartesianPosition,
    orientation: {
        heading : Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
        pitch : Cesium.Math.toRadians(-90),    // default value (looking down)
        roll : 0.0                             // default value
    }
});

// 3、设置姿态
viewer.camera.setView({
    orientation: {
        heading : Cesium.Math.toRadians(90.0), // east, default value is 0.0 (north)
        pitch : Cesium.Math.toRadians(-90),    // default value (looking down)
        roll : 0.0                             // default value
    }
});


// 4、设置目的地矩形
viewer.camera.setView({
    destination : Cesium.Rectangle.fromDegrees(west, south, east, north)
});

// 5、设置目的地、方向、向上轴
viewer.camera.setView({
    destination : Cesium.Cartesian3.fromDegrees(-122.19, 46.25, 5000.0),
    orientation : {
        direction : new Cesium.Cartesian3(-0.04231243104240401, -0.20123236049443421, -0.97862924300734),
        up : new Cesium.Cartesian3(-0.47934589305293746, -0.8553216253114552, 0.1966022179118339)
    }
});
```



<br>

**switchToOrthographicFrustum()**

将平截头体/投影切换为正交。

由于在 2D 模式下始终使用的是正交，所以这个方法在 2D 模式下是无用的。



<br>

**switchToPerspectiveFrustum()**

将平截头体/投影切换为透视。

由于在 2D 模式下始终使用的是正交，所以这个方法在 2D 模式下是无用的。



<br>

**twistLeft(amount)**

1. amount: Number，可选参数，旋转的量(以弧度为单位)。默认为 defaultLookAmount。

以 amount 的量，围绕相机方向矢量 逆时针旋转照相机。



<br>

**twistRight(amout)**

1. amount: Number，可选参数，旋转的量(以弧度为单位)。默认为 defaultLookAmount。

以 amount 的量，围绕相机方向矢量 顺时针旋转照相机。



<br>

> twist：单词意思为 捻，你可以想象一下钟表中的分针，假设此时分针刚好指向 12 点处，如果接下来 向左走即 逆时针、向右走即 顺时针。
>
> 因此 twistLeft 对应 逆时针、twistRight 对应 顺时针。



<br>

**viewBoundingSphere(boundingSphere,offset)**

1. boundingSphere: BoundingSphere，要查看的边界球。
2. offset: HeadingPitchRange，可选参数，距离目标的偏移量

设置相机，是当前视图中包含提供的边界球。



<br>

**worldToCameraCoordinates(cartesian,result): Cartesian4**

1. cartesian: Cartesian4，要转换的向量或点
2. result: Cartesian4，可选参数，保存计算结果
3. 返回值：转换后的向量或点

将向量或点从世界坐标转换为相机的局部坐标。



<br>

**worldToCameraCoordinatesPoint(cartesian,result): Cartesian3**

1. cartesian: Cartesian3，转换的点
2. result: Cartesian3，可选参数，保存计算结果
3. 返回值：转换后的点

将点从世界坐标转换为相机的局部坐标。



<br>

**worldToCameraCoordiantesVector(cartesian,result): Cartesian3**

1. cartesian: Cartesian3，要转换的向量
2. result: Cartesian3，可选参数，保存计算结果
3. 返回值：转换后的向量

将向量从世界坐标转化为相机的局部坐标。



<br>

**zoomIn(amount)**

1. amount: Number，可选参数，缩放的量，默认为 defaultZoomAmount。

沿相机的视图向量，按照 amount 的量缩小相机视图。



<br>

**zoomOut(amount)**

1. amount: Number，可选参数，缩放的量，默认为 -defaultZoomAmount。

沿相机的视图向量，按照 amount 的量放大相机视图。



<br>

我们知道 defaultZoomAmount 的默认为 100000。

那么以 3D 模式为例：

1. zoomIn() 内部执行的是 zoom3D(this, amount)
2. zoomOut() 内部执行的是 zoom3D(this, -amount)



<br>

### Carema的静态函数

**FlightCancelledCallback()**

取消飞行时将执行的函数。



<br>

**FlightCompleteCallback()**

飞行结束后执行的函数。



<br>

## 地图的底图(地形或几何形状)：TerrainProvider

**TerrainProvider：地形提供者**

https://github.com/CesiumGS/cesium/blob/main/Source/Core/TerrainProvider.js

为椭球表面提供地形或其他几何形状。

表面几何形状为根据 TilingScheme 整理成的金字塔状的瓦片。



<br>

**不可以被实例化：**

请注意 TerrainProvider 仅是为了描述接口，不能实例化。

如果你尝试实例化，例如：

```
const provider = new Cesium.TerrainProvider()
```

那么在内部就会执行这样的代码，给你报错：

```
DeveloperError.throwInstantiationError();
```



<br>

**日常使用示例：**

尽管 TerrainProvider 不可以直接实例化，仅为定义接口作用，我们实际中可以有多种形式的方式来设置它。

第 1 种：使用 cesium 提供的在线地形

```
viewer.terrainProvider = Cesium.createWorldTerrain()
```

第 2 种：使用自定义发布的地形服务

```
viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
    url: 'http://xxx.xx/xxx',
    requestVertexNormals: true
})
```

第 3 种：不使用地形

```
viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()
```



<br>

### TerrainProvider的属性(定义的接口)

再次重申，TerrainProvider 仅为 js 定义的 接口，无法实例化，所以所谓他的 “属性” 也是 “接口”。

> 如果 Cesium 在源码层使用 TypeScript 的话，就不会使用这种形式来定义接口了。

<br>

| 静态属性名                      | 属性含义                                                     |
| ------------------------------- | ------------------------------------------------------------ |
| heightmapTerrainQuality: Number | 指定从高度图创建的地形的质量。默认值为 0.25。<br />当值为 1 时将会确保相邻的高度图顶点之间的间距不超过 Globe.maximumScreenSpaceError 屏幕像素，并且可能会非常缓慢。<br />当值为 0.5 时会将估算的零级几何误差减半，允许相邻高度图之间的屏幕像素增加两倍，从而更快渲染。 |



<br>

| 属性名                            | 属性含义                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| availability: TileAvailability    | 获取一个对象，该对象可用于从此地形提供者确定地形的可用性。   |
| credit: Credit                    | 获取此地形提供者处于活动状态时显示的功劳。通常这将归功于地形的来源。 |
| errorEvent: Event                 | 获取当地形提供者遇到异步错误时引发的事件。                   |
| hasVertexNormals: Boolean         | 获取所请求的图块是否包含顶点法线。                           |
| hasWaterMask: Boolean             | 获取提供者是否提供水域遮罩。<br />水域遮罩会指出地球上哪些区域是水而不是土地，因此可以添加带有动画波动的水纹发射效果。 |
| ready: Boolean                    | 获取地形图供着是否已准备就绪，可以开始使用。                 |
| readyPromise: `Promise.<Boolean>` | 此为只读属性，异步获取地形低筒这准备就绪的 Promise。         |
| tilingScheme: TilingScheme        | 获取地形提供者使用的切片方案。                               |

请注意：以上绝大多数属性，都应该在地形提供者已准备就绪(.ready) 之后才可以去调用。



<br>

### TerrainProvider的方法(定义的接口)

**getEstimatedLevelZeroGeometricErrorForAHeightmap(ellipsoid, tileImageWidth, numberOfTilesAtLevelZero): Number**

此为静态方法

1. ellipsoid: Ellipsoid，地形所附着的椭球
2. tileImageWidth: Number，与单个图片关联的高度图的宽度(以像素为单位)
3. numberOfTilesAtLevelZero: Number，瓦片级别为 零 时水平方向的瓦片数量。
4. 返回值：估计的几何误差

当集合来自高度图时，估计出的几何误差。



<br>

**getRegularGridIndices(width,height): Uint16Array | Uint32Array**

此为静态方法

1. width: Number，水平方向上常规网格中的顶点数
2. height: Number，垂直方向上常规网格中的顶点数
3. 返回值：索引列表。
   * Uint64Array 返回的大小不超过 64KB
   * Uint32Array返回的大小不超过 4GB

获取代表常规网格的三角形网格的索引列表。

请注意：顶点总数必须小于等于 65536。



<br>

**getLevelMaximumGeometricError(level): Number**

1. level: Number，要获得最大几何误差的图块级别
2. 返回值：最大几何误差

获取给定级别的图块中允许的最大几何误差。



<br>

**getTileDataAvailable(x,y,level): Boolean | undefined**

1. x: Number，几何图形的图块的 x 坐标
2. y: Number，几何图形的图块的 y 坐标
3. level: Number，几何图形的图块级别
4. 返回值：如果地形提供者不支持则为 undefined，否则为 true 或 false

确定是否可以加载图块的数据。



<br>

**loadTileDataAvailability(x,y,level): `Promise.<void> | undefined`**

1. x: Number，几何图形的图块的 x 坐标
2. y: Number，几何图形的图块的 y 坐标
3. level: Number，几何图形的图块级别
4. 返回值：有 2 种可能，第一种是 undefined，第二种是 `Promise.<void>`

确定加载图块数据的可用性。



<br>

**requestTileGeometry(x,y,level,request): `Promise.<TerrainData> | undefined`**

1. x: Number，几何图形的图块的 x 坐标
2. y: Number，几何图形的图块的 y 坐标
3. level: Number，几何图形的图块级别
4. request: Request，可选参数，请求对象，仅供内部使用。
5. 返回值：有 2 种可能，第一种是 undefined，第二种是 `Promise.<TerrainData>`
   * 如果返回的是 undefined，这说明当前有太多请求需要处理，请稍后重试。

请求给定图块的几何形状。

请注意一定要在 .ready 为 true 之后才可以调用该函数。

异步返回的结果中包含 地形数据、水域遮罩，以及哪些子块可用的信息。



<br>

## 影像图层的根基：ImageryProvider

**ImageryProvider: 椭球表面的图像提供者。**

请注意，ImageryProvider 和 TerrainProvider 相似，本身都仅仅定义接口，并不能直接实例化。



<br>

### ImageryProvider的属性(定义的接口)

| 属性名                                                 | 属性含义                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| credit: Credit，只读属性                               | 获取此图像提供者处于活动状态时要显示的功劳。<br />通常用于记入图像的来源。 |
| defaultAlpha: Number \| undefined                      | 默认的 alpha 混合值。<br />若值为 0 则完全透明。<br />若值为 1 则完全不透明 |
| defaultBrightness: Number \| undefined                 | 默认的亮度。<br />若值为 1 则使用图像原有颜色，<br />若值小于 1 则图像较暗，<br />若大于 1 则图像更亮。 |
| defaultContrast: Number \| undefined                   | 默认对比度。正常对比度值为 1                                 |
| defaultDayAlpha: Number \| undefined                   | 全球日期的默认 alpha 混合值。                                |
| defaultGamma: Number \| undefined                      | 默认伽玛校正值。若值为 1 即表示使用未修改的图像颜色。        |
| defaultHue: Number \| undefiend                        | 默认的色调(以弧度为单位)。<br />若值为 0 即表示使用未修改的图像颜色 |
| defaultMagnificationFilter: TextureMagnificationFilter | 默认纹理的放大滤镜。                                         |
| defaultMinificationFilter: TextureMinificationFilter   | 默认纹理的缩小滤镜。                                         |
| defaultNightAlpha: Number \| undefined                 | 夜间默认的 alpha 混合值。                                    |
| defaultSaturation: Number \| undefined                 | 默认的饱和度。若值为 1 即表示使用为修改的图像饱和度。        |
| errorEvent: Event，只读属性                            | 获取图像所引发的异步错误事件。                               |
| hasAlphaChannel: Boolean，只读属性                     | 获取图像提供者是否提供了图像的 alpha 通道。                  |
| maximumLevel: Number \| undefined，只读属性            | 获取可以请求的最大级别                                       |
| minimumLevel: Number \| undefined，只读属性            | 获取可以请求的最低级别                                       |
| proxy: Proxy，只读属性                                 | 获取使用的代理                                               |
| ready: Boolean，只读属性                               | 获取图像提供者是否已准备就绪                                 |
| readyPromise: `Promise.<Boolean>`，只读属性            | 异步获取图像提供者是否已准备就绪                             |
| rectangle: Rectangle，只读属性                         | 获取图像的矩形(以弧度表示)                                   |
| titleDiscardPolicy: TileDiscardPolicy，只读属性        | 获取切片丢弃策略。<br />如果未定义则通过 shouldDiscardImage 函数过滤掉 “缺失” 的图块。 |
| tileHeight: Number，只读属性                           | 获取每个图块的高度(以像素为单位)                             |
| tileWidth: Number，只读属性                            | 获取每个图块的宽度(以像素为单位)                             |
| tilingScheme: TilingScheme，只读属性                   | 获取切片方案。                                               |

请注意：以上绝大多数属性都需要在 图像提供者已就绪(.ready 为 true)的情况下才可调用。



<br>

### ImageryProvider的方法(定义的接口)

**loadImage(imageryProvider, url): `Promise.<HTMLImageElement | HTMLCanvasElement> | undefined`**

此为静态方法

1. imageryProvider: ImageryProvider，图像提供者
2. url: Rescource | String，图片的网址
3. 返回值：异步返回解析的 图片或画布 元素对象。
   * 如果当前服务器待处理请求过多，则返回 undefined，可以稍后重试。

从给定的 URL 加载图像。



<br>

**getTileCredits(x,y,level): `Array.<Credit>`**

1. x: Number，瓦片的 x 坐标
2. y: Number，瓦片的 y 坐标
3. level: Number，平铺级别
4. 返回值：显示给定图块时要显示的信用

获取显示给定图块时要显示的信用。



<br>

**pickFeatures(x,y,level,longitude,latitude): `Promise.<Array.<ImageryLayerFeatureInfo>> | undefined`**

1. x: Number，瓦片的 x 坐标
2. y: Number，瓦片的 y 坐标
3. level: Number，平铺级别
4. longitude: Number，选择要素的经度
5. latitude: Number，选择要素的纬度
6. 返回值：异步返回拾取结果
   * 如果不支持拾取，则返回 undefined
   * 如果支持拾取，但是没有拾取到任何要素，则返回的数据为空数组

异步确定哪些要素位于给定的经度和纬度的瓦片内。



<br>

**requestImage(x,y,level,request): `Promise.<(HTMLImageElement | HTMLCanvasElement)> | undefined`**

1. x: Number，瓦片的 x 坐标
2. y: Number，瓦片的 y 坐标
3. level: Number，平铺级别
4. request: Request，可选参数，请求对象，仅供内部使用。
5. 返回值：异步返回 图片或画布 元素，或者是 undefined。
   * 如果服务器待处理请求过多，则返回 undefined，可以稍后重试

请求给定图块的图像。



<br>

请注意：以上绝大多方法都需要在 图像提供者已就绪(.ready 为 true)的情况下才可调用。



<br>

## 图像层：ImageryLayer

**ImageryLayer：一个图像图层，显示来自 Globe 上单个图像提供者的平铺图像数据。**



<br>

**实例化一个图像层：**

```
const imageryLayer = new Cesium.ImageryLayer(imageryProvider, options)
```

1. imageryProvider: ImageryProvider，要使用的图像提供者。
2. options: Object，可选参数，图像层的配置项。



<br>

**参数 options 的配置内容：**

options 的所有配置项均为 可选配置项。

| 配置项                                            | 默认值                            | 配置内容                                                     |
| ------------------------------------------------- | --------------------------------- | ------------------------------------------------------------ |
| reatangle: Rectangle                              | imageryProvider.rectangle         | 图层的矩形。<br />这个矩形可限制图像提供者的可见部分。       |
| alpha: Number \| function                         | 1                                 | 该层的 alpha 混合值。<br />有 2 种设置方式，第1种就是直接为透明度数值，<br />第2种为一个函数 function(frameState,layer,x,y,level): Number。<br />该函数通过当前帧状态，以及图层 x y 和级别，给出对应的 alpha 值。 |
| nightAlpah: Number \| function                    | 1                                 | 在地球的夜晚，此图层的 alpha 混合值。<br />参数的 2 种设置方式和 alpha 完全相同。<br />请注意该值只有在 enableLighting 为 true 时生效。 |
| dayAlpha: Number \| function                      | 1                                 | 地球白天，此图层的 alpha 混合值。<br />参数的 2 种设置方式和 alpha 完全相同。<br />请注意该值只有在 enableLighting 为 true 时生效。 |
| brightness: Number \| function                    | 1                                 | 该层的亮度。                                                 |
| contrast: Number \| function                      | 1                                 | 该层的对比度。                                               |
| hue: Number \| function                           | 1                                 | 该层的色相(以弧度为单位)。                                   |
| saturation: Number \| function                    | 1                                 | 该层的饱和度。                                               |
| gamma: Number \| function                         | 1                                 | 该层的伽玛校正。                                             |
| splitDirection: ImagerySplitDirection \| function | ImagerySplitDirection.NONE        | ImagerySplitDirection 分割以应用此图层。                     |
| minficationFilter: TextureMinificationFilter      | TextureMinificationFilter.LINEAR  | 此图层的纹理最小化滤镜。<br />可能的值是 .LINEAR 或 .NEAREST |
| magnificationFilter: TextureMagnificationFilter   | TextureMagnificationFilter.LINEAR | 此图层的纹理放大滤镜。<br />可能的值是 .LINEAR 或 .NEAREST   |
| show: Boolean                                     | true                              | 是否显示该图层                                               |
| maximumAnisotropy: Number                         | 设备webgl最大可支持的数值         | 用于纹理过滤的最大各向异性级别。<br />如果未指定此参数，则默认使用 webgl 堆栈支持的最大各向异性。<br />较大的值使图像在地平面视图中看起来更好。 |
| minimumTerrainLevel: Number                       |                                   | 显示此图像图层的最小地形细节级别。                           |
| maximumTerrainLevel: Number                       |                                   | 显示此图像图层的最大地形细节级别。                           |
| cutoutRectangle: Rectangle                        |                                   | 制图矩形，用于裁剪此 图像图层 的一部分。                     |
| colorToAlpha: Color                               |                                   | 应该设置为透明的颜色值                                       |
| colorToAlphaThreshold: Number                     | 0.004                             | 颜色到 alpha 的阈值。<br />这里的 阈值 是指能够产生效应的最低值。 |



<br>

**名词解释：各向异性(Anisotropy)**

各向异性是指物质的全部或部分化学、物理等性质随着方向的改变而有所变化，在不同的方向上呈现出差异的性质。



<br>

**名词解释：阈值(Threshold)**

阈(yù)值，又叫 临界值，是指一个效应能够产生的最低值或最高值。



<br>

### ImageryLayer的属性

类的静态属性：

| 静态属性                                                 | 默认值  | 属性含义                           |
| -------------------------------------------------------- | ------- | ---------------------------------- |
| DEFAULT_APPLY_COLOR_TO_ALPHA_THRESHOLD: Number           | 0.004   | 默认的颜色到 alpha 的阈值          |
| DEFAULT_BRIGHTNESS: Number                               | 1       | 默认的亮度                         |
| DEFAULT_CONTRAST: Number                                 | 1       | 默认的对比度                       |
| DEFAULT_GAMMA: Number                                    | 1       | 默认的伽玛校正                     |
| DEFAULT_HUE: Number                                      | 1       | 默认的色相                         |
| DEFAULT_MAGINFICATION_FILTER: TextureMagnificationFilter | .LINEAR | 默认的纹理放大滤镜                 |
| DEFAULT_MINIFICATION_FILTER：TextureMinificationFilter   | .LINEAR | 默认的纹理最小化滤镜               |
| DEFAULT_SATURATION: Number                               | 1       | 默认的饱和度                       |
| DEFAULT_SPLIT: Number                                    | .NONE   | 默认将此值作为图像图层的默认分割。 |



<br>

实例的属性：

| 属性名                                          | 默认值  | 属性含义                                                     |
| ----------------------------------------------- | ------- | ------------------------------------------------------------ |
| alpha: Number                                   | 1       | 图层的透明度                                                 |
| brightness: Number                              | 1       | 图层的亮度                                                   |
| colorToAlpha: Color                             |         | 应该设置为透明的颜色值。                                     |
| colorToAlphaThreshold: Number                   | 0.004   | 颜色到 alpha 的阈值<br />取值范围 0 - 1                      |
| contrast: Number                                | 1       | 图层的对比度                                                 |
| cutoutRectangle: Rectangle                      |         | 图像中的裁切矩形                                             |
| dayAlpha: Number                                | 1       | 在地球白天时该图层的 alpha 混合值                            |
| gamma: Number                                   | 1       | 图层的伽玛校正                                               |
| hue: Number                                     | 1       | 图层的色相(以弧度为单位)                                     |
| imageryProvider: ImageryProvider，只读属性      |         | 获取此图层的图像提供者                                       |
| magnificationFilter: TextureMagnificationFilter | .LINEAR | 纹理放大滤镜。只可以是以下 2 个中的其中一个：LINEAR、NEAREST。<br />如果要想让该值生效，应该实例化 添加该图层之后立即设置此属性，否则如果等加载纹理完成后即使修改也不会生效。 |
| minificationFilter: TextureMinificationFiltert  | .LINEAR | 纹理最小化滤镜。<br />其可选值与注意事项与 magnificationFilter 相同。 |
| nightAlpha: Number                              | 1       | 在地球夜晚时该图层的 alpha 混合值                            |
| rectangle: Rectangle，只读属性                  |         | 获取此图层的矩形。                                           |
| saturation: Number                              | 1       | 图层的饱和度                                                 |
| show: Boolean                                   | true    | 是否显示该图层                                               |
| splitDirection: ImagerySplitDirection           | .NONE   | 将此值应用于图像图层的分割。                                 |



<br>

### ImageryLayer的方法

**destroy()**

销毁此对象拥有的 WebGL 资源。



<br>

**getViewableRectangle(): `Promise.<Rectangle>`**

1. 返回值：异步返回 交集对应的矩形

计算此图层的矩形与图像提供者的可用性矩形的交集，产生可以由该图层产生的图像的整体边界。

示例代码：

```
imageryLayer.getViewableRectangle().then(function(rectangle){
  return camera.flyTo({
  destination: rectangle
  })
})
```



<br>

**isBaseLayer(): Boolean**

检查当前图层是否为 ImageryLayerCollection。

基础图层是其他所有图层的基础。

它的特殊之处在于它被视为具有全局矩形，即使实际上它没有，通过在整个地球的边缘拉伸像素。



<br>

**isDestroyed(): Boolean**

检查当前图层是否已被销毁。



<br>

## 坐标系和坐标转换：position，Cartesian2、Cartesian3、Cartesian4、Spherical、Cartographic

**Cesium 中的几种坐标系：**

1. 屏幕坐标：position
2. 二维笛卡尔坐标：Cartesian2
3. 三维笛卡尔坐标：Cartesian3
4. 四维笛卡尔坐标：Cartesian4
5. 球极坐标：Spherical
6. 地理坐标(经度+纬度+ 高度 )：Cartographic



<br>

### 屏幕坐标：position

实际上就是指负责显示 Cesium 内容 的 DOM 元素上的某个位置坐标，或者是当前鼠标所处的位置坐标。

即：

1. x
2. y



<br>

### 二维笛卡尔坐标：Cartesian2

| 属性名    | 默认值 | 属性含义   |
| --------- | ------ | ---------- |
| x: Number | 0      | x 坐标分量 |
| y: Number | 0      | y 坐标分量 |



<br>

| 类静态属性           | 属性值 | 属性含义                                                     |
| -------------------- | ------ | ------------------------------------------------------------ |
| packedLenght: Number | 2      | 用于将对象打包(存储到外部)到数组中的元素的个数。<br />你可以暂时理解为打包(存储到外部)输出类的静态属性时，<br />这个二维向量的核心元素个数为 2 个，即 x 和 y。 |
| UNIT_X: Cartesian2   | (1,0)  | 一个固定不变且已归一化的二维向量，指向 x 轴正方向的          |
| UNIT_Y: Cartesian2   | (0,1)  | 一个固定不变且已归一化的二维向量，指向 y 轴正方向的          |
| ZERO: Cartesian2     | (0,0)  | 一个固定不变且已归一化的二维向量，位于原点                   |



<br>

**方法的差异：**

Cesium.js 中的 Cartesian2 对应的是 Three.js 中的 Vector2。

但是：

1. 虽然有很多函数用途相同，但是他们的方法名字相似却不相同

   > 例如计算向量的长度，Vector2 使用的是 .length()，而 Cartesian2 使用的是 .magnitude()

2. 在 Vector2 中所有的方法都是实例的方法，但是在 Cartesian2 中将很多方法都作为 类的静态方法。

3. 有一些完全不同的方法

   > 例如 Cartesian2 有一个 Vector2 没有的方法 .equalsEpsilon()



<br>

**clone(result): Cartesian2**

复制出一份相同的二维向量。



<br>

**equals(right): Boolean**

判断当前二维坐标与参数 right 的各个分量是否相同。

> 参数名叫 right 仅此而已，不用过多解读。
>
> 在 Cesium 的命名习惯中， “left 指当前”、“right 指要对比的参数”



<br>

**equalsEpsilon(right,relativeEpsilon,absoluteEpsilon): Boolean**

1. right: Cartesian2，要对比的二维坐标

2. relativeEpsilon: Number，相对公差数

3. absoluteEpsilon: Number，可选参数，绝对公差数。

   如果未给定 absoluteEpsilon 则会将 relativeEpsilon 也当做 absoluteEpsilon。

4. 返回值：对比的布尔结果

将当前二维坐标与参数 right 分别进行 相对公差比较、绝对公差比较，并返回比较结果的布尔值。

**相对公差、绝对公差的计算过程**

1. 假设当前二维向量为 left、另外一个二维向量为 right

2. 首先判断 2 者是否是同一个二维向量的引用

3. 若不不是则计算出 2 者之间 x 分量的绝对差

   ```
   const absDiff = Math.abs(left.x - right.x)
   ```

4. 然后将 absDiff 与 相对公差数 和 绝对公差数进行对比

   ```
   return absDiff <= absoluteEpsilon || absDiff <= relativeEpsilon * Math.max(Math.abs(left.x),Math.abs(right.x))
   ```

5. 然后再依次，相同的操作再对比一次 y 分量。

6. 假设 left 是否和 right 为同一个二维向量的引用，对比结果为 boo1 、x 分量对比结果为 boo2、y 分量对比结果为 boo3，那么最终该方法返回的结果为：

   ```
   return boo1 || (boo2 && boo3)
   ```

**相对公差数和绝对公差数的常见取值：**

大多数时候会采用 Cesium Math 的几个常量，例如：

1. Cesium.Math.EPSILON1 为 0.1
2. Cesium.Math.EPSILON1 为 0.01
3. Cesium.Math.EPSILON3 为 0.001
4. ...
5. Cesium.Math.EPSILON21 为 0.000000000000000000001

<br>

**结论：**

equalsEpsilon() 方法主要用来判断 2 个向量之间的差异是否在某个范围内。

这主要是因为 JS 采用的是浮点数，不是高精的数字。比如某个坐标分量你以为它的值为 4，但实际可能是 4.000000000001，那么如果直接使用 equals() 去做对比，容易误判 2 者不相同。



<br>

**epsilon的补充解释：**

epsilon 这个单词有很多种翻译，其中有一个翻译为：希腊的第 5 个字母 ε，大写为 E 。

很多科学家会使用这个符号来表示公式中的 “误差”。

delta 这个单词对应的是希腊第 4 个字母 δ ，大写为 Δ，科学家通常使用这个字母来表示 “距离”。

> 由于 delta 对应的希腊大写为 Δ，很多翻译工具会将 delta 翻译为 “三角洲”

> 当然现在 delta 又多了一个含义：德尔塔病毒，即新冠病毒第 4 代变种

所以 epsilon-delta 这个词可以翻译为：误差距离

而 equalsEpsilon() 直译过来就是：等于误差，即在误差范围内。



<br>

**toString(): String**

返回一个以 “`(x,y)`” 这个格式的字符串。



<br>

**以下为 Cartesian2 的静态方法。**



<br>

**abs(cartesian,result): Cartesian2**

将 result 的 x y 分量分别设置为参数 cartesian 对应分量的绝对值，并返回 result。



<br>

**add(left,right,result): Cartesian2**

1. left、right: Cartesian2
2. result: 保存计算结果
3. 返回值：返回 result

将 2 个二维向量相加，将计算结果保存到 result 中，并返回 result。



<br>

**angleBetween(left,right): Number**

返回二维向量 left 转向 right 所需的角度(以弧度为单位)



<br>

**clone(cartesian,result): Cartesian2**

将 cartesian 各个分量 复制到 result 中。



<br>

**cross(left,right): Number**

1. left: Cartesian2
2. right: Cartesian2

返回参数中 2 个二维向量的叉乘(叉积、外积)。

请注意在二维坐标系中严格来说是不存在叉乘的，只有三维坐标系中才有叉乘。

> 三维向量叉乘得到的是同时垂直于 left、right 的另外一个三维向量。

二维向量的叉乘是指它们的 几何叉乘。

这里所计算的叉乘隐含了一个设定：假定 left、right 均为一个三维向量，且 z 都为 0。



<br>

**distance(left,right): Number**

计算二维向量 left 与 right 的距离。



<br>

**distanceSquared(left,right): Number**

计算二维向量 left 与 right 之间距离的平方值。

> 这和 Three.js 中 Vector2 完全相同，因为对于计算机而言更擅长做浮点运算，但擅长开平方根。
>
> 所以反而是 计算平方 性能更快。



<br>

**divideByScalar(cartesian,scalar,result): Cartesian2**

将二维向量 cartesian 的 x y 分量都除以 标量 scalar，将计算结果保存到 result 中，并返回 result。



<br>

**divideComponents(left,right,result): Cartesina2**

计算 left 的 x y 分量分别除以 right 的对应分量，将结果保存到 result 中，并返回 result。



<br>

**dot(left,right): Number**

计算两个二维向量的 点乘(乘积、内积)



<br>

**equals(left,right): Boolean**

对比两个二维向量的分量 x y 是否都相同。



<br>

**equalsEpsilon(left,right,relativeEpsilon,absoluteEpsilon): Boolean**

通过 相对公差 和 绝对公差测试，判断 2 者是否足够接近。



<br>

**fromArray(array,startingIndex,result): Cartesian2**

根据偏移 startingIndex，从数组 array 中读取 2 个数值并分别赋值给二维向量 result，并返回 result。



<br>

**fromCartesian3(cartesian,result): Cartesian2**

从参数 三维向量中读取 x y 分量并赋值给二维向量 result 对应的分量，并返回 result。



<br>

**fromCartesian4(cartesian,result): Cartesian2**

从参数 四维向量中读取 x y 分量并赋值给二维向量 result 对应的分量，并返回 result。



<br>

**fromElements(x,y,result): Cartesian2**

将参数 x y 坐标值赋值给二维向量 result 对应的分量，并返回 result。



<br>

**lerp(start,end,t,result): Cartesian2**

1. start、end: Cartesian2，一个开始向量，一个目标向量
2. t: Number，插值点。t 的合理取值范围应该是 0 - 1
3. result: 保存计算结果
4. 返回值：根据 start、end 计算出插值 t 对应的一个二维向量

计算出两个向量根据 插值 t 对应的向量位置。



<br>

**magnitude(cartesian): Number**

计算向量的长度(length)。

> 相当于 Vector2 的 .length()



<br>

**magnitudeSquared(cartesian): Number**

计算向量长度的平方值。



<br>

**maximumByComponent(first,second,result): Cartesian2**

将参数 first、second 中 x y 分量各取最大值，然后构成一个新的二维向量，赋值给 result，并返回 result。



<br>

**maximumComponent(cartesian): Number**

返回参数 cartesian 的分量 x y 中最大的那个值。



<br>

**minimumByComponent(first,second,result): Cartesian2**

将参数 first、second 中 x y 分量各取最小值，然后构成一个新的二维向量，赋值给 result，并返回 result。



<br>

**minimumComponent(cartesian): Number**

返回参数 cartesian 的分量 x y 中最小的那个值。



<br>

**mostOrthogonalAxis(cartesian,result): Cartesian2**

返回与参数 cartesian 最正交的轴(已归一化的向量)。其结果要么是 X 轴 (1,0)，要么是 Y 轴 (0,1)。

> 所谓 最正交的轴，你暂时可以理解为 参数 cartesian 距离哪个轴更远。
>
> 注意：如果距离 2 个轴相等，那么会被认定为 X 轴。



<br>

**multiplyByScalar(cartesian,scalar,result): Cartesian2**

将二维向量 cartesian 各个分量都乘以 标量 scalar，把结果赋值给 result，并返回 result。



<br>

**multiplyComponents(left,right,result): Cartesian2**

将二维向量 left 和 right 的各个分量进行相乘，把结果赋值给 result，并返回 result。



<br>

**negate(cartesian,result): Cartesian2**

将参数 cartesian 各个分量进行取反。即 x = -x，y = -y。



<br>

**normalize(cartesian,result): Cartesian2**

将参数 cartesian 进行归一化。



<br>

**pack(value,array,startingIndex): `Array.<Number>`**

1. value: Cartesian2，二维向量
2. array: `Array.<Number>`，外部一个数组
3. startingIndex: Number，可选值，默认值为 0，赋值数组元素索引的偏移量
4. 返回值：返回修改后的数组

将参数二维向量 value 的分量 x y 按照索引偏移量 startingIndex 赋值给 array。



<br>

**packArray(array,result): `Array.<Number>`**

1. array: `Array.<Cartesian2>`，一个包含 N 个二维向量的数组
2. result: `Array.<Number>`，长度为 偶数 的数组，数组中的元素均为 二维向量的分量 x y
3. 返回值：返回 result

将一组二维向量的分量展开为一个数组。



<br>

**subtract(left,right,result): Cartesian2**

计算并返回二维向量 left 与 right 的分量差。



<br>

**unpack(array,startingIndex,result): Cartesian2**

1. array: `Array.<Number>`，一个包含众多数字的数组
2. startingIndex: Number，索引偏移量，默认值为 0
3. result:  Cartesian2，保存计算结果
4. 返回值：返回 result

从数组 array 中根据索引偏移量 startingIndex 读取并将值赋值给 result 的分量 x y ，并返回 result。



<br>

**unpackArray(array,result): `Array.<Cartesian2>`**

1. array: `Array.<Number>`，要解包的数组
2. result: `Array.<Cartesian2>`，保存计算结果
3. 返回值：返回 result

将数组 array 按照 2 个元素一组，分别创建一个二维向量，并依次将这些向量存入 result 中，并返回 result。



<br>

### 三维向量：Cartesian3

**三维向量的 3 个属性：**

1. x
2. y
3. z



<br>

二维向量 Cartesian2 的方法同样 三维向量 Cartesian3 也都拥有。

> 除了 Cartesian2 的 .fromCartesian3()

这里就不再过多陈述，接下来只讲解一下三维向量特有的一些方法。

以下方法均为 Cartesian3 类的静态方法。



<br>

**fromDegress(longitude,latitude,height,ellipsoid,result): Cartesian3**

1. longitude: Number，经度，例如 -115.0
2. latiude: Number，纬度，例如 37.0
3. height: Number，可选参数，椭球上方的高度，默认值为 0
4. ellipsoid: Ellipsiod，可选参数，椭球，默认为 Ellipsoid.WGS84
5. result: Cartesian3，可选参数，保存计算结果
6. 返回值：3维坐标

从经度、纬度、高度、椭球得到对应的三维点坐标。



<br>

**fromDegressArray(coordinates,ellipsoid,result): `Array.<Cartesian3>`**

1. coordinates: `Array.<Number>`，由 N 个经纬度数值组成的数组。

   > 该数组长度一定是 偶数，因为在该数组内部都是由 1 对 经度 + 纬度 组成。

   > 这里其实暗含了一个意思：已知经纬度，同时假定 高度(height) 为 0

2. ellipsoid: Ellipsoid，可选参数，椭球标准，默认值为 Ellipsoid.WGS84。

3. result: `Array.<Cartesian3>`，保存计算结果

从给定的展开的经纬度数值组成的数组中，转换得到一组 三维坐标。



<br>

**fromDegreesArrayHeights(coordinates,ellipsoid,result): `Array.<Cartesian3>`**

和 fromDegreesArray() 用法相同，只不过这次参数 coordinates 中除经纬度外，还包含高度(height)。

> 因此 coordinates 数组长度一定为 3 的倍数。



<br>

**fromElements(x,y,z,result): Cartesian3**

1. x、y、z: Number，三个分量
2. result: Cartesian3，可选参数，保存计算结果

根据 x y z 三个分量创建一个三维坐标。



<br>

**fromRadians(longitude,latitude,height,ellipsoid,result): Cartesian3**

1. longitude: Number，以弧度为单位的经度，例如 -2.007
2. latitude: Number，以弧度为单位的纬度，例如 0.645

从给出的经纬度、高度、椭球计算出对应的三维坐标。



<br>

**fromRadiansArray(coordinates,ellipsoid,result): `Array.<Cartesian3>`**

1. coordinates: `Array.<Number>`，N 组 经度 + 纬度 数值组成的数组
2. ellipsoid: Ellipsoid，椭球，默认为 Ellipsoid.WGS84
3. result: `Array.<Cartesian3>`

根据给定的数组(经度 + 纬度)，返回对应的 三维坐标构成的数组。



<br>

**fromRadiansArrayHeight(coordinates,ellipsoid,result): `Array.<Cartesian3>`**

根据给定的数组(经度 + 纬度 + 高度)，返回对应的 三维坐标构成的数组。



<br>

**强调一遍：degrees 和 radians**

这两种都用来表示 经纬度，只是他们表达角度的方式不同。

1. degrees：使用 度 来表示角度
2. radians：使用 弧度 来表示角度



<br>

**fromSpherical(spherical,result): Cartesian3**

1. spherical: Spherical，球极坐标
2. result: Cartesian3，保存计算结果

将球坐标转换为笛卡尔三维坐标。



<br>

**midpoint(left,right,result): Cartesian3**

计算两个三维坐标之间的中点对应的坐标。



<br>

**projectVector(a,b,result): Cartesian3**

1. a: Cartesian3，需要投影的向量
2. b: Cartesian3，要投影到的向量
3. result: Cartesian3，保存计算结果

返回将向量 a 投影到向量 b 的结果。



<br>

### 四维向量：Cartesian4

**Cartesian4 是由：x y z w 4 个分量构成的。**



<br>

和 Cartesian2、Cartesian3 方法名相同，用法也相同的方法这里不再重复叙述。

以下只讲解 Cartesian4 特有的一些方法。

同样，以下的方法都是指 Cartesian4 类静态的方法。



<br>

**fromColor(color,result): Cartesian4**

1. color: Color，包含 red、green、blue、apha 4 个分量的颜色实例
2. result: Cartesian4，保存计算结果

将 color 的 4 个分量依次赋值给 result 的 4 个分量 x y z w，并返回 result。



<br>

**packFlot(value,result): Cartesian4**

1. value: Number，浮点数
2. result: Cartesian4，包含压缩浮点数的四维坐标

将任意浮点数(32位)打包(拆分转化)为 4 个 uint8 的数值，然后将 4 个数值依次赋值给 result。

> uint8，即无符号的整数，即包含 0 的正整数。

```
const cartesian4 = new Cesium.Cartesian4();
Cartesian4.packFloat(1, cartesian4);
console.log(cartesian4; //Cartesian4 {x: 0, y: 0, z: 128, w: 63}
```

> 具体转化过程，以及该方法的用途，暂时我个人也不是特别理解。



<br>

### 球极坐标：Spherical

在 Cesium.js 中将 Spherical 定义为：曲线 3 纬坐标。

在 Three.js 中将 Spherical 定义为：球坐标(球极坐标)。

相对于使用 (x,y,z) 来表达一个 笛卡尔 3 位坐标，球坐标也使用 3 个分量来表示球上某个坐标。

1. clock: Number，从 x 轴的正向 和 y 轴的正向的角度，也就是 x y 轴构成的平面中的角坐标。

   > “从 x 轴的正向 和 y 轴的正向的角度” 实际上就是 “绕 z 轴”
   >
   > 在 Cesium.js 中使用 clock(时钟) 这个单词，但是在 Three.js 中使用 .phi。

2. cone: Number，从正 z 轴向负 z 轴的角坐标。

   > 在 Cesium.js  中使用 cone(圆锥) 这个单词，但是在 Three.js 中使用 .theta。
   >
   > “从正 z 轴到负 z 轴” 实际上就是 “绕  y 轴”

3. magnitude: Number，从 原点到目标位置的距离

   > “原点到目标位置的距离” 实际上就是 “球的半径”
   >
   > 在 Cesium.js 中使用 magnitude(幅度)，这个单词，但是在 Three.js 中使用 .radius。



<br>

**Spherical 的 3 个属性默认值：**

1. clock 为 0
2. cone 为 0
3. magnitude 为 1



<br>

以下为 Spherical 类的静态方法。



<br>

**clone(spherical,result): Spherical**

返回一份克隆的球坐标。



<br>

**equals(left,right): Boolean**

对比 2 个球坐标各个分量是否相同。



<br>

**equalsEpsilon(left,right,epsilon): Boolean**

判断 2 个球坐标是否在误差 epsilon 范围内。



<br>

**fromCartesian3(cartesian3,result): Spherical**

将笛卡尔 3 维坐标转换为 球坐标。



<br>

**normalize(spherical,result): Spherical**

将球坐标进行归一化。

请注意，所谓的 “球坐标归一化” 实际上仅仅是将球坐标的半径设置为 1。

即：

```
spherical.magnitude = 1
```



<br>

以下为 Spherical 实例的方法，他们的用法和 类的静态方法几乎相同。

1. clone(result): Spherical
2. equals(other): Boolean
3. equalsEpsion(other,epsilon): Boolean



<br>

**toString(): String**

将当前球坐标按照 "`(clock,cone,magnitude)`" 格式转化为字符串。



<br>

### 地理坐标：Cartographic

**Cartographic：地球(椭球)地理坐标，是由 3 个分量构成，经度、纬度和高度。**

<br>

**特别强调：地理坐标与球坐标的差异**

1. 球坐标(Spherical) 是建立在一个标准、正圆的球体之上。
2. 地球坐标(Cartographic) 是建立在一个椭圆(非标准，非正圆) 的球体之上。



<br>

**球坐标的 3 个分量属性：**

1. longitude: Number，经度(以弧度为单位)，默认值为 0
2. latitude: Number，纬度(以弧度为单位)，默认值为 0
3. height: Number，高度(以米为单位)，默认值为 0



<br>

**Cartographic 类的静态属性：ZERO**

即一个地理坐标，该坐标经度、纬度和高度都为 0，即 (0,0,0)。



<br>

以下为 Cartographic 的类静态方法。



<br>

Cartographic 的以下几个方法用法和其他类非常相似，不过多叙述。

1. clone(cartographic,result): Cartographic
2. equals(left,right): Boolean
3. equalsEpsilon(left,right,epsilon): Boolean



<br>

**fromCartesian(cartesian,ellipsoid,result): Cartographic**

1. cartesian: Cartesian3，要转换的三维坐标
2. ellipsoid: Ellipsoid，椭球，默认为 Ellipsoid.WGS84。
3. result: Cartographic，保存计算结果

将一个 笛卡尔三维坐标 转换为 地理坐标。



<br>

**fromDegress(longitude,latitude,height,result): Cartographic**

1. longitude: Number，经度(以度为单位)
2. latitude: Number，纬度(以度为单位)
3. result: Cartographic，保存计算结果

根据以度为单位的 经纬度，以及高度，创建并返回一个 地理坐标。



<br>

**fromRadians(longitude,latitude,height,result): Cartographic**

1. longitude: Number，经度(以弧度为单位)
2. latitude: Number，纬度(以弧度为单位)
3. result: Cartographic，保存计算结果

根据以弧度为单位的 经纬度，以及高度，创建并返回一个 地理坐标。



<br>

**补充说明：为什么有时不直接 new Cartographic()，而是会选择使用类静态函数 fromRadians() ？**

答：为了节省内存，提高性能。

因为在有一些 循环 代码中，当我们要循环操作很多次 时，如果每次都使用 new Cartographic() 难免造成性能上的开销。而如果我们只创建一个地理坐标对象的变量，然后每次循环时都将该变量作为参数 result 传递给 fromRadians()，那么这样肯定可以减少因为创建而产生的内存。

**这也是为什么 Cesium.js 很多方法的参数都会有 result 这个存在的原因。**

> 实际中 Three.js 中也是这样做的。



<br>

**toCartesian(cartographic,ellipsoid,result): Cartesian3**

根据参数中提供的地理坐标(经度、纬度、高度)，以及参数中提供的 椭球标准，创建并返回一个相对应的地理坐标。



<br>

### 一些常见的坐标获取或转换

<br>

**获取鼠标点击屏幕画布中的位置：**

实际上就是指 鼠标事件 的位置：

```
const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
handler.setInputAction((event) =>{
    const mousePosition = event.position
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)
```

> ScreenSpaceEventHandler 这个类我们稍后就会学习到。



<br>

**将屏幕坐标转化为笛卡尔空间直角坐标：**

```
//mousePosition 为鼠标点击对应的屏幕位置

//三维模式下
const ray = viewer.camera.getPickRay(mousePosition)
const cartesian = viewer.scene.globe.pick(ray,viewer.scene)

//二维模式下
const cartesian = viewer.camera.pickEllipsoid(position,scene.globe.ellipsoid)
```



<br>

**将笛卡尔控制直角坐标转化为屏幕坐标：**

```
const pick = Cesium.SceneTransforms.wgs81ToWindowCoordiantes(viewer.scene, cartesian)
```



<br>

**将笛卡尔空间直角坐标转换为地理坐标：**

```
const cartographic = Cesium.Cartographic.fromCartesian(cartesian)
```



<br>

**将地理坐标转换为笛卡尔空间直角坐标：**

```
const cartesian3 = Cesium.Cartesian3.fromRadians(longitude,latitude,height)
```



<br>

**弧度与度之间的转换：**

```
const degrees = Cesium.Math.toDegress(radians)
//等同于 const degrees = radians * 180 / Math.PI 

const radians = Cesium.Math.toRadians(degrees)
//等同于 const radians = (degrees / 180) * Math.PI
```



<br>

## 鼠标交互事件处理函数：ScreenSpaceEventHandler

我们知道，在创建 Cesium 程序时，实际上最初我们只有一个名为 "cesiumElement" 的 Div 元素。

后续创建过程中由 Cesium 帮我们完成，所以当我们想要和 Cesium 程序交互时，实际上脱离不了 Cesium 的控制，无法做到直接、单独地交互。

Cesium.js 为我们提供了添加常见的用户鼠标事件处理函数的办法：ScreenSpaceEventHandler。



<br>

**ScreenSpaceEventHandler的初始化：**

```
new Cesium.ScreenSpaceEventHandler(element:HTMLCanvasElement)
```



<br>

### ScreenSpaceEventHandler的属性

只有 2 个类的静态属性：

1. mouseEmulationIgnoreMilliseconds: Number

   在接收到任何触摸事件后禁用鼠标事件的时间量(以毫秒为单位)，以便忽略任何模拟鼠标事件。

   默认为 800 毫秒。

2. touchHoldDelayMilliseconds: Number

   在屏幕上的触碰触发触摸的时间量(以毫秒为单位)。

   默认为 1500 毫秒。



<br>

### ScreenSpaceEventHandler的方法

**destory()**

删除此对象所添加的全部侦听。

一旦执行了此方法， 那么就不该再调用该实例的其他方法了，除了 .isDestroyed()。



<br>

**getInputAction(type,modifier): function**

1. type: Number，交互事件的类型
2. modifier: Number，可选参数，发生类型事件时，摁下的 KeyboardEventModifier 键。
3. function: 返回该事件对应的处理函数

根据交互事件类型、当时按下的键盘键(可选参数) 来返回对应的处理函数。

如果之前从未添加过这样的事件处理函数，那么会返回 undefined。



<br>

**isDestoryed(): Boolean**

返回该实例是否已经被销毁。



<br>

**removeInputAction(type,modifier)**

取消(删除)在对应操作事件上的处理函数。



<br>

**setInputAction(action,type,modifier)**

添加在对应操作事件上的处理函数。



<br>

### 鼠标事件类型对应的内置常量：ScreenSpaceEventType

这里提到的 "交互事件" 类型，就是上面 setInputAction()、removeInputAction() 参数中的 type。

他们全部都是由 Cesium.js 内部定义好的常量。

| 常量名            | 对应数值 | 对应交互操作               |
| ----------------- | -------- | -------------------------- |
| LEFT_DOWN         | 0        | 鼠标左键摁下               |
| LEFT_UP           | 1        | 鼠标左键松开               |
| LEFT_CLICKE       | 2        | 鼠标左键单击               |
| LEFT_DOUBLE_CLICK | 3        | 鼠标左键双击               |
| RIGHT_DOWN        | 5        | 鼠标右键摁下               |
| RIGHT_UP          | 6        | 鼠标右键松开               |
| RIGHT_CLICK       | 7        | 鼠标右键单击               |
| MIDDLE_MOWN       | 10       | 鼠标中键摁下               |
| MIDDLE_UP         | 11       | 鼠标中键松开               |
| MIDDLE_CLICKE     | 12       | 鼠标中键单击               |
| MOUSE_MOVE        | 15       | 鼠标移动                   |
| WHEEL             | 16       | 鼠标滚轴滚动               |
| PINCH_START       | 17       | 触摸开始(仅支持二指)       |
| PINCH_END         | 18       | 触摸结束(仅支持二指)       |
| PINCH_MOVE        | 19       | 触摸移动和变化(仅支持二指) |



<br>

**你是否疑惑：为什么没有 4、8、9 ？**

带着疑惑我查看了 ScreenSpaceEventType.js 的历史记录，发现 2012 年第一个版本时就是这样定义的，当时就没有 4 8 9。

我已在 Cesium 官方论坛上发布了帖子，希望有人能知道这背后的原因。

https://community.cesium.com/t/i-am-more-curious-why-there-is-no-4-8-9-in-screenspaceeventtype/15058

<br>

我大胆猜测一下，会不会这 3 个数字其实是给某些交互操作预留的？

* 4: RIGHT_DOUBLE_CLICK
* 8: MIDDLE_DOWN
* 9: MIDDLE_DOUBLE_CLICK



<br>

## 实体和实体集合：Entity

将多个、多种形式的实体(Entity)实例聚集到单个高级对象中，这个高级对象就是所有实体的集合，即 Viewer.entities。

还有一种情况，就是将这些实体放入 数据源 中，例如 CzmlDataSource 和 GeoJsonDataSource。



<br>

**补充说明：**

你可以把 Entity 理解成 Three.js 中的 Object3D 或 Group。

即它本身可以是一个实体对象，同时也可以包含若干个其他实体。

> 它是其包含的子项示例的父类。



<br>

### 实体集合的初始化配置项

| 配置项                                                       | 对应内容                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| id: String                                                   | 唯一标识符。<br />如果未提供则将由Cesium.js通过 GUID 自动生成。 |
| name: String                                                 | 显示给用户的可读名字。它不必是唯一的。                       |
| availability: TimeIntervalCollection                         | 与此对象相关联的可用性(如果有)                               |
| show: Boolean                                                | 是否显示该实体及其子项                                       |
| description: Property \| String                              | 用于该实体对应 HTML 的描述文字                               |
| position: PositionProperty \| Cartesian3                     | 指定实体的位置                                               |
| orientation: Property                                        | 指定实体的方向                                               |
| viewFrom: Property                                           | 用于查看该实体的建议初始偏移量                               |
| parent: Entity                                               | 此实体的父级实体                                             |
| billboard: BillboardGraphic \| BillboardGraphics.ConstructorOptions | 与此实体关联的广告牌<br />所谓 “广告牌” 其实就是指 一张“图片” |
| box: BoxGraphics \| BoxGraphics.ConstructorOptions           | 与此实体关联的框                                             |
| corridor: CorridorGraphics \| CorridorGraphics.ConstructorOptions | 与此实体关联的走廊                                           |
| cylinder: CylinderGraphics \| CylinderGraphics.ConstructorOptions | 与此实体关联的圆柱体                                         |
| ellipse: EllipseGraphics \| EllipseGraphics.ConstructorOptions | 与此实体关联的椭圆                                           |
| ellipsoid: EllipsoidGraphics \| EllipsoidGraphics.ConstructorOptions | 与此实体关联的椭球                                           |
| label: LabelGraphics \| LabelGraphics.ConstructorOptions     | 与此实体关联的文字标签(label)<br />请注意：label 表示纯文字，与之对应的就是 图片(广告牌 billboard) |
| model: ModelGraphics \| ModelGraphics.ConstructorOptions     | 与此实体关联的模型                                           |
| tileset: Cesium3DTilesetGraphics \| Cesium3DTilesetGraphics.ConstructorOptions | 与此实体关联的 3D 瓦片图块                                   |
| path: PathGraphics \| PathGraphics.ConstructorOptions        | 与此实体关联的路径                                           |
| plane: PlaneGraphics \| PlaneGraphics.ConstructorOptions     | 与此实体关联的平面                                           |
| point: PointGraphics \| PointGraphics.ConstructorOptions     | 与此实体关联的点                                             |
| polygon: PolygonGraphics \| PolygonGraphics.ConstructorOptions | 与此实体关联的多边形                                         |
| polyline: PolylineGraphics \| PolylineGraphics.ConstructorOptions | 与此实体关联的折线                                           |
| properties: PropertyBag \| `Object.<String>`                 | 与此实体关联的任意属性                                       |
| polylineVolume: PolylineVolumeGraphics \| PolylineVolumeGraphics.ConstructorOptions | 与此实体关联的 折线体积和相应的二维形状                      |
| rectangle: RectangleGraphics \| RectangleGraphics.ConstructorOptions | 与此实体关联的矩形                                           |
| wall: WallGraphics \| WallGraphics.ConstructorOptions        | 与此实体关联的墙                                             |

> 从上面众多配置项量中可以看出，绝大多数都是关联 某种 类型的实体(形状)。
>
> 从字面上可以看出 BoxGraphics、CorridorGraphics... 这些都是具体的 Cesium.js 内置提供的图元。
>
> 尽管本文还未提及过 Graphics 以及它众多的子类，但是由于我有 Three.js 基础，所以比较容易理解这些不同类型的 图元。

<br>

对于关联某种实体，从配置项也可以看出分别有 2 种方式：

1. 实体本身，例如 BoxGraphics
2. 可以创建实体的实体配置项，例如 BoxGraphics.ConstructorOptions



<br>

### Entity的属性

实体配置项的各项，均对应有相应的属性，且默认这些相关的实体均为 undefined。

除了这些，Entity 还有一些其他属性。



<br>

**isShowing: Boolean**

返回该实体是否为显示状态。

请注意，show 与 isShowing 的区别：

1. show 仅获取当前实体本身状态为是否显示
2. isShowing 不仅获取当前实体本身是否显示的状态，还会检查该实体父级实体是否为显示状态

也就是说可能存在以下情况：

当前实体是 可显示状态，即 show 为 ture，但是由于其父级实体是不显示状态，所以实际上该实体并没有显示。即 .isShowing 为 false。



<br>

**类静态属性：definitionChanged: Event**

获取每当属性或者子属性发生更改或修改时引发的事件。



<br>

**关于属性 properties: PropertyBag | undefined 的补充：**

假设你需要很多自定义属性，这些属性是 Entity 原本不存在的，那么可以将这些自定义属性都添加到 properties 中。具体如何添加，如何读取，可以参考 PropertyBag 的用法。



<br>

**PropertyBag的介绍：**

PropertyBag 是用于存储自定义属性的类，内部使用值键对形式进行存储。

<br>

**PropertyBag的属性：**

1. propertyNames: `Array.<String>`，当前实例中所有的 自定义属性的键名。
2. definitionChanged: Event，类静态属性，当此实例中属性发生变化时引发的事件。
3. isConstant: Boolean，类静态属性，指示此实例是否恒定不变。



<br>

**PropertyBag的方法：**

1. addProperty(propertyName,value,createPropertyCallback)，向此实例添加某属性(字段)

2. removeProperty(propertyName)，向此实例移除某属性

3. hasProperty(propertyName): Boolean，检查并返回此实例是否存在某属性

4. getValue(time,result): Object，获取此实例中的某属性对应的值

   > 请注意参数并不是 属性名，而是 time(JulianDate)。
   >
   > 具体用法可查看 JulianDate。
   >
   > julian：是一个人名，中文一般翻译为 朱利安
   >
   > JulianData：表示天文 朱利安日期(天数)，即表示公元前 4713 年中午以来到此刻的天数。
   >
   > 获取实例某属性值的示例代码：
   >
   > ```
   > console.log(property.getValue(new Cesium.JulianDate()));
   > ```

5. merge(source,createPropertyCallback)，将此实例与参数中的 source(PropertyBag) 进行合并。

   > 请注意，假设此实例与参数 source 中有一个自定义属性名相同，那么这种情况下是不会进行替换的。
   >
   > 可以通过以下示例代码说明：
   >
   > ```
   > const property1 = new Cesium.PropertyBag();
   > property1.addProperty('test', '111'); //有一个自定义属性 test
   > const property2 = new Cesium.PropertyBag();
   > property2.addProperty('test', '222'); //也有一个自定义属性 test
   > property1.merge(property2);
   > console.log(property1['test']); //查看 test 字段是否会被更改
   > console.log(property1.getValue(new Cesium.JulianDate())); //{test: "111"}
   > 
   > //输出的内容为：
   > ConstantProperty {_value: "111", _hasClone: false, _hasEquals: false, _definitionChanged: Event}
   > //可以看出 test 属性值并未被覆盖
   > ```



<br>

至此，本文我们已经：

1. 配置 react + typescript + cesium.js 项目
2. 编写了基础的 hello cesium 示例
3. 了解了一些基础的 GIS 相关知识
4. 学习了 Cesium.js 一些基础底层的类：Viewer、CesiumWidget、Camera、TerrainProvider、ImageryProvider、ImageryLayer、Cartesian2、... Cartographic、ScreenSpaceEventHandler、Entity。



<br>

**我觉得 Cesium.js 基础的一些类已经了解的差不多，可以开始进入真正的实战阶段了。**

所谓实战阶段，就是由简单到深入，逐个实现 Cesium.js 常用场景。

本文至此结束，接下来，就请通过官方提供的示例去学习吧。

https://sandcastle.cesium.com/index.html



<br>

**加油，2021.08.30 ！**



<br>

> 以下更新于 2021.09.16

在实际 Cesium 代码编写过程中，我会把我认为一些比较重要的知识点整理出来。

欢迎阅读我写的这篇文章：[Cesium.js的若干问题与答案.md](https://github.com/puxiao/notes/blob/master/Cesium.js的若干问题与答案.md)

