import * as PIXI from "pixi.js"

class Hypnotize extends PIXI.Container {
	constructor(hypnotizer) {
		super()

		this.hypnotizer = hypnotizer
		this.circles = []
		this.vx = 3
		this.va = .005

		hypnotizer.once("removed", this.destroy.bind(this))

		this.timer = setInterval(this.create.bind(this), 500)
	}

	create() {
		let circle = new PIXI.Graphics()
			.lineStyle(1, 0xFF0000)
			.drawEllipse(0, 0, 2, 4)

		circle.position.set(this.hypnotizer.x, this.hypnotizer.y)
		this.circles.push(circle)
		this.addChild(circle)
	}

	animate() {
		for(let circle of this.circles) {
			circle.x -= this.vx
			circle.scale.x += .05
			circle.scale.y += .2
			circle.alpha -= this.va

			if(circle.alpha <= 0) {
				this.circles.remove(circle)
				circle.destroy()
				return
			}
		}

		for(let player of players) {
			if(this.hit(player) && player.acceleration > 0) {
				player.hypnotize()
			}
		}
	}

	destroy() {
		super.destroy()
		clearInterval(this.timer)
	}
}

export default Hypnotize