---
id: csps.handoff.vault.external-app-extractions
name: external-app-extractions
description: Vault for extracting value from external apps (Lovable, Base44, etc.) built by the Governor. Each app gets a structured extraction template. Processed via The Threshold (external-content source class). Insights → SG-NNN (successes) or EP-NNN (patterns to avoid) or CSEP (synergy opportunities).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: GVRN
schema_anchor: vault_files
tags:
  - domain:governance
  - type:reference
  - audience:ai-agent
  - maturity:stable
domain_path: platform
---

# External App Extractions Vault

## How to use this vault

For each app: create a `<app-name>-extraction.md` file using the template below.
Then bring it to a CSPS session as an external-content input through The Threshold.
The session AI (consolidation-expert + synergy-master) extracts:
- Architecture patterns → SG-NNN if successful
- Anti-patterns → EP-NNN if problematic  
- Competitive insights → platform-comparison-framework.md
- Schema patterns → foundation-slices topic-plan

## Extraction template (copy for each app)

```markdown
# App Extraction — [App Name]

## App context
- Platform: Lovable | Base44 | other
- Purpose: <what this app does>
- Tech stack: <if known>
- Users: <how many, type>
- Launched: <when>

## Architecture extractions
- Data model: <entities + relationships observed>
- Auth pattern: <how auth works>
- AI integration: <any AI features>
- Payment: <Stripe or other>
- UX patterns: <notable flows>

## What worked well (→ SG-NNN candidates)
1. <pattern that worked well with evidence>

## What had friction (→ EP-NNN candidates)  
1. <anti-pattern observed with evidence>

## CSPS applicability (→ foundation or architecture decisions)
1. <how this app's patterns should inform CSPS design>

## Questions this app raises (→ vault for future session)
1. <question>
```
