import { copyFileSync, existsSync, mkdirSync, readdirSync, rmdirSync, statSync, unlinkSync } from "node:fs"
import path from "node:path"

const delDir = (path) => {
    let files = []
    if (existsSync(path)) {
        files = readdirSync(path)
        files.forEach((file) => {
            let curPath = path + "/" + file
            if (statSync(curPath).isDirectory()) {
                delDir(curPath)
            } else {
                unlinkSync(curPath)
            }
        })
        rmdirSync(path)
    }
}

const copyDir = (inputDir, outputDir) => {
    if (existsSync(inputDir)) {
        if (existsSync(outputDir)) {
            delDir(outputDir)
        }
        mkdirSync(outputDir, { recursive: true })
        const files = readdirSync(inputDir)
        files.forEach((file) => {
            const curInput = path.join(inputDir, file)
            const curOutput = path.join(outputDir, file)
            if (statSync(curInput).isDirectory()) {
                copyDir(curInput, curOutput)
            } else {
                copyFileSync(curInput, curOutput)
            }
        })
    }
}

const mergeDir = (inputDir, outputDir) => {
    if (existsSync(inputDir)) {
        if (existsSync(outputDir) === false) {
            mkdirSync(outputDir, { recursive: true })
        }
        const files = readdirSync(inputDir)
        files.forEach((file) => {
            const curInput = path.join(inputDir, file)
            const curOutput = path.join(outputDir, file)
            if (statSync(curInput).isDirectory()) {
                mergeDir(curInput, curOutput)
            } else {
                copyFileSync(curInput, curOutput)
            }
        })
    }
}

export {
    copyDir,
    delDir,
    mergeDir,
}
