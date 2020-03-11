// See http://www.unicode.org/reports/tr14/
import DocumentPositionIterator from "../DocumentPositionIterator.mjs"

class LineBreakIterator {
	#documentPositionIterator

	constructor(documentPosition) {
		this.#documentPositionIterator = new DocumentPositionIterator(documentPosition)

		this.#atStart = documentPosition.codePointBefore === null
		this.#atEnd = documentPosition.codePointAfter === null
	}

	next() {
		let dpi = this.#documentPositionIterator
		let initialPosition = dpi.position		
		
		if (!dpi.next()) {
			return false
		}

		while (true) {
			// LB1 Assign a line breaking class to each code point of the input.
			let A = dpi.position.codePointAfter
			let B = dpi.position.codePointBefore

			// LB2 Never break at the start of text.
			// Note: no action required.  If we are at start of text 

			// LB3 Always break at the end of text.
			if (A === "eot") {
				break
			}

			let Bclass = Unicode.getBreakClass(B)
			let Aclass = Unicode.getBreakClass(A)

			// LB4 Always break after hard line breaks.
			if (Bclass === "BK") {
				break
			}

			// LB5 Treat CR followed by LF, as well as CR, LF, and NL as hard line breaks.
			if (Bclass === "CR") {
				if (Aclass === "LF") {
					continue
				}
				break
			}
			else if (Bclass === "LF" || Bclass === "NL") {
				break
			}

			// LB6 Do not break before hard line breaks.
			if (Aclass === "BK" || Aclass === "CR" || Aclass === "LF" || Aclass === "NL") {
				break
			}			

			// LB7 Do not break before spaces or zero width space.
			if (Aclass === "SP" || Aclass === "ZW") {
				continue
			}

			// LB8 Break before any character following a zero-width space, even if one or more spaces intervene.
			if (Bclass === "ZW") {
				while (Aclass === "SP") {
					if (!dpi.next()) {
						break
					}
					A = dpi.position.codePointAfter
					Aclass = Unicode.getBreakClass(A)
				}
				break
			}

			// LB8a Do not break after a zero width joiner.
			if (Bclass === "ZWJ") {
				continue
			}

			// LB9 Do not break a combining character sequence; treat it as if it has the line breaking class of the base character in all of the following rules. Treat ZWJ as if it were CM.
			if (Bclass === "CM") {
				// Save position
				let dpiClone = dpi.clone()
				
				// Advance through the CM sequence
				while (Aclass === "CM") {
					dpi.next()
				}
				// Find the base character and treat the class of the CM as the base character class from this point forward
				while (dpiClone.previous() && Bclass === "CM") {
					if (dpiClone.position.codePointBefore === null) {
						break
					}
					Bclass = Unicode.getBreakClass(dpiClone.position.codePointBefore)
				}
			}

			// LB10 Treat any remaining combining mark or ZWJ as AL.
			if (Bclass === "BK" || 
				Bclass === "CR" ||
				Bclass === "LF" ||
				Bclass === "NL" ||
				Bclass === "SP" || 
				Bclass === "ZW"
			) {
				// Catches case above where CM is first on a line and should be treated as AL
			}

			// LB11 Do not break before or after Word joiner and related characters

			// LB12 Do not break after NBSP and related characters.

			// LB12a Do not break before NBSP and related characters, except after spaces and hyphens.

			// LB13 Do not break before ‘]’ or ‘!’ or ‘;’ or ‘/’, even after spaces.

			// LB14 Do not break after ‘[’, even after spaces.

			// LB15 Do not break within ‘”[’, even with intervening spaces.

			// LB16 Do not break between closing punctuation and a nonstarter (lb=NS), even with intervening spaces.

			// LB17 Do not break within ‘——’, even with intervening spaces.

			// LB18 Break after spaces.

			// LB19 Do not break before or after quotation marks, such as ‘ ” ’.

			// LB20 Break before and after unresolved CB.

			// LB21 Do not break before hyphen-minus, other hyphens, fixed-width spaces, small kana, and other non-starters, or after acute accents.

			// LB21a Don't break after Hebrew + Hyphen.

			// LB21b Don’t break between Solidus and Hebrew letters.

			// LB22 Do not break between two ellipses, or between letters, numbers or exclamations and ellipsis.

			// LB23 Do not break between digits and letters.

			// LB23a Do not break between numeric prefixes and ideographs, or between ideographs and numeric postfixes.

			// LB24 Do not break between numeric prefix/postfix and letters, or between letters and prefix/postfix.

			// LB25 Do not break between the following pairs of classes relevant to numbers:

			// LB26 Do not break a Korean syllable.

			// LB27 Treat a Korean Syllable Block the same as ID

			// LB28 Do not break between alphabetics (“at”)

			// LB29 Do not break between numeric punctuation and alphabetics (“e.g.”).

			// LB30 Do not break between letters, numbers, or ordinary symbols and opening or closing parentheses.

			// LB30a Break between two regional indicator symbols if and only if there are an even number of regional indicators preceding the position of the break.

			// LB30b Do not break between an emoji base and an emoji modifier.

			// LB31 Break everywhere else.
		}

		return { 
			done: done,
			value: dpi.position
		}
	}
}