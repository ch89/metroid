import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class SeekingMissile extends PIXI.Sprite {
	constructor(enemy) {
		super(app.loader.resources.seekingmissile.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(enemy.x, enemy.y)

		this.rotation = Math.PI

		this.target = players.random()
		this.speed = 3
		this.damage = 2
		this.life = 5
	}

	animate() {
		let dx = this.target.x - this.x,
			dy = this.target.y - this.y,
			angle = Math.atan2(dy, dx)

		this.rotation = angle

		this.x += Math.cos(angle) * this.speed
		this.y += Math.sin(angle) * this.speed

		this.smoke()

		for(let player of players) {
			if(this.hit(player)) {
				player.hurt(this.damage)
				this.explosion()
				this.destroy()
				break
			}
		}
	}

	smoke() {
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

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			this.explosion()
			this.destroy()
		}
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default SeekingMissile