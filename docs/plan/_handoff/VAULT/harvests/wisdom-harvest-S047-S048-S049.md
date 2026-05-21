---
id: csps.vault.harvests.wisdom-harvest-S047-S048-S049
name: wisdom-harvest-S047-S048-S049
description: "Platform Wisdom Harvest — 3-session vault extraction (S047/S048/S049) through 4 lenses. Extracts cross-session patterns, dangling decisions, orphaned insights for Opus review."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
session: S050
batch: BATCH-H
impl_status: swift-implemented
links:
  - { rel: harvest-source, href: ../../HANDOFF-S047-to-S048.md }
  - { rel: harvest-source, href: ../../HANDOFF-S048-to-S049-FINAL.md }
  - { rel: harvest-source, href: ../../HANDOFF-S049-to-S050.md }
consolidation_cross_refs:
  - docs/plan/_handoff/HANDOFF-S047-to-S048.md
  - docs/plan/_handoff/HANDOFF-S048-to-S049-FINAL.md
  - docs/plan/_handoff/HANDOFF-S049-to-S050.md
---

# Platform Wisdom Harvest — S047/S048/S049

**Extracted:** S050 | **Sessions covered:** S047, S048, S049
**Method:** 4 extraction lenses × 3 HANDOFF files
**Status:** NEEDS OPUS REVIEW — anchor points to be identified

---

## LENS 1 — Platform Architect
*Cross-session patterns, architectural decisions, structural dependencies*

### Pattern: Enforcement latency is ~1-2 sessions
Every rule ratified in session N gets T1+T2+T3 in session N+1 or N+2.
- S047: stage+quality_state introduced as advisory → S049: validated in frontmatter.mjs
- S047: validate-activation-coverage advisory → S049/S050: not yet BLOCKING (still advisory)
- S048: Dispatcher pattern ratified → same session: T1 (settings.json) active

**Structural implication:** Platform health depends on the enforcement-latency gap closing. Currently ~3 sessions between "ratified" and "mechanically enforced." Every gap = a period where the rule exists but doesn't protect.

### Dangling decision: APP-001 Section 5
Section 5 (user journey) is the last PMI gate before fork. Three sessions have passed since APP-001 entered the planning system (S047). The decision to do Section 5 next has been deferred to Opus each session. **Action needed:** Opus must issue the Section 5 PROTO this session.

### Orphaned intent: BEHAVIOR_PATTERN_REGISTER
Planted as a seed in S047 (anti-patterns.md) with target S048. Not delivered in S048 or S049. No existing file, no plan item. Either: (a) deprioritized silently, or (b) superseded by a different structure. **Action needed:** Opus to declare whether this is still needed or absorbed into anti-patterns.md + behavioral-contracts.md.

### Structural gap: behavioral-contracts.md approaching hard limit
~57K tokens / hard limit 60K. Shard plan created (PROTO-050 Step 4) but not executed. Next B_* contract addition will breach hard limit. **Action needed:** PROTO-051 should include behavioral-contracts shard execution as priority item.

---

## LENS 2 — AI Behavior
*Behavior defaults being overridden, what's being taught/learned*

### Pattern: CAQ formalized what was already working
OPUS-4 was already identifying "classes" of failures across S045-S047. The CAQ framework (S048) gave formal names and a T1 trigger to a pattern that already existed. **Insight:** When AI behavior improves in practice before the rule is formally written, that's a signal the rule is DESCRIBING rather than CREATING the behavior. These rules are more stable.

### Dangling: inner-AI-defaults registry is passive
`_handoff/VAULT/inner-ai-defaults/` was created in S046. It's referenced in the DNA bundle but there's no validator checking: (a) whether new behavior categories get registered, or (b) whether documented overrides actually changed AI output. It's documentation, not enforcement. **Action needed:** validate-inner-ai-defaults-freshness.mjs may address (a) — confirm it's active.

### Pattern: Platform insights as governance
`platform-insights.yaml` was created in S048 with always_include: true. But the 3 insights about MULTI-GRID, COMPLETION_ENGINE, and INSIGHTS_AS_GOVERNANCE (planted as @core-seeds) have no Opus-directed PROTOs yet. The seeds are planted but no one is tending them. **Action needed:** OPUS-6 to review platform-insights.yaml and assign seeds to PROTOs.

### Orphaned insight: "Context is the palace"
This cornerstone phrase from S050 ARCH-SESSION (PHI-01) is referenced in SONNET-S050-COMPLETE.md and platform-insights.yaml but has no enforcement layer. It's not in session-open.sh, not in AGENTS.md behavioral mandates, not in communication-protocol-shared.md. It's a principle that exists but has no mechanical expression. **Action needed:** Engrave "context is the palace" as a formal P-META or extend B_CONCEPT_LOAD.

