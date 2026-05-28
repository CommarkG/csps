'use client';
import { useState } from 'react';
import type { SubCategory } from '../_data/pillars';
import { StatusBadge } from './StatusBadge';

function SubCategoryNode({ node, depth = 0 }: { node: SubCategory; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className={`${depth > 0 ? 'ml-4 border-l border-slate-100 pl-3' : ''}`}>
      <button
        onClick={() => hasChildren && setExpanded(!expanded)}
        className={`w-full flex items-start gap-2 py-2 text-left group
          ${hasChildren ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {hasChildren && (
          <span className="shrink-0 mt-0.5 text-slate-400 group-hover:text-slate-600 transition-colors">
            {expanded ? '▾' : '▸'}
          </span>
        )}
        {!hasChildren && <span className="shrink-0 mt-0.5 w-4" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-800">{node.title}</span>
            <StatusBadge status={node.status} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{node.description}</p>
        </div>
      </button>
      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <SubCategoryNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SubCategoryTree({ categories }: { categories: SubCategory[] }) {
  return (
    <div className="divide-y divide-slate-50">
      {categories.map((cat) => (
        <SubCategoryNode key={cat.id} node={cat} />
      ))}
    </div>
  );
}
