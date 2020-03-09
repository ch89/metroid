import * as PIXI from "pixi.js"

PIXI.DisplayObject.prototype.active = true

PIXI.DisplayObject.prototype.hit = function(obj) {
	let a = this.getBounds(),
		b = obj.getBounds()

	return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height
}

PIXI.DisplayObject.prototype.hitPoint = function(x, y) {
	let obj = this.getBounds()

	return obj.x + obj.width > x && obj.x < x && obj.y + obj.height > y && obj.y < y
}

Array.prototype.remove = function(obj) {
	return this.splice(this.indexOf(obj), 1)[0]
}

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)]
}