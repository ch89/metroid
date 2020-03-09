import * as PIXI from "pixi.js"

class Icon extends PIXI.Sprite {
	constructor(texture, power) {
		super(app.loader.resources[`${texture}icon`].texture)

		this.power = new PIXI.Text(power, new PIXI.TextStyle({
			fontFamily: "Gloria Hallelujah",
			fontSize: 18,
			fill: "#FFFFFF",
			stroke: "#000000",
			strokeThickness: 6
		}))
		this.power.x = this.width - this.power.width
		this.power.y = this.height - this.power.height

		let color = 0x000000
		// let color = 0x0000FF

		this.shadow = new PIXI.Graphics()
			.beginFill(color, .5)
			.drawRect(0, 0, this.width, this.height)

		this.skill = new PIXI.Sprite(app.loader.resources.skill.texture)
		this.skill.scale.set(.5)
		this.skill.y = this.height - this.skill.height

		this.addChild(this.power, this.shadow, this.skill)

		this.counter = new PIXI.Text(0, new PIXI.TextStyle({
			fontFamily: "Gloria Hallelujah",
			fontSize: 24,
			fill: "#FFFFFF",
			stroke: "#000000",
			strokeThickness: 8
		}))
		this.counter.anchor.set(.5)
		this.counter.position.set(this.width / 2, this.height / 2)
		this.shadow.addChild(this.counter)

		this.counter.visible = false
		this.skill.visible = false
	}
}

export default Icon