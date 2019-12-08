"use strict";
var e = {
    colliding: false,
    distance: null,
    location: null
};
var Tris = /** @class */ (function () {
    function Tris(p1, p2, p3) {
        this.points = [p1, p2, p3];
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
        //return [t, u, v]
        var bool = t >= 0;
        var res = {
            colliding: bool,
            distance: Math.sqrt(Math.pow(origin.x - dirrection.x, 2) + Math.pow(origin.y - dirrection.y, 2) + Math.pow(origin.z - dirrection.z, 2)) * t,
            location: l.a.add(l.ab.multiply(t))
        };
        return;
    };
    return Tris;
}());
