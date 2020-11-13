# React-Typescript中使用Echarts

> 本文中使用 yarn 安装各种所需模块，而不是 npm。
>
> yarn 的命令和 npm 非常像，可查看我的另外一篇文章：[Yarn安装与使用.md](https://github.com/puxiao/notes/blob/master/Yarn%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md)



## 第1步：全局安装Create-React-App

```
yarn global add create-react-app
```

> 为了确保你的 create-react-app 是最新的，我建议你先卸载之前安装过的 create-react-app，重新安装最新版本。本文使用的是 creat-react-app，其中 react 版本为 17.0.1
>
> 卸载命令：
>
> ```
> npm uninstall -g create-react-app
> 或
> yarn global remove create-react-app
> ```



## 第2步：创建基本环境 React + TypeScript + Scss

#### 1、初始化 React + TypeScript 项目：

```
yarn create react-app test-rect --template typescript
```

#### 2、修改tsconfig.json配置(可选操作)

**建议在 tsconfig.json compilerOptions 中增加以下内容：**

```
{
  "compilerOptions": {
    ...
    "noUnusedLocals": true, //有未使用的变量，则报错
    "noUnusedParameters": true, //有未使用的参数，则报错
    "sourceMap": true, //测试开发阶段，为了快速定位错误建议设置为 true，待到正式发布时修改为 false
    "removeComments": false, //删除注释，待到正式发布时修改为 true
  }
}
```

**特别说明：**目前 create-react-app 4.0.0 版本中，tsconfig.json 是无法配置 alias 的，配置就会报错。

所以这里就不再配置 alias，但还是把配置代码先贴出来，以便后续 bug 修复后继续使用。

```
"baseUrl": "./src", //源代码目录，这里设置是为了给 paths 使用
"paths": {
  "@/components/*": ["components/*"]
}
```

#### 3、添加Scss/Sass支持

```
//sass最新版本为 5.0.0
//但是由于 create-react-app 中的 sass-loader 目前不支持 sass 5，所以只能先安装 sass 4
yarn add node-sass@4.14.1 --dev
```

安装完成过后，即可将项目中的 .css 文件修改为 .scss 文件



## 第3步：整理规划src目录结构(可选操作）

常见的项目 src 目录结构，应该如下：

```
src
|_ components/
|_ hooks/
|_ pages
|_ app.tsx
|_ index.tsx
```

components 用来存放各种自定义组件、hooks 目录用来存放自定义 react hooks、pages 目录用来存放 页面。

在此基础上，可以再次增加其他目录，例如 types(类型声明)、config(配置文件)等等。



**提醒：** 每个组件或页面都应该是一个独立的目录，该目录包含：

1. index.scss：组件或页面的样式
2. index.tsx：组件或页面本身



> 以上仅为个人推荐配置方式，当然你可以完全根据自己喜好，自己设定代码目录结构



## 第4步：安装Echart模块

```
yarn add echarts @types/echarts --save
```



## React 使用 Echarts 流程说明

> 以下是整个使用Echart的逻辑，因此特别划重点，一定要搞明白！

#### React中使用Echarts，需要知道的知识点

1、Echarts 是基于原生 JS 的库，而不是 React 组件，需要将 “图表” 挂载到 DOM

2、echarts.init(xxx-dom) 是创建 “图表” 的入口函数，该函数将创建创建真正的图表，并挂载到 xxx-dom 中

3、每一个图表 对应一个 DOM

4、图表实例通过 setOption(option) 来设置(更新)数据

#### React针对以上Echarts特性，对应的 hooks

1、使用 useRef 来勾住 jsx 中的某个 DOM

2、使用 useEffect( () => {}, [] ) 来勾住 React 第一次挂载，并通过 echarts.init(xxx-dom) 创建出真正的图表

3、使用 useState 来勾住 创建出的真正图表，以便以后做各种更新操作

4、使用 useEffect( () => {}, [xxx-echart,option] ) 来不断监听组件传递过来的数据变化，并更新图表数据



## 第5步：编写Hello World (封装自己的Echart)

> 细节不过多说，此处只演示 2 个组件源码
>
> 1. 子组件为一个图表，图表是什么类型，由 配置数据 option 中 xAxis.type 的值决定
> 2. 父组件负责调用子组件并传递图表配置数据

**父组件：**

```
import React from 'react'
import { EChartOption } from 'echarts'
import Echart from '../../components/echart'

import './index.scss'

const option: EChartOption = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line'
    }]
}

const IndexPage: React.FC = () => {
    return (
        <Echart option={option} />
    )
}

export default IndexPage
```



**子组件：**

```
import React, { useState, useRef, useEffect } from 'react'
import echarts, { EChartOption, ECharts } from 'echarts'

import './index.scss'

interface EchartProp {
    option: EChartOption
}

const Echart: React.FC<EchartProp> = ({ option }) => {

    const chartRef = useRef<HTMLDivElement>(null) //用来勾住渲染后的 DOM
    const [echartsInstance, setEchartsInstance] = useState<ECharts>() //用来勾住生成后的 图表实例对象

    //仅第一次挂载时执行，将 DOM 传递给 echarts，通过 echarts.init() 得到真正的图表 JS 对象
    useEffect(() => {
        if (chartRef.current) {
            setEchartsInstance(echarts.init(chartRef.current))
        }
    }, [])

    //监听依赖变化，并根据需要更新图表数据
    useEffect(() => {
        echartsInstance?.setOption(option)
    }, [echartsInstance, option])

    return (
        <div ref={chartRef} className='echarts' />
    )
}

export default Echart
```

