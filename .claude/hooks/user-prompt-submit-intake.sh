#!/usr/bin/env bash
# UserPromptSubmit hook — intake gate + session-state surfacing
# Per B_INTAKE_DISCIPLINE + session-state mechanical seed (S011)
set -euo pipefail

CAPTURE_LOG="${CSPS_CHAT_INTAKE_LOG:-${HOME}/.claude/chat-intake-capture.jsonl}"
USER_MESSAGE="${CLAUDE_USER_PROMPT:-${1:-}}"
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

if [ -f "$STATE_FILE" ]; then
  # Extract key info using grep (no python/node dependency)
  SESSION=$(grep -o '"current_session": "[^"]*"' "$STATE_FILE" | grep -o '"[^"]*"$' | tr -d '"' 2>/dev/null || echo "?")
  MANDATE=$(grep -o '"primary": "[^"]*"' "$STATE_FILE" | head -1 | grep -o '"[^"]*"$' | tr -d '"' 2>/dev/null || echo "")
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

  if [ -f "$_TR" ]; then
    # Type classification (first match wins)
    _TY="governor_directive"; _SP="GVRN"; _UR="medium"
    if   echo "$USER_MESSAGE" | grep -Eqi 'upload|paste|EXT-ID|external.research'; then _TY="external_research"; _SP="AI"; _UR="low"
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
      _4A_RAW=$(ROUTE_CONTENT="$(printf '%s' "$USER_MESSAGE" | head -c 200)"         ROUTE_SESSION="$_SN"         node "$_WRAPPER2" 2>/dev/null || echo '{}')
    fi
    THRESHOLD_SCOPE4=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write((j.axis_classification||{}).scope||'operational');}catch(e){process.stdout.write('operational');}" 2>/dev/null || echo 'operational')
    THRESHOLD_INTENT=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write((j.axis_classification||{}).intent||'directive');}catch(e){process.stdout.write('directive');}" 2>/dev/null || echo 'directive')
    THRESHOLD_MANDATE=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write((j.axis_classification||{}).mandate_relation||'in-mandate');}catch(e){process.stdout.write('in-mandate');}" 2>/dev/null || echo 'in-mandate')
    THRESHOLD_ROUTE=$(R4A="$_4A_RAW" node -e "try{const j=JSON.parse(process.env.R4A||'{}');process.stdout.write(j.route||'PROCESS-NOW');}catch(e){process.stdout.write('PROCESS-NOW');}" 2>/dev/null || echo 'PROCESS-NOW')
    # Sanitize preview: strip control chars and quotes
    _PV=$(printf '%s' "$USER_MESSAGE" | head -c 80 | tr -d '\001-\031\\')

    # Also write to .csps/threshold/intake-log.yaml (ThresholdIntakeRecord format)
    # This mirrors libs/threshold/intake.ts ThresholdIntakeRecord for INFRA-FLOW Step 1.
    {
      _CSPS_LOG="${REPO_ROOT}/.csps/threshold/intake-log.yaml"
      THRESHOLD_TYPE="$_TY" THRESHOLD_SPINE="$_SP" THRESHOLD_SCOPE="$_SC" \
      THRESHOLD_URGENCY="$_UR" THRESHOLD_SESSION="$_SN" THRESHOLD_PREVIEW="$_PV" \
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
    '  raw: '+JSON.stringify((process.env.THRESHOLD_PREVIEW||'').slice(0,120)),
  ].join('\n')+'\n';
  if(!fs.existsSync(log))fs.writeFileSync(log,'# Threshold intake log — ThresholdIntakeRecord format\n# Generated by libs/threshold/intake.ts via user-prompt-submit-intake.sh\nentries:\n');
  fs.appendFileSync(log,entry);
}catch(e){}
" 2>/dev/null || true
    } 2>/dev/null || true

    # Append to intake log via node (env-var passing avoids bash/node quoting issues)
    THRESHOLD_TYPE="$_TY" THRESHOLD_SPINE="$_SP" THRESHOLD_SCOPE="$_SC" \
    THRESHOLD_URGENCY="$_UR" THRESHOLD_SESSION="$_SN" THRESHOLD_PREVIEW="$_PV" \
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
    '  input_preview: '+JSON.stringify((process.env.THRESHOLD_PREVIEW||'').slice(0,150)),
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
  if [ -f "$_WRAPPER" ] && [ -n "$USER_MESSAGE" ] && [ "${#USER_MESSAGE}" -gt 5 ]; then
    ROUTE_CONTENT=$(printf '%s' "$USER_MESSAGE" | head -c 200) \
    ROUTE_SESSION="$_SN_M6" \
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

exit 0
