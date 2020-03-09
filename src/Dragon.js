import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Dragon extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.metroid.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		this.force = .1
		this.friction = .97
		this.limit = 5
		this.easing = .1
		this.radius = 100
		this.vr = .02
		this.ready = true
		this.expansion = 0
		this.metroids = []
		this.target = new PIXI.Point()

		this.animate = this.chase
		this.destination()

		this.once("added", this.createMetroids)
	}

	chase() {
		let dx = this.target.x - this.x,
			dy = this.target.y - this.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		// let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		// if(speed > this.limit) {
		// 	this.vx *= this.limit / speed
		// 	this.vy *= this.limit / speed
		// }

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.updateMetroids()

		if(distance < 200) this.destination()
	}

	createMetroids() {
		// Chase
		// for(let i = 0; i < 50; i++) {
		// 	let metroid = new PIXI.Sprite(app.loader.resources.metroid.texture)
		// 	metroid.anchor.set(.5)
		// 	metroid.position.set(this.x, this.y)
		// 	this.metroids.push(metroid)
		// 	this.parent.addChild(metroid)

		// 	metroid.active = false
		// }

		// Shield
		for(let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
			let metroid = new PIXI.Sprite(app.loader.resources.metroid.texture)
			metroid.anchor.set(.5)
			metroid.rotation = angle
			metroid.x = this.x + Math.cos(angle) * this.radius
			metroid.y = this.y + Math.sin(angle) * this.radius
			this.metroids.push(metroid)
			this.parent.addChild(metroid)

			metroid.active = false
		}
	}

	updateMetroids() {
		// Chase
		// this.metroids[0].x += (this.x - this.metroids[0].x) * this.easing
		// this.metroids[0].y += (this.y - this.metroids[0].y) * this.easing

		// for(let i = 1; i < this.metroids.length; i++) {
		// 	this.metroids[i].x += (this.metroids[i - 1].x - this.metroids[i].x) * this.easing
		// 	this.metroids[i].y += (this.metroids[i - 1].y - this.metroids[i].y) * this.easing
		// }

		// Shield

		if(this.ready) {
			this.expansion += Math.PI / 150

			if(this.expansion >= Math.PI * 2) {
				this.radius = 100
				this.expansion = 0
				this.ready = false
				setTimeout(() => this.ready = true, 5000)
			}
			else {
				this.radius += Math.sin(this.expansion) * 4
			}
		}

		for(let metroid of this.metroids) {
			metroid.rotation += this.vr
			metroid.x = this.x + Math.cos(metroid.rotation) * this.radius
			metroid.y = this.y + Math.sin(metroid.rotation) * this.radius
		}
	}

	destination() {
		this.target.x = Math.random() * app.screen.width
		this.target.y = Math.random() * app.screen.height

		let angle = Math.atan2(this.target.y - this.y, this.target.x - this.x)

		this.ax = Math.cos(angle) * this.acceleration
		this.ay = Math.sin(angle) * this.acceleration
	}

	hurt(damage) {
		if(this.metroids.length) {
			let metroid = this.metroids.pop()
			this.explosion(metroid)
			metroid.destroy()
		}
		else {
			this.explosion(this)
			this.destroy()
		}
	}

	explosion(metroid) {
		let explosion = new Explosion()
		explosion.position.set(metroid.x, metroid.y)
		this.parent.addChild(explosion)
	}

	destroy() {
		super.destroy()
		enemies.remove(this)
	}
}

export default Dragon