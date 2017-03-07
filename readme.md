# Comparison Viewer
### Compare anything side by side using a sliding handle to see more or less of one side.

## Options
**transitionDuration:** *Optional `default 1000`* - Milliseconds that it'll take for transitions on the hover/over effects.

**leftHtml** *Required* - The html to display in the left side view.

**rightHtml** *Required* - The html to display in the right side view.

**helpText** *Optional `default 'Click and drag to interact with'`* - The help text message that appears when a user hovers over a side of the viewer. 

**showHelpText** *Optional `default true`* - Whether or not the help text should be added to the comparison viewer.

## Requirements & Recommendations
Required: jQuery UI 3.1.1 +

It is recommended to also use jQuery UI Touch Punch 0.2.3 + so that touch devices are supported.

Have jquery, jquery ui and jquery ui touch punch loaded (preferably in that order) before trying load the comparison viewer code.

## Examples
Basic Example:

HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<link rel="stylesheet" href="../src/comparison-viewer.css"/>
	<script type="text/javascript" src="../libs/jquery-3.1.1.min.js"></script>
	<script type="text/javascript" src="../libs/jquery-ui.min.js"></script>
	<script type="text/javascript" src="../libs/jquery.ui.touch-punch.min.js"></script>
	<script type="text/javascript" src="../src/comparison-viewer-src.js"></script>
</head>
<body>
<div class="heading"><h1>Example Comparison Viewer</h1></div>
<div class="center-wrapper">
	<div class="example-container"></div>
</div>
</body>
</html>
```

JavaScript
```javascript
jQuery(function ($) {
   	$('.example-container').comparisonViewer({
   		leftHtml: '<div class="red"><h2>RED SIDE</h2></div>',
   		rightHtml: '<div class="blue"><h2>BLUE SIDE</h2></div>'
   	});
});
```