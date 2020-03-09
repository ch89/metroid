import * as PIXI from "pixi.js"

class Spacepirate extends PIXI.AnimatedSprite {
	constructor() {
		super(app.loader.resources.spacepirate.spritesheet.animations.spacepirate)

		this.scale.set(2)

		this.x = 0
		this.y = app.screen.height - this.height / 2

		this.vx = 1
		this.vy = 0
		this.ax = .03
		this.friction = .97
		this.mass = 2
		this.life = 7 + level
		this.experience = 7

		this.animationSpeed = .167
		this.play()
	}

	animate() {
		this.vx += this.ax
		
		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx

		if(this.x > app.screen.width) {
			this.destroy()
			return
		}
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			players.forEach(player => player.increase(this.experience))
			this.destroy()
		}
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Spacepirate