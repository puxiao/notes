# React学习笔记

## 安装react并初始化
##### 1、安装：npm install -g create-react-app  

##### 2、创建hello-react目录并初始化：npx create-react-app hello-react  

注意：  
1. 目录名不允许有大写字母  
2. 初始化过程比较慢，大约需要5-10分钟  
3. 如果报错：npm ERR! Unexpected end of JSON input while parsing near '...n\r\nwsFcBAEBCAAQBQJd'， 解决方法：npm root -g 找到本机npm全局安装目录，cd 进入该目录，执行清除缓存：npm cache clean --force，然后再次初始化。  

##### 3、启动项目：cd hello-react、npm start  

默认将启动：http://localhost:3000  

