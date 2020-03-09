import * as PIXI from "pixi.js"

class HealthBar extends PIXI.Container {
	constructor(amount, maxAmount, color = 0x008800) {
		super()

		this.background = new PIXI.Graphics()
			.beginFill(0xDD0000)
			.drawRect(0, 0, 200, 25)
			.endFill()

		this.foreground = new PIXI.Graphics()
			.beginFill(color)
			.drawRect(0, 0, 200, 25)
			.endFill()

		this.border = new PIXI.Graphics()
			.lineStyle(4)
			.drawRect(0, 0, 200, 25)

		let style = new PIXI.TextStyle({
			fontFamily: "Gloria Hallelujah",
			fontSize: 24,
			fill: "#FFFFFF",
			stroke: "#000000",
			strokeThickness: 8
		})

		this.text = new PIXI.Text("", style)
		this.text.y = 25

		this.addChild(
			this.background, 
			this.foreground, 
			this.border,
			this.text
		)

		this.update(amount, maxAmount)
	}

	update(amount, maxAmount) {
		this.foreground.scale.x = amount / maxAmount
		this.text.text = `${amount} / ${maxAmount}`
	}
}

export default HealthBar