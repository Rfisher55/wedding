import {
  couple, hero as heroData, story, event as eventData,
  schedule, travel, registry, gallery, rsvp, guestbook as gbData,
  footer as footerData,
} from './data/content.js';
import { submitToSheet, fetchGuestbook } from './lib/sheets.js';

/* ──────────────────────────────────────────────────────────────
   Module-level state
────────────────────────────────────────────────────────────── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice  = window.matchMedia('(hover: none)').matches;
const lightboxImages = [];
let lightboxIndex = 0;
let lightboxReturnFocus = null;

/* ──────────────────────────────────────────────────────────────
   Boot
────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderHeroImage();
  renderStory();
  renderSchedule();
  renderTravelGrid();
  renderRegistryGrid();
  renderGalleryGrid();
  renderMealOptions();
  renderDynamicText();

  initScrollReveal();
  initSplitText();
  initNav();
  initMobileMenu();
  initLightbox();
  initRsvpForm();
  initGuestbook();

  // Cinematic flourishes
  initLoader();
  initEnvelopeScene();
  initCursor();
  initScrollProgress();
  initHeroParallax();
  initImageParallax();
  initMagneticButtons();
  initCountdown();

  // Boot succeeded — stand down the head failsafe. If any init above threw,
  // this line is never reached and the failsafe reveals content at 5s.
  clearTimeout(window.__impBootFailsafe);
});

/* ──────────────────────────────────────────────────────────────
   Content renderers
────────────────────────────────────────────────────────────── */
function renderHeroImage() {
  const img = document.querySelector('.hero-img');
  if (img && heroData.heroImage) img.src = heroData.heroImage;
}

function renderStory() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  const intro = story.intro
    ? `<p class="story-intro" data-reveal>${esc(story.intro)}</p>`
    : '';
  const panels = story.milestones.map(m => `
    <section class="story-panel">
      <div class="story-bg"><img src="${esc(m.image)}" alt="${esc(m.title)}" loading="lazy"></div>
      <div class="story-scrim" aria-hidden="true"></div>
      <div class="story-caption" data-reveal>
        <p class="story-year">${esc(m.year)}</p>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.text)}</p>
      </div>
    </section>
  `).join('');
  timeline.innerHTML = intro + panels;
}

function renderSchedule() {
  const list = document.getElementById('scheduleList');
  if (!list) return;
  list.innerHTML = schedule.map(row => `
    <div class="schedule-row">
      <span class="schedule-time">${esc(row.time)}</span>
      <span class="schedule-label">${esc(row.label)}</span>
    </div>
  `).join('');
}

function renderTravelGrid() {
  const grid = document.getElementById('hotelGrid');
  if (!grid) return;
  const hotelCards = travel.hotels.map(h => {
    const hasLink = h.link && h.link !== 'https://';
    return `
      <div class="travel-card" data-reveal>
        <h3>${esc(h.name)}</h3>
        <span class="travel-meta">${esc(h.distance)}</span>
        ${h.note ? `<p>${esc(h.note)}</p>` : ''}
        ${hasLink ? `<a href="${esc(h.link)}" class="travel-link" target="_blank" rel="noopener">Book Your Room &rarr;</a>` : ''}
      </div>`;
  }).join('');
  grid.innerHTML = `
    <div class="travel-card" data-reveal>
      <h3>By Air</h3>
      <span class="travel-meta">Nearest Airport</span>
      <p>${esc(travel.airport)}</p>
    </div>
    <div class="travel-card" data-reveal>
      <h3>Parking</h3>
      <span class="travel-meta">Important Note</span>
      <p>${esc(travel.parking)}</p>
    </div>
    ${hotelCards}
  `;
}

function renderRegistryGrid() {
  const grid = document.getElementById('registryGrid');
  if (!grid) return;
  grid.innerHTML = registry.links.map(r => `
    <div class="registry-card" data-reveal>
      <div class="registry-name">${esc(r.name)}</div>
      <a href="${esc(r.url)}" target="_blank" rel="noopener" class="btn btn-outline">
        ${esc(r.label)}
      </a>
    </div>
  `).join('');
}

