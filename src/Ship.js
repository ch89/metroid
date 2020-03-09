import * as PIXI from "pixi.js"
import { controller } from "./key"
import Player from "./Player"
import Beam from "./Beam"
import Missile from "./Missile"
import Frost from "./Frost"
import Shockwave from "./Shockwave"
import Radioactivity from "./Radioactivity"
import Lightning from "./Lightning"
import Shield from "./Shield"

class Ship extends Player {
	constructor() {
		super(app.loader.resources.ship.texture)
		
		this.x = app.screen.width / 2
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		
		this.speed = 5
		this.acceleration = .2
		this.friction = .97
		this.maxSpeed = 5
		this.mass = 2

		this.shield = new Shield(0x0000FF)
		this.addChild(this.shield)

		this.weapon = {
			default: Beam,
			current: Beam
		}

		this.available = [
			{ key: "Q", power: 75, cooldown: 60, ready: true, type: "frost" },
			{ key: "W", power: 30, cooldown: 20, ready: true, type: "shockwave" },
			{ key: "E", power: 75, cooldown: 60, ready: true, type: "radioactivity" },
			{ key: "R", power: 25, cooldown: 20, ready: true, type: "lightning" },
			{ key: "T", power: 5, cooldown: 1, ready: true, type: "reflect" }
		]
	}

	animate() {
		this[controller.move]()

		let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		if(speed > this.maxSpeed) {
			this.vx *= this.maxSpeed / speed
			this.vy *= this.maxSpeed / speed
		}

		this.x += this.vx
		this.y += this.vy

		this.boundaries()

		if(this.disabled) return

		if(controller.pressed(controller.A) && this.ready) this.shoot()

		for(let skill of this.skills) {
			if(controller.pressed(controller[skill.key]) && skill.ready && this.power >= skill.power) this.use(skill)
		}

		if(this.shield.visible) this.shield.animate()
	}

	keys() {
		// Velocity
		// if(controller.pressed(controller.LEFT)) this.x -= this.speed
		// if(controller.pressed(controller.RIGHT)) this.x += this.speed
		// if(controller.pressed(controller.UP)) this.y -= this.speed
		// if(controller.pressed(controller.DOWN)) this.y += this.speed

		// Acceleration
		if(controller.pressed(controller.LEFT)) this.vx -= this.acceleration
		if(controller.pressed(controller.RIGHT)) this.vx += this.acceleration
		if(controller.pressed(controller.UP)) this.vy -= this.acceleration
		if(controller.pressed(controller.DOWN)) this.vy += this.acceleration

		if(! controller.pressed(controller.LEFT) && ! controller.pressed(controller.RIGHT)) this.vx *= this.friction
		if(! controller.pressed(controller.UP) && ! controller.pressed(controller.DOWN)) this.vy *= this.friction
	}

	stick() {
		// Velocity
		// if(controller.axes[controller.LEFT_STICK_X] < -this.threshold) this.x += this.speed * controller.axes[controller.LEFT_STICK_X]
		// if(controller.axes[controller.LEFT_STICK_X] > this.threshold) this.x += this.speed * controller.axes[controller.LEFT_STICK_X]
		// if(controller.axes[controller.LEFT_STICK_Y] < -this.threshold) this.y += this.speed * controller.axes[controller.LEFT_STICK_Y]
		// if(controller.axes[controller.LEFT_STICK_Y] > this.threshold) this.y += this.speed * controller.axes[controller.LEFT_STICK_Y]
	
		// Acceleration
		if(controller.axes[controller.LEFT_STICK_X] < -this.threshold) this.vx += this.acceleration * controller.axes[controller.LEFT_STICK_X]
		else if(controller.axes[controller.LEFT_STICK_X] > this.threshold) this.vx += this.acceleration * controller.axes[controller.LEFT_STICK_X]
		else this.vx *= this.friction

		if(controller.axes[controller.LEFT_STICK_Y] < -this.threshold) this.vy += this.acceleration * controller.axes[controller.LEFT_STICK_Y]
		else if(controller.axes[controller.LEFT_STICK_Y] > this.threshold) this.vy += this.acceleration * controller.axes[controller.LEFT_STICK_Y]
		else this.vy *= this.friction
	}

	boundaries() {
		if(this.x - this.width / 2 < 0) {
			this.x = this.width / 2
			this.vx = 0
		}
		else if(this.x + this.width / 2 > app.screen.width) {
			this.x = app.screen.width - this.width / 2
			this.vx = 0
		}
		if(this.y - this.height / 2 < 0) {
			this.y = this.height / 2
			this.vy = 0
		}
		else if(this.y + this.height / 2 > app.screen.height) {
			this.y = app.screen.height - this.height / 2
			this.vy = 0
		}
	}

	reset() {
		this.vx = 0
		this.vy = 0
	}

	shoot() {
		let beam = new this.weapon.current(this)
		beam.position.set(this.x + this.width / 2, this.y)
		this.parent.addChild(beam)

		this.ready = false
		setTimeout(() => this.ready = true, 300)
	}

	frost() {
		this.parent.addChild(new Frost(this))
	}

	shockwave() {
		this.parent.addChild(new Shockwave(this))
	}

	radioactivity() {
		this.parent.addChild(new Radioactivity(this))
	}

	lightning() {
		this.parent.addChild(new Lightning(this))
	}

	reflect() {
		this.shield.visible = true
	}
}

export default Ship