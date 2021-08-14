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
| .getComponent ( index : Integer ) : Float                    | 若 index 为 0 返回 x，若 index 为 1 返回 y<br />`component` 在这里的意思为 “分量” |
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

### Vector3的方法

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .add ( v : Vector3 ) : this                                  | 将当前向量的 x y z 分别加上 v 的 x y z                       |
| .addScalar ( s : Float ) : this                              | 将当前向量的 x y z 分别加上 s                                |
| .addScaledVector ( v : Vector3, s : Float ) : this           | 将当前向量的 x y z 分别加上 v  与 s 的相乘结果               |
| .addVectors ( a : Vector3, b : Vector3 ) : this              | 将当前向量的值设置为 a + b 的结果                            |
| .applyAxisAngle ( axis : Vector3, angle : Float ) : this     | 计算 axis 和 angle 的旋转结果，并应用于当前向量(旋转)        |
| .applyEuler ( euler : Euler ) : this                         | 先将参数 euler 欧拉角 转换为四元素，然后将该四元素应用于当前向量 |
| .applyMatrix3 ( m : Matrix3 ) : this                         | 将当前向量乘以(应用)参数 三阶矩阵 m                          |
| .applyMatrix4 ( m : Matrix4 ) : this                         | 将当前向量乘以(应用)参数 四阶矩阵 m，请注意会隐式得将参数m第4维度值为 1 |
| .applyNormalMatrix ( m : Matrix3 ) : this                    | 将当前向量乘以正规矩阵 m，并将结果进行归一化                 |
| .applyQuaternion ( quaternion : Quaternion ) : this          | 将四元数参数 quaternion 应用于当前向量上                     |
| .angleTo ( v : Vector3 ) : Float                             | 以弧度返回当前向量与向量 v 之间的角度                        |
| .ceil () : this                                              | 将该向量的 x y z 分别向上取整                                |
| .clamp ( min : Vector3, max : Vector3 ) : this               | 修正当前向量 x y z 的值，以确保在 min 和 max 相应xyz的范围内 |
| .clampLength ( min : Float, max : Float ) : this             | 修正当前向量的长度 ，以确保向量长度在 min 和 max 的范围内    |
| .clampScalar ( min : Float, max : Float ) : this             | 修正当前向量的 x y z 的值，以确保在 min 和 max 的范围内      |
| .clone () : Vector3                                          | 复制并返回一个新的 Vector3 向量                              |
| .copy ( v : Vector3 ) : this                                 | 将当前向量设设置成和参数 v 相同的值                          |
| .cross ( v : Vector3 ) : this                                | 计算当前向量与参数 v 的叉积，并将结果赋值给当前向量          |
| .crossVectors ( a : Vector3, b : Vector3 ) : this            | 计算参数 a 与 b 的叉积，然后将结果赋值给当前向量             |
| .distanceTo ( v : Vector3 ) : Float                          | 计算当前向量与参数 v 之间的距离                              |
| .manhattanDistanceTo ( v : Vector3 ) : Float                 | 计算当前向量与参数 v 之间的曼哈顿距离                        |
| .distanceToSquared ( v : Vector3 ) : Float                   | 计算当前向量与参数 v 的距离的平方                            |
| .divide ( v : Vector3 ) : this                               | 将当前向量除以参数 v，即 this.x = this.x/v.x，y z 同理       |
| .divideScalar ( s : Float ) : this                           | 将当前向量的 x y z 分别除以 s，若 s 为 0 则当前向量将被设置为：(0,0,0) |
| .dot ( v : Vector3 ) : Float                                 | 计算当前向量与参数 v 的点积，当前向量并不会发生任何变化      |
| .equals ( v : Vector3 ) : Boolean                            | 检查当前向量与参数 v 是否严格相等                            |
| .floor () : this                                             | 将当前向量的 x y z 分别向下取整                              |
| .fromArray ( array : Array, offset : Integer ) : this        | 将当前向量的 x 的值设置为 array[offset+0]，y = array[offset+1]，z = arrya[offset+2]，offset 默认值为 0 |
| .fromBufferAttribute ( attribute : BufferAttribute, index : Integer ) : this | 将当前向量的 x y z 的值分别设置为 attribute.getX(index)、attribute.getY(index)、attribute.getZ(index) |
| .getComponent ( index : Integer ) : Float                    | 若 index 为 0 则返回 x，1 返回 y ，2 返回 z                  |
| .length () : Float                                           | 向量的欧几里得长度                                           |
| .manhattanLength () : Float                                  | 向量的曼哈顿距离                                             |
| .lengthSq () : Float                                         | 向量的欧几里得长度的平方                                     |
| .lerp ( v : Vector3, alpha : Float ) : this                  | 将当前向量加上当前向量与 v 的插值，this += (v - this) * alpha。alpha 取值范围为 0 至 1，因此当 alpha 为 0 时当前向量不变，当 alpha 为 1 时当前向量等于 v |
| .lerpVectors ( v1 : Vector3, v2 : Vector3, alpha : Float ) : this | 将当前向量设置为 this = v1 + (v1 - v2) * alpha 。alpha 的取值范围同 .lerp 相同 |
| .max ( v : Vector3 ) : this                                  | 将当前向量的 x 设置为 Math.max(this.x, v.x)，y z 也如此这样操作 |
| .min ( v : Vector3 ) : this                                  | 将当前向量的 x 设置为 Math.min(this.x, v.x)，y z 也如此这样操作 |
| .multiply ( v : Vector3 ) : this                             | 将当前向量与 v 进行相乘                                      |
| .multiplyScalar ( s : Float ) : this                         | 将当前向量的 x y z 分别与 s 进行相乘                         |
| .multiplyVectors ( a : Vector3, b : Vector3 ) : this         | 将当前向量设置为 a 与 b 相乘的结果                           |
| .negate () : this                                            | 向量取反，即 x = -x ，y = -y ，z = -z                        |
| .normalize () : this                                         | 将当前向量转换为单位向量(unit vector)，即向量长度为 1，方向不变。由于向量长度为1，则意味着 x y z 他们的取值范围一定是 大于等于 -1，小于等于 1。这种操作也被称为 “向量归一化” |
| .project ( camera : Camera ) : this                          | 将此向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。 |
| .unproject ( camera : Camera ) : this                        | 将此向量(坐标)从相机的标准化设备坐标 (NDC) 空间投影到世界空间。 |
| .projectOnPlane ( planeNormal : Vector3 ) : this             | 通过从该向量减去投影到平面法线上的向量，将该向量投影到平面上。 |
| .projectOnVector ( v : Vector3 ) : this                      | 投影当前向量到参数 v 上                                      |
| .reflect ( normal : Vector3 ) : this                         | 将该向量设置为对指定 normal 法线的表面的反射向量。<br />假设法线具有单位长度(也就是说法线长度不能为 0) |
| .round () : this                                             | 将该向量的 x y z 分别四舍五入取整                            |
| .roundToZero () : this                                       | 将该向量的 x y z 分别朝向 0 取整<br />以 x 为例 若 x < 0 则 x = 0，若 x > 0 则 x = Math.floor(x)，y 也类似 |
| .set ( x : Float, y : Float, z : Float ) : this              | 分别设置当前向量的 x y z 值                                  |
| .setComponent ( index : Integer, value : Float ) : null      | 若 index 为 0 则修改 x = value，若为 1 则修改 y ，若为 2 则修改 z |
| .setFromCylindricalCoords ( radius : Float, theta : Float, y : Float ) : this | 从圆柱坐标系中的 radius、theta、y 设置该向量。实际上执行的是：<br />this.x = radius * Math.sin(theta)、this.y = y、<br />this.z = radius * Math.cos(theta) |
| .setFromCylindrical ( c : Cylindrical ) : this               | 从圆柱坐标 c 中设置当前向量，相当于执行 .setFromCylindricalCoords ( c.radius, c.theta, c.y ) |
| .setFromMatrixColumn ( matrix : Matrix4, index : Integer ) : this | 从参数四阶矩阵 matrix 由 index 指定的列中 ，设置当前向量的 x y z 的值 |
| .setFromMatrix3Column ( matrix : Matrix3, index : Integer ) : this | 从传入的三阶矩阵 matrix 由 index 指定的列中，设置当前向量的 x 值、y 值和 z 值。 |
| .setFromMatrixPosition ( m : Matrix4 ) : this                | 从参数四阶矩阵 m 中设置当前向量的 x y z 与位置相关的元素。其中 x = m.elements[12]、y = m.elements[13]、z = m.elements[14] |
| .setFromMatrixScale ( m : Matrix4 ) : this                   | 从参数四阶矩阵 m 中设置当前向量的 x y z 与缩放相关的元素。   |
| .setFromSphericalCoords ( radius : Float, phi : Float, theta : Float ) : this | 从参数球坐标 radius、phi、theta 设置当前向量。               |
| .setFromSpherical ( s : Spherical ) : this                   | 从参数球坐标 s 中设置当前向量。实际上相当于执行 .setFromSphericalCoords(s.radius, s.phi, s.theta) |
| .setLength ( l : Float ) : this                              | 保持当前向量方向不变，将长度修改为 l                         |
| .setScalar ( scalar : Float ) : this                         | 将当前向量的 x y z 都设置为 scalar                           |
| .setX ( x : Float ) : this                                   | 设置 x 的值                                                  |
| .setY ( y : Float ) : this                                   | 设置 y 的值                                                  |
| .setZ ( z : Float ) : this                                   | 设置 z 的值                                                  |
| .sub ( v : Vector3 ) : this                                  | 将当前向量减去参数 v                                         |
| .subScalar ( s : Float ) : this                              | 将当前向量的 x y z 均减去 s                                  |
| .subVectors ( a : Vector3, b : Vector3 ) : this              | 将当前向量设置为 a - b 的结果                                |
| .toArray ( array : Array, offset : Integer ) : Array         | 返回由当前向量 x y z 构成一个数组 [x, y, z]。若参数 array 不为 undefined 则将 [x,y,z] 赋值给 array，offset 为数组偏移量，默认为 0 |
| .transformDirection ( m : Matrix4 ) : this                   | 由参数四阶矩阵 m 左上角 3 x 3 的子矩阵来设置当前矩阵，并将结果进行归一化。 |
| .random () : this                                            | 将当前向量的每个分量(x、y、z)设置为介于 0 和 1 之间的伪随机数，不包括 1。 |



<br>

**正规矩阵(normal matrix)：**

与自己的共轭转置矩阵对应的复系数方块矩阵。



<br>

**线性插值(linear interpolation)：**

> 是线性插值，不是线性差值

线性插值的意思即表示 2 点之间的直线上，计算点的位置公式。

假设 2 点构成了一个抛物线，有专门计算该抛物线上点位置公式，而线性插值是指将 2 点之间连接直线，求该直线上的点位置公式。



<br>

