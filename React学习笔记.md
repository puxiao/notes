# React学习笔记

## 安装react并初始化
##### 1、安装：npm install -g create-react-app  

##### 2、创建hello-react目录并初始化：npx create-react-app hello-react  

注意：  
1. 目录名不允许有大写字母  
2. 初始化过程比较慢，大约需要5-10分钟  
3. 如果报错：npm ERR! Unexpected end of JSON input while parsing near '...n\r\nwsFcBAEBCAAQBQJd'， 解决方法：npm root -g 找到本机npm全局安装目录，cd 进入该目录，执行清除缓存：npm cache clean --force，然后再次初始化。  

##### 3、启动项目：cd hello-react、npm start  

默认将启动：http://localhost:3000  

## 自定义组件基础知识

1、自定义组件和入口文件，顶部都需要引入react：import React from 'react';  

2、自定义组件必须以大写字母开头、默认网页原生标签还以小写开头。请注意这里表述的"默认网页原生标签"本质上并不是真实的原生网页标签，他们是react默认定义好的、内置的自定义组件标签，只不过这些标签刚好和原生标签的作用，功能，名称一模一样而已。  

3、自定义组件render(){return <Xxx></Xxx>}，必须且只能有一个最外层标签；  

4、如果不希望设定最外层的标签，那么可以使用react(16+版本)提供的占位符Fragment来充当最外层标签；  

    import React,{Component,Fragment} from 'react';  
    render(){return <Fragment>xxxxxxx</Fragment>}  

在最新的react版本中，可以直接使用<></>来代替Fragment。其中<>唯一可以拥有的属性为key。即< key='xxx'></>  

5、如果你写了constructor(props){super(props);}但是还没有写this.state={}，默认会报错误警告：Useless constructor. eslint(no-useless-constructor)，constructor中加上this.state={}即可消除警告。  

6、希望数据发生改变，忘掉DOM操作，改成数据操作(setState())。  

7、使用数组map循环更新li，一定要给li添加对应的key值，否则虽然正常运行，但是会报错误警告。不建议直接使用index作为key值。  

8、永远不要直接操作修改this.state.xxx=xxx，一定要用setState()来修改。  

9、先复制出一份this.state.xxx的值，然后修改，修改完成后再通过setState()赋值。  

10、在最新的react版本中，为了提高更新性能，推荐采用异步的方式更新数据。具体使用方式为：setState((prevState) => {return {xxx}})。其中参数prevState指之前的数据值(即this.state)，return的对象指修改之后的数据值。pervState参数还可以省略，即 setState(() => {return {xxx}});  

setState()还可以增加第2个参数(回调函数)，即当异步的setState更新完成后执行的函数。  

setState(()=>{return {xxx}},()=>{xxxxx})  

上述代码中的第2个参数()=>{xxxxx}就是异步执行(更新)完毕后的回调函数。  

异步的目的是为了优化更新性能，react短期内发现多条state发生修改，那么他会将所有修改合并成一次修改再最终执行。  

