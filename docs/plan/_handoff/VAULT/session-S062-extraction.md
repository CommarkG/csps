---
id: csps.vault.session-S062-extraction
name: session-S062-extraction
description: "S062 session extraction. Key learnings, synergy opportunities, and inner-AI-defaults updates."
type: session_extraction
version: "1.0"
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: session_extractions
session: S062
links:
  - docs/plan/_handoff/HANDOFF-S062-to-S063.md
  - docs/plan/protos/PROTO-S062-A.md
  - tools/data/improvement-register.yaml
---

# Session S062 Extraction

**Date:** 2026-05-26 | **Sessions:** C1–C5 | **PROTOs:** 3 sealed

---

## §1 Key Learnings

### L1: Measurement honesty is a structural property, not a choice

Before S062, CSPS reported 100% enforcement coverage via body-scan. That number was deeply embedded in habit — no one questioned it. PROTO-S062-A exposed it as inflated by 42 points.

**The learning:** Every metric that aggregates cross-references is a soft metric. True coverage = what's declared in canonical frontmatter, not what's mentioned in prose.

**Platform-wide implication:** Any validator that uses "find the concept anywhere in this file" is potentially over-counting. The correct model: declared fields → enforced properties → auditable.

---

### L2: Ratchet-first discipline prevents regression silently

PROTO-S062-A STEP 6 locked the baseline. Without the ratchet, the 58% gain is fragile — any refactoring that changes a few frontmatter blocks could drop the score below 48% without anyone noticing.

**The learning:** The pattern for any measurement improvement is: fix → measure → ratchet → gate. The measurement alone is advisory. The ratchet + gate makes it structural.

---

### L3: Tool output scale compounds context burn

C3 burned context 3× faster than C4 because verify.mjs, migrator, and git add all emit per-N output. The structural fix is `--brief` flags at the source, not tail-piping downstream.

**Platform implication:** Any tool that emits one line per file should have a `--brief` mode that emits one summary line. This is a generalization of `--skip-install`.

---

### L4: The RELAY protocol enables long multi-step PROTO work across context windows

PROTO-S062-A required 6 STEPS across 5 tabs (C1–C5). The Relay + sonnet-turn.md hand-off mechanism kept state coherent across all of them. The critical success factor: each Opus ruling was complete and self-contained in the relay message.

---

## §2 Synergy Opportunities (CEC Walk)

| Source | Target | Enhancement |
|---|---|---|
| RATCHET pattern from PROTO-S062-A | All future measurement validators | Add `BASELINE_*` constant + ratchet-at-close discipline to every new validator |
| Transient verify failure pattern (INPUT-S063-002) | post-stop-pnpm-verify.sh | Add 2-3sec sleep + retry; reduce false-positive BLOCKING at session close |
| Token budget warning hooks | Post-stop tracker | Extend to also track cumulative verify_runs — helps detect "session too long" before context issues |
| deploy-checklist.md pattern | All apps in apps/ | 6 apps still missing deploy-checklist.md — PROTO-S063 structural fix |
| SONNET STARTUP BLOCK requirement | All future session HANDOFFs | The mandatory section detection is now enforced — no future missed section |

---

## §3 Inner-AI-Defaults Updates

**Category: Measurement Posture**
- Drift detected: AI defaults to "validators exist → coverage is real." 
- CSPS override: "coverage = what frontmatter declares, not what prose mentions."
- Register in: `_handoff/VAULT/inner-ai-defaults/measurement-posture.md`

**Category: Tool Output Scale**
- Drift detected: AI runs validators without `--brief` flags, causing context burn.
- CSPS override: For any tool that emits per-N output, always pipe to `| tail -30` or `| grep key-metric`.
- Pattern: `node tools/verify.mjs 2>&1 | tail -30` is the canonical form.

---

## §4 Positive Patterns Worth Preserving

| Pattern | Session | Reuse in |
|---|---|---|
| Frontmatter-first dual-metric (body-scan advisory, frontmatter canonical) | S062 PROTO-A | Any future multi-format migration |
| 5-tab relay with Opus via sonnet-turn.md | S062 entire session | Any >3 STEP PROTO |
| Token estimation from transcript file size | S062-C4 token-budget hooks | Calibration pass in S063 |
| deploy-checklist.md 7-step format | S062 PROTO-DEPLOY | All future app deploys |

---

## §5 CEC Termination

CEC Cycle 1: Found 5 synergy opportunities (ratchet pattern, transient verify, token tracking, deploy-checklist propagation, startup block enforcement). Recorded in §2.

CEC Cycle 2: Re-walked §2 entries — no new surfaces found. Inner-AI-defaults updates added in §3. All positive patterns registered in §4.

Status: **CEC ACHIEVED** — 0 new findings in Cycle 2.
