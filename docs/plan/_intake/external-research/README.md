---
id: csps.intake.external-research
name: external-research-intake
description: >
  Canonical home for ALL external research, external AI reviews, product briefs,
  competitor analyses, and any knowledge created outside the CSPS repo.
  Every file has a pipeline entry in tools/data/external-research-pipeline.yaml.
  The pipeline tracks: P0 ingested → P1 classified → P2 swift-scanned →
  P3 harvested → P4 parked → P5 absorbed → P6 closed.
version: "1.0"
session: S088
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: tools_templates_meta
---

# External Research Intake
## The canonical home + progress-tracking system for all external knowledge

---

## WHERE FILES LIVE

```
docs/plan/_intake/external-research/
  README.md                 ← this file (navigation + process)
  YYYY-MM-DD/               ← date-prefixed folder (one per day of intake)
    <numbered-file>.md      ← file saved with sequential number + descriptive name
```

**Registry:** `tools/data/external-research-pipeline.yaml` — one entry per file, full pipeline tracking.

---

## PIPELINE STAGES (the "progress bar")

Every file moves through these stages. `pipeline_stage` field in the registry tracks it.

| Stage | Code | Meaning | Gate |
|-------|------|---------|------|
| Ingested | P0 | File saved to this directory | File exists |
| Classified | P1 | Threshold-classified (source, domain, priority, value) | pipeline entry has all required fields |
| SWIFT-scanned | P2 | SWIFT items identified (low blast radius, immediate value) | swift_items[] filled |
| Harvested | P3 | Council-harvest entries created; key insights extracted | council-harvest entry exists |
| Parked | P4 | PARK entries created for significant work items | park_register_ref filled |
| Absorbed | P5 | SWIFT items absorbed into platform; parked items in queue | swift_absorbed=true |
| Closed | P6 | All value extracted; file archived | disposition=closed |

---

## STATUS VALUES (closed-enum)
```
status: new | classified | swift-scanned | harvested | parked | absorbed | closed
```

## PRIORITY VALUES (closed-enum)
```
priority: P0-critical | P1-high | P2-medium | P3-low
```

## SOURCE TYPE VALUES (closed-enum)
```
source_type: external-AI | external-review | internal-GPT | competitor-analysis | product-brief | governance-design | research-paper
```

## VALUE CLASS VALUES (closed-enum)
```
value_class: insight | pattern | design | product-brief | governance | architecture | reference
```

---

## THE PROCESS (how a new external document enters)

1. **Save the file** to `YYYY-MM-DD/` with a descriptive name
2. **Add registry entry** to `tools/data/external-research-pipeline.yaml` (stage: P0)
3. **Threshold classification**: run the file through `tools/scripts/threshold-chain.mjs` or classify manually; update stage → P1
4. **SWIFT scan**: read the file; identify items with value ≤ 2h, blast-radius ≤ LOW; fill `swift_items[]`; stage → P2
5. **Harvest**: for insights that affect the platform, add council-harvest.yaml entries with `disposition` set; stage → P3
6. **Park**: for larger work items, add PARK entry in tools/data/park-register.yaml; stage → P4
7. **Absorb**: execute SWIFT items, confirm in ratified-standards if applicable; stage → P5
8. **Close**: when all value is extracted and the file is archived; stage → P6

---

## CONNECTION TO PLATFORM SYSTEMS

| System | Connection |
|--------|-----------|
| `tools/scripts/threshold-chain.mjs` | Classification gate (P1) |
| `tools/data/council-harvest.yaml` | Insight routing (P3) |
| `tools/data/park-register.yaml` | Work item tracking (P4) |
| `tools/data/ratified-standards.yaml` | Platform standard promotion (P5→A) |
| `tools/data/gap-recurrence-register.yaml` | Recurring gap tracking |
| `tools/config/research-registry.yaml` | Research catalog (prevent re-researching) |
| `tools/data/external-research-pipeline.yaml` | **THIS SYSTEM** — pipeline tracking |
| SWIFT protocol | Immediate low-risk absorptions |

---

## VIEWING PIPELINE STATUS (quick reference)

```bash
# Show all files and their current pipeline stage:
node -e "
const y = require('fs').readFileSync('tools/data/external-research-pipeline.yaml','utf8');
const entries = [...y.matchAll(/- id: ([^\n]+)[\s\S]*?status: ([^\n]+)[\s\S]*?pipeline_stage: ([^\n]+)/g)];
entries.forEach(m => console.log(m[1].trim().padEnd(50), m[2].trim().padEnd(12), m[3].trim()));
"
```

---

*More files are always expected — drop them in the YYYY-MM-DD folder and add a pipeline entry. The system grows with the research.*