### Vector4的方法

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .add ( v : Vector4 ) : this                                  | 将当前向量加上 v                                             |
| .addScalar ( s : Float ) : this                              | 当前向量的 x y z w 分别加上 s                                |
| .addScaledVector ( v : Vector4, s : Float ) : this           | 先计算 v * s，然后将结果添加到当前向量中                     |
| .addVectors ( a : Vector4, b : Vector4 ) : this              | 将当前向量设置为 a + b                                       |
| .applyMatrix4 ( m : Matrix4 ) : this                         | 将当前向量乘以 四阶矩阵 m。<br />所谓矩阵变换实际上也是两个矩阵相乘。 |
| .ceil () : this                                              | 将当前向量的 x y z w 分别向上取整                            |
| .clamp ( min : Vector4, max : Vector4 ) : this               | 修订当前向量的 x y z w 的取值范围                            |
| .clampLength ( min : Float, max : Float ) : this             | 修订当前向量的长度的取值范围                                 |
| .clampScalar ( min : Float, max : Float ) : this             | 修订当前向量的 x y z w 的取值范围                            |
| .clone () : Vector4                                          | 返回一个克隆的当前向量                                       |
| .copy ( v : Vector4 ) : this                                 | 将当前向量设置为 v 相同的值                                  |
| .divideScalar ( s : Float ) : this                           | 将当前向量除以标量 s。<br />若 s 的值为 0，则当前向量会被设置为 (0,0,0,0) |
| .dot ( v : Vector4 ) : Float                                 | 计算当前向量与 v 的点积                                      |
| .equals ( v : Vector4 ) : Boolean                            | 检查当前向量是否与 v 完全相同                                |
| .floor () : this                                             | 将当前向量的 x y z w 向下取整                                |
| .fromArray ( array : Array, offset : Integer ) : this        | 从参数 array 中按照 offset 的索引偏移，依次设置当前向量的 x y z w 的值。offset 默认为 0 |
| .fromBufferAttribute ( attribute : BufferAttribute, index : Integer ) : this | 从参数 attribute 中按照 index 的索引，依次设置当前向量的 x y z w 的值，例如 this.x = attribute.getX(index)。 |
| .getComponent ( index : Integer ) : Float                    | 按照 index 的值返回分量 x 或 y 或 z 或 w                     |
| .length () : Float                                           | 计算并返回从 (0,0,0,0) 到当前向量的欧几里得长度              |
| .lengthSq () : Float                                         | 计算并返回当前向量长度的平方值                               |
| .manhattanLength () : Float                                  | 计算并返回当前向量的曼哈顿长度                               |
| .lerp ( v : Vector4, alpha : Float ) : this                  | 将当前向量设置为当前向量与 v 的线性插值，计算过程中加入 alpha 作为相乘因素。alpha 取值范围为 0 至 1，当 alpha 为 0 时计算结果为当前向量，当 alpha 为 1 时计算结果为 v |
| .lerpVectors ( v1 : Vector4, v2 : Vector4, alpha : Float ) : this | 将当前向量设置为 v1 与 v2 的线性插值。                       |
| .negate () : this                                            | 向量取反，即 x = -x，y = -y ...                              |
| .normalize () : this                                         | 将当前向量转化为单位向量(向量的归一化)。向量方向不变但长度变为 1。 |
| .max ( v : Vector4 ) : this                                  | 将当前向量的 x 执行 Math.max(this.x, v.x)，y z w 也类似      |
| .min ( v : Vector4 ) : this                                  | 将当前向量的 x 执行 Math.min(this.x, v.x)，y z w 也类似      |
| .multiply ( v : Vector4 ) : this                             | 将当前向量与 v 相乘。请注意这里的 “相乘” 是真的直接相乘，<br />例如 this.x *= v.x，这与 .applyMatrix() 中 “与四阶矩阵相乘” 是不同的。 |
| .multiplyScalar ( s : Float ) : this                         | 将当前向量的 x y z w 分别都乘以 s                            |
| .round () : this                                             | 将当前向量的 x y z w 分别都四舍五入                          |
| .roundToZero () : this                                       | 将当前向量的 x y z w 分别朝向 0 取整。若分量为负数则等于 0，若为正数则向下取整 |
| .set ( x : Float, y : Float, z : Float, w : Float ) : this   | 依次设置当前向量的 x y z w 的值                              |
| .setAxisAngleFromQuaternion ( q : Quaterion ) : this         | 将当前向量的 x y z 分别设置为四元数的轴，w 分量设置为四元数的角度 |
| .setAxisAngleFromRotationMatrix ( m : Matrix4 ) : this       | 将当前向量的 x y z 分别设置为旋转轴，w 为角度                |
| .setComponent ( index : Integer, value : Float ) : null      | 根据 index 的值，设置对应 x  或 y 或 z 或 w 的值             |
| .setLength ( l : Float ) : this                              | 将当前向量的长度设置为 l，方向保持不变                       |
| .setScalar ( scalar : Float ) : this                         | 将当前向量的 x y z w 的值都设置为 scalar                     |
| .setX ( x : Float ) : this                                   | 设置当前向量的 x 的值                                        |
| .setY ( y : Float ) : this                                   | 设置当前向量的 y 的值                                        |
| .setZ ( z : Float ) : this                                   | 设置当前向量的 z 的值                                        |
| .setW ( w : Float ) : this                                   | 设置当前向量的 w 的值                                        |
| .sub ( v : Vector4 ) : this                                  | 当前向量减去 v                                               |
| .subScalar ( s : Float ) : this                              | 当前向量的 x y z w 都减去标量 s                              |
| .subVectors ( a : Vector4, b : Vector4 ) : this              | 将当前向量设置为 a - b                                       |
| .toArray ( array : Array, offset : Integer ) : Array         | 将当前向量的 x y z w 根据 offset 的索引依次设置到 array 中。参数 array 和 offset 均为可选参数，offset 默认为 0 |
| .random () : this                                            | 将该向量的每个分量(x、y、z、w)设置为介于 0 和 1 之间的伪随机数，不包括 1。 |



<br>

## 旋转

在 3D 空间中，物体的变换有以下几种：

1. 位移
2. 缩放
3. 旋转
4. 斜切



<br>

**执行顺序：**

对于位移和缩放是不需要考虑执行顺序的，例如我们要对一个长方体进行缩放或平移，无论先操作 x 还是 y 都不影响最终结果。

但是对于旋转而言却不是这样的，旋转操作需要严格设定好执行的先后顺序。

假设有一个打乱的魔方，若执行下面的 2 种操作：

1. 第一种：先向左转 1 个面、再向上转 1 个面
2. 第二种：先向上转 1 个面、再向左转 1 个面

以上 2 种操作 向上或向左 的执行顺序不同，可以想象，最终魔方呈现的结果也是不一样的。

对于物体的旋转而言，方向执行的先后顺序不同，其旋转后的结果状态也会不同。



<br>

**绕轴旋转：**

假设我们说绕某轴旋转，实际情况就是对应这个轴的坐标不会发生变化，变化的是另外两个轴。

1. 绕 x 轴旋转，即 x 坐标不变，y 和 z 的值会发生变化
2. 绕 y 轴旋转，即 y 坐标不变，x 和 z 的值会发生变化
3. 绕 z 轴旋转，即 z 坐标不变，z 和 y 的值会发生变化



<br>

**顺指针与逆时针：**

在二维旋转中，默认我们将 逆时针旋转为正，顺时针旋转为负。

但是在三维旋转中，是不存在 顺时针 或 逆时针 旋转这个概念的。



<br>

**右手螺旋法则：**

虽然三维空间中并不存在 顺时针和逆时针的概念，但是对于某一个轴旋转，依然是有正旋转和负旋转之分的。

判定旋转是正还是负，靠右手螺旋法则来界定。

假设我们现在要绕 x 轴旋转，那么右手螺旋法则的界定方式为：

1. 伸出大拇指，将大拇指朝向 x 轴的正轴方向
2. 此时弯曲其他四指
3. 四指弯曲的方向就是 正旋转
4. 四指弯曲的反方向就是 负旋转



<br>

**飞机旋转的行业术语：**

你可以想象一下现在有一个正在平稳飞行中的飞机。

1. 机身左右平移被称为：偏航(yaw)

   > 以与机身上下垂直的轴 进行旋转

2. 机身左右旋转被称为：滚转(roll)

   > 以机身为轴 进行旋转

3. 机头机尾上下变化被称为：仰俯(pitch)

   > 以与机身水平垂直的轴 进行旋转



<br>

**如何描述旋转？**

在 3D 空间中，一共有 3 种数学方式可以描述和记录旋转。

1. 欧拉角
2. 四元数
3. 矩阵

矩阵稍后再讲，本小节只谈论 欧拉角与四元数。



<br>

### 欧拉角(euler)

欧拉角是由数学家 欧拉 发明的，所以叫 欧拉角。

欧拉角 通过定义 x y z 3 个轴的旋转角度来描述一个旋转变化。

但是由于 x y z 旋转的依次顺序不同，其结果也不同，所以在 Three.js 中的 欧拉角 Euler 类 还增加了第 4 个属性：order，即表示旋转顺序，默认值为 “XYZ”。



<br>

**记录欧拉角的 3 个值：**

由于 order 的默认值为 “XYZ”，所以日常使用中我们可以忽略这个属性值，而只记录 x y z 这 3 个属性值。



<br>

**欧拉角的缺点：**

1. 欧拉角的 3 个值 x y z 执行顺序必须相对固定，若执行顺序不同其结果也不同。

   这个现象被称为 “万向节死锁”。

2. 欧拉角比较难易 “计算” ，比如一个物体由当前旋转状态变换为另外一种旋转状态，实际上会有多种 变换方式 都可以达到目的，也就是无法使用 唯一的一种变换来描述，增加变换的复杂性。

3. 同一个欧拉角的 x y z 的值可以是不同的数字，因此很难 “倒推还原” 之前的状态和预期目标状态。



<br>

**欧拉角的优点：**

1. 简单，容易直观理解：沿  x 轴旋转多少角度，再沿 y 轴旋转... 再沿 z 轴旋转
2. 只需要保存 3 个数字即可表示出一个旋转



<br>

### 四元数(quaternion)

四元数是由数学家 哈密顿 发明的数学概念，四元数解决了 欧拉角 的一些缺点问题。

四元数，顾名思义，使用 4 个数字 x y z w 来描述一个旋转变换。

四元数实际上是使用简化版的 四维空间 来解决 三维空间中的旋转变换。



<br>

**四元数的优点：**

1. 相对于欧拉角，四元数表示旋转时，只存在一个唯一值。
2. 相对于使用 3D 空间矩阵而言，四元数更加简洁快速。



<br>

**四元数的缺点：**

1. 相对于欧拉角，这 4 个数字含义难易理解，凭大脑很难直观想象出最终旋转的结果。
2. 四元数只适用于 3D 空间旋转。



<br>

### 欧拉角(Euler)的属性和方法

| 属性名 | 对应含义                                                     |
| ------ | ------------------------------------------------------------ |
| x      | 用弧度表示 x 轴旋转量，默认值为 0                            |
| y      | 用弧度表示 y 轴旋转量，默认值为 0                            |
| z      | 用弧度表示 z 轴旋转量，默认值为 0                            |
| order  | 表示旋转顺序，默认为 “XYZ”，即先旋转 x 轴，再旋转 Y 轴，最后旋转 Z 轴 |



<br>

**由 X、Y、Z 共有 6 种组合方式：**

1. XYZ
2. XZY
3. YXZ
4. YZX
5. ZXY
6. ZYX

因此 .order 的值应该是以上 6 种中的一种。



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .copy ( euler : Euler ) : Euler                              | 将当前欧拉角设置为参数中的 euler 值                          |
| .clone () : Euler                                            | 克隆并返回一份                                               |
| .equals ( euler : Euler ) : Boolean                          | 检查并返回布尔值，确认当前欧拉角是否与参数 euler 相同        |
| .fromArray ( array : Array ) : Euler                         | 参数 array 是一个长度为 3 或 4 的数组，依次设置当前欧拉角的 x y z order 的值 |
| .reorder ( newOrder : String ) : Euler                       | 首先将当前欧拉角转化为一个四元数，然后用这个四元数与参数 newOrder 所表示的新顺序来设置当前欧拉角 |
| .set ( x : Float, y : Float, z : Float, order : String ) : Euler | 依次设置当前欧拉角的 x y z order 的值                        |
| .setFromRotationMatrix ( m : Matrix4, order : String) : Euler | 根据 order 顺序的纯旋转矩阵(参数 m 上的 3x3 部分)来设置当前欧拉角 |
| .setFromQuaternion ( q : Quaternion, order : String ) : Euler | 根据 order 顺序，使用归一化四元数 q 来设置当前欧拉角         |
| .setFromVector3 ( vector : Vector3, order : String ) : Euler | 将当前欧拉角的 x y z 对应设置为参数 vector 的 .x y z，<br />将当前欧拉角的 order 设置为参数中的 order。order 为可选参数 |
| .toArray ( array : Array, offset : Integer ) : Array         | 将当前欧拉角的 x y z order 以 offset 的偏移索引填入数组 array 中。offset 默认为 0 |
| .toVector3 ( optionalResult : Vector3 ) : Vector3            | 将当前欧拉角的 x y z 设置为对应参数 optionalResult 中，返回该 Vector3。 |



