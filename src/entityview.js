// ─── ENTITY VIEW ──────────────────────────────────────────────────
// Renders EntityIR documents (whitepaper compilableworld_studio_mssp_rdr_
// visual_world_ide_v0.1.md §3.1/§3.2, §6.2) as read-only projections of the
// YAML text -- same pattern as smview.js: the file itself stays the
// authoritative source, edited via the CodeMirror pane; this is a
// comprehension aid, not a separate save format or a form with its own
// input widgets writing back into the YAML (that bidirectional-sync is
// real future work, not yet built -- see this repo's README "Not done yet").
//
// Two recognized shapes (v0.1):
//
//   kind: entity              # single entity -> Form View
//   id: npc.innkeeper
//   type: character
//   name: 馬洛
//   location: room.inn.main
//   traits: [cautious, pragmatic]
//
//   kind: entity_list         # many entities -> Table View
//   entities:
//     - id: npc.innkeeper
//       type: character
//       name: 馬洛
//       location: room.inn.main
//     - id: item.old_map
//       type: item
//       name: 破舊地圖
//       location: room.inn.cellar

import jsYaml from 'js-yaml'

const esc = (s) => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]))

export function isEntityDoc(src) {
  return /^\s*kind:\s*entity\b/m.test(src)
}

export function isEntityListDoc(src) {
  return /^\s*kind:\s*entity_list\b/m.test(src)
}

// Fields that get their own header treatment in the form; everything else
// in the document is rendered generically below them, in document order,
// so a world author's custom fields (whatever they are) still show up
// instead of being silently dropped.
const FORM_HEADER_FIELDS = ['kind', 'id', 'type']

function formatValue(v) {
  if (Array.isArray(v)) return v.map(x => `<span class="ev-chip">${esc(x)}</span>`).join(' ')
  if (v && typeof v === 'object') return `<pre class="ev-nested">${esc(jsYaml.dump(v).trimEnd())}</pre>`
  return esc(String(v))
}

export function renderEntityForm(src) {
  let doc
  try {
    doc = jsYaml.load(src)
  } catch (e) {
    return `<div class="sm-error">⚠ Not a valid entity document: ${esc(e.message)}</div>`
  }
  if (!doc || typeof doc !== 'object') return `<div class="sm-error">⚠ Not a valid entity document: empty or not a mapping</div>`

  const rest = Object.keys(doc).filter(k => !FORM_HEADER_FIELDS.includes(k))

  return `
    <div class="ev-form">
      <div class="ev-form-header">
        <span class="ev-type-tag">${esc(doc.type || 'entity')}</span>
        <span class="ev-id">${esc(doc.id || '(no id)')}</span>
      </div>
      <table class="ev-field-table">
        <tbody>
          ${rest.map(k => `<tr><th>${esc(k)}</th><td>${formatValue(doc[k])}</td></tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  `
}

export function renderEntityTable(src) {
  let doc
  try {
    doc = jsYaml.load(src)
  } catch (e) {
    return `<div class="sm-error">⚠ Not a valid entity_list document: ${esc(e.message)}</div>`
  }
  const entities = Array.isArray(doc?.entities) ? doc.entities : []
  if (!entities.length) return `<div class="sm-error">⚠ entity_list document has no entities</div>`

  // Column set = union of keys across all entities, id/type/name first if
  // present (the common case), everything else after in first-seen order --
  // a world author's per-entity extra fields still get a column instead of
  // being dropped, same "don't silently drop custom fields" rule as the form.
  const priority = ['id', 'type', 'name']
  const seen = new Set()
  const cols = []
  for (const key of priority) if (entities.some(e => key in (e || {}))) { cols.push(key); seen.add(key) }
  for (const e of entities) for (const k of Object.keys(e || {})) if (!seen.has(k)) { cols.push(k); seen.add(k) }

  return `
    <div class="ev-table-view">
      <div class="ev-form-header">
        <span class="ev-type-tag">entity_list</span>
        <span class="ev-count">${entities.length} entities</span>
      </div>
      <table class="ev-field-table ev-list-table">
        <thead><tr>${cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>
          ${entities.map(e => `<tr>${cols.map(c => `<td>${c in (e || {}) ? formatValue(e[c]) : ''}</td>`).join('')}</tr>`).join('\n')}
        </tbody>
      </table>
    </div>
  `
}
