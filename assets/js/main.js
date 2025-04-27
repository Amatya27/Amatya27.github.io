
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function() {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function() {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
				if (browser.name == 'ie'			// IE
				||	browser.name == 'edge'			// Edge
				||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				||	browser.mobile)					// Mobile devices
					off();

			// Enable everywhere else.
				else {

					breakpoints.on('>large', on);
					breakpoints.on('<=large', off);

				}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

	// Background.
		$wrapper._parallax(0.925);

	// Nav Panel.

		// Toggle.
			$navPanelToggle = $(
				'<a href="#navPanel" id="navPanelToggle">Menu</a>'
			)
				.appendTo($wrapper);

			// Change toggle styling once we've scrolled past the header.
				$header.scrollex({
					bottom: '5vh',
					enter: function() {
						$navPanelToggle.removeClass('alt');
					},
					leave: function() {
						$navPanelToggle.addClass('alt');
					}
				});

		// Panel.
			$navPanel = $(
				'<div id="navPanel">' +
					'<nav>' +
					'</nav>' +
					'<a href="#navPanel" class="close"></a>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'is-navPanel-visible'
				});

			// Get inner.
				$navPanelInner = $navPanel.children('nav');

			// Move nav content on breakpoint change.
				var $navContent = $nav.children();

				breakpoints.on('>medium', function() {

					// NavPanel -> Nav.
						$navContent.appendTo($nav);

					// Flip icon classes.
						$nav.find('.icons, .icon')
							.removeClass('alt');

				});

				breakpoints.on('<=medium', function() {

					// Nav -> NavPanel.
						$navContent.appendTo($navPanelInner);

					// Flip icon classes.
						$navPanelInner.find('.icons, .icon')
							.addClass('alt');

				});

			// Hack: Disable transitions on WP.
				if (browser.os == 'wp'
				&&	browser.osVersion < 10)
					$navPanel
						.css('transition', 'none');

	// Intro.
		var $intro = $('#intro');

		if ($intro.length > 0) {

			// Hack: Fix flex min-height on IE.
				if (browser.name == 'ie') {
					$window.on('resize.ie-intro-fix', function() {

						var h = $intro.height();

						if (h > $window.height())
							$intro.css('height', 'auto');
						else
							$intro.css('height', h);

					}).trigger('resize.ie-intro-fix');
				}

			// Hide intro on scroll (> small).
				breakpoints.on('>small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'bottom',
						top: '25vh',
						bottom: '-50vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

				});

			// Hide intro on scroll (<= small).
				breakpoints.on('<=small', function() {

					$main.unscrollex();

					$main.scrollex({
						mode: 'middle',
						top: '15vh',
						bottom: '-15vh',
						enter: function() {
							$intro.addClass('hidden');
						},
						leave: function() {
							$intro.removeClass('hidden');
						}
					});

			});

		}

		// Back to top button logic
$(window).scroll(function() {
	if ($(this).scrollTop() > 200) {
	  $('.back-to-top').fadeIn();
	} else {
	  $('.back-to-top').fadeOut();
	}
  });
  
  // Dark mode toggle with localStorage memory
  document.addEventListener('DOMContentLoaded', function () {
	const sec = document.querySelector('.sec');
	const toggle = document.querySelector('.toggle');
	const currentTheme = localStorage.getItem('theme');
  
	if (currentTheme === 'dark') {
	  sec.classList.add('dark');
	}
  
	toggle.onclick = function () {
	  sec.classList.toggle('dark');
	  let theme = 'light';
	  if (sec.classList.contains('dark')) {
		theme = 'dark';
	  }
	  localStorage.setItem('theme', theme);
	}
  });
  
// Enhanced slideshow with controls & captions (now supports multiple containers)
document.addEventListener('DOMContentLoaded', () => {
	// Find all slideshow blocks
	document
	  .querySelectorAll('.slideshow-container')
	  .forEach(container => {
		const slides    = container.querySelectorAll('.slideshow img');
		const caption   = container.querySelector('.caption');
		const nextBtn   = container.querySelector('button.next');
		const prevBtn   = container.querySelector('button.prev');
		const pauseBtn  = container.querySelector('button.pause');
		let   current   = 0;
		let   playing   = true;
		let   timer;
  
		// Seed captions from alt text
		slides.forEach(img => {
		  img.dataset.caption = img.alt;
		});
  
		// Show slide at index
		function showSlide(idx) {
		  slides[current].classList.remove('active');
		  current = (idx + slides.length) % slides.length;
		  slides[current].classList.add('active');
		  caption.textContent = slides[current].dataset.caption;
		}
  
		function nextSlide() { showSlide(current + 1); }
		function prevSlide() { showSlide(current - 1); }
  
		// Play / Pause toggle
		function togglePlay() {
		  if (playing) {
			clearInterval(timer);
			pauseBtn.textContent = '▶';
		  } else {
			timer = setInterval(nextSlide, 4000);
			pauseBtn.textContent = '❚❚';
		  }
		  playing = !playing;
		}
  
		// Wire up buttons
		nextBtn.addEventListener('click', () => {
		  nextSlide();
		  if (playing) { clearInterval(timer); timer = setInterval(nextSlide, 4000); }
		});
		prevBtn.addEventListener('click', () => {
		  prevSlide();
		  if (playing) { clearInterval(timer); timer = setInterval(nextSlide, 4000); }
		});
		pauseBtn.addEventListener('click', togglePlay);
  
		// Start it
		showSlide(current);
		timer = setInterval(nextSlide, 4000);
	  });
  });
  
  // Simple auto-slideshow for elements with class simple-slideshow
document.addEventListener('DOMContentLoaded', () => {
	const simpleSlideshows = document.querySelectorAll('.simple-slideshow');
  
	simpleSlideshows.forEach(container => {
	  const slides = container.querySelectorAll('img');
	  let current = 0;
  
	  function showSlide(idx) {
		slides[current].classList.remove('active');
		current = (idx + slides.length) % slides.length;
		slides[current].classList.add('active');
	  }
  
	  setInterval(() => {
		showSlide(current + 1);
	  }, 4000); // Change slide every 4 seconds
	});
  });
  

})(jQuery);