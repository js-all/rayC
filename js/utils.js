"use strict";
function Rotate3d(point, x, y, z) {
    var cos = Math.cos, sin = Math.sin;
    var matX = [
        [1, 0, 0],
        [0, cos(x), -(sin(x))],
        [0, sin(x), cos(x)]
    ];
    var matY = [
        [cos(y), 0, sin(y)],
        [0, 1, 0],
        [-(sin(y)), 0, cos(y)]
    ];
    var matZ = [
        [cos(z), -(sin(z)), 0],
        [sin(z), cos(z), 0],
        [0, 0, 1]
    ];
    var res = multiplyMatrices(matZ, multiplyMatrices(matY, multiplyMatrices(matX, [[point.x], [point.y], [point.z]])));
    return new Vector(res[0][0], res[1][0], res[2][0]);
}
function Rotate3dArroundPoint(point, origin, x, y, z) {
    return Rotate3d(point.subtract(origin), x, y, z).add(origin);
}
function Rotate3dArroundSpecAxis(point, axis, angle) {
    axis = axis.unit();
    var x = axis.x, y = axis.y, z = axis.z;
    var a = angle;
    var sq = function (n) { return Math.pow(n, 2); };
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var mat = [
        [c + sq(x) * (1 - c), x * y * (1 - c) - z * s, x * z * (1 - c) + y * s],
        [y * x * (1 - c) + z * s, c + sq(y) * (1 - c), y * z * (1 - c) - x * s],
        [z * x * (1 - c) - y * s, z * y * (1 - c) + x * s, c + sq(z) * (1 - c)]
    ];
    var res = multiplyMatrices(mat, [[point.x], [point.y], [point.z]]);
    return new Vector(res[0][0], res[1][0], res[2][0]);
}
function Rotate3dArroundSpecAxisAndPoint(point, axis, origin, angle) {
    return Rotate3dArroundSpecAxis(point.subtract(origin), axis, angle).add(origin);
}
function multiplyMatrices(a, b) {
    var x = a.length, z = a[0].length, y = b[0].length;
    if (b.length !== z) {
        // XxZ & ZxY => XxY
        throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
    }
    var productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
    var product = new Array(x);
    for (var p = 0; p < x; p++) {
        product[p] = productRow.slice();
    }
    for (var i = 0; i < x; i++) {
        for (var j = 0; j < y; j++) {
            for (var k = 0; k < z; k++) {
                product[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return product;
}
