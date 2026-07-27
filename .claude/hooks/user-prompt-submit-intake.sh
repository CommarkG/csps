#!/usr/bin/env bash
# UserPromptSubmit hook — intake gate + session-state surfacing
# Per B_INTAKE_DISCIPLINE + session-state mechanical seed (S011)
set -euo pipefail

CAPTURE_LOG="${CSPS_CHAT_INTAKE_LOG:-${HOME}/.claude/chat-intake-capture.jsonl}"
USER_MESSAGE="$("$REPO_ROOT/tools/lib/hook-read-prompt.sh")"
MSG_LEN="${#USER_MESSAGE}"
TIMESTAMP="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

mkdir -p "$(dirname "$CAPTURE_LOG")" 2>/dev/null || true

TRIGGER_DETECTED=false
TRIGGER_REASONS=()

if echo "$USER_MESSAGE" | grep -Eqi '(uploaded|attached|see (the|attached) file|treasure|paste below)'; then
  TRIGGER_DETECTED=true; TRIGGER_REASONS+=("upload_or_paste_mention")
fi
if echo "$USER_MESSAGE" | grep -Eq 'https?://'; then
  TRIGGER_DETECTED=true; TRIGGER_REASONS+=("url_paste")
fi
if [ "$MSG_LEN" -gt 2000 ]; then
  TRIGGER_DETECTED=true; TRIGGER_REASONS+=("long_content")
fi

echo "{\"timestamp\":\"$TIMESTAMP\",\"msg_len\":$MSG_LEN,\"trigger\":$TRIGGER_DETECTED}" >> "$CAPTURE_LOG" 2>/dev/null || true

if [ "$TRIGGER_DETECTED" = "true" ]; then
  echo "[user-prompt-intake] Pattern detected: ${TRIGGER_REASONS[*]:-none}"
  echo "[user-prompt-intake] AGENTS.md hard NO: run docs/plan/_intake/manual-protocol.md"
else
  echo "[user-prompt-intake] No upload/paste/treasure pattern detected. Standard chat."
fi

# ─── SESSION STATE SURFACING — mechanical seed across sessions ──────────────
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STATE_FILE="${REPO_ROOT}/tools/session-state.json"

# MANDATE_ACTIVE: threshold-router QUEUE-OR-PIVOT input signal (CIC-auditor fix).
# Presence-only check (a live session_mandate.primary exists) — NOT a freshness check.
# Freshness (session_mandate text may be stale vs current_session) is a data-quality
# call for Governor/Opus, out of scope here. Always defined before use (set -u safe).
MANDATE_ACTIVE="false"

if [ -f "$STATE_FILE" ]; then
  # Extract key info using grep (no python/node dependency)
  SESSION=$(grep -o '"current_session": "[^"]*"' "$STATE_FILE" | grep -o '"[^"]*"$' | tr -d '"' 2>/dev/null || echo "?")
  MANDATE=$(grep -o '"primary": "[^"]*"' "$STATE_FILE" | head -1 | grep -o '"[^"]*"$' | tr -d '"' 2>/dev/null || echo "")
  [ -n "$MANDATE" ] && MANDATE_ACTIVE="true"
  # Only show UNRESOLVED blocking decisions (skip status:RESOLVED entries)
  BLOCK1=$(node -e "try{const d=JSON.parse(require('fs').readFileSync('$STATE_FILE','utf8'));const b=(d.blocking_decisions||[]).filter(x=>x.status!=='RESOLVED').map(x=>x.id);if(b.length)console.log(b.join(', '));}catch(e){}" 2>/dev/null || echo "")

  if [ -n "$MANDATE" ]; then
    echo "[session-state] ${SESSION}: ${MANDATE}"
    [ -n "$BLOCK1" ] && echo "[session-state] BLOCKING: ${BLOCK1} — read tools/session-state.json"
  fi
fi


