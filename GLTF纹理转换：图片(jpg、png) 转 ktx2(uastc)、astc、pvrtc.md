## GLTF纹理转换：图片(jpg、png) 转 ktx2(uastc)、astc、pvrtc

<br>

## **为什么要转纹理？**

假设一个 GLTF 模型使用了比较多的图片纹理，在 PC 浏览器中还勉强可以运行，但是在移动端往往就非常卡顿甚至是页面崩溃。

<br>

因为移动端通常来说分配给一个网页或 WebView 的内存、显存大小是有限制的，尤其是苹果手机。

通过将传统的 jpg/png 图片转成 GPU 压缩纹理，例如目前最主流的 .ktx2，会大幅降低在移动端运行所占的内存、显存。

一般来说 .ktx2 可以降低 70% 的显存占用，没错就是如此夸张。

<br>

**补充一下：图片文件大小 VS 图片占用显存大小**

对于 jpg 图片而言，它是有损压缩图片文件大小，该大小仅针对网络传输下载而言，只要图像分辨率不变那么所占的显存大小是一样的。

例如一张 1024x1024 的图片，无论压缩质量为多少，只要它的宽高不变，那么它所占用的显存永远是：1024 × 1024 × 3(RGB) = 3MB

<br>

## 如何检测当前是否支持ktx2？

<br>

**先说一个"伪结论"：只有 WebGL2 才支持 .ktx2 + uastc，而 WebGL 1 是不支持的！**

> WebGL 1 仅支持 .ktx 所支持的纹理，不支持 .ktx2 + uastc。

在实际项目中，如果你是 iPhone 12，那么由于不支持 WebGL2，所以就无法使用本文所讲解的 .ktx2 + uastc。

那么遇到这种情况就降级使用 .jpg/.png 这种吧。

> 为了可以在这种较旧的手机上运行，你可能需要把纹理图片尺寸变小一些，例如改为 512x512。

<br>

**伪结论？？？**

因为理论上 uastc 这种 通用纹理会在实际运行时被转码成当前目标平台所支持的纹理格式，也就是说理论上 uastc 纹理并没有限定仅运行在 WebGL2上。

> UASTC 中第一个字母 U 是单词 Universal(通用) 的简写。

理论知识可以查看下面这张图：

