---
id: csps.council.opus-planning-insights-S043
name: opus-planning-insights-S043
description: "Opus platform-wide planning scan: what's missing, duplicated, too long, too short, can be enhanced. For Sonnet S043 planning-only turn."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S043
---

# Platform Planning Insights — S043

*Planning-only turn. No implementation without Governor permission.*

---

## MISSING

1. **PMI-aware PE scoring** — PE = urgency×impact÷SPI ignores maturity. Add 1.2× multiplier when PMI≥4/5. Block queue when PMI<2/5 regardless of urgency. Change: `validate-pe-dashboard.mjs`.

2. **Planning session mode** — no session-level `session_mode: planning|implementing` flag. Session-open.sh injects "SONNET BUILDER" but nothing for "PLANNER." Planning sessions need different defaults (no implementation prompts, PMI display instead).

3. **CAQ history log** — CAQs fire (T1+T3) but aren't recorded. No T2 can check if CAQ was answered. Need: `tools/data/caq-log.json` OR `caq_answers:` field in unified-plan.yaml.

4. **Activation period duration** — undefined. What exits a plan from activation? N uses / M sessions / Governor explicit close? Needs Governor decision before implementation.

---

## DUPLICATED

1. THREE planning registers: `platform-update-backlog.yaml` (S021, 28 items) + `opus-open-items.md` (71 items) + `unified-plan.yaml` (new). First two should deprecate toward the third.

2. `multi-session-plan-S040.md` + `multi-session-plan-S041-alignment.md` + `multi-session-plan-S040-playground-inheritance.md` — session-specific plans superseded by `unified-plan.yaml`. Should be archived.

3. `csps-way-of-working.md` + `csps-master-plan.md` — both describe platform operating model. One should reference the other as canonical.

4. `audit-runner.md` (800+ lines) + `audit-hub.md` — significant overlap. Audit-runner is the slug registry; audit-hub is the pipeline orchestrator. These are complementary but both describe what the audits DO, creating drift risk.

---

## TOO LONG

1. `behavioral-contracts.md` — 2300+ lines. Slice files exist. Planning Hub should show active vs archival contracts to reduce navigation burden.

2. `opus-open-items.md` — 71 items including many DONE entries. Archive DONE items. Only pending should show.

3. `audit-runner.md` — 800+ lines. Pipeline catalog and meta-description overlap.

---

## TOO SHORT / UNDERSPECIFIED

1. Most OPEN items: no `next_action` field. "Pending" is not a next action. Every OPEN item should have one concrete next action.

2. HANDOFF Zone A: references commits but not learnings. Learning is the highest-value transfer. Zone A should ask: "What surprised you? What would you do differently?"

3. PI YAML files (11 of them): most lack `caq_questions` and `pmi` fields. They should be migrated to the unified-plan.yaml schema.

---

## CAN BE ENHANCED

1. **findings-categorizer.mjs** → output should feed into `unified-plan.yaml` activation items automatically. S2 findings → flag items with ripple checks needed. S3 findings → create new planning items.

2. **`pnpm dna:bundle`** → should include unified-plan.yaml summary (always_include: true). Currently no plan state in DNA bundle.

3. **`validate-enforcement-trio-assigned.mjs`** → now that enforcement_tier is backfilled (no_enforcement=0), upgrade from scanning 11 PI items to all 63 contracts. High leverage, one-line change.

4. **`validate-pe-dashboard.mjs`** → add PMI-awareness. Items in unified-plan.yaml with PMI scores should influence their effective PE rank.

---

## NEEDS ARCHITECTURAL DECISION (Governor)

1. **Activation period exit criteria** — N uses / M sessions / Governor close? (CAQ: what if the item has been in activation for 5 sessions without clear verdict?)

2. **Planning session mode** — should `session_mode` go in session-state.json? Who sets it? Who enforces the mode boundary?

3. **CAQ log storage** — `caq-log.json` or embedded in unified-plan.yaml `caq_answers:` field?

4. **Plan item deprecation** — when an OPEN item is absorbed into unified-plan.yaml, should it be removed from opus-open-items.md or kept with a cross-reference?

---

*Insights: S043 planning-only turn | Opus Turn 99 | 2026-05-19*
