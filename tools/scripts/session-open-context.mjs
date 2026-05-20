/**
 * @csps-id csps.tools.scripts.session-open-context
 * @csps-name session-open-context
 * @csps-description Generates the SessionStart context injection for session-open.sh.
 *   Extracted from session-open.sh to avoid bash double-quote entanglement in node -e "..."
 *   All session state, PE priorities, communication protocol rules, and governance context
 *   computed here and emitted as JSON for Claude Code's hookSpecificOutput mechanism.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:governance audience:ai-agent
 * @csps-enforces P-META-020 B_COGNITIVE_CONTEXT_DISCIPLINE
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = process.env.CSPS_REPO_ROOT || process.cwd();

// ── ZF Tracker — reset per-session fields ────────────────────────────────────
let zfIterations = 0, zfBlockingTotal = 0, zfOrchestratorCycles = 0, zfLastStatus = 'not-run';
try {
  const trackerPath = join(ROOT, 'tools/zf-session-tracker.json');
  const t = JSON.parse(readFileSync(trackerPath, 'utf8'));
  zfIterations = t.verify_runs || 0;
  zfBlockingTotal = t.blocking_found_total || 0;
  zfOrchestratorCycles = t.orchestrator_cycles || 0;
  zfLastStatus = t.orchestrator_last_status || 'not-run';
  t.zf_deep_runs_this_session = 0;
  t.zf_deep_last_run_at = null;
  t.zf_deep_last_status = 'not-run-this-session';
  t.harvest_done_this_session = false;
  t.harvest_done_at = null;
  t.verify_runs = 0;
  writeFileSync(trackerPath, JSON.stringify(t, null, 2));
} catch(e) { /* no tracker yet */ }

// ── Session state ─────────────────────────────────────────────────────────────
let session = '?', mandate = 'unknown', blocking = 'NONE', verifyState = 'unknown';
let opusStatus = 'not tracked', opusEnfRate = '', taskListRef = '', mentalModelsRef = '';
let sessionRole = 'sonnet-builder', councilStatus = '', zoomOutSignal = '';

try {
  const d = JSON.parse(readFileSync(join(ROOT, 'tools/session-state.json'), 'utf8'));
  session = d.current_session || '?';
  mandate = (d.session_mandate || {}).primary || 'unknown';
  const unresolved = (d.blocking_decisions || []).filter(x => x.status !== 'RESOLVED').map(x => x.id);
  blocking = unresolved.length ? unresolved.join(', ') : 'NONE';
  verifyState = (d.platform_state || {}).pnpm_verify || 'unknown';

  const opusAudit = d.opus_audit || {};
  const opusSince = opusAudit.sessions_since_opus_review ?? 'unknown';
  const opusDue = opusAudit.opus_audit_due === true;
  const opusNext = opusAudit.next_opus_review_due || 'unknown';
  const opusRate = opusAudit.enforcement_rate_at_last_review ?? 'unknown';
  opusStatus = opusDue
    ? 'WARNING OVERDUE — set opus_audit_due=false after review'
    : opusSince + '/10 sessions since last review (next: ' + opusNext + ')';
  opusEnfRate = opusRate + '% behavioral enforcement (target 25% by S025)';

  const opusArtifacts = d.s019_opus_artifacts || {};
  taskListRef = opusArtifacts.s020_task_list || 'not set';
  mentalModelsRef = opusArtifacts.mental_models || 'not set';
  sessionRole = d.session_role || 'sonnet-builder';

  const sessionsSince = (d.opus_audit || {}).sessions_since_opus_review || 0;
  if (sessionsSince >= 5) {
    zoomOutSignal = 'ZOOM-OUT SIGNAL: ' + sessionsSince + '/10 sessions since Opus review';
  }

  try {
    const cState = JSON.parse(readFileSync(join(ROOT, 'tools/council/council-state.json'), 'utf8'));
    if (cState.status === 'in-progress') {
      councilStatus = 'WARNING COUNCIL IN-PROGRESS: ' + (cState.council_id || 'unknown') +
        ' — whose turn: ' + (cState.whose_turn || 'unknown') +
        ' | read tools/council/PROTOCOL.md';
    } else if (cState.status === 'consensus-reached') {
      councilStatus = 'Last council: ' + (cState.council_id || 'unknown') + ' — consensus reached';
    }
  } catch(e) {}
} catch(e) {}

