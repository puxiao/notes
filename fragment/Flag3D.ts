import {
    AmbientLight,
    BufferGeometry,
    ClampToEdgeWrapping,
    EventDispatcher,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene,
    SRGBColorSpace,
    TextureLoader,
    Timer,
} from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { WebGPURenderer } from "three/webgpu";

interface Flag3DEventMap {
    ready: unknown;
}

type SizeMode = "width" | "height" | "contain" | "cover";

interface Flag3DOptions {
    lightIntensity: number;
    widthSeg: number;
    heightSeg: number;
    amplitude: number;
    waveSpeed: number;
    waveFreqX: number;
    waveFreqY: number;
    sizeMode: SizeMode;
}

const defaultOptions: Flag3DOptions = {
    lightIntensity: 3,
    widthSeg: 24,
    heightSeg: 24,
    amplitude: 0.35,
    waveSpeed: 1.8,
    waveFreqX: 2.5,
    waveFreqY: 0.8,
    sizeMode: "contain",
};

class Flag3D extends EventDispatcher<Flag3DEventMap> {
    private _flagWidth: number;
    private _flagHeight: number;
    private _planeWidth: number;
    private _planeHeight: number;
    private _options: Flag3DOptions;

    private _canvas: HTMLCanvasElement;
    private _scene: Scene;
    private _camera: PerspectiveCamera;
    private _renderer: WebGPURenderer;
    private _controls: OrbitControls;

    private _planeGeometry: BufferGeometry;
    private _planeMaterial: MeshStandardMaterial;
    private _planeMesh: Mesh;
    private _originalPositions: Float32Array;

    private _totalPositions: number;

    private _timer: Timer;
    private _ready: boolean;

    constructor(canvas: HTMLCanvasElement, flagWidth: number, flagHeight: number, textureUrl: string, options?: Partial<Flag3DOptions>) {
        super();

        this._canvas = canvas;
        this._flagWidth = flagWidth;
        this._flagHeight = flagHeight;
        this._planeWidth = flagWidth / 100;
        this._planeHeight = flagHeight / 100;
        this._options = { ...defaultOptions, widthSeg: Math.round(flagWidth / 10), heightSeg: Math.round(flagHeight / 10), ...options };

        this._scene = new Scene();

        const ambientLight = new AmbientLight(0xffffff, this._options.lightIntensity);
        this._scene.add(ambientLight);

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        this._camera = new PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
        this._camera.lookAt(0, 0, 0);
        this._camera.position.set(
            0,
            0,
            this.calcCameraZ(
                this._planeWidth,
                this._planeHeight,
                this._flagWidth,
                this._flagHeight,
                canvasWidth,
                canvasHeight,
                this._camera.fov,
                this._options.sizeMode,
            ),
        );

        this._renderer = new WebGPURenderer({
            canvas,
            antialias: true,
        });
        this._renderer.setPixelRatio(1);
        this._renderer.setSize(canvasWidth, canvasHeight);

        this._controls = new OrbitControls(this._camera, this._canvas);
        this._controls.target.set(0, 0, 0);
        this._controls.update();

        this._planeGeometry = new PlaneGeometry(this._planeWidth, this._planeHeight, this._options.widthSeg, this._options.heightSeg);

        if (this._planeGeometry.attributes.position) {
            this._totalPositions = this._planeGeometry.attributes.position.count;
            this._originalPositions = new Float32Array(this._totalPositions * 3);
            this._originalPositions.set(this._planeGeometry.attributes.position.array);
        } else {
            throw new Error("Flag3D: position attribute not found");
        }

        this._planeMaterial = new MeshStandardMaterial({
            transparent: true,
        });

        this._planeMesh = new Mesh(this._planeGeometry, this._planeMaterial);
        this._scene.add(this._planeMesh);

        this._timer = new Timer();
        this._timer.connect(document);
        this._ready = false;

        const textLoader = new TextureLoader();
        textLoader.load(
            textureUrl,
            (texture) => {
                texture.wrapS = ClampToEdgeWrapping;
                texture.wrapT = ClampToEdgeWrapping;
                texture.repeat.set(1, 1);
                texture.anisotropy = 4;
                texture.colorSpace = SRGBColorSpace;

                this._planeMaterial.map = texture;

                this._ready = true;
                this.dispatchEvent({
                    type: "ready",
                });
            },
            undefined,
            (err) => {
                console.error(err);
            },
        );
    }

