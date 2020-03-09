import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Metroid extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.metroid.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0

		this.center = 2
		this.radians = 0
		this.range = .1
		this.vs = .07

		this.force = .2
		this.maxSpeed = 6
		this.target = players.random()
		this.life = 10
		this.damage = 1
		this.experience = 10
		this.captured = false
	}

	animate() {
		this.scale.x = this.center + Math.cos(this.radians) * this.range
		this.scale.y = this.center + Math.sin(this.radians) * this.range
		this.radians += this.vs

		if(this.captured) {
			this.position.set(this.target.x, this.target.y)
		}
		else {
			let dx = this.target.x - this.x,
				dy = this.target.y - this.y,
				angle = Math.atan2(dy, dx)

			this.vx += Math.cos(angle) * this.force
			this.vy += Math.sin(angle) * this.force

			let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

			if(speed > this.maxSpeed) {
				this.vx *= this.maxSpeed / speed
				this.vy *= this.maxSpeed / speed
			}

			this.x += this.vx
			this.y += this.vy

			if(this.hit(this.target)) {
				this.captured = true
				this.target.disabled = true
				this.timer = setInterval(() => this.target.hurt(this.damage), 1000)
			}
		}
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			if(this.target) {
				this.target.disabled = false
				clearInterval(this.timer)
			}

			players.forEach(player => player.increase(this.experience))

			this.destroy()
		}
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Metroid