---
id: csps.council.session-working-doc
name: session-working-doc
description: "Live working document for the current Governor task queue. Updated after each task completes. Sonnet reads this before starting the next task."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S051
---

# Session Working Document — S051

**Protocol:** Governor presents tasks one at a time OR as a list. Sonnet executes one at a time, updates this file, pushes, then signals readiness for the next. NEVER starts the next task until the current one is committed, pushed, and this file updated.

---

## PLATFORM STATE (as of last update)

- **Last commit:** 6148430 — AP-005 React instance split (3-scope prevention)
- **pnpm verify:** exit_code=0
- **Validators:** 140
- **Invariants:** complete=5, partial=0
- **APP-001:** status=implementing | PMI=5/5 | fork live at apps/voice-sorting/
- **behavioral-contracts:** sharded (57K → 2.5K index + 5 spine files)

---

## COMPLETED THIS SESSION (S051)

| # | Commit | What |
|---|---|---|
| 1 | `56b8238` | behavioral-contracts shard — 64 contracts across AI/GVRN/ARCH/VALD/OPER |
| 2 | `2feca0e` | APP-001 fork (apps/voice-sorting) + V1 homepage (The Sponge) + onboarding |
| 3 | `6148430` | AP-005 3-scope engraving — pnpm React instance split prevention in template + all apps |

---

## TASK QUEUE

### TASK #1 — AP-005 3-scope prevention ✅ DONE
**What was done:**
- Scope-1 (root fix): `resolve.dedupe = ['react', 'react-dom', 'react/jsx-runtime']` in apps/voice-sorting/next.config.js
- Scope-2 (ripples): Same fix applied to apps/habit-tracker + apps/budget-planner (latent risk resolved)
- Scope-3 (structural prevention):
  - `apps/template/next.config.js` — dedupe pre-installed (every future fork inherits fix)
  - `apps/template/src/pages/_error.tsx` — custom error page with no styled-jsx (defense-in-depth)
  - `apps/template/README.md §6` — "Fork Build Gate" protocol step documented
  - `anti-patterns.md AP-005` — class registered with T1+T2+T3 prevention map
- **Committed:** 6148430

**Enhancements flagged for Opus review:**
- T2 validator `validate-app-build-compat.mjs` — PENDING (checks that forked apps have dedupe + `pages/_error.tsx`)
- The pnpm workspace node_modules dedup root cause could also be fixed at `pnpm-workspace.yaml` level using `peerDependencyRules` — architectural decision for Opus

---

### TASK #2 — Audit Hub Deep Review + Scheduling System ✅ DONE
**Scope:** ARCH + VALD — audit-hub.md analysis, scheduling types, defaults, dropdowns
**Governor input:** "go over our audits hub + go over whole chat for completeness/enhancements + add scheduling types list (daily, after occasion, weekly) + populate defaults with dropdowns"
**Deliverables:**
  - Full audit of audit-hub.md: what's complete vs stub vs missing
  - Scheduling types taxonomy (all kinds: time-based, event-based, session-based, etc.)
  - Default schedule assigned to every pipeline in audit-runner.md
  - Admin/developer-changeable dropdown mechanism (config file or YAML)
  - 3-scope insights (what gaps, what ripples, what prevents recurrence)
**Status:** DONE
**Committed:** (see commit below)
**What was done:**
  - Created `tools/config/audit-scheduling.yaml` — full scheduling taxonomy (time/event/condition/manual) + per-pipeline defaults + override mechanism + combinatorial/PE integration stubs
  - Fixed audit-hub.md: "9 pipelines" → "13 pipelines" (discrepancy corrected)
  - Updated orchestration diagram to show all 13 pipelines with dependencies
  - Added scheduling registry reference at the top of the pipelines section
  - Scheduling taxonomy: 9 time-based + 9 event-based + 6 condition-based + 4 manual cadences
  - Each pipeline has: default_cadence, supported_cadences, override_notes, findings_persist, implementation_status
**Gaps found (for Opus):**
  - `libs/audits/dispatcher.ts` still missing — the pipeline dispatcher referenced in audit-hub doesn't exist
  - Most pipeline audits beyond Pipeline 1 are STUB — "week-4" audits never implemented
  - No raw findings persistence for pipelines 2-13 (only Pipeline 1 has verify-last-run.md)
  - Combinatorial engine (PLANNED) not yet built
  - PE engine weights defined but no implementation wired to them

---

### TASK #3 — Findings Wiring: Raw Content → Pattern Identifier → Registered Data
**Scope:** ARCH — raw findings persistence, pattern identifier, data file template
**Governor input:** "create mechanism of saving raw content findings + wire to evolve/QC/prevention + create pattern identifier who transforms raw content into workable data following defined template"
**Deliverables:**
  - Raw findings storage format/template
  - Pattern identifier algorithm (raw → classified → registered)
  - Wire to existing: validate-catchcompleteness, audit-hub, QC pipelines
  - Data registration template file
