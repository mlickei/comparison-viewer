/**
 * Created by matthew on 3/2/17.
 */
(function($) {
	$.fn.comparisonViewer = function (options) {
		this.each(function() {
			var cv = new ComparisonViewer($(this), options);
			cv.init();
		});

		return this;
	};

	var ComparisonViewer = function($target, options) {
		this.options = options;
		this.leftHtml = options.leftHtml;
		this.rightHtml = options.rightHtml;
		this.inited = false;
		this.TRANSITION_DURATION = 1000;
		this.viewerWidth = -1;
		this.$container = $target;
	};

	ComparisonViewer.prototype.updateInnerViewsWidth = function() {
		var newWidth = this.$container.outerWidth();
		this.viewerWidth = newWidth;
		this.$innerViews.css('width', newWidth);
	};

	ComparisonViewer.prototype.updateViewByDrag = function(left) {
		this.$leftView.css('right', this.viewerWidth - left);
		this.$rightView.css('left', left);
	};

	ComparisonViewer.prototype.init = function() {
		var viewer = this;
		viewer.$viewer = $('<div class="comparison-viewer"><div class="left-view view"><div class="view-ctrl-bar"><div class="ctrl-circle"></div></div><div class="inner-view-wrapper"><div class="inner-view">' + this.leftHtml + '</div></div></div><div class="right-view view"><div class="inner-view-wrapper"><div class="inner-view">' + this.rightHtml + '</div></div></div></div>').appendTo(viewer.$container);
		viewer.$innerViews = this.$viewer.find('.inner-view');
		viewer.$leftView = this.$viewer.find('.left-view');
		viewer.$rightView = this.$viewer.find('.right-view');
		viewer.$controlBar = this.$viewer.find('.view-ctrl-bar');

		var RESIZE_THROTTLE = 250,
			resizeTimeout;

		$(window).on('resize', function() {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(function () {
				viewer.updateInnerViewsWidth();
				updateHeight();
			}, RESIZE_THROTTLE);
		});

		var mouseActionTimeout,
			lastView,
			$views = viewer.$viewer.find('.view');

		$views.on('mouseenter', function() {
			var $view = $(this);
			clearTimeout(mouseActionTimeout);
			$views.removeClass('hover');
			$view.addClass('hover');

			if($view.hasClass('left-view')) {
				lastView = 'over-left';
				viewer.$viewer.addClass('over-left');
			} else {
				lastView = 'over-right';
				viewer.$viewer.addClass('over-right');
			}
		});

		$views.on('mouseleave', function() {
			var $view = $(this);
			viewer.$viewer.removeClass('over-left').removeClass('over-right');
			clearTimeout(mouseActionTimeout);

			mouseActionTimeout = setTimeout(function() {
				$view.removeClass('hover');
			}, viewer.TRANSITION_DURATION);
		});

		viewer.$controlBar.on('mouseenter', function() {
			//Let's leave our bar where it is so it's easier to grab.
			clearTimeout(mouseActionTimeout);
			viewer.$viewer.addClass(lastView);
		});

		viewer.$controlBar.on('mouseleave', function () {
			viewer.$viewer.removeClass('over-left').removeClass('over-right');

			mouseActionTimeout = setTimeout(function() {
				$views.removeClass('hover');
			}, viewer.TRANSITION_DURATION);
		});

		function buildDraggable() {

			viewer.$controlBar.draggable({
				axis: "x",
				containment: viewer.$viewer.get(0),
				drag: function(evt, ui) {
					viewer.updateViewByDrag(ui.position.left);
				},
				start: function() {
					viewer.$viewer.addClass('dragging').removeClass('over-left').removeClass('over-right');
					$views.removeClass('hover');
				},
				stop: function() {
					viewer.$viewer.removeClass('dragging');
				}
			});
		}

		function updateHeight() {
			viewer.$viewer.css('min-height', viewer.$innerViews.children().outerHeight());
		}

		//Try to load the jquery ui script for dragging.
		if (typeof jQuery.ui === 'undefined') {
			$.getScript('https://cdn2.hubspot.net/hubfs/224752/assets/javascript/2017%20Design/jquery-ui.min.js', function () {
				buildDraggable();
			});
		} else {
			buildDraggable();
		}

		viewer.updateInnerViewsWidth();
		updateHeight();

		viewer.inited = true;
	};

} (jQuery));