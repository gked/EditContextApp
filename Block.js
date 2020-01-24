import Style from "./Style.js"
import Run from "./Run.js"

export default class Block extends EventTarget {
	#text
	#style
	#runs = []

	constructor(text, runs) {
		super()

		this.#text = text
		this.#runs = [...runs]

		this[Symbol.iterator] = this.runs.bind(this)
	}

	get text() {
		return this.#text
	}

	spliceText(offset, removeCount, insertText) {
		// Normalize offset, which may be negative, to a positive index.
		//
		// Note that array splice will clamp values to be within the bounds of the array,
		// but that we simply assert that to be the case as it would indicate a bug elsewhere.
		if (offset < 0) {
			offset = this.#text.length + offset
			console.assert(offset >= 0)
		}
		console.assert(offset <= this.#text.length)

		let chars = [...this.#text]
		chars.splice(offset, removeCount, insertText)
		this.#text = chars.join("")

		// Update all the Runs in this Block to account for the new text.
		let delta = offset - removeCount + insertText.length
		let runs = []

		for (let run of this.#runs) {
			if (run.end < offset) {
				runs.push(run)
				continue
			}

			if (run.start > offset + removeCount) {
				runs.push(new Run(run.start + delta, run.end + delta, run.style))
				continue
			}

			if (run.start <= offset) {
				// First run to intersect will cover all the insertedText,
				// but it may not cover all the characters to be removed
				let runEnd = Math.min(offset, run.end - removeCount) + insertText.length
				runs.push(new Run(run.start, runEnd, run.style))

				// removeCount is now remaining to be removed in subsequent Runs
				removeCount = Math.min(0, removeCount - (run.end - offset))
				continue
			}

			console.assert(run.start > offset)
			if (run.length <= removeCount) {
				// We don't need this Run, it's completely removed
				removeCount = Math.min(0, removeCount - (run.length))
				continue
			}

			console.assert(run.end > run.start + removeCount)
			// The run length will decrease since we're removing characters from the Run.
			// The start will not fully increase by delta but every Run after this can just
			// have the start and end updated by delta.
			let runStart = run.start - removeCount + insertText.length
			runs.push(new Run(runStart, run.end + delta, run.style))
		}

		this.#runs = runs

		this.dispatchEvent(new CustomEvent("changed"))
	}

	get style() {
		return this.#style
	}

	set style(style) {
		this.#style = style
		this.dispatchEvent(new CustomEvent("changed"))
	}

	*runs() {
		for(let i = 0; i < this.#runs.length; i++) {
			yield this.#runs[i]
		}
	}

	toString() {
		return this.text
	}
}