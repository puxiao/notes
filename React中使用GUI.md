# React中使用GUI

**图形用户界面( Graphical User Interface ) 简称 GUI。**

说简单点，就是用来在 JS 项目中调试配置不同参数的一套 UI 组件。

日常开发中，场景可能用到的配置参数通常是：数字、字符串、颜色、布尔值。



#### JS中使用的GUI

在 JS 中，一个知名的 GUI 类库为：dat.gui。

dat.gui 官网地址： https://github.com/dataarts/dat.gui



#### React中使用的GUI

因为 dat.gui 是针对原生 JS 的，若在 React 的 JSX 语法中使用略微繁琐。

react-dat-gui 这个库应运而生，react-dat-gui 是基于 dat.gui 封装而成。

官方地址：https://github.com/claus/react-dat-gui



我们先简单讲一下 dat.gui.js ，后重点讲解一下 react-dat-gui。



## dat.gui的安装与使用

#### 安装dat.gui

```
yarn add dat.gui
//npm i dat.gui --save
```



dat.gui 默认并不包含 .d.ts 文件，所以如果想在 TypeScript 中获得语法提示，则还需额外安装对应的包

```
yarn add @types/dat.gui --dev
//npm i @types/data.gui --save-dev
```



#### 引入并实例化GUI

```
import { GUI } from 'dat.gui'
const gui = new GUI()
```

或者

```
import dat from 'dat.gui'
const gui = new dat.GUI()
```



#### 如何具体使用？

具体如何使用可参考官网，或API文档：https://github.com/dataarts/dat.gui/blob/master/API.md



## react-dat-gui的安装

#### 安装 react-dat-gui

```
yarn add react-dat-gui
//npm i react-dat-gui --save
```

> react-dat-gui 已包含 .d.ts 文件，因此可以直接在 TypeScript 项目中获得语法提示

> react-dat-gui 还自带有样式文件，我们在使用时只需引入即可生效



## 使用 react-dat-gui

react-dat-gui 一共 2 部分：

1. 最外层的 <DatGUI \> 标签
2. 里面具体的每一项参数，例如 <DatBoolean \>、<DatString \> 等



#### 先讲解一下<DatGUI \>

首先需要引入 DatGUI 和 全部的 css  样式

```
import DatGUI from 'react-dat-gui'
import 'react-dat-gui/dist/index.css'
```

然后可以使用 <DatGUI /\> 来创建 GUI 的最外层框架、每一项参数都是 <DatGUI /\> 的子项。

```
<DatGUI>
  ...
</DatGUI>
```

<DatGUI \> 有 2 个必填属性：

1.  data={xxx} ，要绑定的数据对象
2. onUpdate={(newDate) => { ... }} ，当用户修改某个参数后，触发更新处理函数



#### 提供参数选项类型

| 选项类型   | 选项的作用               |
| ---------- | ------------------------ |
| DatBoolean | 调整 布尔值              |
| DatString  | 调整 字符串              |
| DatNumber  | 调整 数字                |
| DatColor   | 调整 颜色                |
| DatSelect  | 调整 下拉框              |
| DatButton  | 创建一个按钮             |
| DatFolder  | 创建一个可折叠的菜单面板 |
| DatPresets | 创建一个预设             |

从上面可以看出，参数选项一共有 2 种类型：

1. 用于调整参数的类型：DatBoolean、DatString、DatNumber、DatColor、DatSelect
2. 用于创建某些特殊对象的类型：DatButton、DatFoler、DatPresets



#### 所有选项类型共有的属性

1. label (可选属性)：选项对应的标签名，值为 字符串

2. className (可选属性)：选项对应的样式名，值为 字符串

   > 注意自己增加的样式会覆盖掉组件默认的样式，可以给自定义样式添加 !important，以提高其优先级。

3. style (可选属性)：选项对应的 style 样式



#### 用于调整具体参数的选项共有的属性

针对这 5 个 选项类型：DatBoolean、DatString、DatNumber、DatColor、DatSelect

1. path (必填属性)：绑定数据中的字段名，值为 字符串

> DatButton、DatFoler、DatPresets 这 3 个选项类型不需要 path 属性



