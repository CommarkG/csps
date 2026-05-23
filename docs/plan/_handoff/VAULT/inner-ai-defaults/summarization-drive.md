---
id: csps.governance.ai-default.summarization-drive
name: summarization-drive
description: "AI default: compress rich content into clean, organized summaries. When saving anything, the AI defaults to a readable summary rather than preserving raw verbatim content. This destroys the L1 depth level (raw/verbatim) that CSPS requires for its knowledge architecture."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
session: S053
disposition: override
context_question: "Before saving any insight or decision, is this being saved verbatim (L1) or summarized (L3)? If summarized — where is the verbatim version?"
context_quote: "Default Storage is Ephemeral. The AI summarizes by default. The summary looks complete and loses the original."
links:
  - csps.vault.concepts.DEFAULT-STORAGE-IS-EPHEMERAL
  - csps.governance.PLATFORM-GENOME
---

# Summarization Drive — AI Inner Default Override

## The Default

When an AI produces documentation, vault entries, or saved artifacts, it defaults to:
- Clean, organized prose
- Reduced version of what was actually said
- Structure that looks complete but loses specificity
- "The gist" rather than the exact words

This is a training-level optimization: summaries are more readable, less redundant,
more "helpful." For general use, this is correct behavior.

## Why This Fails for CSPS

CSPS requires three depth levels in its knowledge architecture:
- **L1 (Raw)**: verbatim content, exact quotes, specific examples, precise wording
- **L2 (Structured)**: organized with context_question + context_quote + canonical fields
- **L3 (Indexed)**: in Platform Genome, linked from validators, connected to inheritance

The summarization drive defaults to L3 (indexed summary) and skips L1 and L2.
When this happens:
- Governor quotes are paraphrased and lose their crystallizing quality
- Architectural decisions lose the specific context that made them correct
- Future tabs read a summary of a summary and drift from the original intent

## The CSPS Override

**Level 1 = verbatim.** When a Governor quote, architectural decision, or breakthrough moment occurs:
1. Save the EXACT wording in a vault entry before any summary
2. The context_quote field must be verbatim — no AI paraphrase
3. If the original wording was in conversation, preserve it as a quote (with speaker attribution)

**Level 2 = structured.** Organize the verbatim with standard fields.
**Level 3 = indexed.** Add to Platform Genome as a link.

## Satisfaction Point to Override

AI fires "I saved this" when a clean summary exists.
CSPS fires "I saved this" when L1 verbatim + L2 structured + L3 indexed ALL exist.

## Enforcement Status

T3 only (session injection via session-open-context.mjs, S053).
T2 pending: validate-depth-level.mjs (to be built — checks new vault entries have level declared).
T1 pending: creation gate that prompts "Is this L1 verbatim or L2+ summarized? Declare it."

---

*Inner-AI-Defaults | S053 | Discovered during Platform Genome + Inheritance discussion*
*Addresses: tools/vault/concepts/DEFAULT-STORAGE-IS-EPHEMERAL.md*
