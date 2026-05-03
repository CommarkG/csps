---
name: reuse-check
description: Catalog similarity search before any artifact creation. Returns top-5 matches with cosine scores + cited frontmatter. Triggers BEFORE proposing any new slice / skill / agent / page / ZModel pattern / validator / prose. Per P-OP-001 (reuse-first) — the killer enforcer of the platform's most important principle. Output guides enhance-existing vs create-new decision.
allowed_tools: [Read, Grep, Glob]
allowed_subagents: []
allowed_outbound_hosts: []
allowed_db_operations: [read]
sensitive_data_access: false
backed_by_principle: P-OP-001
generated_by: principles-codegen
generated_from: packages/principles/principles.yaml#P-OP-001
last_generated_at: 2026-05-03T08:30:00Z
references_future_artifact: true
lifecycle: experimental
lifecycle_state: active
next_review_at: 2026-08-01
---

# /reuse-check — Catalog similarity search

## When to invoke

Per AGENTS.md hard NO ("Before creating any artifact: query the catalog first") — invoke BEFORE proposing creation of:
- Slice / app / feature pack
- Skill / agent / persona
- Page / wizard / template
- ZModel pattern / validator / hook
- Substantive prose document

## When to skip

- Bug fixes to existing artifacts (no creation; just modification)
- Within an approved batch where reuse-check was performed at batch-start
- Trivial tagged additions (a comment, a typo fix)

## Procedure

1. **Tokenize the proposed artifact's purpose** — extract domain + concept terms
2. **Query the catalog** — `pnpm catalog:search "<terms>"` (post-runtime) OR Grep `packages/catalog/catalog.json` (pre-runtime stub)
3. **Compute similarity** — cosine similarity over frontmatter (description + tags + crosscutting)
4. **Return top-5** with scores

## Output format

```markdown
## Reuse-check for: <proposed-artifact-name>

Top matches:

| # | ID | Path | Cosine | Description (front 80 chars) |
|---|---|---|---|---|
| 1 | <id> | <path> | 0.87 | <description excerpt> |
| 2 | <id> | <path> | 0.71 | <description excerpt> |
| 3 | <id> | <path> | 0.62 | <description excerpt> |
| 4 | <id> | <path> | 0.45 | <description excerpt> |
| 5 | <id> | <path> | 0.31 | <description excerpt> |

**Verdict:**
- If top match cosine ≥0.70: enhance the match (P-OP-001 default). Add `enhances: <id>` to your frontmatter.
- If top match 0.40-0.70: investigate the match before deciding.
- If top match <0.40: genuinely new artifact OK. Add `created-new-because: <multi-line-justification>` citing the closest match + why enhancement is wrong.
```

## Discipline rules

1. **Top match cosine ≥0.70 = strong reuse signal** — proceeding with `--new` requires explicit `created-new-because:` overriding this
2. **Counterweight (Sandi Metz wrong-abstraction)** — if the ratified thing is the WRONG abstraction, inline-and-redecide; don't enhance a broken design
3. **Search MUST happen before naming** — naming the new artifact first creates anchor bias against existing matches
4. **Cite the search result in your frontmatter** — `created-new-because:` text references the top match by ID; provides traceability

## Industry lineage

- Backstage Software Catalog (entity discovery before scaffolding)
- Spotify Golden Paths (paved roads — search the existing road first)
- IDF Mission Command planning ("did anyone do this before?" is the first question)

## Backed by

P-OP-001 (reuse-first). Full text + 10 enforcers in [packages/principles/principles.yaml#P-OP-001](../../principles/principles.yaml).
