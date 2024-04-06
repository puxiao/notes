# Exiftool学习笔记



<br>

### Exiftool简介

Exiftool 是一个开源的，专门用来读取、修改文件元信息(Meta Information)的程序。

> 支持的文件包括各种图片、视频等常见甚至不常见文件格式。

官网：https://exiftool.org/

仓库：https://github.com/exiftool/exiftool



<br>

### 下载

访问 exiftool 官网：https://exiftool.org/

在网页顶部存在 3 个下载链接：

* Download Version xx.xx：这个压缩包解压之后是 exiftool 的一些文档
* Windows Executable: exiftool-xx.xx.zpi：这个是适用于 windows 系统可执行的 .exe 文件
* MacOS Package: ExifTool-xx.xx.dmg：这个是适用于 MacOS 系统的文件

我个人使用 Windows 系统，所以我应该点击上面第 2 个链接，下载解压，**得到文件 `exiftool(-k).exe`，为了方便我重命名为 `exiftool.exe`。**

> 为什么默认下载的文件名中会有一个 `-k` ，以及它代表的含义，会在文本讲解 `命令` 时说明。



<br>

### 运行

**调用 exiftool.exe：**

1. 第一种：将 exiftool.exe 放到某个目录，然后在系统环境变量 path 中加入该目录地址，这样在任何目录的命令窗口中使用 `exiftool` 就可以调用 exiftool.exe 了。
2. 第二种：不加入系统环境变量，而是仅仅在存放 exiftool.exe 的目录下执行，此时命令为 `./exiftool.exe`



<br>

**重复一遍：**

如果选择第一种，那么下面命令套路都是：`exiftool xxx`

如果选择第二种，那么命令套路都是：`./exiftool.exe xxxx`



<br>

(为了方便，下面命令中使用第一种)



<br>

### 基础命令

> 以下操作是在  Windows 的 PoserShell 中进行的。



<br>

**查看exiftool自身信息：**

```
exiftool
```

默认会看到下面一些信息：

```
NAME
    exiftool - Read and write meta information in files

RUNNING IN WINDOWS
    Drag and drop files or folders onto the exiftool executable to display
    meta information, or rename to "exiftool.exe" and run from the command
    line to access all exiftool features.

    This stand-alone Windows version allows simple command-line options to
    be added to the name of the executable (in brackets and separated by
    spaces at the end of the name), providing a mechanism to use options
    when launched via the mouse. For example, changing the executable name
    to "exiftool(-a -u -g1 -w txt).exe" gives a drag-and-drop utility which
    generates sidecar ".txt" files with detailed meta information. As
    shipped, the -k option is added to cause exiftool to pause before
    terminating (keeping the command window open). Options may also be added
    to the "Target" property of a Windows shortcut to the executable.

SYNOPSIS
  Reading
    exiftool [*OPTIONS*] [-*TAG*...] [--*TAG*...] *FILE*...

-- MORE --
```

上面信息中 `RUNNING IN WINDOWS` 提到了几个关键信息，我们先看第 2 段文字：

* This stand-alone Windows version allows simple command-line options to be added to the name of the executable (in brackets and separated by spaces at the end of the name)

  **在 Windows 版本中允许通过修改执行程序的文件名来默认做一些配置**。

* For example, changing the executable name to "exiftool(-a -u -g1 -w txt).exe" gives a drag-and-drop utility which generates sidecar ".txt" files with detailed meta information.

  例如将执行程序改名为：exiftool(-a -u -g1 -w txt).exe，就表示...什么什么操作

* the -k option is added to cause exiftool to pause before terminating (keeping the command window open).

  如果将执行程序名字中增加 -k 则表示当执行完命令后并不会自动关闭命令窗口(保持命令窗口打开状态)。

  <br>

  **这也是为什么默认我们下载解压后的文件名为 `exiftool(-k).exe` 的原因了。**



<br>

我们再去看第 1 段文字就非常好理解了：

* Drag and drop files or folders onto the exiftool executable to display meta information.

  (此时假定我们的执行文件名还是默认的 `exiftool(-k).exe`)

  拖动文件(例如图片)到 `exiftool(-k).exe` 程序上，松开之后将显示该文件的元信息。

* or rename to "exiftool.exe" and run from the command line to access all exiftool features.

  或者将执行文件重命名为 `exiftool.exe` ，此时将可以运行 exiftool 的全部命令功能。



<br>

后面的 `-- MORE --` 表示如果继续按回车，会显示更多提示信息。

多按几次回车，就会看到常见命令套路介绍：

