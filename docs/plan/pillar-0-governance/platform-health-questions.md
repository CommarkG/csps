---
id: csps.governance.platform-health-questions
name: platform-health-questions
description: >
  30 platform health questions in 6 batteries. These are NOT generic health checks —
  they encode the CSPS platform's unique identity, competitive moats, and promise of
  innovative top-of-the-line user experience. Each question is a North Star alignment
  check: is the platform actually delivering its competitive promise, or just running?
  Organized by: Identity, Moats, Customer Experience, Multi-Tenant Excellence,
  Foundation Stability, Platform Promise. Auto-answered by health-check.mjs where
  mechanical; human-judgment for strategic questions.
  Governor directive S025.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
core_spines: [GVRN, AI, VALD, ARCH, OPER]
schema_anchor: pillar_0_governance_leaves
impl_status: swift-implemented
domain_path: platform
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - audience:developer
  - maturity:draft
session: S025
intent_crystallized: true
threshold_route: platform.governance
links:
  - { rel: question-protocol, href: ./question-protocol.md }
  - { rel: dna-protocol, href: ./dna-protocol-making-sure-that.md }
  - { rel: health-check, href: ../../../tools/health-check.mjs }
  - { rel: moat-coverage, href: ../../../tools/validators/validate-moat-coverage.mjs }
  - { rel: master-plan, href: ../../_handoff/VAULT/csps-master-plan-s025-plus.md }
---

# Platform Health Questions — The Competitive Promise Battery

> **These questions encode who we are.**
> Not "does pnpm verify pass?" — that's a function check.
> These ask: "Is the platform genuinely living up to its promise of cutting-edge
> governance, innovative UX, and multi-tenant excellence?"
>
> A platform that passes all 30 is not just working — it is building a real moat.
> A platform that fails any is discovering where the moat has a gap.

---

## How to Use This Battery

**At session open:** Run `pnpm health` — answers the 18 mechanically-answerable questions.
**At session close:** Review the 12 judgment questions — answer them honestly.
**Weekly:** Full 30-question audit — track improvement week over week.
**When claiming "the platform is ready":** All 30 must be answered YES or PARTIAL with documented plan.

**Question format:**
```
Q-H-NNN: [Battery]-[number]
Type: C/A/G/R/B/Z/P/X (from question-protocol.md taxonomy)
Mechanical: YES (health-check.mjs answers it) | NO (human judgment required)
Answer options: YES / PARTIAL [gap documented] / NO [VLT raised]
DNA Element: which of the 16 elements this question validates
```

---

## Battery 1 — Identity + Uniqueness (QH-I-001 to QH-I-005)
*Does the platform know what makes it different — and is it actually different?*

---

**QH-I-001:** Is the platform's AI-native governance (behavioral contracts + validators + hooks) actively preventing drift that would happen in a standard platform?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: validate-inner-ai-defaults-enforcement-rate.mjs — rate > 40% = YES
           validate-moat-coverage.mjs — 18/18 = YES
DNA Element: 6 (Behavioral Contracts) + 9 (Five-Surface Engraving)
North Star: "Without this platform, how many AI behavioral drifts would have occurred?"
```

---

**QH-I-002:** Is the platform's ZF discipline producing compounding improvement — are sessions finding FEWER blocking issues over time, not more?

```
Type: Z (completion evidence)
Mechanical: PARTIAL (trend requires human review)
Evidence: zf-session-tracker.json → compare blocking_found_total across last 5 sessions
DNA Element: 6 (ZF Discipline component)
North Star: "Is the platform getting cleaner over time, or accumulating debt?"
Answer signal: If blocking_found_total per session is trending DOWN → YES (compounding)
               If trending STABLE or UP → PARTIAL (governance not compounding yet)
```

---

**QH-I-003:** Does every communication boundary in the platform have an UNDERSTANDING BLOCK + ALIGNMENT CONFIRMATION — proving we treat communication gaps as the root cause of drift?

```
Type: B (boundary)
Mechanical: PARTIAL
Evidence: validate-boundary-alignment.mjs (Types E+B) + validate-sonnet-report.mjs (Type A)
           Phase 2 required for Types C+D full coverage
