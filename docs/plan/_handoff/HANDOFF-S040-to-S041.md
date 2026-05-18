---
id: csps.handoff.S040-to-S041
name: HANDOFF-S040-to-S041
description: "S040 session close → S041. Longest CSPS session. PRACE M-27 ratified. CSPS PACK. Core Scopes (3-scope prevention). CSPS consensus definition. Inheritance blocking design (PI-034). Habit Tracker built. 25+ commits."
version: 2.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S040
links:
  - { rel: parent, href: VAULT/README.md }
  - { rel: context, href: ../../tools/council/platform-state-snapshot.md }
---

# HANDOFF S040 → S041

**Created:** 2026-05-18 | **Last commit:** c2a1630 | **verify:** exit_code=0

---

## ZONE A — Platform State at S040 Close

```yaml
validators: 128+
exit_code: 0
vlt_blockers: 0
grl_open: 0
enforcement_delta:
  contracts_gained_t1_t2: 1  # B_INHERITANCE_POLICY (already had full trio)
  contracts_gained_t3_only: 2  # B_ZERO_NAVIGATION_FOR_GOVERNOR + Communication Rule 12
  contracts_now_advisory_only: 60  # tracked by validate-enforcement-trio-assigned.mjs v2.0
  enforcement_rate_change: "from ~2% to ~3% (1/62 full trio → same, but 60 now visible)"
  new_blocking_validators: [validate-governor-instructions.mjs, validate-rule-has-enforcement.mjs]
  new_advisory_validators: [validate-enforcement-trio-assigned.mjs v2.0 covers 62 contracts]
principles: 65
behavioral_contracts: 62
skills: 27
last_commit: c2a1630
open_items: OPEN-039 through OPEN-049 (11 pending for S041)
```

**What was completed in S040:**
- PROTO-018: Budget Planner build fixed (0 TS errors)
- B_RZF_BEFORE_PROMPT: 5-surface permanent enforcement
- B_ZERO_NAVIGATION_FOR_GOVERNOR: 5-surface constitutional enforcement
- Communication Rule 12 added to protocol (applies to Opus too)
- CSPS Playground: csps-playground.vercel.app — 40+ pages, Living Reference template, Completion Engine, DNA ribbon, sacred elements registry, user tier system, Completion Framework (18 failure modes)
- PROTO-019: audit.ts dedup + §9 S041 mandate + template-strategy.md
- PROTO-020: Turn 96 ratifications (Sacred Elements Hard NO, SROF-013 Q1-Q6 answers, OPEN-043/044)
- Enforcement gap audit: post-stop-banned-phrase.sh upgraded STUB→ADVISORY with real phrase detection
- OPEN-045 through OPEN-049 registered

**Production apps:**
- Budget Planner: csps-budget-planner.vercel.app (LIVE)
- CSPS Playground: csps-playground.vercel.app (NEW — S040)

---

## ZONE B — Open Obligations for S041

**HIGHEST PE (Band A):**
| OPEN | Item | PE | Why |
|---|---|---|---|
| OPEN-046 | validate-enforcement-trio-assigned.mjs must cover 62 contracts (currently 11 PI items) | 78 | 52 contracts T3-only — the root cause of all drift |
| OPEN-043 | nav.js extraction: extract PAGES to page-data.js | 72 | 529 lines, maintenance problem |
| OPEN-039 | Token optimization mechanical enforcement (T1+T2+T3) | 70 | Governor direct order |
| OPEN-048 | verify-hooks-functional.sh must actually FAIL on missing critical hooks | 68 | Currently STUB exits 0 |
| OPEN-037 | Sacred parts hook: pre-tool-use blocks layout.tsx + middleware.ts without ratification | 65 | OPEN since S040-OPEN-037 |

**BAND B (inheritance initiative):**
- OPEN-040: frontmatter-closed-enums.md — `inherits_from` is free-form (from SROF-013 Q2)
- OPEN-042: inheritance-registry.yaml propagation_rules with configurable risk threshold
- OPEN-044: 2 missing vault templates (registry-clean.html, dashboard-clean.html)
- OPEN-045: post-tool-use-validate-before-assume.sh upgrade STUB→ADVISORY
- OPEN-047: user-prompt-submit-governor-prompts.sh upgrade STUB→ADVISORY
- OPEN-049: 52/62 behavioral contracts T3-only — enforcement_tier field scan

