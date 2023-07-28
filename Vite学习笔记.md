# Material UI 学习笔记

本文用于记录学习 Material UI 组件库。

本文目录：

* Material UI 简介与 Antd 的差异
* 安装 MUI
* 初探 MUI
* 文档与组件速览
* 自定义主题样式
* 亮/暗模式切换



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

**如何旋转、翻转图标？**

首先 MUI 提供的图标本身完全遵循 CSS 元素，因此我们可以通过向其添加 CSS 中的 `transform` 样式来实现旋转或翻转图标。

```
//旋转 180度
<SpaceDashboard sx={{ transform: 'rotate(180deg)' }} />

//沿 Y 轴翻转
<ViewComfy sx={{ transform: 'scaleY(-1)' }} />
```

> 在 MUI 组件中推荐使用 sx={{ ... }} 属性来设置样式，而不是 style={{ ... }}



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

**图标样式：**

1. 对于 MUI 官方图标 和 自定义 SVG 图标，他们都支持一些基础的外观样式属性，例如 fontSize

2. 同时支持 sx={{ ... }} 这种自定义样式

   > 注意 sx={{ ... }} 中的 样式写法并不是传统的 style={{ ... }} 中的写法，而是 MUI 官方自定义的一种内置 CSS 语法，具体可查看：
   >
   > https://mui.com/system/getting-started/the-sx-prop/



<br>

**特别说明：关于单个组件的样式——CSS in JS**

尽管 MUI 的组件和 Antd 组件相似，也支持 `className、style` 这些属性，但是请注意 MUI 组件更推荐的做法是采用 `CSS in JS` 这种方法去定义组件样式。

**MUI 的每一个组件都有 sx={{ ... }} 这个属性，强烈推荐使用此方式来修改当前组件样式。**

**非常不推荐使用 clasName、style、.scss 这种方式来定义 MUI 组件。**

可能你习惯于使用 `import ./index.scss + className` 这种方式，但是既然使用 MUI，就可以尝试 `CSS in JS` (sx={{ ... }}) 这种方式，当你习惯后会觉得非常方便，再也不用考虑样式命名这个事情了。 



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



<br>

**思考题：对于 Layout 布局类的组件，我可以不可以不用？**

例如：Box、Container、Grid 等这些布局容器类的组件，我不用它们，而是自己直接使用 div 行不行？

答：可以，但有弊端。

**弊端就是：你的前端项目有可能需要 明暗模式(light/drak) 切换，这个时候你自己写的 div 可能就无法做出响应了**

或者说你去要自己去处理明暗模式的响应，而上面这些布局组件则可以通过设置 `<Xxx sx={{backgroundColor: 'primary.contrastText}} />` 很轻松来实现切换背景颜色。

> primary.contrastText 是主题样式中的一个变量配置项。
>
> 我们这里只是举例使用了 primary.contrastText，还可以设置成主题样式中的其他颜色变量。



<br>

**同理，对于一些文本元素，也牵扯到 亮/暗 模式切换后文字颜色变化，所以推荐使用 `<Typography>` 组件，而不是自己去写 `<span>`。**

```
const themeOptions: ThemeOptions = {
    palette: {
        mode: 'dark'
    },
    components: {
        MuiTypography: {
            defaultProps: {
                color: 'textPrimary'
            }
        }
    }
}
```

```
<Typography>footer</Typography>
```

在上面代码中我们将 文本组件 文字颜色设置为主题中的 'textPrimary'。

对于新手而言需要大量的实际操作才能够逐渐熟悉 主题 中的各个颜色变量名称。



<br>

**补充：聊一聊那些相似的 "弹窗、弹层" 组件**

在 MUI 中有几个 "弹窗、弹层" 组件无论从名称还是用法来说都比较相似。

它们是：

* Dialog：对话窗，它强调的是 "询问用户下一步该如何继续？"

  使用场景例如：

  * 询问用户是否同意 某某 条款
  * 让用户输入一个某个值，例如输入一个邮箱地址，以便继续下一步

* Modal：模态框，没错 Modal 准确的翻译就是 "模态框"，尽管我们日常习惯称呼它为 "对话框"

  你可以使用 Modal 自己组建很复杂的 "弹窗、对话框"

