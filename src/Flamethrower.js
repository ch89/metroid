import * as PIXI from "pixi.js"
import Bullet from "./Bullet"
import Flame from "./Flame"
import IceMissile from "./IceMissile"

class Cannon extends PIXI.Sprite {
	constructor() {
		let textures = app.loader.resources.cannon.spritesheet.textures

		super(textures["cannon.png"])

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width
		this.y = Math.random() * app.screen.height

		this.turret = new PIXI.Sprite(textures["turret.png"])
		this.addChild(this.turret)

		let pipe = new PIXI.Sprite(textures["pipe.png"])
		pipe.x = 6
		this.turret.addChild(pipe)

		this.vx = -1
		this.vy = 0
		this.ax = -.03
		this.friction = .97
		this.bounce = -1
		this.mass = 1
		this.life = 5
		this.experience = 5

		// this.timer = setInterval(this.shoot.bind(this), 5000)

		this.flame = new Flame(this.turret)
		this.once("added", () => this.parent.addChild(this.flame))
	}

	animate() {
		// Version 1
		// this.x -= this.vx

		// Version 2
		this.vx += this.ax

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		if(this.y - this.height / 2 < 0) {
            this.y = this.height / 2
            this.vy *= this.bounce
        }
        else if(this.y + this.height / 2 > app.screen.height) {
            this.y = app.screen.height - this.height / 2
            this.vy *= this.bounce
        }

        if(this.x < 0) {
        	this.destroy()
        	return
        }

		this.turret.rotation = Math.atan2(ship.y - this.y, ship.x - this.x)
	}

	shoot() {
		// this.parent.addChild(new Bullet(this.turret))
		this.parent.addChild(new IceMissile(this.turret))
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			players.forEach(player => player.increase(this.experience))
			this.destroy()
		}
	}

	destroy() {
		this.flame.destroy()
		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.timer)
	}
}

export default Cannon