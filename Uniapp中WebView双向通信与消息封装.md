# Uniapp中WebView双向通信与消息封装



<br>

## 场景需求



<br>

**之前使用 Vue3 开发了一个手机版网页(非 Uniapp 开发)，然后现在有新 Uniapp 项目需要通过 web-view 嵌入该手机版网页。**

**关键是这个 Uniapp 项目需要发布成不同目标平台：APP、H5、微信小程序！**



<br>

**对于这个 Uniapp 项目而言，它一套代码需要考虑：**

* 发布成 APP 时如何与 WebView 通信
* 发布成 H5 时如何与 WebView 通信
* 发布成 微信小程序 时如何与 WebView 通信



<br>

**对于这个 手机版网页，它一套代码需要考虑：**

* 父级是普通 H5 项目，通过 iframe 标签嵌入，如何与父级通信
* 父级是Uniapp 项目，通过 web-view 标签嵌入
  * 发布成 APP 时如何与 父级 通信
  * 发布成 H5 时如何与 父级 通信
  * 发布成 微信小程序 时如何与 父级 通信

也就是说：**这个 手机版网页 需要兼容上述 4  种 通信方式。**



<br>

需求就是这些了，下面说一下我最终总结出来的实现方式。



<br>

**为了方便沟通，我将这个手机版网页 称为 `H5端`，将 Uniapp 项目称为 `Uniapp端`。**

或者我会把 手机版网页成为 `子页面`，将 Uniapp 项目成为 `父级页面`。



<br>

## Uniapp端的代码逻辑



<br>

**先说遇到的坑：**

* Uniapp 官方文档非常不靠谱！！！
* 百度/谷歌搜出来的介绍 Uniapp WebView 通信的文章大多数也不靠谱！！！
* 我真的怀疑那些口口声声的教程文章，是否他们当时真的运行起来了！！！

**这些不靠谱的地方绝大多数都在于：如何在 Uniapp 中获取 `<web-view>` 对象，因为绝大多数示例代码都是在 "想象中" 运行的！！！**

因为对于不同平台 H5、App、微信小程序 等获取 `<web-view>` 的方式都不一样。

<br>

* 有些文章中提到的获取函数，实际运行根本不存在
* 有些都是靠 `setTimeout` 做延迟的方式去获取的
* 有些都是靠通过 `创建` 的方式获取的

我只能说：**文章五花八门，但自己实际尝试很多都不行！**



<br>

废话不多说，直接开始我最终是怎么实现的 。



<br>

**关键技术1：Uniapp 条件编译处理多端差异**

这里使用到的是 Uniapp 的魔法注释。

对于 `<script>` 标签内的 JS 可以通过下面的方式进行差异化编写代码：

```
// #ifdef H5
....此处的JS代码只有在编译目标为 H5 时才会生效 
// #endif

// #ifdef APP
....此处的JS代码只有在编译目标为 APP 时才会生效 
// #endif

// #ifdef MP-WEIXIN
....此处的JS代码只有在编译目标为 微信小程序 时才会生效 
// #endif
```



<br>

对于 `<template>` 中的标签组件可以通过下面的方式进行差异化编写代码：

```
<!--  #ifdef  H5 -->
<web-view ... />
<!--  #endif -->

<!--  #ifdef  APP -->
<web-view ... />
<!--  #endif -->

...
```



<br>

关于更多条件编译，可查看官方文档：https://zh.uniapp.dcloud.io/tutorial/platform.html



<br>

**关键技术2：在何时机、如何获取 web-view 对象？**

**1、在何时机？**

只有在确保 `<web-view>` 中的网页 onLoad 加载完成后 uniapp 才能获取到该 web-view 的实例对象并开始向其发送数据。

网上不少教程里都是通过：

* 设置 setTimeout 多少秒后去执行获取函数， 那这里就是靠猜测和运气，是玄学
* 通过 setInterval 每个100 毫秒不断去轮询尝试执行获取函数，直至获取成功

我认为最正确的做法是：**当子页面加载完成且一切就绪后，主动向父级页面发送一条消息，然后父级页面再去执行获取 web-view 实例对象的代码。**



<br>

> 在 uniapp 端，也就是父级页面，无论我们是否执行了获取 web-view 实例对象的代码，都不影响父级页面接收子页面发过来的消息。只要子页面发送过来消息那就证明子页面此刻一定是 `一切准备好` 的状态了。



**2、如何获取？**

对于 H5 通过下面方式添加消息侦听：

```
window.addEventListener('message', this.getH5Message)
```

消息处理函数：

```
getH5Message(event) {
    const curData = event.data.data
    ...
},
```