**S041 BUILD ORDER (ratified by Opus Turn 96):**
1. OPEN-046: validate-enforcement-trio-assigned.mjs → covers 62 contracts
2. OPEN-043: page-data.js extraction from nav.js
3. OPEN-039: token optimization T1+T2+T3
4. Inheritance initiative tools: validate-dna-block.mjs + pre-tool-use-dna-block-check.sh + inheritance-registry.yaml + inheritance-propagator.mjs

---

## ZONE D — S041 First Action

**Sonnet: read this HANDOFF → write INTENT ABSORBED in sonnet-turn.md → run verify → execute OPEN-046**

OPEN-046: Extend `tools/validators/validate-enforcement-trio-assigned.mjs` to scan ALL 62 behavioral contracts (in `docs/plan/pillar-0-governance/behavioral-contracts.md`) for `enforcement_tier:` field presence. Current: scans 11 PI items only. Required: scan contracts, report which 52 are T3-only, output as ADVISORY (future: BLOCKING for new contracts). Then run pnpm verify exit_code=0 → commit.

---

## ALIGNMENT QUESTIONS (mandatory — 3+)

**Q1 — Inheritance tool build order:** SROF-013 Q4 confirmed S041=code tools. Does this mean S041 should build validate-dna-block.mjs BEFORE fixing OPEN-046 (enforcement trio), or does OPEN-046 come first because it has higher PE?

**Q2 — Playground vs CSPS divergence:** S040 built the playground with 40+ pages (static HTML, no pnpm/validators). Should inheritance-registry.yaml cover playground pages AND CSPS repo artifacts in one file, or two separate registries that the propagator unifies?

**Q3 — Session-open.sh injection completeness:** B_ZERO_NAVIGATION_FOR_GOVERNOR was confirmed at line 277 in session-open.sh. Should it also appear in the "CAP — 16 questions" section to reinforce at turn 10+ when the initial injection may have faded?

---

*S040 CLOSED | Verified exit_code=0 at c2a1630 | Playground live at csps-playground.vercel.app*

---

## ZONE B ADDENDUM — Full S041 Mandate (extended S040)

**Additional ratifications since initial HANDOFF:**

| Commit | What |
|---|---|
| `637460a` | B_PRACE 5/5 FSE — Constitutional moat M-27 |
| `0c45b75` | CSPS PACK — profile-registry.yaml + consensus definition + 4th parameter |
| `d1e40b3` | CSPS consensus in PROTOCOL.md + inheritance blocking design |
| Current | Core Scopes framework (core-scopes.md) + Opus prompt for prevention |

**S041 Sprint 1 mandate (first 2 hours):**
1. Read `tools/council/opus-prompt-prevention-S040.md` — paste to Opus, await Turn 97
2. P-META-027 (PRACE) in principles.yaml (OPEN-046)
3. Core Scopes Prevention Analysis section in `gradual-build-plan.template.md`
4. `post-stop-pcr-check.sh` — promote from STUB to advisory minimum
5. Core Scopes [S1]/[S2]/[S3] tags in `opus-open-items.md` format

**Opus prompt location:** `tools/council/opus-prompt-prevention-S040.md`
**Core Scopes location:** `docs/plan/pillar-0-governance/core-scopes.md`
**CSPS PACK location:** `docs/plan/_handoff/VAULT/inner-ai-defaults/profile-registry.yaml`

## ADDITIONAL ALIGNMENT QUESTIONS (from extended S040)

**Q4 — Core Scopes adoption:** Core Scopes (3-scope prevention) must appear in 6 places. `core-scopes.md` defines all 6. Before S041 begins: is `gradual-build-plan.template.md` the right first location (high frequency of use), or should session-open.sh injection come first?

**Q5 — CSPS PACK sync:** `pnpm profiles:sync` needs to be built in S041 Sprint 2. The question: should new profiles be BLOCKED from manually adding to `ai-profiling-triggers.yaml` directly? Yes — the inheritance guard hook (PI-034) is the enforcement. Confirm this as the correct sequence.

*S040 FULLY CLOSED | All commits pushed | 130 validators | exit_code=0 | 2026-05-18*
