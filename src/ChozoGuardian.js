import * as PIXI from "pixi.js"
import Scrap from "./Scrap"
import Explosion from "./Explosion"
import HealthBar from "./HealthBar"

class ChozoGuardian extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.knight.texture)

		this.anchor.set(.5)

		this.x = app.screen.width / 2
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		this.vs = .005
		this.va = .01
		this.range = 1000
		this.magnetism = 10
		this.acceleration = .025
		this.friction = .97
		this.life = 100
		this.maxLife = this.life

		this.wave = new PIXI.Graphics()
			.lineStyle(5, 0x0000FF)
			.drawCircle(0, 0, 100)

		this.wave.visible = false
		this.reset()

		this.addChild(this.wave)

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.state = this.move

		this.timers = [
			setInterval(this.add.bind(this), 1000),
			setInterval(() => this.wave.visible = ! this.wave.visible, 10000)
		]
	}

	animate() {
		if(this.wave.visible) {
			enemies
				.filter(enemy => enemy != this)
				.forEach(enemy => this.attract(enemy))

			this.attract(ship)

			this.wave.scale.x -= this.vs
			this.wave.scale.y -= this.vs
			this.wave.alpha -= this.va

			if(this.wave.alpha <= 0) this.reset()
		}

		// if(this.life / this.maxLife <= .5) this.state()

		this.state()
	}

	move() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.acceleration
		this.vy += Math.sin(angle) * this.acceleration

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy
	}

	fall() {
		this.rotation += .005

		this.vx *= this.friction
		this.vy += this.acceleration
		
		this.x += this.vx
		this.y += this.vy

		if(this.y > app.screen.height) {
			let explosion = new Explosion()
			explosion.scale.set(10)
			explosion.position.set(this.x, this.y)
			this.parent.addChild(explosion)

			this.destroy()
		}
	}

	add() {
		let scrap = new Scrap()
		enemies.push(scrap)
		this.parent.addChild(scrap)
	}

	reset() {
		this.wave.scale.set(1)
		this.wave.alpha = .5
	}

	attract(target) {
		let dx = this.x - target.x,
			dy = this.y - target.y,
			distance = Math.sqrt(dx * dx + dy * dy)

		if(distance < this.range) {
			let force = (1 - distance / this.range) * this.magnetism / target.mass

			target.x += dx / distance * force
			target.y += dy / distance * force

			if(distance < 50) {
				this.explosion(target)
				target.destroy()
			}
		}
	}

	explode() {
		let explosion = new Explosion()

		explosion.x = this.x + Math.random() * 100 - 50
		explosion.y = this.y + Math.random() * 100 - 50

		this.parent.addChild(explosion)

		app.loader.resources.explode.sound.play()
	}

	explosion(target) {
		let explosion = new Explosion()
		explosion.position.set(target.x, target.y)
		this.parent.addChild(explosion)
	}

	hurt(damage) {
		if(this.life > 0) {
			this.life -= damage

			if(this.life <= 0) {
				this.life = 0
				this.state = this.fall
				this.timers.push(setInterval(this.explode.bind(this), 300))
			}

			this.health.update(this.life)
		}
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
		this.timers.forEach(timer => clearInterval(timer))
	}
}

export default ChozoGuardian