import * as PIXI from "pixi.js"

class Flame extends PIXI.Container {
	constructor(turret) {
		super()

		this.turret = turret
		this.range = 40
		this.speed = 4
		this.damage = 1
		this.va = .01
		this.vs = .1
		this.flames = []
		this.targets = []

		this.timer = setInterval(this.create.bind(this), 50)
	}

	create() {
		let flame = new PIXI.Sprite(app.loader.resources.particle.texture),
			gp = this.turret.getGlobalPosition()

		flame.anchor.set(.5)

		flame.x = gp.x + Math.cos(this.turret.rotation) * this.range
		flame.y = gp.y + Math.sin(this.turret.rotation) * this.range

		flame.vx = Math.cos(this.turret.rotation) * this.speed
		flame.vy = Math.sin(this.turret.rotation) * this.speed

		flame.rotation = Math.random() * Math.PI * 2
		flame.scale.set(Math.random() * .5 + .5)

		this.flames.push(flame)
		this.addChild(flame)
	}

	animate() {
		for(let flame of this.flames) {
			flame.x += flame.vx
			flame.y += flame.vy

			flame.scale.x += this.vs
			flame.scale.y += this.vs

			flame.alpha -= this.va

			if(flame.alpha <= 0) {
				this.flames.remove(flame)
				flame.destroy()
			}
		}

		for(let player of players) {
			if(this.hit(player) && ! this.targets.includes(player)) {
				player.hurt(this.damage)
				this.targets.push(player)

				setTimeout(() => this.targets.remove(player), 300)
			}
		}
	}

	destroy() {
		super.destroy()
		clearInterval(this.timer)
	}
}

export default Flame