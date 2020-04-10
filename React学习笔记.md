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

6、希望数据发生改变，忘掉DOM操作，改成数据操作(setState())。  

7、使用数组map循环更新li，一定要给li添加对应的key值，否则虽然正常运行，但是会报错误警告。不建议直接使用index作为key值。  

8、永远不要直接操作修改this.state.xxx=xxx，一定要用setState()来修改。  

9、先复制出一份this.state.xxx的值，然后修改，修改完成后再通过setState()赋值。  

10、在最新的react版本中，为了提高更新性能，推荐采用异步的方式更新数据。具体使用方式为：setState((prevState) => {return {xxx}})。其中参数prevState指之前的数据值(即this.state)，return的对象指修改之后的数据值。pervState参数还可以省略，即 setState(() => {return {xxx}});  

11、在render(){return <xx></xx>}中写注释，格式为：{/* xxxxx */}或{//xxxx}，注意如果使用单行注释，最外的大括号必须单独占一行。注释尽在开发源代码中显示，在导出的网页中不会有该注释。 
 
12、给标签添加样式时，推荐使用className，不推荐使用class。如果使用class虽然运行没问题，但是会报错误警告，因为样式class这个关键词和js中声明类的class冲突。类似的还有标签中for关键词，推荐改为htmlFor。  

13、直接将xxx赋值给某标签，作为该标签的内容时会进行转义(若xxx为<h1\>xxx</h1\>，则以纯文本形式展示)。若不想转义，则在属性中设置dangerouslySetInnerHTML={{__html:xxx}}，如无必要，尽量不要这样设置，容易造成xss攻击。  

14、通常情况下，react是针对组件开发，并且只负责对html中某一个div进行渲染，那么意味着该html其他标签不受影响，这样引申出来一个结果：一个html既可以使用react，也可以使用vue，两者可以并存。 
 
15、为了方便调试代码，可以在谷歌浏览器中安装React Developer Tools插件。安装后可在谷歌浏览器调试模式下，查看component标签下的内容。  若访问本机react调试网页则该插件图标为红色、若访问导出版本的React网页则该插线显示为蓝色、若访问的网页没使用react框架则为灰色。  

## "声明式开发" 概念解释

"声明式开发"：基于数据定义和数据改变，视图层自动更新。  
"命令式开发"：基于具体执行命令更改视图，例如DOM操作修改。

注意：声明式开发并不是不进行DOM操作，而是把DOM操作频率降到最低。    

## "单项数据流" 概念解释

react框架的原则中规定，子组件只可以使用父组件传递过来的xxx属性对应的值或方法，不可以改变。  

数据只能单向发生传递(父传向子，不允许子直接修改父)，若子组件想修改父组件中的数据，只能通过父组件暴露给子组件的函数(方法)来间接修改。  

react框架具体实现方式是设置父组件传递给子组件的"数据值或方法"仅仅为可读，但不可修改。  

为什么要做这样的限制？  
因为一个父组件可以有多个子组件，如果每个子组件都可修改父组件中的数据(子组件之间彼此共用父组件的数据)，一个子组件的数据修改会造成其他子组件数据更改，最终会让整个组件数据变得非常复杂。  

为了简化数据操作复杂程度，因此采用单向数据流策略，保证父组件数据的唯一最终可修改权归父组件所有。  

## "视图层渲染框架" 概念解释

react框架自身定位是"视图层渲染框架"，单向数据流概念很好，但是实际项目中页面会很复杂。  

例如顶级组件Root中分别使用了组件A(由子组件A0、A1、A2构成)、组件B(由子组件A0、A1、A2构成)、组件C(由子组件C0、C1、C2构成)，若此时组件A的子组件A2想和组件C的子组件C1进行数据交互，那么按照单向数据流的规范，数据操作流程为 A2 -> A -> Root -> C - C1，可以看出操作流程非常复杂。  

**所以实际开发中，React框架必须结合其他"数据层框架"(例如Redux、Flux等)**。  

## "函数式编程" 概念解释

react自定义组件的各种交互都在内部定义不同的函数(js语法规定：类class中定义的函数不需要在前面写 function关键词)，因此成为函数式编程。不像原生JS和html交互那样，更多侧重html标签、DOM操作来实现视图和交互。  

函数式编程的几点好处：  
1、可以把复杂功能的处理函数拆分成多个细小的函数。  
2、由于都是通过函数来进行视图层渲染和数据交互，更加方便编写"前端自动化测试"代码。  





