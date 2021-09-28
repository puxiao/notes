# Cesium.js的若干问题与答案

本文用于整理在学习 Cesium.js 中遇到的一些问题与思考。



<br>

## 为什么 Cesium.js 对 TypeScript 的支持度不好？

尽管官方 NPM 包中自带有 Cesium.d.ts 文件，但是在实际使用过程中会发现，Cesium 对 TypeScript 支持度非常不好，经常遇到 TypeScript 各种报错。

> 是在 1.70 版本后才新增 Cesium.d.ts 的。

> 较为常见的有：
>
> 1. TS 提示某些方法不存在
>
> 2. 非常多属性值赋值时提示类型不匹配
>
>    因为很多属性 Cesium.js 内部都被定义为 `Property | undefined`，而这个类型和我们自觉上应该直接赋值有冲突。
>
>    关于 Property 我会在后面单独详细讲解。

Cesium.js 内部使用 JSDoc 注释规范，然后自动构建生成的 Cesium.d.ts 文件。

我个人觉得主要是因为以下 2 个原因：

1. 一些 JSDoc 注释本身就不够严谨，自然对应的 类型 也不是完全正确。
2. Cesium.js 内部使用 ES5 的方式来定义类，未使用比较新的 ES6 语法。这就造成有一些 “奇奇怪怪” 的属性或方法未能被 JSDoc 正确理解并导出。

**解决方式：**

1. 不使用官方自带的 Cesium.d.ts，而是使用第三方的 @types/cesium

   > 缺点是：@types/cesium 版本更新略滞后与 官方最新版本
   >
   > 实际上自从 Cesium.js 官方开始支持 TypeScript 以后，目标就是要替换掉 @types/cesium 

2. 通过在自己的项目中 添加手工定义的 global.d.ts 来弥补官方 Cesium.d.ts 中的不足。

   > 缺点是：需要自己手工更新维护
   >
   > 在本文后面我也会详细讲解如何手工添加类型声明，来弥补官方 Cesium.d.ts 中的不足。



<br>

## 为什么 Cesium.js 中属性类型要设置成 Property，而不是直接赋值？

假设我想给一个模型添加一个描边，那么我的代码看上去应该如下：

```
model.silhouetteColor = Color.RED
model.silhouetteSize = 4
```

如果你使用的是 .js 那么上面代码没一点问题，但是我使用的是 TypeScript，就会收到这样的报错：

```
不能将类型“number”分配给类型“Property | undefined”。
不能将类型“4”分配给类型“Property | undefined”。
```



<br>

从开始学习 cesium.js 以来，遇到 TS 类似报错我都会把原因归咎于官方 JSDoc 写的不好，像上面这个 TS 报错我也归咎于是官方 JSDoc 写的有问题。但是我从未去认真想过，为啥官方把一些 “明显可以直接赋值的属性”定义成 Property 类型。



<br>

刚看到了 cesium 的一个 issues (8898)

https://github.com/CesiumGS/cesium/issues/8898#issuecomment-637579223

官方回复有一段内容，讲解了为什么是 Porperty 类型。
通过查阅文档， **Property 应该是和 模拟时间、增加值改变后的回调函数有关。**



<br>

上面那段代码最正确的写法应该是：

```
model.silhouetteColor = new ConstantProperty( Color.RED )
model.silhouetteSize = new ConstantProperty( 4 )
```

像这样的问题，几乎涵盖了 cesium 中绝大多数类的属性，或许未来官方会有更加合理的解决方式。



<br>

**Property 本身只是相当于一个接口，cesium 类的属性实际上都应该是 Property 某种子类的实例。**

<br>

**Property的子类：**

**CompositeProperty：**

TimeIntervalCollection 需要用到的属性，所包含每个 TimeInterval 的 data 属性都是由其他 Property 组成的。

| 与它相关的类              | 大致用途                       |
| ------------------------- | ------------------------------ |
| CompositeMaterialProperty | 在时间间隔中和 材质 相关的属性 |
| CompositePositionProperty | 在时间间隔中和 位置 相关的属性 |



<br>

