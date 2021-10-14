# Vue 2.x 学习笔记

## 0、前言

刚转行前端时，简单学习过 Vue，之后很快就改为 React。

2 年过去了，在郑州 React 工作岗位实在是太少，我个人的感受是：

1. 郑州 90% 公司都要求会 Vue
2. 剩下的 4% 要求既会 React 又要会 Vue
3. 最后只有 1% 的公司只要求会 React 即可

目前我想找 WebGL/GIS 相关工作，没有办法只好学习一下 Vue。



<br>

我会 React、TypeScript，那么我将带着好奇和对比的心态，来学习 Vue。

鉴于目前郑州公司绝大多数都采用 Vue 2.x，Vue 3 还没普及，所以，开始吧。



<br>

## 1、Vue的基础

本文主要以 Vue 官网 https://cn.vuejs.org/ 为学习资料。

由于 Vue 官网已经讲解足够详细，所以以下只记录学习过程中的一些感受。

请注意都是我个人的感受和观点，不一定百分百正确。



<br>

#### 框架 VS 引擎(库)

以下 2 句话分别取自他们的官网：

1. Vue：渐进式 JavaScript 框架
2. React：用于构建用户界面的 JavaScript 库



<br>

**引擎(库) - React**：在 JS 的基础上，对 JS 进行一定的扩展，让 JS 非常容易操作 DOM 标签，本身偏向于 JS，因此你完全可以使用 JS 的正常语法来进行开发。

React 主要扩展的内容有：

1. 将 DOM 标签进行 JS 话，转为 jsx 标签
2. 将 DOM 标签进行 虚拟化，以便使用 JS 操作标签，和性能优化

<br>

**框架 - Vue**：在 DOM 标签的基础上，对 DOM 标签进行一定的扩展，拓展之后的 标签本身自带一些特殊属性和事件处理，本身偏向于标签，因此你需要学习并遵循它的一些自定义语法。

Vue 主要扩展的内容有：

1. 将 DOM 标签上的某些属性与数据状态中的某些变量进行双向绑定
2. 将 DOM 标签上扩展出可以直接执行 JS 的一些命令，例如 if 或 for 等
3. 将 DOM 标签进行 虚拟化，以便使用 便签控制标签，和性能优化



<br>

#### 渐进式

*Vue：渐进式 JavaScript 框架*

**什么是 “渐进式” ？**

你可以由简单到复杂，逐渐地、慢慢地去使用 Vue 提供的语法和功能。

不需要一次就弄明白全部，即可开始使用 Vue。

假设你只有 Div + Css + JS 的基础，你只需要学习 5 分钟，就可以写出一个 Vue 最简单的数据绑定示例。

> 1. 花 3 分钟看一下官方入门示例
> 2. 花 1 分钟在 .html 文件上引入 vue ，定义好数据，对某个 DOM 标签添加数据绑定。
> 3. 调试网页，查看效果

但是如果是 React，则需要你学习 3 小时，才可以写出对等的示例效果。

> 为了写出一个简单的 React 示例，你需要学习的知识点有：
>
> 1. 学习 npm
> 2. 学习 create-react-app
> 3. 学习 jsx
> 4. 学习 useState 钩子函数



<br>

当你想增加一点功能，对于 Vue 你可以再话 20 分钟时间阅读文档，然后就动手实现出来。

但如果是 React，你可能需要学习 10 小时，去搞明白 React 整个代码运行逻辑，如何在单向数据流的情况下父组件与子组件进行数据传递。



<br>

React 需要你前期花费非常大的精力去学习，然后才可以自由编写代码。并且前期学习的过程是非常痛苦的。

Vue 则不需要你花费太多的精力即可上手，开始使用，慢慢熟练后，再学习更高级的语法，所以 Vue 是 “渐进式” 的。



<br>

“渐进式” 学习 这个核心思想贯穿于 Vue 的官方文档中。



<br>

#### Vue中不要做的事情

**不要用箭头函数！！！**

> 在 React 中用惯了 箭头函数，可是在 Vue 中由于需要使用 this，所以都只能使用 function，不能使用箭头函数。



<br>

**难易使用 TypeScript**

没错，对于 Vue 2.x 而言，与 TypeScript 的结合非常别扭，所以干脆就不要使用 TypeScript 了。

Vue 3 才开始全面支持 TypeScript。



<br>

以下内容仅为我个人为了巩固复习所作的笔记，如果你需要学习建议你直接阅读官方文档教程。



<br>

#### Vue基础

官方建议初学者不应该使用 脚手架 去创建 Vue 项目，而是使用最原始的、直接引入 vue.js 的方式来进行 .html 网页文件编写。



> 以下内容是对 Vue 2.x 官方教程中 “基础” 部分的学习整理。



<br>

**引入Vue.js**

官方对外提供了 vue.js 可用地址：

1. 供开发环境使用的版本：https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js

   > 包含警告信息，便于调试

2. 供生成环境使用的版本：https://cdn.jsdelivr.net/npm/vue@2

   > 代码被压缩，不利于调试



<br>

**安装浏览器调试工具**

在 Chrome 浏览器应用商店，搜索并安装：Vue Devtools



<br>

**初始化Vue实例**

在 html 的 `<script>` 中，通过 JS 来初始化 Vue 实例。

> 无论你是将 JS 直接写在 `<script>` 中，还是通过 src 引入外部的 .js 文件。

```
var app = new Vue({ ... })
```

`{ ... }` 即初始化 Vue 实例的配置项。



<br>

> Vue实例究竟该叫做什么？
>
> 答：你可以使用 "app" 变量来对应 Vue 实例对象，也有很多人会使用 vm 来作为变量名，这里的 vm 实际上是 ViewModel 的缩写。



<br>

Vue 第一个配置项为 el，为要接管并控制的 div 的 id。

> 请注意必须是 id，不可以是 class，因为只有 id 才是唯一标识符。

假设我们已经在 html 中创建了一个 id 为 "app" 的 div，那么对应配置代码为：

```
var app = new Vue({
  el:'#app'
})
```



<br>

Vue 第二个配置项为 data，即提前定义好所有需要的变量，用于将来进行数据绑定或内部存储。

data 本身为 Object 类型，所以你可以在 data 里定义任何符合 JS 类型规范的属性(属性名和属性值)。

> 请注意，属性值中不可以包含 函数或箭头函数

> 假设属性没有初始值，那么你可以将他们的属性值设置为 null、undefined、空字符串等。

举例：

```
var app = new Vue({
  el:'#app',
  data:{
      name: 'puxiao',
      age: 35,
      man: true,
      stack: ['react', 'ts','vue'],
      other:{
          hometown: 'qiaomiao',
          mustache: true
      }
  }
})
```



<br>

我们可以把 el 和 data 作为配置项的必填项，那么把下面这些配置项看作是 可选项，即只有在我们需要的时候才有必要添加上。



<br>

Vue 第三个配置项 methods，用于定义函数(function)。

> 请注意，必须是 function，不可以是箭头函数。我们定义的函数中，this 即指 Vue 实例本身。

例如我们定义一个名为 handleClick 的函数，用于修改 name 的值：

```
var app = new Vue({
    el:'#app',
    data:{
        name: 'puxiao'
    },
    methods: {
        handleClick: function() {
            this.name = 'yang'
        }
    }
})
```

如果我们想给函数添加参数，则可修改为：

```
handleClick: function(str) {
    this.name = str
}
```

如果函数对应的是 DOM 事件处理函数，我们还希望得到 原始 DOM 事件的 event，则使用 Vue 为我们提供的特殊参数 `$event`，即：

```
handleClick: function(str, $event) {
    console.log($event)
    this.name = str
}
```

> 请记得，一定将 $event 作为最后一个参数，这样才符合 Vue 提倡的规范。



<br>

Vue 的第四个配置项为 computed，用于定义和获取 `衍生(额外计算)` 值。

> 这种操作和 React 的数据状态管理 Recoil 非常相似。

computed 中的属性值可以直接是一个有 return 的函数，此时意味着仅为 get 函数。

例如：

```
var app = new Vue({
    ...
    computed:{
      fullname: function(){
          const str = 'yang' + this.name
          return str
      }
    }
})
```

也可以是一个对象，而对象中包含 get 和 set 方法：

```
var app = new Vue({
    ...
    computed:{
      fullname: {
          get: function(){
              const str = 'yang' + this.name
              return str
          },
          set: function(str){
              this.name =  str
          }
      }
    }
})
```



<br>

Vue 第五个配置项为 watch，用于监控已在 data 中定义的某些变量的变化。

假设我们在 data 中定义了一个 name 的变量，那么可以针对 name 的值进行 监控(watch)，以便我们做一些其他操作。

函数接受 2 个可选参数：新值 和 旧值，以便我们进行相关判断和操作。

例如：

```
var app = new Vue({
    el:'#app',
    data:{
        name:'puxiao'
    },
    watch:{
        name: function(newVal,oldVal){
            console.log(newVal, oldVal)
        }
    }
})
```

请注意：如非必要，尽量不要使用 watch，更不要在 watch 中再次操作相关的值，否则容易引起 死循环。

> 这一点和 react  useState 中 不要在 setXxx( (newVal,oldVale) =>{} ) 再次修改变量值的原因是相同的。

在 wacth 的函数中，最好只做一些没有副作用的操作。



<br>

Vue 的第六个配置项，准确来说是 Vue 的生命周期对应的各个 副作用 函数，例如 创建完成的 created。

```
var app = new Vue({
    ...
    created: function(){
       console.log('app is created.')
    }
})
```

Vue 的生命周期和 React 几乎相同。

1. 创建之前：beforeCreate

2. 创建完成：created

3. 挂载之前：beforeMount

4. 挂载完成：mounted

5. 更新之前：beforeUpdate

6. 更新完成：updated

7. 重新激活：activated  (组件被 keep-alive 包括下才会存在该钩子函数)

8. 重新失活：deactivated (组件被 keep-alive 包括下才会存在该钩子函数)

   > 对于 activated 和 deactivated 这 2 个生命周期来说，在服务器端渲染是不会被调用的。

9. 卸载之前：beforeDestroy

10. 卸载完成：destroyed

11. 组件捕获错误：errorCaptured

<br>

Vue 的其他配置项，例如 components，我们暂时不做过多阐述。



<br>

**配置项总结：**

| 配置项                                  | 主要作用                        | 简单示例                                   |
| --------------------------------------- | ------------------------------- | ------------------------------------------ |
| el                                      | 通过 id 名称开始接管该 div      | el:'#app'                                  |
| data                                    | 定义该 Vue 实例的自定义数据变量 | data:{ name:'puxiao' }                     |
| methods                                 | 定义该 Vue 实例的自定义函数     | methods:{ handleClick:function(){ ... }}   |
| computed                                | 通过 get 和 set 创建 衍生值     | computed:{ fullname:function{ return ...}} |
| watch                                   | 添加对某自定义变量值改变的监控  | watch:{ name:function(new,old){ ... }}     |
| 生命周期钩子函数，例如 created、updated | 添加各个生命周期钩子(hook)函数  | created:function(){ ... }                  |
| 其他配置项，例如 components             | 添加局部组件                    | components:{ ... }                         |

> 上面表格中出现的配置项仅为 Vue 最基础，最常见的配置项，还有其他配置项，我们以后再学习



<br>

**添加Vue特殊标签语法**

`{{ }}`：用于显示引入自定义变量、或简单的 JS 运算

> 你可以简单理解成类似 JS 模板语法中的 ``${ }``

假设我们在 data 中定义了一个变量 name，则可以在 `<span>` 中引入该变量的值：

```
<span>{{ name }}</span>
```

还可以执行某些简单的 JS 运算：

```
<span>{{ name.split('').reverse().join('') }}</span>

<span>{{ name.length>0 ? name : 'null'}}</span>
```



<br>

`v-bind`：用于绑定某 DOM 原本存在的属性，可以简写为 :。

假设我们在 data 中定义了一个 boo 变量，那么可以针对 `<botton>` 标签的 disabled 属性值进行绑定：

```
<button v-bind:disabled="boo" >mybt</button>

<button :disabled="boo" >mybt</button>
```

> 请牢记，在设置 DOM 标签属性值时要使用 双引号，而不是单引号。
>
> 在 JS 中个人偏向于使用 单引号。



<br>

通过 style 或 class 来实现绑定样式，例如我们在 data 中定义一个 classname 的字符串变量用于存储 csss 样式名，那么：

```
<div v-bind:class="classname"></div>
```

假设 data 中有一个变量 boo，那么当 boo 为 true 时我们让 div 拥有 classname 这个样式：

```
<div v-bind:class="boo? classname : ''"></div>
```

假设某个 css 样式名字为 classname，那么 Vue 提供了更简单的方式：

