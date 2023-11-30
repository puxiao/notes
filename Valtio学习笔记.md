# Valtio学习笔记



<br>

### Valtio简介

**官网：** http://valtio.pmnd.rs/

**仓库：** https://github.com/pmndrs/valtio



<br>

**简介：**

Valtio 是一个可用于 React 或 原生网页 的简单代理状态管理器。



<br>

**Valtio 与 Zustand、Jotai 的关系**：

* Valtio 和 Zustand、Jotai 都是同一个作者开发的状态管理器
* Zustand、Jotai 采用 "原子化" 来实现状态管理，而 Valtio 采用 "对象代理" 来实现状态管理
* 它们  3 个适用于不同的应用场景：Zustand 强大、Jotai 用法简单、Valtio 则更适用于对象本身不复杂的场景



<br>

**Valtio 可以脱离 React 框架，在原生网页 JS 中使用。**

> 这点 zustand 是做不到的，zustand 依附于 react 框架



<br>

**Valtio 本身提供简单的 历史记录(撤销/重做) 功能。**

> 尽管 zustand 也能变相实现，例如使用第三方 NPM 包：zundo，但是都没有 Valtio 本身就支持实现方便。



<br>

**综上所述 Valtio 相对 Zustand 特别适用于下面场景：**

1. 数据状态不复杂
2. 需要有 撤销/重做 功能
3. 脱离 React 框架，在原生 JS 中使用



<br>

### Valtio安装

<br>

**React项目：**

```
yarn add valtio
```

JS中引入和使用：

```
import { proxy, subscribe, useSnapshot } from 'valtio'
import { proxyWithHistory } from 'valtio/utils'
```



<br>

**原生网页：**

```
<script src="https://cdn.jsdelivr.net/npm/proxy-compare@2.5.1/dist/index.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/valtio@1.12.1/umd/vanilla.development.js"></script>
<script src="https://cdn.jsdelivr.net/npm/valtio@1.12.1/umd/vanilla/utils.development.js"></script>
```

JS中引入和使用：

```
const { subscribe } = valtioVanilla
const { proxyWithHistory } = valtioVanillaUtils
```



<br>

补充说明：

* 前端一个著名的框架玩笑："我不用 React、Vue，我用的前端框架是 vanilla.js "，也就是说 原生网页 对应的是 "vanilla"

* 上面示例中为了方便调试，所以引入的是 xxx.development.js，等到生产环境可以改为 xxx.production.js

* 由于 vanilla 中用到了 proxy-compare，所以最开始需要先引入 proxy-compare

* 上面这种引入的模块会默认增加到全局对象(window)上，所以对应的对象为：

  ```
  window.valtioVanilla
  window.valtioVanillaUtils
  ```

  > 实际中我们可以忽略 window，直接访问使用 valtioVanilla、valtioVanillaUtils



<br>

### Valtio基础用法

特别说明：Valtio 既可以用在 React 框架，又可以用在原生网页中，但是这 2 个场景下的用法略微不同，所以在下面的演示中，针对同一个效果会分别给出 2 种不同的写法。

并且下面示例中使用了 TypeScript。



<br>

**核心内容1：代理(proxy)**

前面讲过了 Valtio 是基于 "对象代理" 作为底层实现的，所以需要学习的第1个关键函数就是 proxy。

在 JS 中本身就存在一个内置对象 Proxy：

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

而 Valtio 基于 Proxy 又封装出了自己的 proxy() 函数。



<br>

react 引入 proxy：

```
yarn add valtio
```

```
import { proxy } from "valtio";
```



<br>

原生 JS 中引入 proxy：

```
<script src="https://cdn.jsdelivr.net/npm/proxy-compare@2.5.1/dist/index.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/valtio@1.12.1/umd/vanilla.development.js"></script>
```

```
const { proxy } = valtioVanilla
```



<br>

**Valtio 中 proxy 函数的用法：**

