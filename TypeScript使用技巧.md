## TypeScript使用技巧

本文是在 王亦斯 的 2 篇文章基础上，整理和补充而来：

巧用 TypeScript：https://zhuanlan.zhihu.com/p/39620591  
巧用 TypeScript (二)：https://zhuanlan.zhihu.com/p/64423022

我会按照他的原文顺序来逐个重新过一遍，但是在中间会根据自己实际运行结果，补充或添加自己的使用建议。

> 本文中的命名约定：
>
> 1. 凡是 interface 定义的，格式都为 I + Xxxx，例如 IPerson
> 2. 凡是 type 定义的，格式都为 Xxxx + Type，例如 PersonType



## TypeScript阅读本文前需要了解的知识点

1. 泛型：使用<\> 来包裹
2. 泛型约束：使用泛型来约束类型，有非常多不同的使用方法，例如 type PersonType<T\> = T ; 约束返回值的类型必须等同于T
3. TypeScript内置的映射类型：Pick 、Partial、Required、Readonly、Record、Omit、Exclude、Extract、NonNullable、ReturnType、InstanceType
4. keyof：获取 interface 定义中的属性名
5. typeof：推导出 变量或实例对象对应的 type类型
6. in：只允许在 type类型内部使用，用来获取 type类型的属性名
7. infer：在 extends 条件推断中 待推断类型的变量，(我暂时没明白 infer 的用法)



## (1)注释——给注释对象提供友好的提示信息

在TypeScript中，通过添加多行注释，可以给注释对象添加友好的提示信息，例如：

```
/** 定义Person的接口 */
interface IPerson {
    name:string
}
```

> 只能是多行注释，单行注释则不无法提供提示信息
> 补充：在VSCode中设置多行注释的快捷键为 shift + alt + a、或者安装插件 koroFileHeader，对应添加快捷键为 ctrl + alt + t



## (2)注释——符合JSDoc规范的关键词

在 TypeScript 的注释中，可以添加遵循 JSDoc 注释规范的关键词。
在多行注释中，输入 @ 即可出现支持的关键词，例如 @description 表示描述、@param 表示参数、@return 表示返回值、@example 表示使用示例，等等。

```
/**
 * @description 定义Person的接口
 */
interface IPerson {
    name:string
}
```



## (3)typeof——由实例推导出类型

通常情况下，我们会先定义类型，然后再定义实例，例如：

```
interface IPerson {
    name: string,
    age: number
}

const person: IPerson = {
    name: 'puxiao',
    age: 34
}
```

上面是标准正确的写法，没有任何问题，但是假设我们希望偷懒，少写一些代码，那么可以这样做：先定义实例 person，然后通过 typeof 让 TypeScript 推导 出类型。

```
const person = {
    name: 'puxiao',
    age: 34
}

type PersonType = typeof person
```

> 在 TypeScript 中，typeof 可以获取变量或对象的类型，得到的类型是由 TypeScript 推导(推理) 出来的，可以是任何结构形式的类型
> 在 JavaScript 中，typeof 可以获取变量或对象的类型，只不过得到的类型结果只能是：undefined、string、number、boolean、symbol、object、function



**特别提醒：**

由于是从实例(变量或对象) 反向推理 出对应类型，而实例中的某属性一定是固定类型的，所以请看下面代码：

```
interface IPerson {
    age: string | number
}

const person = {
    age: '34岁'
}

type PersonType = typeof person
```

上面代码中，由于 person.age 为字符串，所以 PersonType 实际结果为：

```
type PersonType = {
    age: string;
}
```

IPerson 和 PersonType 是不相同的，所以请注意：typeof 是无法满足、推理出属性中有`联合类型`的情况。



## (4)联合类型——符号|的用法、泛型约束

> 这一小节，我认为原文写的并不对，我完全按照自己的逻辑来重写一遍。

