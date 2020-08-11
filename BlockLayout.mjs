import Line from "./Line.mjs"
import Style from "./Style.mjs"
import LayoutRun from "./LayoutRun.mjs"
import BlockLineCache from "./BlockLineCache.mjs"
import LayoutPosition from "./LayoutPosition.mjs"

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

	layoutPositionFromDocumentPosition(documentPosition) {
		let lineTop = 0
		let offsetX = 0
		let block = documentPosition.block
		let offset = documentPosition.offset

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

		return new LayoutPosition(line, run, lineTop, offsetX)
	}

	documentPositionFromPoint(x, y, editorOffset) {
		//const block, offset
		let ctx = this.#canvasContext
		const position = {
			block: null,
			offset: 0,
		}

		const blocks = this.#blockLineCache.getBlocks()
		let runningBlockHeight = editorOffset.top
		let lastKnownBlock = null
		let lastKnownOffset = 0
		let validVerticalPositionFound = false
		let correctLine
		let hasFoundTheLine = false
		let correctLineRun

		for (let [key, value] of blocks) {
			// get lines in the current block
			let lines = this.layoutBlock(key)
			// find the right line
			for (let it = 0; it < lines.length; it++) {
				runningBlockHeight += lines[it].height
				if (y <= runningBlockHeight && y >= runningBlockHeight - lines[it].height) {
					// found the right line
					correctLine = lines[it]
					lastKnownBlock = key
					hasFoundTheLine = true
					validVerticalPositionFound = true
					break
				}
				// handle the case where Y coordinate is above or below text
				if (!validVerticalPositionFound) {
					lastKnownBlock = key
					lastKnownOffset = lines[it].text.length
				}
			}
			if (hasFoundTheLine)
				break
		}

		//check if X is within current line run bounds
		if (validVerticalPositionFound) {
			let runningLineWidth = editorOffset.left
			for (let lineRun of correctLine) {
				ctx.font = lineRun.style.font
				if (runningLineWidth + lineRun.measure.width >= x) {
					correctLineRun = lineRun
					break
				}
				runningLineWidth += lineRun.measure.width
				lastKnownOffset = correctLine.text.length
			}

			if (correctLineRun) {
				for (let ind = correctLineRun.start; ind < correctLineRun.end; ind++) {
					let character = correctLine.text.slice(ind, ind + 1)
					let characterWidth = ctx.measureText(character).width
					// do we have the right character at X?
					if (runningLineWidth + characterWidth >= x ) {
						runningLineWidth += characterWidth
						lastKnownOffset = ind
						break
					}
					runningLineWidth += characterWidth
				}
			}
		}

		position.block = lastKnownBlock
		position.offset = lastKnownOffset

		return position
	}
}