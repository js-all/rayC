const canvas = <HTMLCanvasElement>document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const cw: number = 1920;
const ch: number = 1080;
canvas.height = ch;
canvas.width = cw;

document.body.appendChild(canvas)

function draw() {
    ctx.clearRect(0, 0, cw, ch);
    camera.drawRender(camera.render([cube]), ctx, 0, 0, cw, ch);
}

draw.rate = 60;
draw.interval = setInterval(draw, 1000 / draw.rate);

const cube = new Cube(new Vector(-10, -30, -10), 20, 20, 20, rgb.blue.to(rgb.green, 40));
const camera = new Camera(new Vector(0, -20, 0), 0, 1920, 1080);