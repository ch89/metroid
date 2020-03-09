import * as PIXI from "pixi.js"
// import { GlowFilter } from "@pixi/filter-glow"

class Ray extends PIXI.Graphics {
	constructor(turret) {
		super()

		this.turret = turret
		this.targets = []
		this.damage = 1
		this.duration = 10000

		// let filter = new GlowFilter()
		// filter.color = 0xFF0000
		// this.filters = [filter]

		setTimeout(this.destroy.bind(this), this.duration)
	}

	animate() {
		let gp = this.turret.getGlobalPosition(),
			cos = Math.cos(this.turret.rotation),
			sin = Math.sin(this.turret.rotation),
			xi = gp.x + cos * this.turret.width * 2,
			yi = gp.y + sin * this.turret.width * 2,
			xf,
			yf,
			distance = 0

		while(true) {
			xf = xi + cos * distance
			yf = yi + sin * distance

			if(xf > app.screen.width || yf < 0 || this.collision(xf, yf)) break

			distance += 5
		}

		this.clear()
			.lineStyle(3, 0xFF0000)
			.moveTo(xi, yi)
			.lineTo(xf, yf)
	}

	collision(x, y) {
		for(let enemy of enemies) {
			if(enemy.hitPoint(x, y)) {
				if(! this.targets.includes(enemy)) {
					enemy.hurt(this.damage)
					this.targets.push(enemy)
					setTimeout(() => this.targets.remove(enemy), 150)
				}

				return true
			}
		}

		return false
	}
}

export default Ray