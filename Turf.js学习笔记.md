# Turf.js学习笔记



<br>

### Turf.js简介

Turf.js 是一个 空间分析(spatial analysis) 库。

* 基于 GeoJSON 格式，用于创建、分析、统计 地图上 2D 矢量图形(点、线、多边形 等)
* 使用的是 WSG84 椭球(地球)经纬坐标系



<br>

Turf.js 官方仓库：https://github.com/Turfjs/turf/

官方文档：https://turfjs.org/

非官方中文文档：https://turfjs.fenxianglu.cn/category/



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

我并不是做 GIS 开发的，所以本文只是浅尝辄止，简单学习一下 burf.js。



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

  > 像其他 GIS 相关库中 也是使用 features 这个单词，例如 cesium.js 对应的瓦片数据规范(3DTitle) 也是用了 features 这个单词

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
> type: 'Feature',
> properties: { name: 'myp' },
> geometry: { type: 'Point', coordinates: [ 20, 30 ] }
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

上面这些方法中坐标值都是明确的，turf.js 还为我们提供了一几个用于创建随机坐标相关的函数。



<br>

**随机生成一个坐标：**

```
const randomPosition = turf.randomPosition()
console.log(JSON.stringify(randomPosition))
```

```
[ 101.8014475664456, -5.510356300390078 ]
```



<br>

**限定随机坐标范围：bbox**

在 turf.js 官方文档中 bbox 是单词 bounding box (包围盒) 的简写。

生成随机坐标的方法中，bbox 默认值为 [-180,-90,180,90]，该值对应的包围盒含义为：

* x 值的随机范围为 -180 ~ 180
* y 值的随机范围为 -90 ~ 90



<br>

我们可以自定义限制 bbox 的范围：

```
const randomPosition = turf.randomPosition([-10, -10, 10, 10])
console.log(randomPosition)
```



<br>

除了随机生成点坐标的方法 .randomPosition()，turf.js 还为我们延展出其他几个方法：

* .randomPoint()：随机生成由 N 个点构成的 点集合
* .randomLineString()：随机生成由 N 个线段构成的 线段集合
* .randomPolygon()：随机生成由 N 个多边形构成的 多边形集合



<br>

**创建 随机点集合：**

```
const randomPoint = turf.randomPoint()
console.log(JSON.stringify(randomPoint))
```

> 为了方便看到具体完整的输出结果，我们输出前使用 JSON.stringify() 包裹一下

```
{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-157.7366790143802,73.14109337395016]}}]}
```



<br>

此外还可以设置生成点的数量，举例：

我们随机生成 3 个点，每个点的坐标取值范围(包围盒范围)为 [-10, -5, 10, 5]

```
const randomPoint = turf.randomPoint(3, { bbox: [-10, -5, 10, 5] })
console.log(JSON.stringify(randomPoint))
```

```
{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[6.504353438919068,-2.1927245825959063]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[7.14243009630756,-3.6507192336380667]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-7.947142388429023,-3.7930832516245117]}}]}
```



<br>

**创建 随机线段：**

随机创建由 1 个线段构成的 线段集合，其中我们提供了可选参数，对应要求：

* `bbox: [-10, -5, 10, 5]`：线段的每个坐标值取值范围为 [-10, -5, 10, 5]
* `num_vertices: 10`：线段由 10 个关键点构成
* `max_length: 1`：每 2 个关键点之间的最大距离为 1
* `max_rotation: Math.PI / 8`：每  2 个关键点之间的最大角度差为 Math.PI / 8

```
const randomLine = turf.randomLineString(1, { bbox: [-10, -5, 10, 5], num_vertices: 10, max_length: 1, max_rotation: Math.PI / 8 })
console.log(JSON.stringify(randomLine))
```

```
{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"LineString","coordinates":[[3.229047175113413,-1.0544520982760153],[3.2290497230247612,-1.054464896157753],[3.228984370518046,-1.054462302297186],[3.229043501104713,-1.054446958389796],[3.2290917372993864,-1.0544478306244958],[3.2290993739437663,-1.0544509878756745],[3.2291796157031087,-1.0544572251392244],[3.2292481382201754,-1.0544352722636818],[3.2293042862002994,-1.0544054118033268],[3.229333670980465,-1.0543889641613367]]}}]}
```



