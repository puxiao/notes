import path from 'path'
import fs from 'fs'
import { PNG } from 'pngjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rgbaPNGToGray = (pngPath) => {
    const rgbPNG = PNG.sync.read(fs.readFileSync(pngPath))
    const buffer = PNG.sync.write(rgbPNG, { colorType: 0 })
    fs.writeFileSync(pngPath, buffer)
}

rgbaPNGToGray(path.join(__dirname,'./xxx.png'))
