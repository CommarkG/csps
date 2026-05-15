---
id: csps.libs.policies.slices.knowledge
name: knowledge-slices-readme
description: Domain schema slices directory for knowledge.* apps. Each .zmodel file activates domain-specific models per tenant.
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

# Knowledge Domain Schema Slices

Domain schema slices for `knowledge.*` apps.
Each `.zmodel` file here is a domain extension activated per tenant.

**domain_path prefix:** `knowledge`
**Example apps:** note-taking, research tools, WisdomVault entries

*Populated when first knowledge-domain app is scaffolded.*
