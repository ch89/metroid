import * as PIXI from "pixi.js"

class Wave extends PIXI.Graphics {
	constructor(turret) {
		super()

		this.rotation = turret.rotation

		let gp = turret.getGlobalPosition()

		this.x = gp.x + Math.cos(this.rotation) * turret.width * 2
		this.y = gp.y + Math.sin(this.rotation) * turret.width * 2

		this.pivot.y = 10
		this.targets = []
		this.damage = 1
		this.speed = 8
		this.vs = .25
		this.va = .01
		this.force = 10

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed

		this.beginFill(0x4d79ff)
			.quadraticCurveTo(10, 10, 0, 20)
			.quadraticCurveTo(5, 10, 0, 0)	
	}

	animate() {
		this.x += this.vx
		this.y += this.vy

		this.scale.x += this.vs
		this.scale.y += this.vs

		this.alpha -= this.va

		if(this.alpha <= 0) {
			this.destroy()
			return
		}

		for(let enemy of enemies) {
			if(this.hit(enemy) && ! this.targets.includes(enemy)) {
				let force = this.force * this.alpha / enemy.mass

				enemy.vx += Math.cos(this.rotation) * force
				enemy.vy += Math.sin(this.rotation) * force

				this.targets.push(enemy)
			}
		}
	}
}

export default Wave