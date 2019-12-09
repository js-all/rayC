"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Tris = /** @class */ (function () {
    function Tris(p1, p2, p3, color) {
        if (color === void 0) { color = rgb.blue; }
        this.points = [p1, p2, p3];
        this.color = color;
    }
    Tris.prototype.ray = function (origin, dirrection) {
        var l = {
            a: origin,
            b: dirrection,
            ab: dirrection.subtract(origin),
            mab: dirrection.subtract(origin).multiply(-1)
        };
        var p = {
            0: this.points[0],
            1: this.points[1],
            2: this.points[2],
            z1: this.points[1].subtract(this.points[0]),
            z2: this.points[2].subtract(this.points[0])
        };
        var t = ((p.z1.cross(p.z2)).dot(l.a.subtract(p[0]))) / (l.mab.dot(p.z1.cross(p.z2)));
        var u = ((p.z2.cross(l.mab)).dot(l.a.subtract(p[0]))) / (l.mab.dot(p.z1.cross(p.z2)));
        var v = ((l.mab.cross(p.z1)).dot(l.a.subtract(p[0]))) / (l.mab.dot(p.z1.cross(p.z2)));
        var bool = t >= 0;
        var res = {
            colliding: bool,
            distance: bool ? Math.sqrt(Math.pow(origin.x - dirrection.x, 2) + Math.pow(origin.y - dirrection.y, 2) + Math.pow(origin.z - dirrection.z, 2)) * t : null,
            location: bool ? l.a.add(l.ab.multiply(t)) : null
        };
        return res;
    };
    return Tris;
}());
var Primitive = /** @class */ (function () {
    function Primitive(points, faces, color) {
        this.points = points;
        this.faces = faces;
        this.colors = [];
        var n = 0;
        for (var _i = 0, _a = this.faces; _i < _a.length; _i++) {
            var i = _a[_i];
            var col = color !== undefined && color[n] !== undefined ? color[n] : rgb.blue;
            this.colors.push(col);
            n++;
        }
    }
    Object.defineProperty(Primitive.prototype, "tris", {
        get: function () {
            var res = [];
            var n = 0;
            for (var _i = 0, _a = this.faces; _i < _a.length; _i++) {
                var i = _a[_i];
                res.push(new Tris(this.points[i[0]], this.points[i[1]], this.points[i[2]], this.colors[n]));
                n++;
            }
            return res;
        },
        enumerable: true,
        configurable: true
    });
    return Primitive;
}());
var Cube = /** @class */ (function (_super) {
    __extends(Cube, _super);
    function Cube(corner, width, length, height, color) {
        if (color === void 0) { color = rgb.blue; }
        var _this = this;
        var colorArray = color instanceof rgb ? [color, color, color, color, color, color, color, color, color, color, color, color] : color;
        _this = _super.call(this, [
            corner.add(new Vector(0, 0, 0)),
            corner.add(new Vector(width, 0, 0)),
            corner.add(new Vector(width, length, 0)),
            corner.add(new Vector(0, length, 0)),
            corner.add(new Vector(0, 0, height)),
            corner.add(new Vector(width, 0, height)),
            corner.add(new Vector(width, length, height)),
            corner.add(new Vector(0, length, height)),
        ], [
            [0, 1, 2],
            [0, 3, 2],
            [1, 6, 7],
            [1, 2, 7],
            [3, 2, 7],
            [3, 5, 7],
            [1, 0, 4],
            [1, 6, 4],
            [0, 3, 5],
            [0, 4, 5],
            [4, 6, 7],
            [4, 5, 7]
        ], colorArray) || this;
        return _this;
    }
    return Cube;
}(Primitive));
var Camera = /** @class */ (function () {
    function Camera(position, fov, width, height, rotation) {
        if (rotation === void 0) { rotation = new Vector(0, 0, 0); }
        this.position = position;
        this.fov = fov;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }
    Camera.prototype.render = function (objects) {
        var res = [];
        for (var i = 0; i < this.height; i++) {
            res.push([]);
            for (var _i = 0, _a = new Array(this.width); _i < _a.length; _i++) {
                var j = _a[_i];
                res[i].push(rgb.black);
            }
        }
        if (objects.length = 0) {
            return res;
        }
        var faces = [];
        for (var _b = 0, objects_1 = objects; _b < objects_1.length; _b++) {
            var i = objects_1[_b];
            if (i instanceof Primitive) {
                faces.push.apply(faces, i.tris);
            }
            else {
                faces.push(i);
            }
        }
        var d1 = 10;
        var corner = this.position.add(new Vector(this.width / 2, 10, this.height / 2));
        var dirs = [];
        for (var e in new Array(this.width)) {
            var i = parseInt(e);
            var line = corner.add(new Vector(-1 * i, 0, 0));
            dirs.push([]);
            for (var f in new Array(this.height)) {
                var j = parseInt(f);
                dirs[i].push(line.add(new Vector(0, 0, -1 * j)));
            }
        }
        var n = 0;
        for (var _c = 0, dirs_1 = dirs; _c < dirs_1.length; _c++) {
            var i = dirs_1[_c];
            var m = 0;
            for (var _d = 0, i_1 = i; _d < i_1.length; _d++) {
                var j = i_1[_d];
                var touchedFaces = [];
                for (var _e = 0, faces_1 = faces; _e < faces_1.length; _e++) {
                    var k = faces_1[_e];
                    var ray = k.ray(this.position, j);
                    if (ray.colliding) {
                        touchedFaces.push([ray.distance, k]);
                    }
                }
                if (touchedFaces.length < 1)
                    break;
                var nearestFace = void 0;
                var smallestDistance = Infinity;
                for (var _f = 0, touchedFaces_1 = touchedFaces; _f < touchedFaces_1.length; _f++) {
                    var i_2 = touchedFaces_1[_f];
                    if (i_2[0] < smallestDistance) {
                        smallestDistance = i_2[0];
                        nearestFace = i_2[1];
                    }
                }
                //@ts-ignore
                res[m][n] = nearestFace.color;
                m++;
            }
            n++;
        }
        return res;
    };
    Camera.prototype.drawRender = function (render, ctx, x, y, dx, dy) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (dx === undefined)
            dx = this.width;
        if (dy === undefined)
            dy = this.height;
        var pxsx = Math.abs(dx - x) / this.width;
        var pxsy = Math.abs(dy - y) / this.height;
        for (var i = 0; i < render.length; i++) {
            var e = render[i];
            for (var j = 0; j < e.length; j++) {
                var f = e[j];
                ctx.fillStyle = f.value;
                ctx.fillRect(i * pxsx, j * pxsy, pxsx, pxsy);
            }
        }
    };
    return Camera;
}());
