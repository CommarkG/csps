---
id: csps.intake.source-types
name: external-input-source-types
description: Closed taxonomy of external-input source types CSPS accepts. The enum that LearningLoopSource extends. Each source type has a paired extractor + routing rule + risk profile. Closed-but-extensible (new source types require ADR).
version: 1.0
owner: group:finky
lifecycle: experimental
lifecycle_state: pending-review
next_review_at: 2026-08-01
tags:
  - domain:governance
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
diataxis_type: reference
links:
  - { rel: parent, href: ./README.md }
  - { rel: learning-loop, href: ../pillar-0-governance/learning-loop.md }
domain_path: platform
---

# External-Input Source Types

> **Default deny, opt in.** — P-ARCH (architecture principle 4)

## What this file holds

The closed taxonomy of external-input source types. New types require an ADR — the closure prevents source-type sprawl that would erode the "thin universal gate" pattern.

## The taxonomy

### Tier 1 — Human direct inputs

| Source | Extraction confidence | Risk profile | Default fan-out |
|---|---|---|---|
| `HUMAN_CHAT` | high (text is the content) | low (trusted user channel; rate-limit only) | session learning-loop |
| `HUMAN_VOICE` | medium (transcription error) | low | session learning-loop + transcription audit |
| `HUMAN_FORM` | high (structured) | low | domain matched by form schema |
| `HUMAN_NEAR_MISS` | high (human-reported) | low | priority_tier=P0 by default (per OQ-LL-003 sketch) |

### Tier 2 — URL content (untrusted by default)

| Source | Extraction confidence | Risk profile | Default fan-out |
|---|---|---|---|
| `URL_VIDEO_TRANSCRIPT` | low–medium (auto-transcript noise) | medium (prompt injection in transcripts; YouTube comments excluded) | content-domain-classifier output |
| `URL_PDF` | high (text) | high (prompt injection in PDFs is the top OWASP-LLM risk; sanitize before extract) | content-domain-classifier output |
| `URL_POWERPOINT` | medium (slide-text + speaker-notes; image-text via OCR is lower) | medium | content-domain-classifier output |
| `URL_GOOGLE_DOC` | high | medium (Google Docs comments can carry injected instructions) | content-domain-classifier output |
| `URL_GOOGLE_SHEET` | high (structured) | low | content-domain-classifier output |
| `URL_GOOGLE_SLIDES` | medium | medium | content-domain-classifier output |
| `URL_WEBPAGE` | medium (HTML noise) | high (open web; prompt injection extremely common) | content-domain-classifier output |
| `URL_X_THREAD` | medium | high (adversarial content common) | content-domain-classifier output |
| `URL_REDDIT_THREAD` | medium | high | content-domain-classifier output |

### Tier 3 — File uploads (untrusted by default)

| Source | Extraction confidence | Risk profile | Default fan-out |
|---|---|---|---|
| `FILE_PDF` | high | high (same OWASP-LLM risk) | classifier output |
| `FILE_DOCX` | high | medium | classifier output |
| `FILE_PPTX` | medium | medium | classifier output |
| `FILE_XLSX` | high (structured) | low | classifier output |
| `FILE_CSV` | high (structured) | low | classifier output |
| `FILE_JSON` | high (structured) | medium (depends on shape) | classifier output |
| `FILE_IMAGE` | medium (OCR-dependent) | medium (image-based prompt injection is a known vector) | classifier output |
| `FILE_AUDIO` | medium (transcription) | low | classifier output + transcription audit |
| `FILE_TXT` | high | high (plain prompt injection) | classifier output |
| `FILE_MARKDOWN` | high | high | classifier output |

### Tier 4 — AI app exports

