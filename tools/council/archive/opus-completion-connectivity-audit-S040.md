---
id: csps.council.opus-completion-connectivity-audit-S040
name: opus-completion-connectivity-audit-S040
description: "Opus deep dive audit: completion and connectivity gaps across all mechanical activation layers. For Sonnet execution in S041. Governor directive S040."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: council_state
session: S040
---

# Opus Deep Dive Audit — Completion & Connectivity Gaps
## For Sonnet execution | DO NOT add to Sonnet prompt until Governor signals

---

## EXECUTIVE SUMMARY

The platform has 22 hooks, 129+ validators, and 34+ behavioral contracts. But **11 of 22 hooks are STUBS** — they exit 0 and do nothing. The most critical quality gates (RZF enforcement, banned phrase detection, PCR check, validate-before-assume) are **declared but mechanically inert**. The verification system that checks hooks (`verify-hooks-functional.sh`) is **itself a stub**. This is the primary source of recurring drift.

---

## SECTION A — HOOKS: PRODUCTION vs STUB

### STUB (exits 0, does nothing — 11 hooks):

| Hook | What it CLAIMS to do | Why it matters |
|---|---|---|
| `post-stop-banned-phrase.sh` | Detect forbidden phrases in responses | **CRITICAL** — B_ZERO_NAVIGATION_FOR_GOVERNOR has no T1 without this |
| `pre-tool-use-rzf-evidence-gate.sh` | Block tool use if no RZF preceded the response | **CRITICAL** — RZF mandate has no T1 enforcement |
| `post-stop-pcr-check.sh` | Detect responses with decisions but no PCR | **HIGH** — B_PCR_FOR_DECISIONS has no T1 |
| `post-tool-use-validate-before-assume.sh` | Catch tool calls without prior validation | **HIGH** — B_VALIDATE_BEFORE_ASSUME has no T1 |
| `verify-hooks-functional.sh` | Verify all hooks are present and executable | **META-FAILURE** — safety net is broken; always reports "all OK" |
| `user-prompt-submit-governor-prompts.sh` | Log every Governor prompt to governor-prompts/S<NNN>.md | **HIGH** — no prompts are being tracked |
| `pre-tool-use-frontmatter-enum-check.sh` | Check frontmatter against closed enums before Write | **MEDIUM** — frontmatter drift has no T1 |
| `pre-tool-use-skill-aap-required.sh` | Enforce AAP before skill invocation | **MEDIUM** — agents skip AAP without this |
| `depth-marker-creation-gate.sh` | Gate depth level markers on creation | **MEDIUM** — depth discipline unenforced |
| `post-stop-consolidation-pass.sh` | Trigger consolidation review after each stop | **LOW** — advisory pass |
| `post-stop-savings-ssot-coverage.sh` | Check SSOT coverage | **LOW** — audit function |

### PRODUCTION (actually does something — 4 hooks):
- `post-stop-pnpm-verify.sh` — runs verify.mjs after every response ✅
- `pre-tool-use-claude-dir-guard.sh` — blocks editing .claude/settings outside session-open ✅
- `pre-tool-use-plan-coverage-gate.sh` — blocks libs/apps writes without plan coverage ✅
- `post-stop-session-close-gate.sh` — detects when session close is initiated ✅

