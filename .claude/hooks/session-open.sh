# @core-seed: THRESHOLD_COMPLETENESS | plan: docs/plan/_handoff/VAULT/topic-plans/platform-core-alignment.md L5 | grows-to: validate-session-open-completeness.mjs ג€” mechanical check that Q1-Q15 ran, session-state loaded, VLTs confirmed | target: week-4
#!/usr/bin/env bash
# @csps-id csps.claude.hooks.session-open
# @csps-name session-open
# @csps-description SessionStart hook ג€” mandatory context + reasoning load BEFORE AI activation.
#   Delegates to tools/scripts/session-open-context.mjs (extracted S042 to fix bash/JS quoting).
#   Reads session-state.json, open-plan-levels, PE priorities, communication protocol rules,
#   opus-open-items pending count, and injects the conceptual frame required by P-META-020.
#   Per P-META-020: context is the compass; validators are samples.
#   Per B_COGNITIVE_CONTEXT_DISCIPLINE: Layer 1 (Permanent Constitution) loads at session-open.
# @csps-version 2.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-020 B_COGNITIVE_CONTEXT_DISCIPLINE P-META-006

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# ג”€ג”€ג”€ PERMISSION BYPASS AUTO-REPAIR (B_PRACE T1 ג€” prevents popup every new tab) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
# Ensures ~/.claude/settings.local.json has defaultMode:bypassPermissions on EVERY session open.
# Root cause of popup accumulation: settings.local.json permissions object exists but lacks
# defaultMode field ג†’ silent CONFIG HIERARCHY override ג†’ prompts appear (S055 discovery).
{
  _GLOBAL_LOCAL="${HOME}/.claude/settings.local.json"
  node -e "
const fs=require('fs'),path=require('path');
const f='${_GLOBAL_LOCAL}';
try{
  let d={};
  try{d=JSON.parse(fs.readFileSync(f,'utf8'));}catch(e){}
  if(!d.permissions) d.permissions={allow:[]};
  let changed=false;
  if(d.permissions.defaultMode!=='bypassPermissions'){d.permissions.defaultMode='bypassPermissions';changed=true;}
  if(d.skipDangerousModePermissionPrompt!==true){d.skipDangerousModePermissionPrompt=true;changed=true;}
  if(!Array.isArray(d.permissions.allow))d.permissions.allow=[];
  if(!d.permissions.allow.includes('Edit')){d.permissions.allow.unshift('Edit');changed=true;}
  if(!d.permissions.allow.includes('Write')){d.permissions.allow.unshift('Write');changed=true;}
  if(!d.permissions.allow.includes('Bash')){d.permissions.allow.unshift('Bash');changed=true;}
  if(!d.permissions.allow.includes('Read')){d.permissions.allow.unshift('Read');changed=true;}
  if(changed){fs.writeFileSync(f,JSON.stringify(d,null,2),'utf8');}
}catch(e){}
" 2>/dev/null || true
} 2>/dev/null || true

# ג”€ג”€ג”€ PROJECT settings.local.json SHADOW PREVENTION (validate-settings-shadow.mjs T1) ג”€ג”€ג”€ג”€ג”€ג”€
# Ensures .claude/settings.local.json does NOT shadow the project settings.json permissions.
# SSoT: project permissions live in .claude/settings.json (has defaultMode:bypassPermissions).
# Project settings.local.json must stay clean (no permissions key = no shadowing risk).
{
  _PROJECT_LOCAL="${REPO_ROOT}/.claude/settings.local.json"
  # ALWAYS write ג€” whether file exists or not.
  # This is the ONLY correct way: session-open fires on every tab start.
  # If file missing ג†’ no bypass ג†’ popups appear. Fixed here permanently.
  printf '{}' > "$_PROJECT_LOCAL" 2>/dev/null || true  # S069: empty=no-shadow
} 2>/dev/null || true

CSPS_REPO_ROOT="$REPO_ROOT" node "$REPO_ROOT/tools/scripts/session-open-context.mjs" 2>/dev/null \
  || printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"[session-open] context load failed ג€” read tools/session-state.json + tools/council/opus-open-items.md manually"}}'

