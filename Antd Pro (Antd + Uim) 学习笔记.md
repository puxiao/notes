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
> Antd Pro 实际上就是 Umi 的一种更高级别的应用示例。



<br>

#### 使用 Antd Pro 的 2 点补充

第1点：Antd Pro 默认 Prettier 来自动格式化代码，所以需要在 VScode 中安装并开启 Prettier 这个插件。

第2点：由于目前 Antd 并不提供 富文本框 这个组件，而后台文章管理中肯定需要富文本框，这里推荐使用 `wangEditor` 

> https://github.com/wangeditor-team/wangEditor



<br>

**Hello World!**

初始化一个 Umi 项目：https://umijs.org/zh-CN/docs/getting-started

初始化一个 Antd Pro 项目：https://pro.ant.design/zh-CN/docs/getting-started



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