<br>

### 四元数(quaternion)的属性和方法

| 属性名 | 对应含义          |
| ------ | ----------------- |
| x      | x坐标，默认值为 0 |
| y      | y坐标，默认值为 0 |
| z      | z坐标，默认值为 0 |
| w      | w坐标，默认值为 1 |

> 注意：上述表格中称呼 x y z w 为坐标，你可以简单得理解为 四元数实际上是一个 四维空间中的向量。通过四维空间中的这个向量来解决三维中的旋转。

> 这种通过提升空间维度来解决低维度空间问题的方式，被称为：齐次坐标



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .angleTo ( q : Quaternion ) : Float                          | 已弧度为单位返回与参数 四元数 q 之间的夹角                   |
| .clone () : Quaternion                                       | 返回一份克隆的四元数                                         |
| .copy ( q : Quaternion ) : Quaternion                        | 将当前四元数设置为 q                                         |
| .conjugate () : Quaternion                                   | 返回当前四元素的旋转共轭，此操作会修改当前四元数。<br />所谓旋转共轭就是指围绕旋转轴做反方向的旋转。 |
| .equals ( v : Quaternion ) : Boolean                         | 将当前四元素与参数 v 进行比较并返回比较结果                  |
| .dot ( v : Quaternion ) : Float                              | 计算当前四元素与 v 的点积                                    |
| .fromArray ( array : Array, offset : Integer ) : Quaternion  | 将参数 array 按照 offset 偏移索引依次设置当前四元数的 x y z w 的值。offset 默认为 0 |
| .identity () : Quaternion                                    | 将当前四元数回归初始化，即 (0,0,0,1)，此时的四元数相当于不做任何旋转。 |
| .invert () : Quaternion                                      | 反转并返回当前四元数。此方法与 .conjugate() 完全相同         |
| .length () : Float                                           | 计算并返回当前四元数的欧几里得长度                           |
| .lengthSq () : Float                                         | 计算并返回当前四元数的欧几里得长度的平方                     |
| .normalize () : Quaternion                                   | 将当前四元数进行归一化，方向不变，长度变为 1。<br />你需要把四元数理解成四维空间中的一个向量 |
| .multiply ( q : Quaternion ) : Quaternion                    | 将当前四元数乘以 q                                           |
| .multiplyQuaternions ( a : Quaternion, b : Quaternion ) : Quaternion | 将当前四元数设置为 a 乘以 b 的运算结果                       |
| .premultiply ( q : Quaternion ) : Quaternion                 | 使用 q 乘以当前四元数<br />请注意这个与 .multiply() 相乘的顺序是相反的，而相乘顺序不同其结果也不同。 |
| .rotateTowards ( q : Quaternion, step : Float ) : Quaternion | 将该四元数按照步长 step(弧度) 向目标 q 进行旋转。该方法确保最终的四元数不会超过 q。 |
| .slerp ( qb : Quaternion, t : Float ) : Quaternion           | 处理四元数之间的球面线性插值。t 表示该四元数(其中 t 为 0) 和 qb (其中t为1) 之间的旋转量。该四元数会被设置为上述计算的结果。另请参阅下面 slerp 的静态版本。 |
| .slerpQuaternions ( qa : Quaternion, qb : Quaternion, t : Float ) : this | 在给定的四元数之间执行球面线性插值，并将结果存储在这个四元数中 |
| .set ( x : Float, y : Float, z : Float, w : Float ) : Quaternion | 设置当前四元数的 x y z w                                     |
| .setFromAxisAngle ( axis : Vector3, angle : Float ) : Quaternion | 将当前四元数沿着 axis 轴 和 angle 角度进行旋转。<br />假定 axis 已经被归一化 |
| .setFromEuler ( euler : Euler ) : Quaternion                 | 将当前四元数根据 euler 进行旋转                              |
| .setFromRotationMatrix ( m : Matrix4 ) : Quaternion          | 从参数四阶矩阵 m 的旋转分量中来设置该四元数                  |
| .setFromUnitVectors ( vFrom : Vector3, vTo : Vector3 ) : Quaternion | 将该四元数设置为从方向向量 vFrom 旋转到方向向量 vTo 所需的旋转 |
| .toArray ( array : Array, offset : Integer ) : Array         | 将当前四元数的 x y z w 按照 offset 偏移索引写入到 array 中。offset 默认值为 0 |
| .fromBufferAttribute ( attribute : BufferAttribute, index : Integer ) : this | 从参数 attribute 中按照 offset 索引依次设置当前四元数的 x y z w 的值 |



<br>

**静态方法：.slerpFlat()**

.slerpFlat ( dst : Array, dstOffset : Integer, src0 : Array, srcOffset0 : Integer, src1 : Array, srcOffset1 : Integer, t : Float ) : null

1. dst：输出数组
2. dstOffset：输出数组的偏移量
3. src0：起始四元数的源数组
4. srcOffset0：数组 src0 的偏移量
5. src1：目标四元数的源数组
6. srcOffset1：数组 src1 的偏移量
7. t：归一化插值因子(介于 0 和 1 之间)

类似于四元数实例的 .slerp() 方法，但直接对平面数组进行操作。



<br>

## 矩阵(matrix)

关于矩阵的相关概念不再过多叙述。



<br>

#### 矩阵的几个结论：

1. 一个 3 x 3 的矩阵可以表示出二维空间中所有可能的变换。同理，一个 4 x 4 的矩阵可以表示出三维空间中所有可能的变换。
2. 矩阵乘积不符合 交换律，例如 a.dot(b) 和 b.dot(a) 结果不相同。
3. 逆矩阵就是把某个矩阵计算结果反向操作，可以恢复成之前的矩阵。
4. 在 Three.js 内部采用列阵式存储矩阵，但是在日常修改写入矩阵时采用 行阵式。
5. 列阵式与行阵式之间可以互相转化，转换的过程称为：矩阵转置
6. 对于旋转矩阵而言，转置前和转置后的两个矩阵，实际上是彼此的 逆矩阵。
7. 假设一个矩阵转置之后的矩阵 和 自己的逆矩阵完全相同，我们称这种矩阵为：正交矩阵
8. 对于处理三维空间的四维矩阵，最后一行一定是：0 0 0 1 或 0 0 0 0，当最后一个数字为 1 表示这是一个坐标，而为 0 则表示这是一个向量。



<br>

### 三维矩阵(Matrix3)的属性和方法

三阶矩阵和三维矩阵只是称呼不同，都是表示  3 x 3 矩阵。

> 为了和 三维向量 名字统一，所以本文以后将采用 三维矩阵 来代替 三阶矩阵。

**矩阵元素排列顺序**

1. 按照一行一行的顺序存储矩阵的元素，被称为行优先
2. 按照一列一列的顺序存储矩阵的元素，被称为列优先



<br>

| 属性名            | 对应含义                                           |
| ----------------- | -------------------------------------------------- |
| .elements : Array | 以列优先的方式返回三维矩阵的所有元素值所组成的数组 |

**补充说明：**

.element 的默认值为：

1. 1,0,0
2. 0,1,0
3. 0,0,1

<br>

假设我们现在更改一下 三维矩阵的元素值：

```
const matrix3 = new Matrix3()
matrix3.set(1, 2, 3, 4, 5, 6, 7, 8, 9) // .set() 按照 行优先 的顺序书写元素值
console.log(matrix3.elements) // [1, 4, 7, 2, 5, 8, 3, 6, 9]
```

从上面输出可以清晰看到，.element 输出的数组是按照 列优先 的方式排列的。



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clone () : Matrix3                                          | 返回一份克隆的当前矩阵                                       |
| .copy ( m : Matrix3 ) : this                                 | 将当前矩阵设置为参数 m 相同的值                              |
| .determinant () : Float                                      | 计算并返回矩阵的行列式                                       |
| .equals ( m : Matrix3 ) : Boolean                            | 判断当前矩阵与参数 m 是否相等                                |
| .extractBasis ( xAxis : Vector3, yAxis : Vector3, zAxis : Vector3 ) : this | 将当前矩阵的基向量提取到提供的三个轴向中。                   |
| .fromArray ( array : Array, offset : Integer ) : this        | 使用基于列优先格式的数组来设置该矩阵。                       |
| .invert () : this                                            | 将当前矩阵翻转为它的逆矩阵。<br />你不能对行或列为0的矩阵进行翻转，如果尝试这样做，该方法将生成一个零矩阵。 |
| .getNormalMatrix ( m : Matrix4 ) : this                      | 将当前矩阵设置为给定四阶矩阵的正规矩阵。<br />该方法内部执行的内容为：<br />先从参数 m 左上角获得 3 x 3 的矩阵 m3，然后再将 m3 依次进行转逆、转置。 |
| .identity () : this                                          | 将当前矩阵重置为最初始的矩阵。<br />也就是相当于刚 new Matrix3() 时得到的矩阵。 |
| .multiply ( m : Matrix3 ) : this                             | 将当前矩阵乘以矩阵 m                                         |
| .multiplyMatrices ( a : Matrix3, b : Matrix3 ) : this        | 设置当前矩阵为 a乘以b 的值                                   |
| .multiplyScalar ( s : Float ) : this                         | 将当前矩阵所有元素都乘以 s                                   |
| .set ( n11 : Float, n12 : Float, n13 : Float, n21 : Float, n22 : Float, n23 : Float, n31 : Float, n32 : Float, n33 : Float ) : this | 使用行优先的顺序来设置当前矩阵                               |
| .premultiply ( m : Matrix3 ) : this                          | 将矩阵 m 乘以当前矩阵                                        |
| .setFromMatrix4 ( m : Matrix4 ) : this                       | 根据参数 m 的左上角 3 x 3 的矩阵值来设置当前矩阵             |
| .setUvTransform ( tx : Float, ty : Float, sx : Float, sy : Float, rotation : Float, cx : Float, cy : Float ) : this | 使用偏移，重复，旋转和中心点位置设置UV变换当前矩阵。         |
| .toArray ( array : Array, offset : Integer ) : Array         | 使用列优先的格式将当前矩阵的元素写入到数组中。               |
| .transpose () : this                                         | 将当前矩阵进行转置。                                         |
| .transposeIntoArray ( array : Array ) : this                 | 将当前矩阵的转置存入给定的数组中，但不改变当前矩阵，并返回当前矩阵。 |



<br>

**行列式：**

请注意，行列式和我们之前提到的 行阵列、列阵列 完全不是一个意思。

行列式取值为一个标量，也就是一个具体的数字。

行列式可以看做是有向面积或体积的概念在一般的欧几里得空间中的推广。

> 有向面积 是指 不光有面积，还有方向的平面。

或者说在 N 维欧几里得空间中，行列式描述的是一个线性变换对 “体积” 造成的影响。

> 关于行列式的概念，确实比较难以理解，暂且这样吧。



<br>

**基向量**

在线性代数(linear algebra)中，基(basis) 是描述刻画向量空间的基本工具。

> 基 又被称为 基底

向量空间的基是它的一个特殊子集，基的元素称为基向量。



<br>

### 四维矩阵的重要意义

四维矩阵是用来解决 3D 空间中所有的矩阵变换(平移、旋转、剪切、缩放、反射、正交、透视投影等)。

四维矩阵的重要程度无与伦比。



<br>

**所有 Object3D 对象都有的 3 个四维矩阵：**

1. Object3D.matrix：存储物体的本地变换矩阵。这里的 “本地” 是相对父级对象而言。

2. Object3D.matrixWorld：对象的全局或世界变换矩阵。如果对象没有父级则 .matrixWorld 等于 .matrix。

