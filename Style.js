export default class Style {
	#fontFamily
	#fontSize
	#fontWeight
	#color

	constructor(fontFamily, fontSize, fontWeight, color) {
		this.#fontFamily = fontFamily
		this.#fontSize = fontSize
		this.#fontWeight = fontWeight
		this.#color = color
	}

	get font() {
		return `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`
	}

	get fontFamily() {
		return this.#fontFamily
	}

	get fontSize() {
		return this.#fontSize
	}

	get fontWeight() {
		return this.#fontWeight
	}

	get color() {
		return this.#color
	}
}