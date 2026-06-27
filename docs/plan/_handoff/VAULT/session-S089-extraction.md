---
id: csps.handoff.vault.session-s089-extraction
name: session-S089-extraction
description: >
  High-value harvest of session S089 — UX/UI Principles page (5 UX-DNA laws + 6 UI principles),
  B_ONECLICK_FRESHNESS, B_MODEL_DECLARATION, IZFC self-audit (3 bugs fixed), threshold-system
  IZFC (5 findings → PARK-S089-THRESHOLD-INLINE-GATE), and 3 governance parks. HARVEST_READY.
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
session: S089
authored_by: Sonnet S089
extracted_at: 2026-06-27
head: 65b51cac
---

# S089 Session Extraction

session: S089
extracted_at: 2026-06-27
head: 65b51cac
verify: exit_code=0 blocking=0

---

## BUILDS COMPLETED

### SROF-S089-003 — UX/UI Principles Page
- URL: https://csps-playground.vercel.app/platform/ux-ui-principles
- 5 UX-DNA laws (B_UX_UI_DISCIPLINE) + 6 UI principles (design-v2 §5)
- pageDNA, M-47, Decision Ledger, nav-registered, route-manifest registered
- SEAL: Sonnet delivered. Opus counter-sign PENDING.

### B_ONECLICK_FRESHNESS — Session Resume Permanence (G5 fix)
- Problem: Oneclick written in chat → compacted → reconstructed manually every session
- Solution: tools/generate-oneclick.mjs writes .csps/oneclick.md from git state
- Wired: verify.mjs auto-regenerates post-clean-pass
- Injected: session-open-context.mjs reads file → additionalContext JSON (not stderr)
- Validated: validate-oneclick-freshness.mjs BLOCKING if missing, ADVISORY if stale
- Excluded from tree_hash: tools/config/treehash-exclude.txt

### B_MODEL_DECLARATION — First-Response Model Gate
- Problem: Governor had no reliable way to know active model without opening selector
- Solution: session-open-context.mjs reads .claude/settings.json → injects model card
  at TOP of additionalContext. Claude's first response = model self-declaration only.
- Options injected: confirmed | use opus (→ /model → new tab) | use haiku (sub-agent only)
- Architecture doc: .csps/session-startup-architecture.md

---

## BUGS FOUND + FIXED (IZFC self-audit)

1. blocking=? — generate-oneclick.mjs read r.blocking_count (key doesn't exist in receipt).
   Fix: derive from exit_code (0 → blocking=0). Commit ea617e89.

2. "Paste this into a new tab" — session-open.sh line 238 kept the forbidden instruction
   after Governor explicitly called it out. Survived 3 commits. Fixed ea617e89.

3. validate-universal-alignment.mjs — reads YAML exemptions file but ALSO needs hardcoded
   filter. Both required: frontmatter-exempt-paths.yaml + inline filter in validator code.

4. ONECLICK stderr injection — session-open.sh block wrapped in } 2>/dev/null — all output
   swallowed. Claude never saw it. Fix: inject via session-open-context.mjs stdout JSON.

5. Role-specific text in oneclick block — "SONNET ROLE: builder" would confuse Opus reading
   same hook context. Fix: replaced with role table (Sonnet/Opus/Haiku all defined).

---

## AUDITS CONDUCTED

### Session Startup Architecture IZFC
6 angles swept. 3 real bugs found (above). 2 non-issues documented.
Architecture doc: .csps/session-startup-architecture.md

### Threshold System IZFC
6 angles swept. 5 findings:
1. Root cause: threshold-router.mjs L227 governor_directive → PROCESS-NOW unconditionally
2. mandateRelation computed (L191-193) but NEVER consulted before governor_directive branch
3. Threshold is a CLASSIFIER not a GATE. PROCESS-NOW = exit 0. No blocking.
4. Validators test technical function not routing correctness. Gap is un-validatable by machine.
5. QUEUE-OR-PIVOT route does not exist in the router enum.
Full findings: tools/data/park-register.yaml → PARK-S089-THRESHOLD-INLINE-GATE

