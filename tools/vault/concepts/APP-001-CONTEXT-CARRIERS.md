---
id: vault.concepts.APP-001-CONTEXT-CARRIERS
name: APP-001-CONTEXT-CARRIERS
description: "Key APP-001 design decisions that must be carried as context into every session touching APP-001"
type: vault_concept
protection_level: active
owner: group:finky
lifecycle: experimental
lifecycle_state: active
version: "0.1"
session: S050
core_spines: [ARCH, AI]
core_spine: ARCH
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - vault.processing.PRO-20260521-DOC-003-ANALYSIS
  - vault.concepts.OPTIMAL-BUILD-ORDER-S050
context_question: "What are the three APP-001 design decisions that every session touching this app must know before making any choices?"
context_quote: "Most tools require you to maintain them. We built a tool that maintains itself."
inherits_from: "Platform Genome §4 Tab Transition Protocol + §5 Platform Architecture"
---

# APP-001 Context Carriers — Must Know Before Building

Three insights that must be carried into every session that touches APP-001.
If a session doesn't know these, it will build the wrong thing.

---

## Context Carrier 1: The Real First-Value Moment Is Day 7, Not Day 1

The push notification "N captured while you were in your meeting" is the designed first-value moment. But:
- A single capture on Day 1 has nothing to sort. The notification fires with 1 item and conveys nothing new.
- The real moment Alex trusts the app is when the WEEKLY DIGEST surfaces something Alex had forgotten — a pattern or connection Alex didn't see.
- Alex's real first-value moment requires 3-5 captures AND a few days of the system observing patterns.

**Design implication:** Don't measure Day 1 notification click-through. Measure Day 7 retention and weekly digest engagement. The activation_exit for APP-001 should be Day 7+ retention, not notification interactions.

---

## Context Carrier 2: APP-001 Market Position

> "The bridge between raw thinking and organized action."

From DOC-003's anti-complementary framing (S050):
- Rigid task trackers = require constant manual curation → users abandon them under stress
- Open journaling = no structure layer → ideas don't become actions
- APP-001 bridges this gap: voice dump → AI sorting → structured inbox → acts

In product copy, this means:
- NOT: "a smarter to-do list"
- NOT: "an AI assistant"
- YES: "think out loud. We handle the structure."

---

## Context Carrier 3: V1 Homepage Is The Sponge, Not The Inbox

The first version of APP-001's homepage is V1 (The Sponge): single large mic button, minimal interface, Private/Business toggle visible.

The inbox view (sorted captures by category) is what appears AFTER the first capture is processed — not the default landing.

The A/B testing framework will test V2 (Auditor) and V3 (Ghostwriter) etc. against V1 to find which homepage drives better Day 7 retention. But V1 ships first.

---

## Questions This File Answers

A new Opus reading this file should be able to answer:
1. What is the correct metric for APP-001 activation success? (Day 7 retention)
2. What is APP-001's one-sentence market position? ("bridge between raw thinking and organized action")
3. What does V1's homepage show? (single mic button — V2-V5 are A/B test candidates)

If any of these answers are wrong, this file needs updating.

---

*APP-001 Context Carriers | Vault concept | S050 | Must-know before building*
