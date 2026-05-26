#!/usr/bin/env node
/**
 * corespine-check-gate.mjs
 * Advisory check: new .md files via Write tool should have core_spine + schema_anchor.
 * Exit 0 always (advisory). Emits warning text if fields missing.
 * B_CORE_SPINE_DISCIPLINE T1 (partial) — PROTO-S063-CORESPINE-T1-HOOK S063 ITEM 3.1
 */
import { basename } from 'path';

const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  let d;
  try { d = JSON.parse(chunks.join('')); } catch (e) { process.exit(0); }

  const toolName = d.tool_name || d.toolName || '';
  const input    = d.tool_input || d.toolInput || {};

  // Only check Write tool (creation events)
  if (toolName !== 'Write') process.exit(0);

  const filePath = input.file_path || '';
  const content  = input.content   || '';

  // Only governance .md files
  if (!filePath.endsWith('.md')) process.exit(0);

  // Only files with frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) process.exit(0);

  const fm = fmMatch[1];
  const missing = [];
  if (!/^core_spine:/m.test(fm)) missing.push('core_spine');
  if (!/^schema_anchor:/m.test(fm)) missing.push('schema_anchor');

  if (missing.length > 0) {
    const file = basename(filePath);
    process.stderr.write(
      `[corespine-check] ADVISORY: ${file} missing frontmatter: ${missing.join(', ')}\n` +
      `  Add: core_spine: GVRN|ARCH|AI|OPER|VALD\n` +
      `       schema_anchor: <value from schema-registry.md>\n` +
      `  Ref: B_CORE_SPINE_DISCIPLINE P-ARCH-028\n`
    );
  }

  // Advisory only — always allow
  process.exit(0);
});
