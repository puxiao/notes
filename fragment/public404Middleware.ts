
import { access, constants } from "fs/promises"
import path from "path"
import { Plugin } from "vite"

const checkFileExt = ['.json', '.jpg', '.png', '.mp3']
const public404Middleware = (): Plugin => ({
    name: 'public-404-middleware',
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            const reqUrl = req.url
            if (reqUrl && checkFileExt.some(v => reqUrl.toLowerCase().endsWith(v))) {
                const filePath = path.join(path.resolve(__dirname, './public'), decodeURIComponent(reqUrl))
                try {
                    await access(filePath, constants.F_OK)
                    next()
                } catch (err) {
                    res.statusCode = 404
                    res.end('404')
                }
            } else {
                next()
            }
        })
    }
})

export default public404Middleware
