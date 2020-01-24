import Line from "./Line.js"
import Style from "./Style.js"
import LayoutRun from "./LayoutRun.js"

export default class BlockLayout {
	static layoutBlock(block, ctx) {
		// TODO: measure and break lines
		let layoutRuns = [...block.runs()].map(r => {
			ctx.font = r.style.font
			let measure = ctx.measureText(block.text.slice(r.start, r.end))
			return new LayoutRun(r.start, r.end, r.style, measure)
		})

		return [new Line(block.text, layoutRuns)]
	}
}