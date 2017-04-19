jQuery(function ($) {
	var $eventsLog = $('.events-box .logs');

	function addLog(message) {
		var newMessage = '<div class="log">'+ message +'</div>';
		$eventsLog.append($(newMessage));
	}

	var $viewer = $('.example-container').comparisonViewer({
		leftHtml: '<div class="red"><h2>Left Side</h2></div>',
		rightHtml: '<div class="blue"><h2>Right Side</h2></div>',
		showLeftButton: true,
		showLeftButtonText: 'Show Before',
		showRightButton: true,
		showRightButtonText: 'Show After',
		showRevertButton: true,
		revertButtonPlacement: 'inside'
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