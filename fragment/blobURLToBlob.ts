const map = new Map()
map.set('image', 'image/jpeg')
map.set('audio', 'audio/mpeg')
map.set('video', 'video/mp4')
const allowedTypes = ['image', 'audio', 'video']

const blobURLToBlob = async (blobURL: string, fileType: string) => {

    try {

        const response = await fetch(blobURL)
        if (response.body === null) {
            throw new Error('blobURLToBlob response.body 为 null')
        }

        const reader = response.body.getReader()
        const chunks: Uint8Array[] = []
        let done = false
        while (!done) {
            const { value, done: doneReading } = await reader.read()
            done = doneReading
            if (value) {
                chunks.push(value)
            }
        }

        const contentType = (response.headers.get('content-type') || '').split(';')[0]
        const originalType = contentType.split('/')[0]

        if (allowedTypes.includes(originalType)) {
            //@ts-ignore
            return new Blob(chunks, { type: contentType })
        }

        //@ts-ignore
        return new Blob(chunks, { type: map.get(fileType) || 'text/plain' })

    } catch (err) {
        console.error(err)
        throw new Error('blobURLToBlob 转换失败')
    }

}

export default blobURLToBlob