```
SYNOPSIS
  Reading
    exiftool [*OPTIONS*] [-*TAG*...] [--*TAG*...] *FILE*...

  Writing
    exiftool [*OPTIONS*] -*TAG*[+-<]=[*VALUE*]... *FILE*...

  Copying
    exiftool [*OPTIONS*] -tagsFromFile *SRCFILE* [-[*DSTTAG*<]*SRCTAG*...]
    *FILE*...

  Other
    exiftool [ -ver | -list[w|f|r|wf|g[*NUM*]|d|x|geo] ]
```



<br>

好了，接下来才真正开始学习 exiftool 常用命令。

(我们是以 exiftool.exe 名称来执行的)



<br>

**exiftool 命令模板为：exiftool [可选参数] file**

下面所有的命令都是基于上面这个模板展开的。



<br>

特别说明：

* 下面的例子都是以 查看或修改某个图片文件 作为示例的。
* 但是 exiftool 支持修改的文件不限于图片，还包括 视频，以及其他各类常见文件格式。



<br>

### 查看元信息

**查看文件元信息：**

```
exiftool ./imgs/风景照.jpg
```

输出信息可能如下：

```
ExifTool Version Number         : 12.81
File Name                       : 风景照.jpg
Directory                       : ./res
Warning                         : FileName encoding not specified
File Size                       : 6.2 MB
File Modification Date/Time     : 2024:04:06 02:32:49+08:00
File Access Date/Time           : 2024:04:06 11:07:26+08:00
File Creation Date/Time         : 2024:03:30 23:18:08+08:00
File Permissions                : -rw-rw-rw-
File Type                       : JPEG
File Type Extension             : jpg
MIME Type                       : image/jpeg
JFIF Version                    : 1.01
Resolution Unit                 : None
X Resolution                    : 72
Y Resolution                    : 72
Exif Byte Order                 : Big-endian (Motorola, MM)
Orientation                     : Horizontal (normal)
Exif Version                    : 0232
Date/Time Original              : 2024:03:29 14:14:51
Components Configuration        : Y, Cb, Cr, -
Flashpix Version                : 0100
Color Space                     : Uncalibrated
GPS Version ID                  : 2.3.0.0
GPS Latitude Ref                : North
GPS Longitude Ref               : East
Compression                     : JPEG (old-style)
Thumbnail Offset                : 334
Thumbnail Length                : 6642
XMP Toolkit                     : XMP Core 6.0.0
Image Width                     : 3024
Image Height                    : 4032
Encoding Process                : Baseline DCT, Huffman coding
Bits Per Sample                 : 8
Color Components                : 3
Y Cb Cr Sub Sampling            : YCbCr4:4:4 (1 1)
Image Size                      : 3024x4032
Megapixels                      : 12.2
Thumbnail Image                 : (Binary data 6642 bytes, use -b option to extract)
GPS Latitude                    : 29 deg 49' 41.40" N
GPS Longitude                   : 121 deg 33' 43.45" E
GPS Position                    : 29 deg 49' 41.40" N, 121 deg 33' 43.45" E
```

左侧为元信息的属性名，右侧为属性值。

这也引申出来我们后续的各种参数：**在命令中添加 某个元信息属性 参数可用来查看或修改该属性名的值。**

**exiftool 中元信息中的某个属性就是采用 `-` 加大写字母的形式。**

> 比较形象，个人把这个称为 "参数名模板套路"。



<br>

**查看照片拍摄日期：**

这个拍摄日期对应上面元信息中的 `Date/Time Original`，按照参数名套路，那么就是 DateTimeOriginal。

所以仅查看照片拍摄日期的命令是：

```
exiftool -DateTimeOriginal ./imgs/风景照.jpg
```



<br>

**参数明错误的警告信息：**

如果你不小心手抖，命令参数中把名称打错了，例如 Date 不小心写成了 Data，也就是上述命令你写成了：

`exiftool -DataTimeOriginal ./imgs/风景照.jpg`

那么你会收到这样一个警告信息：

```
Warning: FileName encoding not specified - ./imgs/风景照.jpg
```

> 警告：遇到了 文件名(在此处实际是 属性名) 不支持。



<br>

**查看照片位置信息：**

这里的套路和前面的一样，照片位置信息是 GPS Position，对应命令为：

```
exiftool -GPSPosition ./imgs/风景照.jpg
```

> 输出信息：
>
> GPS Position                    : 29 deg 49' 41.40" N, 121 deg 33' 43.45" E

> GPS 信息中的 N 是指 北半球(North)，E 是指 东半球(East)。
>
> 也就是表达含义为：北纬 29 度 49 分 41.40 秒，东经 121 度 33 分 43.45 秒



<br>

当然也可以单独查看经纬度：

```
exiftool -GPSLatitude ./imgs/风景照.jpg
```

```
exiftool -GPSLongitude ./imgs/风景照.jpg
```



<br>

此外还有另外 2 个和 GPS 有关的属性字段：GPS Latitude Ref 、GPS Longitude Ref ，用来表明出于哪个半球。



