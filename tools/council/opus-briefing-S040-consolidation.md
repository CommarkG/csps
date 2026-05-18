---
id: csps.council.opus-briefing-S040-consolidation
name: opus-briefing-S040-consolidation
description: "Opus briefing: six-persona consolidation audit + 15 non-trivial questions. Governor directive S040 — pages, internal parts, audit tab, depth levels, dedup."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S040
---

# Opus Briefing — S040 Consolidation + Governance UI

*Read this before any architectural work. Each section is self-contained.*
*At the end: 15 non-trivial questions requiring Opus-level synthesis.*

---

## INTRODUCTION

CSPS has built 128 validators, 5 apps (template + task-mgmt + sandbox + budget-planner(dropped) + habit-tracker), 61 behavioral contracts, and 17+ inner-AI-defaults. The platform governance is sophisticated. The problem: almost none of it is visible to users or developers.

The Governor's directive (S040): "Connect front pages to internal platform parts. Add audit tab. Add depth-levels tab. No duplications. Everything dancing together."

This briefing covers what exists, what the six-persona audit found, what needs building (PCR-framed), and 15 questions Opus must answer before any implementation begins.

---

## SECTION 1 — What Pages Exist Now

### Habit Tracker (`apps/habit-tracker/`)
- `/dashboard` — habit list + 7-day check grid
- `/sign-in`, `/sign-up` — Clerk auth
- `/account-setup` — JWT polling
- `/settings` — redirect stub
- **No governance visibility. No audit status. No depth levels.**

### Task Management (`apps/task-mgmt/`)
- Standard CRUD pages for tasks/projects
- **No governance visibility.**

### Template (`apps/template/`)
- Scaffold only — no real content

**Finding:** Zero CSPS governance content is exposed to any user. The 128 validators, audit-runner, DNA registry, depth levels, open items — all invisible.

---

## SECTION 2 — Six Persona Audit Findings

### Persona 1: Consolidation Expert
**Finding A — lib/ duplication (BLOCKING):**
Three apps each have identical `src/lib/db.ts`, `src/lib/audit.ts`, `src/lib/zenstack.ts`. These should come from `libs/`. Current state:
- `apps/habit-tracker/src/lib/audit.ts` — duplicates `libs/integrations/security/audit.ts`
- `apps/template/src/lib/audit.ts` — same duplication
- `apps/budget-planner/src/lib/audit.ts` — same

**Fix:** Apps should import `writeAuditEvent` from `@csps/integrations/security/audit`. Remove app-level duplicates.

**Finding B — multi-session plan duplication:**
`tools/council/multi-session-plan-S040.md` and `tools/council/multi-session-plan-S040-playground-inheritance.md` — two planning files for same session. The inheritance one may have content not in the main plan.

**Fix:** Read both, merge unique content into the canonical file, delete the duplicate.

### Persona 2: Balance Expert
**Finding — 21 UserPromptSubmit hooks is HIGH:**
Current hooks firing on every prompt: intake, governor-prompts, verify-hooks-functional, context-orchestrator, next-step-reminder, raw-comments, turn-counter, ai-profiler. That's 8 hooks × every turn = latency + cognitive noise.

**Assess:** Which can be merged? Which are advisory-only and should be disabled until week-4 promotion?

**Finding — Zero T2 validators for:**
- Token budget compliance (B_TOKEN_BUDGET)
- AI profiler mode detection (new hook, no T2)
- Sacred parts protection (new hook, advisory mode only — no T2)

### Persona 3: Domain Expert (Depth Levels + Gradual Altitude)
**Finding — Depth levels documented but not surfaced:**
`depth_level: L1/L2/L3` appears in: dna-registry.yaml, PI YAML files, core-spines L1/L2 files.
But: NO app page shows depth levels. NO validator checks that L1 decisions are not overridden without ratification.

