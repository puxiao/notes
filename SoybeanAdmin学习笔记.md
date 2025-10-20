# SoybeanAdmin学习笔记

最近需要用 Vue3 开发管理后台，最终选择了 SoybeanAdmin 这个开源项目。

SoybeanAadmin使用的是 Naive-UI 组件库，非常符合我的心意。

**SoybeanAdmin**

代码仓库：https://github.com/soybeanjs/soybean-admin

官方文档：https://docs.soybeanjs.cn/zh/guide/quick-start.html

<br>

**不同于 antd-pro 下载即用，SoybeanAdmin 需要我们先精简改动一下才可以开发自己的管理后台。**

我们的目的是 `开发自己的管理后台` 而不是 `向SoybeanAdmin提交代码贡献`，所以对于 SoybeanAdmin 默认的代码配置，需要做一些剔除改造：

- 复制 SoybeanAdmin main 分支下 `有用的代码文件` 到自己的空白代码仓库中
  
  > 没用的文件，例如：LICENSE、CHANGELOG.md 等这些。
  
  > 不要通过 fork SoybeanAdmin 代码仓库，而是创建一个自己的空白代码仓库。
  
  > 先不要着急执行依赖，因为安装依赖时 `simple-git-hooks` 会向 .git/hooks/ 创建 `pre-commit` 文件。
  
- 删除 package.json 中 simple-git-hooks 相关的配置
  
  > 因为是自己的管理后台项目，不需要遵守 SoybeanAdmin 的一些 git 提交规范
  

<br>

**package.json改造：**

- 删除 "scripts" 中 `"prepare": "simple-git-hooks"`
  
- 删除 "devDependencies" 中 "simple-git-hooks": "2.13.1"
  
- 删除 "simple-git-hooks"
  
- 删除一些无用配置项，例如：
  
  "author"、"description"、"keywords"、"license"、"homepage"、"repository"、"bugs"、"website"
  
  > 可以通过向 官方提交 PR 的形式参与回馈开源项目。
  
- 添加上 "private": true
  

<br>

此时我们再执行安装依赖：`pnpm i`

那么接下来就可以开始根据 SoybeanAdmin 文档或者 SoybeanAdmin 仓库下的 `example` 分支来学习开发自己的管理后台页面了。

<br>

**删除其他：主题配置**

VSCode 搜索：`ThemeDrawer` 和 `ThemeButton`，然后对相关的代码进行删除。

<br>

**更换图标：本地图标、线上图标**

- 本地图标资源存放位置：src/assets/svg-icon/，例如 `xxx.svg` 对应 Vue 标签为：`<icon-local-xxx />`
  
  > 图标前缀 `icon-local` 对应 .env 中的 VITE_ICON_LOCAL_PREFIX
  
  > 特别提醒：如果修改了本地 .svg 文件则需要重启项目才能查看修改后的效果
  
- 线上图片请在 https://icones.js.org/ 查找，复制某个图标名称，例如 `bx:book`，对应Vue标签为：`<icon-bx:book />` 或 `<icon-bx-book>`
  
  > 图标前缀 `icon` 对应 .env 中的 VITE_ICON_PREFIX
  

<br>

**关于自动生成路由：千万不要使用！**

官方文档中提到的 `pnpm gen-route` 每次执行后都会对 `router/elegant/router.ts` 产生破坏性重写，并且生成的路由是按照目录名称来排优先级的！

此外还有一些其他问题，例如：不可以使用相同开头的单词作为路由，例如这两个路由：abcd、abcde，会发生一些意想不到的错误。

<br>

**手工添加路由**

我们还是手工创建路由比较好，需要依次手工添加的有：

- views 中新增不同级别的 目录，目录下一定要确保存在 index.vue
  
- router/elegant/import.ts views 中增加引入组件
  
- router/elegant/routes.ts generatedRoutes 中增加路由配置
  
- router/transform.ts routeMap 中增加对应的路由配置
  
- typings/elegant-router.d.ts 中 RouteMap 增加新路由字段名
  
- locales/langs/ en-us.ts、zh-cn.ts 中 route 增加对应的路由中文和英文标题
  

<br>

**后期如何更新 SoybeanAdmin 代码框架？**

我并不赞同 官方文档 中介绍的 同步代码 的方案：

https://docs.soybeanjs.cn/zh/guide/sync.html

我的建议是：

- 管理后台开发好后，能用即可，没必要必须经常更新，毕竟这不像 npm 包很容易更新。
  
- 如果遇到小的代码问题，先尝试手工更新。
  
- 想提升到大版本更新，可新建项目，将当前管理后台代码迁移至新的项目中。
