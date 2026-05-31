#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-sonnet-relay-inline
# @csps-name post-tool-use-sonnet-relay-inline
# @csps-description PostToolUse hook — B_PRESENT_SONNET_RELAY_INLINE enforcement.
#   Fires after Write/Edit to tools/council/sonnet-turn.md.
#   (1) Saves content to .csps/last-sonnet-relay.txt (stable paste source).
#   (2) Emits MANDATORY systemMessage: present the FULL content as a formatted
#       boundary-prompt block in THIS response — copy-paste ready for Governor to relay to Opus.
#   Pattern mirrors post-tool-use-proto-inline.sh (Opus→Sonnet direction).
#   This enforces the Sonnet→Opus direction: every sonnet-turn.md write = a relay
#   the Governor must be able to copy and paste immediately.
#   Governor directive S073: "enforce doing so every turn and make sure it is inherited"
#   Prevention class: PRESENT-SONNET-RELAY-NOT-AUTO-FORMATTED
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_PRESENT_SONNET_RELAY_INLINE AP-001
set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
[ -z "$TOOL_INPUT" ] && exit 0
command -v node >/dev/null 2>&1 || exit 0

printf '%s' "$TOOL_INPUT" | node -e '
let d="";
process.stdin.on("data",c=>d+=c);
process.stdin.on("end",()=>{
  let j; try { j = JSON.parse(d); } catch { process.exit(0); }
  const fp = String(j.file_path || j.path || "").toLowerCase().replace(/\/g,"/");
  if (!fp.endsWith("sonnet-turn.md")) process.exit(0);
  let content = String(j.content || j.new_string || "");
  if (Array.isArray(j.edits)) content += "\n" + j.edits.map(function(e){return (e&&e.new_string)||"";}).join("\n");
  if (!content.trim()) process.exit(0);
  try {
    const fs=require("fs");
    if(!fs.existsSync(".csps")) fs.mkdirSync(".csps",{recursive:true});
    fs.writeFileSync(".csps/last-sonnet-relay.txt", content);
  } catch {}
  const msg = "⚠ MANDATORY [B_PRESENT_SONNET_RELAY_INLINE]: you wrote to sonnet-turn.md. "
    + "Present the FULL content as a formatted boundary-prompt block in THIS response — "
    + "copy-paste ready for Governor to relay to Opus. "
    + "Format: 4 mandatory headers (I AM / YOU ARE / THIS IS / DO NOW) + CROSS-REVIEW ATTESTATION + CONTEXT + sections. "
    + "Do NOT summarize-and-link. Never say \'see sonnet-turn.md\'. "
    + "Governor copy-pastes directly. Auto-saved paste source: .csps/last-sonnet-relay.txt";
  process.stdout.write(JSON.stringify({ systemMessage: msg }) + "\n");
  process.exit(0);
});
' 2>/dev/null || exit 0
exit 0