# ─── THRESHOLD REAL CLASSIFIER — PROTO-THRESHOLD-1 (non-blocking) ────────────
# Calls threshold-classify.mjs (TypeScript library or fallback keyword rules).
# Outputs [threshold] type=... vault=... swift=... line for session context.
# NEVER blocks — wrapped in subshell with || true.
{
  if [ -n "$USER_MESSAGE" ] && [ "$MSG_LEN" -gt 10 ]; then
    _CLASSIFY_SESSION="${SESSION:-unknown}"
    CLASSIFICATION=$(node "${REPO_ROOT}/tools/scripts/threshold-classify.mjs" \
      "$USER_MESSAGE" "$_CLASSIFY_SESSION" 2>/dev/null || echo '{}')
    if [ -n "$CLASSIFICATION" ] && [ "$CLASSIFICATION" != '{}' ]; then
      TH_OUT=$(TH_JSON="$CLASSIFICATION" node -e "
try{
  const d=JSON.parse(process.env.TH_JSON||'{}');
  const parts=['type='+(d.type||'?')];
  if(d.vault_type) parts.push('vault='+d.vault_type);
  if(d.swift_eligible!==undefined) parts.push('swift='+d.swift_eligible);
  if(d.routing) parts.push('routing='+d.routing);
  process.stdout.write(parts.join(' '));
}catch(e){process.stdout.write('classified');}
" 2>/dev/null || echo 'classified')
      echo "[threshold] $TH_OUT"
    fi
  fi
} 2>/dev/null || true

# ─── THRESHOLD R1.4.1 — Intake classification + log append (non-blocking) ────
# Classifies every governor prompt and appends to tools/data/threshold-intake-log.yaml.
# Classification is pattern-based (Phase 1). First match wins. Non-blocking — never fails hook.
{
  _TR="${REPO_ROOT}/tools/config/threshold-classification-rules.yaml"
  _LOG="${REPO_ROOT}/tools/data/threshold-intake-log.yaml"

  if [ "${#USER_MESSAGE}" -gt 10 ] && [ -f "$_TR" ]; then # S086: gate on non-empty prompt
    # Type classification (first match wins)
    _TY="governor_directive"; _SP="GVRN"; _UR="medium"
    # HARDWIRE S088: external AI handbacks MUST be classified as external_research BEFORE
    # any other type. Pattern covers cross-project AI outputs (SONNET→OPUS handbacks from
    # other sessions/repos), HANDSHAKE files, DISPATCH artifacts, GATE VERDICT outputs.
    # FAILURE MODE PREVENTED: without this, handbacks fall through as governor_directive
    # → processed natively by AI → never routed through threshold → pipeline entry not created.
    # Applies to BOTH Sonnet tab AND Opus tab (same hook fires on both).
    if   echo "$USER_MESSAGE" | grep -Eqi 'SONNET[[:space:]]*[→>-][[:space:]]*OPUS|HANDBACK|GATE.VERDICT|_DISPATCH_|CSP S[0-9][0-9][0-9]|HANDSHAKE.*session|session.*HANDSHAKE'; then _TY="external_research"; _SP="AI"; _UR="medium"
    # Also catch documents pasted from external sources (GPT research, external reviews, product briefs)
    elif echo "$USER_MESSAGE" | grep -Eqi 'upload|paste|EXT-ID|external.research|external.review|briefing.*Â§A|park these files|GPT.Research'; then _TY="external_research"; _SP="AI"; _UR="low"
    elif echo "$USER_MESSAGE" | grep -Eq  'exit_code=1|BLOCKING'; then _TY="error"; _SP="VALD"; _UR="high"
    elif echo "$USER_MESSAGE" | grep -Eqi 'fixed|resolved|exit_code=0'; then _TY="solution"; _SP="VALD"; _UR="medium"
    elif echo "$USER_MESSAGE" | grep -Eqi 'correction|wrong|should be|instead of|not like that'; then _TY="correction"; _SP="AI"; _UR="medium"
    elif echo "$USER_MESSAGE" | grep -Eqi 'every session|pattern across|emerging'; then _TY="core_seed"; _SP="ARCH"; _UR="low"
    elif echo "$USER_MESSAGE" | grep -Eqi 'HANDOFF|session close|closing'; then _TY="session_harvest"; _SP="GVRN"; _UR="low"
    elif echo "$USER_MESSAGE" | grep -Fq '?'; then _TY="question"; _SP="GVRN"; _UR="low"
    fi

    # Scope classification (first match wins)
    _SC="S2"
    if   echo "$USER_MESSAGE" | grep -Eqi 'this specific|this instance|fix this'; then _SC="S1"
    elif echo "$USER_MESSAGE" | grep -Eqi 'structural|principle|always|constitutional|platform'; then _SC="S3"
    fi

    # Get session id — via session-source.mjs (PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 1)
    # Fixes F-NEW-17: replaces inline computation that silently fell back to "unknown"
    _SN=$(node "${REPO_ROOT}/tools/lib/session-source.mjs" 2>/dev/null || echo "S000")

    # --- 4-axis from threshold-router.mjs (P1a consumption loop) ---
    _WRAPPER2="${REPO_ROOT}/tools/scripts/route-input-wrapper.mjs"
    _4A_RAW='{}'
    if [ -f "$_WRAPPER2" ] && [ "${#USER_MESSAGE}" -gt 5 ]; then
      # CIC-auditor fix: forward the R1.4.1 classification (_TY/_SP/_UR) computed above +
      # MANDATE_ACTIVE, instead of letting route-input-wrapper.mjs silently re-default
      # to governor_directive/GVRN/medium + mandate_active=false every run (0/1489 QUEUE-OR-PIVOT).
      _4A_RAW=$(ROUTE_CONTENT="$(printf '%s' "$USER_MESSAGE" | head -c 200)" \
        ROUTE_SESSION="$_SN" \
        ROUTE_TYPE="$_TY" ROUTE_SPINE="$_SP" ROUTE_URGENCY="$_UR" \
        ROUTE_MANDATE_ACTIVE="$MANDATE_ACTIVE" \
        node "$_WRAPPER2" 2>/dev/null || echo '{}')
    fi
    THRESHOLD_SCOPE4=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write((j.axis_classification||{}).scope||'operational');}catch(e){process.stdout.write('operational');}" 2>/dev/null || echo 'operational')
    THRESHOLD_INTENT=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write((j.axis_classification||{}).intent||'directive');}catch(e){process.stdout.write('directive');}" 2>/dev/null || echo 'directive')
    THRESHOLD_MANDATE=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write((j.axis_classification||{}).mandate_relation||'in-mandate');}catch(e){process.stdout.write('in-mandate');}" 2>/dev/null || echo 'in-mandate')
    THRESHOLD_ROUTE=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write(j.route||'PROCESS-NOW');}catch(e){process.stdout.write('PROCESS-NOW');}" 2>/dev/null || echo 'PROCESS-NOW')
    # Sanitize preview: strip control chars and quotes
    _PV=$(printf '%s' "$USER_MESSAGE" | head -c 80 | tr -d '\001-\031\\')
    # S086 PREVIEW-FIX: write preview to temp file (avoids env-var quoting loss)
    _PV_FILE="${REPO_ROOT}/.csps/_preview_tmp.txt"
    printf '%s' "$USER_MESSAGE" > "$_PV_FILE" 2>/dev/null || true

    # Also write to .csps/threshold/intake-log.yaml (ThresholdIntakeRecord format)
    # This mirrors libs/threshold/intake.ts ThresholdIntakeRecord for INFRA-FLOW Step 1.
    {
      _CSPS_LOG="${REPO_ROOT}/.csps/threshold/intake-log.yaml"
      THRESHOLD_TYPE="$_TY" THRESHOLD_SPINE="$_SP" THRESHOLD_SCOPE="$_SC" \
      THRESHOLD_URGENCY="$_UR" THRESHOLD_SESSION="$_SN" THRESHOLD_PREVIEW_FILE="$_PV_FILE" \
      THRESHOLD_CSPS_LOG="$_CSPS_LOG" node -e "
const fs=require('fs'),p=require('path');
try{
  const ts=new Date().toISOString();
  const id='thr-'+process.env.THRESHOLD_SESSION+'-'+Date.now();
  const log=process.env.THRESHOLD_CSPS_LOG;
  fs.mkdirSync(p.dirname(log),{recursive:true});
  const entry=[
    '- id: '+JSON.stringify(id),
    '  session: '+JSON.stringify(process.env.THRESHOLD_SESSION||'unknown'),
    '  timestamp: '+JSON.stringify(ts),
    '  type: '+(process.env.THRESHOLD_TYPE||'governor_directive'),
    '  spine_tag: '+(process.env.THRESHOLD_SPINE||'GVRN'),
    '  scope_tag: '+(process.env.THRESHOLD_SCOPE||'S2'),
    '  urgency: '+(process.env.THRESHOLD_URGENCY||'medium'),
    '  source: governor_directive',
    '  status: processed',
    '  raw: '+JSON.stringify((process.env.THRESHOLD_PREVIEW_FILE&&require('fs').existsSync(process.env.THRESHOLD_PREVIEW_FILE)?require('fs').readFileSync(process.env.THRESHOLD_PREVIEW_FILE,'utf8').slice(0,120):'')),
    '  preview_file_used: '+(process.env.THRESHOLD_PREVIEW_FILE?'true':'false'),
  ].join('\n')+'\n';
  if(!fs.existsSync(log))fs.writeFileSync(log,'# Threshold intake log — ThresholdIntakeRecord format\n# Generated by libs/threshold/intake.ts via user-prompt-submit-intake.sh\nentries:\n');
  fs.appendFileSync(log,entry);
}catch(e){}
" 2>/dev/null || true
    } 2>/dev/null || true

    # Append to intake log via node (env-var passing avoids bash/node quoting issues)
    THRESHOLD_TYPE="$_TY" THRESHOLD_SPINE="$_SP" THRESHOLD_SCOPE="$_SC" \
    THRESHOLD_URGENCY="$_UR" THRESHOLD_SESSION="$_SN" THRESHOLD_PREVIEW_FILE="$_PV_FILE" \
    THRESHOLD_SCOPE4="${THRESHOLD_SCOPE4:-operational}"     THRESHOLD_INTENT="${THRESHOLD_INTENT:-directive}"     THRESHOLD_MANDATE="${THRESHOLD_MANDATE:-in-mandate}"     THRESHOLD_ROUTE="${THRESHOLD_ROUTE:-PROCESS-NOW}"     THRESHOLD_LOG="$_LOG" node -e "
