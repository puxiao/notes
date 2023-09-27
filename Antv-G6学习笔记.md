# Antv-G6学习笔记



<br>

## Antv G6 是用来做什么的？

<br>

**Antv是？**

阿里开源的 Antd 是组件库，而平级的 Antv 是 "图形视觉库"，说直白点就是用来绘制各种特殊表格、树状、网状 图形，并且支持各种交互、动画的 2D 引擎。

Antv 官网将其描述为 "让数据栩栩如生"。

Antv 官网：https://antv.antgroup.com/



<br>

**Antv G6是？：**

针对不同使用场景 Antv 下面细分除了很多不同的库，Antv G6 就是其中一个子项。

为了省事，本文就将  Antv G6 简称为 G6。

<br>

**G6是用来快速构建 数据关系可视化 的 2D 引擎库。**

强调的是 有关联数据 之间的可视化，这里特指 图数据。

官网：https://g6.antv.vision/zh



<br>

**基于 G6 引擎又封装出了另外一个组件库：Graphin**

Graphin 名字来源于 Graph Insight (图的分析洞察) 。

官网：https://graphin.antv.vision/zh



<br>

简单介绍到此结束，接下来开始分别学习 G6 和 Graphin。

> G6 将是学习重点，毕竟把核心引擎弄懂了，完全可以自己创建自己的组件，甚至可以不需要 Graphin。



<br>

**注：本文是基于 React + TypeScript + Vite 为前端开发框架的。**



<br>

## G6 基础入门

<br>

**安装G6：**

```
yarn add @antv/g6
```



<br>

>当前最新稳定版本为 4.8.22，下一版本 5.x 正在开发中
>
>如果你想提前体验，则安装命令：
>
>```
>yarn add @antv/g6@5.0.0-beta.11
>```
>
>5.x 对应的官网为：https://g6-next.antv.antgroup.com/，本文是以 4.8.x 为准的。



<br>

**引入G6：**

```
import G6 from '@antv/g6'
```

```
//直接引入 G6 中的某个类或模块
import { Graph } from '@antv/g6'
```



<br>

下面开始讲述一下，使用 G6 绘制一个简单数据的基本流程。



<br>

**第1步：创建一个用于承载 G6 渲染画布的父级 div 元素**

这个和其它图形引擎非常相似，例如 three.js、konva.js 都是这样做的

```
<div id='mountNode'></div>
```

> div 的 id 叫什么无所谓，也可以是 "myCanvas" 都行

> mount 单词本意为：准备



<br>

**第2步：数据准备**

和 Echart 相同 G6 的数据也是 JSON 格式。



<br>

我们先跳跃式看一下 G6 绑定数据的函数 data 的 类型定义：

```
data(data?: GraphData | TreeGraphData): void;
```

也就是说 G6 支持 2 种格式的数据源：GraphData 和 TreeGraphData

* GraphData：一般的、基础的 图数据，在 Antv 中将其称呼为 `一般图`

* TreeGraphData：树状图 数据，在 Antv 中将其称呼为 `树图`

  > 我个人一直习惯称呼为 树状图，所谓，都是同一个意思



<br>

分别看一下这 2 个数据的类型定义。

```
export interface GraphData {
    nodes?: NodeConfig[];
    edges?: EdgeConfig[];
    combos?: ComboConfig[];
    [key: string]: any;
}

export interface TreeGraphData {
    id: string;
    label?: string;
    x?: number;
    y?: number;
    children?: TreeGraphData[];
    data?: ModelConfig;
    side?: 'left' | 'right';
    depth?: number;
    collapsed?: boolean;
    style?: ShapeStyle | {
        [key: string]: ShapeStyle;
    };
    stateStyles?: StateStyles;
    [key: string]: unknown;
}
```

> 只需简单看一眼就好，等到实际编写例子时会对上述每个属性进行详细讲解。



<br>

我们先不学习 TreeGraphData(树图)，而是先从简单的 GraphData(一般图) 开始。

下面是一个符合 G6 一般图(GraphData) 的简单示例：

```
const data = {
  nodes: [
    { id:'node1', x:100, y:100 },
    { id:'node2', x:300, y:200 }
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2'
    }
  ]
}
```

我们可以看到 数据集 data 是一个 Object 对象，定义了 2 个属性：

* nodes：一个数组，数组中每个元素都是一个 Object 对象，该对象包含唯一 id 和一些其他属性，例如坐标 x,y
* edges: 一个数组，数组中每个元素都是一个 Object 对象，该对象包含 `source(起始点)` 和 `target(目标点)`

进一步解释：