DNA Element: 15 (Human Intent Crystallization) + 16 (Question Protocol)
North Star: "Does every boundary force explicit alignment, or does the platform assume?"
```

---

**QH-I-004:** Is the platform's PE dashboard producing a priority queue that a new session can read and immediately know what to do — without the Governor explaining?

```
Type: P (priority)
Mechanical: YES
Evidence: node tools/validators/validate-pe-dashboard.mjs → output readable + top-1 is actionable
DNA Element: 1 (Priority Engine)
North Star: "Can the platform run a session without the Governor remembering the context?"
```

---

**QH-I-005:** Is every new work item entering through Threshold intake (9-step coaching protocol) with a human-authored goal_statement, done_criteria, and failure_signal before implementation begins?

```
Type: C (crystallization)
Mechanical: YES
Evidence: validate-intent-crystallized.mjs — blocking=0 for active deep_quality plans
DNA Element: 15 (Human Intent Crystallization) + 16 (Question Protocol)
North Star: "Is the platform immune to acting on Layer 1 expressions?"
```

---

## Battery 2 — Competitive Moats (QH-M-001 to QH-M-005)
*Does the platform have genuine moats — advantages that compound and are hard to copy?*

---

**QH-M-001:** Is the platform's governance improving itself — does each session's governance work automatically benefit all future work without requiring manual updates?

```
Type: P (priority)
Mechanical: YES
Evidence: SSoT model: threshold-intake-protocol.md is referenced by 6+ files
           validate-pe-dashboard.mjs: each improvement propagates to all plans
           contracts:split / principles:split: monolith → slices automatic
DNA Element: 7 (Templates) + 5 (ZF Discipline)
North Star: "Does improving one thing automatically improve many things?"
```

---

**QH-M-002:** Is the platform's DNA gate actually enforcing that every new element considers all 16 DNA dimensions — or is it just a checklist that gets ignored?

```
Type: Z (completion evidence)
Mechanical: PARTIAL
Evidence: validate-universal-alignment.mjs (advisory) — check warnings count
           DNA gate compliance rate: count plans with DNA gate explicitly passed
DNA Element: ALL 16 elements
North Star: "Is DNA a real constraint or a paper exercise?"
Answer signal: If validate-universal-alignment.mjs warnings = 0 for new artifacts → YES
               If warnings exist for new S025+ artifacts → PARTIAL
```

---

**QH-M-003:** Does the platform's behavioral contract system (56 B_* contracts) have ZERO unresolved contradictions — meaning every AI receives consistent direction?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: validate-contract-harmonization.mjs — tensions=0 = YES
DNA Element: 6 (Behavioral Contracts)
North Star: "Does every contract point in the same direction?"
Current: tensions=0, orphans=11, overlaps=1 → PARTIAL (11 contracts need audit-runner slugs)
```

---

**QH-M-004:** Is the platform's question protocol producing measurable context preservation — can any session read the previous session's question_register and recover full context without asking the Governor?

```
Type: X (context preservation)
Mechanical: NO (human judgment)
Evidence: Pick any previous HANDOFF → can a new session recover full context from questions+answers alone?
DNA Element: 16 (Question Protocol)
North Star: "Does the question chain replace memory?"
```

---

**QH-M-005:** Is the platform building its apps faster with each new app — does App #2 (Budget Planner) build faster than App #1, and will App #3 build faster than App #2?

```
Type: Z (completion evidence) + P (priority)
Mechanical: PARTIAL (requires time comparison)
Evidence: Task management app (App #1) build sessions vs Budget Planner (App #2) build sessions
DNA Element: 14 (Domain Primitives — are primitives actually reused?)
North Star: "Is the foundry getting faster, or rebuilding the same foundation each time?"
Current: App #2 Layer 1 done (S025). Compare Layer 2-4 duration against App #1 equivalent phases.
```

---

## Battery 3 — Customer Experience (QH-C-001 to QH-C-005)
*Are customers (end users of CSPS apps) getting an innovative, top-of-the-line experience?*

---

**QH-C-001:** Does every CSPS app guide its users through a Threshold Wizard on first login — ensuring users understand their own goals before the app prescribes a solution?

