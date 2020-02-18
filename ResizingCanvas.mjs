export default class ResizingCanvas extends EventTarget {
	#canvas
	#container 
	#ctx 
	#width	
	#height

	constructor() {
		super()
		
		this.#container = document.createElement("div")
		this.#canvas = document.createElement("canvas")

		this.#container.append(this.#canvas)

		this.resizeObserver = new ResizeObserver(this.handleResize.bind(this))
		this.resizeObserver.observe(this.#container)

		this.#ctx = this.#canvas.getContext("2d")
	}

	// expose the container so that controlling types can display it
	get container() {
		return this.#container
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
	handleResize(entries) {
		// only observing one element (our container) and assumes its not fragmented
		console.assert(entries.length === 1)
		console.assert(entries[0].target === this.#container)

		this.#width = entries[0].contentRect.width
		this.#height = entries[0].contentRect.height

		// match the resolution of the internal bitmap of the canvas
		// to the number of device pixels it covers
		this.#canvas.width = this.#width * devicePixelRatio
		this.#canvas.height = this.#height * devicePixelRatio

		// constrain the height and width to match that of the container
		this.#canvas.style.width = `${this.#width}px`
		this.#canvas.style.height = `${this.#height}px`

		this.#ctx.resetTransform()
		this.#ctx.scale(devicePixelRatio, devicePixelRatio)

		this.dispatchEvent(new CustomEvent("resize"))		
	}
}