# Web Components学习笔记



<br>

## Web Components 简介

首先，人如其名，web components 可以翻译为 “**网页原生组件**”，它是一种 “**新的**” 被各大浏览器支持的一种 HTML 标准。



<br>

为什么 “新的” 要加引号？

答：因为这套标准技术实际上很早就存在了，例如当我们在 html 中添加一个视频标签 `<video>`，那么网页实际运行中会出现一个视频播放器，而视频播放器中有 N 多个并非我们添加的元素，例如 播放暂停按钮、进度条 等。这些元素实际上共同构成了 `<video>` 组件。



<br>

只不过 `<video>` 组件(元素)是由 html5 为我们内置提供的，而现在，通过 web components 标准，我们可以自己不同的功能需求，**像编写 React 类组件那样来编写自己的网页原生组件**。



<br>

为什么没有说像 Vue 组件 ？

答：Vue2 的组件更像是 html 代码片段，而 web components 代码是一个类组件。



<br>

为什么没有说像 React hooks 组件？

答：web components 代码表现形式为 JS 中的一个类，不像 hooks 组件那样是一个函数。



<br>

Web Components 学习过程并不复杂，通常半天时间足够就学会了，下面开始。



<br>

**Web Components 适用场景：**

如果从开发组件的便捷度来讲，我个人觉得，目前 Web Components 也就是达到了 React 类组件的 60% 功能。

所以 Web Components 目前根本无法代替 React/Vue 。

但是以下 2 个场景，挺适合 Web Components 的。

* 场景1：对老的原生 HTML 项目的改造。

  一些老的原生 html 项目如果想整体改造成 React/Vue 成本或许很大，但是局部地方可以改造成 Web Components，即方便又不至于成本很大，是个不错的方案。

* 场景2：编写一个同时可以用在 原生 HTML、React 和 Vue 中的组件

  React 和 Vue 目前都支持 Web Components，所以 Web Components 确实可以做到一套组件代码同时运行在不同前端框架中。

  > 由于 Web Components 本质上就是原生 HTML，那么理论上除 React/Vue 以外其他任何前端框架也都是会支持。



<br>

**基于 Web Components 的第三方组件库：Quark**

目前比较出名的是 哈啰 公司开源的 `Quark` 组件库。

Quark 组件库官网：https://quark-design.hellobike.com/



<br>

> 以下为 Quark 的官方介绍：
>
> Quark 是一款基于 Web Components 的跨框架 UI 组件库。 它可以同时在任意框架或无框架中使用。



<br>

我使用过 Quark 组件，实话实说，Quark 组件在某些功能细节方面比不了 Antd。

我个人觉得 Quark 组件也就达到了 Antd 的 70%，但这已经很了不得了。



<br>

接下来开始学习 Web Components，大体上我们将分成 2 个部分来讲解：

* Web Components 的 3 个核心项
* Web Components 组件的 4 个生命周期函数



<br>

## Web Components 的 3 个核心项



<br>

**Web Components 由以下  3 个核心项构成：**

* Custom elements(自定义元素)
* Shadow DOM(影子DOM)
* HTML templates(HTML模板)



<br>

以上 3 个核心项和 React 类组件都是可以一一对应的。



<br>

#### 第1项：Custom elements(自定义元素)，对应 React 类组件中的 `React.Component`

假定我们想要创建一个名为 `ColorButton` 的组件，那么：

如果是 React 类组件，代码套路为：

```
//color-button.js

class ColorButton extendS React.Component{
    ...
}
export default ColorButton
```



<br>

而对应 Web Components，则代码套路为：

```
//color-button.js

class ColorButton extendS HTMLElement{
    ...
}
customElements.define('color-button', ColorButton)
```



<br>

代码对比：

1. 它们都是由 class 定义的类，Web Components 继承于 HTMLElement
2. 最终导出该组件的方式不同，Web Components 是通过 `customElement` 的 `.define()` 函数导出



<br>

**customElement ?**

上述代码中的 `customElement` 实际上是 `window.customElements`。

customElement 实际上是 window 上一个默认存在的只读属性，该属性实际上是对 `CustomElementRegistry` 的引用。

