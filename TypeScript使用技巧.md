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

Pick<T,U\>：取一部分

Partial<T\>：全部变为可选属性 ?:

Required<Type\>：全部变为必填属性

Readonly<T\>：全部变为只读属性

Record<Keys,Type\>：将选定属性名(或者由枚举而产生的属性名)对应的值类型全部转化为指定类型

Omit<Type, Keys\>：删除指定属性



### 条件分发——映射类型：Exclude、Extract、NonNullable

Exclude<T,U\>：排除相同的，剩下所有不相同的

Extract<T,K\>：前后两者中共同拥有的

NonNullable<T\>：排除所有 null 或 undefined，值保留可用的



### 其他获取——映射类型：ReturnType、Parameters、ConstructorParameters、InstanceType、ThisParameterType、OmitThisParameter、ThisType

ReturnType<T\>：定义函数返回值类型

Parameters<Type\>：获取所有参数类型

ConstructorParameters<Type\>：获取构造函数所有参数类型

InstanceType<T\>：获取类返回对象的类型

ThisParameterType<Type\>

OmitThisParameter<Type\>：

ThisType<Type\>：



## (16)Tuple——约束元祖数组初始化时的长度

默认元祖数组只能约束元素类型，但是无法约束数组长度，可通过以下定义来实现初次赋值时进行长度限定。

```
type Tuple<T, N extends number> = [T, ...T[]] & { length: N }

type MyArr = Tuple<number, 7>

const arr:MyArr = [0,1,2,3,4,5,6]
```

特别提醒：上述中的 Tuple 仅仅只是约束第一次初始化赋值时数组的长度，但是 实例 arr 依然可以执行后续的 push、pop 等操作，来改变数组的长度。



## (17)EnumType——根据枚举属性名，获得指定类型的属性值

先通过枚举定义若干常量，然后根据枚举对象的属性名(键名)，重新得到一个指定属性值类型的约束对象。

这里面使用了：K in keyof typeof E 这种组合

```
//错误状态码
enum LoginFailCode {
    unknowCode = 10,
    authorizationCode = 11,
    loginDbCode = 12
}

//以下要定义错误状态码对应的错误提示信息

//第1种定义方法
type EnumType<T> = { [key in keyof typeof LoginFailCode]: T };
const LoginFailMsg1: EnumType<string> = {
    unknowCode: '用户登录时，发生未知错误',
    authorizationCode: '用户登录时，获取openid发生错误',
    loginDbCode: '用户登录时，数据库操作发生错误'
}

//第2种定义方法
const LoginFailMsg2: Record<keyof typeof LoginFailCode, string> = {
    unknowCode: '用户登录时，发生未知错误',
    authorizationCode: '用户登录时，获取openid发生错误',
    loginDbCode: '用户登录时，数据库操作发生错误'
}
```



<br>

**key in 的另外一种用法：根据 type 定义 Object 对象属性名**

假定我们现在 TypeScript 中有下面的定义：

```
type MsgType = 'add' | 'edit' | 'del'
```

如果我们想定义一个 msgColor 对象，该对象属性名为 MsgType 中的值，如果写成下面的代码：

```
const msgColor: { [ key: MsgType ]: string } = { ... }
```

会收到这样的错误信息：

```
An index signature parameter type cannot be a literal type or generic type. Consider using a mapped object type instead.
```



<br>
正确的写法是

```
type MsgType = 'add' | 'edit' | 'del'
type MsgColor = {
    [ key in MsgType ]: string
}

const msgColor: MsgColor = { ... } 
```

<br>
或者是：

```diff
- const msgColor: { [ key: MsgType ]: string } = { ... }
+ const msgColor: { [ key in MsgType ]: string } = { ... }
```


<br>

## (18)const Xxx={} as const——将对象所有键值组成联合类型

在上面小节中，可以通过 keyof typeof 获取 枚举对象的所有键名，并将键名组成联合类型，但是目前来说是没有办法将枚举对象键值组成联合类型。

目前来说，可以通过不使用 enum，改成 const 来实现。

