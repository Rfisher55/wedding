# Robert & Madison — a Charleston invitation

Wedding: November 7, 2027 · The William Aiken House · Charleston, South Carolina

Live website: https://rfisher55.github.io/wedding/

## Current design

A personal wedding invitation in warm ivory, Charleston green, and muted gold. The opening pairs two of the couple’s portraits with an original botanical R&M crest. A photographic welcome letter, venue scenes, black formal attire, Charleston travel guide, complete photo album, registry notice, RSVP, and searchable guest questions form one continuous experience.

All 162 approved personal photographs are preserved as local WebP files. The complete album opens on request and displays additional photographs in batches, with an accessible keyboard photo viewer. The invitation card, calendar options, guest guide, mobile navigation, clipboard feedback, and motion preference use native browser controls and lightweight JavaScript.

## RSVP and registry

The RSVP button opens the published Google Form; guests may also load the real form inside the page. Required questions and the invited plus-one path are handled by Google Forms. Replies feed the couple’s private spreadsheet. No guest data, private sheet URL, credential, or admin password is stored in this repository.

The reply deadline is October 3, 2027. Plus-ones are invitation-only. The ceremony time remains unconfirmed, so calendar links save the correct all-day date.

Registry signup is on hold at the couple’s request. The designed “Registry coming soon” notice stays in place until a verified public shopping URL is supplied. `manage-registry.html` remains a separate owner drafting tool. Its local draft does not change the public site: publish by committing its generated JSON to `public/registry.json`. Individual gift links do not track purchases.

## Editing and verification

- `index.html`: guest copy, photo selection, links, FAQ, and dialog content.
- `src/style.css`: responsive visual design, motion, fallbacks, print rules, and owner editor styles.
- `src/main.js`: guest interactions and real RSVP embed.
- `src/registry.js`, `src/manage-registry.js`, `public/registry.json`: registry data and owner draft tools.
- `public/rm-crest.svg`: original vector monogram.
- `public/photos/`: 162 images and smaller thumbnails; EXIF metadata removed.
- `public/robert-madison.ics`: all-day save-the-date with an exclusive November 8 end date.
- `scripts/verify.mjs`: static integrity, links within the page, local assets, ARIA targets, dates, registry schema, and JavaScript syntax.
- `docs/REDESIGN-AUDIT.md`: September 28, 2026 live browser audit and limits.
- `docs/PRIOR-EDITION-NOTES.md`: prior implementation and validation notes.

Run `node scripts/verify.mjs` and `git diff --check` before publication. GitHub Pages deploys pushes to `main` through the existing workflow. Confirm the deployment and the production page after publishing.

## Guest access and fallbacks

Essential copy, direct RSVP, directions, hotel links, calendar download, native FAQ disclosures, and photo links remain available without JavaScript. Venue and travel panels remain normal content. Dialog controls appear only when supported. Keyboard users can navigate tabs with arrows and Home/End, close dialogs with Escape, and return to their opener. Motion respects both the device setting and a persistent pause control.

External venue image failures show original decorative linework. The linework is not an exact architectural rendering. Google Fonts have local serif and sans-serif fallbacks. Google Forms and external hotel/map services remain third-party dependencies.

## Sources and confirmed details

The design references and official venue/hotel sources are documented in the audit. PPHG venue photos are externally hosted and visibly credited to Lydia Ruth, Kailee DiMeglio, and Taylor Haney. They show venue inspiration, not the couple’s final event layout. Photo bytes are not copied into the repository and no redistribution license is claimed.

No room blocks, rates, transport duration, personal relationship history, or ceremony time have been invented. Ceremony timing, active registry, and any hotel-block arrangements await confirmation. The custom domain purchase remains deferred.

Legacy `src/data/content.js`, `src/lib/sheets.js`, and `apps-script/` are retained but not loaded by this website. Do not place private guest information in this public repository.
