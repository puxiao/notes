# Yarn安装与使用

## 目录

* **[yarn简介](#yarn%E7%AE%80%E4%BB%8B)**
* **[yarn安装](#yarn%E7%AE%80%E4%BB%8B)**
* **[修改yarn缓存目录](#%E4%BF%AE%E6%94%B9yarn%E7%BC%93%E5%AD%98%E7%9B%AE%E5%BD%95)**
* **[yarn命令](#yarn%E5%91%BD%E4%BB%A4)**
* **[yarn创建软连接](#yarn%E5%88%9B%E5%BB%BA%E8%BD%AF%E8%BF%9E%E6%8E%A5)**
* **[通过.yarnrc修改默认的node_modules目录](#通过.yarnrc修改默认的node_modules目录)**



<br>

## yarn简介

Yarn 是 Facebook 推出的，快速、可靠、安全的依赖包管理工具，和 NPM 类似。

* **快速：**  Yarn 不同与 NPM，Yarn 会缓存所下载的每个包，当日后重新需要安装这个包时(假设包的版本并未发生变更)，则会使用本地缓存，所以相对 NPM 安装速度快一些。

* **安全：** Yarn 会在每个安装包执行前校验其完整性。

* **可靠：** Yarn 和 NPM 类似，也使用 依赖包版本声明文件，来确保整个项目所需依赖包的版本。

  > NPM 和 Yarn 的依赖包版本声明文件，文件名都是：package.json
  >
  > Yarn 自动生成依赖包版本锁定描述文件，文件名为：yarn.yml

特别提醒：Linux 中包管理器名字为 yum，不要和 yarn 弄混淆了。



<br>

**中文官方文档：**

yarn 对中国用户非常友好，提供中文官方文档：https://classic.yarnpkg.com/zh-Hans/docs



<br>

## yarn安装

#### Windows系统安装：

**安装程序下载地址：** https://classic.yarnpkg.com/latest.msi

* 安装时建议修改安装目录到 D盘，不挤压C盘空间
* 默认安装成功后会自动像系统环境变量 Path 中加入 yarn 对应的路径



<br>

#### Linux、CentOS7安装：

**第1种安装方式(推荐)：使用官方提供的脚本安装**

```
curl -o- -L https://yarnpkg.com/install.sh | bash
```

上述命令执行完成后，会输出以下内容：

```
> GPG signature looks good
> Extracting to ~/.yarn...
> Adding to $PATH...
> We've added the following to your /root/.bashrc
> If this isn't the profile of your current shell then please add the following to your correct profile:
   
export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

> Successfully installed Yarn 1.22.5! Please open another terminal where the `yarn` command will now be available.
```

请特别留意上面的提示内容。



<br>

**尽管已安装成功，但假设你依然无法使用 yarn** (因为系统 PATH 中未创建 yarn 真正目录连接)，

例如你执行：

```
yarn -v
```

收到错误提示：

```
-bash: yarn: command not found
```

那么请执行：

```
export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
```

执行过后，就可以愉快使用 yarn 了。



<br>

**第2种安装方式：使用 npm 安装**

```
npm i -g yarn
```



<br>

**第3种安装方式：使用 yum 安装**

```
yum install -y yarn
```

> 本人不推荐的理由是担心 yum 仓库中 yarn 版本不是最新的



<br>

#### 校验是否安装成功：

```
yarn -v 或 yarn --version
```

**特别提醒：**

**如果你安装 yarn 之前已经打开了 VSCode**，那么一定要全部关闭 VSCode 软件窗口，重启 VSCode 后才会正确执行 yarn 命令，否则你可能会收到：

```
yarn：无法将“yarn”项识别为cmdlet、函数、脚本文件或可执行程序的名称
```



<br>

## 修改yarn缓存目录



<br>

**查看当前 yarn 缓存目录：**

```
yarn cache dir
```

我是 windows10 系统，我这里默认输出的缓存目录为：C:\Users\xxxx\AppData\Local\Yarn\Cache\v6



<br>

由于以后你安装的每个 NPM 包都会缓存到该目录，而该目录在 C盘，那么日久天长该目录会非常大，占用 C盘空间，所以，我们需要将默认的缓存目录修改到空间更大的 D盘。



<br>

**修改缓存目录：**

假定我们希望将缓存目录修改到：d:/yarn/cache，首先我们先创建该文件夹，然后执行：

```
yarn config set cache-folder d:/yarn/cache
```

> 请注意缓存目录路径中避免出现 中文、空格等



<br>

接下来就可以放心开始使用 yarn 了。



<br>

## yarn命令

> 文本会在每一个执行 yarn 命令后面，添加上 npm 相同的命令，以便更容易理解和对比。



<br>

**查看当前yarn版本：**

```
yarn -v 或 yarn --version
```

```
npm -v 或 npm --version
```

> 特别强调：若使用 version 关键词查看版本时，version 前面一定要加 --，若不添加，则命令变为 yarn version 这个命令是用来修改当前项目中 package.json 中 version 版本号的。



<br>

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



<br>

**安装项目所有依赖包：**

```
yarn 或 yarn install
```

```
npm install
```



<br>

**安装项目所有依赖包且不使用缓存**

```
yarn install --force
```



<br>

**安装xxx包(默认最新版本)：**

```
yarn add xxx
```

```
npm i xxx 或 npm install xxx
```



<br>

**安装xxx包的特定版本：**

```
yarn add xxx@1.8
```

```
npm i xxx@1.8
```



<br>

**设置安装xxx包的依赖级别：**

```
yarn add xxx --dev
yarn add xxx
// 不添加任何参数，默认即添加到 dependencies，相当于 npm 的 --save

//特别提醒，如果添加 --peer，则会安装到 peerDependencies
yarn add xxx --peer
```

```
npm i xxx --save-dev
npm i xxx --save
```

> yarn 还有一个依赖级别：`yarn add xxx --optional`，即可选依赖，意思是如果这个 依赖安装失败，项目依然可以正常运行，这个可选依赖似乎并没有在 npm 日常开发中使用到过。



<br>

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



<br>

**移除xxx包：**

```
yarn remove xxx
```

```
npm uninstall xxx
```



<br>

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



<br>

**查看全局安装文件目录**

```
yarn global dir
```

```
npm root -g
```



<br>

**查看全局安装可执行文件目录位置：**

```
yarn global bin
```

> 必要时可以将此目录添加到系统全局变量 path 中，以方便再任何地方可以使用已全局安装的NPM包



<br>

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



<br>

**给执行脚本添加额外参数**

```
yarn run test --name hello
```

```
npm run test --name hello
```



<br>

**执行 test(测试) 脚本**

执行 test 脚本命令为：yarn test [xxx]

我们以检测 ts 代码的 dtslint 脚本为例，来进行使用说明。

第1步：需要在 package.json 的 scripts 中添加 test 命令脚本：

```
"scripts": {
    ...
    
    "test": "dtslint types",
    
    ...
},
```

> 上面代码中的 dtslint 是用来测试 TypeScript 代码的，实际项目中，要根据自己的项目来调用对应的测试命令

> `dtslint types` 该命令含义为配置 dtslit 基础调试目录，该目录名为 types

第2步：执行 test 测试

```
yarn test xxx
```

> 对于 dtslint 脚本来说，`yarn test xxx` 相当于让 dtslint 去执行检测 types 目录下的 xxx 目录中的 ts 代码文件



<br>

**列出已定义的script脚本(仅列出并不会执行)：**

```
yarn run
```

```
npm run
```



<br>

**列出脚本运行时可用的环境变量**

```
yarn run env
```



<br>

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



<br>

**查看yarn全局缓存文件目录位置：**

```
yarn cache dir
```

> NPM 应该没有包全局缓存的概念



<br>

**清除yarn全局缓存文件：**

```
yarn cache clean
```

> 下次再运行 yarn install 时会重新下载，并再次创建缓存

```
npm cache clean --force 或 npm cache clean -f
```



<br>

**修改yarn缓存目录路径：**

```
yarn config set cache-foler ./new/path/
```



<br>

**查看yarn当前配置项：**

```
yarn config list
```



<br>

**查看源地址：**

```
yarn config get registry
```



<br>

**修改源地址：**

```
yarn config set registry https://registry.npmmirror.com
```

> 注：2023年之前 淘宝NPM 的地址是 https://registry.npm.taobao.org ，但是 2024 年后该域名已更换为 https://registry.npmmirror.com



<br>

**查看代理地址：**

```
yarn config get proxy
```



<br>

**修改代理地址：**

```
yarn config set proxy xxxxxxxx
```



<br>

**验证当前项目包的版本与配置文件中的依赖包版本是否一致：**

```
yarn check
```



<br>

**严格验证当前项目依赖包与配置文件中依赖包是否一致：**

```
yarn check --integrity
```

> 所谓 严格验证 即 通过 验证文件 hash 值来验证文件是否一致



<br>

**检查过时的依赖包**

```
yarn outdated
yarn global outdated
```

```
npm outdated
npm outdated -g
```



<br>

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



<br>

**将已安装的依赖包压缩成一个文件**

```
yarn pack

//也可以自定义压缩文件名
yarn pack --filename my-file.xx
```

```
npm pack
```



<br>

**自动更新package.json中的版本号：**

```
yarn version
```

> 会自动将 package.json 按照语义自动加 1，例如原本版本号为 1.0.1，那么执行 yarn version 后 会自动修改成 1.0.2



<br>

**查看yarn版本以及所有运行依赖的版本：**

```
yarn versions
```

> 注意：这里输出的 `yarn所有运行依赖的版本` 不是指当前项目依赖包，而是指 yarn 运行所需要的依赖包，例如 nodejs、v8 等



<br>

**查看为什么要安装xxx包**

```
yarn why xxx
```

> 大致输入内容为，这个 xxx 包被 什么 使用或依赖。



<br>

**登录自己的账户：**

```
yarn login 
//稍后需要输入 用户名 和 邮箱
//但不会需要你输入 密码，只有在执行 yarn publish 时才会让输入密码
```

```
npm login
```



<br>

**登出自己的账户：**

```
yarn logout
```

```
npm logout
```



<br>

**发布自己的包：**

```
yarn publish
```

```
npm publish
```



<br>

**将自己的包导出成一个压缩文件：**

```
yarn publish xxx.tgz
```



<br>

## yarn创建软连接

正常的项目开发中，项目都会使用默认已安装的依赖包。

但是在学习、调试 xxx 源码库过程中，我们需要将 原本官方默认提供的依赖包 映射 为 本地自己编译出的源码库的代码包。

> 例如 react 源码库 本身只能编辑、调试、打包构建导出 react 包。但是源码库自己本身是没有办法调试自己构建导出的 react 包。

这样做的目的为：

1. 确保我们在 xxx 源码库中修改、调试的代码可以马上得到应用和验证
2. 通过 映射，我们可以 “欺骗” 一些源码库脚手架工具，让我们可以正常、顺利地继续使用源码库脚手架。

这种 映射 操作，在 npm 中也存在，且操作命令相似。



<br>

**创建yarn软连接**

> 假设我们本地的包 目录名为 my-xxx，所在路径为 /the/paht/to/my-xxx

```
cd /the/paht/to/my-xxx
yarn link
```

> 特别强调：my-xxx 仅仅是为了演示，实际上 my-xxx 必须和将来要 被映射的包名 完全一致。



<br>

**项目中使用软连接**

> 假设我们需要调试的项目 目录名为 test-xxx，所在路径为 /the/path/to/test-xxx

```
cd /the/path/to/test-xxx
yarn link my-xxx
```



<br>

至此，经过 创建软连接和使用软连接 这 2 个步骤，已经实现将 test-xxx 中需要使用到的 my-xxx 映射为本地我们自己创建的 my-xxx 包。

删除软连接的过程，和上面的操作刚好相反。



<br>

**项目中删除软连接：**

```
cd /the/path/to/test-xxx
yarn unlink my-xxx
```



<br>

**删除yarn中的软连接：**

```
cd /the/paht/to/my-xxx
yarn unlink
```



<br>

**修改网络代理**

有时候执行 yarn create react-app xxx 时提示网络不通，比较简单的解决方法是将 npm 代理 设置为 null

```
npm config set proxy null
```

设置后再重新执行 yarn 相关命令。



____



以下以调试 react 源码为例，来实际讲述一下创建和使用软连接的过程。

<br>

**1、前期工作：构建本地React包**

```
//拉取 react 源码 17.0.1
git clone https://github.com/facebook/react.git

//安装 react 依赖包
yarn install

//构建 本地 react 包，版本 17.0.1
yarn build react,react-dom,scheduler --type=NODE

//补充一下：如果你拉取的不是 react 17.0.1，而是 以前较低的版本，甚至包括 (react 17 alpha)，那么上面的构建本地 react 包代码需要修改成
//yarn build react/index,react-dom/index,scheduler --type=NODE
```

> 构建完成后，会在源码目录下，创建 build 目录，build 目录包含我们刚才打包构建的本地 react 包
>
> 1. build/node_modules/jest-react
> 2. build/node_modules/react
> 3. build/node_modules/react-dom
> 4. build/node_modules/scheduler



<br>

**2、创建yarn软连接**

```
cd /the/path/to/build/node_modules/react
yarn link

cd /the/path/to/build/node_modules/react-dom
yarn link
```



<br>

**3、项目中使用软连接：**

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



<br>

**4、测试方式一：通过修改源码，测试是否映射成功：**

1. 修改本地构建的 react-dom 文件，例如：xxxxx/react/build/node_modules/react-dom/cjs/react-dom.development.js

   ```
   'use strict';
   
   //在此添加一行代码
   console.log('this message come from my current react-dom')
   
   if (process.env.NODE_ENV !== "production") {
     (function() {
   'use strict';
   ....
   ```

2. 切换到由 create-react-app 创建的 test-react 项目中，并启动该项目

   ```
   yarn start
   ```

3. 若能正常启动，且在启动后输出 `this message come from my current react-dom` 即表示 映射成功



<br>

**5、测试方式二：通过浏览器，测试是否映射成功：**

1. 启动测试项目：`yarn start`
2. 打开浏览器中的调试工具，切换到 源代码(Sources) 面板
3. 在 **页面 > localhost:3000 > static/js > f:/xxx > build/node_modules/ > ...  检查是否为在本机React构建的包和文件**
4. 若存在本机 React 构建的包(包为本机的目录)，若存在即表明 测试项目中 使用软连接配置生效



<br>

**6、删除软连接**

不再过多叙述，就是将 link 改为 unlink，反向执行一遍。



<br>

## 通过.yarnrc修改项目默认的node_modules目录

默认情况下，无论 npm、cnpm、yarn、pnpm，当安装 npm 包时都会默认安装到当前项目的 node_modules 目录中。

某些特殊情况下，你想把项目中 npm 包安装到别的目录，那么可以通过下面方式操作。



<br>

假设我们希望将 npm 包安装到 `path-to-you-folder` 目录中，那么操作如下：

第1步：在项目根目录创建一个 `.yarnrc` 的文件

第2步：在该文件中输入以下内容：

```
--modules-folder path-to-your-folder
```



<br>

从此，以后再执行 `yarn add xxx` ，xxx 都会被安装到 `paht-to-your-folder` 目录中。



<br>

补充说明：

这种方式本身只适用于 yarn，不适用于 npm。

如果是 npm 也想实现这种方式，那么有 2 种方案：

1. 安装npm包时添加参数：

   ```
   npm i --prefix ./path-to-you-folder xxx
   ```

   > 缺点：每一次安装 npm 包都需要添加 `--prefix` 参数，并且安装的 npm 包不会出现在 package.json 文件中

2. 配置环境变量：

   ```
   export NODE_PATH='path-to-you-folder'/node_modules
   ```

   > 这个方式我没试验过，有可能会遇到一些问题。
