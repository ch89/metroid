import * as PIXI from "pixi.js"

class Laser extends PIXI.Sprite {
	constructor(enemy) {
		super(app.loader.resources.laser.texture)

		this.anchor.set(.5)
		// this.position.set(enemy.x - enemy.width / 2, enemy.y)
		// this.scale.set(2)
		this.rotation = Math.PI

		// this.vx = 5
		this.damage = 1

		// Temp for boss nightmare
		this.position.set(enemy.x, enemy.y + 50)
		this.scale.set(4)
		this.vx = 10
	}

	animate() {
		this.x -= this.vx

		if(this.x < 0) {
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

export default Laser