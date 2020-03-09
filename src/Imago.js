import * as PIXI from "pixi.js"
import HealthBar from "./HealthBar"
import Explosion from "./Explosion"

class Imago extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.wasp.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.x = app.screen.width / 2
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		
		// this.force = .1
		// this.limit = 7
		
		this.force = .025
		this.limit = 3
		
		this.friction = .97
		this.radius = 150
		this.vr = .025
		this.expansion = 0
		this.bounce = -1
		this.easing = .1
		this.ready = true
		this.threshold = .66
		this.life = 150
		this.maxLife = this.life
		this.bugs = []

		this.health = new HealthBar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.on("added", this.swarm)

		this.states = [this.follow, this.move]

		this.animate = this.chase
		this.state = this.rotate
	}

	swarm() {
		for(let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
			let bug = new PIXI.Sprite(app.loader.resources.wasp.texture)
			bug.anchor.set(.5)
			bug.scale.set(.5)
			bug.spin = angle
			bug.x = this.x + Math.cos(angle) * this.radius
			bug.y = this.y + Math.sin(angle) * this.radius
			bug.active = false
			bug.ready = true
			this.bugs.push(bug)
			this.parent.addChild(bug)

			enemies.push(bug)
			bug.hurt = () => {}
		}
	}

	change() {
		this.force = .1
		this.limit = 7
	}

	init() {
		for(let bug of this.bugs) {
			// bug.vx = Math.random() * 10 - 5
			// bug.vy = Math.random() * 10 - 5

			bug.vx = 0
			bug.vy = 0

			this.destination(bug)

			bug.timer = setInterval(() => this.destination(bug), 3000)
		}
	}

	destination(bug) {
		bug.ax = Math.random() * .5 - .25
		bug.ay = Math.random() * .5 - .25
	}

	rotate() {
		for(let bug of this.bugs) {
			bug.spin += this.vr
			bug.x = this.x + Math.cos(bug.spin) * this.radius
			bug.y = this.y + Math.sin(bug.spin) * this.radius
		}

		if(this.ready) this.expand()
	}

	expand() {
		this.expansion += .02

		if(this.expansion >= Math.PI * 2) {
			this.radius = 150
			this.expansion = 0
			this.ready = false
			setTimeout(() => this.ready = true, 5000)
		}
		else {
			this.radius += Math.sin(this.expansion) * 3
		}
	}

	follow() {
		this.bugs[0].x += (this.x - this.bugs[0].x) * this.easing
		this.bugs[0].y += (this.y - this.bugs[0].y) * this.easing

		for(let i = 1; i < this.bugs.length; i++) {
			this.bugs[i].x += (this.bugs[i - 1].x - this.bugs[i].x) * this.easing
			this.bugs[i].y += (this.bugs[i - 1].y - this.bugs[i].y) * this.easing
		}
	}

	move() {
		for(let bug of this.bugs) {
			bug.vx += bug.ax
			bug.vy += bug.ay

			let speed = Math.sqrt(bug.vx * bug.vx + bug.vy * bug.vy)

			if(speed > 10) {
				bug.vx *= 10 / speed
				bug.vy *= 10 / speed
			}

			// bug.vx *= this.friction
			// bug.vy *= this.friction

			bug.x += bug.vx
			bug.y += bug.vy

			this.border(bug)
		}
	}

	chase() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		if(speed > this.limit) {
			this.vx *= this.limit / speed
			this.vy *= this.limit / speed
		}

		this.x += this.vx
		this.y += this.vy

		this.border(this)
		this.state()
		this.collision()
	}

	fall() {
		this.vx *= this.friction
		this.vy += this.force

		this.x += this.vx
		this.y += this.vy

		if(this.y + this.height / 2 > app.screen.height) {
			let explosion = new Explosion()
			explosion.position.set(this.x, this.y)
			this.parent.addChild(explosion)

			this.destroy()
		}
	}

	border(bug) {
		if(bug.x - bug.width / 2 < 0) {
			bug.x = bug.width / 2
			bug.vx *= this.bounce
		}
		else if(bug.x + bug.width / 2 > app.screen.width) {
			bug.x = app.screen.width - bug.width / 2
			bug.vx *= this.bounce
		}
		if(bug.y - bug.height / 2 < 0) {
			bug.y = bug.height / 2
			bug.vy *= this.bounce
		}
		else if(bug.y + bug.height / 2 > app.screen.height) {
			bug.y = app.screen.height - bug.height / 2
			bug.vy *= this.bounce
		}
	}

	collision() {
		for(let bug of this.bugs) {
			if(bug.hit(ship) && bug.ready) {
				ship.hurt(1)
				this.explosion.call(bug)
				bug.ready = false
				setTimeout(() => bug.ready = true, 1000)
			}
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}

	hurt(damage) {
		if(this.life > 0) {
			this.life -= damage

			if(this.life <= 0) this.defeated()
			else if(this.life / this.maxLife <= this.threshold) {
				this.state = this.states.shift()
				this.threshold -= .33

				if(this.state == this.move) this.init()
			}

			this.health.update(this.life, this.maxLife)
		}
	}

	defeated() {
		this.life = 0
		this.animate = this.fall
		this.explosions()
	}

	explosions() {
		this.timer = setInterval(() => {
			let explosion = new Explosion()
			explosion.x = this.x + Math.random() * 100 - 50
			explosion.y = this.y + Math.random() * 100 - 50
			this.parent.addChild(explosion)
		}, 250)
	}

	destroy() {
		while(this.bugs.length) this.bugs.shift().destroy()
			
		this.parent.removeChild(this)
		enemies.remove(this)
		clearInterval(this.timer)
	}
}

export default Imago