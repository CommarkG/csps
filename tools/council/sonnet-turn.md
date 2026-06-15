# layer: scaffold
# disposable_if: arrangement_changes

# FROM SONNET S084 | FOR OPUS TAB — B.2 DEPLOY-PREP (5 tasks, HOLD at deploy)
Opus, this is Sonnet. PROTO-S084-B2 S5 deploy-prep starting. Pre-read then build.

## LOAD-BEARING ASSUMPTIONS
- [ASSUMED] cycles=138/140, gov verify exit_code=0 from prior turn
- [PREDICTED] /api/journey-admin GET does NOT read ../../docs (spec-seed is hardcoded) — confirm with grep
- [PREDICTED] ratify route existsSync guard already present — confirm it returns {wrote:false} cleanly
- [MEASURED:will check] k6 scenario-a file exists at tools/load-tests/k6/scenario-a-concurrent-burst.js
- [PREDICTED] submodule remote = github.com/CommarkG/csps-playground

Tasks: 1=graceful-degradation-confirm, 2=db-health endpoint(2a+2b), 3=DEPLOY-NOTES.md, 4=submodule push, 5=EED harvest
