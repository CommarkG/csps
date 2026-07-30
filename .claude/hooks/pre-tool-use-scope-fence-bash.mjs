// @csps-id csps.claude.hooks.pre-tool-use-scope-fence-bash.logic
// @csps-name pre-tool-use-scope-fence-bash (logic module)
// Companion to pre-tool-use-scope-fence.sh (which covers Write/Edit/NotebookEdit).
// This module covers the Bash-shaped hole: a Bash command that writes to an
// out-of-scope absolute path via redirection, cp/mv/rsync/install, sed -i,
// dd, truncate, rm/rmdir, tee, or a node -e / python -c script body.
//
// DESIGN: unlike the Write/Edit fence (one clear file_path -> safe to
// default-DENY), Bash commands are MOSTLY legitimate in-repo reads/ops
// (grep, git, node, pnpm, cat, ls, for-loops). Over-blocking Bash breaks
// every agent. So this module is DEFAULT-ALLOW and only emits BLOCK when it
// finds an absolute, out-of-scope path used in an UNAMBIGUOUS write context.
// It is heuristic/regex-based, not a real shell parser. See the hook's own
// header comment + the build report for the explicit list of bypass vectors
// this does NOT catch (relative paths after `cd`, variable-obfuscated
// paths, a script file that itself writes, etc).
//
// Kept as a separate .mjs (rather than inline `node -e "..."` like the
// Write/Edit fence) because the write-context detection needs several
// non-trivial regexes; embedding that inside a bash-double-quoted `node -e`
// string would require heavy backslash/quote re-escaping and would be very
// easy to corrupt silently. This file is plain, readable, directly
// node-runnable, and directly testable (`node this.mjs < payload.json`).
//
// @csps-version 1.0.0
// @csps-owner group:finky
// @csps-lifecycle production
// @csps-lifecycle-state active
// @csps-tags type:hook-logic domain:governance audience:ai-agent
// @csps-enforces B_BOUNDARY_ALIGNMENT_PROTOCOL P-META-021

import path from 'node:path';

// ---------------------------------------------------------------------------
// 1. Allowlist + normalize — DUPLICATED from pre-tool-use-scope-fence.sh on
//    purpose (that file embeds its JS inline in a bash `node -e "..."`
//    string; there is no clean "require" target to share). If the roots
//    list in pre-tool-use-scope-fence.sh ever changes, mirror the change
//    here too.
// ---------------------------------------------------------------------------
function normalize(p) {
  let s = String(p).trim();
  // strip a wrapping quote pair the regexes may have left attached
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  s = s.replace(/\\/g, '/');
  const msys = s.match(/^\/([a-zA-Z])\/(.*)$/);
  if (msys) { s = msys[1].toUpperCase() + ':/' + msys[2]; }
  const isAbsoluteWin = /^[a-zA-Z]:\//.test(s);
  const isAbsoluteUnix = s.startsWith('/');
  if (!isAbsoluteWin && !isAbsoluteUnix) {
    const base = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    s = path.resolve(base.replace(/\\/g, '/'), s);
  }
  s = path.resolve(s);
  s = s.replace(/\\/g, '/');
  return s.toLowerCase();
}

const ROOTS = [
  'c:/users/finky/desktop/claude code/csps',
  'c:/users/finky/.claude/projects/c--users-finky-desktop-claude-code-csps',
  'c:/users/finky/appdata/local/temp/claude',
];
if (process.env.CLAUDE_PROJECT_DIR) {
  ROOTS.push(normalize(process.env.CLAUDE_PROJECT_DIR));
}

function inScope(rawPath) {
  const n = normalize(rawPath);
  return ROOTS.some(r => n === r || n.startsWith(r + '/'));
}

