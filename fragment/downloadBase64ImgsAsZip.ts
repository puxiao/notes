import JSZip from 'jszip'

//将一组Base64图片数据打包成一个ZIP文件并下载 (由deepseek生成)
async function downloadBase64ImgsAsZip(imagesArray: string[], zipName = 'images.zip') {
    if (imagesArray.length === 0) {
        throw new Error('downloadBase64ImgsAsZip: 没有有效的图片可以打包，请检查数组数据。')
    }

    // 辅助函数：将Base64字符串转换为Uint8Array
    function base64ToUint8Array(base64: string): Uint8Array {
        // 移除可能存在的换行符和空格
        const cleanBase64 = base64.replace(/\s/g, '')
        const binaryString = window.atob(cleanBase64)
        const len = binaryString.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        return bytes
    }

    // 辅助函数：从data URL中提取MIME类型和纯Base64数据
    function parseDataUrl(dataUrl: string): { mimeType: string; base64Data: string } {
        const matches = dataUrl.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/)
        if (!matches || matches.length !== 3) {
            throw new Error('无效的data URL格式')
        }
        const mimeType = matches[1] as string
        const base64Data = matches[2] as string
        return { mimeType, base64Data }
    }

    // 根据MIME类型获取文件扩展名
    function getExtension(mimeType: string) {
        switch (mimeType) {
            case 'image/png':
                return '.png'
            case 'image/jpeg':
                return '.jpg'
            case 'image/jpg':
                return '.jpg'
            case 'image/gif':
                return '.gif'
            case 'image/webp':
                return '.webp'
            default:
                return '.png' // 默认使用.png
        }
    }

    const zip = new JSZip()

    // 遍历数组，处理每张图片
    for (let i = 0; i < imagesArray.length; i++) {
        const imageDataUrl = imagesArray[i]
        try {
            const { mimeType, base64Data } = parseDataUrl(imageDataUrl as string)
            const extension = getExtension(mimeType)
            const fileName = `image_${i + 1}${extension}`
            const uint8Array = base64ToUint8Array(base64Data)
            zip.file(fileName, uint8Array, { binary: true })
        } catch (error) {
            console.error(`处理第 ${i + 1} 张图片时出错:`, error)
        }
    }

    try {
        // 生成ZIP文件的Blob
        const zipBlob = await zip.generateAsync({ type: 'blob' })

        // 创建下载链接
        const downloadLink = document.createElement('a')
        const url = URL.createObjectURL(zipBlob)
        downloadLink.href = url
        downloadLink.download = zipName
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

        // 释放内存
        URL.revokeObjectURL(url)
    } catch (error) {
        console.error('生成ZIP文件时出错:', error)
    }
}

export default downloadBase64ImgsAsZip
