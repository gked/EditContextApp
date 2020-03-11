import Style from "./Style.mjs"

export default class Run {
	#start
	#end
	#style

	constructor(start, end, style) {
		this.#start = start
		this.#end = end
		this.#style = style
	}

	get start() {
		return this.#start
	}

	get end() {
		return this.#end
	}

	get length() {
		return this.#end - this.#start
	}

	get style() {
		return this.#style
	}
}