# Create-React-App安装与使用

> 上面注释的代码为 npm 安装，实际使用的使用 yarn 安装



<br>

> 以下更新于 2021.12.18

**关于 Create-react-app 最新版本 5.0 的更新说明**

在写本文的时候，当时 create-react-app 版本还是 4.x，前几日(2021.12.15) create-react-app 发布了新版本 5.0。

从官方的更新日志中可以知道，create-react-app 5.0 的变动内容为：

1. 改用 webpack5 来编译

   > 终于可以使用 webpack5 了，这样很多 webpack4 遗留的一些编译问题都可以得到解决，尤其是对 swc 的支持度会更高。

2. 开始支持 Tailwind

3. 其他插件更新到最新版本，例如 Jest 27、ESlint 8、PostCSS 8

4. 编译速度、代码压缩 得到了提升

5. 不再支持 Node 12 以下版本

但是，尽管版本由 4.x 升级为 5.0，本文下面所讲解的知识点几乎没有任何需要修改调整的地方。

> 以上更新于 2021.12.18



<br>

## 全局安装Create-React-App

```
//npm i -g create-react-app
yarn global add create-react-app
```



<br>

## 初始化普通React项目

```
//npx create-react-app test-react
//npm init react-app test-react
yarn create react-app test-rect
```



<br>

## 初始化React+TypeScript项目

```
//npx create-react-app test-react --template typescript
//npm init react-app test-react --template typescript
yarn create react-app test-rect --template typescript
```



<br>

## 修改tsconfig.json配置

#### 建议在 tsconfig.json compilerOptions 中增加以下内容

```
{
  "compilerOptions": {
    "target": "es2017"，
    ...
    "noUnusedLocals": true, //有未使用的变量，则报错
    "noUnusedParameters": true, //有未使用的参数，则报错
    "sourceMap": true, //测试开发阶段，为了快速定位错误建议设置为 true，待到正式发布时修改为 false
    "removeComments": false, //删除注释，待到正式发布时修改为 true
  }
}
```



<br>

#### 关于 TypeScript 4 的一个补充说明

在 TS 4 的 tsconfig.json 文件中，将 strict 的默认值 由之前的 false 修改为 true。也就是说默认会开启严格模式，在严格模式下 无论 noImplicitAny 的值是 true 还是 false，如果代码中 TS 自动推断出有值为 any，就会报错：

```
元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{}"。
```

**在之前默认非严格模式下，以下代码是没有问题的：**

```
const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key] === undefined) {
            delete obj[key]
        }
    }
    return obj
}
```

**但是如果是 TS 4 的严格模式下，只有修改成以下代码后才可以：**

```
const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key as keyof typeof obj] === undefined) {
            delete obj[key as keyof typeof obj]
        }
    }
    return obj
}
```



<br>

## 修改发布后项目根目录

React 发布后，将项目上传到服务器，默认必须是网站根目录。

若实际中不是网站根目录，则需要修改 package.json 添加 homepage 字段，并将值设置为 "."

```
{
  "name": "test-threejs",
  "homepage": ".",
  ...
}
```

> 默认 package.json 中是没有 homepage 字段的，默认采用的是 "/"，即根目录。

<br>

## 构建并移动文件夹

假设在 react 项目中，当执行构建后希望将结果文件移动到其他地方，可以修改 package.json 中的配置：

> 例如将编译后的文件移动到 上级目录 xxx/xx 中

```
"scripts": {
    "build": "react-scripts build && (if exist \"../xxx/xx\" rd /s/q \"../xxx/xx\") && move ./build ../xxx/xx"
 }
```

1. `(if exist \"../xxx/xx\" rd /s/q \"../xxx/xx\")`：判断 xxx/xx 是否存在，若存在则执行删除。

   注意：一定要用括号包裹住。

   补充：`rd` 是 windows cmd 中的删除命令。

