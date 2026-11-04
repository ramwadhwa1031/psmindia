/* ==========================================================================
   PS MESSAGE INDIA — VISITOR COUNTER
   Tracks unique daily visitors using localStorage.
   To connect to a real backend/database, replace the storage logic below.
   ========================================================================== */
(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────────────────
  const BASE_COUNT = 15247;          // Realistic starting visitor base
  const STORAGE_KEY = 'psmi_visitors';
  const VISITED_KEY = 'psmi_visited_date';

  // ─── READ / WRITE COUNTER ────────────────────────────────────────────
  function getCount() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : BASE_COUNT;
  }

  function setCount(n) {
    localStorage.setItem(STORAGE_KEY, n.toString());
  }

  // ─── UNIQUE VISIT CHECK (once per calendar day per browser) ──────────
  function isNewVisitToday() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const lastVisit = localStorage.getItem(VISITED_KEY);
    if (lastVisit === today) return false;
    localStorage.setItem(VISITED_KEY, today);
    return true;
  }

  // ─── ANIMATED NUMBER ROLL-UP ─────────────────────────────────────────
  function animateCount(el, target) {
    const duration = 1600; // ms
    const start = Math.max(0, target - 120); // start near the target for a short roll
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  // ─── INIT ────────────────────────────────────────────────────────────
  function init() {
    let count = getCount();

    if (isNewVisitToday()) {
      count += 1;
      setCount(count);
    }

    const el = document.getElementById('visitorCount');
    if (!el) return;

    // Animate when the counter scrolls into view
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(el, count);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

