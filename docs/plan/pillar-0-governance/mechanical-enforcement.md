---
id: csps.governance.mechanical-enforcement
name: mechanical-enforcement
description: The defense-in-depth architecture that makes every CSPS principle mechanically enforced at multiple independent layers. Single registry (principles.yaml) → AGENTS.md + skills + hooks + lint + CI + MCP. Survives session loss, IDE switch, vendor switch, agent delegation, human bypass.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - security
  - observability
links:
  - { rel: parent, href: ./README.md }
  - { rel: principle, href: ./reuse-first-principle.md }
  - { rel: registry, href: ../../../packages/principles/principles.yaml }
  - { rel: agents-md, href: ../../../AGENTS.md }
  - { rel: rule-registry, href: ./rule-registry.md }
  - { rel: operating-principles, href: ./operating-principles.md }
domain_path: platform
diataxis_type: reference
core_spine: AI
schema_anchor: pillar_0_governance_leaves
scope_level: S1
context_question: "Before relying on this governance document: is it current with the active session, or does it reflect an older platform state?"
---

# Mechanical Enforcement Architecture

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The architecture that makes CSPS principles independent of any single AI assistant's session memory. Every principle has multiple independent mechanical enforcers across layers (AI instruction files, skills, hooks, linters, CI gates, MCP resources). The AI layer is treated as the LEAST reliable enforcer, not the only one.

## Why this exists (the load-bearing problem)

A principle that lives only in prose ("be careful," "always check," "remember to...") depends on whoever is at the keyboard remembering it. If that's a human, they'll forget under deadline pressure. If that's an AI assistant, the principle dies on session end. If a different AI assistant joins (Cursor instead of Claude Code), the principle wasn't in their training context. If an agent delegates to a sub-agent, the principle doesn't propagate.

The cure is **mechanical enforcement at multiple independent layers**, with the principle defined ONCE in a registry that all enforcers derive from. This is the pattern mature engineering orgs converged on in 2025–2026 — Anthropic's own teams operate this way.

The user's exact framing: *"How can it all be arranged with zero dependence on your temp memory? How can it be mechanical? Having all this system learns and defines and refines be an inseparable part of all this system will be doing."*

## The architecture

```
                    packages/principles/principles.yaml
                              (SINGLE SOURCE OF TRUTH)
                                       │
                              packages/principles/codegen.ts
                                       │
                                       ▼
   ┌──────────────┬──────────────┬────────────┬────────────┬────────────┬────────────┐
   ▼              ▼              ▼            ▼            ▼            ▼            ▼
AGENTS.md     packages/      .claude/      Nx tag      OPA         packages/    libs/audits/
 (root +      skills/        hooks/        rules +     policies    principles-  checks/
 per-app/     (PCR, WIP,     (PreToolUse,  ESLint      (config-    mcp/         (audit
 per-pkg)     audit-self,    PostToolUse,  custom      level)      (cross-      runner
              batched-plan,  Stop)         rules                   vendor       check
              reuse-check)                                         wire)        defs)
   │              │              │            │            │            │            │
   └──────────────┴──────────────┴────────────┴────────────┴────────────┴────────────┘
                                       │
                              ALL CONSUMED BY:
                                       │
   Platform CI ─── App CI ─── Mastra agents ─── Customer-facing AI ─── Claude Code ─── Cursor
```

Every layer is independently capable of enforcing the principle. The AI layer (AGENTS.md, skills, AI prompt addendum) is the least reliable. Critical principles always have at least 2 non-AI enforcers.

## The seven enforcement layers

Each layer has a specific role and reliability profile.

### 1. Instruction file (AGENTS.md, CLAUDE.md, .cursor/rules/*.mdc)