使用下面代码获取 web-view：

```
this.webview = window.document.getElementsByTagName("iframe")[0]
```



<br>

对于 APP 通过下面方式添加消息侦听：

```
<web-view ... @message="getAppMessage"></web-view>
```

消息处理函数：

```
getAppMessage(event) {
    //对于 APP 里的消息事件采用的是数组，我们这里只取该数组中最后一项作为最新接收事件的值
    const curData = event.detail.data[event.detail.data.length - 1]
    ...
},
```

使用下面代码获取 web-view：

```
this.webview = this.$scope.$getAppWebview().children()[0]
```



<br>

由于 微信小程序 我这边还没实际开始做，所以获取方式就不贴出来了，自己网上查吧。



<br>

**关键技术3：如何给子页面发送消息？**

通过上面步骤我们已经得到了 web-view 对象，那么发送数据就比较容易了。

向子页面发送消息的方式有很多，例如 调用子页面某个 window 下的函数，这个函数可以是 window 自带的，也可以是我们自己添加的。

但是为了统一，在我这个项目场景中我都是用 postMessage 方式来相互通信的。

且 postMessage 的数据格式为：

```
{
   type: string
   data: {
       ...
   }
}
```

> 通过 type 值来区分消息类型

特别提醒：postMessage() 只能发送字符串数据，所以在发送前需要通过 JSON.stringify() 把数据转为 JSON 字符串。



<br>

对于 H5 通过下面方式向子页面发送消息：

```
this.webview.contentWindow.postMessage(dataStr,"*")
```



<br>

对于 APP 通过下面方式向子页面发送消息：

```
this.webview.evalJS(`window.postMessage("${dataStr}", "*")`)
```



<br>

**完整的代码：**

> xxx.vue

```
<template>
    <!--  #ifdef  H5 -->
    <web-view :src="pageSrc"></web-view>
    <!--  #endif -->

    <!--  #ifdef  APP -->
    <web-view :src="pageSrc" :update-title="false" @message="getAppMessage"></web-view>
    <!--  #endif -->
</template>

<script>
export default {
    data() {
        return {
            pageSrc: 'xxx.html?parent=uniapp',
            webview: null,
        }
    },

    onLoad(option) {
        // #ifdef H5
        window.addEventListener('message', this.getH5Message)
        // #endif
    },

    methods: {

        checkWebView() {

            if (this.webview === null) {

                // #ifdef H5
                this.webview = window.document.getElementsByTagName("iframe")[0]
                // #endif

                // #ifdef APP
                this.webview = this.$scope.$getAppWebview().children()[0]
                // #endif

                if (this.webview === null) {
                    uni.showToast({
                        title: '页面挂载发生错误,请刷新重试',
                        icon: 'error'
                    })
                }

            }

        },

        handleRealMessag(curData) {
            const { type, data = {} } = curData

            //console.log('收到webview发来的消息', type, data)

            switch (type) {
                case 'subpageReady':
                    this.checkWebView()
                    break
                case 'xxx':
                    this.sendMessage({
                        type: 'xxxx',
                        ...
                    })
                    break
                default:
                    console.log(`收到未处理的信息: ${JSON.stringify(curData)}`)
                    break
            }
        },

        // #ifdef H5
        getH5Message(event) {

            if (event.data) {
                this.handleRealMessag(event.data.data)
            } else {
                console.error('从H5收到的信息缺少data值,请子项(webview)检查传值内容', event)
                return
            }

        },
        // #endif

        // #ifdef APP
        getAppMessage(event) {

            if (event.detail.data.length === 0) {
                console.error('从APP收到的信息缺少data值,请子项(webview)检查传值内容', event)
                return
            }

            const curData = event.detail.data[event.detail.data.length - 1]
            this.handleRealMessag(curData)

        },
        // #endif


        sendMessage(msg) {

            if(this.webview === null) {
                uni.showToast({
                        title: '页面挂载发生错误,请刷新重试',
                        icon: 'error'
                    })
                return
            }

            const dataStr = JSON.stringify(msg)

            // #ifdef H5
            if(this.webview.contentWindow){
                this.webview.contentWindow.postMessage(dataStr,"*")
            }
            // #endif

            // #ifdef APP
            this.webview.evalJS(`window.postMessage("${dataStr}", "*")`)
            // #endif

        },
    },
}
</script>
```

代码梳理：

