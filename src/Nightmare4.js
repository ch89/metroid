import * as PIXI from "pixi.js"
import HealthBar from "./HealthBar"
import Bomb from "./Bomb"
import Laser from "./Laser"
import SuperMissile from "./SuperMissile"
import Explosion from "./Explosion"
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
		this.threshold = .75
		this.life = 100
		this.maxLife = this.life
		this.intervals = {}
		this.timeouts = {}

		this.defense = new GlowFilter()
		this.defense.color = 0x5C98EF
		this.filters = [this.defense]
		this.defense.enabled = false

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.animate = this.chase
		
		this.bombs()
		this.laser()
	}

	bombs() {
		let count = 5

		this.intervals.bombs = setInterval(() => {
			this.parent.addChild(new Bomb(this))

			count--

			if(count == 0) {
				clearInterval(this.intervals.bombs)
				this.timeouts.bomb = setTimeout(this.bombs.bind(this), 10000)
			}
		}, 2000)
	}

	laser() {
		this.timeouts.laser = setTimeout(() => {
			this.intervals.laser = setInterval(() => {
				this.parent.addChild(new Laser(this))
			}, 750)

			this.timeouts.laser = setTimeout(() => {
				clearInterval(this.intervals.laser)
				this.laser()
			}, 5000)
		}, 5000)
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

	stop() {
		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.border()
	}

	fall() {
		this.vx *= this.friction
		this.vy += this.force

		this.x += this.vx
		this.y += this.vy

		if(this.y + this.height / 2 > app.screen.height) {
			let explosion = new Explosion()
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

	reload() {
		setTimeout(() => this.parent.addChild(new SuperMissile(this)), 5000)
	}

	hurt(damage) {
		if(this.life > 0 && ! this.defense.enabled) {
			this.life -= damage

			if(this.life <= 0) {
				this.defeated()
			}
			else if(this.life / this.maxLife <= this.threshold) {
				this.defense.enabled = true
				this.threshold -= .25
				this.reload()
			}

			this.health.update(this.life, this.maxLife)
		}
	}

	defeated() {
		this.life = 0

		clearTimeout(this.timeouts.laser)
		clearTimeout(this.timeouts.bomb)

		clearInterval(this.intervals.laser)
		clearInterval(this.intervals.bomb)

		this.animate = this.fall
		this.explosions()
	}

	explosions() {
		this.intervals.explosions = setInterval(() => {
			let explosion = new Explosion()
			explosion.x = this.x + Math.random() * 100 - 50
			explosion.y = this.y + Math.random() * 100 - 50
			this.parent.addChild(explosion)
		}, 250)
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.intervals.explosions)
	}
}

export default Nightmare