interface RayData<T extends false | true> {
    colliding: T,
    distance: T extends true ? number : null,
    location: T extends true ? Vector : null
}
const e: RayData<false> = {
    colliding: false,
    distance: null,
    location: null
}


class Tris {
    points: [Vector, Vector, Vector];
    constructor(p1: Vector, p2: Vector, p3: Vector) {
        this.points = [p1, p2, p3];
    }
    ray(origin: Vector, dirrection: Vector) {
        const l = {
            a: origin,
            b: dirrection,
            ab: dirrection.subtract(origin),
            mab: dirrection.subtract(origin).multiply(-1)
        }
        const p = {
            0: this.points[0],
            1: this.points[1],
            2: this.points[2],
            z1: this.points[1].subtract(this.points[0]),
            z2: this.points[2].subtract(this.points[0])
        }
        const t = ((p.z1.cross(p.z2)).dot(l.a.subtract(p[0]))) / (l.mab.dot(p.z1.cross(p.z2)));
        const u = ((p.z2.cross(l.mab)).dot(l.a.subtract(p[0]))) / (l.mab.dot(p.z1.cross(p.z2)));
        const v = ((l.mab.cross(p.z1)).dot(l.a.subtract(p[0]))) / (l.mab.dot(p.z1.cross(p.z2)));
        //return [t, u, v]
        const bool = t >= 0;
        const res: RayData<typeof bool> = {
            colliding: bool,
            distance: Math.sqrt(Math.pow(origin.x - dirrection.x, 2) + Math.pow(origin.y - dirrection.y, 2) + Math.pow(origin.z - dirrection.z, 2)) * t,
            location: l.a.add(l.ab.multiply(t))
        }
        return
    }
}