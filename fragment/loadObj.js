import { readFileSync } from "node:fs";

/**
 * 解析 OBJ 文件并返回几何数据
 * @param {string} filePath - OBJ 文件路径
 * @returns {Object} 解析后的几何数据
 */
function parseOBJ (filePath) {
    // 读取文件内容
    const data = readFileSync(filePath, 'utf8');
    const lines = data.split('\n');

    // 存储几何数据
    const vertices = [];    // 顶点
    const normals = [];     // 法线
    const uvs = [];         // 纹理坐标
    const faces = [];       // 面
    const groups = [];      // 组/对象

    let currentGroup = null;
    let materialLib = null;
    let currentMaterial = null;

    // 逐行解析
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue; // 跳过注释和空行

        const parts = trimmedLine.split(/\s+/);
        const command = parts[0];

        switch (command) {
            case 'v': // 顶点
                vertices.push({
                    x: parseFloat(parts[1]),
                    y: parseFloat(parts[2]),
                    z: parseFloat(parts[3])
                });
                break;

            case 'vn': // 法线
                normals.push({
                    x: parseFloat(parts[1]),
                    y: parseFloat(parts[2]),
                    z: parseFloat(parts[3])
                });
                break;

            case 'vt': // 纹理坐标
                uvs.push({
                    u: parseFloat(parts[1]),
                    v: parseFloat(parts[2])
                });
                break;

            case 'f': // 面
                const face = {
                    vertexIndices: [],
                    uvIndices: [],
                    normalIndices: [],
                    material: currentMaterial
                };

                // 解析面的顶点数据 (格式可能是 v, v/vt, v/vt/vn, v//vn)
                for (let i = 1; i < parts.length; i++) {
                    const indices = parts[i].split('/');

                    // OBJ 索引从 1 开始，需要减 1 才能对应到数组索引
                    face.vertexIndices.push(parseInt(indices[0]) - 1);

                    if (indices[1] && indices[1].length > 0) {
                        face.uvIndices.push(parseInt(indices[1]) - 1);
                    }

                    if (indices[2] && indices[2].length > 0) {
                        face.normalIndices.push(parseInt(indices[2]) - 1);
                    }
                }

                faces.push(face);

                // 如果当前在某个组内，则将面添加到该组
                if (currentGroup) {
                    currentGroup.faces.push(faces.length - 1);
                }
                break;

            case 'g': // 组
            case 'o': // 对象
                currentGroup = {
                    name: parts[1] || `group_${groups.length}`,
                    faces: []
                };
                groups.push(currentGroup);
                break;

            case 'mtllib': // 材质库
                materialLib = parts[1];
                break;

            case 'usemtl': // 使用材质
                currentMaterial = parts[1];
                break;
        }
    }

    return {
        vertices,
        normals,
        uvs,
        faces,
        groups,
        materialLib
    };
}

/**
 * 将解析后的OBJ数据转换为可被Three.js使用的格式
 * @param {Object} objData - 解析后的OBJ数据
 * @returns {Object} Three.js兼容的几何数据
 */
function convertToThreeJSFormat (objData) {
    // 创建顶点位置数组
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];

    // 对于每个面
    objData.faces.forEach(face => {
        // 三角化多边形面（如果顶点数>3）
        for (let i = 0; i < face.vertexIndices.length - 2; i++) {
            // 三角形的三个顶点
            const vertices = [
                face.vertexIndices[0],
                face.vertexIndices[i + 1],
                face.vertexIndices[i + 2]
            ];

            // 添加索引
            indices.push(positions.length / 3, positions.length / 3 + 1, positions.length / 3 + 2);

            // 添加顶点位置
            vertices.forEach(vIdx => {
                const vertex = objData.vertices[vIdx];
                positions.push(vertex.x, vertex.y, vertex.z);
            });

            // 添加法线（如果有）
            if (face.normalIndices.length > 0) {
                const normalIndices = [
                    face.normalIndices[0],
                    face.normalIndices[i + 1],
                    face.normalIndices[i + 2]
                ];

                normalIndices.forEach(nIdx => {
                    if (nIdx !== undefined) {
                        const normal = objData.normals[nIdx];
                        normals.push(normal.x, normal.y, normal.z);
                    }
                });
            }

            // 添加UV（如果有）
            if (face.uvIndices.length > 0) {
                const uvIndices = [
                    face.uvIndices[0],
                    face.uvIndices[i + 1],
                    face.uvIndices[i + 2]
                ];

                uvIndices.forEach(uvIdx => {
                    if (uvIdx !== undefined) {
                        const uv = objData.uvs[uvIdx];
                        uvs.push(uv.u, uv.v);
                    }
                });
            }
        }
    });

    return {
        positions,
        normals: normals.length > 0 ? normals : null,
        uvs: uvs.length > 0 ? uvs : null,
        indices,
        groups: objData.groups.map(group => ({
            name: group.name,
            material: null // 材质处理需要单独加载MTL文件
        }))
    };
}

/**
 * 加载OBJ文件并返回解析后的几何数据
 * @param {string} filePath - OBJ文件路径
 * @returns {Promise<Object>} 解析后的几何数据
 */
function loadOBJ (filePath) {
    return new Promise((resolve, reject) => {
        try {
            const objData = parseOBJ(filePath);
            const geometryData = convertToThreeJSFormat(objData);
            resolve(geometryData);
        } catch (error) {
            reject(error);
        }
    });
}

export default loadOBJ
