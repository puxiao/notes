# IndexedDB学习笔记



假设你想系统学习 IndexedDB，推荐直接去  MDN 上面看官方教程：

https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API

本文是我在学习 IndexedDB 总结的学习笔记。



<br>

> 本文所谓的 “官方” 是指 MDN 文档，同时也是指 W3C 官方。



<br>

#### 前端数据存储 localStorage、sessionStorage 的缺点

在前端开发过程中，最经常使用到的本地数据存储是：LocalStorage(本地存储)、SessionStorage(会话存储)

对于一些简单的数据，它们是够用的，但是对于一些复杂的数据存储，它们就存在以下缺点：

1. 存储格式：它们只能以字符串形式储存数据，复杂数据读写时只能靠 JSON 转换

2. 存储大小：localstorage 最大支持 20M、sessionStorage 最大支持 5M

   > 顺道说一下 cookie 最大只支持 4k

3. 读写方式：它们读写都为同步，会阻塞浏览器 JS 进程

**最大的缺点：不支持条件查询**

他们只是负责存储数据，不支持像一般数据库(MySql、MongoDB)那样的 各类查询。



<br>

#### IndexedDB 自带得意的背景音乐出场了

IndexedDB 是目前主流浏览器都支持的一种底层 API 标准，它用来在浏览器(客户端)存储大量的结构化数据，也包括 文件、二进制对象(blobs)。

> 还有一个叫 Web SQL 的，它原本的功能和 IndexedDB 类似，并且它还早于 IndexedDB 出现，但是后来各大浏览器都逐渐放弃(不主推) 它。
>
> 尽管你在浏览器调试工具 > 应用 > 中还能看到 Web SQL。



**IndexedDB的优势：**

1. 储存格式：结构化数据(也就是JS中的各种 Object)、文件、二进制对象(blobs)

2. 存储大小：最大可以使用你硬盘可用空间的 50%

   > 这里的硬盘应该是指 浏览器 所在的安装目录的那个硬盘

3. 条件查询：支持

   > 尽管做不到像 MySQL、MongoDB 那样复杂的各种条件(管线)查询，但是对于一般前端项目而言足够了

4. 支持在 web worker 中操作 IndexedDB



<br>

**IndexedDB 的读写是异步的。**

IndexedDB 可以存储各种数据类型、又支持条件查询、最大储存容量又非常大，因此它的读写不是异步的才怪呢。

好处是：由于是异步，因此每一个操作(增删改查)不会阻塞浏览器 JS 进程

不好的是：由于是异步，因此每一个操作(增删改查)都需要做异步处理

> 不过幸好现在都使用 Promise(承诺)，异步用起来也不是特别麻烦



<br>

**特别说明：**

由于我个人之前学习过 MySQL 和 MongoDB，所以在学习 IndexedDB 时很多概念都比较容易理解。

> 这些 “概念” 包括 表、列、键、自增等术语



<br>

**捋一下几个名词关系：**

1. 在浏览器中，有一个存储区域叫 IndexedDB

   > 就是常规数据库中的数据库本身
   >
   > 实际对应的是 window.IndexedDB：https://developer.mozilla.org/zh-CN/docs/Web/API/indexedDB

2. 在 IndexedDB 下面，可以创建、管理 多个 数据库(db)

   > 对应常规数据库中的某个数据库
   >
   > 实际对应的是 IDBDatabase：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBDatabase

3. 每一次操作都被视作一个事务

   > 实际对应的是 IDBTransaction：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBTransaction

4. 在每一个 数据库(db) 下面可以创建、管理 多个 表

   > 对应常规数据库中的 表
   >
   > 实际对应的是 IDBObjectStore：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBObjectStore

5. 在每一个 表 里可以创建、管理 多条数据

   > 对应常规数据库中的 行

6. 在每一条数据中，包含各种键和值

   > 对应常规数据库中的 列
   >
   > 实际对应的是 IDBIndex：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBIndex



<br>

**IndexedDB 属于 事务性数据库**

我们看一下百度百科中关于 事务性数据库的定义描述：

