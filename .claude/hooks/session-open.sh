# @core-seed: THRESHOLD_COMPLETENESS | plan: docs/plan/_handoff/VAULT/topic-plans/platform-core-alignment.md L5 | grows-to: validate-session-open-completeness.mjs — mechanical check that Q1-Q15 ran, session-state loaded, VLTs confirmed | target: week-4
#!/usr/bin/env bash
# @csps-id csps.claude.hooks.session-open
# @csps-name session-open
# @csps-description SessionStart hook — mandatory context + reasoning load BEFORE AI activation.
#   Reads session-state.json, open-plan-levels, and injects the conceptual frame required
#   by P-META-020 before any input is processed. AI MUST acknowledge this context before
#   proceeding. Prevents cold-start drift, plan-promise-abandonment, and nominal-ZF.
#   Per P-META-020 (Concept-First Governance): context is the compass; validators are samples.
#   Per B_COGNITIVE_CONTEXT_DISCIPLINE: Layer 1 (Permanent Constitution) loads at session-open.
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces P-META-020 B_COGNITIVE_CONTEXT_DISCIPLINE P-META-006

set -euo pipefail

readonly REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

node -e "
const fs = require('fs');
const {join} = require('path');
const ROOT = process.argv[1];

// Read ZF tracker and RESET per-session fields at session open
let zfIterations = 0, zfBlockingTotal = 0, zfOrchestratorCycles = 0, zfLastStatus = 'not-run';
try {
  const trackerPath = join(ROOT, 'tools/zf-session-tracker.json');
  const t = JSON.parse(fs.readFileSync(trackerPath, 'utf8'));
  zfIterations = t.verify_runs || 0;
  zfBlockingTotal = t.blocking_found_total || 0;
  zfOrchestratorCycles = t.orchestrator_cycles || 0;
  zfLastStatus = t.orchestrator_last_status || 'not-run';
  // RESET per-session ZF deep and harvest counters (fresh session starts with 0 deep runs)
  t.zf_deep_runs_this_session = 0;
  t.zf_deep_last_run_at = null;
  t.zf_deep_last_status = 'not-run-this-session';
  t.harvest_done_this_session = false;
  t.harvest_done_at = null;
  t.verify_runs = 0;  // reset per-session verify counter
  fs.writeFileSync(trackerPath, JSON.stringify(t, null, 2));
} catch(e) { /* no tracker yet */ }

// Read session state
let session = '?', mandate = 'unknown', blocking = 'NONE', verifyState = 'unknown';
let opusStatus = 'not tracked', opusEnfRate = '', taskListRef = '', mentalModelsRef = '';
let sessionRole = 'sonnet-builder';
try {
  const d = JSON.parse(fs.readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
  session = d.current_session || '?';
  mandate = (d.session_mandate || {}).primary || 'unknown';
  const unresolved = (d.blocking_decisions || []).filter(x => x.status !== 'RESOLVED').map(x => x.id);
  blocking = unresolved.length ? unresolved.join(', ') : 'NONE';
  verifyState = (d.platform_state || {}).pnpm_verify || 'unknown';

  // Opus audit tracking — surfaced every session-open
  const opusAudit = d.opus_audit || {};
  const opusSince = opusAudit.sessions_since_opus_review ?? 'unknown';
  const opusDue   = opusAudit.opus_audit_due === true;
  const opusNext  = opusAudit.next_opus_review_due || 'unknown';
  const opusRate  = opusAudit.enforcement_rate_at_last_review ?? 'unknown';
  opusStatus = opusDue ? '⚠ OVERDUE — set opus_audit_due=false after review' :
    opusSince + '/10 sessions since last review (next: ' + opusNext + ')';
  opusEnfRate = opusRate + '% behavioral enforcement (target 25% by S025)';

  // S019 opus artifacts — task list for S020+
  const opusArtifacts = d.s019_opus_artifacts || {};
  taskListRef = opusArtifacts.s020_task_list || 'not set';
  mentalModelsRef = opusArtifacts.mental_models || 'not set';

  // Session role — determines which protocol applies
  sessionRole = d.session_role || 'sonnet-builder';

  // Zoom-out signal — fires when PE patterns suggest strategic review needed
  let zoomOutSignal = '';
  try {
    const pendingMatch = JSON.stringify(d).match(/"blocking_on":\s*"([^"]+)"/);
    const sessionNum = parseInt((d.current_session || 'S000').replace('S', ''), 10);
    const sessionsSince = (d.opus_audit || {}).sessions_since_opus_review || 0;
    // Trigger zoom-out when: halfway to Opus audit, or high backlog, or 5+ sessions without reset
    if (sessionsSince >= 5) {
      zoomOutSignal = '⟳ ZOOM-OUT SIGNAL: ' + sessionsSince + '/10 sessions since Opus review — strategic perspective recommended';
    }
  } catch {}

  // Council state — surfaced when a council is in-progress
  let councilStatus = '';
  try {
    const cState = JSON.parse(fs.readFileSync(join(ROOT, 'tools/council/council-state.json'), 'utf8'));
    if (cState.status === 'in-progress') {
      councilStatus = '⚠ COUNCIL IN-PROGRESS: ' + (cState.council_id || 'unknown') +
        ' — whose turn: ' + (cState.whose_turn || 'unknown') +
        ' | read tools/council/PROTOCOL.md';
    } else if (cState.status === 'consensus-reached') {
      councilStatus = '✓ Last council: ' + (cState.council_id || 'unknown') + ' — consensus reached';
    }
  } catch(e) { /* no council state yet */ }
} catch(e) { /* session-state not found */ }


