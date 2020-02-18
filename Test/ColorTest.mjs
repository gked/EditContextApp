import Color from "../Color.js"

test(() => {
	let color = new Color(1, 2, 3)
	assert_equals(color.red, 1)
	assert_equals(color.green, 2)
	assert_equals(color.blue, 3)
	assert_equals(color.toString(), "rgb(1, 2, 3)")
}, "Color serialization")

test(() => {
	let color = new Color(1, 2, 3)
	assert_readonly(color, "red")
	assert_readonly(color, "green")
	assert_readonly(color, "blue")
}, "Color immutability")