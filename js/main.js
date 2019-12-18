"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var cw = 1920;
var ch = 1080;
canvas.height = ch;
canvas.width = cw;
document.body.appendChild(canvas);
var rgbArr = [];
for (var i = 0; i < 12; i += 2) {
    rgbArr.push(new (rgb.bind.apply(rgb, __spreadArrays([void 0], rgb._$$hsvToRgb(360 / 12 * i, 100, 100))))());
    rgbArr.push(new (rgb.bind.apply(rgb, __spreadArrays([void 0], rgb._$$hsvToRgb(360 / 12 * i, 100, 100))))());
}
var cube = new Cube(new Vector(-10, 30, 10), 20, 20, 20, new Vector(0, 0, 0), rgbArr);
var plane = new Plane(new Vector(-10, 30, -10), 200, 200, new Vector(0, 0, 0), [rgb.blue, new rgb(255, 165, 0)]);
//    corner view:                   60  100  60   0  width height           -36 / 180 * Math.PI  0  3 * (Math.PI / 4)
var camera = new Camera(new Vector(60, 100, 60), 0, 1920, 1080, new Vector(-90 / 180 * Math.PI, 0, 3 * (Math.PI / 4)));
function draw() {
    ctx.clearRect(0, 0, cw, ch);
    camera.drawRender(camera.render([cube]), ctx);
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
window.addEventListener('keydown', function (e) {
    if (e.keyCode === 83) {
        var tab = window.open();
        var img = new Image();
        img.src = canvas.toDataURL();
        //@ts-ignore
        tab.document.body.appendChild(img);
    }
});
