jQuery(function ($) {
	$('.example-container').comparisonViewer({
		leftHtml: '<div class="example-image"><img src="./example-image.jpg" alt="Normal Image" /></div>',
		rightHtml: '<div class="example-image gray"><img src="./example-image.jpg" alt="Grayed Image" /></div>',
		showLeftButton: true,
		showLeftButtonText: 'Show Before',
		showRightButton: true,
		showRightButtonText: 'Show After',
		showRevertButton: true
	});
});