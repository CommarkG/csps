---
id: csps.libs.policies.slices.social
name: social-slices-readme
description: Domain schema slices directory for social.* apps. Each .zmodel file activates domain-specific models per tenant.
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

# Social Domain Schema Slices

Domain schema slices for `social.*` apps.
Each `.zmodel` file here is a domain extension activated per tenant.

**domain_path prefix:** `social`
**Example apps:** community platform, events, family coordination

*Populated when first social-domain app is scaffolded.*
