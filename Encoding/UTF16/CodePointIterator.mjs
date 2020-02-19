export default class CodePointIterator {
	#text
	#offset

	constructor(text, offset = 0) {
		this.#text = text
		this.#offset = offset
	}

	get offset() {
		return this.#offset
	}

	get codePointBefore() {
		if (this.#offset === 0) {
			return null
		}
		console.assert(this.#offset > 0)

		if (this.#offset === 1 || 
			this.#text.codePointAt(this.#offset - 2) <= 0xffff	
		) {
			return this.#text.codePointAt(this.#offset - 1)	
		}
		
		return this.#text.codePointAt(this.#offset - 2)
	}

	get codePointAfter() {
		if (this.#offset === this.#text.length) {
			return null
		}
		console.assert(this.#offset < this.#text.length)

		return this.#text.codePointAt(this.#offset)
	}

	next() {
		if (this.#offset === this.#text.length) {
			return false
		}
		console.assert(this.#offset < this.#text.length)

		if (this.#text.codePointAt(this.#offset) > 0xffff) {
			this.#offset += 2
			console.assert(this.#offset <= this.#text.length)
			return true
		}

		this.#offset++
		return true
	}

	previous() {
		if (this.#offset === 0) {
			return false
		}
		console.assert(this.#offset > 0)

		if (this.#offset === 1) {
			this.#offset = 0
			return true
		}
		
		if (this.#text.codePointAt(this.#offset - 2) > 0xffff) {
			this.#offset -= 2
			return true
		}

		this.#offset--
		return true
	}
}