---
name: Know-How Discipline — plans must consult error registry before creation and closure
description: Plans declared done with gaps because implicit requirements were never explicit. B_KNOW_HOW_DISCIPLINE mandates §KH section in every new plan + EP-NNN extraction at session close.
type: feedback
---

Every new plan MUST include `## §KH Know-How Consultation` section with SPECIFIC mitigations from the know-how registry before authoring the plan body.

**Why:** S011 had 7 gap classes in plans declared "done" (EP-001→EP-007) — stale artifacts, silent orphans, missing audit slug registrations, post-close tracking gaps, legacy debt, code quality blind spots, governor prompt gaps. All were IMPLICIT requirements that should have been explicit.

**How to apply:** Before creating any plan that ships code/validators/governance artifacts:
1. Read `docs/plan/_handoff/VAULT/know-how/checklists/pre-plan-creation.md`
2. Generate §KH section with SPECIFIC answers to each item
3. Include `know_how_consulted: true` in frontmatter

**Before closing any plan:**
1. Run `pnpm verify --skip-install` — must exit 0
2. Walk `docs/plan/_handoff/VAULT/know-how/checklists/pre-plan-close.md` — every item checked

**At session close:**
1. Run `node tools/know-how-extractor.mjs` to extract insights from §10.0j + §10.13b
2. Classify into EP-NNN files
3. K=2 same pattern → promote to B_* contract or P-META amendment

**Mechanical enforcement:** `validate-plan-know-how.mjs` in pnpm verify catches new plans without §KH.

**Why:** P-META-019 B_STRUCTURAL_PREVENTION_DISCIPLINE Q-2 — the same gaps recurring = engraving NOW. S011 §24++++ root-cause analysis surfaced this as the platform's biggest single source of rework.
