/* ============================================================
   THE QUIZ ORACLE v3 — Interactions
   ============================================================ */

/* ── Redacted word reveal (click to toggle) ──────────────── */
document.querySelectorAll('.redacted').forEach(el => {
  el.addEventListener('click', () => el.classList.toggle('revealed'));
});

/* ── Gift box click-to-open ──────────────────────────────── */
const giftBox     = document.getElementById('giftBox');
const revealContent = document.getElementById('revealContent');

if (giftBox && revealContent) {
  const openBox = () => {
    if (giftBox.classList.contains('open')) return;

    giftBox.classList.add('open');
    giftBox.style.cursor = 'default';

    setTimeout(() => {
      revealContent.classList.add('visible');
    }, 500);
  };

  giftBox.addEventListener('click', openBox);
  giftBox.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBox();
    }
  });
}
