/* Native, accessible interactions. No tracking, fake RSVP submissions, or dependencies. */
const root = document.documentElement;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* Private mode still works. */ } }
};
let userPaused = storage.get('rm-motion-paused') === 'true';
let motionEnabled = false;
const motionButton = $('#motionToggle');
function syncMotion() {
  motionEnabled = !reduceMotion.matches && !userPaused;
  root.dataset.motion = motionEnabled ? 'on' : 'off';
  motionButton.hidden = false;
  motionButton.disabled = reduceMotion.matches;
  motionButton.setAttribute('aria-pressed', String(!motionEnabled));
  motionButton.textContent = reduceMotion.matches ? 'Reduced motion' : userPaused ? 'Resume motion' : 'Pause motion';
  if (!motionEnabled) {
    $$('.will-reveal').forEach(node => node.classList.add('visible'));
    $$('[data-parallax]').forEach(node => node.style.removeProperty('transform'));
    $('.arrival')?.classList.remove('show');
  }
}
syncMotion();
root.classList.add('js');
motionButton.addEventListener('click', () => {
  userPaused = !userPaused;
  storage.set('rm-motion-paused', String(userPaused));
  syncMotion();
  requestScrollFrame();
});
reduceMotion.addEventListener('change', () => { syncMotion(); requestScrollFrame(); });

// An automatic first-visit entrance, never an invitation gate.
const arrival = $('.arrival');
let hasVisited = true;
try { hasVisited = sessionStorage.getItem('rm-visited') === 'true'; sessionStorage.setItem('rm-visited', 'true'); } catch { /* Skip the entrance when storage is unavailable. */ }
if (motionEnabled && !hasVisited && !location.hash) {
  arrival.classList.add('show');
  setTimeout(() => arrival.remove(), 1350);
} else { arrival.remove(); }

// Native dialogs keep keyboard focus inside and return it to the trigger.
const menu = $('#menuDialog');
const lightbox = $('#lightbox');
let activeTrigger = null;
function openDialog(dialog, trigger) {
  if (!dialog || typeof dialog.showModal !== 'function') return false;
  activeTrigger = trigger;
  dialog.showModal();
  document.body.classList.add('dialog-open');
  return true;
}
[menu, lightbox].forEach(dialog => {
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    activeTrigger?.focus({ preventScroll: true });
    activeTrigger = null;
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
});
$('#menuButton').addEventListener('click', event => openDialog(menu, event.currentTarget));
$('#closeMenu').addEventListener('click', () => menu.close());
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  // Focus the destination heading after navigating rather than leave focus offscreen.
  activeTrigger = null;
  menu.close();
  const target = document.querySelector(link.hash);
  const heading = target?.querySelector('h2') || target;
  if (heading) { heading.setAttribute('tabindex', '-1'); requestAnimationFrame(() => heading.focus({ preventScroll: true })); }
}));
matchMedia('(min-width: 821px)').addEventListener('change', event => { if (event.matches && menu.open) menu.close(); });

// Midnight at the START of Nov 7 is still daylight time in Charleston.
// This counts down to the date, not to an unconfirmed ceremony time.
const weddingDay = Date.parse('2027-11-07T00:00:00-04:00');
const dateFormat = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
function updateCountdown() {
  const remaining = Math.max(0, weddingDay - Date.now());
  const numbers = { days: Math.floor(remaining / 86400000), hours: Math.floor(remaining / 3600000) % 24, minutes: Math.floor(remaining / 60000) % 60, seconds: Math.floor(remaining / 1000) % 60 };
  Object.entries(numbers).forEach(([unit, value]) => {
    const node = $(`[data-unit="${unit}"]`);
    const next = String(value).padStart(2, '0');
    if (node.textContent !== next) node.textContent = next;
  });
  if (remaining === 0) {
    const parts = dateFormat.formatToParts(new Date());
    const value = type => parts.find(part => part.type === type).value;
    const today = `${value('year')}-${value('month')}-${value('day')}`;
    $('#countdownTitle').textContent = today === '2027-11-07' ? 'Today, we celebrate.' : 'A day to remember.';
  }
}
updateCountdown();
let countdownTimer = setInterval(updateCountdown, 1000);
document.addEventListener('visibilitychange', () => {
  clearInterval(countdownTimer);
  if (!document.hidden) { updateCountdown(); countdownTimer = setInterval(updateCountdown, 1000); }
});

