# zustand学习笔记

**我个人认为 zustand 是目前 React 最好的状态管理库，没有之一。**

zustand 比 Recoil、jotai 还都要好。

> 顺带说一句：jotai、valtio、zustand 都归属于 pmndrs。



<br>

## zustand与其他状态库的对比

官方列出了 zustand 与其他几个状态库对比。

他们分别是：Redux、Valtio、Jotai、Recoil

https://docs.pmnd.rs/zustand/getting-started/comparison



<br>

**zustand的优点：**

* Recoil、jotai ... 有的优点 zustand 都有
* zustand 消费对象(使用者)类似于钩子(hooks)函数
* 但 zustand 不仅可以在函数组件中使用，还可以在类组件、甚至普通 JS (非 React) 中都可以共用执行
* zustand 对于数据状态管理的颗粒度非常只有，甚至是可以无限任你发挥



<br>

**针对 Recoil 的补充说明：**

虽然 Recoil 是 React 官方核心人员开发的状态管理库，但就我个人使用而言，觉得 zustand 继承和超越了 Recoil 的全部优点，并且在这些之上还有更多灵活、强大的特性。

并且请不用担心 zustand 会比较难，恰恰相反，zustand 非常简单，很容易上手。



<br>

**针对 Valtio 的特别说明：**

如果你的项目数据状态比较简单，并且需要有类似 `历史记录(撤销/重做)` 这样的功能，那么推荐你使用 Valtio 而不是 zustand。

> Valtio 通过 JS 中的 Proxy(对象的属性修改代理) 来实现对数据状态对象属性值修改的代理劫持和备份。

但是如果你的数据状态比较复杂，那么还是使用 zustand 吧。

> 如果想基于 zustand 实现 `历史记录(撤销/重做)`，需要借助 zustand 的第三方中间件。



<br>

## zustand基础用法

<br>

zustand 的官方使用介绍：https://github.com/pmndrs/zustand

官方的使用指南：https://github.com/pmndrs/zustand/tree/main/docs/guides

如果你使用 TypeScript，一定要看一下：

https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md



<br>

本文只是在官网的介绍页的基础上，加上自己实际项目中的经验写出来的，若有理解有误欢迎指正。



**安装：**

```
yarn add zustand
```



<br>

**虚构一个使用场景：**

假设我们要定义这样一个数据状态：

1. 记录用户 id 、用户名
2. 记录用户要做的事情列表
3. 每件要做的事情为：id、标题、创建时间、是否完成、完成时间



<br>

**下面代码是使用 typescript 的，若你是 js 项目则忽略相关类型声明即可。**



<br>

**定义数据 TS 类型**：

> src/types/index.ts

```
export interface TodoData {
    id: string //唯一id
    title: string //标题
    state: 0 | 1 //0：未完成 1：完成
    createTime: number //创建时对应的时间戳
    completeTime: number //完成时对应的时间戳
}

export interface UserData {
    id: string
    userName: string
    todoList: TodoData[]
}
```



<br>

**定义数据状态：**

我个人习惯为将数据状态放在 src/store/ 目录中，此次我们定义一个名为 useUserData.ts 的文件作为 用户信息状态管理对象。

> src/types/useUserData.ts

```
import create from 'zustand'
import { UserData } from '../types'

export interface UseUserData extends UserData {
    setData: (newData: Partial<UserData>) => void
}

const useUserData = create<UseUserData>((set, get) => ({
    id: '---',
    userName: '未知',
    todoList: [],
    setData: (newData) => set(newData)
}))

export default useUserData
```

代码解读：

* 由于 zustand 的消费者(使用者) 会把数据状态当做钩子函数，因此在命名时我们也采用 `useXxx` 的形式
* 数据状态存放到 src/store/ 中，而其他自定义 hooks 则存放在  src/hooks ，以示区分
* 通过 `create` 用来创建并初始化数据状态
* create 函数参数为 `(set,get)=>({ ... })`，此处 set 和 get 分别用于 设置和获取 当前状态的值
* useUserData 的类型是在 UserData 的基础上新增加了一个名为 `setData` 的函数，该函数用于更新用户信息状态
* 特别说明 `setData: (newData) => set(newData)` 是箭头函数 `setData: (newData) => { set(newData) }` 的一种简写
* setData 的参数类型为 `Partial<UserData>`，也就是说其值可以是部分的 UserData，不需要包含全部
* 随着未来功能的增加，我们还可以继续添加别的、拥有特定功能(例如针对 todoList 增删改查)的其他函数



<br>

**特别强调：在 TS 项目中，zustand 官方推荐的另外一种写法**

> 这里我强调一下只有在 TypeScript 中才需要看下面的讲解。

在上面示例中，我们是这样定义的：

```
const useUserData = create<UseUserData>((set, get) => ({ ... }))
```

但是官方更建议在 TS 项目中改成下面的写法：

```
const useUserData = create<UseUserData>()((set, get, api) => ({ ... }))
```

你没看错，就是 `create<UseXxx>()(...)` 这种代码写法。

如果你去查看 `create` 函数的 TS 类型定义，你会发现 create 确实支持 `()` 这种形式：

```
type Create = {
    <T, Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>): UseBoundStore<Mutate<StoreApi<T>, Mos>>;
    <T>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(initializer: StateCreator<T, [], Mos>) => UseBoundStore<Mutate<StoreApi<T>, Mos>>;
    <S extends StoreApi<unknown>>(store: S): UseBoundStore<S>;
};
```

既然两种写法都没有问题，那为什么官方建议我们使用 `create<UseXxx>()(...)` 而不是 `create<UseXxx>(...)` 呢？

理由很简单： `create<UseXxx>()(...)` 这种方式更利于 TypeScript 进行类型推论，尤其是当你使用一些 中间件 时一定要加上这个。

但是有一个中间件例外：combine

>中间件？combine？本文后面就会讲到。



<br>

**这个重要的事情我再重复一遍：**