**What:** Cross-vendor open standard ([agents.md](https://agents.md/)) describing principles in human + AI readable form. Cascading per-directory.

**Reliability:** Lowest. AI assistants read it but don't always follow it; humans skim it. Good for awareness; insufficient alone.

**Used for:** Stating the principle, explaining the why, listing related skills.

**Industry source:** [Anthropic Claude Code best practices](https://code.claude.com/docs/en/best-practices); [HumanLayer: Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md); [Blake Crosley: AGENTS.md patterns](https://blakecrosley.com/blog/agents-md-patterns).

**Best practice:** Keep root file under 200 lines. Command-first, not prose. Per-directory cascading (Cursor's MDC pattern).

### 2. Skill (packages/skills/<name>/SKILL.md)

**What:** Invokable AI behavior (slash command or RAG-discovered). Anthropic Skills spec ([agentskills.io](https://agentskills.io/)).

**Reliability:** Medium. Activated when the model decides it's relevant. Deterministic execution once loaded.

**Used for:** Producing standardized output formats (`/pcr`), querying state (`/wip-check`), running audits (`/audit-self`), structuring batch plans (`/batched-plan`).

**Cross-vendor:** The Anthropic Skills spec is open; works in Claude, Codex, others adopting the spec.

### 3. Hook (.claude/hooks/*.sh — PreToolUse, PostToolUse, Stop)

**What:** Deterministic block at the tool-call boundary. PreToolUse can deny (exit 2 = block) or rewrite tool inputs.

**Reliability:** High. The model cannot route around a hook.

**Used for:** Hard blocks on dangerous operations (no rm -rf), forced checks (catalog lookup before Write), workflow guards (block new slice creation if WIP exceeded).

**Industry source:** [Claude Code hooks docs](https://code.claude.com/docs/en/hooks); [Pixelmojo: production hook patterns](https://www.pixelmojo.io/blogs/claude-code-hooks-production-quality-ci-cd-patterns).

### 4. Pre-commit / pre-push (lefthook or husky)

**What:** Git hooks that run before commit/push. Block on violation.

**Reliability:** High. Same script can run in CI; defense in depth.

**Used for:** Frontmatter validation, naming-convention checks, WIP-limit enforcement on the commit path.

**Industry source:** [Lefthook vs Husky](https://dev.to/quave/lefthook-benefits-vs-husky-and-how-to-use-30je) — Lefthook for polyglot monorepos in 2026.

### 5. PR bot (Danger.js)

**What:** PR-level checks that comment + can fail merge.

**Reliability:** Medium-high. Runs on every PR; bypassable only with admin override.

**Used for:** PR template field validation, "existing thing considered" check, PR-size guards.

**Industry source:** [Danger.js](https://danger.systems/js/).

### 6. CI check (GitHub Actions running audit-runner)

**What:** Hard CI gate. Cannot be merged on failure.

**Reliability:** Highest. Last-line backstop.

**Used for:** Full audit-runner pass, codegen-fresh check, meta-audit (every principle has enforcers).

**Industry source:** [Backstage Tech Insights](https://github.com/backstage/community-plugins/blob/main/workspaces/tech-insights/plugins/tech-insights/README.md); the Facts/Checks/Scorecards pattern.

### 7. MCP resource + tool (packages/principles-mcp/)

**What:** Cross-vendor wire protocol. The MCP server exposes principles as queryable resources (`principles://reuse-first`) and callable tools (`tools/check_reuse`).

**Reliability:** Variable — depends on whether the calling agent uses it. But the LATTICE is universal: Claude, Cursor, Codex, Mastra agents, hosted-app agents all speak MCP ([MCP standardized via Linux Foundation, Dec 2025](https://en.wikipedia.org/wiki/Model_Context_Protocol)).

**Used for:** Principle inheritance across hosted apps, sub-agent constraint propagation, customer-facing AI safety guardrails.

**Industry source:** [MCP specification](https://modelcontextprotocol.io/specification/2025-11-25); [CData: 2026 enterprise MCP guide](https://medium.com/cdata-software/the-definitive-2026-guide-to-implementing-mcp-in-enterprise-environments-d74009a17b07).

## Defense-in-depth recipe (per severity)

The minimums are encoded in `principles.yaml#severity_enforcer_minimums`:

| Severity | Min enforcers | Min non-AI enforcers | Example principles |
|---|---|---|---|
| **critical** | 4 | 2 | reuse-first, FWWS, P-ARCH-001 (nothing-stands-alone), P-META-001 |
| **error** | 3 | 1 | most architecture principles, P-META-002 |
| **warn** | 2 | 0 | PCR, batched-execution, audit metrics |
| **info** | 1 | 0 | logging, telemetry conventions |

For critical principles, the requirement of ≥2 non-AI enforcers is what guarantees survival of any single layer's failure (model drift, hook bypass, PR override).

## Multi-level inheritance — platform → app → agent → session

This is the user's central question. Principles propagate four ways simultaneously:

### 1. AGENTS.md cascade

Per-directory `AGENTS.md` files. Child files extend (never override) parent files. Both Cursor and Claude Code walk parent directories. A new principle added at the platform AGENTS.md is visible to every agent in every app immediately.

### 2. Shared MCP server

`packages/principles-mcp/` is one MCP server. Every Mastra agent in every hosted app connects to it. Every Claude Code session in the platform repo connects to it. Customer-facing AI agents in deployed apps connect to it. **Same registry, same checks, every level.**

When a principle changes, edit `principles.yaml`, regenerate, deploy the MCP server. Every consumer picks up the change.

### 3. Mastra `BaseAgent`

Mastra's [agent instructions support array form + dynamic resolution](https://mastra.ai/reference/agents/agent). `BaseAgent` constructor pulls platform principles from the MCP resource at construction time and prepends them to every subclass's instructions. Mastra's [forked-mode subagent inheritance](https://mastra.ai/docs/agents/overview) means parent instructions automatically carry to subagents.

Result: a customer-facing persona chat agent in app `bookings` inherits the platform's reuse-first / FWWS / PCR / batched-execution principles automatically. So does any sub-agent the persona delegates to.

### 4. Audit-runner package

The same `@csps/audit-runner` package runs in:
- Platform CI (every PR + nightly + weekly)
- Each hosted app's CI (vendored copy)
- On-demand via MCP tool (`tools/run_audit`) callable by any agent

Same checks, same registry, every level. A new audit check added in `principles.yaml` becomes active in every consumer when they pull the latest audit-runner package.

## Principles travel with graduated apps

When a CSPS app graduates to standalone via `nx g extract-app`:

1. `principles.yaml` is **embedded** (vendored copy, not symlink) in the new repo
2. `packages/audit-runner` is **vendored** (frozen at extraction-time version)
3. `packages/principles-mcp` is **vendored** so the standalone app can run its own MCP server
4. The extraction commit is **stamped with the principles version hash** for provenance
5. The standalone app's CI verifies its principles version is known to the platform's release history

The graduated app is now **self-contained but provably descended** from a known principle set. If it later wants updates, it pulls from the platform's published principles version.

## The audit-the-audits meta-check

The critical meta-check (`P-META-001` enforcer): for every principle in `principles.yaml`, assert ≥ min enforcers per severity AND every enforcer location resolves to a real file AND every `// @enforces:` annotation in source references a real principle.

```
1. Parse principles.yaml.
2. For each principle:
   - Look up min_enforcers per severity from severity_enforcer_minimums.
   - Count enforcers in the principle's enforcers list.
   - Verify count >= min.
   - For each enforcer, verify the location file exists (or is in the codegen output set).
   - For critical principles, verify >= 2 non-AI enforcers.
   - Fail if any check fails.
3. Inverse (orphan-enforcer audit):
   - Grep all source for `// @enforces: P-` annotations.
   - For each annotation, verify the principle ID exists in principles.yaml.
   - Fail if any annotation references a missing principle.
4. Codegen-fresh check:
   - Re-run `pnpm principles:codegen` in a clean tree.
   - Fail if git diff produces any output (drift between source and generated).
```

This eliminates the "rules are theater" problem. A principle without enforcers fails the build. An enforcer without a principle fails the build. A drift between source and generated artifacts fails the build.

## What this means in practice for the four operating principles

**P-OP-001 (reuse-first)** — 10 enforcers across layers: instruction-file, skill, ai-prompt-addendum, hook, frontmatter-contract, pr-bot, ci-check, audit-metric, mcp-resource, mcp-tool. Survives any single layer's failure.

**P-OP-002 (FWWS)** — 8 enforcers: instruction-file, skill, hook, pre-commit, pr-bot, ci-check, scorecard, mcp-resource. WIP threshold enforced at multiple points.

**P-OP-003 (PCR)** — 4 enforcers: instruction-file, skill, ai-prompt-addendum, mcp-resource. Lower stakes (it's a presentation format), fewer enforcers.

**P-OP-004 (batched-execution)** — 4 enforcers: instruction-file, skill, hook, ai-prompt-addendum. Enforced primarily at the AI layer because the principle is fundamentally about AI behavior.

## Honest limits

**What CANNOT be made fully mechanical:**
- *Judgment calls* — "is this PCR genuinely balanced or rigged toward the recommendation?" Needs human review.
- *Cultural principles* — "default to candor." Hooks can flag hedge-words but can't enforce honesty.
- *Cross-cutting design quality* — "is this the right abstraction?" Linters check shape, not wisdom.

**Where mechanical enforcement creates more friction than it removes:**
- Early-stage exploration (rules-as-rails kill discovery; allow `--scratch` mode for experiments).
- Principles with high false-positive rates (a too-strict reuse-check makes everyone disable it; tune confidence threshold).

**Maintenance cost:**
- Every principle change updates ONE file (`principles.yaml`) and re-runs generators. Cheap.
- BUT: the generators themselves are infrastructure that must be maintained. Budget ~5% of platform engineering for the audit/enforcement substrate.
- The MCP server is a single point of cross-vendor failure; vendor a local copy per graduated app.

## Anti-patterns to avoid

1. **Memory-dependent enforcement** — what CSPS is solving for. Principles in chat context die on session end.
2. **Over-loaded AGENTS.md** — past ~300 lines, [agents start skipping](https://www.humanlayer.dev/blog/writing-a-good-claude-md). Move invokables to skills, scoped rules to per-directory MDC files.
3. **Ambiguous directives** — "be careful," "consider X" are reliably ignored. Use imperative + exact command + done criteria.
4. **Duplicate enforcement that drifts** — same rule in three places with three subtly different definitions. **Generate from one source** is the cure.
5. **Rules-as-theater** — the audit-the-audits meta-check is the cure.
6. **Inheritance hell** — rules accumulate, never get deprecated. Every principle has a `status` field; the audit warns if anything references a deprecated principle.
7. **The 17x error trap in multi-agent systems** — each delegation hop compounds error. Inheritance must include enforcers, not just instructions.

## Implementation order (mapped to build order in pillar 6)

| Week | Mechanical enforcement milestone |
|---|---|
| 1 | `packages/principles/principles.yaml` with the operating + architecture stubs + meta principles populated (counts dynamic per yaml row count; see [audit-runner.md#principle-count-staleness](./audit-runner.md) for the audit that prevents stale narrative counts; per ADR-0022). Bootstrap script provisions `packages/principles/`, `packages/principles-mcp/`, `packages/skills/`. |
| 2 | `packages/principles/codegen.ts` full implementation: emits AGENTS.md sections, Vale rules, ESLint rules, hook stubs, skill stubs, MCP resource definitions. CI gate: `audit-glossary-fresh`-style check on principles codegen freshness. |
| 3 | First skills shipped: `/pcr`, `/wip-check`, `/reuse-check`. First hooks shipped: PreToolUse on Write (catalog lookup). |
| 4 | Audit runner integrates the meta-check (`libs/audits/checks/principle-coverage.ts`). MCP server (`packages/principles-mcp/`) shipped and registered. |
| 5 | Remaining 22 architecture principle stubs filled with full enforcer maps during pillar-1 migration. |
| 6 | Mastra `BaseAgent` integration: every agent pulls platform principles from MCP at construction. |
| 11 | First `nx g platform:app` invocation: verifies app's AGENTS.md cascade, vendored audit-runner, vendored MCP server. |

## Sources

- [AGENTS.md open standard](https://agents.md/)
- [Claude Code best practices](https://code.claude.com/docs/en/best-practices)
- [HumanLayer: Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Blake Crosley: AGENTS.md patterns that change behavior](https://blakecrosley.com/blog/agents-md-patterns)
- [Cursor Rules documentation](https://cursor.com/docs/context/rules)
- [Claude Code hooks docs](https://code.claude.com/docs/en/hooks)
- [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Anthropic Skills spec](https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md)
- [Model Context Protocol specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP donation to Linux Foundation](https://en.wikipedia.org/wiki/Model_Context_Protocol)
- [Backstage Tech Insights](https://github.com/backstage/community-plugins/blob/main/workspaces/tech-insights/plugins/tech-insights/README.md)
- [Open Policy Agent](https://www.openpolicyagent.org/)
- [Lefthook vs Husky](https://dev.to/quave/lefthook-benefits-vs-husky-and-how-to-use-30je)
- [Danger.js](https://danger.systems/js/)
- [Mastra Agent class reference](https://mastra.ai/reference/agents/agent)
- [Mastra multi-agent systems](https://mastra.ai/guides/concepts/multi-agent-systems)
- [Towards Data Science: Multi-agent failure modes (the 17x error trap)](https://towardsdatascience.com/why-your-multi-agent-system-is-failing-escaping-the-17x-error-trap-of-the-bag-of-agents/)
