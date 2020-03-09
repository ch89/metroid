import * as PIXI from "pixi.js"
import SeekingMissile from "./SeekingMissile"
import Hypnotize from "./Hypnotize"
import Explosion from "./Explosion"

class Hypnotizer extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.hypnotizer.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = Math.random() * app.screen.height

		this.vx = 1
		this.center = this.y
		this.radians = 0
		this.range = 25
		this.life = 10

		this.once("added", () => this.parent.addChild(new Hypnotize(this)))
	}

	animate() {
		this.x -= this.vx

		if(this.x < 0) {
			this.destroy()
			return
		}

		// this.y = this.center + Math.sin(this.radians) * this.range
		// this.radians += .03
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			this.explosion()
			this.destroy()
		}
	}

	shoot() {
		this.parent.addChild(new Hypnotize(this))
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Hypnotizer