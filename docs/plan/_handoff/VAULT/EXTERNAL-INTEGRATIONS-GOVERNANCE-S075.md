---
id: csps.handoff.vault.external-integrations-governance-s075
name: EXTERNAL-INTEGRATIONS-GOVERNANCE-S075
description: >
  S075 analysis of External Integrations Hub — current state, gap analysis,
  core insight from HARDWIRE-006 (Vercel), 3-scope analysis of S075 tab work,
  and proposed governance improvements. Input for Opus priority scheduling.
  Per Governor S075 directive: surface hub to Opus, check existing, propose improvements,
  hardwire everything, prevention-focused, anti-rigid.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: sandbox
quality_state: draft
next_review_at: "2026-06-15"
core_spine: ARCH
schema_anchor: vault_files
closure_owner: group:finky
closure_decision: "Opus reviews, schedules, and issues PROTO for External Integration Health improvements"
closure_by: "S076 after Opus scheduling"
links:
  - { rel: hub, href: ../../pillar-0-governance/external-integrations/HUB.md }
  - { rel: vercel-health, href: ../../../../tools/scripts/vercel-health-check.mjs }
  - { rel: vercel-validator, href: ../../../../tools/validators/validate-vercel-projects.mjs }
consolidation_cross_refs:
  - docs/plan/pillar-0-governance/external-integrations/HUB.md
  - tools/scripts/vercel-health-check.mjs
  - tools/validators/validate-vercel-projects.mjs
  - tools/config/deploy-targets.yaml
---

# External Integrations Governance — S075 Analysis

## ECA (Existing-Coverage Attestation)
```
ran: node tools/scripts/platform-inventory-scan.mjs --exhaustive --query="external integrations hub Vercel Clerk Supabase health check"
passes: 2, zero-new: ACHIEVED, total: 10 artifacts
```

---

## 1. WHAT CURRENTLY EXISTS (verified, file evidence)

| Artifact | Location | Status | Gap |
|---|---|---|---|
| HUB.md | docs/plan/pillar-0-governance/external-integrations/ | Active S028, advisory | No health checks; last updated ~S028 |
| vercel.md | external-integrations/ | Active, has gotchas | No live check; no stale detection |
| supabase.md | external-integrations/ | Active | No connection-string health check |
| clerk.md | external-integrations/ | Active | No webhook URL validation |
| zenstack.md | external-integrations/ | Active | No enhance.js path validation |
| pre-tool-use-external-integration-gate.sh | .claude/hooks/ | T1 ADVISORY | Only fires on Write/Edit; advisory-exit-0 |
| deploy-targets.yaml | tools/config/ | Active S073+S075 | Only covers Vercel; no other integrations |
| vercel-health-check.mjs | tools/scripts/ | NEW S075 | Vercel only; pattern not generalized |
| validate-vercel-projects.mjs | tools/validators/ | NEW S075 CRITICAL | Vercel only; not a generic pattern |

**Key finding**: The hub was built right (mandatory-read-before-act pattern) but stuck at S028. No live verification, no health checks, no stale-registration detection. The integration gate is advisory-only.

---

## 2. THE CORE INSIGHT — Stale Registration Without Live Verification

### The Vercel Failure Pattern (HARDWIRE-006 case study)
```
1. App created → Vercel project configured → root_dir = "apps/budget-planner"
2. App moved to _trials-vaulted/ → Vercel project NOT updated/removed
3. Every push to main → Vercel build → "root_dir does not exist" → FAIL
4. Discovery: via email, not via proactive check
5. Lag: weeks of silent failure before Governor noticed
```

### The Abstract Pattern (applies to ALL external integrations)
```
"A service registration (config/credential/endpoint) that was correct at creation time
becomes stale without live verification — and the platform has no proactive mechanism
to detect the staleness until an operation fails (usually in production)."
```

This is **EXTERNAL-INTEGRATION-REGISTRATION-STALENESS** prevention class.

### Where this pattern recurs (3-scope Scope 2 — ripple check):

| Integration | Stale-registration risk | Current health check | Gap |
|---|---|---|---|
| Vercel | Root directory path | ✓ vercel-health-check.mjs (NEW) | FIXED S075 |
| Clerk | Webhook URL, JWT template, redirect URLs | ✗ None | Webhooks can silently stop working |
| Supabase | pgbouncer URL, connection_limit, direct URL | ✗ None | Credential rotation breaks app silently |
| ZenStack | enhance.js path after pnpm update | ✗ None | Schema changes break enhance path |
| GitHub submodule | csps-playground SHA, repo access | ✗ None | Submodule can be deleted or access revoked |
| Future: Stripe | Webhook secret, API key | ✗ None | Key rotation → silent payment failures |
| Future: Resend | API key, from-address domain | ✗ None | Domain verification → silent email failures |
| Future: Anthropic | API key, model availability | ✗ None | Model deprecation → silent AI failures |

