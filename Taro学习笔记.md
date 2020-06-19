# Taro学习笔记

## 安装和初始化项目

#### 安装

taro当前稳定版本为2.2.1，内测版为3.0。

安装稳定版：

````
npm i -g @tarojs/cli
````

安装内测开发版：

````
npm i -g @tarojs/cli@next
````

> 以下内容均以安装内测开发版为讲解基础，并使用 React 和 TypeScrip。

#### 初始化项目

进入准备存放 taro 项目的上级目录，例如 f:\taro\，然后执行

````
taro init hello-taro //不要使用helloTaro，因为react项目目录不支持驼峰命名
````

就会在 f:\taro\下创建 hello-taro 目录，存放本次初始化的项目代码。

在终端安装过程中，会有若干询问配置项目步骤。通过摁键盘上下箭头或回车键进行选择和确认。

> taro默认会按照 yarn>cnpm>npm 的顺序来检测安装。
>
> 当全局安装有cnpm时，使用taro初始化项目，共37,162 个文件
>
> 当卸载cnpm后，再次使用taro初始化项目，共39,339 个文件
>
> 两者明显有差距，为了安全保险期间，还是卸载 cnpm

#### 微信小程序配置注意事项

若使用微信开发者工具进行调试预览，需要做如下设置：

1. 关闭 ES6转ES5 功能
2. 关闭 上传代码时样式自动补全 功能
3. 关闭 代码压缩上传 功能

## Taro-ui 安装和注意事项

#### 安装Taro-ui
````
npm i --save-dev taro-ui
````

#### 引入组件
````
import { AtButton } from 'taro-ui'
````
所有Taro-ui组件均以 'At' 开头，At 是 Taro开发团队 京东凹凸实验室(https://auto.io) 的缩写。

#### 引入taro-ui样式
1. 通过js全局引入：在项目入口文件中，引入 import 'taro-ui/dist/style/index.scss'
2. 通过scss全局引入：在项目app.scss中，引入 @import "~taro-ui/dist/style/index.scss";
3. 按需引入：例如 @import "~taro-ui/dist/style/components/button.scss";

#### H5项目注意事项

由于H5项目默认并不会编译 node_modules 模块，所以需要额外给H5项目做配置 `esnextModules`，在 taro 项目的 `config/index.js` 中新增如下配置项：  

````
h5: {
  esnextModules: ['taro-ui']
}
````