/* ── Gallery — calm responsive grid ── */
function renderGalleryGrid() {
  const gridEl = document.getElementById('galleryGrid');
  if (!gridEl) return;
  lightboxImages.length = 0;
  gridEl.innerHTML = '';

  gallery.images.forEach((src, idx) => {
    const isFeatured = (gallery.featured || []).includes(idx);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gallery-item' + (isFeatured ? ' gallery-item--featured' : '');
    btn.setAttribute('aria-label', `View photo ${idx + 1} of ${gallery.images.length} — enlarge`);

    const img = document.createElement('img');
    img.src     = src;
    img.alt     = `${couple.partnerOne} & ${couple.partnerTwo}`;
    img.loading = 'lazy';

    // Cursor-following 3D tilt (desktop)
    if (!prefersReduced && !isTouchDevice) {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        img.style.transition = 'transform 0.1s linear';
        img.style.transform  = `perspective(800px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) scale(1.1)`;
      });
      btn.addEventListener('mouseleave', () => { img.style.transition = ''; img.style.transform = ''; });
    }

    btn.appendChild(img);
    btn.addEventListener('click', () => openLightbox(idx));
    gridEl.appendChild(btn);
    lightboxImages.push({ src, alt: img.alt });
  });
}

function renderMealOptions() {
  const select = document.getElementById('rsvp-meal');
  if (!select) return;
  while (select.options.length > 1) select.remove(1);
  rsvp.mealOptions.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt; o.textContent = opt;
    select.appendChild(o);
  });
}

function renderDynamicText() {
  setText('rsvpIntro',      rsvp.intro);
  setText('gbIntro',        gbData.intro);
  setText('registryIntro',  registry.intro);
  setText('footerTagline',  footerData.tagline);
  setText('footerDate',     footerData.date);
  setText('footerLocation', footerData.location);
  setText('footerHashtag',  couple.hashtag);
  document.querySelectorAll('[data-contact-email]').forEach(el => {
    el.href = 'mailto:' + couple.contactEmail;
    el.textContent = couple.contactEmail;
  });
  document.querySelectorAll('[data-hashtag]').forEach(el => { el.textContent = couple.hashtag; });
  const gbTextarea = document.querySelector('#gbForm textarea');
  if (gbTextarea) gbTextarea.placeholder = gbData.placeholder;
}

