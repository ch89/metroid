import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class MiniBomb extends PIXI.Sprite {
	constructor(nightmare) {
		super(app.loader.resources.missile.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(nightmare.x, nightmare.y + 50)

		this.vy = 0
		this.gravity = .1
	}

	animate() {
		this.rotation += .05

		this.vy += this.gravity
		this.y += this.vy

		if(this.y > app.screen.height) {
			this.explosion()
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				player.hurt(1)
				this.explosion()
				this.destroy()
				break
			}
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.scale.set(5)
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default MiniBomb