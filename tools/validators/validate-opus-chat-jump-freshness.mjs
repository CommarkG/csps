#!/usr/bin/env node
// validate-opus-chat-jump-freshness.mjs — E4 session (S031)
// Counts # Opus Turn headers in tools/council/opus-turn.md.
// If ≥ 20 turns AND no tools/council/opus-chat-jump-S[current-session].md exists → ADVISORY.
// Purpose: prevent context loss when Opus tab fills up without a handoff file.
//
// Wired: tools/verify.mjs cycle 'opus_chat_jump_freshness'
// Slug: 'opus-chat-jump-freshness' in audit-runner.md

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = resolve(process.cwd());

// Count Opus Turn headers
const opusTurnPath = join(ROOT, 'tools/council/opus-turn.md');
let turnCount = 0;
if (existsSync(opusTurnPath)) {
  const content = readFileSync(opusTurnPath, 'utf8');
  const matches = content.match(/^# Opus Turn \d+/gm) || [];
  turnCount = matches.length;
}

// Find most recent session number from chat-jump files
const councilDir = join(ROOT, 'tools/council');
const chatJumpFiles = existsSync(councilDir)
  ? readdirSync(councilDir).filter(f => f.match(/^opus-chat-jump-S\d+\.md$/))
  : [];

// Read session-state.json for current session
let currentSession = 'unknown';
try {
  const stateFile = join(ROOT, 'tools/session-state.json');
  if (existsSync(stateFile)) {
    const state = JSON.parse(readFileSync(stateFile, 'utf8'));
    currentSession = state.session_id || 'unknown';
  }
} catch { /* ignore */ }

// Check if chat-jump exists for current session
const currentChatJump = `opus-chat-jump-${currentSession}.md`;
const hasChatJump = chatJumpFiles.includes(currentChatJump);

// Also check if any chat-jump was recently updated (within 20 turns of current count)
const latestChatJump = chatJumpFiles.sort().pop() || null;

console.log(`[validate-opus-chat-jump-freshness] Opus turns: ${turnCount} | Current session: ${currentSession}`);
console.log(`[validate-opus-chat-jump-freshness] Chat-jump files: ${chatJumpFiles.length > 0 ? chatJumpFiles.join(', ') : 'none'}`);

if (turnCount >= 20 && !hasChatJump) {
  console.log(`[validate-opus-chat-jump-freshness] ⚠ ADVISORY: ${turnCount} Opus turns but no chat-jump for current session (${currentSession})`);
  console.log(`[validate-opus-chat-jump-freshness]   Create: tools/council/opus-chat-jump-${currentSession}.md`);
  console.log(`[validate-opus-chat-jump-freshness]   Format: one paragraph → 3 file references (see PROTOCOL.md OPUS-TO-OPUS section)`);
  if (latestChatJump) {
    console.log(`[validate-opus-chat-jump-freshness]   Latest existing: ${latestChatJump} — update it for current session`);
  }
  console.log(`[validate-opus-chat-jump-freshness] turns=${turnCount} session=${currentSession} has_chat_jump=false`);
  process.exit(0); // ADVISORY only
} else if (turnCount >= 20 && hasChatJump) {
  console.log(`[validate-opus-chat-jump-freshness] ✓ ${turnCount} turns + chat-jump exists for ${currentSession}`);
} else {
  console.log(`[validate-opus-chat-jump-freshness] ✓ ${turnCount} turns — below 20 threshold, no chat-jump needed yet`);
}
console.log(`[validate-opus-chat-jump-freshness] turns=${turnCount} session=${currentSession} has_chat_jump=${hasChatJump}`);
process.exit(0);
