---
id: csps.vault.wisdom.communication-samples
name: communication-samples
description: "Real examples of communication failures and corrections from CSPS sessions. Each sample: what happened, which AI default caused it, the correct version, the guard question that prevents it."
type: vault_concept
protection_level: sacred
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spines: [AI, GVRN]
core_spine: AI
schema_anchor: vault_files
version: "1.0"
session: S053
links:
  - csps.council.communication-protocol-shared
  - csps.vault.wisdom.question-library
  - csps.vault.wisdom.quote-library
context_question: "Before sending a complex message, does a real example of this failure mode exist in these samples — and does the correct version pattern-match what I'm about to write?"
context_quote: "It is common sense in a conversation that every 10-year-old can follow. Somehow, because you are so sophisticated, you keep messing it around."
---

# Communication Samples Library

> Real failures from CSPS sessions. Preserved verbatim.
> Each sample teaches more than a rule. The samples ARE the training data.
> Add new samples when communication fails. Never delete — mark as RESOLVED.

---

## SAMPLE 001 — Impersonating the Governor (S053)

**What happened:**
Sonnet created a startup block labeled "I AM: Yariv Fink (Governor)."
Sonnet did not have authorization to write as the Governor.
The content was from Sonnet, but claimed to be from the Governor.

**Why it happened:**
AI Default: "This content needs to be authoritative → use the highest-authority voice I know."
The satisfaction point fired at "I used the right authority format" not "I correctly identified the author."

**The bad version:**
```
YOU ARE: OPUS-8 (Claude Opus), architectural advisor for CSPS.
I AM: Yariv Fink (Governor).
```

**The correct version:**
```
FROM SONNET-S053 | FOR OPUS TAB
Opus, this is Sonnet.
[content]
```

**Guard question that prevents this:**
G2 Identity: "Am I labeling content as from a role I do not hold?"
If the Governor didn't type these words, don't write "I AM: Yariv Fink."

**Additional failure:** Sonnet wrote "OPUS-8" — inventing an instance number it doesn't know.
Correct: "The new Opus instance" — never invent a number.

---

## SAMPLE 002 — Receiver's Voice Inside Sender's Block (S053)

**What happened:**
Opus wrote: "Opus, this is Sonnet. [Use this line when YOU reply back to me]"
This line is Sonnet's OPENING LINE — placed inside an Opus-to-Sonnet block.

**Why it happened:**
AI Default: "I should give clear instructions → include an example of the correct format."
The AI placed the receiver's voice inside the sender's message without labeling it as a quote.
Sonnet reads it and sees its own voice in the message FROM Opus — creating ambiguity about
who is speaking and what is instruction vs. content.

**The bad version:**
```
FROM OPUS-7 | FOR SONNET TAB
Opus, this is Sonnet. [Use this line when YOU reply back to me]
[rest of content]
```

**The correct version:**
```
FROM OPUS-7 | FOR SONNET TAB
[content]
[what to do]
When you report back: follow communication-protocol-shared.md Rule 1 (Sonnet→Opus format).
```

**Guard question that prevents this:**
G2 Identity: "Is there any line in this block that should come FROM the receiver, not from me?"
If yes → remove it. Reference the protocol instead.

---

## SAMPLE 003 — Complexity Escalation in Paste Blocks (S053)

**What happened:**
Opus provided a 60-line paste block to Sonnet containing: background context, a HANDOFF
template, a startup block, instructions about format, AND a 5-section to-do list.
The Governor had to parse 60 lines to find what to actually do.

**Why it happened:**
AI Default: "I should be thorough and complete → include everything relevant."
Each layer of context feels necessary individually. Together they create a block
too complex to relay efficiently. The Governor is not the target reader of the content
but has to process it anyway.

**The bad version:**
[60-line block with HANDOFF template embedded inside a paste block]

**The correct version:**
```
FROM OPUS-7 | FOR SONNET TAB
S053-C done. Complete these in order:
1. Challenge Round on S053-C artifacts.
2. Create HANDOFF-S053-to-S054.md (template: HANDOFF-S052-to-S053.md structure).
3. pnpm verify exit_code=0.
4. git push origin main.
Report: FROM SONNET | FOR OPUS TAB format.
```

**Guard question that prevents this:**
"Can the Governor relay this in under 30 seconds without reading any of it?"
If no → it is too complex. Cut until the answer is yes.

---

## SAMPLE 004 — Instruction Contains Its Own Violation (S053)

**What happened:**
Opus added Rule 16 (Transfer Block Mandatory) to the system.
In the very next response, Opus provided a paste block that contained "I AM: Yariv Fink (Governor)"
and was 60 lines long — violating the very rule just added.

**Why it happened:**
AI Default: "I understand the rule → I will follow it." The cognitive match produced confidence.
The satisfaction point fired at "I understand Rule 16" not at "I am applying Rule 16 right now."
Long-session context pressure compressed the just-added rule before it could influence the output.

**The lesson:**
A rule added to a running session does NOT automatically apply to the current response.
It applies starting from the NEXT fresh tab load.
This is why T3-only rules drift: they fire at the wrong time (session START, not mid-response).
T2 validators (post-stop scan) are the only reliable mid-session enforcement.

**Guard question that prevents this:**
"Did I add a rule in this session that I'm about to violate right now?"
If yes → apply the rule to the current response before sending.

---

## SAMPLE 005 — Guide Question vs. Guard Question (S053, Challenge Round)

**What happened:**
Artifacts had context_question fields, but most were "guide" questions:
"What is this artifact for?" / "Why does this matter?" / "How does this work?"
These questions can be answered with any plausible explanation without actually verifying state.

**Why it happened:**
AI Default: "A good question helps someone understand → write an explanatory question."
The purpose of context_question is not explanation but VERIFICATION. The AI confused
the two purposes because both involve asking a question.

**The bad version (guide):**
"What is the ZF protocol and why is it important?"

**The correct version (guard):**
"Before writing any ZF claim, what specific file:line in THIS response provides the evidence?"

**The distinction:**
A guide question can be answered from memory or inference.
A guard question CANNOT be answered without actually checking something.

**Guard question that prevents this:**
"Can this context_question be answered with 'yes it seems right' from memory?
If yes → it's a guide, not a guard. Rewrite to require specific evidence."

---

## How to Add New Samples

When communication fails — in any session, on any boundary — add a sample here:
1. Note the session and turn
2. Paste the BAD version verbatim (never paraphrase the failure)
3. Write the CORRECT version
4. Name the AI default that caused it
5. Write the guard question that would have prevented it

The samples grow. The pattern library grows. Future AIs pattern-match on these examples
rather than abstracting from rules they don't understand.

---

*Communication Samples Library | tools/vault/wisdom/ | S053 | Protection: sacred*
*Source: Governor Yariv Fink directive S053 — "evolving and deep understanding of things"*