关于 CustomElementRegistry 的详细介绍，请查阅：

https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry



<br>

**.define('color-button', ColorButton) ?**

该方法的第 1 个参数为自定义组件的正式名称，名称规范为：

1. 不允许使用单个单词，例如 `colorbutton` 是不被允许的
2. 每个单词都是全小写，驼峰命名 的方式也是不被允许的
3. 多个单词之间使用 `-`连接，例如本示例中的 `color-button`

最终，将来网页上使用该组件时：

```
<color-button></color-button>
```



<br>

#### 第2项：Shadow DOM(影子DOM)，对应 React 类组件中 return 最外层的那个 DOM 元素

额~ 实际上这只是为了方便理解 “勉强” 攀扯上的对应关系。



<br>

**为什么把 shadow 翻译为 影子？**

对于前端开发人员而言，shadow 更多想到的是 CSS 中的阴影，但是在此处我们应将 shadow 翻译为 影子。

此处的 影子 含义和张艺谋的电影《影》是相同即，即 “隐藏在背后的那个人”。

`Shadow DOM` 含义就是：**隐藏在自定义组件中的那个 DOM 根节点**。



<br>

因此 Shadow DOM 确实可以勉强对应 React 类组件中 return 最外层的那个 DOM 元素。



<br>

需要强调的是：**每一个自定义组件的 Shadow DOM 都是一个与主文档 document 完全独立的 DOM**。

这种独立体现在：相互不干扰的 CSS 样式

> 关于如何在自定义组件中引入和添加 CSS 样式，我们会在稍后的示例中讲解。



<br>

**给组件附加一个 Shadow Dom**

每一个 Web Components 组件的构造函数中，我们都需要 附加(attach) 上它的 影子 DOM。

```
class ColorButton extendS HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
    }
}
customElements.define('color-button', ColorButton)
```



<br>

**.attachShadow()的几个知识点：**

* .attachShdow() 方法用于附加一个 影子DOM 到当前组件中
* 在该组件内部可以通过 this.shadowRoot 找到刚刚添加的影子 DOM
* 但每一个 Web Components 中永远只会存在一个影子 DOM
* 这就意味着即使你调用多次 .attachShadow() 方法，那么永远只会是最后一次那个生效



<br>

**.attachShadow({mode: 'open'}) 参数说明：**

在上面我们已经讲过，每一个 Web Components 内部的影子 DOM 都是与主文档 document 相互独立的。

而上面参数 `mode` 只有 2 个可选项：

* "open"：允许外部的 JS 可以访问该 影子DOM的内元素，当然也包括可以修改元素
* "closed"：禁止外部的 JS 访问该 影子DOM 的内部元素，当然你也无法修改，例如 `<video>` 就不允许外部 JS 访问其内部元素



<br>

但是请记住，无论自定义组件怎么设置 mode 的值，自定义组件内部是永远可以访问主 DOM 文档的。

> 主 DOM 文档 是指：document.body



<br>

**this.shadowRoot：该组件对应的影子DOM根节点**

当我们在组件内部执行过 `this.attachShadow({mode: 'open'})` 后，我们就可以通过 `this.shadowRoot` 获取到本组件对应的影子DOM 的根节点。

这个影子DOM根节点拥有普通 DOM 节点的各种属性和方法，例如向其添加一个别的 DOM 元素：

```
const container = document.createElement('div')
container.setAttribute('class', 'color-button')
this.shadowRoot.appendChild(container)
```



<br>

同时，shadowRoot 也拥有一些自己特有的属性和方法。

具体的可查阅：https://developer.mozilla.org/zh-CN/docs/Web/API/ShadowRoot



<br>

#### 编写一个简单的例子

就目前我们已学习到的知识，已经足够可以去编写一个简单示例了。

示例文件目录结构如下：

* /index.html
* /color-button/index.js
* /color-button/index.css



<br>

**自定义组件 JS 代码：/color-button/index.js**