**ConstantProperty：**

不会随 模拟时间 而变化的常量。

实际中，我们常见的 字符串、数字或者其他复杂类型，都可以使用 ConstantProperty 进行实例化，例如：

```
model.silhouetteColor = new ConstantProperty( Color.RED )
model.silhouetteSize = new ConstantProperty( 4 )
```

<br>

| 与它相关的类             | 大致用途                     |
| ------------------------ | ---------------------------- |
| ConstantPositionProperty | 会和 ReferenceFrame 一起使用 |



<br>

**SampledProperty：**

一组样本以及指定的插值算法。

| 与它相关的类            | 大致用途       |
| ----------------------- | -------------- |
| SampledPositionProperty | 和位置插值有关 |



<br>

**TimeIntervalCollectionProperty：**

TimeIntervalCollection 需要用到的属性，所包含每个 TimeInterval 的 data 属性都是时间值。



<br>

**MaterialProperty：**

和材质属性相关的接口类，并不能直接实例化，只能实例化其子类。

| 它的子类                        | 大致用途                       |
| ------------------------------- | ------------------------------ |
| ColorMaterialProperty           | 材质颜色                       |
| CompositeMaterialProperty       | 在时间间隔中和 材质 相关的属性 |
| GridMaterialProperty            | 材质网格                       |
| ImageMaterialProperty           | 材质贴图                       |
| PolylineGlowMaterialProperty    | 材质光辉                       |
| PolylineOutlineMaterialProperty | 材质轮廓                       |
| StripeMaterialProperty          | 材质纹理                       |



<br>

**PositionProperty：**

位置相关属性对应的 Cartesian3，不可以直接实例化，只能实例化其子类。

| 它的子类                               | 大致用途                       |
| -------------------------------------- | ------------------------------ |
| CompositePositionProperty              | 在时间间隔中核 位置 相关的属性 |
| ConstantPositionProperty               | 位置 常量                      |
| SampledPositionProperty                | 和位置插值相关的属性           |
| TimeIntervalCollectionPositionProperty | 和时间间隔相关的位置属性       |



<br>

**ReferenceProperty：**

关联到提供的对象(实体集)上的另外一个属性。



<br>

由于本人目前理解有限，以后再慢慢补充具体用法和含义。



<br>

## 如何手工添加 TypeScript 类型声明，弥补 Cesium.d.ts 的不足？

再给属性赋值时，除了严格使用 Property 类型外，还会遇到很多其他 TS 类型报错。

这些报错信息大致分为以下 3 类：

1. Cesium 新增的全局属性，例如 window.CESIUM_BASE_URL
2. cesium.d.ts 遗漏的一些类型声明，例如 buildModuleUrl.setBaseUrl()
3. cesium.d.ts 标记错误的一些类型声明，例如 viewer.bottomContainer 实际上是 HTMLDivElement，而被错误标记成 Element。



<br>

目前我只找到了针对第 1 种情况的解决办法。

**给 window 添加全局自定义属性：**

1. 在项目根目录，创建 global.d.ts 文件，并添加以下内容：

   ```
   interface Window {
       CESIUM_BASE_URL: string;
   }
   ```

2. 修改 tsconfig.json 文件，在 "include" 中添加 global.d.ts ：

   ```
   "include": [
       "src",
       "global.d.ts"
     ]
   ```

   > 当修改上述操作后，为了确保生效，一定要重启 VSCode。

这样，再在代码中书写 window.CESIUM_BASE_URL 时就不会再有 TS 报错了。



<br>

剩下 2 种情况如何修改，以后再补充。



<br>

## 如何在 Cesium 中添加参数调试面板？

Cesium 官方推荐使用的是 knockout 这个第三方类库。

> Cesium.js 官方示例中使用的都是 knockout

knockout 位于 cesium/Source/ThirdParty/knockout.js

> 当然你也可以选择自己安装 `yarn add knockout`

<br>

**knockout使用步骤：**

1. 首先在网页中创建一个承载 knockout 的 div 标签

   ```
   <div id='toolbar'></div>
   ```

