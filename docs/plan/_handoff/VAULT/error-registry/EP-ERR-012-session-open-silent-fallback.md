---
name: EP-ERR-012
description: "Error pattern: session-open-silent-fallback — node -e with JS double quotes silently fails in bash, causing context injection to output fallback text instead of real governance context."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
id: EP-ERR-012
pattern_name: session-open-silent-fallback
first_observed: S042
recurrence_count: 1
trigger: Hook with embedded node -e where JS source contains double quotes
consolidation_cross_refs:
  - session-open.sh
  - session-open-context.mjs
  - validate-hook-lifecycle-state.mjs
---
# EP-ERR-012 — Session-Open Silent Fallback

Pattern: Hook with embedded `node -e "..."` in bash double-quoted context silently fails
when JavaScript source contains double quotes. Falls back to error message. The hook
exits 0, so nothing appears broken — but the AI receives fallback text, not context.

Root cause: `node -e "..."` with double quotes in JS closes the bash string prematurely.
The hook never errors visibly.

Impact: ALL CSPS session-open context injections from inception to S042 were potentially
partial. Context-dependent governance (open items, blocking decisions, mandate) may not
have loaded. This is a candidate root cause for persistent governance drift across sessions.

Fix (S042 commit 51f24cb): JS extracted to session-open-context.mjs — no bash quoting.

T1: validate-session-open-health.sh (OPEN-054 — to build) — verifies hook exits 0 AND outputs > 200 chars
T2: validate-hook-lifecycle-state.mjs (existing) — checks session-open.sh lifecycle_state=active
T3: session-open.sh now calls .mjs, testable in isolation: node tools/session-open-context.mjs
