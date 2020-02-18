export default class BlinkTimer extends EventTarget {
	#interval
	#intervalId
	#on

	constructor(interval) {
		super()

		this.#on = true
		this.#interval = interval
		this.#intervalId = setInterval(this.callback.bind(this), this.#interval)
	}

	callback() {
		this.#on = !this.#on
		this.dispatchEvent(new CustomEvent("expired"))
	}

	// start or reset countdown
	reset() {
		clearInterval(this.#intervalId)
		this.#intervalId = setInterval(this.callback.bind(this), this.#interval)
	}

	stop(on) {
		clearInterval(this.#intervalId)
		this.#on = on
		this.dispatchEvent(new CustomEvent("expired"))
	}

	get on() {
		return this.#on
	}
}