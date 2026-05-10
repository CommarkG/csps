---
id: csps.handoff.vault.blockers-S002
name: handoff-vault-blockers-S002
description: Mechanical blocker registry — every question I asked the user that did not receive an explicit reply (yes/no/drop). Per user directive at S002 turn 6 ("'drop it' is also a reply but no comment is a blocker — make it mechanical"), a question with no acknowledgement is a blocker. The S002 close cannot finalize until each row is resolved. Pre-runtime, this file is the manual blocker queue; post-runtime, audit `unanswered-questions-blocker` enforces.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-05-09
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocols, href: ./protocols.md }
domain_path: platform
---

# S002 Blocker Registry

> **No comment is a blocker. Make it mechanical.** — User directive S002 turn 6

## What this file holds

Every question the AI asked the user during S002 that did not receive an explicit reply. The AI cannot close the session (no HANDOFF-S002-to-S003.md) until each row's `state` is `answered` or `explicitly-dropped`.

This is the manual mechanical layer that pre-dates the runtime audit `unanswered-questions-blocker`. The user's directive made this enforcement a P-META-005 + P-META-004 requirement.

## Schema per blocker row

| Column | Meaning |
|---|---|
| `BLK-ID` | Sequential per-session (`BLK-S002-NNN`) |
| `asked_at` | ISO timestamp when AI asked |
| `question` | Verbatim question text |
| `awaiting_from` | user / AI / external |
| `state` | open / answered / explicitly-dropped / superseded |
| `resolution` | Free-form text; for `answered`: the user's answer; for `explicitly-dropped`: the drop reason; for `superseded`: link to superseding question |
| `resolved_at` | ISO timestamp |

State `open` BLOCKS session close. AGENTS.md hard NO will be added: *"Never write HANDOFF-S<NNN>-to-S<NNN+1>.md while any BLK-S<NNN>-* is in state `open`."*

## S002 blockers

| BLK-ID | asked_at | question | awaiting_from | state | resolution | resolved_at |
|---|---|---|---|---|---|---|
| BLK-S002-001 | 2026-05-02T~13:00Z (turn 4) | "Confirm hybrid 3-layer intake architecture (Option C in PCR)?" | user | **answered** | User S002 turn 9: "I approve all your recommendations". Recommendation: C — Hybrid 3-layer (per-source connectors + thin policy gate + pub/sub fan-out). Industry-validated against Glean/M365/Notion/Cohere/Snowplow/Salesforce. | 2026-05-02T18:00Z (turn 9) |
| BLK-S002-002 | 2026-05-02T~13:00Z (turn 4) | "Decide on `AIBehavior` schema slice — introduce in week 4, extend AuditCheck instead, or defer?" | user | **answered** | User S002 turn 9: "I approve all your recommendations". Recommendation: C — Defer to week 6+. Rationale: ai-behavior-spine.md + behavioral-contracts.md as markdown source-of-truth proves value first; DB consolidation only when dashboard need is REAL not anticipated; reduces week 4 scope. | 2026-05-02T18:00Z (turn 9) |
| BLK-S002-003 | 2026-05-02T~13:00Z (turn 4) | "Confirm connector cohort priority (week 5/6/7/8 order as drafted, or shuffle if AI-app exports should land first because that's where treasures live)?" | user | **answered** | User S002 turn 9: "I approve all your recommendations". Recommendation: B — Shuffle. Week 5: AI-app exports first (Claude Code / ChatGPT / Cursor / Lovable / CSP-platform); Week 6: PDF/text; Week 7: Google ecosystem; Week 8: video/image/audio. | 2026-05-02T18:00Z (turn 9) |
| BLK-S002-004 | 2026-05-02T~14:30Z (turn 6) | "The 2 'uploaded files' the user mentioned — are they actually attached? They are not visible in the AI's context." | user | **resolved** | Documents WERE attached as `<document>` blocks in turn 7 user message. AI's prior "not visible" claim was a B_VALIDATE_BEFORE_ASSUME failure. Documents now processed: EXT-20260502-002 + 003. Engraved as memory + AGENTS.md hard NO. | 2026-05-02T17:00Z (turn 7) |
| BLK-S002-005 | 2026-05-02T~14:30Z (turn 6) | "Approve protocols.md v1.2 (intent-to-impact §16 + two-sided handshake §17)?" | user | **answered** | User S002 turn 9: "I approve all your recommendations". Recommendation: A — Approve as written. v1.2 ships; HANDOFF-S002-to-S003.md uses §16 + §17 + §11b/c structure. | 2026-05-02T18:00Z (turn 9) |
| BLK-S002-006 | 2026-05-02T~17:30Z (turn 7) | "Input-assessment-questions.md shape — accept all 43 mandatory, or split into mandatory minimum (13) + conditional (18) + emergent (12)?" | user | **answered** | User S002 turn 9: "I approve all your recommendations". Recommendation: B — Split (13 mandatory + 18 conditional + 12 emergent). | 2026-05-02T18:00Z (turn 9) |
| BLK-S002-007 | 2026-05-02T~17:30Z (turn 7) | "Spine naming — keep or rename?" | user | **answered** | User S002 turn 9: "I approve all your recommendations". Recommendation: A — Keep `ai-behavior-spine.md`. | 2026-05-02T18:00Z (turn 9) |
| BLK-S002-008 | 2026-05-02T~17:30Z (turn 7) | "Add 'Ask user about prior-platform precedent' as fresh-chat protocol §11 step 0?" | user | **answered** | User S002 turn 9: "I approve all your recommendations". Recommendation: A — Add as step 0, BEFORE reading any other doc. Would have prevented this session's biggest failure pattern. | 2026-05-02T18:00Z (turn 9) |