2. `move ./build ../xxx/xx"`：将刚才构建好的 ./build 目录移动并重命名到 ../xxx/xx



<br>

假设你十分确定上级目录中一定存在 xxx/xx 目录，那么你可以省略相关判断，直接将上述代码修改为：

```
"scripts": {
    "build": "react-scripts build && rd /s/q \"../xxx/xx\" && move ./build ../xxx/xx"
 }
```

> 此时不再需要括号了


<br>

## 添加Scss/Sass支持

```
//npm i node-sass --save-dev

yarn add node-sass@5.0.0 --dev

//目前最新版的 create-react-app 4.0.3 还不支持 node-sass@6.0.0，所以只能安装 5.0.0
//如果你的 create-react-app 版本不是最新的，那么你只能安装 node-sass@4.14.1
```

特别强调：

在安装 node-sass 之前，需要提前在电脑上安装 Python 3，否则会提示 node-sass 安装失败。

Python下载地址：https://www.python.org/downloads/

> 目前最新版本为 python 3.10



<br>

## 配置alias路径映射

由 create-react-app 创建的 react 项目，webpack 相关配置已经被封装在了内部，因此默认是无法直接获取并修改的。

那么如何配置 alias 呢？

**一般网上搜索到的，有以下 3 种实现途径：**

1. 添加 .env 文件，设置内容为 NODE_PATH=src
2. 通过执行 `npm eject`，反向编译出 webpack 配置文件，然后进行对应的 alias 配置
3. 使用 react-app-rewired 和 react-app-rewire-alias 来实现 alias

以上 3 种 各有利弊，相对而言，本人更加推荐使用第 3 种方式来实现 alias。那么接下来说一下第 3 种的实现步骤。

**第1步：安装对应模块**

```
//npm i --save-dev react-app-rewired react-app-rewire-alias
yarn add --dev react-app-rewired react-app-rewire-alias
```

**第2步：新建文件 tsconfig.paths.json**

在项目根目录，新建文件 tsconfig.paths.json，内容暂时设置为：

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

**第3步：新建文件 config-overrides.js**

在项目根目录，新建文件 config-overrides.js，内容为：

```
const { alias, configPaths } = require('react-app-rewire-alias')

module.exports = function override(config) {
  alias(configPaths('./tsconfig.paths.json'))(config)

  return config
}
```

**第4步：新建文件 global.d.ts**

注意：本步骤的目的是为了让 TS 忽略对 react-app-rewire-alias 和其他一些非常规格式文件的导入检查。

