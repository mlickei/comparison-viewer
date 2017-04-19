# Comparison Viewer
### Compare anything side by side using a sliding handle to see more or less of one side.

## Table of Contents

[Options](#options)

[Events](#events)

[Requirements & Recommendations](#requirements--recommendations)

[Examples](#examples)

## Options
**transitionDuration:** *Optional `default 1000`* - Milliseconds that it'll take for transitions on the hover/over effects.

**leftHtml** *Required* - The html to display in the left side view.

**rightHtml** *Required* - The html to display in the right side view.

**helpText** *Optional `default 'Click and drag to interact with'`* - The help text message that appears when a user hovers over a side of the viewer. 

**showHelpText** *Optional `default true`* - Whether or not the help text should be added to the comparison viewer.

TODO: Update with all new options

## Events
To get events triggered by ComparisonViewer, simple attach an event listener to your comparison viewer target.

Example:
```javascript
jQuery(function ($) {
	var $viewer = $('.example-container').comparisonViewer({
		leftHtml: '<div class="red"><h2>Left Side</h2></div>',
		rightHtml: '<div class="blue"><h2>Right Side</h2></div>'
	}).on('cv_drag', function() {
		addLog("Drag event has occurred.");
	}).on('cv_revert', function() {
		addLog("Revert button pressed.");
	}).on('cv_show_left', function() {
		addLog("Show left button pressed.");
	}).on('cv_show_right', function() {
		addLog("Show right button pressed.");
	});
});
```
#### Events Triggered:

**cv_drag** - Occurs when the control bar is dragged.

**cv_revert** - Occurs when the revert button is triggered.

**cv_show_left** - Occurs when the show left button is triggered.

**cv_show_right** - Occurs when the show right button is triggered.

TODO include info about data passed along.

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