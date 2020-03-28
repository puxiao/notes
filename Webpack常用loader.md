# Webpack常用loader


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

特别注意：如果采用injectType=linkTag这种方式，那么就无法在业务代码中使用相关css样式操作了(因为没有引入css-loader，所以业务代码中没法理解css样式设置代码)。  
