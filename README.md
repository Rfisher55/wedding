# Robert & Madison — photos, registry, and guest essentials

Wedding: November 7, 2027. The William Aiken House, Charleston, South Carolina.
Live site: https://rfisher55.github.io/wedding/

The production deployment runs on pushes to **main**. The current photo and registry update is described below. The previous published version is commit `6192053` and remains in Git history. This edition replaces the guest-facing HTML, CSS, and JavaScript together, without removing legacy assets or changing the calendar date.

## September 28, 2026 update

- Imported all 162 supplied photographs as local WebP images, with 640-pixel thumbnails and 1800-pixel lightbox copies. The total photo payload is 30.2 MB; originals are not copied into Git. EXIF metadata is removed from website copies.
- Added a personal opening portrait, six featured photographs, a full gallery shown 12 additional images at a time, keyboard/swipe lightbox navigation, and a link to the supplied full-resolution Dropbox album.
- Added a registry section and `manage-registry.html`, a form-based editor for complete registries or individual gift links. Owner drafts stay in the current browser. Publishing requires copying the generated JSON into `public/registry.json` on GitHub and committing; the page gives explicit steps. No token, password, private guest data, or client-side admin password is introduced.
- Registry entries are intentionally empty until Robert and Madison provide real shopping URLs. Individual gift links do not track purchases. A retailer registry is the recommended route when purchase tracking is needed.
- Added a searchable FAQ, Google Calendar link alongside the Apple/Outlook calendar file, guest shortcuts, and a mobile navigation bar.

## The established experience

An ivory, Charleston-green editorial layout with an arched photographic opening and date stamp; layered correspondence with a wax-seal button opening a save-the-date card; three interactive venue scenes (piazza, courtyard, interiors); a dedicated black-formal-attire section; redesigned hotel, arrival, and exploring panels; a horizontally scrolling photographic filmstrip; and a slide-out guest guide with directions, calendar download, clipboard feedback, and print layout.

Motion includes a slow photographic zoom, light scroll-linked movement, letter rotation, section reveals, scene transitions, and dialog entrances. Native scrolling is never hijacked. The persistent Pause motion preference and the device's reduced-motion setting are respected. No background audio, mandatory opening screen, tracking, frameworks, or fake submissions.

## Editing and maintenance

- `index.html`: guest-facing copy, venue images and credits, hotel links, dress code, FAQ, and dialog content.
- `src/style.css`: visual system, responsive layouts, animations, print stylesheet, image fallbacks.
- `src/main.js`: dialogs, countdown, scene and travel tabs, gallery, filmstrip, clipboard, print controls, and motion preference.
- `public/robert-madison.ics`: unchanged all-day save-the-date. The ceremony time is not known. Its end date is exclusive.
- `public/charleston-linework.svg`: original decorative architectural illustration used when external photography is unavailable. It is not an exact rendering of the venue.
- `scripts/verify.mjs`: run `node scripts/verify.mjs` to check IDs, anchors, ARIA targets, assets, date, calendar formatting, and JavaScript syntax.

The legacy `src/data/content.js`, `src/lib/sheets.js`, and `apps-script/` are retained but not loaded. Editing legacy content does not update this page. Do not put private guest lists or RSVP records in this public repository.

## Guest access and graceful fallbacks

The date, location, dress code, hotel links, directions, FAQ, and calendar download remain available without JavaScript. Venue and travel panels show as regular content without JavaScript. Photos remain ordinary image links when dialogs are unavailable. Native dialogs support Escape and keyboard focus containment; focus returns to the opener, or to the destination heading after mobile navigation.

Scene and travel selectors support arrows and Home/End. The gallery supports next/previous, keyboard arrows, wraparound, and swipe. Clipboard permission failures produce an honest manual-copy message. Printing is scoped to the guest guide only when that control is used. External photo failures show decorative linework; the gallery also exposes a direct link to the original photograph.

## Factual content and photography

Official source: https://www.pphgcharleston.com/venues/william-aiken-house/ (reviewed September 16, 2026).

Venue photos are externally hosted by Patrick Properties Hospitality Group and credited in the page and gallery. Piazza: Lydia Ruth Photography. Courtyard and garden aerial: Kailee DiMeglio Photography. Interior: Taylor Haney Photography. These are venue photographs, not photographs of Robert and Madison or a promise of their final event layout. Photo bytes are not copied into this repository; this project does not claim ownership or a license to redistribute them. Replace with approved personal/licensed images when supplied.