* Popover：弹出窗口，不包含半透明背景层，但依然会阻止用户操作其他元素

  使用场景：

  * 展示某些待用户选择的隐藏选项或菜单

* Popper：弹出层

  使用场景：

  * 显示用户刚才操作有关的弹出层内容，但不阻止用户去做其他事情，例如 "点击按钮显示某个链接地址，可以让用户去复制这个链接地址文字"

* Backdrop：弹出的半透明覆盖层，至于中间核心区域的内容则是由用户自己添加组件决定

  使用场景：

  * 使用 Backdrop 作为背景，中间内容可以是一个进度条组件



<br>

**区别1：阻止用户操作其他元素、阻止用户滚动页面**

* Dialog、Modal、Popover 这 3 个组件都会阻止
* Popper 都不会阻止
* Backdrop：会阻止用户操作其他元素，但不阻止用户滚动页面

**区别2：出现的位置**

* Dialog、Modal 都显示在网页中间位置
* Popover、Popper 显示在操作的元素位置旁边
* Backdrop：覆盖整个网页



<br>

**你需要做的事情就是根据每个组件的不同特征，结合自己的实际场景需求，来选择使用哪个组件。**



<br>

## 自定义主题样式

在上面初探 MUI 时我们只是简单提了一下使用 `<ThemeProvider theme={theme}>` 修改按钮不同状态下的颜色，下面我们将详细讲解如何自定义主题样式。

> theme 这个单词的翻译就是 主题



<br>

### 创建自定义主题样式的套路

1. 项目根目录创建 `theme.tsx`

   > src/theme.tsx

   ```
   import { createTheme } from "@mui/material";
   
   const theme = createTheme({
   
   })
   
   export default theme
   ```

   > 尽管我们知道它就是返回一个对象而已，但MUI 官方示例写的就是 .tsx 而不是 .ts

2. 在整个项目的顶级组件 main.tsx 中使用 `<ThemeProvider>` 包裹住 `<App>`

   > src/main.tsx

   ```
   import { ThemeProvider } from '@mui/material'
   import ReactDOM from 'react-dom/client'
   import theme from './theme.tsx'
   import App from './App.tsx'
   import React from 'react'
   import './index.scss'
   
   ReactDOM.createRoot(document.getElementById('root')!).render(
       <React.StrictMode>
           <ThemeProvider theme={theme}>
               <App />
           </ThemeProvider>
       </React.StrictMode>
   )
   ```

好了，只此一个最基础，实际啥也没做的 自定义主题样式 已经完成了。

那么接下来我们就要开始去深入学习了解自定义主题，并完善 theme.tsx。



<br>

**关于`<ThemeProvider>`的嵌套说明：**

在上面示例中我们使用了一个 `<ThemeProvider>` 包裹住了 `<App>` 组件，那么就意味着整个项目中的组件都将受到影响。

但 `<ThemeProvider>` 是允许多层嵌套的，和 CSS 一样，也是按照最近原则生效。

```
<ThemeProvider theme={outerTheme}>
  <Checkbox defaultChecked />
  <ThemeProvider theme={innerTheme}>
    <Checkbox defaultChecked />
  </ThemeProvider>
</ThemeProvider>
```



<br>

### 自定义主题样式

MUI 默认主题中定义了一些 CSS 相关的变量配置项，我们可以通过修改这些变量配置项来整体修改主题样式。

**最常用的变量配置：**

* .palette：调色板(主题色)配置

* .typography：版式配置

* .spacing：单位间距

  > 默认值为 8，即 8px

* .breakpoints：断点(媒体查询)

  > 这些断点对应有简写，默认值如下：
  >
  > * xs：0px
  > * sm：600px
  > * md：900px
  > * lg：1200px
  > * xl：1536px

* .zIndex：z-index 属性配置

  > 分别定义不同组件(例如 fab、modal 等) 他们的 z-index 的值

* .transitions：过渡动画配置

