#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const PAGES = {
  'apps/csps-playground/src/app/platform/ai-behavior/page.tsx': { spine: 'AI', cq: 'Before reviewing AI behavior -- are any of the 12 vault entries running at T2 level, or are all still T3-only?', inh: '§1 Behavioral Contracts', purpose: 'AI behavior governance -- shows AI Conception Vault entries and enforcement status' },
  'apps/csps-playground/src/app/platform/architecture/node-templates/page.tsx': { spine: 'ARCH', cq: 'Before creating a new artifact -- does a node template exist for this type, or is a new one needed?', inh: '§9 Creation Requirements', purpose: 'Node template reference -- canonical templates for platform artifact creation' },
  'apps/csps-playground/src/app/platform/architecture/tier-map/page.tsx': { spine: 'ARCH', cq: 'For a new capability being added -- is it in the canonical source AND registered in all 3 tiers that need it?', inh: '§5 Platform Architecture', purpose: 'Platform Architecture Map -- 3-tier capability map and completion scorecard from TIER-CONSOLIDATION.md' },
  'apps/csps-playground/src/app/platform/audits/page.tsx': { spine: 'VALD', cq: 'Before declaring a session complete -- have all registered audits for this session run with exit_code=0?', inh: '§10 Gap Recurrence Register', purpose: 'Audit dashboard -- shows all registered audit pipelines and their cadences' },
  'apps/csps-playground/src/app/platform/completion/page.tsx': { spine: 'VALD', cq: 'Does the current completion percentage reflect this session work, or is the data stale from the last pnpm verify run?', inh: '§10 Gap Recurrence Register', purpose: 'Platform completion tracker -- shows documentation-in-schema, threshold code, and other completion metrics' },
  'apps/csps-playground/src/app/platform/consult/page.tsx': { spine: 'GVRN', cq: 'Is the question being asked a guard question (verification) or a guide question (understanding) -- does it cite a specific file:line?', inh: '§2 Communication Protocol', purpose: 'Consultation interface -- structured way to ask platform architecture questions' },
  'apps/csps-playground/src/app/platform/developer-journey/page.tsx': { spine: 'OPER', cq: 'At which stage of the developer journey does the current task fall -- and is there a template for this stage?', inh: '§9 Creation Requirements', purpose: 'Developer journey map -- shows the path from new developer to platform-native development' },
  'apps/csps-playground/src/app/platform/profiles/ai-systems/page.tsx': { spine: 'AI', cq: 'Is the AI system being directed correctly identified by role and tab type before any directive is issued?', inh: '§4 Tab Transition Protocol', purpose: 'AI system profiles -- characteristics of each AI role in the platform' },
  'apps/csps-playground/src/app/platform/profiles/developers/page.tsx': { spine: 'OPER', cq: 'Does this developer profile match the person opening this session -- which communication adjustments are needed?', inh: '§9 Creation Requirements', purpose: 'Developer profile -- experience levels and what each level needs from the platform' },
  'apps/csps-playground/src/app/platform/profiles/page.tsx': { spine: 'OPER', cq: 'Which profile best describes the current session participant -- and does the communication format match that profile?', inh: '§4 Tab Transition Protocol', purpose: 'Profiles index -- all platform participant profiles' },
  'apps/csps-playground/src/app/platform/profiles/users/page.tsx': { spine: 'ARCH', cq: 'Before building user-facing vocabulary features -- has the user profile for this app been defined?', inh: '§5 Platform Architecture', purpose: 'End-user profiles -- behavioral patterns and vocabulary correction needs per user type' },
  'apps/csps-playground/src/app/platform/rzf/page.tsx': { spine: 'VALD', cq: 'Before any DONE claim -- does the ZF evidence in sonnet-turn.md name specific files in every Cycle 2+ block?', inh: '§10 Gap Recurrence Register', purpose: 'RZF dashboard -- shows ZF cycle quality and iteration history' },
  'apps/csps-playground/src/app/platform/self-validation/page.tsx': { spine: 'VALD', cq: 'Is CSPS introspective (logs K counts) or reflexive (K crossing threshold patches enforcement surface automatically)?', inh: '§10 Gap Recurrence Register', purpose: 'Platform self-validation -- 5 methodologies for platforms that validate their own governance' },
  'apps/csps-playground/src/app/platform/sia/page.tsx': { spine: 'ARCH', cq: 'Before implementing any platform feature -- does an SIA specification exist that defines its behavior, or is this wild implementation?', inh: '§5 Platform Architecture', purpose: 'SIA (System Intelligence Architecture) index -- all platform architecture specifications' },
  'apps/csps-playground/src/app/platform/sia/[slug]/page.tsx': { spine: 'ARCH', cq: 'Before implementing a specification -- has it been read fully including all FALSE ASSUMPTION sections?', inh: '§5 Platform Architecture', purpose: 'Individual SIA document viewer -- renders a specific architecture specification' },
  'apps/csps-playground/src/app/platform/simulation/page.tsx': { spine: 'VALD', cq: 'Before opening a new Opus or Sonnet tab -- do all 5 new-tab simulation checks pass?', inh: '§10 Gap Recurrence Register', purpose: 'Platform simulation hub -- live gap register, new tab simulation, behavioral inheritance progress' },
};

let updated = 0;
for (const [page, d] of Object.entries(PAGES)) {
  if (!existsSync(page)) continue;
  let content = readFileSync(page, 'utf8');

  // Remove any existing pageDNA block
  // Match both 'export const pageDNA' and 'const pageDNA'
  const dnaStart = content.search(/(?:export\s+)?const\s+pageDNA/);
  if (dnaStart !== -1) {
    const blockStart = content.indexOf('{', dnaStart);
    let depth = 0, blockEnd = blockStart;
    for (let i = blockStart; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') { depth--; if (depth === 0) { blockEnd = i + 1; break; } }
    }
    content = content.slice(0, dnaStart) + content.slice(blockEnd).replace(/^\n+/, '\n');
  }

  // Create clean pageDNA using JSON.stringify for safe quoting
  // Note: 'const' not 'export const' — Next.js App Router does not allow arbitrary named exports from page files
  const dna = `const pageDNA = {\n  spine: ${JSON.stringify(d.spine)},\n  audience: "developer",\n  purpose: ${JSON.stringify(d.purpose)},\n  inheritsFrom: [${JSON.stringify('Platform Genome ' + d.inh)}],\n  contextQuestion: ${JSON.stringify(d.cq)},\n  cspsApproved: false,\n  dnaVersion: "S054",\n}\n\n`;

  // Place 'use client' first if present
  let final;
  if (content.trimStart().startsWith("'use client'")) {
    const ci = content.indexOf("'use client'");
    const clientEnd = ci + "'use client'".length;
    final = content.slice(0, clientEnd) + '\n\n' + dna + content.slice(clientEnd).replace(/^\n+/, '');
  } else {
    final = dna + content.replace(/^\n+/, '');
  }

  writeFileSync(page, final, 'utf8');
  console.log('Updated:', page.split('/platform/')[1]);
  updated++;
}
console.log('Total updated:', updated);