数据库事务( transaction)是访问并可能操作各种数据项的一个数据库操作序列，这些操作要么全部执行,要么全部不执行，是一个不可分割的工作单位。事务由事务开始与事务结束之间执行的全部数据库操作组成。

转换成比较容易理解的话就是：事(即增删改成操作) 是一件一件来做的，尽管每一件事都是异步的。

<br>

尽管每一次操作(增删改查)都是异步的，但是如果不同模块中先后都执行了某些操作(增删改成)，你依然可以放心，IndexedDB 都会按照每一次操作的先后顺序来执行，确保每一次操作的独立性和完整性。



<br>

**每一次“增删改查” 都是一个独立的 “事务”**

> 在本文后面，我们会把 增删改查 称呼为 事务。



<br>

**关系型 or 非关系型数据库 ？**

IndexedDB 属于关系型数据库还是 非关系型数据库？

从大体上来讲  IndexedDB 看着更像关系型数据库，例如创建表时需要明确配置各个 键名，并且支持 关键键(id)的自增。但与此同时，对于具体的值又支持各类结构化数据，这些看起来又特别像非关系型数据库的特征。

**因此，我个人认为 IndexedDB 实际上是 关系型数据库和非关系型数据库的融合。**



<br>

> 假设你之前没有接触过后端的数据库，例如 MySQL(关系型数据库) 或 MongDB(非关系型数据库)，那么换一种说法你就容易理解了。
>
> 关系型数据库：相当使用 TypeScript 来编写代码，也就是说在声明每一个变量之前，都应该提前定义好该变量的各种属性类型，例句：属性名，属性值类型，甚至哪些是必须必填属性，哪些是可选属性。
>
> 非关系型数据库：相当于使用 JavaScript 来编写代码，每一个变量是什么类型，以及拥有什么属性都是灵活自由的，没有限定的。

> 所谓 “关系” 说直白点、简单点，就是某一个对象究竟应该有用哪些属性值。



<br>

**再次重复一遍：IndexedDB的每一个操作(增删改查)都是异步的**

有了异步的概念，那么接下来在学习的时候就比较容易理解代码了。



<br>

#### 操作1：创建或连接数据库

localStorage、sessionStorage 使用 `getItem()` 来来获取数据，而 IndexedDB 使用 `.open()` 来尝试创建或连接数据库。

```
const request = window.indexedDB.open('mydb', 1)
let db = null

//当各种操作发生错误时
request.onerror = (eve) => {
    alert('读写 IndexedDB 发生错误：', eve.target.errorCode)
}

//当第2次连接该数据库
request.onsuccess = (eve) => {
    db = eve.target.result
    console.log('初次创建或打开 IndexedDB 成功')
}

//当第1次创建数据库
request.onupgradeneeded = (eve) => {
    db = eve.target.result
    //...
}
```

代码解读：`.open('mydb', 1)`

1. 第1个参数为即将 创建或连接 的数据库名

2. 第2个参数表示该数据库的版本号，默认为 1

   > 数据库版本号不同，那么意味着相当于完全不同的两个同名数据库



<br>

代码解读：3 个常规事件

1. onerror：假设执行 `.open('mydb', 1)` 发生错误，对应的事件回调是 `onerror`，即表明 创建或连接失败。
2. onupgradeneeded：假设第一次执行`.open('mydb', 1)` ，此时 IndexedDB 中还没有 "mydb" 这个数据库，那么会 创建 该数据库，对应的事件回调是`onupgradeneeded` 事件，即表明 创建成功。
3. onsuccess：假设第二次执行 `.open('mydb', 1)`，此时 IndexedDB 中已经存在 "mydb" 这个数据库，那么会 连接 该数据库，对应的事件回调是 `onsuccess` 事件，即表明 连接成功。

请牢记一件事：当执行 `.open('mydb', 1)` 后，`onupgradeneeded`  或 `onsuccess`  只会发生两者中的一个事件回调。

我们可以在这 2 个事件的回调函数的参数中得到我们想要数据库的操作连接。

> 这也是为什么在上述的 2 个回调函数中，我们分别都要添加 `db = eve.target.result` 这行代码。



