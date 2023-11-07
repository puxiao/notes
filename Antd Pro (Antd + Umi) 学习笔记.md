# Antd Pro (Antd + Umi) 学习笔记

首先强调一点，本文并不是具体的代码教程，而是一些基础的概念解释。

Antd Pro、Umi、Antd 他们的官方文档已经足够详细、清晰，因此想学习具体的代码用法可参考他们官方文档。



<br>

#### Antd Pro 是谁？

Antd Pro 是基于 Antd + Umi ，用于快速搭建 前后端分离项目中的 后台部分。

> 在下面文字中，使用 “网站管理后台” 这个词来指 “前后端分离项目中的 后台”。



<br>

**拆分具体说一下：**

1. **Antd**：阿里公司开源的一套基于 React 的组件库，提供 **零散** 的通用组件
2. **Umi**：阿里公司开源的一套基于 React 的通用后台逻辑管理框架，提供 **路由、数据状态管理、数据模拟(mock)、构建调试** 等后台开发常见管理模块。

换句话说：

1. **Antd**：提供网站管理后台的 “肉身”

   > 肉身：各个部件，例如 菜单、输入框、下拉框等

2. **Umi**：提供网站管理后台的 “灵魂”

   > 灵魂：各项管理，例如 路由管理、数据状态管理、数据模拟(mock)、构建调试等

3. **Antd Pro**：肉身(Antd) + 灵魂(Umi) 最终得到了一个完整、功能强大的 通用网站管理后台



<br>

#### 如何学习 Antd Pro？

由于我们已经知道 所谓的 Antd Pro 是基于 antd 和 umi，那么自然我们首先需要先了解这 2 项。

可以直接去他们官网学习。

1. antd：https://ant.design/index-cn
2. umi：https://umijs.org/zh-CN



<br>

关于 antd 不做过多讲述，这里重点说一下 Umi。

**Umi 和 Create-React-App 的差异：**

使用 react 的人都用过 create-react-app，那 create-react-app 和 umi 这 2 个不同的 **脚手架** 之间的重要区别是什么呢？

答：

1. create-react-app 只提供最基础的 react 项目搭建，若需要路由、数据状态等都需要自己手工安装、添加、配置。
2. umi 除了具备 create-react-app 的功能外，还额外包含 路由、数据状态 等常用的模块(NPM包)安装与配置。



<br>

换句话说：umi 扩展了 create-react-app，为我们省去了很多模块安装配置的过程。

但是，**这种方便带来的弊端也很显而易见**，比如 路由、数据状态等我们只能使用 umi 设定好的，无法做到自主选择。

> 例如 umi 使用 hooks 来实现了全局数据状态( umi )，假设你想使用 recoil 则可能与 umi 默认的状态管理有所冲突。

<br>

> 实际上 umi 也提供了让我们自由选择的机会，就是通过 `插件` 的形式来进行执行配置。
>
> 具体可参考：https://umijs.org/zh-CN/plugins/plugin-preact



<br>

#### 初学者最应搞明白的一件事

对于 antd pro 初学者，最需要搞明白一件事情：

1. **create-react-app 默认显示的内容主要依赖的是 首页组件(/src/app.jsx) 中所填充的具体内容**
2. **而 antd pro 默认显示的内容主要依赖的是 “此时此刻的路由(url 网址)”**

<br>

**路由是 umi (也是 antd pro) 的一切开始与核心。**

关于 Umi 中的路由配置，可查阅：https://umijs.org/zh-CN/docs/routing



<br>

如果学会了 Umi，也几乎相当于学会了 Antd Pro 的核心。当你先查阅、学习 Umi 官方文档后，再去看 Antd Pro 的文档就非常容易理解了。

Antd Pro：https://pro.ant.design/zh-CN

<br>

> 换句话说，假设想学习 Antd Pro，那么先要去学习 Umi。
>
> Antd Pro 实际上就是 Umi 的一种更高级别的应用实例(场景)。



<br>

#### Umi(Antd Pro)最迷惑人(难易理解)的地方：默认的 dva 数据状态管理

Umi 默认使用 dva 来管理整个项目的全局数据状态。

> 相关介绍：https://umijs.org/zh-CN/plugins/plugin-dva

假设你不熟悉 dva，那简直是一种 “难易理解、绕圈山路十八弯” 的一种数据状态管理方式。

**dva 的心智负担特别重。**

> dva 算是一种比较 旧，传统的数据状态管理思想，相对于比较新的 Recoil 而言我们真的不应该花费时间去学习这样的知识，简直浪费生命。
>
> 补充：如果对 Recoil 感兴趣，可以查看我写的关于数据状态 Recoil 的教程
>
> https://github.com/puxiao/recoil-tutorial

但是实际工作中，我们还应该了解一下 dva 这种管理套路——因为我们可能需要维护老的项目，不得已你也得懂。

<br>

假设我们现在要创建一个 “朋友名单” 的管理模块，我们姑且使用 “friendsList” 这个来命名。

那么 Umi(Antd Pro) 的 dva 大致工作套路是：

1. 在 src/models/ 下面创建一个名为 `friendsList.js` 的文件，大致内容为：

   ```
   const friendsList = { 
       namespace: 'friendsList'
   };
   
   // 或者更加简单一些写成下面的
   
   export default { 
       namespace: 'friendsList'
   }
   ```

   请注意，一定需要定义 `namespace: 'friendsList'`