* .components：组件配置

  > 注意对于 MUI 的各个组件都需要增加一个 `Mui` 的前缀，假设我们想统一配置 `<Container>` 组件，那么在此处应该写成 `MuiContainer`：
  >
  > ```
  > const themeOptions: ThemeOptions = {
  >  components: {
  >      MuiContainer: {
  >          defaultProps: {
  >              disableGutters: true,
  >              maxWidth: false
  >          }，
  >          styleOverrides：{
  >              ...
  >          }
  >      }
  >  }
  > }
  > ```
  >
  > 上面配置中：
  >
  > `disableGutters: true` 意思是：禁止(取消) Container 两侧的 pading 空隙，默认 Container 两侧的空隙是 24px
  >
  > `maxWidth: false` 意思是：取消最大宽度限制，默认 maxWidth 为 1536px，设置为 false 后意味着相当于设置宽度为 100%
  >
  > 关于每个组件的更多配置项，可自行查阅文档，这里就不逐一举例了。



<br>

**palette：调色板(主题色)配置**

`.palette` 是我们最常用、最复杂的主题变量，从它的 .d.ts 可以看出 `.palette` 有非常多的子配置项。 

```
export interface PaletteOptions {
  primary?: PaletteColorOptions;
  secondary?: PaletteColorOptions;
  error?: PaletteColorOptions;
  warning?: PaletteColorOptions;
  info?: PaletteColorOptions;
  success?: PaletteColorOptions;
  mode?: PaletteMode;
  tonalOffset?: PaletteTonalOffset;
  contrastThreshold?: number;
  common?: Partial<CommonColors>;
  grey?: ColorPartial;
  text?: Partial<TypeText>;
  divider?: string;
  action?: Partial<TypeAction>;
  background?: Partial<TypeBackground>;
  getContrastText?: (background: string) => string;
}
```

> 完整的文档：https://mui.com/material-ui/customization/palette/



<br>

**.palette 配置项说明：**

* primary(主要)、secondary(次要)、error(错误)、warning(警告)、info(信息)、success(成功)

  这几个都是和颜色有关的配置，他们需要配置以下 4 个属性

  ```
  light?: string; //亮模式下的颜色
  main: string; //主体颜色
  dark?: string; //暗模式下的颜色
  contrastText?:string; //当前模式下内容(对比)文字的颜色，例如背景色为蓝色，则蓝色背景上的文字颜色可以是白色
  ```

* mode：当前处于哪个模式，默认为 "light"

  ```
  PaletteMode = 'light' | 'dark'
  ```

* tonalOffset：色调偏移，仅对自定义主题颜色生效，对默认主题颜色不生效

  ```
  export type PaletteTonalOffset = number | {
    light: number;
    dark: number;
  };
  ```

  tonalOffset 的值是一个 0 ~ 1 的数字，它是指主题颜色从 亮(light) 到 主色(main) 再到 暗(drak)  的亮度过渡比例。该值可以是一个数值，也可以分别设置不同模式对应的数值。

  假定该值为 0.2，表达的含义是：

  * 亮模式的颜色亮度相对主颜色亮度 偏差(增加) 0.2(较亮较浅)
  * 暗模式的颜色两对相对主颜色亮度 偏差(减少) 0.2(较暗较深)

  > 假定亮度足够高时，最终呈现的是 白色
  >
  > 假定亮度足够低时，最终呈现的是 黑色

* contrastThreshold：对比度阈值，用来表示 背景色与文字的对比度阈值(强烈程度)，默认值为 3

  ```
  contrastThreshold?: number;
  ```

  > 你想象一下：一个警告按钮，背景色是橙黄色，按钮上的文字应该什么颜色？
  >
  > 默认值为 3 即 文字为白色，如果改成 4.5 则文字变成偏暗色

  > 假定你要修改 contrastThreshold 的值，一定要考虑到 色弱 的人，如果背景色和文字颜色对比度不够明显，可能这部分人就不容易看清楚按钮上的文字。

* common：定义所谓的 黑与白 的颜色值

  ```
  export interface CommonColors {
    black: string;
    white: string;
  }
  
  common?: Partial<CommonColors>;
  ```

* grey：灰色，这里实际指某个颜色中不同灰度( 从 50 ~ 900 )的颜色

  > 你把它想象成 字体粗细 中的 50 ~ 900 那个概念，即用数字来表达 灰 的程度