#### 具体某选项的一些其他配置

**DatBoolean、DatString、DatColor 只需要 path、label 属性即可。**



**DatNumber：**

1. min：必填项，最小值为多少
2. max：必填项，最大值为多少
3. step：必填项，数字增幅单位.

示例：

```
<DatNumber path='num' label='number' min={0} max={10} step={1} />
```

> 以上配置中，将数字的范围控制在 0 - 10 之间，且每次增加或减少的幅度为 1



**DatSelect：**

1. options：非必填项，下拉值列表对应的数组

示例：

```
<DatSelect path='select' options={['red', 'green', 'blue']} />
```

特别注意：以上示例中数组元素为字符串，事实上你可以为数字，例如

```
<DatSelect path='select' options={[18, 34, 1986]} />
```

但是，最终 DatGUI 会将选项的值转化为 string 类型。

> 尽管 options 设置时，数组中元素为数字，但是最终会被转化为字符串



**DatButton：**

1. onClick：必填项，点击按钮后的处理函数

示例：

```
const handleClick = () => {
    console.log('you clicked me')
}
    
<DatButton onClick={handleClick} label='button' />
```



**DatFolder：**

DatFolder 用来创建一个可折叠的菜单面板。

> 你也可以理解成是一个可折叠的目录(文件夹)

1. title：必填项，菜单面板的标题名
2. closed：选填项，布尔值，默认值为 true，表示默认是否折叠菜单面板。

菜单子项内容：

child：必填项，是一个数组，包含菜单面板中的子项

> 是必填项，是数组，但是也可以是空数组

严格来说 child 并不是属性，而是 DatFolder 的内容。

示例：

```
<DatFolder title='other' closed={true} >
    <DatString path='title' label='title' />
    <DatNumber path='num' label='number' min={0} max={10} step={1} />
</DatFolder>
```

> 上面示例中，<DatString \> 、<DatNumber \> 就相当于 DatFolder 的 child。



**DatPresets：**

> perset 单词的翻译为：预制、预设

DatPresets 是用来预设 N 组 参数配置。

1. onUpdate：必填项，当用户操作，选择了新的一组预设时，对应的处理函数

2. options：必填项，值为数组，数组中的每个元素的每个值键对组成一组预设数据。

   > "数组中的每个元素的每个值键对组成一组预设数据" 这句话略微绕口
   >
   > 实际中 DatPresets 会将 options 数组中的每个对象最外层的值键对进行拆分
   >
   > 键名为预设方案的名称，键值为预设方案的值

3. DatPresets 会把默认绑定的 data 作为第 1 项，且名字默认为 “Default”

以上针对 options 的解释比较绕口，看一下示例就容易明白。

示例：

```
const [dat, setDat] = useState<DatType>({ boo: false, title: 'hello', num: 2, color: '#FFFFFF', select: 'red' })

const presetOptions = [
    {
        second: {
                boo: false, title: 'hello...', num: 2, color: '#FFFFFF', select: 'red'
            },
        third: {
                boo: false, title: 'hi...', num: 5, color: '#666666', select: 'yellow'
            }
    },
    {
        fourth: {
                boo: true, title: 'hi...', num: `5`, color: '#000000', select: 'blue'
        }
    }
]

...

<DatGUI data={dat} onUpdate={handleUpdate} className='dat-gui'>
    <DatPresets onUpdate={handlePresetsUpdate} label='presets' options={presetOptions} />
</DatGUI>
```

仔细观察 presetOptions 的数据结构：

```
const presetOptions = [
    {
        预设方案2,
        预设方案3
    }，
    {
        预设方案4
    }
]
```

**虽然 预设方案2 和 预设方案 3 在同一个元素对象中，但是 DatPrestes 会对数组中的元素进行解构。**

最终所呈现的预设方案下拉框中，会显示：

1. Default
2. second
3. third
4. fourth



