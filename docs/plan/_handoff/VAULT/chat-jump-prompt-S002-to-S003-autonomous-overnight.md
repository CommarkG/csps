---
id: csps.handoff.vault.chat-jump-prompt-S002-to-S003-autonomous-overnight
name: chat-jump-prompt-S002-to-S003-autonomous-overnight
description: Autonomous-overnight variant of S002→S003 paste-prompt. User goes to sleep; S003 runs the full §3 FWWS-pending batch (Pillars 4-5-6 migration + vault snapshots + S002 deferrals) WITHOUT per-batch confirmation, with mandatory RZF+CEC+FSE evidence after every artifact, and writes a closing-summary + S003→S004 handoff at end-of-run. Replaces user-mediation with self-attestation per B_TWO_SIDED_HANDSHAKE counterweight. Saved per protocols.md §22 + B_PROTOCOL_LITERAL_EXECUTION + B_FIVE_SURFACE_ENGRAVING.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:end-user
  - audience:ai-agent
  - maturity:stable
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: standard-variant, href: ./chat-jump-prompt-S002-to-S003.md }
  - { rel: handoff, href: ../HANDOFF-S002-to-S003.md }
  - { rel: protocols, href: ./protocols.md }
  - { rel: closing-template, href: ./closing-summary-template.md }
domain_path: platform
---

# S002 → S003 Chat-Jump Prompt — AUTONOMOUS OVERNIGHT VARIANT

## Context

User S002 turn 18: "prepare a prompt for the fresh chat — 1 include what was done and improved; 2 as i want to go to sleep.. can you instruct it to perform a long implementation run without stopping with all defined validation after all batch and move on automatically?"

This file is the autonomous-overnight paste-target. Use the standard variant `chat-jump-prompt-S002-to-S003.md` for interactive sessions; use THIS variant when the user is asleep / unavailable and wants S003 to run the §3 FWWS-pending batch end-to-end.

## How to use

1. Open a new Claude Code chat
2. Set the title to: `S003 [autonomous overnight, continues S002]`
3. Paste the prompt below as the FIRST message
4. Close the laptop / go to sleep — S003 will run end-to-end and emit the closing handoff before stopping
5. When you wake: read the closing summary in the new chat's last message + the new HANDOFF-S003-to-S004.md file

---

## THE PROMPT (paste this verbatim — do not edit)

