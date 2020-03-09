import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Fireball extends PIXI.Sprite {
	constructor(kraid) {
		super(app.loader.resources.fireball.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(kraid.x, kraid.y)

		this.gravity = .1

		// let dx = ship.x - this.x,
		// 	dy = ship.y - this.y,
		// 	angle = Math.atan2(dy, dx)

		// this.vx = Math.cos(angle) * 10
		// this.vy = Math.sin(angle) * 10

		this.vx = Math.random() * -6 - 3
		this.vy = Math.random() * -4 - 4
	}

	animate() {
		this.vy += this.gravity

		this.x += this.vx
		this.y += this.vy

		this.addSmoke()

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

	addSmoke() {
		let smoke = new PIXI.Sprite(app.loader.resources.particle.texture)
		smoke.anchor.set(.5)
		smoke.x = this.x
		smoke.y = this.y
		smoke.rotation = Math.random() * Math.PI * 2
		smoke.scale.set(Math.random() + 1)
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
		explosion.scale.set(4)
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Fireball