interface RayData<T extends false | true> {
    colliding: T,
    distance: T extends true ? number : null,
    location: T extends true ? Vector : null
}

class Tris {
    points: [Vector, Vector, Vector];
    color: rgb;
    constructor(p1: Vector, p2: Vector, p3: Vector, color = rgb.blue) {
        this.points = [p1, p2, p3];
        this.color = color;
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
        const bool = t >= 0;
        const res: RayData<typeof bool> = {
            colliding: bool,
            distance: bool ? Math.sqrt(Math.pow(origin.x - dirrection.x, 2) + Math.pow(origin.y - dirrection.y, 2) + Math.pow(origin.z - dirrection.z, 2)) * t : null,
            location: bool ? l.a.add(l.ab.multiply(t)) : null
        }
        return res;
    }
}

class Primitive {
    points: Vector[];
    faces: [number, number, number][];
    colors: rgb[];
    constructor(points: Vector[], faces: [number, number, number][], color?: rgb[]) {
        this.points = points;
        this.faces = faces;
        this.colors = [];
        let n = 0;
        for (let i of this.faces) {
            const col = color !== undefined && color[n] !== undefined ? color[n] : rgb.blue;
            this.colors.push(col);
            n++;
        }
    }
    get tris() {
        const res: Tris[] = [];
        let n = 0;
        for (let i of this.faces) {
            res.push(new Tris(this.points[i[0]], this.points[i[1]], this.points[i[2]], this.colors[n]))
            n++;
        }
        return res;
    }
}

class Cube extends Primitive {
    constructor(corner: Vector, width: number, length: number, height: number, color: rgb | rgb[] = rgb.blue) {
        const colorArray = color instanceof rgb ? [color, color, color, color, color, color, color, color, color, color, color, color] : color;
        super([
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
        ], colorArray);
    }
}

class Camera {
    position: Vector;
    fov: number;
    width: number;
    height: number;
    rotation: Vector;
    constructor(position: Vector, fov: number, width: number, height: number, rotation: Vector = new Vector(0, 0, 0)) {
        this.position = position;
        this.fov = fov;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
    }
    render(objects: Primitive[] | Tris[]) {
        const res: rgb[][] = [];
        for (let i in new Array(this.height)) {
            res.push([])
            for (let j in new Array(this.width)) {
                res[i].push(rgb.black);
            }
        }
        if (objects.length = 0) {
            return res;
        }
        const faces: Tris[] = [];
        for (let i of objects) {
            if (i instanceof Primitive) {
                faces.push(...i.tris);
            } else {
                faces.push(i);
            }
        }
        const d1 = 10;
        const corner = this.position.add(new Vector(this.width / 2, 10, this.height / 2));
        const dirs: Vector[][] = [];
        for (let e in new Array(this.width)) {
            const i = parseInt(e);
            const line = corner.add(new Vector(-1 * i, 0, 0));
            dirs.push([]);
            for (let f in new Array(this.height)) {
                const j = parseInt(f);
                dirs[i].push(line.add(new Vector(0, 0, -1 * j)))
            }
        }
        let n = 0;
        for (let i of dirs) {
            let m = 0;
            for (let j of i) {
                const touchedFaces: [number, Tris][] = [];
                for (let k of faces) {
                    const ray = k.ray(this.position, j);
                    if (ray.colliding) {
                        touchedFaces.push([<number>ray.distance, k]);
                    }
                }
                if (touchedFaces.length < 1) break;
                let nearestFace: Tris;
                let smallestDistance = Infinity;
                for (let i of touchedFaces) {
                    if (i[0] < smallestDistance) {
                        smallestDistance = i[0];
                        nearestFace = i[1];
                    }
                }
                //@ts-ignore
                res[m][n] = nearestFace.color;
                m++;
            }
            n++;
        }
        return res;
    }
    drawRender(render: rgb[][], ctx: CanvasRenderingContext2D, x: number = 0, y: number = 0, dx?: number, dy?: number) {
        if (dx === undefined) dx = this.width;
        if (dy === undefined) dy = this.height;
        const pxsx = Math.abs(dx - x) / this.width;
        const pxsy = Math.abs(dy - y) / this.height;
        for (let i = 0; i < render.length; i++) {
            const e = render[i];
            for (let j = 0; j < e.length; j++) {
                const f = e[j];
                ctx.fillStyle = f.value;
                ctx.fillRect(i * pxsx, j * pxsy, pxsx, pxsy);
            }
        }
    }
}