* `create<UseXxx>()(...)` 和 `create<UseXxx>(...)` 在性能方面并没有任何区别
* 只不过是如果使用 `create<UseXxx>()(...)` 在某些时候更加利于 TS 的类型推论
* 假设你不使用 TypeScript 那么你无需考虑这 2 两种写法的区别
* 假设你使用 TypeScript 但是你不使用中间件，那也无所谓，两种方式都行
* 但是，**假设你使用 TypeScript 并且使用了 中间件，那么你可能需要使用 `create<UseXxx>()(...)` 这种形式**



<br>

在本文的后半部分会介绍 zusatand 的中间件，到时候你就会明白。

关于这个话题就先聊到这里，接着后面的学习。



<br>

> 特别补充：
>
> 在 zustand 历史中曾经出现了一个名为  createWithEqualityFn 的函数，几乎等价于 create 函数，它主要用来结合 shallow 配合使用。
>
> 但是后来 createWithEqualityFn 和 shallow 被抛弃，取而代之的是新增的 useShallow。
>
> 关于 useShallow 本文后面会讲到。



<br>

**读取并显示数据：**

我们在 src/components/ 下创建一个自定义组件 user-info/index.tsx 用户展示用户信息

> src/components/user-info/index.tsx

```
import useUserData from '../../store/useUserData'

const UserInfo = () => {

    const userData = useUserData()

    return (
        <div>
            <div>
                <span>{userData.id}</span>
                <span>{userData.userName}</span>
            </div>
            <div>
                <ul>
                    {
                        userData.todoList.map(item => {
                            return (
                                <li>
                                    <span>{
                                        `${item.id} - ${item.title} - 
                                        ${item.state === 0
                                            ? `未完成 - 创建时间：${new Date(item.createTime).toLocaleString()}`
                                            : `已完成 - 完成时间：${new Date(item.completeTime).toLocaleString()}`
                                        }`
                                    }</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default UserInfo
```

代码解读：

* 我们通过 const userData = useUserData()，以后就可以通过 userData 获取到用户数据状态
* 可以看出从 消费者(数据使用者) 的角度来看 useUserData 真的就好像是用 useState 一样
* 剩下的无非就是在该组件内部对 userData 进行解析并展示



<br>

**通过解构获取数据状态：**

在上面例子中我们通过 const userData = useUserData() 这种形式获取到了完整的 useUserData 中定义的全部数据状态。

但实际中我们可能只需要获取一部分数据状态，假设我们有一个用户组件，该组件仅仅需要展示 用户id 和 用户名，用不到 todoList，那么我们可以用下面方式获取所需数据状态：

```
const userId = useUserData(state => state.id)
const userName = useUserData(state => state.userName)
```

还可以将上面的 2 行代码进行合并：

```
const {userId, userName} = useUserData(state => ({
    userId: state.id,
    userName: state.userName
}))
```

> `(state) => ({ xx: xxx, ... })` 这种形式 是有返回值的箭头函数的简写形式，实际对应的是：`(state) => { return { xx:xxx, ...}}`

> 另外请注意，在上面代码中我们将原始的 id 在组件内部对应的变量名改为 userId



<br>

上面的形式是 对象解构，我们也可以采用另外一种形式：数组解构

```
const [userId, userName] = useUserData(state => [state.id, state.userName])
```

> 实际工作使用中，我个人推荐统一使用 对象解构



<br>

组件代码则改为：

```diff
<div>
-    <span>{userData.id}</span>
-    <span>{userData.userName}</span>
+    <span>{userId}</span>
+    <span>{userName}</span>
</div>
```



<br>

同理，假设有一个组件只需要 todoList，那么对应获取代码为：

```
const todoList = useUserData(state => state.todoList)
```



<br>

**修改数据状态：**

上面讲解了如何具体获取使用 用户状态数据，那么下面讲一下真正修改用户数据。

假定我们发起网络请求，得到了当前用户信息，那么此时就可以对 用户数据状态进行了 真正的初始化赋值。

```
import { useEffect } from "react"
import useUserData from "../store/useUserData"
import { UserData } from "../types"

const useRequestUserData = () => {

    const setUserData = useUserData(state => state.setData)

    useEffect(() => {
    
        //假设此处发生了网络请求
        //....
        
        //此时得到了对应的用户信息 newData
        const newData: Partial<UserData> = {
            id: '19861110',
            userName: 'Puxiao',
            todoList: [
                {
                    id: '0',
                    title: '学习recoil用法',
                    state: 1,
                    createTime: 1672232209038,
                    completeTime: 1672275259038
                },
                {
                    id: '1',
                    title: '写完zustand学习笔记',
                    state: 0,
                    createTime: 1672476919968,
                    completeTime: 0
                }
            ]
        }
        
        //真正初始化用户数据状态
        setUserData(newData)

    }, [setUserData])

    return
}

export default useRequestUserData
```

代码解读：

* 首先我们通过 const setUserData = useUserData(state => state.setData) 获取到了修改用户数据状态的方法
* 然后我们假定在 useEffect(()=>{ ... }, []) 中发起了网络请求，并得到了用户信息 newData
* 最后通过 setUserData(newData) 将数据写入到 用户数据状态中
* 对于组件 UserInfo 而言，就会自动更新展示新数据



<br>

**关于 set/get 的用法说明：**

在 useUserData.ts 中，出现了 set、get ：

```
const useUserData = create<UseUserData>((set, get) => ({ ... }))
```

在 setData 中我们用到了 set：

```
setData: (newData: Partial<UserData>) => void
```

```
setData: (newData) => set(newData)
```

> 重复一遍：(newData) => set(newData) 是箭头函数  (newData) => { set(newData) } 的简写



<br>

**特别说明一下上述代码中的 setData 仅仅是我们给自己的数据状态实例定义的一个方法名而已，你可以根据实际操作目的改成其他的，例如 setId、setInfo 等等。**



<br>

**set：** 用于设置修改当前数据状态

set 有 3 种形式：

* 具体的值
* 一个有返回值的函数
* 一个有返回值的异步函数



<br>

第1种形式：具体的值

