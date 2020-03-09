import * as PIXI from "pixi.js"
import Rock from "./Rock"

class Lizard extends PIXI.AnimatedSprite {
	constructor() {
		super(app.loader.resources.spacepirate.spritesheet.animations.spacepirate)

		this.anchor.set(.5)
		this.scale.set(18)

		this.x = 0
		this.y = app.screen.height - this.height / 2

		this.animationSpeed = .1
		this.play()

		this.timer = setInterval(this.rock.bind(this), 500)
	}

	animate() {
		this.x += .2
	}

	rock() {
		this.parent.addChild(new Rock())
	}
}

export default Lizard