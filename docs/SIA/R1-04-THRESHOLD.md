---
id: SIA.R1-04-THRESHOLD
type: architecture
protection_level: protected
status: draft
core_spines: [GVRN, ARCH, OPER]
context_question: "How does every input to CSPS get classified, tagged, vaulted, and routed before touching any platform element?"
context_quote: "Everything goes through here before touching any platform element."
version: "0.1"
session: S050
name: "SIA-R1-threshold"
description: "Universal intake and routing system — all inputs pass through Threshold first"
owner: "group:finky"
lifecycle: "experimental"
lifecycle_state: "active"
---

# R1.4 — Threshold

> **Standalone document.** See [00-INDEX.md](00-INDEX.md) for full context.
> Threshold is not a feature. It is the architectural boundary that makes everything else coherent.

---

## 1. What Is Threshold?

[TO FILL: Threshold is the universal intake and routing system. No input — regardless of source (Governor, Sonnet, Opus, external research, session insight) — touches any CSPS element without passing through Threshold first.]

[TO FILL: The analogy: like an MRI — it absorbs all kinds of inputs, processes them, and routes them correctly. Its routing ability requires deep, dynamic knowledge of the entire platform.]

---

## 2. Why Threshold Is Central

[TO FILL: The problem it solves: inputs processed out of order create debt. Insights lost between sessions. Ideas injected into execution queues without classification. Threshold eliminates all of these by being the single point of entry.]

---

## 3. Input Classification (R1.4.1)

Every input is tagged with:

```yaml
input:
  id:              # generated at intake
  type:            # [see closed enum below]
  session:         # which session it arrived in
  spine_tag:       # which Core Spine this belongs to
  scope_tag:       # S1 (instance) | S2 (process) | S3 (structural)
  urgency:         # high | medium | low
  status:          # new | processing | routed | sealed | deprecated
  source:          # governor_directive | sonnet_report | opus_design | external | session_harvest
```

Input types (closed enum):
[TO FILL: governor_directive | architectural_insight | error | solution | external_research | session_harvest | correction | core_seed | question | quote]

---

## 4. Vault + Intelligent Prioritization (R1.4.2)

[TO FILL: The Vault is not a solution to a problem. It is an intelligent choice. The principle: "I need all resources to excel at what's happening now. But this is saved in a predefined pipeline, not pushed away."

Vault status lifecycle: new → processing → routed | sealed | deprecated

What gets vaulted vs. immediately routed: the decision criteria]

---

## 5. Pipeline Routing (R1.4.3)

Predefined pipelines (routing rules are data, not code — changeable without deployment):

| Pipeline | What routes here | Who processes |
|---|---|---|
| PE_INTAKE | New plan items, priority changes | Platform Intelligence Engine |
| LEARNING_LOOP | Session patterns, AI behavioral observations | Learning Loop sub-engine |
| DOC_UPDATE | Node changes that affect documentation | Documentation Engine |
| AI_PROFILE | AI trigger/default/satisfaction point observations | AI Behavioral Profile registry |
| CONCEPTION_VAULT | How AI models its own role or decision architecture | AI Conception Vault |
| AUDIT_QUEUE | Compliance findings, validation failures | Audit Hub |
| CORE_SEED_REGISTRY | Architectural promises reaching consensus | Core Seeds Monitor |

[TO FILL: Complete pipeline specifications. Routing rules. Escalation paths.]

---

## 6. Session Harvest (R1.4.4)

[TO FILL: At session close, Threshold runs an automated extraction pass over the entire session. Every: error, solution, insight, correction, directive, seed — classified and routed.

This is the mechanism that eliminates "important architectural inputs are lost when tabs close."

What the harvest extracts: [list]
How it is triggered: [post-stop hook]
What it produces: [structured vault entries, core seeds]
]

---

## 7. Threshold in the Developer and User Journeys

[TO FILL: Threshold appears in both journeys as the entry point. For developers: every plan item passes through Threshold before being added to the execution queue. For users: every user action passes through Threshold classification before triggering system response.]

---

## 8. Relationship to Existing CSPS Components

| Existing component | Threshold relationship |
|---|---|
| user-prompt-submit-intake.sh | Thin implementation of R1.4.1 — extend to full Threshold |
| findings-categorizer.mjs | Implements S1/S2/S3 classification — becomes part of R1.4.1 |
| post-stop-learning-loop.sh | Implements R1.4.4 session harvest (stub currently) |
| _handoff/VAULT/ | Physical vault storage — becomes managed by R1.4.2 |

---

## 9. Open Questions

1. Should Threshold be a single service or distributed (one per input type)?
2. What is the complete set of predefined pipelines? How does it stay flexible as the platform grows?
3. How does Threshold maintain deep, dynamic knowledge of the entire platform without loading the whole platform at once? (Mini Tree answer: Threshold holds D1 of all pipelines, D3 of active ones)

---

*CSPS — SIA | Threshold v0.1 | S050 | Protection: protected (proposed)*
