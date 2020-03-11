import DocumentPosition from "./DocumentPosition.mjs"

export default class DocumentPositionIterator {
    #blocks
    #blockIndex
    #offset
    #position

    constructor(blocks, blockIndex, offset) {
        this.#blocks = blocks
        this.#blockIndex = blockIndex
        this.#offset = offset
        this.#position = null
    }

    get position() {
        if (this.#position !== null &&
            this.#position.blockIndex === this.#blockIndex &&
            this.#position.offset === this.#offset
        ) {
            return this.#position
        }

        this.#position = new DocumentPosition(
            this.#blocks,
            this.#blockIndex,
            this.#offset
        )

        return this.#position
    }

    get block() {
        return this.#blocks[this.#blockIndex]
    }

    get blockIndex() {
        return this.#blockIndex
    }

    get offset() {
        return this.#offset
    }

    next() {
        if (this.#offset < this.block.text.length) {
            this.#offset++
            return true
        }
        if (this.#blockIndex === this.#blocks.length - 1) {
            if (this.#offset === this.block.text.length) {
                this.#offset++
                return true
            }

            console.assert(this.#offset === this.block.text.length + 1)
            return false
        }
        
        console.assert(this.#blockIndex < this.#blocks.length - 1)

        this.#blockIndex++
        this.#offset = 0
        return true
    }

    previous() {
        if (this.#offset > 0) {
            this.#offset--
            return true
        }
        if (this.#blockIndex === 0) {
            return false
        }

        console.assert(this.#blockIndex > 0)

        this.#blockIndex--
        this.#offset = this.block.text.length
        return true
    }
}