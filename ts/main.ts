const canvas = <HTMLCanvasElement>document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw: number = 1920;
const ch: number = 1080;
canvas.height = ch;
canvas.width = cw;

document.body.appendChild(canvas)
const rgbArr: rgb[] = [];
for (let i = 0; i < 12; i++) {
    rgbArr.push(new rgb(...rgb._$$hsvToRgb(360 / 12 * i, 100, 50)));
}
const cube = new Cube(new Vector(-10, -30, 10), 20, 20, 20, new Vector(0, 0, 0), rgbArr);
const camera = new Camera(new Vector(0, 0, 0), 0, 1920, 1080, new Vector(0, 0, Math.PI));
cube.colors[4] = rgb.red;
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    camera.drawRender(camera.render([cube]), ctx);
    //requestAnimationFrame(draw);
}

draw();


const _$$c: HTMLCanvasElement = canvas;
const _$$cw = _$$c.width;
const _$$ch = _$$c.height;
function _$$adaptSize() {
    let rhl = _$$cw / _$$ch;
    let rlh = _$$ch / _$$cw;
    if (window.innerWidth > window.innerHeight * rhl) {
        _$$c.style.width = 'inherit';
        _$$c.style.height = '100%';
    }
    if (window.innerHeight > window.innerWidth * rlh) {
        _$$c.style.height = 'inherit';
        _$$c.style.width = '100%';
    }
}
_$$adaptSize();

window.addEventListener('resize', _$$adaptSize);

