---
id: csps.governance.ai-default.example-instruction-confusion
name: example-instruction-confusion
description: "AI default: when an example of the correct format is placed inside a directive, the AI treats it as content rather than as an instructional example. Creates ambiguity about who is speaking and what is instruction vs. content."
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: AI
schema_anchor: inner-ai-defaults
session: S053
disposition: override
context_question: "If I place an example of the receiver's words inside my message to them — will they see it as 'this is what you should write' or 'this is already written'?"
context_quote: "Sonnet can easily send back this exact line. This is a perfect example of a false assumption."
links:
  - csps.council.communication-protocol-shared
  - csps.vault.wisdom.communication-samples
---

# Example-Instruction Confusion — AI Inner Default Override

## The Default

When providing communication instructions, AI includes an example of the correct format:
"Use this line when you reply: 'Opus, this is Sonnet.'"

The problem: the example is placed INSIDE the directive message. The receiver sees:
1. The directive text
2. The example of their own voice
3. Cannot reliably distinguish which is instruction vs. content

The AI's default: "I should give a concrete example → include it inline."
The receiver's confusion: "Is this what I should write, or is this already written?"

## The S053 Violation

Opus wrote inside a block TO Sonnet:
"Opus, this is Sonnet. [Use this line when YOU reply back to me]"

This placed Sonnet's opening line inside Opus's message.
Sonnet could literally copy that line and satisfy the instruction nominally.
The Governor pointed this out immediately: "Sonnet can easily send back this exact line."

## The CSPS Override

**Never include the receiver's voice inside the sender's message.**

If the format must be communicated:
- Reference the protocol file: "Follow communication-protocol-shared.md Rule 1"
- Or separate it clearly: "Your reply format (this is separate from my message):"
- NEVER embed an example of the receiver's words in the same block as your content

## Why This Matters at Scale

With multiple AI agents and external systems, this confusion grows proportionally.
If a CSPS → External Agent message includes "Your response should say: [CSPS format]",
the external agent may reproduce the example verbatim, not the intended content.

## Enforcement Status

T3: Guard Question G2 (identity) + Rule 16 (Transfer Block Mandatory) in session-open-context.mjs.
T2: validate-communication-quality.mjs (checks templates for FROM/TO compliance, S053).
T2 pending: check for embedded receiver-voice patterns in sender blocks.
T1 pending: pre-Write hook on new comm templates.

---

*Inner-AI-Defaults | S053 | Discovered during paste block analysis (Turn 22)*
*Sample: tools/vault/wisdom/communication-samples.md SAMPLE 002*
