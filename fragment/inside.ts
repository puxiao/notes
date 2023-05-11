type Point = [number, number] //实际为 [x,y]

//--------- 判断点是否在圆内部 ---------

type CircleData = {
    x: number,
    y: number,
    radius: number
}

type InsideCircle = (point: Point, circleAttrs: CircleData) => boolean
const insideCircle: InsideCircle = (point, circleAttrs) => {
    const [x, y] = point
    const distance = Math.sqrt(Math.pow(x - circleAttrs.x, 2) + Math.pow(y - circleAttrs.y, 2))
    return distance <= circleAttrs.radius
}

//--------- 判断点是否在椭圆内部 ---------

interface EllipseData {
    x: number,
    y: number,
    radiusX: number,
    radiusY: number
}

type InsideEllipse = (point: Point, ellipseData: EllipseData) => boolean
const insideEllipse: InsideEllipse = (point, ellipse) => {
    const [x, y] = point
    const distance = Math.sqrt(Math.pow(x - ellipse.x, 2) / Math.pow(ellipse.radiusX, 2) + Math.pow(y - ellipse.y, 2) / Math.pow(ellipse.radiusY, 2))
    return distance <= 1
}


//--------- 判断点是否在多边形内部 ---------

type InsidePolygon = (point: Point, polygon: Point[]) => boolean
const insidePolygon: InsidePolygon = (point, polygon) => {

    const [x, y] = point

    let inside = false;

    let j = polygon.length - 1

    let xi: number, yi: number, xj: number, yj: number

    let intersect: boolean

    for (let i = 0; i < polygon.length; j = i++) {

        xi = polygon[i][0]
        yi = polygon[i][1]

        xj = polygon[j][0]
        yj = polygon[j][1]

        intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

        if (intersect) {
            inside = !inside
        }
    }

    return inside
}


//--------- 判断点是否在折线的边上 ---------

//二维向量归一化
const normalize = (vec2: Point): Point => {
    const [x, y] = vec2
    const length = Math.sqrt(x * x + y * y)
    return [x / length, y / length]
}

//bias 为允许的夹角最小容差(弧度)，默认值为 0.1
type OnLine = (point: Point, line: Point[], bias?: number) => boolean
const onLine: OnLine = (point, line, bias = 0.1) => {

    const [x, y] = point

    let p1x: number, p1y: number, p2x: number, p2y: number

    for (let i = 0; i < line.length - 1; i++) {

        p1x = line[i][0]
        p1y = line[i][1]
        p2x = line[i + 1][0]
        p2y = line[i + 1][1]

        const p1 = line[i]
        const p2 = line[i + 1]

        const v1 = normalize([x - p1x, y - p1y])
        const v2 = normalize([p2x - p1x, p2y - p1y])

        const cross = v1[0] * v2[1] - v1[1] * v2[0]

        if (isNaN(cross) === false && Math.abs(cross) < bias &&
            (x >= Math.min(p1[0], p2[0]) && x <= Math.max(p1[0], p2[0])) &&
            (y >= Math.min(p1[1], p2[1]) && y <= Math.max(p1[1], p2[1]))) {
            return true;
        }
    }
    return false;
}


//--------- 判断点是否在矩形框的内部 ---------

//rectData: [左上角, 右下角]
type InsideRect = (point: Point, rectData: [Point, Point]) => boolean
const insideRect: InsideRect = (point, rectData) => {
    const [x, y] = point
    const x1 = rectData[0][0]
    const y1 = rectData[0][1]
    const x2 = rectData[1][0]
    const y2 = rectData[1][1]
    return x >= x1 && x <= x2 && y >= y1 && y <= y2
}


export default {
    insideCircle,
    insideEllipse,
    insidePolygon,
    onLine,
    insideRect
}
