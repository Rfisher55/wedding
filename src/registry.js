// Shared published data. Browser drafts are never shown to wedding guests.
export function validLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !!url.hostname.includes('.') && !url.username && !url.password;
  } catch { return false; }
}

export function validateRegistry(data) {
  if (!data || typeof data.intro !== 'string' || data.intro.length > 600 || !Array.isArray(data.entries) || data.entries.length > 100) throw new Error('Please check the registry file.');
  for (const entry of data.entries) {
    if (!entry || typeof entry.name !== 'string' || !entry.name.trim() || entry.name.length > 120 || !validLink(entry.url) || !['registry', 'gift'].includes(entry.type) || typeof entry.note !== 'string' || entry.note.length > 300) throw new Error('Every entry needs a name and a valid https:// link.');
  }
  return data;
}

export function registryCard(entry) {
  const card = document.createElement('a');
  card.className = 'registry-card';
  card.href = entry.url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  const type = document.createElement('span');
  type.className = 'eyebrow';
  type.textContent = entry.type === 'gift' ? 'A little something' : 'Our registry';
  const title = document.createElement('h3');
  title.textContent = entry.name;
  const note = document.createElement('p');
  note.textContent = entry.note || (entry.type === 'gift' ? 'View this gift at the store.' : 'Choose a gift from our wish list.');
  const action = document.createElement('span');
  action.className = 'registry-action';
  action.textContent = entry.type === 'gift' ? 'View gift ↗' : 'Shop registry ↗';
  card.append(type, title, note, action);
  return card;
}

export async function loadRegistry() {
  const response = await fetch(new URL('../public/registry.json', import.meta.url), { cache: 'no-cache' });
  if (!response.ok) throw new Error('The registry could not be loaded.');
  return validateRegistry(await response.json());
}
