import CodePointIterator from "../Encoding/UTF16/CodePointIterator.mjs"
import getGraphemeBreakClassification from "./GraphemeBreak.mjs"

export default class GraphemeBreakIterator {
	#text
	#codePointIterator

	constructor(text, offset = 0) {
		this.#text = text
		this.#codePointIterator = new CodePointIterator(text, offset)
	}

	get offset() {
		return this.#codePointIterator.offset
	}

	next() {
		let moved = false

		// See [this URL](https://www.unicode.org/reports/tr29/tr29-35.html) 
		// for an explanation of these steps.

		// Break at the start and end of text, unless the text is empty.
		// GB1: sot ÷ Any (requires no action moving forward)
		// GB2: Any ÷ eot
		while (this.#codePointIterator.next()) {
			moved = true

			let B = this.#codePointIterator.codePointBefore
			let A = this.#codePointIterator.codePointAfter
			let Bclass = getGraphemeBreakClassification(B)
			let Aclass = getGraphemeBreakClassification(A)

			if (isAtBreak(Bclass, Aclass)) {
				break
			}
	    }

		return moved
	}

	previous() {
		let moved = false

		// See [this URL](https://www.unicode.org/reports/tr29/tr29-35.html) 
		// for an explanation of these steps.

		// Break at the start and end of text, unless the text is empty.
		// GB1: sot ÷ Any
		// GB2: Any ÷ eot (requires no action moving backward)
		while (this.#codePointIterator.previous()) {
			moved = true

			let B = this.#codePointIterator.codePointBefore
			let A = this.#codePointIterator.codePointAfter
			let Bclass = getGraphemeBreakClassification(B)
			let Aclass = getGraphemeBreakClassification(A)

			if (isAtBreak(Bclass, Aclass)) {
				break
			}
	    }

		return moved
	}
}

function isAtBreak(Bclass, Aclass) {
	// Do not break between a CR and LF. Otherwise, break before and after controls.
	// GB3: CR × LF
	if (Bclass === "CR" && Aclass === "LF") {
		return false
	}

	// GB4: (Control | CR | LF) ÷
	// GB5: ÷ (Control | CR | LF)
	if (Bclass === "CR" || Bclass === "LF" || Bclass === "Control" ||
		Aclass === "CR" || Aclass === "LF" || Aclass === "Control"
	) {
		return true
	}

	// Do not break Hangul syllable sequences.
	// GB6: L × (L | V | LV | LVT)
	if (Bclass === "L" &&
	   (Aclass === "L" || Aclass === "V" || Aclass === "LV" || Aclass === "LVT")
	) {
		return false
	}

	// GB7: (LV | V) × (V | T)
	if ((Bclass === "L" || Bclass == "V") &&
	   	(Aclass === "V" || Aclass === "T")
	) {
		return false
	}

	// GB8: (LVT | T) × T
	if ((Bclass === "LVT" || Bclass == "T") && Aclass === "T") {
		return false
	}

	// Do not break before extending characters or ZWJ.
	// GB9: × (Extend | ZWJ)
	if (Aclass === "Extend" || Aclass === "ZWJ") {
		return false
	}

	// Do not break before SpacingMarks, or after Prepend characters.
	// (apply only for extended grapheme clusters - which we will implement instead of "legacy grapheme clusters")
	// GB9a: × SpacingMark
	// GB9b Prepend × 
	if (Aclass === "SpacingMarks" || Bclass === "Prepend") {
		return false
	}

	// Do not break within emoji modifier sequences or emoji zwj sequences.

	// Do not break within emoji flag sequences. That is, do not break between regional indicator (RI) symbols if there is an odd number of RI characters before the break point.

	// Otherwise, break everywhere.
	return true

}