---
id: csps.governance.core-complete-exit-criteria
name: CORE-COMPLETE-EXIT-CRITERIA
description: "Governor-ratified exit criteria for each of the 4 Core layers. When all 4 layers pass, Core is complete and Developer's Journey begins. Ratified S055 by Governor."
version: "1.0"
type: governance
protection_level: protected
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
session: S055
diataxis_type: reference
impl_status: swift-implemented
context_question: "Which Core layers are complete and which are still open? Do not start Developer's Journey until all 4 layers pass their exit criteria."
context_quote: "Core must be completed before the Developer's Journey is ratified. The Developer's Journey is ratified before any app is built."
inherits_from: "Platform Genome §7 Phase Build Order"
links:
  - { rel: platform-genome, href: PLATFORM-GENOME.md }
  - { rel: unified-plan, href: ../../../tools/config/unified-plan.yaml }
---

# CORE COMPLETE — Exit Criteria

> Governor-ratified S055. These are the gates. Pass all 4 = Core is done.
> Do not advance to Developer's Journey until ALL layers pass.

---

## DOCTRINE (Governor directive S055)

```
Core → Developer's Journey → External User's Journey → First App (wet trial)

NO APP IS TO BE BUILT BEFORE A DEVELOPER'S JOURNEY IS RATIFIED.
BUILDING THE APP IS THE FIRST WET TRIAL FOR EXTRACTING IMPROVEMENTS.
```

---

## Layer 1 — R1 Schema Layer

**Status:** IN PROGRESS — 3/4 exit criteria met. Blocked on Supabase provision for TENANCY+AUDIT_BASE bundles.

Exit criteria (all must pass):
- [x] THRESHOLD-CODE Phase 1 built and passing — 10 input types classified, 7 pipelines routing (libs/threshold/ 22/22 tests, S056 commit 50a1491)
- [x] BEHAVIOR-HUB schema ratified, YAML Phase 1 operational (libs/behavior-hub/ 23/23 tests, S056 commit 1c2d192)
- [ ] Template Bundle Foundation Bundles sealed: AUTH / TENANCY / AUDIT_BASE / DEPLOY_PIPELINE / GOVERNANCE_LAYER — 3/5 sealed (TENANCY+AUDIT_BASE blocked on Supabase provision)
- [x] DOCUMENTATION-IN-SCHEMA: context_question coverage ≥150 files (209/452 = 46%, S056 commit 50a1491)

**ZModel/DB ratification (Governor S055):** Provision Supabase alongside R1 Layer completion — before Template Bundle TENANCY bundle is sealed, ZModel must exist. Sequence: Threshold + BehaviorHub schema first → Supabase provision → TENANCY bundle sealing.

---

## Layer 2 — R2 Intelligence Layer

**Status:** COMPLETE — all 3 exit criteria met (S056)

Exit criteria:
- [x] PIE R2-01 design complete — all TO FILL sections filled, Governor-ratified (Opus-8 S056 Turn 4)
- [x] PIE Phase 1 built: PE sub-engine + Learning Loop sub-engine operational (libs/intelligence/ 21/21 tests, S056 commit eb9350f)
- [x] Conflict Detector and Readiness Gate defined and wired (B_PIE_READINESS_GATE + validate-pie-readiness-gate.mjs, S056 PROTO-D)

**PIE sub-engines (Governor-ratified S055):**
```
Central Intelligence Engine (CIE) — root
├── PE Sub-engine        [D1 always active]
├── Learning Loop        [D1 always active → full activation: session close, K≥2]
├── Scope Router         [D1 always active → full activation: S3 classification]
├── Seeds Monitor        [D1 always active → full activation: seed overdue]
└── Documentation Engine [D1 always active → full activation: node change]
```

---

## Layer 3 — R3 Developer's Journey

**Status:** IN PROGRESS (S057 PROTO-C) — INFRA-FLOW 8/9 ACTIVE. Layer 3: 2/4 fully checked.

Exit criteria:
- [ ] INFRA-FLOW-VALIDATION: all 9 steps passing end-to-end (8/9 ACTIVE: Steps 1-9 except Step 2 MDPE full automation. Composite test partially runnable.)
- [x] Journey Framework L2 option space complete (R3-01 ratified S056 + /platform/developer-journey L2 page + /platform/user-journey L2 page built S057 PROTO-C)
- [ ] Playground reference implementation shows complete developer journey (PARTIAL: developer-journey page shows L2 option space. User journey NOT BUILT honestly disclosed. Full implementation pending BehaviorHub Phase 2.)
- [x] PLAYGROUND-CORE-ELEVATION: all key pages with pageDNA and working content (done S054, 17/17 pages including wizard S057)

---

## Layer 4 — R4 Frontend Inheritance

**Status:** NOT STARTED (S058-S059 target)

Exit criteria:
- [ ] libs/ui/ 7 Foundation Components built and tested
- [ ] apps/template/ inherits from libs/ui/ (all components resolvable at fork)
- [ ] TEMPLATE-BUNDLE-SYSTEM: 3 bundles sealed (Foundation + Auth + Governance)
- [ ] COMPONENT-LIBRARY: CSPSPage + CSPSDataTable + HealthBar + GapCard + MetricBadge + JourneyStep + GuardQuestionForm

---

## CORE COMPLETE GATE

When all 4 layers pass → Governor ratifies "Core Complete" → Developer's Journey ratification begins.
Developer's Journey ratified → First app build begins as wet trial.
Wet trial complete → Extract improvements → Ratify External User's Journey.

---

*Ratified: S055 | Opus-8 | Governor: Yariv Fink*
