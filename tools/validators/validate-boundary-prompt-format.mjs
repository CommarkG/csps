#!/usr/bin/env node
/**
 * validate-boundary-prompt-format.mjs
 * @csps-dna
 * core_spine: GVRN
 * @csps-enforces FREESTYLE-BOUNDARY-PROMPT-WITHOUT-FORMAL-HEADERS
 * @csps-prevention-class FREESTYLE-BOUNDARY-PROMPT-WITHOUT-FORMAL-HEADERS
 * @behavioral-test-status: tested — tests A/B/C at tools/tests/behavioral/boundary-prompt-format-test.sh
 *
 * T2 enforcer for boundary-prompt.template.md (ratified Governor S071 Turn 27)
 *
 * What it checks:
 *   Every boundary prompt block (in opus-turn.md, sonnet-turn.md, and chat-jump-prompt-*.md)
 *   must contain all 4 mandatory header lines:
 *     I AM:     — sender identity + session
 *     YOU ARE:  — receiver identity + session
 *     THIS IS:  — prompt type (startup / directive / handoff / etc.)
 *     DO NOW:   — one-sentence first action
 *   AND a CROSS-REVIEW ATTESTATION block (per Turn 26 discipline).
 *
 * Detection heuristic:
 *   Council files (opus-turn.md, sonnet-turn.md): a section starting with "# " is a candidate
 *   if it contains at least one of the 4 required headers (i.e. it's "trying" to be a boundary prompt).
 *   Sections with zero headers are exempt (not attempting the format).
 *   Chat-jump files: each file is checked in full as one boundary prompt.
 *
 * Pre-discipline corpus:
 *   Entries written before S071 Turn 27 (2026-05-30) lack the headers by definition.
 *   They are flagged as ADVISORY (informational) — do NOT retrofit older entries.
 *
 * ADVISORY in S072 — exit 0 always (advisory only).
 * Promotes to BLOCKING after 5 sample exemplar passes (sample — tunable per P-META-028).
 *
 * Audit slug: boundary-prompt-format (registered in audit-runner.md)
 * Composes with: validate-boundary-alignment.mjs + validate-handoff-completeness.mjs
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());
const LAST_RUN_PATH = join(ROOT, 'tools/data/validate-boundary-prompt-format-last-run.json');

// ── Config ────────────────────────────────────────────────────────────────────

// Council files to scan (each "# " section = one candidate entry)
const COUNCIL_FILES = [
  'tools/council/opus-turn.md',
  'tools/council/sonnet-turn.md',
];

// Chat-jump prompt directory (each file = one boundary prompt)
const CHAT_JUMP_DIR = join(ROOT, 'docs/plan/_handoff/VAULT');
const CHAT_JUMP_PREFIX = 'chat-jump-prompt-';

// 4 mandatory header lines — order matters for humans; presence matters for validator
const REQUIRED_HEADERS = ['I AM:', 'YOU ARE:', 'THIS IS:', 'DO NOW:'];

// Cross-review attestation marker (Turn 26 discipline)
const ATTESTATION_MARKER = 'CROSS-REVIEW ATTESTATION';

// How many lines after the first header to look for the remaining headers
const HEADER_WINDOW = 10; // (sample — tunable per P-META-028)

// How many lines after the first header to look for CROSS-REVIEW ATTESTATION
const ATTESTATION_WINDOW = 80; // (sample — tunable per P-META-028)

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse a markdown file into sections delimited by "# " headings.
 * Returns [{heading, content}] where content is the text under each heading.
 */
function parseSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let current = { heading: '(preamble)', content: [] };

  for (const line of lines) {
    if (line.startsWith('# ') || line.startsWith('## ')) {
      if (current.content.join('\n').trim()) {
        sections.push({ ...current, contentText: current.content.join('\n') });
      }
      current = { heading: line.trim(), content: [] };
    } else {
      current.content.push(line);
    }
  }

  if (current.content.join('\n').trim()) {
    sections.push({ ...current, contentText: current.content.join('\n') });
  }

  return sections;
}

/**
 * Check a text block for boundary prompt compliance.
 * Returns { missing_headers, has_attestation, is_boundary_prompt }
 */
