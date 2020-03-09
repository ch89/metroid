import * as PIXI from "pixi.js"
import Rocket from "./Rocket"
import Bomb from "./Bomb"
import SuperMissile from "./SuperMissile"
import HealthBar from "./HealthBar"
import { GlowFilter } from "@pixi/filter-glow"

class Nightmare extends PIXI.Sprite {
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
		this.life = 10
		this.maxLife = this.life
		this.timers = {}
		this.threshold = .5

		this.filter = new GlowFilter()
		this.filter.color = 0x5C98EF
		this.filters = [this.filter]
		this.filter.enabled = false

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.weapons = [
			{ type: Rocket, delay: 2000 },
			{ type: Bomb, delay: 1000 }
		]
		
		this.reset()
	}

	reset() {
		this.animate = this.chase
		this.change()

		setTimeout(() => {
			clearInterval(this.timer)
			this.animate = this.aim
			setTimeout(this.reset.bind(this), 10000)
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

	change() {
		let weapon = this.weapons.random()

		this.timer = setInterval(() => {
			this.parent.addChild(new weapon.type(this))
		}, weapon.delay)
		
		// setTimeout(this.shoot.bind(this), 3000)
	}

	shoot() {
		this.parent.addChild(new SuperMissile(this))
	}

	plant() {
		this.parent.addChild(new Rocket(this))

		this.count--

		if(this.count == 0) {
			clearInterval(this.timers.rocket)
			// clearInterval(this.timers.bomb)
			setTimeout(this.reload.bind(this), 10000)

			// this.reload()
		}
	}

	drop() {
		this.parent.addChild(new Bomb(this))
	}

	// fall() {
	// 	this.rotation += .005

	// 	this.vx *= this.friction
	// 	this.vy += this.force

	// 	this.x += this.vx
	// 	this.y += this.vy

	// 	if(this.y + this.height / 4 > app.screen.height) {
	// 		this.y = app.screen.height - this.height / 4
	// 		this.animate = this.stop
	// 	}
	// }

	stop() {
		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy
	}

	breakShield() {
		this.filter.enabled = false
		this.reset()
	}

	hurt(damage) {
		if(this.filter.enabled) return

		this.life -= damage

		this.health.update(this.life, this.maxLife)
	}
}

export default Nightmare