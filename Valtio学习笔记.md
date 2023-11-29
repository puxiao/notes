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

未完待续....