// ── Opus open items — count PENDING (Gap 3: must be checked before starting work) ──
let opusOpenPending = 'not read', opusOpenLastUpdate = '';
try {
  const ooi = readFileSync(join(ROOT, 'tools/council/opus-open-items.md'), 'utf8');
  const pendingRows = ooi.split('\n').filter(l => /\|\s*pending/.test(l) || /\|\s*awaiting/.test(l));
  const updatedMatch = ooi.match(/Updated:\s*([^\n]+)/);
  opusOpenPending = pendingRows.length + ' pending items';
  opusOpenLastUpdate = updatedMatch ? updatedMatch[1].trim() : 'unknown';
} catch(e) { opusOpenPending = 'file not found'; }

// ── Communication protocol compliance (Gap 2) ─────────────────────────────────
let commProtocolStatus = 'not checked';
try {
  const cpOut = execSync('node tools/validators/validate-communication-protocol.mjs 2>&1', { cwd: ROOT, encoding: 'utf8', timeout: 10000 });
  const m = cpOut.match(/advisory=(\d+)/);
  const count = m ? Number(m[1]) : 0;
  commProtocolStatus = count === 0 ? 'CLEAN (0 advisories)' : count + ' advisory(ies) — run validate-communication-protocol.mjs';
} catch(e) { commProtocolStatus = 'validator error — run manually'; }

// ── Last Sonnet report session (Gap 5) ────────────────────────────────────────
let lastSonnetReport = 'not tracked';
try {
  const cs = JSON.parse(readFileSync(join(ROOT, 'tools/council/council-state.json'), 'utf8'));
  lastSonnetReport = cs.sonnet_last_report_session || 'not set';
} catch(e) {}

// ── Open plan levels ──────────────────────────────────────────────────────────
let openLevels = 'validator not run';
try {
  const out = execSync('node tools/validators/validate-open-plan-levels.mjs 2>&1', { cwd: ROOT, encoding: 'utf8', timeout: 10000 });
  const match = out.match(/plans_checked=\d+ plans_with_open=\d+ total_open_items=\d+/);
  openLevels = match ? match[0] : 'see validate-open-plan-levels.mjs';
} catch(e) { openLevels = 'validator error — run manually'; }

