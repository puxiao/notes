# Webpack常用知识点


# 各种loader

### 官方loader地址：[https://webpack.js.org/loaders/](https://webpack.js.org/loaders/)

## 文件资源相关(图片、字体、样式文件等等)：file-loader url-loader

### file-loader：文件资源打包(目录，重命名等)

### url-loader  文件资源(图片资源)转base64编码资源。  
一定要注意limit这个属性值，他决定了是否转换base64

使用说明：  
1、与file-loaer不同，url-loader是将图片资源转换成base64编码嵌入网页中使用  
2、limit这个属性值 定义最大多少字节以内的文件才进行转化，超出则不转换base64(按照file-loader形式进行输出)  


## CSS相关：style-loader css-loader

### css-loader：css资源解析

### style-loader：将css文件中的样式附加到网页中

第一种组合：style-loader + cas-loader  将css样式通过内嵌<style\></style>附加到网页<head>中。  

第二种组合：style-loader + file-loader 将css样式通过<link rel="stylesheet" href="./xx.css">附加到网页<head>中。  
设置injectType属性值为linkTag：
{test:/\.css$/i,use:[{loader:'style-loader',options:{injectType:'linkTag'}},{loader:'file-loader'}]}

特别注意： 如果采用injectType=linkTag这种方式，那么就无法在业务代码中使用相关css样式操作了(因为没有引入css-loader，所以业务代码中没法理解css样式设置代码)。  


# 各种plugin

## 每次打包前清除原有dist目录：clean-webpack-plugin

使用方法(引入方法和一般plugin不同)：   

    const {CleanWebpackPlugin} = require('clean-webpack-plugin');  
    
    plugins:[  
      new CleanWebpackPlugin()  
    ]  


## 创建(生成)html页面：html-webpack-plugin

自动将打包的js文件创建一个index.html文件。

使用方法：  

    const HtmlWebpackPlugin =  require('html-webpack-plugin');
    
    plugins:[  
      new HtmlWebpackPlugin(  
        {  
          filename:'index.html',
          template:'src/template/index.html'  
        }  
      )  
    ]  


# devtool配置

用来定位出错JS语句所在原始位置，记录原始JS代码与打包后JS代码之间的映射关系。将devtool设置为不同的值后映射关系的精确度不同，同时打包所需耗时也不同。

默认为none，即不生成原始js代码和打包后js代码之间的映射关系。

### 修改方式

修改默认值，webpack.config.js中设置方式：  

    const config = {
      mode:'development',
      devtool:'source-map'
    }

若devtool设置为“source-map”，则会在打包过程中，创建原始JS代码与打包后JS代码之间的完整映射关系，方便快速定位出错的JS代码位置。打包完成之后，会在输出目录中有一个 xx.js.map文件，该文件记录原始JS代码与打包后JS代码映射关系。

若devtool值为inline，则会将映射关系通过base64直接嵌入到打包后的js文件内(不会创建.map文件)。  

若devtool值为eval，则会将映射关系通过普通字符串直接嵌入到打包后的js文件内(不会创建.map文件)，因此eval通常打包所需时间比较短。  

### 注意事项

devtool不同值所支持(适用于)的环境也不同，比如source-map适用于开发环境，inline-source-map适用于生产环境。  

### 关键词组合解释：  

1、inline：定位到某js(业务js代码 + 引用的node_modules代码)的某行代码中的某处(精确度到某行的某处)  
2、cheap：定位到某业务js的某行代码(精确度到某行)  
3、module：包含引用的node_modules代码错误  
4、eval：定位到某业务js的某行代码(精确度到某行) ，打包速度非常快，但仅适合比较简单的js代码，稍微复杂的js代码打包后则会定位不准确

### 推荐值
开发环境建议使用：cheap-module-eval-source-map  
生产环境建议使用：cheap-module-source-map  
