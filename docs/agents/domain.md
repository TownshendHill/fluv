# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

**Layout: single-context.** One glossary (`CONTEXT.md`) and one ADR directory (`docs/adr/`), both at the repo root. Application source lives under `frontend/src/`, so ADRs sit at the repo root rather than beside the code.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root: the project's glossary.
- **`docs/adr/`**: read ADRs that touch the area you're about to work in.

If either of these doesn't exist, **proceed silently**. Don't flag its absence; don't suggest creating it upfront. The `/domain-modeling` skill (reached via `/grill-with-docs` and `/improve-codebase-architecture`) creates them lazily when terms or decisions actually get resolved.

## File structure

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-some-decision.md
│   └── 0002-another-decision.md
└── frontend/src/
```

If this repo ever grows a second bounded context — a region where a domain word takes on a genuinely different meaning, not merely a second app or deployable — switch to multi-context: add a root `CONTEXT-MAP.md` pointing at one `CONTEXT.md` per context, and update this file. Adding a backend, a CMS, or a mobile client does not on its own require the split.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0007 (event-sourced orders), but worth reopening because…_