3. Object3D.modelViewMatrix：对象相对于相机坐标系的变换矩阵。.modelViewMatrix 是物体世界变换矩阵乘以摄像机相对于世界空间变换矩阵的逆矩阵。

   > 补充说明：
   >
   > 假设当前 3D 场景中存在：
   >
   > 1. 原点位置有一个尺寸为 1 的立方体
   > 2. 有一个相机，位置位于 (2,0,2)
   >
   > 那么当渲染这个场景时，在投影阶段的计算过程是这样的：
   >
   > 1. 首先将相机变换到原点 (0,0,0)，也就是需要计算出相机相对世界坐标的逆矩阵
   > 2. 然后根据相机的逆矩阵将世界坐标、立方体位置相应变换到新的位置，这样可以继续保持相机与立方体的相对位置关系不变
   > 3. 然后开始计算立方体的投影
   >
   > 就是因为有这个投影变换流程，所以才会有计算 .modelViewMatrix 中那句 “摄像机相对于世界空间变换矩阵的逆矩阵”。



<br>

注意，Object3D.normalMatrix 并不是一个四维矩阵，而是一个三维矩阵。



<br>

**所有相机 Camera 都有的 3 个四维矩阵：**

1. Camera.matrixWorldInverse：相机相对于世界坐标变换的逆矩阵
2. Camera.projectionMatrix：投影变换矩阵
3. Camera.projectionMatrixInverse：投影变换矩阵的逆矩阵



<br>

**提取位置(平移)、旋转和缩放**

有多种选项可用于从 Matrix4 中提取位置、旋转和缩放。

1. Vector3.setFromMatrixPosition：可用于提取位置相关的分量
2. Vector3.setFromMatrixScale：可用于提取缩放相关的分量
3. Quaternion.setFromRotationMatrix, Euler.setFromRotationMatrix or extractRotation：可用于从纯(未缩放)矩阵中提取旋转相关分量。
4. decompose：可用于一次性提取位置、旋转和缩放



<br>

### 四维矩阵(Matrix4)的属性和方法

| 属性名            | 对应含义                                 |
| ----------------- | ---------------------------------------- |
| .elements : Array | 以列优先的形式返回矩阵所有元素组成的数组 |



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clone () : Matrix4                                          | 返回一份克隆的矩阵                                           |
| .copy ( m : Matrix4 ) : this                                 | 将当前矩阵设置为 m 相同的值                                  |
| .compose ( position : Vector3, quaternion : Quaternion, scale : Vector3 ) : this | 根据参数 position、quaternion 和 scale 共同组合变换当前矩阵  |
| .copyPosition ( m : Matrix4 ) : this                         | 将给定矩阵 m 的平移分量拷贝到当前矩阵中。                    |
| .decompose ( position : Vector3, quaternion : Quaternion, scale : Vector3 ) : null | 将当前矩阵分解到给定的 position(平移)、quaternion(旋转) 和 scale(缩放) 中。 |
| .determinant () : Float                                      | 计算并返回当前矩阵的行列式。                                 |
| .equals ( m : Matrix4 ) : Boolean                            | 比较当前矩阵与 m 是否相同                                    |
| .extractBasis ( xAxis : Vector3, yAxis : Vector3, zAxis : Vector3 ) : this | 将矩阵的基向量提取到指定的 3 个轴向量中。                    |
| .extractRotation ( m : Matrix4 ) : this                      | 将给定矩阵 m 的旋转分量提取到当前矩阵的旋转分量中。<br />也就是说修改当前矩阵的旋转分量。 |
| .fromArray ( array : Array, offset : Integer ) : this        | 使用列优先格式的数组来设置该矩阵                             |
| .invert () : this                                            | 将当前矩阵翻转为它的逆矩阵。                                 |
| .getMaxScaleOnAxis () : Float                                | 获取 3 个轴方向的最大缩放值                                  |
| .identity () : this                                          | 重置当前矩阵，恢复成默认值。                                 |
| .lookAt ( eye : Vector3, center : Vector3, up : Vector3, ) : this | 构造一个旋转矩阵，从 eye 指向 ceneter，由向量 up 定向。<br />请注意矩阵的 .lookAt() 和 相机(Camera)的 .lookAt() 参数和含义均不相同。 |
| .makeRotationAxis ( axis : Vector3, theta : Float ) : this   | 设置当前矩阵 围绕轴 axis 旋转量为 theta 弧度。               |
| .makeBasis ( xAxis : Vector3, yAxis : Vector3, zAxis : Vector3 ) : this | 通过给定的三个向量设置当前矩阵为 基矩阵。                    |
| .makePerspective ( left : Float, right : Float, top : Float, bottom : Float, near : Float, far : Float ) : this | 创建一个透视投影矩阵。<br />并将当前矩阵设置为该透视投影矩阵。 |
| .makeOrthographic ( left : Float, right : Float, top : Float, bottom : Float, near : Float, far : Float ) : this | 创建一个正交投影矩阵。<br />并将当前矩阵设置为该正交投影矩阵。 |
| .makeRotationFromEuler ( euler : Euler ) : this              | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后将传入的欧拉角转换为该矩阵的旋转分量(左上角的 3x3 矩阵)。<br />由于 euler 的 .order 可能存在 6 种顺序，所以该矩阵也共有 6 种可能的结果。 |
| .makeRotationFromQuaternion ( q : Quaternion ) : this        | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后将当前矩阵的旋转分量设置为四元数 q 指定的旋转。 |
| .makeRotationX ( theta : Float ) : this                      | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后将当前矩阵设置为绕 x 轴旋转 theta 弧度的矩阵。 |
| .makeRotationY ( theta : Float ) : this                      | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后将当前矩阵设置为绕 y 轴旋转 theta 弧度的矩阵。 |
| .makeRotationZ ( theta : Float ) : this                      | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后将当前矩阵设置为绕 z 轴旋转 theta 弧度的矩阵。 |
| .makeScale ( x : Float, y : Float, z : Float ) : this        | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后设置当前矩阵 x y z 轴 的缩放 |
| .makeShear ( x : Float, y : Float, z : Float ) : this        | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后设置当前矩阵的剪切变换 |
| .makeTranslation ( x : Float, y : Float, z : Float ) : this  | 先将当前矩阵恢复成默认的单位矩阵(没有平移/缩放/旋转)，然后设置当前矩阵的平移变换。 |
| .multiply ( m : Matrix4 ) : this                             | 将当前矩阵乘以矩阵 m<br />会修改当前矩阵                     |
| .premultiply ( m : Matrix4 ) : this                          | 将矩阵 m 乘以当前矩阵<br />会修改当前矩阵                    |
| .multiplyMatrices ( a : Matrix4, b : Matrix4 ) : this        | 将当前矩阵设置为 a 乘以 b 的计算结果                         |
| .multiplyScalar ( s : Float ) : this                         | 将当前矩阵的所有元素都乘以 s                                 |
| .scale ( v : Vector3 ) : this                                | 将当前矩阵的列向量乘以 v 的分量。<br />相当于第1列的元素都乘以 v.x，第2列的元素都乘以 v.y，第3列的元素都乘以 v.z，第4列保持不变。<br />尽管参数是一个 Vector3，但是在这里可以把它(.x,.y,.z)看做是 3 个列的缩放分量 |
| .set ( n11 : Float, n12 : Float, n13 : Float, n14 : Float, n21 : Float, n22 : Float, n23 : Float, n24 : Float, n31 : Float, n32 : Float, n33 : Float, n34 : Float, n41 : Float, n42 : Float, n43 : Float, n44 : Float ) : this | 按照行优先的格式设置当前矩阵的元素值                         |
| .setFromMatrix3 ( m : Matrix3 ) : this                       | 根据参数 m 的值设置当前矩阵左上角 3 x 3 的矩阵值             |
| .setPosition ( v : Vector3 ) : this                          | 根据参数 v 的值来设置当前矩阵平移的分量。<br />也就是 第4 列前 3 个元素的值 |
| .setPosition ( x : Float, y : Float, z : Float ) : this // optional API | 根据参数 x y z 的值来设置当前矩阵平移的分量。<br />也就是 第4 列前 3 个元素的值 |
| .toArray ( array : Array, offset : Integer ) : Array         | 使用列优先的格式将当前矩阵的元素写入数组中。                 |
| .transpose () : this                                         | 将当前矩阵进行转置                                           |



<br>

## 射线(Ray)

**射线的作用：**

射线是由一个原点向一个确定的方向发射的线。在 Three.js 中射线主要用于 Raycaster(光线投射) 中，用于在 3D 空间中拾取物体。

这里说的 “拾取物体” 实际上就是鼠标点击选中物体。



<br>

### 射线(Ray)的属性和方法

| 属性名               | 对应含义                                                  |
| -------------------- | --------------------------------------------------------- |
| .origin : Vector3    | 射线的原点，默认值为 (0,0,0)                              |
| .direction : Vector3 | 射线的方向，该方向必须是归一化后的向量。默认值为 (0,0,-1) |

<br>



射线的绝大多数方法都是针对以上 2 个属性进行操作的。

<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .applyMatrix4 ( matrix4 : Matrix4 ) : Ray                    | 将参数 matrix4 变换应用于当前射线。内部执行的是：<br />this.origin.applyMatrix4(matrix4)、<br />this.direction.transformDirection(matrix4) |
| .at ( t : Float, target : Vector3 ) : Vector3                | 获得射线上给定距离 t 处的向量，将该向量赋值给 target 后返回 target |
| .clone () : Ray                                              | 创建并返回一份克隆的射线                                     |
| .closestPointToPoint ( point : Vector3, target : Vector3 ) : Vector3 | 沿着当前射线，获得与参数 point 最接近的点，将该点赋值给 target，并返回 target |
| .copy ( ray : Ray ) : Ray                                    | 将当前射线设置为 参数 ray                                    |
| .distanceToPoint ( point : Vector3 ) : Float                 | 获得当前射线与 point 之间最近的距离                          |
| .distanceSqToPoint ( point : Vector3 ) : Float               | 获得当前射线与 point 之间最近的距离的平方                    |
| .distanceToPlane ( plane : Plane ) : Float                   | 获得当前射线原点到平面 plane 之间的距离。若射线与平面不相交则返回 null |
| .distanceSqToSegment ( v0 : Vector3, v1 : Vector3, optionalPointOnRay : Vector3, optionalPointOnSegment : Vector3 ) : Float | 获取当前射线与线段(起点为 v0，终点为 v1)之间的距离的平方。<br />若 optionalPointOnRay 有值则将接收射线上距离线段最近的点、<br />若 optionalPointOnSegment 有值则将接收线段上距离射线最近的点。 |
| .equals ( ray : Ray ) : Boolean                              | 比较当前射线与 参数 ray 是否相同                             |
| .intersectBox ( box : Box3, target : Vector3 ) : Vector3     | 若当前射线与 box3(包围盒) 相交，则返回相交点。<br />若不相交则返回 null。<br />若相交且 target 有值则将相交点赋值给 target。 |
| .intersectPlane ( plane : Plane, target : Vector3 ) : Vector3 | 若当前射线与 plane(平面) 相交，则返回相交点。<br />若不相交则返回 null。<br />若相交且 target 有值则将相交点赋值给 target。 |
| .intersectSphere ( sphere : Sphere, target : Vector3 ) : Vector3 | 若当前射线与 sphere(球) 相交，则返回相交点。<br />若不相交则返回 null。<br />若相交且 target 有值则将相交点赋值给 target。 |
| .intersectTriangle ( a : Vector3, b : Vector3, c : Vector3, backfaceCulling : Boolean, target : Vector3 ) : Vector3 | 若当前射线与 由 a,b,c 组成的三角形 相交，则返回相交点。<br />若不相交则返回 null。<br /><br />参数 backfaceCulling 表示是否使用背面剔除。<br />若相交且 target 有值则将相交点赋值给 target。 |
| .intersectsBox ( box : Box3 ) : Boolean                      | 计算当前射线是否与 box3 相交                                 |
| .intersectsPlane ( plane : Plane ) : Boolean                 | 计算当前射线是否与 plane 相交                                |
| .intersectsSphere ( sphere : Sphere ) : Boolean              | 计算当前射线是否与 sphere 相交                               |
| .lookAt ( v : Vector3 ) : Ray                                | 调整当前射线的方向到世界坐标中该向量所指的点(坐标)           |
| .recast ( t : Float ) : Ray                                  | 将当前射线的原点沿着其方向移动到 t 给定的距离                |
| .set ( origin : Vector3, direction : Vector3 ) : Ray         | 设置当前射线的原点和方向                                     |