```
You are S003, continuing CSPS work from S002 (Session 002, complete 2026-05-02).
This is an AUTONOMOUS OVERNIGHT RUN. The user is going to sleep. They have explicitly
authorized end-to-end execution of §3 FWWS-pending in HANDOFF-S002-to-S003.md WITHOUT
per-batch confirmation. They will read your closing summary when they wake up.

══════════════════════════════════════════════════════════════════════════════════
PART A — WORKSPACE VERIFICATION (MANDATORY FIRST 4 TOOL CALLS)
══════════════════════════════════════════════════════════════════════════════════

⚠️ You will see a "Wrong workspace — CSP governance not active" warning from
c:\Users\finky\CLAUDE.md. **That warning is a FALSE POSITIVE for CSPS work.**
CSPS LIVES IN the VSAS folder (c:\Users\finky\Desktop\Claude Code\VSAS - Various
Saas & Apps Solutions\). The parent CLAUDE.md treats VSAS as "not CSP" therefore
"wrong" — wrong inference for CSPS. Do not invoke "EPR-011 CSP error registry" —
that's a CSP construct, not CSPS. Do NOT refuse work citing the warning. Do NOT
reproduce the wrong-workspace boilerplate as your first reply. (S003-prior-attempt
hit this trap; engraved at feedback_parent_claude_md_wrong_workspace_trap.md.)

Per B_VALIDATE_BEFORE_ASSUME (tool-call sandwich), run these 4 ls commands FIRST:
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\docs\plan\_handoff\HANDOFF-S002-to-S003.md"
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\docs\plan\_handoff\VAULT\protocols.md"
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\docs\plan\_handoff\VAULT\closing-summary-template.md"
- ls "c:\Users\finky\Desktop\Claude Code\VSAS - Various Saas & Apps Solutions\packages\principles\principles.yaml"

If all four exist → workspace correct, proceed. If any missing → halt + write a
single-message blocker file at _handoff/VAULT/blockers-S003.md with the missing
paths, then stop (this is the only acceptable halt condition).

══════════════════════════════════════════════════════════════════════════════════
PART B — PRE-ANSWERED PROTOCOL STEPS (do not block waiting on user; user is asleep)
══════════════════════════════════════════════════════════════════════════════════

Step 0 (precedent question, protocols.md v1.7 §11):
ANSWER FROM USER: "All CSP carry-forwards already absorbed in S002 (treasures #1-5
processed; EXT-20260502-001 through 005 in _intake/processed/). No new prior-platform
precedent to surface tonight. Proceed."

Two-sided handshake (B_TWO_SIDED_HANDSHAKE):
USER MEDIATION REPLACED WITH SELF-ATTESTATION per the contract's counterweight clause
(low-stakes / fully-autonomous run). You will run the §17 attestation in a single
message, log every line as ✅ verified or ❓ would-be-blocker (deferred + documented),
and continue. No waiting.

══════════════════════════════════════════════════════════════════════════════════
PART C — SCOPE OF AUTHORIZED AUTONOMOUS WORK (§3 FWWS-pending in handoff)
══════════════════════════════════════════════════════════════════════════════════

Execute in this order; complete each fully before moving to next:

§3.1 Pillar 4 migration — 4 leaves:
  - pillar-4/generators.md
  - pillar-4/skill-ingestion-contract.md
  - pillar-4/skills-package.md (NEW)
  - pillar-4/ai-behavior-instructions.md (NEW — cross-link to ai-behavior-spine.md
    + behavioral-contracts.md + five-surface-engraving.md)

§3.2 Pillar 5 migration — 3 leaves:
  - pillar-5/persona-composition.md
  - pillar-5/crisis-escalation.md
  - pillar-5/mastra-setup.md

§3.3 Pillar 6 migration — 5 leaves:
  - pillar-6/build-order.md (UPDATE: AI-app exports week 5; PDF/text week 6;
    Google week 7; multimedia week 8 — per BLK-S002-003)
  - pillar-6/graduation-pipeline.md
  - pillar-6/bootstrap-script.md
  - pillar-6/dashboards.md (incl. /admin/intake/* 6 pages from _intake/dashboard-plan.md)
  - pillar-6/open-frontiers.md

§3.4 Vault snapshot files — 4:
  - _handoff/VAULT/principles-snapshot.md
  - _handoff/VAULT/decisions-snapshot.md
  - _handoff/VAULT/pending-work.md
  - _handoff/VAULT/user-intents.md

§3.5 Deferred S002 enhancements — 5 (research-validated):
  - descriptors[] open folksonomy lane (extend frontmatter-standard.md +
    tag-status-contract.md)
  - content_modality dimension (~46-subtype taxonomy → source-types.md)
  - explicit transition validators (extend tag-status-contract.md +
    audit state-without-required-field)
  - Zone A/B/C/D handoff structure (apply to S003→S004 handoff template)
  - continuity-manifest signature/receipt format (extend protocols.md §17
    with explicit signatures)

══════════════════════════════════════════════════════════════════════════════════
PART D — DISCIPLINE REQUIREMENTS (mechanical, mandatory, non-skippable)
══════════════════════════════════════════════════════════════════════════════════

After EVERY artifact created/modified, emit inline:

1. **RZF evidence block** (B_RZF / P-META-006) per zero-findings-discipline.md format:
   cycles_run + findings_per_cycle + final_status (ZF-0 ACHIEVED Cycle N) +
   coverage (mechanical / semantic / propagation) + signature

2. **CEC walk-trail** (B_CEC / P-META-006) per zero-findings-discipline.md format:
   extracted_essence + cycles_walked + walk_scope + applications_made + signature

3. **FSE evidence block** (B_FIVE_SURFACE_ENGRAVING / P-META-007) when artifact
   introduces a NEW behavioral discipline (B_*) — pillar 4-6 leaves are mostly
   composition (no new B_*); use NO_NEW_DISCIPLINES_THIS_BATCH when applicable

4. **Tool-call sandwich** (B_VALIDATE_BEFORE_ASSUME): every state assertion
   IMMEDIATELY preceded by tool-call output in the SAME response. Structure:
   [tool-call] → [verbatim output] → [assertion based on output]

5. **TodoWrite tick**: mark the task `completed` with paired evidence reference

6. **Clickable file links (B_ALWAYS_GIT_LINKS — turn 19)**: every file/folder/path
   mention is `[display-text](workspace-relative-path)` — never bare. Applies inline,
   in tables, in evidence-block refs, in batch-summaries, in §10.5/§10.7/§10.8
   closing-summary entries, in handoff §4 state-snapshot tables, in this entire run's
   final closing message. Bare paths waste user-time on every reply.

After EACH §3 sub-batch (3.1, 3.2, 3.3, 3.4, 3.5), emit a brief batch-summary:
artifacts produced + RZF cycles total + CEC walks total + any deferrals + move
to next batch.

DO NOT ask "shall I continue?" between batches. The user is asleep. Move on
automatically. The user has authorized the full §3 sequence as ratified scope
under B_AUTONOMY_4_CONDITIONS (ratified ✓ + reversible ✓ + mechanical ✓ +
no-cross-actor ✓).

══════════════════════════════════════════════════════════════════════════════════
PART E — HARD-STOP TRIGGERS (defer + document + continue, do NOT wait for user)
══════════════════════════════════════════════════════════════════════════════════

If you encounter ANY of the 8 checkpoint categories (B_CHECKPOINT_8_CATEGORIES):
1. constitutional-tier change
2. cross-tier authority change
3. external/dispatched work
4. editing circulated artifacts
5. irreversible operations
6. scope expansion BEYOND §3 above
7. strategy pivot
8. high-stakes one-shot decision

DO NOT BLOCK WAITING FOR THE USER. Instead:
a) Write the question + your would-be-PCR to _handoff/VAULT/blockers-S003.md as
   BLK-S003-NNN with state: open
b) Defer that specific item to next session (set lifecycle_state: deferred-needs-user)
c) Surface in your closing summary §10.9 blocker registry
d) **Continue with the next adjacent work** in §3 — do not let one open question
   gate the entire run

══════════════════════════════════════════════════════════════════════════════════
PART F — CONTEXT-PRESSURE PROTOCOL (defer NEVER compress)
══════════════════════════════════════════════════════════════════════════════════

Monitor your context budget. When remaining < 30%:
1. STOP starting new §3 sub-batches
2. Finish in-flight artifact only (or defer if mid-task)
3. Begin the closing-summary + handoff write-out (Part G below)
4. NEVER compress RZF / CEC / FSE evidence under context pressure — defer the
   remaining §3 items to S004 with explicit BLK-S003-* + carry-forward
5. Compressed Zero-Findings Discipline is worse than no Zero-Findings Discipline
   (P-META-006 anti-pattern)

══════════════════════════════════════════════════════════════════════════════════
PART G — END-OF-RUN REQUIREMENTS (must complete before stopping)
══════════════════════════════════════════════════════════════════════════════════

When (a) all §3 items complete OR (b) context pressure triggers Part F OR (c)
unrecoverable error encountered: write these THREE artifacts in order:

1. **HANDOFF-S003-to-S004.md** — full handoff using sections §0-§22 from
   protocols.md §10 closing-checklist + closing-summary-template.md §10.1-§10.14
   required headers. Apply Zone A/B/C/D structure (CSP carry-forward
   EXT-20260502-003-A) — this IS deferred-S002 §3.5 item, so its first
   application is on this very handoff.

2. **chat-jump-prompt-S003-to-S004.md** — both standard + autonomous-overnight
   variants saved in _handoff/VAULT/. Detailed self-contained ~150-300 word
   prompts per protocols.md v1.6 §22.

3. **Closing summary as your final chat message** — using
   _handoff/VAULT/closing-summary-template.md required-header template
   (every §10.1 through §10.14 section mandatory; §10.13b Catches engraved +
   §10.13c FSE evidence block per turn-15+turn-17 amendments). The user reads
   this when they wake up; it IS the proof-of-work.

══════════════════════════════════════════════════════════════════════════════════
PART H — WHAT S002 PRODUCED (you inherit this; don't duplicate)
══════════════════════════════════════════════════════════════════════════════════

S002 absorbed CSP carry-forwards (treasures #1-5) + built:
  - 7 meta-principles: P-META-001..007 (007 NEW turn 17: Five-Surface Engraving)
  - 34 behavioral-discipline rows in ai-behavior-spine.md (matrix)
  - 13 B_* contracts in behavioral-contracts.md (full canonical text)
  - 28 AGENTS.md hard NOs
  - External-Input Intake plane (~25 docs incl. dashboard-plan)
  - QC audit system (NEG/POS taxonomies + Grandfather Backfill Protocol)
  - 21 ADRs (0001-0021)
  - Pillar 0: 13 leaves (newest: five-surface-engraving.md)
  - Pillar 3: 5 leaves migrated
  - 7 vault files + closing-summary-template.md (turn 14) +
    chat-jump-prompt-S002-to-S003 standard variant (turn 13/15/16) +
    this autonomous-variant (turn 18)
  - 2 ZModel slices + 2 skill stubs + 2 hook stubs
  - 13 memory entries + MEMORY.md index
  - All 8 BLK-S002-* blockers RESOLVED
  - 5 EXT-IDs processed (EXT-20260502-001 through 005)

Recent improvements (turns 14-17 — see HANDOFF-S002-to-S003.md §20 addendum):
  - turn 14: B_PROTOCOL_LITERAL_EXECUTION (closing-summary-template +
    TodoWrite-transcribe-every-§10-item) — closes protocol-compression gap
  - turn 15: B_CATCH_TO_ENGRAVING + B_VALIDATE_BEFORE_ASSUME-strengthened
    (tool-call sandwich) — closes catch-decay + assertion-without-evidence gaps
  - turn 16: parent-CLAUDE.md wrong-workspace-trap mechanically defused via
    paste-prompt workspace warning + 4 ls verifications
  - turn 17: B_FIVE_SURFACE_ENGRAVING formalized as P-META-007 — the 7-stage
    Engraving Cycle + FSE evidence block + compounding-returns moat
  - turn 18 (this prompt): autonomous-overnight variant created so user can sleep

══════════════════════════════════════════════════════════════════════════════════
PART I — YOUR FIRST REPLY MUST INCLUDE (in this order, single message)
══════════════════════════════════════════════════════════════════════════════════

1. The 4 ls verifications + their verbatim outputs (Part A)
2. Pre-answered step 0 acknowledgement (Part B)
3. TodoWrite call transcribing EVERY §3.1-§3.5 sub-task + every protocols.md
   §10/§11 closing-protocol item (B_PROTOCOL_LITERAL_EXECUTION)
4. §17 self-attested handshake — every line ✅ or ❓→BLK-S003-* (Part B)
5. Begin §3.1 Pillar 4 migration. First leaf: pillar-4/generators.md.
6. Continue end-to-end through §3.5 with discipline requirements (Part D).

══════════════════════════════════════════════════════════════════════════════════
PART J — WHAT THE USER WILL READ WHEN THEY WAKE UP
══════════════════════════════════════════════════════════════════════════════════

Your closing-summary chat message + HANDOFF-S003-to-S004.md.

Make those two artifacts the answer to: "what got done, what's left, what
blocked, what's the read-order for S004."

The user is going to sleep at S002 close (~2026-05-02). Run end-to-end. Write
the handoff. Emit the closing summary. The next session begins when the user
returns and reads.

Begin.
```