### ADVISORY (fires but doesn't block — 7 hooks):
- `session-open.sh` — injects context (exits 0, doesn't block)
- `user-prompt-submit-turn-counter.sh` — counts turns, injects refresh at 25
- `user-prompt-submit-ai-profiler.sh` — detects mode, injects reminder
- `user-prompt-submit-intake.sh` — detects uploads/URLs
- `user-prompt-submit-next-step-reminder.sh` — injects disciplines
- `user-prompt-submit-raw-comments.sh` — checks raw thought comments
- `pre-tool-use-sacred-parts-guard.sh` — warns on sacred file edits

---

## SECTION B — VALIDATORS: BLOCKING vs ADVISORY vs DEFERRED

### DEFERRED (declared but never runs):
- `audit_runner_full_pass` — "ships week-4 (planned per build-order.md week 4)" — **week-4 was never formally defined. This validator has never run.**

### ADVISORY that should be BLOCKING:
- `communication_protocol` — Rule violations are advisory. B_ZERO_NAVIGATION violations are not caught.
- `active_protocol_compliance` — mixed blocking/advisory. Protocol violations should always block.
- `completeness_coverage` — self-reporting completion status is advisory. No blocking enforcement.
- `no_laptop_secrets` — advisory. Should block if .env.local contains real values.

### PATTERN: 30+ validators are ADVISORY
Most governance validators use `process.exit(0)` even when they find issues. The `--strict` flag upgrades some to blocking, but is never used in default `pnpm verify`.

---

## SECTION C — BEHAVIORAL CONTRACTS: SURFACE COMPLETENESS

### CRITICAL GAPS (< 3/5 surfaces):

**B_DONE_RIGHT_FROM_THE_START (2/5 declared S037):**
- Has: memory (feedback_done_right.md) + principle (P-OPER-002)
- Missing: AGENTS.md hard NO, T1 hook, T2 validator
- Impact: "verify before declaring done" is enforced by T3 (memory) only. Drifts.

### SIGNIFICANT GAPS (3/5 surfaces):

**B_CONTEXTUAL_LOCALITY (3/5 declared S036):**
- Has: memory, principle, validator (validate-communication-protocol.mjs)
- Missing: AGENTS.md hard NO, T1 hook
- Impact: "content at point of use" rule has no hook that fires on every response.

### MINOR GAPS (4/5 surfaces):

**B_APPS_ARE_TRIALS (4/5 declared S029):**
- Has: memory, AGENTS.md, contract, principle
- Missing: T1 hook (pre-tool-use that warns when creating app-specific code instead of libs/)

**B_ZCA (4/5 declared S036):**
- Has: memory, principle, inner-default, template, protocol rule
- Missing: T1 hook that checks cross-boundary messages for WHO/WHAT/HOW/NOW

---

## SECTION D — DNA CONNECTIVITY: BROKEN PATHS AND MISSING LINKS

### DNA Registry Path Verification:
The `tools/config/dna-registry.yaml` uses Windows absolute paths for local-scope files:
```
path: C:\Users\finky\.claude\core\L1-vocabulary.md
```
These paths **BREAK on any non-Windows machine or Codespaces environment**. They are not cross-platform. The scope:local paths should use `~/.claude/` or be expressed as relative.

### @csps-dna Block Coverage:
The DNA block standard was ratified in S040 as part of B_CSPS_INHERITANCE_PRINCIPLE.
Current coverage: **0 files have `@csps-dna` block**.
The inheritance-registry.yaml does not exist yet (planned S041).
`validate-dna-block.mjs` does not exist yet (planned S041).
`pre-tool-use-dna-block-check.sh` does not exist yet (planned S041).

**Result:** The inheritance system is completely paper-based. Nothing is enforced.

### inherits_from Coverage:
**0 files declare `inherits_from`.** The concept exists in the plan but zero artifacts implement it.

---

## SECTION E — COMPLETION STATUS ENFORCEMENT

### What exists:
- `completionStatus` field in playground PAGES data object (self-reported)
- Completion Framework page (/platform/completion/) — documentation only
- Completion Engine page (/platform/completion-engine/) — live scores (reads self-reported data)

### What's missing:
1. **T2 validator**: `validate-page-completeness.mjs` — blocks `status: complete` without `verified_by: governor` (OPEN-043)
2. **T1 hook**: Nothing checks completionStatus on file writes
3. **inheritance-registry.yaml** — the canonical completeness data source (planned S041)
4. **completion-orchestrator.mjs** — the "monster" engine that reads registry and generates scores (planned S041)

### Current enforcement: ZERO (100% self-reported, 0% mechanically verified)

---

## SECTION F — THE META-FAILURE

`verify-hooks-functional.sh` is a STUB. It always outputs "all OK" regardless of actual hook status. This means:
- The Governor sees "20 hooks present=20 missing=0 not_executable=0" in every session
- This is false. 11 hooks are present but do nothing.
- The platform has been reporting "all hooks functional" for every session since S037.

The platform's health dashboard (the hook that checks hooks) has never worked.

---

## SECTION G — PRIORITY RANKING FOR REMEDIATION

| Priority | Gap | Fix | Effort |
|---|---|---|---|
| P1 | `verify-hooks-functional.sh` is a STUB | Build a real version that distinguishes STUB/ADVISORY/PRODUCTION | 1 hour |
| P1 | `post-stop-banned-phrase.sh` is STUB | Implement: scan response for "see above"/"paste from earlier"/other banned phrases | 30 min |
| P1 | `pre-tool-use-rzf-evidence-gate.sh` is STUB | Implement: check if response contains ZF evidence before significant tool calls | 45 min |
| P2 | Governor prompts not logged | `user-prompt-submit-governor-prompts.sh` — append to governor-prompts/S<NNN>.md | 20 min |
| P2 | `validate-page-completeness.mjs` missing | T2: block `status: complete` without `verified_by: governor` | 30 min |
| P2 | `post-stop-pcr-check.sh` is STUB | Check if response has a multi-option decision without PCR blocks | 30 min |
| P3 | Week-4 never triggered | Define week-4 criteria, run `audit_runner_full_pass` | 2 hours |
| P3 | B_DONE_RIGHT_FROM_THE_START 2/5 | Add AGENTS.md NO + T1 hook + T2 validator | 45 min |
| P3 | DNA paths Windows-only | Change local-scope paths from absolute to `~/.claude/` or `$HOME/.claude/` | 10 min |
| P4 | 30+ advisory validators | Upgrade key ones to BLOCKING in strict mode | 3 hours |
| P4 | `@csps-dna` block coverage = 0 | Build S041 inheritance tools (validate-dna-block.mjs, pre-tool-use-dna-block-check.sh) | Full S041 |

---

## SECTION H — RECOMMENDED SONNET DIRECTIVE

**DO NOT paste this to Sonnet until Governor signals.**

When ready, paste this context block to Sonnet for P1+P2 remediation (S041 Sprint 1):

```
[PROTOCOL: PROTO-021 | STEP: 1 of 5 | MODE: sequential]

YOU ARE: Sonnet, the builder in Claude Code VS Code tab.
I AM: Yariv Fink (Governor). Opus has completed a deep-dive audit.
THIS IS THE SITUATION: CSPS S041. 11 of 22 hooks are STUBS — the platform has been
  reporting "all hooks functional" since S037 but this report itself was a STUB.
  verify exit_code=0 but governance enforcement is largely theatrical.
YOUR TASK: Fix the P1 gaps in this priority order. Report commit SHA after each step.

STEP 1 — Fix verify-hooks-functional.sh (Meta-failure):
Read .claude/hooks/verify-hooks-functional.sh.
Replace with a real implementation that:
  - Reads the hooks directory
  - For each hook file: checks if it contains "STUB" in any comment OR if it only has "exit 0" without real logic
  - Classifies each as STUB | ADVISORY | PRODUCTION
  - Reports: stub_count, advisory_count, production_count
  - If stub_count > threshold (currently anything > 5): output WARNING
  - Still exits 0 (advisory) — exact behavior unchanged for CI

STEP 2 — Implement post-stop-banned-phrase.sh:
Read .claude/hooks/post-stop-banned-phrase.sh (currently STUB).
Replace with real implementation:
  - Reads last response text from CLAUDE_LAST_RESPONSE (if available) or STDOUT
  - Checks for banned phrases: "see above", "paste from earlier", "from my prior response",
    "as before", "I mentioned earlier", "as I said", "refer to the previous"
  - If found: outputs [VIOLATION: B_ZERO_NAVIGATION_FOR_GOVERNOR] + the offending phrase
  - Exits 0 (advisory) — does not block but makes violation visible
  - Note: if CLAUDE_LAST_RESPONSE is not available in this hook event, output a comment
    explaining the limitation and exit 0

STEP 3 — Implement user-prompt-submit-governor-prompts.sh:
Read .claude/hooks/user-prompt-submit-governor-prompts.sh (currently STUB).
Replace with real implementation:
  - Reads CLAUDE_USER_PROMPT (the incoming prompt text)
  - Extracts session from tools/session-state.json (current_session field)
  - Appends timestamp + first 200 chars of prompt to:
    _handoff/VAULT/governor-prompts/S<NNN>.md
  - Creates the file if it doesn't exist (with proper frontmatter)
  - Exits 0

STEP 4 — Fix DNA registry Windows paths:
Read tools/config/dna-registry.yaml.
Replace all absolute Windows paths (C:\Users\finky\.claude\) with:
  - scope: local, path: ~/.claude/core/L1-vocabulary.md  (use tilde, cross-platform)
This makes the registry work on Codespaces and any non-Windows environment.

STEP 5 — Add AGENTS.md hard NO for B_DONE_RIGHT_FROM_THE_START:
Under "Governance + workflow" in AGENTS.md, add:
  ❌ Never declare DONE on a commit alone — DONE = pnpm verify exit_code=0 + next build passes
     + WIRED in validate-wiring-completeness.mjs + manual test confirms behavior.
     (B_DONE_RIGHT_FROM_THE_START — 2/5 surfaces → upgrading to 3/5)

VERIFY: node tools/verify.mjs → exit_code=0
COMMIT: "fix: P1 gaps — hooks stub → real, DNA paths cross-platform, DONE criterion hard NO"
REPORT: commit SHA + hook classification summary from new verify-hooks-functional.sh
```

---

*Opus audit completed 2026-05-18 | S040 | For Sonnet S041 Sprint 1*
*Governor: read Section G priority table. Approve P1 items before pasting Section H to Sonnet.*
