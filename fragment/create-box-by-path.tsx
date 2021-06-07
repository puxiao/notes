import { useRef, useEffect, useState, Fragment } from 'react'
import * as Three from 'three'
import DatGui, { DatNumber } from 'react-dat-gui'
import "react-dat-gui/dist/index.css"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let mesh: Three.Mesh | null = null
let line: Three.Line | null = null

const TestPath = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const sceneRef = useRef<Three.Scene | null>(null)
    const [params, setParams] = useState<{ size: number, radius: number }>({
        size: 6,
        radius: 0.2
    })

    const handleUpdate = (newData: any) => {
        setParams(newData)
    }

    useEffect(() => {

        if (canvasRef.current === null) return

        const canvas = canvasRef.current
        const renderer = new Three.WebGLRenderer({ canvas, antialias: true })
        const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100)
        camera.position.set(6, 10, 40)
        const scene = new Three.Scene()
        scene.background = new Three.Color(0xcccccc)

        const light = new Three.HemisphereLight(0xFFFFFF, 0x111111)
        scene.add(light)

        const controls = new OrbitControls(camera, canvas)
        controls.update()

        const helper = new Three.AxesHelper(18)
        scene.add(helper)

        sceneRef.current = scene

        const handleRender = () => {
            renderer.render(scene, camera)
            window.requestAnimationFrame(handleRender)
        }
        window.requestAnimationFrame(handleRender)

        const handleReszie = () => {
            const width = canvas.clientWidth
            const height = canvas.clientHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
            renderer.setSize(width, height, false)
        }
        handleReszie()
        window.addEventListener('resize', handleReszie)

        return () => {
            window.removeEventListener('resize', handleReszie)
        }
    }, [canvasRef])

    useEffect(() => {
        if (sceneRef.current === null) return

        const scene = sceneRef.current
        if (mesh !== null) {
            scene.remove(mesh)
            mesh = null
        }

        if (line !== null) {
            scene.remove(line)
            line = null
        }

        const halfSize = params.size / 2
        const radius = params.radius
        const vectors: Three.Vector2[] = []
        vectors.push(new Three.Vector2(-halfSize, halfSize - radius))
        vectors.push(new Three.Vector2(-halfSize, halfSize))
        vectors.push(new Three.Vector2(radius - halfSize, halfSize))

        vectors.push(new Three.Vector2(halfSize - radius, halfSize))
        vectors.push(new Three.Vector2(halfSize, halfSize))
        vectors.push(new Three.Vector2(halfSize, halfSize - radius))

        vectors.push(new Three.Vector2(halfSize, radius - halfSize))
        vectors.push(new Three.Vector2(halfSize, -halfSize))
        vectors.push(new Three.Vector2(halfSize - radius, -halfSize))

        vectors.push(new Three.Vector2(radius - halfSize, -halfSize))
        vectors.push(new Three.Vector2(-halfSize, -halfSize))
        vectors.push(new Three.Vector2(-halfSize, radius - halfSize))

        const shape = new Three.Shape()
        const path = new Three.Path()
        path.moveTo(vectors[0].x, vectors[0].y)
        for (let i = 0; i < (vectors.length / 3); i++) {
            const num = i * 3

            const arr1: [number, number] = [vectors[num].x, vectors[num].y]
            const arr2: [number, number, number, number] = [vectors[num + 1].x, vectors[num + 1].y, vectors[num + 2].x, vectors[num + 2].y]

            shape.lineTo(...arr1)
            shape.quadraticCurveTo(...arr2)

            path.lineTo(...arr1)
            path.quadraticCurveTo(...arr2)

            if (num + 2 === vectors.length - 1) {
                shape.lineTo(vectors[0].x, vectors[0].y)
                path.lineTo(vectors[0].x, vectors[0].y)
            }
        }

        const boxGeometry = new Three.ExtrudeGeometry(shape, { depth: params.size, bevelEnabled: false })
        mesh = new Three.Mesh(boxGeometry, new Three.MeshPhongMaterial({ color: 'green', transparent: true, opacity: 0.9 }))
        mesh.position.z = -halfSize
        scene.add(mesh)

        const lineGemotry = new Three.BufferGeometry().setFromPoints(path.getPoints())
        line = new Three.Line(lineGemotry, new Three.MeshBasicMaterial({ color: 'red' }))
        line.position.x = - params.size - 4
        scene.add(line)

        return () => {

        }
    }, [params.size, params.radius])

    return (
        <Fragment>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
            <DatGui data={params} onUpdate={handleUpdate} style={{ width: '200px', position: 'fixed', right: '30px', top: '30px' }}>
                <DatNumber path='size' label='size' min={1} max={10} step={0.1} />
                <DatNumber path='radius' label='radius' min={0} max={4} step={0.1} />
            </DatGui>
        </Fragment>
    )
}

export default TestPath
