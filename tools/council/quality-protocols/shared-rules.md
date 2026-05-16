---
id: csps.council.quality-protocols.shared-rules
name: shared-rules
description: "Rules 1-9 extracted from communication-protocol-shared.md — canonical communication protocol for OPUS-2, Sonnet, Governor."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
diataxis_type: reference
session: S038
links:
  - { rel: canonical-source, href: ../communication-protocol-shared.md }
  - { rel: parent, href: ./README.md }
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
scope_level: S1
---

# Shared Rules — Communication Protocol (Rules 1–9)

> **Canonical source:** [tools/council/communication-protocol-shared.md](../communication-protocol-shared.md)
> This file is a contextual-locality excerpt. If rules diverge, communication-protocol-shared.md wins.

// @csps-enforces P-UX-001 (contextual locality — content at point of use)

## RULE 1 — Identity Handshake

- **Sonnet → Opus:** Every message MUST begin: `Opus, this is Sonnet.`
- **Opus → Sonnet:** Every directive MUST begin: `[PROTOCOL: ID | STEP: N of M | MODE: x] Sonnet, this is Opus.`

## RULE 2 — Directive Format (Opus → Sonnet)

`[PROTOCOL: PROTO-ID | STEP: N of M | MODE: sequential/simultaneous]`
`Sonnet, this is Opus. Read [file-link] [section] — [task]; then node tools/verify.mjs exit_code=0 before committing.`

Self-contained. Verification tail mandatory. No "see above."

## RULE 3 — Report Format (Sonnet → Opus)

`Opus, this is Sonnet. [Session/step] done at commit [sha] — [items]. Questions: (1)...`

## RULE 4 — Contextual Locality (P-UX-001)

Content at point of use. No "see §X." Fix in the error. Checklist in the plan.

## RULE 5 — Single Active Thread

ONE active directive. Sonnet reports complete before OPUS-2 sends next.

## RULE 6 — Completion Standard (P-ARCH-031)

DONE = built + wired + called + output verified. Not just committed.

## RULE 7 — Zero-Context Assumption (ZCA) / P-UX-002

Every cross-boundary message: WHO/WHAT/HOW/NOW inline. Receiver starts from zero.

## RULE 8 — Creation Order

Register → Implement → Wire → Verify. Never implement without registering first.

## RULE 9 — Pre-Directive RZF

Draft directive → ZF cycle → amend if findings → present only amended version. Recipient never sees known-gap directives.
