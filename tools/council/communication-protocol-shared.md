---
id: csps.council.communication-protocol-shared
name: communication-protocol-shared
description: "Canonical communication rules for ALL parties — OPUS-2, Sonnet, and Governor. Single source. Both sides read this."
version: 1.0.0
owner: group:finky
lifecycle: production
lifecycle_state: active
---

# Shared Communication Protocol
## One file. Both sides read it. No drift.

---

## RULE 1 — Identity Handshake (MANDATORY, no exceptions)

**Sonnet → Opus:** Every message MUST begin: `Opus, this is Sonnet.`
**Opus → Sonnet:** Every directive MUST begin: `[PROTOCOL: ID | STEP: N of M | MODE: x] Sonnet, this is Opus.`

Missing handshake = message is malformed. Recipient should flag before acting.

---

## RULE 2 — Directive Format (Opus → Sonnet)

```
[PROTOCOL: PROTO-ID | STEP: N of M | MODE: sequential/simultaneous]
Sonnet, this is Opus. Read `[file-link]` [section] — [task]; [task]; [task]; then [verification tail] before committing.
```

- Self-contained: no "see above" or "see Turn N"
- Verification tail: always ends with `node tools/verify.mjs exit_code=0 before committing`
- One sentence per directive (may be long)

---

## RULE 3 — Report Format (Sonnet → Opus)

```
Opus, this is Sonnet. [Session/step] done at commit [sha] — [what was done, one line per item]. 
Specific questions: (1)... (2)...
```

- Always includes commit SHA
- Questions numbered
- No paraphrasing of what was asked — report what was done

---

## RULE 4 — Contextual Locality (P-UX-001)

Content is always at the point of use. Never say "see §X" or "see Turn N". Present the complete thing where it is needed:
- Paste target appears UNDER the step it belongs to
- Fix instruction IN the error message
- Checklist IN the plan
- Rule rationale INLINE with the rule

---

## RULE 5 — Single Active Thread

ONE active directive at a time. Sonnet reports step-complete before OPUS-2 sends next directive. No parallel pipelines.

---

## RULE 6 — Completion Standard (P-ARCH-031)

DONE = built + wired + called + output verified. Never declare done on commit alone. Wiring-completeness validator must pass.

---

## WHERE THIS IS READ

- **Sonnet:** session-open.sh injects this file's rules at every session start
- **OPUS-2:** every turn starts by referencing this file's format (turn header)
- **Enforcement:** validate-communication-protocol.mjs checks Sonnet reports for Rule 1

*Canonical source. Do not duplicate. Reference this file only.*
