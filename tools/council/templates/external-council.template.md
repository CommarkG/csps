# EXTERNAL COUNCIL — [topic]
## Session: S[NNN] | Date: [date]
## Coordinator: Sonnet | External systems: [list AI systems]
## Opus role: Final synthesis + seal

---

## External Council Charter

```
Purpose:   [what domain expertise is being sought externally]
Systems:   [ChatGPT-4o / Gemini / Claude.ai / expert panel / other]
Questions: [the 3-5 questions being put to external systems]
Sonnet's role: coordinate, collect, synthesize — do NOT implement during this council
```

---

## Question Set (Sonnet sends these to each external system)

```
Q1: [specific question — not vague, not open-ended]
    Context: [2-3 sentences of CSPS context needed to answer accurately]

Q2: [question]
    Context: [context]

Q3: [question]
    Context: [context]
```

---

## [External System 1] Response

**System:** [GPT-4o | Gemini | Claude.ai | etc.]
**Questions answered:** Q1, Q2, Q3

**Summary:** [Sonnet's 3-sentence distillation — NOT the raw response]

**Insights:** [specific, actionable, different from CSPS current approach]

**AI-defaults flag:** [is this response based on SaaS conventions or CSPS-specific knowledge?]
Mark each insight: `[AI-DEFAULT]` or `[CSPS-VALIDATED]`

---

## [External System 2] Response

[same format]

---

## [External System 3] Response (if applicable)

[same format]

---

## Sonnet Synthesis

**Convergent insights (multiple systems agreed):**
- [insight]: [what this means for CSPS]

**Divergent insights (systems disagreed):**
- [topic]: [System 1 says X / System 2 says Y] → [which is more applicable to CSPS and why]

**Novel insights (only one system surfaced this):**
- [insight]: [whether to adopt — needs Opus review]

**Discarded (AI-defaults not applicable to CSPS):**
- [insight]: discarded because [CSPS-specific reason]

---

## Opus Final Synthesis

**What the external council found that insiders missed:**
[Opus perspective on the convergent insights]

**What the external council got wrong (AI-defaults applied incorrectly):**
[Specific cases where external systems assumed generic SaaS, not CSPS platform model]

**Recommended adoption:**
| Insight | Adopt? | Reasoning |
|---|---|---|
| [insight 1] | YES / MODIFY / NO | [reason] |

**Opus seal for adoption decisions:**
SEALED — adopted insights listed above are ratified for implementation
OR
CONDITIONAL — [conditions]

---

## Governor Ratification

Which external insights to adopt: [list]
Which to discard: [list]
Which to defer with VLT: [list]

```yaml
# Added to plan frontmatter:
ratification_status: SEALED
sealed_by: "OPUS-[N] [date]"
council_type: external
external_systems_consulted: [list]
adopted_insights: [list]
discarded_insights: [list]
```

---

*External Council complete | S[NNN] | [date]*
*Template: tools/council/templates/external-council.template.md*
*External insights marked [AI-DEFAULT] require explicit Governor adoption before implementation.*