```
<div v-bind:class="classname: boo"></div>
```

> 由此我们可以推测出，Vue 在解析属性值时，会首先尝试将某个 “词” 去 Vue 配置项中进行查找，以便识别出这个 "词" 是否为定义好的变量 或 函数，如果没有匹配到则会将该词去 css 样式文件中进行匹配。
>
> 如果该“词” 即未在 JS 中找到，也未在 css 中找到，那 Vue 就会报找不到该属性的相关警告。

假设需要添加的样式为多个，可以使用数组的形式，数组中的每一个元素依然遵循上述原则：

```
<div v-bind:class="[xxxa, classname: boo, boo? 'xxb': 'xxc']"></div>
```



<br>

使用 `v-bind:style="{xxx:xxx}"` 这种形式直接添加内联样式。

> 请注意，添加样式名时采用 驼峰命名方式，这一点和 React 用法相同。 

例如我们在 data 中定义一个 mycolor 的变量用于存储颜色值，fontSize 变量用于存储字号，那么：

```
<div v-bind:style="{ color:mycolor， fontSize:fontSize+'px' }"></div>
```

若 style 某样式值为数组，则 Vue 将根据浏览器判断并给出最后一个所支持的值，例如：

```
<div v-bind:style="{display:['-webkit-box', '-ms-flexbox', 'flex']}"></div>
```



<br>

`v-on`：用于绑定某 DOM 事件处理函数，可以简写为 @。

假设我们在 methods 中定义了  handleClick()，那么可以将该 click 事件与该函数进行绑定：

```
<div v-on:click="handleClick"></div>

<div @click="handleClick"></div>
```

也可以添加参数：

```
<div v-on:click="handleClick('aaa')"></div>

<div @click="handleClick('aaa')"></div>
```



<br>

对于 DOM 事件，Vue 还提供了一些常规的事件修饰符。

1. stop
2. .prevent
3. .capture
4. .self
5. .once
6. .passive

可以通过这些事件修饰符，让我们简化对某些 DOM 事件和侦听的配置。

例如 阻止(取消) DOM 原生后续可能发生的操作：

```
<form v-on:submit.prevent="onSubmit"></form>
```



<br>

针对键盘事件，Vue 还提供了一些键盘修饰符。

例如我们可以通过以下代码，仅监听 回车键 松开事件：

```
<input v-on:keyup.enter="submit">
```

Vue 帮我们内置了一些常用键的名称：

1. enter：回车键
2. tab：Tab键
3. delete：删除或退格键
4. esc：Esc键
5. space：空格键
6. up：上箭头
7. down：下箭头
8. left：左箭头
9. right：右箭头
10. ctrl、alt、shift、meta
11. 其他按键对应的键盘数字码

这些修饰符可以进行组合，例如：

```
//同时松开 ctrl 和 回车键
<input v-on:keyup.ctrl.enter="submit">
```

```
//同时松开 ctrl 和 c 键
<input v-on:keyup.ctrl.67="xxx" >
```



<br>

对于鼠标事件，Vue 提供了一些键盘侦听配置，用于保证只有在该键摁下的前提下才对应触发：

1. ctrl
2. alt
3. shift
4. meta

例如：

```
//只有在摁下 ctrl 键且进行 click 时才会触发
<div v-on:click.ctrl="xxx"></div>
```

但上面代码中存在另外一种情景：摁下 ctrl 键时还摁下了 alt 键，那么进行 click 也会触发。

假设我只希望摁下 ctrl 键时 click 才会触发，可以通过 `.exact` 修饰符来进行限定。

```
<div v-on:click.ctrl.exact="xxx"></div>
```

经过修改后的代码，假设同时摁下 ctrl 和 alt 键进行 click，是不会触发的。



<br>

对于鼠标 3 个摁键，Vue 也提供了限定修饰符。

1. left
2. right
3. middle

例如只相应鼠标 左键 的 click 事件：

```
<div v-on:click.left="xxx" ></div>
```



<br>

针对 v-bind 和 v-on 的补充说明：

1. 动态参数名：使用 中括号 可以包裹住变量类型的属性或事件名。

   例如 v-bind:[xxx]="xxx"、v-on:[xxx]="xxx"

   甚至可以在 中括号内进行一些简单的 JS 运算，例如 v-on:['handle' + xxx]="xxx"



<br>

`v-if`：用于条件渲染，与之配套的有 `v-else-if` 和 `v-else`。

> 请注意是 条件渲染，而不是条件判断

假设我们在 data 中定义一个变量 boo，那么：

```
<div v-if="boo"></div>
```

只有在 boo 为  true 时才会渲染并显示该  div。

包含 `v-else-if` 和 `v-else` 的标签必须紧贴着包含 `v-if` 的标签，这样它们才会生效，否则单独存在的情况下，是不会做任何渲染的。

```
<div v-if="boo"></div>
<div v-else-if="boo2"></div>
<div v-else></div>
```



<br>

`v-show`：用于设置 DOM 标签的 display 样式值。

```
<div v-show="boo"></div>
```

假设 boo 的值为 false，Vue 会将上述标签转化为：

```
<div display="false"></div>
```



<br>

请注意，假设 boo 为 false：

1. v-if 就不会创建和显示该 div

   > 此时 html 中就根本不存在该 div

2. v-show 会创建但不显示该 div

   > 此时 html 中存在该 div，但是其 display 为 false



<br>

`v-for`：用于循环遍历并渲染标签。

假设我们在 data 中定义一个数组：

```
var app = new Vue({
   ...
   data:{
       list:[
           {message: 'React'},
           {message: 'Vue'},
           {message: 'TypeScript'}
       ]
   }
})
```

那么就可以使用 `v-for:"item in list"` 这种形式来循环创建标签本身。

```
<ul>
  <li v-for="item in list">{{ item.message }}</li>
</ul>
```

最终渲染出的 DOM 标签为：

```
<ul>
  <li>React</li>
  <li>Vue</li>
  <li>TypeScript</li>
</ul>
```

我们还可以将 `v-for="item in list"` 中增加遍历时的索引数值 index，即修改为：

```
<ul>
  <li v-for="(item,index) in list">{{ item.message }} - {{ index }}</li>
</ul>
```



<br>

`v-for`除了可以遍历数组外 ，还可以遍历 对象，将会得到该对象的所有自定义属性值。

```
var app = new Vue({
    ...
    data:{
        obj:{
            name:'puxiao',
            age: 35
        }
    }
})
```

```
<ul>
    <li v-for="value in obj">{{ value }}</li>
</ul>
```

如果想遍历的时候还可以获取属性名，那么将上面代码修改为：

```
<ul>
    <li v-for="(value,name) in obj">{{ name }}:{{ value }}</li>
</ul>
```

最后 ，还可以加上遍历时的索引顺序 index ：

```
<ul>
    <li v-for="(value,name,index) in obj">{{ name }}:{{ value }} - {{ index }}</li>
</ul>
```



<br>

通常在遍历的时候，我们需要使用 `v-bind:key`对 每一个 li 增加上 key 属性，以便 Vue 可以容易区分出 上次和本次 更新。

```
<ul>
    <li v-for="(item,index) in list" v-bind:key="index"></li>
</ul>
```

> 请注意，在 React 的循环创建中，通常要求 key 必须是字符串，不允许是纯数字。
>
> 但是对于 Vue 而言，允许将 key 设置为 纯数字。



<br>

对于 数组 而言，Vue 可以监听其值的变化，但仅限于你针对该数组执行了以下改变方法：

1. push()
2. pop()
3. shift()
4. unshift()
5. splice()
6. sort()
7. reverse()

假设我们通过 JS 直接修改 data 中 list 的某一项：

```
app.list[0] = { name:'xxx', age=18 }
```

当这行命令执行后，app.list[0] 项的值确确实实进行了修改，但是这个修改并不会引发 Vue 重新渲染界面。



<br>

对于 `v-for` 而言，还可以支持循环遍历某函数执行后的结果，例如 我们在 methods 中定义一个 函数 myFun：

```
var app = new Vue({
    ...
    methods:{
        myFun: function(){
            return ['aaa','bbb','ccc']
        }
    }
})
```

那么可以使用以下代码进行循环遍历：

```
<ul>
    <li v-for="value in myFun()" >{{ value }}</li>
</ul>
```

甚至可以直接对某个数字进行 N 此遍历，例如：

```
<ul>
    <li v-for="num in 10" >{{ num }}</li>
</ul>
```



<br>

注意：

1. 在使用 `v-for="item in list"` 时，还可以将 in 改为 of。
2. 不推荐在同一个标签上同时使用 v-if 和 v-for。



<br>

`v-model`：用于双向绑定数据变量。

假设我们在 data 中定义一个变量 name，我们需要将该变量绑定到某个 input 输入框的 value 值中。

```
<input v-model="name" />
```

这样，当输入框内的输入值发生变化时，会同步对 name 进行变更。

在双向绑定变量值时，Vue 还允许我们一些额外的操作：

1. `.lazy`：默认情况下 input 会在 change 事件时触发更新，但是当加上 .lazy 后则改为在 input  事件触发后才更新数据。

   > 所谓 change 和 input 的区别主要在于 中文输入法，当摁下键盘但并未最终选择汉字时。

   ```
   <input v-model.lazy="name" />
   ```

2. `.number`：强制将输入结果转换为 数字。

   ```
   <input v-model.name="age" />
   ```

   > 实际上默认 input 对应的值都为 字符串类型

3. `.trim`：自动过滤掉首位的空格

   ```
   <input v-model.trim="name" />
   ```



<br>

对于单选框、多选框、下拉单选框、下拉多选框而言，都可以通过 v-model 来设定其最终选择结果。

> 对于 多选框和下拉多选框而言，其结果值为一个数组。



<br>

`v-once`：仅初始化时绑定一次。

假设在 data 中有一个变量 name，那么对比以下 2 行代码：

```
<span>{{ name }}</span>
<span v-once>{{ name }}</span>
```

当后面 name 的值发生变化后，第一个 span 里的内容会同步发生变化，但是第二个 span 里的值将永远固定，不会随着 name 的值变化而变化。



<br>

**总结一下 Vue 的一些绑定标签语法**

| 标签语法                | 对应用途                | 简单示例                                                     |
| ----------------------- | ----------------------- | ------------------------------------------------------------ |
| v-bind                  | 用于单向绑定某属性值    | v-bind="xxx"<br />v-bind:key="xxx"<br />v-bind:class="xxx:boo"<br />v-bind:style="{color: cname}" |
| v-model                 | 用于双向绑定某属性值    | v-model="xxx"                                                |
| v-if、v-else-if、v-else | 用于条件渲染            | v-if="boo"                                                   |
| v-show                  | 用于条件是否显示        | v-show="boo"                                                 |
| v-for                   | 用于循环遍历创建标签    | v-for="item in list"                                         |
| v-on                    | 用于绑定DOM事件处理函数 | v-on:click="xxx"<br />v-on:click.ctrl="xxx"<br />v-on:click.left="xxx"<br />v-on:keyup.enter="xxx" |



<br>

## 2、Vue组件

#### 初探Vue组件

假设我们使用 React ，那么我们可以在 .jsx 文件中直接在 return() 中定义组件。

Vue 也支持 jsx 这种形式，但是我们先学习最基础的，通过 JS 来定义组件的方式：

`Vue.component('name',{ ... })`



<br>

Vue.component() 函数用于创建自定义组件。

第一个参数为该自定义组件的名字。

> 请注意名字的唯一性

第二个为配置该组件的具体内容，通常我们需要配置 2 个属性：props 和 template

1. props：为一个数组，该数组中的元素即为该组件从父级获取的配置变量

   > 对于 React 组件而言 props 为一个对象

2. template：组件的具体字面内容。

   > 请注意是 字面内容，而不像 React 那样直接就是 标签。

举例：

```
Vue.component('todo-item',{
    props:['todo'],
    template:`<li>{{todo.text}}</li>`
})
```

代码分析：

1. 我们将该组件命名为 todo-item，那么将来我们就可以使用 `<todo-item></todo-item>` 这个自定义标签来使用该组件。

2. 表示组件接收参数的 props 的值为一个数组，在上面代码中该数组仅包含一个元素 'todo'，请记得这个 'todo'   相当于该组件对外暴露的自定义参数(属性)名。

   > 我们目前将 props 设置为数组，在本文后面，我们还可以将 props 设置为对象，从而可以明确定义 props 的结构类型。

3. template 的内容即该组件的实际内容的 字面量。在该字面量中遵循 Vue 基础语法，并且 在字面量中，可以将 todo 视为该组件内可访问使用的变量。

使用该组件：

