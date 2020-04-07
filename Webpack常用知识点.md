# Webpack常用知识点

webpack4以上版本配置文件可以为空(不创建、不存在)，那么webpack会使用默认的配置设置。  

但是实际项目中的打包输出肯定需要自己去配置定义，才能满足项目个性化需求。  

# 入口文件(entry)和输出配置(output)  

### 入口文件(entry)  

这里说的"入口文件"是指webpack在开始准备打包时，先从哪个文件开始分析。  

常见入口设置：  

    entry:{main:'./src/index.js'}

上面的配置里只是设定了一个入口文件main，以及main对应的源代码位置。  
 
如果有多个入口文件，可以继续向entry里添加：  

    entry:{main:'./src/index.js',admin:'./src/admin.js',....}

注意：设定的入口文件main，admin这些对应输出配置里fliename中的[name]占位符。  

### 输出配置(output)  

这里的"输出设置"是指webpack打包输出时，对js文件的储存目录和文件命名设置。对于其他资源(css、jpg等)，他们的输出目录和文件名规则分别在各自对应的loader options中，或者是plugins中。  

常见的输出配置：  

    output:{
        filename:'js/[name].[hash].js',
        chunkFilename:'[name].chunk.[hash].js',
        path:path.join(__dirname,'../','dist'),
        hashDigestLength:10
    }

filename：表示被网页直接引用的js对应储存目录和文件名。其中添加[hash]是为了确保有内容修改时文件名也发生变化，避免浏览器缓存更新不及时。  

chunFilename:表示被网页简介引用的js对应储存目录和文件名。  

path：以配置文件所在目录为基础，设置最终打包生成的文件目录。 上面的代码示例里，是因为将webpack配置文件放在了项目根目录下的build目录里，所以'../'跳出本目录，才能找到项目根目录下的dist目录。  

hashDigestLength:文件名中[hash]的字符长度，默认为20，长度越长可能重复的几率越小。实际中设定为10足够了，当然也可以不修改或配置此属性。还有另外一种写法，即在设置输出名字时[hash]改为[hash:10]，也可以达到同样效果。  

注意：以上是普通项目代码输出output配置，如果是写给其他人用的类库项目，还需做一些别的配置。  

对应场景：别人使用你的类库，可能采用import或require，甚至可能是html中的<script>标签引用。  
output属性需要新增：libaray(供html中的<script>标签使用)、libarayTarget(供import|require使用)  

若项目只有1个入口文件，可以做如下配置：  

    entry:{
      mylibaray:'./src/index.js'
    },
    output:{
      filename:'mylibaray.js',
      path:path.resolve(__dirname,'dist'),
      libaray:'mylibaray',
      libarayTarget:'umd'
    }

libaray:'mylibaray'中的mylibaray对应<script>标签中可使用的库类名字mylibaray。  
libarayTarget:'umd'中的umd表示“通用引用方式，包含nodejs环境和浏览器环境”。  
若libarayTarget的值为'this'、'windows'、'global'，则表示挂载到对应对象上，而不是全局变量中。  

所谓全局变量即表示可直接使用xxx，不需要this.xxx、windows.xxx、global.xxx等前缀对象。类库名字相当于在全局变量中，添加了一个变量mylibaray。  

若项目有多个入口文件，libaray:'mylibaray'只会匹配上最后一个入口文件。对于多个入口文件应该将libaray的值修改为数组(请注意该数组并的值并不是多条库类名字，而是一种占位符组合方式)。  

    entry:{
      alpha:'./src/alpha.js',
      beta:'./src/beta.js'
    },
    output:{
      filename:'mylibaray.[name].js',
      path:path.resolve(__dirname,'dist'),
      libaray:['mylibaray','[name]'],
      libarayTarget:'umd'
    }

请注意上面代码中的 libaray:['mylibaray','[name]']  

按照上面配置，打包输出后将会创建2个文件：mylibaray.alpha.js、mylibaray.beta.js，对应使用时类库名字为：mylibaray.alpha、mylibaray.beta。  

再次注意，在打包类库时还存在以下实际场景：  
1、你自己编写的类库A中引用了别人的类库C，webpack打包输出时会将C捆包打包到你的类库A中    
2、别人的项目B中引用了你的类库A，但是他由于别的需求也引用了类库C  
此时对于项目B来说同时存在了2份类库C，这是不合理的。  