* text：

  ```
  export interface TypeText {
    primary: string;
    secondary: string;
    disabled: string;
  }
  text?: Partial<TypeText>;
  ```

* divider：

  ```
  divider?: string;
  ```

* action：

  ```
  export interface TypeAction {
    active: string;
    hover: string;
    hoverOpacity: number;
    selected: string;
    selectedOpacity: number;
    disabled: string;
    disabledOpacity: number;
    disabledBackground: string;
    focus: string;
    focusOpacity: number;
    activatedOpacity: number;
  }
  action?: Partial<TypeAction>;
  ```

* background：

  ```
  export interface TypeBackground {
    default: string;
    paper: string;
  }
  background?: Partial<TypeBackground>;
  ```

* getContrastText：

  ```
  getContrastText?: (background: string) => string;
  ```

> 后面几个属性暂时没用到，所以就先空着，以后用到知道是什么了再来完善。



<br>

上面讲的仅仅是 `.palette`，剩下的其他配置项，每个也都有非常多的子配置项，具体太多就不逐一说明了，可以自己查阅文档。



<br>

**自定义变量：**

上面提到的 palette、spacing 等都是 MUI 定义好的变量配置项，如果你想增加自定义的变量配置项也是可以的，当前前提是你真的需要。

这里举一个例子来说明如何添加自定义变量。

假定我们要添加一个名为 `puxiao` 的变量配置项，那么我们需要做下面 2 件事情：

* 向 Theme、ThemeOptions 中增加关于 puxiao 的类型定义

  ```
  declare module '@mui/material/styles' {
    interface Theme {
      puxiao: {
        xx: string;
      };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
      puxiao?: {
        xx?: string;
      };
    }
  }
  ```

  > 请注意：
  >
  > * puxiao 在 Theme 中为必填属性
  > * puxiao 在 ThemeOptions 中为非必填属性

* 然后就可在 createTheme() 中添加 puxiao 变量配置项了

  ```
  createTheme({
      puxiao:{
          xx: ...
      }
  })
  ```

特别说明：我暂时也没遇到过这种需要增加自定义变量的场景需求，那实际中会遇到什么问题暂时还不清楚。



<br>

**注意：`vars` 这个变量是 MUI 内部已使用的变量，你自定义变量中不允许使用该字段。**



<br>

关于主题配置项的各个详细用法，去查阅官方文档即可。



<br>

**线上可视化主题配置：**

MUI 还为我们提供了一个在线可视化配置主题的网站：

https://zenoo.github.io/mui-theme-creator/

你可以直接在这个网站上配置自定义主题，然后将配置结果复制到自己的项目中使用。



<br>

**获取当前主题配置：useTheme()**

MUI 提供了一个 hook 函数用来获取当前主题配置：useTheme()

```
import { useTheme } from '@mui/material'

const theme = useTheme()
console.log(theme.palette.mode)
```

**特别注意：此方法仅为获取主题，但不能直接修改主题**

(你直接修改 ttheme.palette.mode 的值并不会触发主题模式生效变更)



<br>

## 亮/暗模式切换

假定我们已经在 `palette` 中对 亮暗 模式中的颜色进行了设置。

默认MUI 采用的是 亮(light)模式，想切换到暗模式修改配置：

```
const theme = createTheme({
    palette: {
        mode: 'dark'
    },
})
```



<br>

但是上面存在问题：我们希望明暗模式是可以用户通过按钮切换，而不是写死到 palette 中。

那么我们接下来将改造一下代码。



<br>

**实现 点击按钮进行 亮/暗模式 切换 的实现思路：**

* 先定义好 主题配置项
* 使用 zustand 做来状态管理，创建一个名为 useThemeData 的状态管理对象，其内部包含 模式(mode) + 主题(theme)
* 使用 `<IconButton>` 来创建可切换的 模式图标按钮
* 修改 `<ThemeProvider>` 组件的位置，由 main.tsx 改到 App.tsx，以便于监听 useThemeData 的变换并重新触发 `<App>` 重新渲染



<br>

**具体代码：**

> src/common/theme-options.ts

