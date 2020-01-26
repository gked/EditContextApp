export default class LinePoint {
	#line
	#run
	#lineTop
	#offsetX

	constructor(line, run, lineTop, offsetX) {
		this.#line = line
		this.#run = run
		this.#lineTop = lineTop
		this.#offsetX = offsetX
	}

	get line() {
		return this.#line
	}

	get run() {
		return this.#run
	}

	get lineTop() {
		return this.#lineTop
	}

	get offsetX() {
		return this.#offsetX
	}
}