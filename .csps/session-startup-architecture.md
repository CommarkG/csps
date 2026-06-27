<!-- AUTO-GENERATED: session-startup-architecture.md — S089 -->
<!-- For Opus review, critique, and improvement. -->

# CSPS Session Startup Architecture

**Purpose:** Complete technical description of how every new Claude Code tab is initialized,
context is delivered, model identity is confirmed, and session continuity is maintained.
Written so Opus can understand, audit, and improve this system.

---

## Problem Statement

Three independent failures motivated this build (S089):

| Failure | Symptom | Root cause |
|---|---|---|
| **G5 Permanence** | Session resume oneclick written in chat → compacted away → reconstructed manually every time | Chat = ephemeral. Oneclick lived only in conversation. |
| **Context loss at tab-open** | New tab = blank Claude with no S089 state | No mechanism to inject git state, parks, or verify status into new tabs |
| **Model ambiguity** | Governor couldn't know which model was actually running without manually opening the model selector | No self-declaration mechanism existed |

---

## Architecture: Five Layers

### Layer 1 — Generate (tools/generate-oneclick.mjs)

**Trigger:** Called by `tools/verify.mjs` after every `exit_code=0` (clean verify pass).
Also callable standalone: `node tools/generate-oneclick.mjs`

**What it reads:**
- `git rev-parse HEAD` → current HEAD hash
- `git log -1 --format=%s` → last commit message (extracts session tag S0NN)
- `tools/data/green-receipt.json` → verify state (exit_code, blocking, validators_run)
- `.csps/floater-decision-queue.txt` → overdue floaters
- `tools/data/park-register.yaml` → open PARK count

**What it writes:** `.csps/oneclick.md`
Format:
```
<!-- AUTO-GENERATED — do NOT edit manually -->
# CSPS Session Resume — OneClick
[paste block between ``` fences]
[meta: generated_at, HEAD, session, verify state]
```

**Key design decision:** The file is committed to the repo. Not .gitignored. This is intentional —
committed = survives compaction, tab changes, context resets. The timestamp changes every run
but the HEAD hash and content are stable between commits.

**Excluded from tree_hash:** `tools/config/treehash-exclude.txt` lists `.csps/oneclick.md`
to prevent timestamp churn from causing infinite green-receipt mismatch loop.

---

### Layer 2 — Validate (tools/validators/validate-oneclick-freshness.mjs)

**Run tier:** STANDARD (runs every verify pass)
**BLOCKING:** `.csps/oneclick.md` does not exist
**ADVISORY:** File HEAD hash does not match current git HEAD (stale)
**ADVISORY:** Paste-ready block missing or malformed

**Why advisory for stale, not blocking:** The file is regenerated automatically after a clean
verify pass. Stale = previous verify pass was not clean. Acceptable — next clean pass refreshes it.

**Last-run output:** `tools/data/validate-oneclick-freshness-last-run.json`

---

### Layer 3 — Inject into Claude context (tools/scripts/session-open-context.mjs)

**Trigger:** Called by `.claude/hooks/session-open.sh` on every `SessionStart` event.

**What it does:**
1. Reads `.claude/settings.json` → extracts configured model ID + human label
2. Reads `.csps/oneclick.md` → extracts paste block (content between ``` fences)
3. Builds `additionalContext` string with both injected
4. Emits JSON: `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}`

**Where injected in context:**
- **Model declaration card** → FIRST (before G1-G5 questions, before everything)
- **Session resume state** → LAST (after platform genome, before final separator)

**Why model card first:** Claude reads `additionalContext` top-to-bottom before responding.
Putting the model card first ensures it's the FIRST thing Claude sees and the FIRST thing
it responds with.

---

### Layer 4 — Session hook (.claude/hooks/session-open.sh)

**Event:** `SessionStart` (fires on every new Claude Code tab, regardless of model)
**Registration:** `.claude/settings.json` → `"hooks"` → `"SessionStart"`

**What it does:**
1. Ensures `~/.claude/settings.local.json` has `bypassPermissions` (popup prevention)
2. Calls `session-open-context.mjs` → outputs JSON with `additionalContext`
3. Additional stderr output (terminal-visible only, Claude does NOT see these):
   - M-43 diff-review reminder
   - IZFC guard questions
   - Turn discipline enforcement (7 items)
   - OneClick terminal display (Governor-facing only)

