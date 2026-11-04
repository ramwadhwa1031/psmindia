/**
 * PS MESSAGE INDIA — Bidirectional Scroll Animations (animations.js)
 * Works smoothly when scrolling BOTH DOWN and UP.
 * Never leaves elements permanently hidden if libraries fail to load.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    var revealElements = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
    if (!revealElements.length) return;

    // Enable CSS animation states only after JS confirms readiness
    document.documentElement.classList.add('js-anim-ready');

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          } else {
            // Reversible on both scroll-down and scroll-up outside viewport
            entry.target.classList.remove('is-inview');
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -6% 0px',
        threshold: 0.08
      });

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback for older browsers: ensure all elements are visible
      revealElements.forEach(function (el) {
        el.classList.add('is-inview');
      });
    }

    // Optional GSAP subtle enhancement if GSAP is loaded
    if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
      try {
        window.gsap.registerPlugin(window.ScrollTrigger);
        window.addEventListener('resize', function () {
          window.ScrollTrigger.refresh();
        });
      } catch (err) {
        // Fallback gracefully to IntersectionObserver
      }
    }
  });
})();

