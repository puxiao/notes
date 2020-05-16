# less学习笔记

## 安装
npm i less -g  
查看版本：less -v  
查看帮助：less -h  
查看文件依赖：less -m 或 less -depends  

## 编译
进入存放.less的文件目录，在终端运行 less xxx.less xxx.css。  
例如我们要编译 base.less文件，编译后的css文件名为 base.css，对应执行命令为：   
less base.less base.css  

## 变量
使用 @ 作为变量前缀，例如@width:10px、@height:@width+10px

## 混合
使用 () 作为后缀，可以将已定义的样式混入到当前样式中。例如：  
.border{solid 1px black}  
.div{width:100px; .border()}  

## 嵌套
使用 .xxx 可以将原本需要分成多次定义的样式，合并到一个样式中，例如：  

    header{color:green}
    header .logo{width:50px}
    header .nav{width:200px}
    合并为 
    header{
    color:green; 
      .log{width:50px;} 
      .nav{width:200px} 
    }

## @嵌套
原生CSS中，例如媒体查询 @media、检测浏览器是否支持某样式 @supports，这些本身就是由 @开头的样式，他们不表示为变量，而是原本的意思。它们依然可以嵌套到别的样式中，但是最终编译结果却是他们包裹着别的样式，而不是在该样式中。  
例如：  

    .div{
      color:blue;
      @media (min-width:900px){
        color:red;
        @media (max-width:1200px){
          color:green;
        }
      }  
    
以上样式最终将编译为：  

    .div{color:blue}
    @media (min-width:900px){
      .div{color:red}
    }
    @media (min-width:900px) && (max-width:1200px){
      .div{color:green}
    }

## 运算
所谓运算即加减乘除，但是 加减 与 乘除 的运算规则不同。  
##### 在 less 中，加减 运算规则如下：  
1、如果单位不同，less 编译时会尝试进行单位转换，如果转换失败则最终运算结果不包含单位，例如 200px - 1cm，由于px和cm不是同一性质的单位，因此计算结果将不包含任何单位。  
2、如果是同一性质的单位则可以做运算，例如 cm和mm 是同一性质单位。  
3、从运算左侧开始寻找，找到第一个有效单位，该单位即最终结果使用的单位。  

例如 2cm-5mm 计算结果为 1.5cm ：  
1、cm和mm为同一性质的单位，因此可以做运算。  
2、从左往右，第一个出现的单位是cm，所以最终计算结果也以cm为单位。  

##### 在 less 中，乘除 运算规则如下：  
1、与加减运算不同，乘除不进行单位转换。

例如 2cm * 3mm ，计算结果为 6cm。  不会进行单位转换，仅仅进行数字乘除。  

##### calc()运算
calc()运算与原生CSS中的用法一模一样，只不过less中的calc()可以使用变量。  

## 引号转义
使用 ~"(xxxx)" 形式，可以将某字符串在编译时转义成对应的“字面内容”。  

例如：@media ~"(min-width:800px)"{}，最终编译为 @media (min-width:800px){}  

在less 3.5+版本以后，可以将~""省略不写，即简写为：media (min-width:800px){}

## 内置函数
less内置了一些关于颜色计算，字符串处理相关的函数。  

## 命名空间和访问符
在使用混合和嵌套时，可通过 xx.xx() 的形式将样式引入。  例如：  

    .div{
      .button{
        width:200px;
      }
    }

在别的样式中，则可使用 .div.button() 将对应样式引入，例如：  

    .p{.div.button()}  
    另外一种写法为：.p{.div > .button}  


## 映射
在 less 3.5+ 版本中，可以通过 xx[xxx] 形式，获取该属性值。  
例如：  
div{color:red};  
span{color:div[color]}  

## 变量作用域
less变量作用域与JS中变量作用域相似，都具有“变量提升”和“就近原则”。  

##### 变量提升：  
声明变量的代码可以放在使用该变量之后。例如：    
@mycolor:red; color:@mycolor;
等同于 color:@mycolor; @mycolor:red;

##### 就近原则
当使用变量时，优先从最近的结构中寻找并使用变量，找不到情况下再向上一层中查找。  例如：  

    @mycolor:green;
    .div{
      @mycolor:red;
      .logo{
        color:@mycolor;
      }
    }

最终 .div .logo 的color值为 red。  

## 导入
使用 @import "xxxx" 的形式可以将其他地方的样式文件导入到本样式文件中。导入后可以使用里面的样式和变量。   
1、如果是.less文件，则可以省略文件后缀，例如 @import "bg.less" 可简写为 @import "bg"  
2、如果是.css文件，则不可以省略文件后缀。
