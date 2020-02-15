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

	get codePointAfter() {
		if (this.offset === this.block.text.length) {
			return "¶".charCodeAt(0)
		}

		console.assert(this.offset < this.block.text.length)
		return this.block.text.charCodeAt(this.offset)
	}

	get codePointBefore() {
		if (this.offset === 0) {
			if (this.blockIndex == 0) {
				return null
			}

			console.assert(this.blockIndex > 0)
			return "¶".charCodeAt(0)
		}

		console.assert(this.offset > 0)
		return this.block.text.charCodeAt(this.offset - 1)
	}
}