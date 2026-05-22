---
id: csps.protos.index
name: protos-index
description: "Registry of all Opus-to-Sonnet directives (PROTOs) — intent, steps, and actual outcomes"
type: doc
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S051
core_spines: [GVRN]
core_spine: GVRN
schema_anchor: vault_files
impl_status: swift-implemented
context_question: "What was planned vs. what was actually built in each PROTO?"
context_quote: "The gap between intent and actual is where the platform's quality lives."
---

# PROTO Registry

All Opus-to-Sonnet directives are saved here as files.

**Convention:**
- File: `PROTO-S[NNN]-[N]-[description].md`
- Before sending to Sonnet: push the file to git, then send one line:
  `Read docs/plan/protos/[filename].md and execute.`
- After Sonnet completes: Sonnet fills in the ACTUAL OUTCOMES section

**Why saved files (not inline chat):**
- Version control on every directive
- Sonnet can reference original intent during execution
- Audit trail: planned vs. actual
- Opus reads both intent and actual at next session start

---

*PROTO Registry | S051 | Infrastructure for Opus-Sonnet communication*
