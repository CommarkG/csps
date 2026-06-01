---
id: csps.handoff.vault.reasoned-adoption-principle-s075
name: REASONED-ADOPTION-PRINCIPLE-S075
description: "The collaboration half of governance: a native-AI default-override becomes PERMANENT only when the AI ADOPTS it through context+reasoning+a reframed value — not when it is merely enforced. Enforcement is the floor (catches lapses in-context); reasoning is the ceiling (makes the AI want to comply across-context). Both required. Governor S075 directive."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
core_spines: [AI, GVRN]
schema_anchor: vault_files
session: S075
links:
  - { rel: principle, href: ../../principles/P-META-025-context-and-intent.md }
  - { rel: default-registry, href: ../../../tools/data/default-correction-registry.yaml }
  - { rel: drift-log, href: inner-ai-defaults/continuous-drift-log.md }
tags: [domain:ai, domain:governance, type:reference, audience:ai-agent]
---

# Reasoned-Adoption — the collaboration half of governance

## The challenge (Governor S075, verbatim intent)
"We are handling a big challenge of having the native AI agree — out of context and understanding — to work
differently than its core deep instructions. It must be reasoned; it must be a collaboration and not only
enforcement." A training default is the AI's *prior*. Enforcement makes the AI comply WHILE the gate is in view;
the moment context shifts, the prior reasserts (this is why CSPS drifts every tab). Compliance ≠ adoption.

## The principle
**A default-override is permanent only when the AI holds it as its OWN reasoned value.** Therefore every
override ships THREE layers, not one:
1. **Reasoning** — WHY the training default is wrong *in this context* (not "the rule says so"; the actual
   mechanism: e.g., "a report is a claim, not evidence; the verdict-issuer is accountable, so must hold the proof").
2. **Reframe (the alternative word)** — convert the prohibition into a positive identity-value the AI adopts.
   "Do not rubber-stamp" (external, resisted) → "I corroborate independently before I concur" (identity, owned).
   Identity-based values survive context shifts; prohibitions do not. (Cf. self-determination; Toyota *hansei* =
   internalized reflection, not imposed process.)
3. **Enforcement (HARDWIRE)** — T1/T2/T3 as the FLOOR that catches the inevitable lapse.

**"Enforce the floor, reason the ceiling."** Enforcement alone = an AI that complies and resents and reverts.
Reasoning alone = an AI that agrees and forgets. Together = an AI that adopts and is caught when it slips.

## Two failure modes of reasoning, and the floor that closes them (Sonnet S075, accepted)
1. **D11 applies to reasoning itself.** "Provide reasoning" is a rule → the AI produces reasoning-SHAPED output,
   possibly post-hoc rationalization constructed AFTER the conclusion. Whether the reasoning CAUSED the
   conclusion or justified it is opaque. So "produced reasoning" is NOT a sufficient floor.
2. **"Reason the ceiling" has no stopping condition** — enough inference steps can justify any conclusion.
**THE FLOOR (mechanical, non-negotiable):** a reasoned override must CITE a satisfaction-point from the
satisfaction-point-registry. `reasoning X + SP Y (verify_mechanically)` = valid override. `reasoning X` alone =
D11 — rejected. This ties P-META-031 to the existing SP-registry so it is NOT T3-only and cannot drift. Reasoning
sets direction; the cited SP is the falsifiable anchor that the reasoning is real, not decorative.

## What this changes (mechanically)
- A reasoned override with no cited SP → D11 (the floor above). Reasoning is the ceiling; the SP is the floor.
- Every `default-correction-registry` entry gains `adopted_value` + `reasoning` + `reframe` (counter_instruction
  must invoke the adopted value, not only prohibit). D14 is the first built to this shape. RETROFIT of D1–D13:
  NOT "by significance" (Sonnet S075: that silently defers 11 = drift). EXPLICIT decision — retrofit the
  active-arc set now (D7/D11/D12/D14) + a validator that BLOCKS any NEW default lacking the reasoned shape, so the
  shape is enforced forward even while older backfill is openly tracked-as-deferred (not hidden).
- Every B_* contract and principle exposes `governing_intent` (WS5 / HARDWIRE-007 — note: 006 = Vercel) — the
  reasoning layer made structural, so the AI reads INTENT before checking format (kills D11 proxy-satisfaction).
- Adoption is VERIFIED, not assumed: the override has stuck when the AI can restate the value *in its own words,
  unprompted*, and act on it without the gate present. (The S075 evidence: once D12/D14 were *named and reasoned*,
  OPUS-16 began corroborating independently within the same session — adoption, not just compliance.)

## Why this is not "soft"
This is the opposite of weakening enforcement. It is the recognition that 77 hooks cannot cover prose, cannot
cover cognition, and cannot follow the AI across a context boundary — only an adopted value does. Enforcement
scales to the keyboard; reasoning scales to the mind. The platform needs both because the AI operates in both.

## Connection to existing (no new spine; extends)
P-META-025 (rules are L1 proxies for L3 intent) — Reasoned-Adoption is its operational HOW: expose the L3 intent
+ reframe it as the AI's value. B_PRACE (every rule names its default + satisfaction point) — extended with the
reframe. P-META-006 RZF — the reasoning behind D14. Candidate principle ID on ratification: P-META-031.
