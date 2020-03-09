import * as PIXI from "pixi.js"

class IceBeam extends PIXI.Sprite {
	constructor(player) {
		super(app.loader.resources.icebeam.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.rotation = player.rotation

		this.speed = 10
		this.damage = 1
		this.slow = .2

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed
	}

	animate() {
		this.x += this.vx
		this.y += this.vy

		if(this.x > app.screen.width || this.y < 0) {
			this.destroy()
			return
		}

		for(let enemy of enemies) {
			if(this.hit(enemy)) {
				enemy.hurt(this.damage)

				enemy.vx *= this.slow
				enemy.vy *= this.slow

				this.destroy()
				break
			}
		}
	}
}

export default IceBeam