```
class ColorButton extends HTMLElement {
    constructor(){
        super()

        this.attachShadow({mode: 'open'})

        const link =document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', './color-button/index.css')
        this.shadowRoot.appendChild(link)

        const container = document.createElement('div')
        container.setAttribute('class', 'color-button')

        const circle = document.createElement('span')
        circle.setAttribute('class', 'circle')
        circle.style.backgroundColor = this.getAttribute('color') || '#333'
        container.appendChild(circle)

        const label = document.createElement('span')
        label.setAttribute('class', 'label')
        label.innerText = this.getAttribute('label') || ''
        container.appendChild(label)

        this.shadowRoot.appendChild(container)

    }
}

customElements.define('color-button', ColorButton)
```



<br>

在上面的代码中，我们创建添加一个 `<link>` 标签，将当前组件所需要的 CSS 样式引入进来。

这里补充 2 点。

**补充1：样式文件路径**

引入 .css 文件的相对路径并不是当前组件 index.js 相对路径，而是未来使用该组件的 index.html 的相对路径。

如果你写的组件是给其他人用的，那么你可以不使用 `<link>`，改为使用内置 CSS 样式标签 `<style>`。



<br>

**补充2：CSS资源请求次数**

你可能会担心如果创建多份该组件，那么每一个组件内部都有一个 `<link>`，那是不是浏览器会需要请求多次 css 样式文件？

无须担心，经过实际尝试，无论创建多少个该组件实例，始终只会请求一次该组件对应的 CSS 资源文件。



<br>

**自定义组件 CSS 代码：/color-button/index.css**

```
.color-button {

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 5px;

    width: 100px;
    height: 50;
    border: 1px solid #666;
    border-radius: 3px;

    cursor: pointer;
}

.color-button .circle {
    flex-grow: 0;

    display: inline-block;
    
    width: 18px;
    height: 18px;

    margin-right: 5px;
    
    border-radius: 50%;
}

.color-button .label {
    flex-grow: 1;

    display: inline-block;

    font-size: 16px;
    color: #333;

    overflow: hidden;
    text-overflow: ellipsis;

    -webkit-user-select: none;
    user-select: none;
}
```



<br>

**引入并使用自定义组件：/index.html**

```
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components Sample</title>
    <script defer src="./color-button/index.js"></script>
</head>

<body>
    <color-button color="red" label="Red"></color-button>
    <color-button color="yellow" label="Yellow"></color-button>
    <color-button color="green" label="Green"></color-button>
    <color-button color="#336699" label="#336699"></color-button>
</body>

</html>
```



<br>

**引入自定义组件：**

```
<script defer src="./color-button/index.js"></script>
```

这里有一个重要提示：**一定要添加 `defer` 标记**，以保证该 JS 是在网页整体解析完成后才去执行该的。

如果不加 `defer` 标记，则无法使用自定义组件。



<br>

**使用自定义组件：**

```
<color-button color="red" label="Red"></color-button>
<color-button color="yellow" label="Yellow"></color-button>
...
```

这里就补充一点：自定义组件一定要是成对闭合的标签 `<color-button></<color-button>`。

也就是说，上面代码不可以改成下面：

```
<color-button color="red" label="Red" />
<color-button color="yellow" label="Yellow" />
...
```

> 在 react 中我们可以使用这种形式，但是在原生网页中是不行的

上面那样的写法，最终会被网页解析为：

```
<color-button color="red" label="Red">
    <color-button color="yellow" label="Yellow">
        ...
    </color-button>
</color-button>
```



<br>

好了，到目前位置我们已经编写出了一个简单的 Web Components 自定义组件。

在上面的组件代码中，我们创建的每一个元素，都是通过 JS 来创建的，当组件比较复杂时，这种纯 JS 创建方式就显得麻烦了。

> 主要是代码看着比较多。



<br>

**补充：添加定义自定义组件之前先检查是否有重名**

上面的示例中我们都是通过 `customElements.define('color-button', ColorButton)` 将 `color-button` 添加定义到网页中的。

但是假定网页本身已引入了其他人写的自定义 web components 组件库，并且你不清楚自己的组件是否跟别人重名，换句话说就是同名组件已经被定义添加过了。

那么为了严谨，我们可以通过 `customElements.whenDefined()` 来提前检查一下。

`.whenDefined()` 本身是一个 Promise 函数，具体代码套路如下：

