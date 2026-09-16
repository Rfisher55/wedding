/* KING STREET: native interactions, no tracking or simulated RSVP submissions. */
const $ = (s, scope = document) => scope.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ } }
};
let userPaused = storage.get('rm-motion-paused') === 'true';
let motionEnabled = false;
const motionButton = $('#motionToggle');
function syncMotion() {
  motionEnabled = !userPaused && !reduced.matches;
  root.dataset.motion = motionEnabled ? 'on' : 'off';
  motionButton.hidden = false;
  motionButton.disabled = reduced.matches;
  motionButton.textContent = reduced.matches ? 'Reduced motion' : userPaused ? 'Resume motion' : 'Pause motion';
  motionButton.setAttribute('aria-pressed', String(!motionEnabled));
  if (!motionEnabled) {
    $$('.will-reveal').forEach(el => el.classList.add('visible'));
    root.style.setProperty('--hero-shift', '0px');
    root.style.setProperty('--letter-turn', '2deg');
  }
}
syncMotion();
motionButton.addEventListener('click', () => {
  userPaused = !userPaused;
  storage.set('rm-motion-paused', String(userPaused));
  syncMotion(); requestScrollFrame();
});
reduced.addEventListener('change', () => { syncMotion(); requestScrollFrame(); });

// Dialogs: native modal focus containment, Escape, backdrop close, focus return.
const supportsDialogs = typeof HTMLDialogElement !== 'undefined' && typeof HTMLDialogElement.prototype.showModal === 'function';
const triggerFor = new WeakMap();
function openDialog(dialog, trigger) {
  if (!supportsDialogs || dialog.open) return false;
  triggerFor.set(dialog, trigger || document.activeElement);
  dialog.showModal();
  document.body.classList.add('dialog-open');
  if (dialog.id === 'guideDialog') $('#guideStatus').textContent = '';
  return true;
}
function closeDialog(dialog, restoreFocus = true) {
  if (!restoreFocus) triggerFor.delete(dialog);
  dialog.close();
}
$$('[data-dialog]').forEach(button => {
  if (!supportsDialogs) return;
  button.hidden = false;
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', button.dataset.dialog);
  button.addEventListener('click', () => openDialog(document.getElementById(button.dataset.dialog), button));
});
if (supportsDialogs) $('.seal-hint').hidden = false;
$$('dialog').forEach(dialog => {
  $$('[data-close]', dialog).forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
  dialog.addEventListener('close', () => {
    document.body.classList.toggle('dialog-open', !!$('dialog[open]'));
    document.body.classList.remove('printing-guide');
    const trigger = triggerFor.get(dialog);
    triggerFor.delete(dialog);
    trigger?.focus({ preventScroll: true });
  });
  // Only clicks genuinely outside the box, not inside empty dialog padding.
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(dialog);
  });
});
const menu = $('#menuDialog');
$$('nav a', menu).forEach(link => link.addEventListener('click', () => {
  closeDialog(menu, false);
  const target = $(link.hash);
  const heading = $('h2', target) || target;
  heading.tabIndex = -1;
  requestAnimationFrame(() => heading.focus({ preventScroll: true }));
}));
matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches && menu.open) closeDialog(menu); });
$('#copyAddress').addEventListener('click', async () => {
  const status = $('#guideStatus');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText('The William Aiken House, 456 King Street, Charleston, SC 29403');
    status.textContent = 'Venue address copied.';
  } catch { status.textContent = 'Automatic copy is unavailable. Select the address above to copy it.'; }
});
$('#printGuide').addEventListener('click', () => {
  document.body.classList.add('printing-guide');
  window.print();
});
addEventListener('afterprint', () => document.body.classList.remove('printing-guide'));

// Countdown is to the date, never an invented ceremony hour. Midnight is EDT.
const weddingDay = Date.parse('2027-11-07T00:00:00-04:00');
function tick() {
  const remaining = Math.max(0, weddingDay - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000), hours: Math.floor(remaining / 3600000) % 24,
    minutes: Math.floor(remaining / 60000) % 60, seconds: Math.floor(remaining / 1000) % 60
  };
  Object.entries(values).forEach(([unit, value]) => {
    const el = $(`[data-unit="${unit}"]`);
    const next = String(value).padStart(2, '0');
    if (el.textContent !== next) el.textContent = next;
  });
  if (!remaining) {
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type).value;
    $('#countdownTitle').textContent = `${get('year')}-${get('month')}-${get('day')}` === '2027-11-07' ? 'Today, we celebrate.' : 'A day to remember.';
  }
}
tick();
let clock = setInterval(tick, 1000);
document.addEventListener('visibilitychange', () => {
  clearInterval(clock);
  root.classList.toggle('motion-sleep', document.hidden);
  if (!document.hidden) { tick(); clock = setInterval(tick, 1000); }
});

