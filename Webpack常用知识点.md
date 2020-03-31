# Webpack常用知识点


# 各种loader

### 官方loader地址：[https://webpack.js.org/loaders/](https://webpack.js.org/loaders/)

## js文件相关

webpack默认自带js文件的loader解析器，无需配置。但是如果需要将ES6代码转ES5，则需要使用babel-loader。

### babel-loader：ES6代码转ES5

npm install --save-dev babel-loader @babel/core  
npm install @babel/preset-env --save-dev  
npm install --save @babel/polyfill  

//如果是业务js代码，可以进行以下配置  
//webpack.config.js module.rules  
{test:/\.js$/i,exclude:'node_modules',loader:'babel-loader',options:{presets: [['@babel/preset-env'],{useBuiltIns:true}]}}  
//exclude:'node_modules' 排除node_modules这个文件夹  

以上为业务js代码配置，这样配置的结果是babel会将代码注入到全局中。如果编写类库js代码，为了防止全局污染，不要使用这种方法。  

如果是编写类库js代码，可以通过@babel/plugin-transform-runtime来进行配置(不会全局污染，而是采用闭包形式)，具体如何配置需要进一步参考babeljs.io官方文档。  

无论是采用哪种形式，可以在根目录新建一个.babelrc文件，把webpack.config.js中babel的options配置内容移动到.babelrc文件里。babeljs在编译时会自动加载该文件作为配置项。  


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


# devServer使用

监听我们的项目源代码，当源代码发生变化时自动打包代码，甚至还可以将新的结果在网页调试中自动刷新(或热更新)。

### 三种实现方式：  

#### 第1种：webpack自带的 --watch  

使用方法：  
npx webpack --watch 或 在package.json中scripts设定：  "scripts":{"watch":webpack --watch}  

优点：不需要使用任何其他第三方npm包，可直接使用。  
缺点：只能自动打包代码，但不能自动代开调试网页，更不存在自动刷新网页。  

#### 第2种：安装并使用webpack-dev-server

使用方法：  
1、安装webpack-dev-server：npm i --save-dev webpack-dev-server  
2、配置package.json："scripts":{"start":"webpack-dev-server"}  
3、配置webpack.config.js：devServer:{contentBase:'/dist',open:true,host:'127.0.0.1',port:80,compress:true}  

注意：若想使用热更新(HMR)，则需要再添加2个属性：hot:true 热更新、hotOnly=true 即使热更新失败也不自动刷新

终端执行代码：npm run start  

注意：在开发阶段使用webpack-dev-server，他并不会创建dist目录下的各个文件(dist是个空文件夹)，而是将各种资源加载到系统(电脑)内存里，所以运行速度会非常快。等项目开发完成后，再取消devServer，生成dist目录及文件。

优点：监听代码变动自动打包、自动打开调试网页、自动刷新(更新)网页
缺点：无，最主流的方式，包括Vue、React均采用此方式

#### 第3种：安装并使用webpack-dev-middleware

使用方法：  
1、安装webpack-dev-middleware：npm i --save-dev webpack-dev-middleware  
2、配置package.json："scripts":{"server":"node server.js"}  
3、配置webpack.config.js：devServer:{contentBase:"/dist"}、ouput:{publicPath:"/"}  
注意：这里设置输出的publicPath，就是http服务器的根目录，若两者(package.json和webpack.config.js)同时不填写此项也可以。  
4、新建server.js：通过nodejs或express或koa，自己创建http服务器，并且监听webpack的打包器compiler。  

终端执行代码：npm run server  

server.js代码类似如下：

    const Koa = require('koa');  
    const webpack = require('webpack');  
    const webpacKDevMiddleware = require('webpack-dev-middleware');  
    
    const app = new Koa();  
    const config = require('./webpack.config.js');  
    const compiler = webpack(config);  
    
    app.use(webpacKDevMiddleware(compiler,{publicPath:config.output.publicPath}));  
    app.listen(80);  

