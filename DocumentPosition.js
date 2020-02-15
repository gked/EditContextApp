export default class DocumentPosition {
	#blocks
	#blockIndex
	#offset

	constructor(blocks, blockIndex, offset) {
		this.#blocks = blocks
		this.#blockIndex = blockIndex
		this.#offset = offset
	}

	get blockIndex() {
		return this.#blockIndex
	}

	get block() {
		return this.#blocks[this.#blockIndex]
	}

	get offset() {
		return this.#offset
	}

	compare(position) {
		if (this.block === position.block) {
			if (this.offset < position.offset) {
				return -1
			}
			else if (this.offset > position.offset) {
				return 1
			}
			console.assert(this.offset === position.offset)
			return 0
		}

		if (this.blockIndex < position.blockIndex) {
			return -1
		}
		else if (this.blockIndex > position.blockIndex) {
			return 1
		}
		console.assert(this.blockIndex === position.blockIndex)
		return 0		
	}
}