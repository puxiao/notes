# Turf.js学习笔记



<br>

### Turf.js简介

Turf.js 是一个 空间分析(spatial analysis) 库。

* 基于 GeoJSON 格式，用于创建、分析、统计 地图上 2D 矢量图形(点、线、多边形 等)
* 使用的是 WSG84 椭球(地球)经纬坐标系



<br>

Turf.js 官方仓库：https://github.com/Turfjs/turf/

官方文档：https://turfjs.org/



<br>

**Turf 名字含义：**

turf 单词本身可翻译为：草坪、草皮、人工草皮

我个人理解为 "使用 turf.js 绘制的各种地理空间几何图形，就好像草皮一样覆盖在地面之上"。



<br>

**空间分析：**

空间分析或空间统计包括利用拓扑关系、几何关系 或 地理属性来对地理试题进行研究的各种技术的一种统称。



<br>

**GeoJSON规范：**

GeoJSON 是一种用于描各种地理数据结构的规范格式。

具体规范内容可查看：https://datatracker.ietf.org/doc/html/rfc7946



<br>

**虽然 turf.js 本身是用作 GIS 相关的，但是我学习 turf.js 的原因确实因为它提供了一些多边形的常见操作函数，例如求 N 个多边形的合并或交集、求多边形的面积。**

所以本文中并不去学习 turf.js 中与 GIS 相关的知识，仅仅是学习一下关于 turf.js 中 几何图形 相关的几个计算函数。



<br>

### 安装 turf.js



<br>

**NPM 安装**

```
yarn add @turf/turf
```

> 该包自带 TypeScript 类型定义



<br>

**网页引入**

```
<script src="turf.min.js" charset="utf-8"></script>
```

或

```
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>
```



<br>

### 关于坐标值的特别说明：

无论是 点、线、多边形，还是其他几何图形，在描述每个点时都需要一个二维坐标 XY。

> 特别说明：turf.js 中某个坐标都是通过二维数组，例如 [ 30, 40 ] 这种形式来表示的。



<br>

对于 turf.js 而言由于它本身是用作 GIS 相关的，所以很自然它认为的坐标应该是地图的经纬度坐标。

而对于像我这样，准备把 turf.js 用作网页 2D 编辑器中，所以我使用的坐标是网页画布坐标。



<br>

**特别提醒：由于 JS 的浮点数存在精度问题，所以在使用坐标时建议最多只保留小数点后 8 位，如果坐标中小数点后面位数过多，在 turf.js 中会容易出现一些因为精度原因造成的问题。**



<br>

### 前置说明

由于 turf.js 侧重点是数据创建、保存、分析，并非数据可视化，所以在使用 truf.js 时是不需要关联网页网页画布或地图控件的。

turf.js 只是可以为这些可视化库提供几何数据支持。

例如：

* 可以与 konva.js 结合使用，在画布上绘制显示各种几何图形
* 可以与 XX 地图 结合使用，在地图控件上绘制显示各种集合图形
* ...

由于 turf.js 本身不需要依附于任何网页元素，所以 turf.js 可以运行在 node.js 环境中。



<br>

下面开始根据 官方文档来学习一下有用的函数。



<br>

**特别说明一下：**

下面使用到的函数可能包含有可选参数，只是我在演示代码中未必会使用到，所以每个函数完整的参数还是自己查阅官方文档即可。



<br>

### 创建 点、线、多边形 (对应文档中 Helper 这部分)

**创建 点：**

```
import * as turf from '@turf/turf'

const point = turf.point([20.0, 30.0])
console.log(point)
```

```
{
  type: 'Feature',
  properties: {},
  geometry: { type: 'Point', coordinates: [ 20, 30 ] }
}
```

> 输出的结果为符合 GeoJSON 规范的一个对象



<br>

> 下面的代码中将省略 `import * as turf from '@turf/turf'`



<br>

**创建 多点：**

```
const multiPoint = turf.multiPoint([[1, 2], [4, 5], [2, 3]])
console.log(multiPoint)
```