```
const MyCount = {
    A: 1,
    B: 5,
    C: 8
} as const

//获取 MyCount 所有键名 组成的联合类型，即："A" | "B" | "C"
type Keys = keyof typeof MyCount

//获取 MyCount 所有键值 组成的联合类型，即：1 | 5 | 8
type Values = typeof MyCount[keyof typeof MyCount]
```



## (19)const enum——仅编译过程中存在，编译后会消失的枚举对象

通常情况下定义枚举对象的方式为：enum Xxx {}，Xxx 编译后是一个对象。如果在定义时添加 const，即：const enum Xxx{}，那么这样定义的枚举对象只有在编写代码，编译过程中存在，编译后则会消失。

```
enum EnumA { A = 1, B = 5, C = 8 }

const enum EnumB { A = 1, B = 5, C = 8}

const aa = EnumA.A
const bb = EnumB.A

// EnumA 和 EnumB 的区别是什么 ？
// EnumA 被编译后是一个对象，而 EnumbB 编译后则会消失

// aa 和 bb 被编译后的区别是什么 ？
// aa = EnumA.A、bb = 1

/**
  EnumA 被编译后是一个对象，长这个样子：
  var EnumA;
  (function (EnumA) {
      EnumA[EnumA["A"] = 1] = "A";
      EnumA[EnumA["B"] = 5] = "B";
      EnumA[EnumA["C"] = 8] = "C";
  })(EnumA || (EnumA = {}));

  而经过 TS 编译后的代码中，根本不存在 EnumB
*/
```



## (20)<const\>——让const声明的对象属性也变为只读

使用 const 定义的变量，虽然对象本身类型不能再发生变化，但是该对象的属性却可以被修改。

通过以下 2 种方式，均可以让 对象 属性也变为只读(哪怕属性本身也是一个复杂类型的对象)

```
const person = { name:'puxiao', age:'34'}
person.age = 18 //可以被修改

const person = <const>{ name:'puxiao', age:'34'}
或
const person = { name:'puxiao', age:'34'} as const

person.age = 18 //无法分配到 "age" ，因为它是只读属性。

```



## (21)obj[key]——严格模式下，如何避免报错

在最新的 TS 4 版本中，tsconfig.json 中 strict 默认值为 true，即 默认开启严格模式。

在严格模式下 无论 noImplicitAny 的值是 true 还是 false，如果代码中 TS 自动推断出有值为 any，就会报错：

```
元素隐式具有 "any" 类型，因为类型为 "string" 的表达式不能用于索引类型 "{}"。
```

**在之前默认非严格模式下，以下代码是没有问题的：**

```
const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key] === undefined) {
            delete obj[key]
        }
    }
    return obj
}
```

**但是如果是 TS 4 的严格模式下，只有修改成以下代码后才可以：**

```
const removeUndefined = (obj: object) => {
    for (let key in obj) {
        if (obj[key as keyof typeof obj] === undefined) {
            delete obj[key as keyof typeof obj]
        }
    }
    return obj
}
```



## (22)获取数组中所有元素的值的类型

```
const arr = ['a','b','c'] as const
type value = typeof arr[num] // 'a'|'b'|'c'
```



## (23)使用下划线_来充当参数占位符

假设 TypeScript 开启的是严格模式，若有已定义但从未读取使用的变量就会收到 TS 报错。

例如下面这段代码：

```
arr.forEach((value,index) => {
    ...
    index
    ...
})
```

在上面这段代码中，我们利用了数组的 forEach() 来循环遍历，但是我们真正执行的代码中只用到了 index，并没有用到 value，那么 TS 就会报错：

```
错误：已定义 value，但从未读取该值
```

这种情况下，我们可以改用 for 循环，例如：

```
for(let i=0; i<arr.lenght; i++) {
   ...
   index
   ...
}
```

这样做肯定没有问题，但是假设我就是想用 forEach() 函数，就是不用 value，又希望 TS 不报错该怎么办呢？



**解决办法：可以使用 下划线 _ 这个特殊符号来作为变量名，可起到占位作用。**

