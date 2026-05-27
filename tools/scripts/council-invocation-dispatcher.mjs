#!/usr/bin/env node
/**
 * council-invocation-dispatcher.mjs — PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 4
 * Called by threshold-router.mjs on INVOKE routes.
 * Maps input content to council skills via trigger patterns from council-registry.md.
 *
 * Usage: node tools/scripts/council-invocation-dispatcher.mjs --content="..." --route="INVOKE:skill-name"
 * Returns: { skill, triggered_by, invocation_log_entry }
 *
 * inherits_from: PROTO-S067-MASTER-THRESHOLD-ROUTER STEP 4 + M-42 M-22
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const REGISTRY_PATH = join(ROOT, 'docs', 'plan', 'pillar-0-governance', 'council-registry.md');
const INVOCATION_LOG = join(ROOT, 'tools', 'data', 'council-invocation-log.jsonl');

// Parse skills + triggers from council-registry.md table
function parseSkillTriggers(registryContent) {
  const skills = [];
  const lines = registryContent.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.includes('| Member |') && line.includes('| Trigger patterns |')) {
      inTable = true;
      continue;
    }
    if (!inTable) continue;
    if (line.startsWith('|---')) continue;
    if (!line.startsWith('| ')) { inTable = false; continue; }

    const cols = line.split(' | ').map(c => c.replace(/^\|/, '').trim());
    if (cols.length < 5) continue;

    const memberRaw = cols[0];
    const triggerPatterns = cols[4]; // "Trigger patterns" column

    if (!memberRaw || !triggerPatterns || triggerPatterns === 'Trigger patterns') continue;

    // Extract skill name from **bold** or backtick or plain text
    const nameMatch = memberRaw.match(/\*\*([^*]+)\*\*/) || memberRaw.match(/`([^`]+)`/);
    const skillName = nameMatch ? nameMatch[1] : memberRaw.replace(/\s*\(.*\)/, '').trim();

    // Convert trigger patterns to keywords array
    const keywords = triggerPatterns
      .split(/\s*\/\s*|\s+AND\s+/)
      .map(k => k.toLowerCase().trim())
      .filter(k => k.length > 1 && !k.startsWith('per-') && !k.startsWith('weekly'));

    skills.push({ name: skillName, keywords, raw_triggers: triggerPatterns });
  }
  return skills;
}

// Match input content to best-fit skill
function findMatchingSkill(content, skills) {
  const contentLower = content.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const skill of skills) {
    let score = 0;
    const matchedKeywords = [];
    for (const kw of skill.keywords) {
      if (contentLower.includes(kw)) {
        score++;
        matchedKeywords.push(kw);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { ...skill, matchedKeywords, score };
    }
  }
  return bestMatch;
}

// Main dispatcher
export function dispatch({ content = '', route = '', source = 'unknown' }) {
  if (!existsSync(REGISTRY_PATH)) {
    return { skill: null, triggered_by: [], error: 'council-registry.md not found' };
  }

  const registryContent = readFileSync(REGISTRY_PATH, 'utf-8');
  const skills = parseSkillTriggers(registryContent);

  // If route specifies a skill directly (INVOKE:skill-name), use it
  if (route.startsWith('INVOKE:')) {
    const targetSkill = route.replace('INVOKE:', '');
    const skill = skills.find(s => s.name.toLowerCase().includes(targetSkill.toLowerCase()));
    if (skill) {
      const entry = { ts: new Date().toISOString(), route, skill: skill.name, triggered_by: [targetSkill], source, content: content.slice(0, 100) };
      try { appendFileSync(INVOCATION_LOG, JSON.stringify(entry) + '\n', 'utf-8'); } catch (e) {}
      return { skill: skill.name, triggered_by: [targetSkill] };
    }
  }

  // Otherwise, pattern-match against content
  const match = findMatchingSkill(content, skills);
  if (match && match.score > 0) {
    const entry = { ts: new Date().toISOString(), route, skill: match.name, triggered_by: match.matchedKeywords, score: match.score, source };
    try { appendFileSync(INVOCATION_LOG, JSON.stringify(entry) + '\n', 'utf-8'); } catch (e) {}
    return { skill: match.name, triggered_by: match.matchedKeywords, score: match.score };
  }

  return { skill: null, triggered_by: [], no_match: true };
}

// CLI mode
if (process.argv[1]?.endsWith('council-invocation-dispatcher.mjs')) {
  const args = Object.fromEntries(process.argv.slice(2).filter(a => a.startsWith('--')).map(a => a.slice(2).split('=')));
  const result = dispatch({ content: args.content || '', route: args.route || '', source: 'cli' });
  console.log(JSON.stringify(result, null, 2));
}
