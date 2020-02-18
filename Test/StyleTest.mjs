import Color from "../Color.js"
import Style from "../Style.js"

test(() => {
	let color = new Color(1, 2, 3)
	let style = new Style("bold", "48px", "sans-serif", color)

	assert_equals(style.color, color)
	assert_equals(style.fontWeight, "bold")
	assert_equals(style.fontSize, "48px")
	assert_equals(style.fontFamily, "sans-serif")
	assert_equals(style.font, "bold 48px sans-serif")
}, "Style serialization")

test(() => {
	let color = new Color(1, 2, 3)
	let style = new Style("bold", "48px", "sans-serif", color)

	assert_readonly(style, "color")
	assert_readonly(style, "fontWeight")
	assert_readonly(style, "fontSize")
	assert_readonly(style, "fontFamily")
	assert_readonly(style, "font")
}, "Style immutability")