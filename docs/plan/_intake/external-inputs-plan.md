---
id: csps.intake.external-inputs-plan
name: external-inputs-plan
description: The detailed plan for CSPS's External-Input Intake plane — capturing humans, URL content (videos / PDFs / PPT / Google Docs / Sheets / Slides / web pages), file uploads, and other AI app exports (Claude Code, Lovable, ChatGPT, Cursor). Industry-research-backed (40+ sources cited). Recommends a hybrid 3-layer pattern (per-source connectors → thin policy gate → pub/sub event bus fan-out). Includes PCR (single-gate vs distributed vs hybrid), risks/mitigations, fan-out-vs-single-route analysis, AI-behavior-schema-coverage answer, and 12-week implementation roadmap. Downloadable single-file deliverable for user review.
version: 1.0
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-review
next_review_at: 2026-08-01
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - audience:ai-agent
  - maturity:draft
crosscutting:
  - reliability
  - observability
  - security
  - ai-native
  - multi-tenant
diataxis_type: explanation
links:
  - { rel: parent, href: ./README.md }
  - { rel: source-types, href: ./source-types.md }
  - { rel: learning-loop, href: ../pillar-0-governance/learning-loop.md }
  - { rel: stewardship, href: ../pillar-0-governance/stewardship-protocol.md }
domain_path: platform
scope_level: S1
---

# CSPS External-Input Intake — Detailed Plan

> **Every INPUT either has a place to be and a predefined process to follow OR the system alerts itself to solve one.** — User cardinal directive

> **Saving is not the goal; permanent system improvement is.** — P-META-005 Learning Loop

## TL;DR

The 2025–2026 industry consensus does **not** support a single dominant intake gate that owns assessment + validation + routing for every external input. Production systems (Glean, Microsoft 365 Copilot, Notion AI, Cohere, Salesforce Data Cloud, Snowplow, Segment) converge on a **three-layer pattern**:

1. **Per-source connectors** — diverse, source-specific parsers + authenticators + source-aware sanitizers (PDF, video transcript, Google Doc, AI-app export each get their own).
2. **Thin policy gate** — uniform envelope, prompt-injection scanning, trust-tier stamping, tenant binding, provenance capture, observability.
3. **Pub/sub event bus** — extracted insights ripple to N domain-owner subscribers via topic filters; subscribers self-select.

CSPS adopts this pattern. The gate is **thin** (policy + provenance + scan only); routing is **deterministic** with optional LLM-as-classifier for soft triage; fan-out is **pub/sub** so insights ripple to all relevant domains rather than vanishing into the AI's immediate context. Prompt-injection defense uses **Dual-LLM / CaMeL** structural separation with trust-tier travelling end-to-end.

The "AI behavior in schema" answer: currently **distributed, not unified**. The closest unified concept is `principles.yaml`. Components exist (Persona slice, Skills, AGENTS.md, Mastra agents, hooks) but no single `AIBehavior` schema entity with full-stack connectivity. The plan includes a recommendation to consolidate.

## Calibration recommendations (the load-bearing answers)

