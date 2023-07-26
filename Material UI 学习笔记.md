# Material UI 学习笔记

本文用于记录学习 Material UI 组件库。

本文目录：

* Material UI 简介与 Antd 的差异
* 安装 MUI
* 初探 MUI
* 文档与组件速览



<br>

## Material UI 简介与 Antd 的差异

当你习惯使用 Antd 组件库时，你或许也应该知道世界上另外一个优秀开源的 React 组件库：谷歌的 Material UI



<br>

**Material UI 官网**：https：//mui.com/material-ui/



<br>

**Material UI 的要求：**

* 目前 Materia UI 版本为 V5，尚且部分支持 IE11，但等 V6 后就会不再支持 IE 11

  > 关于浏览器兼容，目前已经不是前端需要发愁的一个问题了

* 服务端的 node.js 版本：支持最新的 node.js

* React：需要 ^17.0.0

* TypeScript：需要 ^3.5



<br>

**关于 Material UI 的称呼：**

在本文中可能将 Material UI 称呼为：

* MUI
* 材质UI
* 材质组件、材料组件

无论哪种称呼，在本文中你都知道是在说 Material UI 就好。



<br>

**Material UI 与 Antd 的相同之处：**

* 都是针对 React 框架，且组件丰富
* 同样优秀，目前 Antd 在 Github 上 86.9K 点赞、Material UI 是 87.8 K 点赞，两者相差无几
* 同样拥有活跃的社区和开发群体



<br>

**Material UI 与 Antd 的差异：**

* 公司不同：Antd 背后是 阿里集团，Material UI 背后是谷歌

* 组件自定义样式容易程度：

  * Antd 单个组件自定义样式相对不容易(比较复杂)

  * Material UI 自定义样式特别方便(这是它的优势)

    > 但同时也意味着 Material UI 上手程度要比 Antd 更难一些

* 上手容易程度：

  * 相对而言 Antd 更容易一些(或者你可以理解成 Antd 封装的更狠一些)

* **引入全局样式：Antd 需要引入，Material UI 不需要**

* 简体中文文档：目前 Maturial UI 暂时没有中文版文档

* Material UI 政治性：

  * Material UI 背后是谷歌，属于 "西方公司"，在其官网顶部有一句话 

    ```
    MUI stands in solidarity with Ukraine.
    //翻译：MUI 和乌克兰站在同一立场。
    ```

    > 额~，果然很西方

  * 这种事不可能发生在 Antd 官网上。

    > 如果你觉得 Material UI 很好用，但是也不要影响你的政治立场。



<br>

**Mui组件库的关系：**

在 https：//mui.com/core/ 上我们可以看到，一共有 3 个组件库：

* Base UI：最基础的组件库，包含交互逻辑但不包含 组件样式

* Material UI：基于 Base UI 和 Material Design 设计规范，包含默认样式

  > Material Design 是谷歌推出的一套 适用于 手机、平板电脑、台式电脑 一致性的一套设计规范。

* Joy UI：基于 Base UI 但是不遵循 Material Design 设计规范

  > Material UI 和 Joy UI 有很多相同相似的组件用法，学习完一个后很容易上手另外一个。



<br>

**由于本文是学习 Material UI 的，所以在本文中无特殊说明的情况下 `MUI` 是指 Material UI。**

> 特别补充：本文所学习的 Material UI 是指运行在前端 React 框架中的组件，不包含运行在后端的 React Server 组件。



<br>

## 安装MUI

下面提到的 MUI 都是指 Material UI。



<br>

**默认安装 MUI**

```
yarn add @mui/material @emotion/react @emotion/styled
```



<br>

**更改默认样式引擎**

MUI 默认样式引擎为 Emotion，如果你不想使用它，想改成 styled-components，则执行下面的安装

```
yarn add @mui/material @mui/styled-engine-sc styled-components
```

* Emotion 是一个转为 JS 编写控制 CSS 样式而设计的库，官网地址：https://emotion.sh/
* styled-components 也是一个在 JS 中写 CSS 样式的库，官网地址：https://styled-components.com/
* 上面提到的 样式引擎 实际上就是 `CSS in JS` 这个概念



<br>

**安装相关字体**

```
yarn add @fontsource/roboto
```

入口文件引入相关样式：

```
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
```



<br>

**安装图标**

```
yarn add @mui/icons-material
```



<br>

你可能懵了，什么乱七八糟的，怎么要安装这么多东西?

这些到底要安装哪些? 都要安装吗?

别着急，我们慢慢学习。



<br>

## 初探MUI

假定我们只安装了默认的 MUI 组件：

```
yarn add @mui/material @emotion/react @emotion/styled
```



<br>

**最基础的按钮示例：**

