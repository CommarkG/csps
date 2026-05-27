---
id: csps.protos.PROTO-S065-PAP
name: PROTO-S065-PAP
description: "S065 — Platform Alignment Plan (PAP). 8-part RZF-driven audit of the full platform. Part boundary = Opus checkpoint. Findings filed real-time. PAP ships when all 8 Parts close RZF."
type: proto
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S065
core_spine: VALD
schema_anchor: protos
links:
  - docs/plan/_handoff/HANDOFF-S064-to-S065.md
  - tools/data/improvement-register.yaml
  - tools/data/gap-recurrence-register.yaml
  - tools/data/flow-activity-monitor.yaml
---

# PROTO-S065-PAP — Platform Alignment Plan

**STATUS: ACTIVE** | Session S065 | Sonnet-10 builds | Opus-10 reviews at Part boundaries

---

## WHY THIS PROTO

Three sessions (S062-S064) built prevention infrastructure. The platform now has:
- 27 hooks · 31 skills · 179 validators · 68 B_* contracts
- Regression floor locked at 38/66=58% canonical permanence
- K=4 gap fix, R4 reasoning hook, B_* engraving gate
- Exceptional-moments capture, consolidation-pass detector, improvement-register v1.1

**The PAP question:** Is any of this actually aligned? Does every validator get registered? Does every hook produce verifiable output? Does every B_* contract have T1+T2+T3 or explicit exemption? PAP is the measurement pass — it produces a number, not just infrastructure.

**Target:** When PAP closes all 8 Parts with ZF, we have a measurable alignment score across 8 dimensions. The platform's completeness becomes verifiable, not aspirational.

---

## EXECUTION MODEL

- Each Part = one Sonnet auto-execute stream
- Opus checkpoint between Parts (FULL ADVANCE GATE per B_REVERSIBILITY_GATED_REVIEW)
- RZF required after each Part before advance
- Findings filed real-time to improvement-register (positive) or gap-recurrence (recurring gaps)
- Output per Part: `docs/plan/_handoff/VAULT/pap/part-N-<name>-audit.yaml`
- PAP ships when all 8 Parts close RZF

**ASK OPUS gates (real only):**
- Part-N boundary crossed → Opus ADVANCE before Part N+1
- Cross-spine finding → Opus seed
- K=2+ new finding outside registers → Opus classification
- Governor #3 priorities surface → Opus pause-vs-parallel routing

---

## PART 1 — Completeness Audit

**Scope:** Every enforcement artifact registered, wired, and testable.

**Check per validator (179 total):**
- Registered in `docs/plan/pillar-0-governance/audit-runner.md` with matching slug?
- Wired in `tools/verify.mjs` validator list?
- Has behavioral test in `tools/tests/behavioral/`? (or explicit ADVISORY waiver)

**Check per hook (27 total):**
- In `settings.json` under correct event type?
- In `verify-hooks-functional.sh` DECLARED_HOOKS?
- Exit code documented (0=allow, 1=advisory, 2=block)?
- Has known output signature in `flow-activity-monitor.yaml`?

**Check per B_* contract (68 total):**
- `enforcement_trio` frontmatter present with t1+t2+t3?
- `opus_reviewed_seed` present (for post-S064 contracts only)?
- T2 validator path exists on disk (if status=active)?
- Behavioral test exists? (validate-five-surface currently shows full_5surface=0)

**Check per register (5 active: improvement, gap-recurrence, exceptional-moments, flow-activity-monitor, threshold-intake):**
- Schema documented with required fields?
- At least one validator reads it?
- Write pipeline alive (something writes to it per-session)?

**Output:** `docs/plan/_handoff/VAULT/pap/part-1-completeness-audit.yaml`

**ZF gate:** RZF Cycle 1 cites 3+ specific file:line findings. Cycle 2 re-checks all Cycle 1 files. Findings filed before claiming Part 1 RZF.

---

## PART 2 — Wiring Audit

**Scope:** Graph completeness — every finding → trigger → hook → output path.

**Check:** For each finding in improvement-register + gap-recurrence-register:
- Is there a corresponding trigger hook (T1)?
- Does the trigger hook produce observable output (output_signature in flow-activity-monitor)?
- Does the output feed into a T2 validator?
- Is the full path: finding_type → hook_fires_on → validator_checks_output → register_entry traceable?

**Method:** Walk the 7 `flow_elements` in `flow-activity-monitor.yaml`. For each:
- Verify the `output_signature` actually matches current output
- Verify the `expected_cadence` is being met (last_active_at not null)
- File new flow elements for validators/hooks NOT currently in the monitor

**Output:** `docs/plan/_handoff/VAULT/pap/part-2-wiring-audit.yaml`
**Expected:** flow-activity-monitor expands from 7 → ~30+ entries.

