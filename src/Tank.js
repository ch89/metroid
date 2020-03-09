import * as PIXI from "pixi.js"
import { controller } from "./key"
import Player from "./Player"
import TankBeam from "./TankBeam"
import Ray from "./Ray"
import Wave from "./Wave"
import Claw from "./Claw"

class Tank extends Player {
	constructor() {
		super(app.loader.resources.tank.texture)

		this.x = app.screen.width / 2
		this.y = app.screen.height - this.height / 2

		this.vx = 2
		this.vr = .02

		this.weapon = {
			default: TankBeam,
			current: TankBeam
		}

		this.turret = new PIXI.Sprite(app.loader.resources.turret.texture)
		this.turret.anchor.y = .5
		this.turret.position.set(-8)

		this.addChild(this.turret)

		this.available = [
			{ key: "Q", power: 75, cooldown: 60, ready: true, type: "ray" },
			{ key: "W", power: 25, cooldown: 20, ready: true, type: "wave" },
			{ key: "E", power: 10, cooldown: 7, ready: true, type: "rockets" },
			{ key: "R", power: 10, cooldown: 10, ready: true, type: "claw" }
		]
	}

	animate() {
		this[controller.move]()

		if(this.turret.rotation > 0) this.turret.rotation = 0
		if(this.turret.rotation < -Math.PI / 2) this.turret.rotation = -Math.PI / 2

		if(controller.pressed(controller.A) && this.ready) this.shoot()

		for(let skill of this.skills) {
			if(controller.pressed(controller[skill.key]) && skill.ready && this.power >= skill.power) this.use(skill)
		}
	}

	keys() {
		if(controller.pressed(controller.LEFT)) this.x -= this.vx
		if(controller.pressed(controller.RIGHT)) this.x += this.vx
		if(controller.pressed(controller.UP)) this.turret.rotation -= this.vr
		if(controller.pressed(controller.DOWN)) this.turret.rotation += this.vr
	}

	stick() {
		if(controller.axes[0] < -this.threshold || controller.axes[0] > this.threshold) this.x += this.vx * controller.axes[0]
		// if(controller.axes[1] < -this.threshold || controller.axes[1] > this.threshold) this.turret.rotation += this.vr * controller.axes[1]
	
		if(controller.pressed(controller.LB)) this.turret.rotation -= this.vr
		if(controller.pressed(controller.RB)) this.turret.rotation += this.vr
	}

	shoot() {
		this.parent.addChild(new this.weapon.current(this.turret))

		this.ready = false
		this.timers.beam = setTimeout(() => this.ready = true, 300)
	}

	ray() {
		let ray = new Ray(this.turret)
		this.parent.addChild(ray)

		this.ready = false
		clearTimeout(this.timers.beam)
		setTimeout(() => this.ready = true, ray.duration)
	}

	wave() {
		this.parent.addChild(new Wave(this.turret))
	}

	rockets() {
		console.log("shoot rockets")
	}

	claw() {
		this.parent.addChild(new Claw(this.turret))
	}
}

export default Tank