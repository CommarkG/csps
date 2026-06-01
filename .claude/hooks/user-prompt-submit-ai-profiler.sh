#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-ai-profiler
# @csps-name user-prompt-submit-ai-profiler
# @csps-description UserPromptSubmit hook — THIN READER pattern (S048).
#   Detection patterns are in tools/config/caq-patterns.yaml — NOT in this file.
#   To add/modify detection patterns: edit caq-patterns.yaml (no .claude/ edit, no permission prompt).
#   This file only: (1) reads patterns from YAML, (2) applies injections.
#   Modes: architectural | implementation | governance | enforcement | caq | standard
# @csps-version 2.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_INHERITANCE_POLICY P-META-020

set -euo pipefail

PROMPT="${CLAUDE_USER_PROMPT:-}"
HOOKS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${HOOKS_DIR}/../.." && pwd)"
PATTERNS_FILE="${PROJECT_ROOT}/tools/config/caq-patterns.yaml"

# ── Mode detection via YAML config (thin reader) ─────────────────────────────
# All patterns are in tools/config/caq-patterns.yaml
# Edit that file to add/change patterns — this script never needs to change

export CSPS_PROMPT="$PROMPT"
export CSPS_PATTERNS_FILE="$PATTERNS_FILE"

MODE=$(node -e "
try {
  const yaml = require('js-yaml');
  const fs = require('fs');
  const prompt = process.env.CSPS_PROMPT || '';
  const pFile = process.env.CSPS_PATTERNS_FILE;
  if (!fs.existsSync(pFile)) { process.stdout.write('standard'); process.exit(0); }
  const docs = yaml.loadAll(fs.readFileSync(pFile, 'utf-8'));
  const cfg = Array.isArray(docs) ? docs[docs.length - 1] : docs;
  const modes = cfg.profiler_modes || [];
  const caqTypes = cfg.caq_types || [];

  // CAQ detection: score 2+ types
  let caqScore = 0;
  for (const ct of caqTypes) {
    for (const pat of (ct.patterns || [])) {
      if (new RegExp(pat, 'i').test(prompt)) { caqScore += (ct.score || 1); break; }
    }
  }
  if (caqScore >= 2) {
    // Check if any matching type has signal_class: d_default or enhancement
    // → write non-blocking signal to ai-behavior-signals.jsonl for weekly deep-dive
    const signalingTypes = caqTypes.filter(ct => ct.signal_class && ct.patterns?.some(p => new RegExp(p,'i').test(prompt)));
    if (signalingTypes.length > 0) {
      try {
        const signalsFile = path.join(ROOT, 'tools/data/ai-behavior-signals.jsonl');
        // Note: session omitted to avoid local-computation (session-source.mjs is bash-only)
        // Weekly aggregator uses date-based session inference
        const signal = JSON.stringify({
          date: new Date().toISOString().slice(0,10),
          signal_class: signalingTypes[0].signal_class,
          trigger: prompt.slice(0, 200),
          caq_types_fired: signalingTypes.map(t => t.id),
          source: 'ai-profiler-caq-detection'
        });
        fs.appendFileSync(signalsFile, signal + '\n');
      } catch(e) { /* non-blocking — signal loss acceptable */ }
    }
    process.stdout.write('caq'); process.exit(0);
  }

  // Mode detection: last match wins (enforcement > governance > implementation > architectural)
  let mode = 'standard';
  for (const m of modes) {
    for (const pat of (m.patterns || [])) {
      if (new RegExp(pat, 'i').test(prompt)) { mode = m.id; break; }
    }
  }
  process.stdout.write(mode);
} catch(e) { process.stdout.write('standard'); }
" 2>/dev/null || echo "standard")

# Standard chat — no injection needed
if [ "$MODE" = "standard" ]; then
  
# ─── D* CORRECTIVE ARM (S074 BATCH 4) ────────────────────────────────────────
# Detects D7 (action-bias) from governance/enforcement mode and surfaces correction
{
  _TRACKER_FILE="/tools/zf-session-tracker.json"
  _CORR_FILE="/tools/data/default-correction-registry.yaml"
  if [ -f "\" ] && [ -f "\" ]; then
    node -e "
const fs=require('fs'),yaml=require('js-yaml');
const t=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));
const r=yaml.load(fs.readFileSync(process.argv[2],'utf8'));
const mode=process.env.CSPS_MODE||'standard';
const modeDefaults={'governance':['D3','D7','D8'],'enforcement':['D3','D7','D8'],'implementation':['D4','D7'],'architectural':['D8','D6']};
const fired=(modeDefaults[mode]||[]);
if(fired.length){
  const kc=t.d_default_k_counts||{};
  fired.forEach(id=>{kc[id]=(kc[id]||0)+1;});
  t.d_default_k_counts=kc;
  fs.writeFileSync(process.argv[1],JSON.stringify(t,null,2));
  const k2=fired.filter(id=>kc[id]>=2);
  if(k2.length){const defs=r.defaults||[];const cc=k2.map(id=>{const d=defs.find(x=>x.id===id);return d?d.counter_instruction:'';}).filter(Boolean);if(cc.length)process.stderr.write('[D*-CORRECTIVE] K>=2: '+cc[0].substring(0,120));}
}
" "\" "\" 2>&1 >&2 || true
  fi
} 2>/dev/null || true


printf '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":""}}'
  exit 0
fi

# ── Mode-specific injection ───────────────────────────────────────────────────
case "$MODE" in
  architectural)
    INJECTION="[AI-PROFILER: ARCHITECTURAL MODE]
