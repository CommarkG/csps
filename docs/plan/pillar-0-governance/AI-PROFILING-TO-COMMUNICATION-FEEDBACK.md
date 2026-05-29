---
id: csps.governance.ai-profiling-to-communication-feedback
name: AI-PROFILING-TO-COMMUNICATION-FEEDBACK
description: >
  Canonical "latest version" design (S071) for how CSPS AI Profiling improves the platform's
  AI behavior by adjusting how COMMUNICATION is generated. Consolidates the existing pieces
  (ai-profiler.sh hook, caq-patterns.yaml, D1-D13 inner-AI-defaults registry, ai-behavior-signals.jsonl,
  the activation_language phrase-pairs in communication-schema.yaml, vlt-S069-00027) into ONE
  closed feedback loop: observe defaults firing → aggregate → adjust comms generation →
  inject into the platform's outputs per audience-tier → measure drop-off. Numbers are
  sample/tunable per P-META-028 (cornerstone). status: draft pending Governor ratification.
type: governance
diataxis_type: reference
protection_level: protected
status: draft
impl_status: architecture-pending
vault_pending: vlt-S069-00027
retrieve_when: "Governor ratifies design + Sonnet authorized to begin milestone-run build (extends ai-profiler.sh + comms-schema activation_language[])"
core_spine: AI
core_spines: [AI, GVRN, OPER]
schema_anchor: pillar_0_governance_leaves
version: "1.0"
session: S071
owner: group:finky
authored_by: OPUS-15
lifecycle: production
lifecycle_state: active
ns_quality: [core-first, synergetic]
ns_path: "this → AI spine → North Star (AI behavior as platform-tunable)"
context_question: "Before generating any platform AI output: has the comms-generation layer applied the activation_language for the audience tier, derived from the latest profile of which D-defaults are firing?"
context_quote: "Communication quality — word choice, intent, nuance — determines whether pipelines deliver the intent or drift. The AI is the communicator; its training defaults are the drift source. — Governor S069"
inherits_from: "ai-profiler.sh hook (S048 THIN READER) + caq-patterns.yaml + D1-D13 inner-ai-defaults registry + ai-behavior-signals.jsonl + communication-schema.yaml activation_language[] + vlt-S069-00027 (native-AI-profiling) + P-META-028 cornerstone (context-refined communication)"
links:
  - { rel: hook, href: ../../../.claude/hooks/user-prompt-submit-ai-profiler.sh }
  - { rel: patterns, href: ../../../tools/config/caq-patterns.yaml }
  - { rel: signals, href: ../../../tools/data/ai-behavior-signals.jsonl }
  - { rel: defaults-registry, href: ../_handoff/VAULT/inner-ai-defaults/ }
  - { rel: comms-schema, href: ./communication-spine/communication-schema.yaml }
  - { rel: vault-origin, href: ../../../tools/data/vault-pending.yaml }
---

# AI Profiling → Communication Adjustment · Latest (S071)

> **One sentence:** AI profiling continuously observes which training defaults (D1–D13) fire on the platform's AI outputs; the comms-generation layer adjusts the *activation language* it injects per audience tier so the AI's next outputs are pre-counter-programmed against the defaults that distorted the last ones.

## 1 · Why this matters
In conventional systems comms travels between deterministic components; a message contract suffices. In CSPS the **primary communicator is an AI whose training defaults actively distort communication** (verbosity D3/D6, authority-pleasing D2, action-bias D7, surface-completeness D3). Without a feedback loop, the same defaults distort every generation; with one, every generation tunes the next.

## 2 · What exists (consolidation — survey result)
| Piece | Role | State |
|---|---|---|
| `.claude/hooks/user-prompt-submit-ai-profiler.sh` | THIN READER hook — applies modes (architectural / implementation / governance / enforcement / caq / standard) per `caq-patterns.yaml` | active |
| `tools/config/caq-patterns.yaml` | Pattern + mode registry (edit here, not the hook) | active |
| `docs/plan/_handoff/VAULT/inner-ai-defaults/D1–D13-*.md` | Per-default profile (default_id · default_name · resistance_pattern · override) | active (D1, D2, D3, D4, D5, D6, D7, D10, D11, D13 + lineage entries) |
| `tools/data/ai-behavior-signals.jsonl` | Append-only signal stream — each firing event | active (used; sample size still small) |
| `communication-schema.yaml` `activation_language[]` | Per situation × tier × default — `{default_id, avoid_phrase, use_phrase}` | active (S070 M2, draft) |
| `vlt-S069-00027` | Vaulted: "evolve ai-profiler into per-session behavioral profile system" | pending — this design realizes it |

The pieces are in place; what's missing is the **closed loop** between them.

