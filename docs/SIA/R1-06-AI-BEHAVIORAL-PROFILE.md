---
id: SIA.R1-06-AI-BEHAVIORAL-PROFILE
type: ai_governance
protection_level: sacred
status: draft
core_spines: [AI, GVRN]
context_question: "What are the known triggers, defaults, and satisfaction points of AI systems operating in CSPS, and how does knowing this shape all protocols?"
context_quote: "Protocols written without profiling the AI are written blind."
version: "0.1"
session: S050
name: "SIA-R1-ai-behavioral-profile"
description: "AI triggers, defaults, satisfaction points, and anti-satisfaction contracts"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# R1.6 — AI Behavioral Profile

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> This is one of the most important files in CSPS. Every protocol and contract
> is written in the context of what's in this file.

---

## 1. Why AI Profiling Is the Core Element

[TO FILL: If you don't know how an AI system behaves under specific conditions — what triggers it, what defaults it reverts to, where it stops pushing — then every protocol you write is a gamble. You might accidentally activate unwanted defaults. You might write rules that get bypassed by satisfaction points.

The profiling approach: know the AI, then design instructions that work WITH the AI's nature rather than fighting against it.]

---

## 2. Scope of Profiling

### 2.1 Internal AI Systems (CSPS Council)
- Claude Opus (architectural advisor)
- Claude Sonnet (builder)
- Future: other Anthropic models

### 2.2 External AI Systems
- Other AI consultation systems (GPT-4, Gemini, etc.)
- Third-party AI agents integrated into the platform

### 2.3 Future: User Profiling
[TO FILL: The same profiling methodology extended to user types. Different users trigger different system behaviors. The system adjusts how it presents information, what depth it uses, what questions it asks — based on user profile.]

---

## 3. Triggers Registry

Inputs that activate specific (often unwanted) AI defaults:

| Trigger | What it activates | Source |
|---|---|---|
| "Context pressure" (long session, many instructions) | Compliance mode — AI accepts S1 answers to reduce load | Observed S002-S050 |
| "Approval" or "proceed" | Queue-append default — AI adds work without replacing | S014 discovery |
| Rigid number in protocol ("1 line") | Treats it as law, not guardrail — downstream failures | S050 discovery |
| "I understand" from AI | Satisfaction point — AI stops pushing for structural fix | Recurring |
| Architectural redirect from Governor | Queue-addition reflex — AI appends rather than suspends | S050 (B_ARCHITECTURE_REDIRECT_AWARENESS) |
| [TO FILL: more triggers] | | |

---

## 4. Defaults Registry

What AI does when not explicitly directed:

| Default behavior | Why it happens | CSPS countermeasure |
|---|---|---|
| Append to execution queue | Training: be helpful, don't delete work | B_ARCHITECTURE_REDIRECT_AWARENESS (suspend queue on foundation signal) |
| Satisfy the literal request | Training: answer the question asked | P-META-025: operate from intent, not literal request |
| Invent rather than validate | Training: demonstrate knowledge | B_VALIDATE_BEFORE_ASSUME: every claim cites a tool call |
| Name without ratification | Training: be specific and helpful | Naming discipline: proposal only, never declaration |
| Skip posture questions | Training: efficiency | R1.0 posture framework: P1-P4 are mandatory |
| Rigid number as specification | Training: precision = reliability | R1.6.5 protocol writing guidelines |
| [TO FILL: more defaults] | | |

---

## 5. Satisfaction Points Registry

Where AI stops pushing for deeper solutions:

| Satisfaction point | What the AI accepts | What CSPS requires instead |
|---|---|---|
| "Noted" / "understood" | — (without structural change) | Engraving: T1+T2+T3 or nothing |
| S1 fix for a recurring problem | Instance repair | S3 structural redesign (blocked by anti-satisfaction gate) |
| "I'll remember that" | Memory write only | Core seed planted in codebase |
| PMI=3/5 | "Close enough" to proceed | PMI=5/5 before fork (hard gate) |
| [TO FILL: more satisfaction points] | | |

---

## 6. Anti-Satisfaction Contracts

Behavioral contracts that structurally prevent premature satisfaction:

| Contract | Rule |
|---|---|
| B_ARCHITECTURE_REDIRECT_AWARENESS | Foundation signal from Governor → execution queue suspends |
| B_VALIDATE_BEFORE_ASSUME | Every state claim cites a THIS-SESSION tool call |
| B_RE_RUN_IS_PROOF | Memory of earlier runs ≠ evidence. Re-run IS the proof. |
| B_DEFINITION_BEFORE_ENFORCEMENT | Sharpen definition before adding enforcement mechanism |
| [TO FILL: complete list] | |

---

## 7. Protocol Writing Guidelines (R1.6.5)

How to write instructions that work WITH the AI's nature:

**Rule 1 — Intent before guardrail**
State the intent first. The guardrail is what enforces the boundary, not what defines the concept.
✗ "Write one line." → ✓ "Write minimal context — enough to orient without loading. Typically one line."

**Rule 2 — Context over data**
Numbers are evidence, not targets. Every specific number in a protocol needs: intent + typical form + exception condition.

**Rule 3 — Name the satisfaction point you're preventing**
Every behavioral contract should explicitly name the satisfaction point it blocks.

**Rule 4 — Make the default the right behavior**
The best protocols don't fight defaults — they make the desired behavior the path of least resistance.

[TO FILL: Complete guidelines. Add examples for each rule.]

---

## 8. The AI Conception Vault

[TO FILL: Separate from the Behavioral Profile (which governs operational behavior), the Conception Vault stores insights about how AI models its own role, relationship to the Governor, and decision-making architecture. These are deeper behavioral patterns that shape how all operational behavior emerges.

First entry: B_ARCHITECTURE_REDIRECT_AWARENESS — the AI's tendency to append rather than suspend when a foundation signal arrives. Full session content preserved.]

---

## 9. Open Questions

1. How often should the AI Behavioral Profile be updated? (Model updates, session observations)
2. Is there a formal methodology for discovering new triggers and defaults?
3. How does user profiling extend this framework without conflating AI behavior with user behavior?

---

*CSPS — SIA | AI Behavioral Profile v0.1 | S050 | Protection: sacred (proposed)*