**Critical distinction:**
- `stdout` JSON → Claude sees (via `additionalContext`)
- `stderr` output → Governor terminal sees (Claude does NOT see)

**Note on the ONECLICK terminal block:** Lines 231–243 in session-open.sh output to stderr
and are wrapped in `} 2>/dev/null || true` — making them governor-terminal-only and
non-fatal if oneclick.md doesn't exist. This is intentional: the real injection is via
session-open-context.mjs stdout, not this terminal display.

---

### Layer 5 — Model Declaration Gate (B_MODEL_DECLARATION)

**What Claude must do on first response:**
```
ACTIVE MODEL: Claude Sonnet 4.6 (1M context)
ROLE: Sonnet = builder (S089)
Awaiting Governor confirmation.
```

**Governor responses and their meaning:**

| Governor says | Claude does |
|---|---|
| `confirmed` | Proceed with full session context |
| `use opus` | Governor types `/model` in chat → selects Opus 4.8 → opens new tab → same hook fires → Opus sees this same card |
| `use haiku` | Governor spawns Haiku via Agent tool. Haiku is sub-agent ONLY — never a UI tab. SessionStart hook does NOT fire for Agent-spawned sub-agents. Context passed via spawn prompt. |

**Cross-check mechanism:** The card shows what `.claude/settings.json` says the model
*should* be. Claude reports what it *actually* is. If they differ → Claude flags it.
This catches: global settings shadow, manual `/model` override in a previous turn that
wasn't expected, or any drift between configured and running model.

---

## Data Flow Diagram

```
[clean verify pass]
      │
      ▼
tools/verify.mjs
      │ auto-calls post-green
      ▼
tools/generate-oneclick.mjs
      │ reads: git HEAD, green-receipt.json, floater-queue, park-register
      │ writes:
      ▼
.csps/oneclick.md  ←──────────────────────────────────────┐
      │                                                     │
      │                                              (re-generated every
      ▼                                               clean verify pass)
[Governor opens new tab]
      │
      ▼
.claude/hooks/session-open.sh  (SessionStart event)
      │
      ├── stderr → Governor terminal (M-43, IZFC, oneclick display)
      │
      └── calls session-open-context.mjs
                │
                ├── reads .claude/settings.json → configured model
                ├── reads .csps/oneclick.md → paste block
                │
                └── stdout JSON → Claude additionalContext
                          │
                          ├── [TOP]    MODEL DECLARATION REQUIRED card
                          ├── [MIDDLE] Full governance context (G1-G5, PE, roles...)
                          └── [BOTTOM] SESSION RESUME STATE (oneclick paste block)

[Governor types anything]
      │
      ▼
Claude's FIRST RESPONSE:
  ACTIVE MODEL: [self-declared]
  ROLE: [self-declared]
  Awaiting Governor confirmation.
      │
      ▼
Governor: "confirmed" / "use opus" / "use haiku"
      │
      ▼
[session proceeds / model switched / sub-agent spawned]
```

---

## File SSoT Registry

| File | Role | Who writes | Who reads |
|---|---|---|---|
| `.csps/oneclick.md` | Session resume paste block | `generate-oneclick.mjs` (auto) | `session-open-context.mjs` (at tab open) |
| `tools/generate-oneclick.mjs` | Generator | Sonnet (committed) | `verify.mjs` (caller) |
| `tools/validators/validate-oneclick-freshness.mjs` | Gate | Sonnet (committed) | `verify.mjs` (runner) |
| `tools/scripts/session-open-context.mjs` | Context builder | Sonnet (committed) | `session-open.sh` (caller) |
| `.claude/hooks/session-open.sh` | Hook entrypoint | Sonnet (committed) | Claude Code (SessionStart event) |
| `.claude/settings.json` | Model config + hook registration | Governor (ratified) | `session-open-context.mjs`, Claude Code |
| `tools/config/treehash-exclude.txt` | Hash exclusion list | Sonnet (committed) | `verify.mjs`, `validate-green-receipt.mjs` |
| `tools/config/frontmatter-exempt-paths.yaml` | Alignment exemptions | Sonnet (committed) | `validate-universal-alignment.mjs` |

