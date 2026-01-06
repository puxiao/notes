# Krpano(Virtual Tour)学习笔记

**Krpano本身功能很丰富，但是本文仅讲解使用 krpano 创建 3D 场景导览的功能。**

<br>

**安装：客户端**

下载地址：https://krpano.com/download/

> windows最新版：https://krpano.com/download/download.php?file=krpano123win&server=krp

无需安装，解压后直接运行 `krpano Tools.exe` 即可。

<br>

**若有条件应该购买正版！**

网上找到的注册码：

```
FXsqTqaGNSZER5dSETEm+VzQEh9sWSa5DZEHsCiMxYV9GcXs8W3R8A/jXHrGNUceXvrihmh28hfSFlqvoGAEMzIychPJB3O5TbB7XUjUHhte95pf8X3dfH/Iw+QqjsR2wp+NPKN7ISGTTDefZdGwnf4soe6PNZVyHy4rXUXb1M5zuff9CQZuuo17OgzzJqki1/wexITU4MugLNsMgotDpOCX8y8J364Zbjko6diaoW+QybLZcU/wfJVAecfxk15ghiqrzaDsbqrdABA0xw==
```

> 软件注册后再次打开会有一个弹窗，直接勾选弹窗中间的选框，下次不再提醒即可。

<br>

**生成3D场景**

运行 `krpano Tools.exe`，点击顶部的 `Make VTour`，选择你要生成的若干张全景图。

然后程序就会在开始自动处理，最终会在全景图片目录下创建一个名为 `vtour` 的目录。

<br>

**编辑3D场景**

在 `krpano Tools.exe` 中点击顶部的 `VTour Editor`，在下面一排按钮中：

- 点击 `Add hotspot` 按钮，即可添加 `热区(hotspot)`
  
- 点击 `Edit hotspots` 按钮，可鼠标拖动修改 热区 位置
  
- 热区(hotspot)默认会自动设置为切换至下一场景
  

<br>

**保存与修改**

当每个3D场景都添加过跳转热区后，点击顶部的 `Save tour.xml` 保存即可。

若以后想重新编辑，则打开软件后点击顶部的 `Load tour.xml` 即可重新编辑，编辑后记得保存。

<br>

**顶部其他工具**

- Convert Tool：包围盒与包围球转换
  
- Protect Tool：项目私有化配置
  
- Encrypt Tool：加密工具
  
- ...
  

可以自行研究摸索。

<br>

**VTour目录文件说明：**

- panos：各级全景图目录
  
- tour.html：全景图网页文件
  
- tour.xml：全景图各个场景下的配置内容
  

<br>

**tour.xml**

结构规范参考文档：https://krpano.com/docu/xml/#xmlstructure

- 修改底部工具栏标题前缀文字：`<krpano version="1.21" title="这里是标题文前缀文字">`
  
- 不使用地图：`<skin_settings maps="false" ... />`
  
- 每个场景：`<scene></scene>`
  
  - `<control>`：工具条
    
  - `<view>`：场景视角配置
    
  - `<preview>`：小图预览
    
  - `<image>`：场景图片资源配置项目
    
  - `<hotspot>`：热区，例如点击切换场景
    
- 图层：`<layer></layer>`
  
- 自定义脚本：`<action></action>`
  
- 自定义样式：`<style></style>`
  
- 插件：`<plugin></plugin>`
  
- ...
  

<br>

**热区(hotspot)**

热区是整个 krpano 最核心的配置项。

文档：https://krpano.com/docu/xml/#hotspot

样式和功能示例：https://krpano.com/examples/?hotspots

<br>

默认的 热区 仅仅是不同场景直接的切换功能，但是点击热区可以做很多事情。

例如：与 `layer`、`action` 等标签结合实现点击热区 弹出 图片、视频、网页 iframe 等。

<br>

**热区的位置属性：ath、atv**

ath 和 atv 是热区对应场景的 `球坐标` 坐标值。

- ath：水平方向视角度数，取值范围 -180(左后侧) ~ 180(右后侧)
  
  - 180：右后侧
    
  - 90：右侧
    
  - 0：正前方
    
  - -90：左侧
    
  - -180：左后侧
    
- atv：垂直方向视角读书，取值范围 -90(仰视) ~ 90(俯视)
  
  - 90：底部(脚下地面)
    
  - 0：平视
    
  - -90：顶部(头顶天花板)
    

> 注意：根据 ath 和 atv 的正负值，我个人推测 krpano 使用是 `左手坐标系`

------

<br>

**隐藏默认工具栏：**

有些场景需要我们自定义交互界面，在开发自定义交互按钮之前，首先要做的就是隐藏默认工具栏。

> 注意我们此处说的是 `仅仅隐藏工具栏`，并不是隐藏 krapno 自带的其他图层元素，例如 VR 模式下的指示箭头、退出 VR 模式按钮等。


<br>

**第1步：初始化时折叠工具栏**

> tour.xml

```
<action autorun="onstart">
    skin_hideskin('instant');
</action>
```

<br>

**第2步：网页元素渲染后，找到并清空工具栏元素内容**

> tour.html

```
<div id="pano" style="width:100%; height:100dvh;"></div>
<script src="tour.js"></script>
<script>
  embedpano({
    target: "pano",
    swf: false,
    xml: "tour.xml",
    passQueryParameters: "startscene,startlookat",
    onready: (krpano) => {
      setTimeout(() => {
        const childEleList = krpano.display.controllayer.childNodes[1]

        //可以输出一下查看都有哪些元素，并根据需求进行清除(隐藏)
        //console.log(childEleList.childNodes[i].kobject)

        for (let i = 0; i < childEleList.childNodes.length; i++) {
          if (childEleList.childNodes[i].kobject?.name === 'skin_layer') {
            childEleList.childNodes[i].innerHTML = ''
          }
        }
      }, 1000)
    },
    onerror: (err) => {
       console.error(err)
    },
  })
</script>
```

> 提醒：
> 
> - 为了避免 krapno 代码可能对 skin_layer 层的调用出错，这里采用的是 `innerHTML = ''` 方式，而不是 `.remove()`
>   
> - 不要采用 `.style.display='none'` 这种方式，因为当退出 VR 模式后 krapno 会自动重新配置 skin_layer 的 display 导致工具栏重新可见。
>   
> - 上述方式完全兼容 PC端和移动端。
>