对于上述场景，解决方案是通过webpack.config.js中的externals配置，将类库C排除在外(不进行打包)，externals中还会约定别人(项目B)在引用类库C时的引用变量名，好让这个引用变量名也能让类库A使用。  

具体如何配置参见externals。  


# 外部扩展(externals) 不打包依赖

对于普通项目，webpack会在打包输出时把各种代码依赖都打包捆绑出去，以确保项目能够独立正常运行。但是对于类库项目(libaray)，实际应用中反而希望webpack不打包依赖，只需要把自己那部分类库业务代码打包出去即可。  

若有使用者引用我们编写的类库，我们希望使用者自己引入第三方类库。当然还要和使用者约定引入第三方类库的变量名(相当于告诉使用者我们编写项目时，代码中第三方类库的引用变量名)，确保我们编写的类库可以使用上该第三方类库。  

webpack.config.js中的externals配置项，就是用来解决这件事情的。  

externals配置项有3种形式：数组、对象、正则表达式。他们可以相互组合，对应的含义各自不同。  

假设我们编写的类库代码中，引用了第三方类库C(是类库名为C，而不是类库地址)，并且给类库C对应的内部引入变量名为myc，且用到了类库C中的.dosomting，那么externals不同配置项含义如下：  

externals:['C'] 告知webpack打包时不需要打包C  

externals:{myc:'C'} 告知webpack打包时不需要打包C，同时告诉使用者在引入C时应该将类库C的引入变量名设置为myc(这里所谓的告知应该是通过报错文字信息来提示，比如找不到myc)  

externals:{myc:['./C','dosomthing']}  告知webpack打包时不需要打包C，同时告诉使用者只需要引入C类库下的dosomting即可，且对应dosomthing引入变量名为myc  

externals:{C:{commonjs:'myc',amd:'myc',root:'\_'}} 告知webpack打包时不需要打包C，同时告诉使用者需要引入C类库，并且如果是使用commonjs语法引入则应将C类库对应的引入变量名设置为myc，如果是使用root(全局变量)引入，则应该将C类库对应的引入变量名设置为\_，以此类推。  

externals:/^(C|myc|\_|\$)$/i 告知webpack遇到类库C，或myc、\_、$这些变量时，不把对应的依赖打包出去。  


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

若不想删除某个目录以及该目录下的文件，可以通过在构造函数中添加{cleanOnceBeforeBuildPatterns}来实现。  

    plugins:[  
      new CleanWebpackPlugin({
          //xxx目录以及该目录下的文件将不会被删除
          cleanOnceBeforeBuildPatterns:['**/*','!xxx','!xxx/**']
        })  
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

还可以给HtmlWebpackPlugin增加一个config的属性，这个属性的值是开发者自定义的对象。  

假设我们定义config:{title:'index',mode:true}，那么html模板里可以使用<% %>标签来添加渲染代码，类似以下：  
1、<title><%= htmlWebpackPlugin.options.config.title %></title>  
注意：注意此处的"<%="，%=必须是紧挨着的(中间不可以有空格，<% } %>没有这个限制)、引用自定义属性时需要加".options"  
2、<% if(htmlWebpackPlugin.options.config.mode) { %> <!-- 此处放置你的html代码 --> <% } %>  

## CSS文件拆分(将CSS独立打包成一个文件)：mini-css-extract-plugin

如果不希望将css样式内嵌在打包输出的js中(该js会通过style-loader将css样式内嵌到网页<style>标签中)。  
虽然可以通过 sytle-loader(配置options:{injectType:'linkTag'}) + file-loader来实现，但是这样做的一个缺点，因为没有使用css-loader，所以在编写业务代码时无法方便使用css样式属性。 

为了解决这个问题，可以使用 mini-css-extract-plugin。  

