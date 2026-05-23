---
id: csps.adr.0020-handoff-includes-verification-command
title: ADR-0020 — Handoffs include a verification command as first executable step
status: accepted
date: 2026-05-02
deciders: group:finky
tags: [domain:governance, type:explanation, audience:developer, audience:ai-agent, maturity:stable]
lifecycle: production
lifecycle_state: active
diataxis_type: explanation
links:
  - { rel: source-leaf, href: ../plan/_handoff/VAULT/validation-pass-S002.md }
  - { rel: source-protocols, href: ../plan/_handoff/VAULT/protocols.md }
context_question: "Before relying on this decision: has the constraint that drove it changed? If platform needs have shifted, this ADR may need reassessment."
---

# ADR-0020 — Verification command in every handoff

## Context and problem statement

S002's fresh-chat protocol §11 requires the new session verify "state matches §4 of the handoff". Currently this is a manual mental check — the new session reads the state snapshot, walks the file tree, and compares. Mistakes are easy + invisible.

## Considered options

| Option | Pro | Con |
|---|---|---|
| Manual mental verification | Simple | Easy to skip; invisible mistakes |
| **Verification command** as first executable step in §1 | Mechanical; outputs expected fingerprint to compare | Requires script discipline |
| Full DB schema diff | Most rigorous | Premature (no DB yet) |

## Decision outcome

**Chosen:** every handoff includes a verification command in §1 priority-zero step 1:

```bash
ls docs/plan/pillar-*/README.md && \
  grep -c "^  - id: P-META-" packages/principles/principles.yaml && \
  ls docs/plan/_intake/contexts/ && \
  ls docs/plan/_handoff/VAULT/blockers-S<NNN>.md
```

Output is the verifiable fingerprint. The new session runs this FIRST, compares output to handoff §4, surfaces any mismatch BEFORE proceeding.

**Reasoning:** S002 §3.2 surfaced this enhancement during continuity-perspective validation. CSP carry-forward (treasure #2 EXT-20260502-003) reinforces — opening receipt should include "validators_re_run_state diff vs closing manifest".

## Consequences

- Every HANDOFF-S<NNN>-to-S<NNN+1>.md includes a §1.1 verification command.
- Mismatch handling: surface to user before any substantive work.
- Forward-compatible: post-runtime, the command extends to DB schema introspection.

## Enforcement

- `protocols.md` §11 step 11 (state verification)
- HANDOFF template includes §1.1 verification command

## Sources

- `_handoff/VAULT/validation-pass-S002.md` (S002 §3.2 origin)
- CSP carry-forward: SESSION_LIFECYCLE_PROTOCOL "validators_re_run_state" pattern