* 我们通过 Uniapp 条件编译 魔法注释 分别添加了不同的 `<web-view>` 和对应的事件侦听
* 无论是 H5 还是 APP 接收到消息，拿到真正的 data 值后，都会交给 handleRealMessag() 统一处理
* 当子页面一切就绪后，子页面会向父级发送一个 type 值为 'subpageReady' 的消息
* 此时父页面开始调用执行 checkWebView() 来获取 web-view 实例对象
* 若后续父页面收到了子页面发过来的其他消息，根据 .type 值来做相应处理，通过除 .type 值以外的其他属性获取参数
* 若父页面需要向子页面发送消息，数据格式为 { type: xxx, ... }，然后通过 sendMessage() 函数向子页面发送消息



<br>

特别提醒：

上述代码中 web-view 的 src 值为 `xxx.html?parent=uniapp`，那这个 URL 参数 `parent=uniapp` 是用来干什么的？我们下面讲解 H5 端的时候会有说明。



<br>

## H5端的代码逻辑



说一个大前提：H5 端是我用 vue3 写的，也就是说想添加什么代码都是可以的。

但是如何你 Uniapp 中 web-view 嵌的是别人写的网页，且你无法修改代码，那么可能下面讲的不适合你。



<br>

**需要解决的第1个问题：如何区分当前所处的环境？**

也就是说我们需要先知道 H5 子页面 当前是运行在什么环境中的。



<br>

**区分 普通 web 环境 还是 Uniapp 环境：**

我们可以通过 URL 参数来区分当前是运行在普通 web 中还是运行在 uniapp 中。

* `xxx.html?parent=uniapp` 当前为 uniapp 环境
* URL 参数 parent 为 undefined 或者 `xxx.html?parent=web` 表示运行在普通的 web 环境中



<br>

**在 Uniapp 中又如何区分是 Uniapp H5 还是 Uniapp APP：**

```
document.addEventListener('UniAppJSBridgeReady', function () {
    uni.webView.getEnv(function (res) {

        //console.log('当前环境：' + JSON.stringify(res))

        let uniappType = 'null'
        if (res.h5) {
            uniappType = 'h5'
        } else if (res.plus) {
            uniappType = 'plus' // 'plus' 就是 APP 环境
        }
        ....

    })
})
```



<br>

**我们该如何引入 `uni.webview.x.js` ？**

对于普通的  web 项目：

* 我们是不需要引入 uni.webview.x.js
* 也不需要 document.addEventListener('UniAppJSBridgeReady' ...)



<br>

很简单，我们创建一个名为 `uniapp-head.vue` 的组件来做这件事。

**uniapp-head.vue**

```
<script setup>

const script = document.createElement('script')
script.type = 'text/javascript'
script.src = './uni.webview.1.5.6.js'
document.head.appendChild(script)

document.addEventListener('UniAppJSBridgeReady', function () {

    uni.webView.getEnv(function (res) {

        //console.log('当前环境：' + JSON.stringify(res))

        let uniappType = 'null'
        if (res.h5) {
            uniappType = 'h5'
        } else if (res.plus) {
            uniappType = 'plus'
        }

        ...

        //修改数据状态，告知 uni.webView 已准备完成

    })

})
</script>

<template>

</template>

<style scoped lang='scss'></style>
```

 代码梳理：

* 我们这个组件实际只用到了 <script> 标签
* 先向 <head> 标签追加了加载 uni.webview.x.js 的标签
* 然后添加 uni 的 UniAppJSBridgeReady 事件侦听
* 在侦听中去判断当前是 uniapp 的哪种环境



<br>

**使用 uniapp-head.vue**

我们在主页面的 .vue 中使用该组件。

```
<script setup >

import { getURLParams } from '@/utils';
import UniappHead from './uniapp-head.vue'

const urlParams = getURLParams()
const parentType = urlParams.parent

</script>

<template>
    <UniappHead v-if='parentType === "uniapp"' />
    <view>
        ...
    </view>
</template>

<style scoped lang='scss'></style>
```

代码梳理：

* getURLParams 是我编写的一个获取 url 参数的函数，得到 URL 中 parent 的值
* `<UniappHead v-if='parentType === "uniapp"' />` 这样可以确保传统  web (非 uniapp) 情况下不会去触发执行 `uniapp-head.vue` 中的 JS



<br>

**需要解决的第2个问题：什么叫 "子页面准备好了" ?**

对于传统  web 而言，核心页面的 onMounted() 函数中即表示 准备好了。

但是对于 uniapp 而言，除了核心页面的 onMounted() 还需要考虑我们 uniapp-head.vue 中添加的 `<script type="text/javascript" src="./uni.webview.1.5.6.js"></script>` 加载完成并且触发 'UniAppJSBridgeReady' 事件才算准备好了。



<br>

所以我们需要使用 pinia 定义几个数据状态：