```
customElements.whenDefined('class-container').then(() => {
    customElements.define('class-container', ClassContainer)
}).catch((err) => {
    console.log(err)
})
```

> * 如果名为 `class-container` 的组件已经被定义过了，则会进入 `catch( (err)=>{ ... } )`
> * 否则就会正常执行 `.then(() =>{ ... })`



<br>

我们继续往下学习。



<br>

#### 第3项：HTML templates(HTML模板)：对应 React 类组件中的 jsx DOM 结构

为了简化 JS 创建自定义组件的过程，HTML 模板就应运而生。

对应的是 2 个标签：

* `<template>`：模板根标签
* `<slot>`：模板中的插槽标签



<br>

模板和插槽 这2个词的概念无需解释，会 React/Vue 的人都知道啥是。



<br>

但是这里强调的是：**目前 web components 的 HTML templates 还没发展到像 React/Vue 那样可以直接应用到组件代码中的。**

**你必须把 HTML模板代码 提前写到要应用该组件的 HTML 中。**



<br>

当然，你可以使用 JS 的方式向 主文档(body) 添加 `<template>` 内容。

```
const myTemplate = document.createElement('template')
myTemplate.innerHTML = `
<span>hello</span>
`
document.body.appendChild(myTemplate)
```



<br>

**最关键的是 `<template>` 标签内并不支持 动态变量，`<template>`只适用于那些固定不变的 DOM 结构。**



<br>

**编写一个 `<template>` 示例**

之前我们编写的 `color-button` 组件不适用于模板标签，但我们还用它举例。

```
<body>
    <template id="color-button-template">
        <link rel="stylesheet" href="./color-button/index.css" />
        <div class="color-button">
            <span class="circle"></span>
            <span class="label"></span>
        </div>
    </template>
    
    <color-button color="red" slot="Red"></color-button>
</body>
```

> 请注意，我们给该模板标签添加了一个 id，其值为 "color-button-template"



<br>

**自定义组件内使用模板内容**

```
class ColorButton extends HTMLElement {
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        const template = document.querySelector('#color-button-template')
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}
customElements.define('color-button', ColorButton)
```



<br>

**代码解释：**

* 我们通过 const template = document.querySelector('#color-button-template') 找到 `<template>` 元素

* 而查找到的 template 实际类型为 HTMLTemplateElement，该类型继承于 HTMLElement，只不过它比 HTMLElement 多了一个 `.content` 的属性

* 该 `.content` 属性对应的是 `<template>` 中包含的子项的 根 DOM 节点

  如果从网页中审查元素，该 根 DOM 节点名为 `#document-fragment`，自定义组件对应的为 `#shadow-root`。

* 最终，我们 `this.shadowRoot.appendChild(template.content.cloneNode(true))`，将全新复制的一份 模板内容 添加到当前组件中。



<br>

**？？？问题来了**

那我们原本 `color-button` 组件中使用的属性变量值怎么传递到 `template` 中？

答：没有办法，你只能在组件内部通过 JS 获取对应元素，再针对性修改其属性或值(innerText)。



<br>

**不用怀疑，之前都说过了，`<template>` 只适用于那些固定不变的 DOM 模板结构。**

**但是，在 `<template>` 内部可以通过添加  插槽`<slot>` 标签来实现一些动态占位和替换。**



<br>

**注意是：占位和替换！**



<br>

**插槽标签(`<slot>`)简单示例**

```
<body>
    <template id="color-button-template">
        <link rel="stylesheet" href="./color-button/index.css" />
        <div class="color-button">
            <slot name="label">null</slot>
        </div>
    </template>

    <color-button color="red">
        <span slot="label" class="label">Red</span>
    </color-button>
</body>
```



<br>

**代码解读：**

* 在模板中，我们通过添加 `<slot name="label">null</slot>`，创建了一个 插槽，它的占位内容为字符串 "null"
* 在组件使用中，我们通过向组件内部增加 `<span slot="label" class="label">Red</span>`，将实际的元素传入进去
* 上面 2 者中通过 slot 对应的名字 "label" 进行匹配，实现占位和替换



<br>

**小总结：**

