# Nodejs(Koa)中使用目录别名alias

## 书写多级相对路径的困扰

在Nodejs或Koa项目中，想引入自定义模块通常是这样写的：

```
const xxx = require('../xx/xx')
```

如果模块目录结构比较深，甚至可能出现以下代码：

```
const xxx =require('../../../xx/xx')
```

如果 `../` 出现次数多了，会让代码可读性变差，万一哪天手抖少写了一个 ../ 也不容易第一时间被发现。



这种情况也会出现在前端项目中，但是由于前端架构基本都采用类似 webpack 或 rollup 编译，可以通过修改配置，添加 alias(目录别名) 来解决。

例如 Vue、React、Taro架构都有对应的 alias 配置方法，使用目录别名  @xxx 后，那么引入模块时，路径通常可以写成：

```
import xxx from '@xxx/xx'
```

目录别名(alias) 的本质是把 相对路径 转换成 绝对路径，所以无论当前所处哪个目录级别，都可以通过 @xxx 来找到对应的目标文件。



## Nodejs(Koa)中变相实现alias

首先说一下，后端项目本身没有编译这个环节，所以 webpack 配置 alias 那一套方式无法应用在 Nodejs、Koa 中。

但是在 NPM 中，已经有很多人贡献了自己的代码模块，变相实现了 alias ：

1. require-alias
2. module-alias
3. link-module-alias
4. alias-hq
5. ts-node
6. tsconfig-paths
7. ...

经过本人实际对比，目前觉得最好用的是：module-alias，下面就讲一下如何使用 module-alias。



## module-alias 使用介绍

**官网：**  https://www.npmjs.com/package/module-alias

**安装：** 

```
npm i --save module-alias
```

**配置：** 

module-alias 一共有 2 种配置方式：

1. 方式一：通过修改 Nodejs(Koa) 项目的 package.json
2. 方式二：通过调用 module-alias 的 addAliases() 方法添加 alias 配置项

**启用：** 配置的方式不同，启动(引入) module-alias 的方式也不一样



## 配置方式一：修改 Nodejs(Koa) 项目的 package.json

**第1步：** 编辑项目的 package.json，添加以下内容：

```
{
    ...
    "_moduleAliases": {
        "@/router": "src/router",
        "@/db": "src/db",
        "@/config": "src/config"
    }
}
```

**第2步：** 编辑项目启动页，例如 app.js，在顶部添加：

```
require('module-alias/register')

//如果项目使用 TypeScript，则引入方式改为
import ('module-alias/register')
```

至此，配置完成，可以在模块中使用 @/router、@/db、@/config 这些目录别名了。



这种配置方式的特点：

1. **优点：** 简单，方便
2. **缺点：** alias目录写死在 package.json 中，不够灵活


如果是一般的 Nodejs(Koa)项目，也不会有什么问题，但是刚好不巧，本人目前正在开发的一个项目，使用了 Koa + TypeScript + Docker，那么项目经过 TS 编译后目录是 dist 而非 src，dockerfile 拷贝的是 dist 目录而非 src 目录，就会出现本机和服务器上目录不一致导致 node 启动不了。

还好，module-alias 还有第二种配置方式，可以解决这个问题。



## 配置方式二：通过 module-alias 的 addAliases() 方法添加 alias 配置项

**第1步：** 在项目中，创建 src/alias/index.js，内容如下：

```
const path = require('path')
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
    '@/config': path.resolve(__dirname, '..', 'config'),
    '@/db': path.resolve(__dirname, '..', 'db'),
    '@/router': path.resolve(__dirname, '..', 'router'),
})

moduleAlias()
```

> 补充说明：
>
> 1. 由于我的项目中，app.js 位于 src 目录中，所以上述代码中配置的路径为：`'@/config': path.resolve(__dirname, '..', 'config') `
> 2. 如果你的项目 app.js 不在 src 目录中，而是和 src 平级，那么上述代码应该修改为：`'@/config': path.resolve(__dirname, '..', 'src/config')`

**第2步：** 变基项目启动页，例如 app.js，在顶部添加：

```
require('./alias/index')
```

至此，配置完成，可以在模块中使用 @/router、@/db、@/config 这些目录别名了。



这种配置方式的特点：

1. **优点：** 不用修改项目 package.json、设置目录别名对应路径时，事实上使用的是 “相对路径” 
2. **缺点：** 没有

推荐使用这种方式进行 module-alias 配置。



因为我的项目中使用了 TypeScript，那么上面引入模块的相关代码，对应修改为：

```
//src/alias/index.ts
import path from 'path'
import moduleAlias from 'module-alias'

//app.ts
import ('./alias/index')
```

同时还要修改 tsconfig.json ，在里面添加对应的配置：

```
{
    "compilerOptions": {
        ...
        "paths": {
            "@/config/*": ["./src/config/*"],
            "@/db/*": ["./src/db/*"],
            "@/router/*": ["./src/router/*"]
        }
    }
}
```



至此，可以在Nodejs(Koa) 中，愉快地使用 alias 目录别名 了。



## module-alias 实现的原理

为了注册目录别名，module-alias 会修改 Nodejs 内部的 Module._resolveFilename 方法，当在使用 require 或 import 时，首先检查是否以特定字符串开头，例如上面示例中的 @/router、@/db，当发现是这些字符串开头，则会使用 alias 中定义对应的绝对路径替换该字符串，从而实现了任意深度级别的目录下，都可以找到对应目标文件。

为了使用目录别名，module-alias 会修改 Nodejs 内部的 Module._nodeModulePaths 方法，这样目录别名用起来就会好像和使用 node_modules 一样。

从而实现了任意深度级别的目录下，都可以找到对应目标文件。

> 这段话是从 module-alias 官方的README.md 中翻译过来。

如果想查看 module-alias 源码，可以访问：https://github.com/ilearnio/module-alias/blob/dev/index.js



## 会不会因为使用 module-alias 而降低 Nodejs(Koa) 的性能？

虽然默认使用 `../../xxx/xx` 这种相对路径敲代码时候不方便，但是它是毕竟是默认通用的做法。

而使用 module-alias 后虽然 require 或 import 时确实方便，但 module-alias 又额外嵌套了一层处理，会不会影响 Nodejs(Koa) 的性能？

不用担心！

如果稍微理解 Nodejs 的 require 运行机制你就会明白，事实上 Nodejs 只有第一次 require 时会真正读取模块文件，以后再次 require 相同模块时，都会直接从 内存里查找并读取，因此所谓的 “ module-alias 对 requrie 又额外嵌套了一层处理” 对性能的影响几乎没有。

以上仅为个人观点，仅供参考。