---

## LENS 3 — UX-Journey
*Developer experience, friction points, journey improvements*

### Pattern: DX improves each session through friction removal
- S047: playground links enforcement (removes nav dead-ends)
- S048: Dispatcher (removes permission prompts for every new Write hook)
- S049: developer-journey playground page (makes the build process visible)
- S050: Next.js consultation interface (removes the friction of "I need Opus but can't get to the tab")

**Trend:** Each session removes 1-2 friction points that had accumulated from the previous phase. **Structural observation:** The platform DX is improving reactively. An active DX roadmap would let us address friction before users encounter it.

### Dangling: developer-journey page is in the static playground only
The `/platform/developer-journey/` page built in PROTO-050 Step 5 lives in the static HTML playground. The new Next.js playground (`/platform/sia/`, `/platform/consult/`) doesn't have a developer-journey route yet. The two experiences are disconnecting. **Action needed:** Add developer-journey to Next.js playground in S051 or confirm static version is canonical.

### Orphaned: APP-001 user journey (Section 5) means no testable user experience
Until Section 5 closes, there is no defined user flow through APP-001. The persona (cognitive-offload-professional) is defined, the JTBD is crystallized, but the actual interaction sequence from "opens app" to "first value moment" doesn't exist. We can't test the user journey because it isn't written yet. **Action needed:** Section 5 PROTO is the single most valuable next build act.

---

## LENS 4 — Prevention
*Systemic failures prevented, structural additions, where the defenses are thin*

### Pattern: Every session adds at least one T1+T2 enforcement pair
- S047: playground-links T2 BLOCKING + T1 advisory
- S048: vault-write-gate T1 BLOCKING + Dispatcher (settings.json single entry)
- S049: schema-registration-gate T1 BLOCKING + STATUS-CONSOLIDATION validator
- S050: governor-prompts hook active + security headers

**Trend:** The enforcement density is increasing. At current pace, the platform will have adequate structural prevention by S055-S060.

### Dangling: validate-activation-coverage.mjs is still advisory
AP-001 (EXISTS ≠ ACTIVE) is the platform's core anti-pattern. Its own detector (validate-activation-coverage.mjs) is ADVISORY. 23 B_* contracts have no activation mechanism. The tool that catches "rule without enforcement" is itself without BLOCKING enforcement. This is a structural irony. **Action needed:** Graduate validate-activation-coverage.mjs from advisory → BLOCKING in S051.

### Orphaned: AGENTS.md is at 199/200 lines (hard limit advisory)
Three sessions have passed since this advisory was noted. Every session adds governance notes and the limit gets closer. The behavioral-contracts shard plan was created but the AGENTS.md limit problem is structural — it needs a migration protocol (what moves out → which skill files). **Action needed:** Before any new B_* contracts, migrate AGENTS.md content to skill files per the shard plan.

### Structural gap: INV-003 (rzf-before-directive) is still PARTIAL
INV-003 has been PARTIAL since S044 (6 sessions). T1 is missing. This is the single open invariant. It means RZF enforcement has a gap at the most important moment — when Opus issues a directive. **Action needed:** PROTO to add T1 for INV-003 (pre-tool-use-rzf-evidence-gate.sh may cover this — verify).

---

## SUMMARY — Top 5 Anchor Points for Opus Review

| Priority | Item | Type | Lens |
|---|---|---|---|
| 1 | APP-001 Section 5 PROTO (user journey gate) | Dangling decision | UX-Journey |
| 2 | behavioral-contracts shard execution | Structural gap | Platform Architect |
| 3 | validate-activation-coverage → BLOCKING | Prevention gap | Prevention |
| 4 | BEHAVIOR_PATTERN_REGISTER — deliver or deprecate | Orphaned intent | Platform Architect |
| 5 | INV-003 T1 — verify pre-tool-use-rzf-evidence-gate.sh covers it | Structural gap | Prevention |

**Secondary (for platform-insights.yaml seed review):**
- MULTI-GRID_ARCHITECTURE seed (S048) → no PROTO yet
- INSIGHTS_AS_GOVERNANCE seed (S048) → no PROTO yet
- "Context is the palace" → no mechanical expression yet

---

## Raw Counts

| Lens | Patterns | Dangling Decisions | Orphaned Insights |
|---|---|---|---|
| Platform Architect | 2 | 2 | 2 |
| AI Behavior | 2 | 1 | 2 |
| UX-Journey | 2 | 1 | 1 |
| Prevention | 2 | 3 | 1 |
| **Total** | **8** | **7** | **6** |

**21 items extracted from 3 sessions. Estimated unextracted per session: ~7.**
