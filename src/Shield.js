import * as PIXI from "pixi.js"

class Shield extends PIXI.Graphics {
	constructor(color, radius = 30) {
		super()

		this.beginFill(color)
			.drawCircle(0, 0, radius)
			.endFill()

		this.vs = .02
		this.va = .025

		this.reset()
	}

	animate() {
		this.scale.x += this.vs
		this.scale.y += this.vs
		this.alpha -= this.va

		if(this.alpha <= 0) this.reset()
	}

	reset() {
		this.visible = false
		this.scale.set(1)
		this.alpha = .5
	}
}

export default Shield