import { Quaternion, Vector3, Matrix4 } from "three";

// 重用对象以避免频繁创建新实例
const _posA = new Vector3();
const _quatA = new Quaternion();
const _scaleA = new Vector3();
const _posB = new Vector3();
const _quatB = new Quaternion();
const _scaleB = new Vector3();
const _pos = new Vector3();
const _quat = new Quaternion();
const _scale = new Vector3();

const interpolateMatrix4 = (matrixA: Matrix4, matrixB: Matrix4, t: number, matrix?: Matrix4) => {
    const resultMatrix = matrix || new Matrix4();

    // 从矩阵中提取位置、旋转和缩放
    matrixA.decompose(_posA, _quatA, _scaleA);
    matrixB.decompose(_posB, _quatB, _scaleB);

    // 插值计算
    _pos.lerpVectors(_posA, _posB, t);
    _quat.slerpQuaternions(_quatA, _quatB, t);
    _scale.lerpVectors(_scaleA, _scaleB, t);

    // 组合成新矩阵
    return resultMatrix.compose(_pos, _quat, _scale);
}

export default interpolateMatrix4;