```
import { Button } from '@mui/material'

const MyComponent = () =>{

    const handleClick = () => { 。。。 }

    return (
        <div>
            <Button 
               variant='contained'
               style={{ 。。。 }}
               onClick={handleClick}
            >我是按钮</Button>
        </div>
    )
}
```

> 运行之后我们会看到一个 蓝色底的按钮



<br>

单看这个组件，我们会发现它的用法几乎和 Antd 没有什么区别。

**按钮的 外观类型：**

* Antd 的 Button 组件中我们是用 type 属性来设置按钮的外观：
  * primary：主按钮
  * 缺省：边框型(仅有边框，没有填充背景色)，默认值
  * dashed：虚线按钮
  * text：文本按钮(文本颜色为普通黑白色)
  * link：链接按钮(文本颜色为蓝色)
* MUI 的 Button 组件中则使用 variant 属性值来规定按钮外观：
  * contained：有蓝色背景
  * outlined：边框型(仅有边框，没有填充背景色)
  * text：文本型(文本颜色为蓝色)，默认值
  * string：字符串文本型(文本颜色为普通黑白色)



<br>

**如何将按钮设置为红色危险样式？**

在 Antd 中的 Button 可以添加 `danger` 属性，让其变成红色具有危险警告性质的按钮样式外观。

相同的效果在 MUI 的 Button 中则是通过 `color` 属性来实现的。

```
<Button variant="contained" color="error">Hello World</Button>
```

查阅 Button 组件的 API 文档：

https://mui.com/material-ui/api/button/

我们可以看到 `color` 属性值的可设置属性为：

* inherit：随父级(可能是灰色)
* prinary：蓝色(默认值)
* secondary：紫色(辅助)
* success：绿色(成功)
* error：红色(错误)
* info：浅蓝(信息)
* warning：黄色(警告)



<br>

**如何自定义颜色风格？**

比如说我希望按钮的 success 不是默认的绿色，而是别的颜色。

可以通过 MUI 提供的自定义样式模板来统一修改。

1. 先自定义一个 theme 样式模板

   > theme.tsx

   ```
   import { createTheme } from '@mui/material/styles';
   import { red } from '@mui/material/colors';
   
   // A custom theme for this app
   const theme = createTheme({
     palette: {
       primary: {
         main: '#556cd6',
       },
       secondary: {
         main: '#19857b',
       },
       error: {
         main: red.A400,
       },
     },
   });
   
   export default theme;
   ```

2. 使用 `<ThemeProvider theme={theme}></ThemeProvider>` 组件包裹住需要更改默认组件样式的组件

   > main.tst (下面是伪代码)

   ```
   import { ThemeProvider } from '@emotion/react';
   import theme from './theme';
   
   <ThemeProvider theme={theme}>
       <App />
   </ThemeProvider>
   ```

   

<br>

**按钮如何添加图标？**

我们先说一下 Antd 中是如何使用图标的，一般来说分为 2 种：

1. 从 Antd 官方的图标组件中引入并使用

   ```
   yarn add @ant-design/icons
   ```

   ```
   import { FireOutlined } from '@ant-design/icons'
   <FireOutlined />
   ```

2. 从 iconfont.cn 上下载图标字体，引入以字体形式使用



<br>

MUI 使用图标也有 2 种方式。



<br>

**第1种：使用官方图标库：**

安装使用官方提供的图标库，这一种方式和 Antd 的完全相似

```
yarn add @mui/icons-material
```

```
import { AccountCircle } from '@mui/icons-material'
<AccountCircle />
```

硬要说区别的话，那就是 MUI 这套图标库的图标数量庞大，目前大约提供了 2100+ 个图标。

当你需要哪个图标时可以通过：https://mui.com/material-ui/material-icons/ 在线查找



<br>

**用法示例：**

```
import { Button } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'

<Button
    variant='contained'
    startIcon={<AccountCircle />}
>Hello</Button>
```

> startIcon 是指图标在前，文字在后，也可以使用另外一个属性 endIcon 即 文字在前，图标在后



<br>

**关于图标 5 种类型的说明：**

* Filled：实心填充
* Outlined：轮廓，非实心填充
* Rounded：边角处进行了圆滑处理
* Sharp：边角处比较尖锐处理，不圆滑
* Two Tone：挖空处不再是透明白色，而是浅灰色



<br>

**第2种：自定义 SVG 图标组件**

这种方式和 Antd 不同，Antd 是自定义字体文件。

假定我们现在想自定义一个名为 LightBulbIcon 的图标，那么方式为：

```
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

function LightBulbIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
    </SvgIcon>
  );
}
```

使用 LightBulbIcon 图标：

```
<LightBulbIcon />
```

