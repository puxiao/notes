/**
 * 加载一个 BEV(鸟瞰图视角) 处理后的车道线 3D 点云文件
 * 1、切换到正对路面的那个视角
 * 2、修改相机，让点云可以看全的情况下最大显示
 * 作者：https://github.com/puxiao
 */

import { useEffect, useRef } from 'react'
import './App.css'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'
import { Box3, Box3Helper, OrthographicCamera, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function App() {

    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {

        const canvas = canvasRef.current
        if (canvas === null) return

        const renderer = new WebGLRenderer({ canvas })
        renderer.setSize(canvas.clientWidth, canvas.clientHeight)

        const scene = new Scene()

        //const camera = new PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)

        const camera = new OrthographicCamera(-canvas.clientWidth, canvas.clientWidth, canvas.clientHeight, -canvas.clientHeight, -2000, 4000)

        camera.position.set(0, 0, 20)

        const control = new OrbitControls(camera, canvas)

        const pcdLoader = new PCDLoader()
        pcdLoader.load('/test.pcd', (points) => {
            scene.add(points)

            const box3 = new Box3().setFromObject(points)

            //@ts-ignore
            if (camera && camera.isPerspectiveCamera) {

                //如果是透视相机，由于 box3.z 存在高度，那么由于透视相机近大远小
                //导致计算的 box3 上下两端的顶点位置与实际看到的点云两端边缘无法贴合，最终效果就会产生偏差
                //(实际上左右也存在这个问题，只不过没有 上下两端明显)

                //如果真的想 100%绝对精准，那么最笨的办法就是遍历点云所有的点，找出 上下左右 边缘的 4 点，
                //接下来不再依靠 box3 的 8 个顶点，而是依靠这 4 个点云的点 来计算出最终渲染结果 2D 框的位置和宽度
                //然后根据位置和宽度来计算出后续流程 (不再以 box3 的中心点为基准)

            }

            const box3Center = new Vector3()
            box3.getCenter(box3Center)


            //不正确的代码：我们不应该移动点云的位置来实现点云居中，我们应该移动相机的位置来实现居中
            //points.position.sub(box3Center)

            //正确的代码：修改相机的位置，让相机位置相对点云是居中的
            camera.position.add(box3Center)

            const box3Helper = new Box3Helper(box3)
            scene.add(box3Helper)
            console.log('max:', box3.max)

            const vertexPoints: Vector3[] = [
                new Vector3(box3.min.x, box3.min.y, box3.min.z),
                new Vector3(box3.min.x, box3.min.y, box3.max.z),
                new Vector3(box3.min.x, box3.max.y, box3.min.z),
                new Vector3(box3.min.x, box3.max.y, box3.max.z),
                new Vector3(box3.max.x, box3.min.y, box3.min.z),
                new Vector3(box3.max.x, box3.min.y, box3.max.z),
                new Vector3(box3.max.x, box3.max.y, box3.min.z),
                new Vector3(box3.max.x, box3.max.y, box3.max.z)
            ]

            const resPoints = vertexPoints.map(item => {
                const vector = item.project(camera)
                const pixelX = (vector.x * 0.5 + 0.5) * canvas.clientWidth
                const pixelY = (0.5 - vector.y * 0.5) * canvas.clientHeight
                return new Vector2(pixelX, pixelY)
            })
            console.log('当前渲染出来的8个顶点坐标是：', resPoints)

            const minX = Math.min(...resPoints.map(item => item.x))
            const maxX = Math.max(...resPoints.map(item => item.x))
            const minY = Math.min(...resPoints.map(item => item.y))
            const maxY = Math.max(...resPoints.map(item => item.y))

            const rectInfo = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            }
            console.log('当前渲染的矩形区域：', rectInfo)

            const scaleX = canvas.clientWidth / rectInfo.width
            const scaleY = canvas.clientHeight / rectInfo.height
            const resScale = Math.min(scaleX, scaleY)
            console.log('缩放比例：', scaleX, scaleY, resScale)

            camera.zoom = resScale
            camera.updateProjectionMatrix()

            control.target.copy(box3Center) //让相机轨道控制器始终盯着点云中心旋转
            control.update() //由于相机发生了变化，手工更新一下相机轨道控制器

        })

        const render = () => {
            renderer.render(scene, camera)
        }
        renderer.setAnimationLoop(render)

    }, [])

    return (
        <canvas ref={canvasRef} />
    )
}

export default App
