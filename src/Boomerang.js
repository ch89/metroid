import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class Boomerang extends PIXI.Sprite {
	constructor(wasp) {
		super(app.loader.resources.claw.texture)

		this.wasp = wasp

		this.anchor.set(.5)
		// this.scale.set(2)
		this.scale.set(3)
		this.position.set(wasp.x, wasp.y)

		this.vr = .1
		this.force = .1
		this.damage = 1
		this.ready = true

		// this.speed = 16
		this.speed = 18

		let angle = Math.atan2(ship.y - this.y, ship.x - this.x)

		this.vx = Math.cos(angle) * this.speed
		this.vy = Math.sin(angle) * this.speed

		// this.ax = Math.cos(angle) * this.force
		// this.ay = Math.sin(angle) * this.force
	}

	animate() {
		this.rotation -= this.vr

		let angle = Math.atan2(this.wasp.y - this.y, this.wasp.x - this.x)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		// this.vx -= this.ax
		// this.vy -= this.ay

		this.x += this.vx
		this.y += this.vy

		if(this.hit(ship) && this.ready) {
			ship.hurt(this.damage)
			this.explosion()
			this.ready = false
			setTimeout(() => this.ready = true, 1000)
		}

		if(this.x > app.screen.width) this.destroy()
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Boomerang