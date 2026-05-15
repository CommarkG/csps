---
id: csps.handoff.vault.insights
name: handoff-vault-insights
description: Synthesized insights extracted across sessions. Distillations the user should not lose — the load-bearing mental-model claims that justify the architecture. Updated incrementally; new insights append, superseded ones get marked. Each insight cites its session of origin so the chain of reasoning is traceable.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: source-handoff, href: ../HANDOFF-S001-to-S002.md }
domain_path: platform
scope_level: S1
---

# Insights Vault

> **Saving is not the goal; permanent system improvement is.** — P-META-005

## What this file holds

Synthesized insights — the load-bearing mental-model claims behind CSPS's architecture. Extracted from sessions, organized by topic. Each entry cites session-of-origin.

When a new insight emerges in a future session, append it here. When a prior insight is superseded by sharper understanding, mark it `superseded by: <new>` rather than deleting (provenance matters).

## Insights from S001

### Architecture & enforcement

- **The mechanical-enforcement insight resolves false dichotomies.** "Working agreement vs platform principle" was the wrong axis; "mechanical vs memory-dependent" is the right one. Anything memory-dependent dies on session end. Mechanical = enforced everywhere via principles.yaml → AGENTS.md + skills + hooks + lint + CI + MCP.

- **Defense in depth requires non-AI enforcers.** Critical principles MUST have ≥2 non-AI enforcers (CI/hook/lint). The AI layer is treated as the LEAST reliable, not the only one.

- **Variants pattern is the anti-tagging-tax.** Without cascading defaults by glob, "small files OK" becomes a tagging tax that kills the principle. With variants (Bit pattern), small files inherit context from location and only declare what's specific.

- **Files are truth, DB is index.** Source-controlled artifacts canonical; DB mirrors for query speed. The DB never disagrees with files; if it does, files win.

- **Single canonical phrasing prevents principle dilution.** Per the Backstage "checks-become-wallpaper" failure mode, every principle has ONE canonical wording quoted verbatim everywhere — not paraphrased.

- **The audit-the-audits meta-check is the cure for "rules are theater."** Every principle must have its required enforcers; every `// @enforces:` annotation must reference a real principle; codegen-fresh check fails on drift between source and generated.

- **Pillar count of 4-6 is the validated industry sweet spot** (NIST CSF 2.0, AWS WAF, Azure WAF, Google Cloud Framework all converge). 8 was too many; CSPS landed at 6 + 1 meta (Governance).

- **The planning playground is novel as a combination but composed of validated parts.** MD tree + frontmatter schema + DB index + completeness audit + git + LLM-first ingestion. The gap is real; nobody has shipped exactly this combination.

- **Bikeshedding cap is non-optional.** Without revision-cap on `proposed` docs (max 5 revisions; flag stale at 14 days), planning becomes the project. The audit-runner enforces.

### Multi-tenancy & extraction

- **Schema-per-app makes graduation tractable.** 2-3 day extraction vs 2-3 month surgery. Non-negotiable for the foundry pattern.

### Trust & supply chain

- **The Snyk ToxicSkills data (13.4% of community skills critical) makes default-deny non-negotiable** for any third-party AI content ingestion.

### Cognitive-load alignment

- **The 4 operating principles map to Sweller's three load types**: FWWS = germane load protection, PCR = intrinsic load chunking, Batched = extraneous load elimination. Reuse-first cuts across all three.

### Vocabulary discipline

- **Industry-standard naming reduces friction across AI systems.** The 8 v1.5 renames matter because other AI systems (Cursor, Codex, etc.) recognize industry terms but not CSPS coinages.

## Insights from S002

### The two missing meta-principles

- **Place + process is recursive.** S001 shipped places (`_handoff/`, `_legacy/`, vault) without processes. The recursive application of "nothing stands alone" to AI outputs themselves — saved-without-trigger = orphan-in-waiting — is what produced **P-META-004 Stewardship Protocol**. The principle's own canonical wording: *"Every saved artifact must declare a `lifecycle_state` and have a recurring trigger that advances it."*

- **`lifecycle` and `lifecycle_state` are orthogonal axes.** Backstage's `lifecycle:` is about product-stage (experimental → production → deprecated). CSPS's `lifecycle_state:` (P-META-004) is about stewardship-state (active → pending-review → pending-protocol → promoted → resolved → deprecated). A doc can be `lifecycle: production` AND `lifecycle_state: pending-review` simultaneously. Conflating the two would be a category error.

### Closure as forcing function

