import * as PIXI from "pixi.js"
import Bomb from "./Bomb"
import MiniBomb from "./MiniBomb"
import Missile from "./Missile"
import HealthBar from "./HealthBar"

class Nightmare2 extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.nightmare.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		this.force = .025
		this.limit = 3
		this.friction = .97
		this.bounce = -.7
		this.life = 100
		this.maxLife = this.life

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.states = [
			{ method: this.chase, weapon: Bomb, delay: 2000 },
			{ method: this.chase, weapon: MiniBomb, delay: 1000 },
			{ method: this.chase, weapon: Missile, delay: 1000 }
		]

		this.reset()
	}

	// reset() {
	// 	this.animate = this.chase
	// 	let timer = setInterval(this.bomb.bind(this), 2000)

	// 	setTimeout(() => {
	// 		clearInterval(timer)
	// 		this.animate = this.aim
	// 		setTimeout(this.reset.bind(this), 10000)
	// 	}, 10000)
	// }

	reset() {
		let state = this.states.random()

		this.animate = state.method

		let timer = setInterval(() => {
			this.parent.addChild(new state.weapon(this))
		}, state.delay)

		setTimeout(() => {
			clearInterval(timer)
			this.reset()
		}, 10000)
	}

	aim() {
		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.border()
	}

	chase() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		if(speed > this.limit) {
			this.vx *= this.limit / speed
			this.vy *= this.limit / speed
		}

		this.x += this.vx
		this.y += this.vy

		this.border()
	}

	border() {
		if(this.x - this.width / 2 < 0) {
			this.x = this.width / 2
			this.vx *= this.bounce
		}
		else if(this.x + this.width / 2 > app.screen.width) {
			this.x = app.screen.width - this.width / 2
			this.vx *= this.bounce
		}
		if(this.y - this.height / 2 < 0) {
			this.y = this.height / 2
			this.vy *= this.bounce
		}
		else if(this.y + this.height / 2 > app.screen.height) {
			this.y = app.screen.height - this.height / 2
			this.vy *= this.bounce
		}
	}

	hurt(damage) {
		this.life -= damage

		this.health.update(this.life, this.maxLife)
	}
}

export default Nightmare2