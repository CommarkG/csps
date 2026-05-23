---
id: csps.vault.libraries.question-library
name: QUESTION-LIBRARY
description: "Canonical library of context_question patterns. Every governed artifact needs a context_question. This library provides the strongest verified versions and the underlying pattern so new questions are written at the same standard."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
diataxis_type: reference
session: S053
context_question: "Is the question for this artifact a verification gate (YES/NO + specific state) or a weaker understanding question (what/why) — and if the latter, can it be upgraded?"
context_quote: "Use the simple form of communication that makes it permanent. I am annoyed and tired of reminding you."
---

# Question Library

## The Pattern

**Strong context_question** = one of two forms:
1. **Verification gate**: "Before [action], has [specific verifiable state] been confirmed?"
2. **Behavior test**: "If [concrete scenario], does [expected behavior] happen — and is that intentional?"

**Weak context_question** = "What is X?" or "Why does Y?" — these ask for understanding, not verification. They don't catch violations.

The distinction matters because context_question is a **guard**, not a **guide**. A guard asks "did you check?" — a guide asks "do you understand?" CSPS needs guards.

---

## Challenge Round Results — S053

First run of the Challenge Round protocol. Sonnet listed what it wrote; Opus asked for the independent stronger version; comparison produced the pattern above.

### KEPT (already strong)

| Artifact | context_question |
|---|---|
| [validate-zf-cycle-format.mjs](../../validators/validate-zf-cycle-format.mjs) | "Does every ZF Cycle 2+ name specific files, or does it use vague words like 'areas'?" |
| [validate-gap-recurrence.mjs](../../validators/validate-gap-recurrence.mjs) | "Are there any gaps at K>=3 with no structural fix triggered? Those block session close." |
| [EXPLORE-RATIFY-EXECUTE.md](../../../docs/plan/pillar-0-governance/EXPLORE-RATIFY-EXECUTE.md) | "Before any implementation starts, can you cite the specific unified-plan.yaml item ID this work is executing against?" |
| [behavioral/README.md](../tests/behavioral/README.md) | "Before claiming a validator is fixed, has the behavioral test been run and confirmed exit=1 on a known violation?" |

### UPGRADED (S053 originals were weaker)

| Artifact | Original (weak) | Upgraded (strong) | Pattern used |
|---|---|---|---|
| [sonnet-startup.template.md](../../templates/sonnet-startup.template.md) | "What does this template produce and when must it be used?" | "Have all {variables} been filled — commit SHA, mandate items, session numbers — before pasting this into the new tab?" | Verification gate at deployment moment |
| [validate-threshold-intake.mjs](../../validators/validate-threshold-intake.mjs) | "What does this validator report and why is it advisory?" | "What is the current type distribution in threshold-intake-log.yaml — are corrections being captured or is everything still governor_directive?" | Forces the actual check |
| [vocabulary-service/types.ts](../../../libs/vocabulary-service/src/types.ts) | "What is the key architectural decision that separates global from app vocabulary?" | "When a correction is made in the cooking app — does it appear in the shopping app, and is that intentional?" | Behavior test with concrete scenario |
| [vocabulary-service/store.ts](../../../libs/vocabulary-service/src/store.ts) | "Why is store.ts YAML-only in Phase 1?" | "Has the ZModel promotion gate been triggered yet — and if so, why is this still writing to YAML?" | Future-proof verification gate |
| [vocabulary-service/service.ts](../../../libs/vocabulary-service/src/service.ts) | "Why does app vocabulary take precedence over global vocabulary?" | "If a user corrects 'grocery list' in one app, does that correction appear in all their other apps?" | Behavior test |
| [vocabulary-service/index.ts](../../../libs/vocabulary-service/src/index.ts) | "What is the contract this package provides and what must never be reimplemented per-app?" | "Before building vocabulary correction into a new app — are you importing from @csps/vocabulary-service or starting from scratch?" | Decision gate at risk moment |
| [PLATFORM-GENOME.md](../../../docs/plan/pillar-0-governance/PLATFORM-GENOME.md) | "Before any tab starts work, what permanent nodes in this genome are relevant to the task at hand — and have they been loaded?" | Same + "Can you name them without searching?" | Forces recall verification |
| [OPUS-UPDATED-PROMPT-S053.md](../../../docs/plan/_handoff/VAULT/OPUS-UPDATED-PROMPT-S053.md) | "Has the communication rule been followed in this turn, and is the ZF block written to sonnet-turn.md (not just to chat)?" | "In the last Sonnet report in tools/council/sonnet-turn.md — does it contain a ZF block with file names, or is ZF only in the chat?" | Specific file + specific check |

---

## Quick Reference Templates

Use these when writing context_question for a new artifact:

**For validators:**
> "When this validator runs, does [specific finding type] trigger BLOCKING or just advisory — and what is the current count?"

**For library/service files:**
> "If [concrete misuse scenario] — does this code prevent it, silently allow it, or throw an error?"

**For governance documents:**
> "Before [the action this document governs] — can you cite the specific [ID/field/evidence] required by this document?"

**For templates:**
> "Have all [variable fields] been filled with [specific real values] — or are there placeholders still?"

**For data files:**
> "What is the current [key metric] in this file — and does it indicate [expected healthy state]?"

---

## Artifacts Still Missing context_question

From S053 audit: TypeScript files in vocabulary-service got questions (as JSDoc, not YAML frontmatter since they're .ts files). The weaker versions are better than none. Next session: upgrade the YAML-frontmatter files using the strong patterns above.
