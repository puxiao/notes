# React-TypeScript中使用Echarts

## 目录

* [第1步：全局安装Create-React-App](#第1步：全局安装Create-React-App)
* [第2步：创建基本环境 React + TypeScript + Scss + Alias](#第2步：创建基本环境%20React%20+%20TypeScript%20+%20Scss%20+%20Alias)
* [第3步：整理规划src目录结构(可选操作)](#第3步：整理规划src目录结构(可选操作))
* [第4步：安装Echart模块](#第4步：安装Echart模块)
* [第5步：编写Hello World (封装自己的Echart)](#第5步：编写Hello%20World%20(封装自己的Echart))
* [第6步：更加精细化封装Echart组件](#第6步：更加精细化封装Echart组件)
* [组件中使用百度地图](#组件中使用百度地图)
* [代码补充](#代码补充)



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



## 第2步：创建基本环境 React + TypeScript + Scss + Alias

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

#### 3、添加Scss/Sass支持

```
//sass最新版本为 5.0.0
//但是由于目前 create-react-app 中的 sass-loader 目前不支持 sass 5，所以只能先安装 sass 4
yarn add node-sass@4.14.1 --dev
```

安装完成过后，即可将项目中的 .css 文件修改为 .scss 文件

#### 4、添加alias支持

个人建议通过 react-app-rewired 和 react-app-rewire-alias 来实现 alias。

具体操作可参考：[配置alias路径映射](https://github.com/puxiao/notes/blob/master/Create-React-App%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md#%E9%85%8D%E7%BD%AEalias%E8%B7%AF%E5%BE%84%E6%98%A0%E5%B0%84)

> 由于之前写示例时并未配置 alias，所以本文后面的示例实际代码中，引入模块时并未真正使用到 alias，但这并不影响任何代码运行效果，此处仅做告知。



## 第3步：整理规划src目录结构(可选操作)

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
        echartsInstance?.clear() //清除之前的数据缓存
        echartsInstance?.setOption(option)
    }, [echartsInstance, option])

    return (
        <div ref={chartRef} className='echarts' />
    )
}

export default Echart
```



## 第6步：更加精细化封装Echart组件

在第5步时，虽然已经完成了 Echarts 的 基础示例，但是上述代码中对 Echart 的封装不够精细化。

**接下来对 Echart 进行以下几点的封装：**

1. 给组件添加 key 属性，以便 echarts 进行多组件联动

2. 给组件添加 style 属性，默认值设置为：{ width: '100%',  height:'100%' }

3. 添加浏览器窗口发小变化事件的侦听。假设组件高宽并非固定，而是采用动态计算得出的，例如我们设定的默认 style 高宽为 100%，那么需要在组件所在容器的 div 尺寸发生变化后，重新渲染组件。

   > echarts 默认并不支持 自动随着父级容器尺寸变化而进行缩放

**我们可以定义 Echart 组件的参数如下：**

```
export type EchartProp = {
    option: EChartOption,
    key?: string,
    style?: {
        width: string,
        height: string
    }
    className?: string
}
```

**优化可选参数，将 undefined 值剔除：**

由于存在可选参数，为了避免一些不必要的属性赋值，所以我们可以将得到的组件参数先进行解构，然后再剔除未被赋值的可选参数。

```
const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key as keyof typeof obj] === undefined) {
            delete obj[key as keyof typeof obj]
        }
    }
    return obj
}
```

> 在 TS 严格模式下，直接使用 obj[key] 会产生报错，必须使用 obj[key as keyof typeof obj] 才可以

**最终改造后的 自定义 Echart 组件代码如下：**

```
import React, { useState, useRef, useEffect } from 'react'
import echarts, { EChartOption, ECharts } from 'echarts'

export type EchartProp = {
    option: EChartOption,
    key?: string,
    style?: {
        width: string,
        height: string
    }
    className?: string
}

const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key as keyof typeof obj] === undefined) {
            delete obj[key as keyof typeof obj]
        }
    }
    return obj
}

