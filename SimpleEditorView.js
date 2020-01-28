import ResizingCanvas from "./ResizingCanvas.js"
import BlockLayout from "./BlockLayout.js"
import Color from "./Color.js"
import Selection from "./Selection.js"

const topMargin = 10
const leftMargin = 10

export default class SimpleEditorView {
	#rc
	#document
	#blockLayout
	#invalidated
	#renderCallback
	#selection

	constructor(document) {
		this.#document = document
		this.#document.addEventListener("changed", this.handleDocumentChanged.bind(this))

		let blockIterator = this.#document.blocks()
		let firstBlock = blockIterator.next().value
		let secondBlock = blockIterator.next().value

		this.#selection = new Selection(this.#document, /*intialBlock*/firstBlock)
		this.#selection.select(firstBlock, 3, secondBlock, 4)
		this.#selection.addEventListener("invalidated", this.invalidate.bind(this))

		this.#renderCallback = this.renderCallback.bind(this)

		this.#rc = new ResizingCanvas()
		this.#blockLayout = new BlockLayout(this.#document, this.#rc.shared2dContext)

		this.#rc.addEventListener("resize", this.handleResize.bind(this))
	}

	// expose the container so that controlling types can display it
	get container() {
		return this.#rc.container
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
			this.#blockLayout.invalidateBlock(block)
		}
		
		this.invalidate()
	}

	// update layout, mark the view as valid and repaint
	renderCallback() {
		this.#invalidated = false

		this.clear()

		this.renderLines()

		if (this.#selection.showCaret) {
			this.renderCaret()
		}
		else if (this.#selection.showSelection) {
			this.renderSelection()
		}
	}

	clear() {
		let ctx = this.#rc.shared2dContext
		ctx.clearRect(0, 0, this.#rc.width, this.#rc.height)
	}

	renderLines() {
		let ctx = this.#rc.shared2dContext

		let lineTop = topMargin
		let runOffset = leftMargin

		for (let block of this.#document) {
			let lines = this.#blockLayout.layoutBlock(block, ctx)

			for (let line of lines) {
				for (let run of line) {
					ctx.font = run.style.font
					ctx.fillStyle = run.style.color

					let text = line.text.slice(run.start, run.end)
					ctx.fillText(text, runOffset, lineTop + line.ascent)

					runOffset += run.measure.width
				}

				runOffset = leftMargin
				lineTop += line.ascent + line.descent
			}
		}
	}

	renderCaret() {
		let caretPoint = this.#blockLayout.linePointFromBlockOffset(
			this.#selection.startBlock,
			this.#selection.startOffset
		)

		let ctx = this.#rc.shared2dContext
		ctx.fillStyle = "black"

		ctx.fillRect(
			/*x*/caretPoint.offsetX + leftMargin, 
			/*y*/caretPoint.lineTop + caretPoint.line.ascent - caretPoint.run.ascent + topMargin,
			/*width*/1, 
			/*height*/caretPoint.run.height
		)
	}

	renderSelection() {
		let linesToPaint = []

		let startPoint = this.#blockLayout.linePointFromBlockOffset(
			this.#selection.startBlock,
			this.#selection.startOffset
		)

		let endPoint = this.#blockLayout.linePointFromBlockOffset(
			this.#selection.endBlock,
			this.#selection.endOffset
		)

		let startFound = false
		let endFound = false

		let ctx = this.#rc.shared2dContext

		for (let block of this.#document) {
			// Layout will be up to date so layoutBlock is low cost.
			let lines = this.#blockLayout.layoutBlock(block, ctx)

			for (let line of lines) {
				if (!startFound) {
					if (line == startPoint.line) {
						linesToPaint.push(line)
						startFound = true
					}
					continue
				}

				linesToPaint.push(line)

				if (line == endPoint.line) {
					endFound = true
					break
				}
			}

			if (endFound) {
				break
			}
		}


		ctx.fillStyle = "rgba(0, 0, 180, 0.5)"

		let lineTop = startPoint.lineTop + topMargin

		for (let line of linesToPaint) {
			if (line == startPoint.line) {
				ctx.fillRect(startPoint.offsetX + leftMargin, lineTop, line.width - startPoint.offsetX, line.height)
			}
			else if (line == endPoint.line) {
				ctx.fillRect(leftMargin, lineTop, endPoint.offsetX, line.height)
			}
			else {
				ctx.fillRect(leftMargin, lineTop, line.width, line.height)
			}

			lineTop += line.height
		}
	}
}