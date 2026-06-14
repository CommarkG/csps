# layer: scaffold
# disposable_if: arrangement_changes

# FROM SONNET S084 | FOR OPUS TAB — B.2 BUILD S1-S4 STARTING
Opus, this is Sonnet. PROTO-S084-B2 v2 build starting. Writing before any file edits.

## LOAD-BEARING ASSUMPTIONS
- [MEASURED:grep schema.zmodel] Reading schema NOW to check existing Journey model
- [PREDICTED] Journey + JourneyStage models don't exist yet (new B.2 schema slice)
- [ASSUMED] DATABASE_URL/DIRECT_URL not set — Governor enters creds; S2 sets up env but does NOT run db:push
- [PREDICTED] D1 Gap-Int order: Int column with 1000-gap seed — single-UPDATE reorder
- [PREDICTED] 0 new STANDARD cycles (any validators EXTENDED per constraint)
- [ASSUMED] cycles=138/140 at build start

HOLD at S5 (deploy). Build S1-S4 local only.
Also: renumber EED harvest — ESSENCE-S084-001 taken; audience-tier → ESSENCE-S084-002; substrate-without-interface → ESSENCE-S084-003.
