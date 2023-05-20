interface Position {
  x: number
  y: number
}

//向量归一化
const normalize = (vec2: Position): Position => {
  const { x, y } = vec2
  const length = Math.sqrt(x * x + y * y)
  return { x: x / length, y: y / length }
}

//点乘
const dot = (a: Position, b: Position): number => {
  return a.x * b.x + a.y * b.y
}

//叉乘
const cross = (a: Position, b: Position): number => {
  return a.x * b.y - b.x * a.y
}

//两条向量之间的夹角
const angleTo = (a: Position, b: Position): number => {
  return Math.atan2(cross(a, b), dot(a, b))
}

//线段长度
const length = (a: Position): number => {
  return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2))
}

export const vec2 = {
  normalize,
  dot,
  cross,
  length,
  angleTo
}


//需求描述：
//在一个 2D 坐标平面中，假设已知 A、B、C 三个点的坐标分别为 (x1,y1)、(x2,y2)、(x3,y3)，需要计算出另外两个点 D、E 的坐标，需要满足以下条件：
//1、ABDE 可以构成一个矩形，且 AB 为该矩形的 2 个端点
//2、C 必须在 BD 或 BD 的延长线上

export const getObliqueRectOtherPoints = (a: Position, b: Position, c: Position): [Position, Position] => {

  const x1 = a.x
  const y1 = a.y
  const x2 = b.x
  const y2 = b.y
  const x3 = c.x
  const y3 = c.y

  const vecBA = { x: x1 - x2, y: y1 - y2 }
  const vecBC = { x: x3 - x2, y: y3 - y2 }
  const angleABC = vec2.angleTo(vec2.normalize(vecBA), vec2.normalize(vecBC))
  const angleCBT = Math.PI - angleABC
  const angleCBD = angleABC - Math.PI / 2

  const lengthBD = Math.sin(angleCBT) * vec2.length(vecBC) //同时也是 lengthCT、lengthAE 的线段长度

  //假定此刻有一个虚构的点 M，其坐标为 x2,y3
  const angleCBM = vec2.angleTo(vec2.normalize({ x: x3 - x2, y: y3 - y2 }), vec2.normalize({ x: x2 - x2, y: y3 - y2 }))
  const angleMBD = angleCBD + angleCBM

  const addNum = y3 > y2 ? 1 : -1

  //计算出 D 的坐标 x4,y4
  const x4 = x2 + addNum * Math.sin(angleMBD) * lengthBD
  const y4 = y2 + addNum * Math.cos(angleMBD) * lengthBD

  //计算出 E 的坐标 x4,y4
  const x5 = x1 + (x4 - x2)
  const y5 = y1 + (y4 - y2)

  return [{ x: x4, y: y4 }, { x: x5, y: y5 }] // [ D, E ] 坐标

}