---

## STRUCTURAL INSIGHTS

### IZFC Pattern Diagnosis
- CSPS has IZFC at verification time (269 validators sweep many angles)
- CSPS does NOT have IZFC at build time (build → break → fix → break → fix)
- Every reactive fix = new commit = HEAD change = stale oneclick = next verify advisory
- "One fix creates more to fix" is structural: narrow-scope fixes without downstream enumeration
- Missing: B_PRE_BUILD_IZFC — enumerate all downstream files before first write

### Threshold Architecture Gap
- Threshold runs on every UserPromptSubmit ✓
- Threshold is a classifier: classify → CIE write → log write → PROCESS-NOW → exit 0
- Governor directive type = unconditional PROCESS-NOW (no mandate check)
- mandateRelation is computed but never gated for governor_directive class
- Missing route: QUEUE-OR-PIVOT

### Relay Drift Root Cause
- Drift: presenting PROTO blocks in chat without writing tools/council/sonnet-turn.md
- Hook (post-tool-use-sonnet-relay-inline.sh) only fires on PostToolUse from Write/Edit tool
- No file write = no hook = no enforcement = informal relay (chat-only = ephemeral)
- Fix: always Write sonnet-turn.md → hook fires → present inline. Structural.

### Session Startup Architecture (5 layers)
1. generate-oneclick.mjs — post-verify write to .csps/oneclick.md
2. validate-oneclick-freshness.mjs — BLOCKING if missing
3. session-open-context.mjs — reads file, injects into additionalContext JSON
4. session-open.sh — SessionStart hook, calls context script
5. B_MODEL_DECLARATION gate — first response = model card, await confirmation

### Model/Tab Inheritance
- Sonnet 1M default: locked in .claude/settings.json ("model": "claude-sonnet-4-6[1m]")
- No /model needed per tab — settings persist
- Opus tab: Governor types /model → switches → opens new tab → same hook fires
- Haiku: sub-agent ONLY via Agent tool. Never a UI tab. Hook does NOT fire for sub-agents.
- Context to sub-agents: via spawn prompt, not SessionStart hook.

---

## PARKS REGISTERED (S089)

New this session:
- PARK-S089-THRESHOLD-INLINE-GATE: QUEUE-OR-PIVOT route + mandate check in router (4 Opus questions)
- PARK-S089-AUTO-COUNCIL-CYCLE: Sonnet spawns Opus sub-agent via Agent tool (no Governor relay)
- PARK-S089-PRE-BUILD-IZFC: 5-question pre-flight before Sonnet writes files

Pre-existing S089 parks (10 others): see tools/data/park-register.yaml

---

## PENDING (next session start)

1. SROF-S089-003: Opus counter-sign (WebFetch + verify + format)
2. PARK-S089-THRESHOLD-INLINE-GATE: Opus PCR on 4 questions
3. S3+ UX/UI build sequence (PE-ranked):
   - platform/developer-journey
   - platform/zero-friction
   - platform/design-intelligence
   - platform/simulation (gated on VLT-S022-ZENSTACK)
4. VLT-S022-ZENSTACK-GENERATE-PATH: pre-existing blocking decision

---

## RELAY FORMAT DISCIPLINE (permanent rule)

Every substantive Opus-facing communication:
1. Write tools/council/sonnet-turn.md via Write/Edit tool (not Bash)
2. Hook fires (post-tool-use-sonnet-relay-inline.sh)
3. Present full content inline as fenced block with "Paste-ready block for Opus:" header
4. Governor one-click pastes to Opus tab

Verify hook fired: node -e "const s=require('fs').statSync('.csps/last-sonnet-relay.txt');console.log('FRESH:',s.mtimeMs>Date.now()-60000);"
