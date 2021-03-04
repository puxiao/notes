# 《自顶向下学习React》学习笔记

> 凡是出现 引用形式的文字，都包含有我个人的理解，并非完全的课程原话。



## 需要额外学习的知识点

1. 数据结构：栈、队列、链、树
2. ReactTest：在 React中单元测试
3. ReactArt：在 React 中绘制 画布 或 SVG
4. 代数效应(Algebraic Effects)
5. Yarn安装与命令
6. 浏览器调试工具：性能(Performance)面板



## 第一章：理念篇

### 1.1 如何学习React源码

**React更新(render)的3个阶段(3大模块)**

1. **调度**：产生更新
2. **协调**：决定需要更新什么组件
3. **渲染**：将更新的组件渲染到页面



### 1.2 React设计理念

**React的设计理念是构建快速响应的大型 Web 应用程序**。

那么，到底什么在制约响应速度？  
答：CPU(计算)、I/O(读写 网络延迟)



**CPU(计算)**

主流浏览器刷新频率为 60Hz，即 16.6毫秒 浏览器刷新一次。

在这 16.6毫秒中会依次执行：JS 脚本执行  >  样式布局  >  样式绘制

> 样式布局 和 样式绘制 这两条执行性能是由浏览器负责的，不同浏览器执行速度不同，例如 谷歌浏览器相对其他浏览器执行速度比较快
> 唯独 `JS 脚本执行` 是由前端开发人员来负责的

若 JS 脚本执行 在 16.6毫秒内并未执行完毕，那么就会出现 卡顿、掉帧、不流畅 这样的情况。

> 卡顿、掉帧、不流畅 就会让用户感受到 `这不是一个不快速响应的Web操作体验`



**JS 脚本执行的4种形态**

1. 同步更新
2. 防抖(Debounced)：一段时间内只执行一次
3. 节流(Throttle)：限制触发更新的频率
4. 异步更新

> 本质上 防抖和节流 都是通过限制触发更新的频率来减少 掉帧 的可能性，但是这种都是治标不治本，随着 JS 脚本执行 的工作量越来越大，即使限制更新频率，依然有可能会出现 一次 JS 脚本执行所需时间超出 浏览器 刷新一帧的时间(16.6毫秒)

**React 执行的策略是：异步更新——异步可中断的更新**

何为异步可中断更新？可中断 怎么理解？  
答：React与浏览器进行约定：若在浏览器给定的时间内，JS 并未 执行完成，那么就会中断(准确说是暂停)本次执行工作，并将控制权 交给浏览器，浏览器可以进行后续的 2 步操作(样式布局、样式绘制)，当下一帧到来时，React 会继续(恢复)之前暂停的工作。

正因为 React 选择异步可中断的执行更新策略，这会让浏览器始终按照计划进行样式操作(样式布局、样式绘制)，这样就会使用户操作界面最大化地 无卡顿、掉帧、保持流畅。

> 人眼球能够捕捉到的帧频为 每秒 24帧，也就是是说 浏览器执行 2 帧左右才是我们人眼能感知到的。
>
> 如果发生 浏览器 2 帧之内 依然无法 JS 执行完成，那么人眼就可能感知到 卡顿了。
>
> 超过 2 帧 真的就会感觉到卡顿？   
> 事实并不是这样的，因为上面只是说 2 帧 用于计算，但是从计算结果到实际浏览器渲染，往往还有一个环节：新UI与老UI进行切换，而切换是需要过程的(转场过渡动画)，这个过程不可能是 0 秒，那么 React 就可以利用 切换过程中的 时间间隙 来弥补 计算所用到超过 2 帧的时间。最终你并未感受到卡顿。



**I/O(读写 网络延迟)**

如何解决 I/O 瓶颈，比如需要请求结果才能进一步作出响应的场景下，用户如何才能感受到 快速响应。

**React是如何解决 I/O 瓶颈的？**  
答：React通过将人机交互研究的结果整合到真实的UI中。React 执行的是 同时发生(concurrent) 模式。

> 请注意，这里并不是说从物理底层提高 I/O 性能，而是一种`狡猾的策略`——同时发生(concurrent)策略。  
> 就像 异步可中断更新 中提到的，当用户UI界面要发生变化时，一般都会有过渡动画，而React就利用这个过渡动画所需要的时间，来偷偷继续执行 I/O 操作，并尽可能赶在过渡动画执行完成之前将最新数据渲染到界面中。这样用户就不会感受到卡顿，用户感受到的是流畅。

> 假设有这样一个场景：当前有模块A，此时发生用户操作，需要先加载某数据(I/O操作)，将得到的新数据渲染到另外一个模块B，模块B渲染成功后进行 A B 之间的切换过渡动画，最终 模块 A 消失，只留下模块 B。  
> 上述场景中，React 并不会真的  一步一步 逐个执行，而是采用 同步发生的策略。实际执行的过程是：  
>
> 1. 开始加载某数据(I/O操作)，于此同时开始执行 A B 的过渡动画
> 2. 当加载某数据(I/O操作)结束，无论此时过渡动画是否完成，都将数据渲染到 模块 B 中

> 如果使用 同时发生模式测试，那么用户感知到的交互操作所需时间是：过渡动画时间 减去 I/O 操作事件
>
> 如果不使用 同时发生模式策略，那么用户感知到的交互操作所需时间是：I/O 操作事件 加上 过渡动画时间

交互研究发现，延迟显示加载过程，会让用户感觉响应时间更快。

> 说直白点，如果用户看到页面在切换过程中的 loading 状态，即使这个时间非常短，用户也会明确感知到，进而用户会觉得切换时间有点长。
>
> 同时发生模式策略，就是先隐藏了切换过程中的 loading 状态，刚开始 I/O 的同时就进行场景切换，此时虽然数据实际并未加载完成，但 React 就好像 数据已经加载完成一样似地，开始同步进行页面切换。

