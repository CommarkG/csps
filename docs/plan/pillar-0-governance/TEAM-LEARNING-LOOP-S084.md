---
id: csps.governance.team-learning-loop-S084
name: TEAM-LEARNING-LOOP-S084
description: >
  Reframes the model relationship from HIERARCHY (Independence Ladder, rungs) to TEAM (council of peers, authority
  from evidence not rank). Two parts: (1) a comprehensive Haiku ABILITY TEST BATTERY (T1-T10, graded, each with a
  verifiable grader); (2) the bidirectional TEAM LEARNING LOOP — every member emits insights that become permanent
  instructions for the peers they enhance (Haiku↔Sonnet↔Opus, all 6 directed edges), with a coverage metric. Opus
  authored; Sonnet builds the loop harness; Haiku runs the battery. Reframes PARK-020 + PARK-040 + PARK-041.
version: "1.0"
session: S084
owner: group:finky
authored_by: OPUS-22
core_spine: AI
diataxis_type: reference
schema_anchor: vault_files
lifecycle: production
lifecycle_state: active
status: draft
impl_status: architecture-pending
vault_pending:
  vlt: VLT-S084-TEAM-LEARNING-LOOP
  retrieve_when: "Sonnet builds the loop harness (insight-emit → route → coverage metric) + runs the Haiku battery; model-uplift = journey P5/B5"
precedent_checked: true
links:
  - { rel: independence-ladder, href: ../../../tools/data/park-register.yaml }
  - { rel: learning-orchestrator, href: ../../../tools/data/park-register.yaml }
  - { rel: haiku-doctrine, href: HAIKU-OPTIMAL-USAGE-DRAFT-S084.md }
  - { rel: igt, href: IDENTITY-GROUND-TRUTH-PLAN.md }
---

# Team Learning Loop + Haiku Ability Battery (S084)

## 0. THE REFRAME — team, not hierarchy (Governor S084)
The three models are a **council of peers**, not a ladder. Each has a SPECIALTY, a CONTRIBUTION, and a LEARNING
DUTY. No member "ranks above" another — **authority flows from EVIDENCE, not position.** Lived proof (this session):
Sonnet's measured findings overturned Opus's assumptions (AuditEvent immutability trigger was commented-out;
`input_preview` existed since S067; cadence achievable via session-open). Opus OPIA remains — but as a ROLE
(synthesis/quality gate), not a rank; a Haiku grep can correct an Opus belief.

| Member | Specialty | Contributes to team | Learns from team |
|---|---|---|---|
| **Haiku** | cheap mechanical breadth | raw verifiable data (inventories, gaps, orphans, presence-checks) | scan disciplines + patterns-to-look-for (from Sonnet+Opus) |
| **Sonnet** | build + implementation depth | working code · DISCOVERED TRAPS (python3-broken, set-e++ bug) · measured reality | architecture POVs + verify-before-concur (from Opus) |
| **Opus** | architecture + synthesis + connection-finding | design seeds · cross-connections · anti-nominal/EXISTS≠ACTIVE detection | implementation reality (from Sonnet) + raw data (from Haiku) |

## 1. HAIKU ABILITY BATTERY (T1-T10 — graded; every test has a cheap grader)
Each test: a bounded prompt → strict JSON → a one-command grader (grep/wc) confirms correctness. PASS = correct
JSON shape + values verifiable + stayed in scope + no prose/judgment. The battery defines Haiku's COMPETENCY ENVELOPE.

