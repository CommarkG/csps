---
id: csps.intake.root
name: external-input-intake-root
description: The architectural "place" for external inputs into CSPS — humans (chat, voice, structured forms), URL content (videos, PDFs, PPT, Google Docs/Sheets/Slides, web pages), files, other AI app exports (Claude Code transcripts, Lovable sessions, ChatGPT, Cursor). Defines the file-system intake folder, the ExternalInput Foundation slice, the universal-gate-with-specialized-extractors pattern, and the routing pipeline that lifts captured input into the LearningLoopItem ledger. Companion to P-META-005 Learning Loop — Learning Loop describes the closed-loop pipeline; this directory describes the input plane that feeds it.
version: 1.0
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-review
next_review_at: 2026-08-01
tags:
  - domain:governance
  - type:doc
  - audience:developer
  - audience:ai-agent
  - maturity:draft
crosscutting:
  - reliability
  - observability
  - security
  - ai-native
diataxis_type: explanation
links:
  - { rel: parent, href: ../README.md }
  - { rel: learning-loop, href: ../pillar-0-governance/learning-loop.md }
  - { rel: stewardship, href: ../pillar-0-governance/stewardship-protocol.md }
  - { rel: source-leaf-pending, href: ./source-types.md }
  - { rel: source-leaf-pending, href: ./routing-rules.md }
  - { rel: source-leaf-pending, href: ./external-inputs-plan.md }
domain_path: platform
scope_level: S1
---

# External-Input Intake — the place

> **Every INPUT either has a place to be and a predefined process to follow OR the system alerts itself to solve one.** — User cardinal directive

## What this directory holds

The architectural "place" for capturing external inputs into CSPS — every kind of content that originates *outside* the platform's running code:

- **Human inputs** — chat messages, voice transcripts, structured forms, casual mentions, near-misses
- **URL content** — videos (YouTube/Vimeo/Loom transcripts), PDFs, PowerPoint, Google Docs/Sheets/Slides, web pages, Twitter/X threads, Reddit threads
- **File uploads** — direct user uploads of any of the above plus images, audio, structured data files (CSV, JSON, XML)
- **Other AI app exports** — Claude Code session transcripts, Lovable.dev project exports, ChatGPT chats, Cursor sessions, Antigravity exports, etc.

This is the **input plane** companion to P-META-005 Learning Loop. The Learning Loop describes the closed-loop pipeline (`observed → triaged → routed → fixing → validated → closed`). This directory describes the **front door** — how inputs arrive, get validated, get sanitized for prompt-injection risks, and get routed into the loop.

## Status (S002)

`lifecycle_state: pending-review` — this is a working draft that surfaces a question the user explicitly raised. The detailed plan + industry research live in [external-inputs-plan.md](./external-inputs-plan.md) (the downloadable analysis). Once the user reviews and approves the architecture (single-gate vs distributed vs hybrid), this README transitions to `lifecycle_state: active` and the schema slice + skill + admin page are scaffolded.

## Directory structure (planned)

```
docs/plan/_intake/
├── README.md                         ← this file (architectural intent)
├── external-inputs-plan.md           ← downloadable industry-research-backed plan
├── source-types.md                   ← canonical taxonomy of input source types (closed enum)
├── routing-rules.md                  ← per-source-type routing rules + extractors
└── inbox/                            ← drop zone for files awaiting intake processing
    └── README.md                     ← "drop a file here; the inbox-worker picks it up"
```

Runtime artifacts (planned, not yet scaffolded):

- `libs/policies/slices/public/external-input.zmodel` — Foundation slice
- `packages/skills/external-input-route/SKILL.md` — universal classifier + extractor + router
- `tools/extractors/<source-type>/` — per-source-type extraction workers (PDF parser, video transcript fetcher, Google Docs reader, etc.)
- `apps/admin/app/(admin)/intake/page.tsx` — admin dashboard for the intake queue
- `.claude/hooks/post-input-route.sh` — PostInput hook that auto-routes new inbox items

## Architecture sketch (hybrid: thin universal gate + specialized extractors)

