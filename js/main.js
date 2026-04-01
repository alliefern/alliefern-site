/* ============================================================
   ALLIE FERN — main.js
   Lenis + GSAP ScrollTrigger + Custom Cursor + Interactions
   ============================================================ */

/* ── Helpers ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── Reduced Motion ──────────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── 1. HERO ENTRANCE (fires on page load) ───────────────── */
function animateHeroEntrance() {
  if (prefersReducedMotion) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-overline',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8 }
  )
  .fromTo('.reveal-word',
    { clipPath: 'inset(0 0 100% 0)', y: 30 },
    { clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1, stagger: 0.18 },
    '-=0.4'
  )
  .fromTo('.hero-body',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.9 },
    '-=0.5'
  )
  .fromTo('.hero-cta',
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.8 },
    '-=0.5'
  )
  .fromTo('.hero-photo',
    { opacity: 0, x: 40, clipPath: 'inset(0 100% 0 0)' },
    { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', duration: 1.1 },
    '-=1.0'
  )
  .fromTo('.hero-scroll-indicator',
    { opacity: 0 },
    { opacity: 1, duration: 0.6 },
    '-=0.2'
  );
}

/* ── 3. LENIS SMOOTH SCROLL ──────────────────────────────── */
let lenis;

function initLenis() {
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    });
  });
}

/* ── 4. SCROLL-TRIGGERED ANIMATIONS ─────────────────────── */
function initScrollAnimations() {
  if (prefersReducedMotion || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const defaults = { ease: 'power3.out', duration: 0.9 };

  // Section overlines — draw line + slide text
  $$('.section-overline.reveal-line').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -20 },
      {
        opacity: 1, x: 0, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // Section headings — clip reveal from bottom
  $$('.section-heading.reveal-heading').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      }
    );
  });

  // Generic reveal blocks
  $$('.reveal-block').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, ...defaults,
        scrollTrigger: { trigger: el, start: 'top 87%', toggleActions: 'play none none none' }
      }
    );
  });

  // Cards — staggered
  const cardGroups = {};
  $$('.reveal-card').forEach(card => {
    const parent = card.parentElement;
    if (!cardGroups[parent]) cardGroups[parent] = [];
    cardGroups[parent].push(card);
  });

  Object.values(cardGroups).forEach(cards => {
    gsap.fromTo(cards,
      { opacity: 0, y: 48, scale: 0.96 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.9, ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Hero photo parallax
  const heroPhoto = $('.hero-photo');
  if (heroPhoto) {
    gsap.to(heroPhoto, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  // Work grid clip-path wipe — per item
  $$('.work-item').forEach((item, i) => {
    gsap.fromTo(item,
      { clipPath: 'inset(0 0 100% 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0 0% 0)', opacity: 1,
        duration: 0.85, ease: 'power3.out',
        delay: (i % 3) * 0.07,
        scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });
}

/* ── 5. NAVIGATION ───────────────────────────────────────── */
function initNav() {
  const nav = $('#nav');
  if (!nav) return;

  // Scrolled state
  ScrollTrigger.create({
    start: 'top -80',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  // Hamburger
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileClose = $('#mobileClose');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });

  const closeMobile = () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  mobileClose.addEventListener('click', closeMobile);
  $$('.mobile-link').forEach(link => link.addEventListener('click', closeMobile));
}

/* ── 6. CUSTOM CURSOR ────────────────────────────────────── */
function initCursor() {
  const dot = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  // Hide if touch device
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  const lag = 0.12; // ring follows with lag

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX, y: mouseY });
  });

  // Animate ring with lag
  function animateRing() {
    ringX += (mouseX - ringX) * lag;
    ringY += (mouseY - ringY) * lag;
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverTargets = 'a, button, .service-card, .work-item, input, [data-cursor-hover]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ── 7. MAGNETIC BUTTONS ─────────────────────────────────── */
function initMagneticButtons() {
  if (prefersReducedMotion) return;

  $$('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.25;
      gsap.to(btn, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0, y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

/* ── 8. SERVICE CARD BORDER ACCENT ──────────────────────── */
function initServiceCards() {
  $$('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('.service-card-accent'), {
        width: '100%', duration: 0.5, ease: 'power3.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('.service-card-accent'), {
        width: '0%', duration: 0.4, ease: 'power3.in'
      });
    });
  });
}

/* ── 9. MARQUEE PAUSE ON HOVER (backup) ──────────────────── */
// CSS handles this — no JS needed

/* ── 10. ABOUT SECTION — HORIZONTAL SCROLL HINT ─────────── */
// Sticky photo scrolls with section naturally

/* ── INIT ────────────────────────────────────────────────── */
function init() {
  // Scripts are loaded synchronously before this file, so gsap is always defined.
  // Guard just in case of a CDN failure.
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (typeof gsap !== 'undefined') {
    initLenis();
    initScrollAnimations();
    initNav();
    initMagneticButtons();
    initServiceCards();
    // Small delay so fonts are painted before animating
    setTimeout(animateHeroEntrance, 100);
  }

  initCursor();
}

// Scripts are at end of body so DOM is already ready
init();
