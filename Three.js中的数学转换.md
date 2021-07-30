# Three.js中的数学转换

为了系统学习 3D 图形学中的各种空间转换，所以写下本文。



<br>

## 点和向量

### 点

**别称：** 坐标点

**用途：** 记录坐标系中某个具体的位置

**对应类：** Vector2、Vector3、Vector4

**示例：**

```
let vector2 = new Vector2(0,1)
vector2.x = 2

let vector3 = new Vector3(x,y,z)

let vector4 = new Vector4(x,y,z,w)
```



<br>

### 向量(vector)

**别称：** 线段、矢量、方向

**用途：** 记录坐标系中某个线段或方向

**对应类：** Vector2、Vector3、Vector4

**示例：**

```
let vector2 = new Vector2(0,1)
vector2.x = 2

let vector3 = new Vector3(x,y,z)

let vector4 = new Vector4(x,y,z,w)
```



<br>

**向量的相关知识点：**

1. 在 Three.js 中，Vector2、Vector3、Vector4 他们是用于储存 点或向量 值的，所以看上去点和向量的用法完全一样。
2. 对于向量而言，暗含一层意思：向量的起点都是位于坐标系原点。
3. 当向量用于指明 “方向” 时，向量的长度是不重要的，所以通常会进行 **向量归一化**.



<br>

### 点积(dot)

**别名：** 点乘、内积

**表达式：** a · b = ||a|| ||b|| cosθ

**用途：** 

1. 可以推导出两个向量之间的内夹角 θ (弧度)

   > 注意：所谓内夹角，即 内角，也就是说这个 θ 的取值范围一定是 0 - π (0 - 180度之间)，这也是为什么点积又被称为内积的原因。
   >
   > 如果想计算出 a 旋转多少弧度 可以到 b，则不能使用 θ，而是需要使用其他公式，因为在二维平面中 旋转时区分 顺时针和逆时针 的。在图形学中默认沿逆时针方向为增加，沿顺时针方向为减去。
   >
   > 三维空间中是不区分顺时针和逆时针。

   ```
   cosθ = (a · b) / ||a|| ||b|| = xx
   θ = Math.acos(xx)
   
   
   补充说明一：||a|| ||b|| 的计算公式
   Three.js Vecotor2 中计算向量长度的方法为 .length()，那么上面公式我们很自然想到的是：
   ||a|| ||b|| = a.length() * b.length()
   但实际中，更多采用的是：
   ||a|| ||b|| = Math.sqrt(a.lengthSq() * b.lengthSq())
   .lengthSq() 方法为求向量长度的平方值，那么为什么先要平方后又开方呢？
   答：假设向量长度比较大，那么看似后者计算量要比前者大，实际上并不是这样的，实际上后者的计算效率更快，因此绝大多数时候都选择使用后者。
   
   
   补充说明二：在二维平面中，a 旋转多少弧度可以到达 b 的计算公式为
   其中 θ 的取值范围为 -π 至 π。θ > 0 则表示a顺时针旋转多少可以到达 b、θ < 0 则表示a逆时针旋转多少可以到达 b
   θ = Math.atan2(a.cross(b), a.dot(b))
   
   // 如果希望 θ 不为负数，则可以添加相应转化
   if(θ<0){
     θ += 2π
   }
   ```

2. 若我们知道两个向量 a、b 的夹角为 θ，就可以计算出一个向量a 在另外一个向量b 上的投影，即 cosθ * ||b||

3. 同理可以得出 sinθ * ||b|| 为两个向量之间最大的距离

4. 我们还可以通过两个向量的夹角 θ 的值，来判断这两个向量的前后关系。

   1. 若值等于 0 则表示这两个向量方向在一条直线上(相同或相反)
   2. 若值大于 0 则表示这两个向量方向基本相同
   3. 若值小于 0 则表示这两个向量方向基本相反

**运算律：** 符合交换律、分配率、结合律

```
a · b = b · a
a · (b + c) = a · b + a · c
a · b · c = a · (b · c)
```

