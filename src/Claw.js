import * as PIXI from "pixi.js"

class Claw extends PIXI.Container {
	constructor(turret) {
		super()

		this.turret = turret

		this.claw = new PIXI.Graphics()
			.lineStyle(2, 0x000000)
			.beginFill(0xFF0000)
			.lineTo(40, 20)
			.lineTo(0, 40)
			.lineTo(0, 40)
			.lineTo(0, 0)
			.endFill()

		this.claw.pivot.y = 20
		this.claw.rotation = turret.rotation

		let gp = turret.getGlobalPosition()

		this.claw.x = gp.x + Math.cos(turret.rotation) * turret.width * 2
		this.claw.y = gp.y + Math.sin(turret.rotation) * turret.width * 2

		this.speed = 10
		this.range = 600
		this.forward = true
		this.target = null

		this.vx = Math.cos(turret.rotation) * this.speed
		this.vy = Math.sin(turret.rotation) * this.speed

		this.chain = new PIXI.Graphics()

		this.addChild(this.claw, this.chain)
	}

	animate() {
		let gp = this.turret.getGlobalPosition(),
			tx = gp.x + Math.cos(this.turret.rotation) * this.turret.width * 2,
			ty = gp.y + Math.sin(this.turret.rotation) * this.turret.width * 2,
			cx = this.claw.x + Math.cos(this.claw.rotation) * this.claw.width,
			cy = this.claw.y + Math.sin(this.claw.rotation) * this.claw.width,
			dx = tx - this.claw.x,
			dy = ty - this.claw.y

		if(this.forward) {
			this.claw.x += this.vx
			this.claw.y += this.vy

			let distance = Math.sqrt(dx * dx + dy * dy)

			if(distance >= this.range) {
				this.forward = false
			}
			else if(ship.hitPoint(cx, cy)) {
				this.forward = false
				this.target = ship
				this.target.active = false
			}
			else {
				for(let enemy of enemies) {
					if(enemy.hitPoint(cx, cy)) {
						this.forward = false
						this.target = enemy
						this.target.active = false
						break
					}
				}
			}
		}
		else {
			let angle = Math.atan2(dy, dx)

			this.claw.x += Math.cos(angle) * this.speed
			this.claw.y += Math.sin(angle) * this.speed

			if(this.target) this.target.position.set(cx, cy)

			if(this.claw.hit(this.turret)) {
				if(this.target) {
					if(this.target.reset) this.target.reset()
					this.target.active = true
				}

				this.destroy()
			}
		}

		this.chain
			.clear()
			.lineStyle(2, 0xFF0000)
			.moveTo(tx, ty)
			.lineTo(this.claw.x, this.claw.y)
	}
}

export default Claw