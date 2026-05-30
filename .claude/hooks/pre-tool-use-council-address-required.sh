#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-council-address-required
# @csps-name pre-tool-use-council-address-required
# @csps-description PreToolUse BLOCKING hook (T1) — Council Address Protocol.
#   Fires before Write/Edit/MultiEdit. If the target is a council-channel file
#   (tools/council/opus-turn.md, tools/council/sonnet-turn.md, chat-jump-prompt-*.md)
#   AND the written content introduces a NEW TURN ENTRY (marker: "# OPUS-",
#   "# FROM SONNET", a boundary banner, or an "I AM:/YOU ARE:" header) but does NOT
#   carry the address header in one of the two canonical forms:
#     (a) 4-line:  I AM: <role> + YOU ARE: <role>   (boundary-prompt.template.md)
#     (b) opener:  "<Role>, this is <Role>."         (AGENTS.md:107 conversational)
#   then BLOCK with exit 2.
#   The MISSING T1: prior enforcement was T2-advisory (validate-boundary-prompt-format.mjs
#   exit 0 always) + T3-soft (reminder injection) only — which drifted every tab and
#   forced the Governor to re-remind. Advisory governance is documentation.
#   This is BLOCKING. AP-001: EXISTS != ACTIVE. Fail-open on parse error (never break writes).
# @csps-version 1.0.1
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces boundary-prompt.template.md B_ZCA AP-001 communication-protocol-shared.md
set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
[ -z "$TOOL_INPUT" ] && exit 0
command -v node >/dev/null 2>&1 || exit 0

VERDICT=$(printf '%s' "$TOOL_INPUT" | node -e '
let d="";
process.stdin.on("data",c=>d+=c);
process.stdin.on("end",()=>{
  let j; try { j = JSON.parse(d); } catch { console.log("PASS"); return; }
  const fp = String(j.file_path || j.path || "").toLowerCase();
  const isCouncil = fp.endsWith("opus-turn.md") || fp.endsWith("sonnet-turn.md") || fp.includes("chat-jump-prompt");
  if (!isCouncil) { console.log("PASS"); return; }
  let content = String(j.content || j.new_string || "");
  if (Array.isArray(j.edits)) content += "\n" + j.edits.map(function(e){return (e&&e.new_string)||"";}).join("\n");
  content = content.split("\r").join("");
  const newEntry = /(^|\n)#\s*OPUS-/.test(content) || /(^|\n)#\s*FROM SONNET/i.test(content) || /(I AM:|YOU ARE:)/.test(content) || /═══/.test(content);
  if (!newEntry) { console.log("PASS"); return; }
  const fourLine = /I AM:/.test(content) && /YOU ARE:/.test(content);
  const convo = /\b(Opus|Sonnet|Governor),\s*this is\s*(Opus|Sonnet|Governor)\b/i.test(content);
  console.log((fourLine || convo) ? "PASS" : "BLOCK");
});
' 2>/dev/null || echo "PASS")

if [ "$VERDICT" = "BLOCK" ]; then
  echo ""
  echo "[COUNCIL-ADDRESS BLOCK] This council-channel turn entry is not addressed."
  echo ""
  echo "  Every Opus<->Sonnet turn entry MUST open with WHO YOU ARE + WHO YOU ARE ADDRESSING."
  echo "  Use ONE canonical form (tools/templates/boundary-prompt.template.md, S071 Turn 27):"
  echo ""
  echo "    (a) 4-line header (directives / PROTOs / handoffs):"
  echo "        I AM: <your role + session>"
  echo "        YOU ARE: <addressee role + session>"
  echo "        THIS IS: <entry type>"
  echo "        DO NOW: <one-sentence first action>"
  echo ""
  echo "    (b) conversational opener (turn replies):"
  echo "        \"Opus, this is Sonnet.\"  /  \"Sonnet, this is Opus.\""
  echo ""
  echo "  BLOCKING because advisory (T2) + soft-reminder (T3) drifted every tab."
  echo "  AP-001: EXISTS != ACTIVE. Ref: boundary-prompt.template.md + B_ZCA + AGENTS.md."
  echo ""
  exit 2
fi
exit 0
