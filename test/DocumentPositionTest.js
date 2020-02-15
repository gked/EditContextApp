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

    let block1 = new Block("the cat", [new Run(0, 7, style)])
    let block2 = new Block("is quick", [new Run(0, 8, style)])
    let blocks = [block1, block2]

    let validCodePoints = [
        {b:null, a:"t".charCodeAt(0)},
        {b:"t".charCodeAt(0), a:"h".charCodeAt(0)},
        {b:"h".charCodeAt(0), a:"e".charCodeAt(0)},
        {b:"e".charCodeAt(0), a:" ".charCodeAt(0)},
        {b:" ".charCodeAt(0), a:"c".charCodeAt(0)},
        {b:"c".charCodeAt(0), a:"a".charCodeAt(0)},
        {b:"a".charCodeAt(0), a:"t".charCodeAt(0)},
        {b:"t".charCodeAt(0), a:"¶".charCodeAt(0)},
        {b:"¶".charCodeAt(0), a:"i".charCodeAt(0)},
        {b:"i".charCodeAt(0), a:"s".charCodeAt(0)},
        {b:"s".charCodeAt(0), a:" ".charCodeAt(0)},
        {b:" ".charCodeAt(0), a:"q".charCodeAt(0)},
        {b:"q".charCodeAt(0), a:"u".charCodeAt(0)},
        {b:"u".charCodeAt(0), a:"i".charCodeAt(0)},
        {b:"i".charCodeAt(0), a:"c".charCodeAt(0)},
        {b:"c".charCodeAt(0), a:"k".charCodeAt(0)},
        {b:"k".charCodeAt(0), a:"¶".charCodeAt(0)},
        {b:"¶".charCodeAt(0), a:null}
    ]

    let i = 0
    for (let b = 0; b < blocks.length; b++) {
        for (let o = 0; o <= blocks[b].text.length; o++) {
            let position = new DocumentPosition(blocks, b, o)
            assert_equals(validCodePoints[i].b, position.codePointBefore)
            assert_equals(validCodePoints[i].a, position.codePointAfter)
            i++
        }
    }

    // Validate position after last block in the Document
    let position = new DocumentPosition(blocks, blocks.length - 1, blocks[blocks.length - 1].text.length + 1)
    assert_equals(validCodePoints[i].b, position.codePointBefore)
    assert_equals(validCodePoints[i].a, position.codePointAfter)

}, "DocumentPosition codePoint tests")
