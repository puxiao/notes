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

## 运行Electron

假设我们希望使用 Electron  运行某个 js 文件，命令为：

```
electron xxx.js
```



<br>

#### 解决中文字符串乱码问题

假设我们在 xxx.js 中添加有输出 console.log(xxx)。

如果输出内容中有中文，由于 windows 的 CMD 环境中 默认编码为 936(GBK编码)，而我们的 xxx.js 中采用的是 65001(UTF-8) 编码。

所以我们需要先将当前命令环境的编码进行修改：

```
chcp 65001
```

这样再去执行 `electron xxx.js` 中文就不会出现乱码了。



<br>

为了方便，我们可以直接给 package.json 中添加命令：

```
"scripts": {
    "electron": "chcp 65001 && electron xxx.js"
}
```



<br>

补充：查看当前 CMD 环境中的字符编码命令为：

```
chcp
```



<br>

## Electron帮助文档



详细的 API 和官方使用指南，请查阅：

https://www.electronjs.org/docs



<br>

## Electron代码提示

由于 electron NPM 包中自带 electron.d.ts，所以只要执行：yarn add --dev electron 即可获取 typescript 代码提示。

特别说明：由于安装命令中包含 --dev 参数，所以正式构建项目代码时 electron NPM 包中的代码并不会被打包进去。



<br>

## Electron安装失败的解决方式

在执行 `yarn add --dev electron@xx.x.x` 时，可能会遇到下面报错信息：

```
Output:
RequestError: connect ETIMEDOUT
...
```

这是因为 electron 那个 壳(二进制运行文件) 没有下载成功。



<br>

你可以尝试将 npm 源修改为 国内的淘宝 npm，但是我个人实际使用时，发现即使修改成 淘宝NPM源，也会存在安装失败的情况。

这里，我教大家一个 “手工安装” 的方式，来解决这个问题。



<br>

**纯手工安装electron的步骤：**

> 这里我们假定要安装的是 64 位操作系统下的 electron 13.0.0

1. 先按照正常流程安装：`yarn add --dev electron@13.0.0`

   当执行若干秒后，会收到刚才提到的报错 `RequestError: connect ETIMEDOUT`，但是请注意，此时 node_modules/electron 中是有内容的。

2. 访问 https://github.com/electron/electron/releases/tag/v13.0.0 ，找到 `electron-v13.0.0-win32-x64.zip` 并下载该文件

3. 将手工下载得到的 `electron-v13.0.0-win32-x64.zip` 文件拷贝到 node_modules/electron 中

4. 编辑 node_modules/electron/install.js 文件，将其中 `downloadArtifact` 相关代码都注释掉，因为此时我们不需要走下载流程了

5. 同时找到 `extractFile` 这个函数，在它下面添加一行代码：`extractFile('./electron-v13.0.0-win32-x64.zip')`

6. 在命令窗口，切换到 node_modules/electron 中，然后执行：`node install.js`

   > 注意：当执行完该命令后，并不会有任何信息输出

7. 至此，就完成了手工安装 electron 了
