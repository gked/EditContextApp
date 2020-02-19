// Code adapted from MIT-licensed https://github.com/niklasvh/base64-arraybuffer
const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

// 0-initialized array filled so that only valid base64 characters contribute to decoded bits
const decodeTable = new Uint8Array(new ArrayBuffer(256))
for (let i = 0; i < symbols.length; i++) {
	decodeTable[symbols.charCodeAt(i)] = i
}

export default class Base64 {
	static encode(buffer) {
		let encoded = ""
		let u8view = new Uint8Array(buffer)

		for (let i = 0; i < u8view.length; i += 3) {
			encoded += symbols[u8view[i] >> 2]
			encoded += symbols[((u8view[i] & 3) << 4) | (u8view[i + 1] >> 4)]
			encoded += symbols[((u8view[i + 1] & 15) << 2) | (u8view[i + 2] >> 6)]
			encoded += symbols[u8view[i + 2] & 63]
		}

		if (u8view.length % 3 == 2) {
			encoded = encoded.substring(0, encoded.length - 1) + "="
		} else if (u8view.length % 3 == 1) {
			encoded = encoded.substring(0, encoded.length - 2) + "=="
		}

		return encoded
	}

	static decode(s) {
		let bufferLength = s.length * 3 / 4
		if (s.endsWith("==")) {
			bufferLength-=2
		}
		else if (s.endsWith("=")) {
			bufferLength--
		}

		let buffer = new ArrayBuffer(bufferLength)
		let u8view = new Uint8Array(buffer)
		let byteOffset = 0
		for (let i = 0; i < s.length; i += 4) {
			let encoded1 = decodeTable[s.charCodeAt(i)]
      		let encoded2 = decodeTable[s.charCodeAt(i + 1)]
      		let encoded3 = decodeTable[s.charCodeAt(i + 2)]
      		let encoded4 = decodeTable[s.charCodeAt(i + 3)]

			u8view[byteOffset++] = (encoded1 << 2) | (encoded2 >> 4)
			u8view[byteOffset++] = ((encoded2 & 15) << 4) | (encoded3 >> 2)
			u8view[byteOffset++] = ((encoded3 & 3) << 6) | (encoded4 & 63)
		}

		return buffer
	}
}