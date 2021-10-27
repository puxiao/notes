# dxf-parser：网页渲染CAD文件的解决方案

最近遇到了一个需求：在网页中渲染 CAD 文件内容。

经过一番查找，目前已知的 2 种解决方案为：

1. dxf-parser + three-dxf

   https://github.com/gdsestimating/dxf-parser

   https://github.com/gdsestimating/three-dxf

2. dxf-viewer

   https://github.com/vagran/dxf-viewer


<br>

请注意：

1. 在 dxf-viewer 内部也使用到了 dxf-parser
2. 无论是 three-dxf 还是 dxf-viewer，其内部都是通过 three.js 渲染出 3D 内容的



<br>

**整个网页渲染CAD文件的大体步骤为：**

1. 通过 axios 加载 .dxf 文件
2. 通过 dxf-parser 解析文件内容，并转化成 JS 数据对象
3. 根据得到的 JS 数据对象内容，再通过 three-dxf 或 dxf-viewer 使用 Three.js 将其渲染成相应的 3D 对象
4. 最终，在网页中呈现出 CAD 文件内容 

<br>

下面展开详细讲解一下。



<br>

#### 为什么是 dxf 格式文件？

在 CAD 软件中，可以将文件导出多种格式，例如最常见的 .dwg。但是 .dwg 格式为一种封闭式的文件格式，所以外部不能够准确读取其文件的内部数据。

而 .dxf 格式为 CAD 文件的 “过渡” 文件格式，该格式结构明确且容易被读取。

> 你甚至可以使用记事本打开 .dxf 文件查看其内容

<br>

所以结论就是：对于 CAD 文件而言 只有 `.dxf` 格式的文件才可以被 JS 正确读取。

通常情况下 .dxf 文件内容为：

```
  0
SECTION
  2
HEADER
  9
$ACADVER
  1
AC1021
  9
$ACADMAINTVER
 70
    25
  9
$DWGCODEPAGE
  3
ANSI_936
  9
$LASTSAVEDBY
  1
Administrator
  9
$INSBASE
 10
0.0
 20
0.0
 30
0.0
  9
$EXTMIN
 10
38514983.74723189
 20
3970870.415211201
...
```



<br>

#### dxf-parser简介与用法

**dxf-parser简介**

https://github.com/gdsestimating/dxf-parser

顾名思义，就是读取 .dxf 格式的文件内容，并将文件内容转换成 JS 数据对象。



<br>

**dxf-parser用法**

第1步：安装

```
yarn add dxf-parser
```

第2步：引入

```
//@ts-ignore
import DxfParser from 'dxf-parser'
```

> 由于 dxf-parser 目前并未包含类型声明文件，所以假设你项目使用的是 TypeScript，则需要添加 `//@ts-ignore` 来忽略 TS 的检查

第3步：使用

```
//@ts-ignore
import DxfParser from 'dxf-parser'

...

const promise = axios.get('./dxf/demo.dxf') //使用 axios 加载 .dxf 文件
promise.then(response => {
  const fileText = response.data as string //获取 .dxf 文件字面内容
  const parser = new DxfParser() //创建一个 DxfParer 实例
  try {
    const dxf = parser.parseSync(fileText) //尝试转化
    console.log(dxf) //转化成功，得到了转化后的对象 dxf
  } catch (error) {
    console.log(error) //转化失败
  }
})
promise.catch(error => {
  console.log(error)
})
```

<br>

上面示例就是加载 .dxf 文件，并通过 dxf-parser 解析得到其数据。

此时仅仅有了 dxf 数据，我们还需要通过其他 NPM 包来将其正确渲染成 3D 内容。

> 其他 NPM 包是指：three-dxf 或 dxf-viewer



<br>

#### 第一种：three-dxf

https://github.com/gdsestimating/three-dxf

这是 dxf-parser 官方提及到的一个包，其原理就是根据解析到的 dxf 文件内容，逐一将其 CAD 图元使用 Three.js 渲染成相应的 3D 对象。

用法也非常简单：

1. 在网页中，首先创建一个用于承载 canvas 的 div

2. 由于 CAD 文件中可能存在 文字，所以还需要使用 Three.js 提供的 FontLoader 来加载字体文件

   > 在 Three.js 中的字体并非系统字体，而是需要通过 3D 软件将字体转换成 .json 形式的 “字体形态文件”
   >
   > three-dxf 为我们提供了一个名为 `helvetiker_regular.typeface.json` 的字体文件

3. 最后，将 dxf、div、宽、高、字体 作为参数创建一个 Viewer 实例，接下来 three-dxf 就会渲染出 .dxf 文件内容

<br>

简单的示例代码：

```
const parser = new DxfParser()
const dxf = parser.parseSync(fileText)
const cadViewDiv = document.getElementById('cad-view')
const fontLoader = new FontLoader()
fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
    //创建 Viewer 实例，并将 dxf、div、width、height、font 作为参数传入
    const cadCanvas = new Viewer(dxf, cadViewDiv, 800, 600, font)
    console.log(cadCanvas)
})
```



