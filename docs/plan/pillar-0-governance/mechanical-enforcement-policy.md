---
id: csps.pillar-0-governance.mechanical-enforcement-policy
name: mechanical-enforcement-policy
description: >
  The CSPS policy governing when governance declarations require mechanical enforcement
  vs. when human judgment is explicitly accepted. Governor directive S018: "If no
  mechanical solution works — why bother?" This policy is the answer. Every governance
  declaration must reach at least Tier 2 (week-4 mechanical) or be labeled human-judgment
  explicitly. Documentation-only governance that never reaches mechanical enforcement
  is not governance — it is aspiration, and aspiration drifts.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
enforcement_stage: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:stable
session: S018
impl_status: swift-implemented
links:
  - { rel: parent, href: ./README.md }
  - { rel: frontmatter-enums, href: ./frontmatter-closed-enums.md }
  - { rel: enforcement-stage, href: ../../../tools/validators/validate-frontmatter.mjs }
  - { rel: contracts, href: ./behavioral-contracts.md }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/frontmatter-closed-enums.md
  - tools/validators/validate-frontmatter.mjs
  - AGENTS.md
domain_path: platform
diataxis_type: how-to
core_spine: AI
schema_anchor: pillar_0_governance_leaves
scope_level: S1
---

# Mechanical Enforcement Policy

> **Governor directive S018:** "If no mechanical solution works — why bother? Create a policy on which ones to create mechanical solutions — always with context!"
>
> **The core principle:** Documentation-only governance drifts. If a rule matters, it becomes a gate, hook, validator, or contract — not just prose. If none of those work, the rule is in the "human-judgment" tier and must be explicitly labeled as such, not mistaken for mechanical enforcement.

---

## The Four Tiers

### Tier 1 — Must Be Mechanical (no exceptions, same session)

**Applies when ANY of:**
- Violation causes: data loss / security breach / cross-tenant data exposure / session close without evidence
- The rule has K≥2 violations (B_STRUCTURAL_PREVENTION_DISCIPLINE triggers engraving)
- The check is fully deterministic (a computer can evaluate it with 100% accuracy)
- The blast radius is BR3 (platform-wide impact)

**Mechanical form:** validator in `tools/validators/` + wired in `tools/verify.mjs` + exits 1 on violation.

**`enforcement_stage: active`** — the validator IS running in pnpm verify.

**Examples:**
- `validate-bedrock.mjs` — never declare foundation complete without evidence
- `validate-vlt-blocking.mjs` — never advance with PENDING VLTs
- `validate-phase-exit-criteria.mjs` — never skip phase gate
- `validate-foundation-schema-drift.mjs` — never let ZModel ↔ Prisma drift

**Failure mode prevented:** "We said it's done but didn't verify." The validator makes this impossible.

---

### Tier 2 — Should Be Mechanical (week-4, registered now)

**Applies when:**
- The check is deterministic but building the validator costs more than one session
- The rule recurs regularly enough to justify automation investment
- The blast radius is BR2 (app-level impact)

**Mechanical form:** Audit slug registered in audit-runner.md with `enforcement_stage: week-4` + validator planned in `tools/validators/` + will wire into pnpm verify when built.

**Key discipline:** Register the slug ATOMICALLY when ratifying the rule. Never let a rule exist in prose without a registered slug.

**Examples:**
- `token-budget-clear-discipline` — registered S018, builds week-4
- `vocabulary-canon-completeness` — registered S018, builds week-4
- `template-compliance` — stub active, promotes to blocking week-4

**What "week-4" means:** The build-order.md week-4 batch is when validators requiring session-log analysis, complex state tracking, or external tooling are built. Week-4 is not a deferral — it's a scheduled build window.

---

### Tier 3 — Human Judgment (explicitly labeled, permanent)

**Applies when:**
- The check requires semantic/qualitative assessment that cannot be codified
- The rule governs creative or architectural decisions where "correct" depends on context
- No algorithm can evaluate compliance without human review

**Mechanical form:** NONE. BUT must have:
- `enforcement_stage: human-judgment` in the artifact frontmatter
- A SELF-ASSESSMENT QUESTION the AI asks before proceeding (not a validator, a prompt)
- Explicitly excluded from ZF cycles (cannot be "passed" by a validator)

**`enforcement_stage: human-judgment`** — declared as explicitly non-mechanical.

**Examples:**
- `push-back-on-conflict` — requires semantic session-log analysis of missed push-back. Cannot be deterministic. Question: "Did I agree with something that contradicts a registered principle without citing evidence?"
- `architectural-decision-soundness` — no algorithm can verify architectural quality. Question: "Does this decision create more problems than it solves at scale?"
- `cec-quality-assessment` — a CEC walk can be checked for COMPLETION (did you walk all 8 surfaces?) but not for QUALITY (did you find everything meaningful?)