```
Type: C (crystallization for end users)
Mechanical: PARTIAL (Budget Planner has Threshold Wizard planned; App #1 status unknown)
Evidence: Check apps/task-mgmt/ and apps/budget-planner/ for Threshold Wizard onboarding
DNA Element: 15 (Human Intent Crystallization — user-facing)
North Star: "Do CSPS app users understand their own needs, or just react to what the UI shows?"
Current: Budget Planner Layer 3 planned (Threshold Wizard). App #1: status unknown.
```

---

**QH-C-002:** Are every app's error messages actionable — can a non-technical user read the error and know exactly what to do next?

```
Type: G (gap-surfacing)
Mechanical: PARTIAL
Evidence: Check CspsError format in libs/integrations/errors.ts — does it have user-facing message?
           Test: pick 3 error scenarios, evaluate if the message tells the user what to do
DNA Element: 10 (Developer Experience — error messages are DX + UX)
North Star: "Does a failed action feel like guidance or a dead end?"
```

---

**QH-C-003:** Is the platform's billing system communicating entitlements (what you can do) rather than status (what plan you're on) — making subscription value visible to users?

```
Type: A (alignment verification)
Mechanical: NO
Evidence: Check billing state display in any CSPS app
           Does it show "You can create 5 more tasks" or "Pro Plan — Active"?
DNA Element: 13 (LAYER — billing is core/solution/mixed)
North Star: "Do users know what value they're getting from their subscription?"
```

---

**QH-C-004:** Is GDPR erasure fully implemented — can a user delete all their data in one action, with audit trail proof of deletion?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: libs/integrations/gdpr.ts exists → check eraseUser() is wired in all apps
           validate-gdpr-erasure-path.mjs (advisory) — check its output
DNA Element: 14 (Domain Primitives — GDPR is a platform primitive)
North Star: "Does the platform respect the user's right to be forgotten?"
```

---

**QH-C-005:** Can any CSPS app's data be fully queried for a single tenant without exposing any other tenant's data — even under adversarial conditions?

```
Type: R (ripple — cross-tenant blast radius)
Mechanical: PARTIAL
Evidence: ZenStack RLS policies enforced — validate-foundation-schema-drift.mjs (no drift = YES)
           Adversarial test: attempt cross-tenant query → should return 0 results
DNA Element: 2 (ZModel Schema — RLS is here) + 3 (Role-Based Permissions)
North Star: "Would a security researcher find cross-tenant leakage?"
```

---

## Battery 4 — Multi-Tenant Excellence (QH-T-001 to QH-T-005)
*Does the platform deliver genuine multi-tenant excellence — not just declared isolation?*

---

**QH-T-001:** Is tenant isolation mechanically enforced at the database level (ZenStack RLS), not just at the application level?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: libs/policies/schema.zmodel has @@allow("read", auth().tenantId == tenantId) on all entities
           validate-foundation-schema-drift.mjs exit_code=0
DNA Element: 2 (ZModel Schema)
North Star: "If the application layer had a bug, would the database still protect tenants?"
```

---

**QH-T-002:** Does every new database entity in every app inherit tenant isolation automatically — or does each developer need to remember to add it?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: All entities extend Base in schema.zmodel → Base includes tenantId
           New entities without extends Base = FAIL (validate-foundation-schema-drift catches)
DNA Element: 2 (ZModel Schema) + 8 (Templates — developer forgets without template)
North Star: "Is tenant isolation opt-in or opt-out?"
```

---

**QH-T-003:** Does the platform's onboarding create tenant context automatically for solo users — ensuring a new user doesn't get a blank, confusing experience?

```
Type: C (crystallization — user goal)
Mechanical: PARTIAL
Evidence: solo_user_flow: auto_org declared in each app's webhook route
          validate-solo-user-flow.mjs (advisory) output
