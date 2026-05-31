#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-closure-obligation-required
# @csps-name pre-tool-use-closure-obligation-required
# @csps-description PreToolUse hook (T1 for ANTI-FLOAT / B_CLOSURE_OBLIGATION).
#   Fires on Write|Edit. If the target .md or .yaml file will have a non-terminal
#   status in its frontmatter BUT lacks closure_owner+closure_decision+closure_by
#   → BLOCK (exit 2) with required-fields message.
#   Prevention class: FLOATING-ARTIFACT-NEVER-REACHES-TERMINAL
#   Implementation of P-META-030 (Closure Obligation) T1 gate.
#   Source: PROTO-S072-ANTI-FLOAT + PROTO-S073-B4
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces B_CLOSURE_OBLIGATION P-META-030
set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
[ -z "$TOOL_INPUT" ] && exit 0
command -v node >/dev/null 2>&1 || exit 0

printf '%s' "$TOOL_INPUT" | node -e '
let d="";
process.stdin.on("data",c=>d+=c);
process.stdin.on("end",()=>{
  let j; try { j = JSON.parse(d); } catch { process.exit(0); }
  const fp = String(j.file_path || j.path || "").toLowerCase();
  // Only check .md and .yaml files
  if (!fp.endsWith(".md") && !fp.endsWith(".yaml")) process.exit(0);
  // Skip VAULT, handoff, and data dirs (not governance artifacts under this rule)
  const skipDirs = ["_handoff/","tools/data/","tools/config/","tools/templates/","libs/","apps/"];
  if (skipDirs.some(d => fp.includes(d))) process.exit(0);
  // Get the content being written
  let content = String(j.content || j.new_string || "");
  if (Array.isArray(j.edits)) content += "\n" + j.edits.map(e=>(e&&e.new_string)||"").join("\n");
  if (!content.trim()) process.exit(0);
  // Check for non-terminal status in frontmatter
  const nonTerminal = new Set(["draft","proposed","pending-review","awaiting-review","awaiting-ratification","awaiting-governor-ratification"]);
  const statusMatch = content.match(/^status:\s*([^\n]+)/m);
  if (!statusMatch) process.exit(0);
  const status = statusMatch[1].trim().replace(/["\'"'"']/g,"");
  if (!nonTerminal.has(status)) process.exit(0);
  // Check for closure obligation
  const hasClosure = content.includes("closure_owner") &&
                     content.includes("closure_decision") &&
                     content.includes("closure_by");
  if (hasClosure) process.exit(0);
  // BLOCK — missing closure obligation
  const fp_display = fp.split("/").pop();
  process.stdout.write(JSON.stringify({
    decision: "block",
    reason: "[B_CLOSURE_OBLIGATION T1] File \"" + fp_display + "\" has status:" + status + " (non-terminal) but missing required closure obligation fields.\n\nRequired in frontmatter:\n  closure_owner: [who decides the terminal state]\n  closure_decision: [exact decision that closes it, e.g. \\"Opus ratify OR reject\\"]\n  closure_by: [session number OR named trigger event]\n\nThis is P-META-030 Closure Obligation enforcement (ANTI-FLOAT T1).\nADD these fields before saving, or set status to a terminal value.\nTerminal statuses: ratified | validated | sealed | active | superseded | rejected | vaulted | deprecated | done"
  }));
  process.exit(2);
});
' 2>/dev/null || exit 0
exit 0
