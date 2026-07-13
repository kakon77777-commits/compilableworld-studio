// ─── STATE MACHINE VIEW ───────────────────────────────────────────
// Renders a TransitionIR/state-machine YAML document (whitepaper
// compilableworld_studio_mssp_rdr_visual_world_ide_v0.1.md §3.3/§6.7) as an
// SVG diagram: states as boxes, transitions as labeled arrows. This is a
// read-only visualization of the file's own text (the source-of-truth stays
// the YAML in the editor pane) -- there is no separate binary/save format,
// matching Neo's "purely a GUI editor, no runtime pipeline yet" scope cut.
//
// Recognized shape (a single state machine per file, v0.1):
//   kind: state_machine
//   id: relation.acquaintance_to_friend
//   initial: acquaintance
//   states: [acquaintance, friend, ...]      # optional -- inferred from transitions if absent
//   transitions:
//     - from: acquaintance
//       to: friend
//       on: repeated_positive_interaction
//       guards: ["trust >= 0.45", "positive_interactions >= 5"]

import jsYaml from 'js-yaml'
import { validateStateMachine, unreachableStatesOf } from './validate.js'
import { renderDiagnosticsBlock } from './diagnostics.js'

const esc = (s) => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]))

// Sniff without a full parse first -- previewUpdate() calls this on every
// keystroke (debounced), and a malformed in-progress YAML edit shouldn't
// throw mid-typing, it should just fall back to plain-text rendering.
export function isStateMachineDoc(src) {
  return /^\s*kind:\s*state_machine\b/m.test(src)
}

function parseStateMachine(src) {
  const doc = jsYaml.load(src)
  if (!doc || typeof doc !== 'object') throw new Error('not a YAML mapping')
  const transitions = Array.isArray(doc.transitions) ? doc.transitions : []
  const declared = Array.isArray(doc.states) ? doc.states : []
  const seen = new Set(declared)
  for (const t of transitions) {
    if (t.from) seen.add(t.from)
    if (t.to)   seen.add(t.to)
  }
  if (doc.initial) seen.add(doc.initial)
  return { doc, id: doc.id || '(unnamed)', initial: doc.initial || null, states: [...seen], transitions }
}

// Simple layered layout: states in one row (v0.1 -- no attempt at a general
// graph layout algorithm), transitions drawn as arrows between them. Good
// enough for the small guard-gated relationship/quest machines this is
// aimed at (whitepaper's own examples are 3-5 states); a real layout engine
// is explicitly out of scope until there's a real need for one.
export function renderStateMachine(src) {
  let sm
  try {
    sm = parseStateMachine(src)
  } catch (e) {
    return `<div class="sm-error">⚠ Not a valid state_machine document: ${esc(e.message)}</div>`
  }

  const issues = validateStateMachine(sm.doc)
  const unreachable = unreachableStatesOf(issues)

  const boxW = 150, boxH = 56, gapX = 90, gapY = 100
  const cols = Math.max(1, sm.states.length)
  const width = cols * boxW + (cols - 1) * gapX + 40
  const pos = new Map()
  sm.states.forEach((s, i) => pos.set(s, { x: 20 + i * (boxW + gapX), y: 30 }))

  // Self/back edges (to a state earlier in the row) get routed as an arc
  // below the row instead of overlapping forward edges.
  let maxArc = 0
  const edgesSvg = sm.transitions.map((t, i) => {
    const a = pos.get(t.from), b = pos.get(t.to)
    if (!a || !b) return ''
    const guardLabel = Array.isArray(t.guards) && t.guards.length ? t.guards.join(' ∧ ') : ''
    const onLabel = t.on ? `on ${t.on}` : ''
    const label = [onLabel, guardLabel].filter(Boolean).join('  ·  ')
    const forward = b.x >= a.x
    const y = boxH + 30
    if (forward) {
      const x1 = a.x + boxW, x2 = b.x
      const midX = (x1 + x2) / 2
      return `
        <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="var(--sm-edge)" stroke-width="1.6" marker-end="url(#sm-arrow)"/>
        <text x="${midX}" y="${y - 8}" text-anchor="middle" class="sm-edge-label">${esc(label)}</text>
      `
    }
    // back-edge: arc below the row
    const arcY = boxH + 70 + (i % 3) * 34
    maxArc = Math.max(maxArc, arcY + 20)
    const x1 = a.x + boxW / 2, x2 = b.x + boxW / 2
    return `
      <path d="M ${x1} ${boxH} C ${x1} ${arcY}, ${x2} ${arcY}, ${x2} ${boxH}" fill="none" stroke="var(--sm-edge)" stroke-width="1.6" marker-end="url(#sm-arrow)"/>
      <text x="${(x1+x2)/2}" y="${arcY + 14}" text-anchor="middle" class="sm-edge-label">${esc(label)}</text>
    `
  }).join('\n')

  const nodesSvg = sm.states.map(s => {
    const p = pos.get(s)
    const isInitial = s === sm.initial
    const isUnreachable = unreachable.has(s)
    const cls = ['sm-node', isInitial && 'sm-node-initial', isUnreachable && 'sm-node-unreachable'].filter(Boolean).join(' ')
    return `
      <g class="${cls}">
        <rect x="${p.x}" y="${p.y}" width="${boxW}" height="${boxH}" rx="8"/>
        <text x="${p.x + boxW/2}" y="${p.y + boxH/2 + 5}" text-anchor="middle">${esc(s)}${isUnreachable ? ' ⚠' : ''}</text>
      </g>
    `
  }).join('\n')

  const height = Math.max(boxH + 60, maxArc + 20)

  return `
    <div class="sm-view">
      <div class="sm-header">
        <span class="sm-id">${esc(sm.id)}</span>
        ${sm.initial ? `<span class="sm-initial-tag">initial: ${esc(sm.initial)}</span>` : ''}
        <span class="sm-count">${sm.states.length} states · ${sm.transitions.length} transitions</span>
      </div>
      <svg viewBox="0 0 ${width} ${height + 30}" width="100%" style="max-width:${width}px">
        <defs>
          <marker id="sm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="var(--sm-edge)"/>
          </marker>
        </defs>
        <g transform="translate(0,${boxH})">${edgesSvg}</g>
        ${nodesSvg}
      </svg>
      ${renderDiagnosticsBlock(issues)}
      <details class="sm-raw">
        <summary>Raw transitions</summary>
        <table class="sm-table">
          <thead><tr><th>from</th><th>to</th><th>on</th><th>guards</th></tr></thead>
          <tbody>
            ${sm.transitions.map(t => `<tr>
              <td>${esc(t.from ?? '')}</td>
              <td>${esc(t.to ?? '')}</td>
              <td>${esc(t.on ?? '')}</td>
              <td>${Array.isArray(t.guards) ? t.guards.map(g => `<code>${esc(g)}</code>`).join('<br>') : ''}</td>
            </tr>`).join('\n')}
          </tbody>
        </table>
      </details>
    </div>
  `
}