```
var app = new Vue({
    ...
    data:{
        list:[
            {text: 'React'},
            {text: 'Vue'},
            {text: 'TypeScript'}
        ]
    }
})

//

<ul>
    <todo-item v-for="（item,index) in list" v-bind:todo="item" v-bind:key="index" ></todo-item>
</ul>
```

请注意上述代码中的 v-bind:todo="item"，我们将 v-for 得到的 item 与 props 中的 todo 进行绑定。

> Vue 就是这么神奇，需要一定时间来适应这种 “便捷” 的操作语法。



<br>

#### 组件抛出自定义事件

在组件内部，可以通过 `$emit` 来实现抛出自定义事件。

例如：

```
Vue.component('todo-item',{
    props:['todo'],
    template:`<li>
        {{todo.text}}
        <button v-on:click="$emit('item-del')">del</button>
    </li>`
})
```

在上述代码中，当点击 del 按钮后，通过 `$emit(item-del)` 就可以抛出一个名为 item-del 的自定义事件。

在父级中，可以添加 item-del 的事件监听处理：

```
<ul>
    <todo-item 
        v-for="（item,index) in list" 
        v-bind:todo="item" 
        v-bind:key="index"
        v-on:item-del="handleDel()"
        >
    </todo-item>
</ul>
```

请注意，在上面的代码中，我们仅仅是触发和监听了自定义事件，但是对于这个示例中，我们还需要告诉父级，在  item-del 事件中携带参数，以便父级可以正确删除当前项。

Vue 的语法规定，我们可以将自定义事件需要携带的参数作为 $emit() 的第 2 个参数。

我们修改一下上面的代码：

```
var app = new Vue({
    ...
    data:{
        list:[
            {id:0, text: 'React'},
            {id:1, text: 'Vue'},
            {id:2，text: 'TypeScript'}
        ]
    },
    methods:{
        handleDel: function(id){
            const index = this.list.findIndex(item => item.id === id)
            if(index !== -1)
            this.list.splice(index,1)
        }
    }
})

Vue.component('todo-item',{
    props:['todo'],
    template:`<li>
        {{todo.text}}
        <button v-on:click="$emit('item-del',todo.id)">del</button>
    </li>`
})

//

<ul>
    <todo-item 
        v-for="（item,index) in list" 
        v-bind:todo="item" 
        v-bind:key="index"
        v-on:item-del="handleDel(id)"
        >
    </todo-item>
</ul>
```



<br>

与 React 组件内部作用域不通过，Vue 组件内部可以访问父级中所有的 变量。

> 这一点确确实实可能会容易造成混乱。
>
> 这也是 Vue 为了提升数据绑定便利 所作出的让步。



<br>

自此，关于 Vue 组件的基础知识已经学习完成，接下来进一步深入学习。



<br>

#### 深入了解学习组件

针对组件的细节，进一步深入学习。



**组件名：**

通常一个组件名字应该和实际用途有关联，让人通过名字即可大致了解组件的功能和用途。

组件名有 2 种风格：

1. 全小写+横杠(kebab-case)：例如 my-component-name
2. 首字母大写(PascalCase)：例如 MyComponentName

> 请注意，如果你使用的是原生引入 vue.js 的方式，那么一定要使用第一种。
>
> 如果你使用 单个文件 .vue 这种形式，那么推荐使用第二种命名方式。关于 .vue 这种文件形式，我们会在后面讲解。



ponent('xxx', { ... }) 这种形式创建的组件为全局组件，即在任何地方(哪怕是其他组件内部)都可以使用。

同时在该组件内部也可以访问全局变量。

全局组件的缺点：即使当前项目并未实际使用到该组件，但该组件的代码也会被打包进去。

<br>

这时我们就需要 局部组件。

Vue 创建局部组件的方式，实际上就是将原本的 Vue.component() 进行了拆解和重组。

1. 对外使用 JS 创建一个组件
2. 将该组件添加的 Vue 实例的配置项 components 中

举例：

```
//全局组件
Vue.component('component-a', { ... })

//局部组件
var ComponentA = { ... }

var app = new Vue({
    el:'#app',
    components:{
        'component-a': ComponentA
    }
})
```

> 假设我们在 Vue 初始化时并没有引入 ComponentA，那么将来项目打包时也不会将 ComponentA 的代码打包进去。

假设并不是 Vue 初始化是要引入 ComponentA，而是另外一个组件 Xxxx 要引入 ComponentA，那么引入方式和 Vue 初始化类似，也是通过 components 这个配置属性来引入的。

举例：

```
var ComponentA = { ... }

// import ComponentA from './xxx'

var ComponentB = {
    components:{
        'component-a': ComponentA
    }
}
```



<br>

**组件参数Props：**

在 Vue 基础部分我们代码中演示的是 props 为一个数组，数组中的元素为 变量名。

例如：props:['xxx']，这里要强调一点，变量名要遵循 驼峰命名原则，例如：props:['myName']。

在使用该组件，设置其属性时，需要转成 小写加横杠的 标签名，即： `<my-component my-name="xxx" >`



<br>

实际上 props 也可以不是数组，而是对象，并且直接定义该 props 中各变量名和值类型。

例如：

```
props:{
    myName:String
}
```

> 请注意，这里的类型定义采用的是该类型的构造函数，即首字母为大写风格和 JSDoc 类似。
>
> 这一点和 TypeScript 不同，假设类型为字符串即 String，而不是 TypeScript 中的 string。

以此类推，我们还可以将 props 拓展为：

```
props:{
    myName: String,
    age: Number,
    myFun: Function,
    arr: Array,
    arr2:[String, Number]
    other: Ojbect
}
```

> props 中属性值类型的定义，几乎和 JSDoc 相同

请注意，props 属性值类型还支持你自定义的 JS 类，例如：

```
function Person(name,age){
    this.name = name,
    this.age = age
}

props:{
   me:Person
}
```



<br>

Vue 组件嵌套组件会产生一个 属性叠加的 效果，如果不想让当前属性继承父类中的任何属性，则可以通过设置 `inheritAttrs: false` 的形式来明确拒绝。

```
Vue.component('base-input',{
    inheritAttrs: false,
    props:...
})
```



<br>

**自定义事件**

在 Vue 基础部分我们已经对 自定义事件 做过简单的学习。

通过 `$emit('xxx')` 可以抛出自定义事件，事件名(事件类型)为 xxx。

这里强调一点：事件名不要使用驼峰命名，而应该始终采用 小写+横杠 的形式。

> 小写+横杠 这种命名方式对应的英文称呼为：kebab-case



<br>

**自定义组件上的 v-model**

我们知道在原生 DOM 标签中 v-model 用于双向绑定某变量。对于一般的原生 DOM 标签而言，通常 v-model 隐含对应的是该标签的 value 属性值。例如：

```
<input v-model="name" >
```

<br>

对于 复选框等类型而言，其原生 value 有可能有特殊用途，为了避免 v-model 与之冲突，我们可以在自定义组件中添加 model 配置项来进行 “内部区分”。

先看一段代码：

```
Vue.component('base-component',{
    model:{
        prop: 'checked',
        event: 'change'
    },
    props:{
        checked: Boolean
    },
    template:`
        <input 
            type='checkbox' 
            v-bind:checked='checked' 
            v-on:change='$emit("change", $event.target.checked)' >
    `
})
```

在上面代码中，我们在自定义组件中添加了 model 配置项，该配置项表达 2 个含义：

1. `prop: 'checked'`：监控一个名为 checked 的 prop
2. `event: 'change'`：添加 change 事件的侦听，当组件内部监控到 change 事件时，将 change 事件携带的参数赋值给 checked 这个 prop。

这样一番操作后，对于组件使用者而言，v-mode 不需要考虑 value 这个原生 DOM 标签属性了。

```
<base-checkbox v-model="myCheck"></base-checkbox>
```



<br>

自定义组件的 model 配置项实际上是一种简约式的内部事件处理函数的声明处理。

> 暂时不理解没有关系，以后用的多了，自然就理解了。



<br>

#### 深入骨髓般的原生事件监听

试想一下这个组件：

1. 表面上，对于使用者而言 它 看上去应该是一个输入框
2. 实际上，在组件内部，它的根标签是 `<label>` ，根标签内部是一个 `<input>`

如果作为使用者想对这个组件的原生 “input" 事件进行监听，那么你需要使用到 `$listeners` 这个语法。

> 我个人不太赞同和认可这种做法。
>
> 组件就是组件，就应该是封装的，使用者不应该过多去关注细节，若父类需要什么直接让组件内部提供即可。
>
> 在这个场景中，我认为组件完全可以 抛出自定义事件，而没有必要把自定义事件伪装成原生事件。



<br>

具体用法和套路：

1. 在组件内部的 `<input>` 标签中，添加 v-on="inputListeners" 的属性配置

   > 还有 v-bind="$attrs"  v-bind:value="value"

2. 这个 inputListeners 实际上是在 computed 中创建的一个 衍生变量

3. 在定义衍生变量 inputListeners 的代码中，通过 “某些套路” 将组件内部的 input 事件对外转化为名称和 input 相同的一个自定义事件

4. 最终，使用者在使用该组件时，可以 “以为” 自己添加的是 input 原生事件

5. 提醒：组件内部为了避免使用者可以直接监听原生事件，所以要配置 inheritAttrs:false

整个过程概括起来就是：**组件内部将 原生事件伪装成名称相同的自定义事件**

<br>

具体代码套路如下：

```
Vue.component('base-input',{
    inheritAttrs:false,
    props:{
        label:String,
        value:String
    },
    computed:{
        inputListeners: function(){
            var vm = this
            return Object.assign({}, this.$listeners, {
                input: function(event){
                    vm.$emit('input',event.target.value)
                }
            })
        }
    },
    template:`
        <label>
            {{label}}
            <input v-bind="$attrs" v-bind:value="value" v-on="inputListeners">
        </label>
    `
})
```

经过上面一番操作之后，我们这个自定义组件 `<base-component>` 对于使用者而言，和普通的 `<input>` 标签没有什么区别了，因为它们拥有相同的 “对外特征”。



<br>

#### 组件prop的双向绑定

当组件使用者向组件传递一个 prop 参数后，组件内部希望修改这个 prop 的值，最简单的做法就是组件抛出对应的修改事件，并携带 prop 的新值作为参数，让使用者捕获该事件并在使用者的范围内对 prop 进行修改。

> 所谓的 “使用者的范围内” 是指以下 2 种情况：
>
> 1. Vue 配置项中的 事件处理
> 2. 直接在添加事件侦听时直接进行处理

当 prop 被修改之后，会触发组件的更新，从而达到了 “双向都更新修改 prop” 的目的。



<br>

关于 “同步更新” 自定义事件名的补充说明：

我们很自然想到这个事件名可以写成：update-xxx(小写加横行)，但是针对这类情况，Vue 推荐使用 update + : + xxx 这种格式，即 `update:xxx`，也就是说不使用 横杠而是 冒号。

> 实际中究竟采用横杠，还是 冒号，执行决定。



<br>

**同步操作的简写形式**

针对以上这种 “同步” 情况，Vue 为我们提供了一个 `.sync` 的语法，以便简化 "使用者的范围内" 这一步操作。

> sync 是英文单词 synchronize 的缩写，意思为 “同步”

```
//为简化之前的使用者代码
<text-document v-bind="doc" v-on:update:doc="doc=$event"></text-document>

//使用 .sync 之后的简化代码
<text-document v-bind.sync="doc" ></text-document>
```

可以看出 `.sync` 实际上简化了 2 个环节：

1. 绑定数据
2. 添加数据变化请求事件侦听，以及修改该值的代码

sync 将上述 2 个过程合并成 1 个代码：v-bind.sync="doc"



<br>

请注意 .sync 仅仅是用于简化 使用者 的代码，对于组件内部而言是没有变化的，依然需要抛出相应的事件。



<br>

**特别强调：**

在我们简化后的 同步代码 `v-bind.sync="doc"` 中 "doc" 只可以这样写，不允许针对 "doc" 再增加其他表达式。

> 如果是 v-bind:doc="doc"，那么这个代码中的 "doc" 是可以添加其他表达式的，例如修改为：
>
> v-bind:doc="doc + 'aaa' "



<br>

#### 保持组件状态

当发生数据更新时，Vue 会计算并更新当前页面中的 DOM 元素。

对于有些组件而言，当你希望 “即使此刻它不被渲染，但也希望下次渲染时能保持之前的状态”。

这个时候，你就需要 Vue 提供的一个标签 `<keep-aliv>`，将需要保持状态的组件放入到该标签中。

例如：

```
<keep-alive>
  <component ></component>
</keep-alive>
```



<br>

#### 过渡动画

当某个组件 进入(被添加) 或 离开(被删除) 时，可以添加一些过渡动画。

Vue 内置的 `<transition>` 标签就是用于创建过渡动画的。

