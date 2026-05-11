import type { AuditQuestion } from '../_data/pillars';

const PRIORITY_ICON: Record<string, string> = {
  critical:  '🔴',
  important: '🟡',
  advisory:  '🔵',
};

const STATUS_ICON: Record<string, string> = {
  answered: '✅',
  pending:  '⏳',
  blocked:  '❌',
};

export function AuditChecklist({ questions }: { questions: AuditQuestion[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
        Audit Questions
      </h3>
      <ul className="space-y-2">
        {questions.map((q) => (
          <li key={q.id} className="flex items-start gap-3 text-sm">
            <span className="shrink-0 mt-0.5">{STATUS_ICON[q.status]}</span>
            <span className="flex-1 text-slate-700">{q.question}</span>
            <span className="shrink-0">{PRIORITY_ICON[q.priority]}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-slate-400 pt-1">🔴 Critical · 🟡 Important · 🔵 Advisory</p>
    </div>
  );
}
