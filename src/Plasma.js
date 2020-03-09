import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Plasma extends PIXI.Sprite {
	constructor(motherbrain) {
		super(app.loader.resources.fire.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(motherbrain.x, motherbrain.y)

		this.speed = 6
		this.damage = 2
		this.count = 1

		this.motherbrain = motherbrain
		this.target = players.random()
	}

	animate() {
		let dx = this.target.x - this.x,
			dy = this.target.y - this.y,
			angle = Math.atan2(dy, dx)

		this.rotation = angle

		this.x += Math.cos(angle) * this.speed
		this.y += Math.sin(angle) * this.speed

		if(this.hit(this.target)) {
			if(this.target == this.motherbrain) {
				this.count--

				if(this.count) {
					this.speed += 2
					this.motherbrain.shield.visible = true
					this.target = players.random()
				}
				else {
					this.motherbrain.filter.enabled = false

					setTimeout(() => {
						this.motherbrain.filter.enabled = true
						this.motherbrain.reload()
					}, 5000)

					this.explosion()
					this.destroy()
				}
			}
			else {
				if(this.target.shield.visible) {
					this.target = this.motherbrain
				}
				else {
					this.target.hurt(this.damage)
					this.motherbrain.reload()
					this.explosion()
					this.destroy()
				}
			}
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Plasma