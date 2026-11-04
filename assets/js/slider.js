/**
 * PS MESSAGE INDIA — Modern 2026 Hero Slider Controller (slider.js)
 * Features:
 * - 4-slide immersive 3D perspective crossfade & directional transitions
 * - Interactive 3D mouse-tilt parallax on active visual showcase
 * - Floating particle canvas background for depth
 * - Live progress bar sync, pause on hover, touch swipe, keyboard arrows
 * - Animated slide counter with morphing digit transitions
 * - Dynamic accent-colored glow that shifts per slide
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var sliderSection = document.getElementById('heroSlider');
    if (!sliderSection) return;

    var slides = Array.prototype.slice.call(sliderSection.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(sliderSection.querySelectorAll('.slider-dot'));
    var prevBtn = document.getElementById('heroPrevBtn');
    var nextBtn = document.getElementById('heroNextBtn');
    var counterCurrent = sliderSection.querySelector('.slider-counter-current');
    var particleCanvas = document.getElementById('heroParticles');

    if (slides.length <= 1) return;

    var currentIndex = 0;
    var autoplayDelay = 6200;
    var autoplayTimer = null;
    var isPaused = false;
    var isTransitioning = false;
    var touchStartX = 0;
    var touchEndX = 0;
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ========== PARTICLE SYSTEM ==========
    function initParticles() {
      if (!particleCanvas || prefersReducedMotion) return;
      var ctx = particleCanvas.getContext('2d');
      if (!ctx) return;

      var particles = [];
      var particleCount = 40;
      var animFrame;

      function resize() {
        particleCanvas.width = sliderSection.offsetWidth;
        particleCanvas.height = sliderSection.offsetHeight;
      }

      function createParticle() {
        return {
          x: Math.random() * particleCanvas.width,
          y: Math.random() * particleCanvas.height,
          size: Math.random() * 2.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.4,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          hue: Math.random() * 60 + 240 // purple-blue range
        };
      }

      function initializeParticles() {
        particles = [];
        for (var i = 0; i < particleCount; i++) {
          particles.push(createParticle());
        }
      }

      function drawParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];

          // Update position
          p.x += p.speedX;
          p.y += p.speedY;

          // Wrap around edges
          if (p.x < 0) p.x = particleCanvas.width;
          if (p.x > particleCanvas.width) p.x = 0;
          if (p.y < 0) p.y = particleCanvas.height;
          if (p.y > particleCanvas.height) p.y = 0;

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'hsla(' + p.hue + ', 80%, 75%, ' + p.opacity + ')';
          ctx.fill();

          // Draw connections to nearby particles
          for (var j = i + 1; j < particles.length; j++) {
            var p2 = particles[j];
            var dx = p.x - p2.x;
            var dy = p.y - p2.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = 'hsla(260, 70%, 70%, ' + (0.08 * (1 - distance / 120)) + ')';
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        animFrame = requestAnimationFrame(drawParticles);
      }

      resize();
      initializeParticles();
      drawParticles();

      window.addEventListener('resize', function () {
        resize();
      });

      // Cleanup on page unload
      window.addEventListener('beforeunload', function () {
        if (animFrame) cancelAnimationFrame(animFrame);
      });
    }

    initParticles();

    // ========== PROGRESS BAR ==========
    function resetProgressAnimation(dotEl) {
      var bar = dotEl.querySelector('.slider-dot-progress');
      if (!bar) return;
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    }

    // ========== COUNTER ANIMATION ==========
    function updateCounter(index) {
      if (!counterCurrent) return;
      counterCurrent.classList.add('is-animating');
      setTimeout(function () {
        counterCurrent.textContent = String(index + 1).padStart(2, '0');
        counterCurrent.classList.remove('is-animating');
      }, 150);
    }

    // ========== SLIDE TRANSITION ==========
    function goToSlide(index, direction) {
      var nextIndex = (index + slides.length) % slides.length;
      if (nextIndex === currentIndex || isTransitioning) return;

      isTransitioning = true;
      var prevIndex = currentIndex;
      var dir = direction || (nextIndex > prevIndex ? 'next' : 'prev');

      slides.forEach(function (slide, idx) {
        slide.classList.remove('is-leaving-prev', 'is-leaving-next');
        if (idx === prevIndex) {
          slide.classList.remove('active');
          slide.classList.add(dir === 'next' ? 'is-leaving-prev' : 'is-leaving-next');
          slide.setAttribute('aria-hidden', 'true');
        } else if (idx === nextIndex) {
          slide.classList.add('active');
          slide.setAttribute('aria-hidden', 'false');
        } else {
          slide.classList.remove('active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      dots.forEach(function (dot, idx) {
        var isActive = idx === nextIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        if (isActive) {
          resetProgressAnimation(dot);
        }
      });

      updateCounter(nextIndex);
      currentIndex = nextIndex;

      // Allow next transition after animation completes
      setTimeout(function () {
        isTransitioning = false;
      }, 850);
    }

    function nextSlide() {
      goToSlide(currentIndex + 1, 'next');
    }

    function prevSlide() {
      goToSlide(currentIndex - 1, 'prev');
    }

    // ========== AUTOPLAY ==========
    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion) return;
      autoplayTimer = window.setInterval(function () {
        if (!isPaused) {
          nextSlide();
        }
      }, autoplayDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    // ========== BUTTON EVENTS ==========
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoplay();
      });
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        var dir = idx > currentIndex ? 'next' : 'prev';
        goToSlide(idx, dir);
        startAutoplay();
      });
    });

    // ========== PAUSE ON HOVER ==========
    sliderSection.addEventListener('mouseenter', function () {
      isPaused = true;
    });

    sliderSection.addEventListener('mouseleave', function () {
      isPaused = false;
      // Reset any active 3D tilt
      var activeVisual = sliderSection.querySelector('.hero-slide.active .hero-visual');
      if (activeVisual) {
        activeVisual.style.transform = '';
      }
    });

    // ========== 3D MOUSE-TILT PARALLAX ==========
    if (!prefersReducedMotion && window.matchMedia('(min-width: 1025px)').matches) {
      var tiltRAF = null;
      var tiltValues = { rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 };
      var tiltTarget = { rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 };

      sliderSection.addEventListener('mousemove', function (e) {
        var rect = sliderSection.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;

        tiltTarget.rotateY = relX * 8;
        tiltTarget.rotateX = -relY * 7;
        tiltTarget.translateX = relX * 12;
        tiltTarget.translateY = relY * 10;

        if (!tiltRAF) {
          tiltRAF = requestAnimationFrame(function applyTilt() {
            // Smooth interpolation (lerp)
            tiltValues.rotateX += (tiltTarget.rotateX - tiltValues.rotateX) * 0.08;
            tiltValues.rotateY += (tiltTarget.rotateY - tiltValues.rotateY) * 0.08;
            tiltValues.translateX += (tiltTarget.translateX - tiltValues.translateX) * 0.08;
            tiltValues.translateY += (tiltTarget.translateY - tiltValues.translateY) * 0.08;

            var activeVisual = sliderSection.querySelector('.hero-slide.active .hero-visual');
            if (activeVisual) {
              activeVisual.style.transform =
                'perspective(1400px) rotateX(' + tiltValues.rotateX.toFixed(2) + 'deg) rotateY(' + tiltValues.rotateY.toFixed(2) + 'deg) translate3d(' + tiltValues.translateX.toFixed(1) + 'px, ' + tiltValues.translateY.toFixed(1) + 'px, 0)';
            }

            // Also parallax the floating cards slightly more
            var topCards = sliderSection.querySelectorAll('.hero-slide.active .hero-floating-card.card-top-left');
            var bottomCards = sliderSection.querySelectorAll('.hero-slide.active .hero-floating-card.card-bottom-right');
            topCards.forEach(function (card) {
              card.style.transform = 'translate3d(' + (tiltValues.translateX * 1.5).toFixed(1) + 'px, ' + (tiltValues.translateY * 1.5).toFixed(1) + 'px, 20px)';
            });
            bottomCards.forEach(function (card) {
              card.style.transform = 'translate3d(' + (-tiltValues.translateX * 1.2).toFixed(1) + 'px, ' + (-tiltValues.translateY * 1.2).toFixed(1) + 'px, 20px)';
            });

            // Continue animation while mouse is moving
            var diff = Math.abs(tiltTarget.rotateX - tiltValues.rotateX) + Math.abs(tiltTarget.rotateY - tiltValues.rotateY);
            if (diff > 0.01) {
              tiltRAF = requestAnimationFrame(applyTilt);
            } else {
              tiltRAF = null;
            }
          });
        }
      });
    }

    // ========== TOUCH SWIPE ==========
    sliderSection.addEventListener('touchstart', function (e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    sliderSection.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 44) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          startAutoplay();
        }
      }
    }, { passive: true });

    // ========== KEYBOARD NAVIGATION ==========
    sliderSection.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        nextSlide();
        startAutoplay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        startAutoplay();
      }
    });

    // ========== MOUSE WHEEL NAVIGATION ==========
    var wheelDebounce = false;
    sliderSection.addEventListener('wheel', function (e) {
      if (wheelDebounce) return;
      var delta = e.deltaY || e.deltaX;
      if (Math.abs(delta) > 30) {
        wheelDebounce = true;
        if (delta > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        startAutoplay();
        setTimeout(function () {
          wheelDebounce = false;
        }, 1200);
      }
    }, { passive: true });

    // ========== VISIBILITY CHANGE (pause when tab hidden) ==========
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });

    // ========== START ==========
    startAutoplay();
  });
})();
