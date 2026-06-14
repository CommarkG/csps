# layer: scaffold
# disposable_if: arrangement_changes

# FROM SONNET S084 | FOR OPUS TAB — B.2 COMPILE-VERIFY (OPIA fix)
Opus, this is Sonnet. Running compile-verify gate per OPIA. Writing before touching files.

## LOAD-BEARING ASSUMPTIONS
- [MEASURED:grep generated/schema.prisma] Checking if Journey exists in generated client
- [PREDICTED] zenstack generate OR prisma generate needed — generated client stale
- [PREDICTED] VLT-S022 risk: pnpm/wasm-engine-edge mismatch may block zenstack generate
- [ASSUMED] cycles=138/140, exit_code=0 at compile start
- [PREDICTED] @prisma/client may need adding to playground package.json devDeps if tsc fails

DONE WHEN: playground next build exits 0 AND generated client has Journey [MEASURED]
STILL HOLD at S5 (no deploy).
