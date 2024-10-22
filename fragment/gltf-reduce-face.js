//请注意下面是 Node.js 代码，采用 import 而非 require 方式引入，需要 package.json 中添加 { "type": "module" }

import { NodeIO } from "@gltf-transform/core"
import { ALL_EXTENSIONS } from "@gltf-transform/extensions"
import { simplify, weld } from "@gltf-transform/functions"
import draco3d from 'draco3dgltf'
import { MeshoptSimplifier } from "meshoptimizer"

//实例化一个 Node.js 中读写 GLTF 文件的 io 实例 
const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS) // 注册所有扩展
    .registerDependencies({
        //注册依赖
        'draco3d.decoder': await draco3d.createDecoderModule(),
        'draco3d.encoder': await draco3d.createEncoderModule(),
    })

//读取 GLTF 文件
const document = await io.read('./assets/body.gltf')

await document.transform(

    // weld: 合并接近的顶点，减少重复顶点
    weld({
        tolerance: 0.001  // 顶点合并的距离阈值
    }),

    // simplify: 简化网格
    simplify({
        simplifier: MeshoptSimplifier,  // 使用 Meshoptimizer 作为简化器
        ratio: 0.1,      // 期望保留的三角面数比例，0.1 即希望简化后保留 10% 的三角面数，注意这里仅仅是 "期望" 而非最终结果
        error: 0.001     // 最大允许误差
    })

)

//保存 gltf，同时会保存更新 .gltf 中对应的 .bin 中的数据
//你也可以将 body.gltf 修改为其他名称，但请注意 .gltf 中对应的 .bin 文件名称并不会自动同步更改
await io.write('./assets/body.gltf', document)
