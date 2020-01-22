import style from "./SimpleEditor.css"

import SimpleEditorView from "./SimpleEditorView.js"

export class SimpleEditor extends HTMLElement {
	#view
	#shadowRoot

	constructor() {
		super()

		this.#shadowRoot = this.attachShadow({mode:"closed"})
		this.#shadowRoot.adoptedStyleSheets = [style]

		this.#view = new SimpleEditorView()
		this.#shadowRoot.append(this.#view.canvas)
	}
}