// Accessible tabs: click, arrows, Home/End; normal content remains without JS.
function initTabs(selector) {
  const list = $(selector);
  const tabs = $$('[role="tab"]', list);
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  function select(index, focus = false) {
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.tabIndex = active ? 0 : -1;
      tab.setAttribute('aria-selected', String(active));
      panels[position].hidden = !active;
      panels[position].setAttribute('role', 'tabpanel');
      panels[position].setAttribute('aria-labelledby', tab.id);
      panels[position].tabIndex = 0;
      panels[position].classList.toggle('entering', active && motionEnabled);
    });
    if (focus) tabs[index].focus();
    requestScrollFrame();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); select(next, true);
    });
  });
  list.hidden = false;
  select(0);
  return { tabs, select };
}
// Defined scroll state before tabs ask for their first frame.
let queued = false;
const header = $('#siteHeader');
const hero = $('.hero');
const letter = $('.correspondence');
const navLinks = $$('.desktop-nav a');
const sections = navLinks.map(link => $(link.hash));
function renderScroll() {
  queued = false;
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 35);
  const max = root.scrollHeight - innerHeight;
  root.style.setProperty('--progress', String(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0));
  if (motionEnabled) {
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > 0) root.style.setProperty('--hero-shift', `${Math.max(-18, Math.min(0, -y * .035))}px`);
    const lr = letter.getBoundingClientRect();
    if (lr.bottom > 0 && lr.top < innerHeight) root.style.setProperty('--letter-turn', `${Math.max(-1, Math.min(2, (lr.top / innerHeight) * 4 - 1)).toFixed(2)}deg`);
  }
  let active = -1;
  sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= innerHeight * .4) active = i; });
  if ($('#rsvp').getBoundingClientRect().top <= innerHeight * .4) active = -1;
  navLinks.forEach((link, i) => { if (i === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
}
function requestScrollFrame() { if (!queued) { queued = true; requestAnimationFrame(renderScroll); } }
initTabs('.scene-controls');
const travel = initTabs('.travel-tabs');
$$('[data-open-tab]').forEach(link => link.addEventListener('click', () => {
  const index = travel.tabs.findIndex(tab => tab.id === `tab-${link.dataset.openTab}`);
  if (index >= 0) travel.select(index);
}));
addEventListener('scroll', requestScrollFrame, { passive: true });
addEventListener('resize', requestScrollFrame, { passive: true });
requestScrollFrame();

// IntersectionObserver only adds hidden states after it is ready to observe.
if ('IntersectionObserver' in window && motionEnabled) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); reveal.unobserve(entry.target); }
  }), { threshold: .06, rootMargin: '0px 0px -18px 0px' });
  $$('.reveal').forEach(el => { el.classList.add('will-reveal'); reveal.observe(el); });
}

// Native horizontal filmstrip keeps touch scrolling and does not hijack page scroll.
const film = $('#filmstrip');
const filmPrev = $('#filmPrev');
const filmNext = $('#filmNext');
$('.film-arrows').hidden = false;
function updateFilm() {
  filmPrev.disabled = film.scrollLeft <= 3;
  filmNext.disabled = film.scrollLeft >= film.scrollWidth - film.clientWidth - 3;
}
function moveFilm(direction) {
  const card = $('.film-photo', film);
  const gap = parseFloat(getComputedStyle(film).gap) || 20;
  film.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: motionEnabled ? 'smooth' : 'instant' });
}
filmPrev.addEventListener('click', () => moveFilm(-1));
filmNext.addEventListener('click', () => moveFilm(1));
film.addEventListener('scroll', updateFilm, { passive: true });
film.addEventListener('keydown', event => {
  if (event.target !== film) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); moveFilm(event.key === 'ArrowRight' ? 1 : -1); }
});
addEventListener('resize', updateFilm, { passive: true });
updateFilm();

// Gallery has native link fallbacks, captions, keyboard navigation, and swipe.
const lightbox = $('#lightbox');
const photos = $$('[data-photo]');
let photoIndex = 0;
function showPhoto(index) {
  photoIndex = (index + photos.length) % photos.length;
  const source = photos[photoIndex];
  const image = $('#lightboxImage');
  $('.lightbox-fallback').hidden = true;
  $('#originalPhoto').href = source.href;
  image.src = source.href;
  image.alt = $('img', source).alt;
  $('#lightboxCaption').textContent = source.dataset.caption;
  $('#lightboxCredit').textContent = source.dataset.credit;
  $('#photoCount').textContent = `${photoIndex + 1} / ${photos.length}`;
}
photos.forEach((photo, i) => photo.addEventListener('click', event => {
  if (!supportsDialogs || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault(); showPhoto(i); openDialog(lightbox, photo);
}));
$('#prevPhoto').addEventListener('click', () => showPhoto(photoIndex - 1));
$('#nextPhoto').addEventListener('click', () => showPhoto(photoIndex + 1));
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
});
let touch = null;
const lightboxMedia = $('.lightbox-media');
lightboxMedia.addEventListener('touchstart', e => {
  touch = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
}, { passive: true });
lightboxMedia.addEventListener('touchend', e => {
  if (!touch || e.changedTouches.length !== 1) { touch = null; return; }
  const dx = e.changedTouches[0].clientX - touch.x;
  const dy = e.changedTouches[0].clientY - touch.y;
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(photoIndex + (dx < 0 ? 1 : -1));
  touch = null;
}, { passive: true });
lightboxMedia.addEventListener('touchcancel', () => touch = null, { passive: true });

// Preserve a designed background when third-party photography cannot be loaded.
$$('img').forEach(image => {
  function failed() {
    image.dataset.failed = 'true';
    const frame = image.closest('.media');
    if (frame) frame.dataset.fallback = 'true';
    if (image.id === 'lightboxImage') $('.lightbox-fallback').hidden = false;
  }
  image.addEventListener('error', failed);
  image.addEventListener('load', () => {
    delete image.dataset.failed;
    const frame = image.closest('.media');
    if (frame) delete frame.dataset.fallback;
    if (image.id === 'lightboxImage') $('.lightbox-fallback').hidden = true;
  });
  if (image.complete && image.getAttribute('src') && !image.naturalWidth) failed();
});
root.classList.add('js');
root.classList.toggle('dialogs', supportsDialogs);
