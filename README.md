# CompilableWorld Studio

> Local-first, AI-native visual editor for CompilableWorld's World IR — entities, states, functions, triggers, state machines. Forked from [eveglyph-editor](https://github.com/kakon77777-commits/eveglyph-editor)'s shared workspace core (local files, git, agent bridge, diff review). Part of **EveMissLab**.

Full design: [`docs/compilableworld-studio-v0.1.md`](docs/compilableworld-studio-v0.1.md).

## Current scope (v0.1, GUI editor — no Simulator/Compiler/Runtime yet)

Per Neo's explicit scope cut: this is the editing/viewing/validating surface, not the full Studio vision — no Simulator, Compiler, or Runtime pipeline yet (see the whitepaper's ch.14/ch.18 staged plan). What exists right now:

- **State Machine View** (`src/smview.js`) — a `.yaml`/`.yml` file starting with `kind: state_machine` renders as an SVG diagram (states as boxes, transitions as labeled arrows, guard conditions inline).
- **Entity Form View** (`src/entityview.js`) — `kind: entity` renders as a field/value form, **editable**: changing a field and blurring (or Enter) rewrites the YAML in the editor pane. `id`/`kind` stay read-only (whitepaper ch.13.1: stable IDs shouldn't change casually). Nested objects and the Table View stay read-only.
- **Entity Table View** (`src/entityview.js`) — `kind: entity_list` renders as a read-only table, columns unioned across all entities.
- **Validator** (`src/validate.js`) — pure functions, no DOM: `validateStateMachine` (no/undefined initial state, undefined transition endpoints, conflicting transitions, unreachable states via forward BFS), `validateEntity`/`validateEntityList` (missing/duplicate ids). Every issue carries a stable `code` plus a zh-Hant `message` — meant to be read by an agent as much as rendered for a human (`src/diagnostics.js` does the HTML rendering; the data itself is plain JSON). Shown inline in every view (a Diagnostics block, plus unreachable states get a dashed amber border directly on the diagram).
- **Workspace Overview** (`src/overview.js`, "🌐 World" tab) — scans every `.yaml`/`.yml` in the open workspace, classifies each by `kind`, runs the validator on all of them, and lists them grouped by type with pass/fail badges; click a row to jump to that file. Manual (a "Scan workspace" button), not automatic, since it reads every file rather than just the active one. This is the honest version of the whitepaper's ch.7.1 "world overview" for what current IR types actually support — there's no ModuleIR with declared dependencies yet, so it's an inventory, not a real dependency graph (ch.3.4/ch.7.7 — not built).
- **View registry** (`src/viewregistry.js`) — an ordered `{test, render}` list `preview.js` checks before falling back to Markdown; adding the next view type is one entry, not a growing if/else chain.
- Everything else Markdown files already had (editor, live preview, workspace/git/agent-bridge/diff-review) still works unchanged — this is additive, not a replacement of EveGlyph's Markdown editing.

Try it: open `examples/village-inn/` —
- `relation.acquaintance_to_friend.yaml` / `quest.missing_caravan.yaml` — clean state machines
- `entity.npc_innkeeper.yaml` — editable form
- `entities.village_inn.yaml` — table
- `broken.state_machine_with_issues.yaml` / `broken.entity_list_with_issues.yaml` — intentionally broken, to see the Diagnostics block catch real issues
- the "🌐 World" tab → Scan workspace, to see all six inventoried at once

## Quick start

### Windows — one double-click

Double-click **`start-studio.bat`**. First run installs dependencies, then starts the dev server and opens your browser.

### Any platform

```bash
npm install
npm run dev
```

## Relationship to eveglyph-editor

This is a fork, not a shared codebase — `eveglyph-editor` stays the Markdown-document editor; this repo diverges to become the World IR editor. They currently share the same underlying shell (file storage, git integration, agent bridge, diff review, navigation) because that's what was forked, not because of an ongoing dependency. The whitepaper (ch.11) proposes eventually factoring that shared part into a common workspace-core package used by both — not done yet, and not blocking this repo's own progress.

## Not done yet

- Bidirectional editing exists only for the single-Entity Form View; the Table View and State Machine View stay read-only projections.
- `jsYaml.dump()` round-tripping (Form View saves) does not preserve comments or original key order/formatting — a real, known cost of the simple approach, not hidden.
- No Graph/dependency view, no DSL view (whitepaper ch.3) — Workspace Overview is an inventory, not a dependency graph (no IR type declares cross-references yet).
- `editor.js`'s language-mode choice (YAML vs Markdown) is still a direct extension check, not part of the view registry.
- Validator is intra-document only — no cross-file reference checking (whitepaper ch.8.2) since nothing currently references another file's IDs.
- Simulator, Compiler, Runtime, Trace/Observatory — explicitly out of scope for this pass.
- Cosmetic "eveglyph"/"EveGlyph" naming still throughout ~14 files (config keys, `.eveglyph/` workspace-memory convention, "EveGlyph-MD" frontmatter feature) — doesn't block anything, not yet cleaned up.
