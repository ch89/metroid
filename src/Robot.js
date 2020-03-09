import * as PIXI from "pixi.js"
import SeekingMissile from "./SeekingMissile"
import Hypnotize from "./Hypnotize"
import Explosion from "./Explosion"

class Robot extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.robot.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = Math.random() * app.screen.height

		this.vx = 1
		this.center = this.y
		this.radians = 0
		this.range = 25
		this.life = 10
		this.experience = 5

		this.timer = setInterval(this.shoot.bind(this), 5000)
	}

	animate() {
		if(this.x > app.screen.width - 200) this.x -= this.vx

		this.y = this.center + Math.sin(this.radians) * this.range
		this.radians += .03
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			players.forEach(player => player.increase(this.experience))
			this.explosion()
			this.destroy()
		}
	}

	shoot() {
		let missile = new SeekingMissile(this)
		enemies.push(missile)
		this.parent.addChild(missile)

		// this.parent.addChild(new Hypnotize(this))
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.timer)
	}
}

export default Robot