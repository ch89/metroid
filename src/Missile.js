// import * as PIXI from "pixi.js"
// import Explosion from "./Explosion"

// class Rocket extends PIXI.Sprite {
// 	constructor() {
// 		super(app.loader.resources.rocket.texture)

// 		this.anchor.set(.5)
// 		this.scale.set(2)
		
// 		this.speed = 10
// 		this.damage = 1

// 		app.loader.resources.shoot.sound.play()
// 	}

// 	animate() {
// 		this.x += this.speed

// 		for(let enemy of enemies) {
// 			if(this.hit(enemy)) {
// 				enemy.hurt(this.damage)
// 				this.explosion()
// 				this.destroy()
// 				break
// 			}
// 		}
// 	}

// 	explosion() {
// 		let explosion = new Explosion()
// 		explosion.position.set(this.x, this.y)
// 		this.parent.addChild(explosion)
// 		app.loader.resources.explode.sound.play()
// 	}
// }

// export default Rocket

import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Missile extends PIXI.Sprite {
	constructor(player) {
		super(app.loader.resources.missile.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.rotation = player.rotation

		this.speed = 1
		this.force = .1
		this.damage = 2

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed
		
		this.ax = Math.cos(this.rotation) * this.force
		this.ay = Math.sin(this.rotation) * this.force

		let sound = app.loader.resources.shoot.sound
		// sound.volume = 0.25
		sound.play()
	}

	animate() {
		this.vx += this.ax
		this.vy += this.ay

		this.x += this.vx
		this.y += this.vy

		this.addSmoke()

		if(this.x > app.screen.width || this.y < 0) {
			this.destroy()
			return
		}

		for(let enemy of enemies) {
			if(this.hit(enemy)) {
				enemy.hurt(this.damage)
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
		let explosion = new Explosion
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
		
		let sound = app.loader.resources.explode.sound
		// sound.volume = 0.25
		sound.play()
	}
}

export default Missile