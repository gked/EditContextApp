import ResizingCanvas from "./ResizingCanvas.mjs"
import BlockLayout from "./BlockLayout.mjs"
import Color from "./Color.mjs"
import Selection from "./Selection.mjs"
import DocumentPosition from "./DocumentPosition.mjs"

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
		this.#document.generateDemoData()
		this.#document.addEventListener("changed", this.handleDocumentChanged.bind(this))

		this.#selection = new Selection(this.#document)
		this.#selection.select(
			this.#document.firstPosition, 
			this.#document.lastPosition
		)
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
		let caretPosition = this.#blockLayout.layoutPositionFromDocumentPosition(
			this.#selection.start
		)

		let ctx = this.#rc.shared2dContext
		ctx.fillStyle = "black"

		ctx.fillRect(
			/*x*/caretPosition.runOffset + leftMargin, 
			/*y*/caretPosition.lineOffset + caretPosition.line.ascent - caretPosition.run.ascent + topMargin,
			/*width*/1, 
			/*height*/caretPosition.run.height
		)
	}

	renderSelection() {
		let linesToPaint = []

		let startPosition = this.#blockLayout.layoutPositionFromDocumentPosition(
			this.#selection.start
		)

		let endPosition = this.#blockLayout.layoutPositionFromDocumentPosition(
			this.#selection.end
		)

		let startFound = false
		let endFound = false

		let ctx = this.#rc.shared2dContext

		for (let block of this.#document) {
			// Layout will be up to date so layoutBlock is low cost.
			let lines = this.#blockLayout.layoutBlock(block, ctx)

			for (let line of lines) {
				if (!startFound) {
					if (line == startPosition.line) {
						linesToPaint.push(line)
						startFound = true
					}
					continue
				}

				linesToPaint.push(line)

				if (line == endPosition.line) {
					endFound = true
					break
				}
			}

			if (endFound) {
				break
			}
		}


		ctx.fillStyle = "rgba(0, 0, 180, 0.5)"

		let lineOffset = startPosition.lineOffset + topMargin

		for (let line of linesToPaint) {
			if (line == startPosition.line) {
				ctx.fillRect(startPosition.runOffset + leftMargin, lineOffset, line.width - startPosition.runOffset, line.height)
			}
			else if (line == endPosition.line) {
				ctx.fillRect(leftMargin, lineOffset, endPosition.runOffset, line.height)
			}
			else {
				ctx.fillRect(leftMargin, lineOffset, line.width, line.height)
			}

			lineOffset += line.height
		}
	}
}