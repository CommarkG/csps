---
id: csps.platform-intelligence.cross-platform-exchange-spec
name: cross-platform-exchange-spec
description: >
  Design spec for the CSPS ↔ CSP mutual exchange framework.
  Defines: the sharing element structure, bidirectional tracking,
  absorption validation, auto-generation from session summaries,
  and the canonical communication template. Governor-directed S082.
version: "1.0"
status: draft
lifecycle: production
lifecycle_state: active
owner: group:finky
core_spine: GVRN
schema_anchor: pillar_0_governance_leaves
diataxis_type: reference
impl_status: swift-implemented
session: S082
links:
  - { rel: platform-intelligence-index, href: ./README.md }
  - { rel: consolidation-audit, href: ../plan/pillar-0-governance/CONSOLIDATION-AUDIT-S082.md }
---

# Cross-Platform Exchange Spec — CSPS ↔ CSP

**Status:** DRAFT — Governor ratification pending.
**Spine:** GVRN (platform governance). No-Orphans parent: GVRN L1.

---

## What Exists Today (Current State)

### Outgoing (CSPS → CSP)
7 professional reports sent 2026-06-03:
- PE Engine, CIE, IZFC, AI-Profiling, Prevention-over-Correction, Prove-Real reply, Inheritance
- All in `docs/platform-intelligence/`
- Format: professional MD with frontmatter

### Incoming (CSP → CSPS)
- **Zero.** No CSP-authored docs in this repo.
- No tracking of what CSP sent.
- No absorption validation list.

### Infrastructure
- No template for how communications are structured
- No absorption confirmation mechanism
- No auto-generation from session summaries
- No spine home for the exchange

---

## Design: Bidirectional Exchange Framework

### Directory Structure

```
docs/platform-intelligence/
├── README.md                           ← Index (existing; needs update)
├── CROSS-PLATFORM-EXCHANGE-SPEC.md    ← This file
├── exchange-log.yaml                  ← SSoT: all exchanges, both directions (NEW)
├── absorption-validation.md           ← Validation list (NEW)
│
├── outgoing/                          ← CSPS sends to CSP (NEW subdir)
│   ├── CSPS-report-on-PE-2026-06-03.md      (move from root)
│   ├── CSPS-report-on-CIE-2026-06-03.md     (move)
│   ├── CSPS-report-on-IZFC-2026-06-03.md    (move)
│   ├── CSPS-report-on-AI-Profiling-2026-06-03.md  (move)
│   ├── CSPS-report-on-Prevention-2026-06-03.md    (move)
│   ├── CSPS-reply-to-CSP-PROVE-REAL-2026-06-03.md (move)
│   └── CSPS-report-on-Inheritance-2026-06-03.md  (move)
│
└── incoming/                          ← CSP sends to CSPS (NEW subdir)
    └── (empty — awaiting first CSP contribution)
```

**Note:** Moving the existing 7 files into `outgoing/` requires updating all links. Governor ratification required before the restructure.

---

## Exchange Log Schema (`exchange-log.yaml`)

```yaml
# docs/platform-intelligence/exchange-log.yaml
# SSoT for all cross-platform exchange items (both directions)
# Validated by: validate-cross-platform-exchange.mjs (PLANNED)

exchanges:
  - id: "EX-2026-06-03-001"
    direction: "CSPS→CSP"
    topic: "Priority Engine deep-dive"
    file: "outgoing/CSPS-report-on-PE-2026-06-03.md"
    sent_date: "2026-06-03"
    sent_session: "S081"
    absorption_status: "pending"  # pending | confirmed | deferred
    absorption_confirmed_date: null
    absorption_confirmed_by: null
    csps_absorbed: true            # was this item also absorbed into CSPS itself?
    csps_absorbed_evidence: "tools/validators/validate-pe-connectivity.mjs + playground page"
    notes: ""

  - id: "EX-2026-06-03-002"
    direction: "CSPS→CSP"
    topic: "CIE (Continuous Intelligence Engine)"
    file: "outgoing/CSPS-report-on-CIE-2026-06-03.md"
    sent_date: "2026-06-03"
    sent_session: "S081"
    absorption_status: "pending"
    absorption_confirmed_date: null
    absorption_confirmed_by: null
    csps_absorbed: true
    csps_absorbed_evidence: ".csps/intelligence/cie-state.yaml + pipeline"
    notes: ""

  # ... (3-7 similar entries for remaining 2026-06-03 reports)
```

---

## Absorption Validation

### `absorption-validation.md` — format

