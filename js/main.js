"use strict";
var tt = new Tris(new Vector(0, 0, 0), new Vector(10, 0, 0), new Vector(0, 10, 0));
var rayO = new Vector(3, 5, 10);
var rayD = new Vector(3, 5, 20);
console.log(tt.ray(rayO, rayD));
