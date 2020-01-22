import ResizingCanvas from "./ResizingCanvas.js"

export default class SimpleEditorView {
	#rc

	constructor(model) {
		this.#rc = new ResizingCanvas()
		this.#rc.addEventListener("resize", this.handleResize.bind(this))
	}

	// expose the canvas so that controlling types can display it
	get canvas() {
		return this.#rc.canvas
	}

	// handle resize events to both reset the dimensions of the canvas 
	// and reflow the text
	handleResize(width, height) {
		let ctx = this.#rc.shared2dContext
		ctx.fillStyle = "red"
		ctx.fillRect(0, 0, this.#rc.width, this.#rc.height)
	}
}