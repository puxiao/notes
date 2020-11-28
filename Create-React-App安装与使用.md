# Create-React-App安装与使用

> 上面注释的代码为 npm 安装，实际使用的使用 yarn 安装



## 全局安装Create-React-App

```
//npm i -g create-react-app
yarn global add create-react-app
```

> 目前最新版本为 4.0.0



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
//npm i node-sass@4.14.1 --save-dev

//sass最新版本为 5.0.0
//但是由于 create-react-app 4.0.0 中的 sass-loader 目前不支持 sass 5，所以只能先安装 sass 4
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



## 安装echart模块

```
//npm i echarts @types/echarts --save
yarn add echarts @types/echarts --save
```