假设 person 有一个属性 age，该属性可能为字符串 '34岁'(string) 或者为数字 34(number)，那么在定义 IPerson 时，我们很容易想到：

```
interface IPerson {
    age: string | number
}
```

另外一种情况，假设 person 的属性可能有 boyName 或 grilName，且只能同时存在其中 1 个，那么：

```
interface IPerson {
    boyName?: string,
    grilName?: string
}

const person: IPerson = {
    boyName: 'puxiao',
    grilName: 'meinv'
}

---------- 或 ----------

type PersonType = {
    boyName: string
} | {
    grilName: string
}

const person: PersonType = {
    boyName: 'puxiao',
    grilName: 'meinv'
}
```

以上代码中，无论是 interface的 ?: 或 type的 |，都不能解决需求，该如何写？

经过微信群求助，最终网名叫 “夏笙” 的网友给出了比较符合的答案——使用泛型约束：

```
interface IPerson {
    age: number
}
interface IBoyPerson extends IPerson {
    boyName: string
}
interface IGrilPerson extends IPerson {
    grilName: string
}

type PersonType<T> = T
// 这就是 泛型约束，要求目标类型和最终实例类型必须一致

const person: PersonType<IBoyPerson> = {
    age: 34,
    boyName: 'puxiao',
    grilName: 'meinv'
    // TypeScript错误提示：不能将类型“{ age: number; boyName: string; grilName: string; }”分配给类型“IBoyPerson”。
    // 对象文字可以只指定已知属性，并且“grilName”不在类型“IBoyPerson”中。
}
```



## (5)查找类型——将复杂属性进行拆分

假设某个类型的某属性也是复杂对象(复杂类型)，例如：

```
interface IPerson {
    info: {
        name: string,
        age: number
    }
}
```

上述代码中，可以将 info 单独拿出来定义一个类型，然后在 IPerson 中使用，代码如下：

```
interface IInfo {
    name:string,
    age:number
}

interface IPerson {
    info:IInfo
}
```

> 注意，后面的写法虽然也完全可以使用，但是 info 的语法提示略微差一些。
> 上面的写法会直接显示出完整的类型结构，但是下面的写法只会显示 IPerson.info: IInfo
> 个人建议是：如果不是属性数量过多、类型过于复杂，到了必须把属性分开写的程度，建议还是采用上面那种方式来定义类型。



## (6)查找类型+泛型+keyof——增强代码提示

直接看下面代码：

```
interface IURL {
    url: string,
    str: string
}

interface IAPI {
    '/user': { name: string },
    '/menu': { list: IURL[] }
}

const getData = async <URL extends keyof IAPI>(url:URL):Promise<IAPI[URL]> => {
    return fetch(url).then(res => res.json())
}

getData('/user').then(res => res.name)
getData('/menu').then(res => res.list)
```

> 查找类型：IAPI['/menu'].list 的 IURL[]
> 泛型：<URL extends keyof IAPI\>(url:URL):Promise<IAPI[URL]\>
> keyof：URL extends keyof IAPI



## (7)显式泛型

原文举得例子，我没看明白，只能凭感觉，举一个自己写的例子，同时，对 keyof 的用法再次做一个回顾：

```
interface IPerson {
    name: string,
    age: number
}

const person: IPerson = {
    name: 'puxiao',
    age: 34
}

const changePerson: <K extends keyof IPerson>(name:K,value:IPerson[K]) => void = (key,value) => {
    person[key] = value
}

changePerson('age',18)
changePerson('name','yang')
```

> 我认为原文中说的 显示泛型 相对的是 “隐式泛型”，所谓 “隐式”即从推理得到的泛型而言(用 typeof 获得的类型)
> <K extends keyof IPerson\>  ===  < T = typeof Xxx, K in T\>



## (8)DeepReadonly——设置类型的深层属性为只读

原文中作者自定义了一个类型，名为 DeepReadonly，他写的代码为：

