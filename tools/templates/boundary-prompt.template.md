---
id: csps.templates.boundary-prompt
name: boundary-prompt.template
description: "Canonical template for ALL tab→tab boundary prompts (Opus→Sonnet startup, Sonnet→Opus directive, OPUS-N→OPUS-N+1 handoff, Sonnet→Sonnet handoff). Authored S071 Turn 27 (OPUS-14) per Governor directive after freestyle drift caught: 'I am opus #14 you are new sonnet tab .... and then all that is needed.' Mechanical enforcement: validate-boundary-prompt-format.mjs checks the 4 mandatory header lines + presence of role identification + scope + discipline + cross-review attestation. Composes with B_ZCA (Zero-Context Assumption) + B_BOUNDARY_ALIGNMENT_PROTOCOL + B_MUTUAL_UNDERSTANDING_VALIDATION + communication-protocol-shared.md Rule 7."
type: template
diataxis_type: reference
protection_level: protected
status: ratified
ratified_by: "Governor S071 Turn 27 (anti-freestyle directive)"
ratified_at: "2026-05-30"
core_spine: GVRN
core_spines: [GVRN, AI]
schema_anchor: vault_files
version: "1.0"
session: S071
owner: group:finky
authored_by: OPUS-14
lifecycle: production
lifecycle_state: active
context_question: "Before sending this prompt across a tab boundary: does it lead with WHO I AM + WHO YOU ARE + WHAT THIS IS + WHAT TO DO NOW? Has the counterpart tab cross-reviewed it?"
inherits_from: "communication-protocol-shared.md Rule 7 (ZCA) + B_ZCA + B_BOUNDARY_ALIGNMENT_PROTOCOL + B_MUTUAL_UNDERSTANDING_VALIDATION"
---

# Boundary Prompt Template (canonical · S071 Turn 27)

Fill {variables} from the current state. The 4 header lines are MANDATORY (mechanical check). The rest is content.

```
═══════════════════════════════════════════════════════════════════
I AM: {sender_role_with_instance} (e.g. "OPUS-14, architectural director, S{NNN}")
YOU ARE: {receiver_role_with_session} (e.g. "Sonnet, builder S{NNN}")
THIS IS: {prompt_type} (e.g. "S{NNN-1} → S{NNN} session-open boundary prompt")
DO NOW: {one-sentence first-action} (e.g. "Run M-43, verify, settings.local check, ZF-deep strict, then read in order a/b/c/d below")
═══════════════════════════════════════════════════════════════════

CROSS-REVIEW ATTESTATION (per S071 Turn 26 discipline):
  Reviewed by: {counterpart_tab_role} on {timestamp}
  Catches folded: {list of catches} or "none — counterpart had no catches"
  Or: "NOT YET CROSS-REVIEWED — Governor MAY ask counterpart tab to review before relay"

CONTEXT (1-3 sentences situating this prompt — WHY now, WHAT just happened):
  {1-3 sentences}

═══════════════════════════════════════════════════════════════════
{prompt body — milestones · disciplines · gates · vault items · etc.}
═══════════════════════════════════════════════════════════════════

DISCIPLINE INHERITED (1 line per active enforcement):
  - {discipline 1} (mechanical surface: {hook/validator/contract})
  - {discipline 2}
  - ...

GATES THAT MAY FIRE (R-class triggers):
  - {gate} → resume condition: {condition}

KEY VAULT ITEMS:
  - {vlt-id}: {title}

## MOAT REVIEW (SEED-B — mandatory for tab-transfer + session-close handoffs)
  Moats touched this tab/session:
    - M-{NN}: {moat name} — {strengthened | at-risk | unchanged} — {reason}
    - (or "none — no moat-adjacent work this tab")
  Moat-registry updates made:
    - {update, or "none"}
  validate-moat-coverage.mjs output (last run):
    - {paste: moat_elements_with_coverage=X/15}

— {sender_role} (authored {date} · cross-reviewed {date or "pending"})
═══════════════════════════════════════════════════════════════════
```

## Notes on the 4 mandatory header lines

1. **I AM:** specific role + instance/session — kills ambiguity about who's writing. Sonnet CANNOT claim Governor identity in the I AM field (G2 identity guard). Use `FROM SONNET | FOR OPUS TAB` framing when writing boundary prompts that reference the Governor's relay role.
2. **YOU ARE:** specific role + session — the receiver's identity is named so the prompt isn't generic.
3. **THIS IS:** the artifact type — boundary prompt, milestone directive, OPIA, handoff, etc. — so the receiver knows the protocol.
4. **DO NOW:** one-sentence first action — kills the "where do I start?" friction.

Anything missing one of these = freestyle drift = the failure Governor S071 Turn 27 named.

## Enforcement Trio (PROTO-S072-COUNCIL-ADDRESS — COMPLETE as of S072 M-CA)

**T1 (BLOCKING — real-time gate):** `.claude/hooks/pre-tool-use-council-address-required.sh`
Fires on Write|Edit to council-channel files. Blocks new turn entries that lack address headers.
Prevention class: `CONVENTION-DEFINED-BUT-ENFORCEMENT-ADVISORY` (inaugural structural fix).

**T2 (BLOCKING — scoped; ADVISORY — pre-discipline):** `validate-boundary-prompt-format.mjs`
Scans `tools/council/opus-turn.md` + `sonnet-turn.md` for TOP/MOST-RECENT entries: **BLOCKING** if missing headers.
Scans `docs/plan/_handoff/VAULT/chat-jump-prompt-*.md`: **ADVISORY** only (pre-discipline corpus, do NOT retrofit).
Detection uses line-start check (trimStart().startsWith) — prevents false positives from prose mentions.

**T3 (awareness):** session-open injection + AGENTS.md hard NO (`COUNCIL ADDRESS PROTOCOL`) + this template reminder.

> Prior state (S071-S072 before M-CA): T2-advisory + T3-soft → drifted every tab. Advisory governance = documentation.
> Per AP-001 (EXISTS≠ACTIVE) and Enforcement Trio principle: T3-only WILL drift.

Composes with: `validate-boundary-alignment.mjs` + `validate-handoff-completeness.mjs` + `B_ZCA`.

— OPUS-14 (S071 Turn 27 · authored 2026-05-30 · mechanically-enforcing the cross-review and ZCA disciplines)
— OPUS-15 (S072 M-CA · enforcement trio completed 2026-05-30 · T1 hook authored + smoke-tested 9/9)
