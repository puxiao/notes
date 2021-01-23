# Chrome使用技巧



## 网页截屏

假设目前你已经打开需要截屏的网页，那么接下来按照以下步骤操作。

第1步：打开Chrome调试工具——快捷键为 Ctrl + Shift + I

第2步：打开命令列表——快捷键为 Ctrl + Shift + P

第3步：输入 screenshot

第4步：点击第 2 项 “Capture full size screenshot”，即可完成网页内容的全部截屏





## 免费解锁 Medium 付费文章

#### 第1种：通过 readium 书签

第1步：访问 https://sugoidesune.github.io/readium/

第2步：拖动 Readium 按钮到浏览器书签栏

第3步：以后遇到付费文章，点击这个书签就可以自动解锁

补充说明：这种方式有个缺点，浏览器书签栏 必须一直保持为显示状态



#### 第2种：通过浏览器插件 Bypass Paywalls

第1步：下载离线安装包 https://github.com/iamadamdev/bypass-paywalls-chrome/archive/master.zip 

第2步：打开Chrome扩展页，并开启 “开发者模式”

第3步：将解压后的安装包目录拖到 Chrome 扩展页，点击确认即可安装成功

第4步：将 Bypass Paywalls 固定在 Chrome 顶部

第4步：以后遇到付费文章，点击这个扩展程序图标即可自动解锁


## 实时查看当前页面渲染性能

除了浏览器本身的 性能(Performance) 面板外，还有另外一个重要的、方便我们查看页面渲染性能的工具——Rendering。

#### 开启Rendering方式

1. 打开浏览器调试工具 DevTool

2. 点击右侧 3 个小圆点

3. 鼠标移动到 More tools

4. 点击 Rendering

5. 在新出现的 Rendering 面板中，勾选 Frame Rendering Stats

   > 备注：在旧的谷歌浏览器中，应该勾选的是 Show FPS meter

这样就可以在网页左上角，实时看到当前渲染性能状况。



#### 性能数据解读

性能展示的数据，主要 2 个模块：Frames 和 GPU

**GPU 相关：**

1. GPU raster ：on  表示 GPU 光栅化已开启

2. GPU memory：GPU 已用大小、GPU 最大可用大小

   > 在本示例中，通常是当修改浏览器尺寸时，此时需要大量计算，会显示出 GPU memory
   >
   > 在普通的 鼠标拖拽 改变地球视角时，不会显示 GPU memory

**Frames相关：**

假设某一时刻，渲染性能结果为 Frames：63% 1082(0m) dropped of 2737

对应的解读为：

第1个数字 63% —— 63% 的帧按时渲染完成

第2个数字 1082 —— 有 1082 个合成帧丢失(未渲染)

第3个数字 0m —— 有 0 个帧丢失

第4个数字 2737 —— 原本计划渲染 2737 个帧

数字之间的计算关系为 63% ≈ 1 - (1082 + 0 )/ 2737

也就是说 第2个数字(丢失的合成帧)越小，那么整体按时完成渲染帧的百分比(第1个数字)越大，意味着此刻网页越流畅。

