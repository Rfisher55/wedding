/* ============================================================
   main.js — Wedding website interactions
   Reads from window.WEDDING (defined in data.js)
   ============================================================ */

(function () {
  'use strict';

  const W = window.WEDDING;

  /* ──────────────────────────────────────────────────────────
     SMOOTH NAV: shrink + highlight active section
  ────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    highlightNav();
  }

  function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    const fromTop = window.scrollY + 80;
    let current = '';
    sections.forEach(sec => {
      if (sec.offsetTop <= fromTop) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const mobileMenu   = document.getElementById('mobileMenu');
  const navToggle    = document.getElementById('navToggle');
  const mobileClose  = document.getElementById('mobileClose');
  const mobileLinks  = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  function openMenu()  { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }

  if (navToggle)   navToggle.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  mobileLinks.forEach(a => a.addEventListener('click', closeMenu));

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL — IntersectionObserver
  ────────────────────────────────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced) {
    const revealEls = document.querySelectorAll('[data-reveal]');

    // Group siblings to stagger within parent
    const groups = new Map();
    revealEls.forEach(el => {
      const key = el.parentElement;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });
    groups.forEach(group => {
      group.forEach((el, i) => { el.dataset.revealIdx = i; });
    });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = (Number(el.dataset.revealIdx) || 0) * 0.09;
        el.style.transitionDelay = delay + 's';
        el.classList.add('revealed');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Instantly reveal everything
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
  }

  /* ──────────────────────────────────────────────────────────
     GALLERY — build grid from data, lightbox, scroll rotation
  ────────────────────────────────────────────────────────── */
  const galleryGrid = document.getElementById('galleryGrid');
  let galleryImages = [];
  let lightboxIndex = 0;

  if (galleryGrid && W.gallery) {
    galleryImages = W.gallery;
    galleryImages.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'gallery-item' + (item.featured ? ' gallery-item--featured' : '');
      if (item.featured && !prefersReduced) div.classList.add('gallery-item--rotatable');
      div.dataset.idx = idx;

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt;
      img.loading = 'lazy';

      div.appendChild(img);
      div.addEventListener('click', () => openLightbox(idx));
      galleryGrid.appendChild(div);
    });
  }

  /* Gallery scroll rotation for featured items */
  if (!prefersReduced) {
    const rotatables = document.querySelectorAll('.gallery-item--rotatable');
    if (rotatables.length) {
      const gallerySection = document.getElementById('gallery');

      window.addEventListener('scroll', () => {
        if (!gallerySection) return;
        const rect = gallerySection.getBoundingClientRect();
        const progress = -rect.top / (rect.height || 1);
        const deg = (progress - 0.4) * 14; // maps to roughly -4° to +4°
        rotatables.forEach(el => {
          el.style.transform = `rotate(${Math.max(-5, Math.min(5, deg))}deg)`;
        });
      }, { passive: true });
    }
  }

  /* Lightbox */
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lbClose     = document.getElementById('lbClose');
  const lbPrev      = document.getElementById('lbPrev');
  const lbNext      = document.getElementById('lbNext');

  function openLightbox(idx) {
    if (!lightbox || !galleryImages.length) return;
    lightboxIndex = ((idx % galleryImages.length) + galleryImages.length) % galleryImages.length;
    lbImg.src = galleryImages[lightboxIndex].src;
    lbImg.alt = galleryImages[lightboxIndex].alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function lbNavigate(dir) {
    openLightbox(lightboxIndex + dir);
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev)  lbPrev.addEventListener('click', () => lbNavigate(-1));
  if (lbNext)  lbNext.addEventListener('click', () => lbNavigate(+1));

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lbNavigate(-1);
    if (e.key === 'ArrowRight')  lbNavigate(+1);
  });

  /* ──────────────────────────────────────────────────────────
     RSVP FORM
  ────────────────────────────────────────────────────────── */
  const rsvpForm    = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(rsvpForm);
      const payload = {
        type:      'rsvp',
        name:      fd.get('name'),
        email:     fd.get('email'),
        attending: fd.get('attending'),
        guests:    fd.get('guests'),
        meal:      fd.get('meal'),
        notes:     fd.get('notes'),
      };
      await submitToSheet(payload);
      rsvpForm.style.display = 'none';
      if (rsvpSuccess) rsvpSuccess.classList.add('visible');
    });
  }

  /* ──────────────────────────────────────────────────────────
     GUESTBOOK FORM + DISPLAY
  ────────────────────────────────────────────────────────── */
  const gbForm     = document.getElementById('gbForm');
  const gbSuccess  = document.getElementById('gbSuccess');
  const gbNotes    = document.getElementById('gbNotes');

  if (gbForm) {
    gbForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(gbForm);
      const payload = {
        type:    'guestbook',
        name:    fd.get('name'),
        message: fd.get('message'),
      };
      await submitToSheet(payload);
      // Optimistic UI: prepend the new card
      prependGuestbookCard({ name: payload.name, message: payload.message, date: new Date() });
      gbForm.reset();
      if (gbSuccess) { gbSuccess.classList.add('visible'); setTimeout(() => gbSuccess.classList.remove('visible'), 4000); }
    });
  }

  // Fetch existing notes on load
  fetchGuestbook();

  async function fetchGuestbook() {
    if (!gbNotes || !W.sheetsEndpoint || W.sheetsEndpoint === 'PASTE_WEB_APP_URL_HERE') {
      return;
    }
    try {
      const notes = await fetchViaJSONP(W.sheetsEndpoint);
      if (!Array.isArray(notes) || !notes.length) {
        gbNotes.innerHTML = '<p class="guestbook-empty">Be the first to leave a note.</p>';
        return;
      }
      notes.forEach(note => prependGuestbookCard(note, true));
    } catch {
      // Silently fail — form still works
    }
  }

  function prependGuestbookCard(note, append = false) {
    if (!gbNotes) return;
    const empty = gbNotes.querySelector('.guestbook-empty');
    if (empty) empty.remove();

    const date = note.date ? new Date(note.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const card = document.createElement('div');
    card.className = 'guestbook-card';
    card.innerHTML = `
      <div class="guestbook-card-name">${escHtml(note.name)}</div>
      <p class="guestbook-card-message">${escHtml(note.message)}</p>
      ${date ? `<div class="guestbook-card-date">${date}</div>` : ''}
    `;
    if (append) {
      gbNotes.appendChild(card);
    } else {
      gbNotes.insertBefore(card, gbNotes.firstChild);
    }
  }

  /* ──────────────────────────────────────────────────────────
     SHEETS HELPERS
  ────────────────────────────────────────────────────────── */
  async function submitToSheet(payload) {
    if (!W.sheetsEndpoint || W.sheetsEndpoint === 'PASTE_WEB_APP_URL_HERE') return;
    try {
      await fetch(W.sheetsEndpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body:    JSON.stringify(payload),
      });
    } catch {
      // Treat non-throwing as success (CORS won't block POST with text/plain)
    }
  }

  function fetchViaJSONP(endpoint) {
    return new Promise((resolve, reject) => {
      const cb = 'gb_' + Date.now();
      const s  = document.createElement('script');
      window[cb] = (data) => { resolve(data); delete window[cb]; s.remove(); };
      s.onerror = () => { reject(new Error('JSONP failed')); s.remove(); };
      s.src = `${endpoint}?callback=${cb}`;
      document.body.appendChild(s);
    });
  }

  /* ──────────────────────────────────────────────────────────
     UTILITIES
  ────────────────────────────────────────────────────────── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