2. 配置页面组件的初始化数据，假设我们使用的是 React 类组件，那么我们将在 src/pages/ 下面创建一个 friendsList 的目录，在里面创建 index.js 用于创建这个组件，可能需要下面的一些数据状态，例如 是否有朋友、旧朋友列表、新朋友 等等：

   ```
   export default {
     dva: {
       haveFriend: true,
       oldList: [],
       newFriend: {}
     },
   };
   ```

3. 在 umi 中创建符合 dva 的组件，需要用到 umi 中的 connect

   ```
   import { IndexModelState, ConnectRC, Loading, connect } from 'umi';
   
   const friendsList = ({ index, dispatch }) => {
      ...
   }
   
   export default connect(
     ({ index, loading }: { index: IndexModelState; loading: Loading }) => ({
       index,
       loading: loading.models.index,
     }),
   )(friendsList);
   ```

   > 特别提醒：按照正常情况下，我们通常应该将 React 组件 首字母为大写，但是这里为了匹配第1步中 `namespace: 'friendsList'`，所以上面代码中组件名字使用了小写开头。

4. **最终，我们通过两个名字都为 "friendsList" 的字面意思，经过 connect 将 二者进行关联**。

   1. src/models/friendsList.js
   2. src/pages/friendsList/index.js

   这简直是一种玄学！隔空对接、匹配。

我都无力吐槽了，具体细节可查阅官方文档：https://umijs.org/zh-CN/plugins/plugin-dva

我的结论是：无果非必要(例如需要维护老项目)，千万不要轻易使用 Umi 默认的 dva 这种数据管理。



<br>

#### 使用 Antd Pro 的 2 点补充

第1点：Antd Pro 默认使用 Prettier 来自动格式化代码，因此需要在 VScode 中安装并开启 Prettier 这个插件。

第2点：由于目前 Antd 并不提供 富文本框 这个组件，而后台文章管理中肯定需要富文本框，这里推荐使用 `wangEditor` 

> https://github.com/wangeditor-team/wangEditor



<br>

**开始吧，Hello World!**



<br>

**初始化一个 umi 项目：**

1. 先创建一个项目目录，例如 myadmin

2. 进入到 myadmin，然后执行：

   ```
   yarn create umi
   ```

   > 注意你无需提前安装 umi

3. 根据提示，通过键盘上下箭头，将模板选则为 antd-pro

4. 后面根据提示，一路按回车

这样一个 umi 项目就创建完成了。



<br>

**初始化一个 antd-pro 项目：**

1. 全局安装：

   ```
   npm i @ant-design/pro-cli -g
   ```

2. 创建项目：

   ```
   pro create myadmin
   ```

3. 在命令选择相中，选择 umi4



<br>

**注意：假设第 2 步中报错：**

```
pro: The term 'pro' is not recognized as a name of a cmdlet, function, script file, or executable program.
```

这是因为你本机没有把 npm 全局安装目录添加到系统环境路径中。

你需要做的是：

1. 先找到自己当前的 npm 全局目录：

   ```
   npm root -g
   ```

2. 假定上面命令输出结果为："C:\Users\Administrator\AppData\Roaming\npm\node_modules"

   那么你需要把 "C:\Users\Administrator\AppData\Roaming\npm\" 添加到系统环境变量 Path 中，

   然后重启命令窗口 或 VSCode，这样再去执行 `pro create myadmin`  就能找到 pro 了。



<br>

具体细节可参考：

> 初始化一个 Umi 项目：https://umijs.org/zh-CN/docs/getting-started
>
> 初始化一个 Antd Pro 项目：https://pro.ant.design/zh-CN/docs/getting-started



<br>

**初始化项目的差异：**

* 使用 umi 初始化创建的项目页面功能要比 antd-pro 的少一些，适用于需要大量自定义页面
* 使用 antd-pro 初始化的项目页面、路由 等各项配置比较齐全，适用于通用管理后台



<br>

#### 附：阿里开源的各种前端中后台项目

| 项目                | 简介                               | 官网                                |
| ------------------- | ---------------------------------- | ----------------------------------- |
| Antd                | 提供各种通用组件                   | https://ant.design/index-cn         |
| Antd Charts         | 提供各种图表(类似echarts)          | https://charts.ant.design/zh-CN     |
| Antd Pro            | 提供通用中后台管理                 | https://pro.ant.design/zh-CN        |
| Antd Pro Components | 提供更高级别的通用模块(相对于Antd) | https://procomponents.ant.design    |
| Antd Mobile         | 提供移动端相关组件                 | https://mobile.ant.design/zh        |
| Antd Landing        | 提供一些页面模板                   | https://landing.ant.design/index-cn |
| Umi                 | 提供通用中后台管理逻辑架构         | https://umijs.org/zh-CN             |
| Dumi                | 为组件创建相对应的说明文档         | https://d.umijs.org/zh-CN           |
| qiankun             | 微前端框架                         | https://qiankun.umijs.org/zh        |
| ahooks              | 提供各种通用的自定义 hooks         | https://github.com/alibaba/hooks    |
| Ant Motion          | 提供组件动画                       | https://motion.ant.design/index-cn  |
| Scaffolds           | 发布各种脚手架的平台(不限于React)  | https://scaffold.ant.design         |
