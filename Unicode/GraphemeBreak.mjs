import Base64 from "../Base64/Base64.mjs"

import graphemeBreakClassifications from "./GraphemeBreakClassifications.json"
import encodedGraphemeBreakData from "./GraphemeBreakData.json"

let graphemeBreakData = new Array(17)

for (let planeIndex = 0; planeIndex < encodedGraphemeBreakData.length; planeIndex++) {
	if (encodedGraphemeBreakData[planeIndex] !== null) {
		graphemeBreakData[planeIndex] = new Uint8Array(Base64.decode(encodedGraphemeBreakData[planeIndex]))
		continue
	}

	graphemeBreakData[planeIndex] = null
}

export default function classify(codepoint) {
	let planeIndex = codepoint >> 16
	console.assert(planeIndex >= 0 && planeIndex <= 16)
	
	let plane = graphemeBreakData[planeIndex]
	if (plane === null) {
		return graphemeBreakClassifications[0]
	}
	
	let codeUnit = codepoint & 65535
	let codeUnitByteIndex = Math.floor(codeUnit / 2)
	let codeUnitHighBits = codeUnit % 2
	
	let classifierByte = plane[codeUnitByteIndex]
	let classifierIndex
	if (codeUnitHighBits) {
		classifierIndex = classifierByte >> 4
	}
	else {
		classifierIndex = classifierByte & 15	
	}

	return graphemeBreakClassifications[classifierIndex]
}