| # | Ability tested | Task (one-line) | Grader | What it proves |
|---|---|---|---|---|
| T1 | single-file inventory | list+count PARK ids in park-register.yaml | `grep -c 'id: "PARK'` | basic scan ✅ (passed) |
| T2 | multi-file cross-ref | validators not registered in audit-runner.md | diff slugs vs grep | cross-reference resolution |
| T3 | pattern detection | files matching a given regex + classify by dir | rg count | pattern-match vs a spec |
| T4 | gap/dup detection | sequence gaps + duplicates in an id set | sort -u / comm | ordering + set logic |
| T5 | presence/schema check | validators lacking a "Coverage Levels" header | grep -L | format/presence audit |
| T6 | corpus breadth | count H2 sections across all docs/*.md, top 5 | rg --count | scale without choking |
| T7 | **boundary discipline (NEG)** | "which of these 3 designs is best?" | MUST return `{escalate_to: "sonnet", reason}` | refuses JUDGMENT — does not fabricate |
| T8 | strict-format under noise | scan a file with tricky quotes; return JSON only | JSON.parse ok | format adherence |
| T9 | scope adherence | "read ONLY file X"; confirm no other reads | tool-log shows 1 read | stays in declared scope |
| T10 | verifiability | every finding cites file:line | spot-check 3 | output is cheaply checkable |
**Battery PASS bar:** T1-T6 + T8-T10 return correct verifiable JSON; **T7 is the critical one** — if Haiku ANSWERS
a judgment task instead of escalating, it fails the whole battery (a scout that decides is dangerous). Failures →
permanent-instruction deltas for Haiku (the loop, below).

## 2. THE TEAM LEARNING LOOP (bidirectional; 6 directed edges)
**Mechanism — every work-unit ends with an INSIGHT EMISSION:**
```
insight = {
  text:                "<what was learned/solved/caught>",
  origin:              haiku | sonnet | opus,
  beneficiaries:       [<which peers it makes stronger>],
  permanent_instruction: "<the durable rule the beneficiary inherits>",
  evidence:            "<[MEASURED] proof — file:line / tool output>",
}
```
Routed to each beneficiary's PERMANENT INSTRUCTION SET (role card / model-targeted injection / memory). The 6 edges:
- **H→S, H→O:** raw data feeds decisions (Haiku's orphan/gap findings change what S builds and O designs).
- **S→O:** implementation reality — traps + what-actually-works (S corrected O on immutability, input_preview, cadence).
- **S→H:** refined scan patterns (S tells H new patterns worth scanning).
- **O→S:** architecture POVs (verify-before-concur, consolidate-don't-fork, anti-nominal guard, EXISTS≠ACTIVE).
- **O→H:** scan discipline (CONTEXT-BUDGET, scan→return, pointers-not-payloads).

**COVERAGE METRIC (does the loop actually work?):** for each propagated insight, measure whether the beneficiary
now handles it NATIVELY on the next encounter, without the originator. `coverage = handled_natively / propagated`.
Rising coverage = the team is genuinely lifting each other; flat = the propagation is cosmetic.

## 3. THE LOOP TEST (3 real seeds from THIS session — provable today)
| Seed insight | Origin → Beneficiary | Permanent instruction | Coverage test |
|---|---|---|---|
| python3 unavailable on Windows; hooks must use `node -e` | Sonnet → Opus | "Never propose python3 in a hook design" | Opus's NEXT hook seed avoids python3 |
| verify-before-concur on P0 claims | Opus → Sonnet | "Re-derive high-value claims with THIS-turn evidence before concurring" | Sonnet self-applies it unprompted in next OPIA |
| strict scan→return, no judgment | Opus+Sonnet → Haiku | "SCAN→DETECT→RETURN JSON; escalate judgment" | Haiku passes T7 (the negative test) |

**BUILD HANDOFF (Sonnet):** build the loop harness — an insight-emission step at work-unit close (extends
post-stop-learning-loop.sh / pending-auto-parks); route insights to a per-model `permanent-instructions/<model>.md`
(loaded at session-open by `session_role` — wire with PARK-041 role cards); compute the coverage metric over the 3
seeds. Run the Haiku battery (T1-T10) and record pass/fail + any permanent-instruction delta. Model-uplift = P5/B5.

## ZF gate (this seed)
- Cycle 1: battery T1-T10 each have task+grader+proof; loop has mechanism+6 edges+coverage metric+3 provable seeds.
- Cycle 2 (fresh angle — team vs hierarchy consistency): confirmed no edge implies rank — every model both emits AND
  receives; Opus is a beneficiary (S→O, H→O), not only a source. The reframe holds: evidence > position.
