import readline from "readline"
import fs from "fs"

import Base64 from "../Encoding/Base64/Base64.mjs"

import graphemeBreakClassifications from "./GraphemeBreakClassifications.json"

let rl = readline.createInterface({ 
	input: fs.createReadStream('./UCD/auxiliary/GraphemeBreakProperty.txt')
})

rl.on('line', handleLine)
rl.on('close', handleClose)

let lines = []
function handleLine(line) {
	if (line.startsWith("#")) {
		return
	}

	if (line.length === 0) {
		return
	}

	lines.push(line)
}

function handleClose() {
	processLines()
}

const codePointCount = 17 * 65536 // 1,114,112
let data = new Array(codePointCount)

function processLines() {
	for (let line of lines) {
		let parts = line.split(";")
		console.assert(parts.length === 2)

		let range = parts[0].split("..")
		let start = parseInt(range[0].trim(), 16)
		let end = start
		if (range.length === 2) {
			end = parseInt(range[1].trim(), 16)
		}

		let classification = parts[1].split("#")[0].trim()
		for (let i = start; i <= end; i++) {
			data[i] = classification
		}
	}

	for (let i = 0; i < data.length; i++) {
		if (!data[i]) {
			data[i] = "Other"
		}
	}

	compactClassificationData()
}

let planes = new Array(17) // Plane 0 - 10 (inclusive)


let i = 0
const classificationCodes = {}
for (let classification of graphemeBreakClassifications) {
	classificationCodes[classification] = i
	i++
}

function compactClassificationData() {
	// Mapping classification data into compact bit pattern
	for (let p = 0; p < planes.length; p++) {
		
		planes[p] = new ArrayBuffer(32768)
		let u8arr = new Uint8Array(planes[p])
		let hasNonOtherClassifier = false

		let byteOffset = 0
		for (let c = 0; c < 65536; c++) {
			const codepoint = p * 65536 + c
			
			if (data[codepoint] !== "Other") {
				hasNonOtherClassifier = true
			}

			if (c % 2 === 0) {
				u8arr[byteOffset] = classificationCodes[data[codepoint]]
			}
			else {
				u8arr[byteOffset] = u8arr[byteOffset] | (classificationCodes[data[codepoint]] << 4)	
				byteOffset++
			}
		}

		if (!hasNonOtherClassifier) {
			planes[p] = null
		}
	}
	encodeToJSON()
}

function encodeToJSON() {
	let json = "["
	for (let p = 0; p < planes.length; p++) {
		json += "\n\t"

		if (planes[p] === null) {
			json += "null"
		}
		else {
			json += "\"" + Base64.encode(planes[p]) + "\""
		}

		if (p < planes.length - 1) {
			json += ","
		}
	}
	json += "\n]"

	console.log(json)
}