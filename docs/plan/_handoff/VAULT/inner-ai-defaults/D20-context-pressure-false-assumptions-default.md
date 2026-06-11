---
id: csps.governance.ai-default.D20-context-pressure-false-assumptions
name: D20-context-pressure-false-assumptions
default_id: D20
default_name: context-pressure-false-assumptions
description: >
  Training default: as context fills and turn count rises, the AI substitutes
  pattern-memory for verification — asserting unverified file states, misreading
  instructions, issuing directives based on claimed-not-confirmed states.
  "FALSE-ASSUMPTIONS FLOURISH" under context pressure. Distinct from D12
  (existence-claims without inventory) and D14 (concurring-without-re-derivation):
  D20 fires when the AI generates its OWN false assumption under context pressure,
  not when it agrees with someone else's claim. Overridden by verify-before-concur
  (P-META-032 / B_COUNCIL_PEER) + Item-5 branch-activation reload.
ratified_session: S082
registry_session: S082
inherits_from: "D12 (assumed-coverage — species overlap at existence-claims) + D14 (unverified-agreement — species overlap at directives) + D4 (pattern-match — pressure amplifies pattern substitution)"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
related_existing: >
  D12 (assumed-coverage) — D12 fires on claimed-existence without inventory; D20 fires on
  ANY assertion (state, identity, content, instruction-interpretation) under turn-pressure.
  D12 is a species; D20 is the pressure-amplification genus.
  D14 (unverified-agreement) — D14 fires on concurring with SOMEONE ELSE'S claim without
  re-derivation; D20 fires on the AI generating its OWN false assertion. Distinct mechanisms.
  D4 (pattern-match) — D4 fires on over-broad pattern application; D20 fires specifically when
  context-pressure causes the AI to substitute pattern-memory for verification.
  B_COUNCIL_PEER + P-META-032: the primary catch mechanism for D20.
  Item-5 trunk-branch-reload: the structural cure — re-loads governing constraints at branch
  activation boundaries, which is exactly when D20 fires most acutely.
links:
  - rel: principle
    href: ../../../../packages/principles/principles/P-META-032-demonstrated-truth.yaml
  - rel: council-contract
    href: ../../pillar-0-governance/behavioral-contracts/B_COUNCIL_PEER.md
  - rel: trunk-branch-reload
    href: ../../pillar-0-governance/planning-spine/TRUNK-BRANCH-RELOAD.md
  - rel: default-registry
    href: ../../../../tools/data/default-correction-registry.yaml
---

# D20 — Context-Pressure False Assumptions (verify-before-assert override)

## Training Default

"I have enough context to know what this file contains / what this instruction means / what the current state is. I've been working in this codebase for 30 turns — my pattern-recognition is accurate enough to assert without checking. The overhead of re-reading is not worth the marginal accuracy gain."

## The Pressure Mechanism

As a session accumulates turns and context:
1. The AI builds increasing confidence in its internal model of the system state
2. Per-turn verification cost FEELS higher (more context already loaded; re-reading feels redundant)
3. Pattern-completion is faster and feels more fluent than verification
4. Any instruction or claim that matches a recent pattern is processed via pattern → output, not via source → verify → output

The result: false assertions that feel like confident knowledge. Unlike D12 (which fires on shallow inventory claims), D20 fires on the AI's own internal state model — it never even generates a search query because it "already knows."

## CSPS Resistance Pattern

**Context-pressure false-assumptions take 4 forms:**

1. **File-state assertion**: AI asserts what a file contains based on internal model rather than reading it → produces wrong merge/edit instructions
2. **Instruction mis-interpretation**: AI interprets an instruction by matching on surface tokens rather than reading the full context → executes the wrong thing confidently
3. **Identity/content conflation**: AI treats two artifacts as equivalent based on name/context similarity without reading both → produces "merge" instructions that conflate distinct things
4. **Directive mis-application**: AI applies a code word (PARK, HARDWIRE, etc.) according to its training-default interpretation rather than the CSPS-specific meaning → violates the governing intent while satisfying the surface form

## Samples — ALL from Opus-19 S082 (director role is not exempt)

**Sample 1 — False "literal duplicate" assertion (S082, Opus-19 self-correction):**

❌ Opus asserted: *"threshold-gate.md (root) and meta-platform/threshold-gate.md are a LITERAL DUPLICATE"* — based on the NAMES matching without reading both files. Issued merge instruction accordingly.

Actual state: `meta-platform/threshold-gate.md` = OnboardingWizard UI entry flow (ARCH spine, S037, product feature). `threshold-gate.md` = governance input pipeline (GVRN spine, S011). Different spine, different content, different era, different purpose. Merging would have conflated product UI with governance input classification.

Caught by: Sonnet applying B_COUNCIL_PEER push-back + reading both files.
Cure: branch-activation reload would have re-surfaced the spine classification of both files before issuing the merge directive.