2. 根据要添加的参数调试面板选项，在 toolbar 标签中添加对应的子项，假设有一项为  height，则：

   ```
   <div id='toolbar'>
       <input type="text" size="5" data-bind="value: height">
   </div>
   ```

   > 请注意标签中的 data-bind 字段

3. 创建一个 viewModel 的对象，让该对象包含 height 这个属性字段

   ```
   let viewModel = {
       height: 0
   }
   ```

4. 告知 knockout 开始监听 viewModel

   ```
   knockout.track(viewModel)
   ```

5. 将 viewModel 与 toolbar 进行绑定

   ```
   let toolbar = document.getElementById('toolbar')
   knockout.applyBindings(viewModel, toolbar)
   ```

6. 添加 viewModel 的某个属性值变化对应的处理函数，这里依然以 height 为例

   ```
   knockout.getObservable(viewModel, 'height').subscribe(
       function(newValue){
           ...
       }
   )
   ```

   > observable：单词意思为 观察
   >
   > subscribe：单词意思为 订阅



<br>

**由于本人使用的是 React 框架，所以我不使用 knockout，而是使用 react-dat-gui。**

代码套路示例：

```
const getOneDiff = (objA: object, objB: object): string | undefined => {

    for (let key of Object.keys(objB)) {
        //@ts-ignore
        if (objB[key] !== objA[key]) {
            return key;
        }
    }

    return undefined
}

export default getOneDiff
```

<br>

```
interface GuiData {
    height: number,
    shadows: boolean
}

let guiDataInit: GuiData = {
    height: 0,
    shadows: true // 注意，这个 shadows 属性我们并未在下面的 DatGui 中使用到
}

const HelloCesium = () => {

    const [guiData, setGuiData] = useState<GuiData>(guiDataInit)
    const viewerRef = useRef<Viewer>()
    
    const handleUpdate = (newData: Partial<GuiData>) => {
    
        //假设你需要精准知道究竟是哪一项属性值发生了变化，则可能需要以下代码
        //const diffKey = getOneDiff(guiData, newData)
        //if(diffKey !== undefined) {
        //      switch(diffKey){
        //          case 'height':
        //              ...
        //          break
        //          
        //          case 'shadows':
        //              ...
        //          break
        //      }
        //    newData[diffKey]
        //    ...
        //}
        
        setGuiData(prev => ({ ...prev, ...newData }))
    }
    
    useEffect(() => {

        //@ts-ignore
        buildModuleUrl.setBaseUrl('./static/Cesium/')

        const viewer = new Viewer('cesiumContainer', {});
        viewerRef.current = viewer

        setGuiData({ ...guiDataInit, ...{ height: 10 } }) //当 Viewer 初始化后，仅第一次页面渲染完成时执行该行代码

    }, [])

    useEffect(() => {
        if (viewerRef.current === undefined) return

        const viewer = viewerRef.current
        viewer.xxx = guiData.height

    }, [guiData])

    return (
        <Fragment>
            <div id='cesiumContainer'></div>
            <DatGui data={guiData} onUpdate={handleUpdate} >
                <DatNumber path='height' label='Height' min={-50} max={50} step={1} />
            </DatGui>
        </Fragment>
    )
}

export default HelloCesium
```

> 具体 react-dat-gui 的用法，参见：https://github.com/claus/react-dat-gui



<br>

## 配置全局静态资源路径的 2 种方式是什么？

第1种：挂载到 window 对象中

```
window.CESIUM_BASE_URL = './static/cesium/'
```

第2种：使用 setBaseUrl() 函数

> setBaseUrl 函数位于 buildModuleUrl 命名空间内

```
buildModuleUrl.setBaseUrl('./static/cesium/')
```



<br>

## 如何加载 gLTF 格式的 3D 模型？

外部 3d 模型资源加载到 Cesium 中后，对应的是 ModelGraphics 实例。

因此加载并显示 gLTF 格式的 3D 模型，本质上的流程为：

