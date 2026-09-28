import { loadRegistry, validateRegistry, validLink, registryCard } from './registry.js';
const $ = selector => document.querySelector(selector);
let data;
let editing = -1;
const draftKey = 'rm-registry-draft-v1';
let storageAvailable = true;
function persist() {
  try { localStorage.setItem(draftKey, JSON.stringify(data)); } catch { storageAvailable = false; }
  $('#registryOutput').value = JSON.stringify(data, null, 2) + '\n';
}
function resetForm() {
  editing = -1;
  $('#registryForm').reset();
  $('#editorTitle').textContent = 'Add a link';
  $('#saveEntry').textContent = 'Add to draft';
  $('#cancelEdit').hidden = true;
}
function render() {
  $('#registryMessage').value = data.intro;
  const list = $('#draftEntries');
  list.replaceChildren();
  if (!data.entries.length) {
    const empty = document.createElement('p');
    empty.className = 'draft-empty';
    empty.textContent = 'No links yet. Add your registry to get started.';
    list.append(empty);
  }
  data.entries.forEach((entry, index) => {
    const wrapper = document.createElement('div');
    const actions = document.createElement('div');
    actions.className = 'draft-actions';
    const edit = document.createElement('button');
    edit.type = 'button'; edit.textContent = 'Edit'; edit.setAttribute('aria-label', `Edit ${entry.name}`);
    edit.addEventListener('click', () => {
      editing = index;
      $('#entryName').value = entry.name;
      $('#entryUrl').value = entry.url;
      $('#entryType').value = entry.type;
      $('#entryNote').value = entry.note;
      $('#editorTitle').textContent = 'Edit this link';
      $('#saveEntry').textContent = 'Update draft';
      $('#cancelEdit').hidden = false;
      $('#entryName').focus();
    });
    const remove = document.createElement('button');
    remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${entry.name}`);
    remove.addEventListener('click', () => {
      if (!confirm(`Remove ${entry.name} from this draft?`)) return;
      data.entries.splice(index, 1); resetForm(); persist(); render();
      $('#formStatus').textContent = 'Link removed from draft. Publish to update the website.';
    });
    actions.append(edit, remove);
    if (index > 0) {
      const up = document.createElement('button'); up.type = 'button'; up.textContent = 'Move up';
      up.setAttribute('aria-label', `Move ${entry.name} up`);
      up.addEventListener('click', () => {
        [data.entries[index-1], data.entries[index]] = [data.entries[index], data.entries[index-1]];
        resetForm(); persist(); render();
      });
      actions.append(up);
    }
    wrapper.append(registryCard(entry), actions); list.append(wrapper);
  });
}
$('#registryForm').addEventListener('submit', event => {
  event.preventDefault();
  const url = $('#entryUrl').value.trim();
  if (!validLink(url)) { $('#formStatus').textContent = 'Enter a complete public link starting with https://.'; return; }
  const entry = { name: $('#entryName').value.trim(), type: $('#entryType').value, url, note: $('#entryNote').value.trim() };
  if (!entry.name) { $('#formStatus').textContent = 'Enter a registry or gift name.'; return; }
  if (data.entries.some((item, i) => item.url === url && i !== editing)) { $('#formStatus').textContent = 'This link is already in your draft.'; return; }
  if (editing < 0 && data.entries.length >= 100) { $('#formStatus').textContent = 'Use a complete registry for larger wish lists.'; return; }
  if (editing >= 0) data.entries[editing] = entry; else data.entries.push(entry);
  resetForm(); persist(); render();
  $('#formStatus').textContent = storageAvailable ? 'Draft saved in this browser. Publish below to show it to guests.' : 'Draft updated. Browser storage is unavailable, so copy or download it before leaving.';
});
$('#registryMessage').addEventListener('input', () => { data.intro = $('#registryMessage').value; persist(); });
$('#cancelEdit').addEventListener('click', resetForm);
$('#copyRegistry').addEventListener('click', async () => {
  try {
    validateRegistry(data);
    await navigator.clipboard.writeText($('#registryOutput').value);
    $('#publishStatus').textContent = 'Copied. Open GitHub, replace the file contents, and commit the changes to publish.';
  } catch {
    $('#registryOutput').closest('details').open = true;
    $('#registryOutput').focus(); $('#registryOutput').select();
    $('#publishStatus').textContent = 'Automatic copy is unavailable. Copy the selected file contents manually.';
  }
});
$('#downloadRegistry').addEventListener('click', () => {
  const url = URL.createObjectURL(new Blob([$('#registryOutput').value], {type:'application/json'}));
  const link = document.createElement('a'); link.href = url; link.download = 'registry.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('#resetDraft').addEventListener('click', async () => {
  if (!confirm('Discard this browser draft and reload the published registry?')) return;
  try { data = await loadRegistry(); resetForm(); persist(); render(); $('#publishStatus').textContent = 'Published version loaded.'; }
  catch { $('#publishStatus').textContent = 'Could not reload. Your current draft is still here.'; }
});
try {
  data = await loadRegistry();
  let hasDraft = false;
  try {
    const saved = localStorage.getItem(draftKey);
    if (saved) { const draft = validateRegistry(JSON.parse(saved)); hasDraft = JSON.stringify(draft) !== JSON.stringify(data); if (hasDraft) data = draft; }
  } catch { /* Ignore unusable drafts without changing the published file. */ }
  render(); persist();
  $('#managerLoading').hidden = true;
  $('#managerEditor').hidden = false;
  if (hasDraft) $('#formStatus').textContent = 'Restored your browser draft. It may differ from the live registry.';
} catch {
  $('#managerLoading').textContent = 'Could not load the published registry. Check your connection and reload this page.';
}