> 我在学习 react-dat-gui 时，发现对应的 index.d.ts 中 DatPresetsProps 的定义是错误的。
>
> 这是官方定义的：
>
> ```
> export interface DatPresetsProps extends DatUnchangableFieldProps {
>    onUpdate: (data: any) => any;
>    options: {
>      presetName?: string;
>      data?: any; // Initial data
>      preset: any; // Your preset
>    };
> }
> ```
>
> 这是我修改之后的：
>
> ```
> export interface DatPresetsProps extends DatUnchangableFieldProps {
>   onUpdate: (data: any) => any;
>   options: {
>     [k: string]: any
>   }[];
> }
> ```
>
> 我已向官方仓库提交了 PR，希望能被合并。



## 关于样式

默认引入的 index.css 包含了 react-dat-gui 所需的全部样式，包括各种类型参数对应的样式。

这是官方提供的一套 css  样式，你也可以自定义样式来覆盖官方默认的样式。

> 官方默认的样式已经很简洁优雅了，一般情况下我们没有必要修改。

假设你就是想修改，那么这里贴出一部分官方默认的 css 样式供你参考：

```
.react-dat-gui {
    position: fixed;
    right: 16px;
    top: 0;
    width: 280px;
    font-size: 12px;
    font-family: Lucida Grande,sans-serif;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
}
```



**自定义样式：**

```
.dat-gui {
    top: 16px !important;
    width: 360px !important;
    font-size: 18px !important;
}
```

> 自定义样式的属性添加了 !important ，所以肯定会覆盖原有的样式



**添加自定义样式：**

```
<DatGUI data={dat} onUpdate={handleUpdate} className='dat-gui'>
    ...
</DatGUI>
```



**补充说明：**

每一项 GUI 参数 布局如下：

1. 左侧为 参数 label
2. 右侧为 具体参数设置项

react-dat-gui 官方为我们提供了一个 可选属性：labelWidth，属性值为以像素 px 为单位的数字，默认值为  40。

在 <DatGUI \> 标签中添加该属性，会对所有子项起作用。



我们可以通过添加修改该属性值，来调整 左侧参数 label 的宽度。

例如下面代码中，设置 label 的宽度为 200px：

```
<DatGUI labelWidth={200} > ... </DaGUI>
```

> 所有的子项的 label 宽度均会被设置为 200px

注意：当修改左侧 label 的宽度后，右侧 具体参数设置项 会自动占据父级剩余的全部宽度。



## 一个简单的示例

示例使用的是：React + TypeScript + React-dat-gui

```
import { useState } from 'react'
import DatGUI, { DatBoolean, DatButton, DatColor, DatFolder, DatNumber, DatPresets, DatSelect, DatString } from 'react-dat-gui'

import 'react-dat-gui/dist/index.css'

type DatType = {
    boo: boolean,
    title: string,
    num: number,
    color: string,
    select: string
}

const HelloGUI = () => {
    const [dat, setDat] = useState<DatType>({ boo: false, title: 'hello', num: 2, color: '#FFFFFF', select: 'red' })

    const presetOptions = [
        {
            second: {
                boo: false, title: 'hello...', num: 2, color: '#FFFFFF', select: 'red'
            },
            third: {
                boo: false, title: 'hi...', num: 5, color: '#666666', select: 'yellow'
            }
        },
        {
            fourth: {
                boo: true, title: 'hi...', num: `5`, color: '#000000', select: 'blue'
            }
        }
    ]

    const handleUpdate = (newData: any) => {
        setDat(newData)
        console.log(newData)
    }

    const handleClick = () => {
        console.log('you clicked me')
    }

    const handlePresetsUpdate = (newData: any) => {
        setDat(newData)
        console.log(newData)
    }

    return (
        <DatGUI data={dat} onUpdate={handleUpdate} className='dat-gui'>
            <DatPresets onUpdate={handlePresetsUpdate} label='presets'
                options={presetOptions} />
            <DatBoolean path='boo' label='Boo?' />
            <DatString path='title' label='title' />
            <DatNumber path='num' label='number' min={0} max={10} step={1} />
            <DatColor path='color' label='color' />
            <DatSelect path='select' options={['red', 'green', 'blue']} />
            <DatButton onClick={handleClick} label='button' />
            <DatFolder title='other' closed={true} >
                <DatString path='title' label='title' />
                <DatNumber path='num' label='number' min={0} max={10} step={1} />
            </DatFolder>
        </DatGUI>
    )
}

export default HelloGUI
```

