---
id: csps.pillar4.developer-journey.domain-design
name: developer-domain-design
description: "Stage 4 — Domain design. Data model, business logic, ZenStack schema. The developer's primary creative work. Must be specified in planning grid before code."
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
diataxis_type: how-to
session: S039
pe_score: 40
links:
  - { rel: parent, href: ./README.md }
  - { rel: schema, href: ../../../../libs/policies/schema.zmodel }
tags:
  - domain:dx
  - domain:architecture
  - type:how-to
  - audience:developer
  - maturity:draft
scope_level: S1
---

# Stage 4 — Domain Design

**PE score: 40** — High impact but significant work. Only begin after planning grid reaches VALIDATED.

---

## The domain layer is the developer's creative work

Everything in Stage 3 is pre-built. Stage 4 is where the developer earns their contribution: defining the data model and business logic that makes their specific app valuable.

This is not "write a Prisma schema." This is "model the domain so that users can accomplish their stated goal."

The difference: a Prisma schema describes tables. A domain model describes behavior.

---

## Starting from the planning grid output

The Data Model node from Stage 2 specifies which entities are needed. Stage 4 makes those entities concrete in `libs/policies/schema.zmodel`.

Every entity must have:

**Tenant isolation (non-negotiable):**
```prisma
model Invoice extends Base {
  tenantId  String   // every model has this
  // ZenStack @@allow policies enforce tenant boundary
```

**Lifecycle clarity:**
```prisma
  status    String   @default("draft")  // not just "status" — what are the valid values?
  // State machine: draft → sent → paid → overdue
```

**Soft delete (default):**
```prisma
  deletedAt DateTime? // P-ARCH-007: soft delete by default
  // @@allow("read", deletedAt == null)
```

**Audit trail (automatic):**
```prisma
// Base provides: id, createdAt, updatedAt, tenantId
// AuditEvent model captures significant state changes
```

---

## The business logic contract

Business logic lives in the API layer, not the schema. The schema models state. The API layer models transitions.

For each state machine in the domain:

**Define the states:** What are the valid states? (invoice: draft, sent, paid, overdue, cancelled)

**Define the transitions:** What events cause transitions? (send → sent, payment received → paid, 30 days late → overdue)

**Define the guards:** What conditions must be true for a transition to be allowed? (cannot mark paid before sent, cannot send without recipient)

**Define the side effects:** What happens automatically when a transition occurs? (send invoice → trigger email, mark paid → update balance calculation)

Each of these maps to an API route. The route validates the guard, executes the transition, and triggers the side effects.

---

## The ZenStack security model

Every model's @@allow policies are the security spec, not an afterthought:

```prisma
model Invoice extends Base {
  // ...fields...
  
  // Owner can do everything with their own invoices
  @@allow("all", auth().tenantId == tenantId)
  
  // Clients can read invoices shared with them (if sharing is a feature)
  @@allow("read", sharedWith != null && sharedWith.includes(auth().id))
  
  // Nobody can delete (soft delete only)
  @@deny("delete", true)
}
```

The security model is written BEFORE the API layer. The API layer should not contain auth checks — ZenStack enforces them at the DB layer.

---

## The validation gate

A domain design is VALIDATED when:

1. Every entity specified in the planning grid Data Model node exists in the schema
2. Every entity has tenantId, soft delete, and at least one @@allow policy
3. Every state machine has explicit states, transitions, and guards documented
4. Every business rule is encodable in the system (no manual intervention needed)
5. The schema generates without errors (`pnpm schema:generate`)

A domain design is NOT validated based on whether it "looks complete." It is validated based on whether it produces a consistent, generateable schema that enforces the security model.

---

## The most common domain design mistakes

**Premature normalization:** Over-splitting entities before the domain is understood. Start with fewer, richer models. Split later if needed.

**Missing lifecycle:** An entity with `status: String` but no documented state machine. The transitions are implicit and untestable.

**Auth as an afterthought:** @@allow policies added after the schema is built, trying to retrofit security onto a model that wasn't designed for it.

**Impedance mismatch:** The data model represents what's easy to store, not what users actually do. Models should be named after user activities, not database concepts.
