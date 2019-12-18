const canvas = <HTMLCanvasElement>document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw: number = 1920;
const ch: number = 1080;
canvas.height = ch;
canvas.width = cw;

document.body.appendChild(canvas)
const rgbArr: rgb[] = [];
for (let i = 0; i < 12; i += 2) {
    rgbArr.push(new rgb(...rgb._$$hsvToRgb(360 / 12 * i, 100, 100)));
    rgbArr.push(new rgb(...rgb._$$hsvToRgb(360 / 12 * i, 100, 100)));
}
const cube = new Cube(new Vector(-10, 30, 10), 20, 20, 20, new Vector(0, 0, 0), rgbArr);
const plane = new Plane(new Vector(-10, 30, -10), 200, 200, new Vector(0, 0, 0), [rgb.blue, new rgb(255, 165, 0)]);
//    corner view:                   60  100  60   0  width height           -36 / 180 * Math.PI  0  3 * (Math.PI / 4)
const camera = new Camera(new Vector(60, 100, 60), 0, 1920, 1080, new Vector(-90 / 180 * Math.PI, 0, 3 * (Math.PI / 4)));

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
window.addEventListener('keydown', e => {
    if (e.keyCode === 83) {
        const tab = window.open();
        const img = new Image();
        img.src = canvas.toDataURL();
        //@ts-ignore
        tab.document.body.appendChild(img)
    }
})