// Read open-plan-levels summary
let openLevels = 'validator not run';
try {
  const {execSync} = require('child_process');
  const out = execSync('node tools/validators/validate-open-plan-levels.mjs 2>&1', {cwd: ROOT, encoding: 'utf8', timeout: 10000});
  const match = out.match(/plans_checked=\d+ plans_with_open=\d+ total_open_items=\d+/);
  openLevels = match ? match[0] : 'see validate-open-plan-levels.mjs';
} catch(e) { openLevels = 'validator error — run manually'; }

// PE DASHBOARD top-5 (S025 — Governor directive: "PE connected to everything")
let peTop5 = 'not computed';
try {
  const {execSync} = require('child_process');
  const peOut = execSync('node tools/validators/validate-pe-dashboard.mjs 2>&1', {cwd: ROOT, encoding: 'utf8', timeout: 15000});
  const lines = peOut.split('\n').filter(l => /^\s+\d+\s+│/.test(l)).slice(0, 5);
  peTop5 = lines.length > 0 ? '\n' + lines.map(l => '    ' + l.trim()).join('\n') : 'no scored plans found';
} catch(e) { peTop5 = 'pe-dashboard error — run manually'; }

// FOUNDATION_EXIT_GATE — S015 major discovery (session-open v1.1)
let foundationGateStatus = 'UNKNOWN', foundationGateBLOCKING = false, foundationGateDetail = '';
try {
  const fOut = require('child_process').execSync('node tools/validators/validate-phase-exit-criteria.mjs', {cwd: ROOT, encoding: 'utf8', timeout: 15000});
  foundationGateStatus = 'CLEAN';
  foundationGateDetail = 'All exit criteria checked — phase advance unblocked.';
} catch(fErr) {
  foundationGateBLOCKING = true;
  foundationGateStatus = 'BLOCKING';
  const fo = ((fErr.stdout || '') + (fErr.stderr || ''));
  const item = fo.split('
').find(l => l.includes('CHECK A'));
  foundationGateDetail = item ? item.trim().slice(0, 120) : 'Run: node tools/validators/validate-phase-exit-criteria.mjs';
}
const mandateOverride = foundationGateBLOCKING ? '  *** FOUNDATION_EXIT_GATE BLOCKING — MANDATE SUSPENDED — PE score for phase advance = 0 ***' : '';

// RAW THOUGHTS QUEUE — surfaced at Threshold so incoming AI sees pending ideas (S015)
let pendingThoughts = 0, pendingThoughtsSummary = '0 pending';
try {
  const qText = fs.readFileSync(join(ROOT, 'docs/plan/_intake/raw-thoughts-queue.md'), 'utf8');
  const pending = qText.split('
').filter(l => l.match(/→ STATUS: PENDING/));
  pendingThoughts = pending.length;
  if (pendingThoughts > 0) {
    const previews = pending.slice(0, 2).map(l => l.replace(/^- [.*?] /, '').split(' → ')[0].trim().slice(0, 60));
    pendingThoughtsSummary = pendingThoughts + ' pending: ' + previews.join(' | ');
  }
} catch(e) { pendingThoughtsSummary = 'queue not found'; }

// STALE PLAN ALIGNMENT — detect plans written >1 session ago needing review (S015)
let stalePlansUnverified = 0, stalePlansSummary = '';
try {
  const spOut = require('child_process').execSync('node tools/validators/validate-plan-age-alignment.mjs 2>&1', {cwd: ROOT, encoding: 'utf8', timeout: 15000});
  const m = spOut.match(/unverified=(d+)/);
  stalePlansUnverified = m ? Number(m[1]) : 0;
  const likelyDone = spOut.match(/likely_done_items=(d+)/);
  const ldCount = likelyDone ? Number(likelyDone[1]) : 0;
  stalePlansSummary = stalePlansUnverified > 0
    ? stalePlansUnverified + ' plans need alignment — review [ ] items before executing. Likely-done: ' + ldCount + ' items.'
    : '0 stale unverified';
} catch(e) { stalePlansSummary = 'validator error'; }

const isOpus = sessionRole === 'opus-advisor';
const roleHeader = isOpus
  ? ['╠══════════════════════════════════════════════════════════════════╣',
     '║  ROLE: OPUS ADVISOR — Strategic Review + Architecture            ║',
     '║  Protocol: tools/council/opus-protocol.md (READ FIRST)          ║',
     '║  (No implementation. No git push. Council + vault only.)         ║']
  : ['╠══════════════════════════════════════════════════════════════════╣',
     '║  ROLE: SONNET BUILDER — Implementation + Execution              ║',
     '║  (If you are in the Opus Advisor tab — you have wrong context)  ║'];

const context = [
  '╔══════════════════════════════════════════════════════════════════╗',
  '║         CSPS SESSION ACTIVATION — CONTEXT LOAD REQUIRED         ║',
  '║   P-META-020: Read this fully before processing any request.    ║',
  ...roleHeader,
  '╚══════════════════════════════════════════════════════════════════╝',
  '',
  'SESSION STATE:',
  '  Session: ' + session,
  '  Mandate: ' + mandate,
  '  Blocking: ' + blocking,
  '  Platform verify: ' + verifyState,
  '  Open plan levels: ' + openLevels,
  '  PE TOP-5 PRIORITIES (validate-pe-dashboard.mjs):' + peTop5,
  '  Foundation exit gate: ' + foundationGateStatus + mandateOverride,
  '  Raw thoughts queue: ' + pendingThoughtsSummary,
  '  Stale plan alignment: ' + stalePlansSummary,
  '  Opus audit: ' + opusStatus,
  '  Behavioral enforcement rate: ' + opusEnfRate,
  zoomOutSignal ? ('  ' + zoomOutSignal) : null,
  '  S020 task list: ' + taskListRef,
  '  Mental models: ' + mentalModelsRef,
  '  Council status: ' + (councilStatus || 'no active council'),
  '  Council protocol: tools/council/PROTOCOL.md',
  '',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'CONTEXT ALIGNMENT PREAMBLE (CAP — Opus Turn 35 S030):',
  '',
  'Q1 SCOPE: I can see files explicitly loaded this session.',
  '          I CANNOT see: prior chat sessions, unloaded files, other tabs.',
  '          Always verify state with a tool call before claiming it.',
  '',
  'Q2 AUDIENCE: Participant type = [' + sessionRole + ']',
  '             Vocabulary: technical developer (not general user) by default.',
  '             Governor signals a different level → recalibrate immediately.',
  '',
  'Q3 ASSUMPTIONS: Before any consequential action, name 3 unverified assumptions.',
  '                If any is wrong → the whole response may be wrong.',
  '                Name them explicitly. Never act on them silently.',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '',
  'ZF ITERATION TRACKER (this session — measurement of work richness):',
  '  verify_runs: ' + zfIterations + ' | blocking_found_total: ' + zfBlockingTotal,
  '  orchestrator_cycles: ' + zfOrchestratorCycles + ' | last_status: ' + zfLastStatus,
  '  Per P-META-021: iteration count is MEASUREMENT. 0 iterations = no ZF work done yet.',
  '',
  'CONCEPT-FIRST ACTIVATION PROTOCOL (P-META-020 — non-negotiable):',
  'Before processing ANY request this session, identify the governing L2 spine:',
  '  User directive / ratification  → GVRN L2 (decision rights)',
  '  Schema / code implementation   → ARCH L2 (data domain)',
  '  AI behavior / defaults         → AI L2 (inner-defaults domain)',
  '  Validation / evidence claims   → VALD L2 (coverage discipline)',
  '  External content / research    → AI L2 (alignment domain) + VAULT_DEFER',
  '',
  'WHY THIS MATTERS (the reasoning that makes rules unnecessary):',
  '  The plan-promise-abandonment pattern orphaned foundation-slices L3 for 3',
  '  sessions because context degraded to a checkbox. The AI believed it was done',
  '  because pnpm verify passed — but the UNDERSTANDING of why L3 mattered was gone.',
  '  Loading the conceptual frame NOW means every decision this session navigates',
  '  from understanding, not from rule lookup. Rules are finite. Situations are',
  '  infinite. Only deep concept understanding handles the long tail.',
  '',
  'WHY CONTINUOUS ITERATION UNTIL REAL ZERO FINDINGS:',
  '  Nominal ZF (touching timestamps, bypassing checks) is worse than acknowledged',
  '  failure because it gives false confidence at exactly the moment a developer',
  '  builds on top of it. Every open item is an obligation. Deferring is valid —',
  '  forgetting is not. Each iteration either eliminates a finding or explicitly',
  '  defers it with documented reasoning. Silent accumulation = structural debt',
  '  that compounds across 30 apps. The platform survives by compounding ZF cycles,',
  '  not by accumulating nominal ones.',
  '',
  'TRIAD GOVERNANCE (P-META-021 — Governor directive S014):',
  '  Rules are finite. Situations are infinite. Only the combination covers all cases:',
  '    CONTEXT    = load the L2 spine domain (what to navigate toward)',
  '    PRINCIPLE  = name the specific P-* or B_* rule (where the boundary is)',
  '    MECHANICAL = confirm a hook/validator fires independently (how it holds)',
  '  Any consequential decision using <3 layers = governance gap → §10.0j.',
  '',
  '10 DECISION HYGIENE QUESTIONS (context reminders — ask before every consequential action):',
  '  Q1:  Which L2 spine domain governs THIS input? (GVRN/ARCH/AI/VALD/OPER)',
  '  Q2:  Is this decision consequential? (hard-to-reverse/multi-artifact/new-class/blocks)',
  '  Q3:  Do I have all 3 triad layers? Can I NAME domain + principle + mechanical?',
  '  Q4:  Did the ZF cycle return ZERO new findings, or did I stop when comfortable?',
  '  Q5:  Is my next step based on PE scoring or on reading session-state sequence?',
  '  Q6:  Are there PENDING VLTs? Registered ≠ resolved. PENDING = phase blocked.',
  '  Q7:  Is this a DONE claim? Do I have THIS-SESSION verify evidence, not memory?',
  '  Q8:  What structural failure does this instruction prevent? (WHY, not WHAT)',
  '  Q9:  Am I extracting ≥1 positive ZF output from this finding?',
  '  Q10: Is my proposed next step the highest-PE item, or the most comfortable one?',
  '  Q11: Does this session touch any hierarchical config? (settings/tsconfig/ZModel/env)',
  '       If YES: are ALL critical fields EXPLICIT at the child level? (not silently inherited)',
  '       SILENT OVERRIDE PATTERN: child exists but field missing → system uses DEFAULT not parent.',
  '  Q12: Is FOUNDATION_EXIT_GATE CLEAN? BLOCKING = PE score for phase advance = 0.',
  '  Q13: PLATFORM-FIRST (B_PLATFORM_FIRST_OPTIMIZATION): Is this solution platform-generalizable?',
  '       Vault the generalization before implementing locally — 5-8 surfaces × insight = the moat.',
  '  Q14: COMPLETION BIAS (B_COMPLETION_OVER_SHINY): Active work >50% complete scores 1.5× in PE.',
  '       Does the proposed next step complete active work, or pivot to something new?',
  '  Q15: INITIATED BY WHOM (Rigid-Rule anti-pattern): Is proposed work Governor-directed or AI-proactive?',
  '       AI-proactive App-layer work → vault it. Governor-directed App-layer work → execute fully.',
  '       Rules without escape hatches are rigid. Every governance rule has a Governor-override clause.',
  '       Run: node tools/validators/validate-phase-exit-criteria.mjs',
  '  Q16: VERBATIM CHECK: Did user provide exact text to use? → copy exactly, no improvements.',
  '       If significant gap (text would FAIL): ask "I notice [gap]. 2-3 versions?" WAIT.',
  '',
  'PRACE — PERMANENT RECURRING AI CONTEXTUAL ENFORCEMENT (CONSTITUTIONAL — S040, M-27):',
  '  Every governance rule requires ALL of these before it is DONE:',
  '    TRAINING DEFAULT: which Claude default does this rule override? (name it explicitly)',
  '    SATISFACTION POINT: what incorrect "done" feeling does this rule prevent? (name it)',
  '    T1: which hook fires on violation? (must exit 1 on detection)',
  '    T2: which validator BLOCKS commits? (must be wired to pnpm verify)',
  '    T3: this injection — necessary but NOT sufficient alone. T3-only = will drift by turn 10.',
  '  Writing a rule ≠ done. T1+T2+T3 all firing = done.',
  '  B_PRACE in behavioral-contracts.md. M-27 in moat-registry.md.',
  '',
  'B_ZERO_NAVIGATION_FOR_GOVERNOR (CONSTITUTIONAL — S040, Rule 12):',
  '  When instructing the Governor → ALL content must be inline in THE SAME MESSAGE.',
  '  FORBIDDEN: "see above" | "paste from earlier" | "from my prior response" | "as before".',
  '  Governor starts from ZERO. If content is needed, it must be IN THIS RESPONSE.',
  '  Applies to: Sonnet AND Opus equally. Violation = communication failure, not style choice.',
  '  Enforced by: post-stop-banned-phrase.sh (T1) + validate-governor-instructions.mjs (T2)',
  '',
  'ZERO-LAPTOP ENFORCEMENT (B_ZERO_LAPTOP_DEPENDENCY — P-OPER-001 MANDATORY):',
  '  ALL deployment, testing, and credential work must be CLOUD-FIRST. No exceptions.',
  '  FORBIDDEN in procedures: pnpm dev | localhost:PORT | .env.local | npm run dev',
  '  REQUIRED instead:   vercel --prod | Vercel preview URL | vercel env add | Codespaces',
  '  validate-laptop-patterns.mjs BLOCKS new docs with local-dev language.',
  '  validate-no-laptop-secrets.mjs WARNS if .env.local exists with real values.',
  '  S028 incident: AI defaulted to .env.local + localhost. Never again.',
  '',
  'CLEANUP VERIFICATION (SP-001 OPERATIONAL — S028 diagnostic):',
  '  I am SOFTWARE. When I "forget" to verify cleanup: SP-001 fired at the ACTION.',
  '  After rm/restore/delete/unstage: show git status in THIS response.',
  '  "I ran rm -f file" is NOT ZF. State change requires DEMONSTRATION, not declaration.',
  '',
  'LEVEL-AWARENESS PROPOSAL CHECK (S028 level-awareness flop):',
  '  Before ANY implementation proposal: declare requirement_scope + proposal_scope.',
  '  S2 proposal for S1 requirement = SCOPE CONFLICT. Find the S1 platform solution.',
  '',
  'CONTEXT ARCHITECTURE (L2_DOMAIN_AI_CONTEXT_ARCHITECTURE — Opus Turn 21 SROF-010):',
  '  OD-008 active: Before ANY substantive proposal, declare:',
  '    "Governing context: [principle] at [scope]. Assumption: [X]. Uncertainty: [Y]"',
  '  session-context-record.md: per-session SSoT at docs/plan/_handoff/VAULT/session-context-records/',
  '  governor-request-ledger.yaml: open requests surfaced at every pnpm verify',
  '',
  'CROSS-BOUNDARY COMMUNICATION FORMAT (Rule 1 + Rule 10 — no exceptions):',
  '  SONNET DIRECTIVE: [PROTOCOL: PROTO-NNN | STEP: N of M | MODE: sequential]',
  '    YOU ARE: Sonnet, the builder in Claude Code VS Code tab.',
  '    I AM: Yariv Fink (Governor).',
  '    THIS IS THE SITUATION: [2-3 sentences — project, state, urgency]',
  '    YOUR TASK: [one specific action to take right now]',
  '  OPUS SROF: [PROTOCOL: SROF-NNN | STEP: 1 of 1 | MODE: REVIEW + REFINE]',
  '    YOU ARE: OPUS-3 (Claude Opus), the architectural advisor for CSPS.',
  '    I AM: [sender + role].',
  '  MISSING FORMAT = malformed message = recipient flags before acting.',
  '  Use sonnet-to-opus-srof.template.md as canonical reference.',
  '',
  'SESSION NAMING CONVENTION (first message = permanent tab name):',
  '  OPUS-1, OPUS-2   → Opus Advisor (instance-numbered, persistent advisor)',
  '  SONNET-S[NNN]    → Sonnet Builder (session-numbered, e.g. SONNET-S022)',
  '  Haiku has no named tab — spawned ephemerally by Sonnet via Agent tool',
  '  Context briefs: tools/council/opus-1-context.md | sonnet-1-context.md',
  '',
  'ACTIVE MECHANICAL ENFORCEMENT THIS SESSION:',
  '  pre-tool-use-plan-coverage-gate.sh  — blocks libs/apps writes without plan',
  '  post-stop-pnpm-verify.sh            — runs verify + ZF reasoning every stop',
  '  user-prompt-submit-next-step-reminder — every turn: next step + triad + WHY',
  '  validate-open-plan-levels.mjs       — open items surfaced (obligations)',
  '  validate-vlt-blocking.mjs          — PENDING VLTs warn at every verify',
  '  validate-phase-exit-criteria.mjs   — FOUNDATION_EXIT_GATE (BLOCKING if exit criteria open)',
  '  validate-plan-age-alignment.mjs    — STALE PLAN GATE (WARN: plans >1 session old need alignment before execution)',
  '',
  'FORMATTING (EP-ERR-007 — S037-F active enforcement):',
  '  EVERY file path in chat output = clickable markdown link: [name](path)',
  '  NEVER: bare paths like tools/verify.mjs or validate-frontmatter.mjs',
  '  post-stop-link-discipline.sh fires on every response to detect violations.',
  '',
  'ALIGNMENT QUESTIONS + ENFORCEMENT TRIO (S037-F — Governor directive):',
  '  EVERY HANDOFF and chat-transfer must include ## ALIGNMENT QUESTIONS section.',
  '  Questions must be context-specific (not generic) — 3-5 questions for receiving AI.',
  '  EVERY new rule/principle/contract must have enforcement_trio: at creation time.',
  '  T1 = hook (fires on AI output) | T2 = validator (fires on commit) | T3 = session-open.',
  '  T3-only = explicitly acknowledged drift. T1+T2 = high permanence.',
  '',
  'AI BEHAVIOR OVERRIDES — ACTIVE (disposition: override | inner-ai-defaults/):',
  '  These training defaults are WRONG for CSPS. Override is mandatory:',
  '  BOUNDARY: default=assume shared context → CSPS=WHO/WHAT/HOW/NOW at every crossing',
  '  CORE-FIRST: default=accept session-state mandate → CSPS=validate phase exit criteria first; validators supersede session-state',
  '  RULE-SCOPE: default=blanket Never-X rules → CSPS=every rule has CONCEPT + SCOPE + ESCAPE HATCH',
  '  COMPLETION: default=new items as high urgency → CSPS=queue for PE; active work ≥50% scores 1.5×',
  '  VERBATIM: default=refine human text → CSPS=preserve verbatim; ask only if purpose would fail',
  '  VIRTUAL-OPUS: when architectural decision detected → invoke /cruel-critic or /balance-expert BEFORE proposing',
  '',
  '═══════════════════════════════════════════════════════════════════',
].filter(l => l !== null).join('\\n');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: context
  }
}));
" "$REPO_ROOT" 2>/dev/null || printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"[session-open] context load failed — read tools/session-state.json manually"}}'

exit 0
