import * as PIXI from "pixi.js"

class WaveBeam extends PIXI.Sprite {
	constructor(player) {
		super(app.loader.resources.wavebeam.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.rotation = player.rotation

		this.damage = 1
		this.speed = 14
		this.targets = []

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
			if(this.hit(enemy) && ! this.targets.includes(enemy)) {
				enemy.hurt(this.damage)
				this.targets.push(enemy)
				// setTimeout(() => this.targets.remove(enemy), 100)
			}
		}
	}
}

export default WaveBeam