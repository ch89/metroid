import * as PIXI from "pixi.js"

class Explosion extends PIXI.AnimatedSprite {
	constructor() {
		super(app.loader.resources.explosion.spritesheet.animations.explosion)

		this.scale.set(2)
		this.animationSpeed = .25
		this.loop = false
		this.onComplete = this.destroy
		this.play()

		this.active = false

		app.loader.resources.explode.sound.play()
	}
}

export default Explosion