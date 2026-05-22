---
id: SIA.R1-04-THRESHOLD
type: architecture
protection_level: protected
status: complete
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

Threshold is the universal intake and routing system. No input — regardless of source (Governor, Sonnet, Opus, external research, session insight) — touches any CSPS element without passing through Threshold first.

The analogy: like an MRI — it absorbs all kinds of inputs, processes them, and routes them correctly. Its routing ability requires deep, dynamic knowledge of the entire platform.

---

## 2. Why Threshold Is Central

Without Threshold, inputs are processed out of order. An idea becomes code before PE assessment. A correction is applied locally without ripple check. A session-valuable architectural decision evaporates when the tab closes. Threshold eliminates these by being the single classification point — every input passes through before touching any platform element. The MRI analogy is precise: Threshold does not process the input itself; it classifies, tags, and routes to the right processor. The routing rules are data (YAML), not code — adding a new pipeline means adding a YAML entry, not changing Threshold itself.

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
```
governor_directive    — explicit instruction from Governor in chat
architectural_insight — Opus recognizes a new architectural pattern
error                 — pnpm verify failure, build error, runtime error
solution              — fix applied to an error (paired with error entry)
external_research     — EXT-ID stamped content from outside CSPS
session_harvest       — captured at session close from transcript
correction            — Governor corrects AI behavior or output
core_seed             — architectural promise approaching consensus (K≥2)
question              — unresolved question requiring investigation
quote                 — memorable statement worth permanent capture
```

---

## 4. Vault + Intelligent Prioritization (R1.4.2)

Immediately routed (value decays in minutes):
- errors (CRITICAL/SIGNIFICANT) → AUDIT_QUEUE now
- governor_directives → PE_INTAKE now
- corrections → AI_PROFILE now

Vaulted first (can wait; preserve for the right moment):
- insights, quotes, external_research, questions, architectural_insights (unless CRITICAL)

The vault is not avoidance. It is an intelligent choice: "I need all resources for what's happening now. This is saved in a predefined pipeline, not pushed away."

Vault status lifecycle: new → processing → routed | sealed | deprecated

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

Complete pipeline specifications:

| Pipeline | Input types | Routing rule | Processor |
|---|---|---|---|
| PE_INTAKE | governor_directive (new feature/app), core_seed | scope_tag=S1+ | Platform Intelligence Engine |
| LEARNING_LOOP | session_harvest, error+solution pairs | scope_tag=S2+ | Learning Loop sub-engine |
| DOC_UPDATE | correction (affecting existing doc) | spine_tag=ARCH/GVRN | Documentation Engine |
| AI_PROFILE | correction (AI behavior), architectural_insight (AI-class) | spine_tag=AI | AI Behavioral Profile registry |
| CONCEPTION_VAULT | architectural_insight (AI role/decision modeling) | scope_tag=S3, spine_tag=AI | AI Conception Vault |
| AUDIT_QUEUE | error, solution, correction with scope_tag=S1+ | CRITICAL = immediate | Audit Hub |
| CORE_SEED_REGISTRY | core_seed, architectural_insight with K≥2 signals | scope_tag=S3 | Core Seeds Monitor |

Routing rules are data (YAML), not code — changeable without deployment.

Escalation paths:
- CRITICAL error → skips queue, direct AUDIT_QUEUE
- governor_directive with pe_score > 90 → direct PE_INTAKE
- correction with scope_tag=S3 → dual routing: AI_PROFILE + CONCEPTION_VAULT

---

## 6. Session Harvest (R1.4.4)

Session harvest captures at session close:
- All error+solution pairs from the session
- All Governor corrections (type=correction)
- All architectural insights surfaced by Opus/Sonnet
- All core seeds that reached K≥2 this session
- All vault entries created this session
- All DONE/RATIFIED events (to update completion metrics)

Triggered by: post-stop hook (currently stub: post-stop-learning-loop.sh).
When fully built: extends post-stop-session-close-gate.sh with harvest logic.

Produces: _handoff/VAULT/harvests/S\<NNN\>-harvest.yaml with structured entries
+ summary (count by type, core seeds promoted, LEARNING_LOOP entries queued).

Current state: post-stop-learning-loop.sh is a stub. Gap registered in gap-vault
for S053 (corespine-hub-depth-markers entry already present).

---

## 7. Threshold in the Developer and User Journeys

For the Governor/Opus/Sonnet (developer journey):
Every plan item passes through Threshold classification before entering the PE queue. Every PROTO directive is a governor_directive that gets Threshold-classified. Currently approximated by: user-prompt-submit-intake.sh (T1) + findings-categorizer.mjs (S1/S2/S3 scope classification).

For app end-users (user journey):
Every user action is logged with Threshold-style classification. User corrections (STT errors, preference changes) route to AI_PROFILE pipeline. Foundation for per-user AI behavioral profiles (Behavioral Hub depends on this).

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
   **Answer:** Distributed. Threshold is the router, not the processor. Each pipeline is a separate service. Single-point coupling would mean pipeline additions require Threshold changes. Distributed = adding a pipeline adds a YAML entry + a processor; Threshold unchanged.

2. What is the complete set of predefined pipelines? How does it stay flexible as the platform grows?
   **Answer:** 7 pipelines defined above. New pipelines added when an input type has no home. Flexibility = routing rules in YAML (changeable without deployment). Maximum 15 pipelines recommended before a meta-routing layer is needed.

3. How does Threshold maintain deep, dynamic knowledge of the entire platform without loading the whole platform at once?
   **Answer:** P-META-009 cognitive context architecture applied to infrastructure: D1 (index) of all pipelines always loaded. D3 (full detail) of ACTIVE pipelines only. When input arrives, Threshold checks D1 to find matching pipeline, loads D3 for that pipeline only. Platform grows without Threshold growing.

---

*CSPS — SIA | Threshold v0.1 | S050 | Protection: protected (proposed)*
