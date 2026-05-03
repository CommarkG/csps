---
id: csps.intake.unknown-path-protocol
name: external-input-unknown-path-protocol
description: What to do when an extraction's content fits NO existing leaf in the schema (example: a file titled "NLP values extraction" arrives, but there's no "NLP values extraction" leaf yet). The "discovery channel" pattern — content lands in raw-uncategorized/ with a SCHEMA-GAP marker that auto-creates a LearningLoopItem proposing schema extension. K items within 90 days → auto-ADR for new leaf. Forcing-fit (cramming unclassifiable content into nearest-existing-bucket) is the anti-pattern this protocol resists.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
tags:
  - domain:governance
  - type:how-to
  - audience:developer
  - audience:ai-agent
  - maturity:stable
crosscutting:
  - reliability
  - observability
diataxis_type: how-to
links:
  - { rel: parent, href: ./README.md }
  - { rel: protocol, href: ./manual-protocol.md }
  - { rel: contexts, href: ./contexts/README.md }
  - { rel: learning-loop, href: ../pillar-0-governance/learning-loop.md }
---

# Unknown-Path Protocol — Discovery Channel for content that fits no leaf

> **The schema is closed for now, but extensible by predefined process. Content with no path triggers the path-creation protocol — never the silent-discard protocol.**

## What this file holds

The exact mechanical steps when an extraction's content fits NONE of the 45 existing leaf destinations in `contexts/`. Example trigger: a treasure document titled "NLP values extraction" arrives — the schema has leaves for billing, personas, audits, but no "NLP" or "values extraction" leaf. What happens?

This is the **discovery channel** pattern (industry-standard term). The user-cardinal-directive applies recursively: *"Every INPUT either has a place to be and a predefined process to follow OR the system alerts itself to solve one."* Here, the system alerts itself.

## Triggers (when this protocol fires)

The AI invokes the unknown-path protocol during `manual-protocol.md` Step 5 when:

1. **No leaf in `contexts/<pillar>/<leaf>/`** has a name + scope that matches the content. The 45 destinations have been considered, and none are the right home.
2. **Cross-cutting doesn't apply** — the content isn't ripping across multiple existing leaves; it's about a topic the schema doesn't cover.
3. **Confidence on raw-uncategorized routing < 0.8** — the AI is sure this is genuinely new ground, not just hard-to-classify content.

