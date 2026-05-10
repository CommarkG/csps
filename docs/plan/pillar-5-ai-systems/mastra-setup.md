---
id: csps.pillar-5.mastra-setup
name: mastra-setup
description: Mastra agent runtime — BaseAgent (one parameterized agent serves all personas per ADR-0008) + MCP integration (principles + catalog as MCP resources) + dispatcher middleware (capability + composition-function enforcement). The runtime substrate for every AI invocation in CSPS. Migrated from v1.3 §16.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
next_review_at: 2026-08-01
tags:
  - domain:ai
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - security
  - reliability
  - observability
  - ai-native
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: persona-composition, href: ./persona-composition.md }
  - { rel: crisis-escalation, href: ./crisis-escalation.md }
  - { rel: skill-tier-rules, href: ../pillar-3-platform-services/sandboxed-skill-governance.md }
  - { rel: skills-package, href: ../pillar-4-developer-experience/skills-package.md }
  - { rel: mechanical-enforcement, href: ../pillar-0-governance/mechanical-enforcement.md }
  - { rel: adr-one-agent, href: ../../adr/0008-one-mastra-agent-many-personas.md }
created-new-because: |
  No prior leaf documented the Mastra runtime. v1.3 §16 had the BaseAgent + MCP + dispatcher
  spec inline; this leaf consolidates it as a pillar-5 reference. Distinct from persona-composition
  (the system-prompt assembly logic) and from skills-package (the AI-skill catalog the dispatcher
  routes to). Mastra-setup is the GLUE.
domain_path: platform
---

# Mastra Setup

> **Check what exists. Enhance the ratified thing. Create new only with a justification.**

## What this document locks

The Mastra agent runtime architecture: BaseAgent class (one parameterized agent serves all personas via Dynamic Agents pattern), MCP integration (principles + catalog + skills exposed as MCP resources), dispatcher middleware (two-point capability enforcement + mandatory composition-function invocation + crisis-escalation interception), the lifecycle (constructor → context → dispatch → audit), per-app extension surface.

## Why this exists

Without a single runtime contract, every persona ends up with its own agent process, its own context-load logic, its own audit. That's the failure mode every AI platform hits at ~20 personas. Mastra's Dynamic Agents pattern (one parameterized agent serves N personas) is the production-validated answer; this leaf locks the platform-side conventions on top of Mastra primitives.

Per ADR-0008: **one parameterized Mastra agent (`personaChatAgent`) serves all personas via `runtimeContext.get("personaId")`.** No 75-agent-instance proliferation.

## The BaseAgent

```typescript
// libs/agents/base-agent.ts
import { Agent, RuntimeContext } from "@mastra/core";
import { composePersona } from "@/libs/personas/composition";
import { dispatcherMiddleware } from "./dispatcher-middleware";
import { crisisInterceptor } from "@/libs/crisis/interceptor";

export const personaChatAgent = new Agent({
  name: "persona-chat",

  // System prompt is computed per-invocation via composition function
  instructions: async ({ runtimeContext }) => {
    const personaId = runtimeContext.get("personaId");
    const userId = runtimeContext.get("userId");
    return composePersona(personaId, runtimeContext);
  },

  // Tools loaded dynamically per persona's capability declaration
  tools: async ({ runtimeContext }) => {
    const personaId = runtimeContext.get("personaId");
    const persona = await getPersona(personaId);
    return loadAllowedTools(persona.allowed_tools);
  },

  // MCP resources (principles + catalog + skills) accessible to all personas
  mcpServers: ["principles-mcp", "catalog-mcp", "skills-mcp"],

  // Middleware order matters: crisis FIRST (intercept before LLM call), capability SECOND
  middleware: [crisisInterceptor, dispatcherMiddleware],

  // Audit trigger logs every dispatch
  postDispatch: writeAuditEvent,
});
```

## The dispatcher middleware (capability point-2)

Per pillar-3/sandboxed-skill-governance.md (defense-in-depth: PreToolUse hook + dispatcher middleware):

