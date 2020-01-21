import style from "./SimpleEditor.css"

export class SimpleEditor extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({mode:"open"})
		this.shadowRoot.adoptedStyleSheets = [style]
	}
}