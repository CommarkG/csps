---
id: csps.libs.policies.slices.personal
name: personal-slices-readme
description: Domain schema slices directory for personal.* apps. Each .zmodel file activates domain-specific models per tenant.
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: domain_slices
domain_path: platform
tags:
  - domain:architecture
  - type:reference
  - audience:developer
  - maturity:stable
session: S022
scope_level: S1
---

# Personal Domain Schema Slices

Domain schema slices for `personal.*` apps.
Each `.zmodel` file here is a domain extension activated per tenant.

**domain_path prefix:** `personal`
**Example apps:** health tracking, journaling, habit tracking, personal finance

*Populated when first personal-domain app is scaffolded.*
