# Redux学习笔记

本文将以问答形式来记录自己学习过程中的知识点。


## 为什么要学习Redux？

答：React官方描述定义为：用来构建用户界面的JS库。 那么在实际开发中，不光要定义界面，还需要对界面进行数据交互，而Redux就是用来处理数据交互。  

Facebook官方推出的数据交互框架Flux，相对简单、并且可以同时存在多个store，容易造成store互相引用问题，为了解决这个问题，才诞生了Redux，Redux = Reducers +  Flux。  


## Redux的实现本质是什么？

Redux是通过：状态提升 + 发布订阅 来实现数据共享的。  
状态提升：所有数据都从react组件提升到redux   
发布订阅：发现数据变动通知对应react组件  


## Redux工作流程是什么？

答：Redux创建唯一一个公共数据中心(store + reducers)，无论哪个react组件都要从公共数据中心中获取或修改数据。 通过这种形式，数据不再保存在react组件自身之中，通过共同操作(获取或修改)公有且唯一的公共数据中心，以达到不同组件之间的数据交互。  

Redux工作流程对应的4个角色：  
1、React Components：自定义react组件  
2、Action Creators：申请操作数据命令  
3、Store：Redux公共数据存储者和管理者(Action Creators 命令接收者)  
4、Reducers：Action Creators 命令翻译者  

注意：Store负责接收Action Creators命令，但是store本身无法理解该条命令，需要将该命令转给Reducers，Reducers将该命令翻译成store能够理解的命令，并返回给Store。

自定义组件的数据交互流程为：  

react components -> action creators -> store -> reducers -> store -> react components  

react组件 -> 向store发送数据操作请求 -> store接收到操作请求后，转发给reducers -> reducers将操作命令翻译(转化)成store可以理解的命令，并返回给store -> store根据操作命令操作数据，并将结果返回给react组件 -> react组件接收并处理返回结果

## 如何安装Redux？

答：npx create-react-app xxx --template redux ，其中 xxx 为安装、创建的目录名。  



  


