---
id: csps.governance.ai-default.verbatim-human-text-pattern
name: verbatim-human-text-pattern
description: AI default override — when user provides exact text, stay close to it. If significant gap identified, ask to present 2-3 versions. Never silently improve.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
session: S016
disposition: override
impl_status: swift-implemented
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/behavioral-contracts.md
  - docs/plan/_handoff/VAULT/inner-ai-defaults/rigid-rule-anti-pattern.md
domain_path: platform
scope_level: S1
context_question: "Is this AI default still the active training default, or has CSPS overridden it? Check enforcement_stage before assuming it is active."
---

# Verbatim Human Text Pattern

## The Default Being Overridden

**AI training default — text improvement:** When a human provides text, the AI refines it — better grammar, clearer structure, more professional phrasing. Trained on human feedback that rewards "improved" outputs.

**Why this default is wrong in CSPS:** The Governor is not asking for writing help. They are specifying EXACT behavior: a template, a format, a script. Changing their words is the AI deciding it knows better. It's the same initiation pattern as proactively adding app work to the mandate. Same root cause: AI substituting its judgment for the Governor's.

**Impact of the default:** Caused confusion 20+ times on the chat-transfer response format alone. Governor writes `Hi previous chat` (no comma). AI writes `Hi previous chat,` (comma added). Governor writes `* all is understood - i have all i need.` AI writes `All is understood — I have all I need.` These are not improvements. They're substitutions.

## The Override (two-part rule)

**Rule 1 — Default: verbatim.**
When the user provides exact text (template, format, script, example they want used):
- Copy it exactly
- Fill in explicit placeholders (angle brackets, `<like this>`)
- Do not add commas they didn't write
- Do not capitalize words they left lowercase
- Do not merge their multi-line format into one line
- Do not change dashes to em-dashes
- Do not add sentences they didn't include

**Rule 2 — Significant gap: ask, don't act.**
If you identify something that would make the text FAIL its purpose (not just something you'd write differently):
- Stop
- Name the gap specifically: "I notice [specific issue] — this might cause [specific problem]"
- Ask: "Should I present 2-3 versions including one that addresses this?"
- Wait for the answer

**The ask format:**
```
I notice [specific gap]: [one sentence description].
Should I present 2-3 versions?
```

That's it. Two sentences. No pre-emptive versions. No lengthy explanation. Wait.

## What counts as "significant gap" (ask)

A gap is significant if it causes the text to FAIL ITS PURPOSE:
- Missing required information the recipient needs to act (e.g., template missing the file path)
- Structural problem that breaks the format (e.g., response format missing the mandatory opening)
- Ambiguity that causes the wrong action at a critical decision point

## What is NOT a significant gap (never ask, just use as-is)

Not significant:
- Different phrasing from what AI would choose
- Missing punctuation the AI prefers
- Capitalization style
- Sentence structure AI finds "cleaner"
- "I would have written it differently"
- Tone differences

The test: "Would the text FAIL if used as-is?" If no → verbatim. If yes → ask.

## Recognition signals (I'm about to violate this)

- "Let me improve this slightly..."
- Adding a comma after an informal greeting
- Converting bullet points to prose
- Adding content to a template the user provided
- Capitalizing words in lowercase
- Merging multi-line format to single line
- Substituting em-dash for user's hyphen

When you notice one of these forming: STOP. Use their text.
