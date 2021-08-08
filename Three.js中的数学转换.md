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

