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
* 但 zustand 不仅可以在函数组件中使用，还可以在类组件、甚至普通 JS 中都可以共用执行
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

这种形式特别适用于 类组件 和 普通 JS 代码模块中。



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
2. 第2个参数：prevState，之前旧的数据状态值



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

* 适用于 类组件 或 纯 JS 模块
* 适用于 瞬时更新 场景



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

**场景2：瞬时更新**

这个场景我们经常会用到。



<br>

先说一下什么是 “瞬时更新” ？

我们知道 zustand 消费端使用的方式类似于 钩子函数，那么也就意味着：

1. zustand 的更新方式并不是实时的，是异步的

2. react18 的并发模式，也会导致 我们在某一瞬间 A组件中 设置修改了 数据状态，但与此同时 B组件 内获取到的数据未必是最新的

3. 假定我们定义了 2 个不同的数据状态，且某组件都需要用到这 2 个数据状态，而这 2 个数据状态都有可能会发生变化

   > 这个场景在实际开发中会经常遇到

假定 B 组件中无论任何情况下都需要第一时间获取最新的数据状态，那么 .subscribe() 就派上用场了。



<br>

**举个例子：**

1. 我们现在定义了一个当前用户的数据状态
2. 我们再定义一个 当前展示第几个 todoList 事项的数据状态
3. 假定我们希望对外封装一个自定义钩子函数 useCurrentTodoData.ts 用来专门获取当前展示 todoData



<br>

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

假定我们有一个组件，该组件只展示当前某 1 条 todoData 信息。

那么该组件同时需要使用：

* useUserData 中的 todoList
* useCurrentIndex 中的 index

而此时 todoList、index 都可能在某个时刻发生变化，且某些时候这些变化并不是在一瞬间同步更新的。



<br>

这种情况下，就需要使用 瞬时更新 的代码套路了。

具体代码套路如下：

* 我们在组件内通过 useRef 勾住数据状态中的某个值
* 我们在 useEffect() 中通过 .subscribe() 添加对该值的监控和更新



<br>

我们直接看代码：

```

```





 
