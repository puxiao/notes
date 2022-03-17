# Koa中使用TypeScript

## 环境搭建(逐步讲解版)

#### 第1步：创建项目

```
mkdir projectname
cd projectname
npm init -y
```

#### 第2步：安装Koa、Koa对应的TS规则

````
npm i --save koa
npm i --save-dev @types/koa
````

#### 第3步：安装TypeScript

````
npm i --save-dev typescript
````

#### 第4步：创建 tsconfig.json 文件

````
npx tsc --init
````

#### 第5步：修改 tsconfig.json 配置

各项配置，请参考：

````
{
  //特别提醒：属性值是不区分大小写的，例如：ES2017和es2017是没有区别的
  "compilerOptions": {
    "target": "es2017", //指定ECMAScript目标版本为ES2017(为了可以使用async/await)
    "module": "commonjs", //指定生成哪个模块系统代码
    "esModuleInterop": true, //让import可以导入module.exports=xxx
    "allowSyntheticDefaultImports": true, //允许从没有设置默认导出的模块中默认导入
    "strictNullChecks": true, //在严格的null检查模式下，null和 undefined值不包含在任何类型里，只允许用它们自己和any来赋值
    "noImplicitUseStrict": true, //模块输出中不包含 "use strict"指令
    "removeComments": false, //移除注释
    "preserveConstEnums": true, //保留const和enum声明
    "moduleResolution": "node", //决定如何处理模块，若不设置默认值为"classic"
    "experimentalDecorators": true, //启用实验性的ES装饰器，若不启用ts无法理解某些es2017新语法
    "noImplicitAny": false, //是否在表达式和声明上有隐含的any类型时报错，设置为false，即允许默认推断类型为any
    "outDir": "dist", //最终输出目录
    "noUnusedLocals": true, //若有未使用的局部变量则抛错，常见的警告提示：xxx已定义却从未被读取
    "noUnusedParameters": true, //若有未使用的参数则抛错
    "sourceMap": true, //生成相应的.map文件，利于调试时准确定位到错误位置
    "baseUrl": ".", //解析非相对模块名的基准目录
    //"rootDir": ".", //仅用来控制输出的目录结构
    "paths": {
      //定义目录别名，例如："@/components/*": ["./src/components/*"]
    },
    "allowJs": true, //允许编译javascript文件
    "typeRoots": [
      "node_modules/@types" //要包含的类型声明文件路径列表
    ],
    //"strict": true, //启用所有严格类型检查选项
    //"alwaysStrict": false, //以严格模式解析并为每个源文件生成 "use strict"语句
    //"skipLibCheck": true, //忽略所有的声明文件(*.d.ts)的类型检查
    //"forceConsistentCasingInFileNames": true, //禁止对同一个文件的不一致的引用
  },
  //以下目录不进行ts检查
  "exclude": [
    "node_modules",
    "dist"
  ],
  "compileOnSave": false //是否保存文件后进行自动编译
}
````



>  通过上面步骤，已经搭建了最基础的运行环境，但是存在2个问题：  
>
> 1. 程序调试时都是 `node xxx.js`，因此每次调试前都需要先执行  `tsc xxx.ts` 编译.ts文件
> 2. 每次修改某文件代码，都需要关闭原有服务，再重新打开服务
>
> 因此我们还需后面操作步骤，简便开发，提高效率。



#### 第6步：安装ts-node

````
npm i --save-dev ts-node
````

> ts-node 是自动将 .ts文件编译为 .js文件的插件

#### 第7步：安装nodemon

````
npm i --save-dev nodemon
````

> nodemon 是监测文件代码变更，如果变更则自动调用 ts-node 进行编译、编译完成后重启node服务，相当于热更新

#### 第8步：修改package.json

在 package.json的 script 中添加以下代码：

````
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc",
    "start": "tsc && node dist/app.js",
    "dev": "nodemon --watch 'src/**/*' -e ts --exec ts-node ./src/app.ts"
  },
````

> 编译项目：tsc 或 npm run build
>
> 编译并启动项目：npm start 或 npm run build
>
> 以热更新形式运行项目：npm run dev

至此 koa + typescript 最基础环境已搭建完成，但是真正开发 koa 还需要很多中间件，还需要下面步骤。

#### 第9步：安装各种 koa 中间件以及对应的 TS 解析规则