| Source | Extraction confidence | Risk profile | Default fan-out |
|---|---|---|---|
| `AI_CLAUDE_CODE_TRANSCRIPT` | high | medium (the AI's prior outputs may contain injections it picked up) | session learning-loop |
| `AI_LOVABLE_SESSION` | medium (structure varies by export format) | medium | classifier output |
| `AI_CHATGPT_EXPORT` | high (well-defined format) | medium | classifier output |
| `AI_CURSOR_SESSION` | high | medium | classifier output |
| `AI_ANTIGRAVITY_EXPORT` | medium | medium | classifier output |
| `AI_OTHER` | low (unknown structure) | high (unknown format = unknown risks) | manual review queue |

### Tier 5 — Internal CSPS inputs (already covered by Learning Loop)

| Source | Notes |
|---|---|
| `CHAT` | session within CSPS itself (Learning Loop existing source) |
| `AUDIT` | audit-runner check failure (existing) |
| `ERROR_LOG` | application error log (existing) |
| `FEEDBACK` | user-submitted feedback (existing) |
| `NEAR_MISS` | human-reported within CSPS (existing) |
| `AI_EXTRACTION` | AI-extracted insight from a session (existing) |

These are already in `LearningLoopSource` enum and get routed directly into the Learning Loop without going through the External-Input gate.

## `content_modality` dimension (added S003 §3.5.b — R21 stream 4)

Source types describe **where** the content came from. Content modality describes **what kind of content** it is. The two intersect: a `URL_PDF` may carry text + diagrams + tables; a `FILE_AUDIO` carries speech + non-speech sound; an `AI_CLAUDE_CODE_TRANSCRIPT` carries dialog + tool-calls + emitted-files.

Add `content_modality:` as a frontmatter dimension on every extraction. Closed-but-extensible enum (~46 subtypes) following the W3C Media Source Extensions taxonomy + Apache Tika MIME-type heuristics.

### Text modalities (10)

`prose-narrative` / `prose-instructional` / `prose-conversational` / `code-source` / `code-config` / `markup-html` / `markup-markdown` / `markup-yaml` / `structured-table` / `structured-list`

### Visual modalities (8)

`image-photo` / `image-diagram` / `image-chart` / `image-screenshot` / `image-handwritten` / `image-text-scan` / `video-screencast` / `video-talking-head`

### Audio modalities (5)

`audio-speech-monolog` / `audio-speech-dialog` / `audio-music` / `audio-ambient` / `audio-mixed`

### Structured-data modalities (8)

`data-tabular-csv` / `data-tabular-xlsx` / `data-relational-export` / `data-graph-json` / `data-key-value-config` / `data-time-series` / `data-event-log` / `data-schema-definition`

### Code modalities (6)

`code-typescript` / `code-python` / `code-sql` / `code-shell` / `code-infrastructure` / `code-test`

### Composite modalities (5)

`composite-pdf-text-and-images` / `composite-doc-text-and-tables` / `composite-presentation-slides-and-notes` / `composite-notebook-code-and-prose` / `composite-transcript-with-tool-calls`

### Cross-modal modalities (4)

`cross-modal-handwritten-mathematics` / `cross-modal-meme-image-with-text` / `cross-modal-infographic` / `cross-modal-code-with-explanation`

### Why `content_modality` is orthogonal to `source_type`

A `FILE_PDF` may have `content_modality: composite-pdf-text-and-images` (typical) OR `content_modality: image-text-scan` (OCR-required scan). The extractor's pipeline differs materially. Knowing the modality independent of the source-type unlocks correct extractor selection.

### Adding a new modality

Same 7-step workflow as adding a new source type (ADR + extractor + routing-rules + sanitizer + validator + audit + PR). The modality enum is closed-but-extensible.

### Audit `content-modality-required-on-extraction` (PR-blocking, error)

Every extraction note must declare `content_modality:`. Missing field is a hard fail; "unknown" is permitted only when paired with `triage_reason: modality-classification-failed` (which routes to manual review queue).

## Risk profile tiers

- **low risk** — content is structured + originates from a trusted channel (HUMAN_FORM, URL_GOOGLE_SHEET, FILE_XLSX, FILE_CSV)
- **medium risk** — semi-structured but external (URL_GOOGLE_DOC, AI_CHATGPT_EXPORT)
- **high risk** — unstructured + open-web origin OR known injection vector (URL_PDF, URL_WEBPAGE, FILE_TXT, FILE_MARKDOWN, X/Reddit threads)

High-risk sources MUST pass through the prompt-injection scan layer before any LLM ever sees their content. The scan is an enforcer of P-ARCH-025 (third-party-trust default-deny).

## Fan-out rules

- **session learning-loop** — the input is part of an in-progress session; insights flow back into that session's LearningLoopItem queue
- **classifier output** — a content classifier (Mastra tool) maps the input to N domain owners by topic similarity; one LearningLoopItem per domain owner
- **manual review queue** — high-uncertainty inputs (AI_OTHER) get held until a human triages

## Adding a new source type

1. Open ADR proposing the new type with: extraction confidence estimate, risk profile, default fan-out, prior-art reference.
2. Add the enum value to `LearningLoopSource` (or `ExternalInputSource` if we keep them separate).
3. Build the extractor in `tools/extractors/<source-type>/`.
4. Update `routing-rules.md` with the new fan-out logic.
5. Build/update the prompt-injection sanitizer if risk profile is medium or high.
6. Update validate-frontmatter.mjs if the new type implies new frontmatter shape.
7. PR + audit + merge.

This 7-step workflow is itself an instance of the platform's "place + process" cardinal directive applied to source types.
