#!/usr/bin/env bash
# @csps-id csps.claude.hooks.post-tool-use-handoff-relay-inline
# @csps-name post-tool-use-handoff-relay-inline
# @csps-description PostToolUse hook — TAB-TRANSFER discipline.
#   Fires after Write/Edit to HANDOFF-S*-to-S*.md or chat-jump-prompt-*.md.
#   (1) Saves content to .csps/last-handoff-draft.txt (stable paste source).
#   (2) Emits MANDATORY systemMessage: present the handoff inline + await
#       OPUS-15 review+optimization BEFORE the Governor pastes to new tab.
#   The tab-transfer loop: Sonnet drafts → OPUS-15 reviews → Governor pastes.
#   This is the formal inheritance of PROTO-S073-TAB-TRANSFER discipline.
#   Governor S073 directive: "have this process formalize and make it inherited"
#   Prevention class: TAB-TRANSFER-WITHOUT-OPUS-REVIEW
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_TAB_TRANSFER_REVIEW AP-001
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
  // Fire for HANDOFF files and chat-jump prompts
  const isHandoff = /handoff-s\d+.*\.md/.test(fp) || /chat-jump-prompt.*\.md/.test(fp);
  if (!isHandoff) process.exit(0);
  let content = String(j.content || j.new_string || "");
  if (Array.isArray(j.edits)) content += "\n" + j.edits.map(function(e){return (e&&e.new_string)||"";}).join("\n");
  if (!content.trim()) process.exit(0);
  try {
    const fs=require("fs");
    if(!fs.existsSync(".csps")) fs.mkdirSync(".csps",{recursive:true});
    fs.writeFileSync(".csps/last-handoff-draft.txt", content);
  } catch {}
  const fn = fp.split("/").pop();
  const msg = "⚠ MANDATORY [TAB-TRANSFER-REVIEW]: you wrote to \"" + fn + "\". "
    + "TAB-TRANSFER LOOP: Sonnet drafts → OPUS-15 reviews+optimizes → Governor pastes to new tab. "
    + "DO NOT let the Governor paste this directly. "
    + "Present the handoff inline (paste-ready boundary-prompt format) in THIS response "
    + "so the Governor can relay to OPUS-15 for review. "
    + "OPUS-15 will return an optimized version. Governor pastes THAT. "
    + "Auto-saved: .csps/last-handoff-draft.txt";
  process.stdout.write(JSON.stringify({ systemMessage: msg }) + "\n");
  process.exit(0);
});
' 2>/dev/null || exit 0
exit 0
