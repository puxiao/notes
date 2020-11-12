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

**建议在 tsconfig.json compilerOptions 中增加以下内容：**

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



**特别说明：**目前 create-react-app 4.0.0 版本中，tsconfig.json 是无法配置 alias 的，配置就会报错。

```
"baseUrl": "./src", //源代码目录，这里设置是为了给 paths 使用
"paths": {
  "@/components/*": ["components/*"]
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

