
import { access, constants } from "fs/promises"
import path from "path"
import { Plugin } from "vite"

const public404Middleware = (): Plugin => ({
    name: 'public-404-middleware',
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            if (req.url && (req.url.endsWith('.jpg') || req.url.endsWith('.png'))) {
                const filePath = path.join(path.resolve(__dirname, 'public'), req.url)
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
