'use client';
import { useState } from 'react';
import Link from 'next/link';
import type { Pillar } from '../_data/pillars';
import { StatusBadge } from './StatusBadge';
import { AuditChecklist } from './AuditChecklist';
import { SubCategoryTree } from './SubCategoryTree';

export function PillarBlock({ pillar }: { pillar: Pillar }) {
  const [expanded, setExpanded] = useState(false);
  const answeredCount = pillar.auditQuestions.filter((q) => q.status === 'answered').length;
  const totalCount = pillar.auditQuestions.length;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-2xl shrink-0">{pillar.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-base font-semibold text-slate-900">{pillar.fullTitle}</h2>
            <StatusBadge status={pillar.status} />
            <span className="text-xs text-slate-400">
              {answeredCount}/{totalCount} audit questions answered
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">{pillar.tagline}</p>
        </div>
        <span className="shrink-0 text-slate-400 text-lg">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-6">
          <p className="text-sm text-slate-700 leading-relaxed">{pillar.description}</p>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Sub-Categories
              </h3>
              <SubCategoryTree categories={pillar.subCategories} />
            </div>
            <AuditChecklist questions={pillar.auditQuestions} />
          </div>

          {pillar.connections.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Connects To
              </h3>
              <div className="flex gap-2 flex-wrap">
                {pillar.connections.map((connId) => (
                  <Link
                    key={connId}
                    href={`/schema/${connId}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs
                      bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    {connId.replace('pillar-', 'Pillar ')} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/schema/${pillar.id}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800
              font-medium hover:underline"
          >
            View full {pillar.title} documentation →
          </Link>
        </div>
      )}
    </div>
  );
}