```
{
  type: 'Feature',
  properties: {},
  geometry: { type: 'MultiPoint', coordinates: [ [Array], [Array], [Array] ] }
}
```



<br>

**创建 多集合：**

```
turf.points([[1, 2], [4, 5], [7, 8]])
console.log(turf.points([[1, 2], [4, 5], [7, 8]]))
```

```
{
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: [Object] },
    { type: 'Feature', properties: {}, geometry: [Object] },
    { type: 'Feature', properties: {}, geometry: [Object] }
  ]
}
```



<br>

关于 多点(multiPoint) 和 点集合(points) 的差异，可以从输出上明显看出区别。

我们先说一下涉及到的几个单词：

* properties：属性，可以理解为 JS 中对象的属性

* features：特征、实体、实例

  > 在本文中，我个人喜欢将 features 称呼为 实例，实际上使用 `特征实例` 更加精准

* collection：集合、聚集、一批

* geometry：几何体、几何形状



<br>

> 在上面输出的信息中 properties 值都为空对象是因为我们没有设置属性。
>
> 我们可以在对应函数的第  2 个可选参数中配置属性
>
> ```
> const point = turf.point([20.0, 30.0], { name: 'myp' })
> ```
>
> ```
> {
>   type: 'Feature',
>   properties: { name: 'myp' },
>   geometry: { type: 'Point', coordinates: [ 20, 30 ] }
> }
> ```



<br>

也就是说：

* 多点(multiPoint) 是指：一个包含多个点信息的实例
* 点集合(points) 是指：由多个 点实例 组成的一个集合



<br>

关于 多X 与 多X集合，后面还会遇到，例如 多线 与 多线集合。



<br>

**创建 线：**

```
const line = turf.lineString([[1, 2], [4, 5], [7, 8]])
console.log(line)
```

```
{
  type: 'Feature',
  properties: {},
  geometry: { type: 'LineString', coordinates: [ [Array], [Array], [Array] ] }
}
```



<br>

**创建 多线：**

```
const multiLine = turf.multiLineString([[[1, 2], [4, 5], [2, 3]], [[2, 2], [4, 4], [5, 3]]])
console.log(multiLine)
```

> 请注意：
>
> * 一根线上的每个点是一个一维数组
>
> * 每一根线是由若干个点构成的一个二维数组
> * N 根线就是一个三维数组，其中每个元素为一根线(一个二维数组)

<br>

```
{
  type: 'Feature',
  properties: {},
  geometry: { type: 'MultiLineString', coordinates: [ [Array], [Array] ] }
}
```



<br>

**创建 线集合：**

```
const lines = turf.lineStrings([[[1, 2], [4, 5], [2, 3]], [[2, 2], [4, 4], [5, 3]]])
console.log(lines)
```

```
{
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: [Object] },
    { type: 'Feature', properties: {}, geometry: [Object] }
  ]
}
```



<br>

**创建 多边形：**

```
const polygon = turf.polygon([[[1, 2], [4, 5], [3, 2], [1, 2]]])
console.log(polygon)
```

> 请注意上述代码中多边形的首尾坐标是相同的，都是 `[1,2]` 即表示这是一个首尾连接的多边形

```
{
  type: 'Feature',
  properties: {},
  geometry: { type: 'Polygon', coordinates: [ [Array] ] }
}
```



<br>

如果多边形首尾不相连，即首尾坐标不相同，则会报错：

```
const polygon = turf.polygon([[[1, 2], [4, 5], [3, 2], [2, 2]]])
```

```
Error: First and last Position are not equivalent.
```



<br>

如果多边形的点数低于 3 个点，则会报错：

```
const polygon = turf.polygon([[[1, 2], [4, 5]]])
console.log(polygon)
```

```
Error: Each LinearRing of a Polygon must have 4 or more Positions.
```



<br>

也就是说一个多边形应该是：

* 至少需要 4 个点
* 收尾坐标需要相同



<br>

如果你的需求是收尾不相连，那么你别用多边形，直接用 线(line) 好了。



<br>

**创建 多个多边形：**

