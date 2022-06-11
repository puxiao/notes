# Swiper点击事件避坑指南

最近在工作中需要使用 Swiper，在列表项点击事件中遇到了一些坑，特意记录一下。

> **Swiper官网：** https://www.swiper.com.cn/



<br>

如果你不想听我具体都遇到了哪些坑，你可以跳过中间部分，直接看本文结尾处的正确示例代码。



<br>

**开始讲述遇坑之路**

先列一下我原本的代码片段：

```
const maxShowCount = 4 //最多可同时显示 4 个
const needLoop = listData.length > maxShowCount ? true : false //根据 listData 的长度来计算是否需要无缝循环

const swiper = new Swiper(".swiper-container", {
    direction: 'vertical',
    slidesPerView: maxShowCount,
    loop: needLoop,
    autoplay: {
        delay: 8000,
        disableOnInteraction: false,
    }
})

//下面是 DOM 代码
<div className="swiper-container">
    <div className="swiper-wrapper">
        {
            listData.map((item, index) => {
                return (
                    <div className="swiper-slide" key={`item${index}`} onClick={()=>{ ... }} >
                        {
                            //此处省略具体的内容
                        }
                    </div>
                )
            })
        }
    </div>
</div>
```

上面代码中，我做了以下设定：

1. 列表中最多同时显示 4 个
2. 假设列表项总数超过 4 个这设置 swiper 的 loop 属性为 true
3. 我给 `<div className="swiper-slide">` 添加了 onClick 事件

当列表项总数超过 4 个后，.loop 为 true，开始无缝循环，此时 swiper 会自动 “复制” 出若干个列表项，以实现无缝滚动。

原本以为这样写没有问题，结果实际运行，就遇到坑了。

**第1个坑：假设 .loop 为 true，swiper 自动“复制”出来的列表项不会触发 onClick 事件**

经过查询得知 Swiper 复制出来的列表项仅仅包含 DOM 具体的 DOM 内容，但是不会包含 onClick 这些添加的事件。

官方推荐的解决方案是：请在 Swiper 初始化配置项中添加 列表项的 click 事件处理。

于是，我修改 Swiper 配置项，在 on 中添加 click 事件相关代码：

```
const swiper = new Swiper(".swiper-container", {
    direction: 'vertical',
    slidesPerView: maxShowCount,
    loop: needLoop,
    autoplay: {
        delay: 8000,
        disableOnInteraction: false,
    },
    on:{
        click: function(){
           //???
        }
    }
})
```

接下来就是具体编写 click 处理函数，结果...

**第2个坑：Swiper 官方文档对 click 事件处理函数的错误描述**

官方文档中，对于 click 事件处理的介绍页：https://www.swiper.com.cn/api/event/225.html

```
click(swiper,event)
回调函数，当你点击或轻触Swiper 后执行，相当于tap。
接受swiper实例和touchend事件作为参数。
Swiper5版本之前会有300ms延迟。
...
```

假设只是单纯得看这个文档，你一定以为你的代码应该这样写：

```
const swiper = new Swiper(".swiper-container", {
    ...
    on:{
        click: function(swiper,event){
           //???
        }
    }
})
```

可是，鼠标点击事件只会有一个 event 参数，并不会有 swiper 这个参数，实在想不明白为什么官方文档中函数第一个参数是 swiper。

> 在文档这个页面中，用户对于这篇文档介绍的帮助投票，结果是：给力 121 票，不给力 287 票
>
> 看来大家都觉得这篇文档写的有问题。

如果代码写成：click: function(event) { ... }，那么问题来了，event 只能表示鼠标点击的 DOM 对象，假设 列表项中的内容是由很多不同类型的 DOM 对象组成，那究竟该怎么获取当前点击的列表项索引值呢？

查阅官方文档得知，**在 click: function(event) { ... } 函数内部 this 指向的就是 swiper 本身。**

于是，将代码修改成下面的：