    private calcCameraZ = (
        planeW: number,
        planeH: number,
        targetW: number,
        targetH: number,
        canvasW: number,
        canvasH: number,
        fov: number,
        mode: SizeMode = "contain",
    ): number => {
        const fovRad = (fov * Math.PI) / 180;
        const aspect = canvasW / canvasH;
        const tanHalfFov = Math.tan(fovRad / 2);

        const zForWidth = (planeW * canvasW) / (2 * targetW * tanHalfFov * aspect);
        const zForHeight = (planeH * canvasH) / (2 * targetH * tanHalfFov);

        switch (mode) {
            case "width":
                return zForWidth;
            case "height":
                return zForHeight;
            case "contain":
                return Math.min(zForWidth, zForHeight);
            case "cover":
                return Math.max(zForWidth, zForHeight);
            default:
                return Math.min(zForWidth, zForHeight);
        }
    };

    private updateWave = (elapsedTime: number) => {
        if (this._planeGeometry.attributes.position === undefined) return;
        const nowPositions = this._planeGeometry.attributes.position.array as Float32Array;

        // 原始 y 范围 -flagHeight/2 ~ +flagHeight/2，顶部固定: 当 y 接近 +flagHeight/2 时位移为0
        const top = this._planeHeight / 2;
        const bottom = -this._planeHeight / 2;

        for (let i = 0; i < this._totalPositions; i++) {
            const i3 = i * 3;
            const origX = this._originalPositions[i3] as number;
            const origY = this._originalPositions[i3 + 1] as number;

            // 归一化高度因子: 0在底部，1在顶部 (顶部固定)
            const heightFactor = (origY - bottom) / (top - bottom); // 0~1
            // 顶部固定，底部最大位移
            const displacementFactor = 1 - heightFactor; // 0~1

            // 波浪: 使用两个正弦波叠加
            const wave1 = Math.sin(this._options.waveFreqX * origX + elapsedTime * this._options.waveSpeed);
            const wave2 = Math.cos(this._options.waveFreqY * origY * 1.2 + elapsedTime * this._options.waveSpeed * 0.5);

            // 赋值给 z 坐标
            nowPositions[i3 + 2] = this._options.amplitude * displacementFactor * (wave1 * 0.7 + wave2 * 0.3);
        }
        this._planeGeometry.attributes.position.needsUpdate = true;
        this._planeGeometry.computeVertexNormals();
    };

    private render = () => {
        this._timer.update();
        this.updateWave(this._timer.getElapsed());
        this._controls.update(this._timer.getDelta());
        this._renderer.render(this._scene, this._camera);
    };

    public get canvas() {
        return this._canvas;
    }

    public get ready() {
        return this._ready;
    }

    public get waveSpeed() {
        return this._options.waveSpeed;
    }

    public set waveSpeed(value: number) {
        this._options.waveSpeed = value;
    }

    public showFlash = () => {};

    public startRender = () => {
        void this._renderer.setAnimationLoop(this.render);
    };

    public stopRender = () => {
        void this._renderer.setAnimationLoop(null);
    };

    public destory = () => {
        this.stopRender();
        this._timer.disconnect?.();
        this._controls.dispose();
        this._planeGeometry.dispose();
        this._planeMaterial.dispose();
        this._planeMaterial.map?.dispose();
        this._renderer.dispose();
        this._scene.clear();
    };
}

export default Flag3D;
