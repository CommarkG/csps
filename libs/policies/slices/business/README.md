---
id: csps.libs.policies.slices.business
name: business-slices-readme
description: Domain schema slices directory for business.* apps. Each .zmodel file activates domain-specific models per tenant.
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
---

# Business Domain Schema Slices

Domain schema slices for `business.*` apps.
Each `.zmodel` file here is a domain extension activated per tenant.

**domain_path prefix:** `business`
**Example apps:** task management, CRM, invoicing, project tracking

*Populated when first business-domain app beyond task-mgmt is scaffolded.*