* 第 1 个参数为具体的值，第 2 个参数为可选参数，类型为 布尔值，默认为 false

  也就是说 `(newData) => set(newData)` 等同于 `(newData) => set(newData, false)`

  这种情况下 newData 会与当前数据状态进行属性字段合并，换句话说可以对 当前状态的 部分属性进行更新，这也是为什么 newData 的类型定义为 `Partial<UserData>`

* 假设第 2 个参数值为 true，即 `(newData) => set(newData, true)`，那么此时不再是部分字段合并 而是 整体替换

  我个人非常不建议采用此方式，一定要慎用



<br>

第2种形式：一个回调函数

该回调函数形式为 `set((state)=>{ return ... })`，其中 state 为当前数据状态的值：

```
setData: (newData) => set((state) => {
    return {
        ...state,
        ...newData
    }
})
```

> 上述代码相当于 (newData) => set(newData)



<br>

第3种形式：一个异步函数：

```
updateData: async () => set({ xx: await getWebData() })
```



<br>

**get：** 用于在函数内部获取当前数据状态

具体用法为：

```
setData: (newData) => {
   const list = get().todoList
   set(...)
})
```



<br>

**特别补充：create()中的第3个参数 api**

实际上 create() 函数中除了 set, get 外还有第 3 个参数：api

即：

```
const useUserData = create<UseUserData>((set, get, api) => ({ ... }))
```

**第 3 个参数 api 实际上是对当前数据状态操作的引用，在上面示例中相当于对 useUserData 的引用。**

看一下第三个参数 api 的 TypeScript 定义：

```
export interface StoreApi<T> {
    setState: SetStateInternal<T>;
    getState: () => T;
    subscribe: (listener: (state: T, prevState: T) => void) => () => void;
    destroy: () => void;
}
```

我们可以看到第 3 个参数 api 拥有的方法和 useUserData 本身是相同的。



<br>

**对 todoList 进行增删改查：**

在了解了 zustand 基础用法，以及 set 、get 用法，那么接下来就是自由发挥时间了。



<br>

假设我们需要对 todoList 进行增删改查，按照之前的获取或修改方式：

```
const { todoList, setUserData } = useUserData(state => {
    totoList: state.todoList,
    setUserData: state.setData
})
```

修改 todoList 就可以写成：

```
setUserData({ todoList: ... })
```



<br>

但上述代码中我们通过 setUserData 对 todoList 进行值设定，可实际开发中，对于 todoList 的新值操作是有些繁琐的，例如为了设置新值，我们需要先获取当前的 todoList，然后再此基础上进行 增删改查，这样操作是不够精准、不够简洁的。



<br>

**增删改：可以添加对应的处理函数**

我们可以添加 增/删/改 对应的专属处理函数。

例如向  todoList 中新增一条数据：

```diff
  setData: (newData) => set((state) => {...}),
+ addTodoData: (todoData) => set({
+     todoList: [...get().todoList, todoData]
+ })
```

当然你也可以不使用 get，而是写成这种形式：

```diff
  setData: (newData) => set((state) => {...}),
+ addTodoData: (todoData) => set((state) => {
+    return {
+        todoList: [...state.todoList, todoData]
+    }
+ })
```



<br>

同样的套路，我们可以再添加 "改" 的对应函数。

修改 todoList 中某一条数据有很多改法，我们假定 改 的方式为：修改指定 id 的那条数据的值

即：

```
updateTodoData: (id: string, nowData: Partial<TodoData>) => void
```

对应代码为：

```diff
updateTodoData: (id, newData) => {
    const todoList = get().todoList
    const index = todoList.findIndex(item => item.id === id)
    if (index !== -1) {
        const curItem = todoList[index]
        todoList[index] = { ...curItem, ...newData }
        set({
            todoList
        })
    }
}
```



<br>

关于 "删" 我就不再举例了。

接下来重点说一下 "查"。



<br>

假定我们有一个需求：从 todoList 中查找出所有未完成的事项列表

那么你可能会想到以下 2 种方式：

第1种：直接获取 todoList 时直接进行筛选

```
const unTodoList = useUserData(state => state.todoList.filter(item => item.state === 0))
```

第2种：就好像 增删改 那样在 useUserData 中单独写一个对应函数

> 第 2 种方法个人非常不建议，因为随着查询功能变多 useUserData 会越来越复杂



<br>

从我们目前的示例来说，上面第 1 种方式就很好。

但是假定随着项目开发，查询变得越来越复杂，不再简单的像 `.filter(...)` 这样就能满足，那种情况下又该如何办呢？

换句话说：zustand 衍生数据状态 该如何实现呢？



<br>

**衍生数据：**

观察之前写的 从 todoList 中获取所有未完成事情列表的代码：

```
const unTodoList = useUserData(state => state.todoList.filter(item => item.state === 0))
```

你会发现 useUserData() 中实际上是一个箭头函数，那么假定查询的逻辑比较复杂，我们完全可以把该箭头函数单独拿出来定义，那就可以解决了。



<br>

例如，我们可以在 src/selector/ 目录下创建各种筛选查询，例如创建名为 unTodoListSelector.ts 的文件，用户查询未完成事项列表。

> src/selector/unTodoListSelector.ts

```
import { UseUserData } from "../store/useUserData"

const unTodoListSelector = (state: UseUserData) => {
    const todoList = state.todoList
    return todoList.filter(item => item.state === 0)
}

export default unTodoListSelector
```



<br>

然后再修改之前的代码：

```diff
+ import unTodoListSelector from '../../selector/unTodoListSelector'

...

- const unTodoList = useUserData(state => state.todoList.filter(item => item.state === 0))

+ const unTodoList = useUserData(unTodoListSelector)
```



<br>

这样做的好处有 2 个：

1. 在面对复杂筛选条件时，这种自定义 selector 衍生查询的方式可以将查询提取出来
2. 由于是一个函数，特别适用于 自动测试脚本



<br>

**在非 React 项目中使用 zustand：**

在非 React 的 JS 中想使用 zustand，则不再使用 set、get 的方式来定义、修改、获取 数据状态。

而是改用 api 中提供的方法来获取或修改数据。

```
import { createStore } from 'zustand/vanilla'

const store = createStore((set) => ...)
const { getState, setState, subscribe, destroy } = store
```