---

## 3. THE HARDWIRE-006 PATTERN (Platform Propagation Opportunity)

### What HARDWIRE-006 built for Vercel:
1. **Registry** (`deploy-targets.yaml`): every active integration has a canonical entry with:
   - `root_dir` / config field
   - `status`: active | deployed | deprecated
   - `verified_at`: when last confirmed working
   - `deprecation_reason`: if deprecated, why (prevents re-introduction of failures)

2. **Validator** (`validate-vercel-projects.mjs` CRITICAL): blocks push if config is stale

3. **Live health check** (`vercel-health-check.mjs`): proactive, runs any time via API

4. **Deprecation discipline**: when an integration is removed, the entry stays with `status:deprecated` + reason — prevents the same failure from recurring

### The Generic Architecture (for ALL integrations):

```yaml
# tools/config/external-integration-registry.yaml  ← NEW: extend or replace deploy-targets.yaml

entries:
  - service: vercel
    type: hosting
    projects:
      - name: csps-playground
        config_key: root_dir
        config_value: apps/csps-playground
        status: deployed
        health_check_command: "node tools/scripts/vercel-health-check.mjs"
        verify_mechanically: "vercel-health-check → critical=0"
        last_verified: "2026-06-01"

  - service: clerk
    type: auth
    config:
      webhook_url: "https://csps-playground.vercel.app/api/webhooks/clerk"
      jwt_template: "CSPS-tenant"
    status: active
    health_check_command: "node tools/scripts/clerk-health-check.mjs"  # TO BUILD
    verify_mechanically: "clerk-health-check → webhooks-live=true"
    last_verified: null  # NOT YET

  - service: supabase
    type: database
    config:
      connection_type: pgbouncer
      pool_mode: transaction
      pgbouncer: true
    status: active
    health_check_command: "node tools/scripts/supabase-health-check.mjs"  # TO BUILD
    verify_mechanically: "supabase-health-check → connection=ok"
    last_verified: null
```

---

## 4. 3-SCOPE ANALYSIS — S075 TAB WORK

### Scope 1 — What happened (instances)
- **WS1 G1**: D12 `assumed-coverage` default added; ai-profiler D* arm fixed (broken vars from S074 BATCH 4); existence-claim detection from transcript
- **WS1 G2**: pre-tool-use-inventory-scan-required.sh ADVISORY→BLOCKING (PROTO/plan files); post-stop-existence-claim-scan.sh (chat hole); ECA pattern established
- **WS1 G3**: platform-inventory-scan.mjs --exhaustive mode; ≥4-pass zero-new termination; ECA block emission
- **WS1 G4**: hardwire-005 (go-over-what-exists) + permanence layer
- **WS2**: Significance Engine SANDBOX (4-MOVE design, 3 scenarios, R1 96% FP); significance-view.mjs read-only
- **WS3**: HANDOFF-S074-to-S075.md
- **HARDWIRE-006**: Vercel budget-planner removed; validate-vercel-projects.mjs CRITICAL; vercel-health-check.mjs; deploy-targets.yaml updated

### Scope 2 — Ripple check (what else might be affected)
- **D12 existence-claims**: same pattern as D7 (action-bias) but for knowledge claims not action claims. Both now registered with counter-instructions.
- **ECA gate (PROTO/plan only)**: R1 measured 96% FP rate for wider scope → kept narrow. But the PATTERN of "require attestation before claim" could extend to: significance-engine entry additions, improvement-register proposals, architecture decisions.
- **Vercel stale-registration pattern**: extends to ALL external integrations (see Section 2 above). Not just Vercel — this is a platform-wide gap.
- **The significance-view top item** (k=6, score=7.0): "ZF nominal cycles" — still the highest-significance unresolved gap. D11 is addressing it but governing_intent Q1-Q4 still awaiting Opus.
- **Submodule warning** in Vercel: `Failed to fetch one or more git submodules` — appeared in budget-planner build. With budget-planner removed, this warning shouldn't appear for csps-playground (it IS the submodule). But if submodule access is ever revoked → silent failure.

### Scope 3 — Structural prevention (what was built vs what's needed)
**Built S075:**
- HARDWIRE-006: Vercel-specific (3 surfaces: validator + health-check + registry)
- D12 + ECA: existence-claim discipline (ai-profiler extension + inventory-scan-required BLOCKING)
- Exhaustive inventory scan: platform-wide ≥4-pass zero-new

