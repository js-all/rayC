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

        const bool = t >= 0 && u <= 1 && u >= 0 && v <= 1 && v >= 0 && u + v <= 1;
        const res: RayData<typeof bool> = {
            colliding: bool,
            distance: bool ? Math.sqrt(Math.pow(origin.x - dirrection.x, 2) + Math.pow(origin.y - dirrection.y, 2) + Math.pow(origin.z - dirrection.z, 2)) * t : null,
            location: bool ? l.a.add(l.ab.multiply(t)) : null
        }
        return res;
    }
    equal(t: Tris, color = true) {
        const p = this.points[0].equals(t.points[0]) &&
            this.points[1].equals(t.points[1]) &&
            this.points[2].equals(t.points[2]);
        return color ? this.color.equal(t.color) && p : p;
    }
}

class Primitive {
    points: Vector[];
    faces: [number, number, number][];
    colors: rgb[];
    rotation: Vector;
    origin: Vector;
    constructor(points: Vector[], faces: [number, number, number][], origin: Vector, rotation: Vector = new Vector(0, 0, 0), color?: rgb[]) {
        this.points = points;
        this.faces = faces;
        this.colors = [];
        this.origin = origin;
        this.rotation = rotation;
        let n = 0;
        for (let i of this.faces) {
            const col = color !== undefined && color[n] !== undefined ? color[n] : rgb.blue;
            this.colors.push(col);
            n++;
        }
    }
    get tris() {
        const res: Tris[] = [];
        const p = this.rotatedPoints;
        let n = 0;
        for (let i of this.faces) {
            res.push(new Tris(p[i[0]], p[i[1]], p[i[2]], this.colors[n]))
            n++;
        }
        return res;
    }
    get rotatedPoints() {
        const res: Vector[] = [];
        for (let i of this.points) {
            res.push(Rotate3d(i.subtract(this.origin), this.rotation.x, this.rotation.y, this.rotation.z).add(this.origin));
        }
        return res;
    }
}

class Cube extends Primitive {
    constructor(corner: Vector, width: number, length: number, height: number, rotation: Vector = new Vector(0, 0, 0), color: rgb | rgb[] = rgb.blue) {
        const colorArray = color instanceof rgb ? [color, color, color, color, color, color, color, color, color, color, color, color] : color;
        super([
            corner.add(new Vector(0, 0, 0)),                // p0 : 0 0 0
            corner.add(new Vector(width, 0, 0)),            // p1 : w 0 0
            corner.add(new Vector(width, length, 0)),       // p2 : w l 0
            corner.add(new Vector(0, length, 0)),           // p3 : 0 l 0
            corner.add(new Vector(0, 0, -height)),          // p4 : 0 0 h
            corner.add(new Vector(0, length, -height)),     // p5 : 0 l h
            corner.add(new Vector(width, 0, -height)),      // p6 : w 0 h
            corner.add(new Vector(width, length, -height)), // p7 : w l h
        ], [
            [0, 1, 2],  // 00  top face
            [0, 3, 2],  // 01     ^
            [1, 6, 7],  // 02  left face
            [1, 2, 7],  // 03      ^
            [3, 2, 7],  // 04  front face
            [3, 5, 7],  // 05      ^
            [1, 0, 4],  // 06  back face
            [1, 6, 4],  // 07      ^
            [0, 3, 5],  // 08  left face
            [0, 4, 5],  // 09      ^
            [4, 6, 7],  // 10  bottom face
            [4, 5, 7]   // 11       ^
        ], corner.add(new Vector(width / 2, length / 2, height / 2)), rotation, colorArray);
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
        console.time('render');
        const res: rgb[][] = [];
        for (let i = 0; i < this.height; i++) {
            res.push([])
            for (let j of new Array(this.width)) {
                res[i].push(rgb.black);
            }
        }
        if (objects.length === 0) {
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
        const d1 = 100;
        const corner = this.position.add(new Vector(this.width / 2, 10, this.height / 2));
        const dirs: Vector[][] = [];
        for (let i = 0; i < this.width; i++) {
            const line = corner.add(new Vector(-1 * i, 0, 0));
            dirs.push([]);
            for (let j = 0; j < this.height; j++) {
                dirs[i].push(Rotate3d(line.add(new Vector(0, 0, -1 * j)), this.rotation.x, this.rotation.y, this.rotation.z).clamp())
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
                if (touchedFaces.length < 1) continue;
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
        console.timeEnd('render');
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
                ctx.fillRect(j * pxsx, i * pxsy, pxsx, pxsy);
            }
        }
    }
}

