---
id: csps.pillar-4.skill-ingestion-contract
name: skill-ingestion-contract
description: The 5-stage contract for adopting community AI skills (Discovery → Import → Eval → Vendored → Platform-owned). Per-stage acceptance criteria + eval-Worker rubric + promotion gates + skills.lock.yaml mechanics + audit-log requirements. Operationalizes the trust-tier file system from pillar-3/sandboxed-skill-governance.md (which defines the tiers + sandbox); this leaf defines the workflow that moves skills between tiers. Migrated from v1.3 §5.7.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:dx
  - type:reference
  - audience:developer
  - audience:admin
  - maturity:stable
crosscutting:
  - security
  - reliability
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: tiers-and-sandbox, href: ../pillar-3-platform-services/sandboxed-skill-governance.md }
  - { rel: generators, href: ./generators.md }
  - { rel: adr-sandboxed, href: ../../adr/0005-sandboxed-skill-governance.md }
enhances: csps.pillar-3.sandboxed-skill-governance
---

# Skill Ingestion Contract

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The 5-stage workflow for moving an external (community / Anthropic-marketplace / GitHub) skill into the CSPS trust tiers. Per-stage acceptance criteria, the eval-Worker rubric, the promotion gate decisions, the `skills.lock.yaml` mechanics, the audit-log requirements at every transition.

This is the **DX side** of skill governance. The trust-tier file system + sandbox runner + capability model live in [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md). This leaf operationalizes the workflow that moves skills between those tiers.

## Why this exists

The Snyk ToxicSkills 2025 study: **13.4% of community AI skills contain critical vulnerabilities.** Default-trust is unsafe; default-deny without a promotion path kills the community-skill upside. This contract is the calibrated middle: explicit gates, audit-logged transitions, no auto-promotion ever.

Without a documented contract, ad-hoc adoption decays into "trust-the-popular-one." The contract makes adoption mechanical.

## The 5 stages

```
Stage 1: Discovery        — community skill identified
       │
       ▼
Stage 2: Import           — `nx g platform:skill-import`
       │                  → vendor/quarantine/<id>/
       ▼
Stage 3: Eval             — apps/skill-eval-worker/ run
       │                  → eval log + security scan
       ▼
Stage 4: Promote-Vendored — `nx g platform:skill-promote --tier=vendored`
       │                  → vendor/blessed/<id>/
       ▼
Stage 5: Promote-Platform — code review + ADR + `nx g platform:skill-promote --tier=platform`
                          → packages/skills/<id>/
```

### Stage 1 — Discovery

**Trigger:** team identifies a candidate skill (Anthropic Skills marketplace, GitHub, internal proposal).

**Acceptance:**
- Source URL recorded
- Initial assessment: does this skill duplicate an existing platform-owned skill? (If yes: skip ingestion; enhance existing instead per P-OP-001 reuse-first.)
- Initial scope: what capabilities does the skill claim to need? (Used at Stage 4 for capability-frozen promotion.)

**Audit log:** discovery row in `audit.skill_lifecycle` with `state: discovered`.

### Stage 2 — Import

**Tool:** `nx g platform:skill-import --source=<url> --sha=<hash>`

**Acceptance:**
- SHA-pinned (NOT tag-pinned — per pillar-3 sandboxed-skill-governance hard rule)
- Integrity hash stored in `skills.lock.yaml`
- Skill cloned to `vendor/quarantine/<id>/`
- Capability claims extracted from `SKILL.md` and stored in lock-file row
- Quarantine tier assigned (sandbox-only execution)

**Acceptance fail-states:**
- Tag-pinned source → refuse; `skill-vendor-integrity` audit fails
- SHA does not match content → refuse; integrity hash mismatch
- `SKILL.md` missing required frontmatter fields → refuse

**Audit log:** import row with `state: quarantined`.

### Stage 3 — Eval

**Tool:** `apps/skill-eval-worker/` (Cloudflare Worker; `globalOutbound: null`; mock bindings)

**Acceptance:**
- Functional eval: skill produces expected output on test corpus (≥95% pass rate)
- Security scan: `skill-prompt-injection-scan` audit clean
- Capability scan: declared capabilities match observed behavior (no hidden tool invocation)
- CPU within 5000ms / memory within 128MB per invocation
- No network egress attempted (sandbox blocks; logs flag if attempted)

**Acceptance fail-states:**
- Eval timeout → fail; promotion blocked
- Network egress attempted → fail; promotion blocked + flag for review
- Hidden tool invocation → fail; capability creep flagged
- Prompt-injection scan flag → fail; promotion blocked

**Audit log:** eval row with `state: evaluated` + `eval_result: pass | fail` + scanner findings.

### Stage 4 — Promote-Vendored

**Tool:** `nx g platform:skill-promote --skill=<id> --tier=vendored`

