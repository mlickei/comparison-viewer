(function($) {

	var $window = $(window);

	$.fn.comparisonViewer = function (options) {
		var finalOpts = $.extend(true, {
			transitionDuration: 1000,
			helpText: 'Click and drag to interact with.',
			showHelpText: true,
			showLeftButtonLabel: 'Show Left Side',
			showLeftButton: false,
			showRightButtonLabel: 'Show Right Side',
			showRightButton: false,
			revertButtonText: 'Revert',
			showRevertButton: false,
			revertButtonPlacement: 'outside', //Opts outside, inside
			leftRightButtonPlacement: 'outside'
			//TODO add options for the slider handle html
			//TODO add events/functions
		}, options);

		return this.each(function() {
			(new ComparisonViewer($(this), finalOpts)).init();
		});
	};

	var ComparisonViewer = function($target, options) {
		this.options = options;
		this.leftHtml = options.leftHtml;
		this.rightHtml = options.rightHtml;
		this.transitionDuration = options.transitionDuration;
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

	function setupBasicEventHandlers(viewer) {
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
			}, viewer.transitionDuration);
		});

		viewer.$controlBar.on('mouseenter', function() {
			//Let's leave our bar where it is so it's easier to grab.
			clearTimeout(mouseActionTimeout);
			viewer.$viewer.addClass(lastView);
		}).on('mouseleave', function () {
			viewer.$viewer.removeClass('over-left').removeClass('over-right').addClass(lastView);

			mouseActionTimeout = setTimeout(function() {
				$views.removeClass('hover');
			}, viewer.transitionDuration);
		});
	}

	function setupHelpText(viewer) {
		if(viewer.options.showHelpText) {
			viewer.$viewer.find('.inner-view-wrapper').append('<div class="hover-help-text">' + viewer.options.helpText + '</div>');
		}
	}

	function updateHeight(viewer) {
		viewer.$viewOverflowWrap.css('min-height', viewer.$innerViews.children().outerHeight());
	}

	function revert(viewer) {
		viewer.$viewer.removeClass('position-set no-hover-effect');
		viewer.$leftView.css('right', '');
		viewer.$rightView.css('left', '');
	}

	function makeGeneralActionsContainer(viewer, $target, useAppend) {
		if(useAppend) {
			return $('<div class="comparison-viewer-actions"></div>').appendTo($target);
		} else {
			return $('<div class="comparison-viewer-actions"></div>').prependTo($target);
		}
	}

	function setupButtons(viewer) {
		var $generalActionsContainer;

		if(viewer.options.showRevertButton) {
			if(typeof $generalActionsContainer === 'undefined' || !$generalActionsContainer.length) {
				$generalActionsContainer = makeGeneralActionsContainer(viewer, viewer.$viewer, false)
					.addClass(viewer.options.revertButtonPlacement + '-main-actions main-btn-actions');
			}

			$('<button class="comparison-viewer-btn revert-btn">' + viewer.options.revertButtonText + '</button>')
				.appendTo($generalActionsContainer)
				.on('click', function () {
					revert(viewer);
				});
		}


		var bottomActionsContainer = makeGeneralActionsContainer(viewer, viewer.$viewer, true)
			.addClass('left-right-actions');

		if(viewer.options.showLeftButton) {
			var $bar = $('<button class="comparison-viewer-btn show-left-btn">' + viewer.options.showLeftButtonLabel + '</button>')
				.on('click', function () {
					viewer.$viewer.addClass('no-hover-effect').removeClass('position-set');
					viewer.$leftView.css('right', 0);
					viewer.$rightView.css('left', 0);
				});

			if(viewer.options.leftRightButtonPlacement == 'outside') {
				$bar.appendTo(bottomActionsContainer);
			} else if(viewer.options.leftRightButtonPlacement == 'inside') {
				$bar.appendTo(makeGeneralActionsContainer(viewer, viewer.$leftView, true));
			}
		}

		if(viewer.options.showRightButton) {
			var $bar = $('<button class="comparison-viewer-btn show-right-btn">' + viewer.options.showRightButtonLabel + '</button>')
				.on('click', function () {
					viewer.$viewer.addClass('no-hover-effect').removeClass('position-set');
					viewer.$leftView.css('right', '100%');
					viewer.$rightView.css('left', 0);
				});

			if(viewer.options.leftRightButtonPlacement == 'outside') {
				$bar.appendTo(bottomActionsContainer);
			} else if(viewer.options.leftRightButtonPlacement == 'inside') {
				$bar.appendTo(makeGeneralActionsContainer(viewer, viewer.$rightView, true));
			}
		}
	}

	ComparisonViewer.prototype.init = function() {
		var viewer = this;
		viewer.$viewer = $('<div class="comparison-viewer"><div class="comparison-viewer-overflow-wrap"><div class="left-view view"><div class="view-ctrl-bar"><div class="ctrl-circle"></div></div><div class="inner-view-wrapper"><div class="inner-view">' + this.leftHtml + '</div></div></div><div class="right-view view"><div class="inner-view-wrapper"><div class="inner-view">' + this.rightHtml + '</div></div></div></div></div>').appendTo(viewer.$container);
		viewer.$viewOverflowWrap = this.$viewer.find('.comparison-viewer-overflow-wrap');
		viewer.$innerViews = this.$viewer.find('.inner-view');
		viewer.$leftView = this.$viewer.find('.left-view');
		viewer.$rightView = this.$viewer.find('.right-view');
		viewer.$controlBar = this.$viewer.find('.view-ctrl-bar');

		$window.on('resize', function() {
			viewer.updateInnerViewsWidth();
			if(viewer.$viewer.hasClass('position-set')) {
				viewer.updateOverlayWidths();
			}
			updateHeight(viewer);
		});

		setupBasicEventHandlers(viewer);
		setupHelpText(viewer);
		setupButtons(viewer);

		function buildDraggable() {
			viewer.draggable = viewer.$controlBar.draggable({
				axis: "x",
				containment: viewer.$viewer.get(0),
				cursorAt: {
					left: 36
				},
				drag: function (evt, ui) {
					viewer.updateViewByDrag(ui.position.left);
				},
				start: function () {
					if (!viewer.$viewer.hasClass('position-set')) {
						viewer.$viewer.addClass('position-set');
					}

					viewer.$viewer.addClass('dragging').removeClass('over-left').removeClass('over-right');
					viewer.$viewer.find('.view').removeClass('hover');
				},
				stop: function () {
					viewer.$viewer.removeClass('dragging');
				}
			});
		}

		//Try to load the jquery ui script for dragging.
		if (typeof jQuery.ui === 'undefined') {
			console.error("jQuery UI Required to function");
		} else {
			buildDraggable();
		}

		//This could probably go on for an infinite amount of time, but let's not
		setTimeout(function () {
			viewer.updateInnerViewsWidth();
			updateHeight(viewer);
			viewer.updateInnerViewsWidth();
			updateHeight(viewer);
		}, 250);

		viewer.inited = true;
	};

} (jQuery));
