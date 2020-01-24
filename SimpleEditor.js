import style from "./SimpleEditor.css"

import SimpleEditorView from "./SimpleEditorView.js"
import SimpleEditorDocument from "./SimpleEditorDocument.js"

export class SimpleEditor extends HTMLElement {
	#document
	#view
	#shadowRoot

	constructor() {
		super()

		this.#shadowRoot = this.attachShadow({mode:"closed"})
		this.#shadowRoot.adoptedStyleSheets = [style]

		this.#document = new SimpleEditorDocument()
		this.#view = new SimpleEditorView(this.#document)

		this.#shadowRoot.append(this.#view.canvas)
	}
}