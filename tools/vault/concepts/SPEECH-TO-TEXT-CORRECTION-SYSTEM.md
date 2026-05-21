---
id: vault.concepts.SPEECH-TO-TEXT-CORRECTION-SYSTEM
name: SPEECH-TO-TEXT-CORRECTION-SYSTEM
description: "Per-user vocabulary calibration + system-wide speech-to-text distortion registry — a genuine CSPS moat"
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [AI, OPER, ARCH]
core_spine: AI
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.raw.RAW-20260521-DOC-001
  - vault.concepts.COMBINATORIAL-ENGINE-RAW
context_question: "How does CSPS correct speech-to-text errors per-user and system-wide before they accumulate into silent data corruption?"
context_quote: "Think about the accumulating damage a system that never corrects speech-to-text is causing. Then think what a magnificent moat this is."
---

# Speech-to-Text Correction System

## Why This Is a Moat

Every AI system that accepts voice input accumulates silent distortions. "Context" becomes "contacts." "Schema" becomes "schema" (OK). "Yariv" becomes something garbled. Over time, the system makes decisions based on corrupted input without knowing it.

Most systems ignore this. CSPS will solve it at the source.

## Two Components

### Component 1 — Per-User Vocabulary Builder (Onboarding)

**The calibration session** (not at the start, not too late):
- The app asks: "Can you spare 5 minutes? I want to make sure I understand you correctly."
- It presents a set of empowering, non-stressful prompts (not interrogation)
- User reads a question, answers in free speech
- User then reads back what the speech-to-text captured
- User makes corrections inline
- Result: a personal vocabulary model for this user

**Ongoing correction:**
- When a likely mismatch is detected ("this word doesn't fit the context"), the system flags it for the user: "Did you mean [X]?"
- User confirms or corrects
- Model updates

**Output:** per-user correction map: `{distorted_word: likely_word}` — used by Threshold to pre-correct all future inputs from this user before classification.

### Component 2 — System-Wide Distortion Registry

Track which speech-to-text distortions are most common across all users:
- "contacts" → "context" (known recurring)
- Domain-specific terms that are consistently misrecognized
- User-specific patterns that appear in multiple users of similar profiles (profession, location, accent patterns)

**Output:** a system-wide correction dictionary that improves baseline accuracy for all new users.

## Integration with Threshold (R1.4)

The Threshold receives all inputs. BEFORE classification, it passes the input through:
1. Per-user vocabulary correction map (if exists)
2. System-wide distortion registry
3. Context-aware correction (does this word fit this conversation's context?)

Only AFTER correction does Threshold classify and route.

This is the "contacts → context" fix, done automatically, not reactively.

## Onboarding Design Constraints

- Timing: NOT the first screen (trust not yet established). NOT too late (habit already formed).
  Optimal: after first successful value moment (user has seen the app work once).
- Tone: empowering questions, not capability tests
  BAD: "Read this technical term: Kubernetes"
  GOOD: "What do you do for a living? Tell me in your own words."
- Duration: 2-5 minutes maximum
- Framing: "I want to understand how you speak, so I can serve you better."

## A/B Testing Hook

The calibration session itself should be an A/B test candidate:
- Version A: 3 questions, after first value moment
- Version B: 5 questions, during onboarding
- Metric: correction map quality vs. user completion rate

## Status

Vault concept. Not yet a formal plan item. Awaiting Governor ratification to register as BATCH-G + BATCH-C plan item.

---

*Speech-to-Text Correction System | Vault concept | S050*