**对应方法：** a.dot(b)

**计算结果：** 一个数字(number)

**示例：**

```
const a = new Vector2(1, 3)
const b = new Vector2(2, 1)
console.log(a.dot(b))
```



<br>

### 叉积(cross)

**别名：** 叉乘、外积

**表达式：** a x b

**用途：** 

1. 计算出同时垂直于两个向量的垂直向量。因此可以方便从一个二维平面构建出一个 3 维坐标系。也会应用于光栅化计算中。

   遵循右手螺旋法则：四指并拢，并且四指弯曲的方向和 a 旋转到 b 的方向一致，此时伸直大拇指，大拇指的方向即为 a b 叉乘结果的方向。

2. 判断两个向量，谁在左，谁在右

   计算 a 叉积 b，如果结果 > 0 则 b 在 a 左侧，反之 则 b 在 a 右侧。若叉积结果为 0 表示二者方向重合。

3. 判断一个点是在一个三角形内，还是三角形之外

   假设有 3 个向量 a b c 首尾相连构成了一个三角形，此时有一个点 p，依次分别计算出 a x ap、b x bp、c x cp，然后检验这 3 个叉乘结果是否都为正 或 为负。若三个叉乘结果都为正 或 都为负，那么就表明 点p 位于三角形内部。若出现有的叉乘结果为正，有的为负，那么就表明 点p 位于三角形外部。

**运算律：** 不符合交换律，a x b 和 b x a 的结果不相同。

**对应方法：** a.cross(b)

**计算结果：** 对于二维来说结果是一个数字(number)、对于三维来说结果是一个向量(Vector3)

> 因为在二维坐标系严格来讲并没有 叉积 的概念，二维坐标永远只有 x,y 两个轴，不存在第三个轴。
>
> 在 Three.js Vector2 中的 .cross() 仅仅是从形式上计算得到一个 “叉乘”，是一个数字。
>
> Vector2 中的 .cross() 具体计算公式为：a.x *b.y - a.y * b.x;

**示例：**

```
const a = new Vector2(1,0)
const b = new Vector2(0,1)
console.log(a.cross(b)) // 1


const c = new Vector3(1,0,0)
const d = new Vector3(0,1,0)
c.cross(d)
console.log(c) // Vector3 {x: 0, y: 0, z: 1}

请注意：在Three.js中，绝大多数计算都会直接修改对象本身。
例如上面示例中当 c.cross(d) 执行后，c 的值就会变成计算结果。
```



<br>

### Vector2的属性和方法

| 属性名 | 对应含义         |
| ------ | ---------------- |
| x      | x坐标值，默认为0 |
| y      | y坐标值，默认为0 |
| height | y的别名          |
| width  | x的别名          |