- **Saving is not the goal; permanent system improvement is.** This is the load-bearing distinction P-META-005 Learning Loop encodes. Below 50% close rate, every capture system becomes theater (consistent across Google SRE / Toyota Kata / KM-failure literature). Closure must be a forcing function (SLA-breach auto-escalation; K=2-within-90d auto-ADR; recurrence checks auto-reopen) — not an aspirational request.

- **The K=2-within-90-days threshold is documented industry standard, not invention.** Google SRE 30/60/90 follow-up + Toyota Five-Whys → A3 escalation + Linear recurrence-detection conventions all converge on K=2 inside a 90-day window. CSPS adopts the standard, doesn't invent its own.

- **Three-band confidence gate is the right pattern, not a binary threshold.** Auto-accept ≥0.90, human-review 0.75–0.90, discard <0.75. Target operating point: 1–5% of AI-extracted items in the human-review band. This is the RLHF / active-learning standard from production ML systems — and the bands are what generate the RLHF signal that lets us tune the thresholds over time.

### Capture in flow

- **The KM-failure antidote is "capture in flow + pull-based discovery + visible feedback loops + forcing-function closure."** Every system that DIDN'T degrade into Confluence-rot shares these four properties. Every system that DID degrade lacked one or more. CSPS's Learning Loop is designed against this checklist.

### Tempo over completeness

- **A 24-hour triage SLA with 80% routing accuracy beats a 7-day SLA with 95% accuracy.** Boyd's OODA: cycle speed beats individual-decision quality. CSPS's pipeline SLAs (1h/4h/24h/72h triage by tier; 30/90/180-day fixing by tier) optimize for tempo first, perfection second.

### Cross-platform validation of mechanical-not-memory (treasure #3 section C)

- **Independent platform corroboration of P-META-001 + P-META-005 + P-META-006 design choice.** The user cited a CSP-platform constitutional memory entry (`feedback_corrections_must_be_mechanical CONSTITUTIONAL S192`) at S002 turn 6: *"memory alone doesn't change behavior; only mechanical layer does."* Same failure mode CSPS S001 → S002 has been correcting, identified independently in a different platform. Validates: (1) AGENTS.md compliance is necessary but insufficient (the entire point of the 6 meta-principles defense-in-depth); (2) memory-only fixes regress within sessions (the hard-empirical reason runtime hooks/audits/validators are mandatory); (3) "mechanical NOW, not next session" as a directive — explicitly applied across S002 turns 7, 10, and 11 by building UserPromptSubmit hook + blockers registry + two-sided handshake + unknown-path protocol + zero-findings-discipline + qc-audit-system at the time of identification.

### Industry-validated discovery-channel pattern (S002 turn 6 research)

- **The "holding bay" / Discovery lane is the production-tested no-force-fit pattern.** OpenText Secure Content Manager, Glean's "no manual rules," Linear's Triage Intelligence, Slack Triage channels, Salesforce Einstein Case Classification — all converge on a first-class Unrouted state with: (a) LLM-tentative-classification + confidence band, (b) K-within-N promotion proposals, (c) governance review with audit trail, (d) explicit ban on force-fit. CSPS adopted this in `unknown-path-protocol.md` before research returned; research VALIDATES the pattern. The single most-cited principle (Lorin Hochstein, *Surfing Complexity* — "Tag, don't bucket"): forcing items into mutually exclusive buckets *destroys information*. Capture-with-tags in a Discovery lane preserves it.

- **K=2-within-90d is the documented industry threshold** for recurrence-driven schema extension (Toyota Five-Whys → A3 + Google SRE 30/60/90 + Linear repeat-issue detection all converge). CSPS's existing K=2 trigger should be **explicitly extended** to drive schema-leaf proposals from Discovery-lane clusters (already implemented in `unknown-path-protocol.md` Step 4).

- **Schema-evolution-as-product is the load-bearing pattern** — making "add a new content-type / leaf" a first-class workflow (UI, owner, audit trail, review cadence), not a code change. The acceptance test: can a non-engineer propose, review, merge a new schema leaf in <30 minutes? CSPS's planning-playground + ADR + contexts/lazy-creation pattern aims at this; the dashboard plan's `/admin/intake/schema-gaps` page is the operationalization.

- **Hybrid taxonomy + folksonomy** is the production-mature tag model. Closed-enum dimensions for routing/accountability axes (CSPS has 11 — keep them closed); open `descriptors[]` lane capped at 5 free tags per item, reviewed weekly for promotion. CSPS does NOT yet have the open lane — recommend adding in next session as `descriptors[]` field on extraction notes.

- **Tags drive routing; states drive SLA clocks.** Putting SLAs on tags creates combinatorial explosion + obscures audit trail. CSPS's 7 (now 8) forcing functions correctly attach to states, not tags — keep this discipline.

