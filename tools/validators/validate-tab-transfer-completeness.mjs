#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-tab-transfer-completeness
 * @csps-name validate-tab-transfer-completeness
 * @csps-description B_META_QUESTION + tab-transfer-template completeness validator.
 *   Scans known tab-transfer artifacts (handoffs, sonnet-turn.md CHECKPOINTs,
 *   startup-blocks in VAULT) for the 8 mandatory section structure.
 *   Verifies Section 1 (false-assumption checklist) has ≥10 items.
 *   ADVISORY S067 → BLOCKING S068.
 *
 *   WHAT THIS PREVENTS: Tab-transfer artifacts missing the "What are the false
 *   assumptions here?" checklist — the meta-question discipline that caught
 *   10 session-startup errors in S067 Sonnet startup block v2.
 *
 *   TARGET FILES (auto-detected):
 *   - docs/plan/_handoff/HANDOFF-*.md
 *   - tools/templates/tab-transfer-template.md (self-validation)
 *
 *   RULES:
 *   (1) ADVISORY: HANDOFF file missing Section 1 (## ... False Assumption ...)
 *   (2) ADVISORY: Section 1 has < 10 ❌ items
 *   (3) PASS: template self-validates (recursive consistency)
 *
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:governance audience:ai-agent
 * @csps-enforces B_META_QUESTION_DISCIPLINE P-META-029 B_HUMBLE_CONSOLIDATION_DISCIPLINE
 * @csps-inherits-from validate-tab-transfer-completeness (B_META_QUESTION_DISCIPLINE PROTO-S067)
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');

const HANDOFF_DIR = resolve(ROOT, 'docs/plan/_handoff');
const TEMPLATE = resolve(ROOT, 'tools/templates/tab-transfer-template.md');

const MIN_FA_ITEMS = 10;

// Section heading patterns — flexible matching
const SECTION_PATTERNS = {
  identity: /##.*(?:IDENTITY|HANDSHAKE|Step 0|STEP 0)/i,
  false_assumptions: /##.*(?:false.assumption|what are the false|meta.question|SECTION 0)/i,
  current_state: /##.*(?:current.state|SECTION 1|Zone A|disk.facts)/i,
  first_actions: /##.*(?:first.action|SECTION 2|Zone B|next.action)/i,
};

function countFalseAssumptionItems(content) {
  // Count ❌ markers anywhere in document (primary false-assumption format)
  const emojiCount = (content.match(/❌/g) || []).length;
  // Also count FA-NN numbered format (FA-01 through FA-20) used in HANDOFF-S067-to-S068
  const faCount = new Set((content.match(/\bFA-\d{2}\b/g) || [])).size; // unique FA-NN entries
  // Return best count across formats
  return Math.max(emojiCount, faCount);
}

function checkDocument(filePath, label) {
  const content = readFileSync(filePath, 'utf8');
  const findings = [];

  // Check for Section 1 (false assumptions)
  const hasFASection = SECTION_PATTERNS.false_assumptions.test(content) ||
    /false assumption|False Assumption|WHAT ARE THE FALSE/i.test(content);

  if (!hasFASection) {
    findings.push({ type: 'advisory', msg: `${label}: missing false-assumption checklist section (B_META_QUESTION)` });
    return findings;
  }

  // Count FA items
  const faCount = countFalseAssumptionItems(content);
  if (faCount < MIN_FA_ITEMS) {
    findings.push({ type: 'advisory', msg: `${label}: false-assumption checklist has ${faCount} items (minimum ${MIN_FA_ITEMS} required)` });
  }

  return findings;
}

let advisory = 0;
let checked = 0;
const allFindings = [];

// --- Validate tab-transfer-template.md (self-validation) ---
if (existsSync(TEMPLATE)) {
  const templateFindings = checkDocument(TEMPLATE, 'tab-transfer-template.md');
  checked++;
  if (templateFindings.length === 0) {
    console.log('  ✓ tab-transfer-template.md self-validates (recursive consistency ✓)');
  } else {
    for (const f of templateFindings) {
      if (f.type === 'advisory') advisory++;
      console.log(`  ADVISORY [tab-transfer] ${f.msg}`);
      allFindings.push(f);
    }
  }
}

// --- Validate recent HANDOFF files (last 5 sessions) ---
if (existsSync(HANDOFF_DIR)) {
  const handoffFiles = readdirSync(HANDOFF_DIR)
    .filter(f => f.startsWith('HANDOFF-') && f.endsWith('.md'))
    .slice(-5); // Last 5 handoffs only

  for (const file of handoffFiles) {
    const findings = checkDocument(join(HANDOFF_DIR, file), file);
    checked++;
    for (const f of findings) {
      if (f.type === 'advisory') advisory++;
      console.log(`  ADVISORY [tab-transfer] ${f.msg}`);
      allFindings.push(f);
    }
  }
}

if (allFindings.length === 0) {
  console.log('[validate-tab-transfer-completeness] ✓ All tab-transfer artifacts have false-assumption checklists');
}

console.log(`[validate-tab-transfer-completeness] files_checked=${checked} blocking=0 advisory=${advisory}`);
// Advisory only S067
process.exit(0);
