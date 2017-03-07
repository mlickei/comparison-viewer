/**
 * Created by matthew on 3/2/17.
 */
(function($) {
	
	var $window = $(window);
	
	$.fn.comparisonViewer = function (options) {
		return this.each(function() {
			(new ComparisonViewer($(this), options)).init();
		});
	};

	var ComparisonViewer = function($target, options) {
		this.options = options;
		this.leftHtml = options.leftHtml;
		this.rightHtml = options.rightHtml;
		this.inited = false;
		this.TRANSITION_DURATION = 1000;
		this.viewerWidth = -1;
		this.$container = $target;
		this.currentLeft = -1;
		this.lastViewerWidth = -1;
	};

	ComparisonViewer.prototype.updateInnerViewsWidth = function() {
		var newWidth = this.$container.outerWidth();
		this.lastViewerWidth = this.viewerWidth > 0 ? this.viewerWidth : newWidth;
		this.viewerWidth = newWidth;
		this.$innerViews.css('width', newWidth);
	};

	ComparisonViewer.prototype.updateViewByDrag = function(left) {
		this.$leftView.css('right', this.viewerWidth - left);
		this.$rightView.css('left', left);
		this.currentLeft = left;
	};

	ComparisonViewer.prototype.updateOverlayWidths = function() {
		var ratio = this.currentLeft / this.lastViewerWidth;
		var newLeft = ratio * this.viewerWidth;
		this.updateViewByDrag(newLeft);
		this.$controlBar.css('left', newLeft);
	};

	ComparisonViewer.prototype.init = function() {
		var viewer = this;
		viewer.$viewer = $('<div class="comparison-viewer"><div class="left-view view"><div class="view-ctrl-bar"><div class="ctrl-circle"></div></div><div class="inner-view-wrapper"><div class="inner-view">' + this.leftHtml + '</div></div></div><div class="right-view view"><div class="inner-view-wrapper"><div class="inner-view">' + this.rightHtml + '</div></div></div></div>').appendTo(viewer.$container);
		viewer.$innerViews = this.$viewer.find('.inner-view');
		viewer.$leftView = this.$viewer.find('.left-view');
		viewer.$rightView = this.$viewer.find('.right-view');
		viewer.$controlBar = this.$viewer.find('.view-ctrl-bar');

		$window.on('resize', function() {
			viewer.updateInnerViewsWidth();
			if(viewer.$viewer.hasClass('position-set')) {
				viewer.updateOverlayWidths();
			}
			updateHeight();
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
		}).on('mouseleave', function() {
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
		}).on('mouseleave', function () {
			viewer.$viewer.removeClass('over-left').removeClass('over-right');

			mouseActionTimeout = setTimeout(function() {
				$views.removeClass('hover');
			}, viewer.TRANSITION_DURATION);
		});

		function buildDraggable() {
			viewer.draggable = viewer.$controlBar.draggable({
				axis: "x",
				containment: viewer.$viewer.get(0),
				drag: function(evt, ui) {
					viewer.updateViewByDrag(ui.position.left);
				},
				start: function() {
					if(!viewer.$viewer.hasClass('position-set')) {
						viewer.$viewer.addClass('position-set');
					}

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
			$.getScript('../libs/jquery-ui.min.js', function () {
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
