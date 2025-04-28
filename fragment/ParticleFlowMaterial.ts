import { MeshStandardMaterial, RepeatWrapping, Texture, type MeshStandardMaterialParameters } from "three";

interface ParticleFlowMaterialOptions extends MeshStandardMaterialParameters {
    map: Texture
    flowUp?: boolean
    flowInverse?: boolean
    flowSpeed?: number
    particleSize?: number
}

class ParticleFlowMaterial extends MeshStandardMaterial {

    private _flowUp: boolean
    private _flowInverse: boolean
    private _flowSpeed: number
    private _particleSize: number

    constructor(options: ParticleFlowMaterialOptions) {

        const baseOptions = { ...options }
        delete baseOptions.flowUp
        delete baseOptions.flowInverse
        delete baseOptions.flowSpeed
        delete baseOptions.particleSize

        super({
            alphaTest: 0,
            transparent: true,  // 启用透明
            depthWrite: false,  // 对于粒子效果通常禁用深度写入
            // depthTest: false, // 禁止深度测试
            ...baseOptions,
            // blending: options.blending || AdditiveBlending,  // 使用加法混合使粒子更亮
            // emissive: (options.emissive || 0xffffff), // 发光色
            // emissiveIntensity: options.emissiveIntensity || 0.5, // 发光强度
            // color: options.color || 0xffffff // 使用更鲜艳的颜色，比如青色
        })

        this._particleSize = options.particleSize || 8

        this.map = options.map
        this.map.wrapS = this.map.wrapT = RepeatWrapping
        this.map.repeat.set(this._particleSize, this._particleSize)
        this.map.needsUpdate = true

        this._flowUp = options.flowUp || false
        this._flowInverse = options.flowInverse || false
        this._flowSpeed = options.flowSpeed || 0.02

    }

    public update = () => {
        if (this.map === null) return
        if (this._flowUp) {
            if (this._flowInverse) {
                this.map.offset.y -= this._flowSpeed
                if (this.map.offset.y < 0) this.map.offset.y = 1
            } else {
                this.map.offset.x -= this._flowSpeed
                if (this.map.offset.x < 0) this.map.offset.x = 1
            }
        } else {
            if (this._flowInverse) {
                this.map.offset.y += this._flowSpeed
                if (this.map.offset.y > 1) this.map.offset.y = 0
            } else {
                this.map.offset.x += this._flowSpeed
                if (this.map.offset.x > 1) this.map.offset.x = 0
            }
        }
    }
}

export default ParticleFlowMaterial
