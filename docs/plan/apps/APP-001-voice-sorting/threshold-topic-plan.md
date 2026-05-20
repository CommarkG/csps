---
id: csps.plan.apps.APP-001.threshold-topic-plan
name: APP-001 Threshold Topic Plan
description: "Formal threshold entry for APP-001 Voice Sorting App. This plan governs
  the 7-section crystallization process. Each depth level (D3→D4→D5) corresponds to
  one section cluster completing. Build is authorized only when D5 gate closes (PMI 4/5)."
version: 1.0
owner: governor
lifecycle: production
lifecycle_state: planning
core_spine: ARCH
schema_anchor: apps_planning
batch: BATCH-H
epoch: E1
session: S047
depth_chosen: D3
template_depth: L3
parent_template: gradual-build-plan
app_slot: APP-001
---

# Threshold Topic Plan — APP-001 Voice Sorting App

> **Depth-gated crystallization.** This plan does NOT authorize a Lovable build session.
> Build is authorized only when PMI reaches 4/5 HIGH (PMI gate = Section 7 close).
> Each depth level corresponds to section cluster completion.

---

## Current Depth: D3 — Concept Registered

**D3 = Concept crystallized enough to begin the 7-section wizard.**
The raw document exists. The job is largely clear. The challenge is documented.
D3 is NOT a build authorization. It is a registered intent.

### D3 Evidence (what justified entering D3)
- Full strategic document received from Governor (S047)
- Dual-focal plan created (docs/plan/apps/APP-001-voice-sorting/dual-focal-plan.yaml)
- App Knowledge Card created (docs/plan/apps/APP-001-voice-sorting/knowledge-card.yaml)
- Domain tree registered (csps-playground.vercel.app/platform/domain-tree/)
- PMI score assessed: 2/5 HIGH
- 7-section wizard applied: Sections 1-6 between 50-85% crystallized

### D3 ZF Gate (what must be true before D4)
- [ ] All 7 sections assessed and documented
- [ ] Primary persona chosen (Governor decision — Q1.1)
- [ ] Kill condition named (Section 3)
- [ ] Vibe-coding architecture formally ratified (Section 4)

---

## D4 — Section 1+2+3 Complete

**D4 = The Job, Challenge, and Scope are crystallized and gated.**
After D4: the plan is ready for architectural design of the build approach.

### D4 Gate Requirements
- [ ] Section 1 gate closed: persona specific, JTBD locked, day-30 success confirmed
- [ ] Section 2 gate closed: challenge map complete, 3 assumptions force-ranked
- [ ] Section 3 gate closed: scope boundary locked, kill condition named, EPOCH set
- [ ] PMI score: intent_depth HIGH + reversibility HIGH (minimum 2/5)
- [ ] Opus formal review of Sections 1-3 (SROF or turn-level review)
- [ ] Governor ratifies: "This is the right user and job. Proceed to D5."

---

## D5 — Full PMI Gate (Build Authorized)

**D5 = All 7 sections complete, PMI 4/5 HIGH, Lovable build session authorized.**

### D5 Gate Requirements
- [ ] Section 4 gate closed: connection map complete, vibe-coding arch ratified
- [ ] Section 5 gate closed: user journey reviewed by UX-Expert skill
- [ ] Section 6 gate closed: all quality metrics have measurement methods
- [ ] Section 7 gate: validate-plan-readiness.mjs exits with PMI 4/5 HIGH
- [ ] Opus ratifies: inward_focus.invariants_addressed confirmed
- [ ] Governor ratifies: "Build this app. Start Lovable session."
- [ ] First Lovable session opens with this document as context

---

## ARCHITECTURAL DECISION REQUIRED (Before D4)

The document specifies "Optimized for Vibe Coding (Lovable, Bolt, v0)."

**This means:**
- APP-001 does NOT inherit CSPS Next.js/Clerk/ZenStack template
- APP-001 does NOT use ZenStack RLS, Supabase tenant isolation, or Clerk auth
  in the CSPS form (Lovable uses its own auth approach)
- CSPS governs PLANNING only — the build is external

**Decision Governor must ratify:**
> "APP-001 is a vibe-coded product that CSPS governs at the planning layer only.
>  The vibe-coded build is an external product, not a CSPS-template app.
>  After the build, we compare vibe-code output vs CSPS template approach
>  to extract the best patterns (CAIE-ECA skill)."

If this is NOT the intent (i.e., the app should use CSPS template after all), then
Section 4 changes completely and the build approach is: fork apps/template/ + CSPS full stack.

---

## APP NAME REGISTRATION

app_name_registry_slot: APP-001
current_name: "Voice Sorting App (placeholder)"
current_slug: APP-001-voice-sorting
name_locked: false
name_pending_validation: true
rename_command: "pnpm app:rename --slot APP-001 --name [FINAL_NAME] --slug [final-slug]"

All planning documents use the APP-001 slot. When the name is chosen:
1. Governor confirms name
2. Sonnet runs pnpm app:rename
3. All files in docs/plan/apps/APP-001-voice-sorting/ are renamed
4. Domain tree updates automatically via validate-app-name-consistency.mjs

---

## EPOCH ASSIGNMENT

epoch: E1
epoch_description: "APP-001 enters the planning system in E1 (S047 — platform restructuring epoch).
  The first Lovable build session will be in E2 (after D5 gate closes)."
estimated_D5_epoch: E2
