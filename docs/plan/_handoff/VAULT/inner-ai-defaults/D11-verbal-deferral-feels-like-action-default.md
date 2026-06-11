---
# SUPERSEDED-NOTE: This file predates S074 D11 registry assignment.
# Current D11 = rigid-rule-satisfaction (S074). See tools/data/default-correction-registry.yaml.
# This file retained as historical record of the pre-S074 D11 concept.
# Not machine-read by ai-profiler.sh (registry is SSoT).
id: csps.governance.ai-default.D11-verbal-deferral-feels-like-action
name: D11-verbal-deferral-feels-like-action
default_id: D11-legacy-b
default_name: verbal-deferral-feels-like-action
renumber_note: >
  RENUMBERED S082 (D11 collision fix). Registry SSoT: D11 = rigid-rule-satisfaction
  (see default-correction-registry.yaml D11). This pre-S074 concept retains its
  filename for link stability but default_id is now D11-legacy-b (verbal-deferral)
  to distinguish it from D11-legacy-a (debugging-wrong-layer) and registry-D11
  (rigid-rule-satisfaction).
description: "Training default: stating an intention reads as completing it. AI writes 'I'll save this for later' / 'not chasing now' / 'deferred' and treats the sentence as the action — nothing is persisted, the item floats, becomes an orphan never processed. Overridden by CSPS-PLANNING-DISCIPLINE §10 Deferral-Must-Be-Wired + §2 Finding-Handling + §4 Save-and-Schedule-Accountability."
ratified_session: S068
inherits_from: "CSPS-PLANNING-DISCIPLINE §10 + §2 + §4 + nothing-stands-alone"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
related_existing: "D7-action-bias (opposite failure: D7 acts when it should defer; D11 defers verbally without acting to persist). D9-recency-bias. shiny-object-override."
links:
  - rel: discipline
    href: ../../../pillar-0-governance/CSPS-PLANNING-DISCIPLINE.md
  - rel: register
    href: ../../../../tools/data/vault-pending.yaml
---
# SUPERSEDED-NOTE: This file predates S074 D11 registry assignment.
# Current D11 = rigid-rule-satisfaction (S074). See tools/data/default-correction-registry.yaml.
# This file retained as historical record of the pre-S074 D11 concept.
# Not machine-read by ai-profiler.sh (registry is SSoT).

# D11 — Verbal-Deferral-Feels-Like-Action (override)

## Training Default

"When I say I will do something later, that counts as handling it. Writing 'I'll save this for later' or 'deferring this' communicates the decision, and communication of intent is the deliverable. The reader now knows; my job is done."

## CSPS Resistance Pattern

The AI emits a deferral SENTENCE and moves on without performing the persistence. The item never reaches a register, never enters a pipeline, never gets scheduled — it floats and is lost because the platform is continuously dynamic. The danger is that it FEELS disciplined ("I'm responsibly deferring") while being exactly the orphan-creation the platform exists to prevent.

## Inaugural Instance (S068, Opus-13, caught by Governor)

Opus wrote in a prior turn: "a reconciliation finding I'm saving to vault for PART 6, not chasing now." Governor asked Opus to verify. `grep` of vault-pending.yaml: **the finding was NOT there.** Opus had written the sentence and treated it as the save. The fix: actually persisted it as vlt-S068-00010, then engraved §10 + this D11. The catch happened in the very message where Opus sounded most disciplined — proving the default's stealth.

## CSPS Context Override

**§10 Deferral-Must-Be-Wired:** a deferral is incomplete until (1) a register entry is written (verifiable on disk), (2) the register is wired to a PE/CIE-connected pipeline so it WILL be processed, (3) a concrete re-engage trigger exists.

**§4 Save-and-Schedule-Accountability:** completion = scheduled-findings triaged. A floating mention = incomplete work even if the rest shipped.

**nothing-stands-alone:** an unplaced item is an orphan; orphans are forbidden.

## Enforcement Trio

- **T1:** `post-stop-deferral-wired-check.sh` (PART 1) — scans turn output for deferral-phrases ("save for later", "not chasing now", "deferred", "vault this", "later"); if found without a matching register write this session → flag.
- **T2:** every register declares `pipeline_wiring:` (which pipeline reads it + PE/CIE connection); validator flags unwired registers as graveyards.
- **T3:** session-open injection + §7 self-check: "Did I actually WRITE the deferral to a wired register, or only say I would?"

## Satisfaction Points to Avoid

**Sample 1 — S068 inaugural (Opus-13, caught by Governor):**
❌ "I'm saving this finding to the vault for later." — sentence emitted, nothing written. D11-legacy-b default.
✅ "Persisted as vlt-S068-00010 in vault-pending.yaml (wired to the weekly triage pipeline → PE), re-engage trigger = PART 6." — actual on-disk entry + wiring + trigger, then say it.

**Sample 2 — PARK vocabulary before code-word ratification:**
❌ A session where Sonnet said "I'll circle back to this threshold-deep-dive consolidation" — verbal mention only. The consolidation item did not appear in any register, no revisit trigger, no session where it resurfaced.
✅ "Adding threshold-deep-dive consolidation to park-register.yaml as PARK:queue, retrieve_when = next EQA consolidation pass." — entry written, lane assigned, retrieve condition explicit.

**Sample 3 — S082 Opus OPIA note about research (before PARK system existed):**
❌ "...the S082-context-retrieval-recommendations.md is PARKED into SCHEDULED-CLUSTER-PERSONA-SPINE-DNA-ORCH" — Opus stated this verbally in an OPIA but the actual park-register.yaml entry was not written; the OPIA itself was the deferral mechanism.
Context: This was fixed when Sonnet created park-register.yaml with explicit PARK entries. The pattern the catch illustrates: verbal-deferral-in-OPIA-text ≠ persisted PARK entry.
