import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Rock extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.rock.texture)

		this.anchor.set(.5)
		this.scale.set(Math.random() * 4 + 2)
		this.rotation = Math.random() * Math.PI * 2

		this.x = Math.random() * app.screen.width
		this.y = 0

		this.vx = 0
		this.vy = 0
		this.gravity = .1
		this.vr = .025
	}

	animate() {
		this.rotation += this.vr

		this.vy += this.gravity

		this.x += this.vx
		this.y += this.vy

		if(this.y > app.screen.height) {
			this.explosion()
			this.destroy()
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Rock