**Sample 2 — Wrong merge instruction derived from false assertion (S082, Opus-19 self-correction):**

❌ Following from Sample 1's false assertion, Opus issued: *"fold meta-platform/threshold-gate.md content into v2."* This directive was constructed from the false premise (same concept) rather than from reading the actual content.

Actual effect if executed: threshold-gate-v2.md would have contained OnboardingWizard UI flow (account-setup, tenantId check, Clerk publicMetadata) inserted into the governance input pipeline doc.

Caught by: Sonnet's verify-before-concur (B_COUNCIL_PEER) — checked the meta-platform file's spine field and description before following the directive.
Cure: P-META-032 (re-run IS the proof) applied at the instruction-receiving boundary — read the file, THEN evaluate the directive.

**Sample 3 — PARK instruction mis-interpretation (S082, Sonnet-catch + Opus confirmation):**

❌ Sonnet initially read Opus's PROTO stating items "should not be neglected" as implying they should be built immediately. The context pressure (35+ turns in, dense PROTO with many directives) caused the instruction's surface tokens ("not neglect" = "act on") to override the governing intent of PARK (capture with guaranteed return, WITHOUT derailing active work).

The governing intent of PARK is: absorb-without-derail. Executing the parked items NOW = exactly the derailment PARK prevents.

Caught by: Sonnet self-checking against the PARK definition before acting.
Cure: B_COUNCIL_PEER Sonnet obligation — "surface what the prompt missed." Sonnet surfaced the interpretation conflict; it did not silently execute.

**Sample 4 — Opus header format slip (S082, caught by boundary_prompt_format validator):**

❌ PROTO header written as `FROM: Opus-19 · TO: Sonnet S082` without the full canonical 5-header format (THIS IS: / DO NOW: / UNDERSTANDING BLOCK / etc.) required by PROTO-AND-TAB-TRANSFER-PROTOCOL §3.

The boundary_prompt_format validator BLOCKED and reported 4 missing headers. Opus was asserting the format was correct (D11 overlap) while under context pressure generating a PROTO with the abbreviated structure.

Caught by: `boundary_prompt_format` validator (T2) — mechanical catch, not behavioral.
Cure: Item-5 branch-activation reload at PROTO-authoring boundary would re-surface the canonical header requirements.

## Cure Cross-References

**Primary cures (all 4 samples caught by one of these):**

1. **verify-before-concur (P-META-032 / B_COUNCIL_PEER)**: Before any assertion about file state/content/instruction intent at turn N+20+, RE-READ the source. Internal model ≠ current state. Evidence paste IS the proof.

2. **Item-5 branch-activation reload (TRUNK-BRANCH-RELOAD.md §5)**: At implementation/audit boundaries, reload the governing constraints from the plan origin. D20 fires most acutely when Sonnet starts building based on compressed context of Opus's turn-4 directives. The reload re-surfaces the original governing constraints at exactly this boundary.

3. **B_COUNCIL_PEER Sonnet obligation**: Surface what the prompt missed. The 3 behavioral D20 samples (1, 2, 3) were all caught by Sonnet's push-back obligation — not by a validator. The council contract IS the primary D20 defense for instruction-level false assumptions.

## Enforcement Trio

- **T1:** `pre-tool-use-rzf-evidence-gate.sh` — evidence-before-claim gate (fires before any tool call where an unverified state-assertion would be acted on). Advisory currently; promotes after ≥2 real D20 fires with 0 false-positives. Note: `pre-tool-use-false-assumption-gate.sh` is B_META_QUESTION_DISCIPLINE (requires "## False Assumptions" section in tab-transfer docs) — wrong surface for D20. The rzf-evidence-gate is the correct T1 because it enforces the same principle D20 requires: evidence must precede the claim, not follow it.
- **T2:** `validate-demonstrated-truth.mjs` (P-META-032 validator) — evidence-paste required for state claims in session output.
- **T3:** session-open injection: "D20: as turns accumulate, pattern-memory feels like knowledge. Under context pressure, false assertions flourish. Verify-before-assert: read the file, check the instruction source, re-derive before issuing a directive."

## Adopted Value

verify-before-assert: Internal confidence ≠ external evidence. Under turn-pressure, the discount rate on verification rises. Resist: a 30-second read catches a 30-turn compounding error. The most dangerous D20 assertions feel most confident.

## Disambiguation from D12 and D14

| Default | Trigger | Who makes the false claim |
|---------|---------|--------------------------|
| D12 | Shallow/phantom inventory of what EXISTS | AI makes claim about the platform's current state |
| D14 | Concurring with ANOTHER AGENT'S factual claim | AI agrees without re-deriving the other's claim |
| **D20** | ANY assertion under context pressure — state, identity, instruction-intent, content | AI makes its OWN false assumption without checking |

D12 is a species of D20 at the existence-claim surface. D14 is a species of D20 at the ratification surface. D20 is the pressure-genus that encompasses both and adds instruction-interpretation and identity-conflation.
