import Color from "../Color.mjs"
import Style from "../Style.mjs"
import Run from "../Run.mjs"

test(() => {
	let color = new Color(1, 2, 3)
	let style = new Style("bold", "48px", "sans-serif", color)
	let run = new Run(2, 3, style)

	assert_equals(run.style, style)
	assert_equals(run.length, 1)
	assert_equals(run.start, 2)
	assert_equals(run.end, 3)
}, "Run property tests")

test(() => {
	let color = new Color(1, 2, 3)
	let style = new Style("bold", "48px", "sans-serif", color)
	let run = new Run(2, 3, style)

	assert_readonly(run, "style")
	assert_readonly(run, "start")
	assert_readonly(run, "end")
}, "Run immutability")