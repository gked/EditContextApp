import Line from "./Line.js"
import Style from "./Style.js"
import Run from "./Run.js"

export default class BlockLayout {
	static layoutBlock(block) {
		// TODO: measure and break lines
		return [new Line(block.text, [...block.runs()])]
	}
}