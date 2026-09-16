const intro = document.querySelector('#intro');
const enter = document.querySelector('#enterSite');
const menuButton = document.querySelector('#menuButton');
const nav = document.querySelector('#siteNav');

document.body.classList.add('intro-open');
enter.addEventListener('click', () => {
  intro.classList.add('is-gone');
  document.body.classList.remove('intro-open');
  setTimeout(() => intro.remove(), 900);
});

menuButton.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const wedding = new Date('2027-11-07T16:00:00-05:00').getTime();
const countdown = document.querySelector('#countdown');
function tick() {
  const distance = Math.max(0, wedding - Date.now());
  const values = [
    Math.floor(distance / 86400000),
    Math.floor((distance % 86400000) / 3600000),
    Math.floor((distance % 3600000) / 60000),
    Math.floor((distance % 60000) / 1000)
  ];
  countdown.querySelectorAll('strong').forEach((node, index) => node.textContent = String(values[index]).padStart(index ? 2 : 1, '0'));
}
tick();
setInterval(tick, 1000);

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
document.querySelectorAll('.photo').forEach(button => button.addEventListener('click', () => {
  const source = button.querySelector('img');
  lightboxImage.src = source.src;
  lightboxImage.alt = source.alt;
  lightbox.showModal();
}));
document.querySelector('#closeLightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelector('#saveDate').addEventListener('click', () => {
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Robert and Madison//Wedding//EN',
    'BEGIN:VEVENT', 'UID:robert-madison-2027@wedding', 'DTSTAMP:20260916T000000Z',
    'DTSTART:20271107T210000Z', 'DTEND:20271108T030000Z',
    'SUMMARY:Robert & Madison’s Wedding',
    'LOCATION:The William Aiken House\\, 456 King Street\\, Charleston\\, SC 29403',
    'DESCRIPTION:Celebrate the marriage of Robert Fisher and Madison Muschik. Formal timing to follow.',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
  link.download = 'robert-and-madison-wedding.ics';
  link.click();
  URL.revokeObjectURL(link.href);
});
