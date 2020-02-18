# Grapheme Cluster Breaking
Grapheme Clusters are generally what users perceive as characters.  They are comprised of one or more UTF-16 encoded code units in a JavaScript string. 

The boundaries between sequences of code units that make up a Grapheme Cluster are determined according to the rules in [TR29](https://www.unicode.org/reports/tr29/tr29-35.html#Grapheme_Cluster_Boundaries).  The rules are based on the classification of Unicode code units into one of the following:

0. CR  (carriage return)
0. LF  (line feed)
0. Control
0. L   (Hangul symbol type L)
0. V   (Hangul symbol type V)
0. T   (Hangul symbol type T)
0. LV  (Hangul symbol type LV)
0. LVT (Hangul symbol type LVT)
0. Extend
0. ZWJ (zero width joiner)
0. RI  (Regional indicator)
0. SpacingMark
0. Prepend
0. Emoji
0. Other

The data for mapping code units to Grapheme Cluster breaking classifications is [located here](https://www.unicode.org/Public/12.1.0/ucd/auxiliary/GraphemeBreakProperty.txt).  One exception is the classification of Emoji data, which is covered by [TR51](https://www.unicode.org/reports/tr51/).  The data files detailing the classifications of Emoji are [detailed separately here](https://www.unicode.org/reports/tr51/#emoji_data).

## Representation in Code
Grapheme Cluster breaking classifications can can be classified using 4 bits.  The values represented by those bits are 0-15 in the order listed above.  Each set of 4 bits represents a single code unit within a given unicode plane.

If a plane only contains "Other" to classify all of its code points, then storage can be optimized.  The resulting structure is represented below.  Note: excluding Emoji data, only Plane 0 and Plane E have any classifications other than "Other" defined.

```JavaScript
// 17 planes of Unicode CodePoints encoded in a 2-stage array:
//   The first stage are pointers whose position in the 1st array correspond to a Unicode plane
//   The second is a Uint8Array view over an ArrayBuffer of bits representing the classification
//   of the corresponding codepoint.
[
	// Plane 0: 0000 0000-FFFF, Basic Multi-lingual Plane (BMP)
	=> Uint8Array => ArrayBuffer 1011 1001 1010...

	// Plane 1: 0001 10000-1FFFF
	=> null

	// Plane 2: 0002 20000-2FFFF
	=> null

	// ... (all null planes until E)

	// Plane E: 000E E0000-EFFFF
	=> Uint8Array => ArrayBuffer 1100 1010 1101...

	// Plane F: 000F F0000-FFFFF
	=> null

	// Plane 10: 0010 100000-10FFFF
	=> null
]

```

# Serialization of Unicode Data
There are at least two worthwhile options to explore to create the required ArrayBuffers in memory.  Both assume some build step that prepocesses the raw text files from the UCD into a more web/JavaScript-friendly form.

1. A JSON representation of the bits of the ArrayBuffer base64 encoded to a string (either as a JSON module or a fetched JSON file)
2. A JS module that represents the data as a JS literal

## Notes on Representing the Data as a JSON Module
64K codepoints per array with 2 arrays but only 4 bits per codepoint classification is 64Kb.  Inflated for base64 encoding is 85Kb if the data were transmitted uncompressed using a UTF-8 encoding over the wire.

When the encoded data is retrieved and represented in memory it doubles since JavaScript strings are UTF-16 (85K * 2 = 170K).

When the data is turned into 2 ArrayBuffers to facilitate rapid classification of code units, the data will only occupy 64K.

### Fetching versus Imported JSON Module
If the string is fetched using author-supplied script, it should be garbage collectable and transient, but there will be more transient memory due to the fetch string in addition to the JSON object representation.  If loaded as a JSON module the 170K would be forever committed to the process. 

Fetch, comes with some complexity though when it participates in a module system that expects to answer queries about unicode characters synchronously.  A good discussion of those issues is [outlined here](https://dandclark.github.io/json-css-module-notes/).

## Notes on JS Literals versus JSON Modules
To-be-completed.