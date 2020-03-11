import Run from "./Run.mjs"

export default class LayoutRun extends Run {
	#measure

	constructor(start, end, style, measure) {
		super(start, end, style)

		this.#measure = measure
	}

	get measure() {
		return this.#measure
	}

	get ascent() {
		return this.#measure.actualBoundingBoxAscent
	}

	get descent() {
		return this.#measure.actualBoundingBoxDescent
	}

	get height() {
		return this.ascent + this.descent
	}
}