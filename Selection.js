export default class Selection extends EventTarget {
	#document
	#anchorBlock
	#anchorOffset
	#focusBlock
	#focusOffset

	constructor(document, initialBlock) {
		super()
		
		this.#document = document
		this.#anchorBlock = initialBlock
		this.#anchorOffset = 0
		this.#focusBlock = initialBlock
		this.#focusOffset = 0
	}

	get isCollapsed() {
		if (this.#anchorBlock === this.#focusBlock) {
			return this.#anchorOffset === this.#focusOffset
		}

		return false
	}

	get anchorBlock() {
		return this.#anchorBlock
	}

	get anchorOffset() {
		return this.#anchorOffset
	}

	get focusBlock() {
		return this.#focusBlock
	}

	get focusOffset() {
		return this.#focusOffset
	}

	get startBlock() {
		if (this.#anchorBlock === this.#focusBlock) {
			return this.#anchorBlock
		}

		for (let block of this.#document) {
			if (block === this.#anchorBlock || block === this.#focusBlock) {
				return block
			}
		}
	}

	get startOffset() {
		if (this.#anchorBlock === this.#focusBlock) {
			return Math.min(this.#focusOffset, this.#anchorOffset)
		}

		if (this.startBlock === this.anchorBlock) {
			return this.#anchorOffset
		}

		return this.#focusOffset
	}

	get endBlock() {
		if (this.#anchorBlock === this.#focusBlock) {
			return this.#anchorBlock
		}

		for (let block of this.#document) {
			if (block === this.#anchorBlock) {
				return this.#focusBlock
			}
			if (block === this.#focusBlock) {
				return this.#anchorBlock
			}
		}
	}

	get endOffset() {
		if (this.#anchorBlock === this.#focusBlock) {
			return Math.max(this.#focusOffset, this.#anchorOffset)
		}
		
		if (this.endBlock === this.anchorBlock) {
			return this.#anchorOffset
		}

		return this.#focusOffset
	}

}