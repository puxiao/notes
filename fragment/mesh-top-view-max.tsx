/**
 * 创建 2 个画布，一个作为主视图，另外一个作为 顶视图
 * 1、主视图中，添加一个立方体，并且可以控制它的 大小、旋转、位置
 * 2、顶视图中按照立方体的尺寸，在看全的前提下，尽可能最大化显示
 * 作者：https://github.com/puxiao
 */

import './App.css'
import { useEffect, useRef, useState } from 'react'
import { Box3, Box3Helper, BoxGeometry, CameraHelper, Euler, Mesh, MeshBasicMaterial, OrthographicCamera, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BoxInfo } from './types'
import Gui from './Gui'
import { Button } from 'antd'

const worldSize = {
    width: 800,
    height: 600
}

const topSize = {
    width: 300,
    height: 180
}

const topCanvasAspect = topSize.width / topSize.height

function App() {

    const [boxInfo, setBoxInfo] = useState<BoxInfo>({
        scale: new Vector3(
            Math.floor(1 + Math.random() * 3),
            Math.floor(1 + Math.random() * 3),
            Math.floor(1 + Math.random() * 3)
        ),
        position: new Vector3(0, 0, 0),
        rotation: new Euler(Math.random() * 3.14, Math.random() * 3.14, Math.random() * 3.14)
    })

    const [box] = useState<Mesh>(new Mesh(new BoxGeometry(1, 1, 1), [
        new MeshBasicMaterial({ color: 'red' }),
        new MeshBasicMaterial({ color: 'green' }),
        new MeshBasicMaterial({ color: 'blue' }),
        new MeshBasicMaterial({ color: 'yellow' }),
        new MeshBasicMaterial({ color: 'purple' }),
        new MeshBasicMaterial({ color: 'SaddleBrown' })
    ]))

    const [box3Helper] = useState<Box3Helper>(new Box3Helper(new Box3()))

    const [topCamera] = useState<OrthographicCamera>(new OrthographicCamera(topSize.width / -2, topSize.width / 2, topSize.height / 2, topSize.height / -2))

    //const [worldCamera] = useState<PerspectiveCamera>(new PerspectiveCamera(45, worldSize.width / worldSize.height))
    const [worldCamera] = useState<OrthographicCamera>(new OrthographicCamera(worldSize.width / -2, worldSize.width / 2, worldSize.height / 2, worldSize.height / -2))

    const [topCameraHelper] = useState<CameraHelper>(new CameraHelper(topCamera))

    const controlRef = useRef<OrbitControls | null>(null)

    const getResPosition = (vec3: Vector3): Vector2 => {
        const vector = vec3.project(worldCamera)
        const pixelX = (vector.x * 0.5 + 0.5) * worldSize.width
        const pixelY = (0.5 - vector.y * 0.5) * worldSize.height
        return new Vector2(pixelX, pixelY)
    }

    const handleClick = () => {

        /** 
         * 为了简化我们的效果，我们将 box 的位置恢复成 (0,0,0)，以便让 box 和 worldCamera 的中心位置相同
        */
        setBoxInfo({ ...boxInfo, position: new Vector3(0, 0, 0) })
        box.position.set(0, 0, 0)

        box3Helper.box.setFromObject(box)
        box3Helper.updateMatrixWorld()

        const box3 = box3Helper.box

        const points: Vector3[] = [
            new Vector3(box3.min.x, box3.min.y, box3.min.z),
            new Vector3(box3.min.x, box3.min.y, box3.max.z),
            new Vector3(box3.min.x, box3.max.y, box3.min.z),
            new Vector3(box3.min.x, box3.max.y, box3.max.z),
            new Vector3(box3.max.x, box3.min.y, box3.min.z),
            new Vector3(box3.max.x, box3.min.y, box3.max.z),
            new Vector3(box3.max.x, box3.max.y, box3.min.z),
            new Vector3(box3.max.x, box3.max.y, box3.max.z)
        ]

        const resPoints = points.map(item => getResPosition(item))
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

        const scaleX = worldSize.width / rectInfo.width
        const scaleY = worldSize.height / rectInfo.height
        const resScale = Math.min(scaleX, scaleY)
        console.log('缩放比例：', scaleX, scaleY, resScale)

        worldCamera.zoom *= resScale
        worldCamera.updateProjectionMatrix()

        const control = controlRef.current
        if (control) {
            control.update()
        }
    }

    useEffect(() => {
        const worldCanvas = document.body.querySelector('#worldCanvas')
        const topCanvas = document.body.querySelector('#topCanvas')

        if (worldCanvas === null || topCanvas === null) return

        //创建 3D 场景
        const scene = new Scene()
        scene.add(box)

        //创建主视图
        const worldRenderer = new WebGLRenderer({ canvas: worldCanvas, antialias: true })
        worldRenderer.setSize(worldSize.width, worldSize.height)

        //配置主视图相机
        worldCamera.position.set(0, 0, 10)
        worldCamera.lookAt(0, 0, 0)
        worldCamera.zoom = 100

        const control = new OrbitControls(worldCamera, worldCanvas as HTMLElement)
        controlRef.current = control

        //为了方便观察，我们添加顶视图的相机辅助显示对象
        scene.add(topCameraHelper)

        //为了方便观察，我们添加立方体的包围盒
        scene.add(box3Helper)

        //创建顶视图
        const topRenderer = new WebGLRenderer({ canvas: topCanvas, antialias: true })
        topRenderer.setSize(topSize.width, topSize.height)

        //渲染结果
        const render = () => {
            topCameraHelper.visible = true
            worldRenderer.render(scene, worldCamera)

            topCameraHelper.visible = false //在顶视图中不渲染相机辅助显示对象
            topRenderer.render(scene, topCamera)
            window.requestAnimationFrame(render)
        }
        render()

    }, [])

    useEffect(() => {

        box.scale.copy(boxInfo.scale)
        box.rotation.copy(boxInfo.rotation)
        box.position.copy(boxInfo.position)
        box.updateWorldMatrix(false, false)

        const boxAspect = boxInfo.scale.x / boxInfo.scale.z //当前立方体宽高比

        const topViewScale = new Vector2(1, 1) //默认水平和上下缩放因子为 1,1 即不进行任何缩放
        if (boxAspect < topCanvasAspect) {
            topViewScale.set(topCanvasAspect / boxAspect, 1)
        } else if (boxAspect > topCanvasAspect) {
            topViewScale.set(1, boxAspect / topCanvasAspect)
        }

        //针对顶视图视椎的配置
        topCamera.left = - (boxInfo.scale.x * topViewScale.x) / 2
        topCamera.right = (boxInfo.scale.x * topViewScale.x) / 2
        topCamera.top = (boxInfo.scale.z * topViewScale.y) / 2
        topCamera.bottom = -(boxInfo.scale.z * topViewScale.y) / 2
        topCamera.near = -boxInfo.scale.y / 2 - 0.1
        topCamera.far = boxInfo.scale.y / 2 + 0.1
        topCamera.updateProjectionMatrix()

        topCamera.rotation.set(boxInfo.rotation.x, boxInfo.rotation.y, boxInfo.rotation.z)
        topCamera.position.set(boxInfo.position.x, boxInfo.position.y, boxInfo.position.z)
        topCamera.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI / 2) //不是用 up + lookAt，而是我们自己旋转让相机对着顶面

        topCameraHelper.update()

        box3Helper.box.setFromObject(box)
        box3Helper.updateMatrixWorld()

    }, [boxInfo, box, topCamera, topCameraHelper, box3Helper])


    return (
        <>
            <canvas id='worldCanvas' />
            <canvas id='topCanvas' style={{ marginLeft: '20px' }} />
            <Gui boxInfo={boxInfo} setBoxInfo={setBoxInfo} />
            <Button type='primary' onClick={handleClick}>主场景包围盒贴合边缘</Button>
        </>
    )
}

export default App
