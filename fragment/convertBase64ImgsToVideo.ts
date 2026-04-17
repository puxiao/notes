// 安装依赖：pnpm add @ffmpeg/core @ffmpeg/ffmpeg @ffmpeg/util

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

const coreURL = './ffmpeg/ffmpeg-core.js' //从 node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js 复制
const wasmURL = './ffmpeg/ffmpeg-core.wasm' //从 node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.wasm 复制

// ========== 辅助函数：Base64 DataURL → Uint8Array ==========
function base64ToUint8Array(base64DataUrl: string) {
    // 提取纯 Base64 部分（去除 data:image/png;base64, 前缀）
    const base64String = base64DataUrl.split(',')[1]
    if (!base64String) throw new Error('无效的 Base64 数据')
    const binaryString = atob(base64String)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes
}

// ========== FFmpeg 转换核心 ==========
const ffmpeg = new FFmpeg()
await ffmpeg.load({
    coreURL: await toBlobURL(coreURL, 'text/javascript'),
    wasmURL: await toBlobURL(wasmURL, 'application/wasm'),
})

//将一组Base64图片数据转换成一个视频文件 (由deepseek生成)
async function convertBase64ImgsToVideo(imagesArray: string[], framerate = 30, outputFormat: 'webm' | 'mp4' = 'webm') {
    if (imagesArray.length === 0) {
        throw new Error('convertBase64ImgsToVideo: 没有图片可供转换')
    }

    // 监听进度
    ffmpeg.on('progress', ({ progress }) => {
        const percent = Math.round(progress * 100)
        console.log(`进度: ${percent}%`)
    })

    // 1. 将所有 Base64 图片写入虚拟文件系统
    for (let i = 0; i < imagesArray.length; i++) {
        const paddedIndex = String(i + 1).padStart(3, '0')
        const fileName = `img_${paddedIndex}.png`
        const uint8Data = base64ToUint8Array(imagesArray[i] as string)
        await ffmpeg.writeFile(fileName, uint8Data)
        if ((i + 1) % 20 === 0) {
            console.log(`已写入 ${i + 1}/${imagesArray.length} 张图片`)
        }
    }

    // 2. 执行 FFmpeg 命令（使用序号模式，更可靠）
    let losslessParams: string[] = []
    if (outputFormat === 'webm') {
        losslessParams = [
            'libvpx-vp9',
            '-pix_fmt',
            'yuva420p',
            '-crf',
            '10', // 有损但质量很高，若需无损用 -lossless 1
        ]
    } else if (outputFormat === 'mp4') {
        losslessParams = ['libx264', '-preset', 'veryslow', '-crf', '0', '-pix_fmt', 'yuv444p']
    }

    const outputFile = `output.webm`
    await ffmpeg.exec(['-framerate', String(framerate), '-i', 'img_%03d.png', '-c:v', ...losslessParams, '-y', outputFile])

    // 3. 读取生成的视频文件
    const videoData = await ffmpeg.readFile(outputFile)
    const blob = new Blob([videoData as BlobPart], { type: `video/webm` })
    const url = URL.createObjectURL(blob)

    return url
}

export default convertBase64ImgsToVideo