(If conditions 1+2 hold but condition 3 fails — i.e., the AI THINKS it might fit but isn't sure — route to `raw-uncategorized/` per the existing protocol. Discovery-channel is for confident schema gaps.)

## Anti-patterns this protocol resists

1. **Forcing-fit** — cramming "NLP values extraction" into the nearest-existing leaf (e.g., `ai-systems/persona-composition/` because both have "AI") because the AI doesn't want to admit "no path." Mature systems (Glean, Salesforce Einstein, Slack auto-channel-suggest) explicitly resist this. Per the research: when systems force unclassifiable content into nearest-fit, the bucket loses meaning AND the schema-gap stays invisible.
2. **Silent-discard** — content with no clear path getting auto-discarded as "low confidence." This is the dominant KM failure mode. Caught by the manual-protocol's "default-to-raw-uncategorized, never-default-to-discard" rule, AND by this discovery-channel which gives unclassifiable content a path back to the schema-extension workflow.
3. **Permanent raw-uncategorized parking** — items sit in `raw-uncategorized/` forever because there's no mechanism to promote them. This protocol is the promotion mechanism.

## The 6-step discovery channel protocol

### Step 1 — Tag the extraction with a SCHEMA-GAP marker

Write the extraction note to `_intake/contexts/raw-uncategorized/EXT-<ID>[-<X>]-<slug>.md` with frontmatter:

```yaml
---
extraction_id: EXT-20260502-002-A
parent_input_id: EXT-20260502-002
source_type: FILE_PDF
confidence: 0.85
confidence_band: human-review            # near auto-accept; classification-confidence is the unknown
lifecycle_state: pending-review
pipeline_state: triaged
schema_gap:                              # NEW field for unknown-path extractions
  detected: true
  proposed_leaf_name: "nlp-values-extraction"
  proposed_pillar: "ai-systems"          # AI's best-guess pillar — user reviews
  rationale: "Content discusses NLP-based value extraction from text; no current leaf covers this topic. Pillar-5 ai-systems is closest because it's about AI; pillar-2 data-schema is alternative because it's about data extraction."
  k_count_in_window: 1                   # this is the first occurrence within 90d
state_transitioned_at: 2026-05-02T11:30:00Z
next_review_at: 2026-05-09             # 7d for unknown-path; tighter than standard 14d
recurrence_check_at: 2026-08-01
routed_to: |
  - docs/plan/_intake/contexts/raw-uncategorized/EXT-20260502-002-A-nlp-values-extraction.md
  - learning-loop://schema-gap-discovery   # virtual route to the schema-gap discovery channel
risk: medium
trust_tier: tenant_authored
tags:
  - domain:governance      # schema-gaps are governance-class
  - type:reference
  - audience:developer
  - audience:ai-agent
  - maturity:draft
  - schema-gap             # NEW closed-enum tag value
---
```

The `schema-gap` tag is a **new value** added to the `tags:` closed enum (per this protocol's ADR; tracked as a tags-extension item).

The `schema_gap` block is a **new frontmatter field group** for unknown-path extractions. Validated by `validate-frontmatter.mjs` (when built); pre-runtime, the AI's discipline.

### Step 2 — Auto-create a LearningLoopItem in `governance/learning-loop/`

Spawn a sibling extraction note at `_intake/contexts/governance/learning-loop/EXT-<ID>-<X>-schema-gap-<topic>.md`:

```yaml
---
extraction_id: EXT-20260502-002-A-schema-gap
parent_input_id: EXT-20260502-002-A      # links to the originating raw-uncategorized note
source_type: AI_EXTRACTION                # AI extracted the schema-gap signal
confidence: 0.90
confidence_band: auto-accept
lifecycle_state: active                   # this LL item is load-bearing
pipeline_state: routed                    # routed to schema-extension workflow
priority_tier: P2
state_transitioned_at: 2026-05-02T11:31:00Z
next_review_at: 2026-08-01
recurrence_check_at: 2026-08-01
routed_to: docs/adr/draft-NNNN-add-leaf-<topic>.md   # proposed ADR
risk: low                                 # the LL item itself is low-risk; the underlying content is medium
trust_tier: tenant_authored
tags:
  - domain:governance
  - type:explanation
  - audience:developer
  - schema-gap
  - schema-gap-discovery
---

# Schema-gap detected: <topic>

**Schema gap:** content arrived (`EXT-20260502-002-A`) that fits no existing leaf. Proposed leaf: `<pillar>/<leaf-name>`. K-count within 90d: 1.

**Action:** route to schema-extension workflow.

**Threshold:** if K reaches 2 within 90d, auto-create ADR draft proposing the new leaf. If K reaches 3, escalate to user-required review.

**Verbatim source:** [link to originating extraction]
```

This LearningLoopItem is the **schema-gap-discovery** signal in the loop. It uses the existing P-META-005 K=2 → ADR mechanism to convert "the same gap appears repeatedly" into "add this to the schema permanently."

### Step 3 — Increment K-count in schema-gap registry

Maintain an append-only registry at `_intake/contexts/governance/learning-loop/_schema-gap-registry.md`:

| proposed_leaf_name | proposed_pillar | first_seen | k_count_90d | k_count_lifetime | latest_ext_id | state |
|---|---|---|---|---|---|---|
| nlp-values-extraction | ai-systems | 2026-05-02 | 1 | 1 | EXT-20260502-002-A | observed |

When a future extraction triggers this protocol with a similar `proposed_leaf_name`, increment the row's `k_count_90d` and update `latest_ext_id`. The registry is the K-count source-of-truth.

Pre-runtime: maintained as markdown table.
Post-runtime: a database table `public.schema_gap_proposal` with the same shape.

### Step 4 — Auto-trigger workflow on K thresholds

| K count (within 90d) | Auto action |
|---|---|
| K = 1 | Single occurrence; logged as `observed`; no escalation. Survey at 90d recurrence-check; if no recurrence, transition to `closed`. |
| **K = 2** | **AUTO-CREATE ADR DRAFT** at `docs/adr/draft-NNNN-add-leaf-<topic>.md` with status `proposed`. Notify user in closing summary. (Toyota/Google SRE convention; matches P-META-005 K=2 threshold.) |
| K = 3 | Escalate severity from `warn` to `error`; user MUST address before ADR deadline (e.g., 14d to accept/reject the proposed leaf). |
| K ≥ 4 | If user has not acted, the schema-gap auto-promotes the proposed leaf to `lifecycle_state: pending-protocol` in the schema; the next session's fresh-chat MUST address. |

These thresholds are tunable; live in `principles.yaml#P-META-005.config.schema_gap_thresholds` (planned addition).

### Step 5 — Surface in closing summary (per F4 of `proactive-completion.md`)

Every chat-close lists active schema-gaps:

> **Schema gaps detected this session:**
> - `nlp-values-extraction` (proposed pillar: `ai-systems`); K=1/90d; no action required yet
> - (other gaps if multiple)

If K=2 reached: closing summary explicitly proposes the ADR draft.

### Step 6 — Migration to permanent schema (when user approves)

When the user approves a new leaf:

1. Create the actual leaf doc at `docs/plan/pillar-N-<name>/<new-leaf>.md` (per `adr-process.md` template + the proposed ADR).
2. Update the relevant pillar README to add the new leaf row.
3. Add the new leaf folder to `_intake/contexts/<pillar>/<new-leaf>/`.
4. Re-route the originating EXT-IDs from `raw-uncategorized/` to the new leaf folder (move + update `routed_to`).
5. Update the schema-gap registry: state → `promoted`; closes the loop.
6. The new leaf inherits the standard tag set; future extractions of similar content land directly in the new leaf instead of going through the discovery channel.

This **closes the schema-extension loop**. It's how the schema grows.

## Why this is the answer to "no predefined path"

The user's directive: *"how do system handle architecture behavior when no predefined path is found.. this must be perfected."*

Industry convergence (research-backed):

- **Glean's auto-classifier**: when content has no obvious category, it lands in a discovery queue with the AI's confidence + best-guess; humans review.
- **Slack's auto-channel-suggest**: surfaces "this conversation might warrant its own channel" when N similar messages cross threshold.
- **Salesforce Einstein's auto-routing**: confidence < threshold → routed to `unrouted` queue for human triage; over time, the system learns and proposes new routing rules.
- **Schema-on-read patterns** (Snowflake VARIANT, MongoDB schemaless): tolerate unknown content; defer schema-validation to query-time.
- **Schemaful systems with schema-evolution-as-product**: making "add a new content-type" a normal workflow instead of a code-change. CSPS adopts this — adding a new leaf is the existing ADR + planning-playground workflow; this protocol just makes it auto-triggered by content patterns.

CSPS's distinctive contribution: the K=2-within-90d auto-ADR forcing function applied to schema gaps themselves, not just content gaps. The same mechanism that catches recurring content issues catches recurring "no path for this kind of input" issues.

## What this protocol does NOT do

- It does NOT auto-create new leaves without user approval. K=2 triggers an ADR DRAFT; user must accept.
- It does NOT silently discard. Content always lands in raw-uncategorized first; never deleted.
- It does NOT force-fit. The AI is REQUIRED to declare schema-gap explicitly rather than crow-bar content into the nearest existing leaf.
- It does NOT replace human judgment for novel architecture concerns. Surfacing patterns to the user is the goal; the user decides whether the proposed leaf is the right shape.

## Cross-references

- [manual-protocol.md](./manual-protocol.md) Step 5 — invokes this protocol when no leaf matches
- [tag-status-contract.md](./tag-status-contract.md) — schema-gap tag added to closed enum
- [proactive-completion.md](./proactive-completion.md) F3 — K=2 → ADR mechanism this protocol uses
- [contexts/README.md](./contexts/README.md) — the 45 leaves this protocol triggers for
- [../pillar-0-governance/learning-loop.md](../pillar-0-governance/learning-loop.md) — the LearningLoopItem schema this protocol writes to
- [../pillar-0-governance/adr-process.md](../pillar-0-governance/adr-process.md) — the ADR draft this protocol auto-creates at K=2
