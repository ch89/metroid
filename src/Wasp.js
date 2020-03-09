import * as PIXI from "pixi.js"
import HealthBar from "./HealthBar"
import Rocket from "./Rocket"

class Wasp extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.wasp.texture)

		this.anchor.set(.5)
		this.position.set(app.screen.width, app.screen.height / 2)
		this.scale.set(2)

		this.vx = 1
		this.vy = .02
		this.center = this.y
		this.radians = 0
		this.range = 100
		this.life = 100
		this.maxLife = this.life
		this.experience = 25
		this.delay = 3000

		this.healthBar = new HealthBar(this.life, this.maxLife)
		this.healthBar.position.set(app.screen.width - this.healthBar.width - 25, 25)
		app.stage.addChild(this.healthBar)

		this.timer = setInterval(this.shoot.bind(this), this.delay)
	}

	animate() {
		if(this.x > app.screen.width - 200) this.x -= this.vx

		this.y = this.center + Math.sin(this.radians) * this.range
		this.radians += this.vy
	}

	shoot() {
		this.parent.addChild(new Rocket(this))
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			this.life = 0
			players.forEach(player => player.increase(this.experience))
			this.healthBar.destroy()
			this.destroy()
		}
		else {
			this.healthBar.update(this.life, this.maxLife)
		}
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.timer)
	}
}

export default Wasp