# OpenSceneGraph查看.ive文件或转格式



<br>

最近工作中遇到了 .ive 这种3D文件格式，查了一些资料，记录一下。



<br>

**.ive简介：**

我们常见的 3D 模型文件有 .gltf、.obj 等，而 .ive 也是一种 3D 模型文件。

* .ive 是英文 Instant Virtual Environment(即时虚拟环境) 的简写
* .ive 通常与 OpenSceneGraph (OSG) 3D 图形引擎有关
* .ive 还有另外一种后缀形式：.osg



<br>

**创建 .ive 文件：**

建模软件 3DMax 默认并不支持将模型导出为 .ive，必须安装对应插件才可以。

https://sourceforge.net/projects/osgmaxexp/



<br>

**OpenSceneGraph简介：**

OpenSceneGraph 是由 C++ 和 OpenGL 编写的一个开源 3D 引擎和工具包。

开源仓库：https://github.com/openscenegraph/OpenSceneGraph

最新官网：https://openscenegraph.github.io/openscenegraph.io/



<br>

**OpenSceneGraph下载介绍页：**

下载介绍页面：

https://openscenegraph.github.io/OpenSceneGraphDotComBackup/OpenSceneGraph/www.openscenegraph.com/index.php/download-section/stable-releases.html

> 目前最新版为 3.6.5



<br>

**windows已编译程序下载：**

对于 windows 系统来说，可以直接下载已编译好的文件：

在 https://objexx.com/OpenSceneGraph.html 页面中找到下载地址：[OpenSceneGraph 3.6.5 -- Visual C++ 2022 -- 64-bit -- Release](https://objexx.com/OpenSceneGraph/OpenSceneGraph-3.6.5-VC2022-64-Release-2023-01.7z)



<br>

下载解压后，将 .bin 目录添加到系统环境变量 path 中，这样方便任何位置调用 OSG 相关程序。

我们可以看到 bin 目录下有几个 `osg`开头的 .exe 文件。

* osgversion.exe
* osgviewer.exe
* osgconv.exe
* osgarchive.exe
* osgfilecache.exe
* present3D.exe



<br>

**osgversion.exe：查看当前osg工具包版本**

```
osgversion
```

> OpenSceneGraph Library 3.6.5



<br>

**osgviewer.exe：查看.ive文件**

在命令窗口中执行：

```
osgviewer ./path/to/xx.ive
```

就会在本机全屏打开 xx.ive 对应的 3D 模型文件。

按 `Esc` 可退出当前程序。



<br>

**osgconv.exe：转格式**

假设我们现在想把 xx.ive 文件转换成别的格式，例如 .obj 格式，那么在命令窗口中执行：

```
osgconv ./path/to/xx.ive ./path/to/xx.obj
```

当执行完毕，就会看到生成了 xx.obj 和 xx.mtl 文件。



<br>

**其他：**

* osgarchive.exe：用来创建和管理 OSG 档案文件

* osgfilecache.exe：管理 OSG 缓存相关

* present3D.exe：幻灯片演示工具，除了具备像 osgviewer 查看浏览 .ive 文件外，还提供了一些额外的演示和交互

  > 简单来说可以理解为 "3D模型版的 PPT 演示"
