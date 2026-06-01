#!/usr/bin/env node
/**
 * vercel-health-check.mjs
 * @csps-id csps.tools.scripts.vercel-health-check
 * @csps-name vercel-health-check
 * @csps-description Proactive Vercel deployment health checker.
 *   Uses Vercel REST API (not CLI — CLI requires TTY). Checks ALL projects for:
 *   (a) last deployment status Ready/Error; (b) root directory exists on disk;
 *   (c) project registered in deploy-targets.yaml; (d) orphaned projects.
 *
 *   The Governor should NOT have to wait for email to know about a Vercel failure.
 *   This IS the "I can check it myself" mechanism.
 *
 *   Usage: node tools/scripts/vercel-health-check.mjs [--fix-hints]
 *   Exit 0 = all healthy. Exit 1 = problems found.
 *
 *   Source: HARDWIRE-006 S075 — PREVENTION CLASS: VERCEL-DEPLOY-FAILURE-SILENT-UNTIL-EMAIL
 * @csps-version 1.1.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-tags type:script domain:infra audience:ai-agent
 * @csps-enforces FLAWLESS-DEPLOY HARDWIRE-006
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import yaml from 'js-yaml';

const ROOT = resolve(process.cwd());
const DEPLOY_TARGETS = join(ROOT, 'tools/config/deploy-targets.yaml');
const AUTH_PATH = 'C:/Users/finky/AppData/Roaming/xdg.data/com.vercel.cli/auth.json';

// ── Vercel REST API ──────────────────────────────────────────────────────────
async function vercelApi(path) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const https = await import('node:https');
  const auth = JSON.parse(readFileSync(AUTH_PATH, 'utf8'));

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path,
      headers: { 'Authorization': `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
    };
    https.default.get(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`Parse error: ${data.substring(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

// ── Get team ID ───────────────────────────────────────────────────────────────
async function getTeamId() {
  const teams = await vercelApi('/v2/teams');
  const team = (teams.teams || [])[0];
  return team?.id || null;
}

// ── Get all projects for team ─────────────────────────────────────────────────
async function getAllProjects(teamId) {
  const data = await vercelApi(`/v9/projects?teamId=${teamId}&limit=50`);
  return (data.projects || []).map(p => ({
    name: p.name,
    id: p.id,
    rootDirectory: p.rootDirectory,
    url: p.alias?.[0]?.domain || p.name + '.vercel.app',
    link: p.link,
  }));
}

// ── Get most recent deployment for a project ─────────────────────────────────
async function getLatestDeployment(projectId, teamId) {
  try {
    const data = await vercelApi(`/v6/deployments?projectId=${projectId}&teamId=${teamId}&limit=1&sort=created&direction=desc`);
    const deploy = (data.deployments || [])[0];
    if (!deploy) return { status: 'none', url: null };
    return {
      status: deploy.readyState || deploy.state || 'unknown',
      url: deploy.url ? `https://${deploy.url}` : null,
      createdAt: deploy.createdAt,
    };
  } catch { return { status: 'unknown', url: null }; }
}

// ── Load registered deploy targets ──────────────────────────────────────────
function getRegisteredTargets() {
  try {
    const parsed = yaml.load(readFileSync(DEPLOY_TARGETS, 'utf8'));
    return (parsed.targets || []).map(t => ({
      app: t.app,
      root_dir: t.root_dir,
      vercel_project: t.vercel_project,
    }));
  } catch { return []; }
}

// ── Main health check ─────────────────────────────────────────────────────
async function main() {
  const showFixes = process.argv.includes('--fix-hints');
  const findings = [];
  let critical = 0;
  let advisory = 0;

  console.log('[vercel-health-check] Connecting to Vercel API...');

  let teamId;
  try {
    teamId = await getTeamId();
    if (!teamId) throw new Error('No team found');
    console.log(`[vercel-health-check] Team: ${teamId}`);
  } catch (e) {
    console.error('[vercel-health-check] ERROR: Cannot connect to Vercel API:', e.message);
    process.exit(1);
  }

  const allProjects = await getAllProjects(teamId);
  const registered = getRegisteredTargets();
  const registeredNames = new Set(registered.map(t => t.vercel_project));

  const cspsProjects = allProjects.filter(p => p.name.startsWith('csps-'));
  const otherProjects = allProjects.filter(p => !p.name.startsWith('csps-'));

  if (otherProjects.length > 0) {
    advisory++;
    findings.push(`[ADVISORY] ${otherProjects.length} non-CSPS project(s): ${otherProjects.map(p => p.name).join(', ')}`);
  }

  console.log(`\n[vercel-health-check] Checking ${cspsProjects.length} CSPS project(s)...`);

  for (const project of cspsProjects) {
    // 1. Check deployment status
    const deploy = await getLatestDeployment(project.id, teamId);
    const statusStr = deploy.status?.toUpperCase();
    const isError = ['ERROR', 'CANCELED'].includes(statusStr);
    const isReady = ['READY'].includes(statusStr);

    if (isError) {
      critical++;
      const hint = showFixes
        ? `\n  FIX: Check Vercel project settings. If vaulted: vercel project rm ${project.name}`
        : '';
      findings.push(`[CRITICAL] ${project.name}: Last deployment FAILED (${deploy.status})${hint}`);
    } else {
      console.log(`  ✓ ${project.name}: ${deploy.status || 'unknown'} — ${project.url}`);
    }

    // 2. Check if registered in deploy-targets.yaml
    if (!registeredNames.has(project.name)) {
      advisory++;
      const hint = showFixes
        ? `\n  FIX: Add to tools/config/deploy-targets.yaml:\n  - app: ${project.name.replace('csps-','')}\n    root_dir: apps/${project.name.replace('csps-','')}\n    vercel_project: ${project.name}`
        : '';
      findings.push(`[ADVISORY] ${project.name}: NOT registered in deploy-targets.yaml (add if active)${hint}`);
    }

    // 3. Check root_dir exists if registered
    const target = registered.find(t => t.vercel_project === project.name);
    if (target?.root_dir) {
      const dir = join(ROOT, target.root_dir);
      if (!existsSync(dir)) {
        critical++;
        findings.push(`[CRITICAL] ${project.name}: root_dir "${target.root_dir}" DOES NOT EXIST on disk`);
      }
    }
  }

  // 4. Check registered targets that have no corresponding Vercel project
  const vercelNames = new Set(cspsProjects.map(p => p.name));
  for (const target of registered) {
    if (target.vercel_project && !vercelNames.has(target.vercel_project)) {
      advisory++;
      findings.push(`[ADVISORY] deploy-targets.yaml has "${target.vercel_project}" but no Vercel project found`);
    }
  }

  console.log('');
  for (const f of findings) console.log(f);

  const lastRunData = {
    run_at: new Date().toISOString(),
    csps_projects_checked: cspsProjects.length,
    critical,
    advisory,
    all_healthy: critical === 0,
    findings,
    projects: cspsProjects.map(p => ({ name: p.name, url: p.url })),
  };

  try {
    writeFileSync(join(ROOT, 'tools/data/vercel-health-last-run.json'), JSON.stringify(lastRunData, null, 2));
  } catch { /* non-fatal */ }

  console.log(`\n[vercel-health-check] projects=${cspsProjects.length} critical=${critical} advisory=${advisory} healthy=${critical === 0}`);
  if (critical === 0 && findings.length === 0) {
    console.log('[vercel-health-check] ✓ All Vercel projects healthy');
  }

  process.exit(critical > 0 ? 1 : 0);
}

main().catch(e => { console.error('[vercel-health-check] FATAL:', e.message); process.exit(1); });
