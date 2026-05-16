---
id: csps.integrations.speech.index
name: speech-module-index
description: "Mini-tree intro for libs/integrations/speech/. STT quality protocols: buffer, dictionary, detector, review. All files @csps-enforces P-META-022."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S038
impl_status: swift-implemented
mini_tree_root: true
sub_files:
  - ./types.ts
  - ./buffer.ts
  - ./dictionary.ts
  - ./detector.ts
  - ./review.ts
links:
  - { rel: parent, href: ../README.md }
tags:
  - domain:ai
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
scope_level: S1
---

# Speech Integration — STT Quality Protocols

Platform module for speech-to-text quality management. All files enforce P-META-022 — user corrections crystallize intent and teach the system.

## Exports

- **[SpeechBuffer](./buffer.ts)** — captures STT segments with confidence scores; `addSegment()`, `getBuffered()`, `commit()`, `clear()`
- **[PersonalDictionary](./dictionary.ts)** — learns and applies user corrections; `learn()`, `correct()`, `exportRules()`
- **[SuspiciousTermDetector](./detector.ts)** — flags low-confidence segments and confusion patterns; `scan(segments)`
- **[ReviewSession](./review.ts)** — manages pending review items; `addFlag()`, `getPendingReview()`, `confirm()`, `getStats()`
- **[Types](./types.ts)** — SpeechSegment, CorrectionRule, SuspiciousFlag, ReviewItem, ReviewStats

## Config

`SPEECH_BUFFER_CONFIDENCE_THRESHOLD` (default: 0.7) — segments below this confidence are flagged for review.
