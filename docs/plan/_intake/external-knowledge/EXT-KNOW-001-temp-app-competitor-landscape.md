---
id: csps.intake.ext-know-001
name: EXT-KNOW-001-temp-app-competitor-landscape
description: "Competitor landscape for [Temp name!!!] — field-first operations app for small construction businesses. 10 market players analyzed."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: ext_know_entry
diataxis_type: reference
session: S039
ext_know_id: EXT-KNOW-001
source: "[Temp name!!!] project — competitor research files 03, 03-01 through 03-05"
date_captured: 2026-05-17
status: raw
evidence_level: 1
csps_outcome: COMPLEMENT
artifacts_produced: []
---

# EXT-KNOW-001 — [Temp name!!!] Competitor Landscape

**DNA Confrontation result: COMPLEMENT** — CSPS has no construction-domain competitor research. This fills a gap.

**CSPS vocabulary note:** "competitors" here means existing market players in the target domain. In CSPS terms, these are market alternatives that the [Temp name!!!] app (App #3 candidate) would compete with.

---

## Market Summary

**Domain:** Field-first operations for small US construction business owners, crews under 10.

**Core problem (in CSPS terms):** Unstructured voice/field input does not reliably become structured outputs (written approvals, client updates, follow-ups, payment actions). The STT module CSPS just built directly addresses this.

**Evidence level:** 1 (initial research — not yet interview-validated)

---

## Market Players (10)

Translated to CSPS terminology — no company-specific jargon used:

| Player | Category | What it does well | What it misses | Relevance to [Temp name!!!] |
|---|---|---|---|---|
| **Buildertrend** | Full construction platform | Change orders, client visibility, approvals | Too heavy for crews under 10 | Learn their change-order workflow |
| **Jobber** | Field-service operations | Quote-to-cash simplicity, small business UX | Not construction-specific | UX benchmark for simplicity |
| **Contractor Foreman** | All-in-one contractor tool | Closer to small businesses | Still desktop-heavy | Feature gap analysis target |
| **CoConstruct** | Residential construction | Client communication | Remodeling-focused | Watch |
| **Houzz Pro** | Remodeler platform | Leads + proposals + marketing | Too design-focused | Watch |
| **Joist** | Estimates/invoices | Mobile-first, simple estimates | Limited to estimate/invoice | Payment flow reference |
| **CompanyCam** | Jobsite photo documentation | Field capture, evidence | Photos only, no voice | Closest to [Temp name!!!] capture concept |
| **Knowify** | Job costing | Financial visibility | Too financial-heavy | Watch |
| **Housecall Pro** | Home service ops | Scheduling + payments | Service not construction | Watch |
| **FieldPulse/ServiceM8/Markate** | Lightweight field tools | Simplicity | Limited scope | Competitive floor benchmark |

**Top 5 for deep research:** Buildertrend, Contractor Foreman, Joist, CompanyCam, Jobber

---

## Research Fields Needed (per market player)

In CSPS terms, each competitor profile should capture:
- Market positioning (their crystallized intent statement)
- Target tenant profile (size, industry, archetype)
- Primary promise (their graduation criteria)
- Pricing (their subscription tier structure)
- Acquisition funnel (how tenants find them)
- User testimonies (in their vocabulary — translated to EXT-KNOW type: user-language)
- What to model (features worth adapting for [Temp name!!!])
- What to avoid (where they cause friction)

---

## CSPS Connection: STT Module

The "Drive-time voice capture" concept from [Temp name!!!] maps DIRECTLY to:
- `libs/integrations/speech/buffer.ts` — captures voice input with confidence scoring
- `libs/integrations/speech/dictionary.ts` — personal corrections for domain terms (change order, jobsite, etc.)
- `libs/integrations/speech/detector.ts` — flags uncertain terms for user review
- `libs/integrations/jobs/functions/send-digest.ts` — "tomorrow's plan" output via weekly digest

**This is NOT coincidence.** The STT module was designed for exactly this use case.

---

## DNA Confrontation

**Complement (CSPS gains):** Construction-domain market intelligence CSPS doesn't have.
**No Conflict:** Nothing here contradicts sealed CSPS principles.
**Gap filled:** EXT-KNOW tagging now has type: competitor-profile to route this class of research.

---

*EXT-KNOW-001 | Status: raw | Evidence level: 1 | Next: interview validation (level 4)*
*Absorbed from [Temp name!!!] project files 03, 03-01 through 03-05 | 2026-05-17*
