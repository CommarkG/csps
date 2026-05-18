#!/usr/bin/env bash
# @csps-id csps.claude.hooks.user-prompt-submit-ai-profiler
# @csps-name user-prompt-submit-ai-profiler
# @csps-description UserPromptSubmit hook — detects cognitive mode from prompt keywords.
#   Routes: architectural → trigger /cruel-critic or /balance-expert reminder.
#           implementation → apply Rule 11 (next build required).
#           governance → apply FSE checklist reminder.
#   Solves: OPUS advisory floating (opt-in skills never invoked at right moment).
#   Governor directive S040: "fix all and optimize" — AI profiling consolidated.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_INHERITANCE_POLICY P-META-020

set -euo pipefail

PROMPT="${CLAUDE_USER_PROMPT:-}"

# ── Mode detection ────────────────────────────────────────────────────────────
MODE="standard"

if echo "$PROMPT" | grep -Eqi '\b(design|architect|PI-[0-9]+|plan the|how should we|consolidat|pcr|pros and cons|recommend|should we|OPEN-[0-9]+|strategy|trade.?off)\b'; then
  MODE="architectural"
fi

if echo "$PROMPT" | grep -Eqi '\b(build|implement|create the|fix the|write the|next build|deploy|vercel|pnpm|tsc|prisma|route\.ts|page\.tsx)\b'; then
  MODE="implementation"
fi

if echo "$PROMPT" | grep -Eqi '\b(B_[A-Z_]+|P-META|P-ARCH|P-OPER|engrave|ratif|AGENTS\.md|behavioral contract|FSE|enforcement trio)\b'; then
  MODE="governance"
fi

# ENFORCEMENT MODE — highest priority override
# Fires when AI is creating or declaring governance artifacts complete
# This catches DEFAULT-ME-1 (rule text = done) before it closes the session
if echo "$PROMPT" | grep -Eqi '\b(new.*contract|new.*validator|Hard NO|add.*AGENTS|enforcement.*active|validator.*LIVE|hook.*active|T1.*T2|enforcement trio|wired.*verify|mechanical enforcement|B_CSPS_INHERITANCE|B_ZERO_NAVIGATION|behavioral contract.*new|now enforced|enforcement.*complete)\b'; then
  MODE="enforcement"
fi

# Standard chat — no injection needed
if [ "$MODE" = "standard" ]; then
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
Active overrides: CORE-FIRST (validate exit criteria before accepting session-state), RULE-SCOPE (escape hatch required)."
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
