import * as PIXI from "pixi.js"

class Frost extends PIXI.Sprite {
	constructor(ship) {
		super(app.loader.resources.frost.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(ship.x, ship.y)

		this.distance = 0
		this.speed = 4
		this.damage = 1
		this.bounces = 25
		this.range = 500

		this.find()

		// Range
		// this.radius = new PIXI.Graphics()
		// 	.lineStyle(2, 0xFF0000)
		// 	.drawCircle(0, 0, this.range)

		// this.radius.position.set(this.x, this.y)
		// this.radius.active = false
		// game.addChild(this.radius)
	}

	// find(targets = enemies) {
	// 	if(targets.length) {
	// 		this.target = null

	// 		for(let target of targets) {
	// 			let dx = target.x - this.x,
	// 				dy = target.y - this.y,
	// 				distance = Math.sqrt(dx * dx + dy * dy)

	// 			if(distance < this.distance || ! this.target) {
	// 				this.distance = distance
	// 				this.target = target
	// 			}
	// 		}
	// 	}
	// 	else {
	// 		this.destroy()
	// 	}
	// }

	find(targets = enemies) {
		this.target = null

		for(let target of targets) {
			let dx = target.x - this.x,
				dy = target.y - this.y,
				distance = Math.sqrt(dx * dx + dy * dy)

			if(distance <= this.range || this.bounces == 25) {
				if(distance < this.distance || ! this.target) {
					this.distance = distance
					this.target = target
				}
			}
		}

		if(! this.target) this.destroy()
	}

	addSmoke() {
		let particle = new PIXI.Sprite(app.loader.resources.particle.texture)
		particle.anchor.set(.5)
		particle.position.set(this.x, this.y)
		particle.rotation = Math.random() * Math.PI * 2
		particle.scale.set(Math.random() + 1)
		particle.speed = Math.random() * .05 + .025
		particles.addChild(particle)

		particle.animate = function() {
			this.scale.x += this.speed
			this.scale.y += this.speed
			this.alpha -= this.speed

			if(this.alpha <= 0) this.destroy()
		}
	}

	animate() {
		if(! this.target.parent) this.find()

		this.rotation = Math.atan2(this.target.y - this.y, this.target.x - this.x)

		this.x += Math.cos(this.rotation) * this.speed
		this.y += Math.sin(this.rotation) * this.speed

		// this.radius.position.set(this.x, this.y)

		this.addSmoke()

		if(this.hit(this.target)) {
			this.target.hurt(this.damage)
			this.bounces--

			if(this.bounces) this.find(enemies.filter(enemy => enemy != this.target))
			else this.destroy()
		}
	}

	destroy() {
		super.destroy()
		// this.radius.destroy()
	}
}

export default Frost