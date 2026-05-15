---
id: csps.intake.inbox
name: external-input-intake-inbox
description: Drop-zone for external-input files awaiting structured intake. Pre-runtime (S002–week 6), the AI runs the manual protocol at ../manual-protocol.md on every dropped file — acknowledge → save raw → scan → extract → fan-out to contexts → log to ledger → surface in closing summary. Post-runtime (week 6+), inbox-watcher.ts auto-runs on PostInput hook.
version: 1.0
owner: group:finky
lifecycle: experimental
lifecycle_state: active
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:end-user
  - maturity:draft
diataxis_type: how-to
links:
  - { rel: parent, href: ../README.md }
domain_path: platform
scope_level: S1
---

# Intake Inbox — drop zone

> **Place + process: every input has a place to be and a predefined process to follow.**

## How to use

Drop a file here when you want CSPS to ingest it through the External-Input Intake plane.

### Pre-runtime (S002–week 6) — manual mechanical protocol

The AI runs the manual protocol at [`../manual-protocol.md`](../manual-protocol.md) on every dropped file. Specifically:

1. **Acknowledged** explicitly in chat with the assigned EXT-ID
2. **Saved** to `processed/<EXT-ID>-<slug>/` with raw + metadata + provenance
3. **Scanned** for prompt-injection patterns (pattern-based pre-runtime; classifier-based week 5+)
4. **Extracted + classified** into contexts (`../contexts/<context>/`) — one note per relevant context (fan-out)
5. **Logged** to [`../extractions-ledger.md`](../extractions-ledger.md) (append-only ledger)
6. **Surfaced** in the chat closing summary with EXT-ID + contexts routed + recommended downstream action

This protocol is mandatory. AGENTS.md hard NO bans bypass.

### Post-runtime (week 6+) — automated

1. Detected by `tools/extractors/inbox-watcher.ts` (cron + filesystem watcher).
2. Classified by source type per `../source-types.md`.
3. Scanned for prompt-injection content (default-deny on high-risk content).
4. Extracted via the matching connector in `tools/connectors/<source-type>/`.
5. Fanned out via Cloudflare Queues to N subscribers per the routing rules.
6. Moved to a `processed/` subdirectory with the result payload alongside.

A migration script (`tools/intake/migrate-manual-ledger.ts`) ports the markdown ledger + per-context notes into `public.external_input` + `public.learning_loop_item` rows preserving every EXT-ID.

## State (S002)

`lifecycle_state: pending-protocol` — **was** the state. Updated to **`active`** as of S002: the manual protocol at [`../manual-protocol.md`](../manual-protocol.md) is the process. The place + process pair now exists per P-META-004. The `stale-pending-protocol` audit no longer fires for this entry.

## What goes here

Any of the source types in `../source-types.md`:

- PDFs, PowerPoint, Google Docs/Sheets/Slides exports (`.pdf`, `.pptx`, `.docx`, `.xlsx`, `.csv`)
- Text/markdown files (`.txt`, `.md`)
- AI app exports (any format the supported source types cover)
- Images (`.png`, `.jpg`, `.heic`)
- Audio (`.wav`, `.m4a`, `.mp3`)

URL content (`URL_*` source types) does NOT go here as files — those route through a different intake (paste a URL via the API or admin UI).

## Risk note

**Anything dropped here that hits an LLM passes through the prompt-injection scan first.** No content from this inbox reaches a model without being scanned and (for medium/high-risk profiles) sanitized. This is the load-bearing security guarantee of the gate.

## What does NOT go here

- Production secrets or PII without explicit tenant binding (rejected by gate; logged)
- Files >100MB without chunking config (rejected; need streaming-extraction config)
- Anything you wouldn't want recorded in `public.external_input` (which is append-only)

## Cross-references

- [../README.md](../README.md) — the intake architecture overview
- [../source-types.md](../source-types.md) — the closed taxonomy
- [../../pillar-0-governance/learning-loop.md](../../pillar-0-governance/learning-loop.md) — what happens after extraction