同时发生(concurrent)模式策略会让用户感觉交互操作响应时间更少。

这就是将人机交互的成果融入UI交互中。

> 人机交互的成果：人机交互的用户体验经验分析结果、说直白点就是人机交互操作的心理分析和如何欺骗你眼睛感知的套路。

React 未来发展方向，就是不断在框架层面实现、优化 异步更新机制。



**React会持续增加特性最终变成像Vue或Angular一样的框架吗？**

答：React 会继续是一个UI库，React 更关注如何让底层抽象更有表现力。相对而言，增加更便捷的动画API、数据获取等这些特性，并不是 React首要考虑的目标。

> 也就是说，React 更加注重底层的 JS 模块交互逻辑，而非表现层的动画或样式。



### 1.3 React架构的演化史

**老的React架构(react 15)**

**由 2 部分组成：**

1. Reconciler(协调器)：决定渲染什么组件，Diff 算法就包含在协调器中

   > Diff 算法官方的名字叫：reconcile(协调)

2. Render(渲染器)：将组件渲染到视图中，渲染器分为 4 大种类

   1. ReactDOM渲染器：渲染DOM到浏览器、SSR(服务器生成网页DOM)
   2. ReactNative渲染器：渲染 App 原生组件
   3. ReactTest渲染器：渲染 JS 对象
   4. ReactArt渲染器：渲染 canvas、SVG

   

**用模拟场景来进一步说明：**

假设有这样一个组件(页面)，功能需求如下：

1. 组件内定义一个变量 num = 1(初始化值)

2. 一个按钮，点击按钮 num += 1

3. 一个 ul 标签，标签内有 3 个 li，3 个 li 的值分别是：num、num * 2、num * 3

   > 为了方便后面更加容易描述，我们将使用 li0、li1、li2 分别依次表示 这 3 个 li



那么当点击一次按钮后到页面中 3 个 li 更新显示完成，都经历了什么过程呢？

1. 点击按钮 修改 num 的值
2. 协调器 发现 li0 中的值需要修改，通知渲染器
3. 渲染器 更新DOM，视图中的 li0 发生变化
4. 协调器 发现 li1 中的值需要修改，通知渲染器
5. 渲染器 更新DOM ，视图中的 li2 发生变化
6. 协调器 发现 li2 中的值需要修改，通知渲染器
7. 渲染器 更新DOM，视图中的 li2 发生变化，至此 本次 更新结束



进一步分析：

上述执行过程看似是有先后执行顺序的，但是由于 React 采用 同时发生(concurrent)模式策略，实际上是同时发生的。这样看似是没有问题的，但问题在于 React 为了快速响应，除了 为了提高 I/O 响应速度 而执行的 同时发生(concurrent)模式策略外，还有针对 CPU 计算而做的另外一个策略——异步可中断更新。

虽然刚才举的例子中，并不需要做复杂的，大量的计算，但是我们这里就假设此次更新计算就是非常复杂，超出 16.6 毫秒，那么就会触发 React 的 异步可中断更新 策略。那又会发生什么事情呢？

1. 点击按钮 修改 num 的值

2. 协调器 发现 li0 中的值需要修改，通知渲染器

3. 渲染器 更新DOM，视图中的 li0 发生变化

4. 假设上面的操作已经超过了 16.6毫秒，那么触发 异步可中断更新，此时中断后续 li1、li2 的更新

   > 按照 React 的策略，应该等到浏览器 下一帧时，再继续之前中断的更新

5. 那么此时，对于视图层中，只有 li0 发生了更新，而 li1、li2 并未更新，那么这个从视觉层面上来看，似乎就是 bug 了。

   > 或者可以说，更新过程中出现了 卡顿，不流畅



**新的React架构(react 16+)**

新的 React 16 + 架构，在 react 15 的基础上，新增了一个部分：**Scheduler(调度器)**

最终，新的 React 由 3 部分组成：

1. Scheduler(调度器)：更新调度
2. Reconciler(协调器)：决定渲染什么组件(Diff 算法就包含在协调器中)
3. Render(渲染器)：将组件渲染到视图中

后 2 者 的职责是没有发生变化的，那么重点说一下新增的 shceduler(调度器)。



**Scheduler(调度器)**

在 React 16+ 中，每个更新会被赋予一个优先级，高优先级的更新会被优先调度，这个模块就被称为调度器。

1. 低优先级
2. 中优先级
3. 高优先级

调度器会根据被调度的优先级顺序，将 比较高的优先级更新 先交给 协调器 进行 Diff 运算。

若协调器正在进行 Diff 算法的过程中，又发现了更加高的优先级 更新，则将 协调器中正在进行的更新暂停并撤回，然后将最新的、更高的优先级更新 放入 协调器中进行 Diff  运算。

由于 调度器和协调器 都是在内存中工作，并未进行具体的视图层操作(渲染器操作)，所以即使有中断发生，用户也不会看到有 更新不完全 的视图。

当高优先级别的更新在协调器中(Diff算法)运算完成后，交由渲染器进行视图层的渲染更新。此时协调器会将优先级较低的更新再次交给调度器，执行 Diff算法......直到所有更新全部执行完毕。



**依然用模拟场景来进一步说明**

我们还用 `老的React架构(React 15)` 中所举的例子进行说明。

1. 点击按钮，产生一个 更新，更新内容为 修改 num 的值。
2. 调度器 接收到更新，检查是否有其他更高优先级的更新需要先被调度，若没有则将这个更新(num的值被修改)交给协调器。
3. 协调器 接收到更新，创建虚拟 DOM 树：
   1. 将 li0 的值修改为最新的值，并打上 Update 的标记
   2. 将 li1 的值修改为最新的值，并打上 Update 的标记
   3. 将 li2 的值修改为最新的值，并打上 Update 的标记
   4. 将打了 Update 标记的虚拟 DOM 树交给渲染器
