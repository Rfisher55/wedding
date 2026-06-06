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
    if (isFeatured && !prefersReduced) div.classList.add('gallery-item--rotatable');

    const img = document.createElement('img');
    img.src     = src;
    img.alt     = `${couple.partnerOne} & ${couple.partnerTwo}`;
    img.loading = 'lazy';

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

  // Gallery scroll rotation for featured items
  const rotatables = document.querySelectorAll('.gallery-item--rotatable');
  if (rotatables.length) {
    const gallerySection = document.getElementById('gallery');
    window.addEventListener('scroll', () => {
      if (!gallerySection) return;
      const rect     = gallerySection.getBoundingClientRect();
      const progress = -rect.top / (rect.height || 1);
      const deg      = Math.max(-5, Math.min(5, (progress - 0.4) * 14));
      rotatables.forEach(el => { el.style.transform = `rotate(${deg}deg)`; });
    }, { passive: true });
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
