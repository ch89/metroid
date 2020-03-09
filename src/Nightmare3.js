import * as PIXI from "pixi.js"
import Bomb from "./Bomb"
import MiniBomb from "./MiniBomb"
import SuperMissile from "./SuperMissile"
import Fusion from "./Fusion"
import HealthBar from "./HealthBar"
import Explosion from "./Explosion"
import { GlowFilter } from "@pixi/filter-glow"

class Nightmare3 extends PIXI.Sprite {
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
		this.threshold = .75
		this.vr = .01
		this.life = 100
		this.maxLife = this.life

		this.timers = {}

		this.shield = new GlowFilter()
		this.shield.color = 0x5C98EF
		this.filters = [this.shield]
		this.shield.enabled = false

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.states = [
			{ animate: this.chase, weapon: Bomb, delay: 2000 },
			{ animate: this.chase, weapon: MiniBomb, delay: 1000 }
		]

		this.reset()

		this.timers.fusion = setInterval(this.shoot.bind(this), 5000, Fusion)
	}

	reset() {
		this.state = this.states.filter(state => state != this.state).random()

		this.animate = this.state.animate

		this.timers.weapon = setInterval(this.shoot.bind(this), this.state.delay, this.state.weapon)

		this.timers.reset = setTimeout(() => {
			clearInterval(this.timers.weapon)
			this.reset()
		}, 10000)
	}

	load() {
		setTimeout(this.shoot.bind(this), 5000, SuperMissile)
	}

	break() {
		this.shield.enabled = false
		this.threshold -= .25
		// this.reset()
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

	aim() {
		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.border()
	}

	fall() {
		this.rotation += this.vr

		this.vx *= this.friction
		this.vy += this.force

		this.x += this.vx
		this.y += this.vy

		if(this.y + this.height / 2 > app.screen.height) {
			let explosion = new Explosion()
			explosion.scale.set(10)
			explosion.position.set(this.x, this.y)
			this.parent.addChild(explosion)

			this.destroy()
		}
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

	shoot(weapon) {
		this.parent.addChild(new weapon(this))
	}

	hurt(damage) {
		if(this.life > 0 && ! this.shield.enabled) {
			this.life -= damage

			if(this.life <= 0) {
				this.defeated()
			}
			else if(this.life / this.maxLife <= this.threshold) {
				this.shield.enabled = true
				this.load()
			}

			this.health.update(this.life, this.maxLife)
		}
	}

	explosions() {
		this.timers.explosions = setInterval(() => {
			let explosion = new Explosion()
			explosion.x = this.x + Math.random() * 100 - 50
			explosion.y = this.y + Math.random() * 100 - 50
			this.parent.addChild(explosion)
		}, 250)
	}

	defeated() {
		this.life = 0
		clearInterval(this.timers.fusion)
		clearInterval(this.timers.weapon)
		clearTimeout(this.timers.reset)
		this.explosions()
		this.animate = this.fall
	}

	destroy() {
		clearInterval(this.timers.explosions)
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Nightmare3