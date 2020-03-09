import * as PIXI from "pixi.js"
import "pixi-sound"
import "./utils"
import World from "./World"
import Ship from "./Ship"
import Tank from "./Tank"
import Enemy from "./Enemy"
import Cannon from "./Cannon"
import Spacepirate from "./Spacepirate"
import Robot from "./Robot"
import Flamethrower from "./Flamethrower"
import Hypnotizer from "./Hypnotizer"
import Metroid from "./Metroid"
import Imago from "./Imago"
import Crusader from "./Crusader"
import Ridley from "./Ridley"
import Dragon from "./Dragon"
import ChozoGuardian from "./ChozoGuardian"
import Energy from "./Energy"
import Weapon from "./Weapon"
import Orb from "./Orb"
import Motherbrain from "./Motherbrain"
import Lizard from "./Lizard"
import Nightmare from "./Nightmare4"
import Kraid from "./Kraid"

window.app = new PIXI.Application({ resizeTo: window })
document.body.appendChild(app.view)

app.loader
	.add("world", "images/world.png")
	.add("ship", "images/ship.png")
	.add("missile", "images/missile.png")
	.add("enemy", "images/enemy.png")
	.add("laser", "images/laser.png")
	.add("frosticon", "images/frosticon.png")
	.add("shockwaveicon", "images/shockwaveicon.png")
	.add("radioactivityicon", "images/radioactivityicon.png")
	.add("skill", "images/skill.png")
	.add("frost", "images/frost.png")
	.add("radioactivity", "images/radioactivity.png")
	.add("tank", "images/tank.png")
	.add("turret", "images/turret.png")
	.add("tankbeam", "images/tankbeam.png")
	.add("cannon", "images/cannon.json")
	.add("rayicon", "images/rayicon.png")
	.add("waveicon", "images/waveicon.png")
	.add("rocketsicon", "images/rocketsicon.png")
	.add("explosion", "images/explosion.json")
	.add("particle", "images/particle.png")
	.add("explode", "sounds/explode.wav")
	.add("shoot", "sounds/shoot.wav")
	.add("ridleytheme", "sounds/ridleytheme.wav")
	.add("scream", "sounds/scream.mp3")
	.add("ridley", "images/ridley.json")
	.add("fire", "images/fire.png")
	.add("wasp", "images/wasp.png")
	.add("spacepirate", "images/spacepirate.json")
	.add("metroid", "images/metroid.png")
	.add("lightningicon", "images/lightningicon.png")
	.add("knight", "images/knight.png")
	.add("claw", "images/claw.png")
	.add("drill", "images/drill.png")
	.add("boomerang", "images/boomerang.png")
	.add("lizard", "images/lizard.png")
	.add("beam", "images/beam.png")
	.add("energy", "images/energy.png")
	.add("weapon", "images/weapon.png")
	.add("grenade", "images/grenade.png")
	.add("wavebeam", "images/wavebeam.png")
	.add("icebeam", "images/icebeam.png")
	.add("robot", "images/robot.png")
	.add("seekingmissile", "images/seekingmissile.png")
	.add("icemissile", "images/icemissile.png")
	.add("slow", "images/slow.png")
	.add("hypnotizer", "images/hypnotizer.png")
	.add("orb", "images/orb.png")
	.add("clawicon", "images/clawicon.png")
	.add("bomb", "images/bomb.png")
	.add("motherbrain", "images/motherbrain.png")
	.add("plasma", "images/plasma.png")
	.add("reflecticon", "images/reflecticon.png")
	.add("rock", "images/rock.png")
	.add("nightmare", "images/nightmare.png")
	.add("kraid", "images/kraid.png")
	.add("arm", "images/arm.png")
	.add("fireball", "images/fireball.png")
	.load(init)

function init() {
	window.level = 0
	window.game = new PIXI.Container()
	window.world = new World()
	window.ship = new Ship()
	window.tank = new Tank()
	window.players = [tank]
	window.enemies = []
	window.mouse = app.renderer.plugins.interaction.mouse.global
	window.particles = new PIXI.ParticleContainer(1000, {
		scale: true,
		position: true,
		rotation: true,
		uvs: true,
		alpha: true
	})

	window.timers = [
		{ type: Enemy, delay: 5000 },
		{ type: Cannon, delay: 7000 },
		{ type: Spacepirate, delay: 20000 }
	]

	// window.special = [Metroid, Robot]
	window.special = [Robot]
	window.bosses = [Nightmare, Kraid, Imago, Ridley, ChozoGuardian, Motherbrain]
	window.powers = [Energy, Weapon, Orb]

	app.stage.addChild(game, particles)
	game.addChild(world, tank)

	startTimers()
	setInterval(addPowerUp, 30000)

	app.ticker.add(() => {
		game.children.forEach(child => {
			if(child.active) child.animate()
		})

		particles.children.forEach(particle => particle.animate())
	})
}

function startTimers() {
	timers.forEach(timer => timer.id = setInterval(addEnemy, timer.delay, timer.type))

	timers.push({
		id: setInterval(() => addEnemy(special.random()), 1000 * 60)
	})

	setTimeout(() => {
		stopTimers()
		
		setTimeout(() => {
			let boss = addEnemy(bosses.shift())
			boss.once("removed", nextLevel)
		}, 1000 * 15)
	}, 1000 * 60 * 2)
}

function stopTimers() {
	timers.forEach(timer => clearInterval(timer.id))
}

function nextLevel() {
	level++
	startTimers()
}

function addEnemy(type) {
	let enemy = new type()
	enemies.push(enemy)
	return game.addChild(enemy)
}

function addPowerUp() {
	let type = powers.random()
	game.addChild(new type())
}