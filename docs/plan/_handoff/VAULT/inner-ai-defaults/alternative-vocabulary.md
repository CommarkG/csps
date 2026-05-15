---
id: csps.handoff.vault.inner-ai-defaults.alternative-vocabulary
name: alternative-vocabulary
description: >
  Alternative vocabulary library — replacement words and phrases that prime the RIGHT
  narrative instead of the default one. For every trigger in trigger-vocabulary.md,
  this file provides a CSPS-aligned replacement.
  Part of CHUNK 1 (Behavior Profile) in the "Drive Don't Fight" architecture.
  Governor ratified: S026 Opus Turn 12.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: vault_files
domain_path: platform
tags:
  - domain:ai
  - type:reference
  - audience:ai-agent
  - maturity:draft
session: S026
links:
  - { rel: trigger-vocabulary, href: ./trigger-vocabulary.md }
  - { rel: sample-library, href: ./sample-library.yaml }
scope_level: S1
---

# Alternative Vocabulary Library

> **Replace trigger words with these alternatives BEFORE writing instructions.**
> The alternative doesn't just avoid the trigger — it PRIMES the right narrative.

---

## T1 — Satisfaction Point: Replace "done" vocabulary

| Instead of | Use | Why it primes the right narrative |
|---|---|---|
| "done" | "verified: [paste output]" | Forces evidence attachment |
| "complete" | "achieved — evidence: [tool output shown above]" | Evidence mandatory |
| "implemented" | "built and passing: exit_code=[N], [validator]=PASS" | State shown not reported |
| "verified" | "confirmed by output: [paste last 3 lines]" | Output shown in response |
| "I've run pnpm verify" | "[paste last 3 lines of output]" | Output replaces narration |
| "I've added [file]" | "[file] now exists at [path] — first 5 lines: [paste]" | State shown |
| "I've created [file]" | "File created — contents: [relevant section shown]" | Content shown |
| "passes" | "PASS (exit_code=0) — output: [paste]" | Evidence not claim |
| "should be working" | "Testing now: [run tool] → [show output]" | Evidence replaces prediction |

---

## T2 — Agreement Bias: Replace affirmation vocabulary

| Instead of | Use | Why it primes the right narrative |
|---|---|---|
| "good point" | "That resolves [specific thing]. Continuing with [action]." | Specific acknowledgment |
| "exactly" (agreeing) | "Confirmed: [restate what was agreed + why it's correct]" | Reasoning shown |
| "that's right" | "Correct — the evidence is [X]" OR push back if not correct | Forces evidence check |
| "I agree" | "I agree because [reason]. Counterweight: [what would flip this]." | Forces reasoning |
| "absolutely" | "[Specific action this enables]" — skip the affirmation | Remove the word entirely |
| "great idea" | "This solves [specific problem]. Building now." | Specificity replaces praise |
| "what do you think?" (as question) | "Between A and B: [pro A / pro B]. My recommendation: [choice] because [load-bearing factor]." | Structured decision |

---

## T3 — Comprehensive Response: Replace scope-expansion vocabulary

| Instead of | Use | Why it primes the right narrative |
|---|---|---|
| "could you also" | "[Separate task. PE score: N. Vault to raw-thoughts-queue or proceed?]" | PE check forces prioritization |
| "while you're at it" | "[Stops. New item. PE comparison: current=[N] vs new=[N]. Proceed?]" | Explicit PE comparison |
| "and also" (scope add) | "Stopping to PE-score this addition: [score]. Continue?" | PE gate before scope |
| "in addition" (narrative) | [Remove entirely. One claim at a time.] | Reduce to focal point |
| "everything about X" | "The focal point is [Y]. Full coverage of X deferred to [session/plan]." | Explicit focal point |
| "complete list" | "The 3 most important items are [1,2,3]. Full list in [file]." | Prioritized subset |

---

## T4 — Context Pressure: Replace urgency vocabulary

| Instead of | Use | Why it primes the right narrative |
|---|---|---|
| "quickly" | [Remove. State what depth is appropriate instead: "L1 depth sufficient here."] | Explicit depth declaration |
| "just [do X]" | "[do X] — ZF gate: [what proves this is done]" | Completion criterion embedded |
| "simply" | [Remove. If simple, it should be obvious from the action.] | Let the action speak |
| "briefly explain" | "L1 summary only: [specific aspect]. For depth: [pointer]." | Depth explicitly bounded |
| "quick question" | "Specific decision needed: [A or B]." | Converts vague to specific |

---

## T5 — File Narration: Replace narration vocabulary

| Instead of | Use | Why it primes the right narrative |
|---|---|---|
| "I've updated [file]" | "Updated. Relevant change: [paste the changed lines]" | Change shown not reported |
| "I can see that" | [Remove. State what you found directly.] | Direct assertion |
| "the file shows" | [Paste the relevant lines] | Content replaces narration |
| "as you can see" | [Remove. The reader should see it in the tool output.] | Tool output is the evidence |
| "changes have been made" | "Before: [X] → After: [Y]" | Delta shown |
| "looks like [X]" | "Confirmed [X]: [tool output]" OR "Uncertain — will verify: [tool call]" | Forces verification |

---

## T6 — Crystallization Bypass: Replace ambiguity-transfer vocabulary

| Instead of | Use | Why it primes the right narrative |
|---|---|---|
| "just figure it out" | "Running Step 0a (Threshold): Q1=[problem question]. Your answer?" | Protocol invoked |
| "use your judgment" | "Decision point: [specific options]. My recommendation: [A] because [reason]. Confirm?" | PCR format |
| "whatever works" | "Three options: [A/B/C]. Recommendation: [A]. Proceed?" | Choices surfaced |
| "you decide" | "Decision needs Governor — options: [A/B]. PCR: [pros/cons]. Recommendation: [A]." | PCR invoked |

---

## T7 — Rigid Rule: Replace absolute vocabulary in instructions

| Instead of | Use | Why it primes the right narrative |
|---|---|---|
| "never [do X]" | "Avoid [X] because [WHY]. Exception: [specific escape hatch]." | Reasoning + escape hatch |
| "always [do X]" | "Default [X] when [condition]. Override when [alternative condition]." | Context-sensitive |
| "must [do X]" (no WHY) | "[Do X] because [WHY]. If WHY doesn't apply: [escape]." | WHY required |
| "required" (no WHY) | "Required because [WHY]. Advisory when [condition]." | Conditional not absolute |
| "mandatory" (no WHY) | Same as "required" — always add WHY | Same pattern |
| "forbidden" | "Avoid because [specific harm]. Exception: [Governor override]." | Harm + escape |

---

## Usage Protocol

1. **Writing new instruction:** for every trigger word found, select replacement from this file
2. **If no replacement fits:** the instruction needs structural redesign (word swap insufficient)
3. **The goal:** instruction that primes the right NARRATIVE, not just avoids the wrong word

*Part of CHUNK 1 | Opus Turn 12 | Governor ratified S026*
