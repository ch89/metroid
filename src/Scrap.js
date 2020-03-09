import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Scrap extends PIXI.Sprite {
	constructor() {
		super([
			app.loader.resources.drill.texture,
			app.loader.resources.boomerang.texture,
			app.loader.resources.cannon.spritesheet.textures["cannon.png"]
		].random())

		this.anchor.set(.5)
		
		if(Math.random() >= .5) {
			this.x = Math.random() * app.screen.width
			this.y = Math.random() >= .5 ? 0 : app.screen.height
		}
		else {
			this.x = Math.random() >= .5 ? 0 : app.screen.width
			this.y = Math.random() * app.screen.height
		}

		let size = Math.random() * 2 + 1,
			angle = Math.atan2(ship.y - this.y, ship.x - this.x),
			force = .02

		this.scale.set(size)
		this.mass = size

		this.vx = 0
		this.vy = 0
		this.ax = Math.cos(angle) * force / this.mass
		this.ay = Math.sin(angle) * force / this.mass
		this.friction = .97
		this.life = 5
	}

	animate() {
		this.angle += .5 / this.mass

		this.vx += this.ax
		this.vy += this.ay

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		if(this.hit(ship)) {
			ship.hurt(3)
			this.explosion()
			this.destroy()
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) this.destroy()
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Scrap