const fs=require('fs'),p=require('path');
try{
  const ts=new Date().toISOString();
  const id='intake_'+ts.replace(/[:.]/g,'-');
  const log=process.env.THRESHOLD_LOG;
  fs.mkdirSync(p.dirname(log),{recursive:true});
  const lines=[
    '- id: '+JSON.stringify(id),
    '  timestamp: '+JSON.stringify(ts),
    '  session: '+JSON.stringify(process.env.THRESHOLD_SESSION||'unknown'),
    '  type: '+(process.env.THRESHOLD_TYPE||'governor_directive'),
    '  spine_tag: '+(process.env.THRESHOLD_SPINE||'GVRN'),
    '  scope_tag: '+(process.env.THRESHOLD_SCOPE||'S2'),
    '  urgency: '+(process.env.THRESHOLD_URGENCY||'medium'),
    '  status: processed',
    '  source: governor',
    '  routing_decision: '+(process.env.THRESHOLD_ROUTE||'PROCESS-NOW'),
    '  scope: '+(process.env.THRESHOLD_SCOPE4||'operational'),
    '  intent: '+(process.env.THRESHOLD_INTENT||'directive'),
    '  mandate_relation: '+(process.env.THRESHOLD_MANDATE||'in-mandate'),
    '  route: '+(process.env.THRESHOLD_ROUTE||'PROCESS-NOW'),
    '  input_preview: '+JSON.stringify((process.env.THRESHOLD_PREVIEW_FILE&&require('fs').existsSync(process.env.THRESHOLD_PREVIEW_FILE)?require('fs').readFileSync(process.env.THRESHOLD_PREVIEW_FILE,'utf8').slice(0,150):'')),
    '  preview_captured: '+(process.env.THRESHOLD_PREVIEW_FILE?'true':'false'),
  ].join('\n')+'\n';
  fs.appendFileSync(log,lines);
}catch(e){}
" 2>/dev/null || true
  fi
} 2>/dev/null || true