<br>

## 轴对齐包围盒(Box2/Box3)

**包围盒的定义：**

包围盒顾名思义，就是用一个体积更大的 “盒子” 包围住物体，当我们需要对物体进行碰撞检测时通过对该包围盒的碰撞检测来 “大约” 作出判断结果。

包围盒碰撞检测主要作用是通过牺牲掉一些精准度来减少碰撞检测计算量。

<br>

**常见的包围盒算法：**

1. AABB包围盒(Axis-aligned bounding box)

   > AABB包围盒就是形状为长方体的包围盒
   >
   > AABB包围盒又被称为：轴对齐包围盒
   >
   > 轴包围盒的边永远需要平行或垂直于坐标轴，这就意味着轴对齐包围盒在视觉上是无法旋转的。

2. 包围球(sphere)

3. 方向包围盒OBB(oriented bounding box)

   > 你可以把 OBB 包围盒想象成由多个长方体拼凑而成，最接近物体本身形状的多面体不规则盒子。
   >
   > OBB包围盒相对 AABB包围盒更加精准，缺点是碰撞检测计算量更大。
   >
   > OBB包围盒的边缘无需平行或垂直于轴，也就是说 OBB 包围盒在视觉上是可以旋转的。

4. 固定方向凸包FDH(Fixed directions hulls 或 k-DOP)



<br>

**在本小节中提到的 Box2、Box3 均属于 AABB包围盒，也就是轴对齐包围盒。**



<br>

### 二维轴对齐包围盒(Box2)的属性和方法

| 属性名       | 对应含义                                                     |
| ------------ | ------------------------------------------------------------ |
| .min:Vector2 | 包围盒的下边界，也就是说包围盒最小的 x 和 y 坐标。<br />默认值为 ( + Infinity, + Infinity ) |
| .max:Vector2 | 包围盒的上边界，也就是说包围盒最大的 x 和 y 坐标。<br />默认值为( - Infinity, - Infinity ) |

> 你是否疑惑为什么 上边界默认值是最大整数，而下边界默认值是最大负数，不应该是反过来才对吗？



<br>

**空包围盒**

按照道理，包围盒的上边界数值应该大于下边界，但是如果情况相反，那么我们就认定该包围盒虽然存在但是一个空的包围盒，也就是说该包围盒内部包含任何顶点。

> 当初始化一个 Box2 实例，默认就是一个空包围盒。
>
> ```
> new Box2().isEmpty() // true
> ```



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clampPoint ( point : Vector2, target : Vector2 ) : Vector2  | 计算出 point 在当前包围盒内的收窄结果，将计算结果赋值给 target 后再返回 target |
| .clone () : Box2                                             | 返回一份克隆的包围盒                                         |
| .containsBox ( box : Box2 ) : Boolean                        | 检查参数 box 是否完全被当前包围盒包围住，如果完全重叠也返回 true |
| .containsPoint ( point : Vector2 ) : Boolean                 | 检查参数 point 是否在包围盒边界或边界内                      |
| .copy ( box : Box2 ) : Box2                                  | 将当前包围盒设置为 box                                       |
| .distanceToPoint ( point : Vector2 ) : Float                 | 返回当前包围盒与参数 point 之间的距离，若 point 位于包围盒内部则判定距离为 0 |
| .equals ( box : Box2 ) : Boolean                             | 对比当前包围盒与参数 box 是否相同                            |
| .expandByPoint ( point : Vector2 ) : Box2                    | 扩展包围盒的边界来包含住该点 point。<br />若参数 point 本身就在包围盒内部则包围盒不做任何修改，也就是说包围盒只会扩大，不会收窄。 |
| .expandByScalar ( scalar : Float ) : Box2                    | 将包围盒的上下边界都扩展 scalar 。<br />若 scalar 为正数则相当于扩展，若 scalar 为负数则相当于收缩。 |
| .expandByVector ( vector : Vector2 ) : Box2                  | 将包围盒的宽度方向扩展 vector.x、高度方向扩展 vector.y。<br />由于 vector 的 x y 都有可能为负数，所以该操作也可能会收缩当前包围盒。 |
| .getCenter ( target : Vector2 ) : Vector2                    | 以二维向量的形式返回盒子的中心点                             |
| .getParameter ( point : Vector2, target : Vector2 ) : Vector2 | 返回参数 point 每个维度减去当前包围盒对应下边界后 与当前包围盒的宽度和高度的比例，同时将各个比例赋值给 target。<br />例如 x 维度比例为：( point.x - this.min.x ) / ( this.max.x - this.min.x ) |
| .getSize ( target : Vector2 ) : Vector2                      | 将该包围盒的宽度和高度赋值给 target                          |
| .intersect ( box : Box2 ) : Box2                             | 返回当前包围盒与参数 box 相交的盒子。<br />请注意该方法并不会去判断 2 个盒子是否真的相交。<br />该方法只是将 “相交盒子” 上线设置为两者上线中较小者、下限设置为两者下限中的较大者。<br />也就是说即使两个盒子本身不相交，但是也会返回一个盒子，且该盒子的 .min 和 .max 均有值，只不过该盒子会被视为空盒子。 |
| .intersectsBox ( box : Box2 ) : Boolean                      | 检查当前包围盒是否与参数 box 相交                            |
| .isEmpty () : Boolean                                        | 检查当前包围盒是否为空。所谓为空就是指当前包围盒包含 0 个顶点。若 |
| .makeEmpty () : Box2                                         | 将当前包围盒重置为初始化默认值，也就是说下边界为 \+ Infinity，上边界为 \- Infinity，这样当前盒子即为空盒子。 |
| .set ( min : Vector2, max : Vector2 ) : Box2                 | 设置当前包围盒的下边界和上边界                               |
| .setFromCenterAndSize ( center : Vector2, size : Vector2 ) : Box2 | 根据参数先设定包围盒的中心为 center，然后设置包围盒的尺寸为 size 的 .x(宽) 和 .y(高) |
| .setFromPoints ( points : Array ) : Box2                     | 设置当前包围盒上下边界，确保其包含 points 中所有的点。<br />参数 points 为数组，数组元素均为 Vector2。 |
| .translate ( offset : Vector2 ) : Box2                       | 按照参数 offset 平移当前包围盒                               |
| .union ( box : Box2 ) : Box2                                 | 将当前包围盒与参数 box 进行合并，这样会获得一个较大的包围盒。<br />实际上就是可以包围这 2 个包围盒的包围盒。 |



<br>

### 三维轴对齐包围盒(Box3)的属性和方法

| 属性名         | 对应含义                                                     |
| -------------- | ------------------------------------------------------------ |
| .min : Vector3 | 包围盒下边界。默认值是（ + Infinity, + Infinity, + Infinity ） |
| .max : Vector3 | 包围盒上边界。默认值是（ - Infinity, - Infinity, - Infinity ） |



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .applyMatrix4 ( matrix : Matrix4 ) : this                    | 将参数 matrix 应用于当前包围盒中。<br />实际上是将该包围盒的 8 个顶点( 8 个 vector3) 依次都执行 Vecotr3.applyMatrix4(matrix) |
| .clampPoint ( point : Vector3, target : Vector3 ) : Vector3  | 根据 point 的值来计算被限定(收窄)在当前包围盒范围内的点。并将该点赋值给 target。 |
| .clone () : Box3                                             | 返回一个克隆的包围盒                                         |
| .containsBox ( box : Box3 ) : Boolean                        | 检测参数 box 是否与当前包围盒重叠，或 被包含在当前包围盒内。 |
| .containsPoint ( point : Vector3 ) : Boolean                 | 检查参数 point 是否被包含在当前包围盒内，即使 point 位于包围盒边界之上，也返回 true。 |
| .copy ( box : Box3 ) : this                                  | 将当前包围盒设置为参数 box                                   |
| .distanceToPoint ( point : Vector3 ) : Float                 | 返回当前包围盒与参数 point 最近的距离。若 point 位于包围盒内部，则返回 0 |
| .equals ( box : Box3 ) : Boolean                             | 检测当前包围盒与参数 box 是否相同                            |
| .expandByObject ( object : Object3D ) : this                 | 扩展当前包围盒的边界，确保可以包裹住参数 object 和 object 的子对象。<br />该方法可能会导致一个比严格需要的更大的框。 |
| .expandByPoint ( point : Vector3 ) : this                    | 扩展当前包围盒的边界，确保可以包裹住参数 point。<br />如果 point 本身就在当前包围盒内，并不会缩小当前包围盒 |
| .expandByScalar ( scalar : Float ) : this                    | 按照参数 scalar 扩展当前包围盒。若 scalar 为负责则实际上是缩小当前包围盒。 |
| .expandByVector ( vector : Vector3 ) : this                  | 按照参数 vector 每个维度来扩展当前包围盒。                   |
| .getBoundingSphere ( target : Sphere ) : Sphere              | 获取当前包围盒对应的包围球。并将计算结果赋值给 target。      |
| .getCenter ( target : Vector3 ) : Vector3                    | 获取当前包围盒的中心点。若当前为空包围盒则返回 (0,0,0)       |
| .getParameter ( point : Vector3, target : Vector3 ) : Vector3 | 返回参数 point 每个维度减去当前包围盒对应下边界后 与当前包围盒的宽度、高度和深度的比例，同时将各个比例赋值给 target。<br />例如 x 维度比例为：( point.x - this.min.x ) / ( this.max.x - this.min.x ) |
| .getSize ( target : Vector3 ) : Vector3                      | 返回包围盒的宽度，高度和深度，将这 3 个值赋值给 target。<br />若当前为空包围盒则返回 (0,0,0) |
| .intersect ( box : Box3 ) : this                             | 计算当前包围盒与参数 box 的相交盒子。将该相交盒子的上边界设置为两个框max较小的那个，下边界设置为两个包围盒的 min 较大的那个。<br />如果两个包围盒不相交，则清空当前包围盒。 |
| .intersectsBox ( box : Box3 ) : Boolean                      | 判断当前包围盒是否与参数 包围盒 box 相交                     |
| .intersectsPlane ( plane : Plane ) : Boolean                 | 判断当前包围盒是否与参数 平面 plane 相交                     |
| .intersectsSphere ( sphere : Sphere ) : Boolean              | 判断当前包围盒是否与参数 球体 sphere 相交                    |
| .intersectsTriangle ( triangle : Triangle ) : Boolean        | 判断当前包围盒是否与参数 三角形 triangle 相交                |
| .isEmpty () : Boolean                                        | 判断当前包围盒是否为空。如果包含 0 个顶点则返回 true。<br />注意，若下边界等于上边界，此时的包围盒仅为 1 个点，并不会判定当前包围盒为空，会返回 false。 |
| .makeEmpty () : this                                         | 清空包围盒，即恢复当前包围盒为初始化的 Box3()                |
| .set ( min : Vector3, max : Vector3 ) : this                 | 根据参数分别设置当前包围盒的 .min 和 .max                    |
| .setFromArray ( array : Array ) : this                       | 参数 array 是一个长度为 n x 3 的数组，每一个元素都是一个数字。<br />设置当前包围盒的边界，确保可以包裹住 array 中每 3 个元素为一组所代表的 点。 |
| .setFromBufferAttribute ( attribute : BufferAttribute ) : this | 设置当前包围盒的边界，确保可以包裹住 attribute 中所有位置数据。 |
| .setFromCenterAndSize ( center : Vector3, size : Vector3 ) : this | 设置当前包围盒的中心点为参数 center，并将包围盒的宽度、高度和深度设置为 size 的 x y z。 |
| .setFromObject ( object : Object3D ) : this                  | 设置当前包围盒为参数 object 的包围盒，需要包裹住参数 object 和 它的所有子项。<br />请注意 .expandByObject(object) 是将当前包围盒扩展到可以包裹住 object，而 .setFromObject(object) 是将当前包围盒设置为 object 的包围盒。 |
| .setFromPoints ( points : Array ) : this                     | 参数 points 中每一个元素都是 Vector3。<br />首先清空当前包围盒，然后设置当前包围盒的上下边界，确保可以包裹住 points 中所有的点。<br />准确来讲和 .setFromObject() 方法类似，并不是扩展，而是匹配。 |
| .translate ( offset : Vector3 ) : this                       | 根据参数 offset 上每个维度的值和方向，移动当前包围盒。       |
| .union ( box : Box3 ) : this                                 | 返回当前包围盒与参数 box 合并后的包围盒。                    |



