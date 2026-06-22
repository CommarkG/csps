/**
 * page-scaffold-default.tsx — B_PAGE_COMPLETE canonical scaffold
 * @csps-id csps.tools.templates.page-scaffold-default
 * @csps-version 1.0.0
 * @csps-owner group:finky
 * @csps-lifecycle production
 * @csps-lifecycle-state active
 * @csps-enforces B_PAGE_COMPLETE PROTO-S087-PAGE-COMPLETE
 *
 * DEFAULT SCAFFOLD for new CSPS platform pages.
 * Pattern: Server Component (auth/config) + Client Component (interactive) + api-per-feature + useData hook.
 *
 * USAGE:
 *   1. Copy to: apps/csps-playground/src/app/platform/[your-page]/page.tsx
 *   2. Create client component: [your-page]/[YourPage]Client.tsx
 *   3. Create API route: apps/csps-playground/src/app/api/[your-feature]/route.ts
 *   4. Register in route-manifest.ts (BLOCKING if not registered)
 *   5. Add to TopNav.tsx NAV_ITEMS if nav_access='public'
 *
 * B_PAGE_COMPLETE checklist (validate before commit):
 *   ✓ Route registered in route-manifest.ts (nav_access + nav_group set)
 *   ✓ All fetch calls use useData() or have full resilience pattern
 *   ✓ All internal hrefs resolve to existing pages
 *   ✓ All interactive elements wired (no onClick={undefined}, no dead hrefs)
 *   ✓ Page has loading/error/empty states for all data-fetch paths
 */

// ══════════════════════════════════════════════════════════════════════════════
// SERVER COMPONENT (page.tsx) — no 'use client'
// Handles: static config, server-side checks, passes data down to Client
// ══════════════════════════════════════════════════════════════════════════════

const PAGE_DNA = {
  id: 'platform-[feature]',      // ← replace
  spine: 'GVRN',                  // ← set correct spine: GVRN|ARCH|AI|OPER|VALD
  audience: 'developer',
  purpose: '[What this page does and why it exists]',  // ← fill in
  contextQuestion: '[What question should the user be asking before visiting this page?]',
  dnaVersion: 'S087',
};
void PAGE_DNA; // suppress unused warning until referenced

import { FeaturePageClient } from './FeaturePageClient';

// Optional: pass server-side config/flags to client
const SERVER_CONFIG = {
  featureFlag: process.env.FEATURE_FLAG === 'true',
  // Add any server-side config here
};

export default function FeaturePage() {
  return <FeaturePageClient config={SERVER_CONFIG} />;
}

// ══════════════════════════════════════════════════════════════════════════════
// CLIENT COMPONENT ([YourPage]Client.tsx) — paste into FeaturePageClient.tsx
// ══════════════════════════════════════════════════════════════════════════════
/*
'use client'

import { useData } from '@/hooks/useData'

interface FeatureData {
  // ← define your API response shape
  items: Array<{ id: string; title: string }>
  total: number
}

interface Config {
  featureFlag: boolean
}

export function FeaturePageClient({ config }: { config: Config }) {
  // ── Step 1: canonical fetch — loading/error/empty built in ─────────────────
  const { data, loading, error, reload } = useData<FeatureData>('/api/[your-feature]')

  // ── Step 2: loading state ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
        Loading…
      </div>
    )
  }

  // ── Step 3: error state ────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <div style={{ color: '#ef4444', marginBottom: 12 }}>Error: {error}</div>
        <button
          onClick={reload}
          style={{ padding: '8px 16px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 4, cursor: 'pointer' }}
        >
          Retry
        </button>
      </div>
    )
  }

  // ── Step 4: empty state ────────────────────────────────────────────────────
  if (!data || data.total === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
        No items yet. [Explain what to do to add the first item.]
      </div>
    )
  }

  // ── Step 5: loaded state ───────────────────────────────────────────────────
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Feature Title</h1>
        <button
          onClick={reload}
          style={{ padding: '6px 12px', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
        >
          ↻ Refresh
        </button>
      </div>

      {data.items.map(item => (
        <div key={item.id} style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 6, marginBottom: 8 }}>
          {item.title}
        </div>
      ))}
    </div>
  )
}
*/

// ══════════════════════════════════════════════════════════════════════════════
// API ROUTE (api/[your-feature]/route.ts)
// ══════════════════════════════════════════════════════════════════════════════
/*
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // ← your data fetching logic here
    const items = [{ id: '1', title: 'Example item' }]
    return NextResponse.json({ items, total: items.length })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    )
  }
}
*/

// ══════════════════════════════════════════════════════════════════════════════
// ROUTE MANIFEST ENTRY (add to apps/csps-playground/src/config/route-manifest.ts)
// ══════════════════════════════════════════════════════════════════════════════
/*
  {
    path: '/platform/[your-feature]',
    title: '[Feature Name]',
    nav_group: 'Platform',          // ← Platform|Architecture|Journeys|Create|Docs|null
    nav_access: 'public',           // ← 'public'|'internal'|'dynamic'
    description: '[One-line description]',
    since: 'S087',
  },
*/

// ══════════════════════════════════════════════════════════════════════════════
// TOPNAV ENTRY (add to apps/csps-playground/src/components/TopNav.tsx NAV_ITEMS)
// Only needed if nav_access='public'
// ══════════════════════════════════════════════════════════════════════════════
/*
  // In the appropriate group's children array:
  { label: '[Feature Name]', href: '/platform/[your-feature]' },
*/