<br>

> vanilla 是 `原生JS` 的一种戏谑称呼，当你听到别说人 `我不使用 React 框架，而是 vanilla 框架` 就是指 `使用原生 JS`。



<br>

> 注意上面的写法是 v4 以后的最新写法，在 v4 之前，旧版写法为：
>
> ```
> import create from 'zustand/vanilla'
> const store = create(() => ({ ... }))
> const { getState, setState, subscribe, destroy } = store
> ```

<br>

实际中我并未在原生 JS 中使用创建过 zustand 状态库，所以不做过多讲解。



<br>

**销毁数据状态：**

假定我们想销毁 useUserData 时，可以通过：

```
useUserData.destroy()
```

或者是：

```
const useUserData = create<UseUserData>((set,get,api)=>({
   ...
   destroy: () =>{ api.destroy() }
}))
```



<br>

**重置数据状态：**

既然有销毁，那么可能就需要有重置。

不过重置数据状态的方式很简单，例如我们可以声明一个常量对象 initialState 用为作初始化的值，然后当想重置数据时即通过 set(initialState) 即实现重置数据。

但是有一点需要注意的是，假设使用 TypeScript，那么为了代码的简洁，我们可能需要将原本一块定义的 某数据状态类型拆分成 2 部分：State 和 Actions

还是拿  useUserData 来举例：

```diff
- export interface UseUserData extends UserData {
-     setData: (newData: Partial<UserData>) => void
-     addTodoData: (todoData: TodoData) => void
-     updateTodoData: (id: string, nowData: Partial<TodoData>) => void
- }

+ interface Actions {
+     setData: (newData: Partial<UserData>) => void
+     addTodoData: (todoData: TodoData) => void
+     updateTodoData: (id: string, nowData: Partial<TodoData>) => void
+ }

+ const initialState: UserData {
+     id: '---',
+     userName: '未知',
+     todoList: [],
+ }

- const useUserData = create<UseUserData>()( 
-     (set,get, api) => ({ id:'---', ... })
- )

+ const useUserData = create<UserData & Actions>()( 
+     (set,get, api) => (
+         ...initialState,
+         setData: (newData) => set((state) => {})
+         ...
+         reset: () => set(initialState) //重置数据
+     )
+ )
```



<br>

## zustand获取监听数据状态的另外一种形式



<br>

在上面的示例中，我们都是在 钩子组件 中以 hooks 函数的形式在获取和监听数据状态。

接下来我们学习一下另外一种获取和监听数据状态的形式。



<br>

**获取数据状态：.getState()**

之前我们获取数据的方式为：

```
const userData = useUserData()
```

还有另外一种形式：

```
const userData = useUserData.getState()
```

此时，我们不再将 useUserData 当做一个函数，而是把它当做一个对象，通过调用它的 .getState() 来获取对应的数据状态。



<br>

**修改数据状态：.set**



<br>

这种形式特别适用于 类组件 。



<br>

**监听数据状态：.subscribe()**

之前由于使用的方式类似于 hooks 函数，所以再获取某数据状态后，我们无需做任何事情，就可以实现监听变化。

当获取方式改为 const userData = useUserData.getState() 后，这种形式得到的 userData 则无法自动监听数据变化。如果想监听则需要使用 `.subscribe()`。



<br>

先看一下 .subscribe() 的 TS 类型定义：

```
subscribe: (listener: (state: T, prevState: T) => void) => () => void
```

 可以看出 .subscribe( ... ) 参数为一个回调函数，该函数有 2 个参数：

1.  第1个参数：state，当前最新的数据状态值
2.  第2个参数：prevState，之前旧的数据状态值



<br>

举个例子：假定我们想监听 todoList 的变化，那么可以写成：

```
useUserData.subscribe((state) => {
    console.log(state.todoList)
})
```

> 由于我们暂时用不到第 2 个参数 prevState，所以上面代码中我们就根本没有出现它



<br>

**.subscribe((state) => { ... }) 适用的 2 个场景：**

* 适用于 类组件 

* 适用于 瞬时更新 场景

  准确来说是将原本某个需要依赖的函数变成一个不需要依赖的函数



<br>

接下来你将针对上面  2 个适用场景详细讲一下。



<br>

**场景1：在类组件中添加数据侦听**

* 我们分别在类组件的 构造函数中 通过 useUserData.getState()  获取初始化值
* 然后在 componentDidMount() 函数通过 useUserData.subscribe() 添加数据状态侦听

对应的代码为：

```
import { Component } from "react";
import useUserData from "../../store/useUserData";

interface Props {
    [key: string]: any
}

interface State {
    id: string
    userName: string
}

class UserInfo extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = useUserData.getState()
    }

    componentDidMount() {
        useUserData.subscribe((state) => {
            this.setState({
                id: state.id,
                userName: state.userName
            })
        })
    }

    render() {
        return (
            <div>
                <span>{this.state.id}</span>
                <span>{this.state.userName}</span>
            </div>
        )
    }
}

export default UserInfo
```



<br>

**场景2：瞬时更新，准确来说是将原本某个需要依赖的函数变成一个不需要依赖的函数**

这个场景我们可能经常会用到。



<br>

**先说一下什么是 “瞬时更新” ？**

我们知道 zustand 消费端使用的方式类似于 钩子函数，那么也就意味着：

1. zustand 的更新方式并不是实时的，是异步的

2. 普通函数中的闭包陷阱

   > 即普通函数在定义时内部引用了某个数据状态，但当该数据状态发生变化后该函数内的 “数据状态值” 依然为之前的值，这个情况我自己都遭遇过好几回，切记切记。

3. react18 的并发模式，也会导致 我们在某一瞬间 A组件中 设置修改了 数据状态，但与此同时 B组件中的某函数 获取到的数据未必是最新的

   > 这个场景在实际开发中会经常遇到

假定 B组件中的某函数  中无论任何情况下都需要第一时间获取最新的数据状态，这种情况下，就需要使用 瞬时更新 的代码套路了。

具体代码套路如下：

* 我们在组件内通过 useRef 勾住数据状态中的某个值

