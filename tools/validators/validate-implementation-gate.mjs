#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-implementation-gate
 * @csps-name validate-implementation-gate
 * @csps-description PIG: Implementation Gate — advisory check that commits touching libs/ or apps/
 * reference a ratified PI item in the commit message. Reads git log -1 --name-only to check the
 * last commit. ADVISORY severity (transition period per Opus Turn 62 + PI-003). Never BLOCKING until
 * PI backfill across all existing commits is complete.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:developer
 * @csps-enforces P-ARCH-031
 *
 * Coverage Levels:
 *   ✓ Checks: last commit message + files touched
 *   ✓ Detects: lib/app changes without PI reference
 *   ✗ Does not check: older commits (only the most recent)
 *   ✗ Does not verify: PI item actually exists (only checks message pattern)
 *
 * Exit: 0 always (ADVISORY — exits 1 reserved for future BLOCKING phase)
 * Output: advisories=N
 */

import { execSync } from 'node:child_process';

const PI_PATTERN = /\bPI-\d{3}\b/;
const EXEMPT_PREFIXES = ['fix:', 'chore:', 'docs:', 'style:', 'test:', 'revert:', 'ci:'];

let advisories = 0;

try {
  // Get last commit: message on first line, then file list
  const raw = execSync('git log -1 --name-only --format="%s"', { encoding: 'utf-8' }).trim();
  const lines = raw.split('\n').filter(l => l.trim() !== '');

  if (lines.length === 0) {
    console.log(`[validate-implementation-gate] no commits found advisories=0`);
    process.exit(0);
  }

  const commitMessage = lines[0].trim();
  const filesChanged = lines.slice(1).map(l => l.trim()).filter(Boolean);

  const touchesLibsOrApps = filesChanged.some(f =>
    f.startsWith('libs/') || f.startsWith('apps/')
  );

  if (!touchesLibsOrApps) {
    console.log(`[validate-implementation-gate] no libs/apps changes advisories=0`);
    process.exit(0);
  }

  const isExempt = EXEMPT_PREFIXES.some(p => commitMessage.startsWith(p));
  const hasPI = PI_PATTERN.test(commitMessage);

  if (!isExempt && !hasPI) {
    advisories++;
    console.warn(
      `[validate-implementation-gate] ADVISORY: commit "${commitMessage.slice(0, 60)}" touches libs/ or apps/ but has no PI-NNN reference.\n` +
      `  Files touched: ${filesChanged.filter(f => f.startsWith('libs/') || f.startsWith('apps/')).slice(0, 5).join(', ')}\n` +
      `  Fix: add PI-NNN (the ratified plan item) to your commit message, or use fix:/chore:/docs: prefix for non-implementation changes.\n` +
      `  Create a PI: pnpm create:pi --title "Your feature" --spine ARCH --pe 75`
    );
  }

} catch (err) {
  // Not a git repo or git log failed — skip gracefully
  console.log(`[validate-implementation-gate] git unavailable — skipping advisories=0`);
  process.exit(0);
}

console.log(`[validate-implementation-gate] advisories=${advisories}`);
process.exit(0); // always exits 0 — ADVISORY only
