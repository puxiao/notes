# LabelMe安装与使用

<br>



### LabelMe简介：

官方仓库：https://github.com/wkentaro/labelme

LabelMe 是一个基于 Python 的开源图像标注工具。

> 客户端工具，非浏览器网页。

目前支持的标注工具类型有：多边形、矩形、圆、直线、点



<br>

### windows安装LabelMe：

> 不需要你本机安装 python，直接安装 anaconda 即可。



<br>

**第1步：安装 Anaconda**

> Anaconda 是一个开源的 Python 发行版本，包含了 conda、Python 等多个科学计算相关的包和依赖项。
>
> 同时 Anaconda 也是 python 的版本管理器，可以在本电脑上安装使用多个不同版本的 python。

安装软件下载地址：https://www.anaconda.com/products/distribution

> 仅支持 windows 64位 系统，目前最新版为：
> https://repo.anaconda.com/archive/Anaconda3-2023.03-Windows-x86_64.exe



<br>

软件安装过程就和普通软件类似，下一步，下一步...



<br>

**第2步：打开 Anaconda Prompt 命令窗口**

你可以通过 windows 的 开始 > 程序 > Anaconda3(64-bit) > Anaconda Prompt

> 请注意：因为 `conda` 命令只能在 `anaconda prompt` 命令窗口中执行，所以你需要先找到并打开它，才能进行下面的第 3 步。



<br>

**第3步：创建和安装 LabelMe**

在 `Anaconda Prompt` 命令窗口中，依次输入执行下面命令：

```
conda create --name=labelme python=3
```

> 上面命令中你可以填写具体的 python 版本号，例如：python=3.10.9

```
source activate labelme
pip install labelme
```



<br>

> 若一切顺利，则已安置 LabelMe 成功。



<br>

**第4步：启动 LabelMe**

以后，每次想启动 LabelMe，只需在 `Anaconda Prompt` 命令窗口中输入执行：

```
labelme
```

> 会弹出 LabelMe 的运行界面，至此启动成功



<br>

### 启动LabelMe时的配置参数：

在 `Anaconda Prompt` 命令窗口中输入 `labelme` 即可启动 LabelMe 客户端，这相当于不带任何配置项的启动。

```
labelme --help
```

可以看到 labelme 所支持的各种命令参数：

```
usage: labelme [-h] [--version] [--reset-config] [--logger-level {debug,info,warning,fatal,error}] [--output OUTPUT]
               [--config CONFIG] [--nodata] [--autosave] [--nosortlabels] [--flags FLAGS] [--labelflags LABEL_FLAGS]
               [--labels LABELS] [--validatelabel {exact}] [--keep-prev] [--epsilon EPSILON]
               [filename]
```



<br>

其中比较重要的 2 个参数是：

* `--flags FLAGS`：用于配置分类列表

* `--labelflags LABEL_FLAGS`：用于配置分类的属性列表

  ```
  labelme --labelflags xxx
  ```

  > xxx 即可以是字符串形式的 JSON 字面值，也可以是一个包含 JSON 的 xxx.json 文件路径



<br>

### LabelMe的基础用法

**打开某个目录：**

在左侧面板中，点击 `Open Dir` 可以浏览到本地某个目录，点击确定后会自动扫描该目录(含子目录)下的所有图片。

将扫描到的图片自动为一个可迭代的列表中。



<br>

**添加绘制标注对象：**

在左侧面板  或 通过鼠标右键，选择标注绘制工具，例如 `Create Polygons` 等工具，可以进行标注绘制。



<br>

**保存标注结果：**

当标注完成后，可以点击菜单中的 `Save` 将标注结果进行保存。

会根据当前标注的图片名称，自动生成一个 `xxx.json` 的文件，这里面就是标注结果。



<br>

**不同工具的保存结果规范：**

LabelMe 的保存 JSON 规范中， "shapes": [] 用于保存所有的标注对象列表。

不同标注类型的结果差异，除了 "shape_type": xx 外，最主要体现在 "points":[] 的值不同。

**points:[] 中值的含义：**

* rectangle：左上角点坐标、右下角点坐标

* circle：圆心坐标、圆圈上的落笔点

  > 换句话说 圆是有方向的

* point：点的坐标

* line：2点构成的直线，起始点、终点

* linestrip：N点构成的折线

* polygon：2+N点构成的封闭多边形



<br>

**其他属性字段说明：**

* "version"：当前版本

* "flags"：你可以理解为 “全局标签”

* "imagePath"：当前 .json 文件对应的图片路径

* "imageData"：以 base64 形式保存的图片数据，可以设置为 null

* "imageWidth"：对应图片的宽度

  > 请注意：假设 imageData 为 null，imageWidth 设置多少都不影响最终显示结果，因为 LabelMe 会根据 imagePath 去读取并添加标注对象

* "imageHeight"：对应图片的高度



<br>

**坦白来说，作为图片标注工具，LabelMe 并不算强大，毕竟它所包含的标注工具种类比较少。**

只不过由于 LabelMe 是开源免费的，在不处理复杂标注时是不错选择。

