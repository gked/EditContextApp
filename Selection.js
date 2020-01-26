import BlinkTimer from "./BlinkTimer.js"

export default class Selection extends EventTarget {
	#document
	#anchorBlock
	#anchorOffset
	#focusBlock
	#focusOffset
	#blinkTimer

	constructor(document, initialBlock) {
		super()
		
		this.#document = document
		this.#anchorBlock = initialBlock
		this.#anchorOffset = 0
		this.#focusBlock = initialBlock
		this.#focusOffset = 0

		this.#blinkTimer = new BlinkTimer(/*interval (ms)*/600)
		this.#blinkTimer.addEventListener("expired", this.invalidate.bind(this))
		this.#blinkTimer.reset()
	}

	get isCollapsed() {
		if (this.#anchorBlock === this.#focusBlock) {
			return this.#anchorOffset === this.#focusOffset
		}

		return false
	}

	select(anchorBlock, anchorOffset, focusBlock, focusOffset) {
		this.#anchorBlock = anchorBlock
		this.#anchorOffset = anchorOffset
		this.#focusBlock = focusBlock
		this.#focusOffset = focusOffset

		if (this.isCollapsed) {
			this.#blinkTimer.reset()
		}
		else {
			this.#blinkTimer.stop(/*on*/false)
		}

		this.dispatchEvent(new CustomEvent("changed"))
	}

	invalidate() {
		this.dispatchEvent(new CustomEvent("invalidated"))
	}

	get showCaret() {
		return this.#blinkTimer.on
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

	get text() {
		if (this.startBlock == this.endBlock) {
			return this.startBlock.text.slice(this.startOffset, this.endOffset)
		}

		let text = ""
		let afterStart = false

		for (let block of this.#document) {
			if (this.startBlock == block) {
				afterStart = true
				text = this.startBlock.text.slice(this.startOffset)
			}
			else if (this.endBlock == block) {
				text += this.endBlock.text.slice(0, this.endOffset)
				return text
			}
			else if (afterStart) {
				text += block.text
			}
		}
	}
}