11、在render(){return <xx></xx>}中写注释，格式为：{/* xxxxx */}或{//xxxx}，注意如果使用单行注释，最外的大括号必须单独占一行。注释尽在开发源代码中显示，在导出的网页中不会有该注释。 
 
12、给标签添加样式时，推荐使用className，不推荐使用class。如果使用class虽然运行没问题，但是会报错误警告，因为样式class这个关键词和js中声明类的class冲突。类似的还有标签中for关键词，推荐改为htmlFor。  

13、直接将xxx赋值给某标签，作为该标签的内容时会进行转义(若xxx为<h1\>xxx</h1\>，则以纯文本形式展示)。若不想转义，则在属性中设置dangerouslySetInnerHTML={{__html:xxx}}，如无必要，尽量不要这样设置，容易造成xss攻击。  

14、通常情况下，react是针对组件开发，并且只负责对html中某一个div进行渲染，那么意味着该html其他标签不受影响，这样引申出来一个结果：一个html既可以使用react，也可以使用vue，两者可以并存。 
 
15、为了方便调试代码，可以在谷歌浏览器中安装React Developer Tools插件。安装后可在谷歌浏览器调试模式下，查看component标签下的内容。  若访问本机react调试网页则该插件图标为红色、若访问导出版本的React网页则该插线显示为蓝色、若访问的网页没使用react框架则为灰色。  

16、给组件设定属性ref={(xxx) => {this.xxx=xxx}}，之后如果写处理函数中，想获得DOM元素可以不需要写eve.target，而是直接写this.xxx即可找到该DOM。但是不建议这样操作，还应该以更改数据而非直接操作DOM为原则。除非你想给该DOM元素设置焦点。  

17、给组件设定属性，只有属性名没有属性值，那么默认react会将该属性值设置为true。在ES6中如果只有一个属性对象没有属性值，通常理解为该属性名和属性值是相同的。 为了避免混淆，不建议不给属性不设置属性值。  

18、属性设置中，使用{...props} 表示展开props(props可以是自己定义的对象，也可以值默认传递过来的参数props)，并继续向下传递。  

19、若组件render(){return xxx}中xxx为函数，则会将运行结果作为组件内容输出出去，但是如果xxx的值为true、false、null、undefined中的任意一种，这种输出结果是允许的，但是不会进行任何渲染。  结合这个特性，可以做条件渲染，例如 {isxxx && <Xxx />}，只有isxxx为true时，才会输出 <Xxx />  

请注意：aa && bb 这种JS原生语法，只有aa为布尔值(true或false)时才会按照预期来确定是否返回bb还是false。aa是数字(数字1除外)或字符串或空数组(只要不是布尔值)，那么就都会返回 bb(而不是返回false)，为了保证每次都是预期返回，建议要用 Boolean(aa) 形式来将aa转化为布尔值。  

相反，如果在输出时想输出布尔值boo为字符串，那么应该用 String(boo)将布尔值转化为字符串"true"或"false"  

20、使用<React.StrictMode></React.StrictMode>标签包括元素，表示被包裹的元素将使用严格模式(若有非严格模式的错误，将会有对应错误警告提示)。<React.StrictMode>标签并不会显示在前台页面中，并且该元素仅在开发模式下启作用，在生产模式下将忽略被包裹元素的非严格模式下的错误提示。  

21、ReactDOM.createPortal()用来将元素渲染到任意DOM元素中(包括顶级组件之外的其他DOM中)。  



## "纯函数" 概念解释

JS中定义的所有函数都可以增加参数，所谓"纯函数"是指函数内部并未修改过该参数的函数。  

例如以下函数：function myFun(a){let c=a }，该函数内部从未更改过参数a，那么这个函数就是纯函数。  

反例，非纯函数 例如：function myFun(a){a=a+2; let c=a}，该函数内部修改过参数a，那么这个函数就不再是纯函数了。  

纯函数的特殊意义是什么？  
因为纯函数内部从不会直接修改参数，那么无论运行多少次，执行结果永远是一致的。  

若仅仅有一个函数，那么也无所谓，但是如果有多个函数都是都需要调用执行同一个变量(参数)，为了确保多个函数执行结果是符合预期的，那么就要求每个函数都不能在自己内部修改该变量(参数)。  

在react中定义的 this.state 就会被作为参数供内部多个函数使用，react要求任何函数不能直接修改this.state的值，确保各个函数在收到参数this.state时是一致的this.state。  

这就是为什么react不允许直接修改this.state的原因。  

## "受控组件" 概念解释

像input、select、textarea、form等将自身value与state进行绑定的组件，称之为受控组件。  

"受控"即这些组件的可以值受到state的控制。  

与之对应的是"非受控组件"，即该组件对应的值并不能被state控制。  

例如"<input type='file'/\>"，该组件的值为用户选中本地的文件信息，该值并不能直接通过state来进行控制(设置)，因此该组件属于"非受控组件"。  


## "声明式开发" 概念解释

"声明式开发"：基于数据定义和数据改变，视图层自动更新。  
"命令式开发"：基于具体执行命令更改视图，例如DOM操作修改。

注意：声明式开发并不是不进行DOM操作，而是把DOM操作频率降到最低。    

## "单项数据流" 概念解释

react框架的原则中规定，子组件只可以使用父组件传递过来的xxx属性对应的值或方法，不可以改变。  

数据只能单向发生传递(父传向子，不允许子直接修改父)，若子组件想修改父组件中的数据，只能通过父组件暴露给子组件的函数(方法)来间接修改。  

react框架具体实现方式是设置父组件传递给子组件的"数据值或方法"仅仅为可读，但不可修改。  

为什么要做这样的限制？  
因为一个父组件可以有多个子组件，如果每个子组件都可修改父组件中的数据(子组件之间彼此共用父组件的数据)，一个子组件的数据修改会造成其他子组件数据更改，最终会让整个组件数据变得非常复杂。  

为了简化数据操作复杂程度，因此采用单向数据流策略，保证父组件数据的唯一最终可修改权归父组件所有。  

## "视图层渲染框架" 概念解释

react框架自身定位是"视图层渲染框架"，单向数据流概念很好，但是实际项目中页面会很复杂。  

例如顶级组件Root中分别使用了组件A(由子组件A0、A1、A2构成)、组件B(由子组件A0、A1、A2构成)、组件C(由子组件C0、C1、C2构成)，若此时组件A的子组件A2想和组件C的子组件C1进行数据交互，那么按照单向数据流的规范，数据操作流程为 A2 -> A -> Root -> C - C1，可以看出操作流程非常复杂。  

**所以实际开发中，React框架必须结合其他"数据层框架"(例如Redux、Flux等)**。  

## "函数式编程" 概念解释

react自定义组件的各种交互都在内部定义不同的函数(js语法规定：类class中定义的函数不需要在前面写 function关键词)，因此成为函数式编程。不像原生JS和html交互那样，更多侧重html标签、DOM操作来实现视图和交互。  

函数式编程的几点好处：  
1、可以把复杂功能的处理函数拆分成多个细小的函数。  
2、由于都是通过函数来进行视图层渲染和数据交互，更加方便编写"前端自动化测试"代码。  

## "虚拟DOM" 概念解释
虚拟DOM(Virtual Dom)就是一个JS对象(数组对象)，用来描述真实DOM。相对通过html标签创建的真实DOM，虚拟DOM是保存在客户端内存里的一份JS表述DOM的数组对象。  

用最简单的一个div标签来示意两者的差异，数据格式如下：  

    //真实DOM数据格式(网页标签)
    <div id='mydiv'>hell react</div>

    //虚拟DOM数据格式(JS数组对象)
    //虚拟DOM数组对象格式为：标签名+属性集合+值
    ['div',{id:'mydiv'},'hell react']
    
    //在JSX的创建模板代码中，通常代码格式为
    render(){return <div id='mydiv'>hello react</>}

    //还可以使用react提供的，更加底层的方法来实现
    render(){return React.createElement('div',{id:'mydiv'},'hello react')}


虚拟DOM更新性能快的原因并不是因为在内存中(理论上任何软件都是运行在内存中)，而是因为虚拟DOM储存的数据格式为JS对象，用JS来操作(生成/查询/对比/更新)JS对象很容易。用JS操作(生成/查询/对比/更新)真实DOM则需要调用Web Action层的API，性能相对就慢。  

react运行(更新)步骤，大致为：  
1、定义组件数据state   
2、定义组件模板JSX  
3、数据与模板结合，生成一份虚拟DOM  
4、将虚拟DOM转化为真实DOM  
5、将得到的真实DOM挂载到html中(通过真实DOM操作)，用来显示  
6、监听state发生改变，若有改变重新执行第3步(数据与模板结合，生成另外一份新的虚拟DOM)  
7、在内存中对比前后两份虚拟DOM，找出差异部分(diff算法)  
8、将差异部分转化为真实的DOM  
8、将差异化的真实DOM，通过真实DOM操作进行更新  

当state发生更改时，虚拟DOM减少了真实DOM的创建和对比次数(通过虚拟DOM而非真实DOM)，从而提高了性能。  

## "Diff算法" 概念解释

当state发生改变时，需要重新生成新的虚拟DOM，并且对旧的虚拟DOM进行差异化比对。  
Diff算法就是这个差异化比对的算法。  

Diff算法为了提高性能，优化算法，通常原则为：
  
##### 同层(同级)虚拟DOM比对

先从两个虚拟DOM(JS对象)同层(即顶层)开始比对，如果发现同层就不一致，那么就直接放弃下一层(级别)的对比，采用最新的虚拟DOM。  

疑问点：假如两心虚拟DOM顶层不一致，但下一级别以及后面的更多级别都一致，如果仅仅因为顶层不一致而就该放弃下一级别，重新操作真实DOM从头渲染，岂不是性能浪费？  

答：同层(同级)虚拟DOM比对，"比对"算法相对简单，比对速度快。如果采用多层(多级)比对，"比对"算法会相对复杂，比对速度慢。 同层虚拟DOM比对就是利用了比对速度快的优势来抵消"操作真实DOM操作性能上的浪费"。  

##### 列表元素使用key值进行比对

这里的key值是值"稳定的key值(是有规律的字符串，非数字)"，若key值为索引数字index，那么顺序发生改变时，索引数字也会发生变化，无法判断之前的和现在的是否是同一个对象。  

如果key值是稳定的，那么在比对的时候，比较容易比对出是否发生变化，以及具体的变化是什么。  

Diff算法还有非常多的其他性能优化算法，以上列出的"同层比对、key值比对"仅仅为算法举例。  


## "高阶组件" 概念解释

高阶组件是一种组件设计方式(设计模式)，就是将一个组件作为参数传递给一个函数，该函数接收参数(组件)后进行处理和装饰，并返回出一个新的组件。  

简单来说就是，普通组件是根据参数(props)生成一个UI(JSX语法支持的标签)。而高阶组件是根据参数(组件)生成一个新的组件。  


## "生命周期函数" 概念解释

生命周期函数指在某一时刻组件会自动调用执行的函数。  

这里的"某一时刻"可以是指组件初始化、挂载到虚拟DOM、数据更改引发的更新(重新渲染)、从虚拟DOM卸载这4个阶段。

#### 生命周期4个阶段和该阶段内的生命周期函数：  

##### 初始化(Initialization)  
constructor()是JS中原生类的构造函数，理论上他不专属于组件的初始化，但是如果把它归类成组件组初始化也是可以接受的。

##### 挂载(Mounting)
componentWillMount(即将被挂载)、render(挂载)、componentDidMount(挂载完成)  

##### 更新(Updation)：
props发生变化后对应的更新过程：componentWillReceiveProps(父组件发生数据更改，父组件的render重新被执行，子组件预测到可能会发生替换新数据)、shouldComponentUpdate(询问是否应该更新？返回true则更新、返回flash则不更新)、componentWillUpate(准备要开始更新)、render(更新)、componentDidUpdate(更新完成)  

states发生变化后对应的更新过程：shouldComponentUpdate(询问是否应该更新？返回true则更新、返回flash则不更新)、conponentWillUpdate(准备要开始更新)、、render(更新)、componentDidUpdate(更新完成)   

props和states发生变化后的更新过程，唯一差异是props多了一个 componentWillReceiveProps生命周期函数。  

componentWillReceiveProps触发的条件是：  
1、一个组件要从父组件接收参数，并且已存在父组件中(子组件第一次被创建时是不会执行componentWillReceiveProps的)  
2、只要父组件的render函数重新被执行(父组件发生数据更改，子组件预测到可能会发生替换新数据)，componentWillReceiveProps就会被触发  

##### 捕获子组件错误：
componentDidCatch(捕获到子组件错误时被触发)
  
##### 卸载(Unmounting)：  
componentWillUnmount(即将被卸载)  

备注：自定义组件继承自Component组件，Component组件内置了除render()以外的所有生命周期函数。因此自定义组件render()这个生命周期函数必须存在，其他的生命周期函数都可以忽略不写。 

##### 生命周期函数的几个应用场景：

1、只需要第一次获取数据的Ajax请求  
如果组件有ajax请求(只需请求一次)，那么最好把ajax请求写在componentDidMount中(只执行一次)。因为"初始化、挂载、卸载"在一个组件的整个生命周期中只会发生一次，而"更新"可以在生命周期中多次执行。  

2、防止子组件不必要的重新渲染  
若父组件发生state改变，那么会调用render()，会重新渲染所有子组件。但是如果state改变的某个值与某子组件并不相关，如果此时也重新渲染该子组件会造成性能上的浪费。为了解决这个情况，可以在子组件中的shouldComponentUpdate生命周期函数中，做以下操作:  

    shouldComponentUpdate(nextProps,nextStates){
      //判断xxx值是否相同，如果相同则不进行重新渲染
      return (nextProps.xxx !== this.props.xxx); //注意是 !== 而不是 !=
    }

对于类组件(由class创建的)和函数组件(由function创建的)，他们对于生命周期的调用方法不同。  

类组件：直接在类中定义函数；  
函数组件：需要用到hook(钩子)，具体用法参见Hook用法；  


# React中设置样式的几种形式

##### 第一种：引用外部css样式  

伪代码示例：  
import from './xxx.css';  
return <div className='xxx' /\>

注意：在jsx语法中，使用驼峰命名。例如原生html中的classname需要改成className、background-color要改成backgroundColor。  


##### 第二种：内部样式  

伪代码示例：  
return <div style={{backgroundColor:'green',width:'100px'}} /\>  

注意：内联样式值为一个对象，对象属性之间用","分割而不是原生html中的";"。  
因为是一个对象，因此下面代码也是可行的：  
const mystyle = {backgroundColor:'green',width:'100px'};
return <div style={mystyle} /\>



# React中数据传递的几种方式  

在实际场景中，组件往往是由多级组件组合而成。组件之间数据传递(数据绑定)有多重形式，需要根据具体也许需求来选择使用哪种传递方式。

注：这里说的"数据传递"包含以下几层意思：  
1、数据的获取  
2、数据的修改(通过父级暴露给子组件函数来实现修改，这种方式也称为 "render props")  
3、根据数据变化重新渲染  


以下文字描述中：  
1、将顶级组件称之为"父组件"，用<Parent/>来代替  
2、将实际业务组件称之为"子组件"，用<Me/>来代替  
3、将子组件中的子组件称之为"孙组件"，用<Son/>来代替  

以上对组件的称呼仅仅是为了区别组件，事实上"子组件相对孙组件也可以称之为父组件"。    

伪代码提示：  
1、为了简化示例代码，省略了组件代码中 import 相关代码。  
2、只演示数据向下传递，不演示修改上级数据  
3、修改上级数据的方式是通过父组件定义修改数据的函数，并将该函数像数据一样传递给子组件或孙组件，子组件或孙组件通过调用该函数并传入修改值来实现上级数据修改。    


## 第1种：默认设置属性传递

实现方式：父组件通过对子组件添加自定义属性和属性值来传递数据。  

代码示例：  

    //父组件给子组件添加属性num，值为2  
    <Parent>
      constructor(props){
        super(props);
        this.state = {
          num:'2'
        }
      }
      <Me num={this.state.num}/>
    </Parent>
    
    //子组件获取num的值  
    {this.props.num}  

若父组件要给孙组件传递数据，则每一层都需要进行接力传递。  

    <Parent>
      constructor(props){
        super(props);
        this.state = {
          num:'2'
        }
      }
      <Me num={this.state.num}>
        <Son num={this.props.num} />
      </Me>
    </Parent>

优点：简单直接  
缺点：需要层层传递，即使中间级别的组件不需要该数据，但是他也必须添加该属性，以保证数据能够接力向下传递。  


## 第2种：使用组件组合传递

实现方式：若中间级别的组件不需要某属性，那么他可以采用{...}的形式将自身属性值传递给下一级组件中。  

代码示例：  

    <Parent>
      constructor(props){
        super(props);
        this.state = {
          num:'2'
        }
      }
      <Me num={this.state.num}>
        <Son num={...} />
      </Me>
    </Parent>


有点：中间级别的组件减少代码冗余(只是看上去减少了一些而已)  
缺点：数据依然需要层层传递  


## 第3种：使用Context传递

实现方式： 
 
第1步：首先使用React.createContext([defaultValue])来声明一个公共数据对象，例如GlobalContext，可单独保存为global-context.js。

说明如下：  
1、可以声明多个不同的公共数据对象，并不要求必须全局唯一。  
2、[defaultValue]为可选默认值，若父组件中未定义value属性值，则使用defaultValue作为默认要向下传递的数据值。  

第2步：父级组件(顶级组件)中，进行以下操作：  
1、引入该公共数据对象  
2、添加静态对象 static contextType = GlobalContext  
3、使用<GlobalContext.Provider value='xxx'></GlobalContext.Provider>标签包裹要输出的组件代码，value='xxx'就是定义要传递给子组件或孙组件的数据。  

第3步：子组件或孙组件中，若不需要获取GlobalContext的值可以不做任何特殊处理，仅在需要获取GlobalContext的值的组件中，进行以下操作：  
1、引入该公共数据对象  
2、添加静态对象 static contextType = GlobalContext  
3、使用<GlobalContext.Consumer value='xxx'>{context => {//xxxxx }}</GlobalContext.Consumer>标签包裹要输出的组件代码，使用{this.context}来获取GlobalContext数据的值。  

代码示例：  

    //父组件给子组件或孙组件添加属性num，值为2  
    import GlobalContext from './global-context'; //引入GlobalContext
    <Parent>
      static contextType = GlobalContext; //设置静态属性contextType
      constructor(props){
        super(props);
        this.state = {
          num:'2'
        }
      }
      <Me value={this.state.num} />
    </Parent>
    
    //子组件或孙组件想获取num的值，操作如下  
    import GlobalContext from './global-context'; //引入GlobalContext
    <Me>
      static contextType = GlobalContext; //设置静态属性contextType
        render() {
          return <GlobalContext.Consumer>
            {
              context => {
                return xxxxx; //xxxxx为具体的业务jsx，若想获取num，则使用{this.context}即可  
              }
            }
          </GlobalContext.Consumer>
        }
    </Me> 

再次提醒：父组件使用<GlobalContext.Provider></GlobalContext.Provider>、子组件或孙组件使用<GlobalContext.Consumer></GlobalContext.Consumer>，且格式为<GlobalContext.Consumer>{context => { return xxxxx;}}</GlobalContext.Consumer>  


## 第4种：使用第三方数据管理 Redux

实现方式：引入第三方该数据管理模块 redux。  


# Hook用法

Hook是react16.8以上版本才出现的新特性，可以在函数组件中使用组件生命周期函数，且颗粒度更加细致。  

可以把Hook逻辑从组件中抽离出来，多个组件可以共享该hook逻辑。  

**请注意hook本质上是为了解决组件之间共享逻辑，并不是为了解决组件之间共享数据。**  

hook表现出来特别像一个普通的JS函数(仅仅是表现出来但绝不是真的普通JS函数)，如果加以扩展，是可以做到一定程度上组件之间共享数据的。  


## 诞生Hook特性的背景原因：  

第一个原因：在以前版本中，函数组件不支持组件生命周期函数，若想使用生命周期函数必须使用类组件，即由class Xxx extends Component 这种形式来定义的组件。  

第二个原因：类组件在使用过程中，常见有以下几个"痛点"：  
1、函数中的this用法稍显复杂(js中的this都很复杂)，函数必须bind(this)或者使用箭头函数。  

2、类组件中生命周期函数固定，无法提供更细致的颗粒度。  
举个例子：  
假设你在componentDidUpdate函数中需要自定义a,b,c 3个变量，那么你必须把 a,b,c 3件事情都写在this.state = { a,b,c}中。

若你需要维护一个已经写好的组件，而该生命周期函数中存在a,b两个变量，那么你新增加c时，你还必须完整维护好a,b两个变量(添加c时千万别手滑修改了a或b)。

我们更希望能够将c变量从this.state中分离出去，只去关心c就好，无需维护保持a,b。因此就需要对生命周期函数有更加细致的颗粒度控制能力。

把上面这段话中的"变量"替换为"执行代码"也是合理的。  

使用Hook以后，你可以单独把c从state中抽离出去、或者可以表达为：单独把c执行代码从某个生命周期函数中抽离出去。

3、类组件在个别情况下容易引发无意义的重新渲染。 
 
4、类组件使用内部自定义数据稍显复杂(需要使用this.state.xxx这种形式)。使用Hook以后直接使用{xxxx}即可获取。   

5、类组件中内部定义state数据会随着变化而变化，最初的state数据不会做备份保留。 

6、若希望在类组件挂载后或数据更新后执行一些操作，那么你需要分别在componentDidMount和componentDidUpdate函数中分别写入相同的执行代码。使用Hook以后则2者合并为一个函数useEffect中。  

7、类组件操作原生DOM不方便。使用Hook以后，就像普通JS函数操作原生DOM一样，非常简单。


基于以上原因，在react 16.8中引入了Hook这个概念。React官方声明不会因为Hook的出现而取消或削弱类组件。  

备注：像其他前端库，例如Vue也都有Hook用法。


## Hook的用法：  

##### useState：用来在函数组件中自定义变量

使用方法：数组结构的语法 + useState(value)来实现组件内部自定义数据。  

代码示例：

    import React,{useState} from 'react';
    function Example(){
       //通过以下语法来内部自定义数据
      //xxxx：定义的变量名
      //setXxxx：定义更改xxxx对应的函数名
      //xx：定义的默认值
      const [xxxx,setXxxx] = useState(xx);
    
      //函数组件想获取xxxx变量值，即：{xxxx}

      //想修改xxxx变量值需要做以下判断
      //若xxxx为简单值(string、number)，可以直接采用setXxxx(newValue)进行修改
      //若xxxx为包含引用类型的值(例如为object {a:xx,b:xx})，若仅想修改属性b(其他属性不变)
      //修改方式为setXxxx({...xxxx,b:newBValue})

      return (//...)
    }

数组结构赋值的用法，在上面代码中 const [xxxx,setXxxx] = useState(xx)  
等价于以下代码：  
const resArr = useState(xx);  
const xxxx = resArr[0];  
const setXxxx = resArr[1];  

由此可见数组结构赋值可以使代码更加简洁。  


##### useEffect：组件某些生命周期函数后执行额外的代码，也称为"副作用(额外的操作)"

"某些生命周期函数"是指这3个：componentDidMount、componentDidUpdate、componentWillUnmount  

使用方法：直接在函数组件中使用 useEffect(() => {//...});，若该方法中有 return 返回函数，那么表示当组件生命周期函数执行完毕后，调用此retrun 的返回函数。  

代码示例：

    import React,{useState,useEffect} from 'react';
    function Example(){
      useEffect(()=>{
        //组件生命周期函数执行前 对应的自定义处理代码
        return () => {
        //组件生命周期函数执行完毕后 对应的自定义处理代码
        }
      });

      return (//...)
    }

请注意，在useEffect中第1个参数()=>{}，你可能会有疑惑，为什么不在其他地方单独定义一个函数，而是选择每次都返回一个不同的函数？  
这是为了确保effect每次获取到的都是最新的值，而不用担心过期。 可以将每次新生成的()=>{}当成专门为此次渲染之后打造的执行函数。  

若函数组件或自定义Hook中出现多个useEffect，则会按照他们定义的先后顺序，依次执行。  

使用useEffect，会在组件渲染之后就执行一次。这里的"渲染之后"包括3个生命周期函数(componentDidMount、componentDidUpdate、componentWillUnmount)。  

对于同一处的useEffect，每次执行useEffect之前，会清理掉上一次执行的效果。

为什么要这样做？  
为了确保代码的执行正确、一致性，为了避免可能因为忘记添加更新逻辑而出现的bug。

该如何优化性能？  
如果是类组件，可以在componentDidUpdate中添加prevProps或prevState值的对比，如果值未发生变化则通过return false 来阻止重新渲染，以提高性能。  
那么函数组件则可以通过给useEffect()添加第2个参数(只有第2个参数发生变化时再会执行useEffect里的内容)，以达到优化性能的目的。第2个参数通常被称为"依赖列表"。  

代码示例：useEffect(()=>{//...},[xxxx]);  
只有在xxxx发生真的变化后才会执行useEffect中第1个参数 ()=>{//...} 中的代码

如果你传入第2个参数是一个空数组[]，那么表示该useEffect只会在第一次被挂载时执行一次。以后发生的componentDidUpate、componentWillUnmount生命周期函数时，均不会再次执行该useEffect。   

函数组件中定义(出现)多个useState和多个useEffect，他们是如何对应(关联)的？  
是按照他们定义(出现)的先后顺序进行 useState和useEffect一一对应的。   

代码示例：
useState('Aa');  
useEffect(()=>{});  
useState('Bb');  
useEffect(()=>{});  

通过定义的先后顺序(成对出现)，useEffect会找到上一个最近定义的useState，认为该useState是自己所需要关注的。当这个useState发生变化时则会执行自身(useEffect)。  

这也是为什么不允许在if/for/嵌套函数中使用hook的原因，因为那些语句本身包含有条件判断或逻辑，不能保证每一次执行的结果都是按照"固定顺序定义hook"的，这样做很容易造成bug。如果你这样做了，react自带的lint插件会有错误警告提示。   

如果就是需要用到if做一些判断来决定是否执行某些代码，可以将if放到useEffect中。这样是比较安全稳妥的做法。  


##### useContext：获取react中自定义的共享数据对象 Context

若使用 函数组件 + Hook，不建议再使用Context来共享数据。Hook已经可以让我们非常自由的去定义自己的数据(Hook本身就像一个普通的JS函数)。  

使用方法：const xxx = useContext(XxxContext)

代码示例：

    //假设我们有一个自定义GlobalContext，文件名为global-context.js
    //先引入GlobalContext
    import GlobalContext from './global-context.js';
    
    //函数组件或自定义Hook函数
    function Example(){
      //订阅GlobalContext
      const globalContext = useContext(GlobalContext);
      //备注：若在类组件中订阅，则使用代码 static globalContext = GlobalContext; 
    }


以上为基础的Hook函数，以下为其他Hook函数

##### useReducer
##### useCallback
##### useMemo
##### useRef
##### useImperativeHandle
##### useLayoutEffect
##### useDebuValue


##### Hook使用规则
  
1、Hook只能在函数组件或自定义Hook中使用(类组件或者普通JS函数中均不可使用Hook)；  
2、必须在函数内的最外层(不允许在if/for/嵌套函数中使用)  
3、使用次数不限(可多次使用)，但是他们的定义先后顺序很重要。应该让useEffect紧随着需要关注的useState；  
4、可以从函数组件中抽离出来到一个单独的函数中，该函数通常称为"自定义Hook"；  


##### 自定义Hook

函数命名：约定自定义Hook函数名采用驼峰命名法，且必须以use开头，即 useXxxx；  
补充说明：  
1、react自带linter插件来检测是否按照要求来命名，若不以use开头则会有错误警告。  
2、实际中为了更加语义化，还可以命名为useXxxStatus，表明该函数是用于处理XxxStatus状态的函数。  

使用方法：将函数组件中Hook相关函数抽离出来，单独放在一个函数内，该函数即自定义Hook。

代码示例：  

    import React,{useState,useEffect} from 'react';
    import GlobalContext from './global-context.js';
    
    function useXxxx([param]){
      const [xxx,setXxx] = useState(defaultValue);
      const globalContext = useContext(GlobalContext);
      useEffect(() => {
        //...
        return () => {
          //...
        }
      });
    }

    // 当然你也可以使用箭头函数来自定义hook
    useXxxx = ([param]) => {
    }

将Hook抽离出函数组件的一个好处是可以实现多个组件共用该hook。  
