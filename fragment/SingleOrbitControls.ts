import { PerspectiveCamera, OrthographicCamera, EventDispatcher, Vector2, Vector3, Matrix4, MOUSE, Spherical, Quaternion } from "three";

const _changeEvent = { type: 'change' }
const _startEvent = { type: 'start' }
const _endEvent = { type: 'end' }

export const ControlsModeTypes = {
    DEFAULT: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2
} as const

export type ControlsModeValue = typeof ControlsModeTypes[keyof typeof ControlsModeTypes]

/**
 * @description: Single orbit controls: PAN or ROTATE or ZOOM
 */
class SingleOrbitControls extends EventDispatcher {

    private _mode: ControlsModeValue = ControlsModeTypes.DEFAULT

    public camera: PerspectiveCamera | OrthographicCamera
    public domElement: HTMLElement

    public enabled: boolean = true
    public enableDamping: boolean = false
    public dampingFactor: number = 0.05
    public minDistance: number = 0
    public maxDistance: number = Infinity
    public minZoom: number = 0
    public maxZoom: number = Infinity

    // public minPolarAngle: number = Math.PI / 4
    // public maxPolarAngle: number = Math.PI / 4 * 3
    // public minAzimuthAngle: number = -Math.PI / 4
    // public maxAzimuthAngle: number = Math.PI / 4

    public minPolarAngle: number = 0
    public maxPolarAngle: number = Math.PI
    public minAzimuthAngle: number = -Math.PI
    public maxAzimuthAngle: number = Math.PI

    private readonly mouseButtons = { LEFT: MOUSE.LEFT, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.RIGHT }

    private readonly STATE = {
        NONE: -1,
        ROTATE: 0,
        DOLLY: 1,
        PAN: 2
    }

    private state: number

    private readonly EPS: number = 0.000001

    private target0: Vector3
    private position0: Vector3
    private zoom0: number

    public target: Vector3 = new Vector3()

    private scale: number = 1
    private zoomChanged: boolean = false
    private zoomSpeed: number = 1.0
    private enableZoom: boolean = true

    private rotateSpeed: number = 1.0
    private autoRotate: boolean = false
    private autoRotateSpeed: number = 2.0
    private enableRotate: boolean = true

    private panSpeed: number = 1.0
    private screenSpacePanning: boolean = true
    private enablePan: boolean = true

    private readonly spherical: Spherical = new Spherical()
    private readonly sphericalDelta: Spherical = new Spherical()

    private readonly panOffset = new Vector3()

    private readonly rotateStart = new Vector2()
    private readonly rotateEnd = new Vector2()
    private readonly rotateDelta = new Vector2()

    private readonly panStart = new Vector2()
    private readonly panDelta = new Vector2()
    private readonly panEnd = new Vector2()

    private readonly dollyStart = new Vector2()
    private readonly dollyDelta = new Vector2()
    private readonly dollyEnd = new Vector2()

    public update: () => boolean
    private panLeft: (distance: number, objectMatrix: Matrix4) => void
    private panUp: (distance: number, objectMatrix: Matrix4) => void
    private pan: (deltaX: number, deltaY: number) => void

    constructor(camera: PerspectiveCamera | OrthographicCamera, domElement: HTMLElement) {
        super()

        this.camera = camera
        this.domElement = domElement

        this.target0 = this.target.clone()
        this.position0 = this.camera.position.clone()
        this.zoom0 = this.camera.zoom

        this.state = this.STATE.NONE

        //HACK
        this.update = this.handleUpdate()
        this.panLeft = this.handlePanLeft()
        this.panUp = this.handlePanUp()
        this.pan = this.handlePan()

        this.update()

        //
        this.domElement.addEventListener('contextmenu', this.handleContextMenu)
        this.domElement.addEventListener('wheel', this.handleWheel, { passive: false })
        this.domElement.addEventListener('pointerdown', this.handlePointerDown, { passive: false })
    }

    //
    private getAutoRotationAngle = () => {
        return 2 * Math.PI / 60 / 60 * this.autoRotateSpeed
    }

    private getZoomScale = () => {
        return Math.pow(0.95, this.zoomSpeed)
    }

    private rotateLeft = (angle: number) => {
        this.sphericalDelta.theta -= angle
    }

