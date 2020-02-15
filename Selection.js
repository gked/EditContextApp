import BlinkTimer from "./BlinkTimer.js"

export default class Selection extends EventTarget {
	#document
	#anchor
	#focus
	#blinkTimer

	constructor(document) {
		super()
		
		this.#document = document
		this.#anchor = document.firstPosition
		this.#focus = this.#anchor

		this.#blinkTimer = new BlinkTimer(/*interval (ms)*/600)
		this.#blinkTimer.addEventListener("expired", this.invalidate.bind(this))
		this.#blinkTimer.reset()
	}

	get isCollapsed() {
		return this.#anchor.compare(this.#focus) === 0
	}

	select(anchor, focus) {
		this.#anchor = anchor
		this.#focus = focus

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
		return this.isCollapsed && this.#blinkTimer.on
	}

	get showSelection() {
		return !this.isCollapsed
	}

	get anchor() {
		return this.#anchor
	}

	get focus() {
		return this.#focus
	}

	get start() {
		if (this.#anchor.compare(this.#focus) <= 0) {
			return this.#anchor
		}

		return this.#focus
	}

	get end() {
		if (this.#anchor.compare(this.#focus) > 0) {
			return this.#focus
		}

		return this.#anchor
	}

	// get text() {
	// 	if (this.start.block == this.end.block) {
	// 		return this.start.block.text.slice(this.start.offset, this.end.offset)
	// 	}

	// 	let text = ""
	// 	let afterStart = false

	// 	for (let block of this.#document) {
	// 		if (this.startBlock == block) {
	// 			afterStart = true
	// 			text = this.startBlock.text.slice(this.startOffset)
	// 		}
	// 		else if (this.endBlock == block) {
	// 			text += this.endBlock.text.slice(0, this.endOffset)
	// 			return text
	// 		}
	// 		else if (afterStart) {
	// 			text += block.text
	// 		}
	// 	}
	// }
}