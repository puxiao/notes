# Electron基础入门



## Electron 简介

Electron 是 Github 开源的跨平台桌面应用开发工具，使用 Web 技术( HTML5 + JS + CSS3) 开发桌面应用。

1. Electron 本身是基于 C++ 开发的
2. GUI 核心是 Chrome
3. JS  引擎是 V8 (Nodejs)



Electron优点：学习成本、开发成本低——只需要会传统的 Web 开发即可。

Electron缺点：安装文件大、执行效率相对原生程序效率低



Electron 官网：https://www.electronjs.org/



<br>

## 快速创建Electron项目

> 下面执行命令中使用 yarn，如果你使用 npm 请将命令替换为 npm 对应命令



可以使用官方提供的模板：

```
git clone https://github.com/electron/electron-quick-start
cd electron-quick-start
yarn install
yarn start
```



<br>

Electron 官方提供了好几个不同框架或库的继承模板：



**使用 TypeScript：**

```
git clone https://github.com/electron/electron-quick-start-typescript
```



<br>

**使用 Vue：**

```
npm install -g vue-cli
vue init simulatedgreg/electron-vue my-project

cd my-project
yarn # or npm install
yarn run dev # or npm run dev
```



<br>

**使用React：**

```
git clone --depth 1 --single-branch https://github.com/electron-react-boilerplate/electron-react-boilerplate.git your-project-name
```

> 注意：该模板中使用的 react 版本为 16.8，并且不自带 TypeScript



<br>



**更多工具和模板：**

https://github.com/sindresorhus/awesome-electron



<br>

## Electron帮助文档



详细的 API 和官方使用指南，请查阅：

https://www.electronjs.org/docs



