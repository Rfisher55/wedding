# Robert & Madison — A Charleston Celebration

A rebuilt, responsive wedding website for November 7, 2027 at The William Aiken House. Charleston green, ivory correspondence, restrained brass details, venue photography, and cinematic motion. No framework, bundler, tracking, background audio, or required installation.

## Live site and publishing

Live: https://rfisher55.github.io/wedding/

The existing GitHub Pages workflow publishes pushes to **main**. A change sitting only on another branch does not publish. This rebuild reconciles the earlier design branch with the live branch; previous versions remain in Git history.

## Files to edit

- `index.html`: all guest-facing text, hotel links, photographs, wedding details, and FAQ answers.
- `src/style.css`: design, responsive layout, transitions, and reduced-motion rules.
- `src/main.js`: countdown, parallax, travel tabs, gallery, navigation, and motion preference.
- `public/robert-madison.ics`: all-day save-the-date download. Keep CRLF line endings. Change dates in both this file and the countdown together.
- `scripts/verify.mjs`: dependency-free static checks; run `node scripts/verify.mjs` from the repository root.

The legacy `src/data/content.js`, `src/lib/sheets.js`, and `apps-script/` files are preserved for reference but are **not loaded by this rebuild**. Editing the legacy content file will not change the page. Do not publish guest lists or private RSVP records in this public repository.

## Implemented interactions

An automatic first-visit entrance; a slow photographic zoom; native scroll with lightweight requestAnimationFrame parallax; staggered section reveals; reading progress; sticky navigation; mobile dialog navigation with keyboard focus handling; accessible Stay / Arrive / Explore tabs; a captioned three-image gallery with previous/next, keyboard arrows, swipe, and Escape; native FAQ accordions; and a static, downloadable calendar file.

The Pause motion control persists a preference when browser storage is available. The operating system's reduced-motion setting takes precedence. Content, directions, gallery image links, FAQs, and the calendar remain available without JavaScript. There is no mandatory invitation gate.

## Content still awaiting the couple

Ceremony time and the detailed schedule, personal photographs and a verified relationship story, a registry destination, any negotiated room-block links, and the actual RSVP service / guest access are not supplied. The page clearly says invitations and RSVP access will follow. No fake submission form, meal selections, ceremony hour, or room-block claim has been added. The calendar saves only the date; the countdown targets the beginning of November 7 in Charleston, not a ceremony time.

## Photography and factual sources

Photographs depict **the venue**, not Robert and Madison. Gallery captions and credits make that distinction explicit. Images are externally hosted by the venue; this repository does not contain copies of them or claim rights to them. Maintain the source and photographer credits. Replace these images with approved personal or licensed files when available.

Official venue source, checked September 16, 2026:
https://www.pphgcharleston.com/venues/william-aiken-house/

- Palmettos / piazza: Lydia Ruth Photography, as credited in the venue gallery.
- Garden aerial and courtyard table setting: Kailee DiMeglio Photography, as credited by the venue.
- Address, piazzas, courtyards, parking, and accessibility information are drawn from the venue's official page. Specific accessibility needs should be confirmed with the venue.

Hotel links were checked against the properties' official sites, including the corrected Dewberry domain and the Charleston-specific Restoration page. No rates, room availability, journey times, or booking arrangements are promised. Google Fonts are requested remotely with system-serif and sans-serif fallbacks; no font files are distributed here.

## Validation performed

45 local Chromium checks passed: core interactions, tabs and keyboard shortcuts, gallery and focus return, mobile menu, anchor navigation, countdown, calendar wiring and date format, system reduced motion, no-script access, and overflow checks at 1440, 1024, 820, 768, 430, 390, 375, and 320-pixel widths plus landscape. JavaScript syntax was checked with Node. Tests exercised the local HTML/CSS/JS in an isolated document because this execution environment blocks browser network navigation; external photographs and official links were checked separately through web retrieval. This is not a claim that every physical device or browser has been tested.

Before announcing future RSVP availability, configure and test an actual persistent service, its privacy controls, delivery, validation, and error handling end to end.