```typescript
// libs/agents/dispatcher-middleware.ts
export const dispatcherMiddleware: Middleware = async (ctx, next) => {
  const personaId = ctx.runtimeContext.get("personaId");
  const persona = await getPersona(personaId);

  // BEFORE invocation
  for (const tool of ctx.tools) {
    if (!persona.allowed_tools.includes(tool.name)) {
      throw new CapabilityViolation(`${persona.id} not authorized for ${tool.name}`);
    }
  }

  // Composition-function-invocation gate (every dispatch must go through composition)
  if (!ctx.compositionInvoked) {
    throw new CompositionSkipViolation(`Dispatch missing composition-function invocation`);
  }

  // PROCEED
  const result = await next();

  // AFTER invocation: post-LLM validator (per crisis-escalation.md component 3)
  await runPostLLMValidator(ctx, result);

  return result;
};
```

## The crisis interceptor (FIRST middleware; pre-LLM)

```typescript
// libs/crisis/interceptor.ts
export const crisisInterceptor: Middleware = async (ctx, next) => {
  const userMessage = ctx.message;

  // Tier 1: regex (fast)
  if (matchesAnyPattern(userMessage, CRISIS_REGEX)) {
    return safeResponseAndEscalate(ctx, "pre-llm-regex");
  }

  // Tier 2: classifier (slower; ~50ms latency)
  const classifierScore = await classifyCrisis(userMessage);
  if (classifierScore.score > 0.7) {
    return safeResponseAndEscalate(ctx, "pre-llm-classifier", classifierScore);
  }

  // No trigger: proceed with LLM dispatch
  return next();
};
```

The interceptor never touches the LLM if it triggers. Bypass = LLM never sees the crisis message → cannot emit harmful content from it.

## ⚠️ Future-artifact references

This leaf cites three MCP packages that don't yet exist on disk (planned per [pillar-6/build-order.md](../pillar-6-operations-and-delivery/build-order.md)):
- `packages/principles-mcp/` — **planned week 1** (skeleton) → week 2 (full)
- `packages/catalog-mcp/` — **planned week 6** (with Mastra)
- `packages/skills-mcp/` — **planned week 6** (with Mastra)

Pre-week-1: treat references in this leaf as forward-references-to-week-N-deliverables. Per S003 extended-S003 §C3.6 / Gap 2 in [`gaps-and-duplications-S003.md`](../_handoff/VAULT/gaps-and-duplications-S003.md).

## MCP integration

Three MCP servers connect to the BaseAgent:

| MCP Server | Purpose | Path |
|---|---|---|
| `packages/principles-mcp/` | Principles + behavioral contracts as queryable resources; cross-vendor (Codex / Cursor / Claude Code can connect) | Resources: `principle://P-OP-001`, `principle://P-META-006`, etc. |
| `packages/catalog-mcp/` | Catalog manifest as queryable resources; supports the catalog-first generator UX | Resources: `catalog://entries`, `catalog://search?q=` |
| `packages/skills-mcp/` | Skills package exposed for RAG-routing; description-front-loaded for context-relevance | Resources: `skill://pcr`, `skill://reuse-check`, etc. |

MCP servers shipped via separate Nx project; cross-vendor portable. When the platform graduates an app, the MCP servers vendor into the standalone repo (per pillar-6 graduation-pipeline.md).

## Lifecycle of a dispatch

```
1. User message arrives at apps/customer-shell/api/chat (or equivalent)
2. Handler creates RuntimeContext with { personaId, userId, conversationId, requestId }
3. Handler invokes personaChatAgent.generate({ message, runtimeContext })
4. crisisInterceptor (middleware position 1) runs:
   - regex check; if hit → safeResponseAndEscalate; STOP
   - classifier check; if hit → safeResponseAndEscalate; STOP
   - else → next()
5. dispatcherMiddleware (middleware position 2) runs:
   - capability check on tools; throw if violation
   - composition-invocation gate; throw if not invoked
   - next()
6. Mastra invokes LLM with composed system prompt + tools
7. LLM response returned
8. dispatcherMiddleware AFTER block:
   - post-LLM validator runs; if unsafe → safeResponseAndEscalate
9. postDispatch hook: writeAuditEvent (PreToolUse + ToolUse + PostToolUse all logged via audit trigger)
10. Response sent to user
```

