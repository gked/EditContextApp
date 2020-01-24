export default class ResizingCanvas extends EventTarget {
	#canvas 
	#ctx 
	#width	
	#height

	constructor() {
		super()
		
		this.#canvas = document.createElement("canvas")
		this.resizeObserver = new ResizeObserver(this.handleResize.bind(this))
		this.resizeObserver.observe(this.#canvas)

		this.#ctx = this.#canvas.getContext("2d")
	}

	// expose the canvas so that controlling types can display it
	get canvas() {
		return this.#canvas
	}

	// shared context scaled by devicePixelRatio so drawing can occur in logical CSS px
	get shared2dContext() {
		return this.#ctx
	}

	// width of the canvas (in CSS pixels)
	get width() {
		return this.#width
	}

	// height of the canvas (in CSS pixels)
	get height() {
		return this.#height
	}

	// handle resize events to reset the dimensions of the canvas
	//
	// TODO: the canvas internal bitmap is no longer scaled to match device pixels
	//       as it affects the intrinsic size (for some reason the device pixels values
	//       are translated to CSS pixels when width and height are unconstrained).
	//       As a result the canvas can't be used in "shrink-to-fit" scenarios, be
	//       resized to its container, and simultaneously scaled for high DPI.
	handleResize(entries) {
		// only observing one element (our canvas) and assumes its not fragmented
		console.assert(entries.length === 1)
		console.assert(entries[0].target === this.#canvas)

		this.#width = entries[0].contentRect.width // * devicePixelRatio
		this.#height = entries[0].contentRect.height // * devicePixelRatio

		this.#canvas.width = this.#width
		this.#canvas.height = this.#height

		this.#ctx.resetTransform()
		//this.#ctx.scale(devicePixelRatio, devicePixelRatio)

		this.dispatchEvent(new CustomEvent("resize"))		
	}
}