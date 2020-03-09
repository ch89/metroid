import * as PIXI from "pixi.js"
import Boomerang from "./Boomerang"
import Arm from "./Arm"
import Fireball from "./Fireball"
import HealthBar from "./HealthBar"
import Explosion from "./Explosion"

class Kraid extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.kraid.texture)

		this.anchor.set(.5)
		this.scale.set(3)

		this.x = app.screen.width + this.width / 2
		this.y = app.screen.height - this.height / 2

		this.vx = 1
		this.threshold = .66
		this.life = 300
		this.maxLife = this.life
		this.timeouts = {}
		this.intervals = {}

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.weapons = [this.claw, this.arm, this.fire]

		this.addWeapon()
	}

	addWeapon() {
		this.weapon = this.weapons.random()
		this.weapons.remove(this.weapon)
		this.weapon()
	}

	claw() {
		this.timeouts.claw = setTimeout(() => {
			let count = 0

			this.intervals.claw = setInterval(() => {
				this.parent.addChild(new Boomerang(this))

				count++

				if(count == 5) {
					clearInterval(this.intervals.claw)
					this.claw()
				}
			}, 2000)
		}, 10000)
	}

	arm() {
		this.timeouts.arm = setTimeout(() => {
			let count = 0

			this.intervals.arm = setInterval(() => {
				let arm = new Arm(this)
				arm.position.set(this.x - 300, this.y + count * 100)
				this.parent.addChild(arm)
				
				count++

				if(count == 3) {
					clearInterval(this.intervals.arm)
					this.arm()
				}
			}, 1000)
		}, 7000)
	}

	fire() {
		this.timeouts.fire = setTimeout(() => {
			let count = 0

			this.intervals.fire = setInterval(() => {
				let fireball = new Fireball(this)
				fireball.position.set(this.x - 100, this.y - 300)
				this.parent.addChild(fireball)
				
				count++

				if(count == 10) {
					clearInterval(this.intervals.fire)
					this.fire()
				}
			}, 1000)
		}, 10000)
	}

	animate() {
		if(this.x > app.screen.width - 200) this.x -= this.vx
	}

	hurt(damage) {
		if(this.life > 0) {
			this.life -= damage

			if(this.life <= 0) this.defeated()
			else if(this.life / this.maxLife <= this.threshold) {
				this.threshold -= .33
				this.addWeapon()
			}

			this.health.update(this.life, this.maxLife)
		}
	}

	defeated() {
		this.life = 0

		clearInterval(this.intervals.arm)
		clearInterval(this.intervals.fire)
		clearInterval(this.intervals.claw)

		clearTimeout(this.timeouts.arm)
		clearTimeout(this.timeouts.fire)

		this.explosions()

		setTimeout(() => {
			let explosion = new Explosion()
			explosion.scale.set(10)
			explosion.x = this.x
			explosion.y = this.y
			this.parent.addChild(explosion)

		 	clearInterval(this.intervals.explosions)
		 	this.destroy()
		}, 10000)
	}

	explosions() {
		this.intervals.explosions = setInterval(() => {
			let explosion = new Explosion()
			explosion.x = this.x + Math.random() * this.width - this.width / 2
			explosion.y = this.y + Math.random() * this.height - this.height / 2
			this.parent.addChild(explosion)
		}, 200)
	}

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Kraid