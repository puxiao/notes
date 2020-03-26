# npm常用命令

## 安装模块

当前项目安装模块(仅下载到node_modules文件夹中)：npm install xxx 或 npm i xxx  

当前项目安装(保存到package.json中的运行依赖)：npm install --save xxx 或 npm i -S xxx  

当前项目安装(保存到package.json中的开发依赖)：npm install --save-dev xxx 或 npm i -D xxx  

全局安装：npm install -g xxx  


## 查看安装模块  

查看全局安装模块的目录：npm root -g  

查看当前目录已安装模块(包括依赖模块)：npm list 或 npm ls  

查看已全局安装的模块列表(包括依赖模块)：npm list -g  或 npm ls -g  

查看已全局安装的模块列表(仅一级主模块)：npm list -g --depth 0  


## 清除缓存

强制清除缓存：npm cache clean --force 或 npm cache clean -f  


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
