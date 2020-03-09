import * as PIXI from "pixi.js"

class TankBeam extends PIXI.Sprite {
	constructor(turret) {
		super(app.loader.resources.tankbeam.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.rotation = turret.rotation

		let gp = turret.getGlobalPosition()

		this.x = gp.x + Math.cos(this.rotation) * turret.width * 2
		this.y = gp.y + Math.sin(this.rotation) * turret.width * 2

		this.speed = 10
		this.damage = 1

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed
	}

	animate() {
		this.x += this.vx
		this.y += this.vy

		if(this.x > app.screen.width || this.x < 0) {
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

export default TankBeam