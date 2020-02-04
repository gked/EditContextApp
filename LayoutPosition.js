export default class LayoutPosition {
	#line
	#run
	#lineOffset
	#runOffset

	constructor(line, run, lineOffset, runOffset) {
		this.#line = line
		this.#run = run
		this.#lineOffset = lineOffset
		this.#runOffset = runOffset
	}

	get line() {
		return this.#line
	}

	get run() {
		return this.#run
	}

	get lineOffset() {
		return this.#lineOffset
	}

	get runOffset() {
		return this.#runOffset
	}
}