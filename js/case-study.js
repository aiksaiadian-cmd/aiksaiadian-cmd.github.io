/* ============================================
   Portfolio — Case Study JavaScript
   Page transitions + i18n toggle for case pages
   ============================================ */

(function () {
  'use strict';

  function initCasePage() {
    // Wait for main.js L10N to be available
    if (typeof window.L10N === 'undefined' || typeof window.App === 'undefined') {
      setTimeout(initCasePage, 200);
      return;
    }

    var App = window.App;

    // Apply current language from localStorage
    var savedLang = localStorage.getItem('portfolio-lang') || 'ru';
    if (savedLang !== 'ru') {
      App.setLanguage(savedLang);
    }

    // Init nav scroll if nav exists
    var nav = document.querySelector('.nav');
    if (nav) {
      var handleScroll = function () {
        if (window.scrollY > 100) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    // Page transition on load
    setTimeout(function () {
      var overlay = document.querySelector('.page-transition-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);
      }

      if (typeof gsap !== 'undefined') {
        gsap.set(overlay, { opacity: 1 });
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          delay: 0.05,
          onComplete: function () {
            overlay.style.display = 'none';
          },
        });
      }
    }, 50);

    // Intercept navigation links for page transitions
    document.querySelectorAll('.back-link, .prev-case, .next-case, .case-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#' || href.startsWith('http')) return;

        // Only intercept links to other pages
        if (href.endsWith('.html')) {
          e.preventDefault();
          App.pageTransition(href).then(function () {
            window.location.href = href;
          });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCasePage);
  } else {
    initCasePage();
  }
})();
