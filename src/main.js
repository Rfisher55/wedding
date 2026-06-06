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

const FLOAT_ANIMS  = ['floatA','floatB','floatC','floatD','floatB','floatA','floatD','floatC','floatA'];
const FLOAT_DURS   = [6.5, 8.2, 7.1, 9.0, 6.8, 7.7, 8.5, 6.2, 7.4];
const FLOAT_DELAYS = [0, -2.4, -5.1, -1.8, -3.5, -6.2, -4.0, -2.9, -7.1];
const PARALLAX_SPD = [0.06, 0.11, 0.04, 0.09, 0.13, 0.05, 0.08, 0.12, 0.07];

/* ──────────────────────────────────────────────────────────────
   Boot
────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();

  renderHeroImage();
  renderStory();
  renderSchedule();
  renderTravelGrid();
  renderRegistryGrid();
  renderGalleryGrid();
  renderMealOptions();
  renderDynamicText();

  initSplitText();
  initScrollReveal();
  initNav();
  initMobileMenu();
  initLightbox();
  initRsvpForm();
  initGuestbook();
  initScrollProgress();
  initHeroParallax();
  initMagneticButtons();
  initCountdown();
  initTimelineLine();
  initScrollSkew();
});

/* ──────────────────────────────────────────────────────────────
   Loading screen
────────────────────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Monogram SVG draws for ~2.6s; wait that long then exit
  const delay = prefersReduced ? 400 : 2600;
  setTimeout(() => {
    loader.classList.add('exit');
    setTimeout(() => { loader.remove(); }, 1300);
  }, delay);
}

/* ──────────────────────────────────────────────────────────────
   Custom cursor (desktop / mouse only)
────────────────────────────────────────────────────────────── */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || isTouchDevice) return;

  dot.style.display  = 'block';
  ring.style.display = 'block';

  let mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

  (function loop() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('a, button, .gallery-item, .registry-card').forEach(el => {
    el.addEventListener('mouseenter', () => { ring.classList.add('cursor-hover'); dot.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', () => { ring.classList.remove('cursor-hover'); dot.classList.remove('cursor-hover'); });
  });
}

/* ──────────────────────────────────────────────────────────────
   Split-text heading animation
────────────────────────────────────────────────────────────── */
function initSplitText() {
  if (prefersReduced) return;
  document.querySelectorAll('.split-heading').forEach(el => {
    const raw = el.textContent;
    el.innerHTML = [...raw].map((ch, i) =>
      ch === ' '
        ? '<span class="char char-space"> </span>'
        : `<span class="char" style="--i:${i}">${ch}</span>`
    ).join('');

    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        el.classList.add('chars-revealed');
        obs.unobserve(el);
      });
    }, { threshold: 0.25 });
    obs.observe(el);
  });
}

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
  timeline.innerHTML = story.milestones.map(m => `
    <div class="timeline-entry" data-reveal>
      <div class="timeline-photo" data-label="Photo Coming Soon">
        <img src="${esc(m.image)}" alt="${esc(m.title)}" loading="lazy">
      </div>
      <div class="timeline-content">
        <div class="timeline-year">${esc(m.year)}</div>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.text)}</p>
      </div>
    </div>
  `).join('');
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