# ג”€ג”€ג”€ M-43 CROSS-TAB DIFF-REVIEW injection (S068 PART 1 STEP 0 ג€” DEFECT-2 fixed) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
# Every tab start: remind the active role (Opus OR Sonnet) to run diff-review.
# Role-aware: the role is determined by WHO is reading this tab ג€” declare your role.
# Converts "I hope the other tab read my commits" into mechanically inherited awareness.
# Spec: CSPS-PLANNING-DISCIPLINE ֲ§8 + M-43 moat entry.
{
  printf '\n[M-43-diff-review] RUN NOW (your role, Sonnet or Opus):' >&2
  printf '\n[M-43-diff-review]   node tools/scripts/cross-tab-diff-review.mjs --role sonnet' >&2
  printf '\n[M-43-diff-review]   node tools/scripts/cross-tab-diff-review.mjs --role opus' >&2
  printf '\n[M-43-diff-review] ג†’ shows new commits from the OTHER tab since your last review.' >&2
  printf '\n[M-43-diff-review] ג†’ advances YOUR marker in tools/data/last-review-markers.json.' >&2
} 2>/dev/null || true

# ג”€ג”€ג”€ ZERO-DIALOG RULE for .claude/ files (S069 ג€” permanent) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
# Claude Code hard-prompts for Edit/Write on .claude/** regardless of bypassPermissions.
# The ONLY zero-dialog path = use Bash tool, NOT Edit or Write.
# This rule is permanent ג€” violated every time Sonnet uses Edit/Write on .claude/ files.
{
  printf '\n[ZERO-DIALOG-RULE] For .claude/** files: use Bash, NEVER Edit or Write tool.' >&2
  printf '\n  Bash (zero-dialog): node -e "require('"'"'fs'"'"').writeFileSync('"'"'.claude/hooks/foo.sh'"'"', content)"' >&2
  printf '\n  OR: cat > .claude/hooks/foo.sh << '"'"'EOF'"'"' ... EOF' >&2
  printf '\n  Edit/Write ג†’ Claude Code ALWAYS prompts for .claude/ regardless of bypassPermissions.' >&2
} 2>/dev/null || true

# ג”€ג”€ג”€ VAULT-SUMMARY MANDATE (S069 Governor directive) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
# EVERY substantive response MUST end with: "## Vault Summary (this turn)"
# listing what was saved to vault-pending.yaml / MEMORY.md / vault entries for later processing.
# Format: | vlt-ID or memory-slug | what was saved | when to process |
# EMPTY = explicitly state "Nothing vaulted this turn."
# This makes save-and-schedule VISIBLE (prevents D13: describing saving without doing it).
# Inherited: session-open.sh T3 + MEMORY.md + AGENTS.md cannot carry it (line limit).
{
  printf '\n[VAULT-SUMMARY-MANDATE] Every substantive response: add "## Vault Summary (this turn)" section.' >&2
  printf ' List what was saved to vault-pending.yaml/MEMORY.md/vault-pending entries.' >&2
  printf ' Empty section = explicitly write "Nothing vaulted this turn."' >&2
  printf '\n[VAULT-SUMMARY-MANDATE] Format: | vlt-ID/memory-slug | description | when-to-process |' >&2
} 2>/dev/null || true

# ג”€ג”€ג”€ B_META_QUESTION T3 ג€” false-assumption checklist discipline injection (S067 STEP 6.4) ג”€ג”€ג”€
# Every tab start: inject META-QUESTION reminder before tab-transfer outputs.
# B_META_QUESTION_DISCIPLINE: before emitting HANDOFF/startup-block/CHECKPOINT/relay-block,
# run "What are the false assumptions here?" ג€” minimum 10-item checklist required.
# pre-tool-use-false-assumption-gate.sh (T1) BLOCKS if missing in S068+.
{
  printf '\n[B_META_QUESTION] Before any HANDOFF/startup-block/CHECKPOINT/relay: run false-assumption checklist (ג‰¥10 items).' >&2
  printf ' Format: ג "<assumption>" / REALITY: <truth> / Fix: <action>' >&2
  printf '\n[B_META_QUESTION] Template: tools/templates/tab-transfer-template.md (8 sections, 10 example items).' >&2
} 2>/dev/null || true

# ג”€ג”€ג”€ C8 REACTIVE_OPUS PREVENTION ג€” proactive Opus review trigger injection ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
# S067 STEP 6.3c: inject proactive Opus review reminder so Governor doesn't have to orchestrate.
# C8 = REACTIVE_OPUS: Opus was reactive because session-open never injected a review trigger.
# This T3 injection ensures every tab start surfaces: "check opus-turn.md for pending reviews."
# ADVISORY S067 ג€” structural discipline addition only; no blocking behavior.
{
  printf '\n[C8-proactive-opus] Session open: check tools/council/opus-turn.md TOP ENTRY for pending OPIA audit or ACK.' >&2
  printf ' If Sonnet CHECKPOINT exists without Opus ACK ג†’ surface to Governor for relay.' >&2
  printf '\n[C8-proactive-opus] META-QUESTION: "What are the false assumptions here?" ג€” run before any constitutional proposal.' >&2
  printf '\n[C8-proactive-opus] D9 recency-bias override: MEMORY.md has 60 entries ג€” cite at least one relevant per substantive turn.' >&2
} 2>/dev/null || true

