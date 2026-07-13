# User Guide

## What this is right now

CompilableWorld Studio is, for now, **just the editing surface** for CompilableWorld's World IR — not the full Studio vision described in `docs/compilableworld-studio-v0.1.md`. No Validator, Simulator, Compiler, or Runtime yet.

## State Machine View

Open (or create) a `.yaml`/`.yml` file whose content starts with:

```yaml
kind: state_machine
id: my.machine.id
initial: some_state
transitions:
  - from: some_state
    to: other_state
    on: some_event
    guards:
      - "condition >= 0.5"
```

The preview pane (right side) renders this as a diagram instead of Markdown — boxes for states, labeled arrows for transitions, with a raw transitions table underneath. Everything else (editing, saving, git diff, agent runs) works exactly as it does for any other file in the workspace; the diagram is a read-only projection of the YAML text, not a separate save format.

## Everything else

Workspace open/save, tabs, search, the local agent bridge, and diff review all work the same as they do for Markdown files — this app was forked from `eveglyph-editor`, and those parts weren't changed.
