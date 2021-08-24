import { useRef, useEffect } from "react"
import * as Three from 'three'
import { Box3, Box3Helper, CameraHelper, MathUtils, Spherical, Vector3 } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"

import './index.scss'

const SaveImage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const groupRef = useRef<Three.Group | null>(null)

    useEffect(() => {
        const loader = new OBJLoader()
        loader.load('./model/hello.obj', (group) => {
            // const box = new Three.Box3().setFromObject(group)
            // const center = box.getCenter(new Three.Vector3())
            // group.position.x += (group.position.x - center.x)
            // group.position.y += (group.position.y - center.y)
            // group.position.z += (group.position.z - center.z)
            groupRef.current = group
        })
    }, [])

    useEffect(() => {

        if (canvasRef.current === null || groupRef.current === null) return

        const canvas = canvasRef.current

        const scene = new Three.Scene()
        scene.background = new Three.Color(0x222222)

        const group = groupRef.current
        scene.add(group)

        const renderer = new Three.WebGLRenderer({ canvas })

        const resultCanvas = document.createElement('canvas')
        resultCanvas.style.width = '100px'
        resultCanvas.style.height = '100px'
        const resultRenderer = new Three.WebGLRenderer({
            canvas: resultCanvas
        })
        resultRenderer.setSize(100, 100, false)

        const resultCamera = new Three.PerspectiveCamera(45, 1, 0.1, 1000)
        scene.add(resultCamera)

        const resultCameraHelper = new CameraHelper(resultCamera)
        scene.add(resultCameraHelper)

        const camera = new Three.PerspectiveCamera(45, 2, 0.1, 1000)
        camera.position.set(0, 40, 40)
        scene.add(camera)

        const cameraHelper = new CameraHelper(camera)
        scene.add(cameraHelper)

        const light = new Three.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.6)
        scene.add(light)

        const light2 = new Three.DirectionalLight(0xFFFFFF, 0.6)
        light2.position.set(4, 0, 4)
        camera.add(light2)

        const box3Helper = new Box3Helper(new Box3().setFromObject(group))
        scene.add(box3Helper)

        const render = () => {

            const spherical = new Spherical(orbit.getDistance(), orbit.getPolarAngle(), orbit.getAzimuthalAngle())
            const vector3 = new Vector3().setFromSpherical(spherical).normalize()

            group.rotation.setFromVector3(vector3)

            box3Helper.box.setFromObject(group)

            const bBox = new Box3().setFromObject(box3Helper);
            const bSize = bBox.getSize(new Vector3());
            const vfov = Math.tan(MathUtils.degToRad(camera.fov))
            bSize.divideScalar(vfov)

            resultCamera.position.copy(bSize)
            resultCamera.lookAt(box3Helper.position)

            renderer.render(scene, camera)
        }

        const orbit = new OrbitControls(camera, canvasRef.current)
        orbit.update()
        orbit.addEventListener('change', render)

        render()

        const handleSave = () => {

            resultRenderer.render(scene, resultCamera)

            const link = document.createElement('a')
            link.href = resultCanvas.toDataURL("image/png")
            link.download = 'model' + new Date().getTime() + '.png'
            link.click()

        }
        document.body.addEventListener('dblclick', handleSave)

        const handleResize = () => {
            if (canvasRef.current === null) { return }

            const width = canvasRef.current.clientWidth
            const height = canvasRef.current.clientHeight

            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height, false)

            render()
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            document.body.removeEventListener('dblclick', handleSave)
            window.removeEventListener('resize', handleResize)
        }
    }, [canvasRef, groupRef])

    return (
        <canvas ref={canvasRef} className='full-screen' tabIndex={0} />
    )
}

export default SaveImage