* parentType：父级是 web 还是 uniapp

  > 通过 URL 参数 来获取

* uniappType：当前 uniapp 环境是 h5 还是 plus(App)

* pageReady：页面挂载完成

  > 页面组件的 onMounted 回调函数中我们修改 pageReady 状态值

* uniappReady：uniapp 环境完成

  > 'UniAppJSBridgeReady' 事件中我们修改 uniappType、uniappReady 状态值



pinia 全局状态代码片段：

```
handleReady() {
    //一切准备就绪，此时向父级页面发送 type 值为 "subpageReady" 的消息。
},

checkReady() {
    switch (this.parentType) {
        case 'uniapp':
            if (this.pageReady && this.uniappReady) {
                this.handleReady()
            }
            break
        case 'web':
        default:
            this.handleReady()
            break
    }
},

setParentType(type) {
    this.parentType = type
},

setUniappType(type) {
    this.uniappType = type
},

setUniappReady() {
    this.uniappReady = true
    this.checkReady()
},

setPageReady() {
    this.pageReady = true
    this.checkReady()
}
```

代码梳理：

* 无论是 setUniappReady() 还是 setPageReady() 都会去执行一次 checkReady()
* 在 checkReady() 内部回去判断当前究竟是否一切就绪了，如果是则去执行 handleReady() 函数
* 上述 handleReady() 函数中的代码暂时没写，稍后我们补上如何向父级页面发送 "子页面已准备就绪"的消息



<br>

至此，我们 H5 端的基础环境已经实现了。

那么接下来就剩下 收发 消息了。



**先说一下消息数据格式：**

由于 Uniapp 中 APP 环境下 .postMessage() 消息事件的值只能在 .data 属性上，为了区分消息类型，我们需要给 data 添加 type 属性值，即 data 的格式为 { type: xxx, ... }，而我写的子页面中负责发送消息的 EventDispatcher 中规定的消息数据格式为 { type: xxx, data: { ... } }。

这就出现了一些矛盾，需要我们在消息处理时进行二次加工处理。



<br>

**我们定义一个名为 ParentMessage 的类 来全局管理收发消息。**



<br>

首先我们需要一个 JS 的 EventDispatcher 用来 抛出/添加 监听。

> EventDispatcher.js
>
> 很多 库 都有 EventDispatcher，而我用的来自于：https://github.com/mrdoob/eventdispatcher.js/

```
class EventDispatcher {

	addEventListener( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		const listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	}

	hasEventListener( type, listener ) {

		if ( this._listeners === undefined ) return false;

		const listeners = this._listeners;

		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

	}

	removeEventListener( type, listener ) {

		if ( this._listeners === undefined ) return;

		const listeners = this._listeners;
		const listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			const index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	}

	dispatchEvent( event ) {

		if ( this._listeners === undefined ) return;

		const listeners = this._listeners;
		const listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			const array = listenerArray.slice( 0 );

			for ( let i = 0, l = array.length; i < l; i ++ ) {

				array[ i ].call( this, event );

			}

			event.target = null;

		}

	}

}


export { EventDispatcher };
```



<br>

定义我们的全局消息管理类。

**ParentMessage.ts**

> 这里直接贴出我的源码，我用的到了 typescript。

```
import { EventDispatcher } from "./ParentMessage.js";

export type ParentType = 'uniapp' | 'web'
export type UniappType = 'null' | 'h5' | 'plus'
export interface ParentMessageEvent extends Event {
    data: any
}
export interface PostMessageData {
    type: string
    [key: string]: any
}

class ParentMessage extends EventDispatcher {

    private _parentType: ParentType
    private _uniappType: UniappType

    constructor(type: ParentType = 'web') {

        super()

        this._parentType = type
        this._uniappType = 'null'

        window.addEventListener('message', this.handleMessage)

    }

    private handleMessage = (eve: MessageEvent) => {

        if (!eve.data || eve.data === '') return

        const dataObj = JSON.parse(eve.data)

        let type = 'unknown'
        if (typeof dataObj.type === 'string') {
            type = dataObj.type
        }

        const event: ParentMessageEvent = {
            type,
            data: dataObj,
            //@ts-ignore
            target: this
        }

        //@ts-ignore
        this.dispatchEvent(event)

    }

    public postMessage(message: PostMessageData) {

        switch (this._parentType) {
            case 'web':
                if (window.parent) {
                    window.parent.postMessage(message, '*')
                } else {
                    console.error(`window.parent 不存在，无法发送消息`)
                }
                break
            case 'uniapp':

                //@ts-ignore
                if (uni) {

                    //console.log(`webview(${this._uniappType})尝试向uniapp发送消息`, message)

                    switch (this._uniappType) {
                        case 'h5':
                            if (window.parent) {
                                window.parent.postMessage({
                                    type: message.type,
                                    data: {
                                        ...message,
                                        type: message.type
                                    }
                                }, '*')
                            }
                            break
                        case 'plus':
                            //@ts-ignore
                            uni.webView.postMessage({
                                data: {
                                    ...message,
                                    type: message.type
                                }
                            });
                            break
                        default:
                            break
                    }

                } else {
                    console.error('检测到uniapp环境有问题，请刷新重试')
                }
                break
        }

    }

    public get uniappType(): UniappType {
        return this._uniappType
    }

    public set uniappType(type: UniappType) {
        this._uniappType = type
    }

    public dispose() {
        window.removeEventListener('message', this.handleMessage)
    }

}

export default ParentMessage
```