# ─── M6 S071 PART 2 — routeInput live wiring (the 4/532 fix) ─────────────────
# SACRED-EDIT-APPROVED: M6 PART 2 threshold wiring per PROTO-S068-PART-2-THRESHOLD-COMPLETE STEP 1
# ADD-not-REPLACE: all existing sections above (R1.4.1, session-state, classify) stay untouched.
# Wires routeInput() + selectPersonas() into every live input → council-invocation-log.yaml.
# Measures ≥ 95% routed (sample — tunable; baseline 4/532 ≈ 0.75% per honest root-cause).
{
  _WRAPPER="${REPO_ROOT}/tools/scripts/route-input-wrapper.mjs"
  _CIL="${REPO_ROOT}/tools/data/council-invocation-log.yaml"
  _SN_M6=$(node "${REPO_ROOT}/tools/lib/session-source.mjs" 2>/dev/null || echo "S000")

  # Call route-input-wrapper.mjs via env vars (avoids bash quoting issues with content)
  # CIC-auditor fix: forward real classification + MANDATE_ACTIVE (same signal as R1.4.1
  # section above) so this feed matches the same routing decision, not a re-defaulted one.
  if [ -f "$_WRAPPER" ] && [ -n "$USER_MESSAGE" ] && [ "${#USER_MESSAGE}" -gt 5 ]; then
    ROUTE_CONTENT=$(printf '%s' "$USER_MESSAGE" | head -c 200) \
    ROUTE_SESSION="$_SN_M6" \
    ROUTE_TYPE="${_TY:-governor_directive}" ROUTE_SPINE="${_SP:-GVRN}" ROUTE_URGENCY="${_UR:-medium}" \
    ROUTE_MANDATE_ACTIVE="${MANDATE_ACTIVE:-false}" \
    node "$_WRAPPER" 2>/dev/null | \
    ROUTE_SESSION="$_SN_M6" ROUTE_CIL="$_CIL" node -e "
let d='';
process.stdin.on('data',c=>d+=c);
process.stdin.on('end',()=>{
  const fs=require('fs'),p=require('path');
  try{
    const ts=new Date().toISOString();
    const j=JSON.parse(d||'{}');
    const log=process.env.ROUTE_CIL;
    fs.mkdirSync(p.dirname(log),{recursive:true});
    if(!fs.existsSync(log)){
      fs.writeFileSync(log,'# council-invocation-log.yaml (M6 S071 routeInput measurements)\n# Proves >=95% routed vs threshold-intake-log.yaml baseline 4/532=0.75%\nentries:\n');
    }
    const entry=[
      '- id: route-'+ts.replace(/[:.]/g,'-'),
      '  timestamp: '+JSON.stringify(ts),
      '  session: '+JSON.stringify(process.env.ROUTE_SESSION||'?'),
      '  route: '+JSON.stringify(j.route||'?'),
      '  rationale: '+JSON.stringify((j.rationale||'').slice(0,120)),
      '  spine: '+JSON.stringify(((j.axis_classification||{}).spine)||'?'),
      '  scope: '+JSON.stringify(((j.axis_classification||{}).scope)||'?'),
      '  personas: '+JSON.stringify((j.personas_matched||[]).join(',')||'none'),
    ].join('\n')+'\n';
    fs.appendFileSync(log,entry);
    process.stdout.write('[threshold-router] route='+j.route+' session='+process.env.ROUTE_SESSION+'\n');
  }catch(e){}
});
" 2>/dev/null || true
  fi
} 2>/dev/null || true


