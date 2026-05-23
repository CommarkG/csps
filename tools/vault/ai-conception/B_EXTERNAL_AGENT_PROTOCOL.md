---
id: ai-conception.B_EXTERNAL_AGENT_PROTOCOL
name: B-EXTERNAL-AGENT-PROTOCOL
description: "Pre-external-agent checklist. Before CSPS invokes any external agent (subagent, MCP tool, API call, spawned task), 5 conditions must be satisfied: identity, FROM/TO format, ZCA context block, capability boundary, trust tier."
type: conception_pattern
protection_level: active
owner: group:finky
lifecycle: production
lifecycle_state: active
version: "1.0"
session: S055
core_spines: [GVRN, AI]
core_spine: GVRN
schema_anchor: vault_files
impl_status: swift-implemented
links:
  - ai-conception.B_IDENTITY_BEFORE_CONTEXT
  - ai-conception.B_ZF_TERMINATION_DISCIPLINE
context_question: "Did the agent invocation declare its FROM/TO identity, ZCA context block, and capability boundary before the first tool call?"
context_quote: "External agents start from zero. No context. No memory of prior conversation. Every delegation that lacks a ZCA block is a delegation into the void."
inherits_from: "Platform Genome §2 Governance Architecture"
propagates: imp_FROM_TO_COMMUNICATION_FORMAT
---

# B_EXTERNAL_AGENT_PROTOCOL

## The Problem

External agents (subagents, MCP tools, remote API calls) start from zero. They have no session context, no CSPS training, no memory of what was discussed. Every invocation without an explicit protocol block is an uncontrolled delegation.

Patterns that break without this protocol:
- Subagent produces output that contradicts in-session decisions (no context)
- MCP tool receives ambiguous input and picks the wrong interpretation
- Agent impersonates a role it doesn't hold (no identity declared)
- Delegation includes data beyond the agent's trust tier (no boundary check)

## The 5-Condition Checklist

Before invoking any external agent, ALL 5 conditions must be satisfied:

### Condition 1: Identity Declared
```
FROM: [CSPS Sonnet / CSPS Opus / Governor / specific role]
FOR: [agent name / tool name / API endpoint]
```
Never assume the receiver knows who is calling.

### Condition 2: FROM/TO Format in the invocation message
The first line of any agent spawn-prompt, API body, or MCP tool call must use:
```
FROM [CALLER] | FOR [RECEIVER] — [one-sentence mandate]
```

### Condition 3: ZCA Context Block (WHO/WHAT/HOW/NOW)
```
WHO: [who is this for — role/agent receiving this]
WHAT: [what is being delegated — specific task, not general direction]
HOW: [what output format is expected — file path / JSON / markdown]
NOW: [what is the current state this agent needs to know to start]
```

### Condition 4: Capability Boundary
State explicitly:
- ✅ CAN: [what this agent is authorized to do]
- ❌ CANNOT: [what this agent must NOT do — especially: commit, push, deploy, edit AGENTS.md]

### Condition 5: Trust Tier
Which data tier applies to this agent?
- T1: Governance files only (`.claude/`, `tools/config/`, `docs/plan/pillar-0-governance/`)
- T2: Platform + app code
- T3: External data, user data, secrets

Agents receiving T3 data must be explicitly authorized.

## Minimal Invocation Template

```
FROM [CALLER] | FOR [AGENT_NAME] — [mandate]

WHO: [receiver role]
WHAT: [specific task]
HOW: [expected output]
NOW: [current state]

CAN: [authorized actions]
CANNOT: [prohibited actions — at minimum: no commits, no AGENTS.md edits]
TRUST: T[N]

[task content]
```

## Why FROM/TO Isn't Enough

FROM/TO identifies the parties. ZCA transmits the context. Capability boundary prevents scope creep. Trust tier prevents data leakage. All four together = a controlled delegation.

FROM/TO alone = "I know who I'm talking to but not what to do."
ZCA alone = "I know what to do but not who I am."
Both without capability = open-ended delegation.
All four without trust tier = potential data boundary violation.

## Reflexive Application

This protocol was built in S055. Apply it to:
- Every `Agent({...})` call in CSPS skills
- Every MCP tool invocation with sensitive context
- Every API call to external models
- Every bash subprocess that spawns an agent tool

The validate-agent-calls.mjs validator checks spawn prompts for presence of FROM/TO format.
The validate-subagent-spawn-preamble.mjs validator checks Class B alignment preamble.

## Propagates

This file closes `imp_FROM_TO_COMMUNICATION_FORMAT` not_yet_propagated target: "External agent protocol (pre-external-agent checklist)".
