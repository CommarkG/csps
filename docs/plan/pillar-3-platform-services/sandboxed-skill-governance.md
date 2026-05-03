---
id: csps.pillar-3.sandboxed-skill-governance
name: sandboxed-skill-governance
description: Three-tier file system (Quarantine / Vendored / Platform-owned) + sandbox runner (Cloudflare Workers + globalOutbound:null + mock-only bindings + DB-deny) + capability model with two-point enforcement (PreToolUse hook + Mastra dispatcher) + OWASP Agentic Skills Top 10 alignment. The Snyk ToxicSkills 13.4% critical-vuln rate makes default-deny non-negotiable. Migrated from v1.3 §11.8.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:admin
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - security
  - reliability
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: adr-sandboxed, href: ../../adr/0005-sandboxed-skill-governance.md }
---

# Sandboxed Skill Governance

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The complete trust + sandbox + capability architecture for AI skills in CSPS. Default-deny on community-authored skills; explicit promotion path through three trust tiers; runtime sandboxing for untrusted execution; two-point enforcement of capability declarations. Per ADR-0005.

## Why this exists

The Snyk ToxicSkills 2025 study: **13.4% of community AI skills contain critical vulnerabilities** — code injection, credential exfiltration, prompt-injection chains. Default-trust is unsafe. Default-deny without promotion path kills the community-skill upside. This leaf locks the calibrated middle: tiered trust + sandbox + capability discipline.

## The 3 trust tiers (file-system layout)

| Tier | Path | Trust | Capabilities |
|---|---|---|---|
| **Quarantine** | `vendor/quarantine/<skill>/` | None — newly imported community skills | Sandbox runner ONLY (no platform access) |
| **Vendored** | `vendor/blessed/<skill>/` | Limited — passed eval-Worker validation | Sandbox + restricted dispatcher tools |
| **Platform-owned** | `packages/skills/<skill>/` | Full — written by CSPS team | All declared capabilities (subject to capability validator) |

### Promotion path

```
Community skill discovered → quarantine import (vendor/quarantine/)
                              │
                              ▼
              eval-Worker passes (functional + security)
                              │
                              ▼
                  blessed (vendor/blessed/)
                              │
                              ▼
              Code review + ADR for the skill itself
                              │
                              ▼
              platform-owned (packages/skills/)
```

Each promotion is an explicit human decision + audit log. No auto-promotion.

## The sandbox runner

`apps/skill-eval-worker/src/index.ts` — Cloudflare Worker with:

```typescript
{
  // Block all network egress
  globalOutbound: null,

  // Mock all bindings (no real DB / KV / R2)
  bindings: {
    DB: mockD1Adapter,         // returns empty results; logs all queries
    KV: mockKV,                 // in-memory; never persists
    R2: mockR2,                 // in-memory; never persists
    DO: mockDurableObjectStub,  // mock methods
  },

  // CPU + memory limits
  limits: {
    cpuMs: 5000,
    memoryMb: 128,
  },

  // No file system access (Worker isolation)
  // No process exec (Worker isolation)
}
```

Quarantine skills run ONLY in the sandbox. They never touch real platform infrastructure.

## The capability model

Every skill declares capabilities in its `SKILL.md` frontmatter:

```yaml
---
name: example-skill
allowed_tools: [Read, Grep, Glob]                    # closed enum from glossary
allowed_subagents: []                                  # explicit list (empty = no sub-agents)
allowed_outbound_hosts: []                             # for skills needing network (only platform-owned)
allowed_db_operations: []                              # closed enum: read | write | mutate (only platform-owned)
sensitive_data_access: false                           # if true, requires explicit ADR + 4-eyes review
---
```

### Two-point enforcement

**Point 1: PreToolUse hook** (`.claude/hooks/pre-tool-use-capability.sh`):
```bash
# Read skill manifest
# If invoked tool not in allowed_tools: exit 2 (block)
```

