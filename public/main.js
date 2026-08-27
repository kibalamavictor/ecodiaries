// EcoDiaries — main.js
// Lightweight progressive-enhancement script: mobile nav, filter pills,
// mock form submissions, and play-button micro-interactions.

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile nav toggle ---- */
  document.querySelectorAll('[data-nav-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nav = btn.closest('.site-nav');
      const isOpen = nav.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---- Filter pills (visual state only — static prototype) ---- */
  document.querySelectorAll('.filter-row').forEach((row) => {
    row.addEventListener('click', (e) => {
      const pill = e.target.closest('.filter-pill');
      if (!pill) return;
      row.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ---- Mock form submissions (newsletter, contact, search) ---- */
  document.querySelectorAll('[data-mock-submit]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.innerHTML = btn.innerHTML.includes('Search') ? 'Searching…' : 'Sent ✓';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        form.reset();
      }, 1800);
    });
  });

  /* ---- Play buttons: lightweight pressed feedback ---- */
  document.querySelectorAll('.play-btn, .ep-play').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.style.transform = (btn.style.transform || '') + ' scale(0.92)';
      setTimeout(() => { btn.style.transform = btn.style.transform.replace(' scale(0.92)', ''); }, 150);
    });
  });

  /* ---- Close mobile nav when a link is tapped ---- */
  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      const nav = link.closest('.site-nav');
      if (nav) nav.classList.remove('nav-open');
    });
  });
});
