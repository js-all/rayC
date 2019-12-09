"use strict";
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var cw = 1920;
var ch = 1080;
canvas.height = ch;
canvas.width = cw;
document.body.appendChild(canvas);
var cube = new Cube(new Vector(-10, -30, -10), 20, 20, 20, rgb.blue.to(rgb.green, 40));
var camera = new Camera(new Vector(0, -20, 0), 0, 1920, 1080);
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    camera.drawRender(camera.render([cube]), ctx, 0, 0, cw, ch);
    //requestAnimationFrame(draw);
}
draw();
var _$$c = canvas;
var _$$cw = _$$c.width;
var _$$ch = _$$c.height;
function _$$adaptSize() {
    var rhl = _$$cw / _$$ch;
    var rlh = _$$ch / _$$cw;
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
