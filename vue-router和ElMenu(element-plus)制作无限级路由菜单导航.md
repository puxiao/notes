# vue-router和ElMenu(element-plus)制作无限级路由菜单导航



<br>

**需求描述：**

* vue3 开发的管理后台左侧需要有一个菜单面板
* 使用 vue-router 来定义页面路由
* 使用 element-plus 的 ElMenu 组件来做左侧菜单面板



<br>

**定义路由：**

对于 vue-router 的 routes 来说，它支持无限级子项，例如下面的示例：

```
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    ...
    {
        path: '/second',
        name: 'second',
        children: [
            {
                path: 'a',
                name: 'second-a',
                children: [
                    {
                        path: 'x',
                        name: 'second-a-x',
                        component: () => import('./pages/second/a/x/index.vue')
                    }
                ],
            },
        ],
    },
    ...
]

export default routes
```



<br>

**问题点1：** 上述路由配置项的 path 值为相对路径，也就是说只要是同一级唯一即可，但是对于 ElMenu 的 ElSubMenu 和 ElMenuItem 标签来说，它们的 index 属性却要求全局唯一。

**问题点2：** 此外 ElMenu 的子项本身**不支持自动无限级**，还需要我们**自己写递归去创建**不同级的子项菜单内容。



<br>

**问题点1的解决方案：**

解决思路是我们不直接将当前层级的 路径(.path) 作为 菜单子项 index 属性的值，而是通过拼凑将 `父级绝对路径 + 当前路径` 作为 index 属性值，这样就确保了 index 符合路由路径且全局唯一。



<br>

**问题点2的解决方案：**

ElMenu 的子项有 2 种：

* 无下拉子项菜单的子项：ElMenuItem

  > ElMenuItem 对应 `<el-menu-item>` 标签

* 有下拉子项菜单的子项：ElSubMenu

  > ElSubMenu 对应 `<el-sub-menu>` 标签

那么我们就自定一个 MenuItem 组件：

* 会根据当前路由 children 是否有值来决定创建出的是 ElMenuItem 还是 ElSubMenu
* 若当前路由 children 有子项那么通过自身递归继续渲染下一级



<br>

**在 Vue3 组件内部如何递归引用自己？**

我们只需要在组件内部的 `<script>` 标签中增加 `name` 属性即可实现内部引用自己。

```diff
- <script setup lang='ts'>
+ <script setup lang='ts' name='MenuItem'>
```

> 按照上述配置，在当前组件 `MenuItem` 内部可以使用 `MenuItem` 来使用自己。



<br>

基础实现思路就是这些，那么下面直接贴上一个简单的示例代码。



<br>

## 示例代码



<br>

> /src/routes.ts

```
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('./pages/home/index.vue')
    },
    {
        path: '/first',
        name: 'first',
        children: [
            {
                path: 'a',
                name: 'first-a',
                component: () => import('./pages/first/a/index.vue')
            },
            {
                path: 'b',
                name: 'first-b',
                component: () => import('./pages/first/b/index.vue')
            },
            {
                path: 'c',
                name: 'first-c',
                component: () => import('./pages/first/c/index.vue')
            }
        ],
    },
    {
        path: '/second',
        name: 'second',
        children: [
            {
                path: 'a',
                name: 'second-a',
                children: [
                    {
                        path: 'x',
                        name: 'second-a-x',
                        component: () => import('./pages/second/a/x/index.vue')
                    },
                    {
                        path: 'y',
                        name: 'second-a-y',
                        component: () => import('./pages/second/a/y/index.vue')
                    }
                ],
            },
            {
                path: 'b',
                name: 'second-b',
                component: () => import('./pages/second/b/index.vue')
            },
            {
                path: 'c',
                name: 'second-c',
                component: () => import('./pages/second/c/index.vue')
            }
        ],
    },
    {
        path: '/third',
        name: 'third',
        component: () => import('./pages/third/index.vue')
    }
]

export default routes
```



<br>

**MenuItem.vue**

这是我们示例中最核心的代码。

> /src/MenuItem.vue

```
<script setup lang='ts' name='MenuItem'>

import { ElMenuItem, ElSubMenu } from 'element-plus';
import { RouteRecordRaw } from 'vue-router';

defineProps<{
    route: RouteRecordRaw
    parentPath: string
}>()

const hasChildren = (route: RouteRecordRaw) => {
    return route.children && route.children.length
}

const mergePath = (parentPath: string, selfPath: string): string => {
    return `${parentPath !== '' ? parentPath + '/' : ''}${selfPath}`
}

</script>

<template>
    <ElSubMenu v-if='hasChildren(route)' :index='mergePath(parentPath, route.path)'>
        <template #title>
            <span>{{ route.name }}</span>
        </template>
        <template v-if='route.children'>
            <MenuItem v-for="child in route.children" :key="child.path" :route="child"
                :parentPath='mergePath(parentPath, route.path)' />
        </template>
    </ElSubMenu>
    <ElMenuItem v-else :index='mergePath(parentPath, route.path)'>
        {{ route.name }}
    </ElMenuItem>
</template>

<style scoped lang='scss'></style>
```



<br>

> /src/main.ts

```
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue'
import routes from './routes'
import 'element-plus/dist/index.css'
import './style.css'

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

createApp(App).use(router).use(ElementPlus).mount('#app')
```



<br>

> /src/App.vue

```
<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router';
import MenuItem from './MenuItem.vue';
import routes from './routes';

const router = useRouter()
router.beforeEach((to, from, next) => {
    console.log('-----------')
    console.log('从:', from.fullPath, '到:', to.fullPath)
    next()
})

</script>

<template>
    <div style='display: flex;'>
        <div style='width: 200px;'>
            <ElMenu router>
                <MenuItem v-for="route in routes" :key="route.path" :route='route' parentPath='' />
            </ElMenu>
        </div>
        <RouterView />
    </div>
</template>

<style scoped lang="scss"></style>
```

> **温馨提示：** 对于第一级菜单子项，我们将其的 parentPath 属性设置为 空字符串。但是随着后面层级的不断递归，每一级的 parentPath 都会逐层累加，以确保符合 ElMenu 子项中 index 属性值的全局唯一要求。