**Still needed (for Opus scheduling):**
- External Integration Health Registry (generic extension of deploy-targets.yaml)
- Health check scripts for Clerk, Supabase, ZenStack
- Promote external-integration gate from ADVISORY to BLOCKING (contextual — not rigid)
- Recurring health check in weekly-hardwire-audit.mjs
- Deprecation discipline applied to ALL integrations (not just Vercel)

---

## 5. ANTI-RIGID NOTE (for Opus to apply throughout)

Per Governor: "avoid rigid things without context." The governance for external integrations should be:
- **Context-dependent**: a health check for Supabase connection makes sense for every deploy but NOT for every commit (too slow, blocks dev flow)
- **Prevention-focused**: catch "stale registration" at registration time (when you move an app to vaulted, the integration should REQUIRE updating the registry before commit passes)
- **Points of reference only**: the service files (vercel.md, supabase.md, etc.) are REFERENCE documents. The actual enforcement is the validator + registry, not the document.
- **Tiered enforcement**: CRITICAL = blocks push (root_dir missing); STANDARD = verify at session; ADVISORY = surfaces in session-open

The hub should evolve from "mandatory-read-gate" to "mandatory-verification-gate" — but only for changes that touch integrations, not for routine development.

---

## 6. INSIGHTS FOR OTHER DOMAINS (P-META-006 CEC pattern)

### Insight 1: Registration-to-Verification Gap
Any time a platform registers something (app, integration, credential, endpoint), the registration is correct at T0 but stale at T+N without a live check. This is the **"Registration-Verification-Gap"** pattern.

**Applies to**:
- External integrations (Vercel fixed; Clerk/Supabase pending)
- Validator registrations (audit-runner.md has 141 advisory-forever validators — are they still relevant?)
- HARDWIRE register rows (weekly-hardwire-audit now re-tests them — this IS the fix)
- Session state (session-state.json current_session: S067 — stale since S073)
- Memory entries (MEMORY.md entries — some reference S002-S010 decisions; are they still valid?)

**The general principle**: Every registration needs a `verified_at` timestamp + a `health_check_command`. If `verified_at` is older than N sessions → advisory decay warning.

### Insight 2: Silent Failure as Information Lag
The Vercel failure was silent for weeks because the notification was reactive (email after failure). The same applies to:
- Clerk: if a webhook fails, Clerk retries but eventually stops → silent auth gap
- Supabase: if a connection pool is exhausted, requests fail → silent 500s
- The significance engine (when built): if it decays, no one notices → the very problem it's designed to solve

**The principle**: every external integration should have a "proactive signal" (health check) not a "reactive signal" (failure email). This is the core of HARDWIRE-006 generalized.

### Insight 3: The Deprecation-Ledger Pattern
When budget-planner was moved to `_trials-vaulted/`, there was no ledger entry requiring the Vercel project to be updated. The HARDWIRE-006 fix included adding a `deprecated` entry with `deprecation_reason` — so future developers know not to recreate the failure.

**Applies to**: any platform artifact that can "die silently" — validators, hooks, Vercel projects, API keys, database connections. The deprecation entry IS the institutional memory that prevents the failure from recurring K=2.

---

## 7. PROPOSALS FOR OPUS SCHEDULING

Not directives — proposals for Opus to evaluate, schedule, and sequence per PE score.

### P1 — External-Integration-Health-Registry (high-impact, medium-SPI ~3h)
Extend deploy-targets.yaml into a generic external-integration-registry.yaml covering all services. Each entry: service + config + status + health_check_command + last_verified + deprecation_reason. This is the pattern that makes HARDWIRE-006 platform-wide.

### P2 — validate-external-integration-health.mjs (extends vercel validator pattern)
Generic validator that runs `health_check_command` for each active integration entry and reports stale/failed. CRITICAL for entries that have `verified_at` older than 30 sessions. ADVISORY for newer.

### P3 — Clerk + Supabase health check scripts
Per the template from vercel-health-check.mjs: lightweight API calls to verify webhooks live, connection string valid, credentials current. Advisory initially; promote on K=2 failure.

### P4 — Pre-tool-use-external-integration-gate.sh ADVISORY→BLOCKING (contextual scope)
Promote to BLOCKING for: new integration configuration writes that touch registry entries WITHOUT updating `verified_at`. Keep ADVISORY for: reads, documentation, non-registry writes.

### P5 — HUB.md refresh (S075 → include health check discipline)
Update the hub from S028 to include: health check pattern, registry pattern, deprecation discipline, HARDWIRE-006 as inaugural pattern. This is the governing_intent-level document for all external integrations.

### P6 — Significance Engine session-open injection
Top item in significance-view: ZF nominal cycles (k=6, score=7.0). Wire significance-view into session-open injection so the Governor sees top-3 items at every tab start (after Opus ratifies the scoring formula).

---

*Draft authored by Sonnet S075 · 2026-06-01 · Ready for Opus review and scheduling*
