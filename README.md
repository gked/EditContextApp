# Simple Editor
This is an editor to explore how custom editing experiences can be built using web technologies.  The first iteration of the editor will focus on using low level web primitives like EditContext to capture input, and output will be displayed via a canvas.

## Setup
Our intent is to leverage the latest primitives of the web platform.  No frameworks will be used in the construction of this editor.

At the time of this writing(January 22, 2020), you must use a command line flag to enable experimental features in a Chromium-based browser to use the editor: `--enable-blink-features=EditContext,JSONModules,CSSModules`.

## Features (currently just goals for features)
The Simple Editor is a rich text editor.  It supports changing the font-weight of the text: normal or bold, underlines, different font families, font sizes and text colors.

Paragraphs of text can also be aligned left or right.

Hardware keyboards and software keyboards can be used for text input as well as other OS-specific text input modalities like IMEs or dictation.

The user indicates where text can be inserted using an insertion point (rendered as '|').  Text can also be selected for editing or formatting using a mouse by clicking and dragging to create a selection (rendered with a blue transparent overlay).

The shortcuts CTRL+C and CTRL+X will copy and cut the selected text.  CTRL+C or CTRL+X while the caret is showing will copy or cut the current the line.

Screen readers and other ATs are supported.

Lines wrap automatically when they are too long to fit on a single line.

## Architecture
### Model
The model for the text is held in memory using the following data structures:

* Document: represents the whole body of text in the editor, organized into Blocks.
* Block: one paragraph of text.
* Run: a range of text within a Block describing the format to be applied to the text.  Runs are owned by Blocks and are sorted in text order.  Runs do not overlap.  Runs provide complete coverage of the text in a Block.
* Line: Runs are processed into Lines to facilitate display.  Lines are owned by Blocks and are ordered.  Lines have a height to facilitate drawing and are drawn down the screen one on top of another with some extra space between each Block's lines.

### Input
Text input is facilitated using EditContext.  Mouse and other pointing input are consumed using PointerEvents.

### Output
Text will be measured and rendered to the screen using a canvas element.

### Hit Testing
Pointer input (and vertical movement of the insertion point) will find nearby text using canvas measurement APIs over the applicable line.  The applicable line will be found by iterating the Blocks of the Document and summing their heights for comparison to the y-coordinate of the pointer input.

### Text Traversal
Editing algorithms to backspace away text or to find a valid insertion point after hit testing will use unicode data to classify code points into grapheme clusters per the Unicode specification.
