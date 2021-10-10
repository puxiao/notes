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
7. 卸载之前：beforeDestroy
8. 卸载完成：destroyed



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

   > 至于属性值是什么类型，目前 Vue 无法定义

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

