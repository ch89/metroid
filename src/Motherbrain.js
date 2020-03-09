import * as PIXI from "pixi.js"
import Plasma from "./Plasma"
import Shield from "./Shield"
import HealthBar from "./HealthBar"
import { GlowFilter } from "@pixi/filter-glow"
import Explosion from "./Explosion"

class Motherbrain extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.motherbrain.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = app.screen.height / 2

		this.vx = 2
		this.defence = true
		this.life = 10
		this.maxLife = this.life

		this.shield = new Shield(0xFF0000, 50)
		this.addChild(this.shield)

		this.filter = new GlowFilter()
		this.filter.color = 0x5C98EF
		this.filters = [this.filter]

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.reload()
	}

	animate() {
		if(this.x > app.screen.width - 200) this.x -= this.vx

		if(this.shield.visible) this.shield.animate()
	}

	shoot() {
		this.parent.addChild(new Plasma(this))
	}

	reload() {
		this.timer = setTimeout(this.shoot.bind(this), 3000)
	}

	hurt(damage) {
		if(! this.filter.enabled && this.life > 0) {
			this.life -= damage

			if(this.life <= 0) {
				this.life = 0
				this.explode()
				clearTimeout(this.timer)
			}

			this.health.update(this.life, this.maxLife)
		}
	}

	explode() {
		let count = 50,
			timer = setInterval(() => {
			let explosion = new Explosion()

			explosion.x = this.x + Math.random() * 100 - 50
			explosion.y = this.y + Math.random() * 100 - 50

			this.parent.addChild(explosion)

			app.loader.resources.explode.sound.play()

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

	destroy() {
		this.parent.removeChild(this)
		enemies.remove(this)
	}
}

export default Motherbrain