> 自定义 SVG 图标的用法和 MUI 官方图标一样。



<br>

**SVG图标的一些属性设置**

像上面我们自定义的 SVG 图标属于 SvgIcon，它默认支持的 SvgIconProps 具体文档可查阅：

https://mui.com/material-ui/api/svg-icon/

对我们来说比较常用的属性有：

* fontSize(字体大小)：'inherit' | 'large' | 'medium' | 'small' | string

  默认值为 'medium'

* sx(自定义样式)：Array<func | object | bool> | func | object

  例如我们可以写成这样：

  ```
  <LightBulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
  ```

  * `mr:1` 这里的 mr 实际是 "marginRight" 的缩写

    请注意：这里的 1 并不是指 1px，而是有其特殊的含义，具体 1 的指是多少像素是由样式模板中的 spacing 决定的，假定模板中定义 spacing 的值为 8px，那么此时 mr:1 中的 1 即 8px，同理 mr:0.5 中的 0.5 即 (0.5*8px) = 4px

  * `verticalAlign: 'middle'`：垂直对齐方式

  * 关于 sx 中的样式语法以及其他缩写可查阅：https://mui.com/system/getting-started/the-sx-prop/



<br>

**如何获取纯图标圆形按钮？**

在 Antd 中设置  `<Button shape="circle">` 就可以获取圆形的纯图标按钮，在 MUI 中则采用的是 `<IconButton>` 组件来实现：

```
<IconButton aria-label="delete">
  <DeleteIcon />
</IconButton>
```

> 注意不再是 <Button> 而是 <IconButton>



<br>

从上面这个最简单的按钮示例，我们已经对 MUI 有了初步的一些基础用法实践。

可以总结以下几点。



<br>

**小总结1：关于安装 NPM 包**

最基础核心的(必须)：

```
yarn add @mui/material @emotion/react @emotion/styled
```

> * @mui/material：MUI 组件库
> * @emotion/react、@emotion/styled：Emotion 针对 react 的 JS 样式控制引擎(CSS in JS)



<br>

官方图标库(非必须)：

```
yarn add @mui/icons-material
```

> 假设项目中根本不使用任何官方图标，如果使用图标也都是自定义 SVG 图标，那么自然也无需安装官方图标库



<br>

默认 roboto 字体(非必须)：

```
yarn add @fontsource/roboto
```

> 假设你并不追求不同设备上都使用 MUI 默认的 Roboto 字体，那自然也无需安装引入 Roboto 字体



<br>

更改 MUI 中 JS 控制 CSS 样式引擎(不需要)：

```
yarn add @mui/material @mui/styled-engine-sc styled-components
```

> 对，没错，MUI  默认的 CSS 引擎 Emotion 足够我们使用了，如非特殊情况完全没有必要将样式引擎更改为 styled-components，因此这个安装是不需要的。



<br>

**小总结2：关于样式**

全局样式：

1. MUI 组件使用时，不需要引入全局样式，仅直接引入组件即包含样式
2. 如果你想自定义组件样式风格，可以通过 `<ThemeProvider theme={theme}>` 方式来实现



<br>

组件样式：

1. 组件如同普通的 React 组件一样，也支持 `style` 属性，可以添加自定义样式



<br>

图标样式：

1. 对于 MUI 官方图标 和 自定义 SVG 图标，他们都支持一些基础的外观样式属性，例如 fontSize

2. 同时支持 sx={{ ... }} 这种自定义样式

   > 注意 sx={{ ... }} 中的 样式写法并不是传统的 style={{ ... }} 中的写法，而是 MUI 官方自定义的一种内置 CSS 语法，具体可查看：
   >
   > https://mui.com/system/getting-started/the-sx-prop/



<br>

## 文档和组件速览

上面我们已经通过 `<Button>` 对 MUI 有了初步了解，那么接下来就过一遍 Material UI 文档和各个组件。



<br>

官方文档：https://mui.com/material-ui/getting-started/



<br>

**官方文档左侧菜单面板说明：**

* `Getting started`：快速开始，包含常见问题
* `Components`：全部的组件用法示例
* `Components API`：各个组件对应的 API
* `Customization`：自定义相关，例如 暗色模式、自定义样式模板 等
* `How-to guide`：一些常见解决方案
* `Experimental APS`：实验性质的 API
* `Discover more`：探索更多
* `Migration`：版本迁移相关
* `Templates`：跳转至 社区模板站点



<br>

**组件速览：**