## Resolution protocol

When the user replies:

1. **Explicit answer** (e.g., "yes hybrid pattern is approved" or "defer AIBehavior to week 6" or "drop connector cohort question; use the drafted order"):
   - State → `answered` or `explicitly-dropped`
   - Resolution: verbatim user answer
   - Resolved_at: timestamp

2. **Implicit / partial / no answer**:
   - State stays `open`
   - The AI MUST re-ask in the closing summary of the next session that touches the relevant work

3. **Superseded** (a later turn's question makes the original moot):
   - State → `superseded`
   - Resolution: link to the superseding BLK-ID
   - Resolved_at: timestamp

## Mechanical enforcement (pre-runtime + post-runtime)

### Pre-runtime (S002 onwards)

- AGENTS.md hard NO: *"Never close a session with `state: open` blockers."*
- Every closing summary lists every `open` blocker AND every blocker resolved this session.
- Every fresh-chat opening surfaces every `open` blocker from prior sessions.
- AI cannot write `HANDOFF-S<NNN>-to-S<NNN+1>.md` if blockers exist.

### Post-runtime (week 4+)

- Audit `unanswered-questions-blocker` (PR + nightly): scans this file (or its DB equivalent `public.session_blocker`); fails build if `state: open` rows exist past their SLA.
- Per-blocker SLA: 3 sessions max in `open` state before escalation to `error` severity.
- Lifetime auto-archive: blockers in `superseded` or `explicitly-dropped` for >180d move to `_handoff/_archive/blockers-history.md`.

## Why this file exists

The user's exact words at S002 turn 6:

> *"go over the session and insist on getting all answers you asked for and did not get a complete reply !! make it a blocker. 'drop it' is also a reply but no comment is a blocker. make it mechanical"*

Without this registry, the AI's "asks" disappear into chat history. The user is telling me: my asks must persist as work-items the same way their asks become my work-items. Symmetric accountability.

This file is the mechanical answer. The 5 open blockers above will not be silently dropped. They will be re-surfaced at the closing summary AND at the next fresh-chat opening UNTIL each is `answered` or `explicitly-dropped`.

The new session that starts after S002 close will see these in `protocols.md` §11 fresh-chat protocol step 7+ (which now reads this blocker registry as part of stewardship-review).

## Cross-references

- [protocols.md](./protocols.md) §10 closing — adds blocker-list surfacing
- [protocols.md](./protocols.md) §11 fresh-chat — adds blocker-list resurfacing
- [../HANDOFF-S001-to-S002.md](../HANDOFF-S001-to-S002.md) — the foundational handoff (no blockers carried from S001 because S001 closed without explicit unanswered-question tracking; that gap is precisely what this file closes for S002+)
- AGENTS.md hard NO additions (this turn)
