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

**直接通过.exe方式启动 LabelMe：**

在完成上面第 3 步 labelme 的安装后，我们也可以不通过第 4 步 命令方式启动 labelme，而是直接去通过 labelme.exe 去启动。

使用 anaconda 安装的程序或脚本都存放在 `./Scripts/` 下，我们只需在这个目录下找到 `labelme.exe` 双击运行即可。

例如我本机对应的目录：

```
D:\ProgramData\anaconda3\Scripts\labelme.exe
```



<br>

**特别补充说明：**

除了 labelme.exe 之外，在 `./Scripts/` 目录里我们还能看到其他几个相关 .exe 程序：

* labelme_draw_json.exe
* labelme_draw_label_png.exe
* labelme_json_to_dataset.exe
* labelme_on_docker.exe
* labelme-studio.exe
* ...

这几个程序都对应 labelme 一些相关的命令，每一个都有自己的一些特殊用途。

对于我们而言，前 3 个是比较重要的，它们具有 "数据转换" 功能，稍后在本文的 "labelme基础用法"中简单讲解一下。

至于后面其他的 .exe，看到它们的一些名称，也几乎能猜出来它们的作用。



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

**预览保存结果的比对：**

> 对应的是 ./Scripts/labelme_draw_json.exe 程序

假设我们已经保存并得到了 `xxx.json`，那么在 `Anaconda Prompt` 命令窗口中执行：

```
labelme_draw_json xxx.json
```

执行上述命令后大约 1 ~ 2 秒，就会弹出一个窗口，里面会左右显示 2 张图片：

* 左侧图片：被标注的原始图片
* 右侧图片：灰色的原始图片作为底图 + 添加的标注结果对应的色块



<br>

**将.json结果转化为数据集：**

> 对应的是 ./Scripts/labelme_json_to_dataset.exe 程序

我们前面保存得到的 xxx.json 仅仅是我们使用 labelme 软件标注的结果，并不是供 AI 训练的数据集。数据集的英文单词为：dataset

xxx.json 文件转数据集(dataset) 的步骤为，在 `Anaconda Prompt` 命令窗口中执行：

```
labelme_json_to_dataset xxx.json
```

上述命令执行成功后，会在 xxx.json 相同目录下生成一个同名文件夹，里面包含：

* img.png：被标注的原始图片
* label.png：标注的填充色块，未被标注的部分为纯黑色背景
* label_name.txt：一些信息
* label_viz.png：被标注图片与标注填充色块的叠加图



<br>

如果你想将转的数据集存放到指定目录，假定该目录为 `./your-dir/`，则添加参数即可：

```
labelme_json_to_dataset xxx.json --out ./your-dir
```



<br>

请注意：上述命令仅为执行单条 .json 文件转数据集，官方并未提供批量转换的命令。

那如果我想批量转该怎么办？



<br>

先插入一个话题：

**为什么需要在 Anaconda Prompt 命令窗口中执行 labelme 各种命令？**

因为我们是通过 anaconda 安装的 labelme 程序，所以 labelme 启动的环境路径变量只有 anaconda 知道，这就是为什么在别的命令窗口中执行 `labelme` 或 `labelme_json_to_dataset` 会提示找不到对应程序的原因。

而解决这个问题很简单：我们只要把 labelme.exe 或 labelme_json_to.dataset.exe 路径添加到系统环境变量中即可。

**当然为了更省事，我们可以直接将 anaconda 安装目录中的 `Scripts` 目录添加到系统环境变量 Path 中。**

这样，我们就可以在普通的命令窗口中去执行  `labelme` 或 `labelme_json_to_dataset` 等命令了。



<br>

再回到批量转化数据的这个事情上。



**批量转换数据集：**

如果你想批量转，则需要手工写一个 bat 脚本，扫描当前目录下的所有 .json 文件然后逐一执行 `labelme_json_to_dataset xxxxx.json` 即可。

```
for %%i in (*.json) do (
labelme_json_to_dataset "%%i"
)
pause
```



<br>

也可以使用 node.js 实现，并且加入很多逻辑细节：

```
const { readdir } = require('node:fs')
const { basename, join, isAbsolute } = require('node:path')
const { exec } = require('node:child_process')
const { argv } = require('node:process')

let index = 0
let jsonList = []
let failList = []

const dicPath = isAbsolute(String(argv[2])) ? argv[2] : join(__dirname, argv[2] || '.')
const savePath = isAbsolute(String(argv[3])) ? argv[3] : (argv[3] ? join(__dirname, argv[3]) : dicPath)

const toDataset = () => {
    if (index < jsonList.length) {
        const file = jsonList[index]
        const infoStr = `${index + 1}/${jsonList.length}`
        console.log(`${infoStr}: ${file} 开始处理`)
        const outValue = join(savePath, basename(file).split('.').join('_'))
        exec(`labelme_json_to_dataset ${file} --out ${outValue}`, (err, stdout, stderr) => {
            if (err) {
                failList.push(file)
                console.log(`${infoStr}: ${file} 处理失败`)
            } else {
                console.log(`${infoStr}: ${file} 处理完成`)
            }
            index++
            toDataset()
        })
    } else {
        const failLength = failList.length
        const successLength = jsonList.length - failLength
        console.log(`全部处理完毕: ${successLength} 个完成、${failLength} 个失败`)
    }
}

const startAnalysis = () => {

    readdir(savePath, (err, files) => {
        if (err) {
            console.log(`保存目录不存在，无法继续: ${savePath}`)
            return
        } else {
            if (files.length) {
                console.log(`保存目录当前已存在 ${files.length} 个文件，接下来的操作中若出现相同名称则会覆盖已有的文件！`)
            }
            readdir(dicPath, (err, files) => {
                if (err) {
                    console.log(`扫描目录失败: ${dicPath}`)
                    console.log(err)
                    return
                }
                index = 0
                failList = []
                jsonList = files.filter(file => file.endsWith('.json')).map(item => join(dicPath, item))
                console.log(`扫描到当前目录下一共有 ${jsonList.length} 个JSON文件`)

                toDataset()

            })
        }
    })

}

startAnalysis()
```

假定我们的代码文件为 dataset.js、包含 .json 文件的目录为 myjson，那么：

* 可以把 dataset.js 放到包含 .json 文件的目录中，然后执行

  ```
  node dataset.js
  ```

* 也可以把 dataset.js 文件放到其他目录，把要包含 .json 文件的目录路径作为命令参数传入

  ```
  node dataset.js ./xx/myjson
  ```

* 如果想至指定数据集的输出目录，可以继续添加命令参数

  ```
  node dataset.js ./xx/myjson ./yy/mydataset
  ```

  > 上面命令中的目录路径，可以写相对路径，也可以写本机的绝对路径



<br>

**另外一个命令：labelme_draw_label_png  xxx.jpg**

这个命令我暂时也不清楚具体是做什么用途的，以后用到了再说。



<br>

### 保存结果.json文件字段说明

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

* "imageData"：以 base64 形式保存的图片数据，可以设置为 null 或不存在该字段

* "imageWidth"：对应图片的宽度

  > 请注意：假设 imageData 为 null，imageWidth 设置多少都不影响最终显示结果，因为 LabelMe 会根据 imagePath 去读取并添加标注对象

* "imageHeight"：对应图片的高度



<br>

**坦白来说，作为图片标注工具，LabelMe 并不算强大，毕竟它所包含的标注工具种类比较少。**

只不过由于 LabelMe 是开源免费的，在不处理复杂标注时是不错选择。
