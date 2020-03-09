import * as PIXI from "pixi.js"
import DisplayText from "./DisplayText"

class Orb extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.orb.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = Math.random() * app.screen.height

		this.vr = .01
		this.vx = 1
		this.mass = 1
		this.experience = Math.floor(Math.random() * 21 + 10)
	}

	animate() {
		this.rotation -= this.vr
		this.x -= this.vx

		for(let player of players) {
			if(this.hit(player)) {
				player.increase(this.experience)
				this.showExperience()
				this.destroy()
				break
			}
		}
	}

	showExperience() {
		let text = new DisplayText(`+${this.experience} Experience`)
		text.position.set(this.x, this.y)
		this.parent.addChild(text)
	}

	destroy() {
		super.destroy()
		powers.remove(this)
	}
}

export default Orb