import Color from "../Color.mjs"
import Style from "../Style.mjs"
import Run from "../Run.mjs"
import Block from "../Block.mjs"
import DocumentPositionIterator from "../DocumentPositionIterator.mjs"

test(() => {
    let color = new Color(1, 2, 3)
    let style = new Style("normal", "12px", "serif", color)
    let run = new Run(0, 7, style)

    let runs = [run]
    let block = new Block("the cat", runs)
    let blocks = [block]

    let iterator = new DocumentPositionIterator(blocks, 0, 0)

    assert_readonly(iterator, "blockIndex")
    assert_readonly(iterator, "block")
    assert_readonly(iterator, "offset")
    assert_readonly(iterator, "position")

    let position = iterator.position

    assert_equals(iterator.blockIndex, 0)
    assert_equals(iterator.block, block)
    assert_equals(iterator.offset, 0)
    
    assert_equals(iterator.offset, position.offset)
    assert_equals(iterator.block, position.block)
    assert_equals(iterator.blockIndex, position.blockIndex)

    assert_equals(iterator.position, position)
    assert_equals(iterator.position.compare(position), 0)

}, "DocumentPositionIterator property tests")

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

    let iterator = new DocumentPositionIterator(blocks, 0, 0)
    let i
    for (i = 0; i < validCodePoints.length - 1; i++) {
        assert_equals(validCodePoints[i].b, iterator.position.codePointBefore)
        assert_equals(validCodePoints[i].a, iterator.position.codePointAfter)
        assert_true(iterator.next())
    }

    assert_equals(validCodePoints[i].b, iterator.position.codePointBefore)
    assert_equals(validCodePoints[i].a, iterator.position.codePointAfter)
    assert_false(iterator.next())

    for (i = validCodePoints.length - 1; i > 0; i--) {
        assert_equals(validCodePoints[i].b, iterator.position.codePointBefore)
        assert_equals(validCodePoints[i].a, iterator.position.codePointAfter)
        assert_true(iterator.previous())
    }

    assert_equals(validCodePoints[i].b, iterator.position.codePointBefore)
    assert_equals(validCodePoints[i].a, iterator.position.codePointAfter)
    assert_false(iterator.previous())

}, "DocumentPositionIterator position tests")
