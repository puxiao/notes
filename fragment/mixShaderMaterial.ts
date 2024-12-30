import { ShaderMaterial, Texture } from "three";

const baseTexture = new TextureLoader.load('./xx.png') //底层的、基础的纹理
const coverTexture = new TextureLoader.load('./yy.png') //覆盖在 baseTexture 之上的纹理

//自定义着色器材质：混合叠加 2 个纹理
const minxShaderMaterial = new ShaderMaterial({
    uniforms: {
        baseTexture: { value: baseTexture },
        coverTexture: { value: coverTexture },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D baseTexture;
        uniform sampler2D canvasTexture;

        void main() {
            vec4 color1 = texture2D(baseTexture, vUv);
            vec4 color2 = texture2D(coverTexture, vUv);
            gl_FragColor = mix(color1, color2, color2.a);
        }
    `,
})
