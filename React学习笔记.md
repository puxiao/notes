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


## 自定义组件基础知识

1、自定义组件和入口文件，顶部都需要引入react：import React from 'react';  
2、自定义组件必须以大写字母开头、默认网页原生标签还以小写开头；  
3、自定义组件render(){return <Xxx></Xxx>}，必须且只能有一个最外层标签；  
4、如果不希望设定最外层的标签，那么可以使用react(16+版本)提供的占位符Fragment来充当最外层标签；  
import React,{Component,Fragment} from 'react';  
render(){return <Fragment>xxxxxxx</Fragment>}  
5、如果你写了constructor(props){super(props);}但是还没有写this.state={}，默认会报错误警告：Useless constructor. eslint(no-useless-constructor)，constructor中加上this.state={}即可消除警告。  

