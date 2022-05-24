import { useEffect, useState } from 'react'
import { createSelectorQuery, useReady } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import { PlatformManager, WechatPlatform } from 'platformize-three';
import { Color, DirectionalLight, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, SphereGeometry, sRGBEncoding, WebGL1Renderer } from 'three';
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './index.scss'

const Index = () => {

    const [myCanvas, setMyCanvas] = useState<HTMLCanvasElement | undefined>(undefined)

    useReady(() => {
        createSelectorQuery().select('#mycanvas').node().exec(res => {
            const canvas = res[0].node as HTMLCanvasElement
            setMyCanvas(canvas)
        })
    })

    useEffect(() => {

        if (myCanvas === undefined || myCanvas === null) return

        const canvas = myCanvas

        //开始微信小程序适配 Three.js
        const canvasWidth = 300
        const canvasHeight = 150
        const platform = new WechatPlatform(canvas, canvasWidth, canvasHeight)
        PlatformManager.set(platform);

        //开始初始化 Three 场景
        const renderer = new WebGL1Renderer({
            canvas,
            antialias: true,
            alpha: true
        })
        renderer.outputEncoding = sRGBEncoding
        renderer.setSize(canvasWidth, canvasHeight)

        const scene = new Scene()
        scene.background = new Color(0x000000)
        const camera = new PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000)
        camera.position.set(0, 2, 2)

        // const controls = new OrbitControls(camera, canvas)
        // controls.enableDamping = true
        // controls.update()

        //添加光
        const light = new DirectionalLight(0xffffff, 1)
        light.position.set(0, 10, 0)
        scene.add(light)

        //向场景中添加一些物体
        const sphereGeometry = new SphereGeometry(1, 32, 32)
        const sphereMaterial = new MeshPhongMaterial({ color: 0xffffff, flatShading: true })
        const sphereMesh = new Mesh(sphereGeometry, sphereMaterial)
        sphereMesh.position.set(0, 0, 0)
        scene.add(sphereMesh)

        //渲染场景
        const render = (time: number) => {
            time = time * 0.001
            sphereMesh.rotation.x = time
            sphereMesh.rotation.y = time
            renderer.render(scene, camera)
            requestAnimationFrame(render)
        }
        requestAnimationFrame(render)

        return () => {
            PlatformManager.dispose()
        }

    }, [myCanvas])

    return (
        <View className='index'>
            <Canvas id='mycanvas' type='webgl' />
        </View>
    )
}

export default Index
