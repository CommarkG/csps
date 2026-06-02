#!/usr/bin/env bash
# @csps-id csps.claude.hooks.pre-tool-use-boundary-crossing-gate
# @csps-name pre-tool-use-boundary-crossing-gate
# @csps-description PreToolUse BLOCKING hook (T1) — Boundary Crossing Protocol.
#   Guards any edit to a file that is a registered canonical_source in tools/data/boundaries-register.yaml.
#   BLOCKS the write unless the tool input contains a BOUNDARY-CROSSING-AUTHORIZED token
#   OR the write does NOT change a registered boundary value.
#   Pattern: extends pre-tool-use-sacred-file-guard.sh (sacred file = boundary value file).
#   Per PROTO-S076-BOUNDARY-CROSSING-PROTOCOL: crossing any ratified boundary is a governed event.
#   5-step protocol required: STOP+SURFACE → GOVERNOR-FIRST-APPROVAL → DEEP-ASSESSMENT →
#   SCHEDULED-ENTERPRISE-RESOLUTION → RECORD-PRECEDENT+K-COUNT.
# @csps-version 1.0.0 S076
# @csps-owner group:finky
# @csps-lifecycle production
# @csps-lifecycle-state active
# @csps-enforces SANDBOX-boundary-crossing-protocol-S076.md T1 + executor-contract
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

  // Canonical sources for registered boundaries (from boundaries-register.yaml)
  const BOUNDARY_SOURCES = [
    "tools/validators/validate-platform-capacity.mjs", // boundary-001: verify-cycle-cap
    "tools/config/core-spine-registry.yaml",           // boundary-002: l1-core-spine-count
    "tools/data/boundaries-register.yaml",             // the register itself
  ];

  const isBoundarySource = BOUNDARY_SOURCES.some(src => fp.includes(src.toLowerCase()));
  if (!isBoundarySource) { console.log("PASS"); return; }

  // Check for authorization token in content
  let content = String(j.content || j.new_string || "");
  if (Array.isArray(j.edits)) content += "\n" + j.edits.map(e=>(e&&e.new_string)||"").join("\n");

  // Authorization bypass: BOUNDARY-CROSSING-AUTHORIZED: boundary-ID must be in content or tool input
  const authorized = /BOUNDARY-CROSSING-AUTHORIZED:\s*boundary-\d+/.test(content) ||
                     /BOUNDARY-CROSSING-AUTHORIZED:\s*boundary-\d+/.test(d);

  if (authorized) { console.log("PASS"); return; }

  // Block: boundary source edit without authorization
  console.log("BLOCK");
});
' 2>/dev/null || echo "PASS")

if [ "$VERDICT" = "BLOCK" ]; then
  echo ""
  echo "[BOUNDARY-CROSSING-GATE] You are attempting to modify a registered boundary canonical source."
  echo ""
  echo "  Registered boundaries in tools/data/boundaries-register.yaml:"
  echo "    boundary-001: verify-cycle-cap (200) — validate-platform-capacity.mjs"
  echo "    boundary-002: l1-core-spine-count (5) — core-spine-registry.yaml"
  echo ""
  echo "  Crossing a boundary requires the 5-step protocol:"
  echo "    1. STOP+SURFACE — present to Governor in the current turn"
  echo "    2. GOVERNOR FIRST-APPROVAL — explicit human ratification naming the boundary"
  echo "    3. DEEP ASSESSMENT — one-off vs first-of-many? re-derive vs except?"
  echo "    4. SCHEDULED ENTERPRISE-RESOLUTION — dated obligation, calendar-enforced"
  echo "    5. RECORD PRECEDENT + K-COUNT — log in boundaries-register.yaml crossings"
  echo ""
  echo "  To proceed: include BOUNDARY-CROSSING-AUTHORIZED: boundary-NNN in your write content."
  echo "  Reference: docs/plan/_handoff/VAULT/sandbox-specs/SANDBOX-boundary-crossing-protocol-S076.md"
  echo ""
  exit 2
fi
exit 0
