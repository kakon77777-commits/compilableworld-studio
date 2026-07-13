# Example workspace

Open this `examples/` folder in CompilableWorld Studio (Open Folder) to explore.

- `village-inn/relation.acquaintance_to_friend.yaml` — the guard-gated relationship transition example from `docs/from_jianghu_mod_agent_project_plan_v0.1.md` ch.4.3, rendered as a state diagram.
- `village-inn/quest.missing_caravan.yaml` — the quest example from `docs/compilableworld-studio-v0.1.md` ch.6.7 (TransitionIR), rendered as a state diagram.
- `village-inn/entity.npc_innkeeper.yaml` — a single EntityIR document (ch.3.1), rendered as a Form View.
- `village-inn/entities.village_inn.yaml` — a multi-entity EntityIR document (ch.3.2), rendered as a Table View.
- `village-inn/broken.state_machine_with_issues.yaml` / `village-inn/broken.entity_list_with_issues.yaml` — intentionally broken, exercise `src/validate.js`'s checks (unreachable state, conflicting transition, duplicate id, missing id) — open these to see the Diagnostics block at the bottom of each view.

Any `.yaml`/`.yml` file starting with `kind: state_machine` / `kind: entity` / `kind: entity_list` gets a specialized read-only projection in the preview pane instead of Markdown — the file itself stays plain YAML text in the editor, this is just a different way of displaying it (see `src/viewregistry.js`). Every projection now also runs `src/validate.js` and shows a Diagnostics block (errors/warnings) at the bottom.
