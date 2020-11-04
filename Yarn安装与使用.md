# Yarn安装与使用

## yarn简介

Yarn 是 Facebook 推出的，快速、可靠、安全的依赖包管理工具，和 NPM 类似。

* **快速：** Yarn 不同与 NPM，Yarn 会缓存所下载的每个包，当日后重新需要安装这个包时(假设包的版本并未发生变更)，则会使用本地缓存，所以相对 NPM 安装速度快一些。

* **安全：**Yarn 会在每个安装包执行前校验其完整性。

* **可靠：**Yarn 和 NPM 类似，也使用 依赖包版本声明文件，来确保整个项目所需依赖包的版本。

  > NPM 和 Yarn 的依赖包版本声明文件，文件名都是：package.json
  >
  > Yarn 自动生成依赖包版本锁定描述文件，文件名为：yarn.yml

特别提醒：Linux 中包管理器名字为 yum，不要和 yarn 弄混淆了。



**中文官方文档：**

yarn 对中国用户非常友好，提供中文官方文档：https://classic.yarnpkg.com/zh-Hans/docs



## yarn安装

**安装文件下载地址：**https://classic.yarnpkg.com/zh-Hans/docs/install

**Windows系统安装：**https://classic.yarnpkg.com/latest.msi

**校验是否安装成功：**

```
yarm -v 或 yarn --version
```

**特别提醒：**

**如果你安装 yarn 之前已经打开了 VSCode**，那么一定要全部关闭 VSCode 软件窗口，重启 VSCode 后才会正确执行 yarn 命令，否则你可能会收到：

```
yarn：无法将“yarn”项识别为cmdlet、函数、脚本文件或可执行程序的名称
```



## yarn命令

> 文本会在每一个执行 yarn 命令后面，添加上 npm 相同的命令，以便更容易理解和对比。



**查看当前yarn版本：**

```
yarn -v 或 yarn --version
```

```
npm -v 或 npm --version
```

> 特别强调：若使用 version 关键词查看版本时，version 前面一定要加 --，若不添加，则命令变为 yarn version 这个命令是用来修改当前项目中 package.json 中 version 版本号的。



**初始化新的空白项目：**

```
yarn init
yarn init -y 或 yarn init --yes
```

```
npm init
npm init -y
```

> yarn 同 npm 一样，都会创建一个 package.json 的文件



**安装项目所有依赖包：**

```
yarn 或 yarn install
```

```
npm install
```



**安装项目所有依赖包且不使用缓存**

```
yarn install --force
```



**安装xxx包(默认最新版本)：**

```
yarn add xxx
```

```
npm i xxx 或 npm install xxx
```



**安装xxx包的特定版本：**

```
yarn add xxx@1.8
```

```
npm i xxx@1.8
```



**设置安装xxx包的依赖级别：**

```
yarn add xxx --dev
yarn add xxx --peer
```

```
npm i xxx --save-dev
npm i xxx --save
```

> yarn 还有一个依赖级别：`yarn add xxx --optional`，即可选依赖，意思是如果这个 依赖安装失败，项目依然可以正常运行，这个可选依赖似乎并没有在 npm 日常开发中使用到过。



**升级xxx包：**

```
//直接升级最新的版本，不需要确认
yarn upgrade xxx

//升级之前会列出需要升级的包，需要手工确认是否升级
yarn upgrade-interactive
```

```
npm undate xxx
```



**移除xxx包：**

```
yarn remove xxx
```

```
npm uninstall xxx
```



**全局 安装/移除/升级 xxx包**

```
yarn global add xxx
yarn global remove xxx
yarn global upgarde xxx
```

```
npm i xxx -g
npm uninstall xxx -g
npm update xxx -g
```

> 特别强调：对于 npm 来说，-g 可以放到 xxx 之前 或 之后，但是对于 yarn 来说，global 必须放在 yarn 后面，即 `yarn global` 。若不遵守此规则，则会出现以下情况：
>
> ```
> yarn add global xxx
> ```
>
> 相当于执行的是：
>
> ```
> yarn add global
> yarn add xxx
> ```
>
> 会错误的认为 global 也是一个包，而非 全局 的意思。



**运行scripts中定义的脚本：**

```
yarn run test 或 yarn run build 等等
```

```
npm run test 或 npm run build 等等
```

> 同 npm 一样，默认的脚本名也可以省略 run，即：yarn run test 等同于 yarn test
>
> 默认 yarn 可以省略 run 的脚本名有：
>
> 1. start
> 2. build
> 3. test
> 4. eject



**给执行脚本添加额外参数**

```
yarn run test --name hello
```

```
npm run test --name hello
```



**列出已定义的script脚本(仅列出并不会执行)：**

```
yarn run
```

```
npm run
```



**列出脚本运行时可用的环境变量**

```
yarn run env
```



**查看当前项目已安装的依赖包**

```
//不仅列出依赖包，还会列出依赖包中依赖的其他包
yarn list

//仅列出最顶层的依赖包
yarn list --depth=0
```

```
npm list
npm list --depth=0
```



**查看yarn全局缓存文件目录位置：**

```
yarn cache dir
```

> NPM 应该没有包全局缓存的概念



**清除yarn全局缓存文件：**

```
yarn cache clean
```