**Anti-pattern:** Calling something "mechanical" when it's actually Tier 3. The `enforcement_stage: active` on such rules is false governance — it implies a validator exists when the check is human judgment.

---

### Tier 4 — Do Not Write (no path to enforcement)

**Applies when:**
- The rule cannot reach Tier 1-3 by any path
- The rule is aspirational with no evaluable criteria
- Writing it produces documentation debt without governance value

**Mechanical form:** DO NOT WRITE IT. Delete it if it exists.

**The test:** Can you write a self-assessment question (Tier 3 minimum) that a human or AI can actually answer? If not: Tier 4.

**Examples of Tier 4 (should not exist as rules):**
- "Always write good code" — no evaluable criteria
- "Think carefully before acting" — no assessment question possible
- "Be aligned with CSPS philosophy" — too abstract to evaluate

---

## The Policy in Practice

### Before Writing Any New Rule:

1. **Can I write a validator that checks this?** → Tier 1 or 2 (register the slug NOW)
2. **Can I write a self-assessment question?** → Tier 3 (label it `enforcement_stage: human-judgment`)
3. **Neither?** → Don't write it. Archive the thought in raw-thoughts.md if worth keeping.

### For Existing Rules Without Enforcement:

Run `validate-template-compliance.mjs` weekly (when active). Every governance artifact with `enforcement_stage: planned` older than 2 sessions → flag for review: build it, label it human-judgment, or delete it.

### The Positive ZF Gap (the honest problem this policy fixes):

Negative ZF is mechanical: validators run, hooks fire, pnpm verify gates commits.

Positive ZF is behavioral: CEC is advisory, extraction is blocking but not quality-checked.

**Fix:** Every session close must include `§10.0n Positive ZF evidence` with:
```
positive_discoveries:
  - discovery: [what was found]
    cec_ran: yes | no | human-judgment
    cec_surfaces: [1-8 number, or "N/A — human judgment"]
    vault_path: [where it was extracted to]
```

If `cec_ran: no` for any significant discovery → session extraction is INCOMPLETE → `extraction-check-blocking` blocks ZF ACHIEVED.

This is the mechanical closure of the positive ZF gap. One new field. One new check in the extractor.

---

## Enforcement Stage — Canonical Values

| Value | Meaning | Consuming validator | Blocks ZF? |
|---|---|---|---|
| `stub` | Shell exists, exits 0, zero enforcement | `verify-hooks-functional.sh` | No |
| `planned` | Registered, design documented, not built | (none) | No |
| `week-4` | Registered, builds in week-4 batch | `validate-enforcement-stage-progression.mjs` (planned) | No |
| `active` | Validator running in pnpm verify, exits 1 on violation | `validate-audit-slug-coverage.mjs` | YES |
| `human-judgment` | Explicitly non-mechanical; AI self-assessment only | (none — by design) | No |

**The `human-judgment` value is new (S018).** It acknowledges Tier 3 rules explicitly rather than letting them drift as undeclared "planned" items that never get built because they can't be built.

---

## The ZF Gap Closure

**Problem identified (S018 honest audit):**
- Negative ZF: ~90% mechanical
- Positive ZF: ~40% mechanical
- Gap: 50%

**Root cause:** Positive events (ratifications, discoveries, insights) have no mechanical trigger that forces CEC. The CEC hook fires on methodology doc EDITS but not on positive EVENTS.

**Mechanical fix (S018, immediate):**
1. Add `positive_zf_evidence:` to closing-summary-template.md §10.0n
2. `extraction-check-blocking` validator checks for this section
3. Positive discoveries without CEC evidence → advisory (not blocking initially)
4. After 2 sessions without improvement → K=2 rule → promote to blocking

**Human-judgment remainder:**
CEC QUALITY cannot be mechanically assessed. We can check that CEC ran (mechanical). We cannot check that CEC found everything meaningful (human-judgment). Accept this limitation explicitly rather than pretending it's mechanical.

---

## Canonical ZF Definition (INST-VALD-001)

> **THE LAST RUN PRODUCING "STATUS: ZF ACHIEVED ✅ — 0 blocking findings remain" IS THE ONLY PROOF OF ZF. No other output. No other interpretation. No other version is approved. A re-run that reduces findings from 5 to 2 is progress — it is NOT ZF ACHIEVED. Progress toward zero is not zero.**
>
> This is the mandatory definition. Any deviation — including citing prior-session ZF results, or treating advisory-only findings as BLOCKING-clean — is Tier 4 governance (do not write it, do not claim it).

## Hard Rule (AGENTS.md addition)

> ❌ Never write a governance rule that cannot reach at least enforcement_stage: human-judgment. Documentation-only governance is not governance — it is aspiration, and aspiration drifts. If the rule matters, it becomes a gate, hook, validator, or self-assessment question. If none of those work: don't write it.
