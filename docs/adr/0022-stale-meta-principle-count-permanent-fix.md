---
id: csps.adr.0022-stale-meta-principle-count-permanent-fix
title: ADR-0022 — Stale meta-principle count permanent fix (K=2 auto-ADR)
status: accepted
date: 2026-05-04
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-0-governance/learning-loop.md }
  - { rel: principle, href: ../../packages/principles/principles.yaml }
  - { rel: prior-recurrence-k1, href: ../plan/_handoff/VAULT/qc-audit-results-S002.md }
  - { rel: prior-recurrence-k2, href: ../plan/_handoff/VAULT/validation-pass-S003.md }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0022 — Stale meta-principle count permanent fix

## Context and problem statement

K=2 reached on the pattern **NEG-STALE-REF-AFTER-RENAME — meta-principle count drift after ratification**:

- **K=1 (S002 turn 11):** P-META-006 (Zero-Findings Discipline) ratified. 7 files cited "5 meta-principles" / "P-META-001 through P-META-005". Bulk-fixed in same session.
- **K=2 (S003 turn 18):** P-META-007 (Five-Surface Engraving) ratified. 5 files cited "6 meta-principles" / "P-META-001 through P-META-006". Bulk-fixed in S003 close.

Per [P-META-005 Learning Loop](../plan/pillar-0-governance/learning-loop.md), K=2 within 90 days fires auto-ADR for permanent fix. Same pattern WILL recur on next P-META-* ratification (P-META-008 etc.) and on future P-OP-* additions — the operating-principle count is structurally identical.

The deeper essence: hardcoded count text in prose is information-duplication of yaml row count. Per P-ARCH-004 (one-source-of-truth-per-concern), prose should NOT duplicate yaml counts. The decorative count is a spurious source-of-truth.

## Considered options

| # | Option | Pros | Cons |
|---|---|---|---|
| A | Codegen substitution (`{{ meta_principle_count }}` placeholders; `pnpm principles:codegen`) | True single-source; auto-updates everywhere; composes with P-META-003 codegen-source-of-truth | Depends on codegen pipeline (currently skeleton at `packages/principles/codegen.ts`; ships week 1-2); placeholder syntax non-portable; bootstrap cost |
| B | Audit-driven detection only (regex grep + yaml row-count compare; CI fails on drift) | Buildable today; no source change; catches pre-merge | Doesn't PREVENT staleness; humans still miss citations; K=2 already shows manual update fails |
| C | Frontmatter `derived:` field + audit | Per-doc explicit; self-documenting | Manual update still required; adds frontmatter complexity |
| D | Eliminate decorative counts (remove count text where not load-bearing) | Permanent prevention in 90% of cases (count text doesn't exist → can't go stale); P-ARCH-004 compliance | Loses some narrative quality; load-bearing counts (validation-pass tables; ADR row sizing) need different treatment |
| **E** | **Hybrid D + B** — eliminate decorative counts + audit catches load-bearing drift | Permanent prevention + safety net; doesn't depend on codegen pipeline; minimal complexity | Two-mechanism solution; per-citation judgment "decorative vs load-bearing" required |

## Decision outcome

**Chosen: Option E — Hybrid D + B.**

