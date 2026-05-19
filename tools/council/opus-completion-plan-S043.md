---
id: csps.council.opus-completion-plan-S043
name: opus-completion-plan-S043
description: "6-persona completion analysis + detailed build specs for: Planning Hub live data, intake wizard, DNA inheritance, QC/audit chain. The heart of the platform."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S043
---

# Completion Plan — Planning Hub + Unified Plan System
## 6-Persona Analysis → Detailed Sonnet Specs

---

## CRITICAL GAP (Cruel Critic finding)

The Planning Hub shows HARDCODED data (stat-intake: 12). It does NOT read unified-plan.yaml.
The ONE SOURCE exists but nothing consumes it. This is the completion blocker.

---

## THE ARCHITECTURE

```
unified-plan.yaml (ONE SOURCE)
         ↓
generate-plan-api.mjs (pnpm plan:export)
         ↓
tools/data/plan-api.json
         ↓
csps-playground.vercel.app/api/plan.json
         ↓
nav.js loadPlanData() → window.PLAN_DATA
         ↓
All playground pages (Planning Hub, Completion Engine, User Journeys)
```

No AI freestyle. Mechanically enforced at every step.

---

## BUILD SEQUENCE FOR SONNET (priority order)

### S043-A: generate-plan-api.mjs (backend, 45 min)
File: tools/scripts/generate-plan-api.mjs
Script: reads unified-plan.yaml → outputs tools/data/plan-api.json
pnpm script: "plan:export": "node tools/scripts/generate-plan-api.mjs"
Trigger: post-commit hook when unified-plan.yaml is staged
Output JSON structure: meta + items[] + core_seeds[]
Each item: all YAML fields + derived fields (pmi_score, pmi_ready, has_core_seed)

### S043-B: Playground fetch layer in nav.js (30 min)
Add loadPlanData() to nav.js:
  - fetch('/api/plan.json') on every page load
  - Cache in window.PLAN_DATA
  - Dispatch 'planDataLoaded' event when ready
  - All pages listen and update their UI

### S043-C: Planning Hub live binding (45 min)
Replace ALL hardcoded numbers and HTML items in planning-hub/index.html with:
  - document.addEventListener('planDataLoaded', ...) handler
  - renderPlanItems(data.items) function
  - renderCoreSeeds(data.core_seeds) function
  - Live stat badges reading data.meta.status_counts

### S043-D: Plan Item Intake Wizard (60 min)
New page: platform/planning-hub/new-item/index.html
5-step wizard:
  1. Intent crystallization (human-authored text)
  2. Category + Owner selection (fixed enums)
  3. PMI pre-assessment (rate 5 indicators)
  4. Dependencies + CAQ (at least 1 question)
  5. Core seed (optional)
Output: copy-paste YAML block with DNA block header

### S043-E: DNA block enforcement (30 min)
All playground pages: add dna: block to CURRENT_PAGE object
New validator: validate-page-dna.mjs (advisory)
Runtime check: validateDNA() in nav.js

### S043-F: QC audit validators (2 validators, 30 min each)
validate-unified-plan-sync.mjs:
  - Checks plan-api.json is fresher than unified-plan.yaml
  - ADVISORY if stale (run pnpm plan:export)
validate-page-dna.mjs:
  - Scans all playground HTML for window.CURRENT_PAGE.dna
  - ADVISORY if missing

---

## WHAT SURVIVES TAB/MODEL CHANGES

Survives (in git, not memory):
  - unified-plan.yaml entries + history blocks
  - DNA blocks in HTML files
  - Core seed annotations in .sh/.mjs
  - plan-api.json (generated snapshot)

Does not survive (correctly):
  - window.PLAN_DATA (fetched fresh per page)
  - window.PLAN_LOADED flag

---

## CORE SEED PLANTED BY OPUS FOR THIS PLAN

# @core-seed: PLAN_API_LIVE_DATA
# planted-by: opus
# plan: S043-A (generate-plan-api.mjs)
# grows-to: planning-hub live data binding reading from plan-api.json
# pmi-gate: S043-A complete + plan-api.json accessible at /api/plan.json
# caq: "Is the JSON served correctly from Vercel (not blocked by CORS or routing)?"

*Completion Plan v1.0 | S043 | Opus completion analysis*
