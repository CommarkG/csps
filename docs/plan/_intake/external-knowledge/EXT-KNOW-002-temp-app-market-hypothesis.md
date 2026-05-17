---
id: csps.intake.ext-know-002
name: EXT-KNOW-002-temp-app-market-hypothesis
description: "Working market hypothesis for [Temp name!!!] — crystallized intent statement, proven assets, open unknowns."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: ext_know_entry
diataxis_type: reference
session: S039
ext_know_id: EXT-KNOW-002
source: "[Temp name!!!] project — files 01 (Strategic Baseline) and 00 (Master Index)"
date_captured: 2026-05-17
status: raw
evidence_level: 1
csps_outcome: COMPLEMENT
artifacts_produced: [PROP-APP3-001]
---

# EXT-KNOW-002 — [Temp name!!!] Market Hypothesis

**DNA Confrontation result: COMPLEMENT** — This is App #3 intake via P-META-022 (intent crystallization).

---

## Crystallized Intent (CSPS P-META-022 format)

**What it produces:** Structured jobsite outputs (written approvals, change orders, client updates, follow-up actions, tomorrow's plan) from unstructured field input (voice, photos, drive-time dictation).

**For whom:** Small construction business owners with crews under 10 operating in the US market.

**When:** During drive-time (to/from job site) and field transitions — when admin is impossible but decisions are made.

**The first value moment (CSPS archetype: EFFICIENCY_SEEKER):** "I dictated a change order on the drive home and it was sent to the client before I pulled into my driveway."

---

## Proven Assets (Governor's validated capabilities)

- Deep understanding of business process and communication dynamics
- Experience selling custom B2B products in high-trust relationships
- Ability to build app/SaaS prototypes rapidly (CSPS platform enables this)
- Initial ADHD-trigger research refined to operational pain language

---

## Open Unknowns (evidence level 0-1 — not yet validated)

| Unknown | Current assumption | Evidence level | Validation path |
|---|---|---|---|
| US contractors feel this pain strongly enough to pay | Assumed | 1 | Direct interviews (file 06) |
| Crews under 10 is correct first segment | Assumed | 0 | Market sizing + interviews |
| Voice is natural for repeated use while driving | Assumed | 1 | Field testing |
| App better than concierge MVP | Assumed | 0 | Concierge test first |
| First wedge = drive-time voice capture | Assumed | 1 | VOC Bank validation |

---

## Evidence Level System (absorbed from [Temp name!!!], aligned to CSPS RZF)

| Level | Definition | CSPS equivalent |
|---|---|---|
| 0 | Idea / assumption | Pre-crystallization |
| 1 | One anecdote | Single EXT-KNOW entry |
| 2 | Repeated language across sources | Multiple EXT-KNOW entries, same pattern |
| 3 | Multiple sources + market behavior | RZF achieving pattern |
| 4 | Interview validation | ZF cycle with evidence |
| 5 | Payment / signup / usage signal | Done criterion: user_journey_test PASS |

**Level 5 = UJT-PASS in CSPS** — the evidence-based done declaration for a market hypothesis.

---

## CSPS Module Mapping

| [Temp name!!!] feature | CSPS module already built |
|---|---|
| Drive-time voice dictation | `libs/integrations/speech/buffer.ts` |
| Auto-correction of domain terms | `libs/integrations/speech/dictionary.ts` |
| Suspicious term flagging | `libs/integrations/speech/detector.ts` |
| Change order structured output | `libs/integrations/email/templates/*.ts` |
| Client update delivery | `libs/integrations/email/client.ts` |
| Tomorrow's plan digest | `libs/integrations/jobs/functions/send-digest.ts` |
| Review session UI | `libs/components/src/data-table/DataTable.tsx` |

**Observation:** CSPS is 80% ready to serve [Temp name!!!] with infrastructure already built.

---

## PROP-APP3-001 (No implementation — proposal only)

**Proposal:** [Temp name!!!] as App #3 on CSPS platform.

- Domain: Construction field operations, US market, crews under 10
- First wedge: Drive-time voice capture → structured change-order output
- CSPS modules needed: All available ✅
- Missing: Domain schema (ChangeOrder, JobSite, Crew models in schema.zmodel)
- Path: Intent crystallization → PE-scored topic-plan → Governor ratifies → pnpm create:app in sandbox

**This proposal requires Governor ratification before any planning begins.**

---

*EXT-KNOW-002 | Status: raw | Evidence level: 1 | App #3 candidate | PROP-APP3-001 filed*
*Absorbed from [Temp name!!!] project files 00, 01 | 2026-05-17*