```
const swiper = new Swiper(".swiper-container", {
    ...
    on:{
        click: function(){
           console.log(this.clickedIndex) //希望输出点击项对应的索引值
        }
    }
})
```

 **第3个坑：在 .loop 为 true 的情况下 this.clickedIndex 无法正确获取被点击的列表项的索引值**

原因很简单，假设每一次最多显示 4 个列表项，而你一共有 7 个列表项数据，当 .loop 设置为 true 后 swiper 为了实现 “无缝滚动”，会额外复制出来若干个 列表项 混入其中，这样导致 this.clickedIndex 得到的值不一定是 0 - 6，而很有可能你点击的是被复制出来的列表项，结果该值可能是 8、9 或 10 等等。

结论：假设 loop 为 true 时无法通过 clickedIndex 区分出正确的被点击项的索引值。

相反，当 loop 为 false 时 clickedIndex 非常准确，可以区分得到正确的索引值。

> 这个结论在后面会非常有用。

那么如何得到被点击项的索引值呢？其实也很简单，Swiper 在赋值列表项时会额外给被复制的项添加一个 自定义属性 `data-swiper-slide-index`，同时我们知道 this.clickedSlide 可以得到被点击的列表项，于是代码可以修改成：

```
const swiper = new Swiper(".swiper-container", {
    ...
    on:{
        click: function(){
           const index = this.clickedSlide.attributes['data-swiper-slide-index'].value
           console.log(index) //这一次可以正确得到被点击的列表项索引
        }
    }
})
```

到此，终于我们可以每一次都正确得到 被点击项的索引值了。

结果实际测试，又遇到了另外一个之前被忽略的事情。

**第4个坑：你还得考虑假设 loop 不为 true 时的情况**

代码改动如下：

```
const needLoop = listData.length > maxShowCount ? true : false

const swiper = new Swiper(".swiper-container", {
    ...
    loop: needLoop,
    on:{
        click: function(){
            let index = null
            if(needLoop){
                //当 loop 为 ture 时
                index = this.clickedSlide.attributes['data-swiper-slide-index'].value
            }else{
                //当 loop 为 false 时
                index = this.clickedIndex
            }
            if(index === null || index === undefined) return
            //此时我们已获取到了 index，可以编写 列表项点击的处理代码了
            console.log(index)
            ...
        }
    }
})
```

至此，终于搞定。



<br>

#### Swiper列表项点击完整的示例代码：

```
const maxShowCount = 4
const needLoop = listData.length > maxShowCount ? true : false

const swiper = new Swiper(".swiper-container", {
    ...
    slidesPerView: maxShowCount,
    loop: needLoop,
    on:{
        click: function(){
            let index = null
            if(needLoop){
                //当 loop 为 ture 时
                index = this.clickedSlide.attributes['data-swiper-slide-index'].value
            }else{
                //当 loop 为 false 时
                index = this.clickedIndex
            }
            if(index === null || index === undefined) return
            //此时我们已获取到了 index，可以编写 列表项点击的处理代码了
            console.log(index)
            ...
        }
    }
})

//

<div className="swiper-container">
    <div className="swiper-wrapper">
        {
            listData.map((item, index) => {
                return (
                    <div className="swiper-slide" key={`item${index}`} >
                        {
                            //此处省略具体的内容
                        }
                    </div>
                )
            })
        }
    </div>
</div>
```



___



<br>

以下内容更新于 2022.06.11

#### 第5个坑：appendSlide()、removeSlide()、prependSlide()、removeSlide()、removeAllSlides() 这些函数无法在 React/Vue/Svelte/Angular 框架下使用

官方文档给出的解释原文：

```
Only for Core version (in React, Svelte, Vue & Angular it should be done by modifying slides array/data/source)
```

https://swiperjs.com/swiper-api#method-swiper-virtual-removeSlide



<br>

Swiper 官方认为在 React/Vue/... 这些框架中，应该通过修改源数据的形式来更新(添加或删除) slide。