* 我们在 useEffect() 中通过 .subscribe() 添加对该值的监控和更新

* 这样就可以保证 B组件中某函数始终可以获取最新的值，并且该函数内部由于使用的是 useRef 产生的对象，该函数不需要其他任何变量依赖

  > 这也是我们前面说的：将原本某个需要依赖的函数变成一个不需要依赖的函数



<br>

**举个代码例子：**

假定我们新定义个 数据状态，表示当前显示项索引：

> src/store/useCurrentIndex.ts

```
import create from 'zustand'

export interface UseCurrentIndex {
    index: number
    setData: (newIndex: number) => void
}

const useCurrentIndex = create<UseCurrentIndex>((set) => ({
    index: -1,
    setData: (newIndex) => set({ index: newIndex })
}))

export default useCurrentIndex
```



<br>

在组件某函数中使用 瞬时更新：

```
import { useEffect, useRef } from "react"
import useCurrentIndex from "../store/useCurrentIndex"

const useSomeFun = () => {
    const indexRef = useRef<number>(useCurrentIndex.getState().index)

    const someFunc = () => {
        //...
        console.log(indexRef.current)
    }

    useEffect(() => {
        useCurrentIndex.subscribe(state => {
            indexRef.current = state.index
        })
    }, [])
}

export default useSomeFun
```

> 这里需要强调一下 useRef 声明的变量 .current 的值发生变化后并不会触发组件重新渲染，因此假定 useSomeFun 不发生重新渲染的情况下，其内部的 someFun() 函数是稳定的、不会重新声明的。



<br>

我们可以看到所谓 “瞬时更新” 更像是 “勾住某数据”，将原本某个需要依赖的函数变成一个不需要依赖的函数。

> 没错，这么重要的话要说三遍，因为在实际项目中会经常使用这种形式。



<br>

**请注意：上面的方式使用到了 useRef，但假设你的代码并不是 React 组件，无法使用 useRef 时，那么最简单的方式就是在函数内部每次都重新获取一遍该值。**

```
useCurentIndex.getState().index
```





<br>

**数据的另外一种派生：**

1. 我们现在定义了一个当前用户的数据状态

2. 我们再定义一个 当前展示第几个 todoList 事项的数据状态

   > 假定 todoData 内容是一片文章，那么我们可能需要针对 todoList 做一个分页，展示第几个事项相当于切换分页

3. 我们希望对外封装一个自定义钩子函数 useCurrentTodoData.ts 用来专门对外提供当前展示 todoData 数据



<br>

我们直接看代码：

> src/hooks/useCurrentTodoData.ts

```
import { useEffect, useState } from "react"
import useCurrentIndex from "../store/useCurrentIndex"
import useUserData from "../store/useUserData"
import { TodoData } from "../types"

const useCurrentTodoData = () => {

    const [currentTodoData, setCurTodoData] = useState<TodoData | undefined>(undefined)

    const curIndex = useCurrentIndex(state => state.index)
    const todoList = useUserData(state => state.todoList)

    useEffect(() => {
        setCurTodoData(todoList[curIndex])

    }, [todoList, curIndex])

    return currentTodoData
}

export default useCurrentTodoData
```



<br>

定义一个只展示当前选中项的组件：

> src/components/current-todo/index.tsx

```
import useCurrentTodoData from "../hooks/useCurrentTodoData"

const CurrentTodo = () => {

    const todoData = useCurrentTodoData()

    return (
        <div>
            {
                todoData === undefined ? <span>暂无当前选中事项</span> : (
                    <span>{
                        `${todoData.id} - ${todoData.title} - 
                                        ${todoData.state === 0
                            ? `未完成 - 创建时间：${new Date(todoData.createTime).toLocaleString()}`
                            : `已完成 - 完成时间：${new Date(todoData.completeTime).toLocaleString()}`
                        }`
                    }</span>
                )
            }

        </div>
    )
}

export default CurrentTodo
```

对于 CurrentTodo 组件而言，它通过 useCurrentTodoData 即可获取到当前展示项的数据值，而它自己是不知道 useUserData 和 useCurrentIndex 的存在的。

所以这是数据的另外一种派生形式。



<br>

## zustand的性能优化



<br>

**性能优化之：避免无用数据变化引发的 react 组件重绘**

这里提到的 '无用' 是指下面几种情况。

**情况1：** 数据状态中值的实际字面值并未发生变化，例如之前的值是 {}，而新赋值依然是 {}

zustand 默认使用的是 `Object.is` 这个对比函数，我们知道在 JS 中  {} 与 {} 虽然字面值相同，但 {} === {} 的结果为 false，也会被 React 的 Diff 算法 判定为 2 个不同的值而引发组件重绘。

```
Object.is({},{}) //false
```



<br>

**情况2：** 数据状态中用不到的某个属性字段值发生了改变引发的重绘

举例，假定 useXxxData 数据状态包含 .a、.b、.c 3 个数据字段，那么就会存在下面这种情况：

* 假定 A组件中只用到了 .a 数据字段

* 假定 B组件中只用到了 .b 数据字段

* 假定 C组件中可以修改 .c 的数据字段

* 当 C组件 修改了 数据状态 .c 的值后，引发了 useXxxData 的更新，此时也可能会牵连到 A组件和 B组件也同步更新

  尽管 A 组件和 B组件中 并没有使用到 .c 字段



<br>

综上所述，我们需要采取一些操作，减少组件无谓的重新渲染。

也就是说当数据状态发生变化后，我们需要 `浅对比` 值是否发生了变化，如果子面值没变则忽略，从而减少组件重绘。



<br>

"浅对比" 对应的单词是 "shallow"

> shallow：浅的、肤浅的、表面的



<br>

情况讲清楚了，那么接下来看如何实际写代码。



<br>

**在 zustand v4.4.2 之前使用的是：createWithEqualityFun + shallow**

**在 zustand v4.4.2 以后使用的是：useShallow**

v4.4.2 发布日期是 2023.10.02，也就是说在这个日期之前，使用的都是 `createWithEqualityFun + shallow`。

