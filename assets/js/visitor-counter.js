/* ==========================================================================
   PS MESSAGE INDIA — LIVE GLOBAL VISITOR COUNTER
   Uses a shared cloud counter API (Abacus) synced across all visitors/devices,
   with localStorage + session fallback so it always updates reliably.
   ========================================================================== */
(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────────────────
  const BASE_COUNT = 15284; // Starting base including recent visitors
  const NAMESPACE = 'psmessageindia.com';
  const KEY = 'visits';
  const STORAGE_KEY = 'psmi_visitors_total';
  const SESSION_KEY = 'psmi_session_visited';

  // ─── LOCAL FALLBACK HELPERS ──────────────────────────────────────────
  function getLocalCount() {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    return Math.max(stored, BASE_COUNT);
  }

  function saveLocalCount(n) {
    try {
      localStorage.setItem(STORAGE_KEY, String(n));
    } catch (e) {
      // Ignore storage quota / private browsing errors
    }
  }

  function isNewSession() {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return false;
      sessionStorage.setItem(SESSION_KEY, '1');
      return true;
    } catch (e) {
      return true;
    }
  }

  // ─── FETCH GLOBAL VISITOR COUNT ──────────────────────────────────────
  async function resolveVisitorCount() {
    const newSession = isNewSession();
    let localCount = getLocalCount();

    if (newSession) {
      localCount += 1;
      saveLocalCount(localCount);
    }

    const endpoint = newSession
      ? `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`
      : `https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`;

    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data.value === 'number') {
          const globalTotal = BASE_COUNT + data.value;
          const finalCount = Math.max(globalTotal, localCount);
          saveLocalCount(finalCount);
          return finalCount;
        }
      }
    } catch (err) {
      // Fallback to localCount if offline or blocked
    }

    return localCount;
  }

  // ─── ANIMATED NUMBER ROLL-UP ─────────────────────────────────────────
  function animateCount(el, target) {
    const duration = 1400; // ms
    const start = Math.max(0, target - 95);
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
    const el = document.getElementById('visitorCount');
    if (!el) return;

    resolveVisitorCount().then(function (count) {
      // Show initial value immediately so it never flashes 0
      el.textContent = count.toLocaleString('en-IN');

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateCount(el, count);
                observer.unobserve(el);
              }
            });
          },
          { threshold: 0.25 }
        );
        observer.observe(el);
      } else {
        animateCount(el, count);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