/* ── Gallery — horizontal cinematic strip ── */
function renderGalleryGrid() {
  const gridEl = document.getElementById('galleryGrid');
  if (!gridEl) return;
  lightboxImages.length = 0;
  gridEl.innerHTML = '';

  // Wrap in a scroll outer container
  const scrollOuter = document.createElement('div');
  scrollOuter.className = 'gallery-scroll-outer';
  gridEl.parentNode.insertBefore(scrollOuter, gridEl);
  scrollOuter.appendChild(gridEl);

  // Per-photo wipe-reveal observer (uses horizontal scroll container as root)
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('photo-revealed');
      revealObs.unobserve(e.target);
    });
  }, { root: scrollOuter, threshold: 0.08 });

  gallery.images.forEach((src, idx) => {
    const isFeatured = (gallery.featured || []).includes(idx);
    const div = document.createElement('div');
    div.className = 'gallery-item' + (isFeatured ? ' gallery-item--featured' : '');

    // Green wipe-reveal overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-reveal-overlay';
    div.appendChild(overlay);

    const img = document.createElement('img');
    img.src     = src;
    img.alt     = `${couple.partnerOne} & ${couple.partnerTwo}`;
    img.loading = 'lazy';

    // Per-photo float animation
    if (!prefersReduced) {
      img.style.setProperty('--float-anim',  FLOAT_ANIMS[idx % FLOAT_ANIMS.length]);
      img.style.setProperty('--float-dur',   FLOAT_DURS[idx % FLOAT_DURS.length] + 's');
      img.style.setProperty('--float-delay', FLOAT_DELAYS[idx % FLOAT_DELAYS.length] + 's');
    }

    // 3D tilt — mouse (desktop)
    if (!prefersReduced && !isTouchDevice) {
      div.addEventListener('mousemove', e => {
        const r = div.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        img.style.transition         = 'transform 0.08s linear';
        img.style.animationPlayState = 'paused';
        img.style.transform = `perspective(700px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.08)`;
      });
      div.addEventListener('mouseleave', () => {
        img.style.transition = 'transform 0.55s ease';
        img.style.transform  = 'scale(1)';
        setTimeout(() => {
          img.style.transform = img.style.transition = img.style.animationPlayState = '';
        }, 560);
      });
    }

    // 3D tilt — touch (iPhone)
    if (!prefersReduced && isTouchDevice) {
      let touching = false;
      div.addEventListener('touchstart', () => { touching = true; }, { passive: true });
      div.addEventListener('touchmove', e => {
        if (!touching) return;
        const t = e.touches[0];
        const r = div.getBoundingClientRect();
        const x = ((t.clientX - r.left) / r.width  - 0.5) * 2;
        const y = ((t.clientY - r.top)  / r.height - 0.5) * 2;
        img.style.transition         = 'transform 0.06s linear';
        img.style.animationPlayState = 'paused';
        img.style.transform = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.06)`;
      }, { passive: true });
      div.addEventListener('touchend', () => {
        touching = false;
        img.style.transition = 'transform 0.5s ease';
        img.style.transform  = 'scale(1)';
        setTimeout(() => {
          img.style.transform = img.style.transition = img.style.animationPlayState = '';
        }, 520);
      });
    }

    div.appendChild(img);
    div.addEventListener('click', () => openLightbox(idx));
    gridEl.appendChild(div);
    lightboxImages.push({ src, alt: img.alt });
    revealObs.observe(div);
  });

  // Drag-to-scroll with inertia (mouse only; iPhone uses native touch scroll)
  if (!isTouchDevice) {
    let down = false, startX = 0, startLeft = 0, vel = 0, lastX = 0, raf;
    scrollOuter.addEventListener('mousedown', e => {
      down = true; startX = e.clientX; startLeft = scrollOuter.scrollLeft;
      vel = 0; lastX = e.clientX;
      scrollOuter.classList.add('grabbing');
      cancelAnimationFrame(raf);
    });
    window.addEventListener('mousemove', e => {
      if (!down) return;
      vel = e.clientX - lastX; lastX = e.clientX;
      scrollOuter.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener('mouseup', () => {
      if (!down) return;
      down = false;
      scrollOuter.classList.remove('grabbing');
      (function coast() {
        vel *= 0.92;
        scrollOuter.scrollLeft -= vel;
        if (Math.abs(vel) > 0.5) raf = requestAnimationFrame(coast);
      })();
    });
  }
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
  const allReveal = document.querySelectorAll('[data-reveal], [data-reveal="wipe"]');

  if (prefersReduced) {
    allReveal.forEach(el => el.classList.add('revealed'));
    return;
  }

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
      el.style.transitionDelay = `${(Number(el.dataset.revealIdx) || 0) * 0.09}s`;
      el.classList.add('revealed');
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  allReveal.forEach(el => observer.observe(el));

  // Gallery scroll parallax on the scroll container
  const gallerySection  = document.getElementById('gallery');
  const galleryItems    = () => document.querySelectorAll('.gallery-item');

  window.addEventListener('scroll', () => {
    if (!gallerySection) return;
    const rect = gallerySection.getBoundingClientRect();
    if (rect.bottom < -300 || rect.top > window.innerHeight + 300) return;
    const progress = 1 - rect.top / window.innerHeight;
    galleryItems().forEach((item, idx) => {
      const speed  = PARALLAX_SPD[idx % PARALLAX_SPD.length];
      const yShift = progress * window.innerHeight * speed * 0.35;
      item.style.translate = `0 ${yShift}px`;
      if (item.classList.contains('gallery-item--featured')) {
        const deg = Math.max(-5, Math.min(5, (progress - 0.5) * 12));
        item.style.rotate = `${deg}deg`;
      }
    });
  }, { passive: true });
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
  const open  = () => { menu.classList.add('open');    document.body.style.overflow = 'hidden'; };
  const close = () => { menu.classList.remove('open'); document.body.style.overflow = ''; };
  toggle?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ──────────────────────────────────────────────────────────────
   Lightbox
────────────────────────────────────────────────────────────── */
function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const lbImg = lb?.querySelector('.lightbox-img');
  const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lbImg.src = ''; };
  const nav   = dir => openLightbox(lightboxIndex + dir);
  document.getElementById('lbClose')?.addEventListener('click', close);
  document.getElementById('lbPrev')?.addEventListener('click', () => nav(-1));
  document.getElementById('lbNext')?.addEventListener('click', () => nav(+1));
  lb?.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  nav(-1);
    if (e.key === 'ArrowRight') nav(+1);
  });
}

function openLightbox(idx) {
  if (!lightboxImages.length) return;
  const lb    = document.getElementById('lightbox');
  const lbImg = lb?.querySelector('.lightbox-img');
  if (!lb || !lbImg) return;
  lightboxIndex = ((idx % lightboxImages.length) + lightboxImages.length) % lightboxImages.length;
  lbImg.src = lightboxImages[lightboxIndex].src;
  lbImg.alt = lightboxImages[lightboxIndex].alt;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/* ──────────────────────────────────────────────────────────────
   RSVP form
────────────────────────────────────────────────────────────── */
function initRsvpForm() {
  const form    = document.getElementById('rsvpForm');
  const success = document.getElementById('rsvpSuccess');
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    await submitToSheet({ type: 'rsvp', name: fd.get('name'), email: fd.get('email'),
      attending: fd.get('attending'), guests: fd.get('guests'), meal: fd.get('meal'), notes: fd.get('notes') });
    form.style.display = 'none';
    if (success) {
      success.querySelector('p').textContent = rsvp.successMessage;
      success.classList.add('visible');
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
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = { type: 'guestbook', name: fd.get('name'), message: fd.get('message') };
    await submitToSheet(payload);
    prependNote({ ...payload, date: new Date() }, notes, false);
    form.reset();
    if (success) { success.classList.add('visible'); setTimeout(() => success.classList.remove('visible'), 4500); }
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
   Utilities
────────────────────────────────────────────────────────────── */
/* ──────────────────────────────────────────────────────────────
   Scroll velocity skew on gallery strip
────────────────────────────────────────────────────────────── */
function initScrollSkew() {
  if (isTouchDevice || prefersReduced) return;
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  let lastY = window.scrollY, targetSkew = 0, currentSkew = 0, raf;

  window.addEventListener('scroll', () => {
    const delta  = window.scrollY - lastY;
    lastY        = window.scrollY;
    targetSkew   = Math.max(-5, Math.min(5, delta * -0.18));
    cancelAnimationFrame(raf);

    (function lerp() {
      currentSkew += (targetSkew - currentSkew) * 0.08;
      targetSkew  *= 0.88; // decay
      grid.style.setProperty('--gallery-skew', currentSkew.toFixed(3) + 'deg');
      if (Math.abs(currentSkew) > 0.02 || Math.abs(targetSkew) > 0.02) {
        raf = requestAnimationFrame(lerp);
      }
    })();
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────────
   Scroll progress bar
────────────────────────────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = Math.min(pct * 100, 100) + '%';
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────────
   Hero mouse parallax (desktop only)
────────────────────────────────────────────────────────────── */
function initHeroParallax() {
  if (prefersReduced || isTouchDevice) return;
  const heroBg      = document.querySelector('.hero-bg');
  const heroContent = document.querySelector('.hero-content');
  if (!heroBg) return;
  const hero = document.getElementById('hero');

  document.addEventListener('mousemove', e => {
    if (!hero) return;
    const r  = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const cx = (e.clientX / window.innerWidth  - 0.5);
    const cy = (e.clientY / window.innerHeight - 0.5);
    heroBg.style.translate      = `${cx * -20}px ${cy * -14}px`;
    heroContent.style.translate = `${cx * 7}px ${cy * 5}px`;
  });
}

/* ──────────────────────────────────────────────────────────────
   Magnetic buttons (desktop only)
────────────────────────────────────────────────────────────── */
function initMagneticButtons() {
  if (prefersReduced || isTouchDevice) return;
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.38;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ──────────────────────────────────────────────────────────────
   Wedding countdown
────────────────────────────────────────────────────────────── */
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  const target = new Date('2027-11-07T16:00:00');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { el.remove(); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    el.innerHTML =
      item(d, 'Days') + sep() + item(h, 'Hrs') + sep() + item(m, 'Min') + sep() + item(s, 'Sec');
  }

  const item = (n, l) =>
    `<div class="cd-item"><span class="cd-num">${String(n).padStart(2,'0')}</span><span class="cd-label">${l}</span></div>`;
  const sep  = () => `<span class="cd-sep" aria-hidden="true">·</span>`;

  tick();
  setInterval(tick, 1000);
}

/* ──────────────────────────────────────────────────────────────
   Timeline vertical line draw
────────────────────────────────────────────────────────────── */
function initTimelineLine() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  if (prefersReduced) { timeline.classList.add('line-drawn'); return; }
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { timeline.classList.add('line-drawn'); obs.disconnect(); }
  }, { threshold: 0.1 });
  obs.observe(timeline);
}

function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
