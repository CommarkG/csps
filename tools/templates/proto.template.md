---
# PROTO TEMPLATE — copy this file, fill in all fields.
# Reference: docs/plan/pillar-0-governance/PROTO-AND-TAB-TRANSFER-PROTOCOL.md
# Validator: tools/validators/validate-proto-completeness.mjs
# EVERY NUMERIC COUNT MUST CARRY (sample — expandable) / (target — tunable) / (allowlisted)
# per P-META-028 (cornerstone principle).
id: csps.protos.PROTO-S<NNN>-<slug>
name: PROTO-S<NNN>-<slug>
description: "One-sentence description of what this proto builds and why."
type: proto
protection_level: active
status: draft
# status values: draft | ratified | sealed
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S<NNN>
authored_by: OPUS-<N>
core_spine: <GVRN|ARCH|AI|OPER|VALD>
core_spines: [<list>]
schema_anchor: protos
plan_item_id: "<reference to unified-plan.yaml or MASTER-RE-GATE-PLAN item>"
core_seed_present: true
gate_tier: <full-advance|standard|advisory>
ratified_by: ""
ratified_at: ""
governing_principle: P-META-028
inherits_from: "<parent plan or proto this inherits from>"
# links: — add rel+href entries for master-plan, research, router files
# (populate when copying this template; validator only checks non-comment hrefs)
context_question: "Before any STEP commits: is what's being built real (called + invoked), not just described?"
---

# PROTO-S<NNN>-<slug>

**STATUS: DESIGN** — Opus authors; Sonnet builds only after Governor ratification.

---

## LOAD-BEARING ASSUMPTIONS

<!-- S084 PREV-3: every PROTO surfaces the assumptions it rests on BEFORE shipping.
     Purpose: make warrant visible so Opus can verify-before-concur on what matters.
     Format: one bullet per assumption, provenance label mandatory.
     Labels: [MEASURED:<tool>] = tool output in THIS response | [PREDICTED] = reasoned, not run | [ASSUMED] = carried from prior context
     Escape hatch (use when genuinely none): "None — all inputs [MEASURED] this turn."
     Reviewer note: if every PROTO says "None" → field is theater → flag for review. -->

- [MEASURED:<tool>] [assumption about current state — e.g. "pnpm verify exit_code=0 at session open"]
- [PREDICTED] [design assumption — e.g. "extending validator X will not add a new cycle"]
- [ASSUMED] [context assumption — e.g. "boundary-001 hard_limit remains 200"]

---

## CORE SEED

[Architectural anchor — the single sentence that explains the root cause being fixed and what this proto does to fix it. Must be specific and evidence-based, not aspirational.]

---

## INHERITS / ALIGNS-WITH

[Declared parent — per Inheritance Model: nothing exists without a declared parent. Name the plan item, master plan section, or prior proto this extends.]

- Inherits: <parent>
- Aligns-with: <B_* contracts + principles + existing infrastructure it extends>
- Does NOT build parallel machinery for: <list what exists and is extended, not rebuilt>

---

## ASK-OPUS-STOP TRIGGERS

[Specific conditions where Sonnet must STOP and relay to Opus rather than guessing.]

- <condition 1> — do not guess which implementation to choose
- <condition 2> — merge risk, data loss possible
- A milestone reveals an undefined decision not in this directive

---

## <N>-PERSONA REVIEW
<!-- N must equal the number of persona blocks below (validator enforced) -->
<!-- Current count (sample — expandable): N personas -->

- **cruel-critic:** "[What the cruel-critic says about this approach — hardest failure scenario]" → [implication for design]
- **bottleneck-expert:** "[Throughput/scale concern — what breaks at 10× load]" → [implication]
- **schema-expert:** "[Data integrity / typing / migration concern]" → [implication]
- **consolidation-expert:** "[What already exists that must be extended, not rebuilt]" → [implication]
- **balance-expert:** "[Over-governance risk — where the solution could add more cost than value]" → [implication]

<!-- Add additional personas as needed; update N in the header when count changes -->

**Synthesis (Opus):** [All persona insights converged into the final design decisions. Each implication above is addressed here.]

---

## STEP 0 — Design completeness checklist (Opus, this file)

**DONE WHEN:**
- [ ] Root cause diagnosed (specific evidence: [file:line] or data)
- [ ] <N> (sample — expandable)-persona review complete and synthesis written
- [ ] Core seed captures the architectural anchor
- [ ] ASK-OPUS-STOP triggers enumerated
- [ ] Governor ratifies design → Sonnet builds

---

## STEP 1 — [First implementation step]

**DONE WHEN:**
- [ ] [Specific verifiable outcome 1]
- [ ] [Specific verifiable outcome 2]
- [ ] Behavioral test: [A test description] · [B test description] · [C test description] (sample — expandable: 3/3 minimum)
- [ ] verify --skip-install exit_code=0

---

## STEP 2 — [Second implementation step]

**DONE WHEN:**
- [ ] [Specific verifiable outcome]
- [ ] Behavioral test: [A] · [B] · [C]
- [ ] verify --skip-install exit_code=0

<!-- Add STEP k blocks as needed. Each must have a **DONE WHEN:** checklist. -->

---

## ZF GATE

ZF applies at each milestone boundary. Cycle requirements:
- Cycle 1: cite new files by path + test exit codes by name + top-level $? from pnpm verify --skip-install
- Cycle 2+: re-examine Cycle-1 areas BY NAME (not "areas checked") + 0 new findings
- Termination: findings reach zero AND Cycle 2 names the re-examined files

---

## PREVENTION CLASSES

<!-- Each class must be NAMED (not generic). Format: CLASS-NAME — evidence + why it recurs. -->
<!-- classes are (sample — expandable): add as discoveries emerge during build -->

- `PLACEHOLDER-CLASS-NAME` — [specific evidence of the failure mode this prevents]

---

## §15 3-SCOPE FEEDBACK REQUIREMENT

Every Milestone Report ends with §15 THREE-SCOPE:
- **Sonnet (builder):** what is the immediate next action
- **Platform (structural):** what this milestone enables across the whole system
- **Governor (strategic):** what ratification or decision this milestone informs

---

## DISCIPLINE NOTES

- milestone-run: no per-step ACK; audit + Milestone Report + PREVENTION (named class) + §15 per milestone
- numbers carry (sample — expandable) / (target — tunable) / (allowlisted) per P-META-028
- ADD-not-CONTRADICT: extend existing; do not replace
- .claude/ edits via Bash + SACRED-EDIT-APPROVED token (ZERO-DIALOG-RULE)
- ZF cite: every Cycle 2+ names the files re-examined + top-level $?
- GAP findings → vlt entry, NOT mid-build expansion

---

## AUTHOR SIGNATURE

— OPUS-<N> (architectural director, S<NNN>)