简单来说就是把需要有过渡动画的组件 放入到 `<transition>` 标签中。

同时 Vue 也支持通过 JS 来添加这些过渡动画过程的侦听。

具体用法可参见 Vue 官网中关于 过度动画的部分。



<br>

#### 状态过渡

上面讲到的是 过渡动画，但是还有另外一种情况：状态过渡

例如一个数字由  10 变更为 29，那么默认情况下网页是直接将数字进行更改。

Vue 提供一些状态过渡的套路，借助第三方库，可以实现将 数字有 10 在规定时间内逐渐不断 +1 直到变为 29。

这些第三方过渡动画库为：tween.js、color-js 等等。



<br>

#### 自定义指令

像 v-on、v-if 这些都是 Vue 内置的指令，我们还可以自己去创建一些自定义指令。

通过 `Vue.directive('name',{ ... })` 这种形式来创建命令。

1. 第一个参数：指令名称，例如 focus，请注意在使用该命令时应该在前面加上 v-，即 v-focus
2. 第二个参数：指令具体内容，包括 何时触发、触发执行的函数

举例：

```
Vue.directive('foucs',{
    inserted: function(el){
        el.focus()
    }
})

//使用该指令
<input v-foucs >
```

代码解析：

1. 上面代码中，我们创建了一个名为 focus 的命令(指令)
2. 指令的内容为 当 "inserted" 时触发一个函数 function(el){ ... }



<br>

**何时触发？**

Vue 提供了 3 种触发场景：

1. bind：仅调用(触发)一次，即第一次绑定数据到该元素上时调用。

2. inserted：被绑定的元素插入到父节点时调用 (并不限制次数)

   > 请注意这里仅强调父节点存在，并不强调父节点必须已插入到 实际 DOM 中

3. update：所在组件发生数据更新时调用 (并不限制次数)

4. componentUpdated：所在组件以及包含的子组件全部更新完成后调用 (并不限制次数)

5. unbind：仅调用(触发)一次，即指令与元素解绑时调用



<br>

**触发函数的参数详情**

在上面示例代码中，我们看到函数 function(el)，其中 el 即该元素(标签) 对应的真实 DOM 标签元素。

除了 el 这个参数，Vue 还提供其他几个参数，可供你在需要是使用。

1. binding：一个对象，包含以下属性

   1. name：指令明，注意不包含前缀 v-

   2. value：指令绑定的值

      在上面示例中指令并未绑定任何有效值，但是指令是可以绑定值的，类似 v-focus="xxx" 中 xxx 即指令绑定的值，请注意 xxx 可以是有效的 JS 运算结果

   3. oldValue：指令前一个值

   4. expression：指令值的字符串(原始)值，假设 v-focus="1+2"，那么 value 为 3，expressin 为原始的字符串值，即 "1+2"

   5. arg：传给指令的参数，例如 v-focus:aaa="xxx"，其中 aaa 即为指令参数

   6. modifiers：包含修饰符的对象，例如 v-focus.aa.bb="xxx"，那么 “aa.bb” 会被转换为一个对象 {aa:true, bb:true}，这个对象就是 modifiers 对应的值。

2. vnode：组件以及子组件对应的 虚拟 DOM 节点 

3. oldVnode：上一个虚拟节点，请注意该参数仅在 update 和 componentUpdated 中出现、有值。

特别强调：除了 el 参数外 ，其他参数都只能是 读 的模式，不要尝试去修改它们的值。



<br>

假设你希望在 bind 和 update 时都触发某个相同指令，那么是不需要写 2 遍的，同时可以把 directive() 函数第二个参数由 对象改为一个函数。

你可以把它们简写(合并)写成：

```
Vue.directive('xxx',function(el,binding){
    el.xxx = binding.xx
})
```



<br>

#### 混入

当我们想实例化一个 Vue 时，需要提供一些配置选项。

例如：

1. 钩子函数：created
2. 自定义函数：methods
3. 引用组件：components
4. 自定义命令：directives
5. ...

假设有多个 实例化的 Vue，且它们拥有相同的某些 钩子函数 或 自定义函数，那难道要每一个都添加一遍吗？

<br>

Vue 提供了一个 “混入(mixin)” 的概念和语法，可以帮助我们将那些相同的 钩子函数或自定义函数 在外部统一声明定义，然后 “混入” 到每一个 Vue 实例中。

```
//先定义一个对象，包含 钩子函数和自定义函数
var myMixin = {
    created:function(){ ... },
    methods:{
        hello:function() { ... }
    }
}

//将 myMixin 混入到我们需要实例化的Vue或自定义组件中
var app = new Vue({
   mixins:[mixin],
   ...
})

var app2 = new Vue({
   mixins:[mixin],
   ...
})
```



<br>

上面的 “混入” 只是针对具体某个 Vue 实例，实际上还可以有更逆天的操作：将定义的 myMixin 混入到全局所有(包括 Vue 实例)的组件中。

需要使用到的函数是 `Vue.minxi({ ... })`

```
Vue.mixin({
    created:function(){ ... },
    methods:{
        hello:function(){ ... }
    }
})
```

> 注意，一定要不用或慎用 全局混入。



<br>

**关于 混入(mixin) 的优先级说明：**

假设我们定义的  myMixin 中和被混入组件中有相同的名称，也就是说名称冲突了，那会发生什么事情呢？

1. 对于 钩子函数来说，Vue 会将 它们两个都进行保存，并执行。顺序是：先执行 myMixin 中的钩子函数，然后再执行 组件内部的同名钩子函数。
2. 出钩子函数外，其他的(例如自定义方法，组件，命令)，Vue 会仅保留和执行 组件内部定义的那个值。



<br>

#### 过滤器

在 Vue 基础部分，我们提到可以针对某些 绑定的变量进行简单的过滤，例如：

1. .number：转换为数字
2. .mirt：去掉首尾空格

假设你需要自定义一些过滤器，那么就需要用到 Vue 提供的 `filters` 语法。

实现起来需要  2 个步骤：

1. 在组件内部 或 通过 Vue.filter() 来创建过滤函数
2. 在 v-bind 变量值时，除了值的后面加上 竖线和过滤函数名

举例：

```
//全局定义过滤器
Vue.filters('filter-name',function(value){
    if(!value) return ''
    value = xxxxx
    return value
})

//组件内部定义过滤器
var component = {
    filters:{
        filterName:function(value){
            ...
        }
    }
}

//绑定数据时使用过滤器
<div v-bind:xx="xxx | filterName"></div>
```

> 在上面代码中，绑定的值为 `xxx | filterName`，那么就意味着 xxx 最终实际值为 filterName(xxx) 函数的过滤之后的值。



<br>

还可以创建多个 自定义过滤器，然后多个过滤器 同时组合。

例如：

```
<div v-bind:xx="xxx | filterA | filterB | filterC"></div>
```

请注意，当存在多个过滤器时，他们执行的顺序是 从左向右 依次执行，即第一个先执行 filterA，然后将结果传递个 filterB，最终 filterC 的计算结果才是 xxx 的最终值。



<br>

#### 单个Vue文件组件

目前在上面所有的示例中，我们是把所有的组件和 JS 都写在了一起(一个文件中)。

项目稍微一复杂起来，肯定就需要对各个组件进行拆分，拆分到不同的文件中。

对于 Vue 而言，推荐将一个组件对应成一个 .vue 文件，该文件内容为 3 个部分：

1. 由  `<template>` 标签包裹的 组件标签
2. 由 `<script>` 标签包裹的 JS 代码
3. 由 `<style>` 标签包裹的 css 样式

举例：

```
//xxx.vue

<template>
    <p>{{ name }}</p>
<template>

<script>
    module.exports = {
        data: function(){
            return {
                name:'puxiao'
            }
        }
    }
</scrpt>

<style scoped>
    p{
        font-size: 2em;
    }
<style>
```

> 请注意在 样式标签中添加有 `scoped`，表示这些样式仅对当前组件生效。



<br>

对于上述代码中的 `<script>`  和 `<style>` 还支持引用外部文件，即修改成：

```
//xxx.vue

<template>
    <p>{{ name }}</p>
<template>

<script src="./xxx.js"></scrpt>
<style src="./xxx.css"><style>
```

但是这种做法并不推荐，因为这容易造成文件管理、互相引用 异常混乱。



<br>

**关于 .vue 中 JS 的补充：**

在 .vue 文件中的 `<script>` 标签内，实际上 Vue 组件配置项中的 data 可以省略，直接将原本 data 中的需要定义的变量写在 `<script>` 内。

例如：

```
//xxx.vue

<template>
    ...
<template>

<script>
    name:'puxiao'
</scrpt>

<style scoped>
    ...
<style>
```



<br>

#### 组件的其他知识点

例如比较 “重要” 的 插槽、动态组件、异步组件、各种边界处理。

依照我目前对 Vue 的掌握情况，我很难去理解为什么要有这些，他们存在的意义是什么？

我认为他们将 Vue 项目变得如此复杂，所以这里就不过多阐述和学习了。



<br>

除此之外，还应该完整看一遍以下内容：

Vue API：https://cn.vuejs.org/v2/api/

Vue 代码风格指南：https://cn.vuejs.org/v2/style-guide/



<br>

暂且跳过这部分，接下来开始学习使用 vue cli3 来创建工程化的 vue 项目。



<br>

## 3、vue/cli创建项目

Vue cli 相当于 React 的 Create-react-app，用于快速创建 Vue 项目工程的脚手架。

官网地址：https://cli.vuejs.org/zh

<br>

> 在 @vue/cli 官网上写着：“无需 eject”，是在内涵 create-react-app 无法直接二次修改 webpack 的配置。
>
> 真是各说各家好。



<br>

#### 全局安装

**全局安装：**

```
yarn global add @vue/cli

# or

npm i @vue/cli -g
```

<br>

**安装完成后，可查看版本：**

```
vue --verison

# or

vue -V
```

> 此刻我安装的版本为 4.5.13



<br>

**查看所有命令的帮助：**

```
vue -h

# or

vue --help
```


<br>

**补充说明：**

1. @vue/cli 包含有 @vue/cli-service 这个包，用于创建可调试、构建项目
2. @vue/cli 是基于 webpack 编译的，若想修改成 vite 则需要其他方式
3. @vue/cli 可用于创建 vue 2x 或 vue 3 项目
4. @vue/cli 创建的项目自带 typescript



<br>

#### 初始化项目

当 @vue/cli 全局安装成功后，提供 3 个关键命令。



**创建新项目**

```
vue create my-project
```

<br>

**创建项目的 4 点说明：**

1. 第一次创建项目时会询问 是否将当前 NPM 源修改为 cnpm。

2. 创建过程中会询问你使用 npm 还是 yarn  命令，这个命令决定了将来你调试项目时使用的命令前缀。例如我选择 yarn，则当我调试项目时对应的命令为 yarn serve，至于其他命令都可查阅创建好项目文件中的 README.md。

3. 创建过程中会显示 3 种创建内容方式：

   1. 创建 vue 2 (默认不包含 typescript)

   2. 创建 vue 3

   3. 手工选择特性(Manually select features)

      > 可以选择是否包含 typescript、vuex、vue router 等

4. @vue/cli 官网上面的某些操作步骤界面已经和当前最新版本略微不同，不过这些不同都不是特别重要的，只要创建一次就明白了。



<br>

**关于手工选择安装特性的操作补充：**

在创建项目时，若选择 手工选择安装特性(`Manually select features`) 这种方式时，其中有一环节会让你选择究竟安装哪些内容。

除了默认自动选中的几项外，你还可以额外去勾选其他几种，包括：

1. typescript
2. vuex
3. vue router
4. ...

请注意，选择的操作方式为：

1. 通过上`下箭头` 切换到当前选项
2. 通过摁 `空格键` 来选中或取消当前项
3. 摁 `i 键`可以对当前已选项进行 反选
4. 最终摁 `回车键` 确认并进入下一环节



<br>

**补充说明：**

如果你选择手工选择特性，并且选择使用 eslint ，当项目创建完成后，你需要手工修改 .eslintrc.js

在 parserOptions 一项中，加入语言版本(ecmaVersion)和模块类型(sourceType)。

```
module.exports = {
  ...
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2017,
    sourceType: "module"
  }
};
```



<br>

**构建自定义想法的原型**

```
vue serve
```


<br>

**通过图形化界面管理项目**

```
vue ui
```


<br>

这些命令操作实际上 create-react-app 非常类似，就不做过多讲解了。



<br>

#### VSCode中需要安装的插件

需要安装一些插件，方便我们开发使用。



**Better Comments**

安装之后，打开 .vue 文件，在 VSCode 底部状态栏的 “Select Language Mode”，从弹出列表中选择 “Vue”，这样我们就可以获取 .vue 相关文件的一些代码格式规范。

