const analysisRect = (points) => {

    const leftTop = points[0]
    const leftBottom = points[1]
    //const rightBottom = points[2]
    const rightTop = points[3]

    const width = Math.sqrt(Math.pow(rightTop.x - leftTop.x, 2) + Math.pow(rightTop.y - leftTop.y, 2))
    const height = Math.sqrt(Math.pow(leftBottom.x - leftTop.x, 2) + Math.pow(leftBottom.y - leftTop.y, 2))
    const center = {
        x: (leftBottom.x + rightTop.x) / 2,
        y: (leftBottom.y + rightTop.y) / 2
    }
    const angle = Math.atan((rightTop.y - leftTop.y) / (rightTop.x - leftTop.x))

    return {
        width,
        height,
        center,
        angle
    }
}

const getRectByOblique = (points) => {

    const fourPoints = points.slice(0, 8)

    const vectors = []

    for (let i = 0; i < fourPoints.length; i += 2) {
        vectors.push({ x: points[i], y: points[i + 1] })
    }

    const rects = []

    rects.push(analysisRect([vectors[0], vectors[1], vectors[2], vectors[3]]))
    rects.push(analysisRect([vectors[1], vectors[2], vectors[3], vectors[0]]))
    rects.push(analysisRect([vectors[2], vectors[3], vectors[0], vectors[1]]))
    rects.push(analysisRect([vectors[3], vectors[0], vectors[1], vectors[2]]))

    rects.sort((a, b) => {
        return Math.abs(a.angle) - Math.abs(b.angle)
    })

    return rects[0]

}

export default getRectByOblique
