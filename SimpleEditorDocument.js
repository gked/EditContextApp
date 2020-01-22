export default class SimpleEditorDocument extends EventTarget {
	#blocks

	constructor() {
		super()

		// demo data
		this.#blocks = [ "Hello,", "World!" ]

		// Make this document iterable over blocks
		this[Symbol.iterator] = this.blocks.bind(this)
	}

	// A generator function for the blocks in this document
	*blocks() {
		for (let i = 0; i < this.#blocks.length; i++) {
			yield this.#blocks[i]
		}
	}
}