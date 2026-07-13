# CompilableWorld Studio

> Local-first, AI-native visual editor for CompilableWorld's World IR — entities, states, functions, triggers, state machines. Forked from [eveglyph-editor](https://github.com/kakon77777-commits/eveglyph-editor)'s shared workspace core (local files, git, agent bridge, diff review). Part of **EveMissLab**.

Full design: [`docs/compilableworld-studio-v0.1.md`](docs/compilableworld-studio-v0.1.md).

## Current scope (v0.1, GUI editor only)

Per Neo's explicit scope cut: this is **just the editing/viewing surface**, not the full Studio vision. No Validator, Simulator, Compiler, or Runtime pipeline yet — those are real, separate future work (see the whitepaper's ch.14/ch.18 staged plan). What exists right now:

- **State Machine View** (`src/smview.js`) — a `.yaml`/`.yml` file starting with `kind: state_machine` renders as an SVG diagram (states as boxes, transitions as labeled arrows, guard conditions inline).
- **Entity Form View** (`src/entityview.js`) — `kind: entity` renders as a field/value form.
- **Entity Table View** (`src/entityview.js`) — `kind: entity_list` renders as a table, columns unioned across all entities.
- **View registry** (`src/viewregistry.js`) — an ordered `{test, render}` list `preview.js` checks before falling back to Markdown; adding the next view type is one entry, not a growing if/else chain.
- All of these are **read-only projections** of the YAML text — the file itself stays the authoritative source, edited via the normal CodeMirror pane. There's no separate save format and no form inputs writing back into the YAML yet (see "Not done yet").
- Everything else Markdown files already had (editor, live preview, workspace/git/agent-bridge/diff-review) still works unchanged — this is additive, not a replacement of EveGlyph's Markdown editing.

Try it: open `examples/village-inn/` — `relation.acquaintance_to_friend.yaml` / `quest.missing_caravan.yaml` (state machines), `entity.npc_innkeeper.yaml` (form), `entities.village_inn.yaml` (table).

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

- Views are read-only projections — no bidirectional form-input editing that writes back into the YAML yet.
- Graph/dependency view, DSL view (whitepaper ch.3) — not built yet.
- `editor.js`'s language-mode choice (YAML vs Markdown) is still a direct extension check, not part of the view registry.
- Validator, Simulator, Compiler, Runtime, Trace/Observatory — explicitly out of scope for this pass.
- Cosmetic "eveglyph"/"EveGlyph" naming still throughout ~14 files (config keys, `.eveglyph/` workspace-memory convention, "EveGlyph-MD" frontmatter feature) — doesn't block anything, not yet cleaned up.
