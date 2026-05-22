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

### TASK #2 — [NEXT — Governor will define]
**Status:** Waiting for Governor input

---

### TASK #3 — [PENDING]
### TASK #4 — [PENDING]
### TASK #5+ — [PENDING]

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

*Updated: S051 | Last task: #1 (AP-005) | Next task: #2 (awaiting Governor)*
