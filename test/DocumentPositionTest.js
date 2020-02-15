import Color from "../Color.js"
import Style from "../Style.js"
import Run from "../Run.js"
import Block from "../Block.js"
import DocumentPosition from "../DocumentPosition.js"

test(() => {
    let color = new Color(1, 2, 3)
    let style = new Style("normal", "12px", "serif", color)
    let run = new Run(0, 7, style)

    let runs = [run]
    let block = new Block("the cat", runs)
    let blocks = [block]

    let position = new DocumentPosition(blocks, 0, 0)

    assert_readonly(position, "blockIndex")
    assert_readonly(position, "block")
    assert_readonly(position, "offset")

    assert_equals(position.blockIndex, 0)
    assert_equals(position.block, block)
    assert_equals(position.offset, 0)

}, "DocumentPosition property tests")

test(() => {
    let color = new Color(1, 2, 3)
    let style = new Style("normal", "12px", "serif", color)
    let run = new Run(0, 7, style)

    let runs = [run]
    let block = new Block("", runs)
    let blocks = [block]

    let position = new DocumentPosition(blocks, 0, 0)

    assert_readonly(position, "blockIndex")
    assert_readonly(position, "block")
    assert_readonly(position, "offset")

    assert_equals(position.blockIndex, 0)
    assert_equals(position.block, block)
    assert_equals(position.offset, 0)

}, "DocumentPosition property tests")
