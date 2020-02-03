import Line from "./Line.js"
import Style from "./Style.js"
import LayoutRun from "./LayoutRun.js"
import BlockLineCache from "./BlockLineCache.js"
import LinePoint from "./LinePoint.js"

export default class BlockLayout {
	#blockLineCache
	#document
	#canvasContext

	constructor(document, canvasContext) {
		this.#blockLineCache = new BlockLineCache()
		this.#document = document
		this.#canvasContext = canvasContext
	}

	layoutBlock (block) {
			let lines = this.#blockLineCache.get(block)
			if (lines) {
				return lines
			}

			// TODO: measure and break lines
			let ctx = this.#canvasContext
			let layoutRuns = [...block.runs()].map(r => {
				ctx.font = r.style.font
				let measure = ctx.measureText(block.text.slice(r.start, r.end))
				return new LayoutRun(r.start, r.end, r.style, measure)
			})

			lines = [new Line(block.text, layoutRuns)]

			this.#blockLineCache.set(block, lines)

			return lines
	}

	invalidateBlock(block) {
		this.#blockLineCache.delete(block)
	}

	linePointFromBlockOffset(block, offset) {
		let lineTop = 0
		let offsetX = 0

		for (let b of this.#document) {
			if (b == block) {
				break
			}

			let lines = this.#blockLineCache.get(b)
			for (let line of lines) {
				lineTop += line.height
			}
		}

		let lines = this.#blockLineCache.get(block)

		let line
		let run
		let foundRun = false

		for (line of lines) {
			for (run of line) {
				if (run.end >= offset) {
					foundRun = true
					break
				}
				offsetX += run.measure.width
			}

			if (foundRun) {
				break
			}

			lineTop += line.height
			offsetX = 0
		}

		let ctx = this.#canvasContext
		ctx.font = run.style.font
		let measure = ctx.measureText(line.text.slice(run.start, offset))

		offsetX += measure.width

		return new LinePoint(line, run, lineTop, offsetX)
	}

	documentPositionFromPoint(x, y, editorOffset) {
		//const block, offset
		let ctx = this.#canvasContext
		const position = {
			block: null,
			offset: 0,
		}

		console.log(x, y, editorOffset)
		// make sure click is within bounds of editor
		if (x > editorOffset.left &&
			x < editorOffset.left + ctx.canvas.width &&
			y > editorOffset.top &&
			y < editorOffset.top + ctx.canvas.height) {
				const blocks = this.#blockLineCache.getBlocks()
				let runningBlockHeight = editorOffset.top
				let lastKnownBlock = null
				let validPositionFound = false

				blocks.forEach(function(value, key) {
					lastKnownBlock = key
					let lines = this.layoutBlock(key)
					for (let it = 0; it < lines.length; it++) {
						runningBlockHeight += lines[it].height
						if (y <= runningBlockHeight && y >= runningBlockHeight - lines[it].height) {
							console.log('this is block #: ', it, ' with line height of :', runningBlockHeight, ' pixels')
							position.block = key
							// now find position on the line
							let layoutRuns = [...key.runs()].map(r => {
								let fSize = r.style.fontSize
								console.log('font size: ', fSize)
							})
							//console.log('Line has: ', lines[it].runs[0])
							position.offset = 0
							validPositionFound = true
						}
					}
				}, this)
				
				// if user click on a white space within editor, we place the caret in the last known block
				if (!validPositionFound) {
					position.block = lastKnownBlock
					position.offset = 0
				}

		}
		return position
	}
}