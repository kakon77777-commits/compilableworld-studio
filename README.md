# CompilableWorld Studio

> Local-first, AI-native visual editor for CompilableWorld's World IR — entities, states, functions, triggers, state machines. Forked from [eveglyph-editor](https://github.com/kakon77777-commits/eveglyph-editor)'s shared workspace core (local files, git, agent bridge, diff review). Part of **EveMissLab**.

Full design: [`docs/compilableworld-studio-v0.1.md`](docs/compilableworld-studio-v0.1.md).

## Current scope (v0.1, GUI editor only)

Per Neo's explicit scope cut: this is **just the editing/viewing surface**, not the full Studio vision. No Validator, Simulator, Compiler, or Runtime pipeline yet — those are real, separate future work (see the whitepaper's ch.14/ch.18 staged plan). What exists right now:

- **State Machine View** (`src/smview.js`) — open a `.yaml`/`.yml` file starting with `kind: state_machine` and the preview pane renders it as an SVG diagram (states as boxes, transitions as labeled arrows, guard conditions inline) instead of Markdown. The file itself stays plain YAML text in the editor — this is a read-only projection of it, not a separate save format.
- Everything else Markdown files already had (editor, live preview, workspace/git/agent-bridge/diff-review) still works unchanged — this is additive, not a replacement of EveGlyph's Markdown editing.

Try it: open `examples/village-inn/` and look at `relation.acquaintance_to_friend.yaml` or `quest.missing_caravan.yaml`.

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

- No pluggable view registry — swapping content types is still a direct edit to `editor.js`/`preview.js` (noted as a real gap during the fork).
- Form View, Table View, Graph/dependency view, DSL view (whitepaper ch.3) — only the State Machine View exists so far.
- Validator, Simulator, Compiler, Runtime, Trace/Observatory — explicitly out of scope for this pass.
