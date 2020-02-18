import style from "./SimpleEditor.css"

import SimpleEditorView from "./SimpleEditorView.mjs"
import SimpleEditorDocument from "./SimpleEditorDocument.mjs"

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

		this.#shadowRoot.append(this.#view.container)
	}
}