// ---------------------------------------------------------------------------
// 2. Find absolute-path-shaped tokens in the command string, with position.
// ---------------------------------------------------------------------------
function findAbsolutePathMatches(cmd) {
  const out = [];
  const patterns = [
    /"([a-zA-Z]:[\\/][^"]*)"/g,                                  // "C:/..." or "C:\..."
    /'([a-zA-Z]:[\\/][^']*)'/g,                                  // 'C:/...'
    /(?:^|[\s(=,:])([a-zA-Z]:[\\/][^\s"'<>|&;)]+)/g,             // bare C:/... or C:\...
    /(?:^|[\s(=,:])(\/[a-zA-Z]\/[^\s"'<>|&;)]+)/g,               // msys-style /c/...
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(cmd))) {
      out.push({ raw: m[1], matchStart: m.index, matchEnd: m.index + m[0].length });
    }
  }
  // dedupe overlapping matches (quoted patterns can also be picked up by the
  // bare patterns) by matchStart, preferring the quoted (longer, exact) form
  out.sort((a, b) => a.matchStart - b.matchStart || (b.matchEnd - b.matchStart) - (a.matchEnd - a.matchStart));
  const dedup = [];
  let lastEnd = -1;
  for (const m of out) {
    if (m.matchStart >= lastEnd) {
      dedup.push(m);
      lastEnd = m.matchEnd;
    }
  }
  return dedup;
}

// ---------------------------------------------------------------------------
// 3. Split command into pipeline/chain segments for command-name-based checks
//    (cp/mv/rsync/install/sed/truncate/rm/rmdir/dd).
// ---------------------------------------------------------------------------
function splitSegments(cmd) {
  const segments = [];
  let segStart = 0;
  const sepRe = /&&|\|\||;|\n|\|/g;
  let m;
  while ((m = sepRe.exec(cmd))) {
    segments.push({ text: cmd.slice(segStart, m.index), start: segStart, end: m.index });
    segStart = m.index + m[0].length;
  }
  segments.push({ text: cmd.slice(segStart), start: segStart, end: cmd.length });
  return segments;
}

function segmentFor(segments, idx) {
  return segments.find(s => idx >= s.start && idx < s.end) || segments[segments.length - 1];
}

const DEST_COMMANDS = new Set(['cp', 'mv', 'rsync', 'install']);
const DELETE_COMMANDS = new Set(['rm', 'rmdir']);

// ---------------------------------------------------------------------------
// 4. Per-match write-context detection.
// ---------------------------------------------------------------------------
function isWriteContext(cmd, match, segments) {
  const { matchStart, matchEnd } = match;

  // (a) redirection: `>`, `>>`, optionally with a leading fd digit, directly
  //     before the path (only whitespace in between).
  const pre = cmd.slice(Math.max(0, matchStart - 12), matchStart);
  if (/[0-9]?>>?\s*$/.test(pre)) return 'redirection';

  // (b) tee [flags] <path>
  const preWide = cmd.slice(Math.max(0, matchStart - 60), matchStart);
  if (/\btee\b(\s+-{1,2}\S+)*\s*$/.test(preWide)) return 'tee';

  // (c) dd of=<path>
  if (/\bof=$/.test(pre)) return 'dd-of';

  // (d) command-name based: segment this match lives in, first word of segment
  const seg = segmentFor(segments, matchStart);
  const segTrim = seg.text.trim();
  const firstWordRaw = (segTrim.match(/^\s*(\S+)/) || [, ''])[1];
  const baseName = firstWordRaw.replace(/^.*[\\/]/, '');

  if (DEST_COMMANDS.has(baseName)) {
    // destination is conventionally the last argument of the segment
    const remainder = cmd.slice(matchEnd, seg.end).trim();
    if (remainder === '') return `${baseName}-destination`;
  }
  if (DELETE_COMMANDS.has(baseName)) {
    // any absolute path argument to rm/rmdir is a delete target
    return `${baseName}-target`;
  }
  if (baseName === 'sed' && /(^|\s)-i(\.\S*)?(\s|$)/.test(segTrim)) {
    return 'sed-i-target';
  }
  if (baseName === 'truncate') {
    const remainder = cmd.slice(matchEnd, seg.end).trim();
    if (remainder === '') return 'truncate-target';
  }

  return null;
}

// ---------------------------------------------------------------------------
// 5. node -e / python(3) -c script-body scan: the write signal
//    (writeFileSync/appendFile/open(...,'w')/etc) can be buried inside a
//    quoted script argument where none of the above positional checks apply.
// ---------------------------------------------------------------------------
function findScriptBodyBlock(cmd) {
  const scriptRe = /\b(?:node\s+-e|python3?\s+-c)\s+(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)')/g;
  const writeIndicator = /writeFileSync|appendFileSync|writeFile\s*\(|appendFile\s*\(|createWriteStream|open\([^)]*,\s*["'][wa]/;
  let m;
  while ((m = scriptRe.exec(cmd))) {
    const body = m[1] !== undefined ? m[1] : m[2];
    if (!body || !writeIndicator.test(body)) continue;
    const bodyPaths = findAbsolutePathMatches(body);
    for (const bp of bodyPaths) {
      if (!inScope(bp.raw)) return bp.raw;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// 6. Main
// ---------------------------------------------------------------------------
function decide(cmd) {
  if (!cmd || typeof cmd !== 'string') return 'ALLOW';

  const pathMatches = findAbsolutePathMatches(cmd);
  const segments = splitSegments(cmd);

  for (const match of pathMatches) {
    const ctx = isWriteContext(cmd, match, segments);
    if (ctx && !inScope(match.raw)) {
      return `BLOCK|${match.raw}|${ctx}`;
    }
  }

  const scriptBlocked = findScriptBodyBlock(cmd);
  if (scriptBlocked) {
    return `BLOCK|${scriptBlocked}|script-body-write`;
  }

  return 'ALLOW';
}

let data = '';
process.stdin.on('data', c => { data += c; });
process.stdin.on('end', () => {
  try {
    const j = JSON.parse(data);
    if ((j.tool_name || '') !== 'Bash') { process.stdout.write('ALLOW'); return; }
    const cmd = (j.tool_input && j.tool_input.command) || j.command || '';
    process.stdout.write(decide(cmd));
  } catch (e) {
    // fail-open: this module's whole posture is default-ALLOW; a parse
    // failure is not evidence of a violation.
    process.stdout.write('ALLOW');
  }
});
