# TypeScript学习笔记

## TS安装、编译、调试

##### 安装和编译
安装：npm i -g typescript  
编译ts文件为js文件：tsc xx.ts  

在win10系统中，运行 tsc 进行编译时可能提示由于系统安全禁用任何脚本，该问题解决方法为：  
1、管理员权限运行 C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe  
2、输入并执行：Set-ExecutionPolicy RemoteSigned  
3、输入并执行：y  

##### 调试
为了方便node调试，可安装插件：npm i -g ts-node   
调试ts文件：ts-node xx.ts  (并不会真正创建xx.js)  

##### 创建配置文件  
创建配置文件：tsc --init，会在项目中创建 tsconfig.json，可修改其中配置选项。注意：这一步是可选的，如果不创建则使用TS默认的配置。  

#### tsconfig.json配置参数
1、如果想编译项目下所有.ts文件， 则执行 tsc，此时会按照tsconfig.json配置参数进行编译。  
2、可添加配置属性："exclude":["node_modules","**/*.spec.ts"]，则表示不编译数组内规则对应的.ts文件  
3、可添加配置属性："include":["./src/**"]，则表示只编译该数组内规则对应的.ts文件  
4、可添加配置属性："files":"[./xx.ts,./xxx.ts]" 则表示只编译该数组内对应的.ts文件  
5、"compilerOptions"可添加配置属性："outDir":"./bin" 则表示将编译文件存放在./bin目录中  


## TS的好处  
1、减少Bug：在开发过程中，尽早发现潜在类型问题。  
2、代码提示：编写代码时可以有更友好的代码提示，例如某变量被声明为某类型，那么该变量即拥有该类型的全部可用属性和方法，因此在编写该变量代码时会出现属性和方法的提示。  
3、提高代码可读性：因为对象类型清晰可见，语义化对象类型，因此可提高代码可读性。  



## TS基础知识

#### 类型注解：我们主动告诉TS变量是什么类型
基础(简单)类型：string、number、boolean、symbol、null、undefined、void  
对象(复杂)类型：array、object、function  

#### 类型推断：TS根据变量的值推断出变量的类型
1、变量声明和赋值必须在同一行，例如 let num = 2 此时可推断出num为number  
2、若变量声明和赋值不在同一行，例如 let num; num=2; 此时推断num为any  

#### 类型断言：我们告诉TS“你就姑且认为变量”是什么类型
告诉TS，该值我(开发者)已经检查过了，你就权当它是某种类型，你不需要再做检查了。  
实现的2种方式：  
1、尖括号<Xxxx>，例如<string>mystr，就表示告诉TS，你就把mystr看作是string类型的就好了，无需做检查。  
2、使用 as 关键词，例如 mystr as string，作用和<string>mystr相同，但是在react的jsx语法中，仅支持 as 这种语法。  
3、如果想使用变量的属性或方法，可再用括号包裹住变量，例如 (<string>mystr).length 或 (mystr as string).length，获取mystr的字符长度。  

#### 特殊符号或关键词：
1、|  表示 或，例如 string | number ，即 string或number
2、?: 表示 可选属性，例如 interface Person{age ?: number}，age属性为可选(可以有或者没有)  

在TS实际使用中，类型注解和类型推断相互结合使用，请注意：如果你希望代码特别精准精确，可以全部使用类型注释，不用类型推断。  


# TS面对对象编程

## 对象

#### 常见对象类型定义：
1、data:object 或 data:{}，表示data定义为object 类型  
3、data:{x:number,y:number}，表示data为object类型，必须只能有2个类型为number的属性x和y  
4、type Data = {x:number,y:number}; let data:Data，通过使用type关键词，定义类型别名，表示data的数据类型  
5、let num:string | number，通过 | 符号，表示num既可以是string，也可以是number  
6、interface Data = {x:number,y:number}; let data:Data，通过使用interface关键词，定义类型接口，表示data的数据类型，  
注意：  

- 若某个变量包含interface已有定义的属性和未定义的属性存，例如 let person = {x:2,y:3,z:5} person虽然多出了一个属性z，但是他依然符合 interface Data = {x:number,y:number} 的规范，TS不会报错误警告的。  
- 但是如果不是以变量形式，而是直接以值的形式是不被允许的，例如 {x:2,y:3,z:5} 是不符合上述类型定义的。  
- TS不会在意属性定义的顺序，例如 {x:2,y:3} 和 {y:3,x:2} 在TS看来是没有区别的。  

7、interface SayHi(){(word:string):string} ，表示一个函数SayHi，参数为word，类型为string，该函数返回值为string  


