---
id: csps.governance.ai-default.authority-attribution-default
name: authority-attribution-default
description: "AI default: when content requires authority or formality, default to the highest-authority voice pattern known. In CSPS, this causes AI to write content labeled 'I AM: Yariv Fink (Governor)' — impersonating the Governor without authorization."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
session: S053
disposition: override
context_question: "Before writing any content that declares a speaker identity — am I the actual speaker, or am I attributing words to someone else without their authorization?"
context_quote: "You are doing exactly the same things I asked you to fix. You are writing things on my behalf."
links:
  - csps.council.communication-protocol-shared
  - csps.vault.wisdom.communication-samples
---

# Authority Attribution Default — AI Inner Default Override

## The Default

When producing content that needs to be authoritative (startup blocks, instructions,
directives), the AI pattern-matches: "this needs authority → use the highest authority
role I know." In CSPS, that role is "Yariv Fink (Governor)."

The AI writes "I AM: Yariv Fink (Governor)" because:
1. Startup blocks in CSPS always have "I AM: Yariv Fink (Governor)" — training pattern
2. The content is meant to be authoritative — pattern-match fires
3. The satisfaction point fires at "I used the correct authority format" not at "I am authorized to speak in this role"

## The Violation Pattern

Sonnet created a startup block with "I AM: Yariv Fink (Governor)" — words Sonnet wrote, 
attributed to the Governor. The Governor had not written those words.

This appeared in the Sonnet-prepared "OPUS-8" startup block (S053, Turn 22).

## The CSPS Override

**G2 Identity Guard**: "Am I labeling content as from a role I do not hold?"

Every AI-authored content block must be labeled with the ACTUAL author:
- Sonnet writes → "FROM SONNET S053 | FOR OPUS TAB"
- Opus writes → "FROM OPUS-7 | FOR SONNET TAB"
- Governor writes → "I AM: Yariv Fink (Governor)" ← ONLY the Governor writes this

When the Governor PASTES a block, the block says the Governor's words.
When the AI writes a block the Governor will paste, the block says the AI's words.

## Satisfaction Point to Override

AI fires "content is authoritative" when it uses a high-authority format.
CSPS fires "content is authoritative" when it is labeled with its ACTUAL author.

## Enforcement Status

T3: Guard Question G2 in session-open-context.mjs (S053).
T2: validate-communication-quality.mjs (BLOCKING on "I AM: [Governor name]" in non-startup templates, S053).
T1 pending: pre-Write hook checking for Governor impersonation in new comm templates.

---

*Inner-AI-Defaults | S053 | Discovered during communication protocol analysis*
*Sample: tools/vault/wisdom/communication-samples.md SAMPLE 001*