// Staggered reveals; plain HTML remains visible if IntersectionObserver is absent.
if ('IntersectionObserver' in window && motionEnabled) {
  const reveals = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); reveals.unobserve(entry.target); }
  }), { threshold: .08, rootMargin: '0px 0px -25px 0px' });
  $$('.reveal').forEach(node => {
    node.classList.add('will-reveal');
    if (node.closest('.schedule, .gallery-grid')) node.style.setProperty('--delay', `${Array.from(node.parentElement.children).indexOf(node) * 90}ms`);
    reveals.observe(node);
  });
}

// One requestAnimationFrame per scroll tick; no perpetual JS animation loop.
const header = $('#siteHeader');
const parallaxLayers = $$('[data-parallax]');
const sectionLinks = $$('.desktop-nav a');
const sections = sectionLinks.map(link => document.querySelector(link.hash));
let scrollQueued = false;
function renderScroll() {
  scrollQueued = false;
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 55);
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  root.style.setProperty('--progress', String(pageHeight > 0 ? Math.min(1, Math.max(0, y / pageHeight)) : 0));
  if (motionEnabled) parallaxLayers.forEach(layer => {
    const rect = layer.parentElement.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < innerHeight) {
      const shift = Math.max(-75, Math.min(120, -rect.top * Number(layer.dataset.parallax)));
      layer.style.transform = `translate3d(0,${shift.toFixed(1)}px,0)`;
    }
  });
  let active = -1;
  sections.forEach((section, index) => { if (section.getBoundingClientRect().top <= innerHeight * .4) active = index; });
  if ($('#rsvp').getBoundingClientRect().top <= innerHeight * .4) active = -1;
  sectionLinks.forEach((link, index) => { if (index === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}
function requestScrollFrame() { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(renderScroll); } }
addEventListener('scroll', requestScrollFrame, { passive: true });
addEventListener('resize', requestScrollFrame, { passive: true });
requestScrollFrame();

// Travel tabs support click, Left/Right, Home/End and direct FAQ navigation.
const tablist = $('.travel-tabs');
const tabs = $$('.travel-tabs [role="tab"]');
function selectTab(index, focus = false) {
  tabs.forEach((tab, position) => {
    const selected = index === position;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    panel.hidden = !selected;
    panel.setAttribute('role', 'tabpanel');
    panel.tabIndex = 0;
    panel.classList.toggle('entering', selected && motionEnabled);
  });
  if (focus) tabs[index].focus();
  requestScrollFrame();
}
tablist.hidden = false;
selectTab(0);
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(index));
  tab.addEventListener('keydown', event => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); selectTab(next, true);
  });
});
$$('[data-open-tab]').forEach(link => link.addEventListener('click', () => {
  const index = tabs.findIndex(tab => tab.id === `tab-${link.dataset.openTab}`);
  if (index >= 0) selectTab(index);
}));

// Gallery: arrows, keyboard, swipe, captions, and native focus management.
const photos = $$('[data-photo]');
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const source = photos[photoIndex];
  const image = $('#lightboxImage');
  image.src = source.href;
  image.alt = source.querySelector('img').alt;
  $('#lightboxCaption').textContent = source.dataset.caption;
  $('#lightboxCredit').textContent = source.dataset.credit;
  $('#photoCount').textContent = `${photoIndex + 1} / ${photos.length}`;
}
photos.forEach((photo, index) => photo.addEventListener('click', event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  if (typeof lightbox.showModal !== 'function') return;
  event.preventDefault(); showPhoto(index); openDialog(lightbox, photo);
}));
$('#closeLightbox').addEventListener('click', () => lightbox.close());
$('#prevPhoto').addEventListener('click', () => showPhoto(photoIndex - 1));
$('#nextPhoto').addEventListener('click', () => showPhoto(photoIndex + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
});
let touchStart = null;
$('#lightboxImage').addEventListener('touchstart', event => {
  if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  else touchStart = null;
}, { passive: true });
$('#lightboxImage').addEventListener('touchend', event => {
  if (!touchStart || event.changedTouches.length !== 1) return;
  const dx = event.changedTouches[0].clientX - touchStart.x;
  const dy = event.changedTouches[0].clientY - touchStart.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });
// A failed third-party image should not show a broken-image icon in the layout.
$$('img').forEach(image => {
  image.addEventListener('error', () => image.dataset.failed = 'true');
  image.addEventListener('load', () => { delete image.dataset.failed; });
  if (image.complete && image.getAttribute('src') && !image.naturalWidth) image.dataset.failed = 'true';
});
