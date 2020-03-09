let key = {
	keys: {},
	pressed(keyCode) {
		return keyCode in this.keys
	},
	move: "keys",
	KEY_UP: "keyup",
	code: "keyCode"
}

let keyboard = {
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40,
	A: 65,
	E: 69,
	Q: 81,
	R: 82,
	T: 84,
	W: 87
}

addEventListener("keydown", e => key.keys[e.keyCode] = true)
addEventListener("keyup", e => delete key.keys[e.keyCode])

let gamepad = {
	LEFT: 14,
	UP: 12,
	RIGHT: 15,
	DOWN: 13,
	LEFT_STICK_X: 0,
	LEFT_STICK_Y: 1,
	A: 0,
	E: 1,
	Q: 2,
	W: 3,
	LB: 4,
	RB: 5,
	R: 6
}

addEventListener("gamepadconnected", e => {
	controller = e.gamepad
	Object.assign(controller, gamepad)
	controller.pressed = id => controller.buttons[id].pressed
	controller.move = "stick"
	controller.KEY_UP = "gamepadbuttonup"
	controller.code = "button"
})

addEventListener("gamepaddisconnected", e => {
	controller = key
	Object.assign(controller, keyboard)
})

let controller = key
Object.assign(controller, keyboard)

export { controller }