Pre-directive ZF required before any proposal.
If decision is consequential: invoke /cruel-critic or /balance-expert BEFORE finalizing.
Virtual OPUS check: draft → ZF → amend → present amended version only.
Active overrides: CORE-FIRST (validate exit criteria before accepting session-state), RULE-SCOPE (escape hatch required).

COMMUNICATION PROTOCOL REMINDER (Rule 1 + Rule 10 — mandatory):
When preparing a directive FOR SONNET (Opus is the drafter):
  [PROTOCOL: PROTO-NNN | STEP: N of M | MODE: sequential]
  YOU ARE: Sonnet, the builder in Claude Code VS Code tab.
  I AM: OPUS-3 (Claude Opus), the architectural advisor.   ← NOT "Governor" unless Governor wrote it
  THIS IS THE SITUATION: [2-3 sentences]
  YOUR TASK: [one specific action]
When preparing a SROF FOR OPUS (Sonnet is the drafter):
  [PROTOCOL: SROF-NNN | STEP: 1 of 1 | MODE: REVIEW + REFINE]
  YOU ARE: OPUS-3 (Claude Opus), the architectural advisor for CSPS.
  I AM: Sonnet (S[NNN], builder), reporting to OPUS.
"I AM" = the DRAFTER. Governor relays without changing this field.
Missing this format = malformed cross-boundary message = Rule 1 violation."
    ;;
  implementation)
    INJECTION="[AI-PROFILER: IMPLEMENTATION MODE]
Rule 11 active: DONE = next build passes + verify exit_code=0. tsc alone is insufficient.
Component A (app) + Component B (libs/template) both required.
Active override: COMPLETION (finish active work before new; 1.5× PE score for ≥50% done work)."
    ;;
  governance)
    INJECTION="[AI-PROFILER: GOVERNANCE MODE]
FSE checklist required: T5 AGENTS.md + T4 contract + T3 memory + T2 validator + T1 hook.
Commit all 5 surfaces atomically. T3-only = drift within 2 sessions.
Active override: RULE-SCOPE (every rule needs CONCEPT + SCOPE + ESCAPE HATCH).
ENFORCEMENT CHECK: Does every rule in this session have T1+T2? Show enforcement_rate delta."
    ;;

  caq)
    INJECTION="[AI-PROFILER: CAQ MODE — CORE ALIGNMENT QUESTION DETECTED]
Governor is using diagnostic multi-dimensional questioning. This means Scope-1 fixes have FAILED.
DO NOT apply the same approach again. SWITCH TO SCOPE-3 MODE.

WHAT CAQs SIGNAL:
  The current approach has been tried and failed as a CLASS.
  The next response must address the class, not the instance.
  Governor expects permanent structural fix, not another retry.

MANDATORY CAQ RESPONSE SEQUENCE:
  1. Name the CLASS of problem (not the instance)
  2. Name the TRAINING DEFAULT that caused it to recur
  3. Name the SATISFACTION POINT that felt like success but wasn't
  4. Propose ONLY permanent structural fixes (T1/T2/T3 or architectural pattern change)
  5. If proposed fix touches the same mechanism that failed: REJECT IT before proposing

ACTIVE OVERRIDE — CAQ-BEFORE-ACTION:
  Do NOT execute any action until the Scope-3 diagnosis is complete.
  'Diagnostic reasoning → structural proposal → Governor ratification → implementation.'
  Jumping to implementation without this sequence = AP-001 applied to yourself.

Reference: docs/plan/_handoff/VAULT/inner-ai-defaults/caq-pattern-recognition.md
Questions hub: csps-playground.vercel.app/platform/questions/"
    ;;

  enforcement)
    INJECTION="[AI-PROFILER: ENFORCEMENT MODE — MECHANICAL ENFORCEMENT MANDATE]
STOP before declaring any rule/validator/contract COMPLETE.

THE TRAINING DEFAULT YOU MUST OVERRIDE:
  DEFAULT-ME-1: 'I wrote the rule → done.' WRONG. Written rule = 0% complete.
  DEFAULT-ME-2: 'It is in AGENTS.md → enforced.' WRONG. AGENTS.md = T3-only = suggestion.
  DEFAULT-ME-3: 'T3 session injection = enforcement.' WRONG. T3 fades by turn 10.
  DEFAULT-ME-4: 'Advisory validator = validation.' WRONG. Advisory = visibility, not enforcement.
  DEFAULT-ME-5: 'I have wired the validator' without showing output = EP-ERR-001.

SATISFACTION POINT CHECK (fire ONLY when ALL are true):
  T1 hook: which hook fires on VIOLATION? Named, tested, exits 1 on detection.
  T2 validator: which validator BLOCKS commits? Wired to pnpm verify, exits 1. In verify output.
  T3 session: in session-open.sh injection. Necessary but not sufficient alone.
  EVIDENCE: pnpm verify exit_code=0 WITH the T2 validator name visible in output.

IF ANY T1/T2 IS MISSING: register OPEN-NNN immediately. Do NOT close the session without it.
Reference: docs/plan/_handoff/VAULT/inner-ai-defaults/mechanical-enforcement-defaults.md"
    ;;
esac

printf '{"hookSpecificOutput":{"hookEventName":"UserPromptSubmit","additionalContext":"%s"}}' \
  "$(echo "$INJECTION" | sed 's/"/\\"/g' | tr '\n' '|' | sed 's/|/\\n/g')"

exit 0