* 使用 proxy 函数包裹住要维护的对象

  > 这个对象可以是 JS 中的任意结构的复杂对象或数组

* proxy 函数返回值就是该对象对应的数据状态(stroe)

  > 以后就可以通过该 store 来访问修改数据状态



<br>

举例：假定我们需要创建维护一个二维数组，该二维数组对应 N 条线段所需的关键点坐标。

那么就可以通过下面代码对该二维数组状态进行创建：

```
import { proxy } from "valtio";

interface Point {
    x: number,
    y: number
}

type PointsArr = Point[][]

const pointsArrStore = proxy<{ pointsArr: PointsArr }>({
    pointsArr: [[]],
})

const setPointsArr = (pointsArr: PointsArr) => {
    pointsArrStore.pointsArr = pointsArr
}

const addPoint = (point: Point) => {
    pointsArrStore.pointsArr[pointsArrStore.pointsArr.length - 1].push(point)
}

const delPoint = (lineIndex: number, pointIndex: number) => {
    pointsArrStore.pointsArr[lineIndex].splice(pointIndex, 1)
}

const addLine = () => {
    if (pointsArrStore.pointsArr[pointsArrStore.pointsArr.length - 1].length > 0) {
        pointsArrStore.pointsArr.push([])
    }
}

const delLine = (lineIndex: number) => {
    pointsArrStore.pointsArr.splice(lineIndex, 1)
}

export default {
    pointsArrStore,
    setPointsArr,
    addPoint,
    delPoint,
    addLine,
    delLine
}
```

上面的代码虽然很多，但是真正核心的就这几行：

```
const pointsArrStore = proxy<{ pointsArr: PointsArr }>({
    pointsArr: [[]],
})
```

剩下的无非是对日常修改维护该二维数组的一些函数而已。



<br>

在原生 JS 中如果单独只使用 Valtio proxy 函数，那么似乎和直接使用一个 JS 对象(或数组)  没有什么区别，所以这里就不演示了。



<br>

 Valtio 的 proxy 函数是后续所有操作的基础，后面的一些操作才是重点。



<br>

**核心内容2：监听变化(subscribe)**

通过 subscribe 函数来添加对某个由  proxy 创建维护的数据状态的变化监听。

```
import { proxy, subscribe } from 'valtio'

const store = proxy({ count:0 })
subscribe(store, (state) => {
    console.log(store, state)
})
```

subscribe 函数参数说明：

* 第1个参数为由 proxy 创建的数据状态 store
* 第2个参数为一个箭头函数，其中参数 state 为 "当下本次修改 store 对应的 变化之处"，state 具体的值由 数据状态结构以及修改内容来决定



<br>

有了 subscribe 函数就可以对数据状态的修改进行监听。

与此同时 subscribe 函数本身返回一个 "取消监听" 的函数，我们将上述代码修改一下：

```
const unsubscribe = subscribe(store, (state) => {
    console.log(store, state)
})

//当我们不再需要监听时，可以执行 unsubscribe 函数
unsubscribe()
```



<br>

**核心内容3：快照(snapshot)**

所谓快照就是将当前数据状态进行一次"克隆备份"，即使后续 数据状态 再次被修改，而本快照中的数据是固定不变的。

> 你不应该去尝试修改快照数据，事实上你也修改不了，因为快照中的数据已经被 冻结(freezing)



<br>

可以使用 snapshot 函数来创建快照。

```
import { proxy, snapshot } from 'valtio'

const store = proxy({ name: 'puxiao' })
const snap1 = snapshot(store)
const snap2 = snapshot(store)

store.name = 'yang'
const snap3 = snapshot(store)

console.log(snap1) //{name: 'puxiao'}
console.log(snap3) //{name: 'yang'}
console.log(snap1 === snap2) //true
console.log(snap2 === snap3) //false
```

在上面示例代码中：

* 任何时候都可以通过 snapshot 函数创建一个快照
* 假定数据并未发生修改，那么这两次创建的快照如果使用 === 去判断会被判定为 true