## 3 · The feedback loop (the new design)
A five-stage continuous cycle. Counts are sample/tunable per P-META-028.
```
1 OBSERVE     ai-profiler.sh + per-stop sampler → append per-session events to ai-behavior-signals.jsonl
              event schema: {session, date, signal_class:'d_default', d_class:'D7', trigger:'…',
              pattern_observed:'…', csps_defaults_fired:[…], audience_tier:'governor|core-dev|…|end-user'}
2 AGGREGATE   weekly cron → cluster firings by {default_id, audience_tier}; rank by recurrence
              (sample threshold K≥3 within a rolling 7-day window — tunable)
3 ADJUST      generator updates communication-schema.yaml activation_language[] for the affected
              {situation, tier}: promote an existing avoid/use phrase-pair to required, or propose a new
              pair via the governed-path (download → PR → ratify). Edits land via ratification pipeline,
              not raw writes. The schema stays SSoT; the JSON bundle regenerates.
4 INJECT      at output-generation time, the comms layer reads activation_language for the matched
              {situation, tier} and PRE-LOADS the use_phrase + AVOIDS the avoid_phrase. The AI's
              outputs are counter-programmed against the defaults profiling identified as active.
5 MEASURE     drop-off in firings of the targeted default for that tier in the next cycle = the
              adjustment worked. No drop-off → escalate to structural fix (validator/hook), not just
              language. Feed metric back to ai-behavior-signals.jsonl as a 'measurement' signal_class.
```

## 4 · Per-audience-tier (it's not one AI, it's six contexts)
The platform's AI talks to **six audience tiers** (Governor / core-dev / external-dev / account-owner-admin / team-leader / end-user — *expandable*). The defaults that fire differ by tier:
- Governor-facing: D2 authority-pleasing, D6 verbal-cleverness fire hardest.
- Core-dev-facing: D5 single-pass, D11 debugging-wrong-layer.
- External-dev-facing: D3 surface-completeness (leaks internals).
- End-user-facing: D6 cleverness over clarity, D7 action-bias (premature feature).

So the adjustments are **per-tier**, not global. The schema already supports this — `activation_language[]` lives per `{situation, tier}`.

## 5 · Improvements the platform gains
- **Communication quality compounds:** each cycle's adjustment improves the next cycle's outputs.
- **Drift becomes a measurable signal**, not a vibe.
- **Tier-appropriate counter-programming** — the AI stops sounding wrong to the Governor for the same reason it stops being too jargon-heavy for an end-user.
- **No new doctrine** — extends what exists (hook + defaults registry + comms-schema + threshold).

## 6 · Expert improvements (proposed; sample counts/thresholds — tunable)
- **I1 · Generator from signals → schema.** `tools/scripts/profile-to-activation-language.mjs` — when a D-default fires K≥3 times for a tier within the rolling window, emit a draft avoid/use pair into a staging YAML for Governor review (the ratification pipeline takes it from there). Closes the loop mechanically.
- **I2 · Per-tier profile separation.** Today `ai-behavior-signals.jsonl` doesn't carry `audience_tier` consistently. Mandate the field; backfill recent events. Without it, aggregation conflates tiers.
- **I3 · A/B promotion gate.** Before promoting an avoid/use pair from advisory→required, run a sample-window A/B (last N outputs with and without the pair) and require a measured firing drop ≥ a sample threshold (e.g., 30%) — not just intuition.
- **I4 · Prevention-class linkage.** Each D-default firing is itself a prevention-class candidate; tie `ai-behavior-signals.jsonl` to the S067 prevention-class register so weekly aggregation feeds the same pipeline.
- **I5 · `/platform/ai-profile` dashboard.** Per the Vercel-mirror rule, a dashboard surface: top-firing defaults by tier (last rolling window), pending phrase-pair proposals, measured drop-offs. Governor inspects, ratifies, the loop closes visibly.

## 7 · Integration with the rest of the platform
- **Comms-schema (S070 M2):** the *consumer* of profiling adjustments (`activation_language[]` is where they land).
- **Threshold (PART 2 — S068 design):** stamps `audience_tier` at ingress; that field flows into both routing AND the comms layer's tier lookup.
- **Cornerstone (P-META-028 — S069):** context-refined communication is the *why*; this artifact is one of its primary HOWs.
- **Prevention-class register (S067):** each D-default firing is a prevention class instance — the loop produces prevention insights as a byproduct.
- **Ratification pipeline (S069 ADDENDUM):** changes to activation_language travel the governed path (no raw writes).

## 8 · Status & gates
- This design = **draft** pending Governor ratification.
- On ratify: build I1 + I2 + I5 first (closes the loop end-to-end at advisory level); I3 + I4 promote after the pipeline is live.
- Build mode: milestone-run, extending existing infra (no parallel machinery).

— OPUS-15 (S071) · authored 2026-05-29
