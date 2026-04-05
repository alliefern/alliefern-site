/* ============================================================
   THE QUIZ ORACLE — Interactions
   ============================================================ */

/* ── Redacted word reveal ────────────────────────────────── */
document.querySelectorAll('.redacted').forEach(el => {
  // Set the visible word as a data attribute for the CSS to show
  const word = el.dataset.word || el.textContent;
  el.textContent = word;

  el.addEventListener('click', () => {
    el.classList.toggle('revealed');
  });
});

/* ── Box scroll trigger ──────────────────────────────────── */
const box = document.getElementById('mysteryBox');

if (box) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Small delay so user has a beat to register the box before it opens
          setTimeout(() => {
            box.classList.add('opened');
          }, 400);
          observer.unobserve(box);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(box);
}