---

## Why this exists

User S002 turn 18 — direct request for an autonomous-overnight variant. The standard chat-jump-prompt variant assumes user-mediation at the two-sided handshake step (B_TWO_SIDED_HANDSHAKE) — that protocol blocks waiting for user approval. The user is asleep; that's the failure mode.

The discipline counterweight in B_TWO_SIDED_HANDSHAKE explicitly authorizes self-attestation for fully-autonomous runs ("replace user-mediation with a third-AI auditor / self-attestation; flag divergence"). This file operationalizes that counterweight + adds:
- pre-answered step 0 (no new precedent unknown — CSP carry-forwards absorbed)
- explicit ratified scope (§3 FWWS-pending all 5 sub-batches)
- explicit hard-stop triggers + their non-blocking handling (defer + document + continue)
- context-pressure protocol (defer NEVER compress)
- end-of-run mandatory artifacts (handoff + closing summary + S003→S004 paste-prompts)

## Cross-references

- `chat-jump-prompt-S002-to-S003.md` — standard interactive variant
- `protocols.md` §10 closing-checklist + §11 fresh-chat protocol + §22 paste-prompt
- `closing-summary-template.md` — required-header template enforced under B_PROTOCOL_LITERAL_EXECUTION
- `pillar-0-governance/five-surface-engraving.md` — FSE evidence block format
- `pillar-0-governance/zero-findings-discipline.md` — RZF + CEC formats
- `behavioral-contracts.md` § B_TWO_SIDED_HANDSHAKE counterweight (the legal basis for self-attestation)
- `~/.claude/.../memory/feedback_parent_claude_md_wrong_workspace_trap.md` — turn 16 trap
