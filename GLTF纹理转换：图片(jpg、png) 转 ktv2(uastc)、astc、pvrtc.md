## GLTF纹理转换：图片(jpg、png) 转 ktv2(uastc)、astc、pvrtc



<br>

## **为什么要转纹理？**

假设一个 GLTF 模型使用了比较多的图片纹理，在 PC 浏览器中还勉强可以运行，但是在移动端往往就非常卡顿甚至是页面崩溃。



<br>

因为移动端通常来说分配给一个网页或 WebView 的内存、显存大小是有限制的，尤其是苹果手机。

通过将传统的 jpg/png 图片转成 GPU 压缩纹理，例如目前最主流的 .ktv2，会大幅降低在移动端运行所占的内存、显存。

一般来说 .ktv2 可以降低 70% 的显存占用，没错就是如此夸张。



<br>

**补充一下：图片文件大小 VS 图片占用显存大小**

对于  jpg 图片而言，它是有损压缩图片文件大小，该大小仅针对网络传输下载而言，只要图像分辨率不变那么所占的显存大小是一样的。

例如一张 1024x1024 的图片，无论压缩质量为多少，只要它的宽高不变，那么它所占用的显存永远是：1024 × 1024 × 3(RGB) = 3MB



<br>

## KTX-Software：.ktx2 最佳转换工具



<br>

**KTX-Software：**

代码仓库：https://github.com/KhronosGroup/KTX-Software

下载安装：https://github.com/KhronosGroup/KTX-Software/releases/tag/v4.3.2

滚动到最底部，找到 `Assets`，在众多的平台版本中找到自己电脑系统的那个下载即可。



<br>

**Windows 提供了 2 个版本：**

* 针对 ARM 架构的安装程序：[KTX-Software-4.3.2-Windows-arm64.exe](https://github.com/KhronosGroup/KTX-Software/releases/download/v4.3.2/KTX-Software-4.3.2-Windows-arm64.exe)

* 针对 64 位的安装程序：[KTX-Software-4.3.2-Windows-x64.exe](https://github.com/KhronosGroup/KTX-Software/releases/download/v4.3.2/KTX-Software-4.3.2-Windows-x64.exe)

  > 一般来说选择 x64 的。



<br>

**安装 ktx 成功后，记得将安装目录的 `xxx\bin` 目录加入到系统环境变量中。**



<br>

**ktx 命令：**

| 命令          | 作用                                    | 对应旧版命令 |
| ------------- | --------------------------------------- | ------------ |
| ktx create    | 从各种输入文件中创建 ktx2 文件          | toktx        |
| ktx extract   | 从 ktx2 文件导出选定的图像              |              |
| ktx encode    | 将 ktx2 文件编码为 Basis Universal 格式 | ktxsc        |
| ktx transcode | 转码 ktx2 文件                          |              |
| ktx info      | 查看 ktx2 文件信息                      | ktxinfo      |
| ktv validate  | 验证 ktx2 文件                          | ktx2check    |
| ktx help      | 显示有关 ktx 工具的帮助信息             |              |



<br>

对于纹理转换，主要用到的命令是 `ktx create` 相关的。

如果你想查看 create 相关的帮助信息，可以使用：`ktv create --help`



<br>

**将图片转 .ktx2 的命令：**

```
ktx create --encode uastc --format R8G8B8_SRGB input.jpg output.ktx2
```

> 更多参数请执行 ktx create --help 来查看。
>
> * 例如 是否生成 mipmap：--generate-mipmap



<br>

**请注意：**

如果没有使用压缩参数，那么转化  .ktx2 时不会进行压缩，这样的结果是 .ktx2 文件会比 .jpg 稍微大一点。

因为 .ktx2 中包含了很多其他优化代码，所以文件体积稍微大一点也没有关系，不影响降低显存的占用。



<br>

**ktx 新版 4.3.2 与旧版的区别：**

* ktx create --encode 参数 --encode 的值仅支持 basis-lz 和 uastc
* 不再支持 astc



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

* CLI：以命令方式运行 PVRTexToolCLI
* Documentation：打开文档
* GUI：以可视化窗口 GUI 的形式运行 PVRTexToolCLI
* ...



<br>

**转 astc 命令：**

```
PVRTexToolCLI -i input.jpg -o output.ktx2 -f ASTC_6x6,UBN,sRGB
```

虽然我们转的纹理格式为 astc，但是依然使用 .ktx2  作为文件后缀。



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

* .glb：就 1 个文件，后缀为 .glb，包含了模型全部的信息，包括纹理
* .bin + .gltf + .jpg/.png：由多个文件组成，其中 .bin 为二进制压缩的顶点网格数据，.gltf 文件内容为 JSON，包含了模型的外部配置信息。

以上 2 种形式可以互相转化的。



<br>

**glTF-Transform：一个适用于 web 和 nodejs 的 gltf 解析转化包**

代码仓库：https://github.com/donmccurdy/glTF-Transform

一共 4 个相关的 NPM 包，你需要根据实际需求来决定分别安装哪些。

* @gltf-transform/core：核心包
* @gltf-transform/extensions：扩展特性相关
* @gltf-transform/functions：一些实用函数
* @gltf-transform/cli：一些命令脚本



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

关于  sharp 的用法，可查阅：[sharp学习笔记](https://github.com/puxiao/notes/blob/master/sharp%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)



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

* gltf.textures 中每一项的 .name 属性值、以及 .extensions 属性值中增加 'KHR_texture_basisu': { ... }
* gltf.images 中每一项的 .uri 值、以及 .mimeType 属性值(可选)
* gltf.extensionsRequired 中增加 'KHR_texture_basisu'
* gltf.extensionsUsed 中增加 'KHR_texture_basisu'
* gltf.samplers 采样器的配置(可选)
* gltf.asset.generator 资源生成信息(可选)



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

    const uastc = `ktx create --encode uastc --format R8G8B8_SRGB ${outputPic} ${outputKtx2}`
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

