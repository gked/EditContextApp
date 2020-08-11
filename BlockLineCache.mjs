export default class BlockLineCache {
	#map

	constructor() {
		this.#map = new Map()
	}

	get(block) {
		return this.#map.get(block)
	}

	set(block, lines) {
		this.#map.set(block, lines)
	}

	delete(block) {
		this.#map.delete(block)
	}

	getBlocks() {
		return this.#map
	}
}