> 如果你不安装这个插件，选项栏中是没有 vue 这个选项的



<br>

对于格式化代码的插件推荐：Vetur 或 Volar

> 请注意，你只应该选择其中一个，而不是 两个都安装。
>
> 我个人偏向选择 Volar



<br>

**Vetur(不推荐)**

用于格式化、规范 .vue 代码

> 格式化代码依然使用 VSCode 默认的 shift + alt + F



<br>

**Volar(强烈推荐)**

针对 Vue 3 提供一些新特性支持。

但实际上对于 Vue 2.x 也有很大的帮助，安装之后，在 .vue 文件的底部状态栏会出现 2 个新的选项：

1. Atrs：规定属性名命名方式

   > 我偏向将默认的 kebab-case 修改为 cameCase

2. Tag：规定 Tag 命名方式

   > 我偏向使用默认的 PascalCase

当你打开 .vue 文件后，在 VSCode 右上角，还会新出现一个 绿色 V 的图标，点击该图标可以快速将当前 .vue 中的 3 个标签( template/script/style )拆分到 3 个窗口中，非常方便。



<br>

#### 修改默认配置

这里说的 “默认配置” 包含 2 层含义：

1. 默认 webpack 的配置
2. 默认 Vue 的一些配置

我们需要在新创建的 Vue 项目根目录，新建一个 `vue.config.js` 的配置文件，以后需要添加什么配置就直接修改这个文件的内容即可。

具体修改规则，可参考 Vue CLI 官方配置指南：https://cli.vuejs.org/zh/config/

<br>

下面列举几个最常用的修改配置。



<br>

**将文件路径由默认的根目录修改为相对目录：**

```
// vue.config.js

const path = require('path');
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'? './': '/',
}
```

> 对于 React 项目而言，我们只需在 package.json 中添加 ` "homepage": "."` 即可，但是这个操作在 Vue CLI 创建的项目中不起作用。

上面的配置中会根据当前 运行环境 来决定根目录为什么，我们可以不做区分，直接写死：

```
const path = require('path');
module.exports = {
    publicPath: './'
}
```



<br>

**向 webpack 添加新规则：**

假设我们需要使用 cesium.js，目前来说最新版本中存在一个加载第三方 zip.js 的问题，需要用到一个第三方加载插件。

当我们安装好 `@open-wc/webpack-import-meta-loader` 后，就可以继续修改 vue.config.js 文件，添加 webpack 相关规则。

```
// vue.config.js

const path = require('path');
module.exports = {
    configureWebpack: {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'node_modules/cesium/Source'),
                    use: { loader: require.resolve('@open-wc/webpack-import-meta-loader') }
                }
            ]
        }
    }
}
```



<br>

#### 模式和环境变量

**Vue 的 3 种模式：**

1. 开发模式：development，适用于本地开发过程中的调试、热更新等
2. 测试模式：test，适用于本地测试
3. 生产模式：production，适用于正式发布到线上

这 3 种模式分别对应的是 package.json 中 3 中调试命令：

1. `yarn serve`：开发模式

2. `yarn test`：测试模式

   > 假设在创建项目时就没有选择包含 测试模式，那么你是看不到这条命令的

3. `yarn build`：生产模式



<br>

**指定某种模式**

通过查看 package.json 可以看到 `build` 对应的真实命令为：

```
"build": "vue-cli-service build"
```

假设想更改 build 对应的模式，可以通过在后面添加 `--mode` 参数来实现，例如：

```
"build": "vue-cli-service build --mode development"
```

> 这样修改之后，当再执行 `yarn build` 则编译出的文件实际上是 开发模式下的文件。



<br>

**环境变量：**

关于如何设置环境变量，可查阅：

https://cli.vuejs.org/zh/guide/mode-and-env.html#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F



<br>

至此，一个基本的 Vue 开发环境配置完成，接下来就可以开始写代码了。



<br>

#### 关于Vue组件中编写JS代码的补充说明：

**React VS Vue**

对于 React 而言，假设需要在一个 div 标签 需要被真实创建后进行某些编程，那么 React 的做法通常是：

1. 在 React 组件 return () 中添加 div 标签
2. 并通过 ref、useRef 将该 div 进行勾住
3. 然后在 useEffect 中通过 divRef.current 找到该 div 并开始编写 JS 代码
4. 当组件要卸载前，通过 renturn ()=>{ ... } 取消一些事件侦听 或 销毁某些对象

上面这些操作，对于 Vue 组件而言，对应的操作流程为：

1. 创建 xx.vue 组件文件

2. 在该组件的 `<script>` 标签中，遵循以下格式，添加对应的 挂载完成和销毁前的钩子函数

   ```
   <script>export default {
       name: 'xxx',
       mounted: function(){ ... },
       beforeDestroyed:function { ... }
   }
   </script>
   ```



<br>

**组件钩子函数的拆分：**

假设 mounted 或 beforeDestroyed 对应的函数比较复杂，想拆分出去，那么通常有 2 种拆分方式：

1. 通过 混合(mixin) ：将其他地方定义的配置项，通过 mixins 来进行 并入。
2. 通过 引入(import)：将其他地方定义的函数引入，并赋值给 mounted。

对于第一种 混入(mixin) 而言，具体怎么用在前面已经讲过，这里不做过多阐述。

下面重点说一下第二种 引入(import) 这种方式。



<br>

先看以下代码：

```
//myFun.js
const myFun = function(){
 ...
}

//xxx.vue
<script>
import myFun from './myFun'
export default {
    mounted: myFun
}
</script>
```

以上代码运行是没有问题的。

但是请注意：mounted 是一个 不包含参数的 function，因此 myFun 也必须是一个没有参数的 function。

所以在某些情况下，上面的代码存在 2 种问题。

<br>

**问题1：参数**

假设 myFun 中需要某些参数，那么你就将 myFun 改造成可以接收参数且返回某个 function 的形式，例如：

```
//myFun.js
const myFun = function(str){
   console.log(str)
   return function(){
      str
   }
}

//xxx.vue
<script>
import myFun from './myFun'
export default {
    mounted: myFun('puxiao')
}
</script>
```



<br>

**问题2：无法获取 this**

问题 1 的解决方式虽然可以实现传递普通参数的问题，但是却无法传递 this。

> 组件的 mounted 生命周期，只表明已挂载到父级中，但不一定就已真正挂载到 HTML 中了。

经过试验，在 xxx.vue 中将 this 传递进去，实际上 myFun 内部得到的参数为 undefined。

结论就是：假设你的生命周期函数中需要使用 this，那么你就只能通过 混合(mixin) 的方式来实现 钩子函数拆分。



<br>

实际项目中使用哪种拆分方式，可以根据实际情况来决定。



<br>

## 4、Vue Router路由

Vue Router 官网地址：https://router.vuejs.org/zh/



<br>

#### Vue项目中安装router

**第一种：原生html**

直接通过标签引入最新的 router.js

```
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
```

或者指定某个具体版本：

```
<script src="https://unpkg.com/vue-router@2.0.0/dist/vue-router.js"></script>
```



<br>

**第二种：手动NPM安装**

```
yarn add vue-router
```



<br>

**第三种：通过CLI额外追加**

假设你的项目是通过 Vue CLI 已创建好的，那么在命令窗口中先切换到你的项目目录中，然后通过 CLI 追加安装 router。

```
vue add router
```



<br>

**第四种：通过CLI创建包含router的项目**

这是最简单，也最方便的方式，即直接使用 CLI 创建一个新的包含 router 功能和示例的 vue 项目。

```
vue create my-vue
```

然后在给出的选项中，选择 `Manually select features`。

在列出的安装特性中，通过上下箭头切换到 Router 这一项，然后摁 空格键 选中 Router 这一项。

接下来摁回车，进行后续步骤。

...

其中会有一个选项：Use history mode for router？(Y/n)

建议选择 Y

最终一路往下操作，即可创建出一个包含 router 简单示例的 Vue 项目。



<br>

**关于Router版本的补充说明：**

假设我们是基于 vue 2.x 的项目，那么 CLI 默认会使用 Router 3.x 版本。

假设我们是基于 vue 3.x 的项目，那么 CLI 默认会使用 Router 4.x 版本。



<br>

本文下面讲解的都是基于 Router 3.x 版本。



<br>

#### Vue Router 基础用法

在 Vue 项目中使用 路由(router) 的基本流程为：

1. 先以组件的形式创建不同页面内容(路由对应的渲染内容)，例如 PageA、PageB

   ```
   //这里创建 2 个最简单基础的 组件
   const PageA = { template: '<div>This is PageA</div>'}
   const PageB = { template: '<div>This is PageB</div>'}
   ```

2. 在 JS 中创建一个路由(router)实例，并设置其路由匹配规则 routes 的值，routes 为数组类型，其中每一个元素拥有 2 个属性：

   1. path：路由对应的路径(url)，例如 "/page-a"、"/page-b"
   2. component：路由命中后对应要渲染的组件，例如 PageA、PageB

   ```
   const router = new VueRouter({
       routes: [
           {path:'/pagea', component:PageA},
           {path:'/pageb', component:PageB}
       ]
   })
   ```

3. 实例化一个 Vue，并将刚才创建好的 router 实例作为配置参数传递给这个 Vue 实例

   ```
   new Vue({
       router,
       render:h =>h(App)
   }).#mount('#app')
   ```

4. 在入口页面(App.vue)中，创建 2 个内容：

   1. 使用 `<router-link>` 标签，添加 N 组 路由跳转的菜单

   2. 添加 `<router-view>` 标签用来作为承载 路由命中后对应需要渲染的组件

      > 你甚至可以简单把 `<router-view>` 标签理解为 “临时占位符” 或 “插槽”

   ```
   <p>
       <router-link to="/pagea">Go to PageA</router-link>
       <router-link to="/pageb">Go to PageB</router-link>
   </p>
   <router-view />
   ```



<br>

**关于 `<router-link>` 中 to 值的补充说明：**

在日常 `<router-link>` 的使用中，关于 to 的值有 2 种设置方式：

1. `to="/xxx"``

2. ``:to="{ ... }"`

   > 请注意 to 前面是有一个 冒号 的

第1种：`to="/xxx"`

这种方式中 to 的值也就是该 路由路径 的字面值。

第2种：`:to="{ ... }"`

这种方式中 to 的值为一个对象，该对象有存在互斥的 2 种属性结构：

1. path 搭配 query：{ path: 'xxx', query?:{ ... } }

   > 如果 to 的值中出现了 path 属性，即使出现 params 也会被忽略

