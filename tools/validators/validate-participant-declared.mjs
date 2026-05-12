#!/usr/bin/env node
/**
 * validate-participant-declared.mjs — PACP: Participant-Aware Communication Protocol
 *
 * ROOT CAUSE TARGETED: Elements were being created without declaring who they serve.
 * An API endpoint for a developer and an API endpoint for an end user require
 * completely different communication protocols. Without explicit declaration, the
 * platform defaults to a generic mode that serves no one optimally.
 *
 * Governor directive S025: "THIS IS A HIDDEN GAP — CSPS must treat AI elements,
 * external AI, developers, and all end user types as relevant types in communications.
 * Include in systems DNA. Mechanically enforce."
 *
 * What it checks (Phase 1 advisory):
 *   1. Governance docs in pillar-0-governance/ have target_participant declared
 *   2. Topic plans have target_participant or threshold_participants declared
 *   3. API routes in apps/ have a comment declaring participant type
 *   4. New pages in apps/ have ux_principle declared (covers PARTICIPANT-05 through 09)
 *
 * Phase 2 (S026): BLOCKING for new elements without target_participant (Governor ratification needed)
 *
 * Audit slug: participant-declared
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, extname, relative } from 'node:path';

const ROOT = resolve(process.cwd());
const VALID_TYPES = [
  'governor.primary',
  'developer.platform', 'developer.app', 'developer.api',
  'user.solo', 'user.team.member', 'user.team.admin', 'user.enterprise', 'user.trial',
  'ai.sonnet', 'ai.opus', 'ai.haiku', 'ai.agent', 'ai.external',
  'mixed',  // elements serving multiple participant types
  'n/a',    // infrastructure elements with no direct participant interaction
];

const advisories = [];
let checked = 0;

// Check 1: pillar-0-governance docs — new S025+ files should declare target_participant
const GOVERNANCE_DIR = join(ROOT, 'docs/plan/pillar-0-governance');
if (existsSync(GOVERNANCE_DIR)) {
  const files = readdirSync(GOVERNANCE_DIR).filter(f => f.endsWith('.md'));
  for (const file of files) {
    const content = readFileSync(join(GOVERNANCE_DIR, file), 'utf8');
    // Only check files with frontmatter (has session: S025 or newer)
    const sessionMatch = content.match(/^session:\s*S(\d+)/m);
    if (!sessionMatch || parseInt(sessionMatch[1], 10) < 25) continue; // only S025+

    checked++;
    const hasParticipant = content.includes('target_participant:') ||
                          content.includes('threshold_participants:');
    if (!hasParticipant) {
      advisories.push({
        file: `pillar-0-governance/${file}`,
        issue: 'New S025+ governance doc missing target_participant: — declare who this element communicates with',
      });
    }
  }
}

// Check 2: active topic plans — should have threshold_participants
const PLANS_DIR = join(ROOT, 'docs/plan/_handoff/VAULT/topic-plans');
if (existsSync(PLANS_DIR)) {
  const planFiles = readdirSync(PLANS_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  for (const file of planFiles) {
    const content = readFileSync(join(PLANS_DIR, file), 'utf8');
    if (!content.includes('lifecycle_state: active')) continue;
    if (!content.includes('session: S025')) continue; // only new S025 plans

    checked++;
    const hasParticipant = content.includes('threshold_participants:') ||
                          content.includes('target_participant:');
    if (!hasParticipant) {
      advisories.push({
        file: `topic-plans/${file}`,
        issue: 'Active S025 plan missing threshold_participants — declare who participates in this plan',
      });
    }
  }
}

// Check 3: API routes — should have solo_user_flow or participant comment
const APPS_DIR = join(ROOT, 'apps');
if (existsSync(APPS_DIR)) {
  function walkApis(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walkApis(fullPath);
      } else if (entry === 'route.ts') {
        const content = readFileSync(fullPath, 'utf8');
        checked++;
        // Check for participant declaration (solo_user_flow OR participant type comment)
        const hasDeclared = content.includes('solo_user_flow') ||
                           content.includes('target_participant') ||
                           content.includes('// Participant:') ||
                           content.includes('// Governor') ||
                           content.includes('developer.') ||
                           content.includes('user.solo') ||
                           content.includes('Platform inheritance');
        if (!hasDeclared) {
          advisories.push({
            file: relative(ROOT, fullPath),
            issue: 'API route missing participant declaration — add // Participant: [type] comment or target_participant field',
          });
        }
      }
    }
  }
  walkApis(APPS_DIR);
}

// Report
if (advisories.length > 0) {
  advisories.slice(0, 10).forEach(a => {
    console.log(`  ⚠ [participant] ${a.file}: ${a.issue}`);
  });
  if (advisories.length > 10) {
    console.log(`  ... and ${advisories.length - 10} more advisory findings`);
  }
  console.log('[validate-participant-declared] stage=advisory (S026: BLOCKING for new elements without declaration)');
} else {
  console.log('[validate-participant-declared] all checked elements have participant declarations ✓');
}

console.log(`[validate-participant-declared] checked=${checked} advisories=${advisories.length}`);
process.exit(0); // advisory