const Echart: React.FC<EchartProp> = ({ option, key, className, style = { width: '100%', height: '100%' } }) => {

    const chartRef = useRef<HTMLDivElement>(null)
    const [echartsInstance, setEchartsInstance] = useState<ECharts>()

    useEffect(() => {
        setEchartsInstance(echarts.init(chartRef.current as HTMLDivElement))
    }, [])

    useEffect(() => {
        const handleResize = () => {
            echartsInstance?.resize()
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [echartsInstance])

    useEffect(() => {
        echartsInstance?.setOption(option)
    }, [echartsInstance, option])

    return (
        <div ref={chartRef} {...removeUndefined({ option, key, className, style })} />
    )
}

export default Echart
```



## 组件中使用百度地图

在 Echarts 的某些组件中，会使用到百度地图。

> 应国家地图使用规范要求，百度地图已经下架了用户自己创建的地图数据包，例如 china.json，要求使用地图必须严格规范，因此使用百度地图称为首选。

**在使用包含 百度地图 的组件中，关于百度地图相关知识点，有以下内容：**

1. 每一个百度地图项目，都应该去百度地图开放平台申请亲一个 APP，得到 APP对应的 key

2. 假设需要自定义地图外观样式，那么还需要在百度地图中心，创建自己的百度地图样式，得到自定义地图样式的 styleId

3. 在 public/index.html 中，网页 <head\> 中添加引入 百度地图 SDK，目前推荐使用 api 3.0，代码如下：

   ```
   <script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&amp;ak=2KxVITWlyImK24SghDcdwP8qKBCkFZX6&amp;"></script>
   ```

   > 上述代码中的 ak=2KxVITWlyImK24SghDcdwP8qKBCkFZX6&amp 是我自己申请的，将来你需要自己去百度地图开放平台免费申请自己的key。

4. 在自定义 地图 相关 React 组件中，引入 bmap.js，只有引入这个才可以让 React 正常与网页进行地图显示与交互

   ```
   import 'echarts/extension/bmap/bmap'
   ```

5. 包含百度地图的组件，在组件配置项中，比一般的组件要额外多出一个字段 bmap，请注意这里的 bmap 是为了配置百度地图，和 引入的 bmap.js 相互呼应，但是 2 者并不是同一个对象：一个是bmap.js，另外一个是 bmap.js 对应的配置项 bmap

6. 请注意：在最新版的 @types/echarts  4.9.1 中，组件配置项 MapECartOption 中不存在 bmap 字段，需要我们手工的去拓展这个字段，不然当我们添加 bmap 字段时，TS 会报错。

   ```
   interface MapECartOption extends EChartOption {
       bmap?: object
   }
   ```

   > 事实上 bmap 有自己特殊的定义规范，但是为了简化，我们暂时选择直接将 bmap 数据类型定义为 object

7. 特别说明：在 bmap 配置相中，mapStyleV2 字段的值应该设置为：mapStyleV2: { styleId: '86249896ec18867e1ef906a088e8b9b1' }，这样就会以我们自定义的百度地图样式来显示。

   > 如果不用 mapStyleV2，而是使用 mapStyle，则使用内置固定的样式来显示百度地图，例如：
   >
   > ```
   > mapStyle: {
   >    styleJson: [{
   >        'featureType': 'water',
   >        'elementType': 'all',
   >        'stylers': {
   >            'color': '#d1d1d1'
   >        }
   >    }, {
   >        'featureType': 'land',
   >        'elementType': 'all',
   >        'stylers': {
   >            'color': '#f3f3f3'
   >        }
   >    }, 
   >    ....
   > ```



**完整的示例代码：**

最终，附上一个简单的，但完整的 包含百度地图的 Echarts 组件示例：

> 注意：以下代码中的 <Echart/\> 就是我们在本文 `第6步：更加精细化封装Echart组件` 中自己封装的 echarts 组件。

```
import React from 'react'
import { EChartOption } from 'echarts'
import 'echarts/extension/bmap/bmap'
import Echart from '../echart'

// 以下为我们内部定义好的 Echart 组件源数据，这段代码实际和 Echart 示例并无特别大的关联
type dataType = {
    name: string,
    value: number
}[]

const data: dataType = [
    { name: '廊坊', value: 193 },
    { name: '菏泽', value: 194 },
    { name: '合肥', value: 229 },
    { name: '武汉', value: 273 },
    { name: '大庆', value: 279 }
];

type geoCoorMapType = { [key: string]: number[] }
const geoCoordMap: geoCoorMapType = {
    '廊坊': [116.7, 39.53],
    '菏泽': [115.480656, 35.23375],
    '合肥': [117.27, 31.86],
    '武汉': [114.31, 30.52],
    '大庆': [125.03, 46.58]
};

let convertData = function (data: dataType) {
    let res = [];
    for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};
// 以上为我们内部定义好的 Echart 组件源数据，这段代码实际和 Echart 示例并无特别大的关联


//我们自己扩展出 bmap 字段
interface MapECartOption extends EChartOption {
    bmap?: object
}

//地图组件的配置数据，请重点留意 bmap 字段对应的各项配置
const option: MapECartOption = {
    tooltip: {},
    bmap: {
        center: [104.114129, 37.550339],
        zoom: 5,
        roam: true,
        mapStyleV2: {
            styleId: '86249896ec18867e1ef906a088e8b9b1'
        }
    },
    series: [
        {
            name: 'PM2.5',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: convertData(data),
            symbolSize: function (val: any) {
                return val[2] / 10;
            },
            itemStyle: {
                normal: {
                    color: '#c23531'
                }
            }
        },
        {
            name: 'top5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: convertData(data.sort(function (a, b) {
                return b.value - a.value;
            }).slice(0, 5)),
            symbolSize: function (val: any) {
                return val[2] / 10;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            itemStyle: {
                normal: {
                    color: '#c23531'
                }
            }
        }
    ]
}

const MidOne: React.FC = () => {
    return (
        <Echart option={option} />
    )
}

export default MidOne
```



**public/index.html 对应源码：**

> 在默认的 index.html 基础上，向 <head\>  添加引入 百度地图 sdk

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="Web site created using create-react-app" />
  <title>Data Visualization</title>
  <script type="text/javascript"
    src="https://api.map.baidu.com/api?v=3.0&amp;ak=2KxVITWlyImK24SghDcdwP8qKBCkFZX6&amp;"></script>
</head>

<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
</body>

</html>
```



## 代码补充

更多 React + TS + Echarts 源码，可参考我写的一个 demo 项目：https://github.com/puxiao/react-ts-echarts
