import Block from "./Block.mjs"
import Selection from "./Selection.mjs"
import DocumentPosition from "./DocumentPosition.mjs"
import DocumentPositionIterator from "./DocumentPositionIterator.mjs"

// Imports for demo data creation
import Run from "./Run.mjs"
import Style from "./Style.mjs"
import Color from "./Color.mjs"

export default class SimpleEditorDocument extends EventTarget {
	#blocks
	#selection

	constructor() {
		super()

		// Make this document iterable over blocks
		this[Symbol.iterator] = this.blocks.bind(this)
	}

	// A generator function for access the blocks in this document
	*blocks() {
		for (let i = 0; i < this.#blocks.length; i++) {
			yield this.#blocks[i]
		}
	}

	get firstPosition() {
		return new DocumentPosition(this.#blocks, /*blockIndex*/0, /*offset*/0)
	}

	get lastPosition() {
		return new DocumentPosition(
			this.#blocks, 
			/*blockIndex*/this.#blocks.length - 1,
			/*offset*/this.#blocks[this.#blocks.length - 1].text.length
		)
	}

	createPosition(blockIndex, offset) {
		console.assert(blockIndex < this.#blocks.length)
		console.assert(offset <= this.#blocks[blockIndex].text.length)

		return new DocumentPosition(this.#blocks, blockIndex, offset)
	}

	createPositionIterator(position) {
		let blocks = this.#blocks

		if (!position) {
			position = this.createDocumentPosition()
		}

		console.assert(position.blockIndex < blocks.length)
		console.assert(position.offset <= blocks[position.blockIndex].text.length)

		return new DocumentPositionIterator(
			blocks, 
			position.blockIndex, 
			position.offset
		)
	}

	generateDemoData() {
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
	}
}
