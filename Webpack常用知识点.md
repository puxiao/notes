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

注意：若host为内网IPv4的值(例如192.168.xx.xx，则同局域网电脑均可访问)、若想使用热更新(HMR)，则需要再添加2个属性：hot:true 热更新、hotOnly=true 即使热更新失败也不自动刷新

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

注意：若host写的是内网IPv4的地址，例如192.168.xx.xx，那么同局域网电脑均可访问该地址。  

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

还可以创建一个build目录，将上述3个.js文件都放到这个目录里，然后修改dev和build中 --config参数路径，例如 dev --config 的值由 webpack.dev.js改为 ./build/webpack.dev.js。  

注意，如果采用将配置文件放入build目录，切记一定要做以下修改：  
1、webpack.common.js中output.path的路径增加"../"，否则dist目录会创建在build目录下(而不是根目录)。  
2、相对旧的版本，最新版本clean-webpack-plugin已经支持自动识别删除output.path对应的目录(dist目录)，因此无需做任何更改。 

这样配置以后，想执行开发环境(创建调试网页、热更新等)：npm run start、想执行生产环境(打包输出文件)：npm run build  



# 代码拆分(code splitting) —— 代码优化(optimization)

项目代码一般包含2个部分：引入的公共代码类库和我们自己编写的业务代码。  
如果把所有代码均打包输出为1个js文件，那么会存在以下风险：  
1、这1个js文件体积会比较大。  
2、若更改业务代码，重新整体打包，客户端需要重新加载这个js(体积大加载慢)。  

为了解决这个问题，应该将项目代码进行拆分，比较简单的方式就是将公共类库输出为1个js、业务代码输出为1个js。  
若业务代码发生变更，客户端仅仅需要重新加载业务代码js，而公共类库js可以选择使用之前的缓存。  

稍微复杂点的拆分做法是按需动态加载，例如假设项目运行有A模块、B模块、C模块，当需要用到哪个模块时才加载哪个模块。

### 在webpack中有3种代码拆分方式：  

#### 第1种：手工拆分  

实现方式：通过手工方式将引入的公共库单独创建一个js文件(例如xxx.js)，在webpack.config.js的入口entry中，配置如下：
entry:{main:'../src/index.js',xxx:'../src/xxx.js'}，这样在输出打包时会将xxx.js和业务代码进行拆分成2个js文件。  

优点：能够体现出开发人员代码拆分主观意识比较强 (看，纯手工！)  
缺点：麻烦并且不见得拆分的合理(很可能会重复引用)  

#### 第2种：使用SplitChunksPlugin(无需安装，webpack已内置该插件)

实现方法：在webpack.config.js中，添加optimization(优化)项，并配置splitChunks中的chunks值为"all"，配置如下：  
optimization:{splitChunks:{chunks:"all"}}  
此时打包输出，除业务逻辑代码js外，会额外创建一个以"vendors"开头的js文件(例如vendors~main.bundle.js)，里面是拆分出来的公共类库代码。  

优点：自动，简单  
缺点：只是简单讲公共类库和业务代码进行拆分，并未做到不同业务模块拆分，实现按需加载  

#### 第3种：动态加载(动态导入)  

实现方法：修改业务代码，将需要动态导入的业务代码(函数或模块)通过import()来进行动态导入。  

大致实现模式是：  

    async function getComponent(){
      const { default: xxx } = await import('xxxxx');
      //此时xxx为引入的类模块(公共类库或者自己拆分出的业务模块js)
      //编写业务代码，例如生成自己的组件mycomp
      let mycomp = xxxxxx....
      ......
      return mycomp;
    }
    
    getComponent().then(component => {
      document.body.appendChild(component);
    })

与此同时，要修改webpack.config.js中的ouput配置参数，新增chunkFilename属性：  
ouput:{main:'xxx',chunkFilename: '[name].bundle.js',path:xxxxxxxx}  

优点：实现动态加载(导入)，代码拆分更加细致化
缺点：业务代码编写方式相对静态导入，稍显复杂

#### 第4种：预取、预加载 (webpack v4.6.0以上版本才支持，目前仅为beta测试版)

实现方式：在import时，使用2个内置关键词prefetch(预取)和preload(预加载)

预取和预加载两者的区别，主要体现在“触发发生”的阶段不同。  
1、当父级chunk开始加载时，预加载同步进行、当父级chunk加载完成时，预取才开始进行。  
2、无论当前浏览器是否空闲，预加载都会进行、只有当浏览器空闲时，预取才会开始进行。  
3、当预加载完成后，当前模块可以立即使用、当预取完成后，可能将来某个时刻才会使用到。  