<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .add ( v : Vector2 ) : this                                  | 当前向量加上参数 v 向量                                      |
| .addScalar ( s : Float ) : this                              | 将当前向量的x、y 值分别加上参数 s                            |
| .addScaledVector ( v : Vector2, s : Float ) : this           | 相当于执行 this.add( v.addScalar(s) )                        |
| .addVectors ( a : Vector2, b : Vector2 ) : this              | 将当前向量设置为 a.add(b) 的执行结果                         |
| .angle () : Float                                            | 计算当前向量与 x 正轴的弧度，取值范围 0 - 2π                 |
| .applyMatrix3 ( m : Matrix3 ) : this                         | 将该向量乘以三阶矩阵 m（第三个值隐式地为1）                  |
| .ceil () : this                                              | 将当前向量的 x、y 向上取整                                   |
| .clamp ( min : Vector2, max : Vector2 ) : this               | 修正当前向量 x y 的值，确保在 min和max 的 x y 范围内         |
| .clampScalar ( min : Float, max : Float ) : this             | min相当于 Vector2(min,min)，作用等同于 .clamp()              |
| .clampLength ( min : Float, max : Float ) : this             | 修正当前向量的长度，确保在 min 和 max 之间                   |
| .clampScalar ( min : Float, max : Float ) : this             | 修正当前向量 x y 的值，确保在 min 和 max 之间                |
| .clone () : Vector2                                          | 返回一份当前向量的副本                                       |
| .copy ( v : Vector2 ) : this                                 | 将当前向量的值设置为 v 的值                                  |
| .distanceTo ( v : Vector2 ) : Float                          | 计算当前向量(结尾处)与 v (结尾处)的距离                      |
| .distanceToSquared ( v : Vector2 ) : Float                   | 计算当前向量(结尾处)与 v (结尾处)距离的平方值                |
| .manhattanDistanceTo ( v : Vector2 ) : Float                 | 计算当前向量与 v 的 `曼哈顿距离`(参见表格下方注解)           |
| .divide ( v : Vector2 ) : this                               | 将当前向量除以 v                                             |
| .divideScalar ( s : Float ) : this                           | 将当前向量 x y 都除以 s                                      |
| .dot ( v : Vector2 ) : Float                                 | 计算当前向量与 v 的点积，返回值为一个数字 number             |
| .cross ( v : Vector2 ) : Float                               | 计算当前向量与 v 的叉积，返回值为一个数字 number             |
| .equals ( v : Vector2 ) : Boolean                            | 检查当前向量是否与 v 完全相等，返回布尔值 boolean            |
| .floor () : this                                             | 将当前向量的 x、y 向下取整                                   |
| .fromArray ( array : Array, offset : Integer ) : this        | 将当前向量 x 设置为 array[offset]，y 为 array[offset+1]，<br />默认 offset 为0 |
| .fromBufferAttribute ( attribute : BufferAttribute, index : Integer ) : this | 将当前向量 x 设置为 attribute.getX(index)，y 为attribute.getY(index) |
| .getComponent ( index : Integer ) : Float                    | 若 index 为 0 返回 x，若 index 为 1 返回 y                   |
| .length () : Float                                           | 返回从(0,0)到(x,y)的几何长度，即该向量的长度                 |
| .lengthSq () : Float                                         | 返回该向量长度的平方值                                       |
| .manhattanLength () : Float                                  | 返回该向量的 `曼哈顿` 长度                                   |
| .lerp ( v : Vector2, alpha : Float ) : this                  | 将当前向量的 x y 分别加上 当前向量与 v 的差值，且按照 alpha 作为系数。<br />alpha 取值范围 0 - 1，若 alpha 为 0 则相当于不做任何变动，若 alpha  为 1 则相当于将当前向量变为 v |
| .lerpVectors ( v1 : Vector2, v2 : Vector2, alpha : Float ) : this | 以 v1 作为基础，加上 v1 与 v2 的相差结果，且以 alpha 为系数。<br />alpha 取值范围 0 - 1，若 alpha 为 0 则相当于结果为 v1，若 alpha  为 1 则结果为 v2 |
| .negate () : this                                            | 向量取反，即 x = -x，y = -y                                  |
| .normalize () : this                                         | 将当前向量转化为单位向量(uni vector)，<br />转化后的向量方向不变，但长度为 1，被称为 `归一化` |
| .max ( v : Vector2 ) : this                                  | 将当前向量的 x 取值为 Math.max(this.x, v.x)，y 也类似        |
| .min ( v : Vector2 ) : this                                  | 将当前向量的 x 取值为 Math.min(this.x, v.x)，y 也类似        |
| .multiply ( v : Vector2 ) : this                             | 将当前向量的 x 与 v.x 进行相乘，即 this.x *= v.x，y 也类似   |
| .multiplyScalar ( s : Float ) : this                         | 将当前向量的 x 与 s 进行相乘，即 this.x *= s，y 也类似       |
| .rotateAround ( center : Vector2, angle : Float ) : this     | 将当前向量围绕着 center 旋转 angle 弧度                      |
| .round () : this                                             | 将当前向量的 x y 值分别四舍五入取整                          |
| .roundToZero () : this                                       | 将当前向量的 x y 值朝向 0 取整，<br />以 x 为例 若 x < 0 则 x = 0，若 x > 0 则 x = Math.floor(x)，y 也类似 |
| .set ( x : Float, y : Float ) : this                         | 设置当前向量的 x 和 y 的值                                   |
| .setComponent ( index : Integer, value : Float ) : null      | 若 index 为 0 则 this.x = value，若 index 为 1 则 this.y = value |
| .setLength ( l : Float ) : this                              | 将当前向量的长度修改为 l 的值，向量方向不变                  |
| .setScalar ( scalar : Float ) : this                         | 将当前向量的 x 和 y 的值均设置为 scalar<br />相当于执行 .set(scalar, scalar) |
| .setX ( x : Float ) : this                                   | 将当前向量的 x 修改为参数中的 x 的值                         |
| .setY ( y : Float ) : this                                   | 将当前向量的 y 修改为参数中的 x 的值                         |
| .sub ( v : Vector2 ) : this                                  | 将当前向量 减去 v 向量，即 this.x -= v.x，y 也类似           |
| .subScalar ( s : Float ) : this                              | 将当前向量中的 x 和 y 都减去 s                               |
| .subVectors ( a : Vector2, b : Vector2 ) : this              | 将当前向量的值设置为 a - b                                   |
| .toArray ( array : Array, offset : Integer ) : Array         | 将当前向量的 x 和 y 分别按照 offset、offset+1 的偏移量填充到 array 数组中，<br />并返回该数组。若 arry 为空则创建一个新的数组，offset 默认值为 0 |
| .random () : this                                            | 将当前向量的 x 和 y 分别设置成一个伪随机数，该随机数大于 0、小于 1 |