为了能够维护老项目，我们这里先讲一下 `createWithEqualityFun + shallow` 的简单用法。



<br>

**旧版性能优化：createWithEqualityFun + shallow**



<br>

**第1步：定义数据状态**

不再使用 create 函数，改使用 createWithEqualityFn 函数，并且遵循下面的写法

```diff
- import { create } from 'zustand'
+ import { createWithEqualityFn } from 'zustand/traditional'

interface UseXxxData { ... }

- const useXxxData = create<UseXxxData>()((set) => ({ ... }))
+ const useXxxData = createWithEqualityFn<UseXxxData>((set) => ({ ... }), Object.is)
```

> 我们将 Object.is 这个函数作为 createWithEqualityFn 的第二个参数



<br>

补充一点：createWithEqualityFn 函数只支持 React 18 版本

如果你使用 create 创建数据状态，但是却使用了 shallow，那么你会收到这样的警告信息：

```
[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937
```



<br>

**第2步：组件中使用数据状态**

先引入 shallow

```
import shallow from 'zustand/shallow'
```

准确来说 `shallow` 是 zustand 为我们提供的一个浅比较函数。



<br>

 假定 A组件中之前获取 .a 数据字段的代码为：

```
const a = useXxxData(state => state.a)
```

那么修改成下面的即可：

```
import shallow from 'zustand/shallow'

...

const a = useXxxData(state => state.a, shallow)
```

也就是说将 shallow 作为 useXxxData() 的第2个参数即可。

* 只有当 state.a 的值发生变化后才会重新渲染该组件
* 当 .b、.c 的值发生变化并不会重新渲染该组件



<br>

**自定义shallow：自己定义更新时机**

我们可以看到 shallow 本身的定义为一个函数：

```
declare function shallow<T>(objA: T, objB: T): boolean;
```

* 该函数有  2 个参数：objA(之前的值)、objB(新的值)
* 该函数返回一个比较结果 boolean：
  * 当为 ture 则认定数据没有发生变化，不需要重新渲染组件
  * 当为 false 则认定数据发生了变化，需要重新渲染组件



<br>

**举一个特殊例子：**

假定现在有一个特殊组件 ShowTodoList.ts

* 当用户的 todoList.length < 3 时不认为需要更新组件，也就是显示默认的数组长度  0
* 也就是只有当 todoList.length >=3 时才会真正显示 todoList 的真实 .length 的值



> 我只是为了演示 自定义 shallow 函数才举得这个例子，不必过分思考为什么会有这样的组件需求。



<br>

对应代码：

> src/components/show-todo-list/index.tsx

```
import useUserData from "../store/useUserData"
import { UserData } from '../types' //这里假定给 useUserData 定义的结构为 UserData

const customShallow = (objA: UserData, objB: UserData): boolean => {
    return objB.todoList.length < 3
}

const ShowTodoList = () => {

    const todoList = useUserData(state => state.todoList, customShallow)

    return (
        <span>
            {todoList.length}
        </span>
    )

}

export default ShowTodoList
```



<br>

以上就是旧版 createWithEqualityFun + shallow 的用法。

下面学一下新版 useShallow 的用法。



<br>

**新版性能优化：useShallow**

首先对于创建状态库实例时，createWithEqualityFun 被废弃，我们正常使用 create 即可。

> 和之前定义数据状态实例没有任何不一样。



<br>

用法主要体现在 React 组件中。

用法也极其简单：只需引入 useShallow 函数，并使用 useShallow 函数包裹住原本的 (state) => ({ ... }) 即可。

```diff
+ import { useShallow } from 'zustand/react/shallow'
import useUserData from "../store/useUserData"

//对象解构形式
- const { curIndex, todoList } = useUserData((state) => ({ curIndex: state.curIndex, todoList: state.todoList}))

//使用 useShallow() 包裹住之前的 (state)=>({ ... })
+ const { curIndex, todoList } = useUserData(useShallow((state) => ({ curIndex: state.curIndex, todoList: state.todoList})))
```

也可以使用数组解构形式：

```
const [ curIndex, todoList ] = useUserData(useShallow((state) => [state.curIndex,state.todoList]))
```



<br>

同样，useShallow 函数的第 2 个参数也可以传入一个自定函数：

> 该自定义函数必须返回 boolean 值

```
import { useShallow } from 'zustand/react/shallow'
import useUserData from "../store/useUserData"

import { UserData } from '../types' //这里假定给 useUserData 定义的结构为 UserData

const customShallow = (objA: UserData, objB: UserData): boolean => {
    return objB.todoList.length < 3
}

const todoList = useUserData(useShallow((state) => state.todoList), customShallow))
```

> 也就是说只有当 todoList 的 .length 小于 3 不回去触发检查更新



<br>

## zustand中间件的用法



<br>

**什么是中间件？**

中间件的本意为装饰者模式，即在不改变原来对象(属性、方法、运行结果)的使用前提下去新增一些额外功能。

像 Koa、koa-router 这类 NPM 包一样，zustand 也支持中间件 。

但是请注意 zustand 的中间件 和 Koa 的略微不同。

* Koa 的中间件采用的是 洋葱型 模式，即通过迭代器 一步一步、一层一层往下处理，每执行完一个中间件则调用 next() 继续下一步
* 而 zustand 的中间件仅仅是普通的装饰者模式，没有也不需要调用 next()



<br>

**zustand的中间件作用是：在修改或获取数据状态时可以额外增加一些其他操作**



<br>

请注意，再次重复一遍：

**假设你使用 TypeScript 并且使用了某些 中间件，那么你可能需要将 `create<UseXxx>(...)` 修改为 `create<UseXxx>()(...)`**

但是中间件 combine 除外。



<br>

**举一个例子：每当修改数据状态时都需要console.log()打印出修改的值**

上面示例中我们分别定义了 2 个状态：useCurrentIndex.ts 和 useUserData.ts

在这 2 个状态中，我们分别定义了一些修改状态的函数，在这些修改状态的函数中都通过调用 `set()` 方法来修改数据状态。

假设我们现在有这样一个需求：

