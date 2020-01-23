import Block from "./Block.js"

// Imports for demo data creation
import Run from "./Run.js"
import Style from "./Style.js"
import Color from "./Color.js"

export default class SimpleEditorDocument extends EventTarget {
	#blocks

	constructor() {
		super()

		// demo data
		let style = new Style(
			/*fontFamily*/"sans-serif", 
			/*fontSize*/"48px", 
			/*fontWeight*/"bold", 
			/*color*/Color.random()
		)
		this.#blocks = [ 
			new Block("Hello,", [new Run(0, "Hello,".length, style)]), 
			new Block("World!", [new Run(0, "World!".length, style)]) 
		]

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