将原本的 forEach() 代码修改如下：

```
arr.forEach((_,index) => {
    ...
    index
    ...
})
```

此时 下划线 就起到了一个 “占位符” 的作用，TS 不会针对 下划线 _ 进行 “已定义从未读取” 的检测，不再报错。



**补充说明：**

1. 使用下划线来作为变量名，这其实是  JS 所支持的
2. TypeScript 只是不针对 下划线 变量 进行 已定义但从未读取的检测



**延伸补充：**

下划线 _ 可以作为 JS 支持的变量名，我们常见的定义箭头函数 () => { ... } 可以简化为 _=>{ ... }

这里面 _ 充当一个无用的参数。

当然这种写法并不特别提倡，毕竟代码阅读性不是特别好。

> 如果别人不知道 下划线 _ 可以来充当变量名，起到占位作用，是会看懵的。



## (24)可辨识类型

在日常 TS 使用中，我们会使用这种形式

```
type xxx = string | number | any[]
```

这种形式叫 “联合类型”，和这个形式类似的还有另外一种高级用法——可辨识联合类型



**可辨识类型的使用示例：**

```
interface Aaa {
    type: 'a',
    name: string
}

interface Bbb {
    type: 'b',
    age: number
}

interface Ccc {
    type: 'c',
    list:string[]
}

type ABC = Aaa | Bbb | Ccc
```

我们先定义彼此不相干的 3 个类，最后通过 Aaa | Bbb | Ccc 这种类似联合的形式组成了 ABC。

那么 TypeScript 会去检查 3 个类的共同特点，然后推理出 ABC 应该拥有的特点。

1. TS 发现这 3 个类的共同特征是都拥有 type 属性，且 type 属性的类型都不相同。
2. 当我们在其他地方使用 ABC 类型时，就可以通过 ABC.type 来判断出究竟是哪个类的实例，并且给出该类型特有的其他属性语法提示和检查。



**换一种说法：**

在传统的面向对象编程语言中，我们必须先定义好父类，才能再定义子类。但是在 TS 中，我们可以先定义若干个 “子类”，然后将这些 “子类” 联合起来，让 TS 推理出 他们的 “父类” 应该是什么样子。

> 切记，这些单独定义的 “子类” 应该至少有 1 项有相同的属性名且属性类型不同，这样的 ABC 才可以备 TS 可辨识推理出来。

> 请注意是相同的属性名、不同的属性类型
>
> 如果是相同的属性名、不同的属性值，TS 是无法推理的。



**应用场景：定义多个具有相似结构的子类，然后通过 Xxx.type 进行 TS 实例推理，得到对应具体子类的属性语法提示和检查。**



**关于 类 class 在 TS 中的知识点补充：**

假设我们定义一个 Person 的类

```
export class Person {
    name: string
    constructor() {
        this.name = 'ypx'
    }
}
```

上面代码中 Person 包含 2 层意思：

1. 一个名为 Person 的类

2. 一个名为 Person 的类型，相当于

   ```
   interface Person {
       name: string
   }
   ```

   或者是

   ```
   type Person = {
       name: string
   }
   ```

因此我们即可以把 Person 当类使用，也可以把 Person 当接口(interface) 或 类型别名(type) 来使用。



还有 2 个点需要了解一下：接口合并、接口实现

**接口合并：**

```
export interface IPerson {
    name: string
}

export interface IPerson {
    age: number
}
```

**接口实现：**

```
export interface IPerson {
    name: string
}

export interface IPerson {
    age: number
}

//类型“Person”缺少类型“IPerson”中的以下属性: name, age
export class Person implements IPerson {
    constructor() {
    }
}
```

上面代码中，Person 需要实现 IPerson 所规定的 2 个属性，由于没有还未实现所以 TS 会报错。



**接口实现的错误演示示例：**

```
interface Person {
    name: string
}

interface Person {
    age: number
}

//下面为错误的 接口实现 方式

class Person {
    constructor() {
    }
}

//或
class Person implements Person {
    constructor() {
    }
}
```

