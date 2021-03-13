# Create-React-App安装与使用

> 上面注释的代码为 npm 安装，实际使用的使用 yarn 安装



## 全局安装Create-React-App

```
//npm i -g create-react-app
yarn global add create-react-app
```



## 初始化普通React项目

```
//npx create-react-app test-react
//npm init react-app test-react
yarn create react-app test-rect
```



## 初始化React+TypeScript项目

```
//npx create-react-app test-react --template typescript
//npm init react-app test-react --template typescript
yarn create react-app test-rect --template typescript
```



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



## 添加Scss/Sass支持

```
//npm i node-sass --save-dev

yarn add node-sass --dev

//如果你的 create-react-app 版本不是最新的，那么你只能安装
yarn add node-sass@4.14.1 --dev
```



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



## 配置worker-loader

假设我们在 React + TypeScript 项目中需要使用 web worker，而 初始化 worker 代码如下：

```
const worker = new Worker('xx/xxx.js')
```

我们可以看到 worker 需要加载 xxx.js，假设这个 xxx.js 是由我们自己编写，那就会遇到以下情况：

1. 假设我们希望使用 ts 语法，也就是说我们创建的是 xxx.ts，那么还需要经过编译才可以转为 xxx.js，难道我们需要单独再新建一个项目专门用来编译 xxx.ts 吗？
2. 假设我们不采取新建项目策略，那么就只能不使用 typescript 语法，直接创建 xxx.js 的形式。

为了解决以上问题，最佳的解决方案就是使用 webpack 的插件 worker-loader。



#### 安装并配置 worker-loader

**第1步：安装**

```
yarn add worker-loader --dev
//npm i worker-loader --save-dev
```

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



**第4步：重启 VScode**

之所以强调重启 VSCode 就是为了确保刚才所作的  .eslintrc 配置一定生效



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



**补充说明：第三方库会被打包 2 次，会增大最终包的文件体积**

假设 index.tsx 和 worker.ts 都使用了某个第三方库，那么这个库的代码会被分别打包进去 2 次，会造成最终打包成包的文件体积比较大。

请一定记得这个隐患，暂时还未找到解决方案。

不过最简单的办法就是避免 index.tsx 和 worker.ts 都使用第三方库。

本人建议：如果使用 worker，那么就将运算转转移得彻底一些，只让 worker.ts 引用某个第三方库，index.tsx 不再引用这个第三方库。



## 安装echart模块

```
//npm i echarts @types/echarts --save
yarn add echarts @types/echarts
```



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
