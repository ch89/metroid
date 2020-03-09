import * as PIXI from "pixi.js"
import DisplayText from "./DisplayText"
import Missile from "./Missile"
import Grenade from "./Grenade"
import WaveBeam from "./WaveBeam"
import IceBeam from "./IceBeam"

class Weapon extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.weapon.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = Math.random() * app.screen.height

		this.vr = .01
		this.vx = 1
		this.mass = 1

		this.weapons = {
			Missile,
			Grenade,
			"Wave Beam": WaveBeam,
			"Ice Beam": IceBeam
		}

		this.type = Object.keys(this.weapons).random()
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
				player.change(this.weapons[this.type])
				this.showPower()
				this.destroy()
			}
		}
	}

	showPower() {
		let text = new DisplayText(this.type)
		text.position.set(this.x, this.y)
		this.parent.addChild(text)
	}
}

export default Weapon