<br>

**创建 随机多边形集合：**

创建由 1 个多边形构成的 多边形几何，其中可选参数我们设定：

* `bbox: [-10, -5, 10, 5]`：该多边形的包围盒，即多边形所有点都在该范围内
* `num_vertices: 10`：多边形的顶点数量
* `max_radial_length`：多边形的顶点最大辐射长度，即从多边形的中心点向外辐射的最远距离，该参数决定了这个多边形的形状和大小

```
const randomPolygon = turf.randomPolygon(1, { bbox: [-10, -5, 10, 5], num_vertices: 10, max_radial_length: 10 })
console.log(JSON.stringify(randomPolygon))
```

```
{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-4.02729622196555,2.6679116742757065],[3.3397836498759554,5.402964857676213],[1.0575460612519203,-1.8783013418007473],[-0.4246964091071499,-5.632227308161819],[-5.9009600358520995,-5.927595354448803],[-6.905542761639225,-5.304564359183412],[-10.497012158935258,-2.5332055726116196],[-4.91127001151212,1.3193696121835423],[-7.520693361130173,4.384053871455923],[-8.003219414520748,7.737138213064533],[-4.02729622196555,2.6679116742757065]]]}}]}
```



<br>

**小总结：**

到目前为止，我们已经初步学习掌握了：

* 创建基础实例：点(point)、多点(multiPoint)、线(line)、多线(multiLine)、多边形(polygon)、多个多边形(multiPolygon)
* 创建同一类型实例的集合：点集合(points)、线集合(lines)、多边形集合(polygons)
* 创建几何体或实例：geometry()、feature()
* 创建不同类型的几何体几何或实例集合：geometryCollection()、featureCollection()
* 根据配置创建随机的 坐标(randomPosition)、随机点集合(randomPoint)、随机线段集合(randomLineString)、随机多边形集合(randomPolygon)



<br>

接下来，我们就可以开始学习针对 点、线、多边形 turf.js 为我们提供的一些算法函数。



<br>

### 一些常见的变换算法

对应文档中 `TRANSFORMATION` 部分。



<br>

**平滑线段：.bezierSpline()**

**生成凸多边形：.convex()**

**生成凹多边形：.concae()**

**简化多边形：.simplify()**

**多边形拆分成N个三角形：.tesselate()**

> 将一个多边形拆分成 N 个三角形 这个函数对于 three.js 创建几何体来说很常用

**计算两个或多个多边形的合集(联合)：.union()**

**计算两个或多个多边形的交集：.intersect()**

**计算两个多边形的差异(用第二个多边形裁剪第一个多边形)：.difference()**

...



<br>

具体每个函数的详细用法，去看文档对应给的示例即可。



<br>

**补充说明：**

这里推荐一个纯针对笛卡尔坐标系的多边形 计算库

```
yarn add clipper-lib
```

代码仓库：https://github.com/junmer/clipper-lib



<br>

### 一些常见的测量方法

对应文档中 `MEASUREMENT` 这部分。



<br>

**计算线段上的某个延长点：.along()**

> 例如一根线段总长 100，那么 along() 函数可以用来计算在 50 时候该点应该所处的位置

**计算多边形面积：.area()**



<br>

------ 特别强调 ------

**时刻记得 burf.js 是用于 GIS 的库，所以上面那些计算 长度或面积 实际针对的是 地球椭球坐标系，而不是 笛卡尔坐标系。**



<br>

请看这个代码：

一个正方形的多边形，计算它的面积：

```
const polygon = turf.polygon([[[-5, -5], [5, -5], [5, 5], [-5, 5], [-5, -5]]])
const area = turf.area(polygon)
console.log(area)
```

```
1237630656871.5989
```

这个输出值是按照经纬度换算出来的面积，而不是平面中的 100...



<br>

**计算中心点：.center()**

**计算多边形质心：.centroid()**

....



<br>

关于 turf.js 大体入门介绍就是这些了。
