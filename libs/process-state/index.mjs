/**
 * @csps-id csps.libs.process-state
 * @csps-name process-state
 * @csps-description B2 real-time-save — resumable process store keyed {app}:{userId}:{processId}.
 *   save(): persists current process state (debounced per step).
 *   resume(): returns saved state, allowing exact-step re-entry.
 *   clear(): removes saved state after process completes or is abandoned.
 *   list(): returns all paused processes (ANTI-FLOAT seed input).
 *   Storage: tools/data/process-state/{key}.json (within main repo).
 *   Core-Maximal: shared lib, every app inherits via API route pattern.
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces PROTO-S073-B2
 * closure_owner: group:finky
 * closure_decision: "Full ANTI-FLOAT integration in B4 — this is the seed"
 * closure_by: "B4 (ANTI-FLOAT released after accountability hub ratification)"
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from 'fs'
import { join } from 'path'

/**
 * Resolve storage path for a given key.
 * Key format: "{app}:{userId}:{processId}" — e.g. "core-spine-creator:governor:onboarding-spine"
 * Sanitized: only allow alphanumeric + hyphen + underscore + colon in filenames.
 */
function storePath(ROOT, key) {
  const sanitized = key.replace(/[^a-zA-Z0-9\-_:]/g, '_').replace(/:/g, '__')
  return join(ROOT, 'tools/data/process-state', `${sanitized}.json`)
}

/**
 * save — persist process state for later resumption.
 * @param {string} ROOT - repo root path (process.cwd() from the caller context)
 * @param {string} key - "{app}:{userId}:{processId}"
 * @param {object} state - serializable process state object
 * @returns {{ saved: boolean, key: string, timestamp: string }}
 */
export function save(ROOT, key, state) {
  const timestamp = new Date().toISOString()
  const entry = {
    key,
    state,
    saved_at: timestamp,
    paused: true,
    resume_trigger: `key=${key}`,
    note: 'ANTI-FLOAT seed: paused process = non-terminal artifact with resume_trigger',
  }
  try {
    writeFileSync(storePath(ROOT, key), JSON.stringify(entry, null, 2))
    return { saved: true, key, timestamp }
  } catch {
    return { saved: false, key, timestamp }
  }
}

/**
 * resume — retrieve saved process state.
 * @param {string} ROOT - repo root path
 * @param {string} key - "{app}:{userId}:{processId}"
 * @returns {object|null} - saved state or null if not found
 */
export function resume(ROOT, key) {
  const path = storePath(ROOT, key)
  if (!existsSync(path)) return null
  try {
    const entry = JSON.parse(readFileSync(path, 'utf-8'))
    return entry.state || null
  } catch {
    return null
  }
}

/**
 * clear — remove saved state after process completes.
 * @param {string} ROOT - repo root path
 * @param {string} key - "{app}:{userId}:{processId}"
 * @returns {{ cleared: boolean }}
 */
export function clear(ROOT, key) {
  const path = storePath(ROOT, key)
  if (!existsSync(path)) return { cleared: false }
  try { unlinkSync(path); return { cleared: true } } catch { return { cleared: false } }
}

/**
 * list — enumerate all paused processes (ANTI-FLOAT seed: non-terminal artifacts with resume triggers).
 * @param {string} ROOT - repo root path
 * @returns {Array<{ key: string, saved_at: string, resume_trigger: string }>}
 */
export function list(ROOT) {
  const dir = join(ROOT, 'tools/data/process-state')
  if (!existsSync(dir)) return []
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          const entry = JSON.parse(readFileSync(join(dir, f), 'utf-8'))
          return { key: entry.key, saved_at: entry.saved_at, resume_trigger: entry.resume_trigger }
        } catch { return null }
      })
      .filter(Boolean)
  } catch { return [] }
}
