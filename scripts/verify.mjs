// Run from repository root: node scripts/verify.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const html = readFileSync('index.html', 'utf8');
const css = readFileSync('src/style.css', 'utf8');
const js = readFileSync('src/main.js', 'utf8');
const calendar = readFileSync('public/robert-madison.ics', 'utf8');
execFileSync(process.execPath, ['--check', 'src/main.js']);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML id');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'One main heading required');
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
for (const match of html.matchAll(/\baria-(?:controls|labelledby)="([^"]+)"/g)) {
  for (const id of match[1].split(' ')) assert(ids.includes(id), `Missing ARIA target: ${id}`);
}
for (const match of html.matchAll(/\b(?:src|href)="((?:src|public)\/[^"?]+)(?:\?[^\"]*)?"/g)) assert(existsSync(match[1]), `Missing asset: ${match[1]}`);
for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert(/rel="[^"]*noopener/.test(match[0]), 'External tab needs noopener');
assert(!/TODO|TODO@example\.com|href="https:\/\/"/.test(html), 'Unfinished visible placeholder');
assert(calendar.includes('DTSTART;VALUE=DATE:20271107'), 'Wrong wedding date');
assert(calendar.includes('DTEND;VALUE=DATE:20271108'), 'All-day end date must be exclusive');
assert(calendar.includes('\r\n'), 'Use RFC calendar CRLF line endings');
for (const line of calendar.split('\r\n')) assert(Buffer.byteLength(line) <= 75, 'Calendar line needs folding');
assert(!/DTSTART:\d+T/.test(calendar), 'Do not invent ceremony timing');
assert(css.includes('prefers-reduced-motion:reduce') && js.includes('prefers-reduced-motion: reduce'), 'Reduced motion missing');
assert(html.includes('No response is being collected through this site yet.'), 'RSVP status must remain honest until configured');
console.log(`PASS: JavaScript syntax, ${ids.length} unique IDs, anchors, ARIA targets, local assets, external-link safety, calendar, reduced motion, and RSVP status.`);
