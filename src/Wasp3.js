import * as PIXI from "pixi.js"
import HealthBar from "./HealthBar"

class Wasp3 extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.wasp.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width / 2
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		this.force = .1
		this.friction = .99
		this.limit = 10
		this.bounce = -1
		this.life = 100
		this.maxLife = this.life

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)
	}

	animate() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
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

		this.boundaries()
	}

	boundaries() {
		if(this.x - this.width / 2 < 0) {
			this.x = this.width / 2
			this.vx *= this.bounce
		}
		else if(this.x + this.width / 2 > app.screen.width) {
			this.x = app.screen.width - this.width / 2
			this.vx *= this.bounce
		}
		if(this.y - this.height / 2 < 0) {
			this.y = this.height / 2
			this.vy *= this.bounce
		}
		else if(this.y + this.height / 2 > app.screen.height) {
			this.y = app.screen.height - this.height / 2
			this.vy *= this.bounce
		}
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			this.life = 0
			this.destroy()
		}

		this.health.update(this.life, this.maxLife)
	}
}

export default Wasp3