请注意，上面代码在 TS 中并不会报错，恰恰是因为没有报错才证明我们接口没有实现。

这是因为我们定义的 class 名字 Person 和 接口名字 Person 相同，那么 TS 其实把 class Person { ... } 重新定义出一个 Person 的类型。

也就是说错误示例中其实发生的并不是接口实现，而是 3 个 Person 接口合并。



## (25)给.js文件添加TS声明

假设我们自己编写了一个 xxx.js 文件，或者我们引用了别人写好的 xxx.js 文件，为了获得 TS 语法提示和自动检测，我们需要给 xxx.js 添加对应的 TS 声明。

添加声明分为 2 种：

1. 向全局添加声明
2. 向具体模块添加声明



**向全局添加声明：**

所谓 “全局” 是指我们在任意一个 .ts 或 .tsx 文件中都可以直接使用 而无需 “引入”。

1. 在项目根目录，打开或新建 global.d.ts 文件
2. 在该文件中，使用 `declare` 作为关键词，开始声明对应的 TS 内容



**全局声明的几种类型：**

1. declare var ：声明全局变量

2. declare function ：声明全局方法

3. declare class ：声明全局类

4. declare enum ：声明全局可枚举类型

5. declare namespace ：声明含有子属性的全局对象

   > 所谓 “含有子属性” 是指可以内嵌多种类型(类、类型、变量、方法)的对象类型

6. declare interface、declare type ：声明全局类型

7. declare global ：声明全局变量

8. declare module ：声明全局扩展模块

   > declare module 实际上是全局声明 “类” 的另外一种形式(也可以说是一种简写形式)



**向具体模块添加声明：**

所谓 “具体模块” 是指我们在任意一个 .ts 或 .tsx 文件中若想使用则必须先 “引入”。

1. 在 xxx.js 同目录下，创建相同名字的 xxx.d.ts 文件
2. 在该 xxx.d.ts 文件中，就像普通定义 TS 类型那样，将 xxx.js 中的内容重新定义一次即可

提醒：xxx.d.ts 中定义的类型应该与 xxx.js 中保持一致，不要尝试将 xxx.d.ts 中的某类型修改成其他含义，那样 TS 并不会被 “欺骗” 到。



**导出的 2 种类型：**

1. export + 导出对象

2. export default + 导出对象

   > 请注意以下 2 点：
   >
   > 1. 假设 xxx.js 中使用的是 export default，那么 xxx.d.ts 中也必须是 export default
   > 2. 如果使用 export default，一定要确保 tsconfig.json 中 "esModuleInterop": true

> 1. export 这种导出形式用法和普通 TS 文件中导出的形式是一模一样
> 2. 但是 export  主要针对的是 “向模块添加声明”
> 3. 对于 “向全局添加声明” 是不需要使用 export 的，当使用 declare 之后就相当于已导出了。



<br>

**global.d.ts的补充：**

通常情况下，我们在项目中会引入很多非 js 或 ts 的静态资源文件，例如 图片 或 CSS 文件。

为了避免 TS 提示找不到对应的 TS 定义，我们会在  global.d.ts 文件中添加以下内容：

```
declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';
declare module '*.asc';
```

由于使用的是 declare 关键词，那么意味着这是向全局中添加的声明，这样我们就可以在任意的 .ts 或 .tsx 文件中引入这些静态资源文件。



<br>

补充说明：

我们以 `declare module '*.jpg'` 这样代码为例，来讲解一下这行究竟定义了什么内容。

1. `declare` 意思是此处为 “全局定义 ”

2. `module` 意思是模块，我们可以把它看做是 “类(class)” 的简写形式

3. '*.jpg' 意思是代表所有以 xxxx.jpg 形式命名的文件

   > 因为 * 可以匹配到任意字符

`declare module '*.jpg'` 这样代码实际上是以下代码的简写形式：

```
declare '*.jpg' {
    const content = string;
    export default content;
}
```



假设我们在项目中引入一张图片，我们希望知道该图片将来经过 webpack 编译之后的路径，我们可以使用以下形式：

