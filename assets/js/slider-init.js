(function ($) {
	"use strict";

	if (!$ || typeof window.Swiper === "undefined") {
		return;
	}

	const isRTL = document.documentElement.dir === "rtl";

	document.querySelectorAll(".swiper, .swiper-container").forEach(function (sliderElement) {
		sliderElement.setAttribute("dir", isRTL ? "rtl" : "ltr");
	});

	const createNumberedPagination = function () {
		return {
			el: "#paginations",
			type: "custom",
			renderCustom: function (swiper, current, total) {
				const zero = total > 9 ? "" : "0";

				return (
					'<div class="shop-slider-pagination">' +
						"<span>" + zero + current + "</span>" +
						"<span>" + zero + total + "</span>" +
					"</div>"
				);
			}
		};
	};

	const initSwiper = function (selector, config, onInit) {
		if (!document.querySelector(selector)) {
			return null;
		}

		const instance = new window.Swiper(selector, config);

		if (typeof onInit === "function") {
			onInit(instance);
		}

		return instance;
	};

	const initBrandTicker = function () {
		const container = document.querySelector(".tp-brand-active");

		if (!container) {
			return;
		}

		const wrapper = container.querySelector(".swiper-wrapper");

		if (!wrapper) {
			return;
		}

		const resetClones = function () {
			wrapper.querySelectorAll(".tp-brand-clone").forEach(function (clone) {
				clone.remove();
			});
		};

		const measureTrackWidth = function (slides) {
			if (!slides.length) {
				return 0;
			}

			const firstSlide = slides[0];
			const lastSlide = slides[slides.length - 1];
			const wrapperStyles = window.getComputedStyle(wrapper);
			const wrapperGap = parseFloat(wrapperStyles.columnGap || wrapperStyles.gap || "0") || 0;
			return (lastSlide.offsetLeft + lastSlide.offsetWidth + wrapperGap) - firstSlide.offsetLeft;
		};

		let frameId = 0;
		let resizeTimer = 0;
		let currentOffset = 0;
		let loopWidth = 0;
		let lastTimestamp = 0;

		const stopTicker = function () {
			if (frameId) {
				window.cancelAnimationFrame(frameId);
				frameId = 0;
			}
		};

		const tick = function (timestamp) {
			if (!lastTimestamp) {
				lastTimestamp = timestamp;
			}

			const delta = timestamp - lastTimestamp;
			lastTimestamp = timestamp;
			currentOffset -= delta * 0.08;

			if (loopWidth > 0 && Math.abs(currentOffset) >= loopWidth) {
				currentOffset += loopWidth;
			}

			wrapper.style.transform = "translate3d(" + currentOffset + "px, 0, 0)";
			frameId = window.requestAnimationFrame(tick);
		};

		const buildTicker = function () {
			stopTicker();
			resetClones();

			wrapper.style.transitionDuration = "0ms";
			wrapper.style.transitionTimingFunction = "linear";
			wrapper.style.willChange = "transform";
			wrapper.style.transform = "translate3d(0px, 0, 0)";

			const originalSlides = Array.from(wrapper.children).filter(function (slide) {
				return !slide.classList.contains("tp-brand-clone");
			});

			if (!originalSlides.length) {
				return;
			}

			let sequenceWidth = measureTrackWidth(originalSlides);
			const containerWidth = container.getBoundingClientRect().width;

			if (!sequenceWidth || !containerWidth) {
				return;
			}

			while (wrapper.scrollWidth < containerWidth + sequenceWidth) {
				originalSlides.forEach(function (slide) {
					const clone = slide.cloneNode(true);
					clone.classList.add("tp-brand-clone");
					wrapper.appendChild(clone);
				});
			}

			originalSlides.forEach(function (slide) {
				const clone = slide.cloneNode(true);
				clone.classList.add("tp-brand-clone");
				wrapper.appendChild(clone);
			});

			loopWidth = sequenceWidth;
			currentOffset = 0;
			lastTimestamp = 0;
			wrapper.style.transform = "translate3d(0px, 0, 0)";
			frameId = window.requestAnimationFrame(tick);
		};

		buildTicker();

		if (document.fonts && typeof document.fonts.ready === "object") {
			document.fonts.ready.then(buildTicker).catch(function () {
				buildTicker();
			});
		}

		window.addEventListener("load", buildTicker);

		window.addEventListener("resize", function () {
			window.clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(buildTicker, 120);
		});
	};

	initSwiper(".tp-text-slider-active", {
		loop: true,
		freeMode: true,
		slidesPerView: "auto",
		spaceBetween: 0,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 8000,
		autoplay: {
			delay: 1,
			disableOnInteraction: true
		}
	});

	initSwiper(".tp-service-cst-slider", {
		slidesPerView: 6,
		loop: true,
		autoplay: false,
		grabCursor: true,
		spaceBetween: 27,
		navigation: {
			nextEl: ".tp-service-cst-button-next",
			prevEl: ".tp-service-cst-button-prev"
		},
		breakpoints: {
			1200: {
				slidesPerView: 3
			},
			992: {
				slidesPerView: 2
			},
			768: {
				slidesPerView: 1
			},
			576: {
				slidesPerView: 1
			},
			0: {
				slidesPerView: 1
			}
		},
		a11y: false
	});

	initSwiper(".ar-testimonial-active", {
		slidesPerView: 1,
		loop: true,
		autoplay: true,
		spaceBetween: 0,
		speed: 1000,
		navigation: {
			prevEl: ".ar-testimonial-prev",
			nextEl: ".ar-testimonial-next"
		},
		pagination: createNumberedPagination()
	});

	initSwiper(".crp-text-slider-active", {
		loop: true,
		freeMode: true,
		slidesPerView: "auto",
		spaceBetween: 40,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 8000,
		autoplay: {
			delay: 1,
			disableOnInteraction: true
		}
	});

	initSwiper(".ar-brand-active", {
		loop: true,
		freeMode: true,
		slidesPerView: "auto",
		spaceBetween: 165,
		centeredSlides: true,
		allowTouchMove: false,
		speed: 2000,
		autoplay: {
			delay: 1,
			disableOnInteraction: true
		}
	});

	initBrandTicker();

})(jQuery);