4. 渲染器 接到通知，查看有哪些被打 Update 标记的虚拟 DOM，并将 虚拟 DOM 转化为实际的 DOM，至此一次更新完成。



> 总结：
>
> 1. 说直白一些就是 React 15 中，异步可中断更新 发生在 Diff算法和渲染器视图 中，则会导致某瞬间 视图层只更新一部分，而没有同时全部更新。
> 2. 而 React 16+ 则通过新增 调度器，将 异步可中断更新 发生在 调度器 和 Diff 算法 中，由于 调度器和 Diff  算法都是在内存中进行的，所以 视图层 是不会出现值只更新一部分的情况。
> 3. 这里面还是 React 快速响应理念中：将 人机交互的研究成果运用到实际 UI 交互中 的原则，**假设我们把中断时间放大**，那么有以下 2 种情况
>    1. React 15：第 0.1 秒内页面视图更新一半，第 0.2 秒内页面视图更新完成，共花费 0.2 秒
>    2. React 16：第 0.1 秒内页面视图无任何更新(此时只是在内存中，调度器和协调器在做着运算)，第 0.2 秒内页面视图一次性更新完成，共花费 0.2 秒
>    3. 虽然看似完成一次更新总时间是相同的，但是对于用户心理感受来说，React 16 的更新方式会让人觉得 “一瞬间完成了所有更新”，会让用户有 “快速响应” 的错觉。



### 1.4 React新架构——Fiber

特别说明：Fiber单词原本的意识是——纤程，而 React 中的 `Fiber架构` 含义为 `React开发人员创造出的一种类似纤程的架构`。

React Hooks 核心开发人员说过：**React Hooks 做的就是践行 代数效应(Algebraic Effects)**

那么什么是 代数效应 ？

**代数效应(Algebraic Effects)**

代数效应是函数式编程中的概念，用于将副作用从函数调用中分离。

> 副作用：`在计算机编程中 副作用 ` 这个词和日常中 `吃某类药物 带来的 副作用` 含义有相似之处，在编程中 副作用 指 当你做完某件事情之后，额外发生的一些事情处理。
>
> 主作用(正作用)：在编程中，例如某函数传入参数，经过函数内部运算后，将结果返回出去，这个返回值即 真正的作用。而  `副作用`  的意思就是 除了 真正的作用 之外，额外发生的一些事情或事情处理函数。

> 一般情况下，副作用 不能也不应该去影响 主作用。

> 副作用的对立面是 纯函数。
>
> 何为纯函数？只要参数相同，每次返回结果也一定相同，那么这个函数就可以称为纯函数。例如 执行求和计算的函数，只要参数相同，每次返回的 和 值也一定相同。
>
> 纯函数的一个特点是函数内不 允许有异步。但是例如 读取本机 xx 文件内容，假设我们每次给读取文件的函数传递的参数(文件路径)虽然相同，但是并不能保证每次都能顺利读取成功(该文件可能在后面读取过程中出现错误)，那么这样的函数就不能称为 纯函数。



**用场景来进一步说明**

假设有以下代码：

```
function getTotalNum(user1,user2){
  const num1 = getPicNum(user1)
  const num2 = getPicNum(user2)
  return num1 + num2
}

// getPicNum 为我们虚构的一个函数，用来查找 用户所拥有图片的数量

function run(){
  getTotalPicNum('yang','puxiao')
}

run()
```

假设 getPicNum(xx) 这个函数是 异步的，由于在 JS 中若 函数中某行代码是异步的，会让整个函数也跟着变成异步，那么上面代码就需要修改成：

```
async function getTotalNum(user1,user2){
  const num1 = await getPicNum(user1)
  const num2 = await getPicNum(user2)
  return num1 + num2
}

// getPicNum 为我们虚构的一个函数，用来查找 用户所拥有图片的数量

async function run(){
  await getTotalPicNum('yang','puxiao')
}

run()
```

可以看出，原本我们写的 run() 方法也需要跟着进行变动，破坏了原有的写法。

那么除了使用 async/await 之外，有没有别的办法，即使 getPicNum() 是异步的，但是 getTotalNum() 继续保持同步的写法 ？  
答：在目前的 JS 中是没有办法实现的。

虽然目前不能在 JS 中实现，但如果想实现，有什么思路呢？

以下为我们虚拟，设想的代码：

```
function getTotalNum(user1,user2){
  const num1 = getPicNum(user1)
  const num2 = getPicNum(user2)
  return num1 + num2
}

function getPicNum(name){
  //这里是虚拟的一种写法
  const picNum = perform name
  return PicNum
}

// 以下代码中 try ... handle 也是虚拟的写法，在JS中并不会真实存在
function run(){
  try{
    getTotalPicNum('yang','puxiao')
  } handle(who){
    switch(who){
      case 'yang':
        resume with 18
      case 'puxiao':
       resume with 15
      default:
      resume with 0
    }
  }
}

run()
```

假设我们把 原本异步操作 思维，替换成我们熟知的 try... catch 思维：

1. 执行第一行代码，并捕获错误(执行结果)，
2. 再把错误(执行结果)返回给上一级，
3. 继续后续的代码
4. 最终将所有操作均执行完成，用看似同步的方式来实现了异步

> 以上仅仅是 假想 的代码逻辑，对于 React 来说，真正实现 Fiber 的代码有另外的实现方式

> React Fiber 架构就是利用了 代数效应中 中断、恢复 的特性 来实现了 `异步可中断的更新`。

> 如果理解不了上面 假想的代码，不明白在说什么，也没有关系，继续往下看就好



你可能会有一个疑问，async/await 用得好好的，为啥还要费劲得去想别的写法？  
为什么非要把异步弄成看似同步的写法 ？  
别着急，继续往下看。

