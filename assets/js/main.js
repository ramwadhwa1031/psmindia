/**
 * PS MESSAGE INDIA — Main UI Controller (main.js)
 * Handles Navigation, Dropdowns, Mobile Drawer, Showcase Tabs, FAQs, Blog Filter/Search, and Back-to-Top
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initStickyHeader();
    initMobileNavigation();
    initActiveNavHighlight();
    initShowcaseTabs();
    initFaqAccordion();
    initBlogFilterAndSearch();
    initBackToTop();
    initCurrentYear();
  });

  /**
   * 1. Sticky Navbar Scroll Transition
   */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    function updateHeader() {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /**
   * 2. Mobile Menu Drawer & Services Dropdown
   */
  function initMobileNavigation() {
    var toggleBtn = document.querySelector('.mobile-menu-toggle');
    var navMenu = document.querySelector('.nav-menu');
    var dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

    if (toggleBtn && navMenu) {
      toggleBtn.addEventListener('click', function () {
        var isOpen = navMenu.classList.toggle('mobile-open');
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close mobile menu on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
          navMenu.classList.remove('mobile-open');
          toggleBtn.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Dropdown toggle for touch/mobile and keyboard accessibility
    dropdownItems.forEach(function (item) {
      var triggerLink = item.querySelector('.nav-link');
      if (!triggerLink) return;

      triggerLink.addEventListener('click', function (e) {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          item.classList.toggle('dropdown-open');
        }
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      dropdownItems.forEach(function (item) {
        if (!item.contains(e.target)) {
          item.classList.remove('dropdown-open');
        }
      });
    });
  }

  /**
   * 3. Active Navigation Highlighting
   */
  function initActiveNavHighlight() {
    var path = window.location.pathname;
    var filename = path.split('/').pop() || 'index.html';
    var isBlogSubpage = path.indexOf('/blog/') !== -1;
    var servicePages = ['services.html', 'bulk-sms.html', 'bulk-whatsapp.html', 'voice-calls.html', 'rcs-messaging.html'];

    var navLinks = document.querySelectorAll('.nav-menu .nav-link');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var cleanHref = href.replace('../', '').replace('./', '');

      if (cleanHref === filename) {
        link.classList.add('active');
      } else if (isBlogSubpage && cleanHref === 'blog.html') {
        link.classList.add('active');
      } else if (servicePages.indexOf(filename) !== -1 && cleanHref === 'services.html') {
        link.classList.add('active');
      }
    });

    var dropdownLinks = document.querySelectorAll('.dropdown-menu .dropdown-item');
    dropdownLinks.forEach(function (dlink) {
      var href = dlink.getAttribute('href') || '';
      var cleanHref = href.replace('../', '').replace('./', '');
      if (cleanHref === filename) {
        dlink.classList.add('active');
      }
    });
  }

  /**
   * 4. Interactive Communication Showcase Tabs
   */
  function initShowcaseTabs() {
    var tabBtns = document.querySelectorAll('.showcase-tab-btn');
    var panes = document.querySelectorAll('.showcase-pane');
    if (!tabBtns.length || !panes.length) return;

    function activateTab(targetId) {
      tabBtns.forEach(function (btn) {
        var isMatch = btn.getAttribute('data-target') === targetId;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      panes.forEach(function (pane) {
        var isMatch = pane.id === targetId;
        pane.classList.toggle('active', isMatch);
      });
    }

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-target');
        if (targetId) {
          activateTab(targetId);
        }
      });
    });
  }

  /**
   * 5. Frequently Asked Questions Accordion
   */
  function initFaqAccordion() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      var answer = item.querySelector('.faq-answer');
      if (!btn || !answer) return;

      // Open initial active item if present
      if (item.classList.contains('active')) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }

      btn.addEventListener('click', function () {
        var isCurrentlyOpen = item.classList.contains('active');

        // Close sibling items in same container
        var parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.faq-item').forEach(function (sibling) {
            sibling.classList.remove('active');
            var sibBtn = sibling.querySelector('.faq-question');
            var sibAns = sibling.querySelector('.faq-answer');
            if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
            if (sibAns) sibAns.style.maxHeight = null;
          });
        }

        if (!isCurrentlyOpen) {
          item.classList.add('active');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /**
   * 6. Blog Listing Category Filter & Search
   */
  function initBlogFilterAndSearch() {
    var filterBtns = document.querySelectorAll('.filter-pill-btn');
    var searchInput = document.getElementById('blogSearchInput');
    var blogCards = document.querySelectorAll('.blog-filter-item');
    var emptyState = document.getElementById('blogEmptyState');

    if (!blogCards.length) return;

    var currentCategory = 'all';
    var currentQuery = '';

    function filterArticles() {
      var visibleCount = 0;

      blogCards.forEach(function (card) {
        var category = (card.getAttribute('data-category') || '').toLowerCase();
        var title = (card.getAttribute('data-title') || card.textContent || '').toLowerCase();

        var matchesCategory = currentCategory === 'all' || category === currentCategory;
        var matchesQuery = !currentQuery || title.indexOf(currentQuery) !== -1;

        if (matchesCategory && matchesQuery) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentCategory = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        filterArticles();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', function (e) {
        currentQuery = (e.target.value || '').trim().toLowerCase();
        filterArticles();
      });
    }
  }

  /**
   * 7. Back-to-Top Button
   */
  function initBackToTop() {
    var backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 420) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /**
   * 8. Dynamic Copyright Year
   */
  function initCurrentYear() {
    var yearSpans = document.querySelectorAll('.current-year');
    var year = new Date().getFullYear();
    yearSpans.forEach(function (el) {
      el.textContent = year;
    });
  }
})();

