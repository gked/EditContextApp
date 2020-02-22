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

		// make sure click is within bounds of editor
		if (x > editorOffset.left &&
			x < editorOffset.left + ctx.canvas.width &&
			y > editorOffset.top &&
			y < editorOffset.top + ctx.canvas.height) {
				const blocks = this.#blockLineCache.getBlocks()
				let runningBlockHeight = editorOffset.top
				let lastKnownBlock = null
				let lastKnownOffset = 0
				let validPositionFound = false

				blocks.forEach(function(value, key) {
					let lines = this.layoutBlock(key)
					for (let it = 0; it < lines.length; it++) {
						runningBlockHeight += lines[it].height
						if (y <= runningBlockHeight && y >= runningBlockHeight - lines[it].height) {
							position.block = key
							let currentLineRun = lines[it]					
							let runningLineWidth = editorOffset.left
							// find the right line run
							for (let i of currentLineRun) {
								ctx.font = i.style.font
								let currentText = currentLineRun.text.slice(i.start, i.end)
								let currentTextMeasure = ctx.measureText(currentText)
								//check if X is within current line bounds
								if (runningLineWidth + currentTextMeasure.width >= x) {
									for (let ind = i.start; ind < i.end; ind++) {
										let character = currentLineRun.text.slice(ind, ind + 1)
										let characterWidth = ctx.measureText(character).width
										// do we have the right character at X?
										if (runningLineWidth + characterWidth >= x ) {
											runningLineWidth += characterWidth
											lastKnownBlock = key
											lastKnownOffset = ind
											validPositionFound = true
											break												
										}
										runningLineWidth += characterWidth				
									}
									break
								}
								runningLineWidth += currentTextMeasure.width
								lastKnownBlock = key
								lastKnownOffset = currentLineRun.text.length
								validPositionFound = true
							}
						}
						// handle the case where Y coordinate is above or below text
						if (!validPositionFound) {
							lastKnownBlock = key
							lastKnownOffset = lines[it].text.length
						}
					}
				}, this)
				position.block = lastKnownBlock
				position.offset = lastKnownOffset
		}
		return position
	}
}