* 当任何一个数据状态发生修改前，需要先通过 console.log() 打印出要修改的值
* 当数据修改完成后，打印出修改后的数据状态值



<br>

> 你可能会有疑惑，为什么会有这样的需求？别较真，我们只是拿 console.log() 来举例而已。
>
> 并且 zustand 官方在讲解中间件时就是拿这个需求举例的。



<br>

上面这个需求最简单的办法就是：

* 在所有使用 set(newValue) 的代码前都增加上 console.log(newValue)
* 在所有调用过 set() 的代码后都增加上 console.log(get())

当然你要这么做没有一点问题，只不过是每一个数据状态里都要增加，有点繁琐。

如果使用中间件，则可以非常省事。



<br>

**实现中间件 Log 的代码：**

我们在 src/middleware/ 目录下创建一个名为 log.js 的文件。

> src/middleware/log.js

```
const log = (config) => (set, get, api) => {
    config(
        (...args) => {
            console.log('修改之处：', args)
            set(...args)
            console.log('修改之后：', get())
        }, get, api
    )
}
```

抱歉，由于我的 TypeScript 类型体操 实在有点弱，所以我真的没有看懂如何去定义 中间件的 TypeScript 类型声明。所以这里就先贴上 .js 的代码，而不是 .ts 的。



<br>

**假定，我说的是假定 我们已经定义好了 log.ts**，那么具体用法比较简单，我们只需在原本 `create()` 中使用 `log()` 包裹住之前的内容即可：

```
import log from '../middleware/log'

const useCurrentIndex = create<UseCurrentIndex>()(
    log((set) => ({
        index: 0,
        setData: (newIndex) => set({ index: newIndex })
    }))
)
```

> 我已在论坛发了询问帖子：https://github.com/pmndrs/zustand/discussions/1515
>
> 虽然 zustand 的作者进行了回复，不过以前没看懂如何定义，所以此处先大体这样理解即可。



<br>

**zustand自带有一些常用的中间件：**

* persist：数据持久化，即将最新的数据状态写入到浏览器本地储存中

  > 例如写入到 localStorage(默认)、sessionStorage、IndexedDB 等，具体用法我们稍后讲解

* devtools：将数据状态呈现在浏览器的 redux devtools 工具插件中

* redux：模拟 redux 命令式的更新数据状态

