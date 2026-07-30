#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-scope-fence-bash
# @csps-name pre-tool-use-scope-fence-bash
# @csps-description PreToolUse hook (T1) — Bash-shaped companion to
#   pre-tool-use-scope-fence.sh. That hook default-DENIES Write/Edit/
#   NotebookEdit targets outside CSPS scope (repo / memory-dir / scratchpad),
#   but it only inspects file-writing tool_input shapes — it does NOT cover
#   the Bash tool. A wandering agent can still do
#     echo x > "c:/Users/finky/Desktop/Claude Code/<sibling>/y"
#   or `node -e "fs.writeFileSync('C:/.../sibling', ...)"`, `sed -i`, `cp/mv`
#   to a sibling, etc. — all invisible to the Write/Edit fence.
#
#   UNLIKE the Write/Edit fence, this hook is DEFAULT-ALLOW: Bash commands
#   are mostly legitimate in-repo reads/ops (grep, git, node, pnpm, cat, ls,
#   for-loops) and a default-DENY posture here would break every agent,
#   including Opus. It only BLOCKs when it can positively identify an
#   absolute, out-of-scope path used in an unambiguous WRITE context:
#   redirection (>, >>), tee, cp/mv/rsync/install destination, sed -i,
#   dd of=, truncate, rm/rmdir target, or a node -e / python -c script body
#   that calls writeFileSync/appendFile/open(...,'w')/etc on such a path.
#
#   BEST-EFFORT, NOT AIRTIGHT: this is regex/heuristic detection over the
#   command string, not a real shell parser. Known bypass vectors it does
#   NOT catch: `cd <sibling> && echo > relative-file`, variable-obfuscated
#   paths (`P="c:/.../sibling"; echo > "$P/x"`), a script FILE (not an
#   inline -e/-c body) that itself performs the write, base64/encoded
#   command bodies, and non-Bash mechanisms entirely. An airtight version
#   requires OS-level sandboxing, which is out of scope here. See the build
#   report for the full self-declared gap list.
#
#   The write-context detection logic lives in the sibling
#   pre-tool-use-scope-fence-bash.mjs module (kept as a real .mjs rather
#   than inline `node -e "..."` because the regex set is non-trivial and
#   inline bash-double-quote re-escaping of that many regexes would be
#   fragile and hard to review).
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-tags type:hook domain:governance audience:ai-agent
# @csps-enforces B_BOUNDARY_ALIGNMENT_PROTOCOL P-META-021

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STDIN_JSON=$(cat)

RESULT=$(printf '%s' "$STDIN_JSON" | node "$DIR/pre-tool-use-scope-fence-bash.mjs" 2>/dev/null || echo "ALLOW")

if [[ "$RESULT" == BLOCK\|* ]]; then
  REST="${RESULT#BLOCK|}"
  BAD_PATH="${REST%%|*}"
  CTX="${REST#*|}"
  echo "" 1>&2
  echo "[scope-fence-bash] BLOCKED: Bash command writes to '$BAD_PATH' (detected write-context: $CTX) — outside CSPS scope." 1>&2
  echo "  Allowed roots:" 1>&2
  echo "    - c:/Users/finky/Desktop/Claude Code/Csps (CSPS repo)" 1>&2
  echo "    - c:/Users/finky/.claude/projects/c--Users-finky-Desktop-Claude-Code-Csps/ (CSPS memory dir)" 1>&2
  echo "    - c:/Users/finky/AppData/Local/Temp/claude/ (scratchpad)" 1>&2
  echo "  If this write is genuinely intended outside CSPS scope, it requires explicit Governor approval and cannot proceed via an automated agent write." 1>&2
  echo "  (This is a best-effort Bash-command heuristic, not a sandbox — see pre-tool-use-scope-fence-bash.sh header for known bypass vectors.)" 1>&2
  echo "" 1>&2
  exit 2
fi

exit 0
