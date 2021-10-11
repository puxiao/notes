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

暂且跳过这部分，接下来开始学习使用 vue cli3 来创建工程化的 vue 项目。



<br>

## vue/cli创建项目

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
   3. 手工选择特性 (可以选择包含 typescript)
4. @vue/cli 官网上面的某些操作步骤界面已经和当前最新版本略微不同，不过这些不同都不是特别重要的，只要创建一次就明白了。



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

至此，一个基本的 Vue 开发环境配置完成，接下来就可以开始写代码了。

