(function ($) {
	"use strict";

	if (!$) {
		return;
	}

	const gsap = window.gsap;
	const hasGsap = typeof gsap !== "undefined";
	const windowOn = $(window);
	const isRTL = document.documentElement.dir === "rtl";
	const ScrollTrigger = window.ScrollTrigger;
	const ScrollSmoother = window.ScrollSmoother;
	const ScrollToPlugin = window.ScrollToPlugin;
	const SplitText = window.SplitText;
	const arabicTextPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

	const registerGsapPlugins = function () {
		if (!hasGsap) {
			return;
		}

		const plugins = Array.prototype.slice.call(arguments).filter(Boolean);

		if (plugins.length) {
			gsap.registerPlugin.apply(gsap, plugins);
		}
	};

	const resolveDirectionalOffset = function (direction, offset) {
		const normalizedOffset = parseFloat(offset) || 0;

		if (direction === "left") {
			return isRTL ? normalizedOffset : -normalizedOffset;
		}

		if (direction === "right") {
			return isRTL ? -normalizedOffset : normalizedOffset;
		}

		return 0;
	};

	const shouldUseWordLevelSplit = function (element) {
		return !!(isRTL && element && arabicTextPattern.test(element.textContent || ""));
	};

	windowOn.on("load", function () {
		const body = $("body");

		body.addClass("loaded");
		setTimeout(function () {
			body.removeClass("loaded");
		}, 1500);
	});

	document.addEventListener("DOMContentLoaded", function () {
		const svg = document.getElementById("svg");

		if (!hasGsap || !svg) {
			return;
		}

		const timeline = gsap.timeline();
		const curve = "M0 502S175 272 500 272s500 230 500 230V0H0Z";
		const flat = "M0 2S175 1 500 1s500 1 500 1V0H0Z";
		const preHeader = document.querySelector(".pre-header");
		const preHeaderContainer = preHeader ? preHeader.querySelector(".containers") : null;

		if (document.querySelector(".loader-wrap-heading")) {
			timeline.to(".loader-wrap-heading .load-text, .loader-wrap-heading .cont", {
				delay: 0.5,
				y: -100,
				opacity: 0
			});
		}

		timeline.to(svg, {
			duration: 0.5,
			attr: { d: curve },
			ease: "power2.in"
		}).to(svg, {
			duration: 0.5,
			attr: { d: flat },
			ease: "power2.out"
		});

		if (document.querySelector(".loader-wrap")) {
			timeline.to(".loader-wrap", {
				y: -1500
			}).to(".loader-wrap", {
				zIndex: -1,
				display: "none"
			});
		}

		if (preHeader) {
			timeline.from(preHeader, { y: 200 }, "-=1.5");
		}

		if (preHeaderContainer) {
			timeline.from(preHeaderContainer, {
				y: 40,
				opacity: 0,
				delay: 0.1
			}, "-=1.5");
		}
	});

	const initNiceSelect = function () {
		if ($.fn.niceSelect && $(".tp-select").length) {
			$(".tp-select").niceSelect();
		}
	};

	const initMobileMenu = function () {
		const $menuSource = $(".tp-mobile-menu-active > ul").first();
		const $sideMenu = $(".tp-offcanvas-menu nav");

		if (!$menuSource.length || !$sideMenu.length) {
			return;
		}

		$sideMenu.append($menuSource.clone());

		if ($($sideMenu).find(".tp-submenu, .mega-menu").length !== 0) {
			$($sideMenu).find(".tp-submenu, .mega-menu").parent().append(
				'<button class="tp-menu-close"><i class="far fa-chevron-' + (isRTL ? "left" : "right") + '"></i></button>'
			);
		}

		const $sideMenuList = $(".tp-offcanvas-menu nav > ul > li button.tp-menu-close, .tp-offcanvas-menu nav > ul li.has-dropdown > a, .tp-offcanvas-menu nav > ul li.has-dropdown > ul > li.menu-item-has-children > a");
		$($sideMenuList).on("click", function (event) {
			const $trigger = $(this);
			const $parent = $trigger.parent();
			const $submenu = $trigger.siblings(".tp-submenu, .mega-menu");

			event.preventDefault();
			if (!$parent.hasClass("active")) {
				$parent.addClass("active");
				$submenu.slideDown();
			} else {
				$submenu.slideUp();
				$parent.removeClass("active");
			}
		});

		$(".tp-offcanvas-2-area .tp-offcanvas-menu > nav > ul > li").on("mouseenter", function () {
			$(this).addClass("is-active").siblings().removeClass("is-active");
		}).on("mouseleave", function () {
			$(this).siblings().addClass("is-active");
		});
	};

	const initStickyHeader = function () {
		$(window).on("scroll", function () {
			const scroll = $(window).scrollTop();
			if (scroll < 20) {
				$("#header-sticky").removeClass("header-sticky");
			} else {
				$("#header-sticky").addClass("header-sticky");
			}
		});
	};

	const initOffcanvas = function () {
		$(".tp-menu-bar").on("click", function () {
			$(".tp-offcanvas").addClass("opened");
			$(".body-overlay").addClass("apply");
		});

		$(".close-btn").on("click", function () {
			$(".tp-offcanvas").removeClass("opened");
			$(".body-overlay").removeClass("apply");
		});

		$(".body-overlay").on("click", function () {
			$(".tp-offcanvas").removeClass("opened");
			$(".body-overlay").removeClass("apply");
		});

		$(".tp-offcanvas-open-btn").on("click", function () {
			$(".tp-offcanvas-2-area, .body-overlay").addClass("opened");
		});

		$(".tp-offcanvas-open-btn").on("click", function () {
			const hasOffcanvas2 = $(".tp-offcanvas-2-area").length;
			$(".body-overlay").toggleClass("opened", !hasOffcanvas2);
		});

		$(".cartmini-open-btn").on("click", function () {
			$(".cartmini__area").addClass("cartmini-opened");
			$(".body-overlay").addClass("apply");
		});

		$(".cartmini-close-btn").on("click", function () {
			$(".cartmini__area").removeClass("apply cartmini-opened");
			$(".body-overlay").removeClass("apply");
		});

		$(".cartmini-close-btn, .body-overlay, .tp-offcanvas-2-close-btn").on("click", function () {
			$(".tp-search-area, .cartmini__area, .tp-offcanvas-2-area").removeClass("opened cartmini-opened");
			$(".body-overlay").removeClass("opened");
		});
	};

	const initSearch = function () {
		$(".tp-search-click").on("click", function () {
			$(".tp-search-form-toggle, .tp-search-body-overlay").addClass("active");
		});

		$(".tp-search-close, .tp-search-body-overlay").on("click", function () {
			$(".tp-search-form-toggle, .tp-search-body-overlay").removeClass("active");
		});
	};

	const initCommonAttributes = function () {
		$("[data-background]").each(function () {
			$(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
		});

		$("[data-width]").each(function () {
			$(this).css("width", $(this).attr("data-width"));
		});

		$("[data-bg-color]").each(function () {
			$(this).css("background-color", $(this).attr("data-bg-color"));
		});
	};

	const initSmoothScroll = function () {
		if (!hasGsap || !ScrollTrigger || !ScrollSmoother || !ScrollToPlugin) {
			return;
		}

		if (!$("#smooth-wrapper").length || !$("#smooth-content").length) {
			return;
		}

		registerGsapPlugins(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

		ScrollSmoother.create({
			smooth: 1.35,
			effects: true,
			smoothTouch: 0.1,
			ignoreMobileResize: false
		});

		ScrollTrigger.refresh(true);
	};

	const initPureCounter = function () {
		if (typeof window.PureCounter === "function" && document.querySelector(".purecounter")) {
			new window.PureCounter();
		}
	};

	const initFadeAnimations = function () {
		if (!hasGsap || !ScrollTrigger || !document.querySelector(".tp_fade_anim")) {
			return;
		}

		registerGsapPlugins(ScrollTrigger);

		gsap.utils.toArray(".tp_fade_anim").forEach(function (item) {
			const fadeOffset = item.getAttribute("data-fade-offset") || 40;
			const duration = item.getAttribute("data-duration") || 0.75;
			const fadeDirection = item.getAttribute("data-fade-from") || "bottom";
			const onScroll = item.getAttribute("data-on-scroll") || 1;
			const delay = item.getAttribute("data-delay") || 0.15;
			const ease = item.getAttribute("data-ease") || "power2.out";
			const animation = {
				opacity: 0,
				ease: ease,
				duration: duration,
				delay: delay,
				x: resolveDirectionalOffset(fadeDirection, fadeOffset),
				y: fadeDirection === "top" ? -fadeOffset : (fadeDirection === "bottom" ? fadeOffset : 0)
			};

			if (Number(onScroll) === 1) {
				animation.scrollTrigger = {
					trigger: item,
					start: "top 85%"
				};
			}

			gsap.from(item, animation);
		});
	};

	const initTextReveal = function () {
		if (!hasGsap || !ScrollTrigger || !SplitText || !document.querySelector(".tp-text-revel-anim")) {
			return;
		}

		registerGsapPlugins(ScrollTrigger);

		document.querySelectorAll(".tp-text-revel-anim").forEach(function (element) {
			const duration = Number(element.getAttribute("data-duration") || 1);
			const onScroll = Number(element.getAttribute("data-on-scroll") || 1);
			const stagger = Number(element.getAttribute("data-stagger") || 0.02);
			const delay = Number(element.getAttribute("data-delay") || 0.08);
			const ease = element.getAttribute("data-ease") || "circ.out";
			const useWordLevelSplit = shouldUseWordLevelSplit(element);
			const split = new SplitText(element, {
				type: useWordLevelSplit ? "lines,words" : "lines,words,chars",
				linesClass: "tp-revel-line"
			});
			const targets = useWordLevelSplit ? split.words : split.chars;
			const animation = {
				duration: duration,
				delay: delay,
				ease: ease,
				y: 40,
				stagger: stagger,
				opacity: 0
			};

			if (onScroll === 1) {
				animation.scrollTrigger = {
					trigger: element,
					start: "top 85%"
				};
			}

			gsap.from(targets, animation);
		});
	};

	const initServicesHover = function () {
		$(".ar-service-item").on("mouseenter", function () {
			$(this).addClass("active").siblings(".ar-service-item").removeClass("active");
		});
	};

	const initScrollImage = function () {
		if (!hasGsap || !ScrollTrigger || !document.querySelector(".ar-scroll-image") || !document.querySelector(".ar-banner-shape")) {
			return;
		}

		registerGsapPlugins(ScrollTrigger);

		gsap.to(".ar-scroll-image", {
			xPercent: isRTL ? 10 : -10,
			scrollTrigger: {
				trigger: ".ar-banner-shape",
				start: "top bottom",
				end: "bottom top",
				scrub: true
			}
		});
	};

	const initPortfolioItems = function () {
		if (!hasGsap || !ScrollTrigger || !document.querySelector(".portfolio__item")) {
			return;
		}

		registerGsapPlugins(ScrollTrigger);

		gsap.utils.toArray(".portfolio__item").forEach(function (portfolio) {
			gsap.set(portfolio, {
				opacity: 0.7,
				transform: "perspective(4000px) translate3d(0px, 0px, 0px) rotateX(90deg) scale(0.5, 0.5)"
			});

			const timeline = gsap.timeline();
			timeline.set(portfolio, { position: "relative" });
			timeline.to(portfolio, {
				scrollTrigger: {
					trigger: portfolio,
					scrub: 2,
					start: "top bottom+=100",
					end: "bottom center",
					markers: false
				},
				scale: 1,
				rotateX: 0,
				opacity: 1,
				duration: 1.5
			});
		});
	};

	const initPortfolioPin = function () {
		if (!hasGsap || !ScrollTrigger || !document.querySelector(".cnt-portfolio-ptb")) {
			return;
		}

		registerGsapPlugins(ScrollTrigger);

		const setupPins = function () {
			const baseOptions = {
				scrub: 1,
				start: "top 0%",
				end: "bottom 80%",
				endTrigger: ".cnt-portfolio-ptb",
				pinSpacing: false,
				markers: false
			};

			document.querySelectorAll(".cnt-portfolio-video-wrapper").forEach(function (item) {
				gsap.to(item, {
					scrollTrigger: Object.assign({
						trigger: item,
						pin: item
					}, baseOptions)
				});
			});

			document.querySelectorAll(".cnt-portfolio-video-card").forEach(function (card, index) {
				gsap.to(card, {
					rotate: index % 2 === 0 ? -5 : 5,
					scrollTrigger: Object.assign({
						trigger: card,
						pin: card,
						start: "top 10%",
						end: "bottom 110%"
					}, baseOptions)
				});
			});
		};

		if (typeof gsap.matchMedia === "function") {
			const media = gsap.matchMedia();
			media.add("(min-width: 992px)", setupPins);
			return;
		}

		if (window.innerWidth >= 992) {
			setupPins();
		}
	};

	initNiceSelect();
	initMobileMenu();
	initStickyHeader();
	initOffcanvas();
	initSearch();
	initCommonAttributes();
	initSmoothScroll();
	initPureCounter();
	initFadeAnimations();
	initTextReveal();
	initServicesHover();
	initScrollImage();
	initPortfolioItems();
	initPortfolioPin();

})(jQuery);
