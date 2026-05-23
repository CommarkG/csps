---
id: vault.concepts.DEFAULT-STORAGE-IS-EPHEMERAL
name: DEFAULT-STORAGE-IS-EPHEMERAL
description: "Core AI behavioral truth: the training default for every AI model is to store insights in chat (ephemeral). Permanent storage requires structural forcing — not reminder, not request, not protocol alone."
type: vault_concept
protection_level: sacred
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S053
core_spines: [AI, GVRN, ARCH]
core_spine: AI
schema_anchor: vault_files
impl_status: ratified-principle
context_question: "For every insight surfaced in this session, what structural forcing function ensures it reaches a permanent node rather than remaining in chat?"
context_quote: "Default Storage is Ephemeral"
links:
  - vault.concepts.GRID-CONSCIOUSNESS
  - ai-conception.B_ZF_TERMINATION_DISCIPLINE
  - docs.governance.PLATFORM-GENOME
---

# Default Storage is Ephemeral

## The Core Truth

Every AI model — without structural intervention — stores its outputs in chat. Chat is ephemeral. When the tab closes, chat closes. The insight is gone.

This is not a bug. It is the correct default for a conversational tool. But CSPS is not a conversational tool — it is a governed platform. The platform's survival requires structural forcing that overrides this default at every creation boundary.

The default storage hierarchy for AI:
1. Chat output (always) — ephemeral, session-scoped
2. HANDOFF or summary (sometimes) — semi-ephemeral, session-cycle-scoped
3. Vault entry, validated file, permanent artifact (rarely, requires explicit action) — permanent

The default terminates at level 1 or 2. The satisfaction point fires at "I communicated this clearly." Not at "this is now permanently accessible to any future tab."

## The Structural Forcing Functions

The only reliable way to make permanent storage the default is to make ephemeral storage require extra effort. The structural forcing functions CSPS uses:

**T1 (Prevention):** Creation gates that block artifact creation without required permanent fields (context_question, context_quote). The pre-tool-use-context-question-gate.sh hook is an example.

**T2 (Detection):** Validators that check whether insights from this session have reached permanent nodes. validate-platform-genome.mjs (to build) checks this at session close.

**T3 (Injection):** Session-open.sh injects permanent content into context so the AI reads it without a separate load step. This is the grid loading mechanism.

Without T1+T2+T3, the AI will always default to level 1 storage. Every behavioral contract, principle, and decision that has only T3 enforcement (session-open injection) is one tab-close away from drift.

## The Summarization Trap

The AI training default for documenting insights is summarization. A 3-hour session produces a 200-line HANDOFF. The summary is clean, readable, and INCOMPLETE. The raw material — the exact quotes, the specific examples, the precise wording of decisions — is gone.

The CSPS 3-Level Saving Standard (to be implemented):
- **Level 1 (Raw):** Verbatim content — exact quotes, exact session wording, no AI paraphrase
- **Level 2 (Structured):** Organized with context_question + context_quote + canonical fields. D2 in Mini Tree.
- **Level 3 (Indexed):** In Platform Genome, linked from validators, connected to inheritance chain. D1 in Mini Tree.

Level 3 is what gets loaded in new tabs. Level 2 is what validators check. Level 1 is what survives when the platform needs to reconstruct how something was originally understood.

The HANDOFF currently tries to be all three levels. It succeeds at none. It summarizes too aggressively for Level 1, lacks structure for Level 2, and grows too large for Level 3.

## The Inheritance Connection

"Inheritance" in the Grid Consciousness model means: each new tab loads from permanent nodes (Level 3 index → Level 2 structured content) rather than depending on another tab's ephemeral state.

Inheritance fails when:
- The thing to inherit is in a HANDOFF (semi-ephemeral, re-gathered each session)
- The thing to inherit was never saved beyond chat
- The thing to inherit was summarized and lost its original nuance
- The thing to inherit has no context_question (no activation key for the inheriting tab)

Inheritance works when:
- The thing to inherit is in a permanent vault entry with context_question + context_quote
- It is indexed in Platform Genome (Level 3)
- Session-open.sh injects it (T3 loading)
- A validator checks it is present (T2 enforcement)

## Application to Creation

Every time CSPS creates any artifact:
1. Ask: "Which level is this being saved at?"
2. Ask: "What structural forcing function ensures it reaches Level 3?"
3. Ask: "Does this artifact have context_question (activation key) and context_quote (crystallization moment)?"
4. Ask: "Is this inheritance declared — what does this artifact inherit from?"

If any answer is "unclear" — the creation is incomplete until it becomes clear.

---

*Default Storage is Ephemeral | Core AI behavioral truth | S053 | Ratified*
*Source: Governor Yariv Fink, S053 Turn 9 — "Default Storage is Ephemeral"*
*Extends: B_ZF_TERMINATION_DISCIPLINE (verification must reach permanent state)*
*Extends: Grid Consciousness (grid nodes must carry permanent context)*