> 下次再运行 yarn install 时会重新下载，并再次创建缓存

```
npm cache clean --force 或 npm cache clean -f
```



**修改yarn缓存目录路径：**

```
yarn config set cache-foler ./new/path/
```



**查看yarn当前配置项：**

```
yarn config list
```



**验证当前项目包的版本与配置文件中的依赖包版本是否一致：**

```
yarn check
```



**严格验证当前项目依赖包与配置文件中依赖包是否一致：**

```
yarn check --integrity
```

> 所谓 严格验证 即 通过 验证文件 hash 值来验证文件是否一致



**检查过时的依赖包**

```
yarn outdated
yarn global outdated
```

```
npm outdated
npm outdated -g
```



**查看xxx包的信息介绍**

```
//以树状形式展示信息
yarn info xxx

//以JSON形式展示信息
yarn info xxx --json
```

```
npm info xxx
npm info xxx --json
```



**将已安装的依赖包压缩成一个文件**

```
yarn pack

//也可以自定义压缩文件名
yarn pack --filename my-file.xx
```

```
npm pack
```



**自动更新package.json中的版本号：**

```
yarn version
```

> 会自动将 package.json 按照语义自动加 1，例如原本版本号为 1.0.1，那么执行 yarn version 后 会自动修改成 1.0.2



**查看yarn版本以及所有运行依赖的版本：**

```
yarn versions
```

> 注意：这里输出的 `yarn所有运行依赖的版本` 不是指当前项目依赖包，而是指 yarn 运行所需要的依赖包，例如 nodejs、v8 等



**查看为什么要安装xxx包**

```
yarn why xxx
```

> 大致输入内容为，这个 xxx 包被 什么 使用或依赖。



**登录自己的账户：**

```
yarn login 
//稍后需要输入 用户名 和 邮箱
//但不会需要你输入 密码，只有在执行 yarn publish 时才会让输入密码
```

```
npm login
```



**登出自己的账户：**

```
yarn logout
```

```
npm logout
```



**发布自己的包：**

```
yarn publish
```

```
npm publish
```



**将自己的包导出成一个压缩文件：**

```
yarn publish xxx.tgz
```



## yarn创建软连接

正常的项目开发中，项目都会使用默认已安装的依赖包。

但是在学习、调试 xxx 源码库过程中，我们需要将 原本官方默认提供的依赖包 映射 为 本地自己编译出的源码库的代码包。

> 例如 react 源码库 本身只能编辑、调试、打包构建导出 react 包。但是源码库自己本身是没有办法调试自己构建导出的 react 包。

这样做的目的为：

1. 确保我们在 xxx 源码库中修改、调试的代码可以马上得到应用和验证
2. 通过 映射，我们可以 “欺骗” 一些源码库脚手架工具，让我们可以正常、顺利地继续使用源码库脚手架。

这种 映射 操作，在 npm 中也存在，且操作命令相似。



**创建yarn软连接**

> 假设我们本地的包 目录名为 my-xxx，所在路径为 /the/paht/to/my-xxx

```
cd /the/paht/to/my-xxx
yarn link
```

> 特别强调：my-xxx 仅仅是为了演示，实际上 my-xxx 必须和将来要 被映射的包名 完全一致。



**项目中使用软连接**

> 假设我们需要调试的项目 目录名为 test-xxx，所在路径为 /the/path/to/test-xxx

```
cd /the/path/to/test-xxx
yarn link my-xxx
```



至此，经过 创建软连接和使用软连接 这 2 个步骤，已经实现将 test-xxx 中需要使用到的 my-xxx 映射为本地我们自己创建的 my-xxx 包。

删除软连接的过程，和上面的操作刚好相反。



**项目中删除软连接：**

```
cd /the/path/to/test-xxx
yarn unlink my-xxx
```



**删除yarn中的软连接：**

```
cd /the/paht/to/my-xxx
yarn unlink
```



____



以下以调试 react 源码为例，来实际讲述一下创建和使用软连接的过程。

**前期工作：构建本地React包**

```
//拉取 react 源码 17.0.1
git clone https://github.com/facebook/react.git

//安装 react 依赖包
yarn install

//构建 本地 react 包，版本 17.0.1
yarn build react,react-dom,scheduler --type=NODE

//补充一下：如果你拉取的不是 react 17+，而是 react 16+，那么上面的构建本地 react 包代码需要修改成
//yarn build react/index,react-dom/index,scheduler --type=NODE
```

> 构建完成后，会在源码目录下，创建 build 目录，build 目录包含我们刚才打包构建的本地 react 包
>
> 1. build/node_modules/jest-react
> 2. build/node_modules/react
> 3. build/node_modules/react-dom
> 4. build/node_modules/scheduler



**创建yarn软连接**

```
cd /the/path/to/build/node_modules/react
yarn link

cd /the/path/to/build/node_modules/react-dom
yarn link
```



**项目中使用软连接：**

```
cd /the/path/to/test-react
yarn link react react-dom
```

若收到以下信息，则表明已经将 test-react 中所用到的 react 和 react-dom 映射为 我们本地从 react 源码中构建的对应包：

```
yarn link v1.22.5
success Using linked package for "react".
success Using linked package for "react-dom".
```



**删除软连接**

不再过多叙述，就是将 link 改为 unlink，反向执行一遍。