* immer：针对 `immer` NPM 包的中间件

  > immer NPM 仓库地址：https://github.com/immerjs/immer
  >
  > immer 主要作用是处理 "不可变数据结构"，是针对复杂对象，属性层级比较深的对象修改的性能优化的一种方式
  >
  > 关于 immer 可查阅我写的： [immer.js学习笔记.md](https://github.com/puxiao/notes/blob/master/immer.js%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md) ，讲解了 immer 背景知识、相关函数用法、以及 zustand 中如何使用 immer 中间件。

* combine：单词字面意思为 "结合"，也就是说它可以将 2 个对象 "结合" 成一个对象。

  > 具体用法我们稍后讲解



<br>

**中间件 persist 的用法：**

persist 单词本意为 持久化，persist 有可能是我们会使用最多的中间件。

它的具体用法非常简单：

* 引入 persist 并使用：create(persist( ... ))
* 将之前的数据状态初始化代码 (set,get,api) => {} 作为 persist() 的第 1 个参数
* 第 2 个参数为写入本地的配置项 PersistOptions



<br>

PersistOptions 配置项：

```
type StorageValue<S> = {
    state: S;
    version?: number;
};

export interface PersistStorage<S> {
    getItem: (name: string) => StorageValue<S> | null | Promise<StorageValue<S> | null>;
    setItem: (name: string, value: StorageValue<S>) => void | Promise<void>;
    removeItem: (name: string) => void | Promise<void>;
}

export interface PersistOptions<S, PersistedState = S> {
    name: string;
    storage?: PersistStorage<S> | undefined;
    partialize?: (state: S) => PersistedState;
    onRehydrateStorage?: (state: S) => ((state?: S, error?: unknown) => void) | void;
    version?: number;
    migrate?: (persistedState: unknown, version: number) => S | Promise<S>;
    merge?: (persistedState: unknown, currentState: S) => S;
}
```

> 在 4.2.0 版本中，之前存在的以下 3 项都已废弃
>
> * `getStorage?: () => StateStorage;`
> * `serialize?: (state: StorageValue<S>) => string | Promise<string>;`
> * `deserialize?: (str: string) => StorageValue<PersistedState> | Promise<StorageValue<PersistedState>>;`
> * 以上 3 个由 `storage` 和 `createJSONStorage` 所替代



<br>

关于配置项的简要说明：

* name：即本地存储的唯一索引值，相当于 key

* storage：用来配置将输出存储到哪里，如果不设置这默认存储到 localStorage 中，你可以修改为 sessionStorage 或 IndexedDB 中，同时你可以额外配置 version 的值。

  * version 的值对于 IndexedDB 来说是比较重要的一个配置项
  * 如果你希望存储的数据中包含图片或视频，则推荐存储到 IndexedDB 中

* version：本地存储的数据的版本号

* partialize：筛选过滤或者新增要持久化的最终数据状态，从它的函数定义 `partialize?: (state: S) => PersistedState;` 上就可以看出，函数参数为当前数据状态，而函数输出值即要本地持久化的最终数据结果，前后两者可以不一样。

  > partialize 单词本意为 偏好，在本场景中是 "个性化自定义" 的意思

  举个最简单的例子：假设原本数据状态为 { name:'puxiao', age:36 }，而我们实际只想把 name 存到本地，那么就可以利用 partialize 函数来过滤掉不需要的字段。

  ```
  partialize: (stage) => {name: stage.name}
  ```

  > 经过上面的转换，最终我们本地持久化的数据为 { name: 'puxiao' }，没有包含 age 字段，同理你也可以变更或增加一些字段。

* ......

  > 后面几个配置项我实际中也没使用到，所以暂时先不做讲解，不过通过名字大概也能猜测出它的作用



<br>

我们以 useUserData.ts 为例：

> 注意：
>
> * 最新版的 zustand 4.2.0 中 persist 的用法和之前的版本不同，本示例代码使用的是最新版 4.2.0 的写法
> * persist 需要 `create<UseXxx>()(...)` 这种形式

```
import create from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { TodoData, UserData } from '../types'

export interface UseUserData extends UserData {
    setData: (newData: Partial<UserData>) => void
    addTodoData: (todoData: TodoData) => void
    updateTodoData: (id: string, nowData: Partial<TodoData>) => void
}

const useUserData = create<UseUserData>()(
    persist(
        (set, get, api) => ({
            id: '---',
            userName: '未知',
            todoList: [],
            setData: (newData) => set((state) => {
                return {
                    ...state,
                    ...newData
                }
            }),
            updateTodoData: (id, newData) => {
                const todoList = get().todoList
                const index = todoList.findIndex(item => item.id === id)
                if (index !== -1) {
                    const curItem = todoList[index]
                    todoList[index] = { ...curItem, ...newData }
                    set({
                        todoList
                    })
                }
            },
            addTodoData: (todoData) => set((state) => {
                return {
                    todoList: [...state.todoList, todoData]
                }
            })
        }),
        {
            name: 'userData',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)

export default useUserData
```



<br>

**persist 这个中间件特别适用于以下场景：**

* 建立数据状态的快照
* 命令模式下记录存储每一条命令(command)，适用于提供 撤销/重做 的功能

关于 persist 的更多用法，可查阅：https://github.com/pmndrs/zustand/blob/main/docs/integrations/persisting-store-data.md



<br>

**中间件 combine 的用法：**

我们已经讲过 combine 的作用是将两个对象进行 "结合"，那么在 TS 项目中，它的另外一个作用是帮我们进行 数据状态 的 TS 类型推导。

以我们前面定义的 useCurrentIndex.ts 为例，我们之前代码如下：

```
import create from 'zustand'

export interface UseCurrentIndex {
    index: number
    setData: (newIndex: number) => void
}

const useCurrentIndex = create<UseCurrentIndex>(
    (set) => ({
        index: 0,
        setData: (newIndex) => set({ index: newIndex })
    })
)

export default useCurrentIndex
```

在上面的代码中，我们需要先定义 UseCurrentIndex，这样才能获得好的 类型提示。

但如果你就是想省事，那么可以使用 combine 中间件，来帮我们省略掉一些类型定义。

我们想一下，任何一个 zustand 数据状态 通常都是由  2 部分组成的：

1. 数据本身 (State)，例如上面中的 index
2. 修改数据的方法 (Actions)，例如上面的 setData

所以 combine 的作用就是将上面 2 部分分别定义并进行 "结合"，自动推论出 数据本身 的那部分类型。



<br>

useCurrentIndex.ts 的代码可以修改为：

> 请注意 combine 不需要 `create<UseXxx>()(...)` 这种形式

```
import create from 'zustand'
import { combine } from 'zustand/middleware'

const useCurrentIndex = create(
    combine(
        { index: 0 },
        (set) => ({
            setData: (newIndex: number) => set({ index: newIndex })
        })
    )
)

export default useCurrentIndex
```

> 代码解读：
>
> * combine() 接收 2 个参数：{ index: 0 } 和 (set) => { ... }
> * combine 对第1个参数 { index: 0 } 进行类型推论
> * 并将这 2 个参数进行 "结合"，然后将合并过后的结果传递给 create()
> * 这样我们就只需对第 2 个参数编写 TS 类型即可，省掉了一些 TS 代码

但是，这种 "省事偷懒" 的方式，我个人并不建议。



<br>

**中间件 devtools 的用法：**

对于比较复杂的数据状态管理项目，我们希望可以时时知道(观察到) 数据状态的变化，那么可以在项目开发调试阶段在浏览器中安装 `redux-devtools` 插件，用来查看数据状态中的值。

> 安装方式参见官方文档：https://github.com/reduxjs/redux-devtools/tree/main/extension#installation

而 devtools 中间件的作用就是帮我们将数据状态时时反应在 redux-devtools 中的。

它的用法很简单，假设我们是在 TypeScript 项目，我们定义的数据状态结构类型为 UseXxx，那么代码套路为：

```diff
- const useXxx = create<UseXxx>((set,get)=>{ ... })
+ const useXxx = create<UseXxx>()(devtools((set,get)=>{ ... }),{name:'useXxx'}))
```

> 代码解读：
>
> * 我们将原本的 create<UseXxx> 修改为 create<UseXxx>()
> * 我们使用 devtools() 包裹住之前的 (set,get)=>{ ... }
> * 我们添加了在浏览器 redux 中该数据状态的一些基础配置项 {name:'useXxx'}，我们在这里只是添加了它对应的名称而已，在 redux 中通过下拉列表可以找到 useXxx 对应的数据状态值



<br>

**特别注意：假设你的数据状态中包含 Map、Set、Symbol、Function 类型，你还需要额外添加 serialize: true 这个配置项，因为默认这些类型无法在 redux 中显示，添加过后就可以显示了。**

> { name:'useXxx', serialize: true }



<br>

除了上面提到的 name、serialize 之外，还有其他可配置选项，具体可查阅：

https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/API/Arguments.md



<br>

**同时使用多个中间件：**

不同的中间件之间是可以相互嵌套的，也就是说当你希望同时使用多个中间件时，用一个中间件 套着  另外一个中间件。

> 例如 
>
> ```
> devtools(
>   persist( ... )
> )
> ```



<br>


关于中间件，就暂时讲到这里。

> 如果你写出了一个有用的中间件，可以向 zustand 提交 PR 的。



<br>

## 总结：



总结：

* 到目前为止，我们已经学习掌握了 zustand 的基础用法
* 如何在 类组件中 使用 zustand
* 衍生(派生)数据 的使用方法
* 使用 shallow(旧版)、useShallow(新版) 和自定义 shallow 函数来做一些基础的性能优化
* zustand 的一些中间件用法

已经算是对 zustand 有了足够的认知，可以满足绝大多数 数据状态管理场景 需求了。



<br>

暂时就先讲到这里，等以后项目用的多了再补充。
