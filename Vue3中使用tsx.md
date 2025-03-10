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

**如果不是 vite 而是 rsbuild，那么需要使用：`rsbuild-plugin-vue-jsx` 这个插件。**

```
pnpm add -D @rsbuild/plugin-vue-jsx @rsbuild/plugin-babel
```

具体用法可查阅：[rsbuild-plugin-vue-jsx](https://github.com/rspack-contrib/rsbuild-plugin-vue-jsx)

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

> 请注意：我们只能通过 `import './index.scss'` 这种方式将外部定义的 .scss 样式引入到当前组件中。

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

## 生命周期

在 xx.vue 开发组件中会经常用到组件的生命周期函数，例如 onMounted、onUnmounted。

**但是在上面示例中使用的 .tsx 函数式组件 中是不存在组件生命周期的！**

**因为 函数式组件 本质上是一个函数，而不是一个组件，函数是没有生命周期的。**

<br>

**React 是支持函数式组件的生命周期，但那是 react 而不是 Vue。**

<br>

换句话说：本文上面所写的 函数式 tsx 组件仅适用于开发那些不需要 组件生命周期 的组件。

<br>

在 vue3 中如果你想编写有生命周期的 .tsx 组件，那么你只能使用 `defineComponent` 方式。

<br>

## defineComponent定义组件

在 vue3 中可以用 defineComponent 来定义组件。

使用方式：

```
export default defineComponent({
    props:{
        ...
    },
    setup(props){
        ...
        //此处可以编写生命周期函数

        return () => (
          <div></div>
        )
    }
})
```

<br>

对于 vue3.3+ 版本后，可以简写成下面的方式：

```
export default defineComponent((props)=>{
    ...
    //此处可以编写生命周期函数

    onMounted(() => {
        console.log('mounted')
    })

    onUpdated(() => {
        console.log('updated')
    })

    onUnmounted(() => {
        console.log('unmounted')
    })

    return () => (
        <div></div>
    )
},{
    props:{
        ...
    }
})
```

**但是这种方式，在我看来完全违背了 jsx 的理念，对于定义组件 props 来说是别扭、枯燥、烦人的，完全没有体现出 typescript 的优势。**

<br>

## 使用`<script setup lang="tsx">`形式定义组件

直接看一个示例代码：

> xxx.vue

```
<script setup lang="tsx">
import { ref } from 'vue';

// 属性定义
const props = defineProps<{
  message?: string
}>();

const count = ref(0);

const increment = () => {
  count.value++;
};

// 定义渲染函数
const render = () => (
  <div>
    <h1>{props.message}</h1>
    <p>Count: {count.value}</p>
    <button onClick={increment}>Increment</button>
  </div>
);
</script>

<template>
  <render />
</template>

<style smistakes. Please double-check responses.
```

> 在我看来这根本就不是 tsx 组件，而是 .vue 组件的一个变体。

**综上所述，基于这个目前的原因，无论 defineComponent 或 lang="tsx"，我个人觉都有问题，编写组件过程并不流畅。**

<br>

**最终结论：vue3 中暂时慎用 tsx ！**

<br>

## 实际开发中的一些潜在冲突

能够想到的冲突有以下几点。

- 如果 父组件 是 xx.vue，而子组件是 xx.tsx，那么父组件该如何给子组件配置属性？
  
- 同样，如果父组件是 xx.tsx，而子组件是 xx.vue，那么又该如何配置子组件属性？
  

<br>

以上这些相信都有解决方式，只不过目前实际项目中还没有投入使用 .tsx，等待后续更新。
