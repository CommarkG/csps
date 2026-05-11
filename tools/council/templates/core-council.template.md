# CORE COUNCIL — [topic]
## Session: S[NNN] | Date: [date]
## Plan: [plan file path]
## Seal required: YES (Opus final audit mandatory)

---

## Orchestrator Decision

```
COUNCIL ORCHESTRATOR — [plan name]
Council type: CORE
Members invoked: [full list — all relevant]
Trigger reason: [depth_chosen:4+] | [constitutional change] | [platform-wide impact]
Opus audit: MANDATORY (Core Council)
Sequence: [Member order — typically Security → SaaS → Platform → Reliability → Balance → Opus]
```

---

## Security Reviewer Position

**Lens:** Auth, data isolation, attack surface, compliance
**Finding:** PASSED / ADVISORY / BLOCKING

**Questions answered:**
1. Can a user access another tenant's data? → [answer]
2. Role change propagation? → [answer]
3. Webhook idempotency? → [answer]
4. PII scope + erasure path? → [answer]
5. Enforcement bypass scenario? → [answer]

**Critical findings:**
- [BLOCKING item if any — must be resolved before seal]
- [ADVISORY item — must be addressed or explicitly deferred]

---

## SaaS Architect Position

**Lens:** Subscription lifecycle, billing, Stripe, monetization
**Finding:** PASSED / ADVISORY / BLOCKING

**Subscription state machine coverage:**
| Transition | Handled? | Where? |
|---|---|---|
| free → trialing | ✓ / ✗ | |
| trialing → active | ✓ / ✗ | |
| active → cancelled | ✓ / ✗ | |
| payment.failed → ? | ✓ / ✗ | |

**Critical findings:**
- [items]

---

## Platform Developer Position

**Lens:** Developer experience for App #2-30
**Finding:** PASSED / ADVISORY / BLOCKING

**Inheritance checklist (what App #2 gets automatically):**
- [ ] Multi-tenant isolation
- [ ] Auth wiring
- [ ] Subscription check
- [ ] Audit events
- [ ] Role gates
- [ ] GDPR erasure
- [ ] [new items from this plan]

**Critical findings:**
- [items]

---

## Reliability Engineer Position

**Lens:** Failure modes, idempotency, scale, operations
**Finding:** PASSED / ADVISORY / BLOCKING

**Failure scenario table:**
| Scenario | Impact | Recovery |
|---|---|---|
| Webhook fires twice | | |
| External service down | | |
| DB query at scale | | |

**Critical findings:**
- [items]

---

## Balance Expert Position

**Lens:** Over-engineering, complexity, moat vs. overhead
**Finding:** PASSED / ADVISORY / BLOCKING

**Complexity delta:**
- Validators added: +[N] → total: [N]
- Hooks added: +[N] → total: [N]
- Contracts added: +[N] → total: [N]
- New complexity score: [N] (GREEN / YELLOW / RED)

**Moat vs. overhead classification:**
- [item]: MOAT (compounds) / OVERHEAD (consumes)

**Critical findings:**
- [items]

---

## Opus Final Audit

**Mental models applied:**
1. Cross-File Lens: [does this form a coherent system?]
2. Time Projection: [what breaks at 30 apps / 10K tenants?]
3. Coverage Enumeration: [what is NOT proven by this plan?]
4. Self-Referential: [does this governance obey its own rules?]
5. Moat Measurement: [compound or consume?]

**Synthesis of member findings:**
[What did all 5 members collectively miss? What gaps remain?]

**Blocking items before seal:**
- [ ] [item that must be resolved]

**Conditional items (deferred with VLT):**
- [ ] [item + VLT-S[NNN]-[ID]]

**Opus verdict:** SEALED / CONDITIONAL SEAL / REJECTED

If CONDITIONAL SEAL: conditions are [list]. Governor confirms conditions met → seal applied.
If REJECTED: reason is [reason]. Return to [member] for revision.

---

## Ratification Seal

```yaml
# Added to plan frontmatter after Governor ratification:
ratification_status: SEALED
sealed_by: "OPUS-[N] [model] [date]"
sealed_session: S[NNN]
council_type: core
members_reviewed:
  - security-reviewer
  - saas-architect
  - platform-developer
  - reliability-engineer
  - balance-expert
  - opus-advisor
seal_conditions_met: true | false
```

**Governor ratification:** YES / CONDITIONAL / NO

If YES: Sonnet may begin implementation. Paste seal to plan frontmatter.
If CONDITIONAL: Governor confirms [conditions] → then sealed.
If NO: [reason] — council reconvenes after revision.

---

*Core Council complete | S[NNN] | [date]*
*Template: tools/council/templates/core-council.template.md*
*Opus seal is the final gate before implementation.*