**Status:** PENDING (starts only after Task #2 committed+pushed)

---

### TASK #4 — Personalization Hub + Template Connectivity
**Scope:** ARCH — personalization hub creation, template system connections
**Governor input:** "see how it all serves templating elements + connect to personalization hub you should create"
**Deliverables:**
  - Personalization hub concept (what it is, who uses it, what it stores)
  - Template registry → personalization hub connection
  - User profile + developer profile → template selection flow
**Status:** PENDING

---

### TASK #5 — Unified Multi-Session Plan Status Check
**Scope:** GVRN — audit current state vs intended design
**Governor input:** "where are we with unified multi-session multi-chat dynamic plan with numbered parts + bundling orchestrator + statuses per part + mandatory alignment context DNA + corespine in every file?"
**Deliverables:**
  - Current state audit (what exists, what's missing)
  - Gap analysis: schema, validators, files
  - Explicit YES/NO for each required element
**Status:** PENDING

---

### TASK #6 — Core Alignment + Inheritance Enhancement
**Scope:** GVRN+ARCH — creation protocols, inheritance discipline
**Governor input:** "see what top expert would do to enhance alignment + inheritance + verify connection to core + enhance creation protocols so inheritance is clearly mentioned and done"
**Deliverables:**
  - Creation protocol enhancements (explicit inheritance steps)
  - Validator for inheritance verification
  - 3-scope analysis of inheritance gaps
**Status:** PENDING

---

### TASK #7 — Core Quotes Library + Dashboard
**Scope:** ARCH — quotes library, dashboard, tagging
**Governor input:** "Core Quotes library + dashboard — top topics + sub-topics + 10+ quotes per topic + tagged + universal status + universal tagging"
**Deliverables:**
  - Core quotes data file (YAML or JSON) with topics/subtopics
  - 10+ quotes per topic from famous people
  - Universal status element (create if missing)
  - Universal tagging formalization
  - Playground dashboard at /platform/quotes/
**Status:** PENDING

---

### TASK #8 — Universal Libraries + Master Template System
**Scope:** ARCH — platform-wide template audit, master template hierarchy
**Governor input:** "create libraries + engrave all CSPS libraries + similar dashboards + find things built differently that could become base of a template + master template for everything + sub-templates + edge templates"
**Deliverables:**
  - Audit of all things built as dashboards/pages/libraries
  - Master template hierarchy: master → domain → sub → edge
  - Template registry updated
  - Creation protocol: "check master template before creating"
**Status:** PENDING

---

## RECOMMENDATIONS ACCUMULATING FOR OPUS SUMMARY

> These are enhancements, architectural insights, and open questions that will be compiled into a single Opus relay when Governor says "summarize for Opus."

1. **AP-005 T2 validator** — `validate-app-build-compat.mjs` should BLOCK if a forked app is missing `pages/_error.tsx` or `resolve.dedupe`. Prevents silent regression if template gets edited.

2. **pnpm-workspace.yaml `peerDependencyRules`** — architectural alternative to per-app webpack dedupe. A single workspace-level dedup config would handle all future apps. Decision: per-app (current) vs workspace-level. Trade-off: per-app is explicit; workspace-level is DRY but requires pnpm config expertise.

3. **APP-001 E1 next steps** (for Opus PROTO):
   - Domain ZModel: `VoiceClip` + `VaultItem` (3-state: crystal_clear/needs_clarification/archived)
   - STT API route: `/api/capture` (Web Speech API client-side → server persist)
   - No auth in E1 — user identified by localStorage session ID

4. **Styled-jsx is a symptom of a deeper truth**: pnpm hoisting + per-app node_modules = every package that uses React context is a potential duplicate instance. The CSPS template should document the full list of packages that are React-context-sensitive (react-dom, styled-jsx, @clerk/nextjs, etc.) and ensure `resolve.dedupe` covers them all.

---

## WORKING PROTOCOL

- Sonnet reads this file at the start of each task
- After task completes: Sonnet updates the TASK QUEUE section + PLATFORM STATE + RECOMMENDATIONS
- Sonnet pushes this file as part of the task commit
- Sonnet signals: "Task #N done. Ready for #N+1."
- Governor confirms or provides next task
- Sonnet does NOT start the next task until Governor gives it

---

*Updated: S051 | Last task: #2 (Audit Hub + Scheduling) | Next task: #3 (awaiting Governor signal)*

## RECOMMENDATIONS ACCUMULATING FOR OPUS SUMMARY (continued)

5. **libs/audits/dispatcher.ts** — the pipeline dispatcher is referenced in audit-hub.md orchestration diagram but doesn't exist. This is the core missing infrastructure. Without it, all pipeline orchestration is manual. PROTO candidate.

6. **Scheduling taxonomy is now canonical** — `tools/config/audit-scheduling.yaml` is the SSoT for when audits run. The combinatorial engine should read this file. The PE engine weights are seeded. This unblocks both planned integrations.

7. **Pipeline 9 (runtime-health) is set to `current_override: never`** — deliberately disabled until APP-001 E1 ships to production. Auto-promotion to `daily` should fire on APP-001 first Vercel deploy.