优点：完全自己手动创建http服务，也许可以加入自己特定功能需求(仅仅是也许)  
缺点：需要自己手工创建http服务，上面的server.js代码仅仅是创建了http调试服务器，但是功能不全(没有自动打开、自动刷新功能)，若想加上这些缺失的功能还需要编写更多代码。  


#### 综上所述，推荐使用第2种方法。

# 热更新(HMR：Hot Module Replacement)

当项目代码(js、css等)发生改变时，无刷新形式更新到前台页面调试中。

### 使用方法：  
1、安装使用webpack-dev-server：npm i --save-dev webpack-dev-server  
2、配置package.json："scripts":{"start":"webpack-dev-server"}  
3、配置webpack.config.js：配置devServer和plugins  

配置devServer：  

    devServer:{
      contentBase:'/dist'
      host:"127.0.0.1",
      post:80,
      compress:true,
      hot:true,
      hotOnly:true
    }

配置pubgins：

    const webpack = require('webpack);
    
    {plugins:[
      new webpack.HotModuleReplacementPlugin()
    ]}


4、添加更新代码：对于变更的部分，删除原来的，重新执行一遍修改后的。

“删除原来 + 重新执行新的”对应伪代码如下：  

    //src/index.js
    import myjs from './js/myjs';
    
    myjs();
    
    if(module.hot){

      //添加某代码对象的变更监听
      module.hot.accept('./js/myjs',() => {

        //删除原来
        document.body.removeChild(document.querySelector('#xxx'));

        //重新执行一遍修改后的
        myjs();

      });
    }


5、终端执行代码：npm run start  

由于"start"这个词是npm内置的(另外3个内置词是"test"、"stop"、"restart")，因此执行代码可以简写为：npm start  
若要结束热更新监听，则在终端执行：ctr+c 

### 特别说明：  

对于css文件，style-loader、css-loader已经内置了“删除原来 + 重新执行新的”这一步操作，所以看上去“css文件不需要执行这一步”。  

对于js文件，如果使用Vue、React、Angular，这些框架已经内置了“删除原来 + 重新执行新的”这一步操作，所以看上去“js文件也不需要执行这一步”。如果没有使用上述框架，那么自己写的js文件就需要自己在js中手工执行“删除原来 + 重新执行新的”这一步操作。 

对于图片文件，目前还不清楚如何热更新，貌似只能靠刷新。

上述操作为webpack官方示例，但是在实际使用中，如果没有采用框架，而是自己手写的原生js，经过很多次测试，结论是如JS代码发生更改，可以做到自动刷新，但是做不到无刷新情况下的热更新。(虽然检测到了更新并做出了反应)。  


#### 综上所述，如果不采用Vue、React、Angular这些框架，纯手写JS，不建议使用热更新。



# 使用webpack-merge合并多个配置文件

默认情况下webpack对应的配置文件为webpack.config.js。但实际项目中我们经常需要在开发环境和生产环境中来回切换，如果单纯每次靠修改配置文件会比较麻烦。  

#### 推荐做法是：  
1、创建webpack.dev.js，储存开发环境所需的独有配置内容。    
2、创建webpack.prod.js，储存生产环境所需的独有配置内容。  
3、创建webpack.common.js，储存开发环境和生产环境共有的配置内容。  
4、安装webpack-merge模块：npm install --save-dev webpack-merge (具体使用方法参见该模块官方文档)。  
5、在webpack.dev.js和webpack.prod.js中，均引入webpack-merge和webpack.common.js，将合并后的配置文件作为导出(module.exports)对象。  
6、在package.json的scripts中，设定{"dev":"webpack --config webpack.dev.js","build":"webpack-dev-server --config webpack.prod.js"}  

这样配置以后，想执行开发环境(创建调试网页、热更新等)：npm run start、想执行生产环境(打包输出文件)：npm run build  

