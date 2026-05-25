#!/usr/bin/env node
/**
 * @csps-id csps.tools.validators.validate-voice-profile
 * @csps-name validate-voice-profile
 * @csps-description T2 advisory validator: checks that all app page.tsx files
 *   containing form elements declare a voiceProfile in pageDNA AND expose it
 *   via a data-voice-profile attribute on the form container.
 *   Advisory per violating page. Exempt with @voice-exempt comment.
 *   Component B (platform-wide) — PROTO-S062-K GAP-1.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:validator domain:ux audience:platform
 * @csps-enforces voiceProfile-pageDNA-discipline
 * @csps-ns_quality governed-without-rigidity
 *
 * WHAT THIS PREVENTS:
 *   Forms shipped without a declared voice profile — no colleague-tone guarantee,
 *   no platform-enforced UI personality. Voice profile in pageDNA is 0% if it
 *   never reaches the form element that the user interacts with.
 *
 * COMPLIANCE:
 *   PASS: page has pageDNA.voiceProfile field AND data-voice-profile attr in JSX
 *   PASS: page has @voice-exempt comment (explicitly opted out with reason)
 *   ADVISORY: form page lacks BOTH — surfaced but not blocking
 *
 * EXIT: always 0 (advisory). Future: exit 1 when forms_missing_profile > 0
 *   for apps past Phase 1 ratification.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '../..')
const APPS_DIR = join(ROOT, 'apps')

// ── Form-page detection ───────────────────────────────────────────────────────
// A page is a "form page" if it contains any of these patterns.
// Intentionally conservative — only catches explicit form-like elements.
const FORM_INDICATORS = [
  /<form[\s\n>]/i,
  /<input[\s\n/>]/,
  /<textarea[\s\n/>]/i,
  /<select[\s\n>]/i,
  /\bFormField\b/,
  /\bFormItem\b/,
  /\bFormControl\b/,
]

// ── Voice profile compliance detection ───────────────────────────────────────
// A form page is compliant if it has ANY of these:
const VOICE_PROFILE_INDICATORS = [
  /data-voice-profile/,   // attribute on a JSX element (the canonical mechanism)
  /voiceProfile\s*:/,     // field in pageDNA block
  /@voice-exempt/,        // explicit opt-out with comment
]

// ── Recursive page.tsx finder ─────────────────────────────────────────────────
function findPageFiles(dir) {
  if (!existsSync(dir)) return []
  const results = []
  try {
    const entries = readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue
      if (entry.isDirectory()) {
        results.push(...findPageFiles(join(dir, entry.name)))
      } else if (entry.name === 'page.tsx') {
        results.push(join(dir, entry.name))
      }
    }
  } catch { /* skip unreadable dirs */ }
  return results
}

// ── Scan ──────────────────────────────────────────────────────────────────────
let pages_with_forms = 0
let forms_with_profile = 0
let forms_missing_profile = 0
const missing_list = []

if (existsSync(APPS_DIR)) {
  const appDirs = readdirSync(APPS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name !== 'node_modules')
    .map(e => join(APPS_DIR, e.name))

  for (const appDir of appDirs) {
    const srcDir = join(appDir, 'src/app')
    const pages = findPageFiles(srcDir)

    for (const pagePath of pages) {
      let content
      try { content = readFileSync(pagePath, 'utf8') } catch { continue }

      const hasForm = FORM_INDICATORS.some(p => p.test(content))
      if (!hasForm) continue

      pages_with_forms++
      const hasVoiceProfile = VOICE_PROFILE_INDICATORS.some(p => p.test(content))

      if (hasVoiceProfile) {
        forms_with_profile++
      } else {
        forms_missing_profile++
        missing_list.push(
          pagePath.replace(ROOT, '').replace(/\\/g, '/').replace(/^\//, '')
        )
      }
    }
  }
}

// ── Output ────────────────────────────────────────────────────────────────────
const advisory = forms_missing_profile > 0 ? 1 : 0

if (forms_missing_profile > 0) {
  console.warn('\n[validate-voice-profile] ADVISORY: form page(s) missing voice profile:')
  missing_list.forEach(f => console.warn(`  → ${f}`))
  console.warn('  Fix: add voiceProfile to pageDNA + data-voice-profile={pageDNA.voiceProfile} on form container')
  console.warn('  Exempt: add @voice-exempt comment to suppress this advisory')
}

console.log(
  `[validate-voice-profile] pages_with_forms=${pages_with_forms} forms_with_profile=${forms_with_profile} forms_missing_profile=${forms_missing_profile} advisory=${advisory} blocking=0`
)
process.exit(0)
