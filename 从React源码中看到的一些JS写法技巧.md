# 从React源码中看到的一些JS写法技巧

## 目录

### 小技巧

* 将值转化为字符串
* 使用 $$ 来标记特殊属性名
* 使用 /*  */ 来让代码右侧对齐



### 大智慧

* 使用 Symbol.for() 来验证对象是否合法
* 使用 二进制数字 标记状态，便于汇总最终状态



## 小技巧

#### 1、将值转化为字符串

```
key = '' + config.key
```



#### 2、使用 $$ 来标记特殊属性名

```
$$typeof: REACT_ELEMENT_TYPE
```

> $$ 并不是什么特殊语法，使用 $$ 纯粹是为了在内部用来凸显、标记某个属性名  
> 在调用该属性时和普通属性无任何区别：object.$$typeof



#### 3、使用 /*  */ 来让代码右侧对齐

```
export const NoFlags = 0b0000000000000000000;
export const PerformedWork = 0b0000000000000000001;
export const Placement = 0b0000000000000000010;
export const Update = 0b0000000000000000100;
export const PlacementAndUpdate = 0b0000000000000000110;
```

为了让二进制值右侧对齐，可以通过添加 /*  */ ，使用不同数量的空格占位，以便右侧对齐，修改后如下：

```
export const NoFlags = /*                      */ 0b0000000000000000000;
export const PerformedWork = /*                */ 0b0000000000000000001;
export const Placement = /*                    */ 0b0000000000000000010;
export const Update = /*                       */ 0b0000000000000000100;
export const PlacementAndUpdate = /*           */ 0b0000000000000000110;
```



## 大智慧

#### 1、使用 Symbol.for() 验证对象是否合法

**是否合法？**  
这里说的 “是否合法” 是指该对象是由 JS 创建的，而非 JSON 创建的。

**为什么？**  
因为 JSON 创建的对象可能内嵌不安全的代码

**实现原理？**  
利用 JSON 无法存在 Symbol 值的特性，来验证某属性是否值是否是 Symbol

> 知识点：**通过 Symbol.for(str) 创建的 Symbol 实例，则可通过引用来实现多次对比。**

**具体如何实现？**

第1步：创建一个内部的常量，例如 REACT_ELEMENT_TYPE

```
//在外部，声明一个 REACT_ELEMENT_TYPE 并具有默认值
export let REACT_ELEMENT_TYPE = 0xeac7;

//若当前 JS 支持 Symbol 则使用 Symbol.for() 修改 REACT_ELEMENT_TYPE 的值
if (typeof Symbol === 'function') {
  REACT_ELEMENT_TYPE = Symbol.for('react.element');
}

//经过以上操作，我们对外导出 REACT_ELEMENT_TYPE 

//事实上目前绝大多数JS运行环境都支持 Symbol，所以实际中可以直接使用 Symbol.for() 来创建常亮，无需再做过多判断
```

第2步：创建一个对象，并为其添加 特殊属性

```
const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    ...
}
```

> 上述代码中，创建一个对象 element，并添加一个 $$typeof 的属性名，属性值为 REACT_ELEMENT_TYPE

第3步：当需要验证 某对象是否为内置合法对象时，则通过对比 $$typeof 来判断

```
function isValidElement(object) {
  return (
    typeof object === 'object' &&
    object !== null &&
    object.$$typeof === REACT_ELEMENT_TYPE
  );
}
```

> 请注意上述代码中的 `object.$$typeof === REACT_ELEMENT_TYPE` ，通过判断对象的 $$typeof 属性值与内置的 REACT_ELEMENT_TYPE 是否相同，以此来验证对象是否合法。

为什么需要验证？  
答：担心对象并不是由 React 创建的，而是别人通过 JSON 动态创建的，因为使用 JSON 可以内嵌恶意代码(XSS 攻击)。



#### 2、使用 二进制数字 标记状态，便于汇总最终状态

