/**
 * @csps-id csps.libs.intelligence.cie-state
 * CIE state management — reads/writes .csps/intelligence/cie-state.yaml
 * Plan item: COMBINATORIAL-ENGINE | S056 | Layer 2 R2
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '../..');
const STATE_DIR = join(ROOT, '.csps', 'intelligence');
const STATE_FILE = join(STATE_DIR, 'cie-state.yaml');

export interface EngineStatus {
  engine_id: string;
  d_level: 1 | 2 | 3;
  alert: boolean;
  alert_reason?: string;
  last_run: string;
}

export interface CIEState {
  session: string;
  updated_at: string;
  engines: EngineStatus[];
}

function defaultState(session: string): CIEState {
  return {
    session,
    updated_at: new Date().toISOString(),
    engines: [],
  };
}

/** Minimal YAML↔JSON for CIEState (JSON-compatible YAML) */
function serialize(state: CIEState): string {
  return JSON.stringify(state, null, 2);
}

function deserialize(text: string): CIEState {
  return JSON.parse(text) as CIEState;
}

export function loadState(session: string): CIEState {
  if (!existsSync(STATE_FILE)) return defaultState(session);
  try {
    return deserialize(readFileSync(STATE_FILE, 'utf-8'));
  } catch {
    return defaultState(session);
  }
}

export function saveState(state: CIEState): void {
  if (!existsSync(STATE_DIR)) mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(STATE_FILE, serialize(state), 'utf-8');
}