> 因为 window.parent.postMessage 与 uni.webView.postMessage 参数格式要求不同，所以在 postMessage() 中针对 uniapp 进行了 消息的 "二次加工处理"。
>
> 尽管看上去消息格式 { type: xxx, data: { type: xxx, ... }} 中，同一个 type 被配置了 2 处，但是做到了消息数据格式统一，你可以根据自己实际情况来优化这块。



<br>

ParentMessage 代码梳理：

* 构造函数参数 type 接收当前是 web 项目还是 uniapp 项目
* 构造函数执行 window.addEventListener('message', this.handleMessage) 用来监听所有的 postMessage 事件(消息)
* 内部函数 handleMessage 用来处理转化消息对应的 数据值，并通过继承于 EventDispatcher 的 .dispatchEvent() 抛出该消息
* .uniappType：用于设置当前 uniapp 类型 (h5 或 plus)
* .postMessage()：用于对外 发送消息，抹平不同环境下的差异
* .dispose()：用来销毁注销 postMessage 事件侦听

这样就实现了：添加所有 postMessage 事件的监听、处理转化消息格式、抛出转化后的消息

实现了业务代码解耦。



<br>

**主页面初始化 ParentMessage**

> xxx.vue

```
<script setup lang='ts'>

onMounted(() => {

    //从 URL 参数中获取当前运行环境
    const parentType = getURLParams().parent || 'web'
    
    //初始化 parentMessage 并挂在到 window
    window.parentMessage = new ParentMessage(parentType as ParentType) 
    
    //开始添加各种 消息 处理
    window.parentMessage.addEventListener('doXXAA', (eve) => {
        console.log(eve.data)
    })
    
    window.parentMessage.addEventListener('doXXBB', (eve) => {
        ...
    })
    
    ....
    
    //修改数据状态 pageReady 的值
    ...
    
})

</script>

<template>
...
</template>

<style scoped lang='scss'>
</style>
```



<br>

**任何组件或JS 向父级发送消息**

无论任何组件 或者 JS 代码块想向父级发送消息，则都可以通过下面方式发送：

```
window.parentMessage.postMessage({
    type: 'xxxx',
    data : { ... }
})
```



<br>

**也就是说对于 任何子组件 或  JS，他们根本不知道自己发送的消息是发给谁的，谁来处理的，他们唯一知道的就是调用 window.parentMessage.postMessage() 即可。**



<br>

子页面一切准备就绪，需要向父级页面发送 "我已准备好了"，对应的函数代码：

```
handleReady() {
    //配置当前 uniappType 的值类型，若为 "null" 即表示不需要处理
    window.parentMessage.uniappType = this.uniappType
    
    //抛出一个事件，其中 type 值为 'subpageReady'，window.parentMessage 内部会将该消息发送给父级页面
    //这条消息我们仅仅有 type 值，没有携带其他参数
    window.parentMessage.postMessage({ type: 'subpageReady' })
},
```



<br>

**整体消息通信流程梳理：**

父级页面通过内部定义的 sendMessage() 向子页面发送消息，例如 { type: "doXXAA", someId: 123, ... })，会被子页面 window.parentMessage 监听到并转化为内部的事件，然后再抛出。

子页面中凡是添加过该 type 值监听的地方就能得到 eve 以及得到 evet 携带的 .data 参数。

```
//子页面中某个组件添加 doXXAA 的处理
window.parentMessage.addEventListener('doXXAA', (eve) => {
    console.log(eve.data.someId)
})
```



<br>

以上就是我的分享，本文主要讲了 2 件事：

* uniapp 如何针对不同编译目标(H5/APP) 正确获取  web-view，以及对应如何发送消息
* H5 端如何封装 收发消息
