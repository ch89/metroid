import * as PIXI from "pixi.js"
import { controller } from "./key"
import HealthBar from "./HealthBar"
import Icon from "./Icon"

class Player extends PIXI.Sprite {
	constructor(texture) {
		super(texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.threshold = .1
		this.ready = true
		this.disabled = false
		this.level = 1
		this.life = 50
		this.maxLife = this.life
		this.power = 100
		this.maxPower = this.power
		this.experience = 0
		this.maxExperience = 100

		this.skills = []
		this.timers = {}

		this.skill = this.skill.bind(this)

		this.on("added", () => {
			this.addBars()
			this.addIcons()
			this.addLevel()

			// this.increase(100)
		})
	}

	addBars() {
		this.bars = {
			health: new HealthBar(this.life, this.maxLife),
			power: new HealthBar(this.power, this.maxPower, 0x000088),
			experience: new HealthBar(this.experience, this.maxExperience, 0xFFCC00)
		}

		Object.values(this.bars).forEach((bar, index) => {
			// bar.position.set(25, 25 + bar.height * index)

			bar.x = 25 + bar.width * players.indexOf(this)
			bar.y = 25 + bar.height * index
			app.stage.addChild(bar)
		})
	}

	addIcons() {
		let index = 0

		for(let skill of this.available) {
			skill.icon = new Icon(skill.type, skill.power)
			skill.icon.x = 500 + skill.icon.width * index
			skill.icon.y = 25 + skill.icon.height * players.indexOf(this)
			app.stage.addChild(skill.icon)
			index++
		}
	}

	addLevel() {
		this.levelText = new PIXI.Text(`${this.constructor.name} Level: ${this.level}`, new PIXI.TextStyle({
			fontFamily: "Gloria Hallelujah",
			fontSize: 24,
			fill: "#FFFFFF",
			stroke: "#000000",
			strokeThickness: 8
		}))

		this.levelText.position.set(800, 25 + this.levelText.height * players.indexOf(this))
		app.stage.addChild(this.levelText)
	}

	load(power = 1) {
		this.power += power

		if(this.power >= this.maxPower) {
			this.power = this.maxPower
			clearInterval(this.loader)
			this.loader = null
		}

		this.bars.power.update(this.power, this.maxPower)
	}

	use(skill) {
		this[skill.type]()

		skill.ready = false

		this.power -= skill.power
		this.bars.power.update(this.power, this.maxPower)

		if(! this.loader) this.loader = setInterval(this.load.bind(this), 500)

		let cooldown = skill.cooldown

		skill.icon.shadow.visible = true
		skill.icon.counter.text = cooldown

		let timer = setInterval(() => {
			cooldown--

			if(cooldown) {
				skill.icon.counter.text = cooldown
			}
			else {
				skill.ready = true
				skill.icon.shadow.visible = false
				clearInterval(timer)
			}
		}, 1000)
	}

	increase(experience) {
		this.experience += experience

		if(this.experience >= this.maxExperience) this.levelUp()

		this.bars.power.update(this.power, this.maxPower)
		this.bars.experience.update(this.experience, this.maxExperience)
	}

	levelUp() {
		this.experience = this.experience - this.maxExperience

		this.level++
		this.levelText.text = `${this.constructor.name} Level: ${this.level}`

		if(this.level > 2) this.maxPower += 25
		this.maxExperience += 50

		this.heal(5)
		this.load(25)

		this.available.forEach(skill => skill.icon.skill.visible = true)

		addEventListener(controller.KEY_UP, this.skill)
	}

	skill(e) {
		for(let skill of this.available) {
			if(controller[skill.key] == e[controller.code]) {
				this.available.forEach(skill => skill.icon.skill.visible = false)

				this.skills.push(this.available.remove(skill))

				skill.icon.shadow.visible = false
				skill.icon.counter.visible = true

				removeEventListener(controller.KEY_UP, this.skill)
			}
		}
	}

	change(weapon) {
		this.weapon.current = weapon

		clearTimeout(this.timers.weapon)
		this.timers.weapon = setTimeout(() => this.weapon.current = this.weapon.default, 1000 * 20)
	}

	heal(energy) {
		this.life += energy

		if(this.life > this.maxLife) this.life = this.maxLife

		this.bars.health.update(this.life, this.maxLife)
	}

	slow() {
		this.timers.slow ? clearTimeout(this.timers.slow) : this.maxSpeed *= .5

		this.timers.slow = setTimeout(() => { 
			this.maxSpeed = 5
			this.timers.slow = null
		}, 3000)
	}

	hypnotize() {
		this.acceleration *= -1

		setTimeout(() => this.acceleration *= -1, 10000)
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0) {
			this.destroy()
		}

		this.bars.health.update(this.life, this.maxLife)
	}

	destroy() {
		this.parent.removeChild(this)
		players.remove(this)
	}
}

export default Player