```
import { ThemeOptions } from '@mui/material'

const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
    }
}

export default themeOptions
```

> 在上面配置项中，我们只是为了演示效果，仅仅配置了 platte.mode 的值，实际中应该把自定义主题的其他配置项也都添加上。



<br>

> src/store/useThemeData.ts

```
import { PaletteMode, Theme, createTheme } from '@mui/material'
import { deepmerge } from '@mui/utils'
import { create } from 'zustand'
import { themeOptions } from '@/common'

interface UseThemeData {
    mode: PaletteMode
    theme: Theme
    toggleMode: () => void
    setData: (newMode: PaletteMode) => void
}

const useThemeData = create<UseThemeData>()((set, get) => ({
    mode: themeOptions.palette?.mode || 'light',
    theme: createTheme(themeOptions),
    toggleMode: () => {
        const newMode = get().mode === 'light' ? 'dark' : 'light'
        get().setData(newMode)
    },
    setData: (newMode) => set({
        mode: newMode,
        theme: createTheme(deepmerge(themeOptions, { palette: { mode: newMode } }))
    })
}))

export default useThemeData
```



<br>

**关于 useThemeData.ts 的说明：**

* 首先引入之前定义好的 主题配置项
* 然后通过 zustand 创建了一个数据状态，其包含：
  * mode：当前处于哪种模式(light/dark)
  * theme：主题实例
  * toggleMode：切换当前模式的调用函数
  * setData：根据 newMode 来更新 mode 和 theme
* 关于 setData 补充 2 点：
  * 我们使用了 MUI 为我们提供的一个 deepmerge 函数，用来深度合并 2 个对象
  * 这 2 个对象分别是：
    * 我们之前定义好的 主题配置项
    * 仅包含当前 处于哪个模式的 配置项
  * 最终合并之后就得到了切换过模式后的主题配置项，然后通过 createTheme() 重新生成得到一份 主题对象



<br>

> 如果不使用 deepmerge 函数，我们可以通过 JS 本身的解构方式来实现合并，代码为：
>
> ```
> theme: createTheme({
>  ...themeOptions,
>  palette: {
>      ...themeOptions.palette,
>      mode: newMode
>  }
> })
> ```



<br>

**在我们的计划里，最终：**

* mode、toggleMode() 给 负责点击切换模式的 图标按钮 使用
* theme 给 `<ThemeProvider>` 使用

那么接下来编写 模式图标切换按钮(`<ThemeModeSet>`) 和 App.tsx。



<br>

> src/components/theme-mode-set/index.tsx

```
import { useThemeData } from "@/store"
import { Brightness4, Brightness7 } from "@mui/icons-material"
import { IconButton } from "@mui/material"

const ThemeModeSet = () => {

    const { mode, toggleMode } = useThemeData(state => ({
        mode: state.mode,
        toggleMode: state.toggleMode
    }))

    return (
        <IconButton onClick={toggleMode}>
            {mode === 'light' ? <Brightness4 /> : < Brightness7 />}
        </IconButton>
    )
}

export default ThemeModeSet
```



<br>

> App.tsx，下面是伪代码

```
import { ThemeProvider } from '@mui/material'
import { useThemeData } from './store'
import { ThemeModeSet } from  '@/components'

function App() {
    const theme = useThemeData(state => state.theme)

    return (
        <ThemeProvider theme={theme}>
            <ThemeModeSet />
            { ... }
        </ThemeProvider>
    )
}

export default App
```



<br>

至此，亮/暗 模式切换效果完成。



<br>

虽然我们上面讲的是如何动态修改 亮/暗 模式，但是**按照这个思路(套路) 我们可以修改任何 主题样式 中的配置项，甚至是一个全新的主题。**



<br>

**目前为止，我们已经掌握了 Material UI 的基础知识：**

* Material UI 简介，与 Antd 的区别
* Material 安装、组件基础用法、自定义组件样式
* Material 自定义主题，亮/暗 模式切换

那么接下来就可以在实际项目中使用 Material UI 了。

由于 Material UI 组件特别强调 "组合与自定义"，所以实践过程中还会遇到一些问题。

再来慢慢更新本文。

