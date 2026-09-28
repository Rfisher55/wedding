import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'index.html'), 'utf8');
const css = readFileSync(resolve(root, 'src/style.css'), 'utf8');
const js = readFileSync(resolve(root, 'src/main.js'), 'utf8');
const calendar = readFileSync(resolve(root, 'public/robert-madison.ics'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Expected one page heading');
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert(ids.includes(match[1]), `Missing anchor: ${match[1]}`);
for (const match of html.matchAll(/\baria-(?:controls|labelledby)="([^"]+)"/g)) {
  for (const id of match[1].split(/\s+/)) assert(ids.includes(id), `Missing ARIA target: ${id}`);
}
for (const match of html.matchAll(/\b(?:src|href)="((?:src|public)\/[^"?]+)(?:\?[^"]*)?"/g)) {
  assert(existsSync(resolve(root, match[1])), `Missing local asset: ${match[1]}`);
}
assert(existsSync(resolve(root, 'public/charleston-linework.svg')), 'Missing image fallback');
assert(html.includes('Sunday, November 7, 2027'), 'Wedding date missing');
assert(html.includes('Black formal attire'), 'Dress code missing');
assert(html.includes('RSVP to our wedding') && html.includes('docs.google.com/forms/d/e/1FAIpQLSekzjdeoutXAfWjVl948ZJpeSYMp38QibZWVBNtn7wUmLY1tw/viewform'), 'Published RSVP form link required');
assert(!html.includes('No responses are being collected'), 'Remove outdated RSVP status');
assert(!/<form\b/i.test(html), 'Review any RSVP form and its real delivery service');
assert(calendar.includes('DTSTART;VALUE=DATE:20271107'), 'Calendar must save the correct date');
assert(calendar.includes('DTEND;VALUE=DATE:20271108'), 'Calendar end must be exclusive');
assert(!calendar.replaceAll('\r\n', '').includes('\n'), 'Calendar requires CRLF');
assert(css.includes('prefers-reduced-motion'), 'Reduced motion styles required');
assert(js.includes('supportsDialogs') && js.includes('Clipboard unavailable'), 'Graceful fallbacks required');
execFileSync(process.execPath, ['--check', resolve(root, 'src/main.js')]);
for (const file of ['src/registry.js', 'src/manage-registry.js']) execFileSync(process.execPath, ['--check', resolve(root, file)]);
const registry = JSON.parse(readFileSync(resolve(root, 'public/registry.json'), 'utf8'));
assert(Array.isArray(registry.entries) && typeof registry.intro === 'string', 'Registry data structure invalid');
for (const entry of registry.entries) {
  const url = new URL(entry.url);
  assert(url.protocol === 'https:' && !url.username && !url.password, 'Registry must use public HTTPS shopping links');
  assert(['registry', 'gift'].includes(entry.type) && entry.name.trim(), 'Registry entry invalid');
}
assert.equal((html.match(/ data-photo /g) || []).length, 162, 'Expected the full 162-photo album');
console.log('Charleston v3: static integrity, photo assets, registry data and JavaScript syntax checks passed.');