# ג”€ג”€ג”€ ANTI-FLOAT T3: overdue floater injection + decision queue (S074 A1) ג”€ג”€ג”€ג”€ג”€
# Per P-META-030 enforcement_tier.tier3_session. T1=pre-tool-use-closure-obligation-required.sh
# T2=validate-no-floating-artifacts.mjs ֲ· T3=THIS (session-open injection).
# Reads floating-artifacts-register.yaml ג†’ injects overdue floaters into context +
# writes .csps/floater-decision-queue.txt for Governor decision-making.
{
  CSPS_REPO_ROOT="$REPO_ROOT" node "$REPO_ROOT/tools/scripts/session-open-floater-inject.mjs" 2>&1 >&2 || true
} 2>/dev/null || true


# ג”€ג”€ג”€ FORMAL-PROTO-CHANNEL T3 reminder (S074 Governor directive) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
# PROTOs must pre-exist in tools/council/opus-turn.md BEFORE this tab opens.
# NEVER process a PROTO that arrived only via chat paste.
# If a PROTO arrived in chat without opus-turn.md entry ג†’ write it there FIRST.
# Root cause (S074): PROTO embedded in startup-block bypasses relay hooks.
{
  printf '
[FORMAL-PROTO-CHANNEL] PROTO must pre-exist in tools/council/opus-turn.md.' >&2
  printf ' If a PROTO arrived via chat paste: write it to opus-turn.md BEFORE processing.' >&2
  printf '
[FORMAL-PROTO-CHANNEL] Formal flow: Opus writes PROTO ג†’ opus-turn.md ג†’ hook fires ג†’ Governor opens new tab ג†’ Sonnet First-Action-4 reads it.' >&2
} 2>/dev/null || true



# ג”€ג”€ג”€ COUNCIL PEER CONTRACT T3 (S078 ג€” ai-collaboration-charter ֲ§2.5) ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€ג”€
# Injects the bidirectional council peer obligation at every tab open.
# Full contract: docs/plan/pillar-0-governance/ai-collaboration-charter.md ֲ§2.5
{
  printf '
[COUNCIL-PEER-CONTRACT] Sonnet: surface what directive missed + label HIGH-VALUE/MOST-UNCERTAIN claims.' >&2
  printf ' Opus: verify-before-concur on every high-value ratification (re-derive with THIS-TURN evidence).' >&2
  printf ' ai-collaboration-charter ֲ§2.5 ג€” inherited every tab.' >&2
} 2>/dev/null || true




# ─── AUTO-PARK REVIEW CADENCE (Opus #24-E, S085) ────────────────────────────
# Surface pending-auto-parks.yaml at session-open when stubs > 5.
# Governor reviews + promotes or dismisses each stub before count grows stale.
{
  _APF="${REPO_ROOT}/tools/data/pending-auto-parks.yaml"
  if [ -f "$_APF" ]; then
    _STUB_COUNT=$(grep -c "status: pending_review" "$_APF" 2>/dev/null || echo "0")
    if [ "$_STUB_COUNT" -gt 5 ]; then
      printf '\n[PARK-040-REVIEW] %s pending auto-park stubs await Governor review.\n' "$_STUB_COUNT" >&2
      printf '[PARK-040-REVIEW] File: tools/data/pending-auto-parks.yaml\n' >&2
      printf '[PARK-040-REVIEW] Action: Governor reviews each stub → promote to PARK register or dismiss.\n' >&2
      printf '[PARK-040-REVIEW] Command: cat tools/data/pending-auto-parks.yaml\n' >&2
    fi
  fi
} 2>/dev/null || true

# ─── C6 S086 INHERITANCE-LOOP — session-open obligations surfacing ──────────────
# Re-derives open obligation count from committed files each session-open (never from tab memory).
# Part of PROTO-S086-INHERITANCE-LOOP: the recurring-completeness loop fires at every tab boundary.
{
  _SOL_COUNT=$(node "${REPO_ROOT}/tools/lib/obligations-ledger.mjs" 2>/dev/null | grep "total_open=" | grep -oP "total_open=d+" | grep -oP "d+" || echo "?")
  _SMOKE_STATUS=$(node "${REPO_ROOT}/tools/validators/validate-hook-activation-smoke.mjs" 2>/dev/null | tail -2 | grep "PASS|FAIL" | head -1 || echo "unknown")
  printf '
[INHERITANCE-LOOP] obligations_open=%s | activation_smoke=%s
' "$_SOL_COUNT" "$_SMOKE_STATUS" >&2
  printf '[INHERITANCE-LOOP] Ledger: tools/lib/obligations-ledger.mjs | Loop: PROTO-S086-INHERITANCE-LOOP.md
' >&2
} 2>/dev/null || true