**Reasoning:** The load-bearing factor is **prevention vs detection**. Pure detection (B) leaves the staleness vector in place; humans still miss it (K=2 proves this empirically — twice in 90 days). Pure codegen (A) blocks on the codegen pipeline shipping (currently skeleton; week 1-2 per build-order). Pure elimination (D) handles 90% of cases — most count citations are decorative ("the N meta-principles" — the principles themselves matter, not their count) and rephrase cleanly to enumerative ("the meta-principles" / "every P-META-* entry in principles.yaml"). The remaining 10% (validation-pass tables that literally enumerate N rows; ADR-0021's "P-META-001 through 005" row-sizing reference) are load-bearing and protected by the new `principle-count-staleness` audit.

**What would flip the recommendation:** if the codegen pipeline (`packages/principles/codegen.ts`) was already shipped, pure Option A would be simpler (one mechanism vs two). Confirm pipeline status; ship date may flip the recommendation toward A as week-1-2 lands. Re-evaluate at week-2 close.

## Consequences

**Documentation changes (Option D execution — applied this ADR atomically):**

| File | Before | After |
|---|---|---|
| `AGENTS.md` line 25 | `## The 7 meta-principles (the self-governance spine)` | `## The meta-principles (the self-governance spine)` |
| `AGENTS.md` line 17 | `## The 4 operating principles (always-on)` | `## The operating principles (always-on)` |
| `docs/plan/_intake/contexts/trunk/README.md` line 30 | `the 4 operating principles, 7 meta-principles` | `the operating principles, the meta-principles` |
| `docs/plan/_intake/contexts/governance/README.md` line 40 | `the 4 operating principles, the 7 meta-principles (defense-in-depth, ...)` | `the operating principles, the meta-principles (defense-in-depth, ...)` |
| `docs/adr/0021-validation-pass-per-principle-category-coverage.md` line 34 | `Meta principles (P-META-001 through 005) — checked via 5-row table` | `Meta principles — checked via row-table sized to current count of P-META-* entries in principles.yaml` |

CEC walk note: operating-principle count gets the same treatment as meta-principle count (the staleness essence is identical — would hit K=1 immediately on first P-OP-005). Apply consistently.

**Audit registered (Option B execution):**

- New audit `principle-count-staleness` registered in `packages/principles/principles.yaml#P-META-001.enforcers` (severity: warn; cadence: PR + nightly; build deferred week-4 audit-runner ship).
- Audit logic: greps for patterns `\b\d+ meta-principle`, `\b\d+ operating principle`, `P-META-001 through P-META-\d+`, `P-OP-001 through P-OP-\d+` and compares against current yaml row counts (`grep -c '^  - id: P-META-' principles.yaml` / `^  - id: P-OP-`).
- Mismatch = warn; lists offending lines.
- `audit_exempt_paths`: snapshot/historical files (HANDOFF-S<NNN>-to-S<NNN+1>.md / qc-audit-results-S<NNN>.md / validation-pass-S<NNN>.md / chat-jump-prompt-* / principles-snapshot.md / VAULT/insights.md / decisions-snapshot.md / pending-work.md / user-intents.md / blockers-S<NNN>.md / gaps-and-duplications-S<NNN>.md). These are intentionally frozen point-in-time snapshots OR session-sequential append-only logs whose historical entries reference accurate state-at-time-of-writing. Audit also exempts ADR self-references where the ADR documents the fix (e.g., this ADR-0022 + ADR-0021 amendment line). Implementation: exempt by glob list rather than per-file enumeration so future session artifacts auto-exempt.

**Snapshot files (intentionally frozen — exempt from audit):**

- `docs/plan/_handoff/VAULT/principles-snapshot.md` description "4 operating + 27 architecture + 7 meta = 38 principles" — point-in-time S003 snapshot
- All `HANDOFF-S<NNN>-to-S<NNN+1>.md` historical files
- `qc-audit-results-S002.md`, `validation-pass-S003.md`, `chat-jump-prompt-S002-to-S003-autonomous-overnight.md` — historical session artifacts

**Forward-prevention:**

- New P-META-* ratifications no longer trigger sweeping doc updates (the count text is gone in active references)
- New P-OP-* ratifications protected by same fix (operating-principle count also eliminated)
- Future K=2 recurrence prevented at the source — staleness vector no longer exists in 90% of cases; audit guards the remaining 10%
- Spurious-source-of-truth cleanup is a P-ARCH-004 compliance improvement (one-source-of-truth-per-concern applied recursively to principle counts)

## Enforcement

- `packages/principles/principles.yaml#P-META-001.enforcers` registers `principle-count-staleness` audit
- `docs/plan/pillar-0-governance/audit-runner.md` audit registry entry deferred to S005 §C3.1 audit-registry validation pass (the next §3 work item; same scope: validate every recently-added audit has registry entry)
- AGENTS.md hard NO candidate (NOT added in this ADR — low priority since the eliminated decorative usage already prevents the issue): "Never cite a principle count number in prose; use enumerative phrasing or reference principles.yaml row count"

## Sources

- `docs/plan/_handoff/HANDOFF-S003-to-S004.md` §C3.2 — K=2 mandate identification
- `docs/plan/_handoff/HANDOFF-S002-to-S003.md` lines 71-72, 92, 175 — K=1 incident (P-META-006 ratification gap)
- `docs/plan/_handoff/VAULT/qc-audit-results-S002.md` lines 46-60 — K=1 detection trail
- `docs/plan/_handoff/VAULT/validation-pass-S003.md` lines 119-121 — K=2 detection trail
- `docs/plan/pillar-0-governance/learning-loop.md` — P-META-005 K=2 auto-ADR mechanism
- `packages/principles/principles.yaml#P-META-005` — Learning Loop principle
- `packages/principles/principles.yaml#P-ARCH-004` — one-source-of-truth-per-concern (the architectural rationale)
