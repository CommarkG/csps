---
id: csps.governance.fse-creation-template
name: fse-creation-template
description: "Mandatory template for creating any new governance rule, principle, or behavioral contract. Copy-paste this. Fill all 5 surfaces in one response. Commit atomically."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
session: S040
impl_status: swift-implemented
links:
  - { rel: enforces, href: docs/plan/pillar-0-governance/behavioral-contracts.md }
  - { rel: enforces, href: AGENTS.md }
  - { rel: companion, href: tools/council/communication-protocol-shared.md }
consolidation_cross_refs:
  - B_ENFORCEMENT_TRIO
  - B_INHERITANCE_POLICY
  - P-META-007
---

# Five-Surface Engraving (FSE) — Mandatory Creation Template

> **Rule:** Every new governance rule, principle, or behavioral contract MUST hit all 5 surfaces in the SAME response and ONE commit. Fewer than 5 = it will drift within 2 sessions.

---

## When to use this template

- Creating a new behavioral contract (B_*)
- Ratifying a new principle (P-META-*, P-ARCH-*, P-OPER-*)
- Adding a new enforcement requirement
- Registering an error pattern (EP-ERR-*)
- Fixing a recurring gap (K=2 promotion rule)

---

## The 5 Surfaces — Mandatory Checklist

Copy this into your response before starting. Check off as you complete each:

```
FSE CHECKLIST — [Rule Name]:
□ T5 AGENTS.md hard NO — written (1 line, starts with ❌, states what never to do)
□ T4 B_* contract — added to behavioral-contracts.md (canonical + governing_intent + anti-patterns + 5/5 surfaces declared)
□ T3 memory/feedback_*.md — written + MEMORY.md index entry added
□ T2 validate-*.mjs BLOCKING — created or updated, registered in verify.mjs
□ T1 hook — created, registered in .claude/settings.json hooks array
□ COMMIT — all 5 surfaces in one atomic commit
```

---

## Surface Definitions

### T5 — AGENTS.md Hard NO (always-resident, every session)

**Location:** `AGENTS.md` under the appropriate section header.
**Format:**
```
- ❌ Never [specific behavior] — [brief reason] ([contract name])
```
**Example:**
```
- ❌ Never passively observe a gap ("should not be forgotten") — register OPEN-NNN immediately (B_INHERITANCE_POLICY + EP-ERR-005)
```

---

### T4 — Behavioral Contract (B_* entry in behavioral-contracts.md)

**Location:** `docs/plan/pillar-0-governance/behavioral-contracts.md` — append at end.
**Format:**
```markdown
## B_[NAME] — [one-line description] (S[NNN])

**Canonical:** [The rule in 1-3 sentences. What AI must do or never do.]

**Governing intent:** [Why this rule exists — what failure mode it prevents.]

**Anti-patterns:**
- [Specific behavior that violates this rule]
- [Another violation pattern]

**Source:** [Who ratified it, when, what triggered it]

**Mechanical surfaces (N/5 declared S[NNN]):**
- T1 hook: [filename]
- T2 validator: [filename]
- T3 session: [session-open.sh / memory file]
- contract: behavioral-contracts.md (this file)
- memory: feedback_[name].md
```

---

### T3 — Memory Entry (cross-session persistence)

**Location:** `~/.claude/projects/[encoded-path]/memory/feedback_[name].md`
**Format:** See memory type schema (type: feedback, with Why + How to apply)
**Also:** Add one-line entry to `MEMORY.md` index.

---

### T2 — Validator (machine enforcement on commit)

**Location:** `tools/validators/validate-[name].mjs`
**Format:** Node.js ESM. BLOCKING (exit 1) if rule violated. Advisory (exit 0 + warn) for softer checks.
**Registration:** Must appear in `tools/verify.mjs` validators array with name + command + status fields.
**Pattern:**
```javascript
#!/usr/bin/env node
// validate-[name].mjs — [description]
// @csps-enforces B_[NAME] P-[ID]
// Exit: 1 if BLOCKING violation found, 0 otherwise

// ... checks ...

process.exit(blocking > 0 ? 1 : 0)
```

---

### T1 — Hook (fires automatically, no human action)

**Location:** `.claude/hooks/[event]-[name].sh`
**Events:** UserPromptSubmit, PreToolUse, PostToolUse, PostStop, SessionStart
**Registration:** Add to `.claude/settings.json` under `hooks.[EventName][0].hooks` array:
```json
{
  "type": "command",
  "command": ".claude/hooks/[event]-[name].sh"
}
```
**Format:** Bash script returning JSON `hookSpecificOutput` for blocking/context injection, or exit 1 to block.

---

## FSE Verification Standard

After creating all 5 surfaces:

```bash
node tools/verify.mjs   # must exit 0 (T2 registered and passing)
```

Then commit:
```
git commit -m "feat: B_[NAME] — [one-line description]

FSE 5/5 surfaces:
- T1 hook: .claude/hooks/[name].sh
- T2 validator: tools/validators/validate-[name].mjs
- T3 memory: memory/feedback_[name].md
- T4 contract: behavioral-contracts.md#B_[NAME]
- T5 AGENTS.md: hard NO added

node tools/verify.mjs → exit_code=0"
```

---

## Token Optimization Note

When creating a new rule in a long conversation, FSE should be done in ONE tight response to minimize context usage:
1. State the rule in T4 contract format
2. Run the checklist inline (mark each □ → ✅ as you create it)
3. One `git commit` at the end with all changes

Do NOT spread FSE across multiple turns — that creates partial states that drift.

---

## Quick Reference: What fires when

| When | What fires | What it enforces |
|---|---|---|
| Every turn | `user-prompt-submit-turn-counter.sh` | Re-injects governance at turn 25 (B_INHERITANCE_POLICY) |
| Every session open | `session-open.sh` | Role + mandate + open blockers (B_COGNITIVE_CONTEXT_DISCIPLINE) |
| Every `pnpm verify` | All T2 validators | Schema drift, frontmatter, wiring, handoff completeness |
| Every `git commit` | Pre-commit hook | Zero-laptop scope, frontmatter |
| On PostStop | Multiple hooks | PCR check, banned phrases, learning loop, session close gate |
