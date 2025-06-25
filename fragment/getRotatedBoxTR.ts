function getRotatedBoxTR (left: number, top: number, width: number, height: number, rotationDegrees: number) {

    const cx = left + width / 2;
    const cy = top + height / 2;
    const radians = rotationDegrees * (Math.PI / 180);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const corners = [
        { x: -width / 2, y: -height / 2 },
        { x: width / 2, y: -height / 2 },
        { x: width / 2, y: height / 2 },
        { x: -width / 2, y: height / 2 }
    ];

    let minY = Infinity;
    let maxX = -Infinity;

    corners.forEach(corner => {
        const x = cx + (corner.x * cos - corner.y * sin);
        const y = cy + (corner.x * sin + corner.y * cos);
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
    });

    return { top: minY, right: maxX };
}

export default getRotatedBoxTR
