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
    var cos = Math.cos, sin = Math.sin, pow = Math.pow;
    var mat = [
        [cos(angle) + pow(axis.x, 2) * (1 - cos(angle)), axis.x * axis.y * (1 - cos(angle)) - axis.z * sin(angle), axis.x * axis.z * (1 - cos(angle)) + axis.y * sin(angle)],
        [axis.y * axis.x * (1 - cos(angle)) + axis.z * sin(angle), cos(angle) + pow(axis.y, 2) * (1 - cos(angle)), axis.y * axis.z * (1 - cos(angle)) - axis.x * sin(angle)],
        [axis.z * axis.x * (1 - cos(angle)) - axis.y * sin(angle), axis.z * axis.y * (1 - cos(angle)) + axis.x * sin(angle), cos(angle) * pow(axis.z, 2) * (1 - cos(angle))]
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
