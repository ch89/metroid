import * as PIXI from "pixi.js"
import Rocket from "./Rocket"
import Bomb from "./Bomb"
import HealthBar from "./HealthBar"
import Explosion from "./Explosion"

class Wasp2 extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.wasp.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width * .5
		this.y = app.screen.height * .5

		this.vx = 0
		this.vy = 0
		this.vr = .02
		this.force = .1
		this.limit = 10
		this.friction = .99
		this.bounce = -1
		this.life = 100
		this.maxLife = this.life
		this.experience = 25
		this.timers = {}

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)
	
		this.animate = this.chase
		this.init()
	}

	chase() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.boundaries()

		if(this.hit(ship)) {
			let angle = Math.atan2(ship.y - this.y, ship.x - this.x),
				speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

			ship.vx += Math.cos(angle) * speed
			ship.vy += Math.sin(angle) * speed
		}
	}

	boundaries() {
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

	defeated() {
		this.rotation += this.vr

		this.vy += this.force

		this.vx *= this.friction
		this.vy *= this.friction
	
		this.x += this.vx
		this.y += this.vy

		if(this.y + this.height / 2 > app.screen.height) {
			let explosion = new Explosion()
			explosion.scale.set(10)
			explosion.position.set(this.x, this.y)
			this.parent.addChild(explosion)

			clearInterval(this.timers.explosions)
			this.destroy()
		}
	}

	init() {
		this.count = 5

		this.timers.shoot = setInterval(this.shoot.bind(this), 2000)
		this.timers.drop = setInterval(this.drop.bind(this), 1000)
	}

	shoot() {
		this.parent.addChild(new Rocket(this))

		this.count--

		if(this.count == 0) {
			clearInterval(this.timers.shoot)
			clearInterval(this.timers.drop)
			setTimeout(this.init.bind(this), 10000)
		}
	}

	drop() {
		this.parent.addChild(new Bomb(this))
	}

	hurt(damage) {
		if(this.life > 0) {
			this.life -= damage

			if(this.life <= 0) {
				this.life = 0
				players.forEach(player => player.increase(this.experience))
				this.explosions()
				this.animate = this.defeated
			}
			
			this.health.update(this.life, this.maxLife)
		}
	}

	explosions() {
		this.timers.explosions = setInterval(() => {
			let explosion = new Explosion()

			explosion.x = this.x + Math.random() * this.width - this.width / 2
			explosion.y = this.y + Math.random() * this.height - this.height / 2

			this.parent.addChild(explosion)
		}, 250)
	}

	destroy() {
		this.health.destroy()
		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.timers.shoot)
	}
}

export default Wasp2