* 在自定义类组件，通过不断执行 `this.shadowRoot.appendChild(xxxx)` 这种形式创建的组件，虽然 JS 代码多，但是灵活。
* 而 模板标签 + 插槽标签，适用于那些 DOM 内容变化不多的场景。 
* **当然，2 者是可以结合使用的**



<br>

## Web Components 组件的 4 个生命周期函数



<br>

这里实际上是套用了 React/Vue 组件中的 生命周期函数 名称，**准确来说应该称呼为：生命周期回调函数**



<br>

**原生组件的 4 个生命周期函数：**

* connectedCallback：当组件第一次被添加到 DOM 文档后调用

* disconnectedCallback：当组件从 DOM 文档移除后调用

* adoptedCallback：当组件在 DOM 文档中被移动到其他 DOM 节点时调用

* attributeChangedCallback：当组件的某个属性发生改变后调用

  > 这里的属性改变 包含：新增、移除、修改属性值 这 3 种情况



<br>

**各个生命周期函数用途：**

和我们平时在开发 React/Vue 组件时，一些常规的用途几乎相同。

例如 ，当某组件从 DOM 中移除，但组件本身此时并没有销毁，那就可以在  `disconnectedCallback` 函数中添加一些销毁 或 取消侦听操作。



<br>

这里重点说一下：connectedCallback 和 attributeChangedCallback

**我们上面举得示例中，都是直接将组件 `<color-button>` 添加到 body 内，但如果是靠 JS 来动态添加和修改组件属性，那么就需要用到组件的生命周期回调函数了。**



<br>

**connectedCallback：**

**对于有些场景， JS 动态生成添加的自定义组件，在其类的构造函数中是无法通过 this.getAttribute() 获取属性值的，我们只能将这部分代码移动到 connectedCallback 回调函数中。**



<br>

**换句话说，在有些场景中，我们不再在类组件的构造函数中创建和添加 DOM 元素，而是改为在 connectedCallback() 中添加。**



<br>

**我在实际的项目中就遇到过这种情况，但不是说 100% 一定会出现这样的情况。**



<br>

> 上面给这么多文字添加了加粗，实际上就是希望你能注意到。
>
> 因为我当初遇到了，查了很久才找到这样的解决办法。



<br>

**attributeChangedCallback：**

该生命周期回调函数的用法比其他的稍微特殊一点，**因为它还需要一个配套的属性名监听函数**。

以 color-button 组件为例，我们需要监控 color 和 label 这 2 个属性，那么我们需要额外做的是：

* 在类组件中，重写它的静态方法 `observedAttributes()`
* 之后，就可以在类组件的 attributeChangedCallback 函数中正确监控这 2 个属性了



<br>

具体代码如下：

```
static get observedAttributes() {
    return ['color','label']
}

attributeChangedCallback(activeName, oldValue, newValue) {
    if(activeName === 'color'){
        ...
    }else if(activeName === 'label'){
        ...
    }
}
```



<br>

有些时候，为了避免组件初始化时的一些不必要监听，可以在 attributeChangedCallback 内部增加一些排除。

```
attributeChangedCallback(activeName, oldValue, newValue) {
    if (oldValue === null || oldValue === newValue) return
    ...
}
```



<br>

**最后，我们用 JS 演示一下如何动态添加自定义组件。**

```
<!DOCTYPE html>
<html lang="zh-CN">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Components Sample</title>
    <script defer src="./color-button/index.js"></script>
</head>

<body>
    <script>
        const arr = [
            { color: 'red', label: 'Red' },
            { color: 'yellow', label: 'Yellow' },
            { color: 'green', label: 'Green' },
            { color: '#336699', label: '#336699' }
        ]

        const mydiv = document.createElement('div')
        arr.forEach((item) => {
            const colorButton = document.createElement('color-button')
            colorButton.setAttribute('color', item.color)
            colorButton.setAttribute('label', item.label)
            mydiv.appendChild(colorButton)
        })
        
        document.body.appendChild(mydiv)

    </script>
</body>

</html>
```



<br>

**以上就是我在学习和使用 Web Components 的一些心得。**

如果想深入学习，我建议是去查看 `Quark` https://github.com/hellof2e/quark-design 组件库的源码，看一下他们是怎么使用 Web Components 开发的。
