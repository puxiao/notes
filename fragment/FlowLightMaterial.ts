import { ShaderMaterial, Texture, TextureLoader, Vector3 } from "three";

const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `

const fragmentShader = `
    uniform float time;
    uniform vec3 flowDirection;
    uniform vec3 flowColor;
    uniform float flowSpeed;
    uniform float flowWidth;
    uniform sampler2D baseTexture;
    uniform sampler2D noiseTexture;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {

        vec4 baseColor = texture2D(baseTexture, vUv);

        vec2 noiseUV = vUv + time * 0.05;
        float noise = texture2D(noiseTexture, noiseUV).r * 0.5;
        
        float flowOffset = dot(normalize(flowDirection), vPosition);
        float phase = fract((flowOffset + time * flowSpeed) / 5.0);

        float flowStrength = smoothstep(0.0, flowWidth, phase) * smoothstep(flowWidth * 2.0, flowWidth, phase);
        flowStrength *= (0.3 + noise * 0.5);
        
        vec3 finalColor = baseColor.rgb + flowColor * flowStrength;
        
        gl_FragColor = vec4(finalColor, baseColor.a);
    }
    `

const defaultBaseTexture = new TextureLoader().load('./webfiles/baseTexture.jpg')
const defaultNoiseTexture = new TextureLoader().load('./webfiles/noiseTexture.jpg')

interface FlowLightMaterialOptions {
    addValue?: number
    time?: number
    direction?: Vector3
    color?: Vector3
    speed?: number
    width?: number
    baseTexture?: Texture
    noiseTexture?: Texture
    transparent?: boolean
}

class FlowLightMaterial extends ShaderMaterial {

    private _addValue: number = 0.1

    constructor(options?: FlowLightMaterialOptions) {

        const {
            addValue = 0.1,
            time = 0,
            direction = new Vector3(0, 1, 0),
            color = new Vector3(0.3, 0.7, 1.0),
            speed = 0.5,
            width = 0.3,
            baseTexture = defaultBaseTexture,
            noiseTexture = defaultNoiseTexture,
            transparent = true
        } = options || {}

        super({
            uniforms: {
                time: { value: time },
                flowDirection: { value: direction }, // 流动方向
                flowColor: { value: color }, // 发光颜色 (蓝色)
                flowSpeed: { value: speed }, // 流速
                flowWidth: { value: width }, // 光线宽度
                baseTexture: { value: baseTexture }, // 基础贴图
                noiseTexture: { value: noiseTexture } // 噪声贴图
            },
            vertexShader,
            fragmentShader,
            transparent,
        })

        this._addValue = addValue
    }

    update() {
        this.uniforms.time.value += this._addValue
    }
}

export default FlowLightMaterial
