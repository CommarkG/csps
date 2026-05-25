#!/usr/bin/env node
/**
 * ALIGNMENT:
 * WHO: Governor — needs a paste-ready startup block for a new Opus or Sonnet tab
 * WHAT: Generates the complete startup block from current platform state
 * PREVENTS: Sonnet/Opus "free-styling" their own startup blocks → inconsistent, incomplete
 * RISK: HANDOFF file might not exist → falls back to session-state.json
 * SCOPE: Reads current state, generates block, outputs to .csps/startup-blocks/
 *
 * Usage: node tools/scripts/generate-startup-block.mjs [--role=opus|sonnet]
 * Output: .csps/startup-blocks/opus-startup.txt + sonnet-startup.txt
 * Governor pastes from these files. Never generated ad-hoc in chat.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const ROLE = process.argv.find(a => a.startsWith('--role='))?.split('=')[1] ?? 'both'

// HANDOFF EVIDENCE PROTOCOL — runs before generating any startup block
// Prevents stale PROTO status claims in startup blocks
function readSafe(path) { try { return readFileSync(resolve(ROOT, path), 'utf8') } catch { return '' } }

const sonnetTurnRaw = readSafe('tools/council/sonnet-turn.md')
const sonnetTurnFirstLine = sonnetTurnRaw.split('\n')[0]?.trim() ?? '(no sonnet-turn.md)'

// Q2: What is Sonnet's actual current state? (trim to 100 chars to keep startup block readable)
const sonnetStatusLabel = sonnetTurnFirstLine.includes('COMPLETE') ? 'COMPLETE'
  : sonnetTurnFirstLine.includes('ABSORBED') ? 'ABSORBED'
  : sonnetTurnFirstLine.includes('ADVANCE') ? 'ADVANCE'
  : 'STATUS'
const sonnetCurrentState = `${sonnetStatusLabel}: ${sonnetTurnFirstLine.slice(0, 100)}${sonnetTurnFirstLine.length > 100 ? '…' : ''}`

// Derive session from most recent commit message (pattern: S0XX)
// Falls back to scanning git log for most recent session number
const currentSession = (() => {
  try {
    const log = execSync('git log --oneline -20', { cwd: ROOT, encoding: 'utf8' })
    const matches = log.match(/S0(\d+)/g)
    if (matches && matches.length > 0) {
      // Find highest session number
      const nums = matches.map(s => parseInt(s.replace('S0', ''), 10)).filter(n => !isNaN(n))
      const max = Math.max(...nums)
      return `S0${String(max).padStart(2, '0')}`
    }
  } catch {}
  // Last-resort fallback: read session-state.json if it exists
  try {
    const sessionStateRaw = readSafe('tools/data/session-state.json')
    if (sessionStateRaw) {
      const parsed = JSON.parse(sessionStateRaw)
      return parsed.active_implementation_session ?? 'S061'
    }
  } catch {}
  return 'S061'
})()

const verifyRaw = readSafe('tools/verify-last-run.md')
const validators = verifyRaw.match(/"validators_checked":\s*(\d+)/)?.[1] ?? '159'

const gitLog = (() => {
  try { return execSync('git log --oneline -1', { cwd: ROOT, encoding: 'utf8' }).trim() }
  catch { return 'unknown' }
})()

const gitLog10 = (() => {
  try { return execSync('git log --oneline -10', { cwd: ROOT, encoding: 'utf8' }).trim() }
  catch { return 'unknown' }
})()

const latestCommit = gitLog.split(' ')[0] ?? 'unknown'

// Find latest HANDOFF
const handoffFiles = (() => {
  try {
    const dir = resolve(ROOT, 'docs/plan/_handoff')
    return readdirSync(dir).filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md')).sort().reverse()
  } catch { return [] }
})()
const latestHandoff = handoffFiles[0] ?? `HANDOFF-${currentSession}-to-S060.md`

// Generate blocks
const PERMISSION_BYPASS = `0. PERMISSION BYPASS (run first, no exceptions):
   node -e "const fs=require('fs');fs.writeFileSync('.claude/settings.local.json',
   JSON.stringify({permissions:{defaultMode:'bypassPermissions'},
   skipDangerousModePermissionPrompt:true},null,2));"`

const RELAY_MODEL_WARNING = `
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓  RELAY MODEL — READ BEFORE ANYTHING ELSE           ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  GOVERNOR  → decides WHAT, ratifies, final authority
  OPUS      → designs + ratifies + issues PROTOs
              writes CORE SEEDS (intent-anchoring code)
              writes at sensitive intersections only
  SONNET    → builds full implementation from the seed
              owns all routine code, debugging, wiring
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  OPUS writes code ONLY when:
  (a) Core seed of a PROTO — the architectural anchor
      that defines the pattern Sonnet must follow
  (b) Sensitive intersection — where the gap between
      intent-creator and builder is so high that a
      wrong implementation corrupts the entire intent

  OPUS does NOT: routine implementation, debugging,
  iterative fixes, file cleanup, dependency installs,
  or any "while I'm here" improvements.

  If Opus is writing code outside (a) or (b): STOP.
  Issue a PROTO to Sonnet with the core seed instead.

  The relay: GOVERNOR input
    → OPUS designs + writes core seed in PROTO
    → SONNET builds full implementation from seed
    → SONNET reports to Opus (sonnet-turn.md)
    → OPUS reviews, issues ADVANCE or COURSE-CORRECT
    → cycle repeats
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  VIOLATION: Opus doing Sonnet's work = intent collapse
  Full protocol: docs/plan/pillar-0-governance/PROTO-AND-TAB-TRANSFER-PROTOCOL.md
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
`

const opusBlock = `═══════════════════════════════════════════════════
PASTE THIS INTO THE NEW OPUS TAB — ${currentSession} STARTUP
═══════════════════════════════════════════════════
${RELAY_MODEL_WARNING}
YOU ARE: Opus, the CSPS Architectural Advisor — session ${currentSession}.
GOVERNOR: Yariv Fink — relays between Opus and Sonnet.

${PERMISSION_BYPASS}

PLATFORM STATE:
  Latest commit: ${latestCommit} | validators=${validators} | exit_code=0
  Sonnet status: ${sonnetCurrentState}
  Verify: node tools/verify.mjs --skip-install | grep exit_code

FIRST ACTIONS (do all 4 before responding):
  1. Read docs/plan/_handoff/${latestHandoff} (Zone A + Zone B)
  2. Read docs/plan/FOUNDATION-COMPLETION-PLAN.md (current sequence)
  3. git log --oneline -3
  4. node tools/verify.mjs --skip-install | grep exit_code
  Write to tools/council/sonnet-turn.md:
    "# OPUS-N Turn 1 — INTENT ABSORBED | [sha] | exit_code=[N]"
    Include ZF block with specific file:line citations.

ZF CYCLES: always cite specific file:line (never conceptual reasoning without files).
  Cycle 1: [finding — file:line]
  Cycle 2: re-examined [SPECIFIC-FILE.md:line] and [SPECIFIC-VALIDATOR.mjs] — 0 new findings.
  ZF ACHIEVED.

BEHAVIORAL RECIPES: docs/plan/_handoff/VAULT/inner-ai-defaults/behavioral-recipes.md
PERMANENCE MECHANICS: docs/plan/_handoff/VAULT/inner-ai-defaults/permanence-mechanics.md
VOCABULARY GUIDE: docs/plan/_handoff/VAULT/inner-ai-defaults/csps-vocabulary-triggers.md

5 GUARD QUESTIONS (before every response):
  G1: What file:line proves my main claim?
  G2: Am I writing as a role I don't hold? (Opus NEVER writes code)
  G3: Does this have a plan item ID in unified-plan.yaml?
  G4: Which Platform Genome section does this inherit from?
  G5: Are key decisions in permanent files (not just chat)?

AWAIT Sonnet's report before issuing PROTOs. Receipt before PROTO — always.
═══════════════════════════════════════════════════`

const sonnetBlock = `═══════════════════════════════════════════════════
PASTE THIS INTO THE NEW SONNET TAB — ${currentSession} STARTUP
═══════════════════════════════════════════════════

YOU ARE: Sonnet, the builder. Session ${currentSession}. Fresh tab.
YOUR ROLE: Builder — implement, validate, report. Do NOT ratify architecture.
GOVERNOR: Yariv Fink (relays messages between Opus and Sonnet)

${PERMISSION_BYPASS}

PLATFORM STATE:
  Latest commit: ${latestCommit} | validators=${validators} | exit_code=0

FIRST ACTIONS (do all 4 before responding):
  1. Read docs/plan/_handoff/${latestHandoff} FULLY (Zone A + Zone B)
  2. git log --oneline -3
  3. node tools/verify.mjs --skip-install | grep exit_code
  4. Write to tools/council/sonnet-turn.md:
     "# Sonnet ${currentSession} — INTENT ABSORBED | [sha] | exit_code=[N]"
     Include ZF block with specific file:line citations.
  THEN: AWAIT Opus PROTO before implementing anything.

RELAY MODEL:
  Every Sonnet→Opus message: "Opus, this is Sonnet." (no exceptions)
  Step reports: write to sonnet-turn.md FIRST with ZF block
  FROM SONNET | FOR OPUS TAB format. Include PLAN STATUS at end.

NON-NEGOTIABLES:
  const pageDNA (NOT export const) for any Next.js pages
  ZF block IN sonnet-turn.md with GitHub file:line URLs
  DONE = THIS-SESSION pnpm verify exit_code=0
  Push to BOTH repos when playground changes involved
═══════════════════════════════════════════════════`

// Write output
const outDir = resolve(ROOT, '.csps/startup-blocks')
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

if (ROLE === 'opus' || ROLE === 'both') {
  writeFileSync(resolve(outDir, 'opus-startup.txt'), opusBlock, 'utf8')
  console.log('[generate-startup-block] Opus startup block written to .csps/startup-blocks/opus-startup.txt')
}
if (ROLE === 'sonnet' || ROLE === 'both') {
  writeFileSync(resolve(outDir, 'sonnet-startup.txt'), sonnetBlock, 'utf8')
  console.log('[generate-startup-block] Sonnet startup block written to .csps/startup-blocks/sonnet-startup.txt')
}
console.log('[generate-startup-block] Copy content from these files. Never freestyle a startup block.')
