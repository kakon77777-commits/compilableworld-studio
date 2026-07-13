# Changelog

## 0.1.0 — 2026-07-13

- Forked from `eveglyph-editor` 0.4.0.
- Added the State Machine View (`src/smview.js`): `.yaml`/`.yml` files starting with `kind: state_machine` render as an SVG state diagram in the preview pane instead of Markdown.
- Added `@codemirror/lang-yaml` and `js-yaml`; the editor now picks YAML or Markdown syntax highlighting based on the open file's extension.
- Rebranded shell (title, topbar, placeholder text) from EveGlyph Editor to CompilableWorld Studio.
- Removed EveGlyph-MD-specific example content; added `examples/village-inn/` with two real state-machine documents (a relationship-guard example and a quest example, both taken from this project's own whitepapers).
- Removed EveGlyph's own CONTRIBUTING/SECURITY/PROGRESS docs (not applicable here, not yet rewritten for this project).