**Point 2: Mastra dispatcher middleware** (`libs/agents/dispatcher-middleware.ts`):
```typescript
// Independent runtime check at agent invocation
async function dispatchTool(skill, tool, args) {
  if (!skill.capabilities.allowed_tools.includes(tool.name)) {
    throw new CapabilityViolation(`${skill.id} not authorized for ${tool.name}`);
  }
  // ... dispatch
}
```

**Defense in depth:** bypass one, the other catches. Per P-ARCH-027 (capability-declaration dispatcher-enforcement).

## OWASP Agentic Skills Top 10 alignment

| OWASP risk | CSPS mitigation |
|---|---|
| Prompt injection | `skill-prompt-injection-scan` audit (PR-level static scanner) |
| Excessive agency | Capability declaration + 2-point enforcement |
| Sensitive data exfil | Sandbox `globalOutbound: null` + `sensitive_data_access` ADR gate |
| Supply chain | SHA-pin (`skills.lock.yaml`) + `skill-vendor-integrity` audit |
| Privilege escalation | Tier promotion gates (Quarantine → Vendored → Platform-owned) |
| Inadequate isolation | Cloudflare Worker isolation + per-skill capability scope |
| Capability creep | `skill-capability-drift` audit (weekly) — declared capabilities don't expand |
| Insecure plugin design | Skill ingestion contract (per `pillar-4/skill-ingestion-contract.md`) |
| Unbounded resource use | CPU + memory limits per Worker invocation |
| Insufficient observability | Every skill invocation logged to `audit.events` via trigger |

## Skill ingestion 5-stage workflow

1. **Discovery** — community skill identified (GitHub, Anthropic Skills marketplace, etc.)
2. **Import** — `nx g platform:skill-import --source=<url> --sha=<hash>` clones to `vendor/quarantine/`; SHA-pin + integrity hash stored in `skills.lock.yaml`
3. **Eval** — `apps/skill-eval-worker/` runs the skill against test corpus + security scanner; logs result
4. **Promote (Vendored)** — `nx g platform:skill-promote --skill=<id> --tier=vendored`; requires eval pass; updates `skills.lock.yaml`
5. **Promote (Platform-owned)** — code review + new ADR + `nx g platform:skill-promote --tier=platform`; team-owned thereafter

Every stage is audit-logged. Failed eval blocks promotion.

## Anti-patterns

1. **Tag-pinning third-party content** (vs SHA-pin) — refused; `skill-vendor-integrity` audit fails
2. **Skipping the eval-Worker** — refused; promotion gate requires audit log
3. **Bundle community skill into production** without promotion — refused; AGENTS.md hard NO
4. **Capability creep** — `allowed_tools` expanding silently → `skill-capability-drift` audit catches
5. **Skill bypassing capability enforcement** — defense-in-depth: PreToolUse + dispatcher both check; bypass one, other catches
6. **Sensitive data access without ADR** — refused; `sensitive_data_access: true` requires explicit ADR with 4-eyes review

## Enforcement

- `principles.yaml#P-ARCH-025` (third-party-trust default-deny; severity critical, ≥4 enforcers)
- `principles.yaml#P-ARCH-026` (verbatim-vendor-preserved-rewritten-platform-owned)
- `principles.yaml#P-ARCH-027` (capability-declaration dispatcher-enforcement; severity critical, ≥4 enforcers)
- `audit-runner.md#skill-vendor-integrity` + `#skill-capability-drift` + `#skill-eval-freshness` + `#skill-banned-tools` + `#skill-prompt-injection-scan` + `#skill-collision-check`
- `apps/skill-eval-worker/src/index.ts` (sandbox runner)
- `libs/agents/dispatcher-middleware.ts` (point-2 capability enforcement)
- `.claude/hooks/pre-tool-use-capability.sh` (point-1 capability enforcement)

## Sources

- [adr/0005-sandboxed-skill-governance.md](../../adr/0005-sandboxed-skill-governance.md)
- [Snyk ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/) — 13.4% critical-vuln data
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Cloudflare Workers `globalOutbound: null`](https://developers.cloudflare.com/workers/runtime-apis/bindings/global-outbound/)
- [Anthropic Agent Skills spec](https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md)
