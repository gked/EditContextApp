# Testing
Tests are authored using the [web-platform-tests testharness.js API](https://web-platform-tests.org/writing-tests/testharness-api.html).

Each module should have a test located in a Test subdirectory where the module is defined.  Each Test subdirectory has a Test.html file which can be loaded to exercise the capabilities of all the modules located in the parent directory.  

Test code is written in test modules named for the module they are testing.  For example, if authoring tests for Style and Color modules, Test/StyleTest and Test/ColorTest modules should be created and imported into Test/Test.html.

```html
<!DOCTYPE html>
<html>
<head>
	<title>Tests for Style and Color</title>
	<script src="../TestHarness/TestHarness.js"></script>
	<script src="../TestHarness/TestHarnessReport.js"></script>
</head>
<body>
	<div id="log"></div>
	<script type="module">
		import "./ColorTest.js"
		import "./StyleTest.js"
	</script>
</body>
</html>
```