使用方法：  

    const MiniCssExtractPlugin = require('mini-css-extract-plugin');

    //配置文件中的module属性
    module:{
      rules:[
        {
          test:/\.css$/i,
          use:[MiniCssExtractPlugin.loader,'css-loader']
        }
    }

    //配置文件中的plugin属性
    plugins:[
      new MiniCssExtractPlugin({filename:'css/[name].css',chunkFilename:'css/[name].chunk.css'})
    ]

特别说明：  
1、依然需要使用css-loader。  
2、目前最新版本的mini-css-extract-plugin已经默认支持热更新。  
3、和输出js文件命名规则类似，如果一个css文件被网页直接引用，那么他将会被命名为filename对应的值，如果是被间接引用(被网页直接引用的css引入)则被命名为chunkFilename对应的值。

假如有以下情况：  
1、入口文件直接引用有css，也间接引用有其他css，那么默认会打包出多个css文件(filename和chunkFilename)。  
2、入口文件有多个，并且每个入口文件都引用有各自的css，那么默认也会打包出多个css文件。  

如果我们希望将整个项目所有css文件都打包成一个css文件，可以在webpack配置文件中的optimization.splitChunks.cacheGroups增加一个style组，代码如下：  

    optimization:{
      splitChunks:{
        chunks:'all',
        cacheGroups:{
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true,
          }
        }
      }
    } 



假如有以下情况：  
1、入口文件有多个，每个入口文件都直接引用或间接引用各自的css。  

如果我们希望将各个入口文件的css单独进行打包，那么可以在webpack配置文件中做以下修改：

    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    
    //定义一个函数
    function recursiveIssuer(m) {
      if (m.issuer) {
    return recursiveIssuer(m.issuer);
      } else if (m.name) {
    return m.name;
      } else {
    return false;
      }
    }

    //假设其中一个入口文件为foo，在配置文件中的cacheGroups属性进行新增一个fooStyles组，其他入口文件也采用这种方式增加
    optimization:{
      splitChunks:{
        chunks:'all',
        cacheGroups:{
          fooStyles: {
            name: 'foo',
            test: (m, c, entry = 'foo') => {
              m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry
            },
            chunks: 'all',
            enforce: true
          }
        }
      }
    }

特别说明：以上代码示例来源于webpack官方文档，但我在实际运行中遇到了一些问题(webpack版本4.42.1)，打包结果并不是预期的，暂时保留这些问题，此处代码仅做记录。  


## CSS文件代码压缩：optimize-css-assets-webpack-plugin

将css中多处样式进行简化合并(例如删除注释、多个css属性合并为一个css属性等)。无论是使用style-loader还是mini-css-extract-plugin，都推荐使用css代码压缩。  

