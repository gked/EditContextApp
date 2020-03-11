import Style from "./Style.mjs"
import Run from "./Run.mjs"

export default class Block extends EventTarget {
	#text
	#style
	#runs = []

	constructor(text, runs) {
		super()

		this.#text = text
		this.#runs = [...runs]

		this[Symbol.iterator] = this.runs.bind(this)

		this.validateRuns()
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

		// Normalize insertText
		insertText = insertText ?? ""

		let chars = [...this.#text]
		chars.splice(offset, removeCount, ...insertText)
		this.#text = chars.join("")

		this.updateRuns(offset, removeCount, insertText.length)

		this.dispatchEvent(new CustomEvent("changed"))
	}

	updateRuns(offset, removeCount, insertCount) {
		// Update all the Runs in this Block to account for the new text.
		let delta = insertCount - removeCount
		let runs = []

		let firstRun = this.#runs[0]

		for (let run of this.#runs) {
			if (run.end < offset) {
				// This run is before the change and is unaffected
				runs.push(run)
				continue
			}

			if (run.start < offset || run.start == offset && offset == 0) {
				// First run to intersect the changed area.
				// It will receive all the insertedText,
				// but it may not cover all the characters to be removed.
				let runEnd = Math.max(offset, run.end - removeCount) + insertCount

				// If we removed everything and had nothing to insert we can remove this run
				if (runEnd - run.start > 0) {
					runs.push(new Run(run.start, runEnd, run.style))
				}

				// removeCount is now remaining to be removed in subsequent Runs
				removeCount = Math.max(0, removeCount - (run.end - offset))
				continue
			}

			console.assert(run.start >= offset)
			if (run.length <= removeCount) {
				// We don't need this Run, it's completely removed
				removeCount = Math.max(0, removeCount - (run.length))
				continue
			}

			console.assert(run.end > run.start + removeCount)
			if (removeCount > 0) {
				// Last intersected run by the change.  
				// The start of this run should not decrease fully by delta,
				// since some of the removeCount hasn't been removed yet - 
				// it will be taken out of this run.
				let runStart = run.start + delta + removeCount
				runs.push(new Run(runStart, run.end + delta, run.style))
				removeCount = 0
				continue
			}


			// Everything else just needs the delta added
			runs.push(new Run(run.start + delta, run.end + delta, run.style))
		}

		if (runs.length == 0) {
			// Always have a run to define the style
			runs.push(new Run(0, 0, firstRun.style))
		}

		this.#runs = runs

		this.validateRuns()
	}

	get style() {
		return this.#style
	}

	set style(style) {
		this.#style = style
		this.dispatchEvent(new CustomEvent("changed"))
	}

	*runs() {
		let runs = [...this.#runs]
		for(let run of runs) {
			yield run
		}
	}

	toString() {
		return this.text
	}

	validateRuns() {
		let charCount = this.text.length
		let previousRunEnd = 0

		for (let run of this.runs()) {
			if (run.start != previousRunEnd)
				throw new Error("run start not equal to previous run end")

			if (run.end < run.start)
				throw new Error("run end less than run start")

			previousRunEnd = run.end	
		}

		if(previousRunEnd != charCount)
			throw new Error("runs did not cover a range equal to the text length")
	}
}