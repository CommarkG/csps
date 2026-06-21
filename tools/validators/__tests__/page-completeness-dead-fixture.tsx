// page-completeness-dead-fixture.tsx
// BLOCK-TEST FIXTURE for validate-page-completeness.mjs
// This file INTENTIONALLY contains dead elements.
// The validator MUST detect all of them and FAIL.
// If the validator returns 0 dead → machine is broken.
//
// Dead elements in this fixture (expected: 3):
//   1. onClick={undefined}   → dead button
//   2. href="/platform/nonexistent-page-xyz"  → dead link
//   3. fetch('/api/nonexistent-route-xyz')    → 404-risk fetch
//
// DO NOT USE THIS IN PRODUCTION. This is a validation machine test fixture.

export default function DeadFixturePage() {
  return (
    <div>
      {/* DEAD ELEMENT 1: onClick is undefined — button does nothing */}
      <button onClick={undefined}>I am a dead button</button>

      {/* DEAD ELEMENT 2: href points to non-existent page — 404 */}
      <a href="/platform/nonexistent-page-xyz">I am a dead link</a>

      {/* DEAD ELEMENT 3: fetch URL has no route file — 404-risk */}
      <button onClick={() => fetch('/api/nonexistent-route-xyz').then(r => r.json())}>
        I fetch a dead API
      </button>
    </div>
  )
}
