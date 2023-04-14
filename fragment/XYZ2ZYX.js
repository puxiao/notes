// XYZ 坐标系转 ZYX 坐标系

const eulerXYZ = new Euler(Math.PI / 4, Math.PI / 3, Math.PI / 6)
const eulerZYX = new Euler(Math.PI / 6, Math.PI / 3, Math.PI / 4, 'ZYX')
const rotationMatrixXYZ = new Matrix4().makeRotationFromEuler(eulerXYZ)
const rotationMatrixZYX = new Matrix4().makeRotationFromEuler(eulerZYX)
const rotationMatrix = new Matrix4().multiplyMatrices(rotationMatrixZYX, rotationMatrixXYZ)

//将 XYZ 坐标系中的一个四维矩阵 matrix4 转换成 ZYX 坐标系
matrix4.multiply(rotationMatrix)
