import * as PIXI from "pixi.js"

class IceMissile extends PIXI.Sprite {
	constructor(turret) {
		super(app.loader.resources.icemissile.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.rotation = turret.rotation

		let gp = turret.getGlobalPosition()

		this.x = gp.x + Math.cos(this.rotation) * turret.width * 2
		this.y = gp.y + Math.sin(this.rotation) * turret.width * 2

		this.speed = 1
		this.damage = 1
		this.force = .1

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed

		this.ax = Math.cos(this.rotation) * this.force
		this.ay = Math.sin(this.rotation) * this.force
	}

	animate() {
		this.vx += this.ax
		this.vy += this.ay

		this.x += this.vx
		this.y += this.vy

		this.addSmoke()

		if(this.x < 0 || this.x > app.screen.width || this.y < 0 || this.y > app.screen.height) {
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				player.slow()
				player.hurt(this.damage)
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
		// smoke.scale.set(Math.random() * .25 + .5)
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
}

export default IceMissile