<br>

**多参数查询：**

说白了就是命令中包含多个参数，例如：查看照片拍摄时间和GPS信息

```
exiftool -DateTimeOriginal -GPSPosition ./imgs/风景照.jpg
```



<br>

**注意：有些元信息属性名 和 参数明略微不同。**

> 没有采用前面的 "参数明套路"。



<br>

**例如 查询修改时间：**

修改时间对应的属性名是：File Modification Date/Time，但它的命令参数可不是 FileModificationDateTime，而是简化后的 FileModifyDate。

```
exiftool -FileModifyDate ./imgs/风景照.jpg
```

> 输出修改时间：2024:04:06 02:32:49+08:00



<br>

关于时间的补充说明：

`2024:04:06 02:32:49+08:00` 这个时间的含义为：

* `2024:04:06 02:32:49`：具体的时间
* `+08:00`：表明时区，也就是 东八区，时间相对标准时间增加 8 小时。



<br>

元信息属性名和对应的参数明，以及更加详尽的变通简写用法，可查看 exiftool 对应的文档说明。



<br>

通过上面讲解，已经对如何查询某个元信息有了掌握。那么接下来就说如何修改元信息。



<br>

### 修改元信息

**修改某个元信息的命令套路是：`exiftool -Xxx="xxxx" file`**

**或者双引号连参数明也包裹住**：`exiftool "-Xxx=xxxx" file`



<br>

**修改文件名：**

```
exiftool -FileName="新风景照.jpg" ./imgs/风景照.jpg
```

> 特别说明：FileName 的值不光可以修改文件名，还可以表明 "复制新建文件"，具体用法在本文后面专门讲解。



<br>

**修改照片拍摄时间：**

```
exiftool -DateTimeOriginal="2024:04:06: 13:21:06`" ./imgs/风景照.jpg
```



<br>

**修改照片GPS信息：**

前提是我们需要知道修改后的经纬度。

> 根据地名获取经纬度，推荐高德地图，不推荐百度地图。

对应命令：

```
exiftool -GPSLatitude="29.828168" -GPSLatitudeRef="29.828168" -GPSLongitude="121.56207" -GPSLongitudeRef="121.56207" ./imgs/风景照.jpg
```

> 上面命令中 -GPSLatitude 和 -GPSLongitude 很好理解，但是 -GPSLatitudeRef 和 -GPSLongitudeRef 为什么要那样设置？
>
> 这是一种简单方便的方式，在 exiftool 内部会把我们写的 经纬度值转化成 北半球 或 东半球。



<br>

至于其他的元信息修改，套路都差不多，遇到不懂的网上搜索一下就大概知道了。



<br>

### 使用FileName移动、复制文件

**移动文件：**

前面我们讲了修改图片文件名的命令：

```
exiftool -FileName="新风景照.jpg" ./imgs/风景照.jpg
```

如果 FileName 的值中增加了其他路径，例如改为下面的：

```
exiftool -FileName="./newDir/新风景照.jpg" ./imgs/风景照.jpg
```

那么执行的结果是将 `./imgs/风景照.jpg` 文件移动并重命名一份到 `./newDir/` 目录中。



<br>

我们最终得到的文件：`./newDir/新风景照.jpg`，而之前的 `./imgs/风景照.jpg` 则消失了。

> 如果 newDir 目录不存在，则自动创建该目录。



<br>

**复制并修改：**

如果我们在命令中增加其他元信息修改，那么此时就不再是移动文件，而是复制并修改文件。

```
exiftool -DateTimeOriginal="2024:04:06 13:56:02" -FileName="./newDir/新风景照.jpg" ./imgs/风景照.jpg
```

(我们这里有一个前提：假定 `./newDir/新风景照.jpg` 本身不存在)

执行的结果：

* 复制一份 ./imgs/风景照.jpg 到 ./newDir/新风景照.jpg，并且修改 新风景照.jpg 的拍照时间。
* 而 ./newDir/新风景照.jpg 不会发生任何改变。



<br>

**覆盖源文件：**

我们需要移动修改且删除之前的文件，则增加参数 `-overwrite_original` 来表明覆盖(删除)之前的文件。

```
exiftool -DateTimeOriginal="2024:04:06 13:56:02" -overwrite_original -FileName="./newDir/新风景照.jpg" ./imgs/风景照.jpg
```



<br>

此外还有其他几个参数：

> -restore_original：恢复备份
>
> -delete_original：删除备份



<br>

关于最最基础的一些命令就讲解到此。

具体遇到问题了，去查看官网或网上搜索吧。



<br>

### 特别提醒：

我也是刚接触使用 exiftool，很多命令也不熟悉，甚至可能上面命令还有讲错的地方，请谅解并指正。