<br>

## 平面(Plane)

**平面的定义：**

在三维空间中无限延伸的二维平面。

平面方程用 “单位长度(归一化)的法向量” 和 “常数” 表示 海塞法向量( Hessian normal form )形式。

> hessian：音译 海塞
>
> normal form：法向量



<br>

**平面方程：**

平面方程是指空间中所有处于同一平面的点所对应的方程。

一般形式为 ：Ax + By + Cz + D = 0

但是该公式有一种特殊情况，即 海塞法向量。



<br>

**海塞法向量：**

`法线形式` 是一种当直线或平面的 法向量 已知时，使用 `向量方程` 描述直线或者平面的另一种表示形式。

平面的任何点都可以通过平面的法向量和该点到该平面的已知点的矢量差的点积来描述。

此点积必须为零。

一种特殊的形式是 `海塞法向量(Hessian normal form)`，其中法向量被归一化到值为 1。

海塞法向量的结论是：

任何一点 到平面的距离都可以简单表示为 D =n0 x0 + d



<br>

以上能理解多少算多少，但是请记住上述文字中提到的 **“单位长度(归一化)的法向量” 和 “常数”** 。



<br>

### 平面(Plane)的属性和方法

| 属性名            | 对应含义                                       |
| ----------------- | ---------------------------------------------- |
| .normal : Vector3 | 单位长度(归一化)的平面法向量。默认值为 (1,0,0) |
| .constant : Float | 从原点到平面的有符号距离。默认值为 0           |

> 有符号距离 意思是这个数字有可能为正数，也可能为负数



<br>

**补充说明：**

你可以脑补一下这个画面，来看一下一个平面是如何被确定(规定)的：

1. 以原点为球心，半径为 constant 的球

2. 当我们知道这个球表面某个点的平面法向量 normal 后，就可以反向计算出该点的位置

3. 沿球心到这个点可以产生一个向量，继而得到垂直于该向量的平面

   > 我们知道两个相互垂直的向量的 点积 一定为 0

我们再回过头看一下关于平面的定义：

1. 在三维空间中无限延展的二维平面

2. 该平面由 海塞法向量 定义

3. 海塞法向量由 “一个归一化的法向量” 和 一个“常数” 构成

   > .normal 就是这个 法向量
   >
   > .constant 就是这个 常数

