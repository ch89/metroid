import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class MiniRocket extends PIXI.Sprite {
	constructor(angle) {
		super(app.loader.resources.missile.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.rotation = angle

		this.speed = 5
		this.damage = 1

		this.vx = Math.cos(angle) * this.speed
		this.vy = Math.sin(angle) * this.speed
	}

	animate() {
		this.x += this.vx
		this.y += this.vy

		this.addSmoke()

		if(this.x < 0 || this.x > app.screen.width || this.y < 0 || this.y > app.screen.height) {
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				player.hurt(this.damage)
				this.explosion()
				this.destroy()
				break
			}
		}
	}

	addSmoke() {
		let smoke = new PIXI.Sprite(app.loader.resources.particle.texture)
		smoke.anchor.set(.5)
		smoke.x = this.x - Math.cos(this.rotation) * this.width / 2
		smoke.y = this.y - Math.sin(this.rotation) * this.width / 2
		smoke.rotation = Math.random() * Math.PI * 2
		smoke.scale.set(Math.random() * .5 + 1)
		smoke.speed = Math.random() * .05 + .025
		particles.addChild(smoke)

		smoke.animate = function() {
			this.scale.x += this.speed
			this.scale.y += this.speed
			this.alpha -= this.speed

			if(this.alpha <= 0) this.destroy()
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default MiniRocket