> 本步骤是可选的，不是必须的，你可以跳过本步骤。

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
declare module 'react-app-rewire-alias';
```

**第5步：修改 tsconfig.json 文件**

修改 tsconfig.json 文件，添加以下一行内容：

```
{
  "extends": "./tsconfig.paths.json",
  "compilerOptions": {
    ...
  }
}
```

> 请注意 extends 是和 compilerOptions 平级的。

**第6步：继续修改 tsconfig.json 文件**

将命令中 start、build、test 3 条命令中的 react-scripts 修改为 react-app-rewired

```
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
```

至此，alias 已经配置成功。

特别说明：以上操作步骤是假定你在 React 项目中使用了 TypeScript。

**若你没有使用 TypeScript，那么：**

1. 忽略第 4 步的操作
2. 第 5 步、第 6 步 中提到的 tsconfig.json 对应的是 jsconfig.json。 



<br>

## 配置ESLint

默认情况下，create-react-app 已经安装有 ESLint 和 ESLint 一些常见插件。

当我们需要修改 ESLint 默认配置规则时：

1. 在项目根目录创建 `.eslintrc` 的文件，并编写相应的 ESLint 配置
2. 在项目根目录创建 `.eslintignore` 的文件，并编写 ESLint 可以忽略的文件

关于 ESLint 的用法，请参考：[ESLint学习笔记.md](https://github.com/puxiao/notes/blob/master/ESLint%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)



<br>

**当我们在 React 中使用 TypeScript 的 as 语法时，ESLint 有可能会报错：**

```
Parsing error: Unexpected token, expected ","
```

**解决办法是向 .eslintrc 中添加：**

```
{
	"extends": ["react-app", "react-app/jest"],
}
```

> 尽管 package.json 中，create-react-app 已经自动添加有以下内容
>
> ```
> "eslintConfig": {
> "extends": [
> "react-app",
> "react-app/jest"
> ]
> },
> ```
>
> 但是依然需要我们再在 .eslintrc 中添加一次，这点究竟原因是为什么，暂时还没理解。



<br>

## 配置worker-loader

假设我们在 React + TypeScript 项目中需要使用 web worker，而 初始化 worker 代码如下：

```
const worker = new Worker('xx/xxx.js')
```

我们可以看到 worker 需要加载 xxx.js，假设这个 xxx.js 是由我们自己编写，那就会遇到以下情况：

1. 假设我们希望使用 ts 语法，也就是说我们创建的是 xxx.ts，那么还需要经过编译才可以转为 xxx.js，难道我们需要单独再新建一个项目专门用来编译 xxx.ts 吗？
2. 假设我们不采取新建项目策略，那么就只能不使用 typescript 语法，直接创建 xxx.js 的形式。

为了解决以上问题，最佳的解决方案就是使用 webpack 的插件 worker-loader。



<br>

#### 安装并配置 worker-loader

**第1步：安装**

```
yarn add worker-loader --dev
//npm i worker-loader --save-dev
```



<br>

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



<br>

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



<br>

**第4步：重启 VScode**

之所以强调重启 VSCode 就是为了确保刚才所作的  .eslintrc 配置一定生效



<br>

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



<br>

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



<br>

**补充说明：第三方库会被打包 2 次，会增大最终包的文件体积**

假设 index.tsx 和 worker.ts 都使用了某个第三方库，那么这个库的代码会被分别打包进去 2 次，会造成最终打包成包的文件体积比较大。

请一定记得这个隐患，暂时还未找到解决方案。

不过最简单的办法就是避免 index.tsx 和 worker.ts 都使用第三方库。

本人建议：如果使用 worker，那么就将运算转转移得彻底一些，只让 worker.ts 引用某个第三方库，index.tsx 不再引用这个第三方库。



<br>

## 安装jsdoc或typedoc

**jsdoc：**

假设我们使用的是 .js 来创建代码文件，在代码中使用 jsdoc 风格的注释，那么可以通过 jsdoc 来自动生成文档，同时也可以让 .js 拥有类似 .ts 一样的类型声明功能(代码提示、自动补全、代码检查)。

```
//npm i jsod --save-dev
yarn add jsdoc --dev
```

关于 jsdoc 的用法，请参考：[JSDoc的安装与使用.md](https://github.com/puxiao/notes/blob/master/JSDoc%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md)



<br>

**typedoc：**

假设我们使用的是 .ts 来创建代码文件，那么可以使用 typedoc 来自动为我们的代码添加 jsdoc风格的注释。

```
//npm i typedoc -g
yarn global add typedoc

//执行命令：typedoc xxx.ts
```

注意：上面代码中我们是将 typedoc 安装到了全局中，你也可以安装到项目中，只不过执行 typedoc 命令时需要使用 npx。

```
//npm i typedoc --save-dev
yarn add typedoc --dev

