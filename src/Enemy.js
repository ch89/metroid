import * as PIXI from "pixi.js"
import Laser from "./Laser"
import Explosion from "./Explosion"

class Enemy extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.enemy.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = Math.random() * app.screen.height

		this.vx = -1
		this.vy = 0
		this.ax = -.03
		this.ay = .03
		this.friction = .97
		this.bounce = -1
		this.radians = 0
		this.mass = 1
		this.life = 3 + level
		this.experience = 3

		this.timer = setInterval(this.shoot.bind(this), 5000)
	}

	animate() {
		// Version 1
		// this.x -= this.vx

		// this.y = this.center + Math.sin(this.radians) * this.range
		// this.radians += this.vy

		// Version 2
		this.vx += this.ax

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.y += Math.sin(this.radians)
        this.radians += this.ay
        
		if(this.y - this.height / 2 < 0) {
            this.y = this.height / 2
            this.vy *= this.bounce
        }
        else if(this.y + this.height / 2 > app.screen.height) {
            this.y = app.screen.height - this.height / 2
            this.vy *= this.bounce
        }

		if(this.x < 0) this.destroy()
	}

	shoot() {
		this.parent.addChild(new Laser(this))
	}
	
	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			players.forEach(player => player.increase(this.experience))
			this.explosion()
			this.destroy()
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.timer)
	}
}

export default Enemy