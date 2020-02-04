export default class DocumentPosition {
	#block
	#offset

	constructor(block, offset) {
		this.#block = block
		this.#offset = offset
	}

	get block() {
		return this.#block
	}

	get offset() {
		return this.#offset
	}
}