2. name 搭配 params：{ name:'xxx, params?:{ ... }}

   > 如果 to 的值中出现了 name 属性，即使出现 query 也会被忽略

<br>

举例说明：

下面 3 种对 to 的值设定方式，其最终结果是相同的：

```
<router-view to="/xxx"></router-view>
<router-view :to="{path:'xxx'}"></router-view>
<router-view :to="{name:'xxx'}"></router-view>
```

若使用 `:to` 这种形式，且出现了 query 或 params，那么他们分别对应的结果为：

```
<router-view to="/xxx?id=2"></router-view>
<router-view :to="{path:'xxx',query:{id=2}}"></router-view>
```

```
<router-view to="/xxx/2"></router-view>
<router-view :to="{name:'xxx',params:{id=2}}"></router-view>
```

> 与这部分知识对应的是后面我们将要讲解的 “通过 JS 编程控制路由切换”。



<br>

补充说明：

1. 对于 path + query 创建的路由，其访问 query 参数为：this.$router.guery.xx

2. 对于 name + params 创建的路由，其访问 params 参数为：this.$router.params.xx

3. 如果在 router-link 标签中出现 replace 则表明此次跳转不产生新的 浏览器历史记录，而是替换当前历史记录

   ```
   <router-link to="/b" replace ></router-link>
   ```

4. 如果在 router-link 标签中出现 append 则表示标签中的 to 的值是对当前路由地址的追加

   ```
   //假设当前路由路径为 /a
   <router-link to="/b" append ></router-link>
   //由于使用了 append ，所以最终跳转的实际路径为 /a/b
   ```

5. 默认情况下 `<router-link>` 最终会被渲染成 `<a>` 标签，如果想修改渲染成 `<li>` 标签，则需要添加 tag="li" 即可

   ```
   <router-link to='/xxx' tag="li"><router-link>
   ```

6. 默认情况下 `<router-link>` 在 click 后会被触发，但是也可以通过 event 修改成其他事件

   ```
   <router-link to='/xxx' event="mousedown"><router-link>
   ```

   

<br>

**路由没有匹配到会怎样？**

例如上面示例中，假设我们不小心手抖，把路由跳转连接写错了：

```
//正确的
<router-link to="/pageb">Go to PageB</router-link>

//不小心手抖写错了
<router-link to="/pagebb">Go to PageB</router-link>
```

当我们给 `<router-link>` 的 to 属性值设置错了，而  router 中并没有配置 pagebb 对应的页面组件，那会发生什么事情呢？

答：

1. 并不会有任何警告、报错 或 提示
2. `<router-view>` 会被渲染为 空

所以，为了避免这种情况，通常我们会在路由配置中，添加一条可以匹配到 404 的路由规则，具体如何配置稍后讲解。



<br>

**组件与“页面”的目录结构：**

我们知道普通组件为 xxx.vue，而路由跳转对应的页面实际上也是一个组件，形式也是 xxx.vue。

在实际的 Vue 工程化项目中，通常遵循以下目录结构：

1. components 目录用于存放所有组件

2. views  目录用于存放所有页面

   > 当然某些项目可能会将该目录命名为 pages

3. router 目录用于存放定义 router 的 js



<br>

**组件内部获取当前路由信息：**

在组件内部，可以通过 `this.$router` 获取当前路由实例，也就是下面代码中的 router 对象。

```
const router = new VueRouter(...)
```

当使用 `this.$router` 获取到路由实例后，可针对该路由进行一些属性值的获取，或者是执行一些路由跳转的方法。

1. 例如，获取路由中的某些参数

   ```
   this.$router.params.username
   ```

2. 例如，让路由后退到上一个页面

   ```
   this.$router.go(-1)
   ```



<br>

#### 动态路由匹配

在前面例子中，我们设置的路由匹配规则中，命中路由的路径是写死、固定的，即：

```
const router = new VueRouter({
    routes: [
        {path:'/pagea', component:PageA},
        {path:'/pageb', component:PageB}
    ]
})
```

但是在实际项目中，我们需要面临很多种复杂的、动态的路由路径。

不可能使用写死的方式来把所有路由路径都写进去，因此需要路由具备 `动态匹配`。



<br>

请注意：Vue Router 路由匹配使用的是第三方NPM包 `path-to-regexp` 作为路由引擎。

path-to-regexp：https://github.com/pillarjs/path-to-regexp/tree/v1.7.0

也就是说，凡是 path-to-regexp 支持的动态匹配规则 Vue Router 也都支持。

> 这是一句废话



<br>

**优先级规则**

在学习 path-to-regexp 之前，我们先说一下 Vue Router 的优先级规则：路由命中的优先级是按照路由规则定义的先后顺序决定的。

不同于 Nginx 这类专业的服务器后端程序，Vue Router 目前无法做到按照匹配精确度来实现优先级。因此在定义 Vue Router 路由规则时，一定把精准的放在靠前位置，而通用(模糊)类的规则(例如 path:* )放到靠后位置。

<br>

恰恰以为 Vue Router 路由规则优先级的规定，所以通常会将 `path:*` 放在最后，让它作为匹配 404 的路由路径。



<br>

#### path-to-regexp的动态匹配规则

**第1条规则：使用斜杠(/)来作为路径的默认分割符**

例如：/page 和 /page/a 就是 2 个不同的路径

> 注意：斜杠为 默认分隔符，实际 Vue Router 已经封装好了这个分隔符，因此你也无法修改



<br>

**第2条规则：使用冒号(:)来匹配一个动态参数**

假设我们将匹配规则设置为：/page/:id

那么 /page/2、/page/a、/page/b、/page/abc 这些路径都将被命中。

同时路由参数中 `this.$router.params.id` 的值分别对应 2、a、b、abc

<br>

假设匹配规则设置为：/:foo/:bar，哪又对应什么路由呢？

1. this.$router.params.foo
2. this.$router.params.bar



<br>

**第3条规则：路径中只能正常解析以下字符**

1. 大写字母：A-Z
2. 小写字母：a-z
3. 数字：0-9
4. 下划线：_

请记得：不支持中划线(-)



<br>

**第4条规则：在参数后面加上问号(?)来表达这个参数为可选项**

假设我们的路由规则为：/foo/:bar?

那么 bar 即为可选项，也就是说无论 bar 是否存在都符合(命中)该条路由规则。

例如：/foo、/foo/aa、/foo/0



<br>

**第5条规则：使用加号(+)来表明参数必须至少出现一次**

假设我们的路由规则为：/:foo+

由于参数 foo 后面有 + ，所以 foo 必须至少出现一次才会命中该路由。

例如：

1. /：由于参数 foo  一次也没出现，所以该路径不会被命中
2. /aa：由于参数 foo 出现了一次，值为 aaa，所以该条路径会被命中
3. /aa/bb：由于参数  foo 出现了不止一次，此时 foo 对应的值为 aa/bb，所以该条路径会被命中



<br>

**第5条规则：使用括号+正则表达式来限定参数的字符格式**

假设我们的路由规则为：`/:foo(\\d+)`

从括号里的正则表达式可以看出必须要求出现 1 次以上的数字。

> 请注意 正则表达式 `d+` 中 d 表示数字，+ 表示至少出现 1 次
>
> `d+`并不要求必须全部是数字

那么：

1. /aaa：由于没有出现任何数字，所以这个路径不会被命中
2. /123：由于出现了至少 1 个数字，所以这个路径会被命中

补充：

当我们书写规则为 /:foo 的时候，没有使用任何正则表达式，实际上 path-to-regexp 默认 /:foo 对应的正则表达式为 `[^\/]+`

> `[^\/]+` 表达的意思为：以 / 为开头，且至少出现一次

提醒：在括号中书写正则表达式时，切记要使用 双斜杠，例如 `\\d`。



<br>

**第7条规则：使用(.*)来匹配剩余所有未命名参数**

假设我们的路由规则为：/:foo/(.*)

我们要匹配的路由路径为：/aa/bb

那么：

1. 路由中有一个参数为 foo，值为 aa
2. 路由中剩余所有的参数为一个对象，该对象属性中数字索引 0 对应的值为 bb
3. 假设路由路径为 /aa/bb/cc，那么对象属性中数字索引 0 对应的值为 bb，数字索引 1 对应的值为 cc，以此类推



<br>

**第8条规则：使用星号(*)来匹配任意多个字符**

假设我们的路由规则为：/*

那么由于 * 可以匹配到任意的字符，所以下面的路径都可以被匹配到：

1. /
2. /aaa
3. /aaa/bb

所以通常会将 /* 作为路由最后一条规则，用于匹配 404 。



<br>

**补充说明 1：**

path-to-regexp 实际上执行的是类似 伪静态 一样的路径规则。

与之对应的像：/aa?id=2&name=ypx 这种路径实际上也在它考虑和解析的范围内。

> 这类请求变量值存储在 this.$router.query 中



<br>

**补充说明 2：**

无论第 7 条 还是第 8 条规则，都使用到了 通配符 * ，对于 Vue Router 而言，他会将所有通配符匹配到的参数存放在路由(router)参数(this.$router.params)的 `.pathMatch` 变量中。



<br>

**补充说明 3：**

在 Vue Router 中除了 * 号可以匹配任意路径，实际上使用 空白字符('') 也可以启到匹配任何未匹配到参数的效果。



<br>

#### 嵌套式路由

在我们上面提到的路由例子中，采用的是下面这样的流程逻辑：

1. 定义组件 ComponentA、ComponentB

2. 定义页面 PangeA、PageB

   > 页面中可能会使用到 ComponentA 或 ComponentB

3. 定义路由实例 router，并且添加路由规则

4. 在 App.vue 中添加 `<router-link>` 和 `<router-view>`

这里面存在一个简单的 “上下级渲染” 关系，即 router 根据命中的路由规则确定哪个页面内容被渲染到 `<router-view>` 中。

至于该页面的内容是什么，实际上 router 并不知道，也无权决定。



<br>

但是在实际的项目中，页面渲染什么内容的逻辑可能比较复杂，这时候就需要使用到 **嵌套式路由**，赋予 router 更多权利，用于管理和配置被渲染页面里的内容。

具体的操作流程为：

1. 除了 App.vue 添加 `<router-view>` 标签外，还在页面组件的模板中也添加该标签，例如在 PageA 和 PageB 的模板中也添加 `<router-view>`。

   > 请注意，对于 PageA 和 PageB 而言，他们可以把 `<router-view>` 看作是某个 “占位符” 或 “插槽”，至于 `<router-view>` 将来究竟要被渲染成什么内容，不由他们自己决定。

2. 在配置 router 时，每一条路由规则中除了原本需要设置的 2 个属性 `path` 和 `component` 外，新增一个 `children`的属性。该属性的值和 VueRouter 中 routes 的值定义方式完全相同。

   > children.routes 也是一个数组，数组每个元素也是需要设置 2 个属性 `path` 和 `component`

3. 当某个页面被命中后，会再次根据路径中的某些参数去匹配 children 中 routes 的规则，当再次匹配到内容后则会将对应的 component 组件内容渲染到该页面中 `<router-view>`。

经过上面的流程，实际上存在  2 个层级的路由：

1. App.vue 中的 `<router-view>` 为第 1 层路由，负责承载被渲染的那个页面
2. 被渲染页面中的 `<router-view>` 为第 2 层路由，负责承载由 router.routes[x].children.routes[y] 中的规则来决定渲染的那个组件

而所有的最终决定权，都由  router 来决定。



<br>

路由虽然看上去简单，但是整个应用程序的核心入口。



<br>

#### 通过JS控制路由切换

**this.$router.push()**

在上面的示例中，我们都是通过 `<router-link>` 标签来控制路由切换的。

实际中，我们也可以通过 JS 来对路由进行切换、跳转。

`<router-link :to="{ ... }">` 对应的是 `this.$router.push({...})`

举例：

```
//点击 <router-link> 标签进行跳转到 /xxx
<router-link to='/xxx'></router-link>

//通过 JS 控制路由跳转同样的 url
this.$router.push('xxx')
```

```
//点击 <router-link> 标签进行跳转到 /xxx?id=2
<router-link :to='{path:"xxx",query:{id:2}}'></router-link>

//通过 JS 控制路由跳转同样的 url
this.$router.push({
    path:'xxx',
    query:{
        id:2
    }
})
```

```
//点击 <router-link> 标签进行跳转到 /xxx/2
<router-link :to='{name:"xxx",params:{id:2}}'></router-link>

//通过 JS 控制路由跳转同样的 url
this.$router.push({
    name:'xxx',
    params:{
        id:2
    }
})
```



<br>

请注意：上面示例中例如 name:'xxx'，实际上还可以使用模板字符串，例如 name:`/xxx/${xx}`

由于可以使用模板字符串来拼接 name 或 path，那么无论 name 还是 path 都可以拼接处彼此对方的形态。

例如 原本使用 name 其结果为伪静态类型的路径，但通过模板字符串可以改造成 动态类型，例如：

```
this.$router.push({
    name:'/xxx?id=${xx}'
})
```



<br>

**this.$router.replace()**

上面提到的 .push() 方法会向浏览器历史添加一条历史记录。

而 .replace() 函数用法和 .push() 完全相同，只不过它并不会添加一条历史记录，而是替换当前这条历史记录。

如果使用的是 `<router-link>` 标签，可通过添加 `replace` 属性来表明这条连接是用于替换当前历史记录，而不是新增。

```
<router-link to='/xxxx' replace>
```



<br>

**this.$router.go(n)**

这个 .go() 函数用于跳转到某个历史记录。

```
this.$router.go(1) //前进一个页面
this.$router.go(-1) //后对一个页面
this.$router.go(3)  //前进 3 个页面(前提是历史记录中存在这个记录)
```

如果历史记录并不够用，那么就会默默跳转失败。

> 所谓 “默默”，意味着并不会收到报错信息

想要获取浏览器历史记录可用长度，对应代码为：

```
window.history.length
```



<br>

**this.$router.back()**

后退一步



<br>

**this.$router.forward()**

前进一步



<br>

**this.$router.fullPath**

读取该属性，可以获取完整的路径



<br>

**this.$router.matched**

读取该属性，返回一个数组，包含所有命中的路由对象



<br>

**this.$router.name**

读取该属性，返回当前路由对应的 name 值



<br>

**this.$router.redirectedFrom**

如果存在重定向，则返回重定向来源的路由的名字



<br>

**关于路由 path/name 的补充：**

在前面我们提到定义路由路径的 2 种方式：

1. 使用 path + query
2. 使用 name + params

这实际上是站在 `<router-link>` 或 `this.$router.push()` 角度上来看待如何最终匹配的。

但是如果站在 路由实例 router 的角度来看，path 和 name 是不冲突的。

准确来说：name + params 实际上是 path 的另外一种定义方式。

例如：

```
const router = new VueRouter=({
    routes:[
        {
            path:'/user/:userid',
            name:'user',
            component:User
        }
    ]
})
```

在上面代码中，我们在路由实例内部，定义了 `path:/user/:userid`，同时我们也定义了 `name:user`。

因此在使用的过程中 (站在 `<router-link> 和 this.$router.push()`的角度)，我们可以通过 name + param 的组合形式来命中 `/user/:userid`。

```
//命中 /user/:userid
this.$router.push({
    name:user,
    params:{
        userid:2
    }
})
```



<br>

#### `<router-view>`的name属性

在上面讲解的路由例子中，无论 App.vue 还是页面，他们都只包含一个 `<router-view>` 标签。

实际上它们是可以同时包含多个 `<router-view>` 标签的。

> 在 Vue Router 官方文档中，将 `<router-view>` 称呼为 “视图”



<br>

试想一下这个应用场景：假设某个页面中存在 A、B、C 3 个模块。

> 你可以把 A B C 想象成页面的 顶部、侧边栏 和 中间内容

当命中某个路由路径时，希望分别将 A、B、C 3 块渲染成 3 个不同的组件内容。

这个时候，我们就可以在这个页面中 添加 3 个 `<router-view>` 标签，并为其添加不同的 name 属性值。

```
<router-view name="a"></router-view>
<router-view name="b"></router-view>
<router-view name="c"></router-view>
```

> 你可以理解为  3 个 “占位符” 或 “插槽”

然后我们将路由实例的配置由渲染单个的 `component` 修改为 `components`，并进行相关设置：

```
const router = new VueRouter({
    routes: [
        path:'/xx',
        components:{
            a:ComponentA,
            b:ComponentB,
            c:ComponentC
        }
    ]
})
```

这样当路由命中 `/xx` 后，就会根据 components 中配置的多个 `name` 名字找到对应的 `<router-view>`，然后依次对他们进行渲染。 



<br>

实际上当我们使用 `<router-view />` 时，在没有向其添加 name 属性值时，默认 name 的值为 "default"。



<br>

上面的套路也可以应用在 嵌套式路由 中。



<br>

#### 重定向和别名

**重定向：**

假设当前命中了路由路径 '/aa'，但是由于某种原因我们需要跳转到 '/bb' 对应的路由路径上。

这就叫做：路由重定向，可以通过 `redirect` 属性来实现。

```
const router = new VueRouter({
    routes:[
        { path:'/aa', redirect:'/bb'},
        ...
    ]
})
```

在上面的代码中，重定向的目标路径我们写成了固定的 "/bb"，实际中还可以使用以下 2 种设定方法：

1. 采用 对象 的形式，例如：

   ```
   const router = new VueRouter({
       routes:[
           { path:'/aa', redirect:{name:'bb'}
           },
           ...
       ]
   })
   ```

2. 采用箭头函数 返回值的形式，例如：

   ```
   const router = new VueRouter({
       routes:[
           { 
               path:'/aa', 
               redirect: to=>{
                   return ...
               }
           },
           ...
       ]
   })
   ```



<br>

经过上面重定向后，当访问 "/aa" 时会自动变成(跳转) "/bb"。



<br>

**别名：**

向路由规则中添加 `alias`  配置。

举例：

```
const router = new VueRouter({
    routes:[
        { path:'/aa',component:ComponentA, alias:'/bb'}
    ]
})
```

上面代码中意味着当访问 "/aa" 和 "/bb" 是效果完全相同，并且浏览器地址也不会发生变化。

> 如果是重定向则浏览器地址会发生变化。



<br>

#### 是否大小写敏感

默认情况下，路由路径是对大小写不敏感的。

如果希望大小写敏感，则通过下面方式进行配置：

```
count router = new VueRouter({
    routes:[ ... ],
    caseSensitive:true
})
```

> 默认为 caseSensitive 为 false



<br>

#### 路由组件传参(解耦)

假设我们有一个路由规则为 "/xxx/:id"，且此刻被命中，需要将组件 `CompA` 渲染到 `<router-view>` 中。

如果组件 CompA 中需要获取参数 id，并且根据 id 的值来做一些内容显示。

那么我们很容易想到在 CompA 组件中使用 `this.$router.param.id` 来获取并使用 id 这个参数值。

问题来了，假设我们在别的地方也需要使用到 CompA 这个组件，但是 CompA 需要使用到的 id 并不是通过路由获取，而是通过设置设置属性值来传递的，例如：

```
<CompA v-bind:id="xxx"></CompA>
```

由于 CompA 内部使用的是 this.$router.params.id，那么很明显 CompA 无法同时适用以上 2 种场景。

为了提高组件的复用性，我们可以通过给 路由组件传参 的形式来解决这个问题。



<br>

所谓 “路由组件传参” 就是在组件内部原本需要使用 `this.$router.params.xx` 获取参数的形式改为通过设置组件绑定属性的方式。



<br>

**操作流程为：**

1. 将 “路由组件” 改成普通的组件，也就是说移除组件内部 this.$router.params 的相关代码，改为通过定义组件 props:[ ... ] 的形式来获得参数。

2. 修改路由规则，添加 `props:true` 设置，将 this.$router.params 中的各个值键对(属性名和属性值)为 “组件属性” 传递给组件。

   例如将 this.$router.params.id 以 id="xxx" 的形式设置于 CompA 上，从而 CompA 可以顺利得到参数 id 的值。

```
const router = new VueRouter({
    routes:[
        { path:'/xxx/:id', component:CompA, props:true }
    ]
})
```

假设路由规则中使用的是 components，那么 props 需要对各个 视图(`<router-view>`) 都做相应设置。

```
const router = new VueRouter({
    routes:[
        { 
            path:'/xxx/:id', 
            components: { default:CompDef, a:CompA, b:CompB },
            props:{ default:true, a:true, b:false}
        }
    ]
})
```



<br>

**关于 Props 值的补充说明：**

Props 可以有 2 种形态：

1. 布尔值
2. 对象
3. 有返回值(对象)的箭头函数

<br>

第1种：布尔值

1. 若为 true：向 Vue Router 表明，请将 this.$router.params 中的值键对以属性(参数)的形式传递给被渲染的组件中。
2. 若为 false：也就是默认值，表明不需要将 this.$router.params 中的值键对传递给组件

<br>

第2种：对象

若为对象，例如 props:{ name:'puxiao' }，包含 2 层含义：

1. 无需将 this.$router.params 中的值键对传递给被渲染的组件
2. 但是请将 props 定义的对象 { name:'puxiao' } 中的值键对作为属性传递给被渲染的组件

<br>

第3种：有返回值(对象)的箭头函数

实际上这是 第2种 的变种形态。简单来说，例如：

```
props:()=>{ return { name:'puxiao' }}
```

实际中可以将 router 中的某些参数进行修改和调整，然后再传递给组件。

举例：

假设路由中的某个参数名为 id，但是组件中定义的变量名却为 useid，那么我们可以这样操作：

```
const router = new VueRouter({
    routes:[
        {
            path:'/xx/:id',
            component:CompA,
            props: router => { useid: router.params.id }
        }
    ]
})
```

> 在上面代码中，我们通过 props 对应的箭头函数，将当前路由 router 的参数 id 成功转化为另外一个对象，其中对应的属性名为 useid，然后将这个对象的值键对作为属性参数传递给组件。

<br>

#### 路由模式

准确来说是 Vue 基于 HTML5 的路由模式。

路由模式分为 3 种：

1. 哈希模式(hash)：相当于单页面模式，并且使用 # 模式，即跳转不通过路由后，网址仅发生 # 后面的变化，历史记录中不存在前进后退。

2. 历史记录模式(history)：相当于不同网址，有前进后退的历史记录，每次跳转网址会自动发生变化

   > 前提是浏览器支持这种模式，当然绝大多数浏览器都是支持的

3. 抽象模式(abstrct)：只要支持 JS 的环境即可，例如 浏览器或 Nodejs 。

   假设 Vue Router 发现当前并不是处于浏览器模式，而是处于 Nodejs 服务器模式，那么就会强制转成 抽象模式。



<br>

实际中更多倾向于使用 历史记录模式(history)，因为这个更加符合用户操作体验。

但问题是，我们知道 Vue 项目入口实际上就只有一个  index.html，所谓路由网址的变化都仅仅是 Vue Router 内部实现的，例如：/aa/bb，实际服务器上并不存在这个目录结构。

当我们选择将构建好的 Vue 项目发布到服务器上时，还需要针对后端 Web 服务程序进行相应的路由设置，以避免出现 404 情况。



<br>

**后端 Web 服务程序相对应的路由配置**

后端 Web 服务程序有非常多种，例如 Nginx、IIS、Apache、Nodejs 等等。

如果是 Nginx ，那么需要在当前站点的配置文件中，做以下配置：

```
location / {
  try_files $uri $uri/ /index.html;
}
```

> 将当前站点下所有路径请求都返回 index.html



<br>

**Vue 对应的 404 设置：**

对于 Vue 项目而言，最好要添加 404 处理，以给用户明确的提示。

> 如果你不做 404 处理，那么客户请求不存在的网址则永远会显示 首页

```
const router = new VueRouter({
    routes:[
        ...,
        { path:'*',component: NotFoundComponent }
    ]
})
```

> 上面代码中，假定我们有一个显示 404 内容的组件 NotFoundComponent



<br>

#### 导航守卫

当用户通过点击 `<router-link>`标签 或者通过 JS this.$router.push() 来操作跳转当前路由地址(URL) 时，Vue 提供了一套机制，可以让你有机会进行改变或者取消此次跳转。

应用场景举例：

假设现在正处于提交表单的视图中，此时因为用户的某些操作，发生路由要跳转到其他 “页面”。

1. 用户可能直接通过修改网址进行跳转
2. 也可能通过鼠标点击其他栏目进行跳转

如果真的直接就跳转到其他页面，当前表格中已输入的内容就可能会随之消失，此时通过添加路由 “守卫”，让 我们有机会取消此次跳转，或者弹框告诉用户是否跳转还是继续停留在当前页面中。

这个 “守卫” 机制就叫做 “导航守卫”。

> 当然你也可以把他称作为 路由守卫



<br>

**导航守卫的几种设置方式：**

1. 全局前置守卫
2. 全局解析守卫
3. 全局后置钩子函数 (这并不是一个路由守卫)
4. 路由规则独享的守卫
5. 组件内监控路由变化 (这并不是一个路由守卫)
6. 组件内的守卫



<br>

**全局前置设置：**

所谓 “前置”，即针对每一次路由跳转，都需要先执行的函数。

```
const router = new VueRouter({ ... })
router.beforeEach((to,from,next) =>{
    ...
})
```

路由跳转实际上是一个异步的过程，假设添加有 .beforeEach()，那么每次路由跳转前一定先执行完 .beforeEach() 后才会开始真正跳转。

因此你有机会在 .beforeEach() 的函数中取消本次跳转。

其中 .beforeEach((to,from,next)=>{ ... }) 对应的 3 个参数为：

1. to：类型为 Router，即将进入的目标路由对象

2. from：类型为 Router，当前导航即将要离开的路由对象

3. next：Function，一定要调用该方法来结束当前的异步进程。

   1. 若执行 next()，则 意味着进入下一操作环节

   2. 若执行 next(false)，则意味着中断(终止)路由跳转，并将浏览器中的 URL 恢复成当前路由对应的 URL

   3. 若执行 next('/') 或 next({ path:'/' })，或者是其他任意的路由路径，则意味着即将要跳转到另外一个不同的 URL 中。同时与允许你添加任何符合 router-link 标签规范的属性，例如 replace。

   4. 若执行 next(error)，则意味着路由跳转将会被终止，且对外抛出一个 错误事件，该事件会被 router.onError() 捕获，并执行相应的回调函数。

      > 当然，假设你从未添加过 router.onError()，那么也意味着这个错误将 “默默” 的发生并消失。

   请记得，无论执行的是上面哪种情况，next 函数只应该被当前守卫执行一次。

举例：

假设当用户想要访问某个视图前，我们都对其进行一次身份验证。

1. 若发现用户没有登陆，那么就将路由跳转到用户登录页

   > 假设用户此刻本身就访问的是登录页，那么这个情况下除外

2. 若发现用户已登录，则跳过此次守卫，让路由按照客户想要的进行跳转。

对应代码：

```
router.beforeEach((to,from,next)=>{
   if(to.name !=='login' && !isAuthenticated ){
       next({name:'Login'}) // 若发现要跳转的目标视图并非登录页 且 用户身份没有验证，那么就跳转到登录页
   }else{
       next() //跳过此次守卫，进行下一路由环节
   }
})
```

请注意，你可以通过添加多个 .beforeEach()，他们会按照添加的先后顺序依次执行。



<br>

**全局解析守卫：**

通过 router.beforeResolve() 添加一个全局解析守卫。和 router.beforeEach() 很类似，区别在于 先执行 .beforeEach()，然后才执行 .beforeResolve()。



<br>

**全局后置钩子：**

通过 router.afterEach((to,from) =>{ ... }) 可以添加全局后置钩子。

请注意全局后置钩子表示当路由跳转已发生完成后才会触发的钩子函数，因此在这个函数中是没有 next 函数的。

> 路由已经跳转，既成事实，所以无法使用 next 来进行路由拦截和守卫。



<br>

**路由规则中独享的守卫：**

也就是在配置路由规则时，添加 `beforeEnter` 对应的回调函数。

举例：

```
const router = new VueRouter({
    routes:[
        {path:'/foo',component:Foo, beforeEnter:(to,from,next)=>{ ... }}
    ]
})
```

也就是说，当命中该路由规则时，准备跳转到这个路由前(beforeEnter) 触发的守卫函数



<br>

**组件内监控路由发生变化：**

在组件内部，可以通过添加 `watch:{$route(to,from){}}` 来监控路由的变动。

```
const User = {
    template:'...',
    watch:{
        $route(to,from){
            ...
        }
    }
}
```

> 请注意，这仅仅是监控路由变化，参数中也不包含 next 函数，因此无法取消或者改变路由跳转



<bt>

**组件内的守卫**

在组件内部，通过添加一些路由钩子函数，来对路由的变化进行一些操作。

1. beforeRouteEnter(to, from, next)：

   当路由发生变化，刚刚准备创建该组件时触发的钩子函数，在该函数中不可使用 this

   尽管不支持 this，但是 beforeRouteEnter 中的 next 却支持通过回调 访问当前组件的 “虚拟DOM”，例如：

   ```
   const User = {
       template:'...',
       beforeRouteUpdate(to,form,next){
           next(vm =>{
               vm.xxx //此时的 vm 和 this 相似但又不同
           })
       }
   }
   ```

   > 只有 beforeRouteEnter() 支持这种 vm 回调

2. beforeRouteUpdate(to, from, next)：

   当路由发生变化，且当前组件依然被重复调用时触发的钩子函数，在该函数中可以使用 this

3. beforeRouteLeave(to, from, next)：

   当路由发生变化，即将离开时触发的钩子函数，在该函数中可以使用 this

举例：

```
const User = {
    template:'...',
    beforeRouteUpdate(to,form,next){
        ...
    }
}
```



<br>

**总结：完整路由跳转的整个流程**

1. 导航被触发
2. 在失活的组件里调用 beforeRouteLeave 守卫
3. 调用全局的 beforeEach 守卫
4. 在重用的组件里调用 beforeRouteUpdate 守卫
5. 在路由配置里调用 beforeEnter
6. 解析异步路由组件
7. 在被激活的组件里调用 beforeRouteEnter
8. 调用全局的 beforeResolve 守卫
9. 导航被确认
10. 调用全局的 afterEach 钩子函数
11. 触发 DOM 更新
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入



<br>

#### 路由元信息

> 之所以叫 “元信息” 是因为对应的英文单词 meta 直译过来就叫 元信息

在每一条路由配置规则中，除了 path，component 以外，还可以添加一个 `meta` 的字段，meta 的值为一个对象，用于传递一些元信息(额外信息)。

> 之所以称呼为 额外信息、元信息 是因为这些信息并不是给 组件使用的

使用代码如下：

```
const router = new VueRouter({
    routes:[
        { path:'/xx', component:CompXxx, meta:{ ... }}
    ]
})
```

可以将 meta 的值设置为值键对形式的对象，这些值键对对应的信息可传递给组件内的 路由守卫 来使用。

由于可能存在 嵌套路由，所以对于全局而言，命中的路由记录作为数组存储在 路由实例的 .mateched 中，那么我们需要做的就是遍历这个数组，针对每一个元素(路由实例)进行相关设置，即读取该路由实例中获得到的 meta 信息。

**举例说明：**

假设我们需要对视图增加一个 “只有在登录下才可以被使用”的功能，那么我们可以在路由规则中，对某些路由配置添加一个 元信息(meta)，该元信息包含 requiresAuth 的字段，用于表明是否需要验证已登录。

假设我们路由规则中不添加 meta 信息，那么就意味着这个组件无需接收用户是否已登录检查。

实现步骤为：

1. 通过调用全局路由实例的 beforeEach() 函数添加一个路由守卫

2. 检查该视图所有的路由中是否至少有一个需要登录验证

   > 也就是说，假设当前视图中有一个组件需要必须登录后才可使用，那么就不渲染当前视图

3. 具体方法为：遍历 to.mateched ，检查每一个元素 .meta 中存在 requiresAuth 字段，且值为 ture 的路由

   > 若全部都不需验证，则执行 next() 跳过

4. 验证用户是否已登录，若未登录则通过 next() 将路由跳转到登录页

   > 若已登录则执行 next() 跳过

```
// meta:{requiresAuth:true}

//以全局导航守卫为例，检查元信息
router.beforeEach((to,from,next)=>{
    if(to.matched.some(record => record.meta.requiresAuth)){
        if(!auth.loggedIn()){
            next({path:'/login',query:{redirect:to.fullPath}})
        }else{
            next()
        }
    }else{
        next()
    }
})
```

> Array 的 .some() 函数用于检查数组是否至少有一个元素与之匹配，并返回 布尔结果。



<br>

**路由元信息的作用：**

在上面那个示例场景中，假设组件需要用户登录才可以使用，那么通过给路由添加元信息，并在全局路由守卫中进行检查，相当于把原本需要写在组件内的登录判断抽出，移动到全局路由守卫中。

这样相当于降低了组件本身的逻辑，提高了整个视图的性能。



<br>

#### 数据获取

假设路由获取了一个参数 id，组件或视图需要根据这个 id 来进行网络数据请求，并将结果显示出来。

那通常只有 2 种方案：

1. 先请求数据，后显示组件(完成导航)：

   在组件路由守卫中，例如 router.beforeRouteEnter() 去发起网络数据请求，等得到结果后再通过调用 next() 来进行组件渲染。 

2. 先显示组件(完成导航)，后请求数据：

   先正常显示(渲染)组件，在组件内部创建 loading 变量 和 请求 id 变量。并默认先显示 loading 界面，然后根据请求 id 变量来发起网络数据请求，在得到结果后更新对应内容。

   请注意，所谓 “根据请求 id 变量” 包含 2 层含义：

   1. 组件第一次挂载完成后，根据 id 立即发起请求
   2. 组件通过 watch 监控 id 的变化，当发现 id 更新后则重新发起网络请求

无论哪种方案，都需要考虑 网络请求错误 的情况。



<br>

**先请求数据，后完成导航**

假设当前页面为 PageA，需要跳转到 PageB。

那么我们需要做的事情是：

1. 在当前页面 PageA 上叠加一层显示加载的内容
2. 在路由守卫函数中发起网络请求
3. 当得到请求结果后，执行 next()，此时 PageA 和 PageA 上的 loading 内容消失，页面跳转(视图渲染) 为 PageB

```
//组件内可能的JS
export default{
    data:{post:null,error:null},
    beforeRouteEnter(to,from,next){
        getPost(to.params.id,(err,post)=>{
            next(vm => vm.setData(err,post))
        })
    },
    beforeRouteUpdate(to,from,next){
        this.post = null
        getPost(to.params.id,(err,post)=>{
            this.setData(err,post)
            next()
        })
    },
    methods:{
        setData(err,post){
           ...
        }
    }
}
```

> 既要考虑 beforeRouteEnter，有需要考虑 beforeRouteUpdate



<br>

**先完成导航，再请求数据**

假设当前页面为 PageA，需要跳转到 PageB。

那么我们需要做的事情是：

1. 将当前视图渲染 PageB
2. 默认视图中一部分区域显示 loading 内容
3. 组件监控 id 并开始发起网络请求，并将结果渲染到当前视图中

```
//组件可能的结构
<template>
    <div>
        <div v-if="loading" ></div>
        <div v-if="error" ></div>
        <div v-if="post" ></div>
    </div>
</template>

//组件可能的JS逻辑
export default{
    data：{loading:false, error:null, post:null},
    created:function{ this.fetchData() },
    watch:{ '$route': 'fetchData'}，
    methods:{
        fetchData(){
            ...
        }
    }
}
```

> 既要考虑 created，又要考虑 watch 去监控路由的改变



<br>

#### 页面视图滚动定位

我们可以设置当一个视图被显示后，页面滚动条显示到哪个位置。

通过给路由实例添加 `scrollBehavior` 的方法来实现。

```
const router = new VueRouter({
    routes:[...],
    scrollBehavior(to,from,savedPosition){
        //将期望的位置通过 return 形式返回
        return ...
    }
})
```

例如：

```
scrollBehavior(to,from,savedPosition){
    return { x:number, y:number }
}
```

或

```
scrollBehavior(to,from,savedPosition){
    return {
        selector:string,
        offset?:{x:number, y:number}
    }
}
```

> 请注意上面代码中的 "x:number" 表示 x 的值为一个数字，例如 “x:24”

如果返回的是 虚值(falsy) 或 空，则不做任何滚动。

> 所谓 虚值(falsy) 是指假设把这个值转换为 Boolean 类型其结果为 false 的值。



<br>

关于 scrollBehavior 的更多复杂用法，可参考 Vue Router 官网 API。



<br>

#### 路由懒加载

简单来说就是原本组件应该是整体打包成一个 .js 文件，现在为了考虑拆分文件大小，将一些组件的内容先不打包到整体中，只有当使用到该组件时才进行加载。

**实现方式：**

加载我们原本定义组件的方式为：

```
const Foo = { ... }
```

修改成：

```
const Foo = () => import('./Foo.vue')
```

> 这样 webpack 就不会将 Foo.vue 的内容打包到整体中，但是独立拆分成一个文件。
>
> 当 Foo 组件真正被调用时才会真正加载这个文件

无论组件是否采用懒加载的形式定义，对于路由而言是没有区别的。

> 路由只知道当命中某个 url 时需要将一个名为 Foo 的组件渲染到 route-view 中，但至于 Foo 组件究竟是否使用了懒加载，路由是不关心的。



<br>

**将多个组件打包到一个文件中**

假设现在有 3 个组件，都希望不打包到整体中，但是这 3 个组件又不想各自独立被打包成 3 个文件，而是希望将他们 3 个打包在一个文件中。那么这个时候就需要使用 webpack 的 魔法注释 了。

<br>

这个魔法注释就是：`/* webpackChunkName:"group-foo" */`

> 关于 webpack 其他类型的魔法注释，请查阅相关文档

```
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

这样 3 个组件 Foo、Bar、Baz 就会都被打包到一个 group-foo 的文件模块中。



<br>

#### 监控导航(路由)跳转出错

通常情况下，我们是无需监控路由跳转失败或发生错误的。

1. 因为即使路由跳转到一个不存在的地址，即 404，路由也不会报错
2. 通常情况下路由都会按照我们的预期进行发生

但是假设某些异常，或者是我们在某些路由守卫中

1. 使用 next(error) 人为得抛出一些错误

2. 使用 next(false) 中断此次路由跳转

   > 由于跳转被中断，实际上相当于路由没有按照预期进行跳转，因此也被视为 异常情况

对于这些特殊情况，是可以通过在路由跳转时添加 catch 来捕获的。

```
router.push('/admin').catch(failure =>{
    ...
})
```



<br>

**判断是哪种类型的错误异常**

在 catch 的回调函数中，Vue 为我们提供了一个 `isNavigationFailure()` 的函数，用于检测发生错误的原因。

这个函数接受 2 个参数：

1. failure：发生错误对应的此次错误，实际上就是将 catch 捕获到的 failure 传递给 isNavigationFailure() 函数
2. string(常量，可选参数)：用于判断是否是以下哪种原因造成的异常
   1. NavigationFailureType.redirected：导航守卫将路由进行重定向
   2. NavigationFailureType.aborted：导航守卫中断了本次导航
   3. NavigationFailureType.cancelled：在当前导航还未顺利完成前，在其他某些地方又调用了新的导航跳转
   4. NavigationFailureType.duplicated：导航被阻止，例如我们此刻本身就处在这个目标导航中

假设不传递第 2 个参数，只是认定这是一次导航故障，则不做过多原因的细分和检测。



<br>

**获取失败的具体对象细节**

在 failure 回到函数内部，我们可以根据 failure 来作出相应的代码。

其中：

1. failure.to 表示要跳转的目标路由

   > failure.to.path 即我们最开始希望跳转的目录路径

2. failure.from 表示跳转前的路由



<br>

#### Vue Router 的 API 细则

在上面我们只是讲解了 Vue Router 最基础，常见的用法。

更多 API 需要去查看官方文档。

https://router.vuejs.org/zh/api/



<br>

## 5、Vuex状态管理

