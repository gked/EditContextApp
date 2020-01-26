import Block from "./Block.js"
import Selection from "./Selection.js"

// Imports for demo data creation
import Run from "./Run.js"
import Style from "./Style.js"
import Color from "./Color.js"

export default class SimpleEditorDocument extends EventTarget {
	#blocks
	#selection

	constructor() {
		super()

		// demo data
		let style1 = new Style(
			/*fontWeight*/"bold", 
			/*fontSize*/"48px", 
			/*fontFamily*/"sans-serif", 
			/*color*/Color.random()
		)
		let style2 = new Style(
			/*fontWeight*/"bold", 
			/*fontSize*/"64px", 
			/*fontFamily*/"sans-serif", 
			/*color*/new Color(255, 0, 0)
		)
		this.#blocks = [ 
			new Block("Hello, BIG", [
				new Run(0, 7, style1),
				new Run(7, 10, style2)
			]), 
			new Block("World!", [new Run(0, 6, style1)])
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