**The gradual build concept:**
Documented in: `docs/plan/pillar-0-governance/gradual-build-plan.template.md` (exists per prior sessions), the swift-build skill, and multi-session plans.
**Missing:** A page that shows the current depth level of each platform component and what's needed to go deeper.

### Persona 4: UX Expert
**Missing pages (high value):**
1. **Audit Status page** — shows 128 validators, which pass/fail/deferred, last run timestamp
2. **Depth Level Explorer** — shows each component at L1/L2/L3, what exists, what's needed for next level
3. **Open Items Dashboard** — shows OPEN-001 through OPEN-038, PE scores, status
4. **DNA Bundle page** — runs `pnpm dna:bundle` and shows the output
5. **Platform State page** — live view of platform-state-snapshot.md

**Existing pages that need enhancement:**
- Dashboard pages should show relevant platform context (e.g., Habit Tracker dashboard could show "Platform: 128 validators passing")

### Persona 5: Cruel Critic
**Claims vs reality:**
- "128 validators" — verified (exit_code=0) ✅
- "21 hooks declared" — verify-hooks-functional says "20 hooks present" — discrepancy?
- "B_TOKEN_BUDGET has 5 rules" — T3-only, no T1 or T2 enforcement. Rule will drift.
- "Inner-ai-defaults overrides ACTIVE" — added to session-open.sh in S040 ✅, but no T2 validator confirms they're read
- "PI-031/032/033 ratified" — ratified ✅. PI-032 implemented ✅. PI-033 not built yet.

**DEFERRED validators in verify.mjs:**
audit_runner_full_pass is DEFERRED (ships week-4). Week-4 was never formally defined — when does it trigger?

### Persona 6: Synergy Master
**Propagation gaps:**
- DNA registry (`tools/config/dna-registry.yaml`) — not referenced in CLAUDE.md, not in session-open.sh. Bundle engine works but users don't know to run it.
- FSE template — not cross-referenced from behavioral-contracts.md B_ENFORCEMENT_TRIO section
- Audit runner — `docs/plan/pillar-0-governance/audit-runner.md` is 800+ lines, never shown in any UI
- The turn counter hook fires at turn 25 — but users don't see a turn counter anywhere
- `pnpm dna:bundle` exists but not mentioned in CLAUDE.md or README

---

## SECTION 3 — New Features Requested (PCR Format)

### Feature A — Audit Tab

**Pros:** Surfaces the 128 validators to developers. Shows pass/fail/deferred status. Enables recurring scheduled audits (CRON-based). Makes governance real to external users.

**Cons:** Requires a server-side page that runs validators on demand (expensive). Or reads cached verify-last-run.md (cheap, stale). CSPS has no "admin" app yet — which app hosts this?

**Recommendation:** Build as a `/audit` page in a new `apps/governance-dashboard/` app. Read from `tools/verify-last-run.md` (cached, not live) to avoid performance issues. Add a "Re-run" button that triggers `pnpm verify` via API route. **PE score: 70.**

### Feature B — Depth Levels Tab

**Pros:** Makes the L1/L2/L3 doctrine visible. Shows developers what exists at each level and what's needed to go deeper. Connects to gradual build plans.

**Cons:** The depth levels are scattered across multiple files (dna-registry, PI YAMLs, core-spines). Needs a data aggregator.

**Recommendation:** Build as `/depth-levels` page in governance dashboard. Reads from `tools/config/dna-registry.yaml` (depth_level field) + PI YAML files. Shows a table: Component → Current Level → Next Level → What's needed. **PE score: 55.**

### Feature C — Backend Elements Enhancement

**What:** Make every app page show what CSPS backend it's connected to — which DB models, which API routes, which validators, which integrations.

**Recommendation:** Add a dev-mode "Platform Context" sidebar to each app that shows: DB models in use, active validators, linked PI items. Toggle with env var `SHOW_PLATFORM_CONTEXT=true`. **PE score: 50.**

---

## SECTION 4 — Deduplication Actions Required

