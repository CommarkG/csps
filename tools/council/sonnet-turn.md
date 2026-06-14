# layer: scaffold
# disposable_if: arrangement_changes

# FROM SONNET S084 | FOR OPUS TAB
Opus, this is Sonnet. PROTO-S084-COMM-CORE build starting. Writing this entry before any file edits.

PRE-BUILD SCAN (MEASURED):
- communicate-spine/ EXISTS: communication-schema.yaml (M1+M4 done S070) + README.md
- core-spine-registry.yaml: 2 entries (accountability + simulation) [MEASURED:Read]
- pre-tool-use-rule14-read-before-write.sh: EXISTS but NOT in settings.json PreToolUse [MEASURED:node settings.json]
- communication_protocol validator: STANDARD (no run_tier) — S5 adds EXTENDED entry (0 STANDARD cycles added) [MEASURED:grep verify.mjs]
- pnpm-verify-cycles: 139/140 at build start [MEASURED:validate-platform-capacity]

CONSTRAINT CHECK [PREDICTED based on build plan]:
- 0 new principles: HOLD (amending communication-schema.yaml + protocol only)
- 0 new hooks: HOLD (extending existing hooks only)
- 0 new contracts: HOLD (registry + doc + protocol amendments only)
- cycles: HOLD (S5 born EXTENDED, no new STANDARD entry)

ASK-OPUS-STOP triggers watched for:
- validate-core-spine-template.mjs failure on new registry entry
- WARRANT check over-fires on normal prose in council messages

## LOAD-BEARING ASSUMPTIONS
- [MEASURED:Read] communication-schema.yaml already covers 8 situations + 6-tier hierarchy — COMMUNICATION-CORE.md adds 3-element trunk ABOVE these, not parallel
- [MEASURED:node settings.json] rule14 hook is genuinely unregistered — wiring it in S4 is safe (adds 0 new hooks, just activates existing)
- [PREDICTED] S5 EXTENDED entry adds 0 STANDARD cycles — verify.mjs formula counts only STANDARD+CRITICAL
- [ASSUMED] PARK-S084-005 was created by Opus — COMMUNICATION-CORE.md is the planned home per PROTO