function checkBoundaryPromptBlock(text) {
  const headersFound = REQUIRED_HEADERS.filter(h => text.includes(h));
  const missing_headers = REQUIRED_HEADERS.filter(h => !text.includes(h));
  const has_attestation = text.includes(ATTESTATION_MARKER);
  const is_boundary_prompt = headersFound.length >= 1; // at least 1 header = "attempting" the format

  return { missing_headers, has_attestation, is_boundary_prompt };
}

/**
 * Collect chat-jump-prompt-*.md files from the VAULT directory.
 */
function collectChatJumpFiles() {
  if (!existsSync(CHAT_JUMP_DIR)) return [];
  return readdirSync(CHAT_JUMP_DIR)
    .filter(f => f.startsWith(CHAT_JUMP_PREFIX) && f.endsWith('.md'))
    .map(f => join(CHAT_JUMP_DIR, f));
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  let entries_checked = 0;
  let missing_headers_count = 0;
  let missing_attestation_count = 0;
  let advisory = 0;
  const blocking = 0; // Always 0 in S072 — advisory only

  const findings = [];

  // ── Scan council files (section-by-section) ──────────────────────────────────

  for (const relPath of COUNCIL_FILES) {
    const filePath = join(ROOT, relPath);
    if (!existsSync(filePath)) continue;

    const content = readFileSync(filePath, 'utf8');
    const sections = parseSections(content);

    for (const section of sections) {
      const { missing_headers, has_attestation, is_boundary_prompt } =
        checkBoundaryPromptBlock(section.contentText);

      // Only check sections that are "attempting" the boundary prompt format
      if (!is_boundary_prompt) continue;

      entries_checked++;

      if (missing_headers.length > 0) {
        missing_headers_count++;
        advisory++;
        findings.push(
          `[ADVISORY] ${relPath} § "${section.heading}" — missing headers: ${missing_headers.join(', ')}`
        );
      }

      if (!has_attestation) {
        missing_attestation_count++;
        advisory++;
        findings.push(
          `[ADVISORY] ${relPath} § "${section.heading}" — CROSS-REVIEW ATTESTATION missing`
        );
      }
    }
  }

  // ── Scan chat-jump-prompt-*.md files (whole-file) ───────────────────────────

  const chatJumpFiles = collectChatJumpFiles();

  for (const filePath of chatJumpFiles) {
    const relPath = filePath.replace(ROOT + '/', '').replace(ROOT + '\\', '');
    const content = readFileSync(filePath, 'utf8');

    // For chat-jump files: check whole file as one boundary prompt
    // Only flag if the file contains ANY of the 4 header markers (or is recent — after S071 Turn 27)
    // Simple approach: check all chat-jump files; pre-discipline ones get advisory finding
    const { missing_headers, has_attestation, is_boundary_prompt } =
      checkBoundaryPromptBlock(content);

    // For chat-jump files, treat the whole file as a boundary prompt candidate
    // even if it has 0 headers (pre-discipline format)
    entries_checked++;

    if (missing_headers.length > 0) {
      missing_headers_count++;
      advisory++;
      findings.push(
        `[ADVISORY] ${relPath} — missing headers: ${missing_headers.join(', ')}` +
        (missing_headers.length === REQUIRED_HEADERS.length ? ' (pre-discipline format)' : '')
      );
    }

    if (!has_attestation && (REQUIRED_HEADERS.length - missing_headers.length) >= 2) {
      // Only flag attestation for files that have at least 2 headers (partially compliant)
      missing_attestation_count++;
      advisory++;
      findings.push(
        `[ADVISORY] ${relPath} — CROSS-REVIEW ATTESTATION missing`
      );
    }
  }

  // ── Output ────────────────────────────────────────────────────────────────────

  for (const f of findings) {
    console.log(f);
  }

  // Summary line for verify.mjs parse_output
  console.log(
    `[validate-boundary-prompt-format] entries_checked=${entries_checked} missing_headers=${missing_headers_count} missing_attestation=${missing_attestation_count} advisory=${advisory} blocking=${blocking}`
  );

  // Write last-run JSON
  const lastRun = {
    run_at: new Date().toISOString(),
    entries_checked,
    missing_headers: missing_headers_count,
    missing_attestation: missing_attestation_count,
    advisory,
    blocking,
    findings_count: findings.length,
  };

  try {
    writeFileSync(LAST_RUN_PATH, JSON.stringify(lastRun, null, 2) + '\n');
  } catch {
    // Non-fatal — last-run write failure doesn't affect validation result
  }

  // Advisory only — always exits 0
  process.exit(0);
}

main();