使用方法：  

    const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
    
    //配置文件中的plugin属性
    plugins:[
      new OptimizeCssAssetsPlugin()
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

另外一种常见做法是通过添加环境变量，再根据环境变量返回(判断并合并)对应的配置文件。  

实现方法是：  
1、webpack.dev.js和webpack.prod.js本身只储存配置，并不使用webpack-merge与webpack.common.js合并。  
2、在package.json中的scripts里，给打包命令添加环境变量，并且修改参数对应的配置文件路径：   
{"dev": "webpack  --env.NODE_ENV='development' --config ./build/webpack.common.js"}  
3、webpack.common.js中同时引入webpack.dev.js和webpack.prod.js，并且修改webpack.common.js的导出代码，将原来的直接导出对象改为一个包含return最终配置文件的函数(使用webpack-merge进行合并)。  

    //导出模块为一个函数，伪代码如下：
    module.export = (env) =>{
    //根据环境变量来判断到底和哪个配置文件合并
      return merge(config,(env && env.NODE_ENV === 'development')?dev:prod);
    }

注意：不同操作系统对于环境变量的设置不同，为了兼容各个操作系统，还需要安装使用cross-env这个类模块。  

虽然这种方式也可以实现合并多个配置文件，但是不推荐使用此方法。  


# 代码拆分(code splitting) —— 代码优化(optimization)

项目代码一般包含2个部分：引入的公共代码类库和我们自己编写的业务代码。  
如果把所有代码均打包输出为1个js文件，那么会存在以下风险：  
1、这1个js文件体积会比较大。  
2、若更改业务代码，重新整体打包，客户端需要重新加载这个js(体积大加载慢)。  

为了解决这个问题，应该将项目代码进行拆分，比较简单的方式就是将公共类库输出为1个js、业务代码输出为1个js。  
若业务代码发生变更，客户端仅仅需要重新加载业务代码js，而公共类库js可以选择使用之前的缓存。  

稍微复杂点的拆分做法是懒加载(按需加载)，例如假设项目运行有A模块、B模块、C模块，当需要用到哪个模块时才加载哪个模块。

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

这里说的公共类库代码默认仅仅指从node_modules目录里引入的代码，当然你可以通过修改splitChunks.cacheGroups.vendors.test的值来确定哪些算是“公共类库”。  

注意：splitChunks有很多属性配置，其中有一个默认属性miniSize:30000，意思是只有当你引入的模块代码超过30K以后，才会进行拆分。如果引入的模块代码总共不超过30K，即使做了拆分配置，也不会进行拆分。  

如果设置miniSize:0，那么只要是import的类库(公共类库和自己写的业务模块)，都会进行拆分。这里有一个特殊情况是如果是自己写的业务模块或者是引用别人的框架js，这些代码并不在默认的"node_modules"目录里，这时需要在splitChunks.cacheGroups配置中新增一个和vendors同级的default对象，default配置属性和vendors有些区别但又类似。

当然也可以自定义输出文件名字(例如引用node_modules目录里的代码模块打包文件名字叫vendors.js，引用其他地方的代码模块打包文件名字叫common.js)，以及文件存放位置(例如存放到dist的js目录里)，只需做一下配置修改：  
optimization:{splitChunks:{chunks:"all",cacheGroups:{vendors:{filename:'js/vendors.js'}},default:{filename:'js/common.js'}}}  

#### vendors组与default组的区别：  
vendors组有属性test:/[\\/]node_modules[\\/]/，打包时会判断引入的代码模块是否在node_modules目录里。而default组没有test属性，没有test属性意味着default组可以匹配任何目录内的代码模块。 

那么问题来了，引用node_modules目录里的代码模块也符合default组(没有test属性，不限任何目录)，为啥不会被打包进default组里呢？ 

答案是：因为vendors组和default组，默认都有一个属性priority(优先级)，vendors组的默认priority值为-10、default组的默认priority值为-20。当priority(优先级)的值越大，代码模块就优先归属到哪个组里，-10大于-20，所以优先归属到vendors组里。  

此外default组还有一个vendors组没有的属性 reuseExistingChunk:true，指复用已经存在的代码模块。例如a模块引入c，b模块也引入c，那么只会打包一份c到default组里。vendors组虽然没有该属性，但是node_modules中同一个代码类库webpack默认也是只会导出一份。  

#### vendors组与default组的共同点：  
1、自定义输出文件名filename:"xxxxx"设置完全相同。  
2、优先级priority设置完全相同，只是vendors的priority默认值为-10，default的priority默认值为-20。强烈建议不要修改他们的priority默认值。  

#### 第3种：动态加载(动态导入)  

实现方法：修改业务代码，将需要动态导入的业务代码(函数或模块)通过import()来进行动态导入。  

大致实现模式是：  

    async function getComponent(){
      //请注意，在引入函数import的括号里有 /* webpackChunkName:'xxxxx' */ 
      //这个被称为"魔法注释"：将来打包输出的该动态类名字就是注释里的xxxxx
      //如果省略则生成的文件名是以数字0为启始索引，例如0.js、1.js....
      const { default: xxx } = await import(/* webpackChunkName:'xxxxx' */ 'xxxxx');
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
ouput:{main:'xxx',chunkFilename: '[name].chunk.js',path:xxxxxxxx}  
optimization:{splitChunks:{chunks:'all',cacheGroups:{verdors:false,default:false}}}  

无论静态分割还是动态导入，都需要用到webpack默认自带插件splitChunksPlugin，以及对它的配置。  

优点：实现动态加载(导入)，代码拆分更加细致化。  
缺点：业务代码编写方式相对静态导入，稍显复杂。

#### 第4种：懒加载——预取、预加载 (webpack v4.6.0以上版本才支持，目前仅为beta测试版)

实现方式：在import时，使用2个魔法注释：  
1、/* webpackPrefetch: true */   预取  
2、/\* webpackPreload: true */   预加载  

这2个魔法注释的用法和 /* webpackChunkName:'xxxxx' */ 相同。

预取和预加载两者的区别，主要体现在“触发发生”的阶段不同。  
1、当父级chunk开始加载时，预加载同步进行、当父级chunk加载完成时，预取才开始进行。  
2、无论当前浏览器是否空闲，预加载都会进行、只有当浏览器空闲时，预取才会开始进行。  
3、当预加载完成后，当前模块可以立即使用、当预取完成后，可能将来某个时刻才会使用到。 

#### 实用技巧： 使用谷歌浏览器的coverage功能来查看网页代码覆盖率(代码默认使用占比)，来帮助我们分析优化代码的可拆分性。  

# 魔法注释
#### webpack在使用动态加载(导入)或懒加载(预取和预加载)中，目前有3个魔法注释：  
1、设定加载模块打包输出文件名(如果不设定，则采用默认的以数字为文件名的规则)：/* webpackChunkName:'xxxxx' */  
2、设定懒加载的方式为预取：/\* webpackPrefetch: true */  
3、设定懒加载的方式为预加载：/\* webpackPreload: true */  


# 打包分析(bundle analysis)

为了分析项目打包过程中的细节、打包完成后结果，需要做一项工作：打包分析。  

实现方法，大体分为两个步骤。  

#### 第一步：生成打包细节文档stats.json  
在执行webpack打包命令时，添加参数 --profile --json > stats.json，可以记录打包过程中的各个细节，并在打包完成后生成一个 stats.json 文件，该文件储存位置为整个项目的根目录(并不是dist目录)。  

例如我们可以在package.json的scripts中添加一条执行命令：  
{"analysis":"webpack --profile --json > stats.json --config './build/webpack.analysis.js'"}  

webpack.analysis.js是我们专门为了打包分析设定的webpack配置文件，具体配置项在第二步中会有详细说明。

当然你也可以继续使用原来的开发环境或生产环境配置文件。

#### 第二步：分析stats.json文件，获得可视化的分析结果

如果直接打开stats.json文件，不够直观，需要我们通过第三方工具来进行可视化分析。  

##### 推荐使用以下2种可视化分析工具：

##### 第1种：webpack官方提供的打包分析可视化网站：[http://webpack.github.com/analyse](http://webpack.github.com/analyse)  

使用方法：访问该网站，上传stats.json文件，该网站即可进行可视化分析结果展示。  

##### 第2种：使用webpack-bundle-analyzer

使用方法：  
1、安装webpack-bundle-analyzer：npm install --save-dev webpack-bundle-analyzer  
2、创建打包分析对应的webpack配置文件，例如第一步(生成打包细节文档stats.json)中提到的./build/webpack.analysis.js。

    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
    const merge = require('webpack-merge');
    const common = require('./webpack.common'); 
    //webpack.common.js为我们已配置好的共有配置选项文件，可参考本文档中"使用webpack-merge合并多个配置文件"这一部分

    //因为webpack.analysis.js仅仅用来做打包分析，所以他不需要设置mode、devtool、devServer以及HtmlWebpackPlugin等
    //不设置，那么就会使用webpack默认值即可
    const config = {
      plugins:[
        new BundleAnalyzerPlugin()
      ]
    }
    
    module.exports = merge(common,config);


终端执行命令：npm run analysis  
打包完成后，浏览器会自动打开 http://127.0.0.1:8888 里面就是可视化打包分析结果。  


# 垫片(Shimming) | shim预置依赖

垫片(Shimming) 和 shim预置依赖 是同一个事情的两种不同叫法而已。  

假设有这个场景：某个子模块c需要使用了另外一个公共类库B，那么c需要先import或require B。  
但是，如果你想省力气，不写c引入B，而是直接使用B，此时理论上c模块代码是不完整，无法运行的。  

这时候，就用到了 webpack 垫片 或 预置依赖 这个概念。需要你做一些特别的配置，webpack在打包输出时，帮你把缺失的引入B代码给自动添加到c模块中。  

声明：非常不赞成这种行为，但是webpack确实可以帮你完成这个工作。  

具体实现方式是通过使用ProvidePlugin插件来完成的，具体用法可参见：[https://webpack.js.org/plugins/provide-plugin/](https://webpack.js.org/plugins/provide-plugin/)  