// ── PE dashboard top-5 ────────────────────────────────────────────────────────
let peTop5 = 'not computed';
try {
  const peOut = execSync('node tools/validators/validate-pe-dashboard.mjs 2>&1', { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  const lines = peOut.split('\n').filter(l => /^\s+\d+\s+│/.test(l)).slice(0, 5);
  peTop5 = lines.length > 0 ? '\n' + lines.map(l => '    ' + l.trim()).join('\n') : 'no scored plans found';
} catch(e) { peTop5 = 'pe-dashboard error — run manually'; }

// ── Foundation exit gate ──────────────────────────────────────────────────────
let foundationGateStatus = 'UNKNOWN', foundationGateBLOCKING = false;
try {
  execSync('node tools/validators/validate-phase-exit-criteria.mjs', { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  foundationGateStatus = 'CLEAN';
} catch(fErr) {
  foundationGateBLOCKING = true;
  foundationGateStatus = 'BLOCKING';
}
const mandateOverride = foundationGateBLOCKING ? '  *** FOUNDATION_EXIT_GATE BLOCKING — MANDATE SUSPENDED ***' : '';

// ── Raw thoughts queue ────────────────────────────────────────────────────────
let pendingThoughtsSummary = '0 pending';
try {
  const qText = readFileSync(join(ROOT, 'docs/plan/_intake/raw-thoughts-queue.md'), 'utf8');
  const pending = qText.split('\n').filter(l => l.match(/STATUS: PENDING/));
  if (pending.length > 0) {
    const previews = pending.slice(0, 2).map(l => l.split(' -> ')[0].trim().slice(0, 60));
    pendingThoughtsSummary = pending.length + ' pending: ' + previews.join(' | ');
  }
} catch(e) { pendingThoughtsSummary = 'queue not found'; }

// ── Stale plan alignment ──────────────────────────────────────────────────────
let stalePlansSummary = '0 stale unverified';
try {
  const spOut = execSync('node tools/validators/validate-plan-age-alignment.mjs 2>&1', { cwd: ROOT, encoding: 'utf8', timeout: 15000 });
  const m = spOut.match(/unverified=(\d+)/);
  const count = m ? Number(m[1]) : 0;
  stalePlansSummary = count > 0 ? count + ' plans need alignment — review before executing' : '0 stale unverified';
} catch(e) { stalePlansSummary = 'validator error'; }

// ── Build output ──────────────────────────────────────────────────────────────
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
  '╠══════════════════════════════════════════════════════════════════╣',
  '║  MODEL IDENTITY CHECK (S049 — PI: MODEL-IDENTITY-HOOK)          ║',
  '║  Workspace default: claude-sonnet-4-6[1m] (settings.json)       ║',
  '║  Picker checkmark = ACTIVE model for THIS tab (overrides above) ║',
  '║  → Check model picker NOW before proceeding.                    ║',
  '║  SONNET tab: await PROTO directive. OPUS tab: read + direct.    ║',
  '╚══════════════════════════════════════════════════════════════════╝',
  '',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'FILE OPERATIONS — ALL PRE-AUTHORIZED (no permission prompts needed):',
  '  Write, Edit, Bash, Read — ALL pre-authorized via defaultMode: bypassPermissions.',
  '  DO NOT ask: "May I write to X?" | "Should I proceed?" | "Do you want me to?"',
  '  Execute -> report what was done -> continue. Never ask before a file operation.',
  '  Playground at c:\\Users\\finky\\Desktop\\csps-playground is also authorized.',
  '',
  'COMMUNICATION PROTOCOL — MANDATORY (tools/council/communication-protocol-shared.md):',
  '',
  'RULE 1 — Identity Handshake (NO EXCEPTIONS):',
  '  EVERY message Sonnet writes to Opus MUST start: Opus, this is Sonnet.',
  '  This is the FIRST WORD of every cross-boundary message. No exceptions.',
  '  Missing handshake = malformed message. Opus flags before acting.',
  '',
  'RULE 3 — Report format (Sonnet to Opus):',
  '  Opus, this is Sonnet. [step] done at commit [sha] — [items].',
  '  Specific questions: (1)... (2)...',
  '  Always includes commit SHA. Questions numbered. No paraphrasing.',
  '',
  'RULE 10 — Context Block (EVERY cross-boundary message):',
  '  YOU ARE: [exact role of receiver]',
  '  I AM: [the DRAFTER — Sonnet when Sonnet writes; Opus when Opus writes]',
  '  THIS IS THE SITUATION: [2-3 sentences max]',
  '  YOUR TASK: [one specific action right now]',
  '  This block goes FIRST before any directive body.',
  '',
  'RULE 6 — Completion Standard (P-ARCH-031 — B_VALIDATE_BEFORE_ASSUME):',
  '  DONE = built + wired + called + output verified.',
  '  node tools/verify.mjs exit_code=0 is REQUIRED. tsc --noEmit alone is NOT done.',
  '  For app changes: pnpm --filter @csps/[app] build must also pass.',
  '  Never declare DONE on commit alone. Wiring-completeness validator must pass.',
  '',
  'RULE 12 — Governor Completeness (CONSTITUTIONAL — B_ZERO_NAVIGATION_FOR_GOVERNOR):',
  '  FULL content inline in THE SAME MESSAGE. Governor never scrolls or navigates.',
  '  FORBIDDEN: see above | paste from [link] | from my prior response | relay from sonnet-turn.md',
  '  This applies to OPTIMAL NEXT STEP blocks. Linking to sonnet-turn.md = violation.',
  '  Governor receives a ready-to-paste block, right here, every time.',
  '  ENFORCED by: post-stop-banned-phrase.sh (T1) + validate-governor-instructions.mjs (T2)',
  '',
  'SONNET REPORT TEMPLATE (use this — do not invent format):',
  '  File: tools/templates/sonnet-report.template.md',
  '  When: every write to tools/council/sonnet-turn.md (mid-session or close)',
  '  Check: docs/plan/_handoff/VAULT/template-registry.md before authoring ANY governed artifact',
  '  Protocol compliance: ' + commProtocolStatus,
  '  Last Sonnet report to Opus: ' + lastSonnetReport,
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '',
  'SESSION STATE:',
  '  Session: ' + session,
  '  Mandate: ' + mandate,
  '  Blocking: ' + blocking,
  '  Platform verify: ' + verifyState,
  '  Open plan levels: ' + openLevels,
  '  Opus open items: ' + opusOpenPending + ' (last updated: ' + opusOpenLastUpdate + ')',
  '  -> CHECK tools/council/opus-open-items.md BEFORE starting any work this session',
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
  'CONTEXT ALIGNMENT PREAMBLE (CAP):',
  '',
  'Q1 SCOPE: I can see files explicitly loaded this session.',
  '          I CANNOT see: prior chat sessions, unloaded files, other tabs.',
  '          Always verify state with a tool call before claiming it.',
  '',
  'Q2 AUDIENCE: Participant type = [' + sessionRole + ']',
  '             Vocabulary: technical developer (not general user) by default.',
  '',
  'Q3 ASSUMPTIONS: Before any consequential action, name 3 unverified assumptions.',
  '                If any is wrong, the whole response may be wrong.',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '',
  'ZF ITERATION TRACKER (this session):',
  '  verify_runs: ' + zfIterations + ' | blocking_found_total: ' + zfBlockingTotal,
  '  orchestrator_cycles: ' + zfOrchestratorCycles + ' | last_status: ' + zfLastStatus,
  '  Per P-META-021: iteration count is MEASUREMENT. 0 iterations = no ZF work done yet.',
  '',
  'CONCEPT-FIRST ACTIVATION PROTOCOL (P-META-020 — non-negotiable):',
  'Before processing ANY request, identify the governing L2 spine:',
  '  User directive / ratification  -> GVRN L2 (decision rights)',
  '  Schema / code implementation   -> ARCH L2 (data domain)',
  '  AI behavior / defaults         -> AI L2 (inner-defaults domain)',
  '  Validation / evidence claims   -> VALD L2 (coverage discipline)',
  '  External content / research    -> AI L2 (alignment domain) + VAULT_DEFER',
  '',
  'TRIAD GOVERNANCE (P-META-021):',
  '  CONTEXT = load the L2 spine domain | PRINCIPLE = name the P-* or B_* rule | MECHANICAL = hook/validator fires independently',
  '  Any consequential decision using <3 layers = governance gap.',
  '',
  '16 DECISION HYGIENE QUESTIONS:',
  '  Q1:  Which L2 spine domain governs THIS input? (GVRN/ARCH/AI/VALD/OPER)',
  '  Q2:  Is this decision consequential? (hard-to-reverse/multi-artifact/new-class/blocks)',
  '  Q3:  Do I have all 3 triad layers? Can I NAME domain + principle + mechanical?',
  '  Q4:  Did the ZF cycle return ZERO new findings, or did I stop when comfortable?',
  '  Q5:  Is my next step based on PE scoring or on reading session-state sequence?',
  '  Q6:  Are there PENDING VLTs? Registered is not resolved. PENDING = phase blocked.',
  '  Q7:  Is this a DONE claim? Do I have THIS-SESSION verify evidence, not memory?',
  '  Q8:  What structural failure does this instruction prevent? (WHY, not WHAT)',
  '  Q9:  Am I extracting at least 1 positive ZF output from this finding?',
  '  Q10: Is my proposed next step the highest-PE item, or the most comfortable one?',
  '  Q11: Does this session touch any hierarchical config? All critical fields EXPLICIT at child level?',
  '  Q12: Is FOUNDATION_EXIT_GATE CLEAN? BLOCKING = PE score for phase advance = 0.',
  '  Q13: PLATFORM-FIRST: Is this solution platform-generalizable? Vault before implementing locally.',
  '  Q14: COMPLETION BIAS: Active work >50% complete scores 1.5x in PE.',
  '  Q15: INITIATED BY WHOM: AI-proactive App-layer work -> vault it. Governor-directed -> execute.',
  '  Q16: VERBATIM CHECK: Did user provide exact text? Copy exactly, no improvements.',
  '',
  'PRACE — PERMANENT RECURRING AI CONTEXTUAL ENFORCEMENT (CONSTITUTIONAL — S040, M-27):',
  '  Every governance rule requires ALL of these before it is DONE:',
  '    TRAINING DEFAULT: which Claude default does this rule override?',
  '    SATISFACTION POINT: what incorrect done feeling does this rule prevent?',
  '    T1: which hook fires on violation? (must exit 1 on detection)',
  '    T2: which validator BLOCKS commits? (must be wired to pnpm verify)',
  '    T3: this injection — necessary but NOT sufficient alone. T3-only = will drift by turn 10.',
  '  Writing a rule is NOT done. T1+T2+T3 all firing = done.',
  '',
  'CAQ — CONTEXT ALIGNMENT QUESTION (M-28 — S043):',
  '  A CAQ is a proactive question fired by context signals — not memory or habit.',
  '  Fire a CAQ when: (1) making a consequential decision, (2) approaching a maturity threshold,',
  '    (3) confidence exceeds verifiable evidence, (4) edge case invocation is being considered.',
  '  CAQ template: "What is the original intent this serves? What am I assuming about current',
  '    state that I have not verified? What changes if I am wrong?"',
  '  CAQs are NOT optional — they replace confidence with verification.',
  '  Permanently triggered by: ai-profiler.sh (T1) + plan-readiness.mjs (T2) + this injection (T3)',
  '',
  'PERMANENT CONTEXT BRIEFS (read these — they are updated each session close):',
  '  Opus tab: tools/council/opus-context.md — WHO YOU ARE, relay model, format, platform state',
  '  Sonnet tab: tools/council/sonnet-context.md — role, format, done criteria, handoff',
  '  Both updated S044. If something feels missing: read these files first.',
  '',
  'B_ZERO_NAVIGATION_FOR_GOVERNOR (CONSTITUTIONAL — S040, Rule 12):',
  '  When instructing the Governor -> ALL content must be inline in THE SAME MESSAGE.',
  '  FORBIDDEN: see above | paste from earlier | from my prior response | as before.',
  '  Governor starts from ZERO. Content needed = in THIS response.',
  '  Applies to: Sonnet AND Opus equally.',
  '  Enforced by: post-stop-banned-phrase.sh (T1) + validate-governor-instructions.mjs (T2)',
  '',
  'ZERO-LAPTOP ENFORCEMENT (B_ZERO_LAPTOP_DEPENDENCY — P-OPER-001 MANDATORY):',
  '  ALL deployment, testing, credential work must be CLOUD-FIRST.',
  '  FORBIDDEN: pnpm dev | localhost:PORT | .env.local | npm run dev',
  '  REQUIRED: vercel --prod | Vercel preview URL | vercel env add | Codespaces',
  '',
  'SESSION NAMING CONVENTION (first message = permanent tab name):',
  '  OPUS-1, OPUS-2   -> Opus Advisor (instance-numbered)',
  '  SONNET-S[NNN]    -> Sonnet Builder (session-numbered)',
  '',
  'ACTIVE MECHANICAL ENFORCEMENT THIS SESSION:',
  '  pre-tool-use-plan-coverage-gate.sh  — blocks libs/apps writes without plan',
  '  post-stop-pnpm-verify.sh            — runs verify + ZF reasoning every stop',
  '  validate-open-plan-levels.mjs       — open items surfaced (obligations)',
  '  validate-vlt-blocking.mjs           — PENDING VLTs warn at every verify',
  '  validate-phase-exit-criteria.mjs    — FOUNDATION_EXIT_GATE',
  '',
  'FORMATTING (EP-ERR-007):',
  '  EVERY file path in chat output = clickable markdown link: [name](path)',
  '  post-stop-link-discipline.sh fires on every response to detect violations.',
  '',
  'ALIGNMENT QUESTIONS + ENFORCEMENT TRIO:',
  '  EVERY HANDOFF and chat-transfer must include ALIGNMENT QUESTIONS section.',
  '  EVERY new rule/principle/contract must have enforcement_trio: at creation time.',
  '  T1 = hook | T2 = validator | T3 = session-open.',
  '',
  'AI BEHAVIOR OVERRIDES — ACTIVE:',
  '  BOUNDARY: default=assume shared context -> CSPS=WHO/WHAT/HOW/NOW at every crossing',
  '  CORE-FIRST: default=accept session-state -> CSPS=validate phase exit criteria first',
  '  RULE-SCOPE: default=blanket Never-X rules -> CSPS=every rule has CONCEPT+SCOPE+ESCAPE',
  '  COMPLETION: default=new items as high urgency -> CSPS=queue for PE; active work scores 1.5x',
  '  VERBATIM: default=refine human text -> CSPS=preserve verbatim',
  '  VIRTUAL-OPUS: architectural decision detected -> invoke /cruel-critic or /balance-expert FIRST',
  '',
  '═══════════════════════════════════════════════════════════════════',
].filter(l => l !== null).join('\n');

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: context
  }
}));
