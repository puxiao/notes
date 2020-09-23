# Nodejs(Koa)常用中间件

#### VSCode中nodejs语法提示：@types/node  
安装代码：npm i @types/node -D  

#### get或post请求参数解析：koa-bodyparser
安装代码：npm i koa-bodyparser -S

#### koa路由：koa-router  
安装代码：npm i koa-router -S

#### mySQL连接：mysql  
安装代码：npm i mysql -S

#### mongoDB连接：mongodb | mongoose  
安装代码：npm i mongodb -S  
补充说明：
1. mongodb 为 mongoDB 官方提供的 npm 连接数据库模块、mongoose 为第三方封装好，更加便于开发使用的 npm 包  
2. 对于 mongoDB 初学者而言，更加建议使用 mongodb ，因为这样可以完全利于学习，而不是使用别人封装好的  

#### 网络请求：axios  
安装代码：npm i axios -S

#### 封装 axios POST 数据：sq  
安装代码：npm i sq -S  
补充说明：由于不是所有浏览器都支持 URLSearchParams，所以建议使用 sq 来封装 axios POST 请求的 body 数据  

#### 服务器页面渲染：art-template | koa-art-template
安装代码：npm i art-template -S  
安装koa-art-template代码：npm i koa-art-template -S

#### Session管理：session  
安装代码：npm i koa-session -S

#### Token管理：token
安装代码：npm i koa-jwt -S

#### JWT：jsonwebtoken
安装代码：npm i jsonwebtoken -S

#### Redis管理：redis
安装代码：npm i redis --save

#### 环境变量：cross-env
安装代码：npm i --save-dev cross-env

#### 进程守护：pm2
安装代码：npm i --save pm2

#### TypeScript：typescript
安装代码：npm i --save-dev typescript  
补充说明：如果 Nodejs 或 Koa 中使用 TypeScript，则引入包由 const xxx = require('xxx') 改为 import xxx from 'xxx'  

#### 各个包的TS声明文件：@types/xxx
安装代码：npm i --save-dev @types/xxx

#### Content-Type常见类型：mime-types
安装代码：npm i --save mime-types

#### 常见输入文本校验(自己写的npm包)：input-value
安装代码：npm i input-value -S
