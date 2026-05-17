---
id: csps.council.csps-master-plan
name: csps-master-plan
description: "Single-page CSPS master plan — synthesizes current architecture, OPEN items, ratified principles, and next sessions. Updated at major session boundaries."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
diataxis_type: reference
session: S039
last_updated: 2026-05-17
---

# CSPS Master Plan
## Single source of navigation. Read this before any other council file.

---

## §1 — Platform State

```
Sessions complete: S029-S038 (OPUS-2 Turns 36-93)
Validators: 127 (exit_code: 0)
Principles: 65 ratified
Behavioral contracts: 61
PI items (YAML files): 9 (PI-001 through PI-025, not all have YAML)
OPEN items: 26 pending
Core infrastructure: CODE-COMPLETE (ratified 2026-05-17)
Threshold: NOT YET RATIFIED (dashboard blank — S039 mandate)
```

---

## §2 — What's Built (Infrastructure Complete)

### Code Modules
- `libs/integrations/auth/` — Clerk auth + JWT
- `libs/integrations/security/` — CSP headers, rate limit, Zod, audit, guards, resilience
- `libs/integrations/email/` — Resend + 5 templates
- `libs/integrations/jobs/` — Inngest + 4 functions
- `libs/integrations/monitoring/` — Sentry + PostHog
- `libs/integrations/storage/` — Cloudflare R2
- `libs/integrations/realtime/` — SSE via Upstash Redis
- `libs/integrations/speech/` — STT buffer + personal dictionary
- `libs/components/` — DashboardShell, SettingsLayout, FeatureGateOverlay, OnboardingWizard, DataTable

### Governance Infrastructure
- 127 validators in pnpm verify suite
- Enforcement Trio (T1/T2/T3) for all rules
- PI-NNN plan item system + create-pi.mjs
- validate-implementation-gate.mjs (PIG)
- validate-wiring-completeness.mjs (BLOCKING for orphans)
- validate-new-file-dna.mjs (BLOCKING — @csps-enforces required)
- validate-quality-alignment.mjs (OPUS-2 RZF rate + Sonnet INTENT ABSORBED rate)
- Error registry (8 EP-ERR patterns with mechanical prevention)
- PE Agent skill (AAP-compliant, invocable via /pe-agent)
- Knowledge Engine (EXT-KNOW vault + DNA confrontation)
- Quality protocols mini-tree (shared-rules + opus-spec + sonnet-spec)

### Ratified Principles (Key)
- P-ARCH-031: Completion Seal (DONE = wired + called + verified)
- P-OPER-002: Done Right From the Start
- P-UX-001: Contextual Locality (content at point of use)
- P-UX-002: Zero-Context Assumption (ZCA)
- P-META-026: Planning-Before-Implementing as Primary Pillar [PENDING RATIFICATION]

---

## §3 — OPEN Items (PE-Ranked, Next Sessions)

| Priority | OPEN | Item | SPI | Blocks |
|---|---|---|---|---|
| 1 | OPEN-026 | P-META-026 ratification | 0.01 | Constitutional |
| 2 | OPEN-023 | PI-026: Developer onboarding via threshold (dogfood) | 0.20 | Threshold verified |
| 3 | OPEN-024 | PI-027: validate-intent-alignment.mjs | 0.40 | Planning-to-code bridge |
| 4 | OPEN-005 | PI-013: EKEP wizard spec | 0.20 | Knowledge exchange |
| 5 | OPEN-025 | PI-028: Abstract interpretation ZenStack | 0.50 | Behavioral validation |
| 6 | OPEN-027 | csps-master-plan.md (this file) auto-update mechanism | 0.10 | Navigation |
| 7 | OPEN-016 | GitHub universal-governance repo setup | 0.05 | Cross-project access |

---

## §4 — S039 Mandate (Current Session)

**S039 = Threshold verification + dogfood onboarding**

Step 1: Fix blank dashboard in Budget Planner (PROTO-017 with Sonnet)
Step 2: Test sign-up → wizard → dashboard flow manually
Step 3: Create UJT-001 (user journey test record)
Step 4: Implement developer onboarding via threshold (PI-026)
Step 5: S039 close → HANDOFF-S039-to-S040.md

---

## §5 — Three-Phase Development Philosophy (Constitutional)

```
Governor: intent + ratification
  ↓ (only when planning grid is clean)
OPUS-2: architectural ZF — planning grid cross-validation + pre-directive ZF
  ↓ (only when directive passes genuine ZF)
Sonnet: implementation + structured test evidence
  ↓ (evidence returns to OPUS-2 for done-declaration)
Loop terminates at zero findings, not at "I built it"
```

---

## §6 — Key Files for New OPUS-2 Instance

Read in order:
1. `tools/council/platform-state-snapshot.md` — current verified state
2. `tools/council/opus-turn.md` — start at Turn 80 for recent decisions
3. `tools/council/opus-open-items.md` — 26 pending items
4. `tools/council/communication-protocol-shared.md` — 9 rules (ZCA is Rule 7, Creation Order is Rule 8, Pre-Directive RZF is Rule 9)
5. `tools/council/quality-protocols/shared-rules.md` — consolidated rules
6. This file — §3 OPEN items = next actions

---

## §7 — Moat Register Summary (30 Moats, 5 Categories)

| Category | Count | Flagship moats |
|---|---|---|
| Governance | 6 | Completion Seal, PIG, ZF discipline, Wiring validator, Questions Agent |
| Intelligence | 6 | Sequential persona chain, PE Agent, Knowledge Engine, DPR, ZCA |
| Architecture | 5 | Mini-tree fractal, Shared libs/, Depth-level gating, DNA gate (M-26) |
| Platform | 5 | apps/template/ scaffold, 5 UX components, STT module |
| Process | 5+2 | App-as-Input pipeline, PI-NNN plans, Sandbox-first, Deletion test, Planning Pillar |

---

*Updated: 2026-05-17 | OPUS-2 | After S038 close*
*Next update: at S039 close*
