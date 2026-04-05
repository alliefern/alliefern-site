/* ============================================================
   THE QUIZ ORACLE v2 — Interactions
   ============================================================ */

/* ── Redacted word reveal (click or hover) ───────────────── */
document.querySelectorAll('.redacted').forEach(el => {
  el.addEventListener('click', () => el.classList.toggle('revealed'));
});

/* ── Box click-to-open ───────────────────────────────────── */
const box = document.getElementById('mysteryBox');

if (box) {
  const open = () => {
    if (box.classList.contains('open')) return;
    box.classList.add('open');
    box.style.cursor = 'default';
  };

  box.addEventListener('click', open);
  box.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });
}
