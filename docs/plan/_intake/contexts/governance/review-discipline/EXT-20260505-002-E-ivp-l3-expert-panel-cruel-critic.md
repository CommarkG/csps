---
extraction_id: EXT-20260505-002-E
parent_input_id: EXT-20260505-002
section_label: "§14 IVP review (5+1 personas) + §15 L3 Expert Panel (6 voices) + §16 Cruel-critic discipline"
source_type: AI_OTHER
confidence: 0.92
confidence_band: human-review
lifecycle: production
lifecycle_state: pending-review
state_transitioned_at: 2026-05-05T04:35:00Z
pipeline_state: routed
routed_to: docs/plan/pillar-5-ai-systems/ + new review-discipline leaf + composition with B_PCR_FOR_DECISIONS
next_review_at: 2026-05-06T04:35:00Z
risk: low
trust_tier: external_ai_export
tags:
  - domain:governance
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
mini_tree_layer: L1+L2 (essence + adaptation; L3 deep-dive deferred to actual review-firing)
deep_dive_schedule: S010-S011 — apply at first CSPS CONSTITUTIONAL change (e.g., ADR-0025 CNST/GVRN split) OR at high-blast topic-plan layer transitions
priority_for_10_phase_completion: MEDIUM (helpful for Phase 7 file splits + Phase 8 principles-mcp build but not blocking)
consolidation_cross_refs:
  - feedback_pcr_for_decisions.md (memory entry 19) — CSPS B_PCR_FOR_DECISIONS is the philosophical foundation; this extends with 6+5+1 named-personas
  - feedback_top_expert_colleague_voice.md (memory entry 2) — CSPS direct/push-back voice; cruel-critic is the formalization
inherited_from_input:
  - source_type: AI_OTHER
  - risk: low
sla_due:
  routed_for_review: 2026-05-06T04:35:00Z
---

# Extract E — IVP 5+1 personas + L3 Expert Panel 6 voices + Cruel-critic discipline

## Essence

CSP applies **3 review disciplines** at increasing blast levels:
- **IVP review** (5+1 internal personas: Architect / Engineer / Ops / Security / UX / Solution-CsMSE) — mandatory at any cross-spine ≥3 OR blast≥4
- **L3 Expert Panel** (6 external voices: UX-UI / DevOps / ML-AI / Security / Business / Systems Architect) — fires at blast≥7 OR new phase OR CONSTITUTIONAL
- **Cruel-critic** — adversarial review with **mandatory minimum N substantive amendments** (typically ≥3) BEFORE ratification; "cruel" framing forces actual criticism not politeness

**CSPS has B_PCR_FOR_DECISIONS** (analog discipline) but **no named-personas review + no blast-tiered escalation + no cruel-critic mandatory-minimum**. Single-AI PCR misses what 6+5+1 lenses catch systematically.

## Verbatim source quotes

**Cruel-critic (§16):**
> "Single-AI self-critique consistently produces 0-1 amendments; properly-framed cruel-critic produces 3-7."
> "Politeness erodes adversarial rigor. The 'cruel' framing + mandatory minimum forces the critic to actually criticize."
> "Reference example: Cruel-critic 5 amendments (S336 token economics plan)" [5 named amendments listed]

**IVP 6 personas (§14):**
> "Architect (schema integrity) / Engineer (implementation) / Ops (reliability + cadence) / Security (privilege + leak) / UX (Governor-facing surface) / Solution-CsMSE (downstream impact)"

**L3 Expert Panel (§15):**
> "Pre-Mortem: 'Imagine this fails 6 months from now. What broke?'
> Red Voice: designated adversarial position required to find ≥1 substantive concern
> Zero-Findings Gate: L3 sign-off only when each voice's substantive concerns either resolved or accepted with rationale"

## CSPS current state

- **B_PCR_FOR_DECISIONS** (P-OP-003 strengthened) — Pros/Cons/Recommendation 3-block + what-would-flip clause
- **No named personas** — PCR is single-AI cognitive lens
- **No blast-tiered review escalation** — every PCR is same-discipline regardless of blast
- **No cruel-critic discipline** — single-AI PCR can be too polite to itself
- **No L3 Expert Panel** — but CSPS has Subagent-delegated Layer 5 (per P-META-009 CCA) which COULD instantiate the 6 voices via spawned subagents

## Recommended downstream action

**Per save+schedule directive — defer to S010-S011:**

1. **EXTEND B_PCR_FOR_DECISIONS** with blast-tiered escalation:
   - blast≤3 (low) → standard 3-block PCR (current)
   - blast 4-6 (medium) → PCR + IVP 5+1 (subagent-spawned with persona prompts per CSPS adaptation: Architect / Engineer / Ops / Security / UX / Solution — drop Solution-CsMSE since no CSPS solution layer yet)
   - blast≥7 (high) → PCR + IVP + L3 Expert Panel 6 voices + cruel-critic mandatory ≥3 amendments
2. **NEW LEAF candidate (defer):** `docs/plan/pillar-5-ai-systems/review-discipline.md` — CSPS-canonical 3-tier review escalation
3. **NEW SUBAGENT TEMPLATES (S009-S010):** spawn-prompt templates for each of 6+5+1 personas under `.claude/skills/` OR via Mastra runtime (week-6+)
4. **NEW CONTRACT candidate:** B_CRUEL_CRITIC_REVIEW (per CSP analog B_CRUEL_CRITIC) — mandates ≥3 amendments before ratification at blast≥7

## Open questions

- IVP CSPS-adapted personas — keep CSP's 6 verbatim or substitute (e.g., drop Solution-CsMSE; add CSPS-specific governance lens)?
- L3 Expert Panel — instantiate as Class C/D Mastra subagents (week-6+) OR Class B Claude Code subagents (now)?
- Cruel-critic mandatory minimum — 3 amendments per CSP standard OR calibrate for CSPS scale?

## Engraving readiness

⚠️ DEFERRED to S010-S011 deep-dive when first CSPS CONSTITUTIONAL change opens (e.g., ADR-0025 CNST/GVRN split). Foundation-stability principle: don't engrave review discipline before CSPS has work that needs it.
