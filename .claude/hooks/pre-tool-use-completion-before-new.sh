#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-completion-before-new
# @csps-name pre-tool-use-completion-before-new
# @csps-description PreToolUse advisory gate (T1 for P-OP-008 completion-before-new).
#   Fires on Write|Edit. If a NEW PROTO file is being created in docs/plan/protos/
#   AND there are open (unchecked) milestones in existing PROTOs → injects advisory:
#   "active plan has open milestones — route this new intent through threshold first."
#   ADVISORY only (no BLOCK) — completion discipline is awareness, not hard enforcement.
#   P-OP-008 + P-OP-002 FWWS + COMPLETION-DISCIPLINE-PLAN-S073
# @csps-version 1.0.0
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces P-OP-008 P-OP-002
set -euo pipefail

TOOL_INPUT="${CLAUDE_TOOL_INPUT:-}"
[ -z "$TOOL_INPUT" ] && exit 0
command -v node >/dev/null 2>&1 || exit 0

printf '%s' "$TOOL_INPUT" | node -e '
let d="";
process.stdin.on("data",c=>d+=c);
process.stdin.on("end",()=>{
  let j; try { j = JSON.parse(d); } catch { process.exit(0); }
  const fp = String(j.file_path || j.path || "").replace(/\/g,"/");
  // Only fire for new PROTO files
  if (!fp.toLowerCase().includes("docs/plan/protos/")) process.exit(0);
  if (!fp.toLowerCase().endsWith(".md")) process.exit(0);
  // Check if file is NEW (does not yet exist)
  const fs=require("fs");
  if (fs.existsSync(fp)) process.exit(0); // editing existing = OK
  // Count open milestones in existing PROTOs
  const path=require("path");
  const ROOT=process.cwd();
  const protosDir=path.join(ROOT,"docs/plan/protos");
  let openMilestones=0;
  let openProtos=0;
  try {
    const files=fs.readdirSync(protosDir).filter(f=>f.endsWith(".md"));
    const SEALED=new Set(["sealed","ratified","validated","active","done","closed","superseded","deprecated"]);
    for(const f of files){
      const content=fs.readFileSync(path.join(protosDir,f),"utf8");
      const sm=content.match(/^status:\s*(.+)$/m);
      const status=sm?sm[1].trim().replace(/["\'"'"']/g,""):"unknown";
      if(SEALED.has(status)) continue;
      const unchecked=(content.match(/^\s*- \[ \]/gm)||[]).length;
      if(unchecked>0){openProtos++;openMilestones+=unchecked;}
    }
  } catch {}
  if(openMilestones===0) process.exit(0);
  const msg="[P-OP-008 advisory] Creating a new PROTO while "+openProtos+" open PROTO(s) have "+openMilestones+" unchecked milestone(s).\n\n"
    +"Completion-Before-New discipline (P-OP-002 FWWS + COMPLETION-DISCIPLINE-PLAN-S073):\n"
    +"  1. Complete or checkpoint the active plan first.\n"
    +"  2. If this is new intent: route through threshold-router.mjs → vault/PI → future plan.\n"
    +"  3. Only a Governor DPR-4/5 (stop-immediately/redesign) justifies disrupting an active plan.\n\n"
    +"This is ADVISORY — you may proceed, but completion-state is surfaced.";
  process.stdout.write(JSON.stringify({systemMessage:msg}));
  process.exit(0);
});
' 2>/dev/null || exit 0
exit 0