* Inputs 输入相关组件：

  * Autocomplete：可自动填充的值的 input 输入框，涉及组件有 `<Autocomplete>、<Popper>、<TextField>`

  * Button：按钮，涉及组件有 `<Button>、<ButtonBase>、<IconButton>、<LoadingButton>`

  * Button Group：一组按钮，涉及组件有 `<ButtonGroup>`

  * Checkbox：多选框

  * Floating Action Button：浮动按钮，使用场景例如 网页右侧的 "返回顶部"，涉及组件 `<Fab>`

  * Radio Group：单选框

  * Rating：等级评价组件，使用场景例如 给评价打几颗星，涉及组件 `<Rating>`

  * Select：下拉选择框，涉及组件 `<Select>、<NativeSelect>`

    > `<NativeSelect>` 组件是指同时有多项下拉选项可见的那种组件

  * Silder：滚动滑条，涉及组件 `<Slider>`

  * Switch：开关组件，涉及组件 `<Switch> ...`

  * Text Field：文本输入框

  * Transfer List：左右两侧列表数据互相转移，涉及组件 `<List>、<ListItem>`

  * Toggle Button：按钮组成的系列单选多选菜单选项，涉及组件 `<ToggleButton>、<ToggleButtonGroup>`

* Data Display 数据展示组件：

  * Avatar：头像组件
  * Badge：提醒徽章
  * Chip：紧凑元素，使用场景例如 多个标签展示
  * Divider：分割线
  * Icons：图标，若想使用前提是已安装 `@mui/icons-material` 图标库
  * Material Icons 图标库图标展示页：就是展示出 `@mui/icons-material` 中的图标
  * List 列表：各式各样的列表
  * Table 表格：表格列表
  * Tooltip：提示信息框，例如鼠标放到某个按钮上展示的 提示信息框
  * Typography 排版文字：各种标题或显示文字

* Feedback 反馈组件：

  * Alert 提示框：各种状态的提示框
  * Backdrop 半透明遮罩：覆盖页面内容的黑色半透明的遮罩，可用于自定义加载过程中的进度提示
  * Dialog 半透明任务询问选择框：功能不太好描述，但是看一眼实际示例就知道是什么了
  * Progress 进度状态：有转圈的，有显示百分比的
  * Skeleton 骨架屏：骨架屏动画
  * Snackbar 吐司工具：屏幕上临时显示一些提示信息，类似于 Antd 的 message

* Surfaces 一些展示区域组件：

  * Accordion 手风琴折叠：手风琴折叠面板
  * App Bar 移动版顶部导航：包含菜单、当前标题 等
  * Card 卡片：卡片面板
  * Paper 纸张：移动端类似展示多个页面缩略图效果的组件

* Navigation 导航组件：

  * Bottom Navigation：APP 底部按钮导航
  * Breadcrumbs 面包屑导航
  * Drawer 侧边栏菜单面板：平时隐藏不可见，当需要时从侧边滑出显示
  * Link 链接：相当于 `<a>` 标签
  * Menu 菜单：各式各样的菜单，例如 三个点 的、点击显示选项的 等
  * Pagination 分页：分页组件
  * Speed Dial 一列动效菜单：默认就一个圆圈按钮，鼠标放上去带有动效的展示处一列子菜单
  * Stepper 步骤组件：展示当前进行到第几个步骤的那种组件
  * Tabs 标签切换组件

* Layout 布局组件：

  * Box 盒子：类似于 div 
  * Container 容器：类似于 div
  * Grid：就是 Grid 布局组件
  * Grid v2：新版 Grid 组件
  * Stack 列组件：就是 Flex 布局组件，把子项排成一列
  * Image List 图片列表：类似于图片瀑布流
  * Hidden：该组件在 MUI v5 中已废弃

* Utils 工具类型组件：

  * Click-Away Listener：检测点击事件发生在子项之外
  * CSS Baseline：控制 CSS 基线相关
  * Modal：对话弹窗，涉及组件有 `<Dialog>、<Drawer>、<Menu>、<Popover>`
  * No SSR：该组件文档已被移动到 https://mui.com/base-ui/react-no-ssr/
  * Popover：鼠标点击按钮旁边的小弹出内容
  * Popper：和 Popover 类似
  * Portal：允许将子项内容渲染到组件之外其他 DOM 元素中
  * Textarea Autosize：可根据内容自动调整尺寸的 Textarea
  * Transitions：实际就是对 CSS 样式中的 transitions 封装
  * useMediaQuery：监听 CSS 样式中的媒体查询，以是否显示某些组件

* MUI X ：MUI 的下一版本中的组件

  * 这里的 X 就是指 下一版本，目前而言相当于 MUI v6
  * 这些组件还处于不稳定中，因此不在本次学习中

* Lab：实验性质的一些想法和组件

  * 也不在本次学习中



<br>

好了，以上就是 MUI 包含的组件大体内容。

**当你需要使用到哪个组件时自己去对应官方文档上查看示例和 API 就好。**