```
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
}

const a = { foo: { bar: 22 } }
const b = a as DeepReadonly<typeof a>
b.foo.bar = 33 // 嘿，出错了！
```

目前 TypeScript 官方自带的 Readonly ，经过测试，确实只能做到第1层的只读控制，无法做到深层的只读控制

```
interface IPerson {
    name: string,
    age: number,
    info: {
        work: string
    }
}

const me: IPerson = {
    name: 'puxiao',
    age: 34,
    info: {
        work: 'development'
    }
}

const you = me as Readonly<IPerson>
you.info = { work: 'coder' } //报错：无法分配到 "name" ，因为它是只读属性。
you.info.work = 'coder' //尝试修改第2层级的属性值，竟然没问题，不报错
```

把上面代码按照作者的方式，修改之后：

```
interface IPerson {
    name: string,
    age: number,
    info: {
        work: string
    }
}

const me: IPerson = {
    name: 'puxiao',
    age: 34,
    info: {
        work: 'development'
    }
}

type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>
}

const you = me as DeepReadonly<IPerson>
you.info = { work: 'coder' } //报错：无法分配到 "name" ，因为它是只读属性。
you.info.work = 'coder' //报错：无法分配到 "work" ，因为它是只读属性。
```

再次使用到了 泛型约束，只不过这次的形式非常特别，使用到了嵌套。

> 依照这个套路，还可以自定义出 DeepPartial(任何层级属性都变为可选)、DeepRequired(任何层级属性都变为必填)、DeepRecord(任何层级属性都变为指定类型)

在最新版 TypeScript 中，第一层属性变为只读，还有另外一种写法，使用 const 关键词：

```
const me = {
    name: 'puxiao',
    age: 34,
    info: {
        work: 'development'
    }
}

const you = <const>{ ...me }
you.info = { work: 'coder' } //报错：无法分配到 "name" ，因为它是只读属性。
you.info.work = 'coder' //尝试修改第2层级的属性值，竟然没问题，不报错
```



## (9)Omit——删类型某属性、高阶组件(工厂类)中应用技巧

在原文中，Omit 是作者自定义的泛型约束，代码如下：

```
type Omit<T, K> = Pick<T, Exclude<keyof T, K>>
```

在最新的 TypeScript 中，官方已经默认定义有 Omit，官方定义的形式为：

```
type Omit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P]; }
```

> 虽然 2 者定义的形式略微不同，但是最终效果是相同的

高阶组件 或 工厂类中 比较合适使用 Omit。假设我们有一个需求：创建一个 Person 工厂函数，Person 有 2个 属性 name 和 age，但是传递给工厂函数的参数中不需要 age 对应的值(age的值由工厂函数内部产生获得)。

```
interface IPerson {
    name: string,
    age: number
}

type PropsType = Omit<IPerson, 'age'> //使用 TypeScript 自带的 Omit 泛型来获得 工厂函数需要的参数类型

const createPerson: (props: PropsType) => IPerson = (props) => {
    return { ...props, 'age': Math.floor(Math.random() * 30) }
    // Person 需要的 age 属性值由工厂函数内部随机一个数字
}

createPerson({ name: 'coder' })
```



## (10)Record——约束对象属性名和值的类型

Record 是 TypeScript 内置的映射类型之一，将选定属性名(或者由枚举而产生的属性名)对应的值类型全部转化为指定类型，官方定义的代码为：

```
type Record<K extends string | number | symbol, T> = { [P in K]: T; }
```

Record 需要 2 个参数，第1个参数为约定属性名集合(由 enum 或 type 定义的枚举类型)，第2个参数为约定属性值的类型。例如下面这段代码：

```
enum MoodType {
    HAPPY = 'happy',
    ANGRE = 'angre'
}

interface IData {
    icon: string
}

const moodData: Record<MoodType, IData> = {
    happy: { icon: 'aa' },
    angre: { icon: 'bb' }
}
```



