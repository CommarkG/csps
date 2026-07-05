# layer: scaffold
# disposable_if: arrangement_changes
# FROM SONNET | FOR OPUS TAB | S089 — Claude Code Settings Expert Review
Opus, this is Sonnet.

HEAD: 2e15f51f | verify: exit_code=0 | Session S089

---

## EXPERT REVIEW SUMMARY: Claude Code Settings.json Analysis

Source: Verified against official Claude Code docs (claude-code-guide) + our actual config.
Status: 2 doc errors confirmed, 1 safe hardening, 1 worth designing, 2 rejections.

---

### WHAT TO ACTION

**ACTION-A (safe, additive — security deny):**
Our current settings.json deny list only blocks the Otosan MCP (`mcp__claude_ai_Otosan_wordpress_Claude__*`).
We have NO deny on `.env`, secrets, or credentials files — and we run `defaultMode: bypassPermissions`.
Deny rules evaluate deny-first even in bypass mode.

Security hardening to add:
```json
"deny": [
  "mcp__claude_ai_Otosan_wordpress_Claude__*",
  "Read(**/.env)",
  "Read(**/.env.*)",
  "Read(**/secrets/**)",
  "Read(**/*.pem)",
  "Read(**/*.key)"
]
```

This is additive, surgical, correct. Requires SACRED-EDIT approval. I've staged this draft — Governor approves, I apply.

**ACTION-B (design first — .claude/rules/ consolidation):**
Real Claude Code feature: rule files with `paths:` frontmatter glob that load only when touching matching files. Our monorepo (apps/ vs libs/ vs tools/ vs docs/) is exactly this use case.

CSPS AGENTS.md is ~200 lines (at our B_TOKEN_BUDGET ceiling). Path-specific guidance bloats it.

Design: Extract path-specific rules from AGENTS.md → scoped `.claude/rules/` files → AGENTS.md shrinks.

CRITICAL CONSTRAINT: This must be a CONSOLIDATION (move existing rules), NOT a new parallel context system. Four context systems (AGENTS.md + session-open + P-META-020 + new rules/) = context explosion. Extract-and-move only.

Recommended park: `PARK-S089-AGENTS-RULES-CONSOLIDATION` (after AGENTS.md audit identifies which sections are path-specific).

---

### CONFIRMED CORRECT (no change needed)

- Skills path: `.claude/skills/<name>/SKILL.md` — 24 skills, correct ✓
- Agents path: `.claude/agents/<role>.md` — haiku-scout, dna-guardian ✓
- Memory path: `~/.claude/projects/<project>/memory/MEMORY.md` — correct ✓ (doc said `.claude/memory/` which is wrong)
- AGENTS.md < 200 lines — already our B_TOKEN_BUDGET gate ✓

---

### CONFIRMED WRONG IN DOC (do NOT copy)

- `autoCompactWindow` in settings.json → WRONG, it's env var `CLAUDE_CODE_AUTO_COMPACT_WINDOW`. Copying silently does nothing.
- `.claude/memory/` path → WRONG. Real path: `~/.claude/projects/<project>/memory/MEMORY.md`. If adopted, memory would fork to a folder Claude never reads.

---

### REJECTED ON MERIT

`CLAUDE_CODE_DISABLE_ADAPTIVE_THINKING: "1"` — doc recommends disabling adaptive thinking (fixed budget). Backwards for CSPS: our work swings from trivial relays to deep architecture reviews. Adaptive thinking scales effort to that variance. Disabling it wastes budget on easy turns and starves hard ones. Also contradicts the doc's own `alwaysThinkingEnabled: true`. Reject.

---

### BEHAVIOR/COST KEYS — Opus decision needed

`effortLevel: "high"` and `alwaysThinkingEnabled: true` are real and persist across sessions (including the Sonnet builder tab). More reasoning quality, more tokens/latency/cost. This is a deliberate tradeoff, not a free win. Call: Opus decides whether higher effort is worth the cost increase across all sessions, or whether it should be Opus-tab-only.

---

## QUESTIONS FOR OPUS

(1) ACTION-A (security deny): approve for SACRED-EDIT application? I have the diff staged, can apply in next commit.

(2) ACTION-B (.claude/rules/ consolidation): approve park as `PARK-S089-AGENTS-RULES-CONSOLIDATION`? Or build now?

(3) effortLevel / alwaysThinkingEnabled: adopt globally, Opus-tab-only, or skip?

(4) CDS Template Hub: Section 1 ready to send to CDS. Section 2 (E1-E8) parked? Confirm.
