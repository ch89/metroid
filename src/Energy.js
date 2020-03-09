import * as PIXI from "pixi.js"
import DisplayText from "./DisplayText"

class Energy extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.energy.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = Math.random() * app.screen.height

		this.vr = .01
		this.vx = 1
		this.mass = 1
		this.energy = 5
	}

	animate() {
		this.rotation -= this.vr
		this.x -= this.vx

		if(this.x < 0) {
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				player.heal(this.energy)
				this.showEnergy()
				this.destroy()
			}
		}
	}

	showEnergy() {
		let text = new DisplayText(`+${this.energy}hp`)
		text.position.set(this.x, this.y)
		this.parent.addChild(text)
	}

	// destroy() {
	// 	super.destroy()
	// 	powers.remove(this)
	// }
}

export default Energy