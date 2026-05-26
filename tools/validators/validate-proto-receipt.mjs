#!/usr/bin/env node
/**
 * @csps-dna
 * inherits_from: tools/validators/
 * core_spine: VALD
 * governing_principle: P-META-006
 * behavioral_contract: B_PRE_CLOSE_VERIFICATION
 * role: Scans council files (sonnet-turn.md, opus-turn.md) for PROTO citations.
 *       Confirms that FROM SONNET/OPUS blocks reference real PROTO files that exist on disk.
 *       Advisory — prevents phantom PROTO citations where a relay references a non-existent file.
 * @csps-enforces B_PRE_CLOSE_VERIFICATION P-META-006
 */

/**
 * validate-proto-receipt.mjs
 * Per FINDING-OPUS10-5: PROTO files lack receipt-confirmation validator.
 *
 * Scans tools/council/ for FROM SONNET/OPUS blocks and extracts PROTO citations.
 * Checks that cited PROTO files exist in docs/plan/protos/.
 * ADVISORY (exit 0 always).
 *
 * Output: blocks_checked=N proto_citations=N valid=N missing=N advisory=N blocking=N
 *
 * S063 PHASE B.2 | FINDING-OPUS10-5
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const COUNCIL_DIR = join(ROOT, 'tools', 'council');
const PROTOS_DIR = join(ROOT, 'docs', 'plan', 'protos');

let blocks_checked = 0;
let proto_citations = 0;
let valid = 0;
let missing = 0;
let advisory = 0;
let blocking = 0;
const findings = [];

if (!existsSync(COUNCIL_DIR)) {
  console.log(`[validate-proto-receipt] council/ dir not found`);
  console.log(`blocks_checked=0 proto_citations=0 valid=0 missing=0 advisory=0 blocking=0`);
  process.exit(0);
}

// Scan council files for FROM SONNET/OPUS blocks + PROTO citations
const councilFiles = readdirSync(COUNCIL_DIR).filter(f => f.endsWith('.md'));

for (const file of councilFiles) {
  const content = readFileSync(join(COUNCIL_DIR, file), 'utf-8');

  // Find FROM SONNET/OPUS blocks
  const blockMatches = content.split(/^## FROM (SONNET|OPUS)/m);
  blocks_checked += Math.max(0, blockMatches.length - 1);

  // Find all PROTO citations: PROTO-S<NNN>-<NAME> patterns
  const protoCitations = content.match(/PROTO-S\d{3,}-[\w-]+/g) || [];

  for (const citation of protoCitations) {
    proto_citations++;
    // Check if the PROTO file exists
    const protoFile = join(PROTOS_DIR, `${citation}.md`);
    if (existsSync(protoFile)) {
      valid++;
    } else {
      // Also check with potential date suffix or .md variation
      missing++;
      advisory++;
      findings.push({
        file,
        citation,
        issue: `PROTO citation ${citation} has no matching file in docs/plan/protos/`,
        note: 'This may be planned (not-yet-authored) — advisory only'
      });
    }
  }
}

// Deduplicate findings by citation
const uniqueFindings = [...new Map(findings.map(f => [f.citation, f])).values()];

// Output findings (cap at 5)
for (const f of uniqueFindings.slice(0, 5)) {
  console.log(`  ⚠ ${f.file}: ${f.issue}`);
  console.log(`    Note: ${f.note}`);
}
if (uniqueFindings.length > 5) console.log(`  ... +${uniqueFindings.length - 5} more`);

const summary = `[validate-proto-receipt] blocks_checked=${blocks_checked} proto_citations=${proto_citations} valid=${valid} missing=${missing} advisory=${advisory} blocking=${blocking}`;
console.log(summary);
process.exit(0);
