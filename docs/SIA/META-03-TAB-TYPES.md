---
id: SIA.META-03-TAB-TYPES
type: governance
protection_level: protected
status: draft
core_spines: [GVRN, AI]
context_question: "What are the three session types in CSPS, when is each used, and what can each produce?"
context_quote: "The session type is declared before the work begins. It shapes what the session is allowed to produce."
version: "0.1"
session: S050
name: "SIA-META-tab-types"
description: "Three session types: ARCH-SESSION, MIXED-SESSION, EXEC-SESSION"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# META-03 — Tab Types (Session Taxonomy)

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.

---

## 1. Why Session Types Matter

[TO FILL: The problem: every session is implicitly "mixed" — design and execution happen in the same context, contaminating both. Design work is interrupted by execution impulse. Execution work makes architectural decisions without ratification. The session type declaration prevents this by making the mode explicit and enforced.]

---

## 2. The Three Types

### ARCH-SESSION — Architecture Design Session

**Purpose:** Pure architecture. No execution. No code.

**What it produces:** DESIGN-DOC only — a complete architectural specification ready for Sonnet to implement.

**What it cannot produce:** PROTOs, commits, file changes to production code.

**When to use:**
- New platform foundations being designed
- Complex multi-option architectural decisions
- Building the SIA (this is an ARCH-SESSION)
- Any session where the architectural question is open

**The Governor + Opus combination:** Both present. Deep thinking. No urgency to execute.

---

### MIXED-SESSION — Scoped Design + Limited Execution

**Purpose:** Light architectural decisions that can be immediately implemented in the same session. For low-risk, well-understood changes.

**What it produces:** A light PROTO + commits for the scoped work only.

**What it cannot produce:** Strategic architectural decisions (those require ARCH-SESSION).

**When to use:**
- Small validators or config changes
- Bug fixes with clear cause
- Changes where no architectural unknowns exist
- Scope declared explicitly at session open

**Risk:** This type is tempting to overuse. Anything with an open architectural question belongs in ARCH-SESSION, not MIXED-SESSION.

---

### EXEC-SESSION — Execution Only

**Purpose:** Sonnet executes a pre-existing, Governor-ratified plan.

**What it produces:** Commits + a report.

**Input:** One sentence referencing the plan. Nothing else.

**What it cannot produce:** Architectural decisions, design documents, scope changes.

**When to use:**
- After an ARCH-SESSION has produced a ratified DESIGN-DOC
- When the PMI is 5/5 and the plan is complete
- Mechanical, well-understood work with zero open questions

**The power of this type:** Token efficiency. Sonnet's full context budget goes to execution. No Opus needed. No design deliberation. Just build.

---

## 3. Declaration Protocol

At session-open, the session type is declared:

```
SESSION TYPE: [ARCH-SESSION | MIXED-SESSION | EXEC-SESSION]
REASON: [why this type was chosen]
OUTPUT CONTRACT: [what this session is allowed to produce]
```

[TO FILL: How this declaration is enforced. Which hooks check it. What happens if a session tries to produce an output not allowed by its type.]

---

## 4. Transition Rules

[TO FILL: Can a session change type mid-session? Generally no. If an EXEC-SESSION hits an architectural question, it pauses and raises a SROF (Structured Review and Open Feedback) to Opus. It does NOT become a MIXED-SESSION. The session type is a commitment, not a starting default.]

---

## 5. Relationship to the PIE

[TO FILL: The Platform Intelligence Engine filters available plan items based on session type. In an ARCH-SESSION, only design-phase items are surfaced. In an EXEC-SESSION, only items with complete DESIGN-DOCs are available for execution.]

---

*CSPS — SIA | Tab Types v0.1 | S050 | Protection: protected (proposed)*