```
const url = require('./imgs/xxx.jpg').default
// url 就是该图片经过编译之后的路径
```

> 上面示例中使用的是相对路径，但实际项目中由于该 ts 或 tsx 文件也会被编译，究竟最终路径是什么很容易混乱，所以推荐在项目中配置 alias (路径映射) 来方便指向最终资源路径。假设配置好 alias 后，可能上述代码资源路径可修改为：
>
> ```
> const url = require('@/assets/imgs/xxx.jpg').default
> ```

> 具体如何配置 alias (路径映射) ，可参考：[配置alias路径映射](https://github.com/puxiao/notes/blob/master/Create-React-App%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md#%E9%85%8D%E7%BD%AEalias%E8%B7%AF%E5%BE%84%E6%98%A0%E5%B0%84)



<br>

上面讲解的，其实是某些极少数 .js 或 其他静态资源需要我们手工定义 .d.ts。



**让 TypeScript 识别 JSDoc注释，来充当类型定义。**

假设项目中使用到了符合 JSDoc 规范的注释，那么你无需额外定义 .d.ts 文件，TS 会自动根据 JSDoc 规范来推断出对应的类型。

具体 jsdco 如何使用，请参考：[JSDoc的安装与使用.md](https://github.com/puxiao/notes/blob/master/JSDoc%E7%9A%84%E5%AE%89%E8%A3%85%E4%B8%8E%E4%BD%BF%E7%94%A8.md)



<br>

## (26)import type/export type 仅导入/导出类型声明

首先在此重申一件事情：我们所有编写的 ts 相关代码，最终都会经过 TypeScript + Babel 转译成 .js。

那么我们在 .ts 或 .tsx 中定义的对象类型最终是会消失在 .js 中的。



有了这个前提概念，那么我们来看下面的代码，假设我们有 4 个文件 test-a.ts、test-b.ts、test-c.ts、test-d.ts



test-a.ts：

```
export interface Person {
    name: string,
    age: number
}
```

> test-a.ts 仅导出 Person 的类型



<br>

test-b.ts：

```
export class Person {

    name: string
    age: number

    constructor() {
        this.name = 'ypx'
        this.age = 34
    }
}
```

> test-b.ts 仅导出 Person 的实际值(是一个类)
>
> 请注意：尽管 Person 是一个实际值(是一个类)，但是 TypeScript 依然可以通过类型推导，自动得出 Person 的类型



<br>

test-c.ts：

```
interface Person {
    name: string,
    age: number
}
class Person {
    constructor() {
        this.name = 'ypx'
        this.age = 34
    }
}

export { Person }
```

>test-c.ts 即导出 Person 的类型，又导出 Person 实际定义的值(是一个类)



<br>

以上 3 个代码文件中，分别导出了 Person，但究竟 Person 是什么实际上并不一样的。

1. test-a.ts：仅 Person 类型
2. test-b.ts：仅 Person 实际值
3. test-c.ts：即有 Person 类型，也有 Person 实际值



<br>

我们在 test-d.ts 中，有可能会出现以下的代码：

```
//test-x 有可能为 test-a 或 test-b 或 test-c
import { Person } from './test-x'
```



<br>

**思考一下上面的代码**

第一：肉眼观察上面的 test-d.ts 中引入的 Person，实际上我们是无法直观感受到 Person 究竟是 类型还是实际值的，除非你非常清楚 test-x 到底导出的是什么。

第二：假设我们引入的是 test-b.ts 或 test-c.ts，那么在 test-c.ts 中 import 的 Person 即包含实际值，也包含或自动推理出的 Person 类型。 

平时我们也都是这样使用的，没有什么问题，但是试想一下这个代码场景：

```
import { Person } from './test-c'

export const myFun = (person: Person) => {
    console.log(person.name)
}
```

在上面代码中，我们始终从未实例化(new)过 Person，也未曾通过继承(extends) 编写出 Person 的子类。

我们仅仅是需要使用 Person 的类型而已，但上面代码经过 TypeScript + Babel 转义过后，test-d.js 中虽然去除了 Person 的 TS 类型，但依然会保留 Person 的实际值的引入，很显然这个是我们不需要的。

> 编译之后的 test-d.js 中可能依然会保留 import { Person } from './test-x'



<br>

相反，假设某些时候，我们只希望 test-c.ts 中只导出 Person 的类型，不导出 Person 的实际值，那又该如何实现呢？



<br>

**怎么办？**

答：在 TypeScript 3.8 版本中，新增加了 import type 和 export type 用法，可以解决我们上面的问题。

具体用法就是我们在传统的 导出或引入 时，在 import 或 export 后面加上 type，例如上面的代码修改为：

```
import type { Person } from './test'

export const myFun = (person: Person) => {
    console.log(person.name)
}
```

由于我们明确告知 TypeScript，我们仅仅是引入类型(import type)，所以 TypeScript + Babel 在最终编译后，text-d.js 中不会再出现 Person 的实际值，也就是不会出现 `import { Person } from './test'`



<br>

同理，假设我们在 test-c.ts 中将代码修改为：

```
interface Person {
    name: string,
    age: number
}
class Person {
    constructor() {
        this.name = 'ypx'
        this.age = 34
    }
}

export type { Person }
```

> 我们之前 test-c.ts 中导出代码为 `export { Person }`

由于我们的导出代码是 `export type { Person }`，所以相当于明确告诉 TypeScript 仅导出类型，而不导出实际值。

> 请注意这样修改之后，经过 TypeScript + Babel 编译之后的 test-c.js 中也不会有导出 { Person } 的任何值的代码。



<br>

假设即使没有修改 test-c.ts 的导出方式，当我们在 test-d.ts 中使用 `import type ...` 时，依然是仅导入 Person 的类型。



**请注意，使用 import type 导入的类不可以当做值使用。**



也就是 ：

1. 无法实例化
2. 无法继承

假设 test-c.ts 导出使用了 `export type ...`，那么以下代码是会报错误的：

```
import type { Person } from './test'

export const myFun = (person: Person) => {
    new Person() //报错："Person" 是使用 "import type" 导入的，因此不能用作值。
    console.log(person.name)
}
```



<br>

通常情况下我们仅需要使用函数的参数对应的某个类型时，import type 或 export type 会非常有用。

> 当然你要就是不添加 type，代码也不会有任何问题，只是会有一些多余无用的 类实际值 会被引入，保留在编译后的代码中。



<br>

## (27)public/private/protected 类的属性或方法的修饰词

在传统面向对象编程语言中，类的属性或方法前面都可以添加 修饰词语，例如：

1. public：公开的，任何人都可以访问
2. private：私密的，仅类本身内部可访问
3. protected：受保护的，仅类、子类可访问

目前，TypeScript 也完全支持这 3 种修饰词。



**public**

在 TypeScript 中如果属性或方法不添加修饰词，那么默认即为 public。

```
class MyClass{
    name:string
    doSomting(){ ... }
}

//完全等价于

class MyClass{
    public name:string
    public doSomting(){ ... }
}
```

> 对于原生 JS 而言，类的所有属性或方法默认都是 public。
>
> 我个人推荐在 TS 中添加上 public，因为这样容易一样就能知道该属性或方法为 public，并且这样做容易和其他修饰符进行对等呼应。



<br>

**private**

使用该修饰词后，该属性或方法仅可类本身内部使用，外部或子类都不可以调用(访问)。

```
class MyClass{
    private name:string
    private doSomting(){ ... }
}
```

> 对于原生 JS 而言，在新的 ES 标准中，类内部私有属性或方法采用的是添加  `#` 作为前缀。
>
> ```
> class MyClass{
> #name = 'aaa'
> #doSomting(){ ... }
> }
> ```



<br>

**protected**

当给类的某个属性或方法添加 `protected` 之后，那么该属性或类只允许本类、子类访问和调用。

```
class MyClass {
  protected _type: string = 'aaa'
  protected doSomting(){ ... }
}
```

> 对于原生 JS 而言，目前还不存在 protected 这个概念



<br>

## (28)protected 让父类不可以被实例化

假设使用 TS 定义了一个父类 ParentClass，那么可以通过给父类的构造函数前面添加 `protected` 关键词，让父类不可以被实例化，但是子类构造函数中调用 super() 是被允许的。



<br>

```
class ParentClass{
    protected constructor(){
        ...
    }
}
```



<br>

如果尝试实例化 ParentClass，`new ParentClass()` 则会收到以下报错：

```
类“ParentClass”的构造函数是受保护的，仅可在类声明中访问。
```



<br>

## (29)override 显式重写父类的方法

**注意：override 这个关键词是 TypeScript 4.3 版本中才新增的关键词。**

**但是目前并不是所有的编译工具都可以正确编译该关键词，例如目前的 react 17.0.2 还不支持编译该关键词。**



<br>

**之前子类重写父类方法的示例：**

以前子类重写父类的某个方法，都是采用匿名的方式。例如：

```
class ParentClass {
    doSomting(){
        ...
    }
}

class ChildClass extends ParentClass {
    doSomthing(){
        ...
    }
}
```

也就是说，子类所谓重写父类的某个方法，其实就是 使用相同的名字即可。



<br>

但是这样存在一个问题，假设有一天父类中删除了 doSomthing() 这个方法，而子类并不知道。

那么子类中的 doSomthing() 此刻就由 “覆盖” 变成了 “新增”。



<br>

最新版的 TS 4.3 中，在 tsconfig.json 文件内我们可以新添加一个配置关键词 `noImplicitOverride`：

```
{
    "compilerOptions": {
        "noImplicitOverride": true
    }
}
```

当 noImplicitOverride 的值为 true 是，即不允许子类匿名重写父类的方法。

子类在重写父类方法时，必须明确使用 “override” 关键词才可以。



<br>

**最新重写方式：**

```
class ParentClass {
    doSomting(){
        ...
    }
}

class ChildClass extends ParentClass {
    override doSomthing(){
        ...
    }
}
```



<br>

## (30)模板字符串中使用类型

在日常开发中，我们可能会对某个变量类型定义成 string，例如：

```
let url:string = 'xxxx'
```



我们也可以使用 模板字符串 拼接变量和字符串。

```
const num = 2
console.log(`num${num}`)
```



目前 TypeScript 中可以对字符串进行更加详细的结构定义。

<br>



**基础用法**

例如：

```
type MyURL = `https://${string}` //我们定义了一个字符串类型，该字符串必须以 'https://' 为开头

const url1: MyURL = 'puxiao.com' //不能将类型“"puxiao.com"”分配给类型“`https://${string}`”。

const url2: MyURL = 'https://puxiao.com' //这个是符合 MyURL 规范的
```



<br>

**约束字符串数字格式**

例如：

```
type StrNum = `${number}-${number}-${number}`

const str0:StrNum = '22-2' // 这个格式是错误的
const str1:StrNum = '22-2-22' //这个格式正确
```



**变量类型还可以采用组合形式**

例如：

```
type ColorType = 'red' | 'green'
type NumType = 'one' | 'two'

type StrType = `${ColorType | NumType} flower`
```



<br>

## (31)自定义泛型Override用于继承/覆盖/合并两个对象

假设想继承某类型的同时，有可以对原有类型进行修改或新增，那么可以通过下面这个自定义泛型来快速实现。

```
type Overrride<T1, T2> = Omit<T1, keyof T2> & T2
```



<br>

使用示例：

```
type Overrride<T1, T2> = Omit<T1, keyof T2> & T2

interface BaseUserData {
    labelData: {
        code: number
        label: string
    }
}

interface IMark {
    type: 'box' | 'rect'
    userData: BaseUserData
}

interface BoxMark extends IMark {
    type: 'box'
    userData: Overrride<BaseUserData, {
        matrix: number[]
    }>
}

interface RectMark extends IMark {
    type: 'rect'
    userData: Overrride<BaseUserData, {
        faceto: string
    }>
}

type Mark = BoxMark | RectMark
```
