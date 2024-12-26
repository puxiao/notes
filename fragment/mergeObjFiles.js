import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

function readMtlFile (mtlPath) {
    try {
        const content = readFileSync(mtlPath, 'utf8');
        return content;
    } catch (err) {
        console.warn(`警告: 无法读取材质文件 ${mtlPath}`);
        return null;
    }
}

/**
 * @param {string[]} inputFiles - 输入文件路径数组，顺序将决定group的索引
 * @param {string} outputFile - 输出文件路径
 * @param {string[]} [] - group名称列表
 * @param {string} [groupPrefix='area'] - group名称缺省前缀
 */
async function mergeObjFiles (inputFiles, outputFile, groupNames = [], groupPrefix = 'area') {
    // 用于存储当前的偏移量
    let vertexOffset = 0;
    let textureOffset = 0;
    let normalOffset = 0;

    // 存储所有材质文件的内容
    const allMaterials = new Set();
    const materialContents = new Map();
    const outputMtlFileName = path.basename(outputFile, '.obj') + '.mtl';
    const outputDir = path.dirname(outputFile);
    const outputMtlFilePath = path.join(outputDir, outputMtlFileName);

    // 创建输出流
    let outputContent = '# Merged OBJ file\n';
    outputContent += `# Generated with indexed groups for external userData mapping\n\n`;

    // 添加：先检查所有输入文件是否包含材质信息
    let hasMaterials = false;
    for (const inputFile of inputFiles) {
        const content = readFileSync(inputFile, 'utf8');
        if (content.includes('mtllib ') || content.includes('usemtl ')) {
            hasMaterials = true;
            break;
        }
    }

    // 只有在存在材质时才添加 mtllib 声明
    if (hasMaterials) {
        outputContent += `mtllib ${outputMtlFileName}\n\n`;
    }

    // 处理每个输入文件
    for (let fileIndex = 0; fileIndex < inputFiles.length; fileIndex++) {
        const inputFile = inputFiles[fileIndex];
        const inputDir = path.dirname(inputFile);
        try {
            const content = readFileSync(inputFile, 'utf8');
            const lines = content.split('\n');

            // 为每个文件创建一个带索引的组
            const groupName = groupNames[fileIndex] || `${groupPrefix}_${fileIndex}`;
            outputContent += `\n# Original file: ${path.basename(inputFile)}\n`;
            outputContent += `# Group index: ${fileIndex}\n`;
            outputContent += `g ${groupName}\n`;

            // 计数器
            let currentFileStats = {
                vertices: 0,
                textures: 0,
                normals: 0
            };

            // 只在有材质的情况下处理材质库引用
            if (hasMaterials) {
                for (const line of lines) {
                    if (line.startsWith('mtllib ')) {
                        const mtlFile = line.split(' ')[1].trim();
                        const mtlPath = path.join(inputDir, mtlFile);
                        const mtlContent = readMtlFile(mtlPath);

                        if (mtlContent) {
                            const materialSections = mtlContent.split('newmtl ');
                            for (let section of materialSections) {
                                if (!section.trim()) continue;
                                if (section.startsWith('#')) continue;

                                // TODO: 检查不同 obj 文件对应的材质名称是否重复、检查材质中引入图片资源(名称)是否相同。当前暂时忽略这些检查
                                const materialName = section.split('\n')[0].trim();
                                if (!allMaterials.has(materialName)) {
                                    allMaterials.add(materialName);
                                    materialContents.set(materialName, `newmtl ${section}`);
                                }

                                // 拷贝材质中的图片资源
                                const lines = section.split('\n');
                                for (const line of lines) {
                                    if (line.startsWith('map_Kd ')) {
                                        const imagePath = line.split(' ')[1].trim();
                                        const imageSourcePath = path.join(inputDir, imagePath);
                                        const imageTargetPath = path.join(outputDir, imagePath);
                                        copyFileSync(imageSourcePath, imageTargetPath);
                                    }
                                }

                            }
                        }
                    }
                }
            }

            // 写入顶点数据
            for (const line of lines) {
                if (line.startsWith('v ')) {
                    outputContent += line + '\n';
                    currentFileStats.vertices++;
                } else if (line.startsWith('vt ')) {
                    outputContent += line + '\n';
                    currentFileStats.textures++;
                } else if (line.startsWith('vn ')) {
                    outputContent += line + '\n';
                    currentFileStats.normals++;
                }
            }

            // 处理组、对象名称和面数据
            let currentGroup = null;
            for (const line of lines) {
                if (line.startsWith('g ') || line.startsWith('o ')) {
                    // 为组名添加文件名前缀，避免冲突
                    const prefix = path.basename(inputFile, '.obj');
                    const groupName = line.split(' ')[1].trim();
                    currentGroup = `${prefix}_${groupName}`;
                    outputContent += `g ${currentGroup}\n`;
                } else if (hasMaterials && line.startsWith('usemtl ')) {
                    // 保持材质引用不变
                    outputContent += line + '\n';
                } else if (line.startsWith('f ')) {
                    const parts = line.trim().split(' ');
                    const newFace = ['f'];

                    // 处理每个顶点的索引
                    for (let i = 1; i < parts.length; i++) {
                        const indices = parts[i].split('/');
                        const newIndices = indices.map((index, j) => {
                            if (!index) return '';
                            const value = parseInt(index);
                            switch (j) {
                                case 0: return (value + vertexOffset).toString();
                                case 1: return (value + textureOffset).toString();
                                case 2: return (value + normalOffset).toString();
                                default: return index;
                            }
                        });
                        newFace.push(newIndices.join('/'));
                    }
                    outputContent += newFace.join(' ') + '\n';
                }
            }

            // 更新偏移量
            vertexOffset += currentFileStats.vertices;
            textureOffset += currentFileStats.textures;
            normalOffset += currentFileStats.normals;

        } catch (err) {
            console.error(`处理文件 ${inputFile} 时出错:`, err);
            throw err;
        }
    }

    // 只在有材质的情况下生成材质文件
    if (hasMaterials && materialContents.size > 0) {
        let mtlOutput = '# Merged MTL file\n';
        for (const [materialName, content] of materialContents) {
            mtlOutput += `\n# Material: ${materialName}\n`;
            mtlOutput += content + '\n';
        }
        writeFileSync(outputMtlFilePath, mtlOutput);
    }

    // 写入合并后的文件
    writeFileSync(outputFile, outputContent);

    return {
        vertexCount: vertexOffset,
        textureCount: textureOffset,
        normalCount: normalOffset,
        groupCount: inputFiles.length,
        hasMaterials: hasMaterials,
        materialCount: allMaterials.size
    };
}

export default mergeObjFiles