**看一个React Hooks 例子**

以下是真实可用的 React 代码：

```
function App() {
  const [num,setNum] = useState(0)
  return (
    <button onClick={()=>setNum(num => num + 1)}>{num}</button>
  )
}
```

上面代码中，使用到了 useState 这个 hook，并且这段代码非常好理解，但是你可曾想过一个问题：**为什么 更新 num 是异步的，但是上面代码中并没有出现任何 异步 的语法，而是像写 同步 一样写出来的 ？**

这背后就是靠着 React Fiber 架构，将原本应该异步的写法 包装成 同步的写法，让我们不需要考虑使用 async/await 的情况下，就好像写同步的方式编写我们的 React 组件代码。

这样做，大大降低了我们编写代码的复杂性。

> React Fiber 架构究竟怎么做到的，这部分会在 1.4 章节中详细讲述



**计算机中的一些名词**

1. 进程(Process)
2. 线程(Thread)
3. 协程(Coroutine)
4. 纤程(Fiber)：我们可以将纤程理解为协程的一种实现

在 JS 中，协程 是靠 generator 来实现的。

> generator 是一种 链式结构，即可以通过 next() 不断指向下一个对象(节点)，直至 next() 为 null
>
> async/await 仅仅是 generator 的语法糖

那么 React 开发人员为什么没有用 generator来实现，而是要自己创建一种 React Fiber 架构呢？  
答：Fiber 架构的初衷，是要达到 2 个目的：更新可以中断并继续、更新可以拥有不同的优先级，高优先级可以打断低优先级的执行。generator 属于 链式结构，在一个调用链上确实可以通过 next() 不断找到下一个节点，也可以通过修改 next() 指向来更改节点顺序，但是无法实现设置优先级，并且高优先级可以打断低优先级的执行，这一点是 generator 无法满足的。



### 1.5 Fiber架构工作原理

**Fiber的三层含义**

**第1层含义：Fiber 指 针对协调器的具体工作方式描述**

老的 React 架构中只有 协调器和渲染器，采用递归的方式执行，数据被保存在递归栈中执行，因此协调器也被称为 调用栈协调器(Stack Reconciler)。

新的 React 架构中新增了 调度器(Fiber，纤程)，协调器也是针对 Fiber 节点而工作的，因此协调器也可以称为 纤程协调器(Fiber Reconciler)。

**第2层含义：Fiber 指 作为组件(虚拟DOM)的静态数据结构**

作为静态数据结构来说，每个 Fiber 节点对应一个组件，保存了该组件的类型、对应的DOM节点等信息，这时的 Fiber 节点也就是我们所说的虚拟DOM。

补充说明：一个 React 页面，构成部分为：

1. 整个应用的唯一顶部根节点——FiberRootNode

   ```
   ReactDOM.render(<App/>,document.getElementById('root'))
   ```

2. 若干个根节点——RootFiber

   > 以下为个人理解的补充内容：

   ```
   App.js 中的 return()
   
   问题1：return() 的本质是什么？
   答：return() 是 jsx 语法结构，他的本质其实是 React.createElement() 函数的语法糖。
   
   问题2：为什么说是 若干个根节点？ 
   错误的回答：因为在 return() 中是可以添加条件判断语句，根据不同条件返回不同组件内容的，因此可以说是 app.js 中的 renturn() 可以产生若干个根节点。
   正确的回答：FiberRootNode可以执行多次渲染，因此可以产生多个根节点。事实上这里所说的 "多个根节点"实际上是首次渲染或更新渲染每次创建的根节点，这些会在 react 双缓存工作机制中有详细讲述。
   ```

3. 每个根节点下唯一子节点——App

   > app.js renturn() 出去的具体内容

4. App节点下的各种原生组件(原生节点)——<xxx/\>

   > 自定义组件最终也会被转化成原生组件

5. 原生组件中具体的内容(具体的值)——value

6. value 由 2 部分构成：静态值xxxx + 动态值${xxx}

   > 例如某文本的值可能为：`my name is ${nameStr}.` 

以上 6 个层面的节点，他们之间 “链式结构” 关系为：

1. FiberRootNode.current = RootFiber

2. RootFiber.childe = App

3. App.child = <xxx/\>

4. <xxx/\>.child = 原生组件的值(这里保存该值的是一个对象)

5. 原生组件的值.sibling = 动态的值

   > sibling 单词的意思为：兄弟姐妹

以上 6 个层面的节点(姑且称为节点)又分别有各自的 return 对象，他们的关系为：

1. 原生组件的值中的动态值.return = <xxx/\>
2. 原生组件的值.return  = <xxx/\>
3. 原生组件return  = App
4. App.return  = RootFiber
5. RootFiber.return  = FiberRootNode

**核心重点来了**

请思考：作为 链式结构，通常情况下只需要拥有 next() 指向下一个节点即可，那又为何每个节点需要拥有 return 属性又指向上一级别？

> React 使用的并不是 next()，而是 current 或 child 或 sibling。

答：因为 React 并不是简单的 链式结构 思想，而是——异步可中断的更新思想，如果想实现 可中断，那么在中断之前必须知道上一节点是什么，否则中断之后会处于迷茫状态，所以才会有了 每个一节点 拥有 return 属性来找到上一节点的能力。

> “节点的 return 属性” 这个描述似乎不太恰当，你可以换一种说话： “节点通过 return 可以找到上级节点"

> 额外说一点，对于 Koa 洋葱模型来说，它的应用场景中，在执行某一个中间件时，是不需要考虑上一层中间件发生变化的，因此对于 Koa 中间件来说，他就属于传统的单向链式结构。

**第3层含义：Fiber 指 动态工作单元**

Fiber 节点保存了组件需要更新的状态、副作用。

**关于 Fiber 3 层含义的总结：**