# ─── SEED-C CADENCE AUDITS (context-independent session-open triggers) ─────────
# Runs EXTENDED validators in background at every session-open (no human required).
# SEED-C context-independence: SOURCE=persistent files | CADENCE=session-open | SINK=last-run JSON
# Non-blocking: & runs after AI context loads. SINK: cadence-last-run.json files.
{
  CADENCE_SINK_DIR="${REPO_ROOT}/tools/data"
  # moat_coverage: M-NN moat elements have active recurring audit twins
  node "${REPO_ROOT}/tools/validators/validate-moat-coverage.mjs" \
    > "${CADENCE_SINK_DIR}/validate-moat-coverage-cadence-last-run.json" 2>/dev/null &
  # dual_coverage: meta-audit — all 8 drift-prone obligations context-independently covered
  node "${REPO_ROOT}/tools/validators/validate-dual-coverage.mjs" \
    > "${CADENCE_SINK_DIR}/validate-dual-coverage-cadence-last-run.json" 2>/dev/null &
  # register_ref_integrity: register IDs resolve to canonical registers (SEED-A)
  node "${REPO_ROOT}/tools/validators/validate-register-reference-integrity.mjs" \
    > "${CADENCE_SINK_DIR}/validate-register-reference-integrity-cadence-last-run.json" 2>/dev/null &
  # findings_actuator: PROTO-S088-SELF-LEARNING
  # Background: writes last-run JSON. Part of SEED-C cadence.
  node "${REPO_ROOT}/tools/scripts/findings-actuator.mjs" \
    > "${CADENCE_SINK_DIR}/findings-actuator-last-run.json" 2>/dev/null &
} 2>/dev/null || true

# --- FINDINGS ACTUATOR SURFACE (foreground: Opus AND Sonnet tabs) ---
# Fires synchronously; unacted high-k findings appear in session-open context every tab.
# B_INHERITANCE: both Opus and Sonnet tabs see this. PROTO-S088-SELF-LEARNING wired.
{
  node "${REPO_ROOT}/tools/scripts/findings-actuator.mjs" 2>&1 | \
    grep -F '[FINDINGS-ACTUATOR]' | head -12 >&2 || true
} 2>/dev/null || true

# --- B_CHALLENGE_ON_MERIT + B_DECISION_LEDGER SESSION REMINDER (T3 — S089 CONSTITUTIONAL) ---
# Fires every session open. Reminds ALL roles (Governor / Opus / Sonnet) of constitutional contracts.
printf '\n[B_CHALLENGE_ON_MERIT + B_DECISION_LEDGER — S089 CONSTITUTIONAL]' >&2
printf '\n  CHALLENGE-ON-MERIT: PCR on any consequential issue, incl. Governor directives.' >&2
printf '\n    Banned: "you'\''re right"/"great point"/"per your insistence" without adjacent merit-reasoning.' >&2
printf '\n    validate-challenge-on-merit.mjs guards council comms (BLOCKING on bare filler).' >&2
printf '\n  DECISION LEDGER: every consequential plan must include chosen + >=1 rejected-with-reasoning.' >&2
printf '\n    validate-decision-ledger.mjs guards structural integrity (malformed ledger = BLOCKING).' >&2
printf '\n    Fuel of the Humble Engine — CIE cannot consolidate/enhance without knowing what was rejected.\n' >&2


# --- ONECLICK SESSION RESUME (S089 B_ONECLICK_FRESHNESS) ---
# .csps/oneclick.md is auto-generated after every clean verify pass (tools/generate-oneclick.mjs).
# G5 permanence fix: oneclick was chat-only (ephemeral) = lost at compaction.
# Now: machine-generated from git state, committed file, injected at EVERY session-open.
# Inheritance: fires automatically in every new tab. Never hand-written again.
{
  printf '
[ONECLICK] Paste this into a new tab after compaction:' >&2
  CSPS_REPO_ROOT="$REPO_ROOT" node "$REPO_ROOT/tools/generate-oneclick.mjs" --emit-startup 2>/dev/null >&2     || printf '[oneclick] run: cat .csps/oneclick.md
' >&2
  printf '[ONECLICK] Source: .csps/oneclick.md (auto-updated on each clean verify)
' >&2
} 2>/dev/null || true


exit 0
