import * as PIXI from "pixi.js"

class Shockwave extends PIXI.Graphics {
	constructor(ship) {
		super()

		this.position.set(ship.x, ship.y)

		this.radius = 0
		this.damage = 1
		this.targets = []
	}

	animate() {
		this.force = 10 * this.alpha
		this.radius += this.force
		this.alpha -= .01

		if(this.alpha <= 0) {
			this.destroy()
			return
		}

		for(let enemy of enemies) {
			if(this.hit(enemy) && ! this.targets.includes(enemy)) {
				let dx = enemy.x - this.x,
					dy = enemy.y - this.y,
					angle = Math.atan2(dy, dx)

				enemy.vx += Math.cos(angle) * this.force
				enemy.vy += Math.sin(angle) * this.force

				enemy.hurt(this.damage)

				this.targets.push(enemy)
			}
		}

		this.clear()
			.lineStyle(5, 0x000088)
			.drawCircle(0, 0, this.radius)
	}
}

export default Shockwave