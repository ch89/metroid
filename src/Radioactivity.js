import * as PIXI from "pixi.js"

class Radioactivity extends PIXI.Graphics {
	constructor(ship) {
		super()

		this.position.set(ship.x, ship.y)

		this.radius = 0
		this.force = 5
		this.va = .005
		this.damage = 1
		this.targets = []
	}

	animate() {
		// this.radius += this.force
		// this.alpha -= this.va

		this.radius += this.force * this.alpha
		this.alpha -= this.va

		if(this.alpha <= 0) {
			this.destroy()
			return
		}

		for(let enemy of enemies) {
			if(this.hit(enemy) && ! this.targets.includes(enemy)) {
				this.targets.push(enemy)

				let radioactivity = new PIXI.Sprite(app.loader.resources.radioactivity.texture)
				radioactivity.anchor.set(.5)
				enemy.addChild(radioactivity)

				let count = 10
				
				let timer = setInterval(() => {
					enemy.hurt(this.damage)
					
					count--

					if(count == 0) {
						clearInterval(timer)
						radioactivity.destroy()
					}
				}, 2000)

				enemy.once("removed", () => {
					clearInterval(timer)
					radioactivity.destroy()
				})
			}
		}

		this.clear()
			.lineStyle(5, 0x00FF00)
			.drawCircle(0, 0, this.radius)
	}
}

export default Radioactivity