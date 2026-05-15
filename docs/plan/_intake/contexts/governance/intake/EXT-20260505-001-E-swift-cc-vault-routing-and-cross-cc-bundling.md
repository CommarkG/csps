---
extraction_id: EXT-20260505-001-E
parent_input_id: EXT-20260505-001
section_label: "§6 + §15 Cross-CC PART-LEVEL bundling + SWIFT vs CC vs Vault routing"
source_type: AI_OTHER
confidence: 0.98
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T03:55:00Z
pipeline_state: routed
routed_to: unified-intake topic-plan L2 envelope schema design + B_INTAKE_DISCIPLINE umbrella + P-OP-004 humble-batching extension
next_review_at: 2026-05-05T04:30:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
  - trust_tier: external_ai_export
sla_due:
  routed_for_review: 2026-05-05T04:30:00Z
  pcr_decision: 2026-05-06T03:55:00Z
scope_level: S1
---

# Extract E — SWIFT vs CC vs Vault routing + Cross-CC PART-LEVEL bundling

## Essence (TWO load-bearing patterns directly relevant to unified-intake L2)

**Pattern 1 — SWIFT/CC/Vault three-route model** for routing new items based on blast + value + ripple. Direct fit for **unified-intake `IntakeEvent.route_to` field** design (Layer 2 envelope work pending CSP-file).

**Pattern 2 — Cross-CC PART-LEVEL bundling** ("the unit of work is the ADDITION, not the CC") — direct validation of my S008 turn 5 humble-batching decision to merge Phase 5 hooks INTO unified-intake topic-plan L1 (rather than execute as separate workstreams).

## Verbatim source quotes

**SWIFT/CC/Vault:**
> "Three routing destinations for new items, governed by PE + blast + value:
> - SWIFT — LOW blast (1-3) + immediate value + low ripple. Execute immediately; mandatory Committed CC Review post-execution.
> - CC — MED blast (4-6) OR HIGH blast (7-10). Council circulation → response → execute per ratification.
> - Vault — Out-of-band ideas during a session. Capture in GOVERNOR_INPUT_VAULT.md; PE places in next reassessment."
>
> "SWIFT eligibility (Governor S288 — both required):
> 1. Significant immediate value for what exists OR near-future pending CCs
> 2. Confident low blast AND low ripple (changes stay local; no cross-spine propagation)
> If EITHER fails — vault/CC. No rationalization."

**Cross-CC PART-LEVEL bundling:**
> "Per Governor S288 CONSTITUTIONAL: 'the real optimization is picking the optimal BUILD ORDER across additions from MULTIPLE ratified CCs — not executing CCs sequentially top-to-bottom.'
> The principle: unit of work is the ADDITION, not the CC.
> Example: CC-X has Phase 1 addition touching `context_inject.ps1`. CC-Y has Phase 1 addition also touching `context_inject.ps1`. Sequential execution would touch the file twice. Bundled execution touches it once."

## CSPS current state

**SWIFT/CC/Vault analog in CSPS:**
- B_INTAKE_DISCIPLINE (S002 turn 4-7) — handles external content (paste/upload/URL/treasure) with EXT-ID + manual-protocol; NO three-route model
- B_GOVERNOR_PROMPTS (P-META-012) — handles chat-channel substantive prompts; NO routing decision
- 4-conditions-for-autonomous-execution (CSP carry-forward S002; ratified ✓ reversible ✓ mechanical ✓ no-cross-actor ✓) — analog of SWIFT eligibility but as boolean gate not routing destination
- NO `GOVERNOR_INPUT_VAULT.md` analog in CSPS

**Cross-CC PART-LEVEL bundling analog in CSPS:**
- P-OP-004 batched execution — "N similar ops: criteria upfront, batch, single summary"
- humble-batching memory pattern — used by me in S008 turn 5 (Phase 5 hooks merged into unified-intake L1)
- AGENTS.md hard NO L85: "Never compress humble-batching into unrelated-item bundling for 'efficiency'"
- NO explicit "unit of work = ADDITION not CC" doctrine; humble-batching is judgment-driven

## Recommended downstream action — DIRECT L2 IMPACT

**For unified-intake topic-plan L2 envelope schema design** (currently held for CSP file — this is exactly the precedent gate):

1. **Add `route_destination` enum to IntakeEvent envelope:** `{SWIFT_EXECUTE, COUNCIL_REVIEW, VAULT_DEFER}` (CSPS-adapted: `SWIFT_EXECUTE` per 4-condition gate / `COUNCIL_REVIEW` for PCR-required / `VAULT_DEFER` for backlog)
2. **Add SWIFT eligibility gate to envelope:** boolean `swift_eligible` computed from (blast≤3 AND ripple≤local AND value=immediate AND 4-conditions-pass)
3. **NEW VAULT:** `docs/plan/_handoff/VAULT/governor-input-vault.md` (CSPS-analog of CSP's GOVERNOR_INPUT_VAULT.md) — captures out-of-band ideas during session for PE-placement at next reassessment

**For humble-batching discipline (separate from L2):**

4. **EXTEND P-OP-004 batched execution** with subsection: "unit of work is the ATOMIC ADDITION, not the topic-plan layer; cross-topic-plan bundling allowed when same files touched OR same B_* contract amended"
5. **NEW MEMORY:** `feedback_unit_of_work_is_addition_not_layer.md` — captures the principle as AI guidance
6. **VALIDATION OF S008 turn 5 DECISION:** the merger of Phase 5 hooks into unified-intake L1 was correctly cross-CC PART-LEVEL bundling — CSP file retroactively validates this judgment

## Open questions

- For SWIFT/CC/Vault: should CSPS use 3 routes or 4 (adding "AI_DRAFT_REVIEW" for AI-authored-pending-Governor-PCR)? CSP's 3 may be sufficient.
- For Vault: should it be one file (CSP pattern) or per-session (`vault-S<NNN>.md`)? CSPS distributed-per-session pattern may fit better.
- Is "Committed CC Review post-execution" needed for SWIFT, or does CSPS B_PROFESSIONAL_VOICE + 4-conditions-gate cover it?

## Engraving readiness

✅ **HIGH-LEVERAGE — READY FOR L2 INCORPORATION.** This extract directly informs unified-intake topic-plan L2 envelope schema design. Should be the FIRST item the L2 phase consumes when CSP-file work begins.

**Specific action recommendation:** when L2 work opens, reference this extract verbatim in [`unified-intake.md` §2 envelope schema spec](../../../../_handoff/VAULT/topic-plans/unified-intake.md). The `IntakeEvent.route_to` field design is now precedent-backed.