![UASTC](https://raw.githubusercontent.com/KhronosGroup/3D-Formats-Guidelines/refs/heads/main/figures/UASTC_targets.png)

从上面这张图可以看到，当实际使用 UASTC 时：

- 会先检测当前目标平台是否支持 ASTC，若支持则转码为 ASTC
- 如果不支持 ASTC 则检测是否支持 BC7，若支持则转码为 BC7
- 如果不支持BC7 则检测是否支持 HQ，若支持则编译为 AGBA8
- 如果不支持 HQ 则继续检测是否支持 ETC，若支持则....
- ...

也就是说理论上：UASTC 会逐步降级编译成各种目标平台所支持的纹理。

<br>

> 更多详细信息请查阅：
> 
> https://github.com/KhronosGroup/3D-Formats-Guidelines/blob/main/KTXDeveloperGuide.md#additional-transcode-targets-rgb-and-rgba

<br>

**但是，Threejs 中对于 .ktx2 + UASTC 的相关 KTX2Loader、WASM 转码包是有版本之分的。**

**并且 UASTC 也仅仅是一种纹理，UASTC 内部也存在多种格式的颜色规范和压缩级别。**

**经过实际项目试验，确确实实并不是所有的目标平台、UASTC 都可以正常运行的，因此我才得出一个 伪结论：仅 WebGL2 支持 .ktx2 + uastc。**

<br>

在 threejs 中可以通过下面代码判定当前渲染器是否为 WebGL2

```
console.log(myRenderer.capabilities.isWebGL2)
```

<br>

**特别强调：在 threejs 0.163.0 版本中已经移除了对 WebGL 1 的支持，仅支持 WebGL2 和 WebGPU。**

<br>

--------- 如果判定支持 WebGL2，那么才可以往下阅读 ---------

<br>

**ktx2纹理容器概念解释：**

ktx2 本身并不是指某一种具体的压缩纹理。它是一个压缩纹理容器，用来储存多种纹理的一种 “容器”(格式/规范)。

> ktx2 是 ktx 的第 2 个升级版本，本文不讲解 ktx，只讲解最新的 ktx2。

最新的 ktx2 容器储存的纹理有：UASTC、ASTC 等等。

> uastc 是 astc 的一个扩展分支，我们可以简单理解为：凡是支持 astc 即表明也支持 uastc。

<br>

**本文讲解的都是基于 .ktx2 + uastc 这种组合。**

<br>

**纹理扩展列表：**

对于 WebGL 来说，可以通过查看 WebGL 扩展列表 来检测当前都支持哪些扩展。

完整的扩展列表，请查看：

https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Using_Extensions

<br>

**ktx2(uastc)的转码特性：**

ktx2 的解码器在运行时会将 ktx2 中的纹理转码为当前平台所支持的纹理扩展格式。

> 这里说的平台 是指：硬件和浏览器

- 对于 PC 来说：通常被优先转码为 BC7 (EXT_texture_compression_bptc)，或降级为其他
- 对于 移动端来说：会被转码为 ASTC (WEBGL_compressed_texture_astc)

<br>

也就是说：

- 对于 PC 浏览器环境，我们只需要判定 WebGL 扩展列表中是否支持 `EXT_texture_compression_bptc`
- 对于 移动端浏览器，我们只需要判定 WebGL 扩展列表中是否支持 `WEBGL_compressed_texture_astc`

就可以知道当前浏览器环境是否支持 .ktx2(uastc) 了。

> 如果不支持，我们做好切换回 .jpg 这种纹理资源方式。

<br>

**原生JS中的检测方式：**

```
const canvas = document.createElement('canvas')
const gl = canvas.getContext('webgl2')
const supportUASTC = gl.getExtension('EXT_texture_compression_bptc') || gl.getExtension('WEBGL_compressed_texture_astc')
```

<br>

**Threejs 中的检测方式：**

```
const renderer = new WebGLRenderer({ ... })
const supportUASTC = renderer.extensions.has('EXT_texture_compression_bptc') || renderer.extensions.has('WEBGL_compressed_texture_astc')
```

<br>

或者是：

```
const renderer = new WebGLRenderer({ ... })

const ktx2Loader = new KTX2Loader()
ktx2Loader.detectSupport(renderer)
const supportUASTC = ktx2Loader.workerConfig.bptcSupported || ktx2Loader.workerConfig.astcSupported 
```

<br>

## KTX-Software：.ktx2 最佳转换工具

<br>

**KTX-Software：**

代码仓库：https://github.com/KhronosGroup/KTX-Software

下载安装：https://github.com/KhronosGroup/KTX-Software/releases/tag/v4.3.2

滚动到最底部，找到 `Assets`，在众多的平台版本中找到自己电脑系统的那个下载即可。

<br>

**Windows 提供了 2 个版本：**

- 针对 ARM 架构的安装程序：[KTX-Software-4.3.2-Windows-arm64.exe](https://github.com/KhronosGroup/KTX-Software/releases/download/v4.3.2/KTX-Software-4.3.2-Windows-arm64.exe)
  
- 针对 64 位的安装程序：[KTX-Software-4.3.2-Windows-x64.exe](https://github.com/KhronosGroup/KTX-Software/releases/download/v4.3.2/KTX-Software-4.3.2-Windows-x64.exe)
  
  > 一般来说选择 x64 的。
  

<br>

**安装 ktx 成功后，记得将安装目录的 `xxx\bin` 目录加入到系统环境变量中。**

<br>

**ktx 命令：**

| 命令  | 作用  | 对应旧版命令 |
| --- | --- | --- |
| ktx create | 从各种输入文件中创建 ktx2 文件 | toktx |
| ktx extract | 从 ktx2 文件导出选定的图像 |     |
| ktx encode | 将 ktx2 文件编码为 Basis Universal 格式 | ktxsc |
| ktx transcode | 转码 ktx2 文件 |     |
| ktx info | 查看 ktx2 文件信息 | ktxinfo |
| ktx validate | 验证 ktx2 文件 | ktx2check |
| ktx help | 显示有关 ktx 工具的帮助信息 |     |

<br>

对于纹理转换，主要用到的命令是 `ktx create` 相关的。

如果你想查看 create 相关的帮助信息，可以使用：`ktx create --help`

<br>

**将图片转 .ktx2 + uastc 的命令：**

```
ktx create --encode uastc --format R8G8B8_SRGB input.jpg output.ktx2
```

> 更多参数请执行 ktx create --help 来查看。
> 
> - 例如 是否生成 mipmap：--generate-mipmap

<br>

**若图片文件名包含空格怎么办？**

命令中的空格是用来分割参数的，假设图片文件名为 `贴图 2.jpg`，而文件名中的空格恰好会让转换命令异常，解决办法也很简单，就是在命令行中给文件名增加 `""`。

```
ktx create --encode uastc --format R8G8B8_SRGB "贴图 2.jpg" "贴图 2.ktx2"
```

<br>

**如果你的纹理对于清晰度要求不高，那么你可以不转 uastc，而是改为 basis-lz ，这样生成的 .ktx2 文件体积会大幅减小，但是纹理清晰度不如 uastc。**

```
ktx create --encode basis-lz --format R8G8B8_SRGB input.jpg output.ktx2
```

**由于我的项目对于纹理清晰度有要求，因此我选择 uastc，所以本文讲的都是 .ktx2 + uastc。**

<br>

> **将多张图片压缩到一个 .ktx2 中：**
> 
> 可以通过 `--layers` 参数来设定纹理的层级数量，例如将 6 张图片分别设置为 6 个图层当中：
> 
> ```
> ktx create --layers 6 --encode uastc --format R8G8B8_SRGB run1.png run2.png run3.png run4.png run5.png run6.png running_animation.ktx2
> ```
> 
> **使用场景：**
> 
> 假设有一个平面，需要每隔 1 秒切换一个纹理图片内容，那么就可以通过自定义着色器材质，每隔 1秒修改 uniform 中 layer 对应的变量值，切换使用该纹理中不同 layer 中的纹理。这样的好处是不会产生纹理切换传输数据。

> 在本文中不存在这种场景需求，因此不做过多讲解。

<br>

**补充：ktx 新版 4.3.2 与旧版的区别：**

- ktx create --encode 参数 --encode 的值仅支持 basis-lz 和 uastc
- 不再支持 astc

<br>

如果你真的需要 astc 纹理，那么可以使用下面要讲的工具：PVRTexToolCLI

<br>

## PVRTexToolCLI：astc、pvrtc 转换工具

<br>

**PVRTexToolCLI：**

官方网站：https://developer.imaginationtech.com/solutions/pvrtextool/

下载安装：https://developer.imaginationtech.com/solutions/pvrtextool/#download

<br>

**安装结果：**

安装成功后打开 PowerVR_Tools/PVRTexTool 目录：

- CLI：以命令方式运行 PVRTexToolCLI
- Documentation：打开文档
- GUI：以可视化窗口 GUI 的形式运行 PVRTexToolCLI
- ...

<br>

**转 astc 命令：**

```
PVRTexToolCLI -i input.jpg -o output.ktx2 -f ASTC_6x6,UBN,sRGB
```

虽然我们转的纹理格式为 astc，但是依然使用 .ktx2 作为文件后缀。

<br>

**转 pvrtc 命令：**

```
PVRTexToolCLI -i input.jpg -o output.pvr -f PVRTCI_4BPP_RGB -cs sRGB
```

<br>

除了 PVRTexToolCLI 还有一个常见的 astc 纹理转换工具：astcenc

这里就不具体讲解了。

<br>

## tacentview：查看预览各种纹理

<br>

如果是 .jpg 或 .png 我们可以直接图片浏览，但是如果是 .ktx2(uastc)、.pvrtc 这些纹理，那么就需要一些专业的软件才可以预览。

<br>

**推荐各种纹理查看预览软件：tacentview**

代码仓库：https://github.com/bluescan/tacentview

下载地址：https://github.com/bluescan/tacentview/releases/tag/v1.0.46

下载解压 tacentview_1.0.46.zip 解压即可得到 `tacentview.exe`

<br>

把 .ktx2 或者其他纹理文件拖动到 tacentview 窗口中即可看到该纹理。

<br>

经过上述步骤，我们已经具备了可以将 .jpg/.png 图片转换为 uastc 格式的能力了。

接下来就要开始对 gltf 文件进行操作了。

<br>

## glTF-Transform：解析修改保存GLTF文件

<br>

**GLTF文件的 2 种形式：**

- .glb：就 1 个文件，后缀为 .glb，包含了模型全部的信息，包括纹理
- .bin + .gltf + .jpg/.png：由多个文件组成，其中 .bin 为二进制压缩的顶点网格数据，.gltf 文件内容为 JSON，包含了模型的外部配置信息。

以上 2 种形式可以互相转化的。

<br>

**glTF-Transform：一个适用于 web 和 nodejs 的 gltf 解析转化包**

代码仓库：https://github.com/donmccurdy/glTF-Transform

一共 4 个相关的 NPM 包，你需要根据实际需求来决定分别安装哪些。

- @gltf-transform/core：核心包
- @gltf-transform/extensions：扩展特性相关
- @gltf-transform/functions：一些实用函数
- @gltf-transform/cli：一些命令脚本

<br>

**简单示例：读取.glb文件并另存为 .bin+.gltf 形式**

> 下面代码运行在 nodejs 中，且 package.json 中配置 `"type": "module"`

```
import { NodeIO } from "@gltf-transform/core"

const io = new NodeIO()

const document = await io.read('./glb/xx.glb')

console.log(document)

await io.write('./gltf/xx.gltf', document)
```

<br>

好了，万事俱备，接下来就进入真正的核心内容。

<br>

## GLTF纹理转换为.ktx2

<br>

先说一个前置知识点：我们需要借助 sharp 来修改纹理图片格式和尺寸。

关于 sharp 的用法，可查阅：[sharp学习笔记](https://github.com/puxiao/notes/blob/master/sharp%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)

<br>

接下来我们通过 nodejs 来创建 GLTF 纹理转换的脚本。

<br>

**定义一些有用的函数：**

**delDir(path)：删除某个文件夹**

```
import { existsSync, readdirSync, rmdirSync, statSync, unlinkSync } from "node:fs"
import path from "node:path"

const delDir = (path) => {
    let files = []
    if (existsSync(path)) {
        files = readdirSync(path)
        files.forEach((file, index) => {
            let curPath = path + "/" + file
            if (statSync(curPath).isDirectory()) {
                delDir(curPath)
            } else {
                unlinkSync(curPath)
            }
        })
        rmdirSync(path)
    }
}

export { delDir }
```

<br>

**reExt(str, newExt)：替换文件名中的后缀格式**

```
const reExt = (str, newExt) => {
    return str.replace(/\.[^.]+$/, `.${newExt}`)
}

export default reExt
```

<br>

**executeCommand(command)：调用执行某些命令**

```
import { exec } from "node:child_process"
import { promisify } from "node:util"

const execPromise = promisify(exec)

const executeCommand = async (command) => {

    try {
        const { stdout, stderr } = await execPromise(command)

        if (stderr) {
            console.error(stderr)
        }

        if (stdout) {
            console.log(stdout)
        }

        return true

    } catch (error) {
        console.log(error)
        return false
    }

}

export default executeCommand
```

<br>

**我们都需要改动 .gltf 中哪些内容：**

- gltf.textures 中每一项的 .name 属性值、以及 .extensions 属性值中增加 'KHR_texture_basisu': { ... }
- gltf.images 中每一项的 .uri 值、以及 .mimeType 属性值(可选)
- gltf.extensionsRequired 中增加 'KHR_texture_basisu'
- gltf.extensionsUsed 中增加 'KHR_texture_basisu'
- gltf.samplers 采样器的配置(可选)
- gltf.asset.generator 资源生成信息(可选)

<br>

**完整版代码：**

```
import { copyFileSync, mkdirSync, unlinkSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { delDir } from './dir.js'
import executeCommand from './executeCommand.js'
import reExt from './reExt.js'

const extList = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
const inputDir = path.join('./input')
const outputDir = path.join('./output')
const gltfName = 'body'
const outputGltf = path.join(outputDir, `${gltfName}.gltf`)

delDir(outputDir)
mkdirSync(outputDir, { recursive: true })
copyFileSync(path.join(inputDir, `${gltfName}.gltf`), outputGltf)
copyFileSync(path.join(inputDir, `${gltfName}.bin`), path.join(outputDir, `${gltfName}.bin`))

const gltfStr = await readFile(outputGltf, 'utf-8')
const gltf = JSON.parse(gltfStr)
console.log('解析原始 .gltf 成功')

if (gltf.images.some(item => extList.includes(path.extname(item.uri).toLocaleLowerCase()) === false)) {
    console.error(`发现包含异常纹理图像格式：${src}，请替换为别的格式后再试`)
}

for (let i = 0; i < gltf.images.length; i++) {
    const src = gltf.images[i].uri
    const picExt = path.extname(src)
    const picName = src.slice(0, -picExt.length)

    const inputPic = path.join(inputDir, src)
    const outputPic = path.join(outputDir, `${picName}.jpg`)
    const outputKtx2 = path.join(outputDir, `${picName}.ktx2`)

    const sharpPic = sharp(inputPic)

    const { width } = await sharpPic.metadata()

    if (width > 1024) {
        sharpPic.resize(1024)
    }

    sharpPic.jpeg({ mozjpeg: true })
    await sharpPic.toFile(outputPic)

    console.log(`开始处理 ${outputKtx2}`)

    const uastc = `ktx create --encode uastc --format R8G8B8_SRGB "${outputPic}" "${outputKtx2}"`
    await executeCommand(uastc)

    unlinkSync(outputPic)

}

gltf.textures.forEach(item => {
    if(item.name){
        item.name = reExt(item.name, 'ktx2')
    }
    item.extensions = {
        'KHR_texture_basisu': {
            source: item.source
        }
    }
})

gltf.images.forEach(item => {
    item.uri = reExt(item.uri, 'ktx2')
    if(item.mimeType){
        item.mimeType = 'image/ktx2'
    }
})

gltf.asset.generator = 'babylon.js glTF exporter and KTX-Software'

gltf.extensionsRequired = ['KHR_texture_basisu', 'KHR_draco_mesh_compression']
gltf.extensionsUsed = ['KHR_texture_basisu', 'KHR_draco_mesh_compression']

gltf.samplers = [
    {
        "magFilter": 9729,
        "minFilter": 9987,
        "wrapS": 10497,
        "wrapT": 10497
    }
]

console.log('准备向 .gltf 写入新数据')

await writeFile(outputGltf, JSON.stringify(gltf, null, 2))

console.log(`覆写 ${outputGltf} 成功，任务完成`)
```

> 请注意核心转换命令中，我们为了避免文件名变量中包含空格引发错误，所以增加了引号包裹：`"{outputPic}" "{outputKtx2}"`
