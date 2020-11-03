# React源码目录文件构成

## 获取 React 源码

```
git clone https://github.com/facebook/react.git
```



## 目录文件归类

**说明文档：**

| 文件名             | 具体内容             |
| ------------------ | -------------------- |
| AUTHORS            | 作者列表             |
| CHANGELOG.md       | 修改日志             |
| CODE_OF_CONDUCT.md | 守则,行为准则        |
| CONTRIBUTING.md    | 贡献                 |
| LICENSE            | 使用许可证、版权声明 |
| README.md          | 自述文件             |
| SECURITY.md        | 上报安全问题         |



**项目配置：**

| 文件名/目录          | 具体内容               |
| -------------------- | ---------------------- |
| .circleci/config.yml | CircleCI配置文件       |
| .codesandbox/ci.json | CodeSandbox配置文件    |
| .github/*            | Github配置文件         |
| .editorconfig        | 编辑器配置             |
| .eslintignore        | Eslint可忽略检查的文件 |
| .eslintrc.js         | Eslint配置文件         |
| .gitattributes       | Git文本换行处理        |
| .gitignore           | Git可忽略追踪的文件    |
| .mailmap             | 关联贡献者名单和邮箱   |
| .nvmrc               | Nodejs最低版本号       |
| .prettierignore      | Prettier可忽略的文件   |
| .prettierrc.js       | Prettier配置文件       |
| .watchmanconfig      | 监控bug和文件变化      |
| appveyor.yml         | AppVeyor配置           |
| babel.config.js      | Babel配置文件          |
| dangerfile.js        | Danger配置文件         |
| netlify.toml         | Netlify配置文件        |
| package.json         | 项目配置文件           |
| yarn.lock            | Yarn包版本控制         |



**React核心源码：**

| 目录       | 具体内容                |
| ---------- | ----------------------- |
| fixtures/* | 测试用例(示例)          |
| packages/* | React尚未编译的核心源码 |
| scripts/*  | 各种工具链的脚本        |



## 第1大类：说明文档

### AUTHORS(作者列表)

1. 每一行的格式为：作者名 + 邮箱

2. 为了凸显平等，可以采用 按拼音首字母的排序方式

   > 1. 数字开头 按从小到大
   > 2. 字母开头 按字母首字母
   > 3. 汉字开头 按拼音首字母

示例：

```
839 <8398a7@gmail.com>
Adam Mark <adammark75@gmail.com>
zhangjg <jinguozhang@qq.com>
龙海燕 <1250766229@qq.com>
```



### CHANGELOG.md(修改日志)

1. 版本号使用 2#，并附带修改日期

2. 修改模块名使用 3#

3. 具体修改内容：描述文字 + 具体修改条目(使用 * 列表)

   > 具体修改描述文字可以省略

4. 具体修改条目内容格式：修改描述文字 + 提交修改代码对应的 pull 链接

示例：

```
## 17.0.1 (October 22, 2020)
### React DOM
* Fix a crash in IE11. ([@gaearon](https://github.com/gaearon) in [#20071](https://github.com/facebook/react/pull/20071))

## 17.0.0 (October 20, 2020)
Today, we are releasing React 17!
### React
* Add `react/jsx-runtime` and `react/jsx-dev-runtime` for the [new JSX transform](https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154-https-githubcom-babel-babel-pull-11154). ([@lunaruan](https://github.com/lunaruan) in [#18299](https://github.com/facebook/react/pull/18299))
* Build component stacks from native error frames. ([@sebmarkbage](https://github.com/sebmarkbage) in [#18561](https://github.com/facebook/react/pull/18561))
```



### CODE_OF_CONDUCT.md(守则,行为准则)

描述项目的目标、代码约定的守则等。例如：

1. 我们的誓言

2. 我们的标准

   1. 积极正面的行为
   2. 不受欢迎、不接受的行为

3. 我们的责任

4. 守则范围

5. 强制执行

   > 例如出现辱骂、骚扰等不接受的行为，有权处理或制止该行为

6. 本守则解释权归属



### CONTRIBUTING.md(贡献)

描述如果你希望也对本项目作出贡献，贡献什么以及如何贡献。例如：

1. 提交自己的代码，以及提交规范
2. 提交发现的bug，以及提交方式(通过 Issues)



### LICENSE(使用许可证、版权声明)

描述所遵守的许可证类型、版权声明等。

> React 许可证为 MIT 许可证(the MIT License)，是开源软件中被广泛使用的一种。
>
> 相对于其他的许可证条款，例如 GPL、LGPL、BSD 等，MIT 限制条件相对更加宽松。



### README.md(自述文件)

描述整个项目的简介、文档结构、示例、贡献方式、版权等。

> 文档开头还可以添加本项目的一些平台统计数以及链接图标。例如
>
> ```
> // 许可证链接图标
> [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE)
> 
> // NPM 对应项目图标
> [![npm version](https://img.shields.io/npm/v/react.svg?style=flat)](https://www.npmjs.com/package/react)
> ```



### SECURITY.md(上报安全问题)

描述如果你发现本项目存在安全隐患的代码，欢迎上报，以及如何上报。

还会附上项目白名单。

> 说白了，白名单上所列举的都是项目核心人员已知晓，但认为并不需要修改的事项。



## 第2大类：项目配置

### .circleci/config.yml(CircleCI配置文件)

CircleCI配置项。

CircleCI 的作用也是针对 github 进行持续集成/持续部署。

关于 CircleCI 的介绍和使用，可参考：https://circleci.com/docs/



### .codesandbox/ci.json(CodeSandbox配置文件)

CodeSandbox配置项。

CodeSandbox 是基于 React 的在线代码编辑器，可以在线调试编写的 JS 代码。

> CodeSandbox 仅仅是基于 React 开发的，CodeSandbox 可以调试几乎所有常见的 JS 框架库

关于 CodeSandbox 的介绍和使用，可参考：https://codesandbox.io/



### .github/*(Github配置文件)

Github配置项。其中目录结构为：

1. ISSUE_TEMPLATE(提交 ISSUE 的模板)

   1. bug_report.md(提交 Bug 的模板)
   2. config.yml(相关配置)

2. PULL_REQUEST_TEMPLATE.md(提交合并请求 PR 的模板)

3. stale.yml(Git 中 过时的分支 配置项)

   > stale 单词的意思为：不新鲜、陈旧、过时，在 Git 中 stale 分支 指已经被删除，过时，已不存在的分支



### .editorconfig(编辑器配置)

代码编辑器的配置项，里面包含：代码编码格式(utf-8)、是否自动换行、缩进方式等。

示例：

```
# https://editorconfig.org
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
max_line_length = 80
trim_trailing_whitespace = true

[*.md]
max_line_length = 0
trim_trailing_whitespace = false

[COMMIT_EDITMSG]
max_line_length = 0
```



### .eslintignore(Eslint可忽略检查的文件)

列举出 eslint 可以忽略检查的目录或文件。

例如：

```
# Third party
**/node_modules

