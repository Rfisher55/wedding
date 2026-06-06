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
const lightboxImages = [];
let lightboxIndex = 0;

// Per-photo animation config — 9 slots, intentionally varied so
// all 9 gallery items float/drift at different speeds and rhythms.
const FLOAT_ANIMS   = ['floatA','floatB','floatC','floatD','floatB','floatA','floatD','floatC','floatA'];
const FLOAT_DURS    = [6.5, 8.2, 7.1, 9.0, 6.8, 7.7, 8.5, 6.2, 7.4]; // seconds
const FLOAT_DELAYS  = [0, -2.4, -5.1, -1.8, -3.5, -6.2, -4.0, -2.9, -7.1]; // negative = mid-cycle start
const PARALLAX_SPD  = [0.06, 0.11, 0.04, 0.09, 0.13, 0.05, 0.08, 0.12, 0.07]; // scroll fraction per item

/* ──────────────────────────────────────────────────────────────
   Boot — render content, then wire interactions
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

  // Interactions run after all [data-reveal] elements exist in the DOM
  initScrollReveal();
  initNav();
  initMobileMenu();
  initLightbox();
  initRsvpForm();
  initGuestbook();
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

function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  lightboxImages.length = 0;
  grid.innerHTML = '';

  gallery.images.forEach((src, idx) => {
    const isFeatured = (gallery.featured || []).includes(idx);
    const div = document.createElement('div');
    div.className = 'gallery-item' + (isFeatured ? ' gallery-item--featured' : '');

    const img = document.createElement('img');
    img.src     = src;
    img.alt     = `${couple.partnerOne} & ${couple.partnerTwo}`;
    img.loading = 'lazy';

    // ── Ambient float — every photo gets its own personality ──
    if (!prefersReduced) {
      img.style.setProperty('--float-anim',  FLOAT_ANIMS[idx % FLOAT_ANIMS.length]);
      img.style.setProperty('--float-dur',   FLOAT_DURS[idx % FLOAT_DURS.length] + 's');
      img.style.setProperty('--float-delay', FLOAT_DELAYS[idx % FLOAT_DELAYS.length] + 's');
    }

    // ── 3D tilt — mouse (desktop) ──
    if (!prefersReduced) {
      div.addEventListener('mousemove', e => {
        const r = div.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        img.style.transition        = 'transform 0.08s linear';
        img.style.animationPlayState = 'paused';
        img.style.transform = `perspective(700px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.08)`;
      });
      div.addEventListener('mouseleave', () => {
        img.style.transition = 'transform 0.55s ease';
        img.style.transform  = 'scale(1)';
        setTimeout(() => {
          img.style.transform          = '';
          img.style.transition         = '';
          img.style.animationPlayState = '';
        }, 560);
      });
    }

    // ── 3D tilt — touch (iPhone / iPad) ──
    if (!prefersReduced) {
      let touching = false;
      div.addEventListener('touchstart', () => { touching = true; }, { passive: true });
      div.addEventListener('touchmove', e => {
        if (!touching) return;
        const touch = e.touches[0];
        const r = div.getBoundingClientRect();
        const x = ((touch.clientX - r.left) / r.width  - 0.5) * 2;
        const y = ((touch.clientY - r.top)  / r.height - 0.5) * 2;
        img.style.transition        = 'transform 0.06s linear';
        img.style.animationPlayState = 'paused';
        img.style.transform = `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.06)`;
      }, { passive: true });
      div.addEventListener('touchend', () => {
        touching = false;
        img.style.transition = 'transform 0.5s ease';
        img.style.transform  = 'scale(1)';
        setTimeout(() => {
          img.style.transform          = '';
          img.style.transition         = '';
          img.style.animationPlayState = '';
        }, 520);
      });
    }

    div.appendChild(img);
    div.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(div);
    lightboxImages.push({ src, alt: img.alt });
  });
}

function renderMealOptions() {
  const select = document.getElementById('rsvp-meal');
  if (!select) return;
  while (select.options.length > 1) select.remove(1);
  rsvp.mealOptions.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt;
    o.textContent = opt;
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
    el.href        = 'mailto:' + couple.contactEmail;
    el.textContent = couple.contactEmail;
  });
  document.querySelectorAll('[data-hashtag]').forEach(el => {
    el.textContent = couple.hashtag;
  });

  // Update guestbook textarea placeholder
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

  // Compute stagger index per sibling group
  const groups = new Map();
  allReveal.forEach(el => {
    const key = el.parentElement;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });
  groups.forEach(group => group.forEach((el, i) => { el.dataset.revealIdx = i; }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.transitionDelay = `${(Number(el.dataset.revealIdx) || 0) * 0.09}s`;
      el.classList.add('revealed');
      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  allReveal.forEach(el => observer.observe(el));

  // Gallery: scroll parallax (each item moves at its own speed) + featured rotation
  if (!prefersReduced) {
    const gallerySection  = document.getElementById('gallery');
    const galleryItems    = document.querySelectorAll('.gallery-item');

    if (gallerySection && galleryItems.length) {
      window.addEventListener('scroll', () => {
        const rect = gallerySection.getBoundingClientRect();
        // Only compute when gallery is anywhere near the viewport
        if (rect.bottom < -300 || rect.top > window.innerHeight + 300) return;

        // progress: 0 when section top hits bottom of viewport, 1 when section top at top
        const progress = 1 - rect.top / window.innerHeight;

        galleryItems.forEach((item, idx) => {
          const speed  = PARALLAX_SPD[idx % PARALLAX_SPD.length];
          const yShift = progress * window.innerHeight * speed * 0.35;
          // Use CSS `translate` (individual transform property) so it composes
          // independently with the img's float animation & tilt transforms.
          item.style.translate = `0 ${yShift}px`;

          // Featured items also get a scroll-driven rotation on top
          if (item.classList.contains('gallery-item--featured')) {
            const deg = Math.max(-5, Math.min(5, (progress - 0.5) * 12));
            item.style.rotate = `${deg}deg`;
          }
        });
      }, { passive: true });
    }
  }
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
    document.querySelectorAll('section[id]').forEach(sec => {
      if (sec.offsetTop <= fromTop) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initMobileMenu() {
  const menu    = document.getElementById('mobileMenu');
  const toggle  = document.getElementById('navToggle');
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
  const lb     = document.getElementById('lightbox');
  const lbImg  = lb?.querySelector('.lightbox-img');
  const close  = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lbImg.src = ''; };
  const nav    = (dir) => openLightbox(lightboxIndex + dir);

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    await submitToSheet({
      type:      'rsvp',
      name:      fd.get('name'),
      email:     fd.get('email'),
      attending: fd.get('attending'),
      guests:    fd.get('guests'),
      meal:      fd.get('meal'),
      notes:     fd.get('notes'),
    });
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

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = { type: 'guestbook', name: fd.get('name'), message: fd.get('message') };
    await submitToSheet(payload);
    prependNote({ ...payload, date: new Date() }, notes, false);
    form.reset();
    if (success) {
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 4500);
    }
  });

  fetchGuestbook()
    .then(data => {
      if (!notes) return;
      if (!Array.isArray(data) || !data.length) {
        notes.innerHTML = '<p class="guestbook-empty">Be the first to leave a note.</p>';
        return;
      }
      notes.innerHTML = '';
      data.forEach(n => prependNote(n, notes, true));
    })
    .catch(() => {});
}

function prependNote(note, container, append) {
  if (!container) return;
  container.querySelector('.guestbook-empty')?.remove();
  const date = note.date
    ? new Date(note.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';
  const card = document.createElement('div');
  card.className = 'guestbook-card';
  card.innerHTML = `
    <div class="guestbook-card-name">${esc(note.name)}</div>
    <p class="guestbook-card-message">${esc(note.message)}</p>
    ${date ? `<div class="guestbook-card-date">${date}</div>` : ''}
  `;
  if (append) container.appendChild(card);
  else        container.insertBefore(card, container.firstChild);
}

/* ──────────────────────────────────────────────────────────────
   Utilities
────────────────────────────────────────────────────────────── */
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
