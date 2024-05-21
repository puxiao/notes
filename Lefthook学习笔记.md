# Lefthook学习笔记

<br>

在学习 lefthook 之前，先学习一下 npm-run-all



<br>

## npm-run-all的用法

假定我们的前端项目中，需要依次运行多条 package.json 中 scripts 中的命令，那么就可以使用 npm-run-all 这个包。



<br>

**安装：**

```
pnpm add -D npm-run-all
```



<br>

**编写组合N条命令：**

> package.json

```
{
  "scripts": {
     "xxa": "...",
     "xxb": "...",
     "dosomthing": "npm-run-all xxa xxb"
  }
}
```

> "npm-run-all xxa xxb" 这条命令相当于依次执行 npm run xxa、npm run xxb



<br>

**星号匹配所有规则命令：**

> package.json

假定我们当前需要构建 monorepo 仓库下的 3 个项目：xxa、xxb、xxc

```
{
  "scripts":{
      "build:xxa": "cd monorepo/xxa && pnpm build",
      "build:xxb": "cd monorepo/xxb && pnpm build",
      "build:xxc": "cd monorepo/xxc && pnpm build",
  }
}
```

那么我们可以改为：

```diff
{
  "scripts":{
      "build:xxa": "cd monorepo/xxa && pnpm build",
      "build:xxb": "cd monorepo/xxb && pnpm build",
      "build:xxc": "cd monorepo/xxc && pnpm build",
+     "build-all": "npm-run-all --parallel --serial build:*",
  }
}
```

> "build-all" 命令中的 `build:*` 会匹配出 package.json 中所有符合该名称的命令，然后依次执行他们。



<br>

**别名：**

package.json 除了写成 `npm-run-all`，我们还可以使用它的另外 2 个简短的别名：`run-s`、`run-p`



<br>

了解了 `npm-run-all` 的用法后，回到我们本文要学习的 `lefthook` 。



<br>

## lefthook 简介与特点

<br>

对于前端项目而言 lefthook 与 npm-run-all 有些相似之处：都是可以将 N 条命令组合执行。

但是 2 者的侧重点不一样：

* npm-run-all 侧重点在执行 package.json 中的N条命令
* lefthook 侧重点在 git 各种命令的执行前后增加一些其他命令



<br>

**lefthook 的一些功能和 husky 也非常相似。**



<br>

### 简介：

Lefthook 官方介绍：

适用于 Node.js、Ruby 和其他许多类型项目的 Git 钩子(hook)管理器。

> 毕竟 Lefthook 名字里就包含了 "hook"。



官方介绍的优势：

<br>

* 速度快：使用 Go 编写，可以并行运行
* 功能强大：允许控制执行和传递命令
* 简单：单一的无依赖的二进制文件，可以在任何环境中运行



<br>

### 我个人理解的优势：

**相对于 npm-run-all 的优势：**

从上面的介绍可以看出 2 个核心要点：

* 不仅仅用于 node.js 项目，还适用于其他项目

* 不仅仅用于执行 node.js 命令，还能够针对 git 命令、git 钩子

  > 很适用于 提交代码前 代码格式化、代码构建、生成文档 等使用场景。



<br>

**还有另外一个核心优势：lefthook 配套有 lefthook.yml 配置文件**

在该文件(lefthook.yml) 中我们可以做很多事情，包括与 git 钩子的结合等。

> npm-run-all 只能配置在 package.json 中。



<br>

## lefthook 安装与用法



<br>

### 安装：

**NPM安装：**

```
pnpm add -D lefthook
```



<br>

**其他方式：**

前面讲过 lefthook 不仅仅适用于 node.js 项目，还使用其他类型的语言项目，因此对于其他类型项目，可以使用下面的安装方式。

<br>

> 使用 Go 安装

```
go install github.com/evilmartians/lefthook@latest
```



<br>

> 使用 Ruby 安装

```
gem install lefthook
```



<br>

### 用法：

**第1步：先检查项目是否有 git**

由于 lefthook 是针对包含 git 的项目，所以必须初始化 git 仓库的项目才能用 lefthook。



<br>

初始化 git 仓库：

```
git init
```



<br>

**第2步：创建 .lefthook.yml 文件**

```
npx lefthook install
```

该命令执行后，会在项目根目录下生成 `lefthook.yml`文件。



<br>

> 如果你的项目没有 git，那么你可能收到这样的错误信息：
>
> ```
> Error: exit status 128
> ```



<br>

默认刚刚创建的 lefthook.yml 文件内容为：

```
# EXAMPLE USAGE:
#
#   Refer for explanation to following link:
#   https://github.com/evilmartians/lefthook/blob/master/docs/configuration.md
#
# pre-push:
#   commands:
#     packages-audit:
#       tags: frontend security
#       run: yarn audit
#     gems-audit:
#       tags: backend security
#       run: bundle audit
#
# pre-commit:
#   parallel: true
#   commands:
#     eslint:
#       glob: "*.{js,ts,jsx,tsx}"
#       run: yarn eslint {staged_files}
#     rubocop:
#       tags: backend style
#       glob: "*.rb"
#       exclude: '(^|/)(application|routes)\.rb$'
#       run: bundle exec rubocop --force-exclusion {all_files}
#     govet:
#       tags: backend style
#       files: git ls-files -m
#       glob: "*.go"
#       run: go vet {files}
#   scripts:
#     "hello.js":
#       runner: node
#     "any.go":
#       runner: go run
```

> 上面以代码注释的方式 列举了一些常见的用法和配置。



<br>

**针对 lefthook.yml 的一些字段说明：**

* pre-push：git push 之前

* pre-commit：git commit 之前

* parallel：是否并行执行

* commands：该钩子对应需要执行的命令列表

* eslint、rubocop、... 这些 commands 下一级是具体的执行命令名称

* glob：全局搜索某种配型文件

* exclude：排除某些文件

* run：具体执行的命令

* 自定义命令：commands 下还可以通过添加 `custom-script` 来自定义执行某些脚本，例如：

  ```
  pre-commit:
    commands:
      custom-script:
        runner: ./scripts/custom-script.sh
  ```

  

* scripts：普通的命令(相对于 commands 而言)



<br>

大体上就是这些用法，等实际项目使用过了，我再更新本文。