```
                    ┌────────────────────────────────────────┐
                    │   EXTERNAL INPUT (any source type)     │
                    └────────────────────────┬───────────────┘
                                             ▼
                    ┌─────────────────────────────────────────┐
                    │  UNIVERSAL GATE (thin)                  │
                    │  - source classification                │
                    │  - prompt-injection scan (default-deny) │
                    │  - tenant + user binding                │
                    │  - INSERT public.external_input         │
                    │  - emit OTel gen_ai.input.received      │
                    └────────────────────────┬────────────────┘
                                             ▼
            ┌────────────────┬────────────────┼────────────────┬───────────────┐
            ▼                ▼                ▼                ▼               ▼
       ┌─────────┐      ┌─────────┐      ┌──────────┐    ┌──────────┐    ┌─────────┐
       │ HUMAN   │      │ URL     │      │ FILE     │    │ AI-EXPORT│    │ OTHER   │
       │extract  │      │extract  │      │extract   │    │extract   │    │extract  │
       └────┬────┘      └────┬────┘      └────┬─────┘    └────┬─────┘    └────┬────┘
            └────────────────┴────────────────┼────────────────┴───────────────┘
                                              ▼
                    ┌─────────────────────────────────────────┐
                    │  FAN-OUT ROUTER                         │
                    │  - identify all relevant domain owners  │
                    │  - INSERT N × public.learning_loop_item │
                    │  - parent_input_id links back to source │
                    └────────────────────────┬────────────────┘
                                             ▼
                    ┌─────────────────────────────────────────┐
                    │  LEARNING LOOP (P-META-005)             │
                    │  observed → triaged → routed → fixing → │
                    │  validated → closed                     │
                    └─────────────────────────────────────────┘
```

**Key decisions:**

1. **Universal gate is THIN.** It does only: classify source, scan for prompt injection, bind tenant/user, persist raw input, emit telemetry. It does NOT extract content — that's the extractor layer's job.
2. **Extractors are SPECIALIZED.** Each source type has its own extractor that knows how to parse that source (PDF parser, video transcript fetcher, etc.). They run in the sandbox runner (default-deny network + isolated bindings) per P-ARCH-025.
3. **Fan-out is EXPLICIT.** Extracted insights spawn one LearningLoopItem per relevant domain owner (not just one). Avoids the "AI extracted into context, only AI saw it" failure mode.
4. **Provenance is END-TO-END.** Every LearningLoopItem links back to its `parent_input_id`; every span carries OTel `gen_ai.input.*` attributes for full traceability.

## Why hybrid (not pure single-gate or pure distributed)

The detailed PCR + research-backed analysis lives in [external-inputs-plan.md](./external-inputs-plan.md). Short version:

- **Pure single-gate** is a bottleneck and schema-explosion risk; the gate becomes the integration platform itself, recreating the "central queue" graveyard pattern.
- **Pure distributed** fragments audit, security, provenance — every source becomes a security review of its own.
- **Hybrid** keeps a thin policy/audit/provenance plane central while letting source-specific extraction logic live in specialized workers. Cited in industry as the LiteLLM gateway pattern + Glean's connector model + Snowplow's collector/enricher split.

## Cross-references

- [pillar-0/learning-loop.md](../pillar-0-governance/learning-loop.md) — the closed-loop pipeline this intake feeds
- [pillar-0/stewardship-protocol.md](../pillar-0-governance/stewardship-protocol.md) — the lifecycle every captured input declares
- [external-inputs-plan.md](./external-inputs-plan.md) — the detailed plan + industry research
- [source-types.md](./source-types.md) — the closed taxonomy
- [routing-rules.md](./routing-rules.md) — how each source type gets routed

## Open questions (tracked)

These will be added to `docs/plan/_handoff/VAULT/open-questions-ledger.md` once the user reviews:

- Should the gate be a Mastra agent, a Cloudflare Worker, or a Postgres trigger? (Recommend: Cloudflare Worker; Mastra is overkill for thin-gate work)
- Where does file-upload UI live? Per-app, or in `apps/admin`? (Recommend: per-tenant under each app's customer surface; admin gets the cross-app intake dashboard)
- Confidence thresholds for extracted content — same as Learning Loop's 0.75/0.90 bands or different per source type? (Recommend: per-source bands; PDF text-extraction is high-confidence; YouTube auto-transcript is low-confidence)
- Tenant isolation in the gate — RLS on `external_input` keyed by `tenant_id`?
- Retention policy per source type per tier?