1. 创建一个 ModelGraphics 实例，并设置该实例的 uri 属性，告知 gLTF 文件资源的路径。

   > 还可以设置该 ModelGraphics 的一些其他属性，例如 color(颜色)、colorBlendMode(颜色混合模式)、colorBlendAmount(颜色混合模式强度)、silhouetteColor(扩展描边颜色)、silhouetteSize(扩展描边大小)、minimumPixelSize(不管缩放如何，模型最小像素)、maximumScale(不管缩放如何，模型最大像素) 等等。

2. 创建一个 Entity 实例，并将 ModelGraphics 实例添加到该 Entity 示例中

   > 我们还需要设置该 Enitiy 实例对应的 position(位置)、orientation(角度方向)
   >
   > 也可以给该 Entity 添加一个 name(名字) 属性值，以便以后通过 . name 来区分不同的 实体(Entity)

3. 通过 viewer.entities.add() 的方法，将 Entity 实例添加到主场景的 EntitiesCollection 中。

4. 设置 viewer.trackedEntity 的值，开始追踪该实体，以便将当前视角切换到该实例视角。

以上流程对应的代码如下：

```
const entity = viewer.entities.add({
    name: url,
    position,
    orientation,
    model: {
        uri: url,
        minimumPixelSize: 128,
        maximumScale: 20000,
        ...
    }
})

viewer.trackedEntity = entity
```

<br>

**请注意：**

1. 我们只需要将 gLTF 模型资源通过 .rui 属性值告诉 Cesium 即可，无需关心底层是究竟如何加载和解析的。

   > Three.js 中需要我们自己根据模型的文件类型，选择不同加载器，以及将加载后的模型添加到场景中。

2. 目前 Cesium 只支持符合 gLTF 规范的 3D 模型资源，不支持其他格式的 3D 模型资源。

   > 再次强调：只要是符合 gLTF 规范的 3D 模型资源即可，哪怕是经过 draco 压缩过的文件都可以。
   >
   > 即文件后缀为 .glb 或 .gltf。

<br>

**关于 orientation 的补充说明：**

Entity 的配置项 orientation 用于设定实体的朝向和姿态，作为配置项时 orientation 的值可以是 四元数(Quaternion)。

通常是这样设置 位置和朝向姿态的：

```
const position = Cartesian3.fromDegrees(-123.0744619, 44.0503706, height)
const heading = 135 * Math.PI / 180.0
const pitch = 0
const roll = 0
const hpr = new HeadingPitchRoll(heading, pitch, roll)
const orientation = Transforms.headingPitchRollQuaternion(position, hpr)

const entity = viewer.entities.add({
    position,
    orientation,
    model: {
        uri: url
    }
})

viewer.trackedEntity = entity
```



<br>

## 如何解决Cesium 1.85版本编译时 zip.js 相关报错？

在 2021年 9 月初发布的 1.85 版本中，对于第三方类库 zip.js 引入时做了变动。

```diff
- import * as zip from "@zip.js/zip.js/lib/zip.js";
+ import * as zip from "@zip.js/zip.js/lib/zip-no-worker.js";
+ zip.configure({
+  useWebWorkers: false
+ });
```

而这个修改导致 react 在编译时会报错：

```
node_modules/cesium/Source/ThirdParty/zip.js 3559:74 ...
Module parse failed: Unexpected toke (3559:74)
File was processed with thes loaders:
...
```

原因是目前 creact-react-app 所创建的 react 项目使用的是 webpack4，不支持上面 zip.js 中的配置。

> 希望 creat-react-app 早日更新成基于 webpack5 的编译。

**解决方式为：**

1. 安装 `yarn add @craco/craco --dev`

2. 安装 `@open-wc/webpack-import-meta-loader`

   ```
   yarn add @open-wc/webpack-import-meta-loader --dev
   ```

3. 在根目录创建 `craco.config.js` ，文件内容添加 rules 的配置：

   ```
   module.exports = {
       webpack: {
           configure: (config) => {
               // remove cesium warning
               config.module.unknownContextCritical = false
               config.module.unknownContextRegExp = /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
   
               // remove zip.js error in webpack4
               config.module.rules.push({
                   test: /\.js$/,
                   use: { loader: require.resolve('@open-wc/webpack-import-meta-loader') }
               });
               return config
           }
   };
   ```

