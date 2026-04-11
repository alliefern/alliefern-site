/* ============================================================
   ALLIE FERN — main.js
   Minimal, reliable version. Animations are enhancement only.
   ============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Nav scroll effect ───────────────────────────────────── */
function initNav() {
  const nav = $('#nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobileClose = $('#mobileClose');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const close = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileClose.addEventListener('click', close);
  $$('.mobile-link').forEach(l => l.addEventListener('click', close));

  // Smooth scroll anchor links
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = $(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      close();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── Custom cursor ───────────────────────────────────────── */
function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  (function loop() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  const sel = 'a, button, .service-card, .work-item, input';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(sel)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(sel)) document.body.classList.remove('cursor-hover');
  });
}

/* ── Magnetic buttons (GSAP optional) ───────────────────── */
function initMagnetic() {
  if (reduced || typeof gsap === 'undefined') return;
  $$('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width  / 2) * 0.25,
        y: (e.clientY - r.top  - r.height / 2) * 0.25,
        duration: 0.4, ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
  });
}

/* ── Scroll animations (GSAP + ScrollTrigger, optional) ──── */
function initScrollAnimations() {
  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Lenis smooth scroll
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({ duration: 1.2 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Scroll-in animations — movement only, NO opacity changes
  const slideUp = (els, extra = {}) => {
    els.forEach(el => {
      gsap.fromTo(el,
        { y: 35, immediateRender: false },
        { y: 0, duration: 0.85, ease: 'power3.out', ...extra,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });
  };

  slideUp($$('.reveal-heading'));
  slideUp($$('.reveal-block'), { duration: 0.7 });
  slideUp($$('.section-overline'));

  // Card stagger
  ['.services-grid', '.work-grid', '.about-inner'].forEach(parent => {
    const cards = $$(`.${parent.replace('.', '')} .reveal-card`);
    if (!cards.length) return;
    gsap.fromTo(cards,
      { y: 40, immediateRender: false },
      { y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: cards[0], start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // Hero background parallax
  const heroBgImg = $('.hero-bg-img');
  if (heroBgImg) {
    gsap.to(heroBgImg, {
      y: '20%', ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
  }
}

/* ── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCursor();
  initMagnetic();
  initScrollAnimations();
});
