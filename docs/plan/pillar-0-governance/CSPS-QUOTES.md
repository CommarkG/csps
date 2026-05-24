---
id: csps.governance.csps-quotes
name: CSPS-QUOTES
description: "Canonical registry of platform-defining quotes. Harvested from SIA docs, behavioral contracts, Governor directives, and session insights. Used in page headers, tooltips, onboarding. Wired to Threshold (type: quote) and Learning Loop."
type: governance
diataxis_type: reference
protection_level: active
status: active
core_spine: GVRN
schema_anchor: vault_files
version: "1.0"
session: S059
owner: group:finky
lifecycle: production
lifecycle_state: active
context_question: "Which quote best captures the intent of this page, component, or behavioral contract? A good quote is a compass — it answers 'why this exists' in one sentence."
context_quote: "A good platform quote is not decoration. It is a decision made permanent."
---

# CSPS Quotes — Canonical Registry

> Platform-defining statements. Used in page headers, help tooltips, onboarding flows.
> Every quote here has a source, a date, and a usage context.
> Threshold classification: type=quote → Learning Loop → this file.

---

## PLATFORM PHILOSOPHY

**"80% prevention during creation."**
Source: S059 Governor directive (Developer Journey tab design)
Usage: Tab functionality explanation, UX Prevention Architecture header, AGENTS.md

**"Think of it like a huge grid taking care of things, not one brain with many soldiers."**
Source: Governor, S053 | [docs/plan/pillar-0-governance/PLATFORM-GENOME.md](https://github.com/CommarkG/csps/blob/main/docs/plan/pillar-0-governance/PLATFORM-GENOME.md) context_quote
Usage: Grid Consciousness page, architecture overview, onboarding

**"The difference between an exam and a colleague is not what is asked — it is how."**
Source: Opus-8, S058 | [docs/SIA/VOICE-PROFILE-SYSTEM.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/VOICE-PROFILE-SYSTEM.md) context_quote
Usage: Voice Profiles page header, wizard intro, planning section

**"Default storage is ephemeral."**
Source: Core Seed | [tools/vault/concepts/DEFAULT-STORAGE-IS-EPHEMERAL.md](https://github.com/CommarkG/csps/blob/main/tools/vault/concepts/DEFAULT-STORAGE-IS-EPHEMERAL.md)
Usage: Session harvesting pages, memory/persistence explanations

**"Any invested energy must have a place."**
Source: R1-08-TEMPLATE-BUNDLE-SYSTEM | [docs/SIA/R1-08-TEMPLATE-BUNDLE-SYSTEM.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R1-08-TEMPLATE-BUNDLE-SYSTEM.md) context_quote
Usage: Template Bundle System page, app building onboarding

**"The test that cannot be run yet is the specification for what must be built."**
Source: INFRA-FLOW | [docs/SIA/INFRA-FLOW-VALIDATION.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/INFRA-FLOW-VALIDATION.md) context_quote
Usage: Developer Journey page, INFRA-FLOW section header

**"Everything goes through here before touching any platform element."**
Source: Threshold | [docs/SIA/R1-04-THRESHOLD.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R1-04-THRESHOLD.md) context_quote
Usage: Threshold page, planning wizard intro

---

## PREVENTION ARCHITECTURE

**"The whole industry runs after closing gaps. CSPS closes the gap before it opens."**
Source: Opus-8, S059 | [docs/SIA/UX-PREVENTION-ARCHITECTURE.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/UX-PREVENTION-ARCHITECTURE.md)
Usage: UX Prevention page header, AGENTS.md hard NOs intro

**"A page without purpose answers what it is, not what the user does."**
Source: Opus-8, S059 UX audit
Usage: PageContext documentation, page design checklist

**"Writing a rule is 0% complete. T1+T2+T3 is 100% complete."**
Source: AGENTS.md hard NO (B_PRACE)
Usage: Governance onboarding, enforcement documentation

---

## QUALITY STANDARDS

**"DONE = built + pnpm verify exit_code=0 + behavioral test evidence."**
Source: startup.template.md | [tools/templates/startup.template.md](https://github.com/CommarkG/csps/blob/main/tools/templates/startup.template.md)
Usage: Completion page, validation gate explanations

**"Re-run IS the proof."**
Source: B_ZF_TERMINATION_DISCIPLINE
Usage: ZF cycle documentation, validation sections

**"A gap with K≥2 that is only documented is NOT improving — it is accumulating."**
Source: [tools/data/gap-recurrence-register.yaml](https://github.com/CommarkG/csps/blob/main/tools/data/gap-recurrence-register.yaml) header
Usage: Gap register page, improvement documentation

---

## AI BEHAVIOR

**"One central engine. Sub-engines activated by need. Intelligence scales with compute, not with architecture."**
Source: PIE R2-01 | [docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R2-01-PLATFORM-INTELLIGENCE-ENGINE.md) context_quote
Usage: Intelligence Engine page, PIE documentation

**"L3 journeys are not designed by hand. They are generated from the L2 option space by the orchestrator."**
Source: R3-01 | [docs/SIA/R3-01-JOURNEY-FRAMEWORK.md](https://github.com/CommarkG/csps/blob/main/docs/SIA/R3-01-JOURNEY-FRAMEWORK.md) context_quote
Usage: Journey Framework page, user journey documentation

---

## USAGE RULES

1. Every platform page may display one quote — relevant to the page's purpose
2. Help tooltips (? icon) may use a quote as the opening line
3. Onboarding flows use quotes as stage transitions ("Before we continue...")
4. Quotes rotate in the PDI Dashboard header (future feature)
5. New quotes: must have a SOURCE + DATE + USAGE context before adding here
6. Threshold classification: inputs of `type: quote` → auto-proposed for this registry

---

*CSPS Quotes Registry v1.0 | S059 | Opus-8*
*Append new quotes with source. Never remove — mark deprecated if retired.*