* nodes：绘制图形中的所有 原始节点数据，我们称之为 `点集`

* edges：绘制图形中所有的 起始点和结束点 信息，我们称之为 `边集`

  > 试想一下 起始点 和 结束点 连接，就构成了一条 "线段"，也就是上面提到的 "边线"，N 个边线总体上就被称为 `边集`



<br>

再看一遍 GraphData 的类型定义：

```
export interface GraphData {
    nodes?: NodeConfig[];
    edges?: EdgeConfig[];
    combos?: ComboConfig[];
    [key: string]: any;
}
```

也就是说上述示例中，没有提及 combos，那 combos 又是干什么的呢？

答：combos 是 combo 的复数，而 combo 单词可以翻译为 "混合物，联合体"。

> combo 单词本身还可以翻译成 "小型爵士乐队"

<br>

combos 在 G6 中表示 "组合体、联合体、分组"，例如将若干个节点联合起来构成一个 "小团体"。 

而这个 "小团体" 在表现形式上：

* 使用 G6 内置的有 2 种：圆 或 矩形

  > 例如把若干个节点 "收纳" 在一个圆形里，或者节点平均分布在某个圆圈的边缘之上

* 自定义 combo



<br>

> 在 Antv G6 的官方文档中并没有将 combo 翻译成某个中文，而是一直使用英文 combo。
>
> 在本文中我会将 combo 翻译为 "联合体"，也就是说当我说 "联合体" 时你知道是指 combo



<br>

如果你想现在就了解 点集 (nodes) 、边集(edges) 和 联合体(combo) 的详细属性用法，可查阅 G6 文档：

* 节点：https://g6.antv.antgroup.com/manual/middle/elements/nodes/default-node
* 边：https://g6.antv.antgroup.com/manual/middle/elements/edges/default-edge
* 联合体：https://g6.antv.antgroup.com/manual/middle/elements/combos/default-combo



<br>

**第3步：实例化关系图**

我们前面已经引入了 G6，那么接下来就实例化一个具体的关系图。

> 我们上面提到了数据源有 GraphData(一般图) 和 TreeGraphData(树图)，虽然最终渲染结果长的不一样，但是他们都是用来表达数据关系的，所以都将他们称呼为 "关系图"

```
const graph = new G6.Graph({
    container:'mountNode', //与之前创建的 <div id='mountNode'></div> 进行关联
    width: 800, //画布宽度
    height: 600 //画布高度
})

//--------------

//也可以直接引入 Graph
import { Graph } from '@antv/g6'
const graph = new Graph({
    container:'mountNode', //与之前创建的 <div id='mountNode'></div> 进行关联
    width: 800, //画布宽度
    height: 600 //画布高度
})
```

> 除了以上 3 个必须填的配置项，还有其他很多可选配置项，以后再学习使用



<br>

**第4步：配置关系图**

```
graph.data(data) //绑定数据源
graph.render() //执行渲染
```



<br>

只此，一个最简单基础的 G6 示例就完成了。



<br>

**真的完成了？**

答：没有

因为我们还缺少了最后一环：销毁



<br>

graph 会向绑定的父级 div 中添加一个 canvas 元素用于绘制图形，**但 graph 每次初始化时并不会自动清空该div，这就会导致如果多次执行初始化，那么你就会在父级 div 里得到 N 个渲染结果的画布(canvas)元素**。

这对于 React18 项目而言非常受影响，因为 react18 默认初始化会执行 2 遍，也就意味着会父级 div 里会有 2 份一模一样的 画布。



<br>

所以使用 G6 的最后一环节是：清空销毁



<br>

**第5步：清空销毁关系图**

```
graph.destroy()
```

> 调用 .destroy() 后就会自动销毁已创建的关系图，即删除父级 div 中添加的 canvas 画布元素



<br>

**基于 React 的完整示例代码：**

```
import { useEffect } from 'react'
import { Graph, GraphData } from '@antv/g6'

const HelloG6 = () => {

    useEffect(() => {

        const data: GraphData = {
            nodes: [
                { id: 'node1', x: 100, y: 100 },
                { id: 'node2', x: 300, y: 200 }
            ],
            edges: [
                {
                    source: 'node1',
                    target: 'node2'
                }
            ]
        }

        const graph = new Graph({
            container: 'mountNode',
            width: 800,
            height: 600
        })

        graph.data(data)
        graph.render()

        return () => {
            graph.destroy()
        }

    }, [])

    return (
        <div id='mountNode'></div>
    )
}

export default HelloG6
```



<br>

完整的 G6 核心和用法可查看其官方文档：https://g6.antv.antgroup.com/manual/middle/overview