Every step is observable via OTel GenAI semantic conventions.

## Per-app extension surface

Apps may register additional middleware via `libs/agents/extensions.ts`:

```typescript
// apps/spiritual-coach/agent-extensions.ts
import { registerExtension } from "@/libs/agents/extensions";

registerExtension({
  app: "spiritual-coach",
  middleware: [spiritualDomainPreambleInjector],
  position: "after-composition-before-llm",  // closed enum
});
```

Extensions are registered at app-bootstrap time; cannot be dynamically added per-request. Audit `extension-registration-static` (PR-blocking) catches dynamic mutations.

## Cross-vendor portability

Per pillar-0/mechanical-enforcement.md: all four enforcement layers (AGENTS.md cascade / shared MCP / Mastra BaseAgent / audit-runner) are **vendor-portable**. If we switch from Mastra to LangGraph or CrewAI:
- AGENTS.md cascade: unchanged (cross-vendor convention)
- MCP servers: unchanged (open spec)
- Audit-runner: unchanged (DB-layer + file-layer scans)
- BaseAgent: re-implemented in the new framework; principles + composition + middleware all preserved

The principle-enforcement layer survives the framework switch.

## Anti-patterns

1. **Per-persona Mastra agent instance** — refused per ADR-0008
2. **Skipping crisisInterceptor** — refused; middleware order is enforced; `audit-middleware-order` (PR-blocking)
3. **Skipping dispatcherMiddleware** — refused; capability enforcement bypassed if dispatcher skipped
4. **Composition-function bypass** — refused; dispatcherMiddleware throws CompositionSkipViolation
5. **Direct LLM call bypassing BaseAgent** — refused; AGENTS.md hard NO; `audit-direct-llm-call` (PR-blocking) catches via static analysis
6. **MCP resource exposed without principle backing** — refused; principles-mcp resources must reference a `principles.yaml` row
7. **Audit trigger disabled "for tests"** — refused; tests use a mocked audit sink, not a disabled trigger
8. **Extension registered at request-time** — refused; static registration only

## Enforcement

- `principles.yaml#P-ARCH-021` (one-agent-many-personas — corresponds to ADR-0008)
- `principles.yaml#P-ARCH-024` (defense-in-depth-pre-and-post)
- `principles.yaml#P-ARCH-027` (capability-declaration dispatcher-enforcement)
- `principles.yaml#P-ARCH-019` (crisis-escalation-load-bearing)
- `audit-runner.md#middleware-order` (PR-blocking; crisis FIRST, dispatcher SECOND)
- `audit-runner.md#direct-llm-call` (PR-blocking; bypass detection)
- `audit-runner.md#composition-skip` (PR-blocking; runtime gate + static analysis)
- `audit-runner.md#extension-registration-static` (PR-blocking; runtime mutations forbidden)
- `libs/agents/base-agent.ts` + `libs/agents/dispatcher-middleware.ts`
- `libs/crisis/interceptor.ts`
- `packages/principles-mcp/` + `packages/catalog-mcp/` + `packages/skills-mcp/`

## Sources

- [Mastra documentation](https://mastra.ai/) — Dynamic Agents pattern
- [docs/adr/0008-one-mastra-agent-many-personas.md](../../adr/0008-one-mastra-agent-many-personas.md)
- [docs/adr/0006-crisis-escalation-load-bearing.md](../../adr/0006-crisis-escalation-load-bearing.md)
- [Model Context Protocol spec](https://modelcontextprotocol.io/) — MCP foundation
- [OpenTelemetry GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions/tree/main/docs/gen-ai)
- [pillar-5/persona-composition.md](./persona-composition.md) — the composition function the dispatcher invokes
- [pillar-5/crisis-escalation.md](./crisis-escalation.md) — the slice the crisisInterceptor enforces
- [pillar-3/sandboxed-skill-governance.md](../pillar-3-platform-services/sandboxed-skill-governance.md) — capability-enforcement two-point pattern