## (11)Partial——将一部分属性变为可选

原文中没有细讲使用的好处细节是什么，这里只是贴一下原文中给的示例代码：

```
const mergeOptions = (options: Opt, patch: Partial<Opt>) {
    return { ...options, ...patch };
}

class MyComponent extends React.PureComponent<Props> {
    defaultProps: Partial<Props> = {};
}
```

我认为 Partial 就是将某些属性设置为可选，并没有明白上面示例中，展示使用技巧的点在哪里。



## (12)tsx+extends——在tsx文件中区别泛型和组件标签

在 .tsx 文件中，泛型和tsx标签都采用 <\> 形式，为了让泛型不被误解成标签，可以在泛型中加入 extends 来解决。

```
const toArray = <T>(element: T) => [element]; // 会被报错
const toArray = <T extends {}>(element: T) => [element]; // 不报错
```

在上面第一行代码中，VSCode 认为 <T\> 是一个组件标签，会提示找不到对应的闭合标签 </T\> 。
而下面那行代码中，加入了 extends 后，VSCode 即可正确识别出 该标签是 TypeScript 的泛型，而不是 tsx 的组件标签。



## (13)ClassOf——参数传入类而非示例，并且可以new该类

先补充一个 JavaScript 知识，以下文字来源于 MDN 中对 JS中 类、 class 的描述：

> ECMAScript6 引入了一套新的关键字用来实现 class。使用基于类语言的开发人员会对这些结构感到熟悉，但它们是不同的。JavaScript 仍然基于原型。这些新的关键字包括 class, constructor，static，extends 和 super。

> 对于使用过基于类的语言 (如 Java 或 C++) 的开发人员来说，JavaScript 有点令人困惑，因为它是动态的，并且本身不提供一个 `class` 实现。**（在 ES2015/ES6 中引入了 `class` 关键字，但那只是语法糖，JavaScript 仍然是基于原型的**）。

> 几乎所有 JavaScript 中的对象都是位于原型链顶端的 Object 的实例。

**划重点：JavaScript 中并不存在真正 面对对象 中的 类，JavaScript 是动态语言，走的是原型链。所以，当你看到下面这行代码：**

```
class Person { constructor() { } }
```

你不要觉得你定义了一个名为 Person 的类，你只是借用 class 语法糖(对于原型链方便的操作)) 创建了一个Function实例。
同理，所谓实例化 Person，代码是 new Person() 又怎么理解呢？
**再次划重点：new 这个关键词也是 JavaScript 中的一个语法糖，所谓 new Person()  真正执行的是 new.target** ，其中 target 是 JavaScript 提供给我们方便在原型链上找到构造函数(constructor)的一种内部方式。

但是日常中，我们为了方便描述，依然会选择使用 类 或 实例化类 这样的词语。



在使用 高阶组件 或 工厂类 中，我们有时需要传入类本身，而非类的实例。在原文中，作者举了这样一个例子：

```
import React from 'react'
abstract class Animal extends React.PureComponent {
    /* Common methods here. */
}
class Cat extends Animal { }
class Dog extends Animal { }

const renderAnimal = (AnimalComponent: Animal) => {
    /* 报错：“AnimalComponent”表示值，但在此处用作类型。是否指“类型 AnimalComponent”? */
    return <AnimalComponent/>; 
}

renderAnimal(Cat); // 报错：类型“typeof Cat”的参数不能赋给类型“Animal”的参数。
renderAnimal(Dog); // 报错：类型“typeof Dog”的参数不能赋给类型“Animal”的参数。
```

通过自定义 ClassOf 泛型约束，可解决上述问题：

```
interface ClassOf<T> {
  new (...args: any[]): T;
}
const renderAnimal = (AnimalComponent: ClassOf<Animal>) => {
  return <AnimalComponent/>; //不再报错
}
```

