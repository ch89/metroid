import * as PIXI from "pixi.js"

class Bullet extends PIXI.Sprite {
	constructor(turret) {
		super(app.loader.resources.cannon.spritesheet.textures["bullet.png"])

		this.anchor.set(.5)
		this.scale.set(2)
		this.rotation = turret.rotation

		let gp = turret.getGlobalPosition()

		this.x = gp.x + Math.cos(this.rotation) * 40
		this.y = gp.y + Math.sin(this.rotation) * 40

		this.speed = 5
		this.damage = 1

		this.vx = Math.cos(this.rotation) * this.speed
		this.vy = Math.sin(this.rotation) * this.speed
	}

	animate() {
		this.x += this.vx
		this.y += this.vy

		if(this.x < 0 || this.x > app.screen.width || this.y < 0 || this.y > app.screen.height) {
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				player.hurt(this.damage)
				this.destroy()
				break
			}
		}
	}
}

export default Bullet