| # | Duplication | Fix | Risk |
|---|---|---|---|
| D-1 | `apps/*/src/lib/audit.ts` × 3 | Import from `@csps/integrations/security/audit` | Medium — need to update all imports |
| D-2 | `multi-session-plan-S040-playground-inheritance.md` | Read + merge unique content → delete | Low |
| D-3 | `apps/budget-planner` (dropped) | `rm -rf apps/budget-planner` after confirming no Vercel dep | Low (dropped by Governor) |

---

## 15 NON-TRIVIAL QUESTIONS FOR OPUS

*These are not obvious from the code. They require synthesis and architectural judgment.*

1. **App vs platform boundary:** The `src/lib/audit.ts` duplication exists because apps need a local `db` instance for Prisma. If `writeAuditEvent` is moved to libs, does it still need the app's db instance? What's the cleanest dependency injection pattern?

2. **Governance dashboard app:** Should the audit tab, depth levels, and DNA bundle live in a new `apps/governance-dashboard/` app, or as protected routes in an existing app? What are the tenant isolation implications?

3. **Week-4 promotion:** The audit-runner is DEFERRED "until week-4." We're in S040 (roughly week 6+). Who decides when week-4 conditions are met? What are the criteria?

4. **Hook saturation:** 8 UserPromptSubmit hooks firing on every prompt — is this creating measurable latency? How should they be profiled and potentially merged?

5. **Sacred parts advisory vs blocking:** The sacred-parts-guard is ADVISORY (exits 0). When should it become BLOCKING? What would be a safe threshold (e.g., after 3 advisory warnings without ratification)?

6. **DNA registry as single source:** Should `tools/config/dna-registry.yaml` become the canonical source of truth for what DNA components exist — replacing the manual documentation in multiple places? What's the migration path?

7. **Virtual OPUS sustainability:** The AI profiler hook suggests /cruel-critic when it detects architectural keywords. But this is heuristic-based. How should it handle false positives (implementation prompts that look architectural)?

8. **Depth levels and production gates:** Currently L1/L2/L3 are documentation levels. Should they become production gates — e.g., an app cannot deploy to Vercel unless it has L2-rated documentation? What would that validator look like?

9. **Recurring audit scheduling:** The Governor asked for recurring scheduled audits. Claude Code has CronCreate capability. Should audit runs be scheduled (e.g., weekly), and if findings exceed threshold, block deployment? Who receives the report?

10. **The 65 principles in principles.yaml:** They're in the DNA registry but never surfaced in any UI. Should there be a principles browser page? Or is a CLI (`pnpm principles:search "completion"`) sufficient?

11. **Multi-session plan as living document:** `multi-session-plan-S040.md` was created this session. As sessions accumulate, there will be S041, S042, etc. Should there be a master plan that aggregates all session plans? What's the data model?

12. **External user vs developer vs governance user:** The Governor asked for pages for "developers and external users." Are these the same users or different audiences? Should governance pages be behind a separate auth role?

13. **The inheritance problem at scale:** B_INHERITANCE_POLICY requires Zone A + Zone B + ALIGNMENT QUESTIONS in handoffs. As the platform grows to 30 apps and 200+ sessions, handoff files will accumulate. Is there a pruning strategy? Or an archive system?

14. **Platform DNA for external AI:** The DNA bundle engine (PI-032) can produce bundles for external AI. But external AI needs to trust CSPS vocabulary. How does CSPS establish vocabulary authority with external systems — is it just the exclusion list, or something more formal?

15. **The "floating OPUS" problem persists:** Even with the AI profiler hook suggesting skills, Opus-level synthesis (cruel critic, balance expert) still requires the Governor to type the skill name. Is there a way to make this fully automatic — e.g., any response flagged as "architectural" gets automatically reviewed by /cruel-critic before being shown to Governor?

---

*Prepared by Sonnet S040-C2 | 2026-05-18 | For Opus architectural review*
*Read each section independently. PCR required for each Feature A/B/C. 15 questions require cross-section synthesis.*
