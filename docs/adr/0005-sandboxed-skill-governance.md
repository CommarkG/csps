---
id: csps.adr.0005-sandboxed-skill-governance
title: ADR-0005 — Sandboxed skill governance (three-tier: Quarantine / Vendored / Platform-owned)
status: accepted
date: 2026-05-02
deciders: group:finky
consulted: solo-dev (Finky)
informed: future-CSPS-developers, AI-runtime-operators
tags:
  - domain:ai-systems
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - audience:admin
  - maturity:stable
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/pillar-3-platform-services/sandboxed-skill-governance.md }
  - { rel: registry, href: ../../packages/principles/principles.yaml }
---

# ADR-0005 — Sandboxed skill governance

## Context and problem statement

CSPS uses AI skills (Anthropic Skills spec) extensively — `/pcr`, `/wip-check`, `/reuse-check`, `/learning-loop-extract`, etc. The platform also wants to ingest community-authored skills (huge productivity multiplier) but **the Snyk ToxicSkills 2025 data shows 13.4% of community AI skills contain critical vulnerabilities** — code injection, credential exfiltration, prompt-injection chains.

Default-trust on community skills is unsafe. Default-deny is too restrictive (kills the community-skill upside). A tiered model is needed.

## Considered options

| Option | Pro | Con |
|---|---|---|
| All-or-nothing: only platform-owned skills | Maximum safety | Loses community skill productivity gains |
| All-trust on hash-pin | Easy onboarding | 13.4% critical-vuln rate; one bad skill compromises platform |
| **Three-tier: Quarantine → Vendored → Platform-owned** | Tiered trust matches Anthropic Skill semantics | More tooling to build (skill-importer, sandbox runner) |

## Decision outcome

**Chosen:** Three-tier file-system layout with two-point runtime enforcement.

**File system tiers:**
1. **Quarantine** (`vendor/quarantine/<skill>/`) — newly imported community skills; runs ONLY in sandbox runner (Cloudflare Workers, `globalOutbound: null`, mock-only bindings, DB-deny).
2. **Vendored** (`vendor/blessed/<skill>/`) — promoted from quarantine after eval-Worker validation passes; can run in dispatcher with limited capabilities.
3. **Platform-owned** (`packages/skills/<skill>/`) — written by CSPS team; full capabilities by declaration.

**Capability model with two-point enforcement:**
- `.claude/hooks/pre-tool-use-capability.sh` (PreToolUse hook) reads per-skill permission set; exits non-zero on mismatch.
- `libs/agents/dispatcher-middleware.ts` (Mastra dispatcher middleware) — independent runtime check at agent invocation time.
- Defense in depth: bypass one, the other catches.

**Reasoning:** Aligns with OWASP Agentic Skills Top 10 (default-deny, sandboxing, capability-declaration, two-point enforcement). The 13.4% critical-vuln rate makes default-deny non-negotiable for any third-party content.

## Consequences

- Every skill declares `allowed_tools:` and `allowed_subagents:` in frontmatter (closed enum).
- Sandbox runner is a Cloudflare Worker with `globalOutbound: null` (no network), mock bindings (KV, R2, D1 → in-memory), DB-deny.
- Skill graduation Quarantine → Vendored requires eval-Worker passes (functional + security checks).
- Vendored → Platform-owned requires full code review + ADR for the skill itself.
- `skill-import` / `skill-promote` / `skill-upgrade` generators automate the lifecycle.

## Enforcement

- `principles.yaml#P-ARCH-025` (third-party-trust default-deny; severity: critical; ≥4 enforcers)
- `principles.yaml#P-ARCH-027` (capability-declaration dispatcher-enforcement; severity: critical; ≥4 enforcers)
- `audit-runner.md#skill-banned-tools`, `#skill-vendor-integrity`, `#skill-capability-drift`, `#skill-prompt-injection-scan`, `#skill-eval-freshness`

## Open questions

- Auto-upgrade vendored skills to platform-owned via heuristic (no incidents in 90 days + reviewed)? Currently manual; revisit after 6 months of operational data.

## Sources / references

- [pillar-3/sandboxed-skill-governance.md](../plan/pillar-3-platform-services/sandboxed-skill-governance.md)
- [Snyk ToxicSkills](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/)
- [OWASP Agentic Skills Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Cloudflare Workers `globalOutbound: null`](https://developers.cloudflare.com/workers/runtime-apis/bindings/global-outbound/)
- [Anthropic Agent Skills spec](https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md)