/* ──────────────────────────────────────────────────────────────
   Scroll reveal
────────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const allReveal = document.querySelectorAll('[data-reveal]');

  if (prefersReduced) {
    allReveal.forEach(el => el.classList.add('revealed'));
    return;
  }

  // Subtle per-sibling stagger so groups settle in sequence, not all at once
  const groups = new Map();
  allReveal.forEach(el => {
    const key = el.parentElement;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });
  groups.forEach(group => group.forEach((el, i) => { el.dataset.revealIdx = i; }));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transitionDelay = `${(Number(el.dataset.revealIdx) || 0) * 0.08}s`;
      el.classList.add('revealed');
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  allReveal.forEach(el => observer.observe(el));
}

/* ──────────────────────────────────────────────────────────────
   Nav
────────────────────────────────────────────────────────────── */
function initNav() {
  const nav      = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    const fromTop = window.scrollY + 80;
    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => { if (sec.offsetTop <= fromTop) current = sec.id; });
    navLinks.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + current); });
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMobileMenu() {
  const menu     = document.getElementById('mobileMenu');
  const toggle   = document.getElementById('navToggle');
  const closeBtn = document.getElementById('mobileClose');
  if (!menu || !toggle) return;

  const open = () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => closeBtn?.focus());
  };
  const close = ({ returnFocus = true } = {}) => {
    menu.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', open);
  closeBtn?.addEventListener('click', () => close());
  // Following a link navigates to a section — close without yanking focus back
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close({ returnFocus: false })));

  // Escape closes; Tab is trapped within the open menu
  menu.addEventListener('keydown', e => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const focusables = [closeBtn, ...menu.querySelectorAll('a')].filter(Boolean);
    if (!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

/* ──────────────────────────────────────────────────────────────
   Lightbox
────────────────────────────────────────────────────────────── */
function initLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const lbImg = lb.querySelector('.lightbox-img');
  const controls = ['lbClose', 'lbPrev', 'lbNext'].map(id => document.getElementById(id)).filter(Boolean);

  const close = () => {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
    // Return focus to whatever opened the lightbox (the gallery button)
    if (lightboxReturnFocus && document.contains(lightboxReturnFocus)) lightboxReturnFocus.focus();
    lightboxReturnFocus = null;
  };
  const nav = dir => openLightbox(lightboxIndex + dir);

  document.getElementById('lbClose')?.addEventListener('click', close);
  document.getElementById('lbPrev')?.addEventListener('click', () => nav(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => nav(+1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     { close();  return; }
    if (e.key === 'ArrowLeft')  { nav(-1);  return; }
    if (e.key === 'ArrowRight') { nav(+1);  return; }
    if (e.key === 'Tab' && controls.length) {
      // Trap focus inside the dialog
      e.preventDefault();
      const curr = controls.indexOf(document.activeElement);
      const step = e.shiftKey ? -1 : 1;
      controls[(curr + step + controls.length) % controls.length].focus();
    }
  });
}

function openLightbox(idx) {
  if (!lightboxImages.length) return;
  const lb    = document.getElementById('lightbox');
  const lbImg = lb?.querySelector('.lightbox-img');
  if (!lb || !lbImg) return;
  const wasOpen = lb.classList.contains('open');
  if (!wasOpen) lightboxReturnFocus = document.activeElement;   // remember the trigger
  lightboxIndex = ((idx % lightboxImages.length) + lightboxImages.length) % lightboxImages.length;
  lbImg.src = lightboxImages[lightboxIndex].src;
  lbImg.alt = lightboxImages[lightboxIndex].alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (!wasOpen) {
    const closeBtn = document.getElementById('lbClose');
    if (closeBtn) requestAnimationFrame(() => closeBtn.focus());
  }
}

/* ──────────────────────────────────────────────────────────────
   RSVP form
────────────────────────────────────────────────────────────── */
function initRsvpForm() {
  const form    = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  if (!form) return;
  const submitBtn = form.querySelector('button[type="submit"]');
  const nameEl  = document.getElementById('rsvp-name');
  const emailEl = document.getElementById('rsvp-email');
  const group   = form.querySelector('.rsvp-attending-group');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    setFormError(form, '');

    let firstInvalid = null;
    if (!nameEl.value.trim()) { setFieldError(nameEl, 'Please enter your name.'); firstInvalid ||= nameEl; }
    else clearFieldError(nameEl);

    if (!emailEl.value.trim())          { setFieldError(emailEl, 'Please enter your email.'); firstInvalid ||= emailEl; }
    else if (!emailEl.checkValidity())  { setFieldError(emailEl, 'Please enter a valid email address.'); firstInvalid ||= emailEl; }
    else clearFieldError(emailEl);

    const attending = form.querySelector('input[name="attending"]:checked');
    if (!attending) {
      setGroupError(group, 'Please let us know if you can attend.');
      firstInvalid ||= form.querySelector('input[name="attending"]');
    } else setGroupError(group, '');

    if (firstInvalid) { firstInvalid.focus(); return; }

    const restore = setSubmitting(submitBtn, 'Sending…');
    let ok = false;
    try {
      ok = await submitToSheet({
        type: 'rsvp', name: nameEl.value, email: emailEl.value, attending: attending.value,
        guests: document.getElementById('rsvp-guests').value,
        meal:   document.getElementById('rsvp-meal').value,
        notes:  document.getElementById('rsvp-notes').value,
      });
    } catch { ok = false; }

    if (ok) {
      form.style.display = 'none';
      if (success) { success.querySelector('p').textContent = rsvp.successMessage; success.classList.add('visible'); }
    } else {
      restore();
      setFormError(form, 'Something went wrong sending your RSVP. Please try again, or email us directly.');
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   Guestbook
────────────────────────────────────────────────────────────── */
function initGuestbook() {
  const form    = document.getElementById('gbForm');
  const success = document.getElementById('gbSuccess');
  const notes   = document.getElementById('gbNotes');
  const submitBtn = form?.querySelector('button[type="submit"]');
  const nameEl = document.getElementById('gb-name');
  const msgEl  = document.getElementById('gb-message');

  form?.addEventListener('submit', async e => {
    e.preventDefault();
    setFormError(form, '');

    let firstInvalid = null;
    if (!nameEl.value.trim()) { setFieldError(nameEl, 'Please enter your name.'); firstInvalid ||= nameEl; }
    else clearFieldError(nameEl);
    if (!msgEl.value.trim())  { setFieldError(msgEl, 'Please write a short note.'); firstInvalid ||= msgEl; }
    else clearFieldError(msgEl);
    if (firstInvalid) { firstInvalid.focus(); return; }

    const restore = setSubmitting(submitBtn, 'Sending…');
    const payload = { type: 'guestbook', name: nameEl.value, message: msgEl.value };
    let ok = false;
    try { ok = await submitToSheet(payload); } catch { ok = false; }

    if (ok) {
      prependNote({ ...payload, date: new Date() }, notes, false);
      form.reset();
      restore();
      clearFieldError(nameEl); clearFieldError(msgEl);
      if (success) { success.classList.add('visible'); setTimeout(() => success.classList.remove('visible'), 4500); }
    } else {
      restore();
      setFormError(form, 'Your note could not be sent just now. Please try again in a moment.');
    }
  });
  fetchGuestbook().then(data => {
    if (!notes) return;
    if (!Array.isArray(data) || !data.length) { notes.innerHTML = '<p class="guestbook-empty">Be the first to leave a note.</p>'; return; }
    notes.innerHTML = '';
    data.forEach(n => prependNote(n, notes, true));
  }).catch(() => {});
}

function prependNote(note, container, append) {
  if (!container) return;
  container.querySelector('.guestbook-empty')?.remove();
  const date = note.date ? new Date(note.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const card = document.createElement('div');
  card.className = 'guestbook-card';
  card.innerHTML = `
    <div class="guestbook-card-name">${esc(note.name)}</div>
    <p class="guestbook-card-message">${esc(note.message)}</p>
    ${date ? `<div class="guestbook-card-date">${date}</div>` : ''}
  `;
  if (append) container.appendChild(card); else container.insertBefore(card, container.firstChild);
}

/* ──────────────────────────────────────────────────────────────
   Envelope invitation intro
────────────────────────────────────────────────────────────── */
function initEnvelopeScene() {
  const overlay  = document.getElementById('envOverlay');
  const stage    = document.getElementById('envStage');
  const envelope = document.getElementById('mainEnvelope');
  const hint     = document.getElementById('envHint');
  const letter   = document.getElementById('envLetterCard');
  const contBtn  = document.getElementById('envContinue');
  if (!overlay || !envelope) return;

  if (sessionStorage.getItem('invOpened')) { overlay.remove(); return; }

  // Reveal after loader finishes (~3.9s total including fade-out)
  const loaderDone = prefersReduced ? 500 : 3900;
  setTimeout(() => {
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }, loaderDone);

  let opened = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;
    hint.classList.add('gone');
    envelope.classList.add('open');
    // Letter starts rising shortly after flap begins rotating
    setTimeout(() => stage.classList.add('open'), 350);
    // Bring letter above envelope once it clears the top edge
    setTimeout(() => { letter.style.zIndex = '5'; }, 1400);
    // Show continue button when animation settles
    setTimeout(() => contBtn.classList.add('show'), 2100);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });

  contBtn.addEventListener('click', () => {
    sessionStorage.setItem('invOpened', '1');
    overlay.classList.add('dismissed');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  });
}

/* ──────────────────────────────────────────────────────────────
   Cinematic flourishes
────────────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Hold long enough for the crest to draw, then lift the curtain
  const delay = prefersReduced ? 300 : 3300;
  setTimeout(() => {
    loader.classList.add('exit');
    setTimeout(() => loader.remove(), 1200);
  }, delay);
}

function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || isTouchDevice || prefersReduced) return;
  document.documentElement.classList.add('cursor-custom');
  dot.style.display = 'block'; ring.style.display = 'block';
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  (function loop() {
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .gallery-item, .registry-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('cursor-hover'); dot.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { ring.classList.remove('cursor-hover'); dot.classList.remove('cursor-hover'); });
  });
}

function initSplitText() {
  if (prefersReduced) return;
  document.querySelectorAll('.split-heading').forEach(el => {
    const raw = el.textContent;
    el.innerHTML = [...raw].map((ch, i) =>
      ch === ' ' ? '<span class="char char-space"> </span>' : `<span class="char" style="--i:${i}">${esc(ch)}</span>`
    ).join('');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { el.classList.add('chars-revealed'); obs.unobserve(el); } });
    }, { threshold: 0.2 });
    obs.observe(el);
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = Math.min(Math.max(pct, 0) * 100, 100) + '%';
  }, { passive: true });
}

function initHeroParallax() {
  if (prefersReduced || isTouchDevice) return;
  const heroBg = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');
  const hero = document.getElementById('hero');
  if (!heroBg || !hero) return;
  document.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    heroBg.style.transform = `scale(1.06) translate(${cx * -18}px, ${cy * -12}px)`;
    if (heroContent) heroContent.style.transform = `translate(${cx * 8}px, ${cy * 6}px)`;
  });
}

// Cinematic scroll parallax on the full-bleed story panels
function initImageParallax() {
  if (prefersReduced || isTouchDevice) return;
  const imgs = [...document.querySelectorAll('.story-bg img')];
  if (!imgs.length) return;
  imgs.forEach(img => { img.style.transition = 'none'; });
  let ticking = false;
  const apply = () => {
    const vh = window.innerHeight;
    imgs.forEach(img => {
      const panel = img.closest('.story-panel') || img;
      const r = panel.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const progress = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1
      img.style.transform = `scale(1.22) translateY(${(progress * 9).toFixed(2)}%)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } }, { passive: true });
  apply();
}

function initMagneticButtons() {
  if (prefersReduced || isTouchDevice) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.3;
      const y = (e.clientY - r.top - r.height / 2) * 0.4;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const target = new Date('2027-11-07T16:00:00');
  const item = (n, l) => `<div class="cd-item"><span class="cd-num">${String(n).padStart(2, '0')}</span><span class="cd-label">${l}</span></div>`;
  const sep = () => `<span class="cd-sep" aria-hidden="true">·</span>`;
  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { el.innerHTML = '<p class="countdown-eyebrow">Today is the day.</p>'; clearInterval(timer); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = item(d, 'Days') + sep() + item(h, 'Hours') + sep() + item(m, 'Minutes') + sep() + item(s, 'Seconds');
  }
  tick();
  const timer = setInterval(tick, 1000);
}

/* ──────────────────────────────────────────────────────────────
   Utilities
────────────────────────────────────────────────────────────── */
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

/* ──────────────────────────────────────────────────────────────
   Form validation helpers
────────────────────────────────────────────────────────────── */
function setFieldError(input, message) {
  clearFieldError(input);
  if (!message) return;
  input.setAttribute('aria-invalid', 'true');
  const err = document.createElement('span');
  err.className = 'field-error';
  err.id = (input.id || input.name) + '-error';
  err.setAttribute('role', 'alert');
  err.textContent = message;
  input.setAttribute('aria-describedby', err.id);
  input.insertAdjacentElement('afterend', err);
}

function clearFieldError(input) {
  if (!input) return;
  input.removeAttribute('aria-invalid');
  input.removeAttribute('aria-describedby');
  document.getElementById((input.id || input.name) + '-error')?.remove();
}

// Radio/checkbox group error — attaches inside the fieldset
function setGroupError(group, message) {
  if (!group) return;
  group.querySelector('.field-error')?.remove();
  if (!message) return;
  const err = document.createElement('span');
  err.className = 'field-error';
  err.setAttribute('role', 'alert');
  err.textContent = message;
  group.appendChild(err);
}

// Form-level error banner (network / submit failure)
function setFormError(form, message) {
  let box = form.querySelector('.form-error');
  if (!message) { box?.remove(); return; }
  if (!box) {
    box = document.createElement('div');
    box.className = 'form-error';
    box.setAttribute('role', 'alert');
    form.appendChild(box);
  }
  box.textContent = message;
}

// Disable a submit button during an in-flight request; returns a restore fn
function setSubmitting(btn, label) {
  if (!btn) return () => {};
  const original = btn.textContent;
  btn.textContent = label;
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  return () => {
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    btn.textContent = original;
  };
}