# ─── PHASE-0.2 CHAIN — PROTO-S088-PHASE-0.2 (classify→decompose→PE→route→CIE) ─
# SACRED-EDIT-APPROVED: Phase-0.2 enforced universal intake chain per Opus #25 directive.
# ADD-not-REPLACE: all existing sections above (R1.4.1 / classify / M6 route) stay untouched.
# Enforcement: EVERY input traverses classify→decompose→PE-significance→route→CIE-write.
# No input bypasses. CIE insight written per pass to .csps/intelligence/cie-chain-insights.yaml.
# Non-blocking: wrapped in || true — never blocks a Governor message.
{
  _CHAIN="${REPO_ROOT}/tools/scripts/threshold-chain.mjs"
  _SN_CHAIN=$(node "${REPO_ROOT}/tools/lib/session-source.mjs" 2>/dev/null || echo "S000")
  if [ -f "$_CHAIN" ] && [ -n "$USER_MESSAGE" ] && [ "${#USER_MESSAGE}" -gt 5 ]; then
    # CIC-auditor fix: forward the R1.4.1 classification (_TY/_SP/_UR) + MANDATE_ACTIVE
    # instead of discarding them — threshold-chain.mjs CLI previously always re-defaulted
    # to governor_directive/GVRN/medium/mandate_active=false (0/1489 QUEUE-OR-PIVOT).
    CHAIN_CONTENT="$(printf '%s' "$USER_MESSAGE" | head -c 300)" \
    CHAIN_SESSION="$_SN_CHAIN" \
    CHAIN_TYPE="${_TY:-governor_directive}" CHAIN_SPINE="${_SP:-GVRN}" CHAIN_URGENCY="${_UR:-medium}" \
    CHAIN_MANDATE_ACTIVE="${MANDATE_ACTIVE:-false}" \
    node "$_CHAIN" 2>/dev/null | node -e "
let d='';
process.stdin.on('data',c=>d+=c);
process.stdin.on('end',()=>{
  try{
    const j=JSON.parse(d||'{}');
    const layers=j.active_layers||0;
    const branches=j.branches||0;
    const band=j.pe_band||'?';
    const route=j.route||'?';
    const cie=j.cie_written?'cie-ok':'cie-err';
    process.stdout.write('[chain] type='+j.type+' layers='+layers+' branches='+branches+' pe='+band+' route='+route+' '+cie+'\n');
  }catch(e){}
});
" 2>/dev/null || true
  fi
} 2>/dev/null || true