//执行命令：npx typedoc xxx.ts
```

补充：当前最新版本 typedoc 0.20.30 并不支持 React 17.0.1，所以是否安装 typedoc 需要慎重决定。



<br>

## 修改webpack配置

当我们使用 create-react-app 创建的 react 项目，默认情况下我们是无法更改内部的 webpack 配置的。

一般情况下我们也无需更改相关配置，但是对于有些特殊情况，就是需要修改或添加 webpack 配置规则时，那么以下 2 种方式。



<br>

**第 1 种：执行 eject，暴力还原**

creact-react-app 为我们提供了一个方法：

```
//package.json script: {"eject": "react-scripts eject"}
yarn eject
```

这样就可以将当前的 react 进行暴力还原，暴露出 webpack 配置项给我们，以便我们进行相应的配置修改。

但这种操作是不可逆的，也就是说当执行过 eject 之后就再也回不去了。



<br>

**第 2 种：安装 craco ，柔性配置**

craco 是一个第三方 NPM 包，可用于来给 creat-react-app 创建的 react 项目 修改 webpack 配置项。

不光针对 webpack 配置项，还可以针对 eslint、babel、scss 等等。



<br>

第1步：安装 craco

```
yarn add @craco/craco
```



<br>

第2步：在项目根目录，创建一个 craco.config.js 的文件，用来添加 webpack 规则。

具体  craco 对应的 webpack 配置方式，可查阅：https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration

> 请注意：craco 配置的规则 和 webpack 近似 但也有不同的地方。

请注意：**你可以把 craco.config.js 文件命名为：craco.config.ts、.cracorc.js 或 .cracorc，但是请不要在一个项目中同时出现 2 个配置文件**。

> 如果你使用的是 craco.config.ts，那么记得 遵循 typescript 语法规范，引入模块时使用 import 而不是 require。
>
> 按照 craco 官方的说法，craco.config.ts 的优先级要高于 craco.config.js。也就是说假设 2 个文件同时存在则会选择使用 craco.config.ts，而不是 craco.config.js。



<br>

第3步：修改 package.json 中的 scripts 命令，修改为 craco 开头：

```diff
"scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
},
```



<br>

至此，就实现了可以修改 webpack 规则的目的。



<br>

**思考一下：**

假设我们我们想使用 路径别名，比如我们安装使用了 react-app-rewired、react-app-rewire-alias，那么就需要将 package.json 中 scripts 的命令修改为：

```
"start": "react-app-rewired start"
```

那和

```
"start": "craco start"
```

冲突了怎么办？



<br>

#### Craco提供一站式解决方案

前面提到，craco 可以提供修改 webpack 的配置，同时 craco 也提供日常开发中，常见的其他各种配置项。

例如 style(css/sass)、eslint、babel、typescript、jest、devServer、plugins 等。



<br> 之前我们为了在项目中使用 alias，采取安装 react-app-rewired、react-app-rewire-alias，那么现在可以忘掉它俩，改用 webpack 所支持的 alias 配置项。



<br>

#### 使用 Craco 配置 alias

请注意，对于 webpack 的 alias 而言，alias 是写在 resolve 下面的：

```
const path = require('path');
module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/'),
    },
  },
};
```

但是对于 craco 来说，alias 是直接写在 webpack 下面的：

```
const path = require('path');
module.exports = {
    webpack: {
        alias: {
            "@/src": path.resolve(__dirname, "src/"),
            "@/src/components": path.resolve(__dirname, "src/components/")
        }
    }
}
```

> 提醒：不要在 别名 的名称结尾添加 斜杆 `/`，例如不要写成  "@/src/"，这样最终会找不到对应文件的。



<br>

**TypeScript对应的 path 配置**

假设你项目使用 TypeScript，记得也要针对 TS 进行 path 配置。

一共有 2 种形式：

1. 在 tsconfig.json 中引入 tsconfig.paths.json
2. 直接修改 tsconfig.json



<br>

第1种方式：引入

配置方法和使用 react-app-rewire-alias 相同：

1. 项目根目录创建 tsconfig.paths.json

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

2. tsconfig.json 顶部添加：

   ```
   {
       "extends": "./tsconfig.paths.json",
       "compilerOptions": {
       ...
       }
   }
   ```



<br>

第2种方式：

直接将 "paths" 标签添加到 tsconfig.json 中：

````
{
    "compilerOptions": {
        "paths": {
            "@/src/*": ["./src/*"],
            "@/components/*": ["./src/components/*"]
        }
    }
}
````

> 不需要添加 `"baseUrl": "."`



<br>

**webpack4问题遗留：**

若使用 webpack4，只能选择第 1 种引入方式。因为若使用第 2 种方式，不清楚为什么每次执行 yarn start 后，都会自动将 tsconfig.json 中的 paths 字段删除，导致找不到对应的文件，从而引发报错。不过这个问题在 webpack5 中并未出现。

也就是说：

1. 若使用 webpack4 则推荐使用 第 1 种引入的方式
2. 若使用 webpack5 则推荐使用 第 2 种直接修改的方式



<br>

#### 使用 Craco 配置 webpack

若想使用 craco 修改 webpack 的配置项，**需要将原本在 webpack.config.js 中定义的各项 移动到：craco.config.js 的 webpack.configure 中。**

如下图所示：

```
module.exports = {
    webpack: {
        configure: {
           ...
        }
    }
}
```



<br>

**举例：添加对 .txt 文件资源的加载**

我们知道对于自定义加载文件资源，对于 原生 webpack.config.js 来说，是修改其 module.rules 配置项，与之对应在 craco 中就应该是 webpack.configure.module.rules。

<br>

如果是 webpack4，那么首先需要先安装 raw-loader，然后配置如下：

```
module.exports = {
    webpack: {
        configure: {
            module: {
                rules: [
                    { test: /\.txt$/, use: "raw-loader" }
                ],
            }
        }
    }
}
```

如果是 webpack5，那么无需额外安装 raw-loader，因为它默认已经内置了 raw-loader。

它的配置方式采用 asset/source 来表明以源码内容形式来加载该文件资源。

```
module.exports = {
    webpack: {
        configure: {
            module: {
                rules: [
                    { test: /\.txt$/, type: "asset/source" }
                ],
            }
        }
    }
}
```

> 注：webpack5 种一共内置了 4 种文件资源加载解析方式
>
> 1. asset/resource：发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
> 2. asset/inline：导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
> 3. asset/source：导出资源的源代码。之前通过使用 `raw-loader` 实现。
> 4. asset：在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。
>
> 更加详细介绍可查阅：https://webpack.docschina.org/guides/asset-modules/#root



<br>

关于 webpack 的其他配置项，和上面这个类似。

**切记这些 webpack 配置项都是放在 configure 内，除了 alias 以外，因为 alias 是一个特例。**



<br>

**另外一种，更加高级复杂配置 webpack 的方式：使用回调函数来配置**

如果你需要对 webpack 进行很复杂的配置，上面那种简单直白的配置方式 `configure:{...}`已经满足不了你。那么你可以采用 `configure: (webpackConfig, { env, paths }) => { return webpackConfig; }` 这种形式。

简单举例：

```
const path = require('path');
module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.module.rules.push({
                    test: /\.js$/,
                    type: 'asset/source'
            })
            return webpackConfig
        }
    }
}
```

> 你可以在 configure 对应的回调函数中做更多逻辑判断、其他自定义配置。



<br>

**回顾一下 alias 和 webpack 配置**

他们在 craco 的配置结构如下：

```
const path = require('path');
module.exports = {
    webpack: {
        alias: {
            "@/src": path.resolve(__dirname, "src/")
        },
        configure: {
            module: {
                rules: [
                    { test: /\.txt$/, type: "asset/source" }
                ],
            }
        }
    }
}
```



<br>

**特别提醒：当你每次修改 craco.config.js 后，一定要重启 VSCode，以便确保配置生效。**



<br>

**使用 craco 忽略 cesium.js 的报错：**

> 特别强调：这个问题只会出现在 create-react-app 4.x 创建的项目中，若使用目前最新的 create-react-app 5.0 则不会遇到下面的问题。

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

...

你还可以使用  craco 去设置更多其他模块(例如 babel、eslint ...)的配置项。



<br>

**附：craco 支持的配置文件示例**

https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration

```
const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES } = require("@craco/craco");