1. Fiber 指 针对协调器的具体工作方式描述
2. Fiber 指 作为作为组件(虚拟DOM)的静态数据结构
3. Fiber 指 动态工作单元(需要更新的状态、副作用)



**Fiber使用 双缓存 工作机制**

**什么是 双缓存**

以 逐个动画(GIF) 为例，显示 一组 动画的过程是：

1. 读取并显示第 1 帧 画面
2. 清除第 1 帧画面
3. 读取并显示第 2 帧 画面
4. 依次重复这个循环操作

这种 读取 > 清除 > 读取 的循环操作存在的一个问题是：假设 读取 时间比较久，那么 从清除上一帧画面到下一帧画面的间隙，我们可以看到 中间的空白阶段。

如何减小 空白阶段的停留时间呢？ 可以靠改变 `读取` 的过程。

1. 将第 1 帧画面 读取到内存中
2. 显示第 1 帧画面，同时悄悄在内存中读取第 2 帧画面
3. 清除第 1 帧画面，将内存中第 2 帧画面数据显示出来，并且同时悄悄在内存中读取第 3 帧画面
4. 依次重复这个循环

那么上面的操作，使用到的缓存策略就是 双缓存，**这里的 “双” 是指：当前帧 和 下一帧，2 帧内容**。

**Fiber双缓存流程：React首次渲染流程和更新渲染流程**

**React首次渲染流程：**

1. 首次创建整个项目(页面)的 FiberRootNode

2. FiberRootNode创建一个空白的根节点(RootFiber)，我们暂且称呼这个空白的根节点为 A

   > 此时 FiberRootNode.current = A，且页面显示为空白

3. 开始进入首屏渲染阶段，此时无论是首屏渲染，或调用 this.setState() 或 使用 hooks 修改数据，都会从根节点 A 创建一个新的空白根节点 B (同 A 一样，B 也是一个 RootFiber)

   > 两个根节点通过属性 alternate 彼此互相连接指向对方：A.alternate = B、B.alternate = A

4. 接下来采用深度优先遍历，创建 App，并依次不断创建 各个层级的节点内容

   > 具体的各个层级节点，请回顾 `Fiber第2层含义：作为组件(虚拟DOM)的静态数据结构` 中提到的 6 个层级

5. 至此，我们拥有 2 个根节点(RootFiber)，这 2个 根节点就是 2 个 Fiber 树，其中 A 被称为 当前Fiber树(current Fiber树)，B 被称为 内存进程中的Fiber树(workInProgress Fiber树)。

   > 在 二叉树 结构中，左侧的节点被称为 左子节点，右侧的节点被称为 右子节点。 此时 A 位于 左子节点中、B 位于 右子节点中。

6. 当 B (workInProgress Fiber树) 完成全部的虚拟DOM渲染后，将 FiberRootNode.current 指向 B，即 FiberRootNode.current =  B。修改之后，此时 B 由 workInProgress Fiber 树变成 current Fiber 树，位置从 右子节点变为 左子节点。

7. 至此，首次渲染结束。

**React更新渲染流程**

当首屏渲染结束后，发生用户操作引发数据状态发生变化，会引发更新渲染，更新渲染流程为：

1. React 发现用户操作，或 数据状态发生变化，准备要开始更新

   > 提醒：此时 B 已经取代了 A，成为了 current Fiber 树

2. 基于 B 创建一个新的根节点 C (RootFiber)，B 和 C 依然靠 alternate 属性 来互相指向对方。  

   > 当然你可以理解成 并没有创建 C，而是将原本 的 A 进行重新调整修改，也就是说 C 即 A

3. 在 B 和 C 下面的每一层之前，依然通过 alternate 属性来互相指向对方相同层级的对象

   > 具体的各个层级节点，请再次回顾 `Fiber第2层含义：作为组件(虚拟DOM)的静态数据结构` 中提到的 6 个层级

4. 将 B 和 C 下面的每一层(即 通过 alternate 找到对方相同级别的层)进行对比，这个过程就是 Diff 算法。

5. 当 C (workInProgress Fiber树) 完成全部的虚拟DOM渲染后，将 FiberRootNode.current 指向 C，即 FiberRootNode.current =  C。修改之后，此时 C 由 workInProgress Fiber 树变成 current Fiber 树。

   > 这一个过程和 首屏渲染最后一步过程是相同的

6. 至此，更新渲染结束

   首屏渲染和更新渲染的最大区别即是否进行 Diff 算法

   > 首屏渲染是 A 为空白，所以没有必要将 B 和 A 进行  Diff 算法



### 1.6 如何调试源码

**下载最新源码：**

```
git clone https://github.com/facebook/react.git
```

> 当前最新版本为 react 17.0.1



**安装依赖包：**

