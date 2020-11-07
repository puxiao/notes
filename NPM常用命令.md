# npm常用命令

## 安装模块

安装当前项目中package.json中所有声明的依赖模块(创建和下载node_modules)：npm install  新拿到别人的项目，需要此命令来下载各种依赖  

当前项目安装模块(仅下载到node_modules文件夹中)：npm install xxx 或 npm i xxx  

当前项目安装(保存到package.json中的运行依赖)：npm install --save xxx 或 npm i -S xxx  

当前项目安装(保存到package.json中的开发依赖)：npm install --save-dev xxx 或 npm i -D xxx  

全局安装：npm install -g xxx  

安装特定版本：npm install xxx@x.x.x  特定版本形式为 xxx + @ + 版本号  

安装模块对应的 TypeScript 规则，例如 node 的TS规则： npm install @types/node


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


## 卸载模块

当前项目卸载模块：npm uninstall --save | --save-dev xxx  

全局卸载模块：npm uninstall -g xxx  


## 初始化项目

进入空白项目目录，初始化：npm init  过程中需要询问，可以修改或摁回车采用默认值  

或者直接采用默认值，过程中不询问：npm init -y  可以在初始化后手工修改package.json中的值 


## 查看已安装模块  

查看全局安装模块的目录：npm root -g  

查看当前目录已安装模块(包括依赖模块)：npm list 或 npm ls  

查看已全局安装的模块列表(包括依赖模块)：npm list -g  或 npm ls -g  

查看已全局安装的模块列表(仅一级主模块)：npm list -g --depth 0  

查看当前目录中已安装模块里面的某模块信息：npm list xxx  返回该模块名称和版本号

查看已全局安装的某模块信息：npm list xxx -g 


## 查看模块在npm平台中的版本和信息

查看npm中某模块的版本信息：npm info xxx  会列出npm中该模块历史所有版本号及信息  

查看npm中某模块的最新版本号：npm view xxx version  请注意 version 是固定单词，不是数字  

查看npm中某模块的所有版本号：npm view xxx versions  只会显示所有版本号，不会显示详细信息  


## 清除缓存

强制清除缓存：npm cache clean --force 或 npm cache clean -f  


## npm执行脚本
执行package.json中scripts中定义好的脚本：npm run xxx  其中xxx在package.json中scripts里定义的脚本  

查看当前可执行脚本的列表：npm run  将列出可执行脚本的列表  


## npx执行脚本

执行node_modules中某模块：npx xxx  例如执行webpack打包 npx webpack  


## 关于package.json中scripts定义的特别说明：  

1、脚本定义形式为 "xxx":"xxxx xxxx"  
2、若脚本中需要同时执行2个不同命令，形式为："xxx":"xxxx xxx01 && xxx02"  注意是2个&  
3、若脚本中需要先后执行 2个不同命令，形式为： "xxx":"xxxx xxx01 & xxx02"  注意是1个&  
4、npm内置了4个脚本简写："test"、"start"、"stop"、"restart"。 例如npm test 是 npm run test的简写、 npm start 是 npm run start的简写  
5、通常执行命令要加参数，采用 --xxxx的形式  
6、在windows和linux中，环境变量书写方式不同，因此如果想在执行 node xxx.js 中想加入环境变量，为了确保环境变量兼容，通常需要使用cross-env这个模块(需要先npm i cross-env --save-dev)，脚本形式为："xxx":"cross-env NODE_ENV=xx node xxx.js"，NODE\_ENV为约定的环境变量名，xx为变量的值。  
7、若执行命令不是node xxx.js，而是使用 npx xxx 执行node_modules中某模块，在package.json中的scripts中可省略掉npx。例如npx webpack对应scripts中的写法 "build":"npx webpack" 可简写为 "build":"webpack" 


## 其他

查看当前项目的可执行目录的绝对路径：npm bin  
备注：无论在当前项目下的哪个目录里执行该语句，返回的都是该项目的node_modules/.bin的绝对路径


## 发布自己的npm包

#### 第一步：检查本机npm源

确认是官方源(https://registry.npmjs.org/)而非淘宝cnpm  
检查npm源：npm get registry  
若不是则修改为官方的地址：npm config set registry https://registry.npmjs.org  

若不想修改，则可以在最终发布时，设定--registry源参数，如下：  
npm publish --registry=https://registry.npmjs.org  


#### 第二步：检查本机是否npm账户已登录  

检查已登录账户：npm whoami  

若已登录，会显示用户名、  
若未登录，执行结果会显示 npm ERR! code ENEEDAUTH....  

退出当前已登录账户：npm logout  

登录npm：npm login  
需要依次输入：Username、Password(输入密码时屏幕不可见)、Email  

#### 第三步：发布

若账户没有问题，进入要发布的项目文件夹，进行发布：npm publish  
