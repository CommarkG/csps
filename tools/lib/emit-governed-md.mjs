#!/usr/bin/env node
/**
 * tools/lib/emit-governed-md.mjs — CANONICAL governed-markdown creator.
 * AMENDMENT-1 S086: prevent-by-construction — every governed .md file created by
 * CSPS hooks goes through this function, which always writes frontmatter first.
 * Never write inline `cat > file << HEADER` with manual frontmatter again.
 *
 * Usage (from hooks via node):
 *   EMIT_PATH="..." EMIT_ID="..." EMIT_TYPE="log" EMIT_SESSION="S086" \
 *     node "$REPO_ROOT/tools/lib/emit-governed-md.mjs"
 *
 * Or from other .mjs files:
 *   import { emitGovernedMd } from './emit-governed-md.mjs';
 *   emitGovernedMd({ path, id, name, description, type, session, date, extraFields, header });
 *
 * Guarantees:
 *   1. File starts with YAML frontmatter (---\n...\n---\n\n)
 *   2. Required fields: id, name, type, lifecycle_state, owner, session, links
 *   3. Never overwrites existing file (append-only; create = frontmatter-first)
 *   4. Header line follows frontmatter (# Title)
 */

import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED = ['id', 'name', 'type', 'lifecycle_state', 'owner', 'session'];

/**
 * @param {object} opts
 * @param {string} opts.path        — absolute path to the .md file
 * @param {string} opts.id          — csps ID (dotted lowercase)
 * @param {string} opts.name        — human name
 * @param {string} [opts.description]
 * @param {string} [opts.type]      — default: 'log'
 * @param {string} [opts.lifecycle_state] — default: 'active'
 * @param {string} [opts.owner]     — default: 'group:finky'
 * @param {string} [opts.session]
 * @param {string} [opts.date]
 * @param {object} [opts.extraFields] — additional YAML key:value pairs
 * @param {string} [opts.header]    — # Title line to put after frontmatter
 * @param {string} [opts.comment]   — HTML comment line
 * @returns {{ created: boolean, path: string }}
 */
export function emitGovernedMd(opts) {
  const {
    path,
    id,
    name,
    description = '',
    type = 'log',
    lifecycle_state = 'active',
    owner = 'group:finky',
    session = 'unknown',
    date = new Date().toISOString().slice(0, 10),
    extraFields = {},
    header = '',
    comment = '',
  } = opts;

  // Validate required fields
  const missing = REQUIRED.filter(f => !opts[f] && f !== 'type' && f !== 'lifecycle_state' && f !== 'owner');
  if (missing.length > 0) throw new Error(`emit-governed-md: missing required fields: ${missing.join(', ')}`);

  if (existsSync(path)) return { created: false, path };

  // Build frontmatter
  const fm = [
    '---',
    `id: ${id}`,
    `name: ${name}`,
    ...(description ? [`description: "${description.replace(/"/g, "'")}"`,] : []),
    `type: ${type}`,
    `lifecycle_state: ${lifecycle_state}`,
    `lifecycle: production`,
    `core_spine: GVRN`,
    `schema_anchor: governance_log`,
    `impl_status: active`,
    `owner: ${owner}`,
    `session: ${session}`,
    ...(date ? [`date: "${date}"`,] : []),
    `version: "auto"`,
    ...Object.entries(extraFields).map(([k, v]) => `${k}: ${v}`),
    `links:`,
    `  - { rel: vault, href: ./README.md }`,
    '---',
    '',
    ...(header ? [`# ${header}`, ''] : []),
    ...(comment ? [`<!-- ${comment} -->`, ''] : []),
  ].join('\n');

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, fm, 'utf-8');
  return { created: true, path };
}

// CLI mode — cross-platform: use fileURLToPath so Windows backslash paths compare correctly
const __emitFilename = fileURLToPath(import.meta.url);
if (resolve(process.argv[1] || '') === resolve(__emitFilename)) {
  try {
    const p = process.env.EMIT_PATH;
    if (!p) { process.stderr.write('emit-governed-md: EMIT_PATH required\n'); process.exit(1); }
    const result = emitGovernedMd({
      path: p,
      id: process.env.EMIT_ID || `csps.auto.${Date.now()}`,
      name: process.env.EMIT_NAME || process.env.EMIT_ID || 'auto',
      description: process.env.EMIT_DESCRIPTION || '',
      type: process.env.EMIT_TYPE || 'log',
      lifecycle_state: process.env.EMIT_LIFECYCLE_STATE || 'active',
      owner: process.env.EMIT_OWNER || 'group:finky',
      session: process.env.EMIT_SESSION || 'unknown',
      date: process.env.EMIT_DATE || new Date().toISOString().slice(0, 10),
      header: process.env.EMIT_HEADER || '',
      comment: process.env.EMIT_COMMENT || '',
    });
    process.stdout.write(JSON.stringify(result) + '\n');
  } catch (e) {
    process.stderr.write(`emit-governed-md error: ${e.message}\n`);
    process.exit(1);
  }
}
