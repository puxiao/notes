# zustand学习笔记

**zustand是目前 React 最好的状态管理库，没有之一。**

zustand 比 Recoil、jotai 还都要好。

当然也有人喜欢使用 valtio，认为 valtio 也很好。

> 我个人没有使用过 valtio，我看了它的一些简单示例后我认为还是 zustand 好。

> 顺带说一句：jotai、valtio、zustand 都归属于 pmndrs。



<br>

## zustand的优势(赞美之词)

**zustand相对于 Recoil、jotai 的优势：**

Recoil、jotai 核心理念都是 “原子状态，即数据为最小不可分割”。

> 我实际项目中只使用过 Reoil，并没有使用过 jotai，但二者几乎相同

在这个理念之下，就会造成面对管理复杂对象时，数据管理颗粒不够细，捉襟见肘。

举一个例子：假设有一个批次，该批次中包含 50 个帧数据，每一条帧数据中包含 100-200 个子元素，每一个子元素又包含自己的一些属性。

这个状态可能结构如下：

```
{
  bid: 'xxxxx',
  ...,
  list:[
    {
      id: 'xxxx',
      list: [
        {
          uid: 'xxx',
          attrs: { ... }
        },
        ...
      ]
    },
    ...
  ]
}
```

面对如此复杂的数据对象，此时使用 Recoil 时，当想更新某一个子元素的值，你可能需要：

* 添加 `dangerouslyAllowMutability:true` 配置项
* 被迫克隆整个数据，然后修改其中的某个子项，再将克隆修改后的数据整体替换之前的

实际操作起来，真的会难受。



<br>

zustand 来了，如果使用 zustand 就比较容易解决上面这些问题。



<br>

**zustand 继承和超越了 Recoil、jotai 这些状态库的全部优点，并且在这些之上还有更多灵活、强大的特性。**

但是请不用担心 zustand 会比较难，恰恰相反，zustand 非常简单，很容易上手。



<br>

**zustand的优点有：**

* Recoil、jotai 有的优点 zustand 都有
* zustand 消费对象(使用者)类似于钩子(hooks)函数
* 但 zustand 不仅可以在函数组件中使用，还可以在类组件、甚至普通 JS (非 React) 中都可以共用执行
* zustand 对于数据状态管理的颗粒度非常只有，甚至是可以无限任你发挥



<br>

## zustand基础用法



<br>

zustand 的官方使用介绍：https://github.com/pmndrs/zustand

本文只是在该介绍页的基础上，加上自己实际项目中的经验，若有理解有误欢迎指正。



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

> 请注意我们将原始的 id 在组件内部对应的变量名改为 userId

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

> 再重复一遍：(newData) => set(newData) 是箭头函数  (newData) => { set(newData) } 的简写



<br>

**set：** 用于设置修改当前数据状态

set 有 2 种形式：

* 具体的值
* 一个回调函数



<br>

第1种形式：具体的值

* 第 1 个参数为具体的值，第 2 个参数为可选参数，类型为 布尔值，默认为 false

  也就是说 `(newData) => set(newData)` 等同于 `(newData) => set(newData, false)`

  这种情况下 newData 会与当前数据状态进行属性字段合并，换句话说可以对 当前状态的 部分属性进行更新，这也是为什么 newData 的类型定义为 `Partial<UserData>`

* 假设第 2 个参数值为 true，即 `(newData) => set(newData, true)`，那么此时不再是部分字段合并 而是 整体替换

  我个人非常不建议采用此方式，一定要慎用



<br>

第2中形式：一个回调函数

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

**get：** 用于在函数内部获取当前数据状态

具体用法为：

```
setData: (newData) => {
   const list = get().todoList
   set(...)
})
```



<br>

**特别补充：**

实际上 create() 函数中除了 set, get 外还有第 3 个参数：api

即：

```
const useUserData = create<UseUserData>((set, get, api) => ({ ... }))
```

第 3 个参数 api 我们暂时用不到，所以也先不讲了。



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



<br>

**关于自定义函数的特别说明：异步函数**

zustand 的修改函数中，是支持异步函数的。

> 在本文上面中，我们所展示的示例函数 都不是异步的。

假设有一个数据为从服务器上根据用户id 获取他的 文章列表，那么我们的网络请求都可以直接写在 状态对象中。

例如：

> 下面是伪代码

```
const useArticleList = create((set) => ({
    list: [],
    fetch: async (id:string) =>{
        const response = await fetch( ... ) //发起网络请求
        set({list: response....}) //将网络请求结果处理并通过 set 赋值给 list
    }
}))
```

> 实际上我个人并不建议将网络请求相关代码也放到 useXxxxData 中，还是应该将网络请求和返回结果数据处理的代码抽离出来。



<br>

好，让我们暂时忘掉 异步函数，回到 增删改查 中。

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

2. react18 的并发模式，也会导致 我们在某一瞬间 A组件中 设置修改了 数据状态，但与此同时 B组件中的某函数 获取到的数据未必是最新的

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
import useCurrentTodoData from "../../hooks/useCurrentTodoData"

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

**性能优化之：shallow**

```
import shallow from 'zustand/shallow'
```

`shallow` 这个单词的含义为：肤浅的

`shallow` 是 zustand 为我们提供的一个函数，用于对 2 个对象值的 "浅对比"。



<br>

我们知道 React 中的 Diff 函数是索引加值对比，例如 {} 与 {} 虽然字面值相同，但是依然会被判定为 2 个不同的值(因为它们 2 个不属于同一个对象的引用)，而 浅对比 值判断字面值是否相同，若字面值相同即认为没有发生数据变化，因此也不需要重新渲染组件。



<br>

**举个例子：**

假定 useXxxData 数据状态包含 .a、.b、.c 3 个数据字段，那么就会存在下面这种情况：

* 假定 A组件中只用到了 .a 数据字段

* 假定 B组件中只用到了 .b 数据字段

* 假定 C组件中可以修改 .c 的数据字段

* 当 C组件 修改了 数据状态 .c 的值后，引发了 useXxxData 的更新，此时会牵连到 A组件和 B组件也同步更新

  尽管 A 组件和 B组件中 并没有使用到 .c 字段



<br>

为了减少 A组件 和 B组件 无谓的重新渲染，我们可以使用 zustand 为我们提供的 shallow 函数了。

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

这算是 zustand 最简单有效的一种性能优化方式。



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
import useUserData from "../../store/useUserData"
import { TodoData } from "../../types"

const customShallow = (objA: TodoData[], objB: TodoData[]): boolean => {
    return objB.length < 3
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

## 总结：



总结：

* 到目前为止，我们已经学习掌握了 zustand 的基础用法
* 如何在 类组件中 使用 zustand
* 衍生(派生)数据 的使用方法
* 使用 shallow 和自定义 shallow 函数来做一些基础的性能优化

已经算是对 zustand 有了足够的认知，可以满足绝大多数 数据状态管理场景 需求了。



<br>

但是，关于 zustand 还有 3 部分没有学习：

* 在普通 js (非 react 框架) 下如何使用 zustand
* 如何将 zustand 的全局作用域限定为某局部作用域
* zustand 的一些中间件用法
  * 例如利用中间件 devtools 浏览器中实时查看 zustand 数据状态

<br>

这些知识点由于我在实际项目中也没有使用过，所以暂时就先讲到这里，等以后用到了再补充。
