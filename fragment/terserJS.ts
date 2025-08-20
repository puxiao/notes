import { readFileSync, writeFileSync } from 'node:fs'
import { minify } from 'terser'

const jsList = [
    './xx/aa.js',
    './xx/bb.js',
    './xx/cc.js'
]

async function obfuscateFile (filePath: string) {
    try {
        // 1. 读取原始代码
        const code = readFileSync(filePath, 'utf8');

        // 2. 调用 Terser 混淆代码
        const result = await minify(code, {
            compress: true,
            mangle: {
                toplevel: true,
                keep_fnames: false,
                keep_classnames: false,
            },
            output: {
                beautify: false,
                comments: false,
            },
        })

        if (result.code === undefined) {
            console.error("❌ 混淆失败:");
            return
        }

        // 3. 写入混淆后的文件
        writeFileSync(filePath, result.code)
        console.log(`✅ 混淆完成: ${filePath}`)

    } catch (err) {
        console.error("❌ 混淆失败:", err)
    }
}

for (let i = 0; i < jsList.length; i++) {
    await obfuscateFile(jsList[i])
}

console.log("✅ 全部混淆完成")
