import * as PIXI from "pixi.js"
import Explosion from "./Explosion"

class SuperMissile extends PIXI.Sprite {
	constructor(nightmare) {
		super(app.loader.resources.seekingmissile.texture)

		this.nightmare = nightmare

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(nightmare.x, nightmare.y + 50)
		this.rotation = Math.PI
	
		this.vx = 0
		this.vy = 0
		this.speed = 5
		this.force = .15
		this.damage = 3
		this.targets = players.slice()

		// setTimeout(() => this.targets.push(nightmare), 3000)

		this.ready = false
		setTimeout(() => this.ready = true, 3000)
	}

	animate() {
		// this.rotation = Math.atan2(ship.y - this.y, ship.x - this.x)

		// this.x += Math.cos(this.rotation) * this.speed
		// this.y += Math.sin(this.rotation) * this.speed

		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			distance = Math.sqrt(dx * dx + dy * dy),
			angle = Math.atan2(dy, dx)
			
		// this.vx += Math.cos(angle) * this.force
		// this.vy += Math.sin(angle) * this.force

		this.vx += dx / distance * this.force
		this.vy += dy / distance * this.force

		let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		this.vx = this.vx / speed * this.speed
		this.vy = this.vy / speed * this.speed

		this.x += this.vx
		this.y += this.vy

		this.rotation = Math.atan2(this.vy, this.vx)

		this.addSmoke()

		if(this.hit(this.nightmare) && this.ready) {
			this.nightmare.defense.enabled = false
			this.explosion()
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				this.nightmare.reload()
				player.hurt(this.damage)
				this.explosion()
				this.destroy()
				break
			}
		}
	}

	addSmoke() {
		let smoke = new PIXI.Sprite(app.loader.resources.particle.texture)
		smoke.anchor.set(.5)
		smoke.x = this.x - Math.cos(this.rotation) * this.width / 2
		smoke.y = this.y - Math.sin(this.rotation) * this.width / 2
		smoke.rotation = Math.random() * Math.PI * 2
		smoke.scale.set(Math.random() * .5 + 1)
		smoke.speed = Math.random() * .05 + .025
		particles.addChild(smoke)

		smoke.animate = function() {
			this.scale.x += this.speed
			this.scale.y += this.speed
			this.alpha -= this.speed

			if(this.alpha <= 0) this.destroy()
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.scale.set(5)
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default SuperMissile