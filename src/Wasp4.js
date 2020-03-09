import * as PIXI from "pixi.js"

class Wasp4 extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.wasp.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width / 2
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		this.force = .1
		this.friction = .99
		this.radius = 150
		this.vr = .03
		this.bugs = []

		this.animate = this.rotate

		this.on("added", this.swarm)
	}

	swarm() {
		// for(let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
		// 	let bug = new PIXI.Sprite(app.loader.resources.wasp.texture)
		// 	bug.anchor.set(.5)
		// 	bug.scale.set(.5)
		// 	bug.radians = angle
		// 	bug.x = this.x + Math.cos(angle) * this.radius
		// 	bug.y = this.y + Math.sin(angle) * this.radius
		// 	bug.active = false
		// 	this.bugs.push(bug)
		// 	this.parent.addChild(bug)
		// }

		for(let i = 0; i < 25; i++) {
			let bug = new PIXI.Sprite(app.resources.loader.wasp.texture)
			bug.anchor.set(.5)
			bug.scale.set(.5)
			bug.x = Math.random() * app.screen.width
			bug.y = Math.random() * app.screen.height
			bug.active = false
			this.bugs.push(bug)
			this.parent.addChild(bug)
		}
	}

	rotate() {
		for(let bug of this.bugs) {
			bug.radians += this.vr
			bug.x = this.x + Math.cos(bug.radians) * this.radius
			bug.y = this.y + Math.sin(bug.radians) * this.radius
		}
	}

	chase() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy
	}
}

export default Wasp4