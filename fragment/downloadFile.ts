import { writeFileSync } from "node:fs"

const downloadFile = async (url: string, savePath: string) => {
    const res = await fetch(url)
    const data = await res.arrayBuffer()
    writeFileSync(savePath, Buffer.from(data))
}

export default downloadFile