4. 修改 `package.json`文件：

   ```diff
   - "start": "react-scripts start",
   - "build": "react-scripts build",
   - "test": "react-scripts test",
   
   + "start": "craco start",
   + "build": "craco build",
   + "test": "craco test",
   ```



<br>

## 场景交互 SceneSpaceEventHandler 的参数类型变化规律是什么？

Cesium.js 是一套框架，在 ScreenSpaceEventHandler 内部已经针对各种用户鼠标、键盘等操作进行了 “相关事件处理”。

当我们需要添加一些用户交互时，通过 .setInputAction(action, type, modifier) 函数来添加的。

> 这 3 个参数的类型依次为：
>
> 1. action：function、arrow function
> 2. type：Number
> 3. modifier：Number

<br>

例如添加 鼠标移动 交互，代码可能如下：

```
const scene = viewer.scene
const handler = new ScreenSpaceEventHandler(scene.canvas)

handler.setInputAction(
    (movement) => {
        const feature = scene.pick(movement.endPosition)
        ...
    },
    ScreenSpaceEventType.MOUSE_MOVE
)
```

请注意上述代码中，action 对应是 (movement) => { ... }，在 VSCode 中此时 movement 的类型为 any，在函数内部 movement.endPosition 也是 any。

实际上我们都知道在 MOUSE_MOVE 事件处理函数中，action 的参数 movement 类型为：

```
{
    startPosition: Cartesian2,
    endPosition: Cartesian2
}
```



<br>

再换一个例子，假设我们需要添加 鼠标左键点击 交互，代码可能如下：

```
const scene = viewer.scene
const handler = new ScreenSpaceEventHandler(scene.canvas)

handler.setInputAction(
    (mouse) => {
        const feature = scene.pick(mouse.position)
        ...
    },
    ScreenSpaceEventType.LEFT_CLICK
)
```

请注意上述代码中，action 对应是 (mouse) => { ... }，在 VSCode 中此时 mouse 的类型为 any，在函数内部 mouse.position 也是 any。

实际上我们都知道在 LEFT_CLICK 事件处理函数中，action 的参数 mouse 类型为：

```
{
    position: Cartesian2
}
```



<br>

别问我为什么知道，因为我认真阅读过 ScreenSpaceEventHandler.js 源码。



<br>

上面举例中，MOUSE_MOVE 事件对应的 action 中的参数类型为 { startPosition: Cartesian2, endPosition: Cartesian2 }，而 LEFT_CLICK 事件对应的 action 中参数类型为 { position: Cartesian2 }，类似的，其他不同事件中 action 的参数类型也都不相同。

因此我们可以得出结论：不同的交互事件 type (setInputAction 的第 2 个参数) 对应的 action (setInputAction 的第 1 个参数) 中参数类型不相同。



<br>

通过查阅 ScreenSpaceEventHandler.js 源码，可以将不同事件类型对应的 action 参数进行总结。

我们创建一个名为 ScreenSpaceEventParamsType.ts 的文件，内容：

```
import { Cartesian2 } from 'cesium'

namespace ScreenSpaceEventParamsType {
    export interface LEFT_DOWN { position: Cartesian2 }
    export interface LEFT_UP { position: Cartesian2 }
    export interface LEFT_CLICK { position: Cartesian2 }
    export interface LEFT_DOUBLE_CLICK { position: Cartesian2 }
    export interface RIGHT_DOWN { position: Cartesian2 }
    export interface RIGHT_UP { position: Cartesian2 }
    export interface RIGHT_CLICK { position: Cartesian2 }
    export interface MIDDLE_DOWN { position: Cartesian2 }
    export interface MIDDLE_UP { position: Cartesian2 }
    export interface MIDDLE_CLICK { position: Cartesian2 }
    export interface MOUSE_MOVE { startPosition: Cartesian2, endPosition: Cartesian2 }
    export type WHEEL = number
    export interface PINCH_START { position1: Cartesian2, position2: Cartesian2 }
    export type PINCH_END = undefined
    export interface PINCH_MOVE {
        distance: {
            startPosition: Cartesian2,
            endPosition: Cartesian2,
        },
        angleAndHeight: {
            startPosition: Cartesian2,
            endPosition: Cartesian2,
        }
    }
}

export default ScreenSpaceEventParamsType
```

