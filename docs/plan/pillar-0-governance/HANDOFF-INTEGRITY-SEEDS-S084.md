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

## SEED-C — DUAL-COVERAGE + Context-Independent Audit standard (the durable layer)

**Top-expert definition (the principle):** every governance obligation that can drift is covered by TWO layers —
a **handoff step** (SOFT: context-dependent, in-the-moment, depends on a tab remembering — convenient but shaky)
AND a **recurring audit** (HARD: context-INDEPENDENT, mechanical, runs whether or not anyone remembers — the
guarantee). The handoff is never the guarantee; the audit is. This generalizes PARK-S084-037 (context-independence)
from 3-scopes to ALL governance, and is the precise meaning of "active" (vs EXISTS≠ACTIVE / AP-001).

**CONTEXT-INDEPENDENCE TEST — an audit qualifies as the hard layer iff ALL THREE hold:**
```
1. SOURCE: reads ONLY persistent artifacts (files / registers / git / db). ZERO dependence on conversation,
           temp memory, session context, or a tab choosing to do it.
2. CADENCE: fires on a schedule (cron / session-open-due / verify-gate) — NOT on someone remembering to run it.
3. SINK:    writes findings to a PERSISTENT register surfaced at session-close — not only into chat.
```
An "audit" that fails any of the three is still SOFT (a dressed-up reminder) and does NOT count as coverage.

**DUAL-COVERAGE rule:** for every drift-prone obligation (moats · parks/obligations · register-refs · file-length ·
`load_mode` · principle-registration · the journey invariants · …) there MUST exist a context-independent recurring
audit. A handoff step with no audit twin = a shaky obligation.

**BUILD HANDOFF (Sonnet):**
- Add `context_independent: true|false` + the 3-part proof (source/cadence/sink) as a REQUIRED field on every audit
  row in `audit-runner.md`. Any `false` = surfaced as a coverage hole.
- Build `validate-dual-coverage.mjs` (EXTENDED): walk the drift-prone obligations / handoff steps; for each, confirm
  a recurring-audit twin EXISTS and PASSES the context-independence test. Missing twin → ADVISORY (BLOCKING at K=2).
- ACTIVATE the recurring audit-runner as the cadence engine — it is the execution of the entire hard layer.
- Apply to the seeds in THIS file: SEED-A (register-ref-integrity) and SEED-B (moat-review) each get their recurring-
  audit twin so they are not handoff-only.

**Why permanent:** this is the standard that makes "we hardwired it" TRUE — coverage that survives every tab, with no
dependence on memory. It is the structural answer to "handoffs are good but shaky."

## SEED-D — PER-ROLE STARTUP-BLOCK STANDARD (Opus + Sonnet + Haiku; same backbone, role nuance)

**Rule (Governor S084):** every role's session/spawn opens with the SAME canonical startup-block backbone + the SAME
enforcements, generated each time (inherited, not hand-crafted), with role-appropriate nuances. The Governor-approved
S086 Sonnet block is the reference instance.

**SHARED BACKBONE (all three roles):** IDENTITY (self + the full team incl. Haiku) · REPO STATE (HEAD + verify=0) ·
WHAT WAS SEALED / INHERITED · OPEN PARKS (full content, no register read) · ENFORCEMENT SYSTEM (T1/Stop/cadence) ·
GOVERNANCE CORE (IZFC · WHO/WARRANT/ACTION · ratification cadence · push/park discipline) · TEAM ROUTING ENVELOPE ·
WHAT-NOT-TO-DO · FIRST ACTIONS · KEY TECH FACTS.

**PER-ROLE NUANCE:**
| Axis | OPUS | SONNET | HAIKU |
|---|---|---|---|
| role | director/architect/synthesis; authors seeds; OPIA gate; verify-before-concur | builder; full build-out; cannot self-accept C2 | scout; mechanical breadth; cannot decide |
| context mode | 1M allowed (synthesis) | STANDARD default; 1M only pre-declared complex+long | minimal — restricted tools, pointers-only |
| block SIZE | FULL (architect flavor) | FULL (builder flavor) | **MINIMAL — must fit Haiku's budget; the full block OVERFLOWS it (~203k). Compressed scout contract only.** |
| first actions | read sonnet-turn.md + opus-turn.md; clear OPIA backlog; answer alignment Qs; ratify by class | read opus-turn.md top; verify=0; cross-tab diff; build | none — execute the one bounded scan |
| what-not-to-do | don't write routine code (anchors only); don't rubber-stamp (verify-before-concur); don't over-ask C3/C4 | don't self-accept C2; don't push on red; don't fork | don't decide/synthesize; don't cross-file set-ops; don't scope-creep |
| also-learns (team) | beneficiary of S→O + H→O (implementation reality + raw data) | beneficiary of O→S (architecture POVs) | beneficiary of O+S→H (scan discipline) |

**HAIKU CONSTRAINT (load-bearing):** Haiku's "same pattern" is the same SHAPE (identity · contract · enforcement ·
return-format) but RADICALLY compressed — it CANNOT carry the full block (overflow). Haiku gets: WHO-YOU-ARE (1 line) +
SCAN→DETECT→RETURN JSON contract + CONTEXT-BUDGET line + its measured envelope (reliable/unreliable) + the one task.
Pointers, never payloads. This is the role nuance that matters most — same standard, scaled to the model.

**BUILD HANDOFF (Sonnet, S086 with PARK-041):** make the backbone the canonical slim-handoff template; generate the
role instance by `session_role` (opus-startup / sonnet-startup / haiku-startup-minimal); extend
`validate-handoff-completeness` to be ROLE-AWARE — require the backbone sections for opus/sonnet, the compressed
scout-contract sections for haiku; missing any → blocked. The per-role cards (PARK-041) feed the IDENTITY box.

**Why permanent:** turns "best block I've seen" into "the block every role produces every time" — inherited, enforced,
team-complete, with Haiku correctly scaled so it never overflows.

## ZF gate (this seed)
- Cycle 1: SEED-A/B/C/D each have Rule + criteria/manifest/step + BUILD HANDOFF + why-permanent. No floating ref.
- Cycle 2 (fresh angle — self-application): SEED-A's manifest lists every register THIS doc cites; SEED-C's
  context-independence test, applied to SEED-A/B's own validators, requires they read persistent state + run on
  cadence + write to a register. SEED-D's Haiku-minimal rule is self-consistent with the measured Haiku-overflow
  (PARK-039) — the standard refuses to overflow its weakest member. Coherent; the doc passes its own standard.