常见的 各种中间件对应的 TS 规则，官方已帮我们设定好，都在 npm @types/ 下。

> 具体都有哪些中间件的TS规则，可查看：https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types

假设我们需要安装 koa-router，那么对应需要安装的代码为：

````
npm i --save koa-router
npm i --save-dev @types/koa-router
````

同理，假设我们要安装 koa-bodyparser，对应代码为：

````
npm i --save koa-bodyparser
npm i --save-dev @types/koa-bodyparser
````

安装其他中间件 ，都以此类推。



## 环境搭建(集成精简版)

上面已经通过逐步讲解，充分说明了每一步安装对应的解释和原理，在实际项目中可以简化上面的步骤。

#### 第1步：创建项目

```
mkdir projectname
cd projectname
npm init -y
```

#### 第2步：安装各种NPM包

我们把安装代码可以集中简化为：

````
npm i --save koa koa-router koa-bodyparser
npm i --save-dev typescript ts-node nodemon @types/koa @types/koa-router @types/koa-bodyparser 
````


#### 第3步：创建 tsconfig.json 文件

````
npx tsc --init
````

#### 第4步：修改 tsconfig.json 配置

各项配置，请参考：

````
{
  //特别提醒：属性值是不区分大小写的，例如：ES2017和es2017是没有区别的
  "compilerOptions": {
    "target": "es2017", //指定ECMAScript目标版本为ES2017(为了可以使用async/await)
    "module": "commonjs", //指定生成哪个模块系统代码
    "esModuleInterop": true, //让import可以导入module.exports=xxx
    "allowSyntheticDefaultImports": true, //允许从没有设置默认导出的模块中默认导入
    "strictNullChecks": true, //在严格的null检查模式下，null和 undefined值不包含在任何类型里，只允许用它们自己和any来赋值
    "noImplicitUseStrict": true, //模块输出中不包含 "use strict"指令
    "removeComments": false, //移除注释
    "preserveConstEnums": true, //保留const和enum声明
    "moduleResolution": "node", //决定如何处理模块，若不设置默认值为"classic"
    "experimentalDecorators": true, //启用实验性的ES装饰器，若不启用ts无法理解某些es2017新语法
    "noImplicitAny": false, //是否在表达式和声明上有隐含的any类型时报错，设置为false，即允许默认推断类型为any
    "outDir": "dist", //最终输出目录
    "noUnusedLocals": true, //若有未使用的局部变量则抛错，常见的警告提示：xxx已定义却从未被读取
    "noUnusedParameters": true, //若有未使用的参数则抛错
    "sourceMap": true, //生成相应的.map文件，利于调试时准确定位到错误位置
    "baseUrl": ".", //解析非相对模块名的基准目录
    //"rootDir": ".", //仅用来控制输出的目录结构
    "paths": {
      //定义目录别名，例如："@/components/*": ["./src/components/*"]
    },
    "allowJs": true, //允许编译javascript文件
    "typeRoots": [
      "node_modules/@types" //要包含的类型声明文件路径列表
    ],
    //"strict": true, //启用所有严格类型检查选项
    //"alwaysStrict": false, //以严格模式解析并为每个源文件生成 "use strict"语句
    //"skipLibCheck": true, //忽略所有的声明文件(*.d.ts)的类型检查
    //"forceConsistentCasingInFileNames": true, //禁止对同一个文件的不一致的引用
  },
  //以下目录不进行ts检查
  "exclude": [
    "node_modules",
    "dist"
  ],
  "compileOnSave": false //是否保存文件后进行自动编译
}
````

#### 第5步：修改package.json

在 package.json的 script 中添加以下代码：

````
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc",
    "start": "tsc && node dist/app.js",
    "dev": "nodemon --watch 'src/**/*' -e ts --exec ts-node ./src/app.ts"
  },
````

> 编译项目：tsc 或 npm run build
>
> 编译并启动项目：npm start 或 npm run build
>
> 以热更新形式运行项目：npm run dev

至此 koa + typescript 基础环境已搭建完成。



## NPM 安装源配置

如果使用 npm 安装比较慢，依然不建议直接通过 cnpm 安装（据网上传闻 cnpm 安装会莫名缺失一些包）。

建议使用 npm 安装，然后 修改 npm 的安装源 registry。