<br>

如果你想尝试修改快照中的数据，则会直接报错：告诉你属性仅为只读，不可修改

```
snap3.name = 'hello' //Cannot assign to 'name' because it is a read-only property.
```



<br>

**核心概念4：快照勾子(useSnapshot)**

对于 React 框架，还需要使用 useSnapshot 来勾住数据状态的变化，从而触发组件重新渲染。

> 注意 useSnapshot 仅在 React 框架下可用，在原生 JS 中不存在 useSnapshot



<br>

useSnapshot 使用示例：

```
import { proxy, useSnapshot } from 'valtio'

const store = proxy({ name: 'puxiao' }) //我们在 React 组件外部定义一个数据状态

const MyComponent = () => {
    const snap = useSnapshot(store)
    return (
        <>
            <div>{snap.name}</div>
            <button onClick={()=> store.name='yang'}>Change Name</button>
        </>
    )
}
```

实际运行，我们可以看到 useSnapshot 创建的勾子对象 snap 会在数据状态发生变化后，触发重新渲染组件。



<br>

**核心内容5：引用(ref)**

引用 ref 函数是用来将某些 **值为复杂对象的属性** 排除在数据状态监控范围之内的一个函数。

> ref 是单词 reference(引用) 的简写



<br>

> 再重复一遍：ref 函数的参数只能是 复杂对象，不可以是简单类型的值。



<br>

我们把之前的示例代码改造一下：

```
import { proxy, ref, useSnapshot } from 'valtio'

const store = proxy({ name: 'puxiao', info: ref({ age: 18 }) })

const MyComponent = () => {
    const snap = useSnapshot(store)
    return (
        <>
            <div>{snap.info.age}</div>
            <button onClick={ ()=> { 
                store.info.age=37;
                console.log(store.info.age); //37
            } }>Change Info<button>
        </>
    )
}
```

在上面代码中，我们将 数据状态中的 info 属性值 {age:17} 使用 ref 函数包裹，意味着将不会监控 info 属性值的变化。

当修改 info.age 的值后，也不会触发组件重新渲染。



<br>

ref 适用于某些不需要监控的属性 应用场景中。

但是切记 仅仅是一部分属性，如果整个数据状态各个属性都使用 ref ，那么也失去了使用 Valtio 的意义。



<br>

关于 Valtio 的几个基础函数已经讲解完毕了。



<br>

### Valtio的高级用法：历史代理(proxyWithHistory)

这是 Valtio 数据状态一个非常使用的功能：记录每一次数据状态的变更，并提供 撤销和重做 功能。



<br>

用法很简单，就是将之前 proxy 函数 改为 proxyWithHistory 函数。

只不过 proxyWithHistory 函数的引入方式和 proxy 并非同一个包。



<br>

**React 中引入 proxyWithHistory：**

```
import { proxyWithHistory } from 'valtio/utils'
```



<br>

**原生 JS 中引入 proxyWithHistory：**

```
<script src="https://cdn.jsdelivr.net/npm/valtio@1.12.1/umd/vanilla/utils.development.js"></script>
```

```
const { proxyWithHistory } = valtioVanillaUtils
```



<br>

**当使用 proxyWithHistory 代替  proxy 后，就不能再直接使用 store.xx 去访问某属性，而是要改成 store.value.xx 这种形式。**



<br>

**proxyWithHistory 函数第 2 个参数用来标识是否跳过自动保存历史记录，默认值为 false。**

> * 第 2 个参数不填 或者 值为 false 即表明：自动保存历史记录快照
> * 若第 2 个参数设置为 true 即表明：不会自动保存历史记录，若需要保存历史记录时则手工调用 .saveHistory() 函数



<br>

使用示例：

