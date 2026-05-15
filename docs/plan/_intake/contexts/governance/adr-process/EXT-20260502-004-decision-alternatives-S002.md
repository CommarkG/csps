---
extraction_id: EXT-20260502-004
parent_input_id: EXT-20260502-004
section_label: S002-decision-alternatives-archive
source_type: AI_EXTRACTION
origin: internal-csps
origin_detail: ai-self-extraction-S002-turn-8-pcr-non-recommended-options
received_at_iso: 2026-05-02T18:00:00Z
received_via: chat-paste
confidence: 1.0                              # captured from AI's own structured output
confidence_band: auto-accept
lifecycle_state: pending-review              # explicit — captured for future assessment
pipeline_state: routed                       # routed to governance/adr-process for future re-evaluation
state_transitioned_at: 2026-05-02T18:00:00Z
next_review_at: 2026-08-01                   # 90d default; re-evaluate if any context shifts
recurrence_check_at: 2026-08-01
routed_to: docs/plan/pillar-0-governance/adr-process.md (companion archive — alternative options the user did not pick)
risk: low
trust_tier: tenant_authored
priority_tier: P3                            # archive material; not active work
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
  - decision-archive                         # NEW value: archive of rejected-but-considered options
inherited_from_input:
  tags: [audience:developer, audience:ai-agent]
  trust_tier: tenant_authored
  source_type: AI_EXTRACTION
sla_due:
  triaged_to_routed: 2026-05-04T18:00:00Z   # met (already routed)
  fixing_complete: n/a                       # archive; no fix needed
precedent_checked: declared-novel            # B_NO_INVENTION_WITHOUT_PRECEDENT_CHECK — no CSP precedent for "save rejected PCR options as inputs"; user invented this discipline turn 9
scope_level: S1
---

# S002 Decision Alternatives — Archive of Non-Recommended PCR Options

> **User directive S002 turn 9:** *"save all the parts not included for future assessments as 'inputs'"*

## Why this archive exists

Standard PCR (P-OP-003) captures: options + pros/cons + recommendation. The recommended option gets ratified and acted upon; the non-recommended options typically vanish from the durable record.

The user's S002-turn-9 directive instituted a NEW discipline: **non-recommended PCR options are saved as inputs** so future sessions can re-assess if circumstances change. This is the recursive application of P-META-005 Learning Loop's anti-graveyard pattern to decision-making itself — alternatives are not silently dropped; they become tracked items.

This file is the canonical archive for S002's 7-blocker resolution turn 8. Each section below documents one BLK's non-picked options, the original PCR rationale, and the conditions under which the option might warrant re-assessment.

## How future sessions use this archive

When a future session faces a similar architectural decision:
1. **Search this archive** (and analogous future archives) for prior-considered alternatives.
2. **Read the rationale** for why the alternative was rejected at S002.
3. **Check whether circumstances changed** — if yes, the rejected option may now be the right choice.
4. **If re-promoted**: write a new ADR superseding the original decision, link this archive entry as evidence the alternative was considered all along.

## BLK-S002-005 — protocols.md v1.2 — non-recommended options

User picked **A** (Approve as written). Non-recommended:

### Option B — Approve with modifications

**What it would have done:** ship v1.2 with specific changes (e.g., simplify the 4-section payload, drop §11c, etc.).

**Why rejected:** every modification I could think of would weaken the protocol. The 5-minute friction at chat-jump is the COST that BUYS protection against the highest-cost failure mode. Trading 5 minutes for guaranteed continuity is not a marginal trade.

**Re-assessment conditions:** if 5+ sessions use v1.2 and the friction proves higher than expected (>15 minutes user mediation per chat-jump), revisit B with specific simplifications.

### Option C — Reject, keep v1.1

**What it would have done:** roll back the §16/§17 additions; handoff stays in original shape.

**Why rejected:** re-opens the chat-jump information-loss failure mode the entire S002 turn-6 work was designed to prevent. AGENTS.md hard NOs become inconsistent with protocols.

