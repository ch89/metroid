import * as PIXI from "pixi.js"

class Beam extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.beam.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.vx = 10
		this.damage = 1
	}

	animate() {
		this.x += this.vx

		if(this.x > app.screen.width) {
			this.destroy()
			return
		}

		for(let enemy of enemies) {
			if(this.hit(enemy)) {
				enemy.hurt(this.damage)
				this.destroy()
				break
			}
		}
	}
}

export default Beam