推荐的方法是，在项目根目录下，新建一个  .npmrc 文件，文件内容如下：

````
registry=https://registry.npm.taobao.org
disturl=https://npm.taobao.org/dist
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
electron_mirror=https://npm.taobao.org/mirrors/electron/
chromedriver_cdnurl=https://npm.taobao.org/mirrors/chromedriver
operadriver_cdnurl=https://npm.taobao.org/mirrors/operadriver
selenium_cdnurl=https://npm.taobao.org/mirrors/selenium
node_inspector_cdnurl=https://npm.taobao.org/mirrors/node-inspector
fsevents_binary_host_mirror=http://npm.taobao.org/mirrors/fsevents/
````

这样当使用 npm 安装各种包时，默认都会使用 淘宝的NPM镜像源。



## Koa+TypeScript代码编写与传统Koa代码编写的差异

#### 第1处差异：引入模块的方式

传统 Koa 引入模块的代码如下：

````
const Koa = require('koa');
````

Koa + TypeScript 引入模块的代码如下：

```
import Koa from 'koa';
```

#### 第2处差异：模块导出的方式

传统 Koa 模块导出的代码如下：

````
module.exports = xxx;
````

Koa + TypeScript 模块导出的代码如下：

````
export default xxx;

//一个模块还可以同时导出多个对象
export aaaa;
export bbbb;
````

除了模块的 导入和导出 存在差异之外，其他地方代码编写都一样。



## 目前遗留的问题

#### 第1个遗留问题：每次打包前不能清除原有dist目录

tsc 编译 代码到 dist 文件夹时，无法做到自动清除dist之前的文件。

> 对于之前生成好的文件，若本次代码打包时并没不存在，则该文件会一直存留在 dist 中，需要手工删除。

像 webpack 中可以通过使用 clean-webpack-plugin 来实现该功能，但是在 typescript 中目前还不知道怎么配置。

<br>

> 以下内容更新于 2022.03.17

实际上实现起来很简单，就是在编译的命令中添加删除那个文件夹命令即可。

在 windows 中删除文件夹的命令是：`rd /s/q \"./dist\" `

> 注意上面的目录路径需要加引号



<br>

在 CentOS 中删除文件夹的命令是：`rm -rf ./dist`

> 目录路径不需要加引号



<br>

**当我们需要按照顺序执行多条命令时，可以将不同的命令使用 && 连接即可。**



<br>

于是，我们只需要根据编译的操作系统实际情况，将编译命令修改为：

```diff
"scripts": {
-    "build": "tsc",
+    "build": "rd /s/q \"./dist\" && tsc",
}
```

或

```diff
"scripts": {
-    "build": "tsc",
+    "build": "rm -rf ./dist && tsc",
}
```



<br>

**注意：删除目录前应先检查目录是否存在**

如果我们是一个新的项目，且从未编译过，那么项目中是不存在 `./dist` 这个目录的。

那么如果去执行删除 dist 目录的命令 `rd /s/q \"./dist\"` 会报错：系统找不到指定的文件。

> 当然我们可以先手工去创建一个 dist 目录来解决这个问题。

严谨的删除代码应该是：

```
(if exist \"./dist\" rd /s/q \"./dist\")
```

也就是：

```
"scripts": {
    "build": (if exist \"./dist\" rd /s/q \"./dist\") && tsc",
}
```

> 注意 条件判断 需要用小括号包裹



<br>

**添加其他命令：**

如果你有需要，还可以继续添加别的命令，例如将编译好的 dist 目录复制(或移动)到其他地方，下面以移动为例：

```
"scripts": {
    "build": "rd /s/q \"./dist\" && tsc && move ./dist ../xxx/xxx/build",
}
```

> 注意：
>
> 如果上面的代码的是将 dist 目录移动到其他地方，并且将目录名字修改为 build。
>
> 如有需要反复编译，你还需要提前添加 删除 build 的目录，然后再执行移动。



<br>

> 以上内容更新于 2022.03.17


<br>

## 补充说明

网上一些其他教程中，还会提到关于 eslint 的相关配置。

本人认为 typescript 已经做了超强的代码自动校验，使用 typescript 后完全没有必要再使用 eslint 。

推荐在 VSCode 插件中安装代码格式化工具：Beautify

