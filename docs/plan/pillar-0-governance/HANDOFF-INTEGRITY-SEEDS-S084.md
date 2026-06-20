---
id: csps.governance.handoff-integrity-seeds-S084
name: HANDOFF-INTEGRITY-SEEDS-S084
description: >
  Two Opus-authored core seeds closing handoff/integrity gaps found S084 (Opus #22): (A) Register-Reference-
  Integrity — every register-ID referenced anywhere must resolve to its canonical register (the PARK-040 ghost-ref
  class); (B) Moat-Update-in-Handoff — moat review/update becomes a hardwired step at every tab/session boundary.
  Both are no-lost-threads (P-META-033) + accountability enforcements. Opus seeds; Sonnet builds.
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-22
core_spine: VALD
diataxis_type: reference
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: architecture-pending
vault_pending:
  vlt: VLT-S084-HANDOFF-INTEGRITY
  retrieve_when: "Sonnet builds SEED-A (validate-register-reference-integrity) + SEED-B (moat-in-handoff step) per this spec"
precedent_checked: true
links:
  - { rel: dead-links, href: ../../../tools/validators/validate-dead-links.mjs }
  - { rel: park-register, href: ../../../tools/data/park-register.yaml }
  - { rel: no-lost-threads, href: ../../../packages/principles/principles/P-META-033-no-lost-threads.yaml }
---

# Handoff-Integrity Core Seeds (S084)

## SEED-A — Register-Reference-Integrity (the PARK-040 ghost-ref fix, deep + hardwired)

**Root cause:** "PARK-040" was written into 3 handoffs while it existed in no register. `validate-dead-links`
checks file paths, not register IDs — so a dangling ID is invisible. **Rule:** every register-ID referenced
in any tracked file MUST resolve to an entry in its canonical register; an unresolved reference is a defect
(register-it or fix-the-typo), never silently shipped.

**CANONICAL-REGISTERS MANIFEST (the ID → register map; the SSoT for resolution):**
```yaml
register_id_patterns:
  - id_regex: 'PARK-S\d{3}-\d{3}'         register: tools/data/park-register.yaml            key: 'id'
  - id_regex: 'PROTO-S\d{3}-[A-Z0-9-]+'   register: tools/council/opus-turn.md               key: 'header'
  - id_regex: 'M-\d{2}'                    register: docs/plan/pillar-0-governance/moat-registry.md  key: 'row'
  - id_regex: 'VLT-S\d{3}-[A-Z0-9-]+'      register: tools/data/*vlt*.yaml | frontmatter vault_pending  key: 'vlt'
  - id_regex: 'imp_[A-Z_]+'                register: tools/data/improvement-register.yaml     key: 'id'
  - id_regex: 'gap_[A-Z0-9_]+'             register: tools/data/gap-recurrence-register.yaml   key: 'id'
  - id_regex: 'SEED-\d'                     register: docs/plan/pillar-0-governance/JOURNEY-SEEDS-S084.md  key: 'heading'
```

**BUILD HANDOFF (Sonnet) — `validate-register-reference-integrity.mjs` (EXTENDED):**
- Scan tracked `.md`/`.yaml` for each `id_regex`; for every match, confirm the ID exists in its canonical register.
- Unresolved → ADVISORY finding `{ref_id, referenced_in:file:line, canonical_register, action: "register-or-typo-fix"}`.
- BLOCKING only at the handoff/session-close gate (a handoff that cites a ghost ID is blocked).
- Reuse the `validate-dead-links` scan skeleton; extend from file-paths to register-IDs (no fork).
- run_tier: EXTENDED. Register the slug in audit-runner.md. Hash-cache: `@input_files` = the register files.

**Why deep + permanent:** this makes "no-lost-threads" (P-META-033) MECHANICAL for register IDs — a referenced
obligation can no longer exist only in prose. It is the structural cure for the ghost-ref class, not a one-off fix.

## SEED-B — Moat-Update-in-Handoff (hardwired boundary step)

**Root cause:** moats (`moat-registry.md`, M-NN) are not reviewed at tab/session boundaries — no handoff step,
no validator. Moats drift silently across handoffs.

**Rule:** every tab-transfer + session-close handoff MUST include a **MOAT REVIEW** block: which moats this
tab/session touched, strengthened, or put at risk, and any moat-registry update made (or "none, with reason").

**BUILD HANDOFF (Sonnet):**
- Add a `## MOAT REVIEW` required section to `tools/templates/boundary-prompt.template.md` + the slim-handoff /
  governance-session skills (Zone-structure).
- Extend the handoff validator (the §17/handoff-completeness check) to require the MOAT REVIEW block — ADVISORY
  first, BLOCKING after one incident (S067→S068 ladder).
- Cross-wire to `validate-moat-coverage.mjs` (already exists): the handoff block references its output, so the
  review is evidence-backed, not prose.

**Why:** moats are the platform's durable advantages; an unreviewed moat is an unguarded one. This makes moat
stewardship a boundary obligation (accountability T5 handoff-receipt), inheritable by every tab.

## ZF gate (this seed)
- Cycle 1: both seeds have Rule + canonical manifest/step + BUILD HANDOFF + why-permanent. No floating ref.
- Cycle 2 (fresh angle — self-application): SEED-A's own manifest lists every register THIS doc cites
  (PARK/PROTO/M/VLT/imp/gap/SEED) — so the validator that builds from it would validate this very file. Coherent.
