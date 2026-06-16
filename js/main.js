/* ============================================
   Portfolio — Main JavaScript
   GSAP + Page Transitions + i18n
   ============================================ */

(function () {
  'use strict';

  // --- GSAP ScrollTrigger ---
  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance animation
    const hero = document.querySelector('.hero');
    if (hero) {
      gsap.from('.hero .bento-item', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      });
    }

    // Section reveal animations
    document.querySelectorAll('.reveal').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: function () {
          el.classList.add('visible');
        },
        once: true,
      });
    });

    // Stagger children reveal
    document.querySelectorAll('.stagger-children').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: function () {
          el.classList.add('visible');
        },
        once: true,
      });
    });
  }

   // --- Page Transition (simple fade) ---
  function pageTransition(href) {
    return new Promise(function (resolve) {
      var overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      overlay.style.opacity = '0';
      document.body.appendChild(overlay);

      gsap.to(overlay, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: function () {
          resolve();
        },
      });
    });
  }

  function handleCaseLinks() {
    document.querySelectorAll('.case-link, .case-nav a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#' || href.startsWith('http')) return;

        e.preventDefault();

        pageTransition(href).then(function () {
          window.location.href = href;
        });
      });
    });
  }

  // Execute transition on page load (fade in)
  function initPageLoadTransition() {
    setTimeout(function () {
      var overlay = document.querySelector('.page-transition-overlay');
      if (!overlay) return;

      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        delay: 0.05,
        onComplete: function () {
          overlay.style.display = 'none';
        },
      });
    }, 50);
  }

  // --- RU/EN Language Toggle ---
  var currentLang = localStorage.getItem('portfolio-lang') || 'ru';

  function t(key) {
    var keys = key.split('.');
    var value = window.L10N ? window.L10N[currentLang] : null;
    if (!value) return key;

    for (var i = 0; i < keys.length; i++) {
      if (value && typeof value === 'object' && keys[i] in value) {
        value = value[keys[i]];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('portfolio-lang', lang);

    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var translation = t(key);
      if (translation !== key) {
        el.textContent = translation;
      }
    });

    // Update placeholder attributes (avatar alt, input placeholders etc.)
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      var translation = t(key);
      if (translation !== key) {
        el.setAttribute('alt', translation);
      }
    });

    var toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.textContent = lang === 'ru' ? 'EN' : 'RU';
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }

  function initLanguageToggle() {
    var toggle = document.getElementById('lang-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
      var newLang = currentLang === 'ru' ? 'en' : 'ru';
      setLanguage(newLang);
    });

    // Apply initial language
    setLanguage(currentLang);
  }

  // --- Nav Scroll Transparency ---
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var handleScroll = function () {
      if (window.scrollY > 100) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- Intersection Observer Fallback ---
  function initIntersectionObserver() {
    if (typeof IntersectionObserver === 'undefined') return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal, .stagger-children').forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Debounce Utility ---
  function debounce(fn, ms) {
    var timer = null;
    return function () {
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, ms);
    };
  }

  // --- Init ---
  function init() {
    initLanguageToggle();

    // Wait for GSAP to load from CDN
    if (typeof gsap === 'undefined') {
      setTimeout(init, 200);
      return;
    }

    initGSAP();
    initNavScroll();
    initIntersectionObserver();
    handleCaseLinks();
    initPageLoadTransition();
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.App = {
    t: t,
    setLanguage: setLanguage,
    pageTransition: pageTransition,
    debounce: debounce,
  };
})();
