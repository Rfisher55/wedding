# Charleston redesign audit — September 28, 2026

## Scope

Redesigned the existing Robert & Madison website and reviewed the staged GitHub Pages version in live Chrome before replacing production. Used the real Google Form and private RSVP workbook for an explicitly labeled synthetic test. No real guest response was created or altered.

## Design review

Reviewed the invitation-like typography, portrait framing, stationery details, and photo-led approach used by Bliss & Bone and Riley & Grey. Reviewed Joy’s guest-oriented tools. The resulting layout, code, monogram, and page copy are original to this project.

- https://blissandbone.com/wedding-website
- https://www.rileygrey.com/
- https://withjoy.com/faq/

## Checks completed

| Area | Observed result |
| --- | --- |
| Static integrity | Node verification and `git diff --check` passed. Unique IDs, anchor targets, ARIA references, local assets, JS syntax, registry schema, all 162 album entries, correct date, and CRLF calendar format were checked. |
| Responsive geometry | 320, 390, 768, 1024, and 1440 pixel iframe viewports had no document horizontal overflow. Desktop Chrome and mobile frames were visually reviewed. Native scrollbars reduce some measured content widths by 15px. |
| Invitation and dialogs | Save-the-date, guest guide, and calendar dialogs opened. Escape closed the invitation and returned focus to its opener. |
| Venue and travel tabs | Click selection and keyboard arrows/End changed selected tabs and visible content. |
| Mobile navigation | Menu opened, destination navigation closed it, and focus moved to the destination heading. |
| Photo album | Album disclosure opened; pagination changed the count from 18 to 30 of 162; “Back to first photos” restored 18. |
| Photo viewer | First photo opened, left arrow wrapped to 162, right arrow returned to 1, and Escape restored focus to the photo opener. |
| Filmstrip | Next control moved the horizontal filmstrip. |
| FAQ | Searching “parking” returned one expanded answer; clearing restored all ten questions. |
| Guest guide | Address copy showed “Venue address copied.” Correct venue, date, deadline, dress code, and calendar/directions links were present. |
| Calendar | Both Google Calendar and Apple/Outlook choices use November 7, 2027, as an all-day date; no ceremony time is implied. |
| Motion | Pause control set motion off; the code and styles retain device reduced-motion support. |
| RSVP embed | The actual Google Form loaded inside the page after opening it. Close worked by pointer and keyboard, updated expanded state, and restored opener focus. Direct form link remains available. |
| RSVP validation and delivery | Empty required fields blocked progression. Selecting an invited plus-one required a name. Labeled synthetic submission reached the thank-you screen and appeared in the private raw response sheet with the audit note. |
| Private RSVP totals | The synthetic test remained excluded from the guest view and all totals. Existing hourly notification task was enabled and configured to exclude tests and reconcile edits. Future notification delivery is not guaranteed by this audit. |
| Runtime and images | No site JavaScript errors or failed loaded site images were observed. Browser-extension metadata errors were unrelated to the website. Lazy images not yet loaded were covered by local asset existence checks. |
| Progressive enhancement | Source review confirmed essential links/content, native FAQ and album disclosures, and photo links are usable without JS. No-JavaScript mode was not separately exercised in this live browser audit. |

## Content verification

Reviewed current official venue and hotel pages. Parking guidance states there is no venue parking and identifies the nearby Visitor’s Center Parking Garage as an option. Accessibility guidance is attributed to the venue and asks guests to confirm specific needs. Hotels are suggestions, not contracted room blocks.

- https://www.pphgcharleston.com/venues/william-aiken-house/
- https://www.hotelbennett.com/
- https://www.francismarionhotel.com/
- https://therestorationhotel.com/boutique-hotel-charleston-sc/
- https://www.thedewberrycharleston.com/

## Fixes and improvements made

- Replaced the fragmented section styling with one invitation design and personal photographs throughout.
- Added original monogram, larger portraits, welcome letter, wedding-day hierarchy, useful arrival details, and a photographic closing.
- Kept the long album collapsed until requested and added a way to reset expanded photo batches.
- Added an optional real RSVP embed with a direct-link fallback.
- Corrected RSVP active navigation state and made displayed photo totals derive from the actual featured photo count.
- Kept registry setup as the intentional coming-soon placeholder requested by the couple.

## Boundaries and pending information

This is a live Chrome audit with responsive iframe checks, not a certification for every physical device or browser. No real booking, gift purchase, calendar event creation, or physical printing was performed. The print stylesheet was reviewed; an operating-system print flow was not exercised in this edition. Third-party Forms, fonts, venue photography, maps, and hotel services can change independently.

Ceremony time, active registry URL, and any negotiated hotel blocks require confirmed information. Registry account creation and custom-domain purchase remain on hold. No private workbook identifier, guest data, edit-response token, or credentials are included here.