    private rotateUp = (angle: number) => {
        this.sphericalDelta.phi -= angle
    }

    private dollyOut = (dollyScale: number) => {
        if (this.camera instanceof PerspectiveCamera) {
            this.scale /= dollyScale
        } else if (this.camera instanceof OrthographicCamera) {
            this.camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.camera.zoom * dollyScale))
            this.camera.updateProjectionMatrix()
            this.zoomChanged = true
        } else {
            console.warn('WARNING: SingleOrbitControls encountered an unknown camera type - dolly/zoom disabled.')
            this.enableZoom = false
        }
    }

    private dollyIn = (dollyScale: number) => {
        if (this.camera instanceof PerspectiveCamera) {
            this.scale *= dollyScale
        } else if (this.camera instanceof OrthographicCamera) {
            this.camera.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.camera.zoom / dollyScale))
            this.camera.updateProjectionMatrix()
            this.zoomChanged = true
        } else {
            console.warn('WARNING: SingleOrbitControls encountered an unknown camera type - dolly/zoom disabled.')
            this.enableZoom = false
        }
    }

    private handleUpdate = () => {
        const offset = new Vector3()
        const quat = new Quaternion().setFromUnitVectors(this.camera.up, new Vector3(0, 1, 0))
        const quatInverse = quat.clone().invert()
        const lastPosititon = new Vector3()
        const lastQuaternion = new Quaternion()
        const twoPI = 2 * Math.PI

        const update = () => {
            const position = this.camera.position
            offset.copy(position).sub(this.target)
            offset.applyQuaternion(quat)
            this.spherical.setFromVector3(offset)
            if (this.autoRotate && this.state === this.STATE.NONE) {
                this.rotateLeft(this.getAutoRotationAngle())
            }
            if (this.enableDamping) {
                this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor
                this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor
            } else {
                this.spherical.theta += this.sphericalDelta.theta
                this.spherical.phi += this.sphericalDelta.phi
            }

            let min = this.minAzimuthAngle
            let max = this.maxAzimuthAngle

            if (isFinite(min) && isFinite(max)) {
                if (min < -Math.PI) { min += twoPI }
                else if (min > Math.PI) { min -= twoPI }

                if (max < -Math.PI) { max += twoPI }
                else if (max > Math.PI) { max -= twoPI }

                if (min <= max) {
                    this.spherical.theta = Math.max(min, Math.min(max, this.spherical.theta))
                } else {
                    this.spherical.theta = (this.spherical.theta > (min + max) / 2) ?
                        Math.max(min, this.spherical.theta) : Math.min(max, this.spherical.theta)
                }
            }

            this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi))
            this.spherical.makeSafe()
            this.spherical.radius *= this.scale
            this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius))

            if (this.enableDamping === true) {
                this.target.addScaledVector(this.panOffset, this.dampingFactor)
            } else {
                this.target.add(this.panOffset)
            }

            offset.setFromSpherical(this.spherical)
            offset.applyQuaternion(quatInverse)
            position.copy(this.target).add(offset)
            this.camera.lookAt(this.target)

            if (this.enableDamping === true) {
                this.sphericalDelta.theta *= (1 - this.dampingFactor)
                this.sphericalDelta.phi *= (1 - this.dampingFactor)
                this.panOffset.multiplyScalar(1 - this.dampingFactor)
            } else {
                this.sphericalDelta.set(0, 0, 0)
                this.panOffset.set(0, 0, 0)
            }

            this.scale = 1

            if (this.zoomChanged || lastPosititon.distanceToSquared(this.camera.position) > this.EPS || 8 * (1 - lastQuaternion.dot(this.camera.quaternion)) > this.EPS) {
                this.dispatchEvent(_changeEvent)
                lastPosititon.copy(this.camera.position)
                lastQuaternion.copy(this.camera.quaternion)
                this.zoomChanged = false
                return true
            }
            return false
        }

        return update
    }

    private handlePanLeft = () => {
        const v = new Vector3()
        const panLeft = (distance: number, objectMatrix: Matrix4) => {
            v.setFromMatrixColumn(objectMatrix, 0)
            v.multiplyScalar(-distance)
            this.panOffset.add(v)
        }
        return panLeft
    }

    private handlePanUp = () => {
        const v = new Vector3()
        const panUp = (distance: number, objectMatrix: Matrix4) => {
            if (this.screenSpacePanning === true) {
                v.setFromMatrixColumn(objectMatrix, 1)
            } else {
                v.setFromMatrixColumn(objectMatrix, 0)
                v.crossVectors(this.camera.up, v)
            }
            v.multiplyScalar(distance)
            this.panOffset.add(v)
        }
        return panUp
    }

    private handlePan = () => {
        const offset = new Vector3()
        const pan = (deltaX: number, deltaY: number) => {
            if (this.camera instanceof PerspectiveCamera) {
                const position = this.camera.position
                offset.copy(position).sub(this.target)
                let targetDistance = offset.length()
                targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180.0)
                this.panLeft(2 * deltaX * targetDistance / this.domElement.clientHeight, this.camera.matrix)
                this.panUp(2 * deltaY * targetDistance / this.domElement.clientHeight, this.camera.matrix)

            } else if (this.camera instanceof OrthographicCamera) {
                this.panLeft(deltaX * (this.camera.right - this.camera.left) / this.camera.zoom / this.domElement.clientWidth, this.camera.matrix)
                this.panUp(deltaY * (this.camera.top - this.camera.bottom) / this.camera.zoom / this.domElement.clientHeight, this.camera.matrix)
            } else {
                console.warn('WARNING: SingleOrbitControls encountered an unknow camera type - pan disabled.')
                this.enablePan = false
            }
        }
        return pan
    }

    //

    private handleContextMenu = (event: MouseEvent) => {
        if (this.enabled === false) return
        event.preventDefault()
    }

    private handleWheel = (event: WheelEvent) => {
        if (this.enableZoom === false) return
        event.preventDefault()
        this.dispatchEvent(_startEvent)

        if (event.deltaY < 0) {
            this.dollyIn(this.getZoomScale())
        } else {
            this.dollyOut(this.getZoomScale())
        }
        this.update()

        this.dispatchEvent(_endEvent)
    }

    private handleMouseDownDolly = (event: MouseEvent) => {
        this.dollyStart.set(event.clientX, event.clientY)
    }

    private handleMouseDownRotate = (event: MouseEvent) => {
        this.rotateStart.set(event.clientX, event.clientY)
    }

    private handleMouseDownPan = (event: MouseEvent) => {
        this.panStart.set(event.clientX, event.clientY)
    }

    private handleMouseMoveRotate = (event: MouseEvent) => {
        this.rotateEnd.set(event.clientX, event.clientY)
        this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed)
        this.rotateLeft(2 * Math.PI * this.rotateDelta.x / this.domElement.clientHeight)
        this.rotateUp(2 * Math.PI * this.rotateDelta.y / this.domElement.clientHeight)
        this.rotateStart.copy(this.rotateEnd)
        this.update()
    }

    private handleMouseMoveDolly = (event: MouseEvent) => {
        this.dollyEnd.set(event.clientX, event.clientY)
        this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)
        if (this.dollyDelta.y > 0) {
            this.dollyOut(this.getZoomScale())
        } else if (this.dollyDelta.y < 0) {
            this.dollyIn(this.getZoomScale())
        }
        this.dollyStart.copy(this.dollyEnd)
        this.update()
    }

    private handleMouseMovePan = (event: MouseEvent) => {
        this.panEnd.set(event.clientX, event.clientY)
        this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.panSpeed)
        this.pan(this.panDelta.x, this.panDelta.y)
        this.panStart.copy(this.panEnd)
        this.update()
    }

    private handleMouseDown = (event: MouseEvent) => {
        event.preventDefault()
        this.domElement.focus()

        let mouseAction = -1
        switch (event.button) {
            case 0:
                switch (this._mode) {
                    case ControlsModeTypes.DEFAULT:
                        mouseAction = -1
                        break
                    default:
                        mouseAction = this._mode
                        break
                }
                break
            case 1:
                mouseAction = this.mouseButtons.MIDDLE
                break
            case 2:
                mouseAction = this.mouseButtons.RIGHT
                break
            default:
                mouseAction = -1
                break
        }

        switch (mouseAction) {
            case MOUSE.ROTATE:
                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    if (this.enablePan === false) return
                    this.handleMouseDownPan(event)
                    this.state = this.STATE.PAN
                } else {
                    if (this.enableRotate === false) return
                    this.handleMouseDownRotate(event)
                    this.state = this.STATE.ROTATE
                }
                break
            case MOUSE.DOLLY:
                if (this.enableZoom === false) return
                this.handleMouseDownDolly(event)
                this.state = this.STATE.DOLLY
                break
            case MOUSE.PAN:
                if (event.ctrlKey || event.metaKey || event.shiftKey) {
                    if (this.enableRotate === false) return
                    this.handleMouseDownRotate(event)
                    this.state = this.STATE.ROTATE
                } else {
                    if (this.enablePan === false) return
                    this.handleMouseDownPan(event)
                    this.state = this.STATE.PAN
                }
                break
            default:
                break
        }

        if (this.state !== this.STATE.NONE) {
            this.domElement.ownerDocument.addEventListener('pointermove', this.handlePointerMove)
            this.domElement.ownerDocument.addEventListener('pointerup', this.handlePointerUp)
            this.dispatchEvent(_startEvent)
        }
    }

    private handleMouseMove = (event: MouseEvent) => {
        if (this.enabled === false) return
        event.preventDefault()
        switch (this.state) {
            case this.STATE.ROTATE:
                if (this.enableRotate === false) return
                this.handleMouseMoveRotate(event)
                break
            case this.STATE.DOLLY:
                if (this.enableZoom === false) return
                this.handleMouseMoveDolly(event)
                break
            case this.STATE.PAN:
                if (this.enablePan === false) return
                this.handleMouseMovePan(event)
                break
        }
    }

    private handleMouseUp = (_: MouseEvent) => {
        this.domElement.ownerDocument.removeEventListener('pointermove', this.handlePointerMove)
        this.domElement.ownerDocument.removeEventListener('pointerup', this.handlePointerUp)
        if (this.enabled === false) return

        this.dispatchEvent(_endEvent)
        this.state = this.STATE.NONE
    }

    private handlePointerDown = (event: PointerEvent) => {
        if (this.enabled === false) return

        switch (event.pointerType) {
            case 'mouse':
            case 'pen':
                this.handleMouseDown(event)
                break
            default:
                console.warn(`WARNING: SingleOrbitControls - ${event.pointerType} is not supported`)
                break
        }
    }

    private handlePointerMove = (event: PointerEvent) => {
        if (this.enabled === false) return
        switch (event.pointerType) {
            case 'mouse':
            case 'pen':
                this.handleMouseMove(event)
                break
            default:
                console.warn(`WARNING: SingleOrbitControls - ${event.pointerType} is not supported`)
                break
        }
    }

    private handlePointerUp = (event: PointerEvent) => {
        if (this.enabled === false) return
        switch (event.pointerType) {
            case 'mouse':
            case 'pen':
                this.handleMouseUp(event)
                break
            default:
                console.warn(`WARNING: SingleOrbitControls - ${event.pointerType} is not supported`)
                break
        }
    }


    //
    public getPolarAngle = () => {
        return this.spherical.phi
    }

    public getAzimuthalAngle = () => {
        return this.spherical.theta
    }

    public saveState = () => {
        this.target0.copy(this.target)
        this.position0.copy(this.camera.position)
        this.zoom0 = this.camera.zoom
    }

    public reset = () => {
        this.target.copy(this.target0)
        this.camera.position.copy(this.position0)
        this.camera.zoom = this.zoom0

        this.camera.updateProjectionMatrix()
        this.dispatchEvent(_changeEvent)

        this.update()

        this.state = this.STATE.NONE
    }

    public dispose = () => {
        this.domElement.addEventListener('contextmenu', this.handleContextMenu)
        this.domElement.addEventListener('wheel', this.handleWheel)
        this.domElement.addEventListener('pointerdown', this.handlePointerDown)
        this.domElement.ownerDocument.addEventListener('pointermove', this.handlePointerMove)
        this.domElement.ownerDocument.addEventListener('pointerup', this.handlePointerUp)
    }

    public get mode() {
        return this._mode
    }

    public set mode(num: ControlsModeValue) {
        this._mode = num
    }
}

export default SingleOrbitControls