- **The 4-section structured handoff payload (Intent / Constraints / Open Items / Evidence)** is the production-tested chat-jump pattern, validated against SBAR clinical handover (Kaiser/USN), OpenAI Agents SDK validated-schema handoffs, military command handover, Toyota shift-change kata. Locked into protocols.md §17 v1.2 in S002 turn 6 in response to user's two-sided handshake proposal.

### Encoding pitfalls (operational)

- **Windows PowerShell 5.1 silently corrupts UTF-8 files in non-Latin locales.** `Get-Content -Raw` defaults to system Default encoding (CP1255 on this user's locale). Bulk-edits via Get-Content + Set-Content double-encode em-dashes, emoji, and other multi-byte UTF-8 sequences. Use `[System.IO.File]` explicit UTF-8 APIs instead. Saved as a memory feedback so future sessions don't repeat the mistake (`~/.claude/projects/.../memory/feedback_powershell_encoding.md`). The corruption IS reversible via CP1255 round-trip in reverse.

## Insights from S003 (autonomous overnight execution session)

- **The pillar-migration discipline is reuse-first-applied-to-pillars** — every leaf's frontmatter declares `enhances:` or `created-new-because:` against the closest existing artifact. The discipline scales: it's the same rule the slice contract enforces at code-time, applied to documentation-time. — S003 §3.1-§3.3 (16 created artifacts, 100% reuse-first compliance per gaps-and-duplications-S003.md)
- **Composition vs new-discipline classification is the gating step of B_FIVE_SURFACE_ENGRAVING.** Most pillar work is composition (existing disciplines applied to new context), not new-discipline. Correct classification keeps the FSE 7-stage cycle from over-firing. S003 emitted `NO_NEW_DISCIPLINES_THIS_SESSION` for the bulk of work because pillar-leaves COMPOSE existing disciplines (catalog-first reuse, atomic dual registration, capability declarations, composition function, crisis interception). — S003 turn 1+
- **Zone A/B/C/D handoff structure cuts cognitive load.** Zone A (paste-target + step list, ~2min) is what most fresh-chat AIs need; Zone D is the reference for deep-dive (~30min). The split mirrors Anthropic agentskills.io's `description` vs `references/` pattern — front-load what the consumer needs first; defer the long-tail to references. — S003 §3.5.d (first application)
- **Pre-emptive workspace verification (4 ls calls) defuses the parent-CLAUDE.md trap mechanically.** Without explicit verification, even a session correctly authorized to work in the Csps workspace (renamed from VSAS on 2026-05-03) may refuse on sight of the home-directory CLAUDE.md. The 4 ls calls + the workspace warning block = the cognitive + mechanical layer combined. — S002 turn 16 + S003 turn 1 (re-validated in production)
- **Autonomous-overnight execution is viable when discipline scaffolding is mature enough.** S003 ran end-to-end on 27 substantive deliverables with zero blockers + zero scope creep + zero compression of RZF/CEC evidence. The pre-conditions: (a) S002 had engraved B_PROTOCOL_LITERAL_EXECUTION + B_FIVE_SURFACE_ENGRAVING + B_AUTONOMY_4_CONDITIONS; (b) the autonomous-overnight prompt template (S002 turn 18) explicitly pre-answered protocol-blocking steps; (c) FWWS-pending was a fully-ratified scope, not exploratory. Pillar-migration sessions are low-risk; exploratory work would NOT meet B_AUTONOMY_4_CONDITIONS. — S003 closing summary
- **Continuity-manifest signature/receipt closes the chat-jump verification gap mechanically.** Prior sessions could attest "I delivered X" but the next session couldn't mechanically VERIFY without re-reading every artifact. The §11b.2 manifest fields (counts + paths) let the next session re-Glob/re-Grep + assert match-or-mismatch — turning "trust this handoff" into "verify this handoff in 3 tool calls." — S003 §3.5.e (closes EXT-20260502-003-C CSP carry-forward)

## How to add new insights

When extracting a new insight from a session:

1. Decide if it fits an existing topic. If yes, append.
2. If new topic, add a new `### <topic>` heading under the appropriate session.
3. Cite session-of-origin in the entry header (e.g., "Insights from S007").
4. Keep entries to 1–4 sentences each. Insights are distilled, not narrative.
5. If superseding a prior insight, append `**Superseded by:** <new>` to the old entry; do not delete.

The `learning-loop:extract` skill (P-META-005) auto-routes session insights into the `LearningLoopItem` ledger. High-confidence extractions that are accepted by humans get promoted into this file as canonical insights. The flow is:

```
session → /learning-loop-extract → LearningLoopItem (state: triaged)
       → human review → if confidence ≥ canonical threshold
       → promoted to insights.md
```