<br>

当我们拿到数据库连接后，就可以对这个数据库添加 表 了。

<br>

#### 操作2：创建表

我们直接把创建表的代码，写到 `onupgradeneeded`  中。

```
request.onupgradeneeded = (eve) => {
    db = eve.target.result
    //创建一个名为 users 的表，并对其进行配置
    const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true })
    objectStore.createIndex('id', 'id', { unique: true })
    objectStore.createIndex('sid', 'sid', { unique: true })
    objectStore.createIndex('name', 'name', { unique: false })
    objectStore.createIndex('tel', 'tel', { unique: false })
    objectStore.createIndex('age', 'age', { unique: false })
}
```



<br>

代码解读：db.createObjectStore()

1. db 是我们拿到的数据库连接

2. 并通过 db.createObjectStore() 函数可以创建表

3. `.createObjectStore()`中 第 1 个参数为表名，第 2 个参数为该表的配置参数

4. 配置参数我们写的是 `{ keyPath: 'id', autoIncrement: true }`

   > 这就意味着 id 每次会自增，也意味着我们无需也不能设置 id 的值，把 id 值的权限交给了 IndexedDB 自动来帮我们处理。

5. 对应的含义为：keyPath——主键、autoIncrement——是否自增

6. 该方法最终返回得到的就是 表



<br>

当我们拿到一个具体的表 后，例如 上述代码中的 objectStore，接下来就是配置该表中的各个键(也就是行)。

代码解读：objectStore.createIndex()

1. 第1个参数：键名
2. 第2个参数：键路径
3. 第3个参数：键的配置项，其中`unique` 用于表示该键是否是唯一不可重复的

在实际操作中，通常情况下我们都会将第 1 和第 2 个参数值设置的完全相同。

> 别问为什么，因为大家都是这样做的。



<br>

#### 操作3：获取表

无论哪种操作，我们都需要先提前设定好是以哪种模式来操作表的。

> 实际对应的是 IDBTransaction：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBTransaction

<br>

并且还根据需要添加对应的 成功失败 回调。

```
//明确以哪种方式来操作该表
const usersTrans = db.transaction('users', 'readwrite')

//配置操作对应的 3 个事件回调

usersTrans.onsuccess = (eve) => {
    console.log('事务成功')
}
usersTrans.oncomplete = (eve) => {
    console.log('事务完成', eve)
}
usersTrans.onerror = (eve) => {
    console.log('事务失败', eve)
}


//拿到该表的实际控制权
const usersStore = usersTrans.objectStore('users')
```

> 请注意：事务的完成和成功是 2 个概念
>
> onsuccess：相当于 Promise 中的 resolve
>
> onerror：相当于 Promise 中的 reject
>
> oncomplete：相当于 Promise 中的 finally



<br>

#### 操作4：向某个表中添加一条数据

```
usersStore.add({
    sid: 38,
    name: 'puxiao',
    tel: `158${Math.floor(Math.random() * 10000000)}`,
    age: 18 + Math.floor(Math.random() * 20)
})
```

> 对于写入操作，一定要确保 usersStore 的模式为 "readwrite"

特别强调：

由于之前代码中，我们在配置 sid 时使用的是 `{ unique: true }`，因此一定要确保 当添加多条记录时，每一条记录中 sid 的值是唯一，不可重复的，否则会添加失败报错。



<br>

#### 操作5：以游标的形式逐条读取数据

我们先说一下什么叫 “游标”，游标 这个是传统数据库中的一个名词。

你可以把它想象成是 JS 中数组循环 `forEach( ( item, index ) => { ... } )` 中的 index。

只不过这个 index 不是一个数字，有很多自身的其他方法。

具体详细的可以查看：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBCursor



<br>

**示例代码：**

```
const usersTrans = db.transaction('users', 'readonly')
const usersStore = usersTrans.objectStore('users')
const request = usersStore.openCursor()

request.onsuccess = (eve) => {
    const cursor = eve.target.result
    if (cursor) {
        console.log(cursor.value)
        cursor.continue()
    } else {
        console.log('已经全部读取完毕')
    }
}
```