<br>

**three-dxf存在的问题：**

由于 three-dxf 内部代码使用的是比较旧的 Three.js 版本，所以在实际的使用中会存在一些 Three.js 版本不兼容问题。

> 例如 TextGeometry 这个类在比较新的版本中，文件引入位置都发生了变化。

假设我们现在使用比较新的 Three.js 版本，那么我们需要手工修改一些代码：

*/node_modules/three-dxf/src/index.js*

```diff
+ import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

// line: 570
- geometry = new THREE.TextGeometry(entity.text, { font: font, height: 0, size: entity.textHeight || 12 });

+ geometry = new TextGeometry(entity.text, { font: font, height: 0, size: entity.textHeight || 12 });
```

同时，在引入 Viewer 类时，也需要做适当的修改：

```diff
//@ts-ignore
- import { Viewer } from 'three-dxf'
+ import { Viewer } from 'three-dxf/src/index'
```



<br>

**完整的示例代码：**

该代码基于 React + TypeScript + Vite

```
import React, { useEffect } from 'react';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import axios from 'axios';

//@ts-ignore
import DxfParser from 'dxf-parser'

//@ts-ignore
import { Viewer } from 'three-dxf/src/index'

import './App.css';

function App() {

  useEffect(() => {

    const promise = axios.get('./dxf/demo.dxf')
    promise.then(response => {
      console.log('get file text')
      const fileText = response.data as string
      const parser = new DxfParser()
      try {
        const dxf = parser.parseSync(fileText)
        console.log(dxf)

        const cadViewDiv = document.getElementById('cad-view')
        const fontLoader = new FontLoader()
        fontLoader.load('./fonts/helvetiker_regular.typeface.json', (font) => {
          const cadCanvas = new Viewer(dxf, cadViewDiv, 800, 600, font)
          console.log(cadCanvas)
        })

      } catch (error) {
        console.log(error)
      }
    })
    promise.catch(error => {
      console.log(error)
    })

  }, [])

  return (
    <div id='cad-view'></div>
  );
}

export default App;
```



<br>

**为什么使用了 vite ？**

three-dxf 使用到了 `@dxfom/mtext`，而 `@dxfom/mtext` 在 webpack4 下是无法通过正常编译的。

我们知道 create-react-app 目前创建的项目是基于 webpack4，在编译时我们会收到以下报错信息：

```
./node_modules/@dxfom/mtext/index.mjs 8:14
Module parse failed: Unexpected token (8:14)
File was processed with these loaders:
 * ./node_modules/react-scripts/node_modules/babel-loader/lib/index.js  
You may need an additional loader to handle the result of these loaders.
```

基于这个原因，所以在上面 完整示例中才强调是基于 react + vite 这种方式创建编译项目。



<br>

#### 第二种：dxf-viewer

前面提到的 three-dxf 或多或少存在一些问题，于是有人基于 dxf-parser 重新编写了一套渲染代码：dxf-viewer。

<br>

**关于 dxf-viewer 的特别介绍：**

dxf-viewer 也是基于 dxf-parser，但是作者本身并不是通过 import 引入使用 dxf-parser 的，而是靠自己魔改，优化了一些 dxf-parser 细节。

关于具体的修改，可查阅：https://github.com/vagran/dxf-viewer/tree/master/src/parser



<br>

**dxf-viewer的用法：**

具体用法可参考其官网文档：https://github.com/vagran/dxf-viewer

其中官方提供了一个使用示例：https://github.com/vagran/dxf-viewer-example-src



<br>

总体来说，dxf-viewer 在可渲染的 CAD 图元类型、渲染性能、二次开发的灵活度方面要优于 three-dxf。

> 我在试验的时候发现有些 .dxf 文件无法被 three-dxf 正确渲染，但是 dxf-viewer 却可以渲染。



<br>

#### 关于CAD图元种类的补充说明

实际上 CAD 软件本身可以创建的图元种类非常多，但是对于 dxf-parser 而言可识别并解析的图元种类是有限的。

按照官网文档说明，支持的图元有：

- Header
- Most 2D entities
- Layers
- LType table
- Block table and inserts
- VPort table
- Text and some MTEXT
- Some XData

目前不支持的图元有：

- 3DSolids
- All types of Leaders
- other less common objects and entities

如果一些 CAD 图元本身就无法正常被 dxf-parser 解析，那自然也不会被最终渲染到网页中。



<br>

**结论：**

1. dxf-parser 支持 CAD 中绝大多数的图元，例如常见的 线条、文字、图层等
2. 但并不是所有的 CAD 图元都会被 dxf-parser 支持，所以目前来说 “只能将常见的 CAD 图元内容渲染到网页中”。



<br>

以上就是基于 dxf-parser 将 CAD 文件渲染到网页中的解决方案全部内容。

