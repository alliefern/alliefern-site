/* ============================================================
   HOUSEHOLD NAME — Interactions & Animations
   ============================================================ */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Gold Particle Canvas ──────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize, { passive: true });

  // Build particles
  const count = Math.min(80, Math.floor(W * H / 18000));
  const particles = Array.from({ length: count }, () => ({
    x:      Math.random() * W,
    y:      Math.random() * H,
    r:      Math.random() * 1.5 + 0.4,
    vx:     (Math.random() - 0.5) * 0.18,
    vy:     -(Math.random() * 0.35 + 0.08),
    alpha:  Math.random() * 0.5 + 0.1,
    pulse:  Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.015;
      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 169, 110, ${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  if (!reduced) draw();
}

/* ── Mouse Parallax on rings ───────────────────────────────── */
function initMouseParallax() {
  if (reduced || typeof gsap === 'undefined') return;

  const targets = [
    { el: document.querySelector('.ring-1'),   depth: 0.018 },
    { el: document.querySelector('.ring-2'),   depth: 0.012 },
    { el: document.querySelector('.ring-3'),   depth: 0.03  },
    { el: document.querySelector('.ring-4'),   depth: 0.04  },
    { el: document.querySelector('.o1'),       depth: 0.008 },
    { el: document.querySelector('.o2'),       depth: 0.01  },
    { el: document.querySelector('.d1'),       depth: 0.045 },
    { el: document.querySelector('.d2'),       depth: 0.06  },
    { el: document.querySelector('.d3'),       depth: 0.035 },
    { el: document.querySelector('.hn-logo'),  depth: 0.008 },
  ].filter(t => t.el);

  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  document.addEventListener('mousemove', e => {
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    targets.forEach(({ el, depth }) => {
      gsap.to(el, {
        x: dx * depth,
        y: dy * depth,
        duration: 1.8,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  });
}

/* ── Scroll Animations (GSAP + ScrollTrigger) ──────────────── */
function initScrollAnimations() {
  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const fadeUp = (selector, stagger = 0, delay = 0) => {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;
    gsap.fromTo(els,
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger,
        delay,
        scrollTrigger: {
          trigger: els[0],
          start: 'top 86%',
          toggleActions: 'play none none none',
        },
      }
    );
  };

  // Hero entry
  if (!reduced) {
    gsap.from('.hn-logo', { y: -20, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });
    gsap.from('.hn-eyebrow', { opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 });
    gsap.from('.hn-script', { y: 20, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.65 });
    gsap.from('.hn-headline', { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.8 });
    gsap.from('.hn-hero-sub', { y: 20, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 1.1 });
    gsap.from('.hn-hero-content .hn-btn', { y: 16, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 1.3 });
  }

  // Sections
  fadeUp('.hn-pull-quote', 0);
  fadeUp('.hn-quote-body', 0, 0.1);
  fadeUp('.arch-grid .arch-left', 0);
  fadeUp('.arch-grid .arch-right', 0, 0.15);
  fadeUp('.timeline-card', 0.18);
  fadeUp('.inside-header', 0);
  fadeUp('.deliverable', 0.1);
  fadeUp('.apply-inner > *', 0.12);

  // Gold line reveal
  const shimmerLines = document.querySelectorAll('.arch-shimmer-line');
  shimmerLines.forEach(line => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: line, start: 'top 85%', toggleActions: 'play none none none' },
    });
  });

  // Deliverable hover ripple
  document.querySelectorAll('.deliverable').forEach(del => {
    del.addEventListener('mouseenter', () => {
      gsap.to(del.querySelector('.del-dot'), {
        scale: 1.8, opacity: 1, duration: 0.3, ease: 'power2.out',
      });
    });
    del.addEventListener('mouseleave', () => {
      gsap.to(del.querySelector('.del-dot'), {
        scale: 1, opacity: 0.4, duration: 0.4, ease: 'power2.out',
      });
    });
  });
}

/* ── Timeline card tilt on hover ───────────────────────────── */
function initCardTilt() {
  if (reduced || typeof gsap === 'undefined') return;

  document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const xRel = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const yRel = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      gsap.to(card, {
        rotateY: xRel,
        rotateX: yRel,
        transformPerspective: 800,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.6)' });
    });
  });
}

/* ── Button shimmer on hover ───────────────────────────────── */
function initBtnShimmer() {
  document.querySelectorAll('.hn-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.setProperty('--btn-shimmer', 'translateX(100%)');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--btn-shimmer', 'translateX(-100%)');
    });
  });
}

/* ── Init ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initMouseParallax();
  initScrollAnimations();
  initCardTilt();
  initBtnShimmer();
});
