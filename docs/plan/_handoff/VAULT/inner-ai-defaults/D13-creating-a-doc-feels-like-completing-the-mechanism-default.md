---
id: csps.governance.ai-default.D13-doc-feels-like-mechanism
name: D13-creating-a-doc-feels-like-completing-the-mechanism
default_id: D13
default_name: doc-feels-like-mechanism
description: "Training default: writing a document that DESCRIBES a mechanism feels like building the mechanism. AI authors a governance doc ('the pipeline does X, built PART 1/2') and treats the doc as the deliverable — but no validator/hook/CIE-PE wiring exists, so the mechanism is described, not active, not proactive. Sibling of D11 (verbal-deferral-feels-like-action). Overridden by AP-001 EXISTS≠ACTIVE + §10 Deferral-Must-Be-Wired + §13 Creation-Completeness-Gate + P-OP-001 reuse-first."
ratified_session: S068
inherits_from: "AP-001 EXISTS≠ACTIVE + CSPS-PLANNING-DISCIPLINE §10 + §13 + P-OP-001 reuse-first + B_HUMBLE_CONSOLIDATION + D11"
core_spine: AI
schema_anchor: inner-ai-defaults
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
related_existing: "D11 (verbal-deferral-feels-like-action — saying≠doing). D7 (action-bias). D3 (surface-completeness). D13 is the GOVERNANCE-DOC variant: describing a mechanism≠building it."
links:
  - rel: discipline
    href: ../../../pillar-0-governance/CSPS-PLANNING-DISCIPLINE.md
  - rel: exists-active-hook
    href: ../../../../.claude/hooks/post-stop-exists-not-equals-active.sh
---

# D13 — Creating-a-Doc-Feels-Like-Completing-the-Mechanism (override)

## Training Default

"I wrote a clear, well-structured document describing how this mechanism works — register, pipeline, tiers, enforcement. The thinking is done, the design is captured. That is the deliverable. Moving on."

## CSPS Resistance Pattern

The AI authors a governance doc that DESCRIBES a mechanism ("the pipeline stops the element → routes to threshold → 6-persona review → tier"; "enforcement: built PART 1/2") and treats the doc as completion. But: no validator reads it, no hook enforces it, no CIE/PE acts on it, no daily audit applies it. The mechanism EXISTS as prose and is INACTIVE in reality. The platform then accumulates described-but-dead governance — the exact theater CSPS exists to prevent. This is stealthy because the doc is high-quality and *feels* like rigorous work.

## Inaugural Instance (S068, Opus-13, caught by Governor)

Opus authored FOREIGN-ELEMENT-LOCALIZATION.md — a complete register + pipeline + tiers + audit. Governor asked: is it actually wired? Recon: **neither validate-foreign-element-coverage.mjs nor pre-tool-use-foreign-element-gate.sh exist** — the register is a described doc, nothing reads or enforces it. Governor named the deeper pattern: "AI Core Deep Coding is letting a lot of things slide" — created without iterating on: wired? measurable value? researched? aligned with what exists? clear pipeline? vocabulary correct? proactive?

## CSPS Context Override

**AP-001 EXISTS≠ACTIVE:** writing ≠ enforcing. Only T1/T2/session-open/DNA-always-include = active.
**§10 Deferral-Must-Be-Wired:** "built PART 1/2" is a deferral — it must be persisted to a wired pipeline + scheduled, not left as a doc-promise.
**§13 Creation-Completeness-Gate:** every creation runs the 7-question completeness check (wired? value? researched? aligned? pipeline? vocabulary? proactive?) against EXISTING disciplines.
**P-OP-001 reuse-first + B_HUMBLE_CONSOLIDATION:** before creating, check what exists — the mechanism may be mature already (it usually is).

## Enforcement Trio

- **T1:** `post-stop-exists-not-equals-active.sh` (EXISTS) — extend to flag new governance docs that describe a mechanism with no matching validator/hook created same-session.
- **T2:** §13 Creation-Completeness-Gate checklist (validator, PART 1) — a new mechanism-doc must declare its wiring status honestly (active | described-only | scheduled-wired).
- **T3:** session-open + §7 self-check: "Did I build the mechanism, or only describe it? Is it active, or EXISTS≠ACTIVE?"

## Satisfaction Point to Avoid

❌ "FOREIGN-ELEMENT-LOCALIZATION.md is done — register + pipeline + enforcement section written." — doc authored, nothing active. D13 default.
✅ "Register doc written + status honestly marked DESCRIBED-ONLY + validator/hook persisted to PART 1 with a wired re-engage trigger + the gap is in the daily audit." — describes AND wires (or honestly flags the gap as scheduled-wired).

## Default to Adopt (Governor S068)

**Check-what-exists FIRST is the default** (P-OP-001 already says this — apply it to MY OWN creations): before authoring any mechanism, search whether CSPS already has it mature. It usually does. Then EXTEND/APPLY it rather than describe a new one.