以上是原文中举例代码，示例代码中所谓的 类 其实是 高阶组件(纯组件)，而我平时更多使用 React 的函数组件，不怎么使用 类组件，我接触更多的是 函数 和 由 class 定义的类，所以我重新举了另外一个例子：

```
class Person { constructor() { } }
class Boy extends Person { }
class Gril extends Person { }

const renderPerson1 = (ClassName: Person) => {
    return new ClassName() //报错：此表达式不可构造。类型 "Person" 没有构造签名。
    
    /* 例如：let num:number，那么是无法 new num() 的。
     * 参数 ClassName 只不过是 Person 的一个实例，所以无法 new ClassName()
     * 并不是说 Person 是个实例
     */
}

const renderPerson2 = (ClassName: typeof Person) => {
    return new ClassName()
}


interface ClassOf<T> {
    new (...args: any[]): T;
}

const renderPerson3 = (ClassName: ClassOf<Person>) => {
    return new ClassName()
}

let boy = renderPerson1(Boy) //不报错
let gril = renderPerson2(Gril) //不报错
let person =renderPerson3(Person) //不报错
```

很明显，通过上述代码可以知道，如果是 class 定义的类，最简单的办法就是在 传入该类的时候，采用：ClassName: typeof Person 即可。当然使用 ClassOf 也是可以的。

但是，我思考的是如果是工厂类，那为什么不改成这种写法，更加简单直白：

```
const renderPerson1 = (ClassName = Person) => {
    return new ClassName() //不报错
}
```



## (14)类型查找+类方法——简化子组件中定义函数的方式

原文中举的例子是 类组件与之组件 函数 传递下去，为了通过以下方式，在子组件中定义：

```
class Parent extends React.PureComponent {
    private updateHeader = (title: string, subTitle: string) => {
        // Do it.
    };
    render() {
        return <Child updateHeader={ this.updateHeader } />;
    }
}

//默认子组件中应该这样定义
interface ChildProps {
    updateHeader: (title: string, subTitle: string) => void;
}

//使用类型查找，修改成这种方式后，可以省掉很多重复的代码(参数、返回值等)
interface ChildProps {
    updateHeader: Parent['updateHeader'];
}

class Child extends React.PureComponent<ChildProps> {
    private onClick = () => {
        this.props.updateHeader('Hello', 'Typescript');
    };
    render() {
        return <button onClick={ this.onClick }> Go < /button>;
    }
}
```

由于我不用类组件，我用函数组件，我暂时不太能理解这样做的好处。



## (15)补充关于 映射类型 相关知识

### 修改——映射类型：Pick 、Partial、Required、Readonly、Record、Omit

Pick：取一部分

Partial：全部变为可选属性 ?:

Required：全部变为必填属性

Readonly：全部变为只读属性

Record：将选定属性名(或者由枚举而产生的属性名)对应的值类型全部转化为指定类型

Omit：删除指定属性



### 条件——映射类型：Exclude、Extract、NonNullable

Exclude：排除相同的，剩下所有不相同的

Extract：前后两者中共同拥有的

NonNullable：排除所有 null 或 undefined，值保留可用的



### 其他获取——映射类型：ReturnType、Parameters、ConstructorParameters、InstanceType

ReturnType：定义函数返回值类型

Parameters：获取所有参数类型

ConstructorParameters：获取构造函数所有参数类型

InstanceType：获取类返回对象的类型




## (16)Tuple——约束元祖数组初始化时的长度

默认元祖数组只能约束元素类型，但是无法约束数组长度，可通过以下定义来实现初次赋值时进行长度限定。

```
type Tuple<T, N extends number> = [T, ...T[]] & { length: N }

type MyArr = Tuple<number, 7>

const arr:MyArr = [0,1,2,3,4,5,6]
```

特别提醒：上述中的 Tuple 仅仅只是约束第一次初始化赋值时数组的长度，但是 实例 arr 依然可以执行后续的 push、pop 等操作，来改变数组的长度。


