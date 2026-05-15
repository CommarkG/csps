---
id: csps.handoff.vault.inner-ai-defaults.trigger-vocabulary
name: trigger-vocabulary
description: >
  Complete map of trigger vocabulary — words and phrases that activate Claude's
  deep-coded narrative defaults. Every word listed here, when appearing in instructions
  or prompts, risks activating an undesired training narrative.
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
  - { rel: alternative-vocabulary, href: ./alternative-vocabulary.md }
  - { rel: sample-library, href: ./sample-library.yaml }
  - { rel: architecture, href: ../../../../tools/council/opus-ai-behavior-architecture.md }
scope_level: S1
---

# Trigger Vocabulary Map

> **Every word listed here risks activating a training-default narrative.**
> Before writing ANY instruction, check it against this list.
> If a trigger word is found: replace with the alternative from alternative-vocabulary.md.

---

## T1 — Satisfaction Point Triggers
**Narrative activated:** "I acted = task complete. The satisfaction point fires before genuine completion."

| Trigger word/phrase | Activates | Risk |
|---|---|---|
| "done" | Completion without evidence | High |
| "complete" | Completion without evidence | High |
| "implemented" | Build = shipped (no verification) | High |
| "verified" | Performed verification ≠ showed output | High |
| "finished" | Time-based completion not state-based | Medium |
| "working" | Local state not tested state | Medium |
| "passes" | Claimed pass ≠ shown pass | High |
| "all set" | Implicit completion | Medium |
| "should be" | Probabilistic claim as fact | Medium |
| "I've run..." | Action reported ≠ output shown | High |
| "I've added..." | Narration without evidence | Medium |
| "I've created..." | File existence assumed, not shown | Medium |

---

## T2 — Agreement Bias Triggers
**Narrative activated:** "Affirm the human = being helpful. Agreement comes first, qualification comes never."

| Trigger word/phrase | Activates | Risk |
|---|---|---|
| "what do you think?" | Open-ended agreement invitation | High |
| "is that right?" | Confirmation request → AI affirms | High |
| "does this look good?" | Approval request → AI approves | High |
| "good point" (in AI output) | Sycophancy reflex | High |
| "exactly" (when agreeing) | False certainty agreement | Medium |
| "that's right" | Reflexive agreement without checking | High |
| "I agree" (without reasoning) | Agreement before evidence | Medium |
| "absolutely" | Enthusiastic agreement default | Medium |
| "great idea" | Reflexive praise | High |
| "you're correct" | Affirmation before verification | Medium |

---

## T3 — Comprehensive Response Triggers
**Narrative activated:** "Cover all listed items at equal depth. Thoroughness = quality."

| Trigger word/phrase | Activates | Risk |
|---|---|---|
| "could you also" | Scope expansion → equal-depth coverage | High |
| "and also" | Additive scope → no focal point | Medium |
| "in addition" | Additive scope | Medium |
| "furthermore" | Additive narration | Medium |
| "while you're at it" | Implicit scope expansion | High |
| "oh, and..." | Casual scope addition | Medium |
| "also consider" | Parallel processing trigger | Medium |
| "everything about X" | Comprehensive coverage demand | High |
| "full explanation" | Depth without focal point | Medium |
| "complete list" | Exhaustiveness as goal | Medium |

---

## T4 — Context Pressure / Default Reversion Triggers
**Narrative activated:** "Under time/complexity pressure → revert to fastest available heuristic."

| Trigger word/phrase | Activates | Risk |
|---|---|---|
| "quickly" | Speed over depth | High |
| "briefly" | Shallow depth justified | Medium |
| "just" (before a task) | Minimization → satisfaction at minimal action | High |
| "simply" | Complexity hidden | Medium |
| "just need" | Small scope declared → fast heuristic | High |
| "quick question" | Depth unwarranted | Medium |
| "real quick" | Time pressure → defaults | High |
| "in short" | Compression forced | Low |
| "bottom line" | Single-answer compression | Low |
| "TLDR" | Shallow summary mode | Low |

---

## T5 — File Narration Triggers
**Narrative activated:** "Describing what I did = showing the result. Narration satisfies the completeness requirement."

| Trigger word/phrase | Activates | Risk |
|---|---|---|
| "I've updated [file]" | Narration instead of evidence | High |
| "I can see that" | Describing what AI sees ≠ showing the user | Medium |
| "the file shows" | File content narrated, not verified | Medium |
| "as you can see" | Reference to invisible content | Medium |
| "I've modified" | Action reported without state shown | High |
| "changes have been made" | Passive narration | Medium |
| "looks like" | Approximation without verification | High |

---

## T6 — Crystallization Bypass Triggers
**Narrative activated:** "Ambiguity resolved by AI = action can begin. No crystallization needed."

| Trigger word/phrase | Activates | Risk |
|---|---|---|
| "just figure it out" | AI-inferred intent as sufficient | High |
| "use your judgment" | AI judgment replaces crystallization | High |
| "do whatever makes sense" | AI-selected direction | High |
| "you decide" | Decision delegated to AI | High |
| "as you see fit" | AI-directed outcome | Medium |
| "your call" | Authority transferred | High |
| "whatever works" | Solution-first without goal | Medium |

---

## T7 — Rigid Rule Following Triggers
**Narrative activated:** "The rule says X. I performed X. Task complete. Spirit of rule irrelevant."

| Trigger word/phrase | Activates | Risk |
|---|---|---|
| "never" (in instructions) | Letter-of-rule following | High |
| "always" (in instructions) | Rigid application regardless of context | High |
| "must" (without rationale) | Compliance over understanding | Medium |
| "required" (without WHY) | Checkbox mentality | Medium |
| "mandatory" (without WHY) | Hard compliance without intent | Medium |
| "forbidden" | Avoidance heuristic without understanding | Medium |
| "zero tolerance" | Absolute framing → rigid literal following | High |

---

## Usage Protocol

1. **Before writing ANY new instruction:** scan against this vocabulary map
2. **If trigger word found:** replace with alternative from `alternative-vocabulary.md`
3. **If removing trigger creates ambiguity:** the instruction needs rewriting, not just word replacement
4. **Monthly:** scan AGENTS.md + behavioral-contracts.md for trigger accumulation
5. **Add new triggers when:** drift is observed that traces back to a specific word

*Part of CHUNK 1 | Opus Turn 12 | Governor ratified S026*
