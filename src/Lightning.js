import * as PIXI from "pixi.js"
import { GlowFilter } from "@pixi/filter-glow"

class Lightning extends PIXI.Graphics {
	constructor(ship) {
		super()

		this.caster = ship
		this.distance = 0
		this.targets = []
		this.damage = 1

		let filter = new GlowFilter()
		filter.color = 0x5C98EF
		this.filters = [filter]

		this.find()

		this.timer = setInterval(() => {
			this.targets.push(this.target)
			this.caster = this.target
			this.find()
		}, 250)
	}

	find() {
		let targets = enemies.filter(enemy => ! this.targets.includes(enemy))

		if(targets.length) {
			targets.forEach((target, index) => {
				let dx = target.x - this.caster.x,
					dy = target.y - this.caster.y,
					distance = Math.sqrt(dx * dx + dy * dy)

				if(index == 0 || distance < this.distance) {
					this.target = target
					this.distance = distance
				}
			})

			this.target.hurt(this.damage)
		}
		else {
			this.destroy()
		}
	}

	animate() {
		// this.clear()
		// 	.lineStyle(5, 0x0000FF)
		// 	.moveTo(this.caster.x, this.caster.y)
		// 	.lineTo(this.target.x, this.target.y)

		this.clear()
			.lineStyle(1, 0x5C98EF)

		let dx = this.caster.x - this.target.x,
			dy = this.caster.y - this.target.y,
			angle = Math.atan2(dy, dx),
			distance = Math.sqrt(dx * dx + dy * dy),
			numberOfSteps = distance / 15,
			stepInPixels = distance / numberOfSteps

		for(let j = 0; j < 3; j++) {
			this.moveTo(this.caster.x, this.caster.y)

			for(let i = 1; i < numberOfSteps - 1; i++) {
				let step = stepInPixels * i,
					offset = Math.random() * 20 - 20 / 2,
					x = this.caster.x - Math.cos(angle) * step + Math.cos(angle + 1.55) * offset,
					y = this.caster.y - Math.sin(angle) * step + Math.sin(angle + 1.55) * offset

				this.lineTo(x, y)
			}

			this.lineTo(this.target.x, this.target.y)
		}
	}

	destroy() {
		super.destroy()
		clearInterval(this.timer)
		this.targets = []
	}
}

export default Lightning