假设某个对象(React中的节点)，需要有以下几种状态：

1. NoFlags：不做任何操作
2. PerformedWork：已经完成操作
3. Placement：需要插入
4. Update：需要更新
5. PlacementAndUpdate：需要插入的同时，还需要更新
6. Deletion：需要删除
7. ContentReset：需要重置



按照一般的习惯，我们可能会使用不同的常量值来指不同的状态。例如：

NoFlags = 0、PerformedWork = 1、Placement = 2、Update = 3、PlacementAndUpdate = 4

> 当然可能不是数字，而是字符串。



**模拟一个使用场景**

假设这个对象的状态，是由 2 个处理函数 计算得出的：

1. A 函数计算结果为 a，表明是否需要插入
2. B 函数计算结果为 b，表明是否需要更新

那么这 2 个函数计算的结果 a、b 可能存在以下组合结果：

1. 不需要插入，不需要更新
2. 不需要插入，需要更新
3. 需要插入，不需要更新
4. 需要插入，需要更新

假设最终处理状态的函数为 do()，那么需要分别将 a 和 b 的值汇总在一起 传递给 do()。

至于如何 "汇总"，可以采用：

1. do() 有多个参数
2. 将 a b 组成一个组数，将该数组传递给 do()



**有没有简单的汇总方式？**

答：我们可以将 不同状态 对应的常量值类型，修改为 二进制数字。所谓 汇总 只不过是 进行 a + b，最终将计算结果(也是二进制值)传递给 do() 即可。



**具体实施方式：**

第1步：将不同状态的值 设置成 二进制数字

```
export const NoFlags = 0b0000000000000000000;
export const PerformedWork = 0b0000000000000000001;
export const Placement = 0b0000000000000000010;
export const Update = 0b0000000000000000100;
export const PlacementAndUpdate = 0b0000000000000000110;
export const Deletion = 0b0000000000000001000;
export const ContentReset = 0b0000000000000010000;
```

第2步：汇总状态

假设 分别计算出需要更新的状态为：

1. a：Placement > 0b0000000000000000010
2. b：Update > 0b0000000000000000100

那么汇总 a 和 b 就可以通过 二进制运算来得出最终状态值：

```
let result = NoFlags //先得到一个初始值 0 ， NoFlags 即 什么也不操作

//使用二进制 按位或操作，先汇总 a 的值
result |= a
//这行代码相当于：result = result | a，对于二进制来说相当于相加操作

//再使用二进制 按位或操作，汇总 b 的值
result |= b
```

**最终，result 的值即最终汇总的 状态对应的值。** 

> 假设同时需要插入和更新，那么上面最终汇总计算结果的值，就是 PlacementAndUpdate 的值 0b0000000000000000110
>
> 在 do() 函数中可以通过 switch 该值 得到最终所需的执行操作状态。



**补充：二进制的按位操作**

假设有两个二进制数字，他们分别是 B1，B2，其中某相同位置对应的值分别是 b1，b2。

> b1、b2 的值只能是 0 或 1

那么对应的各种 按位操作符 的含义如下：

1. &：相当于 b1 & b2，只有 b1、b2 都为 1 时，最终计算值才会是 1
2. |：相当于 b1 | b2，只要 b1 或 b2 其中一个为 1，最终计算结果就为 1
3. ^：相当于 b1 !== b2，若 b1 b2 的值相同，则最终结算结果为 0，若不同 则最终计算结果为 1

以上操作都是针对 两个二进制数字 对比计算的，还有另外一个按位计算符 ~，但这个计算法是针对 一个二进制数据操作的。

1. 把 二进制数字 转化成 32 位二进制数字
2. 把得到的这个二进制数字进行 按位取反
3. 把取反后的二进制数字转化为 浮点数

整个过程操作完成后，其实相当于目标数字 转化为负的32位数字再减1。

例如：~12 的结果为 -(12) -1 ，即 -13

同理，~-13 的结果为 -(-13) -1，即 12