| Question | Recommended answer | Source / reasoning |
|---|---|---|
| **One gate or many?** | Hybrid: one **thin** policy gate + **many** specialized per-source connectors + **pub/sub event bus** fan-out. | [Glean connectors](https://www.glean.com/connectors), [M365 Copilot connectors](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-copilot-connector), [API gateway SPOF cases](https://medium.com/@umutt.akbulut/api-gateway-why-it-quietly-becomes-the-single-point-of-failure-in-modern-enterprises-the-paradox-26332585b002), [god-service anti-pattern](https://blog.bitsrc.io/10-microservice-anti-patterns-278bcb7f385d) |
| **Is native-AI routing acceptable?** | Only for **soft triage classification**, never for final-destination decisions. Compounding non-determinism: 4 chained 95%-stable LLM classifiers ≈ 81% reliability before accuracy is even measured. | [LLM non-determinism](https://arxiv.org/html/2408.04667v5), [Patronus AI routing](https://www.patronus.ai/ai-agent-development/ai-agent-routing), [RouterArena](https://arxiv.org/html/2510.00202v1) |
| **Fan-out vs single-route?** | **Fan-out via pub/sub**, scored relevance **per subscriber**. The gate doesn't presume to know who cares; subscribers self-select via topic patterns. | [Snowplow event-forwarding](https://snowplow.io/event-forwarding), [Salesforce EDA](https://architect.salesforce.com/decision-guides/event-driven), [AWS EventBridge](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/publish-subscribe.html) |
| **Required prompt-injection defenses at gate?** | **Dual-LLM** (Willison) or **CaMeL** (DeepMind 2025); structural separation of trusted/untrusted; classifier scan **before** the primary model sees the content; output filter. Pattern-matching alone fails. | [Willison Dual-LLM](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/), [OWASP LLM01:2025](https://genai.owasp.org/llmrisk/llm01-prompt-injection/), [CaMeL paper](https://afine.com/llm-security-prompt-injection-camel) |
| **Required provenance attributes per input?** | source URI, capture timestamp, capturing actor (human/agent ID), tenant ID, content hash (SHA-256), ACL, **trust tier**, C2PA manifest where present, processing chain, OTel trace_id+span_id. | [Glean data flow](https://docs.glean.com/security/architecture/data-flow), [C2PA spec](https://c2pa.org/), [M365 Graph ACL](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-copilot-connector) |
| **Where does extraction live?** | In the **connector** (per-source extractor), not the gate. Gate receives normalized envelope; gate doesn't parse. | [Cohere connector contract](https://github.com/cohere-ai/quick-start-connectors), [Glean connector framework](https://www.glean.com/resources/product-videos/working-ai-glean-connector-framework-for-enterprise-search) |
| **What happens to AI-app exports specifically?** | Treated as `medium` trust tier with source-aware sanitization (their content may carry adversarial fragments their original AI absorbed). Routed through Dual-LLM quarantine before any CSPS LLM sees them. | OWASP LLM01:2025 indirect-injection chapter |

## What CSPS already has (the survey)

Before adding new architecture, the audit per P-OP-001 reuse-first.

### Components currently in place

| Component | Location | Role | Coverage |
|---|---|---|---|
| **Learning Loop pipeline** (P-META-005) | `pillar-0/learning-loop.md` + `principles.yaml#P-META-005` + `libs/policies/slices/public/learning-loop-item.zmodel` | Closed-loop intake processing once an input is captured (observed → triaged → routed → fixing → validated → closed) | Internal sources (CHAT, AUDIT, ERROR_LOG, FEEDBACK, NEAR_MISS, AI_EXTRACTION) |
| **Stewardship Protocol** (P-META-004) | `pillar-0/stewardship-protocol.md` + `principles.yaml#P-META-004` | Lifecycle of saved artifacts (every saved input declares lifecycle_state) | All artifacts including pending-* states |
| **`/learning-loop-extract` skill** | `packages/skills/learning-loop-extract/SKILL.md` | AI-extraction insight capture from session logs | Session-end auto-fire via PostStop hook |
| **`/stewardship-review` skill** | `packages/skills/stewardship-review/SKILL.md` | Surfaces stale `pending-*` items for triage | Per-session at open + close |
| **Persona slices** | `pillar-2/starter-slices.md` (Persona) + ZenStack | Schema-defined AI personalities; full-stack | Customer-facing AI surfaces |
| **`AGENTS.md`** | Root | Cross-vendor AI contract; cardinal principles + hard NOs + meta-principles | Generated from `principles.yaml` (codegen pending week 2) |
| **Skills (`packages/skills/`)** | File-based | Invokable AI behaviors backed by principles | Source-of-truth in principles.yaml |
| **PostStop hook** | `.claude/hooks/post-stop-learning-loop.sh` | Mechanical guarantor: session can't end without learning-loop:extract firing | All chat sessions |
| **Audit-runner** | `pillar-0/audit-runner.md` | 47 audit checks across 11 categories (incl. Stewardship + Learning Loop) | All artifacts + runtime |

### What is missing for external-input intake

| Gap | Why it matters |
|-----|----------------|
| **No per-source connectors** for URL content (video, PDF, Google Docs, etc.) | Right now the only intake paths are direct chat + manually-routed `LearningLoopItem` inserts. URL content has no door. |
| **No File-upload UI** in `apps/admin` or per-app surfaces | Users have no way to drop a file for processing. |
| **No prompt-injection scanning layer** | OWASP LLM01:2025 is the #1 risk; CSPS has no defense for external content. |
| **No trust-tier model** in the envelope | All content currently treated as same trust; no structural separation between tenant-authored and external-untrusted. |
| **No event bus / pub/sub topic** for fan-out | Insights from a single source can only be routed to ONE LearningLoopItem; multi-domain ripple impossible. |
| **No `ExternalInput` schema entity** | Raw capture (provenance, hash, content) has no place. |
| **No `AIBehavior` unified schema entity** | "AI behavior" is distributed across personas/skills/AGENTS.md/principles; no single dashboard or admin surface. |

The plan below addresses each gap.

## PCR — Single gate vs distributed vs hybrid

### Options

**Option A — Single dominant gate.** One central service receives every external input, classifies source type, performs full extraction, makes routing decisions, writes to a central queue.

**Option B — Many distributed paths.** Each source type has its own end-to-end pipeline (its own gate, scanner, extractor, router). No central layer.

**Option C — Hybrid (3-layer pattern).** Per-source connectors handle source-specific parsing + sanitization. A thin policy gate enforces uniform cross-cutting concerns (auth, provenance, scan, trust-tier, envelope schema). A pub/sub event bus fans out to N domain-owner subscribers.

### Pros / Cons

| Option | Pros | Cons |
|---|---|---|
| **A — Single gate** | Single audit point; uniform provenance; one schema to evolve; centralizes prompt-injection defense; single dashboard | Bottleneck (documented SPOF); schema explosion as every source lobbies for new fields; tenant-isolation complex; "every connector becomes a custom integration" tax accreted inside the gate; god-service anti-pattern; centralized credential blast radius (cf. LiteLLM PyPI compromise March 2026) |
| **B — Distributed** | No bottleneck; per-source teams could own; source-specific optimization | Audit fragmentation; per-source security review tax; provenance inconsistency across sources; harder cross-source insight; no single dashboard; prompt-injection defense reinvented per source |
| **C — Hybrid** | Source-specific extraction lives where it belongs (connectors); cross-cutting concerns centralized but **thin**; pub/sub decouples producers from consumers; prompt-injection defense at one place; no schema explosion (loose envelope contract); cleanly evolvable | Two-layer coordination; needs clear contract between connectors and gate; pub/sub adds operational complexity |

### Recommendation

**Option C — Hybrid 3-layer pattern.**

This is the architecture every enterprise RAG product (Glean, M365 Copilot, Notion AI, Cohere, Hebbia) has converged on. It is also the architecture every CDP and event-routing system (Salesforce Data Cloud, Segment, Snowplow, AWS EventBridge) has converged on for the fan-out half. The convergence is across two adjacent industries solving the same shape of problem; CSPS should not invent a third pattern.

**The thin gate's responsibilities are deliberately bounded** to:
1. Authentication + tenant attribution
2. Provenance stamping (envelope normalization)
3. Trust-tier assignment
4. Prompt-injection scan + content quarantine for medium/high-risk content
5. Emission to pub/sub topic

The thin gate's responsibilities deliberately **exclude**:
1. Source-specific parsing (lives in connectors)
2. Routing decisions to specific domain owners (subscribers self-select)
3. Domain-semantic classification (subscribers' filters)
4. Closure tracking (Learning Loop's responsibility per-domain)

This boundary is the load-bearing piece. Every god-service in the literature got that way by accreting just-one-more responsibility into the gate. The discipline is: **if a feature requires "the gate to know" something domain-specific, that feature belongs in a subscriber, not the gate.**

## The architecture (detailed)

### Layer 1 — Per-source connectors

Each external input source type gets its own connector module under `tools/connectors/<source-type>/`. Each connector implements the same interface:

```typescript
interface ConnectorContract<S extends ExternalInputSource> {
  source: S;
  authenticate(req: ConnectorAuthRequest): Promise<ConnectorAuth>;
  fetch(uri: string, auth: ConnectorAuth): Promise<RawCapture>;
  extract(raw: RawCapture): Promise<NormalizedContent>;
  sanitize(content: NormalizedContent, riskProfile: ExternalInputRiskProfile): Promise<NormalizedContent>;
  envelope(content: NormalizedContent, ctx: TenantContext): Promise<ExternalInputEnvelope>;
}
```

Per-source examples:
- `tools/connectors/url-pdf/` — PDF parser (text + structure + OCR fallback) + invisible-text/metadata stripper (Lakera-recommended)
- `tools/connectors/url-video/` — YouTube/Vimeo/Loom transcript fetcher + auto-captions vs uploaded captions distinguishing
- `tools/connectors/url-google-doc/` — Google Drive API + Docs export + comments stripping (comments are an injection vector)
- `tools/connectors/file-pdf/` — same as URL-PDF for uploaded files
- `tools/connectors/ai-claude-code/` — Claude Code transcript JSONL parser + tool-output isolation
- `tools/connectors/ai-lovable/` — Lovable.dev export format parser (multiple schemas)
- `tools/connectors/human-form/` — direct API endpoint for structured form submissions

**Source-aware sanitization** is the non-obvious load-bearing piece per the research. What counts as suspicious in a PDF (invisible text, OCR artifacts, metadata fields, embedded JS) is different from what counts as suspicious in a Google Doc (comments with injected prompts), a YouTube transcript (auto-caption noise + injected promotional content), or a Lovable session export (the original AI's prior outputs may already contain injections it absorbed). A "universal" sanitizer at the gate cannot encode these source-specific defenses.

### Layer 2 — Thin policy gate

A Cloudflare Worker (`apps/intake-gate/`) — lives in the platform's existing Cloudflare Workers footprint. Receives normalized envelopes from connectors. Performs:

1. **Tenant binding.** Validates the connector's tenant claim against Clerk Organization + RLS context.
2. **Provenance stamping.** Generates `gate_processing_id`, sets `ingested_at`, computes `content_hash` (SHA-256) for dedupe lookup.
3. **Trust-tier assignment.** Deterministic rules:
   - `tenant_authored` — content from authenticated user in their own tenant
   - `tenant_invited_party` — content from authenticated user in a tenant they were invited to
   - `tenant_url_paste` — URL content the tenant pasted; medium risk
   - `public_web_fetch` — autonomous fetch of public URL; high risk
   - `external_ai_export` — AI-app session export; high risk (the prior AI may have absorbed injections)
4. **Prompt-injection scan.** For trust tier ≥ medium, runs a classifier-based scan (small ML model OR LLM-as-classifier with constrained-output schema). Below threshold (configurable; default 0.85) → quarantine.
5. **Persistence.** INSERT `public.external_input` with `gate_state: scanning → sanitized` (or `quarantined`).
6. **Emission.** Publishes envelope to `csps.external-input.received` topic on the pub/sub bus.
7. **OTel telemetry.** Span with `gen_ai.input.source`, `gen_ai.input.trust_tier`, `gen_ai.input.scan.score`.

**The gate does NOT extract content.** Extraction is the connector's job. The gate sees the normalized envelope after connector parsing.

**The gate does NOT decide who consumes the content.** That's the subscribers' filter logic.

### Layer 3 — Pub/sub event bus + subscribers

Topic name: `csps.external-input.received`. Implementation: Cloudflare Queues (existing CSPS stack) for the v1; can graduate to Kafka/NATS if scale demands.

Each domain owner registers a **subscriber** with a filter. Filter dimensions:
- `source` (one or more of `ExternalInputSource`)
- `trust_tier` (minimum acceptable)
- `tenant_id` (RLS — only sees their own tenant's content)
- Topic pattern (e.g., "billing", "personas", "compliance" — matched against extracted keywords)
- LLM-judge filter (subscriber-side; uses small classifier or LLM with bounded output schema to score "is this relevant to me?")

When an envelope is published:
1. Bus delivers to all subscribers whose filter matches.
2. Each subscriber INSERTs a `LearningLoopItem` with `parent_input_id = envelope.id` (linking back to the source).
3. Each subscriber's LearningLoopItem follows the standard pipeline (observed → triaged → … → closed).
4. The gate updates `external_input.fanout_count` and `fanout_completed_at` after all subscribers have ack'd.

**This is how the user's "ripple to all relevant domains" question is answered**: a single PDF can produce N LearningLoopItems, one per domain owner whose filter matched. No domain owner depends on the original AI's context window. If the billing domain owner cares about pricing implications, the personas domain owner cares about tone changes, and the compliance domain owner cares about retention statements — they each get their own LearningLoopItem from the same source.

### State machine (`ExternalInput.gate_state`)

```
received   → scanning            (auto, on connector→gate handoff)
scanning   → sanitized            (scan score < threshold)
           → quarantined          (scan score ≥ threshold OR pattern hit)
           → failed               (scanner error; ops investigates)
sanitized  → extracting           (auto, on connector ack)
           → failed               (extraction error)
extracting → routed               (auto, after all subscribers ack envelope delivery)
           → failed               (no subscribers OR delivery error)
quarantined → received            (after manual override; staff role only)
            → (terminal otherwise)
routed     → (terminal)
failed     → (terminal — ops investigates)
```

State transitions enforced via Postgres trigger on `public.external_input` (see `audit-triggers.md` pattern).

## Risks to avoid + mitigations

### R1 — Single-point-of-failure on the gate

**Risk:** "When the gateway went down, everything went down." [Source — gate-as-bottleneck case study](https://medium.com/lets-code-future/our-api-gateway-was-the-bottleneck-we-deleted-it-a8551e58a0d6)

**Mitigation:**
- The gate is **stateless** — its only state is in Postgres. Multiple Worker instances can process in parallel.
- **Cloudflare Workers' regional auto-scaling** handles surge load.
- **Bypass route** for emergency: a documented `/api/intake/raw` endpoint that connectors can call to bypass the gate's scan (still writes to `public.external_input` with `gate_state: skipped` flag). Used only by ops in incident response. Audited.
- **Circuit breaker** on the scan-LLM dependency — if scan-LLM is unavailable, route to quarantine (default-deny) rather than allow-through.

### R2 — Bottleneck and velocity tax

**Risk:** "No new routing rule goes live without touching the gateway, no new domain behavior can be tested without modifying its configuration." [Source — SPOF analysis](https://medium.com/@umutt.akbulut/api-gateway-why-it-quietly-becomes-the-single-point-of-failure-in-modern-enterprises-the-paradox-26332585b002)

**Mitigation:**
- Subscribers register their own filters; the gate has no routing config.
- New source types add a connector + an enum value; do not modify the gate's logic.
- New trust tiers require an ADR; tier rules are in `tools/intake/trust-tier-rules.json` (config, not code change in the gate).

### R3 — Schema explosion in the envelope

**Risk:** Every source lobbies for new optional fields; envelope grows; versioning hell.

**Mitigation:**
- **Stable envelope schema with optional payload** pattern from Cohere connectors. Envelope fields (source, tenant, hash, ACL, trust-tier, timestamp) are versioned tightly; payload typed loosely (Json with per-source schema validated at the connector boundary, not the gate).
- Envelope additions require ADR + connector contract version bump.

### R4 — Prompt-injection at the gate

**Risk:** Untrusted content (PDFs, web pages, AI exports) carries adversarial instructions. OWASP LLM01:2025 #1 risk.

**Mitigation:**
- **Connector-side source-aware sanitization** (PDF metadata stripping, HTML invisible-text removal, AI-export instruction-fragment filtering).
- **Gate-side classifier scan** before any CSPS LLM sees the content. Default threshold 0.85; tunable per source type.
- **Dual-LLM / CaMeL pattern downstream**: the privileged LLM (which has tools) never sees raw untrusted content; a quarantined LLM (no tools) reads content and returns symbolic outputs (e.g., `$VAR1 = "summary of PDF"`) which the privileged LLM passes around without dereferencing. ([Willison Dual-LLM](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/), [DeepMind CaMeL](https://afine.com/llm-security-prompt-injection-camel))
- **Trust tier travels end-to-end**. Every downstream LLM call carries the trust tier; tools that take action require trust-tier ≥ tenant_authored or explicit human approval.

### R5 — Tenant isolation

**Risk:** Shared queues leak metadata across tenants; poisoned input from tenant A affects tenant B's processing.

**Mitigation:**
- `external_input` table has `tenant_id` with RLS policy; reads scoped to the tenant.
- Pub/sub subscriptions filter on `tenant_id` server-side (subscribers can only see their own tenant's envelopes).
- Per-tenant scan-LLM context (no shared prompts across tenants).

### R6 — Centralized credential blast radius

**Risk:** Connector credentials (Google API keys, YouTube API tokens, Anthropic API keys for the scanner) concentrated in the gate. The March 2026 LiteLLM PyPI supply-chain compromise demonstrated this risk. ([Sonatype writeup](https://www.sonatype.com/blog/compromised-litellm-pypi-package-delivers-multi-stage-credential-stealer))

**Mitigation:**
- Per-tenant credentials live in the tenant's Clerk Organization, not the gate.
- The gate never holds long-lived secrets; uses short-TTL tokens.
- Connectors hold their own OAuth tokens (per-tenant) — not the gate.
- Cloudflare Worker secrets are per-environment; rotated quarterly.
- Audit `skill-vendor-integrity` extends to connector dependencies.

### R7 — Knowledge graveyard

**Risk:** Inputs flow in, get extracted, but no one acts on them. The dominant KM failure mode (cf. P-META-005 Learning Loop research).

**Mitigation:**
- Fan-out via pub/sub guarantees insights reach subscribers; subscribers' Learning Loop SLAs guarantee triage.
- The `learning-loop-coverage` audit (per-session, weekly) tracks "items observed but not closed within window."
- The `repeat-issue-detection` audit (K=2 within 90 days → auto-ADR) is the structural anti-graveyard mechanism.
- Domain owners get a per-domain LearningLoopBacklog dashboard surfacing "items aged >SLA."

### R8 — "Native AI as router" non-determinism cascade

**Risk:** Stacking 4 LLM-driven routing decisions @ 95% reliability each = 81% before accuracy is even measured. ([RouterArena](https://arxiv.org/html/2510.00202v1))

**Mitigation:**
- Source-type identification is **deterministic** (file extension, MIME, URL pattern).
- Trust-tier assignment is **deterministic** (actor-identity rule).
- Topic classification can use LLM with **constrained output schema** (one of N enum values). Allowed because output is bounded.
- Final dispatch (subscriber matching) is **deterministic** (the subscriber's filter is a function of the envelope, not an LLM).
- Below confidence threshold, **escalate to human triage**, not auto-route. ([Patronus AI guide](https://www.patronus.ai/ai-agent-development/ai-agent-routing))

## The fan-out vs single-route question — answered

This is the question the user surfaced explicitly:

> *"How is it decided if extraction goes to one place making the AI pleased or how can we make sure extraction ripples hit all relevant domains?"*

**Answer: pub/sub fan-out, subscribers self-select.**

The "single-route AI-pleasing" pattern is the failure mode. It's what happens when an AI extracts content into its own context to answer the immediate question and then nothing else sees it. The user's intuition that this is wrong is correct.

The "ripple to all relevant domains" pattern is the production-tested pattern across:
- **Salesforce Data Cloud** ([architect.salesforce.com](https://architect.salesforce.com/decision-guides/event-driven)) — Platform Events + CDC + Streaming API; one capture, many subscribers.
- **Segment** ([Snowplow comparison](https://snowplow.io/twilio-segment-vs-snowplow-bdp/)) — originally founded to do exactly this for analytics events.
- **Snowplow** ([event forwarding](https://snowplow.io/event-forwarding)) — captures rich event data and exposes as a stream that any consumer can subscribe to. The architectural commitment: **don't presume what's interesting at capture time.**
- **AWS EventBridge** ([pub-sub pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/publish-subscribe.html)) — content-based routing, filtering, sequencing as core primitives.

The non-obvious production lesson (cited by all four): **don't have the gate score "who cares" — let subscribers score**. Each domain owner subscribes with their own relevance filter (topic pattern, classifier, LLM judge). The gate emits with rich envelope; subscribers decide. This decouples the gate from domain semantics and lets domain owners evolve their interests without the gate team being involved.

For CSPS specifically: a PDF dropped in the inbox could simultaneously land in:
- The personas LearningLoopItem queue (if the personas-subscriber filter catches "tone of voice" or "communication style" mentions)
- The billing LearningLoopItem queue (if the billing-subscriber filter catches "pricing" or "tier" mentions)
- The compliance LearningLoopItem queue (if compliance filter catches "retention" or "PII")
- The platform-foundation queue (if it catches "audit" or "governance")

Each subscriber gets its own LearningLoopItem. Each goes through its own observed → triaged → routed → fixing → validated → closed. Each domain owner is accountable for closure of their own items. The gate's job ends at "envelope published." The user's directive ("ripple all relevant domains") is structurally guaranteed.

## "AI behavior" in the schema — the answer

The user asked: **"do we have an 'ai behavior' defined in the schema and does it have full stack connectivity, enforcements and dev dashboards?"**

### Honest answer: distributed, not unified

Currently CSPS has the **components** of AI behavior governance but no **single schema entity** with full-stack coverage. Inventory:

| Layer | Defined where? | Schema-typed? | Full-stack? | Dev dashboard? | Enforcement |
|---|---|---|---|---|---|
| **Personas** | `Persona` slice in `pillar-2/starter-slices.md` | ✅ ZModel | ✅ Slice contract requires DB + admin + customer + tests + audit | ❌ no behavior dashboard (only audit dashboard) | crisis middleware (P-ARCH-014) + slice contract + ZenStack `@@allow` |
| **Skills** | `packages/skills/<name>/SKILL.md` | ❌ file-based | ⚠ partial (file + Mastra runtime; no DB record) | ❌ none | PreToolUse hook (P-ARCH-027) + dispatcher middleware |
| **AGENTS.md** | Root, generated from `principles.yaml` | ❌ markdown | ❌ no DB | ❌ none | codegen-fresh check + cascade |
| **principles.yaml** | `packages/principles/principles.yaml` | ⚠ YAML; generates `AuditCheck` DB rows indirectly | ⚠ partial — DB-side coverage via audit-runner; no direct registry-as-DB | audit dashboard exists; principles dashboard ❌ | meta-audit P-META-001 |
| **Mastra agents** | `libs/agents/<name>.ts` | ❌ TypeScript | ⚠ runtime only | ❌ none | runtime checks + audit `mastra-agent-count` |
| **Hooks** | `.claude/hooks/*.sh` | ❌ shell scripts | ⚠ trigger-bound | ❌ none | invoked by Claude Code runtime |

### The closest unified concept

`principles.yaml` is the closest unified concept — it's the single source of truth that codegen produces AGENTS.md + skills + hooks + MCP resources + audit checks from. But:
- It's YAML, not a schema entity.
- It doesn't have admin write access (edit YAML + regenerate; no UI).
- Its DB representation is indirect (only `AuditCheck` rows are registered).
- There's no "AI Behavior" dashboard showing what's active per app/persona/skill.

### What's planned (already in the migration tracker)

`pillar-4/ai-behavior-instructions.md` (currently 🟡 to migrate per `pillar-4-developer-experience/README.md`) is described as:

> NEW v1.5 — `AGENTS.md` content spec + AI prompt addendum

This is a **doc spec**, not a **schema entity**. It will improve the documentation of AI behavior but won't add full-stack connectivity.

### Recommendation: introduce `AIBehavior` schema slice

Add a new Foundation slice `libs/policies/slices/public/ai-behavior.zmodel`:

```prisma
enum AIBehaviorKind {
  principle           // entry from principles.yaml
  skill               // /pcr, /reuse-check, etc.
  persona             // links to Persona slice
  hook                // pre/post tool use, stop, post-stop
  agent               // Mastra agent class
  agent_md            // AGENTS.md cascade entry
}

model AIBehavior extends Base {
  kind                  AIBehaviorKind
  ref_id                String                    // links to principle ID, skill name, persona ID, etc.
  ref_path              String                    // file path for skill/hook/agent_md
  scope                 String                    // "platform" | "app:<slug>" | "persona:<id>"
  active                Boolean                   @default(true)
  enforcer_count        Int                                      // total mechanical enforcers
  non_ai_enforcer_count Int                                      // critical for severity validation
  last_eval_at          DateTime?
  last_eval_status      String?                                  // "pass" | "warn" | "error" | "critical"
  drift_signal          Json?                                    // when codegen-fresh drifts
  @@schema("public")
  @@allow('read', auth().staffRole != null)
  @@deny('delete', true)
  @@index([kind, scope, active])
}
```

This is the **single dashboard surface** for AI behavior:
- Admin page `/admin/ai-behavior` — table grouped by kind, filterable by app, with last-eval-status traffic-light, drift signals, enforcer-count.
- Powered by daily refresh job that walks `principles.yaml` + `packages/skills/` + `libs/personas/*` + `.claude/hooks/` + `libs/agents/` and reflects current state into `public.ai_behavior`.
- Audits (`ai-behavior-coverage` — does every persona have its required behaviors active?; `ai-behavior-drift` — has any reflected entry diverged from its source-of-truth file?) plug into the audit-runner.

**Trade-off:** this is a non-trivial addition — new slice + new admin page + new audits. Per P-OP-001 reuse-first: principles.yaml IS the source of truth; AIBehavior would be a **derived projection** (like AuditCheck is). The "files are truth, DB is index" principle (P-ARCH-003) makes this clean.

**Alternative (cheaper):** extend the existing AuditCheck table with `behavior_kind` + `behavior_ref` fields and treat each principle's enforcers as the unit of behavior tracking. This is less complete (doesn't surface skills / personas / hooks as first-class behavior records) but reuses an existing schema concept.

**Recommendation: introduce `AIBehavior` slice in week 4** alongside the audit-runner shipping. The cost is one additional slice; the benefit is a unified admin surface for what's currently scattered across 6 file locations.

This recommendation is added to `docs/plan/_handoff/VAULT/open-questions-ledger.md` for user review before locking via ADR.

## Implementation roadmap — 12 weeks (maps to existing build-order)

Aligned with `pillar-6/build-order.md` (pending S002 §3.5 migration) which spans the same 12 weeks. The intake plane fits as follows:

| Week | Intake-related milestones |
|---|---|
| **1** | Bootstrap (existing build-order). No intake work — wait for foundation. |
| **2** | Schema-only: deploy `public.external_input` + extend `public.learning_loop_item` with `parent_input_id`. Postgres trigger for state machine. |
| **3** | First connector: `tools/connectors/human-form/` — direct API endpoint for structured submissions. Smallest possible end-to-end test. |
| **4** | Audit-runner integrates the `learning-loop` + `stewardship` checks. **AIBehavior slice ships if approved** (per recommendation above). The thin policy gate ships as Cloudflare Worker. Pub/sub on Cloudflare Queues. |
| **5** | Second connector cohort: `url-pdf`, `file-pdf`, `file-txt`, `file-markdown` (high-frequency text sources). Prompt-injection scan goes live with classifier model. |
| **6** | Third connector cohort: `url-google-doc`, `url-google-sheet`, `url-google-slides` (Google ecosystem). Mastra `BaseAgent` integration for Dual-LLM downstream pattern. |
| **7** | Fourth connector cohort: `url-video-transcript`, `file-image` (OCR), `file-audio` (transcription). |
| **8** | Fifth connector cohort: `ai-claude-code`, `ai-lovable`, `ai-chatgpt`, `ai-cursor`, `ai-antigravity`. Trust-tier assignment for AI-app exports. |
| **9** | Subscribers: each starter persona registers a subscriber; admin page shows fan-out delivery rates. |
| **10** | Admin dashboard: `/admin/intake` shows per-tenant external-input backlog, scan reject rate, fan-out coverage. **AI Behavior dashboard** lands here if AIBehavior slice was deferred. |
| **11** | First app's intake plane verifies extraction-readiness (graduation app vendoring includes its own connectors). |
| **12** | Polish + load test + first ADR for the intake-plane architecture (this doc becomes ADR-NNNN). |

## What we're asking of the user (next steps)

1. **Review this plan.** Particularly:
   - The hybrid 3-layer pattern recommendation (Option C) vs alternatives.
   - The pub/sub fan-out with subscribers-self-select.
   - The `AIBehavior` slice recommendation (introduce vs extend AuditCheck vs defer).
   - The 12-week roadmap order.
2. **Upload the CSP platform "treasures"** — the user has materials from a prior CSP platform that we want to consider. This plan is the place those materials feed into; the intake architecture above is designed to accept those exact source types (`AI_CLAUDE_CODE_TRANSCRIPT`, `AI_OTHER`, file uploads, URL content).
3. **Decide on the AIBehavior question:** introduce a unified schema slice, extend AuditCheck, or defer until week 6+? The plan recommends introducing in week 4; happy to adjust.
4. **Confirm connector cohort priorities** — week 5/6/7/8 cohorts are ordered by frequency-of-use estimate; if the user has a different priority (e.g., AI-app exports first because that's where the CSP treasures live), the cohorts re-shuffle.

After review, the architecture decisions lock as ADR-NNNN (this plan becomes the ADR's source).

## Open questions (tracked)

Will be added to `docs/plan/_handoff/VAULT/open-questions-ledger.md` as `OQ-INTAKE-NNN`:

| ID | Question | Recommendation sketch |
|---|---|---|
| OQ-INTAKE-001 | Build vs buy the prompt-injection scanner? | Build classifier on top of small open model first (latency); evaluate Lakera Guard / Protect AI Recon as paid alternatives if false-positive rate too high. |
| OQ-INTAKE-002 | Cloudflare Queues vs Kafka for pub/sub? | Queues for v1 (already in stack, no new infra); Kafka if subscriber count >50 or throughput >10k events/sec. |
| OQ-INTAKE-003 | Where do `AI_OTHER` exports land? | Manual review queue (no auto-routing); each becomes an ADR for a new connector if frequency justifies. |
| OQ-INTAKE-004 | C2PA verification — required at gate or advisory? | Advisory at gate (record `c2pa_present` and `c2pa_verified` flags); some downstream consumers may require. |
| OQ-INTAKE-005 | Should the gate emit OTel spans for content not just for routing decisions? | Yes — every gate transition is a span; full lineage from connector to subscriber LearningLoopItem closure is one trace. |
| OQ-INTAKE-006 | Should the AIBehavior slice include hooks as first-class entries? | Recommend yes — hooks are AI behavior; making them schema-tracked surfaces the cascade for the dashboard. |
| OQ-INTAKE-007 | Subscribers' filter language: regex / topic-pattern / LLM judge — which is canonical? | Recommend all three; topic-pattern is the default; LLM judge is opt-in for low-volume high-value subscribers. |

## Sources (research stream)

40+ industry sources covering universal AI gateway patterns, multi-source content ingestion at enterprise scale, agentic input-routing, prompt-injection defense, fan-out architectures, single-gate failure modes, and native-AI routing tradeoffs.

### Universal AI gateway patterns
- [Top 5 LLM Gateways in 2025 — Helicone](https://www.helicone.ai/blog/top-llm-gateways-comparison-2025)
- [AI Gateway Benchmark: Kong, Portkey, LiteLLM](https://konghq.com/blog/engineering/ai-gateway-benchmark-kong-ai-gateway-portkey-litellm)
- [Portkey vs LiteLLM vs OpenRouter 2026 — PkgPulse](https://www.pkgpulse.com/guides/portkey-vs-litellm-vs-openrouter-llm-gateway-2026)
- [Vercel AI Gateway docs](https://vercel.com/docs/ai-gateway)
- [Vercel ZDR on AI Gateway](https://vercel.com/blog/zdr-on-ai-gateway)
- [Portkey AI Gateway GitHub](https://github.com/Portkey-ai/gateway)
- [Anthropic MCP Gateway case study — ZenML](https://www.zenml.io/llmops-database/implementing-mcp-gateway-for-large-scale-llm-integration-infrastructure)
- [MCP Specification 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25)
- [Cloudflare AI Gateway docs](https://developers.cloudflare.com/ai-gateway/)
- [Compromised LiteLLM PyPI — Sonatype](https://www.sonatype.com/blog/compromised-litellm-pypi-package-delivers-multi-stage-credential-stealer)

### Multi-source content ingestion
- [Glean Connectors](https://www.glean.com/connectors)
- [Glean Data Flow architecture](https://docs.glean.com/security/architecture/data-flow)
- [Glean Connector Framework video](https://www.glean.com/resources/product-videos/working-ai-glean-connector-framework-for-enterprise-search)
- [Microsoft 365 Copilot Connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/extensibility/overview-copilot-connector)
- [Microsoft 365 Copilot Architecture](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-architecture)
- [Microsoft Search Connectors Gallery](https://learn.microsoft.com/en-us/microsoftsearch/connectors-gallery)
- [Notion AI Connectors](https://www.notion.com/help/notion-ai-connectors)
- [Cohere Quick-Start Connectors GitHub](https://github.com/cohere-ai/quick-start-connectors)
- [Cohere x Notion case study](https://cohere.com/customer-stories/notion)
- [Glean LLM Search Security analysis — Knostic](https://www.knostic.ai/blog/glean-data-security)

### Agentic input-routing
- [LangGraph Multi-Agent Supervisor docs](https://reference.langchain.com/python/langgraph-supervisor)
- [Choosing the Right Multi-Agent Architecture — LangChain](https://www.blog.langchain.com/choosing-the-right-multi-agent-architecture/)
- [Multi-Agent Orchestration Supervisor vs Swarm — DEV](https://dev.to/focused_dot_io/multi-agent-orchestration-in-langgraph-supervisor-vs-swarm-tradeoffs-and-architecture-1b7e)
- [Hierarchical Agent Teams — LangGraph](https://langchain-ai.github.io/langgraph/tutorials/multi_agent/hierarchical_agent_teams/)
- [Supervisor Agent Architecture — Databricks](https://www.databricks.com/blog/multi-agent-supervisor-architecture-orchestrating-enterprise-ai-scale)
- [Autogen vs LangChain vs CrewAI — instinctools](https://www.instinctools.com/blog/autogen-vs-langchain-vs-crewai/)

### Prompt injection defense
- [OWASP LLM01:2025 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [OWASP Top 10 for LLMs 2025 PDF](https://owasp.org/www-project-top-10-for-large-language-model-applications/assets/PDF/OWASP-Top-10-for-LLMs-v2025.pdf)
- [OWASP Prompt Injection Prevention Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
- [Simon Willison — Design Patterns for Securing LLM Agents](https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/)
- [CaMeL Framework analysis](https://afine.com/llm-security-prompt-injection-camel)
- [DeepMind CaMeL — InfoQ](https://www.infoq.com/news/2025/04/deepmind-camel-promt-injection/)
- [Design Patterns for Securing LLM Agents — arxiv 2506.08837](https://arxiv.org/html/2506.08837v2)
- [Lakera — Indirect Prompt Injection](https://www.lakera.ai/blog/indirect-prompt-injection)
- [Machine Against the RAG — USENIX 2025](https://www.usenix.org/system/files/conference/usenixsecurity25/sec25cycle1-prepub-980-shafran.pdf)
- [Hidden-in-Plain-Text benchmark — arxiv 2601.10923](https://arxiv.org/html/2601.10923v2)

### Practitioner consensus (Reddit / HN / DEV)
- [Show HN: GoModel AI gateway](https://news.ycombinator.com/item?id=47849097)
- [HN — A Data Pipeline Is a Materialized View](https://news.ycombinator.com/item?id=26217911)
- [HN — Unstructured Document Ingestion Pipeline](https://news.ycombinator.com/item?id=46570301)
- [Decoupling the AI Stack — DEV.to](https://dev.to/chnghia/decoupling-the-ai-stack-how-to-architect-a-production-grade-local-llm-system-1a0c)

### Fan-out / event-driven architectures
- [Snowplow Real-Time Event Forwarding](https://snowplow.io/event-forwarding)
- [Snowplow vs Segment](https://snowplow.io/twilio-segment-vs-snowplow-bdp/)
- [AWS Pub-Sub Pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/publish-subscribe.html)
- [AWS Event-Driven CDP with Snowplow + Databricks](https://aws.amazon.com/blogs/apn/event-driven-composable-cdp-architecture-powered-by-snowplow-and-databricks/)
- [Salesforce Data 360 Architecture](https://architect.salesforce.com/fundamentals/data-360-architecture)
- [Salesforce Event-Driven Architecture decision guide](https://architect.salesforce.com/decision-guides/event-driven)
- [Event Bus for Distributed Agents — AuxilioBits](https://www.auxiliobits.com/blog/event-bus-architectures-for-coordinating-distributed-agents/)

### Single-gate risks + anti-patterns
- [API Gateway as SPOF — Akbulut](https://medium.com/@umutt.akbulut/api-gateway-why-it-quietly-becomes-the-single-point-of-failure-in-modern-enterprises-the-paradox-26332585b002)
- [API Gateway Was the Bottleneck — We Deleted It](https://medium.com/lets-code-future/our-api-gateway-was-the-bottleneck-we-deleted-it-a8551e58a0d6)
- [API Gateway Failure Modes — System Overflow](https://www.systemoverflow.com/learn/resilience-patterns/api-gateway/api-gateway-failure-modes-and-resilience-patterns)
- [God Object — Wikipedia](https://en.wikipedia.org/wiki/God_object)
- [Top 10 Microservices Anti-Patterns — Bits and Pieces](https://blog.bitsrc.io/10-microservice-anti-patterns-278bcb7f385d)
- [Multi-Tenant SaaS Architecture — WorkOS](https://workos.com/blog/developers-guide-saas-multi-tenant-architecture)

### Native-AI routing / determinism
- [Non-Determinism of Deterministic LLM Settings — arxiv 2408.04667](https://arxiv.org/html/2408.04667v5)
- [Defeating Nondeterminism in LLM Inference — Thinking Machines](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/)
- [LLMs Are Not Deterministic — DEV.to](https://dev.to/marcosomma/llms-are-not-deterministic-and-making-them-reliable-is-expensive-in-both-the-bad-way-and-the-good-5bo4)
- [RouterArena — arxiv 2510.00202](https://arxiv.org/html/2510.00202v1)
- [NVIDIA LLM Router Blueprint](https://github.com/NVIDIA-AI-Blueprints/llm-router)
- [Patronus AI Agent Routing](https://www.patronus.ai/ai-agent-development/ai-agent-routing)
- [Arize AI Agent Router](https://arize.com/blog/best-practices-for-building-an-ai-agent-router/)
- [Linear Triage docs](https://linear.app/docs/triage)

### Provenance / C2PA
- [C2PA spec](https://c2pa.org/)
- [C2PA in ChatGPT Images — OpenAI](https://help.openai.com/en/articles/8912793-c2pa-in-chatgpt-images)
- [C2PA & IPTC 2025 metadata — Numonic](https://www.numonic.ai/blog/iptc-2025-c2pa-ai-provenance-metadata)