**Re-assessment conditions:** if v1.2 produces significant net-negative friction over 6+ sessions, full rollback to v1.1 is the escape hatch. Document via superseding ADR.

### Option D — Drop / decide later

**What it would have done:** carry decision to S003.

**Why rejected:** S003 cannot use v1.2 mechanics — every benefit of intent-to-impact + handshake delayed. Violates "build mechanical NOW" directive.

**Re-assessment conditions:** never (decision was time-sensitive; option D was the no-decision option).

## BLK-S002-008 — precedent step 0 — non-recommended options

User picked **A** (Add as step 0). Non-recommended:

### Option B — Add as step within existing §11

**What it would have done:** mid-protocol question after step 7 blocker review.

**Why rejected:** too late — by the time AI has read handoff + principles + leaf docs, mental model is locked in; precedent docs become "additions" rather than starting point.

**Re-assessment conditions:** if step 0 proves to interrupt natural session flow more than expected, B is the fallback (still better than C/D).

### Option C — Don't add (rely on AGENTS.md + memory)

**What it would have done:** trust mechanical layer without explicit step.

**Why rejected:** memory + AGENTS.md alone empirically failed in S002 (the failure happened despite the principles existing). CSP autonomy-audit is explicit: single-surface engraving fails.

**Re-assessment conditions:** never (empirically rejected).

### Option D — Different approach

**What it would have done:** user-specified alternative.

**Re-assessment conditions:** if user identifies a specific alternative mechanism, evaluate then.

## BLK-S002-001 — intake architecture — non-recommended options

User picked **C** (Hybrid 3-layer). Non-recommended:

### Option A — Single dominant gate

**What it would have done:** one central service receives + classifies + extracts + routes.

**Why rejected:** documented SPOF + bottleneck (LiteLLM PyPI compromise March 2026; "Our API Gateway Was the Bottleneck" case study). Schema explosion. God-service anti-pattern. Centralized credential blast radius. Industry consensus rejects single dominant gate.

**Re-assessment conditions:** never likely (industry convergence is strong against this pattern).

### Option B — Many distributed paths

**What it would have done:** each source type has its own end-to-end pipeline.

**Why rejected:** audit fragmentation; per-source security review tax; provenance inconsistency; harder cross-source insight; no single dashboard.

**Re-assessment conditions:** if hybrid gate becomes a bottleneck despite being thin, partial migration toward distributed (per-tenant gates rather than global gate) might warrant re-evaluation.

### Option D — Different shape

**Re-assessment conditions:** if user has CSP-specific shape to inherit, evaluate.

## BLK-S002-002 — AIBehavior slice — non-recommended options

User picked **C** (Defer to week 6+). Non-recommended:

### Option A — Introduce in week 4

**What it would have done:** new AIBehavior slice + Postgres table + admin page; runtime DB-backed.

**Why rejected:** premature — spine + contracts haven't proven their value yet. Two source-of-truth files (markdown + DB) require sync mechanism. Week 4 already has audit-runner + intake gate + first connectors — adding AIBehavior is scope expansion violating B_AUTONOMY_4_CONDITIONS.

**Re-assessment conditions:** at week 6, if (a) the spine has 5+ disciplines fully mechanical, (b) admin needs a dashboard for AI behavior coverage, (c) markdown query has measurable performance issue — promote to AIBehavior slice. This is the documented promotion path.

### Option B — Extend AuditCheck schema

**What it would have done:** add behavior_kind + behavior_ref fields to existing AuditCheck.

**Why rejected:** AuditCheck is for audit checks (verb: "check happens"), AIBehavior is for behaviors (noun: "behavior exists"). Conflation hurts both.

**Re-assessment conditions:** never (semantic conflation makes this worse than option A).

### Option D — Never

**What it would have done:** spine + contracts stay markdown forever.

