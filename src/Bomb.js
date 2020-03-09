import * as PIXI from "pixi.js"
import MiniRocket from "./MiniRocket"
import Explosion from "./Explosion"

class Bomb extends PIXI.Sprite {
	constructor(wasp) {
		super(app.loader.resources.bomb.texture)

		this.anchor.set(.5)
		this.scale.set(3)
		this.position.set(wasp.x, wasp.y)
		this.rotation = Math.atan2(ship.y - this.y, ship.x - this.x)

		this.speed = 2

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed

		// let seconds = Math.floor(Math.random() * 8) + 3

		setTimeout(this.explode.bind(this), 1000 * 3)
	}

	animate() {
		// this.x += this.vx
		// this.y += this.vy
	}

	explode() {
		for(let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
			let rocket = new MiniRocket(angle)
			rocket.position.set(this.x, this.y)
			this.parent.addChild(rocket)
		}

		this.explosion()
		this.destroy()
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Bomb