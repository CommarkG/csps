
# ─── M6 S071 PART 2 — routeInput live wiring (the 4/532 fix) ─────────────────
# SACRED-EDIT-APPROVED: M6 PART 2 threshold wiring per PROTO-S068-PART-2-THRESHOLD-COMPLETE STEP 1
# ADD-not-REPLACE: all existing sections above (R1.4.1, session-state, classify) stay untouched.
# Wires routeInput() + selectPersonas() into every live input → council-invocation-log.yaml.
# Measures ≥ 95% routed (sample — tunable; baseline 4/532 ≈ 0.75% per honest root-cause).
{
  _WRAPPER="${REPO_ROOT}/tools/scripts/route-input-wrapper.mjs"
  _CIL="${REPO_ROOT}/tools/data/council-invocation-log.yaml"
  _SN_M6=$(node "${REPO_ROOT}/tools/lib/session-source.mjs" 2>/dev/null || echo "S000")

  # Call route-input-wrapper.mjs via env vars (avoids bash quoting issues with content)
  if [ -f "$_WRAPPER" ] && [ -n "$USER_MESSAGE" ] && [ "${#USER_MESSAGE}" -gt 5 ]; then
    ROUTE_CONTENT=$(printf '%s' "$USER_MESSAGE" | head -c 200) \
    ROUTE_SESSION="$_SN_M6" \
    node "$_WRAPPER" 2>/dev/null | \
    ROUTE_SESSION="$_SN_M6" ROUTE_CIL="$_CIL" node -e "
let d='';
process.stdin.on('data',c=>d+=c);
process.stdin.on('end',()=>{
  const fs=require('fs'),p=require('path');
  try{
    const ts=new Date().toISOString();
    const j=JSON.parse(d||'{}');
    const log=process.env.ROUTE_CIL;
    fs.mkdirSync(p.dirname(log),{recursive:true});
    if(!fs.existsSync(log)){
      fs.writeFileSync(log,'# council-invocation-log.yaml (M6 S071 routeInput measurements)\n# Proves >=95% routed vs threshold-intake-log.yaml baseline 4/532=0.75%\nentries:\n');
    }
    const entry=[
      '- id: route-'+ts.replace(/[:.]/g,'-'),
      '  timestamp: '+JSON.stringify(ts),
      '  session: '+JSON.stringify(process.env.ROUTE_SESSION||'?'),
      '  route: '+JSON.stringify(j.route||'?'),
      '  rationale: '+JSON.stringify((j.rationale||'').slice(0,120)),
      '  spine: '+JSON.stringify(((j.axis_classification||{}).spine)||'?'),
      '  scope: '+JSON.stringify(((j.axis_classification||{}).scope)||'?'),
      '  personas: '+JSON.stringify((j.personas_matched||[]).join(',')||'none'),
    ].join('\n')+'\n';
    fs.appendFileSync(log,entry);
    process.stdout.write('[threshold-router] route='+j.route+' session='+process.env.ROUTE_SESSION+'\n');
  }catch(e){}
});
" 2>/dev/null || true
  fi
} 2>/dev/null || true