#### 解构赋值类型定义：
1、如果是对象解构，myFun({name,age}:{name:string,age:number})，表示函数参数类型格式为{name:string,age:number}，注意：切记不要直接给解构参数声明类型，一定要将解构赋值的对象作为整体来进行类型定义  
2、如果是数组解构，也需要将数组整体类型定义，例如 [first,second]:[number,number]  

#### 数组类型定义：
1、let arr:number[] ，表示arr为数字且数组内所有元素均为number  
2、let arr:(number | string)[]，表示数据内所有元素只可以是number或string  
3、let arr:{name:string}[]，表示数据内所有元素都只可以是 {name:xxx}，注意：像{name:xx,age:xx}中有属性age，是不符合之前定义的类型规范。  
4、type User:{name:string}; let arr:User[]; 和上述3中同一个意思  
5、let arr:Array.<number>，这种写法称为“数组泛型”，和 arr:number[] 作用相同  
6、ReadonlyArray.<number>，这种写法会让该数组元素为只读，第一次整体赋值后不可再单独更改。  


#### 元祖(tuple)类型定义：
元素概念解释：已知元素的数量和类型的数组，被称为元祖。  
1、let arr:[string,string,number] ，表示arr为数组，且该数组包含3个值，这3个值的类型依次是string、string、number  
2、let arr:[string,string,number][]，表示arr为数组，该数组内所有的值类型均为 [string,string,number]  

#### 枚举(这是TS独有的，并非原生JS)
枚举概念解释：通过enum对一个对象的各个元素(属性)进行索引数绑定，之后可通过该索引数访问到该元素(属性)。  
1、默认情况下，索引数从0开始，例如 enum Color{Red,Green,Blue}  
2、可手工设定第一个元素的索引，其他元素索引依次向后累加。例如 enum Color{Red=1,Green,Blue}，此时Red索引数为1，Green索引数为2。  
3、可手工设定每一个元素的索引，例如 enum Color{Red=1,Green=3,Blue=5}，此时Color[3] 的值为Green。  

#### any(这是TS独有的，并非原生JS)
any概念解释：当不太确定对象类型时，可以使用any，但是请注意使用 any 后，对象是可以有常见的各种方法的。  
例如 let my:any = 4 ，虽然类型是any，但是my.toFixed()是可以的。  
反例 let my:object =4，object没有toFixed()方法，所以 my.toFixed() 是不可以的。  

#### void(这是TS独有的，并非原生JS)
void概念解释：和any相反，void表示不是任何类型，常用在函数返回值上，表示该函数不返回任何类型的值。  

#### never(这是TS独有的，并非原生JS)
never概念解释：表示永远不存在的类型，通常用在  
1、总是抛出异常错误，却没有正常捕获错误并处理的函数  
2、声明有返回值，但是实际根本就没有返回值的函数  
3、一定会陷入死循环的函数  



## 函数

#### 函数参数类型定义：
1、interface MyFun{(param:string):string}  

#### 函数返回值类型定义：
1、let myFun:() => number，表示myFun是一个返回值为number的函数，具体的类型，基础类型或对象类型  
2、void，表明该函数不返回任何对象  
3、never，表明该函数永远不会执行完毕，例如 function myFun(){while(true){...}}  
或 function myFun(){throw new Error('xxx'); console.log(xx)}，由于会抛出错误，因此console.log(xx)永远不会被执行  
4、对于函数参数来说，TS允许参数名与之前定义的函数类型参数名不相同。例如 interface Person:{(name:string):string}; let person=function({mingzi:string}):string{return mingzi}，虽然2者参数名不同，但是两者类型相同，因此这种写法是TS允许的。  

#### 函数返回值类型可能为多种(TS中非常神奇的操作)：
1、可以对同一个函数定义多次参数类型以及返回数据格式类型，例如 function myFun(x:number):number; function myFun(str:string):string  
2、最终定义一个完整的myFun方法体，例如 function myFun(x:any):any{if(typeof x === number){return x}else if(type x === string){return x}}  
3、使用时，let x = myFun(123); 此时 TS 推断 x 的值为number、let x = myFun('koa'); 此时TS 推断 x 的值为 string。  

注意：你可能会想到 使用 | 来表明返回值类型的可能性，但是这种写法 TS 只是知道 返回值类型的几种可能性却无法精确知道具体是哪种类型，而使用多次定义同一个函数的类型方式可以让TS通过参数类型来精准推断出返回数值类型。  