> 强调说明：以上参数类型的归纳，是我通过阅读源码和实际本机测试得出的，我相信在其他设备上应该也是正确的。
>
> 特别强调 2 个事件：
>
> 1. 对于 WHEEL 事件来说，参数类型其实就是经过 cesium.js 处理过后的 delta 数值(数字)。
> 2. 对于 PINCH_END 事件来说，实际上是没有 参数 的，所以在上述代码中将参数设置为了 undefined

<br>

**实际使用：**

我们再写 鼠标移动 事件交互时，可以人为得去给 action 参数添加类型，方便我们在 action 函数内部去调用参数对应的属性。

> 假设 ScreenSpaceEventParamsType.ts 位于 src/typings/ 目录下

```
// 我们使用 import type ... 这种方式引入，强调我们引入的仅仅是一个定义好的 TypeScript 类型，不是真的一个类或对象
import type ScreenSpaceEventParamsType from 'typings/screen-space-event-params-type'

const scene = viewer.scene
const handler = new ScreenSpaceEventHandler(scene.canvas)

handler.setInputAction(
    (movement: ScreenSpaceEventParamsType.MOUSE_MOVE) => {
        const feature = scene.pick(movement.endPosition)
        ...
    },
    ScreenSpaceEventType.MOUSE_MOVE
)
```

> 注意：我们人为得设置 movement 的类型为 ScreenSpaceEventParamsType.MOUSE_MOVE，这里的 "MOUSE_MOVE" 和 第 2 个参数进行呼应，我们就可以在 action 内部得到正确的 movement 类型，VSCode 也知道 movement.endPosition 的类型为 Cartesian2 了。



<br>

以上这种操作在开发过程中，并不是必须的，但是通过我们对于 action 的参数类型设定，可以比较方便得到较好的语法提示。



<br>

## 如何循环遍历瓦片集中每一个特征要素(feature)，并让其执行某个函数？

瓦片集(Cesium3DTileset) 遵循 3D-Tileset 规范，**每一个子瓦片的 .content 可能包含真实的特征要素(feature)，也可能是一个瓦片集。**

**第1：**

所谓 “循环遍历瓦片集中的每一个特征要素”，就是从根瓦片开始遍历，通过判断子瓦片是否有 .innerContents 属性来判断其是否仍然是一个瓦片集。

若子瓦片仍然是瓦片集，则深入其内部，继续循环遍历特征要素。

**第2：**

所谓“让所有的特征要素都执行某个函数”，就是在循环遍历的过程中，将需要执行的函数通过参数形式传递进去。

<br>

**代码如下：**

```
type FeatureCallBack = (feature: Cesium3DTileFeature) => void
const myFun: FeatureCallBack = (feature) => {
    ...
}

const processContentFeature = (content: Cesium3DTileContent, callback: FeatureCallBack) => {
    const length = content.featuresLength
    for (let i = 0; i < length; i++) {
        const feature = content.getFeature(i)
        callback(feature)
    }
}

const processTileFeature = (content: Cesium3DTileContent, callback: FeatureCallBack) => {
    const innerContents = content.innerContents
    if (defined(innerContents)) {
        innerContents.forEach(item => processTileFeature(item, callback)) //若为瓦片集，则让其继续循环遍历直至最深处
    } else {
        processContentFeature(content, callback) //若为普通瓦片内容，则去遍历其内部的特征表
    }
}

const tileset = new Cesium3DTileset({
    url: IonResource.fromAssetId(8564)
})
const handleTileLoad = (tile: Cesium3DTile) =>{
    processTileFeature(tile.content, myFun) //从根瓦片开始遍历
}
tileset.tileLoad.addEventListener(handleTileLoad)
```



<br>









