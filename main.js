(function() {
  'use strict';

  // ---- LENIS SMOOTH SCROLL ----
  var lenis = new Lenis({
    duration: 1.2,
    easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    touchMultiplier: 2,
    infinite: false
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ---- LOADER ----
  var loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', function() {
      setTimeout(function() {
        loader.classList.add('done');
        var hero = document.querySelector('.hero');
        if (hero) hero.classList.add('hero-loaded');
      }, 800);
    });
  }

  // ---- HERO IMAGE FADE-IN ----
  var heroImg = document.querySelector('.hero-picture img');
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalHeight > 0) {
      heroImg.classList.add('loaded');
    } else {
      heroImg.addEventListener('load', function() { heroImg.classList.add('loaded'); });
    }
  }

  // ---- CUSTOM CURSOR ----
  var dot = document.querySelector('.cursor-dot');
  var ring = document.querySelector('.cursor-ring');

  if (window.matchMedia('(pointer: fine)').matches && dot && ring) {
    var mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
    });

    function animateCursor() {
      dx += (mx - dx) * 0.9;
      dy += (my - dy) * 0.9;
      dot.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translate(-50%,-50%)';

      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('[data-cursor-hover]').forEach(function(el) {
      el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-hover'); });
    });
  } else {
    if (dot) dot.remove();
    if (ring) ring.remove();
    document.body.style.cursor = 'auto';
    document.querySelectorAll('a, button').forEach(function(e) { e.style.cursor = 'pointer'; });
  }

  // ---- NAV: COLOR SWITCH + HIDE ON SCROLL ----
  var nav = document.querySelector('.nav');
  var heroEl = document.querySelector('.hero');
  var lastScroll = 0;
  var ticking = false;
  var hasHero = !!heroEl;

  function updateNav() {
    var scrollY = window.scrollY;

    if (hasHero) {
      var heroBottom = heroEl.offsetHeight - 80;
      if (scrollY > heroBottom) {
        nav.classList.remove('nav--over-hero');
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.add('nav--over-hero');
        nav.classList.remove('nav--scrolled');
      }
    }

    if (scrollY > 200) {
      if (scrollY > lastScroll + 5) {
        nav.classList.add('nav--hidden');
      } else if (scrollY < lastScroll - 5) {
        nav.classList.remove('nav--hidden');
      }
    } else {
      nav.classList.remove('nav--hidden');
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // ---- MOBILE MENU ----
  var menuBtn = document.querySelector('.nav-menu-btn');
  var mobileMenu = document.querySelector('.mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('open');
      menuBtn.classList.toggle('active');
      menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen) lenis.stop(); else lenis.start();
    });

    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        lenis.start();
      });
    });
  }

  // ---- LAZY LOADING ----
  var lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(function(img) { imgObserver.observe(img); });
  } else {
    lazyImages.forEach(function(img) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }

  // ---- SCROLL REVEAL ----
  var reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach(function(el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function(el) { el.classList.add('visible'); });
  }

  // ---- SILENT LANGUAGE DETECTION (FR default, EN swap) ----
  var lang = (navigator.language || navigator.userLanguage || 'fr').slice(0, 2);
  var en = {
    nav_collection: 'Collection',
    nav_commission: 'Commission',
    nav_story: 'Story',
    nav_contact: 'Contact',
    hero_l1: 'Thousands of points,',
    hero_l2: '<em>carved from darkness.</em>',
    hero_cta: 'Explore the collection',
    essence_quote: '"The details are not the details. They make the design."',
    works_title: 'Selected Works',
    works_link: 'View full collection',
    craft_h2: 'Every mark,<br><em>deliberate.</em>',
    craft_p: 'What begins as a photograph is translated — point by point — into texture you can see and feel. No prints. No reproductions. Only originals.',
    craft_link: 'Discover the process',
    comm_h2: 'Your photograph.<br><em>Our craft.</em>',
    comm_p: 'Send us a photograph that means something to you. We will turn it into a one-of-one piece — carved, signed, and shipped from Casablanca.',
    comm_btn: 'Commission a piece',
    quote_text: '"It stopped every guest at the door. They couldn\'t look away."',
    quote_cite: '— Private collector, Casablanca',
    page_collection_h1: 'Collection',
    page_collection_p: 'Each piece, a world of its own.',
    page_story_h1: 'Story',
    page_story_p: 'How thousands of points become art.',
    page_commission_h1: 'Commission',
    page_commission_p: 'Your photograph. Our craft. One original.',
    page_contact_h1: 'Contact',
    page_contact_p: 'Let\'s talk.',
    step1_h3: 'Send your photograph',
    step1_p: 'A portrait, a memory, an image that matters to you.',
    step2_h3: 'We create',
    step2_p: 'Point by point, your photograph becomes a tactile original.',
    step3_h3: 'You receive',
    step3_p: 'Signed, framed, shipped from Casablanca to your door.',
    story_h2_1: 'Every point,<br><em>a choice.</em>',
    story_p1: 'Nuqat was born in Casablanca from a simple conviction: the beauty of an image reveals itself when you break it down to its most fundamental element — the point.',
    story_p2: 'Each piece begins with a photograph. It is then translated, mark by mark, into a textured surface where light and shadow coexist. The process is slow, deliberate, irreversible. There are no shortcuts. There is no undo.',
    story_h2_2: 'Made in<br><em>Casablanca.</em>',
    story_p3: 'Every work is conceived, crafted, and finished in our Casablanca atelier. The city\'s light, its textures, its energy — they seep into every piece we make.',
    contact_h3_1: 'Get in touch',
    contact_h3_2: 'Visit',
    contact_visit: 'By appointment only<br>Casablanca, Morocco'
  };

  if (lang === 'en') {
    document.documentElement.lang = 'en';
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (en[key]) el.innerHTML = en[key];
    });
  }

})();