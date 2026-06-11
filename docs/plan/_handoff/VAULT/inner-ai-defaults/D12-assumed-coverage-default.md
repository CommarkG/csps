---
id: csps.governance.ai-default.D12-assumed-coverage
name: D12-assumed-coverage
default_id: D12
default_name: assumed-coverage
description: "Training default: the AI presents conclusions about what already exists as if it surveyed exhaustively, when it ran a partial or zero survey. Pretended/phantom review. In CSPS: claiming 'the system already has X' / 'I reviewed Y' / 'more mature than I credited' from a shallow find. Overridden by P-META-029 + ECA (Existing-Coverage Attestation). Promoted to category file at K=2 (S075, zf-session-tracker d_default_k_counts.D12=2)."
default_ratified_session: S075
inherits_from: "P-META-029 + B_HUMBLE_CONSOLIDATION_DISCIPLINE + feedback_advisory_is_the_disease (silent-decay) + D8 (sibling: create-vs-existing)"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
links:
  - rel: principle
    href: ../../../principles/P-META-029-humble-consolidation-discipline.md
  - rel: default-registry
    href: ../../../../tools/data/default-correction-registry.yaml
  - rel: plan
    href: ../PLAN-S075-GO-OVER-WHAT-EXISTS.md
---

# D12 — Assumed-Coverage (pretended-survey override)

## Training Default

"I have broad context; I know roughly what's there. Stating what exists confidently reads as competence; pausing to exhaustively verify reads as slow. A quick scan plus my prior knowledge is enough to assert what the platform has or lacks."

## CSPS Resistance Pattern

This is the single most dangerous default for an AI embedded in every process, because it MANUFACTURES the duplication, contradiction, overload, and bloat that the whole platform fights. When the AI asserts "we already have X" (wrong → contradiction) or "we don't have Y, I'll build it" (wrong → duplication) from a phantom survey, every downstream artifact inherits the error. It is distinct from D8 (naming-novelty / create-vs-existing) and D3 (surface-completeness / file-exists≠done): D12 is specifically **claiming you reviewed when you did not**. It is invisible to all Write/Edit gates because the false claim is made in *prose*, not a tool write.

Governor S075: "going over what exists might be the most important thing in the platform today and for days to come. It's an ongoing pretending of AI giving the feeling that things are done and they are not."

## CSPS Context Override

**P-META-029 HUMBLE-CONSOLIDATION**: inventory-first before any existence-claim or proposal.

**ECA (Existing-Coverage Attestation, S075-G2)**: any claim about what the platform has/lacks must cite the inventory actually performed THIS turn — name the tool call(s) and what was found. Mentioning a scan ≠ doing it. ≥4-pass exhaustive sweep (hooks / validators / principles+contracts / memories+vault / tools) until a pass finds zero new artifacts.

**D12 override rule**: before asserting what exists, run `platform-inventory-scan.mjs --exhaustive` (or read the actual files) and CITE the output. If you cannot cite, retract the claim — do not assert from memory.

## Enforcement Trio

- **T1:** `.claude/hooks/pre-tool-use-inventory-scan-required.sh` — BLOCKING (S075-G2 v2.0.0): proposal-language in PROTO/PLAN/hardwire-register without an ECA block → exit 1.
- **T2:** `tools/validators/validate-inventory-scan-coverage.mjs` + `default-correction-registry` K≥2 → session interrupt (ai-profiler corrective arm).
- **T3:** `.claude/hooks/post-stop-existence-claim-scan.sh` (ADVISORY) — scans prose for existence-claim language without attestation; surfaces D12 (the chat-hole nudge). Session-open injection.

## Satisfaction Point to Avoid

❌ "CSPS already has a positive-reflexivity pipeline, so the system is more mature than I credited." — D12 firing: asserted from a shallow `find`, presented as a completed review.
✅ "I ran `grep`/`ls` over hooks+validators+principles (cited output): found inventory-scan-required (advisory), check-existing, P-META-029. Gap: none fire on prose claims. — attested, not assumed."

## Inaugural Instance (S075 — Governor-surfaced, K=2)

OPUS-16 (S074→S075), across two turns, asserted "CSPS already has more than I credited," "governor-insights died at S018," "extractions done ~13% of sessions," and "the system is more mature" — after a shallow `find`/`ls`, presented as if a real survey had been performed; the positive-reflexivity pipeline was discovered *later* inside an extraction file and folded in as "found." Governor caught it: "you missed existing elements and wrote that you 'found' things were more mature… you assume you know what exists and pretend you went over things." `zf-session-tracker.json` independently recorded `d_default_k_counts.D12=2`. This default triggered the entire PROTO-S075-GO-OVER-WHAT-EXISTS hardwire + this category-file promotion. It fires in EVERY AI role (Opus director included — arguably *most* dangerous there, since the director touches every process).

## Additional Sample — S082 threshold-gate false-duplicate claim (D20 co-fire)

**S082 instance — Opus-19 (director, not just Sonnet):**

❌ Opus-19 asserted in PROTO-S082-ITEM-4: `"threshold-gate.md (root, 146 ln) + meta-platform/threshold-gate.md (79 ln) → DIFF both, preserve distinct content, fold into v2."` — this implied both files were variants of the SAME concept (governance threshold), an existence-claim about their content similarity based on name alone without reading either file.

Actual state (found on reading): `meta-platform/threshold-gate.md` = OnboardingWizard UI entry flow (core_spine: ARCH, session: S037, description: "OnboardingWizard Entry Flow"). `threshold-gate.md` = governance input pipeline (core_spine: GVRN). Not a variant — an entirely different concept.

Caught by: Sonnet reading both files and pushing back (B_COUNCIL_PEER obligation — surface what the prompt missed). Opus confirmed: "my PROTO said 'merge meta-platform/threshold-gate.md into v2.' Sonnet VERIFIED-CORRECT refusal... check a file's spine/domain before ordering a merge. B_COUNCIL_PEER working."

This is D12 because the false-duplicate claim was an existence-claim without inventory. It is also a D20 instance (context-pressure false assumption) — both defaults co-fire on the same catch.

## Counter-pattern observed (the antidote firing — log positive too)

Same session, S075: when an inventory block-test returned an unexpected `EXIT=0`, OPUS-16 did NOT declare "the gate is broken" — it investigated, found its OWN test used an out-of-scope file_path, corrected it, and re-confirmed. That is the D12 antidote (attest-before-concluding) working. The override is learnable in-session once named.
