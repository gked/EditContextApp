export default class Color {
	#red
	#green
	#blue

	constructor(red, green, blue) {
		this.#red = red
		this.#green = green
		this.#blue = blue
	}

	get red() {
		return this.#red
	}

	get green() {
		return this.#green
	}

	get blue() {
		return this.#blue
	}

	toString() {
		return `rgb(${this.#red}, ${this.#green}, ${this.#blue})`
	}

	static random() {
		let r = Math.floor(Math.random() * 256)
		let g = Math.floor(Math.random() * 256)
		let b = Math.floor(Math.random() * 256)

		return new Color(r, g, b)
	}
}