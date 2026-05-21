---
id: SIA.META-05-SACRED-FILES
type: governance
protection_level: sacred
status: draft
core_spines: [GVRN, VALD]
context_question: "What makes a file sacred, how is it protected, and why does this protection level need to exist?"
context_quote: "Sacred files are platform invariants. They define the foundation everything else stands on."
version: "0.1"
session: S050
name: "SIA-META-sacred-files"
description: "Sacred file protection levels and enforcement protocol for CSPS governance artifacts"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# META-05 — Sacred Files Protocol

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> This file is itself sacred — proposed.

---

## 1. Why Sacred Files Exist

Without explicit protection, AI systems will modify any file they have access to. Under context pressure, under execution impulse, or simply as a side effect of "being helpful," an AI can overwrite or restructure a file that took months to design and ratify.

Sacred files are the files where this cannot be allowed. They represent the platform's invariants — the things that must not change without the highest level of deliberation.

[TO FILL: Examples of what goes wrong when foundation files are modified without protection. The "AI freestyle" failure mode.]

---

## 2. Protection Levels

| Level | When to use | Change protocol |
|---|---|---|
| `draft` | Being designed — anything can change | None |
| `active` | In use — working well | Session ratification (Opus approves) |
| `protected` | Stable — deliberate changes only | Governor directive required |
| `sacred` | Constitutional — never change without highest review | Governor explicit authorization + ZF verification cycle |

---

## 3. What Belongs at Sacred Level

**Candidates for sacred status:**

- All Palace Philosophy documents (cornerstone)
- Core Spines definitions (L1 sealed)
- This file (the protection protocol itself)
- The AI Behavioral Profile (changing this without care = all protocols become blind)
- Node Schema (changing this = all nodes become inconsistent)
- Threshold pipeline definitions (changing this = inputs misrouted)
- Any L1 principle in the CSPS principles registry

[TO FILL: Complete criteria for sacred classification. When should something be promoted to sacred? Who can propose? Who ratifies?]

---

## 4. The Enforcement Mechanism

[TO FILL: How the sacred protection is mechanically enforced.

T1 hook: pre-tool-use-write-dispatcher.sh checks the `protection_level` field in target file's frontmatter. If `sacred`: requires explicit Governor authorization message in current session context before write is permitted.

T2 validator: validate-sacred-files.mjs — runs at every commit. Checks that sacred files were not modified without a ratification record in the session's commit message.

T3: session-open reminder — lists all sacred files and their current status.

The gap this closes: an AI cannot freestyle with sacred files even if it "thinks" it's being helpful.]

---

## 5. The Change Protocol for Sacred Files

When a sacred file must be changed:

1. Governor states explicit authorization: "I authorize modification of [file] for [reason]."
2. Proposed change is presented as a diff (no silent rewrites).
3. ZF cycle is run on the proposed change: what does this break?
4. Governor confirms after reviewing ZF output.
5. Commit message includes ratification record.

[TO FILL: How this authorization is captured in a way the T1 hook can verify.]

---

## 6. Sacred Files List (Current)

| File | Reason for sacred status |
|---|---|
| PHI-01-PALACE-PHILOSOPHY.md | Cornerstone philosophy |
| META-01-CORE-SPINES.md | Foundational classification framework |
| R1-06-AI-BEHAVIORAL-PROFILE.md | All protocols are written relative to this |
| META-05-SACRED-FILES.md | The protection protocol itself |
| [CSPS existing: tools/council/csps-context.md] | Platform operating context |
| [CSPS existing: docs/plan/pillar-0-governance/behavioral-contracts.md] | B_* contracts |
| [TO FILL: complete list] | |

---

*CSPS — SIA | Sacred Files Protocol v0.1 | S050 | Protection: sacred (proposed)*