DNA Element: 15 (Human Intent Crystallization — user's first experience)
North Star: "Does a new solo user immediately have context, or do they have to set things up first?"
```

---

**QH-T-004:** Is the platform's audit trail immutable — can any mutation be traced to its exact actor, tenant, and timestamp, even after the actor is deleted?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: AuditEvent uses AppendOnlyBase (no delete allowed) — schema.zmodel @@deny("delete", true)
           writeAuditEvent() called in all API routes
DNA Element: 5 (Quality Gates — auditability)
North Star: "Could a forensic audit reconstruct exactly what happened to any tenant's data?"
```

---

**QH-T-005:** Is tenant onboarding time consistent at tenant #1 vs tenant #1000 — is the platform architecture truly scalable, not just fast for the first few tenants?

```
Type: R (ripple — scale impact)
Mechanical: NO (requires load test)
Evidence: Gate 4 (Scale Ready) — not yet built. This is the trigger for load testing.
DNA Element: 12 (Context-Loss Discipline — at scale, context must not degrade)
North Star: "Does the 1000th customer get the same quality as the first?"
Current: NOT TESTED. VLT pending for scale validation. Target: S030+.
```

---

## Battery 5 — Foundation Stability (QH-F-001 to QH-F-005)
*Is the foundation solid enough to build 30 apps on without rebuilding it each time?*

---

**QH-F-001:** Can App #2 (Budget Planner) be built without modifying any foundation code (User, Tenant, AuditEvent, AppendOnlyBase, subscription, GDPR, error format)?

```
Type: Z (completion evidence)
Mechanical: YES (when Layer 4 complete)
Evidence: git diff HEAD -- apps/budget-planner/ libs/ → zero changes to libs/ = YES
DNA Element: 14 (Domain Primitives — primitives used, not reinvented)
North Star: "Is the platform foundry-ready, or does each app rebuild the foundation?"
Current: Layer 1 DONE (S025). Layers 2-4 pending S026-S028. Failure signal already defined.
```

---

**QH-F-002:** Does the platform have a complete, non-contradicting set of behavioral contracts — where no two contracts give conflicting guidance for the same situation?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: validate-contract-harmonization.mjs — tensions=0 = YES
DNA Element: 6 (Behavioral Contracts)
North Star: "Could a new AI work correctly by following the contracts alone?"
Current: tensions=0. 11 orphan contracts (no audit-runner slug). PARTIAL.
```

---

**QH-F-003:** Does every validator in the platform have a clear WHY in its code — explaining what structural failure it prevents, not just what it checks?

```
Type: G (gap-surfacing)
Mechanical: PARTIAL
Evidence: validate-instruction-context.mjs — checks for WHY comments in validators
           Sample 5 validators manually for WHY clarity
DNA Element: 5 (Quality Gates — the quality of quality checks)
North Star: "If a validator starts failing, does the developer immediately understand why it matters?"
```

---

**QH-F-004:** Is the platform's DNA gate (16 elements) producing genuine compliance — does every new plan show evidence of DNA consideration, not just an acknowledgment checkbox?

```
Type: Z (completion evidence)
Mechanical: PARTIAL
Evidence: S025+ plans: check that DNA elements are referenced in plan body, not just "N/A"
DNA Element: ALL 16 (this IS the DNA gate question)
North Star: "Is DNA a design constraint or a compliance theater?"
```

---

**QH-F-005:** Is pnpm verify producing ZERO false positives — do all advisory validators surface real issues, not noise that gets ignored?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: pnpm verify output → count advisories → compare to % addressed in recent sessions
           If advisories accumulate with no action → false positive problem
DNA Element: 6 (ZF Discipline)
North Star: "Are platform warnings worth reading?"
Current: Most advisories are real issues (open plan levels, question coverage). PARTIAL.
```

---

## Battery 6 — Platform Promise (QH-P-001 to QH-P-005)
*The North Star battery: is the platform actually keeping its core promises?*

---

**QH-P-001:** Can a non-founder developer build a new CSPS app from the template, follow the golden path, and produce a working multi-tenant app without calling the founder?

```
Type: X (context preservation — docs as preserved context)
Mechanical: PARTIAL
Evidence: Gate 3 (Foundry Ready) cold-start test — not yet run
DNA Element: 10 (Developer Experience)
North Star: "Is the platform truly self-service, or does it require tribal knowledge?"
Current: NOT YET TESTED. Target: S028 Budget Planner Layer 4.
```

---

**QH-P-002:** Is the platform's AI behavior genuinely more aligned with CSPS context than with AI training defaults — is the inner-AI-defaults registry actually overriding default behaviors?

```
Type: B (boundary — AI behavior at every boundary)
Mechanical: YES
Evidence: validate-inner-ai-defaults-enforcement-rate.mjs → rate > 50% = PARTIAL → 70% = YES
DNA Element: 16 (Question Protocol — questions are the override mechanism)
North Star: "Is the AI working for the platform, or just running its training defaults?"
Current: ~50% enforcement rate. PARTIAL. Target: 70% by S028.
```

---

**QH-P-003:** Is the platform's question register (answered questions in sessions) growing — proving that context is being preserved and not re-discovered?

```
Type: X (context preservation)
Mechanical: NO
Evidence: HANDOFF files → count Q-type questions + answers across last 5 sessions
           Increasing question count = context compounding → YES
DNA Element: 16 (Question Protocol)
North Star: "Is the platform getting smarter with each session?"
```

---

**QH-P-004:** Is the platform's PE system preventing shiny-object drift — are sessions consistently working on Band 1-2 items rather than being pulled to interesting-but-lower-PE work?

```
Type: P (priority)
Mechanical: PARTIAL
Evidence: Session history: what % of session work was in Band 1-2 PE? Target: >80%
DNA Element: 1 (Priority Engine)
North Star: "Is the platform always working on what matters most?"
```

---

**QH-P-005:** When the platform says "done" — is it provably done? Is every DONE claim backed by THIS-SESSION validator output, not memory of a previous run?

```
Type: Z (completion evidence)
Mechanical: YES
Evidence: post-stop-pnpm-verify.sh runs at every Stop — this IS the enforcement
           validate-rzf-evidence.mjs (advisory) — checks RZF evidence blocks
DNA Element: 5 (ZF Discipline — the entire discipline exists for this question)
North Star: "Is the platform's definition of done trustworthy?"
Current: YES — pnpm verify runs at every Stop. ZF ACHIEVED requires evidence. ✅
```

---

## Score Sheet (30 questions)

| Battery | Questions | Auto-answered | Human judgment | Current status |
|---|---|---|---|---|
| 1 — Identity | QH-I-001 to 005 | 3 | 2 | QH-I-004 ✅ \| QH-I-005 ✅ |
| 2 — Moats | QH-M-001 to 005 | 3 | 2 | QH-M-003 PARTIAL (11 orphans) |
| 3 — Customer UX | QH-C-001 to 005 | 2 | 3 | QH-C-004 ✅ (GDPR exists) |
| 4 — Multi-Tenant | QH-T-001 to 005 | 3 | 2 | QH-T-001 ✅ \| QH-T-002 ✅ \| QH-T-004 ✅ |
| 5 — Foundation | QH-F-001 to 005 | 3 | 2 | QH-F-005 PARTIAL |
| 6 — Promise | QH-P-001 to 005 | 2 | 3 | QH-P-005 ✅ |

**Currently: 9 YES / 15 PARTIAL / 6 NOT YET TESTED**
**Target S028: 25 YES / 5 PARTIAL / 0 NOT YET TESTED**

---

## Integration with health-check.mjs

The mechanically-answerable questions (18 of 30) map to these validators:
- `validate-moat-coverage.mjs` → QH-I-001, QH-M-001
- `validate-pe-dashboard.mjs` → QH-I-004, QH-P-004
- `validate-intent-crystallized.mjs` → QH-I-005
- `validate-contract-harmonization.mjs` → QH-M-003, QH-F-002
- `validate-inner-ai-defaults-enforcement-rate.mjs` → QH-P-002
- `validate-foundation-schema-drift.mjs` → QH-T-001, QH-T-002, QH-F-001
- `validate-solo-user-flow.mjs` → QH-T-003
- `validate-gdpr-erasure-path.mjs` → QH-C-004
- `post-stop-pnpm-verify.sh` → QH-P-005 (always active)

*Authored: S025 | Governor directive: "platform health questions encoding unique competitive identity"*
*Update score sheet at each quarterly review. Each NO is a VLT. Each PARTIAL has a documented plan.*
