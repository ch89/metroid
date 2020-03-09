import * as PIXI from "pixi.js"

class DisplayText extends PIXI.Text {
	constructor(text) {
		super(text, new PIXI.TextStyle({
			fontFamily: "Gloria Hallelujah",
			fontSize: 24,
			fill: "#FFFFFF",
			stroke: "#000000",
			strokeThickness: 8
		}))

		this.anchor.set(.5)

		this.vy = .1
		this.va = .005
	}

	animate() {
		this.y -= this.vy
		this.alpha -= .005

		if(this.alpha <= 0) this.destroy()
	}
}

export default DisplayText