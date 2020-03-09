import * as PIXI from "pixi.js"
import HealthBar from "./HealthBar"
import Boomerang from "./Boomerang"

class Crusader extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.crusader.texture)

		this.anchor.set(.5)
		this.position.set(app.screen.width, app.screen.height / 2)
		this.scale.set(2)

		this.vx = 1
		this.vy = .02
		this.friction = .97
		this.center = this.y
		this.radians = 0
		this.range = 50
		this.life = 100
		this.maxLife = this.life
		this.delay = 2000

		let	dx = app.screen.width / 2 - this.x,
			dy = app.screen.height / 2 - this.y,
			angle = Math.atan2(dy, dx),
			force = .1

		this.ax = Math.cos(angle) * force
		this.ay = Math.sin(angle) * force

		this.healthBar = new HealthBar(this.life, this.maxLife)
		this.healthBar.position.set(app.screen.width - this.healthBar.width - 25, 25)
		app.stage.addChild(this.healthBar)

		this.timer = setInterval(this.shoot.bind(this), this.delay)
	}

	animate() {
		this.vx += this.ax
		this.vy += this.ay

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		// this.y = this.center + Math.sin(this.radians) * this.range
		// this.radians += this.vy
	}

	shoot() {
		this.parent.addChild(new Boomerang(this))
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			this.life = 0
			this.destroy()
		}

		this.healthBar.update(this.life)
	}

	destroy() {
		// super.destroy()

		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.timer)
	}
}

export default Crusader