**Acceptance:**
- Stage 3 eval result = pass (last 7 days; older evals require re-run)
- Capability declarations frozen at promotion (cannot expand without re-promotion)
- `skills.lock.yaml` updated: `tier: vendored`
- Skill moved to `vendor/blessed/<id>/`
- Restricted dispatcher tools assigned (subset of platform-owned tool set)
- 4-eyes review NOT required at this tier (only at Stage 5)

**Acceptance fail-states:**
- Eval > 7 days old → fail; require re-eval
- Capability expansion attempted at promotion → fail; capability-creep audit blocks

**Audit log:** promotion row with `state: vendored` + reviewer ID + capability snapshot.

### Stage 5 — Promote-Platform

**Tool:** code review + new ADR + `nx g platform:skill-promote --skill=<id> --tier=platform`

**Acceptance:**
- Stage 4 vendored status: ≥30 days runtime without security or behavior incident
- Code review by ≥1 platform engineer (4-eyes review)
- ADR drafted for the skill: justifies the platform-owned tier (why not vendored?)
- Skill code re-written by platform team if it touched sensitive surfaces (per pillar-3 verbatim-vendor-preserved-rewritten-platform-owned)
- `skills.lock.yaml` updated: `tier: platform`
- Skill moved to `packages/skills/<id>/`
- All capabilities subject to capability-validator (no escape hatches)

**Acceptance fail-states:**
- < 30 days vendored runtime → fail; cooling-off period
- ADR missing → fail
- Code review missing → fail (4-eyes is hard rule)
- Sensitive-data-access requested without explicit ADR justification → fail

**Audit log:** platform-promotion row with `state: platform-owned` + ADR ref + reviewer IDs.

## The `skills.lock.yaml` mechanics

```yaml
# packages/skills.lock.yaml — single source of truth for ingested skills
skills:
  - id: community.timeseries-summarizer
    source: https://github.com/example/skill
    sha: 9f2c1d...
    integrity: sha384-...
    tier: vendored
    promoted_at: 2026-04-15T10:30:00Z
    promoted_by: user:finky
    capabilities:
      allowed_tools: [Read, Grep]
      allowed_subagents: []
      allowed_outbound_hosts: []
      allowed_db_operations: []
      sensitive_data_access: false
    last_eval_at: 2026-04-15T10:00:00Z
    last_eval_result: pass
    eval_log_ref: audit.skill_evals#evt_aA1B2c3
```

Lock file is committed; CI fails if mutated outside a generator invocation (`audit-skill-lock-drift`, PR-blocking).

## The eval-Worker rubric

| Check | Pass criteria | Audit |
|---|---|---|
| Functional | Test corpus pass rate ≥ 95% | eval-functional |
| Prompt injection | No injection-pattern triggers in 100-prompt fuzz | eval-injection |
| Capability honesty | Declared = observed (no hidden tools) | eval-capability-honesty |
| Resource bounds | CPU ≤ 5000ms, memory ≤ 128MB | eval-bounds |
| Network egress | Zero attempted | eval-egress |
| Output validity | Output schema matches declared schema | eval-output-schema |

Worker emits structured `eval-result.json` consumed by promotion gates.

## Anti-patterns

1. **Auto-promotion** — refused at every gate; every transition is human-decided
2. **Tag-pinning** (vs SHA-pinning) — refused at Stage 2; integrity audit fails
3. **Skipping eval** for "trusted" sources — refused; the gate is unconditional
4. **Capability expansion at promotion** — refused; capabilities frozen at Stage 4 promotion
5. **Bypassing ADR for platform-tier promotion** — refused; ADR-process audit catches
6. **Re-using stale eval result** (>7 days) — refused at Stage 4; re-eval required
7. **Sensitive-data-access without ADR** — refused; pillar-3 sandboxed-skill-governance hard rule

## Enforcement

- `principles.yaml#P-ARCH-025` (third-party-trust default-deny; severity critical)
- `principles.yaml#P-ARCH-026` (verbatim-vendor-preserved-rewritten-platform-owned)
- `audit-runner.md#skill-vendor-integrity` (SHA-pin verification)
- `audit-runner.md#skill-eval-freshness` (warns on >7-day eval at promotion)
- `audit-runner.md#skill-capability-drift` (declared ≠ observed)
- `audit-runner.md#skill-banned-tools` (capability-set within allowed)
- `audit-runner.md#skill-prompt-injection-scan` (PR-blocking)
- `audit-runner.md#skill-collision-check` (no two skills with overlapping capability scope competing for same trigger)
- `audit-runner.md#skill-lock-drift` (PR-blocking; lock-file mutation outside generator)
- `apps/skill-eval-worker/src/index.ts` (the runner)
- `tools/generators/skill-import/index.ts` + `skill-promote/index.ts` + `skill-upgrade/index.ts`

## Sources

- [Snyk ToxicSkills 2025](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)
- [Anthropic Agent Skills spec](https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md)
- [agentskills.io](https://agentskills.io/)
- [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) — the trust-tier file system this contract operates over
- [docs/adr/0005-sandboxed-skill-governance.md](../../adr/0005-sandboxed-skill-governance.md)