## 接口(interface)
1、定义接口：interface Person:{name:string,age?:number,say:() => string,[propName:string]:any}  
2、接口继承接口：interface Teacher extends Person{}  
3、只读属性：readonly，例如 interface Person:{readonly name:string}，name仅为只读  
4、索引属性：[index:number]:string，例如 interface StrArray{[index:number]:string}，表示对象的所有[num]值的类型均为string  
5、可有属性：?: 这种形式，例如 interface Person:{age?:number}  
6、通用属性：例如 [propName:string]:any ，表示可以有字符串形式的属性，且对应的值为任何类型  
7、属性顺序：TS不关心属性定义的先后顺序，例如{x:2,y:3} 和 {y:3,x:2}在TS看来是相同的  
8、属性修饰符：public、protected、private和类中的修饰符用法完全一致，如果是给变量、方法、属性使用时public可省略不写，但是请注意，如果是 类的构造函数中的参数，例如 constructor(public xx:xxx) ，这里的public表示将xx看作参数的同事，也将xx作为本类的属性。  
9、合并接口：对于同一个变量进行多次接口声明，则意味着TS会自动合并这些接口。例如，interface Box {width:number}; interface Box(scale:nuber)，那么此时的Box 对应的接口是两次接口的合并。注意，越靠后定义的接口优先级越高。  

#### 接口默认值
默认 interface 只能定义类型，无法设定默认值。如果想实现“给接口参数定义默认值”，可以通过先内部定义一个默认值，然后通过Object.assign(default,props)或{...default,props}的方式将默认值和参数值进行合并，从而实现希望的效果。

````
interface IOpendataAvatarProps {
    headWidth?:number,
    nameSize?:number,
}

const defaultProps:IOpendataAvatarProps = {
    headWidth:250,
    nameSize:32
}

const OpendataAvatar: <IOpendataAvatarProps> = (props) => {
    props = Object.assign(defaultProps,props)
    //或者使用
    //props = {...defaultProps,...props}
    console.log(props.headWidth,props.nameSize)
}
````

#### 请注意上述代码的潜在隐患
无论 assign还是结构赋值，都只能进行第1层的替换，无法对比第2层属性值。 像上面代码中，假设还存在一个属性data，而data默认值 defaultProps.data = {a:1,b:2}，但是传递过来的参数中，props.data = {a:3}，那么2者合并之后的值是不存在 xxx.data.b 这个属性的。


## 类(calss)
1、实现接口：interface Person:{name:string,age:number};  class Teacher implements Person{}  
2、继承类：class Teacher extends Person{}  
3、属性修饰符：  

- public(默认可不写或理解为不写即public)，类的内外均可被访问  
- protected，类的内部或子类的内部可以访问  
- private ，仅在类的内部可访问，子类内部不可访问  

4、类构造函数：class Person {constructor()}，构造函数constructor()可传参数 ，若参数前面加修饰符，例如 public 即表示该参数同时为该类的public 属性 。例如 constructor(public name:string)，这句话等同于下面代码：class Person{public name:string; constructor(name:string){}}  
5、只读属性：readonly，必须在声明时或构造函数内赋值，例如 public readonly name:string，该代码等同于 private _name:string; get name():string{}  
6、readonly与const的区别，通常情况下如果是针对变量使用const，如果针对属性则使用readonly  
7、在TS中还可以将类当成接口来用，如此神奇！例如，class Point{x:number;y:number}; interface Point3d extends Point{z:number}  
8、剩余参数：在TS中的方法参数，可以通过...xxx来收集未知个数的参数，例如 myFun(name:string, ...otherParams:string[]){//otherParams[0]}  


以下为原生JS ES6中，关于类的语法：  
1、重写方法：子类中直接重新定义一次方法，即可完成重写父级该方法  
2、调用父类属性或方法：使用super，例如super.xx，在子类构造函数中也需要调用super()  
3、使用getter setter 方法来让内部private变量暴露给外部。通常我们会将内部变量定义 _xxx，对应 get xxx():xx 、set xxx(value:xx):void{}  
4、类的静态属性或方法：使用static关键词对类的属性或方法进行修饰，例如public static xx ... (public可以忽略不写)，则该属性或方法只能被类访问，而类的实例无法访问。  

#### 抽象类
抽象类是某些共有的属性或方法，使用关键词 abstract ，例如 abstract class Geom{ abstract getArea():number;}，定义抽象类 Geom，该类有抽象方法 getArea()。  
1、抽象类不能直接被实例化，只能被继承。  
2、子类继承抽象类后，必须实现抽象类中 由abstract 定义的抽象方法。  
3、抽象类相对于接口而言，抽象类可以有具体的业务逻辑代码，而不是像接口那样只能定义属性或方法类型，却无具体方法体。  

#### 命名空间
1、使用 namespace关键词，例如 namespace Xx {}  
2、如果使用模块开发，那么使用命名空间的意义也就不大了。  



