**Why rejected:** loses the unified-admin-surface benefit eventually. When tooling needs to query "which disciplines are mechanical for app X", parsing markdown is slower than DB.

**Re-assessment conditions:** if at week 6+ the spine markdown discipline holds AND no dashboard need emerges, D becomes equivalent to "stay deferred indefinitely" — acceptable.

## BLK-S002-006 — input-assessment shape — non-recommended options

User picked **B** (Split 13/18/12). Non-recommended:

### Option A — All 43 mandatory

**What it would have done:** every input answers every question explicitly.

**Why rejected:** tagging-tax research is unambiguous (R21 stream 1) — >10 seconds per input means users either skip the discipline OR fill randomly. Either failure mode breaks the audit.

**Re-assessment conditions:** never (research-validated rejection).

### Option C — Reduce to <20 total

**What it would have done:** aggressive cut to minimum essentials.

**Why rejected:** loses provenance fields (origin / origin_detail / received_via — all load-bearing). Loses tag-inheritance audit. Loses K=2 schema-gap detection. Cuts essentials.

**Re-assessment conditions:** if even the 13 mandatory prove to be too much, partial cut might warrant evaluation — but only after empirical evidence of friction.

### Option D — Different shape

**Re-assessment conditions:** if user identifies a specific alternative shape, evaluate.

## BLK-S002-003 — connector cohort priority — non-recommended options

User picked **B** (Shuffle, AI-exports first). Non-recommended:

### Option A — Drafted order (PDF/text first)

**What it would have done:** week 5: PDF/text; week 6: Google ecosystem; week 7: video/image/audio; week 8: AI-app exports.

**Why rejected:** CSP carry-forwards (where treasures live) wait until week 8 — 3 weeks of manual-only intake for the most likely content type.

**Re-assessment conditions:** if week 5 AI-export build proves higher complexity than expected (taking >2 weeks), partial fallback to A's order for weeks 6-8 might be needed.

### Option C — Different order

**Re-assessment conditions:** if user identifies a specific priority based on actual treasure-upload patterns over weeks 5-6, re-shuffle accordingly.

## BLK-S002-007 — spine naming — non-recommended options

User picked **A** (Keep `ai-behavior-spine.md`). Non-recommended:

### Option B — Rename to `ai-behavior-constitution.md`

**Why rejected:** Constitution implies legal-formal; AI behavior is more operational. ADR-0001 already implicitly has constitutional-class decisions; potential confusion.

**Re-assessment conditions:** if ADR system grows to multi-tier-of-authority (constitutional vs operational), B might warrant re-evaluation as part of broader vocabulary alignment.

### Option C — Rename to `discipline-registry.md`

**Why rejected:** "registry" is heavily overloaded — rule-registry, principle-registry, schema-gap registry. Loses consolidation idea.

**Re-assessment conditions:** never (vocabulary collision).

### Option D — Rename to `behavioral-engraving-matrix.md`

**Why rejected:** long file name. Less intuitive at first read.

**Re-assessment conditions:** if CSP-vocabulary alignment becomes more important than current-state stability (e.g., if CSP and CSPS get unified under one program), rename to D might warrant evaluation as part of vocab unification.

### Option E — Different

**Re-assessment conditions:** if user proposes an alternative name, evaluate.

## What this archive is NOT

- NOT a list of "decisions to revisit". The user picked the recommendations; those are now decisions.
- NOT a hedge against the chosen options. The recommendations were principled and remain so.
- This archive is a **decision-history** record — proof that alternatives were considered, with the conditions under which any could become the better choice.

## Cross-references

- [adr-process.md](../../../pillar-0-governance/adr-process.md) — companion: ADRs document accepted decisions; this archive documents rejected alternatives that were genuinely considered.
- [_handoff/VAULT/blockers-S002.md](../../../_handoff/VAULT/blockers-S002.md) — the 7 BLKs all marked `answered` per user turn 9.
- [extractions-ledger.md](../../extractions-ledger.md) — EXT-20260502-004 row.
