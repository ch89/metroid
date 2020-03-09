import * as PIXI from "pixi.js"
import Explosion from "./Explosion"
import Fire from "./Fire"

import * as PIXI from "pixi.js"

class Fire extends PIXI.Sprite {
	constructor(ridley) {
		super(app.loader.resources.fire.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(ridley.x, ridley.y)

		this.rotation = Math.atan2(ship.y - this.y, ship.x - this.x)

		this.speed = 10

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed
	}

	animate() {
		this.x += this.vx
		this.y += this.vy

		if(this.x < 0 || this.x > app.screen.width || this.y < 0 || this.y > app.screen.height) {
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				player.hurt(1)
				this.destroy()
				break
			}
		}
	}
}

export default Fire