Hotel links remain the established official property destinations. No rates, room availability, transit times, room blocks, or new booking arrangements are promised. The venue's accessibility statement is attributed, with guests directed to confirm specific needs with the venue.

## Prior-edition validation (September 16, 2026): 91 checks passed

Offline Chromium checks covered initialization, unique IDs and in-page references, all venue/travel tab interactions and keyboard controls, FAQ cross-navigation, invitation and guest-guide dialogs, focus return, clipboard success/failure handling, print CSS/state cleanup, filmstrip controls, gallery keyboard/wrap/swipe handling, image failures, motion controls, no-script access, and responsive geometry at 14 viewport sizes from 320 to 1920 pixels wide, including landscape. There were no JavaScript runtime errors in that run. Static integrity and Node syntax checks also passed.

Limits: browser network navigation is blocked in the build environment. Tests used the actual local HTML/CSS/JS in an isolated document with external requests blocked. An inline SVG fixture exercised successful image loading. Official photographs were visually checked separately through web retrieval. Clipboard success and the print command used API mocks; this is not a physical-device, operating-system printing, every-browser, or live network visual audit. Google Fonts were unavailable during local screenshots, so fallback fonts were checked. GitHub's production deployment must be checked separately after publication.

## Still awaiting confirmed details

Final ceremony timing, the active registry URL, verified relationship story, and any negotiated hotel block links still require confirmed details. RSVP collection is connected to a real Google Form and private Google Sheet.

## Feature references for this update

Reviewed Joy’s wedding website features and Zola’s guest FAQ guidance on September 28, 2026. Selected personal photo albums, consolidated registry links, guest travel shortcuts, a searchable question section, and easy calendar access. Existing unconfirmed event details remain unconfirmed; RSVP collection uses a published Google Form.

- https://withjoy.com/wedding-website/
- https://www.zola.com/expert-advice/wedding-website-faq-ideas
- https://www.zola.com/wedding-registry

## September 28 validation

## Live RSVP connection — September 28, 2026

The site links to the published Google Form from navigation, guest shortcuts, the RSVP section, the FAQ, and the guest guide. Guests can reply without a Google account and use the confirmation page's private edit-response link for corrections. The form collects names, email, mailing address, attendance, plus-one attendance/name, and an optional note. It writes to the couple's private Google spreadsheet; guest data and the spreadsheet URL are not included in this repository. The results-summary setting remains off.

The private workbook has a raw Form Responses 1 tab, a live RSVP view, and attendance totals on Overview. Formula references use whole source columns plus a header-row exclusion so Google Forms row insertion cannot skip responses. The labeled synthetic test is retained in raw responses and excluded from the guest view, totals, and hourly ChatGPT notifications. Custom domain purchase remains deferred. Zola onboarding is staged with the couple’s names and wedding date. Account creation requires the owner’s authentication choice and agreement to Zola’s terms before the registry can be activated.

Static checks passed for all local image links, IDs, anchors, ARIA references, calendar dates, registry structure, and JavaScript syntax. Browser checks passed for gallery pagination, photo decoding, lightbox keyboard wraparound and Escape, FAQ filtering and clearing, mobile menu navigation, registry add/edit/delete, HTTPS validation, draft persistence, and separation between owner drafts and guest-facing published data. Layout checks at 320, 390, 768, 1024, and 1440 pixels found no page overflow after correcting hotel cards and the FAQ heading. No JavaScript runtime errors were observed. Desktop and mobile screenshots were visually reviewed. These checks used local Chromium with reduced motion enabled; existing live motion behavior was preserved.

## Delegated finishing choices — September 28, 2026

The RSVP deadline is October 3, 2027 (five weeks before the wedding), selected as a planning default under the couple’s delegated setup request. Plus-ones are limited to invitations that include a guest. These instructions appear on the site, guest guide, and Google Form. Selecting No for a plus-one skips the name section; selecting Yes requires a full name. The form uses the site’s Charleston-green accent.

`docs/registry-starter.json` is a staged list of gifts for the future Zola registry, not an active registry or a record of purchases. It is not loaded by the guest site. Add these items after the owner completes Zola signup, then replace the guest registry data with the verified public registry URL. Prices are reference values from the listed product pages and must be rechecked during setup. No cash fund, payment account, purchase, or domain order has been created.
