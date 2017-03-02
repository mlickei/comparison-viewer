/**
 * Created by matthew on 3/2/17.
 */
jQuery(function ($) {
	$('.example-container').comparisonViewer({
		leftHtml: '<div class="red"><h2>RED SIDE</h2></div>',
		rightHtml: '<div class="blue"><h2>BLUE SIDE</h2></div>'
	});
});