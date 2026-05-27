#!/usr/bin/env node
/**
 * session-source.mjs — Single source of truth for current session ID.
 *
 * FIXES: F-NEW-17 (threshold 358/358 garbage session=unknown) +
 *        F-NEW-22 (context-orchestrator task_class=unknown)
 * ROOT CAUSE: hooks were computing session locally via inline Node.js that
 *   silently fell back to "unknown" on CRLF/path/timing issues.
 *
 * USAGE:
 *   From bash hooks: SESSION_ID=$(node tools/lib/session-source.mjs)
 *   From Node.js:    import { getCurrentSession } from './session-source.mjs'
 *
 * FALLBACK CHAIN (explicit, not silent):
 *   1. tools/session-state.json#current_session
 *   2. CSPS_SESSION_ID environment variable (override for testing)
 *   3. "S000" (explicit unknown-session marker — NOT "unknown" — distinguishable)
 *
 * CSPS-DNA: inherits_from PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 1
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT = process.env.CSPS_ROOT || process.cwd();
const STATE_FILE = join(ROOT, 'tools', 'session-state.json');

/**
 * Get the current session ID with explicit fallback chain.
 * Never returns "unknown" — returns "S000" as an explicit unknown-session marker.
 *
 * @returns {string} Session ID like "S067"
 */
export function getCurrentSession() {
  // Override for testing
  if (process.env.CSPS_SESSION_ID) {
    return process.env.CSPS_SESSION_ID;
  }

  try {
    if (!existsSync(STATE_FILE)) {
      // File doesn't exist yet — new repo
      return 'S000';
    }

    // Normalize CRLF before parsing (Windows bash generates CRLF)
    const raw = readFileSync(STATE_FILE, 'utf-8').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const data = JSON.parse(raw);
    const session = data.current_session;

    if (!session || typeof session !== 'string') {
      return 'S000';
    }

    // Validate format: S<NNN>
    if (!/^S\d{2,}$/.test(session)) {
      return 'S000';
    }

    return session;
  } catch (e) {
    // Parse error or file read error — return explicit unknown marker
    return 'S000';
  }
}

// When called directly from bash: output session to stdout
// Cross-platform check: normalize both URLs for comparison
const _thisUrl = import.meta.url.replace(/\\/g, '/').toLowerCase();
const _argv1Url = `file:///${process.argv[1].replace(/\\/g, '/').replace(/^\//, '')}`.toLowerCase();
const _isMain = _thisUrl === _argv1Url || _thisUrl.endsWith(process.argv[1].replace(/\\/g, '/').toLowerCase());
if (_isMain || process.argv[1]?.endsWith('session-source.mjs')) {
  process.stdout.write(getCurrentSession());
  process.exit(0);
}