---

## Decision Ledger

| Decision | Chosen | Rejected | Reasoning |
|---|---|---|---|
| Where to store oneclick | `.csps/oneclick.md` (committed) | Chat only | Chat = ephemeral. G5: committed = permanent. |
| How to inject into Claude | `additionalContext` JSON from `session-open-context.mjs` | stderr from `session-open.sh` | Claude reads stdout JSON only. Stderr is Governor-terminal-only. |
| Model declaration position | First in `additionalContext` | After governance context | If it's after, Claude might respond to the first user message before seeing it. First = guaranteed. |
| Stale oneclick advisory vs blocking | Advisory | Blocking | A stale file still provides context. Missing = total loss. Blocking only on missing. |
| Haiku as UI tab vs sub-agent | Sub-agent only | UI tab | Haiku's bounded-scan role doesn't need full session context. Agent tool spawn = right-sized. |

---

## Known Gaps (for Opus to evaluate)

1. **No T2 validator for model declaration compliance.** The mandate is behavioral (Claude must self-declare), not mechanical. A post-stop validator that checks the first response contains `ACTIVE MODEL:` would make this binding. Currently T3 only (hook injection).

2. **Model label map is hardcoded.** `session-open-context.mjs` has a `MODEL_LABELS` object mapping model IDs to human names. New models require a code change. A settings-level `modelLabel` field would be more maintainable.

3. **`blocking=?` in oneclick.md.** `generate-oneclick.mjs` reads `green-receipt.json` for `blocking_count` but the field name in the receipt may differ. Check `green-receipt.json` field names and fix the key lookup.

4. **No Opus-specific session context.** When Opus runs a tab, it receives the same `additionalContext` as Sonnet. The `roleHeader` in session-open-context.mjs switches between SONNET BUILDER / OPUS ADVISOR based on `sessionRole`, but `sessionRole` is read from `session-state.json` — not from the actual running model. Opus running in a Sonnet-role-declared session sees the wrong role header.

5. **No cryptographic attestation.** Self-declaration is honest but not provable. A future improvement: Claude Code could expose the active model ID in the hook environment, allowing the hook to inject it mechanically (not rely on Claude's self-report).

---

## Improvement Proposals (Opus to evaluate, PCR on merit)

**P1 — T2 validator for model declaration**
`validate-model-declaration.mjs` as a post-stop validator. Scans the first Claude response in any tab for `ACTIVE MODEL:`. If missing → ADVISORY. If mismatched with configured model → BLOCKING.

**P2 — Role-aware session context**
`session-open-context.mjs` reads which model is actually running (if Claude Code exposes this via env var or hook input). Switches context between Sonnet-builder and Opus-director profiles based on actual model, not session-state.json declared role.

**P3 — Oneclick `blocking` field fix**
Audit `tools/data/green-receipt.json` field names. Fix `generate-oneclick.mjs` to use the correct key. Currently shows `blocking=?` instead of the actual count.

**P4 — Model label externalized**
Add `modelLabel: "Claude Sonnet 4.6 (1M context)"` to `.claude/settings.json`. session-open-context.mjs reads it. No hardcoded map needed.

---

## Commit History (S089)

| Commit | What |
|---|---|
| `44cf32a7` | Initial oneclick hardwire: generate-oneclick.mjs + validate-oneclick-freshness.mjs + session-open.sh injection + verify.mjs auto-regen + treehash exclude |
| `79513f04` | Fix: inject oneclick into Claude additionalContext (not stderr) via session-open-context.mjs |
| `ca3363a6` | Fix: make oneclick resume block role-neutral (all three roles) |
| `a785d0a1` | Feat: B_MODEL_DECLARATION — model card at top of additionalContext |
| _next_ | Add Governor options (use opus / use haiku) + this architecture doc |

---

*This document is the SSoT for the session startup architecture. Opus should treat it as the
audit target: verify every claim here against the actual files listed in the File SSoT Registry.*