---

## PART 3 — Mechanical Enforcement Audit

**Scope:** Every rule has T1+T2+T3 OR explicit exempt_reason in enforcement_trio.

**Check:** For each B_* contract in `behavioral-contracts/`:
- T1 (hook): path exists AND status=active|stub? Or exempt_reason explaining why not?
- T2 (validator): path exists AND status=active|stub? Or exempt_reason?
- T3 (memory): session-open injection confirms contract reaches AI?

**Also check:** BLOCKING vs ADVISORY classification per rule:
- BLOCKING rules: does a behavioral test PROVE the gate catches violations?
- ADVISORY rules: are they actually surfaced in verify output?

**Output:** `docs/plan/_handoff/VAULT/pap/part-3-mechanical-enforcement-audit.yaml`
**Expected:** B_SESSION_INJECTION_COMPRESSION (K=2, open) likely surfaces here.

---

## PART 4 — Contextual Focus Audit

**Scope:** Balanced rigidness — are rules binary (rigid) or context-sensitive (balanced)?

**Check per blocking rule:**
- Does the rule have a counterweight or escape hatch?
- Is the rule binary-block (no context reasoning) or reasoning-gated?
- Does the rule handle the "legitimate exception" case?

**CAI Candidate:** CSPS-Aligned-Intelligence (CAI) — the platform's behavioral identity name. Opus proposed in S063→S064 chat. Flag for Governor ratification in Part 4 output.

**Output:** `docs/plan/_handoff/VAULT/pap/part-4-contextual-focus-audit.yaml`

---

## PART 5 — Prevention Coverage Audit

**Scope:** 60% → 100% prevention graph. Every finding/gap/moat has explicit trigger+hook+output.

**Method:** Walk `docs/plan/pillar-0-governance/moat-registry.md` (M-01 through M-38+). For each moat element:
- Is there a trigger hook that would catch a violation?
- Is there a validator that confirms the moat is intact?
- Is the moat element itself tested?

**Output:** `docs/plan/_handoff/VAULT/pap/part-5-prevention-coverage-audit.yaml`

---

## PART 6 — Schema Alignment Audit

**Scope:** Every artifact has correct core_spine + schema_anchor + lifecycle_state in canonical enums.

**Check:**
- `validate-frontmatter.mjs` findings (not just blocking — all advisory too)
- `validate-schema-anchors.mjs` — any registered anchors with no files?
- Cross-reference links: does `rel:` match link convention? Does `href:` path exist?

**Output:** `docs/plan/_handoff/VAULT/pap/part-6-schema-audit.yaml`

---

## PART 7 — Vocabulary Alignment Audit

**Scope:** Closed-enum compliance and no-invention-without-precedent.

**Check via `/vocabulary-canon` skill + planned `validate-vocabulary.mjs`:**
- `lifecycle_state` enum: all files in canonical list?
- `type` enum: all file types registered in `schema-registry.md`?
- B_* contract names: follow naming-policy 4-rules?
- Field names: no invented fields not in `frontmatter-schema.yaml`?

**Output:** `docs/plan/_handoff/VAULT/pap/part-7-vocabulary-audit.yaml`

---

## PART 8 — Naming + Numbering Consistency Audit

**Scope:** File naming, B_* slugs, session IDs, PROTO IDs — all consistent.

**Check:**
- File names follow naming-policy 4-rules (kebab-case, descriptive, no version suffixes)
- B_* contracts have matching `@csps-id` slug in frontmatter
- Session numbering: `S<NNN>` format consistent across ALL artifacts
- PROTO numbering: `PROTO-S<NNN>-<DESCRIPTOR>` consistent
- Findings: `FINDING-S<NNN>-<DESCRIPTOR>` consistent

**Output:** `docs/plan/_handoff/VAULT/pap/part-8-naming-audit.yaml`

---

## ZF GATE (per Part)

After each Part:
```
ZF Cycle 1: <what was audited> — sources: <specific files checked>. <N findings filed>.
ZF Cycle 2: Re-checked <file1> (<what confirmed>), <file2> (<what confirmed>). 0 new findings.
Status: ZF ACHIEVED.
```

Then await Opus ADVANCE before Part N+1.

---

## SUCCESS CRITERIA

PAP is COMPLETE when:
- All 8 Parts have closed RZF
- Output YAMLs exist for all 8 Parts in `docs/plan/_handoff/VAULT/pap/`
- Findings from all Parts are filed in permanent registers
- Alignment score is measurable: N findings per Part × 8 Parts = total debt

**Target alignment score:** < 20 blocking findings across all 8 Parts. Everything else = advisory queue for S066+.