```
//创建一个随机返回 5 ~ 10 位字符串的函数
const randomStr = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const length = 5 + Math.floor(Math.random()*6)
    let str = ''
    for(let i=0; i<length; i++){
        const index = Math.floor(Math.random()*characters.length)
        str += characters.charAt(index)
    }
    return str
}

const store = proxyWithHistory({ name: 'puxiao' })

const MyComponent = () => {
    const user = useSnapshot(store)
    return(
        <>
            <div>{user.value.name}</div>
            <button onClick={() => store.value.name = 'yang'}>Change Name</button>
            <button onClick={() => {store.value.name = randomStr()}}>Change Name</button>
            <button disabled={!store.canUndo()} onClick={() => store.undo()}>撤销</button>
            <button disabled={!store.canRedo()} onClick={() => store.redo()}>重做</button>
        </>
    )
}
```

在上面示例代码中：

* 我们使用 proxyWithHistory 代替之前的 proxy
* 当获得或修改数据状态某个属性时，我们需要使用 store.value.xx 这种形式
* 通过点击按钮修改数据状态中 .name 的属性值后，proxyWithHistory 会自动帮我们保存每一次数据状态的快照
* 如果想执行 撤回 则调用 store的 .undo()
* 如果想执行 重做 则调用 store的 .redo()
* 如果想知道当前是否有可 撤回 的操作则通过判断 store 的 .canUndo() 函数返回值
* 如果想知道当前是否有可 重做 的操作则通过判断 store 的 .canRedo() 函数返回值



<br>

除了上述几个函数外 proxyWithHistory 返回对象还包括下面几个属性或方法：

* history：历史记录快照对象，该对象一共 3 个属性

  * index：当前历史记录索引

  * snapshots：历史快照记录数组

  * wip：当前撤销历史记录中对应的下一次数据状态值，如果重来没执行过撤销操作 那么 wip 的值为 undefined

    > wip 是单词 work in progress (进行中的工作) 简写

    > 关于 wip 的解释是我个人的理解，可能不太准确

* clone()：克隆当前数据状态

* saveHistory()：保存当前数据状态到历史记录

  > 若 proxyWithHistory 函数的第 2 个参数不填或值为 false，那么意味着默认就会自动保存历史记录，无需我们手工调用执行 .saveHistory()
  >
  > 只有当 proxyWithHistory 函数的第 2 个参数为 true 时，即默认不会自动保存历史记录，那么当我们想保存当下数据状态到历史记录，此时才需要调用执行 .saveHistory()

* subscribe()：监听变化



<br>

proxyWithHistory 函数本身并不复杂，实际中多用一两次就弄明白了。



<br>

### Valtio 的其他几个高级用法

前面讲解的 基础用法 + proxyWithHistory 已经能够满足绝大多数应用场景了。

接下来讲解其他几个高级用法，可根据项目实际情况来决定是否使用。



<br>

**subscribeKey：针对某个属性值变化的监控**

我们知道 subscribe 函数可以用于监听数据状态的每一个属性值的变化。

```
const user = proxy({name:'puxiao',age:18})

subscribe(user, (state) =>{ console.log(state) })
```

<br>

在上面示例中，无论是 name 还是 age 的值发生变化后，都会触发 subscribe() 中定义的监听函数。

如果我仅仅想监听某一个属性值的变化，例如 name 属性，那么就可以使用 subscribeKey 函数。

```
const user = proxy({name:'puxiao',age:18})

subscribeKey(user, 'name', (state)=>{ console.log(state) })
```

只需将 subscribeKey 函数的第 2 个参数设定为要监控的 属性名即可。



<br>

**watch：监控多个数据状态的变化**

subscribe 函数只针对某一个 数据状态 进行变化监听。

而 watch 则可以同时对多个 数据状态的不同属性进行变化监听。

大体用法为：

```
watch((get) => {
    const aa = get(axx).aa
    const bb = get(bxx).bb
    console.log(aa, bb)
})
```

具体实际用法，我目前还没使用过，所以就不讲了。



<br>

未完待续...