module.exports = {
    reactScriptsVersion: "react-scripts" /* (default value) */,
    style: {
        modules: {
            localIdentName: ""
        },
        css: {
            loaderOptions: { /* Any css-loader configuration options: https://github.com/webpack-contrib/css-loader. */ },
            loaderOptions: (cssLoaderOptions, { env, paths }) => { return cssLoaderOptions; }
        },
        sass: {
            loaderOptions: { /* Any sass-loader configuration options: https://github.com/webpack-contrib/sass-loader. */ },
            loaderOptions: (sassLoaderOptions, { env, paths }) => { return sassLoaderOptions; }
        },
        postcss: {
            mode: "extends" /* (default value) */ || "file",
            plugins: [require('plugin-to-append')], // Additional plugins given in an array are appended to existing config.
            plugins: (plugins) => [require('plugin-to-prepend')].concat(plugins), // Or you may use the function variant.
            env: {
                autoprefixer: { /* Any autoprefixer options: https://github.com/postcss/autoprefixer#options */ },
                stage: 3, /* Any valid stages: https://cssdb.org/#staging-process. */
                features: { /* Any CSS features: https://preset-env.cssdb.org/features. */ }
            },
            loaderOptions: { /* Any postcss-loader configuration options: https://github.com/postcss/postcss-loader. */ },
            loaderOptions: (postcssLoaderOptions, { env, paths }) => { return postcssLoaderOptions; }
        }
    },
    eslint: {
        enable: true /* (default value) */,
        mode: "extends" /* (default value) */ || "file",
        configure: { /* Any eslint configuration options: https://eslint.org/docs/user-guide/configuring */ },
        configure: (eslintConfig, { env, paths }) => { return eslintConfig; },
        pluginOptions: { /* Any eslint plugin configuration options: https://github.com/webpack-contrib/eslint-webpack-plugin#options. */ },
        pluginOptions: (eslintOptions, { env, paths }) => { return eslintOptions; }
    },
    babel: {
        presets: [],
        plugins: [],
        loaderOptions: { /* Any babel-loader configuration options: https://github.com/babel/babel-loader. */ },
        loaderOptions: (babelLoaderOptions, { env, paths }) => { return babelLoaderOptions; }
    },
    typescript: {
        enableTypeChecking: true /* (default value)  */
    },
    webpack: {
        alias: {},
        plugins: {
            add: [], /* An array of plugins */ 
            remove: [],  /* An array of plugin constructor's names (i.e. "StyleLintPlugin", "ESLintWebpackPlugin" ) */ 
        },
        configure: { /* Any webpack configuration options: https://webpack.js.org/configuration */ },
        configure: (webpackConfig, { env, paths }) => { return webpackConfig; }
    },
    jest: {
        babel: {
            addPresets: true, /* (default value) */
            addPlugins: true  /* (default value) */
        },
        configure: { /* Any Jest configuration options: https://jestjs.io/docs/en/configuration. */ },
        configure: (jestConfig, { env, paths, resolve, rootDir }) => { return jestConfig; }
    },
    devServer: { /* Any devServer configuration options: https://webpack.js.org/configuration/dev-server/#devserver. */ },
    devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => { return devServerConfig; },
    plugins: [
        {
            plugin: {
                overrideCracoConfig: ({ cracoConfig, pluginOptions, context: { env, paths } }) => { return cracoConfig; },
                overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => { return webpackConfig; },
                overrideDevServerConfig: ({ devServerConfig, cracoConfig, pluginOptions, context: { env, paths, proxy, allowedHost } }) => { return devServerConfig; },
                overrideJestConfig: ({ jestConfig, cracoConfig, pluginOptions, context: { env, paths, resolve, rootDir } }) => { return jestConfig },
            },
            options: {}
        }
    ]
};
```
