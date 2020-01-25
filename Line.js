export default class Line {
	#text
	#runs

	constructor(text, runs) {
		this.#text = text
		this.#runs = [...runs]

		this[Symbol.iterator] = this.runs.bind(this)
	}

	*runs() {
		for (let i = 0; i < this.#runs.length; i++) {
			yield this.#runs[i]
		}
	}

	get ascent() {
		let ascent = 0
		for(let run of this.#runs) {
			ascent = Math.max(ascent, run.measure.actualBoundingBoxAscent)
		}

		return ascent
	}

	get descent() {
		let descent = 0
		for(let run of this.#runs) {
			descent = Math.max(descent, run.measure.actualBoundingBoxDescent)
		}

		return descent
	}

	get height() {
		return this.ascent + this.descent
	}

	get text() {
		return this.#text
	}
}