import Color from "../Color.mjs"
import Style from "../Style.mjs"
import Run from "../Run.mjs"
import Block from "../Block.mjs"

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	assert_equals(block.text, "the cat")
	assert_not_equals(block.runs, runs)

	let i = 0
	for(let run of block) {
		assert_equals(run, runs[i])
		i++
	}
}, "Block property tests")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.validateRuns()	
}, "Block run validation succeeds test")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 5, style2)

	let runs = [run1, run2]
	assert_throws({name: "Error"}, () => { new Block("the cat", runs) })
}, "Block run validation fails text length check")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(5, 7, style2)

	let runs = [run1, run2]
	assert_throws({name: "Error"}, () => { new Block("the cat", runs) })
}, "Block run validation fails gap check")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(7, 4, style2)

	let runs = [run1, run2]
	assert_throws({name: "Error"}, () => { new Block("the cat", runs) })
}, "Block run validation fails start less than end check")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/5, /*removeCount*/2, /*insertText*/"ow")
	
	assert_equals(block.text, "the cow")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_equals(run, run1, "run1 should remain untouched")
		}
		else if (i == 1) {
			assert_not_equals(run, run2, "run2 should have a new identity but otherwise be the same")
			assert_equals(run2.start, run.start)
			assert_equals(run2.end, run.end)
			assert_equals(run2.style, run.style)
		}
		else {
			assert_true(i < 2, "there should only be two runs")
		}
		i++
	}
}, "Block spliceText replace text inside one run")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/4, /*removeCount*/0, /*insertText*/"quick ")
	
	assert_equals(block.text, "the quick cat")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_not_equals(run, run1, "run1 should have a new identity")
			assert_equals(run.start, 0)
			assert_equals(run.end, 10)
			assert_equals(run.style, run1.style)
		}
		else if (i == 1) {
			assert_not_equals(run, run2, "run2 should have a new identity")
			assert_equals(run.start, 10)
			assert_equals(run.end, 13)
			assert_equals(run2.style, run.style)
		}
		else {
			assert_true(i < 2, "there should only be two runs")
		}
		i++
	}
}, "Block spliceText insert text at between runs")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/5, /*removeCount*/1)
	
	assert_equals(block.text, "the ct")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_equals(run, run1, "run1 should remain untouched")
		}
		else if (i == 1) {
			assert_not_equals(run, run2, "run2 should have a new identity")
			assert_equals(run.start, 4)
			assert_equals(run.end, 6)
			assert_equals(run2.style, run.style)
		}
		else {
			assert_true(i < 2, "there should only be two runs")
		}
		i++
	}
}, "Block spliceText remove text in one run")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/2, /*removeCount*/3)
	
	assert_equals(block.text, "that")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_not_equals(run, run1, "run1 should have a new identity")
			assert_equals(run.start, 0)
			assert_equals(run.end, 2)
			assert_equals(run1.style, run.style)
		}
		else if (i == 1) {
			assert_not_equals(run, run2, "run2 should have a new identity")
			assert_equals(run.start, 2)
			assert_equals(run.end, 4)
			assert_equals(run2.style, run.style)
		}
		else {
			assert_true(i < 2, "there should only be two runs")
		}
		i++
	}
}, "Block spliceText remove text in two runs")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/0, /*removeCount*/4)
	
	assert_equals(block.text, "cat")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_not_equals(run, run2, "run2 should have a new identity")
			assert_equals(run.start, 0)
			assert_equals(run.end, 3)
			assert_equals(run2.style, run.style)
		}
		else {
			assert_true(i < 1, "there should only be one run left")
		}
		i++
	}
}, "Block spliceText fully remove first intersected run")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/3, /*removeCount*/4)
	
	assert_equals(block.text, "the")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_not_equals(run, run1, "run2 should have a new identity")
			assert_equals(run.start, 0)
			assert_equals(run.end, 3)
			assert_equals(run1.style, run.style)
		}
		else {
			assert_true(i < 1, "there should only be one run left")
		}
		i++
	}
}, "Block spliceText fully remove last intersected run")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 10, style2)

	let color3 = new Color(7, 8, 9)
	let style3 = new Style("normal", "20px", "Arial", color3)
	let run3 = new Run(10, 13, style3)

	let runs = [run1, run2, run3]
	let block = new Block("the quick cat", runs)

	block.spliceText(/*offset*/2, /*removeCount*/9)
	
	assert_equals(block.text, "that")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_not_equals(run, run1, "run1 should have a new identity")
			assert_equals(run.start, 0)
			assert_equals(run.end, 2)
			assert_equals(run1.style, run.style)
		}
		else if (i == 1) {
			assert_not_equals(run, run3, "run3 should have a new identity")
			assert_equals(run.start, 2)
			assert_equals(run.end, 4)
			assert_equals(run3.style, run.style)
		}
		else {
			assert_true(i < 2, "there should only be two runs left")
		}
		i++
	}
}, "Block spliceText fully remove middle run")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/0, /*removeCount*/4, "a ")
	
	assert_equals(block.text, "a cat")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_not_equals(run, run1, "run1 should have a new identity")
			assert_equals(run.start, 0)
			assert_equals(run.end, 2)
			assert_equals(run1.style, run.style)
		}
		else if (i == 1) {
			assert_not_equals(run, run2, "run2 should not have a new identity")
		}
		else {
			assert_true(i < 2, "there should only be two runs")
		}
		i++
	}
}, "Block spliceText fully remove original text from first intersected run and add some insertedText back")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/0, /*removeCount*/7)
	
	assert_equals(block.text, "")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_equals(run.start, 0)
			assert_equals(run.end, 0)
			assert_equals(run.style, run1.style)
		}
		else {
			assert_true(i < 1, "there should be only one run")
		}
		i++
	}
}, "Block spliceText remove all text")

test(() => {
	let color1 = new Color(1, 2, 3)
	let style1 = new Style("normal", "12px", "serif", color1)
	let run1 = new Run(0, 4, style1)

	let color2 = new Color(4, 5, 6)
	let style2 = new Style("bold", "48px", "sans-serif", color2)
	let run2 = new Run(4, 7, style2)

	let runs = [run1, run2]
	let block = new Block("the cat", runs)

	block.spliceText(/*offset*/0, /*removeCount*/7)
	
	assert_equals(block.text, "")
	block.validateRuns()
	
	let i = 0
	for (let run of block) {
		if (i == 0) {
			assert_equals(run.start, 0)
			assert_equals(run.end, 0)
			assert_equals(run.style, run1.style)
		}
		else {
			assert_true(i < 1, "there should be only one run")
		}
		i++
	}

	block.spliceText(/*offset*/0, /*removeCount*/0, "test")

	assert_equals(block.text, "test")
	block.validateRuns()
	
	i = 0
	for (let run of block) {
		if (i == 0) {
			assert_equals(run.start, 0)
			assert_equals(run.end, 4)
			assert_equals(run.style, run1.style)
		}
		else {
			assert_true(i < 1, "there should be only one run")
		}
		i++
	}

}, "Block spliceText remove all text and then separately add some back")