> 注意：下面命令中使用的是 yarn 安装依赖包的方式，而不是 npm。有关 yarn 的安装与使用，请参考我另外一篇文章：[Yarn安装与使用.md](https://github.com/puxiao/notes/blob/master/Yarn%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md)

```
yarn 或 yarn install
```

> 我在安装依赖包时，发生了报错，我估计应该并未大碍：
>
> ```
> [4/4] Building fresh packages...
> [-/12] ⠈ waiting...
> [-/12] ⠈ waiting...
> [-/12] ⠈ waiting...
> [-/12] ⠁ waiting...
> error F:\xxx\react\node_modules\electron: Command failed.
> Exit code: 1
> Command: node install.js
> Arguments:
> Directory: F:\react\react-src\react\node_modules\electron
> Output:
> RequestError: connect ETIMEDOUT 52.217.73.140:443
> ```



**构建本地React包：**

```
yarn build react,react-dom,scheduler --type=NODE
```

> 上面命令中，yarn build 是 yarn run build 的简写，build 是 package.json script 中定义的命令。

> 当构建命令执行完毕后，会在 源码目录下，创建 build 目录，build/node_modules/ 下存放着刚才构建好的包。



**创建软连接：**

```
cd ./build/node_modules/react
yarn link

cd ../react-dom
yarn link
```



**使用create-react-app创建一个测试项目：**

若还没有安装 create-react-app，则先执行安装命令：

```
//使用 npm 方式安装
npm i -g create-react-app --registry=https://registry.npm.taobao.org

//使用 yarn 方式安装
yarn global add create-react-app
```

> yarn 安装包的速度要比 npm 快很多，因此 yarn 安装不需要使用第三方提供的镜像源(淘宝镜像源)



使用 create-react-app 创建一个测试项目：

> 假设我们给测试项目目录名为 test-react

```
//切换到存放 test-react 的上级目录路径中
//注意，不要将 test-react 放到 react 源码目录中，应该单独使用另外一个相对独立的目录位置
cd xxxx

npx create-react-app test-react
```



**使用软连接：**

```
cd test-react

yarn link react react-dom
```

若收到以下信息，则表明已经将 test-react 中所用到的 react 和 react-dom 映射为 我们本地从 react 源码中构建的对应包：

```
yarn link v1.22.5
success Using linked package for "react".
success Using linked package for "react-dom".
```



**测试方式1：通过修改源码，测试是否映射成功：**

1. 修改本地构建的 react-dom 文件，例如：xxxxx/react/build/node_modules/react-dom/cjs/react-dom.development.js

   ```
   'use strict';
   
   //在此添加一行代码
   console.log('this message come from my current react-dom')
   
   if (process.env.NODE_ENV !== "production") {
     (function() {
   'use strict';
   ....
   ```

2. 切换到由 create-react-app 创建的 test-react 项目中，并启动该项目

   ```
   yarn start
   ```

3. 若能正常启动，且在启动后输出 `this message come from my current react-dom` 即表示 映射成功



**测试方式2：通过浏览器，测试是否映射成功：**

1. 启动测试项目：`yarn start`
2. 打开浏览器中的调试工具，切换到 Source(源代码) 面板
3. 在 **页面 > localhost:3000 > static/js > f:/xxx > build/node_modules/ > ...  检查是否为在本机React构建的包和文件**
4. 若存在本机 React 构建的包(包为本机的目录)，若存在即表明 测试项目中 使用软连接配置生效



### 1.7 源码目录结构

真正 React 核心源码，需要关注的只有 3 个目录：

1. **fixtures**：存放着一些给贡献者准备的小型 React 测试项目
2. **packages**：存放着 React 尚未编译的所有核心源码
3. **scripts**：存放着各种工具链的脚本，例如 git、eslint、jest 等

> 关于更加详细，完整的目录文件结构说明，请参考我的另外一篇文章：[React源码目录文件构成.md](https://github.com/puxiao/notes/blob/master/React%E6%BA%90%E7%A0%81%E7%9B%AE%E5%BD%95%E6%96%87%E4%BB%B6%E6%9E%84%E6%88%90.md)





## 第二章：架构篇至 render 阶段

### 2.1 架构工作流程概览

**浏览器调试过程：**

1. 启动测试项目：`yarn start`

2. 打开浏览器调试工具，切换到 性能(Performance) 面板

   > 谷歌浏览器(Chrom)的调试面板是英文的，而微软的 Edge 浏览器调试面板是中文的，对于新手或英文不好的人来说，优先使用 Edge 浏览器。

3. 点击 “记录(Record)”按钮 之后，刷新页面就可以看到页面不同时间段执行的过程

   > 点击 记录(Record) 按钮(此后需要你手动刷新页面)，对应的快捷键为：Ctrl + E
   >
   > 点击 记录(Record) 按钮并刷新页面，对应的快捷键为：Ctrl + Shift + E

4. 若要调试页面引用的 React 代码，则切换至 源代码(Sources) 面板，展开左侧折叠的菜单，找到本机 React 包文件，可以进行修改或打测试断点。

   > 左侧折叠菜单为：top(顶部) > localhost:3000 > static > js > f:/xxx > build/node_modules > react-dom



**浏览器执行阶段关键词：**

| 绘制过程(缩写字母)             | 对应含义                 |
| ------------------------------ | ------------------------ |
| DCL (Dom Content Loaded)       | 页面加载和解析完成       |
| FP (First Paint)               | 首次绘制                 |
| FCP (First Contentful Paint)   | 首次内容绘制             |
| LCP (Largest Contentful Paint) | 最大内容渲染             |
| L (onLoad)                     | 页面依赖资源全部加载完毕 |
| FMP (First Meaningful Paint)   | 首次有效绘制             |



**找到需要观察的 React 执行过程：**

> 在 第一章 React Fiber 架构介绍中，提到的 “为了实现快速响应目标，React Fiber 会执行 双缓存策略”。在这个策略作用下，浏览器实际执行的任务顺序是：
>
> 1. 分析HTML
> 2. 编译和执行 React 脚本
> 3. React 在内存中计算得到 虚拟DOM，并将 虚拟DOM 专递给浏览器
> 4. 此时，浏览器开始执行 DCL 任务，以及后续的其他任务

1. 首先找到 DCL 阶段，DCL 阶段之前的，即是我们要观察的 React 首次渲染执行任务过程。

2. 在 React 执行阶段中，找到 render 部分，即 React 开始渲染的过程

3. 在 render 部分中，又分为 3 个阶段：

   | 阶段划分(所执行的函数)           | 对应React架构中的 |
   | -------------------------------- | ----------------- |
   | legacyRenderSubtreeIntoContainer | 调度器            |
   | unbatchedUpdates                 | 协调器            |
   | commitRoot                       | 渲染器            |



### 2.2 深入理解 JSX

> 我们知道 JSX 其实是 React.createElement() 的语法糖，本小节重点讲述 JSX 是如何被转化的。

**思考以下 2 个问题：**

1. JSX 与 Fiber 的关系
2. React Component 与 React Element 的关系



**使用 babel 在线编译 JSX：**

1. 访问 babel 官网的在线编译页：

   * 中文：https://www.babeljs.cn/repl

   * 英文：https://babeljs.io/repl

2. 左侧窗口中输入 JSX ，右侧窗口则事实编译出 转化后的代码。

   > 卡颂的原本视频中提到，需要在左侧设置窗口中，添加插件 @babel/plugin-transfrom-react-jsx，当时使用到的 babel 版本为 7.10.4。  
   > 但目前最新的 babel 版本 7.12.3 已经不需要此步骤，默认即可正常编译 JSX。



**查看React.createElement()函数源码：**

找到 React 源码，打开 package/react/src/ReactElement.js 查看 createElement 函数源码。

```
export function createElement(type, config, children) { 
  ... 
  return ReactElement(
    type,key,ref,self,source,ReactCurrentOwner.current,props,
  )
}
```

从上面可以看出，createElement 函数接收 3 个参数：类型(原生DOM类型)、配置(属性)、子项(内容)，这说明 JSX 代码最终将被转化为以上 3 个参数。

同时 createElement 最终会 return 一个 ReactElement 实例。



**查看ReactElement函数源码：**

```
const ReactElement = function(type, key, ref, self, source, owner, props) {
  const element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };
  
  if (__DEV__) {
    ...
  }
  
  return element;
}
```

重点关注 `$$typeof: REACT_ELEMENT_TYPE`：

1. $$typeof 中的 $$ 并不是什么 JS 特殊语法，而仅仅是为了明显区分 $$typeof 和 type  这 2 个属性，而故意设置的属性名。

2. $$typeof 的值为一个 Symbol 实例，这样可以确保该值 只能是当前 JS 环境下所创建的，杜绝通过 JSON 动态生成的对象，以避免 XSS 攻击。

   > JSON 不支持 Symbol ，所以 JSON 是无法生成包含属性值为 Symbol 的对象。
   >
   > 例如下面代码 就可能在执行过程中，通过 JSON.parse() 动态创建一个对象：
   >
   > ```
   > <div>{JSON.parse('{ ... }')}</div>
   > ```



回顾一下代码：React.createElement() > ReactElement   
因此我们知道 ReactElement 其实是 React.createElement() 内部创建并返回的实例对象。



**问题：React Component 与 React Element 的关系？**  
答：React Component 是我们通过 类或函数，以及 JSX 语法糖 创建的 React 组件。而这些组件最终都会经过 React.createElement()  函数转化为 React Element 实例。

**还可以使用另外一种说法描述：**React Component 其实是 React.createElement() 函数中第一个参数(也就是 type 参数)，而 React Element 是 React.createElement() 函数的返回值。



**问题：JSX 与 Fiber 的关系？**  
答：JSX 是原始 React 代码，在 React 发生更新时，Fiber 会将新的 JSX 与 当前已存在的 ReactElement 做对比，并得到最终的更新代码。



### 2.3 “递”阶段moun时流程

> 本章讲的内容是 render，而创建的测试项目是基于浏览器的，所以和渲染相关的 JS 源码，应该去 react-dom 包中查看。

Fiber 中调度器执行的渲染(render)过程，是一个 递归过程。而每个 “递” 和 “归” 又分别有各自的：

1. mount：准备时流程
2. update：更新时流程

本小节首先讲的是 **“ 递 阶段中 准备 时流程”**。



**前期准备：删除测试项目 index.js 中一些不必要的代码**

1. 删除 reportWebVitals() 相关
2. 删除 <React.StrictMode> 相关



**开始观察beginWork()、completeWork()**

找到 DOM 渲染对应的文件：xxxx/build/node_modules/react-dom/cjs/react-dom.development.js

从函数 beginWork() 开始 往下进行调试。

```
function beginWork(current, workInProgress, renderLanes) { ... }
function completeWork(current, workInProgress, renderLanes) { ... }
```

**观察重点**：第 2 个 参数 workInProgress 的:

1. elementType 值——节点类型(就是节点名)
2. pendingProps 值——对应的参数值

beginWork() 函数大体行为是：采用深度优先遍历(DFS)，通过递归，不断执行 beginWork()，每遍历到 子节点的最深节点后执行 completeWork()，再去遍历父节点的同级其他节点(也就是兄弟节点)，直至遍历完整个 app 内容。

此过程大体为：

1. 第1 次执行 beginWork()，第 1 个参数 值为 3(即 HostRoot)，第 2 个参数值为 null

2. 第 2 次执行 beginWork()，第 1 个参数值为 null，第 2 个参数的 elementType 为 app

   > 此后第1个参数均为 null

3. 第 3 次执行 beginWork()，第 2 个参数的 elementType 为 app 最外层元素(假设为 div)

4. 第 4 次执行 beginWork()，第 2 个参数的 elementType 为 div 下第1个节点

5. ... div 第 1 个节点 下若再无同级节点，则执行 completeWork()，此时开始遍历 div 下第 2 个节点

6. ... 直至遍历完所有节点 



**关于子节点的补充**

假设有一个节点如下：

```
<p>Edit <code>src/App.js</code> and save to reload.</p>
```

对于 <p\> 节点来说，他是有 3 个子节点，分别是：

1. 文本：Edit
2. 组件：<code\>
3. 文本：and save to reload

**若子节点是纯文本，React 进行了节点优化：纯文本的节点不存在 FiberNode，即 纯文本的 elementType 值为 null，pendingProps 值为纯文本的文字内容。**

在 beginWork 执行到 p 标签时，会针对这 3 个子节点依次执行 beginWork，恰巧 这 3 个子节点又均无下一级节点，因此也会对等执行 3 次 completeWork，过程如下：

1. beginWork() > p
2. beginWork() > null(Edit)
3. completeWork() > null
4. beginWork() > code
5. completeWork() > code
6. beginWork() > null(and save to reload)
7. completeWork() > null
8. completeWork() > p

> 每次执行 beginWork，都只针对 1 个子节点，且最多只会创建一个 FiberNode  
>
> > 假设子节点的值是纯文本，为了优化，是不会创建 FiberNode 的



**beginWork()函数内具体做了什么？**

1. 判断节点是什么类型、标记更新状态

   > 所谓状态，包含：是否需要插入、是否需要更新、是否需要删除等等)

   1. 根据节点不同类型，执行不同的操作(创建对应的节点)

      > 这一步调用的函数是 createChild()

   2. 标记子节点更新状态

   > 所谓不同类型，包括：纯文本或数字、数组、React Element 等等，不同类型有不同的下一步操作

2. 通过不断递归，遍历整个 app



**补充：子节点为数组**

```
<header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <p>Edit <code>src/App.js</code> and save to reload.</p>
  <a className="App-link" href="https://reactjs.org" target="_blank"
     rel="noopener noreferrer">Learn React</a>
</header>
```

对于节点(FiberNode) header 来说，他的子节点就是一个数组，该数组的值为：[ <img\>, <p\>, <a\> ]

> 再次强调：若子节点仅为1个，且内容为 纯文本(字符串或数字)，React 为了优化是不会给 纯文本创建 FiberNode，也就是说假设 <header\> xxx </header\> 中的 xxx 是纯文本，那么此时 header 的子节点不再是数组，而仅仅是特殊处理后的文本。



## 文本烂尾了

卡颂的这套教学课程，其实真正核心有价值的，就是第一章 `理念篇`，后续章节充满了大量实际的代码调试，其实大概看一遍就可以了，对于调试过程中的细节理解不了无所谓，不再做更将详细的记录。

学习笔记到此结束。



## 补充：JSX渲染成真实DOM的过程是什么？

这是我在一个微信交流群里看到，某个面试官经常问的问题。

我重新温习了一下学习笔记，敲了下面一段文字。

#### 我的回答：

1、JSX 是 React.createElement() 的语法糖  
2、React.createElement()接收3个参数：type(原生DOM类型)、config(配置属性)、children(子项内容)  
3、React.createElement()最终返回一个 ReactElement 实例  
4、在创建 ReactElement 实例过程中，内部定义了一个特殊变量 $$typeof，类型为 Symbol，由于 JSON 不支持 Symbol，这样 React 内部可以通过 $$typeof 来判判断并杜绝通过 JSON 动态生成的对象，以避免 XSS 攻击。  
5、最终所有的 ReactElement 构成了 虚拟 DOM 树  
6、React 最终将虚拟 DOM 转化为真实DOM，并渲染到网页中  

7、所谓虚拟 DOM 是我们平时的称呼，真正对应的是 Fiber 架构。  
8、虚拟 DOM 仅仅是 Fiber 架构的其中一种含义  
9、Fiber 架构另外 2 层含义是：针对协调器的具体工作方式描述、动态工作单元(需要更新的状态和副作用)  

10、为了践行 快速响应机制，React 内部使用 双缓存机制，会创建 2 份“虚拟DOM”  
11、当然更加准确的说法是 2 个根节点 RootFiber，也就是 2 个 Fiber 树  
12、这 2 个 Fiber 树分别是：当前 Fiber 树(current Fiber)、内存进程中的 Fiber 树(workInProgress Fiber树)  
13、这 2 个 Fiber 树的内容对比过程，其实就是 React Diff 算法  
14、这 2 个 Fiber 树在后续的每一次更新渲染过程中，会经历一次互换身份  
15、所谓互换身份其实就是修改 FiberRootNode.current 的指向，被指向的那个就是“当前 Fiber 树”，另外一个就变为“内存进程中的 Fiber 树”。  
<br/>
16、当首次创建整个项目时，先创建整个项目的顶节点 FiberRootNode，然后创建上面提到的 2 个 Fiber 树  
17、此时 2 个 Fiber 树都是空白的，假设我们暂时称呼这 2 个 Fiber 树分别为 A、B  
18、FiberRootNode.current 首先指向空白的 A  
19、然后再采用深度优先遍历方式，从 App 开始不断创建各个层级的节点内容，并将节点内容赋值给 B  
20、这个过程其实就是 JSX 转化为虚拟 DOM 的过程  
21、当 B 内容填充完成后 FiberRootNode.current 此时改为指向 B  
22、并且把 B 的内容转化为真实 DOM，渲染到网页中，至此 首次渲染结束  
23、首次渲染不使用 Diff 算法  
<br/>
24、当发生数据状态变化后，会引发更新渲染  
25、Fiber 会基于 B 创建 1 个新的根节点 RootFiber ，我们称呼为 C  
26、当然也可以理解成 并没有创建 C，所谓 C 只不过是将原来的 A 重新调整为空白的 RootFiber  
27、B 和 C 每一层都有一个 alternate 属性来互相指向对方相同的层  
28、Fiber 重新从 App 开始，不断遍历各个层级的节点内容，并将内容写入到 C 中  
29、当 C 内容填充完成后，通过 C 各个层的 alternate 属性来与 B 中对应的层内容做对比，也就是 Diff 运算  
30、Diff 算法有一个最基本原则是：若某一层的顶层不同，则不会继续往下层再做对比，跳出并去做其他平级层的对比  
31、最终得出究竟有哪些虚拟 DOM 节点需要更新，同时将 FiberRootNode.current 指向 C  
32、将这些更新重新渲染到真实DOM中，并执行副作用  
33、至此更新渲染结束，之后再次发生的更新渲染，重复上述过程。  