# Not written by hand
packages/react-art/npm/lib

# Build products
build/
coverage/
fixtures/
scripts/bench/benchmarks/**/*.js

# React repository clone
scripts/bench/remote-repo/

packages/react-devtools-core/dist
packages/react-devtools-extensions/chrome/build
packages/react-devtools-extensions/firefox/build
packages/react-devtools-extensions/shared/build
packages/react-devtools-inline/dist
packages/react-devtools-shell/dist
packages/react-devtools-scheduling-profiler/dist
packages/react-devtools-scheduling-profiler/static
```



### .eslintrc.js(Eslint配置文件)

eslint的配置项。

具体配置项的设置，可参考：https://cn.eslint.org/docs/user-guide/configuring



### .gitattributes(Git文本换行处理)

```
* text=auto
```

git 对于文本文件中 文字行尾换行 的处理方式。

补充说明：

1. CR：carriage return，对应 ASCII中转义字符 \r，表示回车

2. LF：line feed，对应ASCII中转义字符 \n，表示换行

3. CRLF：carriage return line feed，\r\n，表示回车并换行

   > git 处理换行的目的为了兼容历史上的不同版本操作系统所支持的换行

4. `text=auto` 表示 文本内容将采用 git auto 的方式换行，即 LF 方式



### .gitignore(Git可忽略追踪的文件)

git 可以忽略追踪的文件列表。

> 可使用 * 来做模糊匹配

示例：

```
.DS_STORE
node_modules
*.log*
.vscode
packages/react-devtools-core/dist
```



### .mailmap(关联贡献者名单和邮箱)

和 `AUTHORS(作者列表)` 文件相似但又不同，.mailmap 属于 git 操作相关的贡献者名单和邮箱。 

内容格式规范上，不同地方在于：.mailmap 每一行 1 个作者名字，但是允许有该作者的多个邮箱地址



### .nvmrc(Nodejs最低版本号)

```
v12.16.2
```

表明需要运行 nodejs 的最低版本号



### .prettierignore(Prettier可忽略的文件)

Prettier(代码格式化) 可忽略的文件。

示例：

```
packages/react-devtools-core/dist
```



### .prettierrc.js(Prettier配置文件)

Prettier配置项。

具体配置项的设置，可参考：https://prettier.io/docs/en/options.html



### .watchmanconfig(监控bug和文件变化)

用于监控bug文件和文件变化，并且可以出发指定的操作。

在 React 源码中，该文件内容为空：

```
{}
```



### appveyor.yml(AppVeyor配置)

AppVeyor 是针对 Github 提供在线集成(CI/CD)服务。

> AppVeyor提供的集成服务包括：获取代码，编译，打包，部署到 GitHub ，并以 GitHub Release 方式发布



### babel.config.js(Babel配置文件)

Babel配置项。

具体配置项的设置，可参考：https://www.babeljs.cn/docs/7.2.0/configuration



### dangerfile.js(Danger配置文件)

Danger配置项。

Danger的作用是自动检测 git 提交代码合并 是否可能存在问题。

> Github 中 提交合并操作叫 Pull Request，简称 PR
>
> Gitlab 中 提交合并操作叫 Merge Request，简称 MR

关于 Danger 的详细介绍和配置，可参考：https://segmentfault.com/a/1190000023214462



### netlify.toml(Netlify配置文件)

Netlify配置项。

Netlify 的作用是通过持续部署，可以通过推送到 Git 或 通过 webhook 来触发构建。

> Netlify 可以更加简单的方式实现 前端自动化部署

关于 Netlify 的详细介绍和使用，可参考：https://www.cnblogs.com/codernie/p/9062104.html



### package.json(项目配置文件)

项目配置项。

package.json 包含：项目所使用到的各个 NPM 包的版本、NPM 自定义脚本等等。



### yarn.lock(Yarn包版本控制)

这个文件和 package-lock.json 有些类似，都是自动生成的文件，用来储存 NPM 各个包的版本。

> Yarn 是 Facebook 贡献的 Javascript 包管理器，和 NPM 有一些类似，速度方面会比 NPM 更快一些。



## 第3大类：React核心源码

### fixtures/*(测试用例)

这个目录下面，存放着一些给贡献者准备的小型 React 测试项目。



### packages/*(React尚未编译的核心源码)

这个目录下面，存放着 React 尚未编译的所有核心源码。



### scripts/*(各种工具链的脚本)

这个目录下面，存放着各种工具链的脚本，例如 git、eslint、jest 等。

