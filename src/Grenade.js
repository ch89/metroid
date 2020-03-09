import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Grenade extends PIXI.Sprite {
	constructor(player) {
		super(app.loader.resources.grenade.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.rotation = player.rotation

		this.speed = 10
		this.damage = 1
		this.gravity = .1
		this.range = 300
		// this.bounce = -1

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed
	}

	animate() {
		this.vy += this.gravity
		this.x += this.vx
		this.y += this.vy

		if(this.y > app.screen.height) {
			this.explosion()
			this.destroy()
			return
		}

		for(let enemy of enemies) {
			if(this.hit(enemy)) {
				enemy.hurt(this.damage)
				this.splash(enemy)
				this.explosion()
				this.destroy()
				break
			}
		}
	}

	splash(target) {
		for(let enemy of enemies.filter(enemy => enemy != target)) {
			let dx = enemy.x - target.x,
				dy = enemy.y - target.y,
				distance = Math.sqrt(dx * dx + dy * dy)

			if(distance <= this.range) enemy.hurt(this.damage)
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Grenade

// if(this.x - this.width / 2 < 0) {
//     this.x = this.width / 2
//     this.vx *= this.bounce
// }
// else if(this.x + this.width / 2 > app.screen.width) {
//     this.x = app.screen.width - this.width / 2
//     this.vx *= this.bounce
// }
// if(this.y - this.height / 2 < 0) {
//     this.y = this.height / 2
//     this.vy *= this.bounce
// }
// else if(this.y + this.height / 2 > app.screen.height) {
//     this.y = app.screen.height - this.height / 2
//     this.vy *= this.bounce
// }