<br>

虽然 Three.js 中 Vector2 提供了这么多方法，但是他们大体上可以归类为以下几种：

**直接修改 x、y 的值：** 

1. setX、setY、set、setScalar、setComponent
2. max、min
3. ceil、floor、round、roundToZero、random

**修改限定 x、y 的取值范围：**

1. clamp、clampScalar、clampScalar

**设置或获取向量的其他形式：**

1. clone、copy
2. applyMatrix3、fromArray、fromBufferAttribute
3. lerp、lerpVectors
4. toArray、getComponent

**向量长度相关：**

1. length、lengthSq、manhattanLength
2. clampLength、setLength

**向量距离相关：**

1. distanceTo、distanceToSquared、manhattanDistanceTo

**向量的加减乘除：** 

1. add、addVectors、addScalar、addScaledVector
2. sub、subVectors、subScalar
3. multiply、multiplyScalar
4. divide、divideScaler

**向量的一些其他运算：**

1. dot、cross、normalize
2. negate
3. rotateAround
4. angle
5. equals



<br>

**曼哈顿距离**

传统几何概念中，我们计算 2 个点的距离使用的是 2 点划直线的方式。

> c = Math.sqrt( Math.pow(a,2) + Math.pow(b,2) )

在计算的过程中需要使用求平方和开根号，这种方式虽然无比精确但人类口算有点难。

`曼哈顿距离 `是19 世纪由数学家 赫尔曼·闵可夫斯基 发明的。

他将计算 2 点之间的距离简化为：| x1 - x2 | + | y1 - y2 |

> 由于是取绝对值，所以最终计算结果一定不为负数。
>
> 按照这个公式，实际上相当于 c = a + b

> 简化后的公式计算结果，虽然不够精准，但是对于人类口算而言非常简单。
>
> 实际生活也有意义，例如地图上 2 点之间的道路距离并不是 2 点的直线距离。

<br>

这个公式之所以叫 “曼哈顿距离”，是因为解释该公式的时候是以美国纽约曼哈顿区为示例。

曼哈顿区的道路几乎为横平竖直的 井字形道路。当出租车司机预估从 A街口 到达 B街口 所需要的距离时，就可以采用上述方式来预估出距离。

所以曼哈顿距离又被称为 `出租车距离`。

曼哈顿距离的定义，实际上是为了在现实生活中帮我们快速计算某些距离的一种简化方式。



<br>

### Vector3的属性和方法