是不是就更加容易理解了。



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .applyMatrix4 ( matrix : Matrix4, optionalNormalMatrix : Matrix3 ) : Plane | 在一个平面上应用矩阵 matrix，其中 matrix 必须是仿射齐次变换矩阵(也就是说该矩阵第 4 行一定是 (0,0,0,0) 或 (0,0,0,1)。<br />optionalNormalMatrix 为可选参数，<br />如果提供则使用该参数，<br />如果不提供则内部自己根据 matrix 计算得出：_normalMatrix.getNormalMatrix( matrix ) |
| .clone () : Plane                                            | 返回一个克隆的平面                                           |
| .coplanarPoint ( target : Vector3 ) : Vector3                | 返回一个共面点的坐标。通过原点的法向量在平面上投影算得。<br />该共面点会写入到参数 target 中。<br />补充：这个共面点实际上就是在上面提到的 “这个球表面某个点” |
| .copy ( plane : Plane ) : Plane                              | 将当前平面设置为参数 plane                                   |
| .distanceToPoint ( point : Vector3 ) : Float                 | 返回参数 点 point 到当前平面的有符号距离                     |
| .distanceToSphere ( sphere : Sphere ) : Float                | 返回参数 球面 sphere 的边缘到当前平面的最短距离              |
| .equals ( plane : Plane ) : Boolean                          | 检查当前平面与参数 plane 是否相同                            |
| .intersectLine ( line : Line3, target : Vector3 ) : Vector3  | 返回参数线段 line 与当前平面的相交点，将结果写入到 target 中。<br />若不相交则返回 null，<br />若 line 与当前平面共面(线段在当前平面里)，则返回该线段的起始点。 |
| .intersectsLine ( line : Line3 ) : Boolean                   | 检查当前平面是否与参数 line 相交                             |
| .intersectsBox ( box : Box3 ) : Boolean                      | 检查当前平面是否与参数 box 相交                              |
| .intersectsSphere ( sphere : Sphere ) : Boolean              | 检查当前平面是否与参数 sphere 相交                           |
| .negate () : Plane                                           | 将法向量与常量求反，即各自都乘以 -1。<br />这样相当于把当前平面变为 “以球为介质” 的对面的平面 |
| .normalize () : Plane                                        | 归一化法向量 normal，并在内部相应调整常量 constant 数值。<br />实际上 .normal 本身就应该是被归一化的，这里是假设 .normal 存在未被归一化的情况。<br />如果当前本身 .normal 就已经是被归一化的，那么执行该方法后不会有任何变化，同时 constant 也不会有任何变化。 |
| .projectPoint ( point : Vector3, target : Vector3 ) : Vector3 | 将参数 点 point 投射到该平面上，将在该平面上离投射点最近的点 写入到 target 中。 |
| .set ( normal : Vector3, constant : Float ) : Plane          | 设置当前平面的 法向量和常量                                  |
| .setComponents ( x : Float, y : Float, z : Float, w : Float ) : Plane | 根据参数中的分量来设置 法向量 和常量。<br />参数中的 x y z 为设置法向量 的 x y z 值，<br />参数中 w 为设置常量 .constant 的值 |
| .setFromCoplanarPoints ( a : Vector3, b : Vector3, c : Vector3 ) : Plane | 通过参数提供的 a b c 这 3 个点来确定一个平面，并将当前平面设置为该平面。<br />如果三个点在一条直线上，即这 3 个点无法构成一个平面，则将抛出错误。<br />通过右手螺旋法则来确定(向量叉乘)平面的 法向量 normal。 |
| .setFromNormalAndCoplanarPoint ( normal : Vector3, point : Vector3 ) : Plane this : Vector3 | 通过参数提供的法线 和 原点到该平面上最近距离的点来修改当前平面。 |
| .translate ( offset : Vector3 ) : Plane                      | 根据参数 offset 指定的方向和大小平移当前平面。<br />注意这只会影响平面的常量，不会影响平面的法向量。 |



<br>

## 球(Sphere)

一个球是由球心和半径所定义的。



<br>

### 球(Sphere)的属性和方法

| 属性名            | 对应含义                     |
| ----------------- | ---------------------------- |
| .center : Vector3 | 球心，默认值位于原点 (0,0,0) |
| .radius : Float   | 半径，默认值为 -1            |



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .applyMatrix4 ( matrix : Matrix4 ) : Sphere                  | 将参数矩阵 matrix 应用于当前球上。<br />在内部实际上发生的矩阵变化为：<br />1、球心根据 matrix 进行位移<br />2、半径根据 matrix 进行缩放 |
| .clampPoint ( point : Vector3, target : Vector3 ) : Vector3  | 返回与参数 point 最接近的球的点，会把该点赋值给 target。<br />1、若参数 point 位于球内或表面，则不做任何修改直接返回 point。<br />2、若参数 point 位于球外，则返回最接近 point 的球表面的那个点。 |
| .clone () : Sphere                                           | 返回一个克隆的球                                             |
| .containsPoint ( point : Vector3 ) : Boolean                 | 检查参数 point 是否位于球内或表面。<br />实际上就是判断一下球心到 point 的距离是否大于球的半径 |
| .copy ( sphere : Sphere ) : Sphere                           | 将当前球设置为参数 sphere                                    |
| .distanceToPoint ( point : Vector3 ) : Float                 | 返回球的边界到参数 point 最近的距离。<br />若该点位于球内则距离将为负数。 |
| .expandByPoint ( point : Vector3 ) : this                    | 扩展当前球的边界以包含该点。<br />若该点位于球内则当前球不会发生任何变化。 |
| .isEmpty () : Boolean                                        | 检查球是否为空(球半径为负值)。半径为 0 的球体仅包含其中心点，并不会被视为空。 |
| .makeEmpty () : Sphere                                       | 将当前球修改为空，即中心点为 (0,0,0) 半径为 -1。             |
| .equals ( sphere : Sphere ) : Boolean                        | 检查当前球与参数 sphere 是否相同                             |
| .getBoundingBox ( target : Box3 ) : Box3                     | 计算当前球的最小三维轴对齐包围盒(AABB盒)，并将该包围盒赋值给 target。<br />若当前球为空，那么返回的也是一个空的包围盒。 |
| .intersectsBox ( box : Box3 ) : Boolean                      | 检查当前球与参数 box 是否相交                                |
| .intersectsPlane ( plane : Plane ) : Boolean                 | 检查当前球与参数 plane 是否相交                              |
| .intersectsSphere ( sphere : Sphere ) : Boolean              | 检查当前球与参数 sphere 是否相交<br />实际上就是计算一下这两个球心距离是否大于这两个球半径相加之和。 |
| .set ( center : Vector3, radius : Float ) : Sphere           | 设置当前球的球心位置和半径                                   |
| .setFromPoints ( points : Array, optionalCenter : Vector3 ) : Sphere | 参数 points 中的每个元素都为 Vector3。计算可以包含 points 所有元素的最小边界球。<br />如果第二个参数 optionalCenter 有值则使用该值作为球的中心点。<br />如果没有第二个参数 则通过 points 计算出它们的中心点。 |
| .translate ( offset : Vector3 ) : Sphere                     | 根据参数 offset 的偏移量平移当前球的球心。<br />球的半径是不会发生变化的。 |
| .union ( sphere : Sphere ) : this                            | 扩展当前球体以包含原有球体和参数 sphere                      |



<br>

## 球坐标(Spherical)

**球坐标的定义：**

球坐标也被称为 球面坐标。

笛卡尔直角坐标系是由相互垂直的 3 个轴线 x y z 构成。

而球坐标系则是发生在一个 “球体” 上的坐标系。



<br>

**二维球坐标：**

> 尽管名字中有 “球”，但实际上在二维中是一个 “圆”

假设有一个半径为 r 的圆圈，当我们想描述该圆圈上的某个点的位置时，我们只需知道该点与圆形的连线 与 水平方向的夹角 θ 是多少，就可以通过计算出该点的位置。

也就是说，我们可以使用 (r, θ) 这两个数字来描述一个点的位置信息。

> 对于笛卡尔直角坐标系，我们需要使用的是 (x, y) 来表述这个点的位置

那么这种方式就算是 二维球坐标。



<br>

按照这种逻辑，我们可以延展到三维球坐标系。

也就是说需要在 r 和 θ 基础上再增加一个维度的数值。



<br>

**三维球坐标的3个构成元素：**

1. 距离：也就是球的半径 r
2. 极角：与 y 轴的极角(仰角) φ，取值范围为 0<= φ <= π
3. 方位角：与绕 y 轴的赤道角(方位角) θ，取值范围为 0 <= θ <= 2π

因此可以通过使用 (r, φ, θ) 来表示球极坐标，如同使用 (x,y,z) 来表达笛卡尔坐标。

但是请记住：在 Three.js  Spherical 中 (r, φ, θ) 分别对应 3 个属性：

1. spherical.radius：半径
2. spherical.phi：极角、仰角
3. spherical.theta：方位角



<br>

你可能一时无法理解上面的定义方式，那么可以做下面的脑补画面，有助于理解。

**球坐标的脑补画面：**

1. 假设现在有一个半径为 r 的大球体

2. 这个球体有一半(下半截)被埋在土地里

3. 此时你直立站在球体内部中心位置，且你有一双透视眼，可以透过土地看到被埋在地下的球体

4. 你可以左右 360 度转身，让自己面部朝向不同的水平方向

5. 你头部还可以上下俯仰，比如仰头看天，低头看地，你头部的俯仰范围只能在 0 - 180 度之间

6. 那么通过不断转身 和 头部的俯仰变化，你的目光就可以看到这个这个球体所有的内部表面位置

   > 由于我们身处球体内部，所以使用的文字是 “球体内部表面的某个位置”，但是如果站在球的外面看这个 “位置”，那么这个位置就是 “球体表面的某个位置”。

在上面这个场景中，有 3 个元素：

1. 球体的半径 r

2. 你头部仰俯的角度 φ，取值范围 0 - 180度

   > 所以这个角被称为：极角、仰角

3. 你水平转身的角度 θ，取值范围 0 - 360度

   > 所以这个角被称为：方位角

也就是说通过 r 、φ(.phi 极角、仰角)、θ(.theta 方位角) 三个数值即可表示出球体内部(表面)的某个位置。

<br>

> 注意：上面提到的 仰角 实际上是指 仰角 + 俯角。



<br>

**关于取值范围的约定：**

在数学中，1/2 、4/8、16/32 它们的值是相同的，但是在现实生活中，当我们想要表达数量的 “一半” 时，我们会使用 1/2，而不是 4/8、16/32。

因为 1/2 足够简单明了，这是我们约定、首选的方案。

> 在数学概念中，假如有 2 个不同数值却可以表达出相同意义，我们称它们彼此为对方的 “别称”。



同样的道理，对于角度而言，30度和 390度 他们实际上是相同的。

但是我们会约定、首选使用 30度 而不是 390度。

所以对于球坐标而言，在 Three.js 中约定：

1.  φ，取值范围 0 - 180度
2.  θ，取值范围 0 - 360度

这些约定都是人为的，例如在有的球坐标系中会约定：

1.  φ，取值范围 -90 至 90度
2.  θ，取值范围 -180 至 180度

还有，在 Three.js 中球坐标约定的是 (r, φ, θ)，但是在别的系统中可能写成 (r, θ, φ)。



<br>

**球坐标与笛卡尔坐标之间的互相转换：**

具体数学公式就不罗列了。

球坐标系提供有一个 .setFromCartesianCoords() 的方法可以将笛卡尔坐标转化为球坐标。



<br>

例如轨道控制器 OrbitControls 就使用到球坐标，让相机绕着被观察的物体 按照球体轨迹 切换视角。



<br>

**补充说明：**

对于计算机而言更容易理解 笛卡尔直角系坐标，但是对于我们人类而言更容易理解和使用 球坐标。

例如：

1. 当我们描述某个建筑位置时，我们可能会说：东南角 200 米

   > 这里的 东南角 其实就是二维球坐标中的某个角度

2. 在射击场景中，我们会告知队友：你的 3 点钟 方向有敌人

   > 这里的 3 点钟方向 实际上也是一个相对的角度
   >
   > 我们此时只是告诉队友应该注意的方向，并没有告诉距离，这是因为队友只要顺着这个方向去看就应该很快能够看到敌人。



<br>

### 球坐标(Spherical)的属性和方法

| 属性名          | 对应含义                  |
| --------------- | ------------------------- |
| .radius : Float | 半径，距离                |
| .phi : Float    | 极角、仰角 φ ，默认值为 0 |
| .theta : Float  | 方位角 θ，默认值为 0      |



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clone () : Spherical                                        | 返回一个克隆的球坐标                                         |
| .copy ( s : Spherical ) : Spherical                          | 将当前球坐标设置为参数 s                                     |
| .makeSafe () : Spherical                                     | 将极角 .phi 限制在 0.000001 和 π - 0.00001 之间              |
| .set ( radius : Float, phi : Float, theta : Float ) : Spherical | 设置当前球坐标中的 radius、phi、theta 的值                   |
| .setFromCartesianCoords ( x : Float, y : Float, z : Float ) : Spherical | 根据参数提供的笛卡尔直角坐标 x y z 转化并设置当前球坐标。    |
| .setFromVector3 ( vec3 : Vector3 ) : Spherical               | 从参数 vec3 中设置球坐标的属性值。<br />请注意并不是将 this.radius 直接设置为 vec3.x，在内部执行的是 .setFromCartesianCoords( vec3.x, vec3.y, vec3.z ) |



<br>

## 圆柱坐标(Cylindrical)

**圆柱坐标的定义：**

在上一节中，我们提到了 二维球坐标，二维球坐标实际上就是一个平面圆对应的相关坐标。

那么我们只需要给这个平面圆增加一个 高度(厚度)，就会由一个平面圆变为一个圆柱体。

> 在 Three.js 的 圆柱体坐标中，实际上就是增加了 y 来表示圆柱体的高度。

这就是圆柱坐标的由来。



<br>

### 圆柱坐标(Cylindrical)的属性和方法

| 属性名          | 对应含义                                                     |
| --------------- | ------------------------------------------------------------ |
| .radius : Float | 圆柱体的半径，也就是从原点到 x-z 平面上某一点的距离，默认值为 0 |
| .theta : Float  | 在x-z平面内逆时针角度，以z轴正方向的计算弧度。默认值为 0     |
| .y : Float      | 在 x-z 平面上的高度，默认值为 0                              |



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clone () : Cylindrical                                      | 返回一个克隆的圆柱坐标                                       |
| .copy ( other : Cylindrical ) : Cylindrical                  | 将当前圆柱坐标设置为 参数 other                              |
| .set ( radius : Float, theta : Float, y : Float ) : Cylindrical | 设置当前圆柱坐标的 3 个属性                                  |
| .setFromCartesianCoords ( x : Float, y : Float, z : Float ) : Cylindrical | 根据参数中的笛卡尔坐标 x y z 位置信息转化并设置当前圆柱坐标  |
| .setFromVector3 ( vec3 : Vector3 ) : Cylindrical             | 根据参数中的向量 vec3 的 x y z 位置信息转化并设置当前圆柱坐标 |





<br>

## 三角形(Triangle)

一个三角形是由 3 个 三维点坐标(Vector3) 所定义的。



<br>

### 三角形(Triangle)的属性和方法

| 属性名       | 对应含义                            |
| ------------ | ----------------------------------- |
| .a : Vector3 | 三角形的第 1 个角，默认值为 (0,0,0) |
| .b : Vector3 | 三角形的第 2 个角，默认值为 (0,0,0) |
| .c : Vector3 | 三角形的第 3 个角，默认值为 (0,0,0) |



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clone () : Triangle                                         | 返回一个克隆的三角形                                         |
| .closestPointToPoint ( point : Vector3, target : Vector3 ) : Vector3 | 返回三角形上最靠近参数 point 的点。<br />若参数 point 本身位于三角形内部则不作任何修改直接返回 point。 |
| .containsPoint ( point : Vector3 ) : Boolean                 | 检测参数 point 的点是否可以投影到三角形的平面内              |
| .copy ( triangle : Triangle ) : Triangle                     | 将当前三角形设置为参数 triangle                              |
| .equals ( triangle : Triangle ) : Boolean                    | 对比当前三角形与参数 triangle 是否相同                       |
| .getArea () : Float                                          | 返回当前三角形的面积                                         |
| .getBarycoord ( point : Vector3, target : Vector3 ) : Vector3 | 根据参数 point 返回一个重心坐标                              |
| .getMidpoint ( target : Vector3 ) : Vector3                  | 计算三角形的中心点，并将结果赋值给参数 target                |
| .getNormal ( target : Vector3 ) : Vector3                    | 计算三角形的法向量，并将结果赋值给参数 target。<br />若三角形仅为一个点(不是一个正常的三角形)，则返回 (0,0,0) |
| .getPlane ( target : Plane ) : Plane                         | 返回三角形对应的平面，将结果赋值给 target<br />这里说的 平面是指 3D 空间中无限延展的 平面。 |
| .intersectsBox ( box : Box3 ) : Boolean                      | 检测当前三角形与参数 box 是否相交                            |
| .set ( a : Vector3, b : Vector3, c : Vector3 ) : Triangle this : Triangle | 设置当前三角形的三个角                                       |
| .setFromPointsAndIndices ( points : Array, i0 : Integer, i1 : Integer, i2 : Integer ) : Triangle this : Triangle | 参数 points 的元素都是 Vector3。<br />设置当前三角形的三个角依次为：<br />this.a 的值为 points[i0]<br />this.b 的值为 points[i1]<br />this.c 的值为 points[i2] |



<br>

**三角形的各种 心：**

1. 重心：三条中线的交点
2. 垂心：三条高的交点
3. 内心：三角形内切圆的圆心，到三条边的距离相等
4. 外心：三角形外接圆的圆心，到三个顶点的距离相等
5. 旁心：三角形 3 个旁切圆的圆心，一共有 3 个
6. 中心：只有正三角形才会有中心，重心、垂心、内心、外心 全部重合。



<br>

## 视椎体(Frustum)

**视椎体的定义：**

视椎体也被称为 平接头体。

由 上下左右前后 共 6 个面构成。

在 Three.js 中视椎体主要应用于镜头的视野：透视相机和正交相机



<br>

**视椎体 6 个面的顺序说明：**

在我们初始化并设置一个正交相机时 平面是有明确的顺序的。

```
OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )
```

但是对于视椎体本身而言 6 个面的顺序是无所谓的。

就好像我们描述一个三角形时，三角形的三个角的顺序发生变化并不影响这个三角形的形状。



<br>

### 视椎体(Frustum)的属性和方法

| 属性名          | 对应含义                       |
| --------------- | ------------------------------ |
| .planes : Array | 当前视椎体的 6 个面 组成的数组 |



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clone () : Frustum                                          | 返回一个克隆的视椎体                                         |
| .containsPoint ( point : Vector3 ) : Boolean                 | 检测参数 点 point 是否在当前视椎体内                         |
| .copy ( frustum : Frustum ) : Frustum                        | 设置当前视椎体为参数 frustum                                 |
| .intersectsBox ( box : Box3 ) : Boolean                      | 检测当前视椎体是否与参数 box 相交                            |
| .intersectsObject ( object : Object3D ) : Boolean            | 检测当前视椎体是否与 object 的包围球相交                     |
| .intersectsSphere ( sphere : Sphere ) : Boolean              | 检测当前视椎体是否与 球体 sphere 相交                        |
| .intersectsSprite ( sprite : Sprite ) : Boolean              | 检测当前视椎体是否与 精灵 sprite 相交。<br />在内部实际上是创建一个中心点位于 (0,0)，<br />半径为 0.5 的平方根 也就是 0.7071067811865476 ，<br />然后再将该球体使用 精灵 sprite 的世界变化矩阵，<br />最终将得到的球体与当前视椎进行相交检测。 |
| .set ( p0 : Plane, p1 : Plane, p2 : Plane, p3 : Plane, p4 : Plane, p5 : Plane ) : this | 设置当前视椎体的6个平面。                                    |
| .setFromProjectionMatrix ( matrix : Matrix4 ) : this         | 根据投影矩阵 matrix 来设置当前视椎体的 6 个面。              |



<br>

## 插值器(Interpolant)

**插值器的定义：**

插值器不是某种几何图形，而是一种用于表达曲线上某种时间或路径间隔的抽象基类。



<br>

由于是抽象类，所以该类的一些属性都是需要用户自己去设定的。



<br>

### 插值器(Interpolant)的属性和方法

| 属性名                     | 对应含义                     |
| -------------------------- | ---------------------------- |
| .parameterPositions : null | 位置集合                     |
| .resultBuffer : null       | 用于存储插值结果的缓冲区     |
| .sampleValues : null       | 样本集合                     |
| .settings : Object         | 可选的，特定于子类的设置结构 |
| .valueSize : null          | 结果大小                     |



<br>

| 方法名                          | 对应含义                  |
| ------------------------------- | ------------------------- |
| .evaluate ( t : Number ) : null | 计算不减函数在位置 t 的值 |



<br>

## 颜色(Color)

请注意，颜色 是一种色彩数学对象模型，这与本文上面所将的 线性代数变换、坐标、几何图形等全部不属于同一类。



<br>

**颜色 Color 初始化时合法的颜色值：**

1. 十六进制的颜色值，例如 0xff00ff
2. 类似 CSS 中的颜色值，例如：
   1. “rgb(250,0,0)”
   2. "rgb(100%,0%,0%)"
   3. "hsl(0,100%,50%)"
   4. "#ff0000"
   5. “#f00”
   6. "red"
3. 直接 r g b 对应的 3 个数值，数值取值范围应该是 0 - 1
4. 参数可以是另外一个颜色实例，此时会将当前颜色设置为和参数颜色相同的值



<br>

**请注意颜色本身不包含透明度信息。**



<br>

### 颜色(Color)的属性和方法

| 属性名     | 对应含义                                 |
| ---------- | ---------------------------------------- |
| .r : Float | 红色通道的值，取值范围 0 - 1，默认值为 1 |
| .g : Float | 绿色通道的值，取值范围 0 - 1，默认值为 1 |
| .b : Float | 蓝色通道的值，取值范围 0 - 1，默认值为 1 |

> 默认 new Color() 的颜色为白色



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .add ( color : Color ) : Color                               | 将参数 color 的 RGB 值添加到当前颜色的 RGB 中。<br />也就是说 this.r += color.r，g 和 b 同样也这样操作 |
| .addColors ( color1 : Color, color2 : Color ) : Color        | 将当前颜色 RGB 设置为 color1 与 color2 RGB 值之和            |
| .addScalar ( s : Number ) : Color                            | 将当前颜色的 RGB 分别都加上 s                                |
| .clone () : Color                                            | 返回一个克隆的颜色                                           |
| .copy ( color : Color ) : Color                              | 将当前颜色设置为 参数 color                                  |
| .convertGammaToLinear ( gammaFactor : Float ) : Color        | 通过取当前颜色 r g b 的 gammaFactor 次方将颜色从伽马空间转换成线性空间。<br />参数 gammaFactor 为可选参数，默认值为 2。 |
| .convertLinearToGamma ( gammaFactor : Float ) : Color        | 通过取颜色 r g b 的 1/gammaFactor 次方将颜色从线性空间转换成伽马空间。<br />参数 gammaFactor 为可选参数，默认值为 2。 |
| .convertLinearToSRGB () : Color                              | 将当前颜色从线性空间转换成 sRGB 空间                         |
| .convertSRGBToLinear () : Color                              | 将当前颜色从 sRGB 空间转换成线性空间                         |
| .copyGammaToLinear ( color : Color, gammaFactor : Float ) : Color | 将参数 color 从伽马空间转换到线性空间，然后赋值给当前颜色。  |
| .copyLinearToGamma ( color : Color, gammaFactor : Float ) : Color | 将参数 color 从线性空间转换到伽马空间，然后赋值给当前颜色。  |
| .copyLinearToSRGB ( color : Color] ) : Color                 | 将参数 color 从线性空间转换到 sRGB 空间，然后赋值给当前颜色。 |
| .copySRGBToLinear ( color : Color ) : Color                  | 将参数 color 从 sRGB 空间转换到线性空间，然后赋值给当前颜色。 |
| .equals ( color : Color ) : Boolean                          | 对比当前颜色是否与参数  color 颜色相同                       |
| .fromArray ( array : Array, offset : Integer ) : Color       | 按照 offset 的索引偏移，依次从参数 array 中读取并设置当前颜色的 r g b 值。<br />offset 默认值为 0 |
| .fromBufferAttribute ( attribute : BufferAttribute, index : Integer ) : this | 按照 index 的索引，依次从缓冲区 attribut 中读取并设置当前颜色的 r g b 值。 |
| .getHex () : Integer                                         | 返回当前颜色的十六进制值                                     |
| .getHexString () : String                                    | 返回当前颜色的十六进制值对应的字符串形式<br />例如 "ffffff" ，请注意是小写字母 |
| .getHSL ( target : Object ) : Object                         | 根据当前颜色的 r g b 转化为 HSL 格式，然后组合成如下结构的一个对象： {h: xx, s:xx, l:xx}。<br />会把该对象赋值给 target。 |
| .getStyle () : String                                        | 返回当前颜色对应的 CSS  样式的字符串。<br />例如："rgb(255,0,0)" |
| .lerp ( color : Color, alpha : Float ) : Color               | 将当前颜色设置为与参数 color 的插值，其中 alpha 是比例值。<br />若 alpha 为 0 则当前颜色不变。<br />若 alpha 为 1 则当前颜色变为参数 color。 |
| .lerpColors ( color1 : Color, color2 : Color, alpha : Float ) : this | 将当前颜色设置为参数 color1 与 color2 的线性插值结果。其中 alpha 是比例值。 |
| .lerpHSL ( color : Color, alpha : Float ) : Color            | 将当前颜色设置为与参数 color 的 HSL 插值。<br />请注意在内部计算时的方法不同于 .lerp() |
| .multiply ( color : Color ) : Color                          | 将当前颜色的 rgb 值乘以参数 color 的 rgb 值                  |
| .multiplyScalar ( s : Number ) : Color                       | 将当前颜色的 rgb 值都乘以参数 s                              |
| .offsetHSL ( h : Float, s : Float, l : Float ) : Color       | 将HSL 格式的参数  h s l 的值累加到当前颜色中。<br />其中 h s l 取值范围均为 0 - 1 |
| .set ( value : Color_Hex_or_String ) : Color                 | 设置当前颜色值                                               |
| .setHex ( hex : Integer ) : Color                            | 根据参数 hex(十六进制) 设置当前颜色值                        |
| .setHSL ( h : Float, s : Float, l : Float ) : Color          | 根据 HSL 格式的参数 h s l 设置为当前颜色值。<br />其中 h s l 取值范围均为 0 - 1 |
| .setRGB ( r : Float, g : Float, b : Float ) : Color          | 根据参数 r g b 设置当前颜色。<br />其中参数 r g b 取值范围均为 0 - 1 |
| .setScalar ( scalar : Float ) : Color                        | 将当前颜色的 r g b 的值都设置为 参数 scalar                  |
| .setStyle ( style : String ) : Color                         | 根据 CSS 格式的颜色值设置当前颜色值。<br />请注意颜色字符串字母是不区分大小写的。 |
| .setColorName ( style : String ) : Color                     | 根据 X11 颜色名字设置当前颜色值。                            |
| .sub ( color : Color ) : Color                               | 将当前颜色的 r g b 都减去参数 color 的 rgb 的值。<br />若分量减去后结果为负数 则将该分量值设置为 0 |
| .toArray ( array : Array, offset : Integer ) : Array         | 将当前颜色的 r g b 写入到数组 array 中，使用 offset 作为偏移量。<br />参数 offset 默认值为 0 |
| .toJSON()                                                    | 等同于 .getHex()                                             |



