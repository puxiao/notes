const renderer = new WebGLRenderer({ ... })
const camera = new PerspectiveCamera()

const sceneA = new Scene()
sceneA.background = new Color(0x000000)

const sceneB = new Scene()
sceneB.background = null

const composer = new EffectComposer(renderer)

const basePass = new RenderPass(sceneA, camera)
basePass.renderToScreen = false
composer.addPass(basePass)

const overPass = new RenderPass(sceneB, camera)
overPass.ignoreBackground = true

//特别注意：第2个参数设置为 true 即清空前面一个层 basePass 的深度
//若不设置则前面一个层 basePass 最终将不生效(被忽略掉)
overPass.clearPass.setClearFlags(false, true, false) 

overPass.enabled = true //当后期设置为 false 时则停用该层
composer.addPass(overPass)

const outlineEffect = new OutlineEffect(sceneB, camera, { ... })
const smaaEffect = new SMAAEffect()
composer.addPass(new EffectPass(camera, outlineEffect, smaaEffect ))
