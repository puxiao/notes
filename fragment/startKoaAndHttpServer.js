import koa from 'koa'
import cors from '@koa/cors'
import bodyparser from 'koa-bodyparser'
import { spawn } from 'node:child_process'
import open from 'open'
import router from './routers/index.js'

const app = new koa()

app.use(cors())
app.use(bodyparser())

app.use(router.routes())
app.use(router.allowedMethods())

const server = app.listen(5526, '0.0.0.0', () => {
    console.log('后端服务启动成功 http://0.0.0.0:5526')
})

//注意：只能使用 spawn，不能使用 spawnSync，因为 spawnSync 会阻塞进程导致 app 无法正常执行
const httpServer = spawn('http-server', ['./web', '-p', '8080', '-c-1', '-s'], {
    stdio: 'inherit',
    shell: true
})

console.log('前端服务启动成功 http://localhost:8080/')
open('http://localhost:8080/').catch(err => {
    console.error('自动打开浏览器失败', err)
    console.log('请手工打开 http://localhost:8080/')
})

httpServer.on('error', (err) => {
    console.log('http-server 发生错误:', err)
    server.close();
    console.log('当前服务已关闭，请手工重启服务')
})

httpServer.on('close', (code) => {
    console.log(`http-server 进程退出，退出码: ${code}`);
    server.close()
    console.log('当前服务已关闭，请手工重启服务')
})

process.on('SIGINT', () => {
    server.close();
    process.exit();
})