# ─── HARDWIRE S088: external_research MANDATORY PIPELINE ENTRY ADVISORY ──────
# When external AI handbacks or research documents are detected (type=external_research),
# inject a mandatory advisory reminding Sonnet AND Opus to:
#   1. NOT process natively — route through external-research-pipeline.yaml
#   2. Create pipeline entry (P0 ingested) in tools/data/external-research-pipeline.yaml
#   3. Run SWIFT scan before responding substantively
# This is the T3 enforcement for the threshold hardwire of external AI content.
if [ "$_TY" = "external_research" ] && [ -n "$USER_MESSAGE" ]; then
  cat << 'EXTERNAL_RESEARCH_ADVISORY'
[THRESHOLD-HARDWIRE] TYPE=external_research DETECTED
  This input contains external AI content (handback/research/review/brief).
  MANDATORY PROCESSING PROTOCOL (B_BOUNDARY_CONTRACT + threshold hardwire S088):
  1. DO NOT process natively — park first, SWIFT-scan second, respond third.
  2. PARK the artifact: add entry to tools/data/external-research-pipeline.yaml (P0 ingested)
  3. SAVE the file to docs/plan/_intake/external-research/YYYY-MM-DD/ if it contains a document
  4. SWIFT-SCAN: identify items with value ≤ 2h + blast-radius ≤ LOW → absorb immediately
  5. PARK remaining work in park-register.yaml with governing_intent + retrieve_when
  6. Add council-harvest entry if the content contains insights (disposition required)
  7. Only after steps 1-6: respond to the Governor

  If this is a SONNET→OPUS handback from another project:
  - Source: cross-project AI output (QUARANTINE until spot-checked per CS9)
  - Route: external_research → VAULT_DEFER → threshold-classified
  - Action: park + SWIFT + pipeline entry (same as any external research)

  APPLIES TO: Sonnet tab AND Opus tab. No native processing of external AI content.
EXTERNAL_RESEARCH_ADVISORY
fi 2>/dev/null || true

exit 0
