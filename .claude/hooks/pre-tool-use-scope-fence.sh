#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-scope-fence
# @csps-name pre-tool-use-scope-fence
# @csps-description PreToolUse BLOCKING hook (T1) — Scope Fence for file-writing tools.
#   Global ~/.claude/settings.json runs defaultMode=bypassPermissions +
#   skipDangerousModePermissionPrompt=true, so the built-in permission dialog is
#   SUPPRESSED for every tool call in this environment. A wandering agent doing a
#   broad search/edit pass can silently write into a SIBLING project directory
#   (e.g. "Trial Marketing visuals app", "Cisem") with zero prompt and zero trace
#   until the damage is discovered later. PreToolUse hooks still fire under
#   bypassPermissions and can exit 2 to hard-block — this is the ONLY remaining
#   perimeter mechanism available.
#   Default-DENY: a Write/Edit/NotebookEdit target must resolve under one of the
#   allowlisted CSPS-legitimate roots (repo / memory-dir / scratchpad) or it is
#   BLOCKED. Fail-OPEN only on genuine parse failure (see block 3 below) — a
#   false block on every write (e.g. because stdin was malformed) would break
#   the session outright, which is a worse failure mode than a rare missed edit.
#   Deliberately does NOT cover Bash-based writes (echo > file, node -e writeFileSync,
#   rm, mv) — Bash is free-form shell and this hook only inspects file-writing
#   tool_input shapes. That is a known v1 gap (see report).
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_BOUNDARY_ALIGNMENT_PROTOCOL P-META-021

set -euo pipefail

STDIN_JSON=$(cat)

# Single node pass: parse stdin, decide tool relevance, extract target path,
# normalize it, and check against the allowlist. Emits one of:
#   "ALLOW"                  -> exit 0, no output
#   "BLOCK|<resolved-path>"  -> exit 2, blocking message to stderr
#   "SKIP"                   -> exit 0 (not a write tool, or unparseable input — fail-open)
RESULT=$(printf '%s' "$STDIN_JSON" | node -e "
const path = require('path');

let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  try {
    const j = JSON.parse(d);
    const toolName = j.tool_name || '';

    // 2. Only fire on file-writing tools. Everything else passes through untouched.
    const WRITE_TOOLS = new Set(['Write', 'Edit', 'NotebookEdit']);
    if (!WRITE_TOOLS.has(toolName)) { process.stdout.write('SKIP'); return; }

    const ti = j.tool_input || {};
    // NotebookEdit uses notebook_path; Write/Edit use file_path. Accept either,
    // falling back to file_path for NotebookEdit in case of schema variance.
    const rawPath = (toolName === 'NotebookEdit')
      ? (ti.notebook_path || ti.file_path || '')
      : (ti.file_path || '');

    // 6. FAIL-SAFE: cannot extract any path at all -> do not block (ambiguity != violation).
    if (!rawPath || typeof rawPath !== 'string' || !rawPath.trim()) {
      process.stdout.write('SKIP');
      return;
    }

    // 3. Normalize the target path robustly across Windows path spellings:
    //    - MSYS-style /c/Users/... -> C:/Users/...
    //    - backslashes -> forward slashes
    //    - relative paths -> resolve against CLAUDE_PROJECT_DIR (if set) else cwd
    //    - collapse . / .. via path.resolve
    //    - lowercase for case-insensitive comparison (Windows drive/paths)
    function normalize(p) {
      let s = String(p).trim();
      s = s.replace(/\\\\/g, '/');
      // /c/Users/... -> C:/Users/...
      const msys = s.match(/^\/([a-zA-Z])\/(.*)\$/);
      if (msys) { s = msys[1].toUpperCase() + ':/' + msys[2]; }
      const isAbsoluteWin = /^[a-zA-Z]:\//.test(s);
      const isAbsoluteUnix = s.startsWith('/');
      if (!isAbsoluteWin && !isAbsoluteUnix) {
        const base = process.env.CLAUDE_PROJECT_DIR || process.cwd();
        s = path.resolve(base.replace(/\\\\/g, '/'), s);
      }
      s = path.resolve(s); // collapse . / .. and normalize separators for this platform
      s = s.replace(/\\\\/g, '/');
      return s.toLowerCase();
    }

    const target = normalize(rawPath);

    // 4. Allowlist (default-DENY): allow ONLY under one of these roots.
    const roots = [
      'c:/users/finky/desktop/claude code/csps',
      'c:/users/finky/.claude/projects/c--users-finky-desktop-claude-code-csps',
      'c:/users/finky/appdata/local/temp/claude',
    ];
    // CLAUDE_PROJECT_DIR, if set, is treated as an additional alias root
    // (covers the case where the harness launches from a different absolute
    // mount/casing but it still points at this same repo).
    if (process.env.CLAUDE_PROJECT_DIR) {
      roots.push(normalize(process.env.CLAUDE_PROJECT_DIR));
    }

    const allowed = roots.some(root => target === root || target.startsWith(root + '/'));

    if (allowed) { process.stdout.write('ALLOW'); return; }
    process.stdout.write('BLOCK|' + target);
  } catch (e) {
    // 6. Any parse/normalize failure -> fail-open, do not block.
    process.stdout.write('SKIP');
  }
});
" 2>/dev/null || echo "SKIP")

if [[ "$RESULT" == BLOCK\|* ]]; then
  BAD_PATH="${RESULT#BLOCK|}"
  echo "" 1>&2
  echo "[scope-fence] BLOCKED: '$BAD_PATH' is outside CSPS scope; blocked by pre-tool-use-scope-fence." 1>&2
  echo "  Allowed roots:" 1>&2
  echo "    - c:/Users/finky/Desktop/Claude Code/Csps (CSPS repo)" 1>&2
  echo "    - c:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/ (CSPS memory dir)" 1>&2
  echo "    - c:/Users/finky/AppData/Local/Temp/claude/ (scratchpad)" 1>&2
  echo "  If this write is genuinely intended outside CSPS scope, it requires explicit Governor approval and cannot proceed via an automated agent write." 1>&2
  echo "" 1>&2
  exit 2
fi

exit 0