```
const multiPolygon = turf.multiPolygon([
    [[[1, 2], [4, 5], [2, 3], [1, 2]]],
    [[[3, 2], [1, 3], [3, 2], [3, 2]]]
])
console.log(multiPolygon)
```

```
{
  type: 'Feature',
  properties: {},
  geometry: { type: 'MultiPolygon', coordinates: [ [Array], [Array] ] }
}
```

> 这个多边形 是由 2 个多边形几何数据构成的



<br>

**创建 多边形集合：**

```
const polygons = turf.polygons([
    [[[1, 2], [4, 5], [2, 3], [1, 2]]],
    [[[3, 2], [1, 3], [3, 2], [3, 2]]]
])
console.log(polygons)
```

```
{
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: [Object] },
    { type: 'Feature', properties: {}, geometry: [Object] }
  ]
}
```

> 这个多边形 是由 2 个多边形实例构成的



<br>

通过上面例子，我们已经知道了如何通过某个特定函数来创建 点、线、多边形 的几何体。



<br>

我们回顾一下这段代码：

```
const point = turf.point([20.0, 30.0], { name: 'myp' })
console.log(point)
```

输出的结果为一个符合 GeoJSON 规范的对象：

```
{
  type: 'Feature',
  properties: { name: 'myp' },
  geometry: { type: 'Point', coordinates: [ 20, 30 ] }
}
```



<br>

当我们想保存 point 实例时，就可以将 point 进行 JSON 序列化，以文本形式保存起来。



<br>

与上面行为相反，如果我们有几何体或实体的数据信息，又该如何还原成 实例(feature)呢？

这就用到 `geometry()` 和 `feature()` 函数了。



<br>

**创建 几何体：**

```
const geometry = turf.geometry('Point', [20, 30])
console.log(geometry)
```

```
{ type: 'Point', coordinates: [ 20, 30 ] }
```



<br>

**根据几何体创建 实例：**

```
const geometry = turf.geometry('Point', [20, 30])
const point = turf.feature(geometry, {
    name: 'myp'
})
console.log(point)
```

```
{
  type: 'Feature',
  properties: { name: 'myp' },
  geometry: { type: 'Point', coordinates: [ 20, 30 ] }
}
```



<br>

出此之外，我们还可以使用：

* `featureCollection()`：将若干个实例组成一个实例集合
* `geometryCollection()`：将若干个几何体组成一个几何体集合



<br>

**创建 几何体集合：**

```
const point = turf.geometry('Point', [1, 3])
const line = turf.geometry('LineString', [[1, 3], [2, 4], [5, 6]])
const collection = turf.geometryCollection([point, line])
console.log(collection)
```

```
{
  type: 'Feature',
  properties: {},
  geometry: { type: 'GeometryCollection', geometries: [ [Object], [Object] ] }
}
```



<br>

**创建 实例集合：**

```
const point = turf.geometry('Point', [1, 3])
const line = turf.geometry('LineString', [[1, 3], [2, 4], [5, 6]])
const collection = turf.featureCollection([
    turf.feature(point),
    turf.feature(line),
    turf.polygon([[[1, 2], [4, 5], [2, 3], [1, 2]]]),
])
console.log(collection)
```

```
{
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: {}, geometry: [Object] },
    { type: 'Feature', properties: {}, geometry: [Object] },
    { type: 'Feature', properties: {}, geometry: [Object] }
  ]
}
```



<br>

**小总结：**

到目前为止，我们已经初步学习掌握了：

* 创建基础实例：点(point)、多点(multiPoint)、线(line)、多线(multiLine)、多边形(polygon)、多个多边形(multiPolygon)
* 创建同一类型实例的集合：点集合(points)、线集合(lines)、多边形集合(polygons)
* 创建几何体或实例：geometry()、feature()
* 创建不同类型的几何体几何或实例集合：geometryCollection()、featureCollection()



<br>

接下来，我们就可以开始学习针对 点、线、多边形 turf.js 为我们提供的一些算法函数。



<br>

未完待续...
