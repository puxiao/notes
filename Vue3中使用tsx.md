# Vue3中使用tsx

<br>

**首先第一个问题：为什么想在 vue3 中使用 jsx 语法方式编写组件？**

额~，因为我本身写了 3 年的 react，最近 1 年都在写 vue3，既然 vue3 也支持 jsx 方式创建组件，那么就尝试一下。

<br>

好，开始吧。

<br>

## Vue3 + Vite + tsx 项目环境搭建

**使用 Vite 创建项目**

```
pnpm create vite
```

<br>

**配置typescript：**

```diff
{
    "compilerOptions": {
+       "jsx": "preserve",
+       "jsxImportSource": "vue"
    }
}
```

<br>

**安装 vite 对应的 tsx 插件 NPM 包：**

```
pnpm add -D @vitejs/plugin-vue-jsx
```

<br>

**修改vite.config.ts**

```
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
    plugins: [vue(), vueJsx()],
})
```

> 插件中增加 vueJsx

<br>

至此，前端项目的基础配置环境完成。

<br>

## .vue转.tsx

下面演示一个比较基础简单的 .tsx 组件，组件包含了：属性传值、条件渲染、for 循环、点击事件处理

<br>

**HelloWorld.tsx**

```
import './index.scss'

interface HelloWorldProps {
    msg: string,
    url: string
    list: { label: string, value: string }[]
    footVisible: boolean
    click: (str: string) => void
}

const HelloWorld = ({ msg, url, list, footVisible, click }: HelloWorldProps) => {
    return (
        <div class='hello-world-container'>
            <a href={url}>{msg}</a>
            <div>
                {
                    list.map((item, index) => {
                        return (
                            <span
                                class={"item"}
                                key={index}
                                onClick={() => click(item.value)}
                            >
                                {item.label}
                            </span>
                        )
                    })
                }
            </div>
            {
                footVisible ? (
                    <footer>Footer</footer>
                ) : null
            }
        </div>
    )
}

export default HelloWorld
```

> 注意：组件属性传递处理函数时，切记不要以 onXxx 开头，因为 onXxx 这种是 .tsx 组件中传递事件处理函数的默认形式。
> 
> 在上面代码中我们把 点击事件处理函数 对应的组件属性名为 "click"，如果你定义成了 onClick 那么就会和组件本身的 onClick 互受影响。

<br>

**App.tsx**

```
import HelloWorld from "./components/HelloWorld"

const App = () => {

    const handleClick = (str: string) => {
        console.log(str)
    }

    return (
        <HelloWorld
            msg="Hello"
            url="https://google.com"
            list={[
                { label: 'A', value: 'a' },
                { label: 'B', value: 'b' },
                { label: 'C', value: 'c' }
            ]}
            footVisible={false}
            click={handleClick}
        />
    )
}

export default App
```

<br>

**main.ts**

```diff
import { createApp } from 'vue'
import './style.css'

- import App from './App.vue'
+ import App from'./App'

createApp(App).mount('#app')du
```

> 对于引入 xx.tsx 文件，是可以省略后缀 .tsx 的

<br>


## tsx中使用pinia

在 vue 的 tsx 函数式组件中，使用 pinia 定义的状态很简单。

<br>

假设我们定义了一个 useMyData 状态：

```
import { defineStore } from "pinia";

interface MyDataState {
    name: string;
    age: number;
}

const useMyData = defineStore("myData", {
    state: (): MyDataState => ({
        name: "puxiao",
        age: 39,
    }),
    actions: {
        addAge() {
            this.age++
        }
    }
})

export default useMyData
```

<br>

我们把之前的 HelloWorld 组件改造一下：

```diff
+ import { useMyData } from '../stores'
import './index.scss'

interface HelloWorldProps {
    msg: string,
    url: string
    list: { label: string, value: string }[]
    footVisible: boolean
    click: (str: string) => void
}

const HelloWorld = ({ msg, url, list, footVisible, click }: HelloWorldProps) => {

+    const myDataStore = useMyData()

    return (
        <div class='hello-world-container'>
+            <h1>{myDataStore.name} - {myDataStore.age}</h1>
+            <button onClick={() => myDataStore.addAge()}>add age</button>
            <a href={url}>{msg}</a>
            <div>
                {
                    list.map((item, index) => {
                        return (
                            <span
                                class={"item"}
                                key={index}
                                onClick={() => click(item.value)}
                            >
                                {item.label}
                            </span>
                        )
                    })
                }
            </div>
            {
                footVisible ? (
                    <footer>Footer</footer>
                ) : null
            }
        </div>
    )
}

export default HelloWorld
```

> 在 .tsx 组件中不需要 .vue 中 storeToRefs

<br>

## 实际开发中的一些冲突

能够想到的冲突有以下几点。

- 如果 父组件 是 xx.vue，而子组件是 xx.tsx，那么父组件该如何给子组件配置属性？
  
- 同样，如果父组件是 xx.tsx，而子组件是 xx.vue，那么又该如何配置子组件属性？
  
- xx.tsx 组件中如何编写 组件的各种生命周期函数？
  
- xx.tsx 组件中如何组织 css 样式？
  

<br>

以上这些相信都有解决方式，只不过目前实际项目中还没有投入使用 .tsx，等待后续更新。
