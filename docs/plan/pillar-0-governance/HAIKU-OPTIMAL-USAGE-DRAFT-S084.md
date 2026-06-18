---
id: csps.governance.haiku-optimal-usage-draft-S084
name: HAIKU-OPTIMAL-USAGE-DRAFT-S084
description: "DRAFT (Governor S084): how Haiku works optimally — efficient, no quality loss — via verifiable mechanical scope + inter-model learning loops (Haiku->Sonnet->Opus). Rung-1 of the Independence Ladder (Model-PE dim 3). Extends haiku-pattern-library.yaml + haiku-spawn-template.md."
version: "0.1-draft"
session: S084
owner: group:finky
authored_by: OPUS-21
core_spine: AI
schema_anchor: inner-ai-defaults
diataxis_type: how-to
lifecycle: production
lifecycle_state: active
status: draft
links:
  - { rel: ladder, href: ../../../tools/data/park-register.yaml }
  - { rel: pattern-library, href: ../_handoff/VAULT/inner-ai-defaults/reasoning-patterns.md }
---

# Haiku — Optimal Usage (DRAFT) — efficient, no quality loss, with inter-model learning loops

## 1. What Haiku IS (rung-1 of the Independence Ladder)
Haiku = **mechanical, parallelizable, cheap, VERIFIABLE breadth.** Its output must be cheaply checkable by
Sonnet/Opus. Use Haiku for: grep/inventory scans · file classification · pattern-matching · first-pass
extraction · format/presence checks · "list everything that matches X". **NEVER for judgment** — a wrong
Haiku verdict *trusted* is the expensive failure. The rule: Haiku finds candidates; a higher tier decides.

## 2. The efficiency principle (no quality loss)
**Cheapest tier that reaches RZF; escalate only on residual.** Haiku does the BREADTH sweep (scan all),
then Sonnet/Opus apply JUDGMENT only to what Haiku surfaces — not the whole space. Quality is preserved
because the *decision* still happens at the right tier; only the *scanning* is cheapened. Map to risk-class:
C4 reversible/mechanical → Haiku · C3 build → Sonnet · C2/C1 → Opus (per ratification-cadence-by-class).

## 3. The Haiku spawn contract (every Haiku task)
```
TASK: [one mechanical, well-bounded action — a scan/inventory/classification]
SCOPE: [exact paths/globs]
RETURN ONLY: [exact output format — a list/table, nothing else; no interpretation]
VERIFY: [how Sonnet/Opus cheaply confirms — re-grep a sample / count match]
ESCALATE IF: [the condition that means "stop, this needs Sonnet/Opus judgment"]
```
Self-contained (ZCA), no internal jargon, output verifiable. Extends `haiku-spawn-template.md`.

## 4. Inter-model LEARNING loops (the part that compounds)
1. **Escalation ladder (PARK-022):** Haiku scans until RZF → Sonnet re-runs the same → compare findings
   per tier → record `tier × finding-class × cost`. Derive the cheapest-without-quality-loss assignment per
   task-type. This data IS training for the PE-improvement loop.
2. **Recurring-miss → protocol upgrade:** when Sonnet/Opus catch something Haiku MISSED, that miss becomes a
   new Haiku PROTOCOL (a pattern/checklist added to `haiku-pattern-library.yaml`). Recurring misses get
   engraved into the spawn-template so Haiku catches them next time. (→ PARK-035.)
3. **Model-uplift (distillation via recurring fixes):** patterns a better model (Opus) repeatedly saw + fixed
   become standard coverage for the cheaper model — over time Haiku/Sonnet cover more, Opus is needed less.
   (→ PARK-036; connects virtual-opus-audit.md + internal-deep-review.)

## 5. Open draft questions (for refinement)
- How is the `tier × finding-class × cost` data captured each run (the PE-loop outcome-vault, PARK-026)?
- What is the promotion threshold (K recurring misses) before a Haiku-protocol upgrade fires?
- Quality floor: a sampling audit (Sonnet re-checks N% of Haiku output) to detect silent quality drift.

*Draft per Governor S084 "how can Haiku work optimally — efficient, no quality loss — using learning loops between models." Refine with PARK-022/035/036 + the PE-improvement loop (PARK-026).*