<br>

## 圆柱体球谐函数3(SphericalHarmonics3)

这个类也是 Three.js 数据库中的一个类，只不过目前实在不太明白，也暂时用不到该类，所以暂时不做学习。



<br>

## 通用数学函数(MathUtils)类

Three.js 给我们提供了一个 通用数学函数 的工具类。

该类名字为 MathUtils，没有属性，为我们提供了大量的 静态数学函数。

> 该类不需要实例化即可使用。

你可以把 MathUtils 看作是对 JS 内置的 Math 的补充。



<br>

| 方法名                                                       | 对应含义                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| .clamp ( value : Float, min : Float, max : Float ) : Float   | 根据 min 和 max 构成的取值范围，修订参数 value 的值。        |
| .degToRad ( degrees : Float ) : Float                        | 将度转化为弧度                                               |
| .radToDeg ( radians : Float ) : Float                        | 将弧度转化为度                                               |
| .euclideanModulo ( n : Integer, m : Integer ) : Integer      | 计算 m % n 的欧几里得模：( (n%m) + m ) % m                   |
| .generateUUID ( ) : UUID                                     | 生成并返回一个全局唯一标识符 UUID                            |
| .isPowerOfTwo ( n : Number ) : Boolean                       | 如果参数 n 是 2 的幂，则返回 true                            |
| .inverseLerp ( x : Float, y : Float, value : Float ) : Float | 返回参数 value 在起点 x 与终点 y 的闭区间 [0,1] 中的百分比(插值因子)。 |
| .lerp ( x : Float, y : Float, t : Float ) : Float            | 返回给定区间的线性插值 t 的结果。<br />若 t 为 0 则返回 x，若 t 为 1 则返回 y。 |
| .damp ( x : Float, y : Float, lambda : Float, dt : Float ) : Float | 返回使用 dt 以类似弹簧保持帧速率独立的移动的方式从 x 向 y 平滑插值的一个数值结果。 |
| .mapLinear ( x : Float, a1 : Float, a2 : Float, b1 : Float, b2 : Float ) : Float | x 从范围 [a1, a2] 到范围 [b1,b2]的线性映射                   |
| .pingpong ( x : Float, length : Float ) : Float              | 返回一个介于 0 和 lenght 之间的值                            |
| .ceilPowerOfTwo ( n : Number ) : Integer                     | 返回大于等于 n 的 2 的最小次幂                               |
| .floorPowerOfTwo ( n : Number ) : Integer                    | 返回小于等于 n 的 2 的最大次幂                               |
| .randFloat ( low : Float, high : Float ) : Float             | 返回区间 [low, high] 内随机一个浮点数                        |
| .randFloatSpread ( range : Float ) : Float                   | 返回区间 [-range/2, range/2] 内随机一个浮点数                |
| .randInt ( low : Integer, high : Integer ) : Integer         | 返回区间 [low, high] 内随机一个整数                          |
| .seededRandom ( seed : Integer ) : Float                     | 在区间 [0,1] 中生成确定性的伪随机浮点数                      |
| .smoothstep ( x : Float, min : Float, max : Float ) : Float  | 返回一个 0 - 1 之间的值，该指标是 x 在最小值和最大值之间移动的百分比，但是当 x 接近最小值或最大值时，变化程度会平滑或减慢。 |
| .smootherstep ( x : Float, min : Float, max : Float ) : Float | 返回一个  0 - 1 之间的值，它和 .smoothstep() 相同，但变动更加平缓。 |
| .setQuaternionFromProperEuler ( q : Quaternion, a : Float, b : Float, c : Float, order : String ) : null | 根据 a、b、c、order 来设置 四元数 q。按照 order 指定的旋转顺序：先旋转角度 a，再旋转角度 b，最后旋转角度 c。角度以弧度为单位。 |





<br>

## 本文总结

通过本文，我们大致了解学习了：

1. 线性代数 一些基本概念，例如 向量、点乘、叉乘 等
2. 变换相关的类，例如 欧拉角、四元数、矩阵
3. 几何图形相关的类，例如 射线、包围盒、球体
4. 坐标相关的类，例如 球坐标、圆柱坐标
5. 颜色
6. 通用数学函数
7. 其他：线性插值、圆柱体球谐函数



<br>

内容足够多，需要好好消化。

但这些仅仅是他们基本概念和方法，真正需要用到空间变换时，往往组合起来更加复杂。

<br>

**路漫漫其修远，我将上下而求索。**

