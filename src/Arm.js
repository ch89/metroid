import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Arm extends PIXI.Sprite {
	constructor(kraid) {
		super(app.loader.resources.arm.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = kraid.x
		this.y = kraid.y

		this.ax = -.1
		this.vx = 0
		this.ready = true
	}

	animate() {
		this.vx += this.ax
		this.x += this.vx

		if(this.x < 0) {
			this.destroy()
			return
		}

		if(this.hit(ship) && this.ready) {
			ship.hurt(1)
			ship.vx += this.vx
			this.explosion()
			this.ready = false
			setTimeout(() => this.ready = true, 1000)
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Arm