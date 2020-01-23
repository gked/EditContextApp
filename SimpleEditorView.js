import ResizingCanvas from "./ResizingCanvas.js"
import BlockLayout from "./BlockLayout.js"
import BlockLineCache from "./BlockLineCache.js"
import Color from "./Color.js"

export default class SimpleEditorView {
	#rc
	#document
	#blockLineCache
	#invalidated
	#renderCallback

	constructor(document) {
		this.#document = document
		this.#document.addEventListener("changed", this.handleDocumentChanged.bind(this))

		this.#blockLineCache = new BlockLineCache()

		this.#renderCallback = this.renderCallback.bind(this)

		this.#rc = new ResizingCanvas()
		this.#rc.addEventListener("resize", this.handleResize.bind(this))
	}

	// expose the canvas so that controlling types can display it
	get canvas() {
		return this.#rc.canvas
	}

	// request that the view be repainted onto the canvas
	invalidate() {
		if (!this.#invalidated) {
			this.#invalidated = true

			// TODO: is this the best way?
			// This will add one frame of delay to our updates, 
			// but gives time for all events to be processed first.
			requestAnimationFrame(this.#renderCallback)
		}
	}

	// handle resize events so the text can reflow then repaint
	handleResize(e) {
		this.invalidate()
	}

	// handle change events so layout can be updated then repainted
	handleDocumentChanged(e) {
		for (let block of e.changedBlocks) {
			this.#blockLineCache.delete(block)
		}
		
		this.invalidate()
	}

	// update layout, mark the view as valid and repaint
	renderCallback() {
		this.#invalidated = false

		for (let block of this.#document) {
			let lines = this.#blockLineCache.get(block)
			if (!lines) {
				lines = BlockLayout.layoutBlock(block)
				this.#blockLineCache.set(block, lines)
			}

			for (let line of lines) {
				// render lines here
				console.log(line)
			}
		}

		let ctx = this.#rc.shared2dContext
		ctx.fillStyle = Color.random().toString()
		ctx.fillRect(0, 0, this.#rc.width, this.#rc.height)
		ctx.fillStyle = Color.random().toString()
		ctx.font = "bold 48px sans-serif"
		ctx.fillText("Hello World!!!!!!!!!!!!!!!!!", 0, 100)
	}
}