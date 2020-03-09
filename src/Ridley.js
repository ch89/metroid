import * as PIXI from "pixi.js"
import Explosion from "./Explosion"
import Fire from "./Fire"
import HealthBar from "./HealthBar"

class Ridley extends PIXI.AnimatedSprite {
	constructor() {
		super(app.loader.resources.ridley.spritesheet.animations.ridley)

		this.anchor.set(.5)
		this.scale.set(2)
		
		this.x = app.screen.width
		this.y = app.screen.height / 2

		this.animationSpeed = .167
		this.play()

		this.vx = 0
		this.vy = 0
		this.limit = 10
		this.bounce = -.5
		this.radians = 0
		this.ready = true
		this.life = 100
		this.maxLife = this.life

		// Version 1
		// this.force = .1
		// this.friction = .97

		// Version 2
		this.force = .15
		this.friction = .99

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		// app.loader.resources.ridleytheme.sound.play()

		this.reset()
	}

	reset() {
		this.animate = this.chase

		this.timer = setTimeout(this.prepare.bind(this), 10000)
	}

	chase() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		// let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		// if(speed > this.limit) {
		// 	this.vx *= this.limit / speed
		// 	this.vy *= this.limit / speed
		// }

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		if(this.y + this.height / 2 > app.screen.height) {
			this.y = app.screen.height - this.height / 2
			this.vy *= this.bounce
		}

		if(this.hit(ship)) {
			ship.active = false
			ship.reset()
			clearTimeout(this.timer)
			this.parent.swapChildren(this, ship)
			this.animate = this.grab
		}
	}

	grab() {
		if(this.y + this.height / 2 > app.screen.height) {
			this.y = app.screen.height - this.height / 2
			this.vy = 0

			this.timer = setInterval(() => {
				ship.hurt(1)
				this.explosion(ship)
			}, 300)

			this.animate = this.drag
		}
		else {
			this.vx *= this.friction
			this.vy += this.force
			
			this.x += this.vx
			this.y += this.vy
		}

		ship.x = this.x + this.width / 2 - ship.width / 2
		ship.y = this.y + this.height / 2 - ship.height / 2
	}

	drag() {
		this.vx += this.force

		if(this.vx > this.limit) this.vx = this.limit

		this.x += this.vx

		if(this.x > app.screen.width - 300) {
			ship.active = true
			ship.vx = this.vx
			clearInterval(this.timer)
			this.animate = this.release
		}

		ship.x = this.x + this.width / 2 - ship.width / 2
		ship.y = this.y + this.height / 2 - ship.height / 2
	}

	release() {
		let dx = app.screen.width / 2 - this.x,
			dy = app.screen.height / 2 - this.y,
			distane = Math.sqrt(dx * dx + dy * dy),
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

		if(distane < 300) this.prepare()
	}

	prepare() {
		let count = 10,
			timer = setInterval(() => {
			this.shoot()
			count--

			if(count == 0) {
				clearInterval(timer)
				this.reset()
			}
		}, 500)

		this.radians = 0
		this.animate = this.stop
	}

	stop() {
		this.vx *= .97
		this.vy *= .97

		this.x += this.vx
		this.y += this.vy

		this.y += Math.sin(this.radians)
        this.radians += .03

        if(this.y + this.height / 2 > app.screen.height) {
			this.y = app.screen.height - this.height / 2
			this.vy *= this.bounce
		}
	}

	shoot() {
		this.parent.addChild(new Fire(this))
	}

	spike() {
		this.vy += .7
		this.x -= 5
		this.y += this.vy

		if(this.y + this.height / 2 > app.screen.height) {
			this.vy *= -1
			this.y = app.screen.height - this.height / 2
		}
	}

	explosion(character) {
		let explosion = new Explosion()
		explosion.position.set(character.x, character.y)
		this.parent.addChild(explosion)

		app.loader.resources.explode.sound.play()
	}

	explode() {
		let count = 20,
			timer = setInterval(() => {
			let explosion = new Explosion()

			explosion.x = this.x + Math.random() * 100 - 50
			explosion.y = this.y + Math.random() * 100 - 50

			this.parent.addChild(explosion)

			app.loader.resources.explode.sound.play()

			if(count == 10) app.loader.resources.scream.sound.play()

			count--

			if(count == 0) {
				let explosion = new Explosion()
				explosion.scale.set(10)
				explosion.position.set(this.x, this.y)
				this.parent.addChild(explosion)
				
				clearInterval(timer)
				this.destroy()
			}
		}, 250)
	}

	hurt(damage) {
		if(this.life > 0) {
			this.life -= damage

			if(this.ready) {
				app.loader.resources.scream.sound.play()

				this.ready = false
				setTimeout(() => this.ready = true, 5000)
			}

			if(this.life <= 0) {
				this.life = 0
				this.animate = this.stop
				this.explode()
			}

			this.health.update(this.life, this.maxLife)
		}
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Ridley