```markdown
# Cross-Platform Absorption Validation

## Outgoing — CSPS → CSP (pending confirmation)

| ID | Topic | Sent | CSP Absorbed? | Evidence |
|----|-------|------|---------------|---------|
| EX-2026-06-03-001 | Priority Engine | 2026-06-03 | ⏳ pending | — |
| EX-2026-06-03-002 | CIE | 2026-06-03 | ⏳ pending | — |
| ... | | | | |

## Incoming — CSP → CSPS (pending absorption)

| ID | Topic | Received | CSPS Absorbed? | Evidence |
|----|-------|----------|----------------|---------|
| (none yet) | | | | |

## Validation Rule
- `pending` for > 3 sessions → escalate to Governor (flag in weekly audit)
- `confirmed` requires: Governor statement OR CSP audit output citing the CSPS element
```

---

## Communication Template

Every cross-platform communication MUST use this template:

```markdown
---
# COMMUNICATION TEMPLATE — CSPS ↔ CSP (canonical format)
# File naming: [SENDER]-[TOPIC]-[DATE].md
# Examples:
#   CSPS-report-on-PE-2026-06-09.md  (CSPS sends a report)
#   CSP-report-on-[TOPIC]-2026-06-09.md  (CSP sends to CSPS)

id: [platform]-[type]-[topic]-[date]
name: [SENDER]-[type]-on-[topic]-[date]
direction: "CSPS→CSP" | "CSP→CSPS"
topic: "[short topic name]"
type: "report" | "reply" | "proposal" | "update"
session: S[NNN]
authored_date: "YYYY-MM-DD"
links:
  - { rel: platform-intelligence-index, href: [relative path to README.md] }
  - { rel: exchange-log, href: [relative path to exchange-log.yaml] }
---

# [PLATFORM] [Type] on [Topic]

## Summary (3 sentences max)
[What this document covers. What the recipient should take away. What action, if any, is needed.]

## Background
[Context: what problem this addresses, what prompted this communication]

## Content
[The main body — deep-dive, proposal, findings, or reply]

## Absorption Checklist
For the receiving platform to confirm absorption:
- [ ] Read and understood the main content
- [ ] Identified which elements apply to our platform
- [ ] Scheduled or completed platform-side implementation
- [ ] Confirmed absorption in exchange-log.yaml (status: confirmed)

## Links to Receiving Platform
[Links to where this element was implemented/absorbed in the receiving platform — fill in after absorption]
```

---

## Auto-Generation: Session Summary Integration

### New `§10.CROSS-PLATFORM` Section in Closing Summary

Every session closing summary that produces platform-intelligence artifacts MUST include:

```markdown
## §10.CROSS-PLATFORM — Exchange Artifacts

### New Outgoing Elements (CSPS → CSP)
| Element | Topic | File | Exchange-Log ID |
|---------|-------|------|-----------------|
| [type] | [topic] | [file path] | EX-[date]-[seq] |

### Incoming Elements to Absorb (CSP → CSPS)
| Element | Topic | Source | Absorption Status |
|---------|-------|--------|-------------------|
| — | | | |

### Auto-Generated Exchange Log Update
[The session builder writes the exchange-log.yaml rows for new items HERE]
```

### Auto-Generation Trigger (planned — PHASEB)
A `post-stop-cross-platform-exchange-check.sh` hook fires at session stop:
1. Scans docs/platform-intelligence/ for new files since last session
2. Checks exchange-log.yaml for pending absorptions > 3 sessions
3. Alerts if new files exist without exchange-log entries
4. Emits a reminder to add §10.CROSS-PLATFORM to closing summary

---

## Spine Placement

B_COUNCIL_PEER's wisdom applies here: value accrues from consulting regardless of intelligence differential. This framework institutionalizes that at the platform level.

| Aspect | Spine | Location |
|--------|-------|---------|
| Exchange governance | GVRN | This file; exchange-log.yaml |
| Outgoing reports | GVRN | docs/platform-intelligence/outgoing/ |
| Incoming docs | GVRN | docs/platform-intelligence/incoming/ |
| Absorption validation | VALD | absorption-validation.md |
| Auto-generation hook | OPER | .claude/hooks/ (PLANNED PHASEB) |
| Validator | VALD | validate-cross-platform-exchange.mjs (PLANNED) |

---

## Implementation Sequence (post-Governor ratification)

1. **Ratify this spec** — Governor confirms EQA meaning + exchange framework
2. **Create exchange-log.yaml** — backfill 7 existing outgoing entries
3. **Create absorption-validation.md** — populate with 7 pending confirmations
4. **Update README.md** — add incoming/ + outgoing/ to index
5. **Add §10.CROSS-PLATFORM to closing-summary-template.md** — from next session
6. **PHASEB: build** `validate-cross-platform-exchange.mjs` + `post-stop-cross-platform-exchange-check.sh`

---

*DRAFT — awaiting Governor ratification of exchange framework + EQA meaning.*
