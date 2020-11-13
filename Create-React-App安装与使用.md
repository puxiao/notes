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
    ...
    "noUnusedLocals": true, //有未使用的变量，则报错
    "noUnusedParameters": true, //有未使用的参数，则报错
    "sourceMap": true, //测试开发阶段，为了快速定位错误建议设置为 true，待到正式发布时修改为 false
    "removeComments": false, //删除注释，待到正式发布时修改为 true
  }
}
```



**特别说明：**

目前 create-react-app 4.0.0 版本中，tsconfig.json 是无法配置 alias 的，配置就会报错。因为 create-react-app 默认使用的是 react 17.0.1，在 react 17 版本中，对 jsx 提供了新的转化方式，目前的 typescript 4.0.5 依然无法支持 react 17。

根据 TS 官方通告，**在即将发布的 typescript 4.1 版本中会添加对 react 17 的支持**。

如果 TS 4.1 正式发布，那么可以向 tsconfig.json 中添加以下内容，实现 alias。

```
"baseUrl": "./src", //源代码目录，这里设置是为了给 paths 使用
"paths": {
  "@/components/*": ["components/*"]
}
```

> 特别提示：在官方预告的 TS 4.1 中，tsconfig.json 中 可以设置 "jsx":"react-jsx"，只有设置该属性后才会支持  React 17。



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



## 添加Scss/Sass支持

```
//npm i node-sass@4.14.1 --save-dev

//sass最新版本为 5.0.0
//但是由于 create-react-app 4.0.0 中的 sass-loader 目前不支持 sass 5，所以只能先安装 sass 4
yarn add node-sass@4.14.1 --dev
```



## 安装echart模块

```
//npm i echarts @types/echarts --save
yarn add echarts @types/echarts --save
```

