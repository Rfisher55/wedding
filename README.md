# Robert & Madison — King Street, second edition

Wedding: November 7, 2027. The William Aiken House, Charleston, South Carolina.
Live site: https://rfisher55.github.io/wedding/

The production deployment runs on pushes to **main**. The previous published version is commit `6192053` and remains in Git history. This edition replaces the guest-facing HTML, CSS, and JavaScript together, without removing legacy assets or changing the calendar date.

## The new experience

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

## Validation: 91 checks passed

Offline Chromium checks covered initialization, unique IDs and in-page references, all venue/travel tab interactions and keyboard controls, FAQ cross-navigation, invitation and guest-guide dialogs, focus return, clipboard success/failure handling, print CSS/state cleanup, filmstrip controls, gallery keyboard/wrap/swipe handling, image failures, motion controls, no-script access, and responsive geometry at 14 viewport sizes from 320 to 1920 pixels wide, including landscape. There were no JavaScript runtime errors in that run. Static integrity and Node syntax checks also passed.

Limits: browser network navigation is blocked in the build environment. Tests used the actual local HTML/CSS/JS in an isolated document with external requests blocked. An inline SVG fixture exercised successful image loading. Official photographs were visually checked separately through web retrieval. Clipboard success and the print command used API mocks; this is not a physical-device, operating-system printing, every-browser, or live network visual audit. Google Fonts were unavailable during local screenshots, so fallback fonts were checked. GitHub's production deployment must be checked separately after publication.

## Still awaiting confirmed details

Actual RSVP service and access, final ceremony timing, registry links, personal photos and verified relationship story, and any negotiated hotel block links. The page continues to state that invitations and RSVP access will follow. No made-up story, ceremony hour, or working-looking submission form has been introduced.