代码解读：

1. 由于是读取，因此我们将事务模式设定为只读模式 "readonly"
2. 在得到表后，通过它的 .openCursor() ，以游标的形式来打开访问该表中的内容
3. 在打开游标的 onsuccess 事件回调，我们可以通过 eve.target.result 来得到当前游标
4. 默认第1个游标对应的是该表中第1行(数据)，我们就可以通过该游标的 .value 属性得到该条数据具体的值
5. 由于游标默认只表示当前一条数据，我们可以通过执行游标的 .continue()，让游标切换到下一条数据中 
6. 假设当前表中没有数据，或者是已经全部读取完毕，那么此时游标的值在条件判断语境中不为真，我们就可以看作是 "已经全部读取完毕"



<br>

#### 操作6：一次读取表中全部的数据

通常情况下，我们是推荐以游标形式，逐条遍历整个表的，因为这样对于一次操作的性能来说压力不大。

但是假设数据量不大的情况下，我们也可以通过表的 `getAll()` 函数一次性获取表中全部的数据。

```
const usersTrans = db.transaction('users', 'readonly')
const usersStore = usersTrans.objectStore('users')
const request = usersStore.getAll()
request.onsuccess = (eve) => {
    console.log(eve.target.result) //输出全部数据
}
```



<br>

#### 操作7：查找某 id 对应的数据

可以通过表的 .get() 方法去根据某些条件查找数据。

```
const usersTrans = db.transaction('users', 'readonly')
const usersStore = usersTrans.objectStore('users')
const request = usersStore.get(38)
request.onsuccess = (eve) => {
    console.log(eve.target.result)
}
```

请注意：假设检索到数据后，会克隆并返回该数据。



<br>

关于查询，还有一个对象：IDBKeyRange，它可以用于设置某种范围内的查询。

https://developer.mozilla.org/zh-CN/docs/Web/API/IDBKeyRange



<br>

#### 操作8：清空表中的数据

执行表的 .clear() 方法可以清空表中全部的数据。

```
const usersTrans = db.transaction('users', 'readwrite')
const usersStore = usersTrans.objectStore('users')
const request = usersStore.clear()
request.onsuccess = (eve) => {
    console.log(eve.target.result)
}
```



<br>

以上为一些常规的各种 IndexedDB 表的操作。

更多细节和方法请查阅：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBObjectStore/



<br>

#### 回顾总结

我们回顾一下上面学习到的这些对象。

> 实际上只需要把这些对象关系搞清楚，用到谁了直接去 MDN 查看它们具体的 属性/方法/事件 即可。

1. IndexedDB：不可以被我们自己实例化，只能通过 window.indexedDB 来获取
2. IDBDatabase：数据库连接，管控数据库创建、连接、断开等
3. IDBTransaction：事务，需要配置哪种模式下进行各种操作
4. IDBObjectStore：表，在创建之初需要设定表中行的每一项键名，键路径，以及是否为唯一值
5. IDBRequest：请求操作，增删改查都属于请求操作中的一种，增删改查拥有的共同的请求和回调机制
6. IDBCursor：游标，当前表中正在读取到的 "索引"，若游标有值的情况下，可以通过游标的 .continue() 切换到下一条游标(数据)



<br>

作为初学者，假设上面这些对象概念和关系理解清楚后，那么就算是会使用 IndexedDB 了。

当然，IndexedDB 还有更多其他复杂的操作，例如不同表之间进行关联和查询。

> 这里面牵扯到 IDBIndex：https://developer.mozilla.org/zh-CN/docs/Web/API/IDBIndex



<br>

#### IndexedDB 相关的第三方库

由于 IndexedDB 的各种查询都是异步的，并且属于比较原始的那种 API 操作。

在实际的项目开发中，为了方便和快速，可以使用第三方，那些针对 IndexedDB 再次封装的类库。

目前使用比较多的是：

1. dexie.js：https://github.com/dexie/Dexie.js
2. localForage：https://github.com/localForage/localForage
3. ...

