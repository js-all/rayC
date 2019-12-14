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

function Rotate3dArroundPoint(point: Vector, origin: Vector, x: number, y: number, z: number) {
    return Rotate3d(point.subtract(origin), x, y, z).add(origin);
}

function Rotate3dArroundSpecAxis(point: Vector, axis: Vector, angle: number) {
    axis = axis.unit();
    const { x, y, z } = axis;
    const a = angle;
    const sq = (n: number) => Math.pow(n, 2);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const mat = [ /*
        [Math.cos(angle) + pow(axis.x, 2) * (1 - Math.cos(angle)), axis.x * axis.y * (1 - Math.cos(angle)) - axis.z * Math.sin(angle), axis.x * axis.z * (1 - Math.cos(angle)) + axis.y * Math.sin(angle)],
        [axis.y * axis.x * (1 - Math.cos(angle)) + axis.z * Math.sin(angle), Math.cos(angle) + pow(axis.y, 2) * (1 - Math.cos(angle)), axis.y * axis.z * (1 - Math.cos(angle)) - axis.x * Math.sin(angle)],
        [axis.z * axis.x * (1 - Math.cos(angle)) - axis.y * Math.sin(angle), axis.z * axis.y * (1 - Math.cos(angle)) + axis.x * Math.sin(angle), Math.cos(angle) * pow(axis.z, 2) * (1 - Math.cos(angle))]
        */
        [c + sq(x) * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
        [y * x * (1 - c) + z * s, c + sq(y) * (1 - c), y * z * (1 - c) - x * s],
        [z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + sq(z) * (1 - c)]

    ]
    const res = multiplyMatrices(mat, [[point.x], [point.y], [point.z]]);
    return new Vector(res[0][0], res[1][0], res[2][0]);
}

function Rotate3dArroundSpecAxisAndPoint(point: Vector, axis: Vector, origin: Vector, angle: number) {
    return Rotate3dArroundSpecAxis(point.subtract(origin), axis, angle).add(origin);
}

function multiplyMatrices(a: number[][], b: number[][]) {
    const x = a.length,
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
