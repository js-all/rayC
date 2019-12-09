function Rotate3d(point: Vector, x: number, y: number, z: number) {
    const { cos, sin } = Math;
    const matX: number[][] = [
        [1, 0, 0],
        [0, cos(x), -(sin(x))],
        [0, sin(x), cos(x)]
    ];
    const matY: number[][] = [
        [cos(y), 0, sin(y)],
        [0, 1, 0],
        [-(sin(y)), 0, cos(y)]
    ];
    const matZ: number[][] = [
        [cos(z), -(sin(z)), 0],
        [sin(z), cos(z), 0],
        [0, 0, 1]
    ];
    const res = multiplyMatrices(matZ, multiplyMatrices(matY, multiplyMatrices(matX, [[point.x], [point.y], [point.z]])));
    return new Vector(res[0][0], res[1][0], res[2][0]);
}

function multiplyMatrices(a: number[][], b: number[][]) {
    var x = a.length,
        z = a[0].length,
        y = b[0].length;

    if (b.length !== z) {
        // XxZ & ZxY => XxY
        throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
    }

    var productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    var product: number[][] = new Array(x);
    for (var p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }

    for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
            for (let k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return product;
}
