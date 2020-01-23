import Run from "./Run.js"

export default class LayoutRun extends Run {
	#measure

	constructor(start, end, style, measure) {
		super(start, end, style)

		this.#measure = measure
	}

	get measure() {
		return this.#measure
	}
}